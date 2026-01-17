package com.famoney.api.category.repository;

import com.famoney.api.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Category entity.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {

    /**
     * Find all categories available for a ledger (default + ledger-specific).
     */
    @Query("SELECT c FROM Category c WHERE c.isDefault = true OR c.ledgerId = :ledgerId ORDER BY c.isDefault DESC, c.name ASC")
    List<Category> findAllForLedger(@Param("ledgerId") String ledgerId);

    /**
     * Find all default categories.
     */
    List<Category> findByIsDefaultTrue();

    /**
     * Find categories by ledger ID (custom categories only).
     */
    List<Category> findByLedgerId(String ledgerId);

    /**
     * Find a category by ID and ledger ID (including default categories).
     */
    @Query("SELECT c FROM Category c WHERE c.id = :id AND (c.isDefault = true OR c.ledgerId = :ledgerId)")
    Optional<Category> findByIdForLedger(@Param("id") String id, @Param("ledgerId") String ledgerId);

    /**
     * Check if a category with the same name already exists for the ledger.
     */
    boolean existsByLedgerIdAndName(String ledgerId, String name);
}
