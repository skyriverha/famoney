package com.famoney.api.expense.service;

import com.famoney.api.category.entity.Category;
import com.famoney.api.category.repository.CategoryRepository;
import com.famoney.api.common.exception.ForbiddenException;
import com.famoney.api.common.exception.ResourceNotFoundException;
import com.famoney.api.expense.dto.*;
import com.famoney.api.expense.entity.Expense;
import com.famoney.api.expense.repository.ExpenseRepository;
import com.famoney.api.member.entity.Member;
import com.famoney.api.member.repository.MemberRepository;
import com.famoney.api.user.entity.User;
import com.famoney.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service for expense operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final MemberRepository memberRepository;
    private final UserRepository userRepository;

    /**
     * Get expenses with filters and pagination.
     */
    public ExpenseListResponse getExpenses(String userId, String ledgerId,
                                            LocalDate startDate, LocalDate endDate,
                                            String categoryId, Pageable pageable) {
        log.debug("Getting expenses for ledger: {} by user: {}", ledgerId, userId);

        // Verify user is a member
        memberRepository.findByUserIdAndLedgerId(userId, ledgerId)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this ledger"));

        Page<Expense> expensePage = expenseRepository.findWithFilters(
                ledgerId, startDate, endDate, categoryId, pageable);

        // Batch load related data
        Page<ExpenseResponse> responsePage = enrichExpenses(expensePage, ledgerId);

        return ExpenseListResponse.from(responsePage);
    }

    /**
     * Get a single expense by ID.
     */
    public ExpenseResponse getExpense(String userId, String ledgerId, String expenseId) {
        log.debug("Getting expense: {} from ledger: {} by user: {}", expenseId, ledgerId, userId);

        memberRepository.findByUserIdAndLedgerId(userId, ledgerId)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this ledger"));

        Expense expense = expenseRepository.findByIdAndLedgerIdAndDeletedAtIsNull(expenseId, ledgerId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "id", expenseId));

        return enrichSingleExpense(expense, ledgerId);
    }

    /**
     * Create a new expense.
     * VIEWER role cannot create expenses.
     */
    @Transactional
    public ExpenseResponse createExpense(String userId, String ledgerId, CreateExpenseRequest request) {
        log.info("Creating expense for ledger: {} by user: {}", ledgerId, userId);

        Member member = memberRepository.findByUserIdAndLedgerId(userId, ledgerId)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this ledger"));

        if (!member.getRole().canWriteExpenses()) {
            throw new ForbiddenException("VIEWER cannot create expenses");
        }

        // Validate category if provided
        if (request.getCategoryId() != null) {
            categoryRepository.findByIdForLedger(request.getCategoryId(), ledgerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
        }

        Expense expense = Expense.builder()
                .ledgerId(ledgerId)
                .categoryId(request.getCategoryId())
                .amount(request.getAmount())
                .description(request.getDescription())
                .expenseDate(request.getExpenseDate())
                .paymentMethod(request.getPaymentMethod())
                .createdBy(userId)
                .build();

        expense = expenseRepository.save(expense);
        log.info("Created expense: {} for ledger: {}", expense.getId(), ledgerId);

        return enrichSingleExpense(expense, ledgerId);
    }

    /**
     * Update an expense.
     * Only the creator or ADMIN+ can update.
     */
    @Transactional
    public ExpenseResponse updateExpense(String userId, String ledgerId, String expenseId,
                                          UpdateExpenseRequest request) {
        log.info("Updating expense: {} in ledger: {} by user: {}", expenseId, ledgerId, userId);

        Member member = memberRepository.findByUserIdAndLedgerId(userId, ledgerId)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this ledger"));

        Expense expense = expenseRepository.findByIdAndLedgerIdAndDeletedAtIsNull(expenseId, ledgerId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "id", expenseId));

        // Check permission: creator or ADMIN+
        if (!expense.isCreatedBy(userId) && !member.canModifyLedger()) {
            throw new ForbiddenException("You can only edit your own expenses or be an ADMIN+");
        }

        // Validate category if changing
        if (request.getCategoryId() != null) {
            categoryRepository.findByIdForLedger(request.getCategoryId(), ledgerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            expense.setCategoryId(request.getCategoryId());
        }

        // Partial update
        if (request.getAmount() != null) {
            expense.setAmount(request.getAmount());
        }
        if (request.getDescription() != null) {
            expense.setDescription(request.getDescription());
        }
        if (request.getExpenseDate() != null) {
            expense.setExpenseDate(request.getExpenseDate());
        }
        if (request.getPaymentMethod() != null) {
            expense.setPaymentMethod(request.getPaymentMethod());
        }

        expense = expenseRepository.save(expense);
        log.info("Updated expense: {}", expenseId);

        return enrichSingleExpense(expense, ledgerId);
    }

    /**
     * Delete an expense (soft delete).
     * Only the creator or ADMIN+ can delete.
     */
    @Transactional
    public void deleteExpense(String userId, String ledgerId, String expenseId) {
        log.info("Deleting expense: {} from ledger: {} by user: {}", expenseId, ledgerId, userId);

        Member member = memberRepository.findByUserIdAndLedgerId(userId, ledgerId)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this ledger"));

        Expense expense = expenseRepository.findByIdAndLedgerIdAndDeletedAtIsNull(expenseId, ledgerId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "id", expenseId));

        // Check permission: creator or ADMIN+
        if (!expense.isCreatedBy(userId) && !member.canModifyLedger()) {
            throw new ForbiddenException("You can only delete your own expenses or be an ADMIN+");
        }

        expense.softDelete();
        expenseRepository.save(expense);
        log.info("Deleted expense: {}", expenseId);
    }

    /**
     * Enrich expenses with category and user data.
     */
    private Page<ExpenseResponse> enrichExpenses(Page<Expense> expensePage, String ledgerId) {
        if (expensePage.isEmpty()) {
            return new PageImpl<>(List.of(), expensePage.getPageable(), 0);
        }

        // Collect all category IDs and user IDs
        Set<String> categoryIds = expensePage.getContent().stream()
                .map(Expense::getCategoryId)
                .filter(id -> id != null)
                .collect(Collectors.toSet());

        Set<String> userIds = expensePage.getContent().stream()
                .map(Expense::getCreatedBy)
                .collect(Collectors.toSet());

        // Batch load categories
        Map<String, Category> categoryMap = categoryRepository.findAllById(categoryIds).stream()
                .collect(Collectors.toMap(Category::getId, c -> c));

        // Batch load users
        Map<String, User> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        // Map to responses
        List<ExpenseResponse> responses = expensePage.getContent().stream()
                .map(expense -> {
                    Category category = expense.getCategoryId() != null
                            ? categoryMap.get(expense.getCategoryId())
                            : null;
                    User user = userMap.get(expense.getCreatedBy());
                    return ExpenseResponse.from(expense, category,
                            user != null ? user.getName() : "Unknown",
                            user != null ? user.getProfileImage() : null);
                })
                .collect(Collectors.toList());

        return new PageImpl<>(responses, expensePage.getPageable(), expensePage.getTotalElements());
    }

    /**
     * Enrich a single expense with category and user data.
     */
    private ExpenseResponse enrichSingleExpense(Expense expense, String ledgerId) {
        Category category = null;
        if (expense.getCategoryId() != null) {
            category = categoryRepository.findById(expense.getCategoryId()).orElse(null);
        }

        User user = userRepository.findById(expense.getCreatedBy()).orElse(null);

        return ExpenseResponse.from(expense, category,
                user != null ? user.getName() : "Unknown",
                user != null ? user.getProfileImage() : null);
    }
}
