package com.famoney.api.expense.controller;

import com.famoney.api.common.security.CustomUserDetails;
import com.famoney.api.expense.dto.*;
import com.famoney.api.expense.service.ExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * REST Controller for expense endpoints.
 */
@RestController
@RequestMapping("/api/v1/ledgers/{ledgerId}/expenses")
@RequiredArgsConstructor
@Tag(name = "Expenses", description = "Expense management API")
@SecurityRequirement(name = "bearerAuth")
public class ExpenseController {

    private final ExpenseService expenseService;

    /**
     * Get expenses with filters and pagination.
     */
    @GetMapping
    @Operation(summary = "지출 목록 조회", description = "원장의 지출 목록을 조회합니다. 필터와 페이지네이션을 지원합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음")
    })
    public ResponseEntity<ExpenseListResponse> getExpenses(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String ledgerId,
            @Parameter(description = "시작 날짜 (YYYY-MM-DD)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "종료 날짜 (YYYY-MM-DD)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @Parameter(description = "카테고리 ID")
            @RequestParam(required = false) String categoryId,
            @PageableDefault(size = 20, sort = "expenseDate", direction = Sort.Direction.DESC) Pageable pageable) {

        ExpenseListResponse response = expenseService.getExpenses(
                userDetails.getId(), ledgerId, startDate, endDate, categoryId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get a single expense.
     */
    @GetMapping("/{expenseId}")
    @Operation(summary = "지출 상세 조회", description = "특정 지출의 상세 정보를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음"),
            @ApiResponse(responseCode = "404", description = "지출을 찾을 수 없음")
    })
    public ResponseEntity<ExpenseResponse> getExpense(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String ledgerId,
            @PathVariable String expenseId) {

        ExpenseResponse response = expenseService.getExpense(userDetails.getId(), ledgerId, expenseId);
        return ResponseEntity.ok(response);
    }

    /**
     * Create a new expense.
     */
    @PostMapping
    @Operation(summary = "지출 생성", description = "새로운 지출을 생성합니다. VIEWER는 생성할 수 없습니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "생성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음")
    })
    public ResponseEntity<ExpenseResponse> createExpense(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String ledgerId,
            @Valid @RequestBody CreateExpenseRequest request) {

        ExpenseResponse response = expenseService.createExpense(userDetails.getId(), ledgerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update an expense.
     */
    @PatchMapping("/{expenseId}")
    @Operation(summary = "지출 수정", description = "지출을 수정합니다. 본인의 지출 또는 ADMIN+ 권한이 필요합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "수정 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음"),
            @ApiResponse(responseCode = "404", description = "지출을 찾을 수 없음")
    })
    public ResponseEntity<ExpenseResponse> updateExpense(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String ledgerId,
            @PathVariable String expenseId,
            @Valid @RequestBody UpdateExpenseRequest request) {

        ExpenseResponse response = expenseService.updateExpense(
                userDetails.getId(), ledgerId, expenseId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete an expense (soft delete).
     */
    @DeleteMapping("/{expenseId}")
    @Operation(summary = "지출 삭제", description = "지출을 삭제합니다. 본인의 지출 또는 ADMIN+ 권한이 필요합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "삭제 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음"),
            @ApiResponse(responseCode = "404", description = "지출을 찾을 수 없음")
    })
    public ResponseEntity<Void> deleteExpense(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String ledgerId,
            @PathVariable String expenseId) {

        expenseService.deleteExpense(userDetails.getId(), ledgerId, expenseId);
        return ResponseEntity.noContent().build();
    }
}
