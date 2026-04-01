package com.ecommerce.util;

import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Admin User if not exists
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("site_admin");
            admin.setEmail("admin@vibestore.com");
            admin.setPassword(passwordEncoder.encode("admin_password_99"));
            admin.setRole(User.Role.ADMIN);
            admin.setCreatedAt(LocalDateTime.now());
            userRepository.save(admin);
            System.out.println("✅ Admin user seeded: site_admin / admin_password_99");
        }

        // Seed Products if not exists
        if (productRepository.count() == 0) {
            seedProducts();
            System.out.println("✅ Initial products seeded.");
        }
    }

    private void seedProducts() {
        Product p1 = new Product();
        p1.setName("Ultra-Slim VibeBook Pro");
        p1.setDescription("A high-performance laptop with a sleek liquid-metal design and 20h battery life. Powered by the latest M3-equivalent architecture.");
        p1.setPrice(129999.00);
        p1.setCategory("Electronics");
        p1.setSubCategory("Computers");
        p1.setBrand("VibeTech");
        p1.setStock(15);
        p1.setImageUrl("https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1000");
        p1.setTags(Arrays.asList("laptop", "tech", "premium"));
        p1.setSizes(Arrays.asList("14 inch", "16 inch"));
        p1.setRating(4.9);
        p1.setNumReviews(450);
        p1.setFeatured(true);
        p1.setCreatedAt(new Date());

        Product p2 = new Product();
        p2.setName("VibePods Max - Noise Canceling");
        p2.setDescription("Experience studio-grade audio with our flagship adaptive noise-canceling headphones. Crafted for pure acoustic immersion.");
        p2.setPrice(34999.00);
        p2.setCategory("Electronics");
        p2.setSubCategory("Audio");
        p2.setBrand("VibeAudio");
        p2.setStock(24);
        p2.setImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000");
        p2.setTags(Arrays.asList("headphones", "audio", "wireless"));
        p2.setRating(5.0);
        p2.setNumReviews(820);
        p2.setFeatured(true);
        p2.setCreatedAt(new Date());

        Product p3 = new Product();
        p3.setName("Aura Watch Titanium");
        p3.setDescription("The ultimate fitness companion with aerospace-grade titanium build and 24/7 health monitoring. Elegance meets endurance.");
        p3.setPrice(44900.00);
        p3.setCategory("Electronics");
        p3.setSubCategory("Wearables");
        p3.setBrand("VibeWrist");
        p3.setStock(8);
        p3.setImageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000");
        p3.setTags(Arrays.asList("watch", "smartwatch", "luxury"));
        p3.setRating(4.8);
        p3.setNumReviews(310);
        p3.setFeatured(true);
        p3.setCreatedAt(new Date());

        Product p4 = new Product();
        p4.setName("Minimalist Carbon Fiber Wallet");
        p4.setDescription("RFID blocking minimalist wallet crafted from genuine 3K carbon fiber. The last wallet you'll ever need.");
        p4.setPrice(4500.00);
        p4.setCategory("Accessories");
        p4.setSubCategory("Wallets");
        p4.setBrand("VibeGear");
        p4.setStock(0); // Out of Stock demonstration
        p4.setImageUrl("https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=1000");
        p4.setTags(Arrays.asList("wallet", "carbon", "accessory"));
        p4.setRating(4.7);
        p4.setNumReviews(156);
        p4.setFeatured(false);
        p4.setCreatedAt(new Date());

        productRepository.saveAll(Arrays.asList(p1, p2, p3, p4));
    }
}
