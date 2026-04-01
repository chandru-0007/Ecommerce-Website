package com.ecommerce.service;

import com.ecommerce.dto.CartRequest;
import com.ecommerce.model.Cart;
import com.ecommerce.model.Product;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // ── Get cart ─────────────────────────────────────────────────────────────

    public Cart getCart(String userId) {
        validateUser(userId);
        return cartRepository.findByUserId(userId).orElse(null);
    }

    // ── Add item (or increase quantity if already in cart) ───────────────────

    public Cart addToCart(String userId, CartRequest request) {
        validateUser(userId);

        if (request.getQuantity() <= 0)
            throw new RuntimeException("Quantity must be at least 1");

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStock() <= 0)
            throw new RuntimeException("Product is out of stock");

        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart c = new Cart();
            c.setUserId(userId);
            c.setItems(new ArrayList<>());
            return c;
        });

        // Check if product already in cart → update quantity
        Optional<Cart.CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(request.getProductId()))
                .findFirst();

        if (existing.isPresent()) {
            int newQty = existing.get().getQuantity() + request.getQuantity();
            if (newQty > product.getStock())
                throw new RuntimeException("Not enough stock. Available: " + product.getStock());
            existing.get().setQuantity(newQty);
        } else {
            if (request.getQuantity() > product.getStock())
                throw new RuntimeException("Not enough stock. Available: " + product.getStock());

            Cart.CartItem item = new Cart.CartItem();
            item.setProductId(product.getId());
            item.setProductName(product.getName());
            item.setPrice(product.getPrice());
            item.setQuantity(request.getQuantity());
            item.setImageUrl(product.getImageUrl());
            cart.getItems().add(item);
        }

        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    // ── Update quantity of a specific item ───────────────────────────────────

    public Cart updateItemQuantity(String userId, String productId, int quantity) {
        validateUser(userId);

        if (quantity < 0)
            throw new RuntimeException("Quantity cannot be negative");

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (quantity == 0) {
            // Remove item when quantity set to 0
            boolean removed = cart.getItems().removeIf(i -> i.getProductId().equals(productId));
            if (!removed) throw new RuntimeException("Item not found in cart");
        } else {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            if (quantity > product.getStock())
                throw new RuntimeException("Not enough stock. Available: " + product.getStock());

            Cart.CartItem item = cart.getItems().stream()
                    .filter(i -> i.getProductId().equals(productId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Item not found in cart"));
            item.setQuantity(quantity);
        }

        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    // ── Remove specific item from cart ───────────────────────────────────────

    public Cart removeFromCart(String userId, String productId) {
        validateUser(userId);

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        boolean removed = cart.getItems().removeIf(i -> i.getProductId().equals(productId));
        if (!removed) throw new RuntimeException("Item not found in cart");

        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    // ── Clear entire cart ────────────────────────────────────────────────────

    public void clearCart(String userId) {
        validateUser(userId);
        cartRepository.findByUserId(userId).ifPresent(cartRepository::delete);
    }

    // ── Helper ───────────────────────────────────────────────────────────────

    private void validateUser(String userId) {
        if (!userRepository.existsById(userId))
            throw new RuntimeException("User not found");
    }
}