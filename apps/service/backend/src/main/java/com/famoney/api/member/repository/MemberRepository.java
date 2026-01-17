package com.famoney.api.member.repository;

import com.famoney.api.member.entity.Member;
import com.famoney.api.member.entity.MemberRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Member entity.
 */
@Repository
public interface MemberRepository extends JpaRepository<Member, String> {

    /**
     * Find member by user ID and ledger ID.
     */
    Optional<Member> findByUserIdAndLedgerId(String userId, String ledgerId);

    /**
     * Find all members of a ledger.
     */
    List<Member> findByLedgerId(String ledgerId);

    /**
     * Find all ledger IDs where user is a member.
     */
    @Query("SELECT m.ledgerId FROM Member m WHERE m.userId = :userId")
    List<String> findLedgerIdsByUserId(@Param("userId") String userId);

    /**
     * Check if user is a member of the ledger.
     */
    boolean existsByUserIdAndLedgerId(String userId, String ledgerId);

    /**
     * Count members in a ledger.
     */
    long countByLedgerId(String ledgerId);

    /**
     * Find owner of a ledger.
     */
    Optional<Member> findByLedgerIdAndRole(String ledgerId, MemberRole role);

    /**
     * Delete all members of a ledger.
     */
    void deleteByLedgerId(String ledgerId);
}
