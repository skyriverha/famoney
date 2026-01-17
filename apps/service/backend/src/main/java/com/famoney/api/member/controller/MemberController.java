package com.famoney.api.member.controller;

import com.famoney.api.common.security.CustomUserDetails;
import com.famoney.api.member.dto.InviteMemberRequest;
import com.famoney.api.member.dto.MemberResponse;
import com.famoney.api.member.dto.UpdateMemberRoleRequest;
import com.famoney.api.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for member endpoints.
 */
@RestController
@RequestMapping("/api/v1/ledgers/{ledgerId}/members")
@RequiredArgsConstructor
@Tag(name = "Members", description = "Ledger member management API")
@SecurityRequirement(name = "bearerAuth")
public class MemberController {

    private final MemberService memberService;

    /**
     * Get all members of a ledger.
     */
    @GetMapping
    @Operation(summary = "멤버 목록 조회", description = "원장의 모든 멤버를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음"),
            @ApiResponse(responseCode = "404", description = "원장을 찾을 수 없음")
    })
    public ResponseEntity<List<MemberResponse>> getMembers(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String ledgerId) {
        List<MemberResponse> responses = memberService.getMembers(userDetails.getId(), ledgerId);
        return ResponseEntity.ok(responses);
    }

    /**
     * Add a member to a ledger.
     */
    @PostMapping("/invite")
    @Operation(summary = "멤버 초대", description = "원장에 새 멤버를 추가합니다. OWNER 또는 ADMIN만 가능합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "초대 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음"),
            @ApiResponse(responseCode = "404", description = "원장 또는 사용자를 찾을 수 없음")
    })
    public ResponseEntity<MemberResponse> addMember(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String ledgerId,
            @Valid @RequestBody InviteMemberRequest request) {
        MemberResponse response = memberService.addMember(userDetails.getId(), ledgerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update a member's role.
     */
    @PatchMapping("/{memberId}")
    @Operation(summary = "멤버 역할 변경", description = "멤버의 역할을 변경합니다. OWNER만 가능합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "변경 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음"),
            @ApiResponse(responseCode = "404", description = "원장 또는 멤버를 찾을 수 없음")
    })
    public ResponseEntity<MemberResponse> updateMemberRole(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String ledgerId,
            @PathVariable String memberId,
            @Valid @RequestBody UpdateMemberRoleRequest request) {
        MemberResponse response = memberService.updateMemberRole(userDetails.getId(), ledgerId, memberId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Remove a member from a ledger.
     */
    @DeleteMapping("/{memberId}")
    @Operation(summary = "멤버 제거", description = "멤버를 원장에서 제거합니다. OWNER/ADMIN이 제거하거나, 본인이 탈퇴할 수 있습니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "제거 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (OWNER는 제거 불가)"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음"),
            @ApiResponse(responseCode = "404", description = "원장 또는 멤버를 찾을 수 없음")
    })
    public ResponseEntity<Void> removeMember(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String ledgerId,
            @PathVariable String memberId) {
        memberService.removeMember(userDetails.getId(), ledgerId, memberId);
        return ResponseEntity.noContent().build();
    }
}
