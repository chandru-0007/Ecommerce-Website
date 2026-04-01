import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await productAPI.getFeatured();
        setFeaturedProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch featured products, using mock.', err);
        // Mock data fallback
        setFeaturedProducts([
          {
            id: '1',
            name: 'Ultra-Slim Laptop',
            price: 1299.99,
            category: 'Electronics',
            imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1000',
            rating: 4.8,
            isFeatured: true
          },
          {
            id: '2',
            name: 'Wireless Headphones',
            price: 349.99,
            category: 'Electronics',
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000',
            rating: 4.9,
            isFeatured: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="home-page">
      <HeroSection />
      
      <section style={{ marginTop: '4rem' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gradient-text" 
            style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}
          >
            Featured Collections
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ color: 'var(--text-muted)' }}
          >
            Handpicked premium items for your modern lifestyle.
          </motion.p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="loader">Loading exclusive products...</div>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '2rem' 
            }}
          >
            {featuredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={() => addToCart(product)} 
              />
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Home;
