package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
// import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Add
    @PostMapping
    public ResponseEntity<Product> addProduct(
            @RequestHeader("X-User-Id") String adminUserId,
            @RequestBody Product product) {
        return ResponseEntity.ok(productService.addProduct(adminUserId, product));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @RequestHeader("X-User-Id") String adminUserId,
            @PathVariable String id,
            @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(adminUserId, id, product));
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(
            @RequestHeader(value = "X-User-Id", required = false) String adminUserId,
            @PathVariable String id) {
        System.out.println("❌ Admin DELETE Request | AdminID: " + adminUserId + " | ProductID: " + id);
        productService.deleteProduct(adminUserId, id);
        return ResponseEntity.ok("Deleted successfully");
    }

    // Get all
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Get by id
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // Search
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam("q") String keyword) {
        return ResponseEntity.ok(productService.search(keyword));
    }

    // Category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getByCategory(category));
    }

    // SubCategory
    @GetMapping("/subcategory/{subCategory}")
    public ResponseEntity<List<Product>> getBySubCategory(@PathVariable String subCategory) {
        return ResponseEntity.ok(productService.getBySubCategory(subCategory));
    }

    // Featured
    @GetMapping("/featured")
    public ResponseEntity<List<Product>> getFeaturedProducts() {
        return ResponseEntity.ok(productService.getFeatured());
    }

    // Price
    @GetMapping("/price")
    public ResponseEntity<List<Product>> getByPriceRange(
            @RequestParam double min,
            @RequestParam double max) {
        return ResponseEntity.ok(productService.getByPrice(min, max));
    }
}