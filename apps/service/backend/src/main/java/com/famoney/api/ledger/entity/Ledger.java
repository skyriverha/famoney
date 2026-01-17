package com.famoney.api.ledger.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

/**
 * Ledger entity representing a shared expense ledger.
 */
@Entity
@Table(name = "ledgers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ledger {

    @Id
    @UuidGenerator
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String currency = "KRW";

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
     * Check if ledger is deleted (soft delete).
     */
    public boolean isDeleted() {
        return deletedAt != null;
    }

    /**
     * Soft delete the ledger.
     */
    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }
}
