package com.ecommerce.util;

import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RoleGuard {

    @Autowired
    private UserRepository userRepository;

    // ✅ Check admin access
    public void requireAdmin(String requestingUserId) {

        User user = userRepository.findById(requestingUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ ENUM check (correct way)
        if (user.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Access denied: Admin role required");
        }
    }

    // ✅ Get user role
    public User.Role getRole(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getRole();
    }
}