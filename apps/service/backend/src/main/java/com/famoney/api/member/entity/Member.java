package com.famoney.api.member.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

/**
 * Member entity representing a user's membership in a ledger.
 */
@Entity
@Table(name = "members",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "ledger_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    @Id
    @UuidGenerator
    @Column(length = 36)
    private String id;

    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @Column(name = "ledger_id", nullable = false, length = 36)
    private String ledgerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MemberRole role;

    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    @Column(name = "invited_by", length = 36)
    private String invitedBy;

    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
    }

    /**
     * Check if member has at least the specified role.
     */
    public boolean hasAtLeast(MemberRole required) {
        return role.hasAtLeast(required);
    }

    /**
     * Check if member is the owner.
     */
    public boolean isOwner() {
        return role == MemberRole.OWNER;
    }

    /**
     * Check if member can manage other members.
     */
    public boolean canManageMembers() {
        return role.canManageMembers();
    }

    /**
     * Check if member can modify ledger settings.
     */
    public boolean canModifyLedger() {
        return role.canModifyLedger();
    }
}
