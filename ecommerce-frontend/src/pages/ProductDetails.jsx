import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Truck, Shield, ArrowLeft, Plus, Minus, ShoppingCart, Zap, Package, RefreshCw } from 'lucide-react';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { formatPrice } from '../utils/format';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getById(id);
        setProduct(response.data);
      } catch (err) {
        console.error('Fetch error:', err);
        // Fallback for demo
        setProduct({
          id,
          name: 'Premium Wireless Headphones',
          description: 'Experience unparalleled sound quality with our flagship noise-canceling headphones. Perfect for music lovers and professionals alike.',
          price: 34999.00,
          rating: 4.9,
          numReviews: 128,
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000',
          stock: 15,
          category: 'Electronics',
          brand: 'VibeAudio'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }} className="loader">Analyzing sonic profile...</div>;
  if (!product) return <div className="container" style={{ padding: '10rem', textAlign: 'center' }}><h2>Product not found.</h2><button onClick={() => navigate('/shop')} className="btn btn-primary">Back to Shop</button></div>;

  const isOutOfStock = product.stock === 0;

  return (
    <div className="product-details container">
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '2rem', fontSize: '1rem' }}
      >
        <ArrowLeft size={18} /> Back to Shop
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'start' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass" 
          style={{ overflow: 'hidden', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-lg)', objectFit: 'contain', maxHeight: '600px' }}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <span className="badge" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
              {product.category}
            </span>
            <span className="badge" style={{ background: 'var(--bg-glass)', color: 'var(--text-muted)' }}>
              {product.brand}
            </span>
          </div>
          
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: '1.1' }}>{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-glass)', padding: '0.5rem 1rem', borderRadius: '1rem' }}>
              <Star size={18} fill="var(--accent)" color="var(--accent)" />
              <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{product.rating}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>({product.numReviews}+)</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isOutOfStock ? 'var(--danger)' : 'var(--success)', fontWeight: '600' }}>
              {isOutOfStock ? (
                <><Package size={18} /> Out of Stock</>
              ) : (
                <><Zap size={18} /> In Stock ({product.stock} units)</>
              )}
            </div>
          </div>

          <h2 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '2.5rem' }}>{formatPrice(product.price)}</h2>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '3rem', lineHeight: '1.8' }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
            {!isOutOfStock && (
              <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                  <Minus size={20} />
                </button>
                <span style={{ padding: '0 1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                  <Plus size={20} />
                </button>
              </div>
            )}

            <button 
              onClick={() => addToCart(product, quantity)}
              disabled={isOutOfStock}
              className={isOutOfStock ? 'btn btn-outline' : 'btn btn-primary'}
              style={{ flex: 1, minWidth: '220px', fontSize: '1.125rem', opacity: isOutOfStock ? 0.5 : 1 }}
            >
              {isOutOfStock ? 'Notify Me' : <><ShoppingCart size={22} style={{ marginRight: '0.5rem' }} /> Add to Bag</>}
            </button>
          </div>

          {/* Novelty: Trust Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <div className="glass" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <Truck size={24} color="var(--primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Fast Delivery</span>
            </div>
            <div className="glass" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <Shield size={24} color="var(--primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>1Y Warranty</span>
            </div>
            <div className="glass" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <RefreshCw size={24} color="var(--primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>7 Day Return</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;
