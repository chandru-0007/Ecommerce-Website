package com.ecommerce.controller;

import com.ecommerce.dto.AuthDTOs;
import com.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * POST /api/auth/register
     * Registers a new CUSTOMER.
     * Body: { "username", "email", "password", "phoneNumber" }
     * Response: { "userId", "username", "email", "phoneNumber", "role": "CUSTOMER", "message" }
     */
    @PostMapping("/register")
    public ResponseEntity<AuthDTOs.AuthResponse> register(
            @RequestBody AuthDTOs.RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    /**
     * POST /api/auth/register/admin
     * Registers a new ADMIN user.
     * Body: { "username", "email", "password", "phoneNumber" }
     * Response: { "userId", "username", "email", "phoneNumber", "role": "ADMIN", "message" }
     */
    @PostMapping("/register/admin")
    public ResponseEntity<AuthDTOs.AuthResponse> registerAdmin(
            @RequestBody AuthDTOs.RegisterRequest request) {
        return ResponseEntity.ok(userService.registerAdmin(request));
    }

    /**
     * POST /api/auth/login
     * Login with username OR email.
     * Body: { "identifier": "username or email", "password": "..." }
     * Response: { "userId", "username", "email", "phoneNumber", "role", "message" }
     */
    @PostMapping("/login")
    public ResponseEntity<AuthDTOs.AuthResponse> login(
            @RequestBody AuthDTOs.LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }
}