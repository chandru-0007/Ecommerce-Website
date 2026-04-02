package com.ecommerce.service;

import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    // ── Place Order ─────────────────────────────
    public Order placeOrder(String userId, List<Cart.CartItem> items, double clientTotalPrice) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        if (items == null || items.isEmpty())
            throw new RuntimeException("Your cart is empty. Please add items to order.");

        // Address Validation
        User.Address defaultAddress = user.getAddresses().stream()
                .filter(a -> a.getAddressId().equals(user.getDefaultAddressId()))
                .findFirst()
                .orElse(null);

        if (defaultAddress == null && !user.getAddresses().isEmpty()) {
            defaultAddress = user.getAddresses().get(0); // Fallback to first address
        }

        if (defaultAddress == null) {
            throw new RuntimeException("No delivery address found. Please add a default address in your profile settings.");
        }

        double totalAmount = 0;

        // Check stock and populate prices/details
        for (Cart.CartItem item : items) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));

            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for '" + product.getName() + "'. Available: " + product.getStock());
            }

            // Hydrate product details
            item.setPrice(product.getPrice());
            item.setProductName(product.getName());
            item.setImageUrl(product.getImageUrl());

            totalAmount += product.getPrice() * item.getQuantity();
        }

        // Deduct stock
        for (Cart.CartItem item : items) {
            Product product = productRepository.findById(item.getProductId()).get();
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        // Create order
        Order order = new Order();
        order.setUserId(userId);
        order.setItems(items);
        order.setTotalAmount(totalAmount);
        order.setStatus(Order.OrderStatus.PLACED);
        order.setDeliveryAddress(defaultAddress); // ✅ SET ADDRESS

        // ✅ FIXED
        order.setPaymentMethod("COD");

        order.setPlacedAt(new Date());
        order.setUpdatedAt(new Date());

        System.out.println("Order successfully placed for user: " + userId + " | Total: " + totalAmount);
        return orderRepository.save(order);
    }

    // ── Order History ───────────────────────────
    public List<Order> getOrderHistory(String userId) {
        return orderRepository.findByUserIdOrderByPlacedAtDesc(userId);
    }

    // ── Get Single Order ────────────────────────
    public Order getOrder(String userId, String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUserId().equals(userId))
            throw new RuntimeException("Access denied");

        return order;
    }

    // ── Cancel Order ────────────────────────────
    public Order cancelOrder(String userId, String orderId) {

        Order order = getOrder(userId, orderId);

        if (order.getStatus() != Order.OrderStatus.PLACED) {
            throw new RuntimeException("Orders can only be cancelled before they are shipped.");
        }

        // Restore stock
        for (Cart.CartItem item : order.getItems()) {
            productRepository.findById(item.getProductId()).ifPresent(product -> {
                product.setStock(product.getStock() + item.getQuantity());
                productRepository.save(product);
            });
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        order.setUpdatedAt(new Date());

        return orderRepository.save(order);
    }

    // ── Admin: Get All Orders ───────────────────
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // ── Admin Update Status ─────────────────────
    public Order updateOrderStatus(String orderId, Order.OrderStatus status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Delivery Rule: Admin cannot manually modify status once DELIVERED (except via return flow)
        if (order.getStatus() == Order.OrderStatus.DELIVERED && 
            status != Order.OrderStatus.DELIVERED) {
            throw new RuntimeException("Once an order is DELIVERED, manual status changes are blocked.");
        }

        // Set deliveredAt when moving to DELIVERED
        if (status == Order.OrderStatus.DELIVERED && order.getStatus() != Order.OrderStatus.DELIVERED) {
            order.setDeliveredAt(new Date());
        }

        order.setStatus(status);
        order.setUpdatedAt(new Date());

        return orderRepository.save(order);
    }

    // ── Return Flow ─────────────────────────────

    public Order requestReturn(String userId, String orderId) {
        Order order = getOrder(userId, orderId);

        if (order.getStatus() != Order.OrderStatus.DELIVERED) {
            throw new RuntimeException("Returns can only be requested for DELIVERED orders.");
        }

        // Return Rule: Within 5 days
        long now = new Date().getTime();
        long deliveredTime = order.getDeliveredAt() != null ? order.getDeliveredAt().getTime() : order.getUpdatedAt().getTime();
        long fiveDaysInMillis = 5L * 24 * 60 * 60 * 1000;

        if (now - deliveredTime > fiveDaysInMillis) {
            throw new RuntimeException("The return period (5 days) has expired for this order.");
        }

        order.setStatus(Order.OrderStatus.RETURN_REQUESTED);
        order.setUpdatedAt(new Date());
        return orderRepository.save(order);
    }

    public Order processReturn(String orderId, boolean isDamaged) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() != Order.OrderStatus.RETURN_REQUESTED) {
            throw new RuntimeException("Return must be requested first.");
        }

        if (isDamaged) {
            // Refund Rule: If damaged → REJECT return (remains DELIVERED)
            order.setStatus(Order.OrderStatus.DELIVERED);
        } else {
            // Refund Rule: If NOT damaged → APPROVE return -> REFUNDED
            order.setStatus(Order.OrderStatus.REFUNDED);
            
            // Restore stock for returned items that are NOT damaged
            for (Cart.CartItem item : order.getItems()) {
                productRepository.findById(item.getProductId()).ifPresent(product -> {
                    product.setStock(product.getStock() + item.getQuantity());
                    productRepository.save(product);
                });
            }
        }

        order.setUpdatedAt(new Date());
        return orderRepository.save(order);
    }
}