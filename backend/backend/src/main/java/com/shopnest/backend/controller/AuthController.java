package com.shopnest.backend.controller;

import com.shopnest.backend.model.User;
import com.shopnest.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");
        String role = request.get("role");

        User.Role userRole = User.Role.valueOf(role != null ? role.toUpperCase() : "BUYER");
        String token = authService.register(name, email, password, userRole);
        return ResponseEntity.ok(Map.of("token", token, "message", "Registration successful!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        String token = authService.login(email, password);
        return ResponseEntity.ok(Map.of("token", token, "message", "Login successful!"));
    }
}