package com.example.demo.service;

import org.bouncycastle.crypto.generators.Argon2BytesGenerator;
import org.bouncycastle.crypto.params.Argon2Parameters;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;

@Service
public class PasswordHasher {

    // Security settings
    private static final int SALT_LENGTH = 16;
    private static final int HASH_LENGTH = 32;
    private static final int ITERATIONS = 3;
    private static final int MEMORY = 65536; // 64 MB
    private static final int PARALLELISM = 1;

    // Hash password - registration ke time use hoga
    public String hash(String password) {
        // Step 1: Random salt generate karo
        byte[] salt = new byte[SALT_LENGTH];
        new SecureRandom().nextBytes(salt);

        // Step 2: Argon2 parameters set karo
        Argon2Parameters params = new Argon2Parameters.Builder()
                .withSalt(salt)
                .withParallelism(PARALLELISM)
                .withMemoryAsKB(MEMORY)
                .withIterations(ITERATIONS)
                .build();

        // Step 3: Hash generate karo
        Argon2BytesGenerator generator = new Argon2BytesGenerator();
        generator.init(params);
        
        byte[] result = new byte[HASH_LENGTH];
        generator.generateBytes(password.toCharArray(), result);

        // Step 4: Salt + Hash combine karke Base64 mein convert
        byte[] combined = new byte[SALT_LENGTH + HASH_LENGTH];
        System.arraycopy(salt, 0, combined, 0, SALT_LENGTH);
        System.arraycopy(result, 0, combined, SALT_LENGTH, HASH_LENGTH);

        return Base64.getEncoder().encodeToString(combined);
    }

    // Verify password - login ke time use hoga
    public boolean verify(String password, String storedHash) {
        // Stored hash se salt nikalo
        byte[] combined = Base64.getDecoder().decode(storedHash);
        byte[] salt = new byte[SALT_LENGTH];
        System.arraycopy(combined, 0, salt, 0, SALT_LENGTH);

        // Same parameters se hash karo
        Argon2Parameters params = new Argon2Parameters.Builder()
                .withSalt(salt)
                .withParallelism(PARALLELISM)
                .withMemoryAsKB(MEMORY)
                .withIterations(ITERATIONS)
                .build();

        Argon2BytesGenerator generator = new Argon2BytesGenerator();
        generator.init(params);
        
        byte[] result = new byte[HASH_LENGTH];
        generator.generateBytes(password.toCharArray(), result);

        // Stored hash nikalo
        byte[] stored = new byte[HASH_LENGTH];
        System.arraycopy(combined, SALT_LENGTH, stored, 0, HASH_LENGTH);

        // Time-constant comparison (security best practice)
        return constantTimeEquals(result, stored);
    }

    // Security: Timing attack se bachne ke liye
    private boolean constantTimeEquals(byte[] a, byte[] b) {
        if (a.length != b.length) return false;
        int result = 0;
        for (int i = 0; i < a.length; i++) {
            result |= a[i] ^ b[i];
        }
        return result == 0;
    }
}