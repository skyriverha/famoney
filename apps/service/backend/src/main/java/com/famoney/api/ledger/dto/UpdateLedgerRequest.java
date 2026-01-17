package com.famoney.api.ledger.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating a ledger.
 * All fields are optional for partial update.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateLedgerRequest {

    @Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters")
    private String name;

    @Size(max = 500, message = "Description must be at most 500 characters")
    private String description;
}
