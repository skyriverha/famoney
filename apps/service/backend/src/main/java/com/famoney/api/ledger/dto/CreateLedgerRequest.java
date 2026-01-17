package com.famoney.api.ledger.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a new ledger.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateLedgerRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters")
    private String name;

    @Size(max = 500, message = "Description must be at most 500 characters")
    private String description;

    @Size(max = 10, message = "Currency must be at most 10 characters")
    private String currency = "KRW";
}
