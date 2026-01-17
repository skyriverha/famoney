package com.famoney.api.ledger.dto;

import com.famoney.api.ledger.entity.Ledger;
import com.famoney.api.member.entity.MemberRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for ledger data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LedgerResponse {

    private String id;
    private String name;
    private String description;
    private String currency;
    private int memberCount;
    private MemberRole myRole;
    private LocalDateTime createdAt;

    /**
     * Create LedgerResponse from Ledger entity.
     */
    public static LedgerResponse from(Ledger ledger, int memberCount, MemberRole myRole) {
        return LedgerResponse.builder()
                .id(ledger.getId())
                .name(ledger.getName())
                .description(ledger.getDescription())
                .currency(ledger.getCurrency())
                .memberCount(memberCount)
                .myRole(myRole)
                .createdAt(ledger.getCreatedAt())
                .build();
    }

    /**
     * Create LedgerResponse from Ledger entity without role info.
     */
    public static LedgerResponse from(Ledger ledger, int memberCount) {
        return from(ledger, memberCount, null);
    }
}
