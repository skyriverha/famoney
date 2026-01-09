package com.famoney.api.user.repository;

import com.famoney.api.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User entity operations.
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {

    /**
     * Find user by email (case-insensitive).
     */
    Optional<User> findByEmailIgnoreCase(String email);

    /**
     * Find active (non-deleted) user by email.
     */
    Optional<User> findByEmailIgnoreCaseAndDeletedAtIsNull(String email);

    /**
     * Find active (non-deleted) user by id.
     */
    Optional<User> findByIdAndDeletedAtIsNull(String id);

    /**
     * Check if email exists (for active users only).
     */
    boolean existsByEmailIgnoreCaseAndDeletedAtIsNull(String email);
}
