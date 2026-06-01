package com.example.demo.controller;

import com.example.demo.model.Account;
import com.example.demo.model.Transaction;
import com.example.demo.model.User;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.service.TransactionService;
import com.example.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final UserService userService;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public TransactionController(TransactionService transactionService, UserService userService,
                                 AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.transactionService = transactionService;
        this.userService = userService;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @PostMapping("/credit")
    public ResponseEntity<?> credit(@RequestBody CreditRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            System.out.println("Credit request from: " + email);
            
            User user = userService.findByEmail(email);
            Transaction tx = transactionService.credit(user, new BigDecimal(request.getAmount()), request.getIdempotencyKey());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Credited: " + tx.getAmount() + " INR");
            response.put("transactionId", tx.getId());
            response.put("transactionReference", tx.getTransactionReference());
            response.put("newBalance", accountRepository.findByUserId(user.getId()).get().getBalance());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/debit")
    public ResponseEntity<?> debit(@RequestBody DebitRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            
            User user = userService.findByEmail(email);
            Transaction tx = transactionService.debit(user, new BigDecimal(request.getAmount()), request.getIdempotencyKey());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Debited: " + tx.getAmount() + " INR");
            response.put("transactionId", tx.getId());
            response.put("newBalance", accountRepository.findByUserId(user.getId()).get().getBalance());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> history() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            
            User user = userService.findByEmail(email);
            Account account = accountRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Account not found!"));
            
            List<Transaction> transactions = transactionRepository.findByAccountId(account.getId());
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody TransferRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            
            User fromUser = userService.findByEmail(email);
            Transaction tx = transactionService.transfer(fromUser, request.getToEmail(), 
                                             new BigDecimal(request.getAmount()), 
                                             request.getIdempotencyKey());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Transferred: " + tx.getAmount() + " INR to " + request.getToEmail());
            response.put("transactionId", tx.getId());
            response.put("transactionReference", tx.getTransactionReference());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Inner Classes
    public static class CreditRequest {
        private String amount;
        private String idempotencyKey;

        public String getAmount() { return amount; }
        public void setAmount(String amount) { this.amount = amount; }
        public String getIdempotencyKey() { return idempotencyKey; }
        public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }
    }

    public static class DebitRequest {
        private String amount;
        private String idempotencyKey;

        public String getAmount() { return amount; }
        public void setAmount(String amount) { this.amount = amount; }
        public String getIdempotencyKey() { return idempotencyKey; }
        public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }
    }

    public static class TransferRequest {
        private String toEmail;
        private String amount;
        private String idempotencyKey;

        public String getToEmail() { return toEmail; }
        public void setToEmail(String toEmail) { this.toEmail = toEmail; }
        public String getAmount() { return amount; }
        public void setAmount(String amount) { this.amount = amount; }
        public String getIdempotencyKey() { return idempotencyKey; }
        public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }
    }
}