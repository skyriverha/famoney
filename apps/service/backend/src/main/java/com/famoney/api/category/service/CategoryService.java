package com.famoney.api.category.service;

import com.famoney.api.category.dto.CategoryResponse;
import com.famoney.api.category.dto.CreateCategoryRequest;
import com.famoney.api.category.entity.Category;
import com.famoney.api.category.repository.CategoryRepository;
import com.famoney.api.common.exception.BadRequestException;
import com.famoney.api.common.exception.ForbiddenException;
import com.famoney.api.common.exception.ResourceNotFoundException;
import com.famoney.api.expense.repository.ExpenseRepository;
import com.famoney.api.member.entity.Member;
import com.famoney.api.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for category operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final MemberRepository memberRepository;
    private final ExpenseRepository expenseRepository;

    /**
     * Get all categories available for a ledger (default + custom).
     */
    public List<CategoryResponse> getCategories(String userId, String ledgerId) {
        log.debug("Getting categories for ledger: {} by user: {}", ledgerId, userId);

        // Verify user is a member
        memberRepository.findByUserIdAndLedgerId(userId, ledgerId)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this ledger"));

        return categoryRepository.findAllForLedger(ledgerId).stream()
                .map(CategoryResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * Create a custom category for a ledger.
     * Only OWNER and ADMIN can create categories.
     */
    @Transactional
    public CategoryResponse createCategory(String userId, String ledgerId, CreateCategoryRequest request) {
        log.info("Creating category for ledger: {} by user: {}", ledgerId, userId);

        Member member = memberRepository.findByUserIdAndLedgerId(userId, ledgerId)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this ledger"));

        if (!member.canModifyLedger()) {
            throw new ForbiddenException("Only OWNER and ADMIN can create categories");
        }

        // Check for duplicate name
        if (categoryRepository.existsByLedgerIdAndName(ledgerId, request.getName())) {
            throw new BadRequestException("Category with this name already exists");
        }

        Category category = Category.builder()
                .ledgerId(ledgerId)
                .name(request.getName())
                .color(request.getColor() != null ? request.getColor() : "#808080")
                .icon(request.getIcon())
                .isDefault(false)
                .build();

        category = categoryRepository.save(category);
        log.info("Created category: {} for ledger: {}", category.getId(), ledgerId);

        return CategoryResponse.from(category);
    }

    /**
     * Delete a custom category.
     * Only OWNER and ADMIN can delete categories.
     * Default categories cannot be deleted.
     */
    @Transactional
    public void deleteCategory(String userId, String ledgerId, String categoryId) {
        log.info("Deleting category: {} from ledger: {} by user: {}", categoryId, ledgerId, userId);

        Member member = memberRepository.findByUserIdAndLedgerId(userId, ledgerId)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this ledger"));

        if (!member.canModifyLedger()) {
            throw new ForbiddenException("Only OWNER and ADMIN can delete categories");
        }

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));

        if (category.isDefault()) {
            throw new BadRequestException("Cannot delete default categories");
        }

        if (!ledgerId.equals(category.getLedgerId())) {
            throw new ForbiddenException("Category does not belong to this ledger");
        }

        // Check if category is used by any expenses
        long usageCount = expenseRepository.countByCategoryIdAndDeletedAtIsNull(categoryId);
        if (usageCount > 0) {
            throw new BadRequestException("Cannot delete category that is used by " + usageCount + " expense(s)");
        }

        categoryRepository.delete(category);
        log.info("Deleted category: {}", categoryId);
    }
}
