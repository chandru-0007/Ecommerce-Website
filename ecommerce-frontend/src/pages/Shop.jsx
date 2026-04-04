import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();

  const categories = ['All', 'Electronics', 'Clothing', 'Home', 'Accessories'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let response;
        if (selectedCategory !== 'All') {
          response = await productAPI.getByCategory(selectedCategory);
        } else if (searchTerm) {
          response = await productAPI.search(searchTerm);
        } else {
          response = await productAPI.getAll();
        }
        setProducts(response.data);
      } catch (err) {
        console.error('Fetch error:', err);
        // Mock fallback for testing
        setProducts([
          { id: '1', name: 'Ultra-Slim Laptop', price: 1299.99, category: 'Electronics', imageUrl: 'https://via.placeholder.com/400x400' },
          { id: '2', name: 'Wireless Headphones', price: 349.99, category: 'Electronics', imageUrl: 'https://via.placeholder.com/400x400' },
          { id: '3', name: 'Smart Watch', price: 399.00, category: 'Electronics', imageUrl: 'https://via.placeholder.com/400x400' },
          { id: '4', name: 'Cotton T-Shirt', price: 29.99, category: 'Clothing', imageUrl: 'https://via.placeholder.com/400x400' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  return (
    <div className="shop-page container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="gradient-text">Explore Shop</h1>
        
        <div style={{ display: 'flex', gap: '1rem', flex: 1, maxWidth: '600px' }}>
          <div className="glass" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
            <Search size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', padding: '0.75rem', flex: 1, outline: 'none' }}
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="glass"
              style={{ padding: '0.75rem 2.5rem 0.75rem 1rem', appearance: 'none', cursor: 'pointer', outline: 'none' }}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <ChevronDown size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '2rem' 
        }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="glass" style={{ padding: '1.5rem', height: '400px' }}>
              <div className="skeleton skeleton-image" style={{ marginBottom: '1.5rem' }} />
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" style={{ width: '40%' }} />
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
          layout
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '2rem' 
          }}
        >
          <AnimatePresence>
            {products.map(product => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={product.id}
              >
                <ProductCard 
                  product={product} 
                  onAddToCart={() => addToCart(product)} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Shop;
