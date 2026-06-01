package com.example.demo.service;

import com.example.demo.model.Account;
import com.example.demo.model.Transaction;
import com.example.demo.model.User;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final FraudService fraudService;

    public TransactionService(TransactionRepository transactionRepository, 
                              AccountRepository accountRepository,
                              UserRepository userRepository,
                              FraudService fraudService) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.fraudService = fraudService;
    }

    // CREDIT
    @Transactional
    public Transaction credit(User user, BigDecimal amount, String idempotencyKey) {
        // Check if already processed
        if (idempotencyKey != null && !idempotencyKey.trim().isEmpty()) {
            var existing = transactionRepository.findByIdempotencyKey(idempotencyKey);
            if (existing.isPresent()) {
                return existing.get();
            }
        }

        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Account not found!"));

        // Fraud check (disabled for now)
        // if (fraudService.isFraudulent(user, account, amount)) {
        //     throw new RuntimeException("Transaction flagged as suspicious! Contact support.");
        // }

        // Update balance
        account.setBalance(account.getBalance().add(amount));
        account.setVersion(account.getVersion() + 1);
        accountRepository.save(account);

        // Create transaction
        Transaction tx = new Transaction();
        tx.setAccount(account);
        tx.setAmount(amount);
        tx.setType("CREDIT");
        tx.setStatus("COMPLETED");
        tx.setIdempotencyKey(idempotencyKey != null ? idempotencyKey : UUID.randomUUID().toString());
        tx.setTransactionReference(generateTransactionReference());
        tx.setProcessedAt(LocalDateTime.now());
        tx.setCompletedAt(LocalDateTime.now());
        tx.setDescription("Credited: ₹" + amount);

        return transactionRepository.save(tx);
    }

    // DEBIT
    @Transactional
    public Transaction debit(User user, BigDecimal amount, String idempotencyKey) {
        // Check if already processed
        if (idempotencyKey != null && !idempotencyKey.trim().isEmpty()) {
            var existing = transactionRepository.findByIdempotencyKey(idempotencyKey);
            if (existing.isPresent()) {
                return existing.get();
            }
        }

        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Account not found!"));

        // Fraud check (disabled for now)
        // if (fraudService.isFraudulent(user, account, amount)) {
        //     throw new RuntimeException("Transaction flagged as suspicious! Contact support.");
        // }

        // Check sufficient balance
        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance!");
        }

        // Update balance
        account.setBalance(account.getBalance().subtract(amount));
        account.setVersion(account.getVersion() + 1);
        accountRepository.save(account);

        // Create transaction
        Transaction tx = new Transaction();
        tx.setAccount(account);
        tx.setAmount(amount);
        tx.setType("DEBIT");
        tx.setStatus("COMPLETED");
        tx.setIdempotencyKey(idempotencyKey != null ? idempotencyKey : UUID.randomUUID().toString());
        tx.setTransactionReference(generateTransactionReference());
        tx.setProcessedAt(LocalDateTime.now());
        tx.setCompletedAt(LocalDateTime.now());
        tx.setDescription("Debited: ₹" + amount);

        return transactionRepository.save(tx);
    }

    // TRANSFER
    @Transactional
    public Transaction transfer(User fromUser, String toEmail, BigDecimal amount, String idempotencyKey) {
        // Check if already processed
        if (idempotencyKey != null && !idempotencyKey.trim().isEmpty()) {
            var existing = transactionRepository.findByIdempotencyKey(idempotencyKey);
            if (existing.isPresent()) {
                return existing.get();
            }
        }

        Account fromAccount = accountRepository.findByUserId(fromUser.getId())
                .orElseThrow(() -> new RuntimeException("Your account not found!"));

        // Fraud check (disabled for now)
        // if (fraudService.isFraudulent(fromUser, fromAccount, amount)) {
        //     throw new RuntimeException("Transaction flagged as suspicious! Contact support.");
        // }

        // Check sufficient balance
        if (fromAccount.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance!");
        }

        User toUser = userRepository.findByEmail(toEmail)
                .orElseThrow(() -> new RuntimeException("Receiver not found!"));

        Account toAccount = accountRepository.findByUserId(toUser.getId())
                .orElseThrow(() -> new RuntimeException("Receiver account not found!"));

        // Update balances
        fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
        fromAccount.setVersion(fromAccount.getVersion() + 1);
        toAccount.setBalance(toAccount.getBalance().add(amount));
        toAccount.setVersion(toAccount.getVersion() + 1);

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        // Create transaction
        Transaction tx = new Transaction();
        tx.setAccount(fromAccount);
        tx.setAmount(amount);
        tx.setType("TRANSFER");
        tx.setStatus("COMPLETED");
        tx.setIdempotencyKey(idempotencyKey != null ? idempotencyKey : UUID.randomUUID().toString());
        tx.setTransactionReference(generateTransactionReference());
        tx.setProcessedAt(LocalDateTime.now());
        tx.setCompletedAt(LocalDateTime.now());
        tx.setDescription("Transferred ₹" + amount + " to " + toEmail);

        return transactionRepository.save(tx);
    }

    private String generateTransactionReference() {
        return "TXN" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}