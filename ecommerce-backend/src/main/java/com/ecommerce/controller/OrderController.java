package com.ecommerce.controller;

import com.ecommerce.model.Cart;
import com.ecommerce.model.Order;
import com.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    public static class OrderRequest {
        public List<Cart.CartItem> items;
        public double totalPrice;
        public String addressId;
    }

    /**
     * POST /api/orders/{userId}
     */
    @PostMapping("/{userId}")
    public ResponseEntity<Order> placeOrder(
            @PathVariable String userId,
            @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.placeOrder(userId, request.items, request.totalPrice, request.addressId));
    }

    /**
     * GET /api/orders/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<Order>> getOrderHistory(@PathVariable String userId) {
        return ResponseEntity.ok(orderService.getOrderHistory(userId));
    }

    /**
     * GET /api/orders/{userId}/{orderId}
     */
    @GetMapping("/{userId}/{orderId}")
    public ResponseEntity<Order> getOrder(
            @PathVariable String userId,
            @PathVariable String orderId) {
        return ResponseEntity.ok(orderService.getOrder(userId, orderId));
    }

    /**
     * PUT /api/orders/{userId}/{orderId}/cancel
     */
    @PutMapping("/{userId}/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(
            @PathVariable String userId,
            @PathVariable String orderId) {
        return ResponseEntity.ok(orderService.cancelOrder(userId, orderId));
    }

    /**
     * PUT /api/orders/{orderId}/status (Admin only)
     */
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody Map<String, String> body) {
        Order.OrderStatus status = Order.OrderStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    /**
     * PUT /api/orders/{userId}/{orderId}/return
     */
    @PutMapping("/{userId}/{orderId}/return")
    public ResponseEntity<Order> requestReturn(
            @PathVariable String userId,
            @PathVariable String orderId) {
        return ResponseEntity.ok(orderService.requestReturn(userId, orderId));
    }

    /**
     * PUT /api/orders/{orderId}/process-return
     */
    @PutMapping("/{orderId}/process-return")
    public ResponseEntity<Order> processReturn(
            @PathVariable String orderId,
            @RequestBody Map<String, Boolean> body) {
        boolean isDamaged = body.getOrDefault("isDamaged", false);
        return ResponseEntity.ok(orderService.processReturn(orderId, isDamaged));
    }

    /**
     * GET /api/orders/admin/all (Admin only)
     */
    @GetMapping("/admin/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}