package com.famoney.api.category.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

/**
 * Category entity representing an expense category.
 * Categories can be default (shared across all ledgers) or custom (ledger-specific).
 */
@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @UuidGenerator
    @Column(length = 36)
    private String id;

    @Column(name = "ledger_id", length = 36)
    private String ledgerId;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 7)
    @Builder.Default
    private String color = "#808080";

    @Column(length = 50)
    private String icon;

    @Column(name = "is_default", nullable = false)
    @Builder.Default
    private boolean isDefault = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    /**
     * Check if this is a default category (available to all ledgers).
     */
    public boolean isDefaultCategory() {
        return isDefault;
    }

    /**
     * Check if this category belongs to a specific ledger.
     */
    public boolean belongsToLedger(String ledgerId) {
        return this.ledgerId != null && this.ledgerId.equals(ledgerId);
    }
}
