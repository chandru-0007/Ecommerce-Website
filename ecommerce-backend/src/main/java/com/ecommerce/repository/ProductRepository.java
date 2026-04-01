package com.ecommerce.repository;

import com.ecommerce.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {

    List<Product> findByCategoryIgnoreCase(String category);

    List<Product> findBySubCategoryIgnoreCase(String subCategory);

    List<Product> findByBrandIgnoreCase(String brand);

    List<Product> findByIsFeaturedTrue();

    List<Product> findByPriceBetween(double min, double max);

    List<Product> findByStockGreaterThan(int stock);

    @Query("{ $or: [ " +
            "{ 'name': { $regex: ?0, $options: 'i' } }, " +
            "{ 'description': { $regex: ?0, $options: 'i' } }, " +
            "{ 'brand': { $regex: ?0, $options: 'i' } }, " +
            "{ 'tags': { $regex: ?0, $options: 'i' } } " +
            "] }")
    List<Product> searchByKeyword(String keyword);
}