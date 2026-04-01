package com.ecommerce.service;

import com.ecommerce.dto.AuthDTOs;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // ── Register USER ─────────────────────────
    public AuthDTOs.AuthResponse register(AuthDTOs.RegisterRequest request) {
        validate(request);
        User user = buildUser(request, User.Role.USER);
        return toResponse(userRepository.save(user), "Registered successfully");
    }

    // ── Register ADMIN ────────────────────────
    public AuthDTOs.AuthResponse registerAdmin(AuthDTOs.RegisterRequest request) {
        validate(request);
        User user = buildUser(request, User.Role.ADMIN);
        return toResponse(userRepository.save(user), "Admin created");
    }

    // ── Login ────────────────────────────────
    public AuthDTOs.AuthResponse login(AuthDTOs.LoginRequest request) {

        User user = userRepository.findByUsername(request.getIdentifier())
                .or(() -> userRepository.findByEmail(request.getIdentifier()))
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid credentials");

        return toResponse(user, "Login successful");
    }

    // ── Profile ──────────────────────────────
    public User getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(null);
        return user;
    }

    // ── Update Profile ───────────────────────
    public User updateProfile(String userId, String phone, String email) {
        User user = getUser(userId);

        if (email != null) user.setEmail(email.toLowerCase());
        if (phone != null) user.setPhoneNumber(phone);

        user.setUpdatedAt(LocalDateTime.now());
        user.setPassword(null);
        return userRepository.save(user);
    }

    // ── Change Password ──────────────────────
    public void changePassword(String userId, String oldPass, String newPass) {
        User user = getUser(userId);

        if (!passwordEncoder.matches(oldPass, user.getPassword()))
            throw new RuntimeException("Wrong password");

        user.setPassword(passwordEncoder.encode(newPass));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    // ── Add Address ──────────────────────────
    public User addAddress(String userId, User.Address address) {
        User user = getUser(userId);

        address.setAddressId(UUID.randomUUID().toString());

        if (user.getAddresses().isEmpty()) {
            address.setDefault(true);
            user.setDefaultAddressId(address.getAddressId());
        }

        user.getAddresses().add(address);
        user.setUpdatedAt(LocalDateTime.now());

        user.setPassword(null);
        return userRepository.save(user);
    }

    // ── Update Address ───────────────────────
    public User updateAddress(String userId, String addressId, User.Address updated) {
        User user = getUser(userId);

        for (int i = 0; i < user.getAddresses().size(); i++) {
            User.Address a = user.getAddresses().get(i);

            if (a.getAddressId().equals(addressId)) {
                updated.setAddressId(addressId);

                if (updated.isDefault()) {
                    user.getAddresses().forEach(addr -> addr.setDefault(false));
                    user.setDefaultAddressId(addressId);
                }

                user.getAddresses().set(i, updated);
                user.setUpdatedAt(LocalDateTime.now());

                user.setPassword(null);
                return userRepository.save(user);
            }
        }

        throw new RuntimeException("Address not found");
    }

    // ── Delete Address ───────────────────────
    public User deleteAddress(String userId, String addressId) {
        User user = getUser(userId);

        boolean removed = user.getAddresses()
                .removeIf(a -> a.getAddressId().equals(addressId));

        if (!removed) throw new RuntimeException("Address not found");

        if (addressId.equals(user.getDefaultAddressId()) && !user.getAddresses().isEmpty()) {
            User.Address first = user.getAddresses().get(0);
            first.setDefault(true);
            user.setDefaultAddressId(first.getAddressId());
        }

        user.setUpdatedAt(LocalDateTime.now());
        user.setPassword(null);
        return userRepository.save(user);
    }

    // ── Set Default Address ──────────────────
    public User setDefaultAddress(String userId, String addressId) {
        User user = getUser(userId);

        boolean found = false;

        for (User.Address a : user.getAddresses()) {
            if (a.getAddressId().equals(addressId)) {
                a.setDefault(true);
                found = true;
            } else {
                a.setDefault(false);
            }
        }

        if (!found) throw new RuntimeException("Address not found");

        user.setDefaultAddressId(addressId);
        user.setUpdatedAt(LocalDateTime.now());

        user.setPassword(null);
        return userRepository.save(user);
    }

    // ── Helpers ──────────────────────────────

    private User getUser(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void validate(AuthDTOs.RegisterRequest r) {
        if (userRepository.existsByUsername(r.getUsername()))
            throw new RuntimeException("Username taken");
        if (userRepository.existsByEmail(r.getEmail()))
            throw new RuntimeException("Email exists");
    }

    private User buildUser(AuthDTOs.RegisterRequest r, User.Role role) {
        User u = new User();
        u.setUsername(r.getUsername());
        u.setEmail(r.getEmail().toLowerCase());
        u.setPassword(passwordEncoder.encode(r.getPassword()));
        u.setPhoneNumber(r.getPhoneNumber());
        u.setRole(role);
        u.setCreatedAt(LocalDateTime.now());
        u.setUpdatedAt(LocalDateTime.now());
        return u;
    }

    private AuthDTOs.AuthResponse toResponse(User u, String msg) {
        return new AuthDTOs.AuthResponse(
                u.getId(),
                u.getUsername(),
                u.getEmail(),
                u.getPhoneNumber(),
                u.getRole().name(), // 🔥 FIX
                msg
        );
    }
}