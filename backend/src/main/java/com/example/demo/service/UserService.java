package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;
    private final JwtService jwtService;
    private final AccountService accountService;

    public UserService(UserRepository userRepository, PasswordHasher passwordHasher, 
                       JwtService jwtService, AccountService accountService) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.jwtService = jwtService;
        this.accountService = accountService;
    }
public User registerUser(String email, String password) {
    Optional<User> existingUser = userRepository.findByEmail(email);
    if (existingUser.isPresent()) {
        throw new RuntimeException("Email already registered!");
    }

    User user = new User();
    user.setEmail(email);
    user.setPasswordHash(passwordHasher.hash(password));
    user.setRole("USER");  // String now
    user.setStatus("ACTIVE");

    User savedUser = userRepository.save(user);
    accountService.createAccount(savedUser);
    return savedUser;
}
    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        boolean isValid = passwordHasher.verify(password, user.getPasswordHash());
        if (!isValid) {
            throw new RuntimeException("Invalid password!");
        }

        return jwtService.generateToken(email, user.getRole());
    }
    
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }
}