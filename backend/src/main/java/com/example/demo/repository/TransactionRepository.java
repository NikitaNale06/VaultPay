package com.example.demo.repository;

import com.example.demo.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Optional<Transaction> findByIdempotencyKey(String idempotencyKey);
    
    List<Transaction> findByAccountId(Long accountId);
    
    @Query("SELECT t FROM Transaction t WHERE t.account.id = :accountId AND t.createdAt BETWEEN :startDate AND :endDate")
    List<Transaction> findTransactionsBetweenDates(@Param("accountId") Long accountId, 
                                                    @Param("startDate") LocalDateTime startDate,
                                                    @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.account.id = :accountId AND t.createdAt > :since")
    long countRecentTransactions(@Param("accountId") Long accountId, @Param("since") LocalDateTime since);
    
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.account.id = :accountId AND t.type = 'CREDIT' AND t.status = 'COMPLETED'")
    BigDecimal getTotalCredits(@Param("accountId") Long accountId);
    
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.account.id = :accountId AND t.type = 'DEBIT' AND t.status = 'COMPLETED'")
    BigDecimal getTotalDebits(@Param("accountId") Long accountId);
}