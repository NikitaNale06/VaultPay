package com.example.demo.service;

import com.example.demo.model.Account;
import com.example.demo.model.User;
import com.example.demo.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class FraudService {

    private final TransactionRepository transactionRepository;

    public FraudService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public boolean isFraudulent(User user, Account account, BigDecimal amount) {
        // Rule 1: Extremely high amount (> ₹1,00,000)
        if (amount.compareTo(new BigDecimal("100000")) > 0) {
            System.out.println("Fraud detected: Amount > 1,00,000");
            return true;
        }

        // Rule 2: Rapid transactions (>20 in last hour)
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        long recentCount = transactionRepository.countRecentTransactions(account.getId(), oneHourAgo);
        if (recentCount > 20) {
            System.out.println("Fraud detected: Too many transactions in last hour");
            return true;
        }

        // Rule 3: New account (<24 hours) with large amount (> ₹50,000)
        if (account.getCreatedAt().isAfter(LocalDateTime.now().minusHours(24)) 
                && amount.compareTo(new BigDecimal("50000")) > 0) {
            System.out.println("Fraud detected: New account with large amount");
            return true;
        }

        return false;
    }
}