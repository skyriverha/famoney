package com.famoney.api.category.controller;

import com.famoney.api.category.dto.CategoryResponse;
import com.famoney.api.category.dto.CreateCategoryRequest;
import com.famoney.api.category.service.CategoryService;
import com.famoney.api.common.security.CustomUserDetails;
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
 * REST Controller for category endpoints.
 */
@RestController
@RequestMapping("/api/v1/ledgers/{ledgerId}/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Category management API")
@SecurityRequirement(name = "bearerAuth")
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * Get all categories for a ledger.
     */
    @GetMapping
    @Operation(summary = "카테고리 목록 조회", description = "원장에서 사용 가능한 모든 카테고리를 조회합니다. (기본 + 커스텀)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음")
    })
    public ResponseEntity<List<CategoryResponse>> getCategories(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String ledgerId) {
        List<CategoryResponse> categories = categoryService.getCategories(userDetails.getId(), ledgerId);
        return ResponseEntity.ok(categories);
    }

    /**
     * Create a custom category.
     */
    @PostMapping
    @Operation(summary = "커스텀 카테고리 생성", description = "원장에 커스텀 카테고리를 생성합니다. OWNER 또는 ADMIN만 가능합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "생성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음")
    })
    public ResponseEntity<CategoryResponse> createCategory(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String ledgerId,
            @Valid @RequestBody CreateCategoryRequest request) {
        CategoryResponse response = categoryService.createCategory(userDetails.getId(), ledgerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Delete a custom category.
     */
    @DeleteMapping("/{categoryId}")
    @Operation(summary = "커스텀 카테고리 삭제", description = "커스텀 카테고리를 삭제합니다. 기본 카테고리는 삭제할 수 없습니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "삭제 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (기본 카테고리 또는 사용 중인 카테고리)"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음"),
            @ApiResponse(responseCode = "404", description = "카테고리를 찾을 수 없음")
    })
    public ResponseEntity<Void> deleteCategory(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String ledgerId,
            @PathVariable String categoryId) {
        categoryService.deleteCategory(userDetails.getId(), ledgerId, categoryId);
        return ResponseEntity.noContent().build();
    }
}
