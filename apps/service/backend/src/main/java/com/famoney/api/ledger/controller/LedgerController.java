package com.famoney.api.ledger.controller;

import com.famoney.api.common.security.CustomUserDetails;
import com.famoney.api.ledger.dto.CreateLedgerRequest;
import com.famoney.api.ledger.dto.LedgerResponse;
import com.famoney.api.ledger.dto.UpdateLedgerRequest;
import com.famoney.api.ledger.service.LedgerService;
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
 * REST Controller for ledger endpoints.
 */
@RestController
@RequestMapping("/api/v1/ledgers")
@RequiredArgsConstructor
@Tag(name = "Ledgers", description = "Ledger management API")
@SecurityRequirement(name = "bearerAuth")
public class LedgerController {

    private final LedgerService ledgerService;

    /**
     * Create a new ledger.
     */
    @PostMapping
    @Operation(summary = "원장 생성", description = "새로운 원장을 생성합니다. 생성자는 자동으로 OWNER가 됩니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "생성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 필요")
    })
    public ResponseEntity<LedgerResponse> createLedger(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateLedgerRequest request) {
        LedgerResponse response = ledgerService.createLedger(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all ledgers where current user is a member.
     */
    @GetMapping
    @Operation(summary = "내 원장 목록 조회", description = "현재 사용자가 멤버로 참여 중인 원장 목록을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요")
    })
    public ResponseEntity<List<LedgerResponse>> getMyLedgers(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<LedgerResponse> responses = ledgerService.getMyLedgers(userDetails.getId());
        return ResponseEntity.ok(responses);
    }

    /**
     * Get a specific ledger by ID.
     */
    @GetMapping("/{ledgerId}")
    @Operation(summary = "원장 상세 조회", description = "특정 원장의 상세 정보를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음"),
            @ApiResponse(responseCode = "404", description = "원장을 찾을 수 없음")
    })
    public ResponseEntity<LedgerResponse> getLedger(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String ledgerId) {
        LedgerResponse response = ledgerService.getLedger(userDetails.getId(), ledgerId);
        return ResponseEntity.ok(response);
    }

    /**
     * Update a ledger.
     */
    @PatchMapping("/{ledgerId}")
    @Operation(summary = "원장 수정", description = "원장 정보를 수정합니다. OWNER 또는 ADMIN만 가능합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "수정 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음"),
            @ApiResponse(responseCode = "404", description = "원장을 찾을 수 없음")
    })
    public ResponseEntity<LedgerResponse> updateLedger(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String ledgerId,
            @Valid @RequestBody UpdateLedgerRequest request) {
        LedgerResponse response = ledgerService.updateLedger(userDetails.getId(), ledgerId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a ledger (soft delete).
     */
    @DeleteMapping("/{ledgerId}")
    @Operation(summary = "원장 삭제", description = "원장을 삭제합니다. OWNER만 가능합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "삭제 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음"),
            @ApiResponse(responseCode = "404", description = "원장을 찾을 수 없음")
    })
    public ResponseEntity<Void> deleteLedger(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String ledgerId) {
        ledgerService.deleteLedger(userDetails.getId(), ledgerId);
        return ResponseEntity.noContent().build();
    }
}
