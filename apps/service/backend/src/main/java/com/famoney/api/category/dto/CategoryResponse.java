package com.famoney.api.category.dto;

import com.famoney.api.category.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for category data.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {

    private String id;
    private String ledgerId;
    private String name;
    private String color;
    private String icon;
    private boolean isDefault;
    private LocalDateTime createdAt;

    /**
     * Create response from entity.
     */
    public static CategoryResponse from(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .ledgerId(category.getLedgerId())
                .name(category.getName())
                .color(category.getColor())
                .icon(category.getIcon())
                .isDefault(category.isDefault())
                .createdAt(category.getCreatedAt())
                .build();
    }
}
