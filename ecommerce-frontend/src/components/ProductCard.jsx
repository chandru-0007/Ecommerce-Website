import React from 'react';
import { Star, ShoppingCart, Eye, Box } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatPrice } from '../utils/format';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const isLowStock = product.stock > 0 && product.stock < 10;
  const isOutOfStock = product.stock === 0;

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="glass" 
      style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      {/* Novelty: Stock Badge */}
      <div style={{ 
        position: 'absolute', 
        top: '1rem', 
        left: '1rem', 
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {isOutOfStock ? (
          <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>Out of Stock</span>
        ) : isLowStock ? (
          <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>Low Stock</span>
        ) : null}
      </div>

      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1/1' }}>
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.3)',
          opacity: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          transition: 'opacity 0.3s ease',
        }} className="card-overlay">
          <Link to={`/product/${product.id}`} className="btn-outline" style={{ padding: '0.75rem', borderRadius: '50%', color: 'white' }}>
            <Eye size={20} />
          </Link>
          {!isOutOfStock && (
            <button onClick={() => addToCart(product)} className="btn-primary" style={{ padding: '0.75rem', borderRadius: '50%' }}>
              <ShoppingCart size={20} />
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{product.name}</h3>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--accent)', fontSize: '0.875rem' }}>
            <Star size={14} fill="currentColor" />
            <span style={{ marginLeft: '0.25rem' }}>{product.rating || '4.5'}</span>
          </div>
        </div>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '1.5rem', flex: 1 }}>
          {product.category}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>{formatPrice(product.price)}</span>
          {!isOutOfStock ? (
            <button onClick={() => addToCart(product)} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
              Add to Bag
            </button>
          ) : (
            <button disabled className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', opacity: 0.5, cursor: 'not-allowed' }}>
              Sold Out
            </button>
          )}
        </div>
      </div>

      <style>{`
        .glass:hover .card-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </motion.div>
  );
};

export default ProductCard;
