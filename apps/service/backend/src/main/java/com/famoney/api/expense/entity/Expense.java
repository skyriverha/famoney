package com.famoney.api.expense.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Expense entity representing an individual expense record.
 */
@Entity
@Table(name = "expenses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense {

    @Id
    @UuidGenerator
    @Column(length = 36)
    private String id;

    @Column(name = "ledger_id", nullable = false, length = 36)
    private String ledgerId;

    @Column(name = "category_id", length = 36)
    private String categoryId;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 255)
    private String description;

    @Column(name = "expense_date", nullable = false)
    private LocalDate expenseDate;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    @Column(name = "created_by", nullable = false, length = 36)
    private String createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Check if expense is deleted (soft delete).
     */
    public boolean isDeleted() {
        return deletedAt != null;
    }

    /**
     * Soft delete the expense.
     */
    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }

    /**
     * Check if the expense was created by a specific user.
     */
    public boolean isCreatedBy(String userId) {
        return this.createdBy.equals(userId);
    }
}
