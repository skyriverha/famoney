package com.famoney.api.expense.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Response DTO for paginated expense list.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseListResponse {

    private List<ExpenseResponse> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean first;
    private boolean last;

    /**
     * Create response from Spring Data Page.
     */
    public static ExpenseListResponse from(Page<ExpenseResponse> page) {
        return ExpenseListResponse.builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}
