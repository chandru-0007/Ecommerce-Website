package com.ecommerce.controller;

import com.ecommerce.dto.CartRequest;
import com.ecommerce.model.Cart;
import com.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    /**
     * GET /api/cart/{userId}
     * Returns the user's current cart
     */
    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable String userId) {
        Cart cart = cartService.getCart(userId);
        return ResponseEntity.ok(cart != null ? cart : new Cart());
    }

    /**
     * POST /api/cart/{userId}/items
     * Body: { "productId": "...", "quantity": 2 }
     * Adds item or increases quantity if already present
     */
    @PostMapping("/{userId}/items")
    public ResponseEntity<Cart> addToCart(
            @PathVariable String userId,
            @RequestBody CartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(userId, request));
    }

    /**
     * PUT /api/cart/{userId}/items/{productId}
     * Body: { "quantity": 3 }
     * Updates quantity; set quantity=0 to remove item
     */
    @PutMapping("/{userId}/items/{productId}")
    public ResponseEntity<Cart> updateItemQuantity(
            @PathVariable String userId,
            @PathVariable String productId,
            @RequestBody Map<String, Integer> body) {
        Integer quantity = body.get("quantity");
        if (quantity == null) throw new RuntimeException("Quantity is required");
        return ResponseEntity.ok(cartService.updateItemQuantity(userId, productId, quantity));
    }

    /**
     * DELETE /api/cart/{userId}/items/{productId}
     * Removes a specific item from cart
     */
    @DeleteMapping("/{userId}/items/{productId}")
    public ResponseEntity<Cart> removeFromCart(
            @PathVariable String userId,
            @PathVariable String productId) {
        return ResponseEntity.ok(cartService.removeFromCart(userId, productId));
    }

    /**
     * DELETE /api/cart/{userId}
     * Clears the entire cart
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Map<String, String>> clearCart(@PathVariable String userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok(Map.of("message", "Cart cleared"));
    }
}