package com.example.demo.security;

import com.example.demo.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String path = request.getServletPath();
        System.out.println("=== JWT Filter Processing: " + path + " ===");
        
        // Skip filter for login and register endpoints
        if (path.equals("/api/users/login") || path.equals("/api/users/register")) {
            System.out.println("Skipping JWT filter for public endpoint: " + path);
            filterChain.doFilter(request, response);
            return;
        }
        
        String authHeader = request.getHeader("Authorization");
        System.out.println("Authorization Header: " + authHeader);
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("No valid Authorization header found");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        System.out.println("Token extracted: " + token.substring(0, Math.min(token.length(), 20)) + "...");
        
        try {
            String email = jwtService.extractEmail(token);
            String role = jwtService.extractRole(token);
            
            System.out.println("Extracted email: " + email);
            System.out.println("Extracted role: " + role);
            System.out.println("Token valid: " + jwtService.isTokenValid(token, email));
            
            if (email == null || !jwtService.isTokenValid(token, email)) {
                System.out.println("Token validation failed!");
                filterChain.doFilter(request, response);
                return;
            }

            List<SimpleGrantedAuthority> authorities = 
                List.of(new SimpleGrantedAuthority("ROLE_" + role));

            UsernamePasswordAuthenticationToken auth = 
                new UsernamePasswordAuthenticationToken(email, null, authorities);
            
            SecurityContextHolder.getContext().setAuthentication(auth);
            System.out.println("✅ Authentication set in SecurityContext for: " + email);
            
        } catch (Exception e) {
            System.err.println("❌ Error in JWT filter: " + e.getMessage());
            e.printStackTrace();
        }
        
        filterChain.doFilter(request, response);
    }
}