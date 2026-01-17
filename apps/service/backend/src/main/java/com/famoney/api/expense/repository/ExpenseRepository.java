package com.famoney.api.expense.repository;

import com.famoney.api.expense.entity.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

/**
 * Repository for Expense entity.
 */
@Repository
public interface ExpenseRepository extends JpaRepository<Expense, String> {

    /**
     * Find expense by ID and not deleted.
     */
    Optional<Expense> findByIdAndDeletedAtIsNull(String id);

    /**
     * Find expense by ID and ledger ID, not deleted.
     */
    @Query("SELECT e FROM Expense e WHERE e.id = :id AND e.ledgerId = :ledgerId AND e.deletedAt IS NULL")
    Optional<Expense> findByIdAndLedgerIdAndDeletedAtIsNull(
            @Param("id") String id,
            @Param("ledgerId") String ledgerId);

    /**
     * Find expenses with filters and pagination.
     */
    @Query("SELECT e FROM Expense e WHERE e.ledgerId = :ledgerId AND e.deletedAt IS NULL " +
           "AND (:startDate IS NULL OR e.expenseDate >= :startDate) " +
           "AND (:endDate IS NULL OR e.expenseDate <= :endDate) " +
           "AND (:categoryId IS NULL OR e.categoryId = :categoryId)")
    Page<Expense> findWithFilters(
            @Param("ledgerId") String ledgerId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("categoryId") String categoryId,
            Pageable pageable);

    /**
     * Count expenses by ledger ID.
     */
    long countByLedgerIdAndDeletedAtIsNull(String ledgerId);

    /**
     * Count expenses by category ID.
     */
    long countByCategoryIdAndDeletedAtIsNull(String categoryId);
}
