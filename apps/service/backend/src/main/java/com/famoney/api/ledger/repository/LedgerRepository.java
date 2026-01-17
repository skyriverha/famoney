package com.famoney.api.ledger.repository;

import com.famoney.api.ledger.entity.Ledger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Ledger entity.
 */
@Repository
public interface LedgerRepository extends JpaRepository<Ledger, String> {

    /**
     * Find ledger by ID excluding soft-deleted ones.
     */
    Optional<Ledger> findByIdAndDeletedAtIsNull(String id);
}
