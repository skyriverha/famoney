package com.famoney.api.user.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating user profile.
 * All fields are optional - only non-null fields will be updated.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {

    @Size(min = 1, max = 50, message = "Name must be between 1 and 50 characters")
    private String name;

    private String profileImage;
}
