package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.util.RoleGuard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RoleGuard roleGuard;

    // Add Product
    public Product addProduct(String adminId, Product product) {
        roleGuard.requireAdmin(adminId);
        product.setCreatedAt(new Date());
        return productRepository.save(product);
    }

    // Get All
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Get by ID
    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // Delete
    public void deleteProduct(String adminId, String id) {
        roleGuard.requireAdmin(adminId);
        productRepository.deleteById(id);
    }

    // Update
    public Product updateProduct(String adminId, String id, Product updated) {
        roleGuard.requireAdmin(adminId);

        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (updated.getName() != null) p.setName(updated.getName());
        if (updated.getDescription() != null) p.setDescription(updated.getDescription());
        if (updated.getPrice() > 0) p.setPrice(updated.getPrice());
        if (updated.getCategory() != null) p.setCategory(updated.getCategory());
        if (updated.getSubCategory() != null) p.setSubCategory(updated.getSubCategory());
        if (updated.getBrand() != null) p.setBrand(updated.getBrand());
        if (updated.getStock() >= 0) p.setStock(updated.getStock());
        if (updated.getImageUrl() != null) p.setImageUrl(updated.getImageUrl());
        if (updated.getTags() != null) p.setTags(updated.getTags());
        if (updated.getSizes() != null) p.setSizes(updated.getSizes());
        if (updated.getColors() != null) p.setColors(updated.getColors());
        if (updated.getRating() > 0) p.setRating(updated.getRating());

        return productRepository.save(p);
    }

    // Search
    public List<Product> search(String keyword) {
        return productRepository.searchByKeyword(keyword);
    }

    // Category
    public List<Product> getByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    // SubCategory
    public List<Product> getBySubCategory(String subCategory) {
        return productRepository.findBySubCategoryIgnoreCase(subCategory);
    }

    // Featured
    public List<Product> getFeatured() {
        return productRepository.findByIsFeaturedTrue();
    }

    // Price filter
    public List<Product> getByPrice(double min, double max) {
        return productRepository.findByPriceBetween(min, max);
    }
}