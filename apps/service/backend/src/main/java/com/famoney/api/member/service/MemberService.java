package com.famoney.api.member.service;

import com.famoney.api.common.exception.BadRequestException;
import com.famoney.api.common.exception.ForbiddenException;
import com.famoney.api.common.exception.ResourceNotFoundException;
import com.famoney.api.ledger.entity.Ledger;
import com.famoney.api.ledger.repository.LedgerRepository;
import com.famoney.api.member.dto.InviteMemberRequest;
import com.famoney.api.member.dto.MemberResponse;
import com.famoney.api.member.dto.UpdateMemberRoleRequest;
import com.famoney.api.member.entity.Member;
import com.famoney.api.member.entity.MemberRole;
import com.famoney.api.member.repository.MemberRepository;
import com.famoney.api.user.entity.User;
import com.famoney.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Service for member operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final LedgerRepository ledgerRepository;
    private final UserRepository userRepository;

    /**
     * Get all members of a ledger.
     */
    public List<MemberResponse> getMembers(String userId, String ledgerId) {
        log.debug("Getting members for ledger: {} by user: {}", ledgerId, userId);

        // Verify ledger exists
        verifyLedgerExists(ledgerId);

        // Verify requester is a member
        verifyMembership(userId, ledgerId);

        List<Member> members = memberRepository.findByLedgerId(ledgerId);

        // Get all users for the members
        List<String> userIds = members.stream()
                .map(Member::getUserId)
                .collect(Collectors.toList());
        Map<String, User> usersById = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        return members.stream()
                .map(member -> {
                    User user = usersById.get(member.getUserId());
                    return MemberResponse.from(member, user);
                })
                .collect(Collectors.toList());
    }

    /**
     * Add a member to a ledger by email.
     * Only OWNER and ADMIN can add members.
     */
    @Transactional
    public MemberResponse addMember(String requesterId, String ledgerId, InviteMemberRequest request) {
        log.info("Adding member {} to ledger: {} by user: {}", request.getEmail(), ledgerId, requesterId);

        // Verify ledger exists
        verifyLedgerExists(ledgerId);

        // Verify requester has permission
        Member requester = memberRepository.findByUserIdAndLedgerId(requesterId, ledgerId)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this ledger"));

        if (!requester.canManageMembers()) {
            throw new ForbiddenException("Only OWNER and ADMIN can add members");
        }

        // Cannot add as OWNER (only one OWNER allowed)
        if (request.getRole() == MemberRole.OWNER) {
            throw new BadRequestException("Cannot add member as OWNER");
        }

        // Find user by email
        User invitedUser = userRepository.findByEmailIgnoreCaseAndDeletedAtIsNull(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User with email " + request.getEmail() + " not found"));

        // Check if already a member
        if (memberRepository.existsByUserIdAndLedgerId(invitedUser.getId(), ledgerId)) {
            throw new BadRequestException("User is already a member of this ledger");
        }

        // Create member
        Member member = Member.builder()
                .userId(invitedUser.getId())
                .ledgerId(ledgerId)
                .role(request.getRole())
                .invitedBy(requesterId)
                .build();
        member = memberRepository.save(member);

        log.info("Added member {} to ledger: {}", invitedUser.getId(), ledgerId);
        return MemberResponse.from(member, invitedUser);
    }

    /**
     * Update a member's role.
     * Only OWNER can change roles.
     */
    @Transactional
    public MemberResponse updateMemberRole(String requesterId, String ledgerId, String memberId, UpdateMemberRoleRequest request) {
        log.info("Updating role for member: {} in ledger: {} by user: {}", memberId, ledgerId, requesterId);

        // Verify ledger exists
        verifyLedgerExists(ledgerId);

        // Verify requester is OWNER
        Member requester = memberRepository.findByUserIdAndLedgerId(requesterId, ledgerId)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this ledger"));

        if (!requester.isOwner()) {
            throw new ForbiddenException("Only OWNER can change member roles");
        }

        // Find target member
        Member targetMember = memberRepository.findById(memberId)
                .filter(m -> m.getLedgerId().equals(ledgerId))
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", memberId));

        // Cannot change OWNER's role
        if (targetMember.isOwner()) {
            throw new BadRequestException("Cannot change OWNER's role");
        }

        // Cannot make someone OWNER (transfer ownership not supported in MVP)
        if (request.getRole() == MemberRole.OWNER) {
            throw new BadRequestException("Cannot assign OWNER role");
        }

        // Update role
        final String targetUserId = targetMember.getUserId();
        targetMember.setRole(request.getRole());
        targetMember = memberRepository.save(targetMember);

        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", targetUserId));

        log.info("Updated role for member: {} to {}", memberId, request.getRole());
        return MemberResponse.from(targetMember, user);
    }

    /**
     * Remove a member from a ledger.
     * OWNER and ADMIN can remove members. Members can remove themselves.
     */
    @Transactional
    public void removeMember(String requesterId, String ledgerId, String memberId) {
        log.info("Removing member: {} from ledger: {} by user: {}", memberId, ledgerId, requesterId);

        // Verify ledger exists
        verifyLedgerExists(ledgerId);

        // Find target member
        Member targetMember = memberRepository.findById(memberId)
                .filter(m -> m.getLedgerId().equals(ledgerId))
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", memberId));

        // OWNER cannot be removed
        if (targetMember.isOwner()) {
            throw new BadRequestException("Cannot remove OWNER from ledger");
        }

        // Check if removing self
        boolean isSelfRemoval = targetMember.getUserId().equals(requesterId);

        if (!isSelfRemoval) {
            // Verify requester has permission to remove others
            Member requester = memberRepository.findByUserIdAndLedgerId(requesterId, ledgerId)
                    .orElseThrow(() -> new ForbiddenException("You are not a member of this ledger"));

            if (!requester.canManageMembers()) {
                throw new ForbiddenException("Only OWNER and ADMIN can remove members");
            }
        }

        memberRepository.delete(targetMember);
        log.info("Removed member: {} from ledger: {}", memberId, ledgerId);
    }

    private void verifyLedgerExists(String ledgerId) {
        ledgerRepository.findByIdAndDeletedAtIsNull(ledgerId)
                .orElseThrow(() -> new ResourceNotFoundException("Ledger", "id", ledgerId));
    }

    private void verifyMembership(String userId, String ledgerId) {
        if (!memberRepository.existsByUserIdAndLedgerId(userId, ledgerId)) {
            throw new ForbiddenException("You are not a member of this ledger");
        }
    }
}
