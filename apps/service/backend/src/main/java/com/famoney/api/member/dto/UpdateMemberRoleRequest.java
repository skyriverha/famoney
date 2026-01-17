package com.famoney.api.member.dto;

import com.famoney.api.member.entity.MemberRole;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating a member's role.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMemberRoleRequest {

    @NotNull(message = "Role is required")
    private MemberRole role;
}
