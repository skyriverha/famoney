package com.famoney.api.ledger.service;

import com.famoney.api.common.exception.ForbiddenException;
import com.famoney.api.common.exception.ResourceNotFoundException;
import com.famoney.api.ledger.dto.CreateLedgerRequest;
import com.famoney.api.ledger.dto.LedgerResponse;
import com.famoney.api.ledger.dto.UpdateLedgerRequest;
import com.famoney.api.ledger.entity.Ledger;
import com.famoney.api.ledger.repository.LedgerRepository;
import com.famoney.api.member.entity.Member;
import com.famoney.api.member.entity.MemberRole;
import com.famoney.api.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for ledger operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class LedgerService {

    private final LedgerRepository ledgerRepository;
    private final MemberRepository memberRepository;

    /**
     * Create a new ledger.
     * The creator is automatically added as OWNER.
     */
    @Transactional
    public LedgerResponse createLedger(String userId, CreateLedgerRequest request) {
        log.info("Creating ledger for user: {}", userId);

        // Create ledger
        Ledger ledger = Ledger.builder()
                .name(request.getName())
                .description(request.getDescription())
                .currency(request.getCurrency() != null ? request.getCurrency() : "KRW")
                .createdBy(userId)
                .build();
        ledger = ledgerRepository.save(ledger);

        // Add creator as OWNER
        Member ownerMember = Member.builder()
                .userId(userId)
                .ledgerId(ledger.getId())
                .role(MemberRole.OWNER)
                .build();
        memberRepository.save(ownerMember);

        log.info("Created ledger: {} with owner: {}", ledger.getId(), userId);
        return LedgerResponse.from(ledger, 1, MemberRole.OWNER);
    }

    /**
     * Get all ledgers where the user is a member.
     */
    public List<LedgerResponse> getMyLedgers(String userId) {
        log.debug("Getting ledgers for user: {}", userId);

        List<String> ledgerIds = memberRepository.findLedgerIdsByUserId(userId);

        return ledgerIds.stream()
                .map(ledgerId -> {
                    Ledger ledger = ledgerRepository.findByIdAndDeletedAtIsNull(ledgerId)
                            .orElse(null);
                    if (ledger == null) return null;

                    Member member = memberRepository.findByUserIdAndLedgerId(userId, ledgerId)
                            .orElse(null);
                    if (member == null) return null;

                    int memberCount = (int) memberRepository.countByLedgerId(ledgerId);
                    return LedgerResponse.from(ledger, memberCount, member.getRole());
                })
                .filter(response -> response != null)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific ledger by ID.
     * Only members can access the ledger.
     */
    public LedgerResponse getLedger(String userId, String ledgerId) {
        log.debug("Getting ledger: {} for user: {}", ledgerId, userId);

        Ledger ledger = ledgerRepository.findByIdAndDeletedAtIsNull(ledgerId)
                .orElseThrow(() -> new ResourceNotFoundException("Ledger", "id", ledgerId));

        Member member = memberRepository.findByUserIdAndLedgerId(userId, ledgerId)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this ledger"));

        int memberCount = (int) memberRepository.countByLedgerId(ledgerId);
        return LedgerResponse.from(ledger, memberCount, member.getRole());
    }

    /**
     * Update a ledger.
     * Only OWNER and ADMIN can update.
     */
    @Transactional
    public LedgerResponse updateLedger(String userId, String ledgerId, UpdateLedgerRequest request) {
        log.info("Updating ledger: {} by user: {}", ledgerId, userId);

        Ledger ledger = ledgerRepository.findByIdAndDeletedAtIsNull(ledgerId)
                .orElseThrow(() -> new ResourceNotFoundException("Ledger", "id", ledgerId));

        Member member = memberRepository.findByUserIdAndLedgerId(userId, ledgerId)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this ledger"));

        if (!member.canModifyLedger()) {
            throw new ForbiddenException("Only OWNER and ADMIN can modify the ledger");
        }

        // Partial update
        if (request.getName() != null) {
            ledger.setName(request.getName());
        }
        if (request.getDescription() != null) {
            ledger.setDescription(request.getDescription());
        }

        ledger = ledgerRepository.save(ledger);
        int memberCount = (int) memberRepository.countByLedgerId(ledgerId);

        log.info("Updated ledger: {}", ledgerId);
        return LedgerResponse.from(ledger, memberCount, member.getRole());
    }

    /**
     * Delete a ledger (soft delete).
     * Only OWNER can delete.
     */
    @Transactional
    public void deleteLedger(String userId, String ledgerId) {
        log.info("Deleting ledger: {} by user: {}", ledgerId, userId);

        Ledger ledger = ledgerRepository.findByIdAndDeletedAtIsNull(ledgerId)
                .orElseThrow(() -> new ResourceNotFoundException("Ledger", "id", ledgerId));

        Member member = memberRepository.findByUserIdAndLedgerId(userId, ledgerId)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this ledger"));

        if (!member.isOwner()) {
            throw new ForbiddenException("Only OWNER can delete the ledger");
        }

        ledger.softDelete();
        ledgerRepository.save(ledger);

        log.info("Deleted ledger: {}", ledgerId);
    }
}
