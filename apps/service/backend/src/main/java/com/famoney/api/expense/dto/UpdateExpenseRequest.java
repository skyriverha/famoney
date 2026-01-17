package com.famoney.api.expense.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Request DTO for updating an expense.
 * All fields are optional for partial updates.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateExpenseRequest {

    @DecimalMin(value = "0.01", message = "Amount must be at least 0.01")
    @Digits(integer = 13, fraction = 2, message = "Amount must have at most 13 integer digits and 2 decimal places")
    private BigDecimal amount;

    @Size(max = 255, message = "Description must be 255 characters or less")
    private String description;

    private LocalDate expenseDate;

    private String categoryId;

    @Size(max = 50, message = "Payment method must be 50 characters or less")
    private String paymentMethod;
}
