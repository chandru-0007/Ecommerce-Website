package com.ecommerce.dto;

// ── Auth DTOs ─────────────────────────────────────────────────────────────────

public class AuthDTOs {

    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private String phoneNumber;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    }

    public static class LoginRequest {
        // Can log in with username OR email
        private String identifier; // username or email
        private String password;

        public String getIdentifier() { return identifier; }
        public void setIdentifier(String identifier) { this.identifier = identifier; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class AuthResponse {
        private String userId;
        private String username;
        private String email;
        private String phoneNumber;
        private String role;
        private String message;

        public AuthResponse() {}

        public AuthResponse(String userId, String username, String email,
                            String phoneNumber, String role, String message) {
            this.userId = userId;
            this.username = username;
            this.email = email;
            this.phoneNumber = phoneNumber;
            this.role = role;
            this.message = message;
        }

        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}