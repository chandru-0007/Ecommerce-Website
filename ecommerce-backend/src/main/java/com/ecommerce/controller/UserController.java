package com.ecommerce.controller;

import com.ecommerce.model.User;
import com.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // Profile
    @GetMapping("/{userId}/profile")
    public ResponseEntity<User> getProfile(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    // Update profile
    @PutMapping("/{userId}/profile")
    public ResponseEntity<User> updateProfile(
            @PathVariable String userId,
            @RequestBody Map<String, String> body) {

        return ResponseEntity.ok(
                userService.updateProfile(
                        userId,
                        body.get("phoneNumber"),
                        body.get("email")
                )
        );
    }

    // Change password
    @PutMapping("/{userId}/password")
    public ResponseEntity<Map<String, String>> changePassword(
            @PathVariable String userId,
            @RequestBody Map<String, String> body) {

        userService.changePassword(
                userId,
                body.get("oldPassword"),
                body.get("newPassword")
        );

        return ResponseEntity.ok(Map.of("message", "Password changed"));
    }

    // Add address
    @PostMapping("/{userId}/addresses")
    public ResponseEntity<User> addAddress(
            @PathVariable String userId,
            @RequestBody User.Address address) {

        return ResponseEntity.ok(userService.addAddress(userId, address));
    }

    // Update address
    @PutMapping("/{userId}/addresses/{addressId}")
    public ResponseEntity<User> updateAddress(
            @PathVariable String userId,
            @PathVariable String addressId,
            @RequestBody User.Address address) {

        return ResponseEntity.ok(
                userService.updateAddress(userId, addressId, address)
        );
    }

    // Delete address
    @DeleteMapping("/{userId}/addresses/{addressId}")
    public ResponseEntity<User> deleteAddress(
            @PathVariable String userId,
            @PathVariable String addressId) {

        return ResponseEntity.ok(
                userService.deleteAddress(userId, addressId)
        );
    }

    // Set default address
    @PutMapping("/{userId}/addresses/{addressId}/default")
    public ResponseEntity<User> setDefaultAddress(
            @PathVariable String userId,
            @PathVariable String addressId) {

        return ResponseEntity.ok(
                userService.setDefaultAddress(userId, addressId)
        );
    }
}