package com.example.demo.controller;

import com.example.demo.model.Transaction;
import com.example.demo.model.User;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public AdminController(UserRepository userRepository, TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    // GET /api/admin/users — All users
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity users() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // GET /api/admin/transactions — All transactions
    @GetMapping("/transactions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity transactions() {
        List<Transaction> transactions = transactionRepository.findAll();
        return ResponseEntity.ok(transactions);
    }

    // GET /api/admin/fraud-alerts — Large amount transactions
    @GetMapping("/fraud-alerts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity fraudAlerts() {
        // Transactions > 10,000
        List<Transaction> allTx = transactionRepository.findAll();
        List<Transaction> suspicious = allTx.stream()
                .filter(tx -> tx.getAmount().doubleValue() > 10000)
                .toList();
        
        return ResponseEntity.ok(suspicious);
    }
}