package com.famoney.api.expense.dto;

import com.famoney.api.category.dto.CategoryResponse;
import com.famoney.api.category.entity.Category;
import com.famoney.api.expense.entity.Expense;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response DTO for expense data.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseResponse {

    private String id;
    private String ledgerId;
    private BigDecimal amount;
    private String description;
    private LocalDate expenseDate;
    private String paymentMethod;
    private CategoryResponse category;
    private CreatedByUser createdByUser;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Nested class for created by user info.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreatedByUser {
        private String id;
        private String displayName;
        private String profileImage;
    }

    /**
     * Create response from entity with category and user info.
     */
    public static ExpenseResponse from(Expense expense, Category category,
                                        String userName, String userProfileImage) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .ledgerId(expense.getLedgerId())
                .amount(expense.getAmount())
                .description(expense.getDescription())
                .expenseDate(expense.getExpenseDate())
                .paymentMethod(expense.getPaymentMethod())
                .category(category != null ? CategoryResponse.from(category) : null)
                .createdByUser(CreatedByUser.builder()
                        .id(expense.getCreatedBy())
                        .displayName(userName)
                        .profileImage(userProfileImage)
                        .build())
                .createdAt(expense.getCreatedAt())
                .updatedAt(expense.getUpdatedAt())
                .build();
    }
}
