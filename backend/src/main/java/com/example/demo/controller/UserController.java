package com.example.demo.controller;

import com.example.demo.dto.BalanceResponseDto;
import com.example.demo.model.Account;
import com.example.demo.model.User;
import com.example.demo.service.AccountService;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AccountService accountService;

    public UserController(UserService userService, AccountService accountService) {
        this.userService = userService;
        this.accountService = accountService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody UserRegistrationDto request, BindingResult result) {
        if (result.hasErrors()) {
            String error = result.getFieldErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest().body("Error: " + error);
        }

        User user = userService.registerUser(request.getEmail(), request.getPassword());
        return ResponseEntity.ok("User registered successfully! ID: " + user.getId());
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        String token = userService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(new LoginResponse(token));
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> profile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.findByEmail(email);
        Account account = accountService.getAccountByUserId(user.getId());
        
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("email", user.getEmail());
        profile.put("role", user.getRole());
        profile.put("balance", account.getBalance());
        profile.put("accountNumber", account.getAccountNumber());
        
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/balance")
    public ResponseEntity<BalanceResponseDto> balance() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        
        User user = userService.findByEmail(email);
        Account account = accountService.getAccountByUserId(user.getId());
        BigDecimal balance = accountService.getBalance(user.getId());
        
        BalanceResponseDto response = new BalanceResponseDto(balance, account.getCurrency(), account.getAccountNumber());
        return ResponseEntity.ok(response);
    }

    // Inner Classes
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginResponse {
        private String token;
        private String message;

        public LoginResponse(String token) {
            this.token = token;
            this.message = "Login successful!";
        }

        public String getToken() { return token; }
        public String getMessage() { return message; }
    }
}