import React from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '../utils/format';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orderSuccess, setOrderSuccess] = React.useState(false);
  const [isPlacing, setIsPlacing] = React.useState(false);

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) return;

    setIsPlacing(true);
    try {
      await orderAPI.place({ 
        items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity })),
        totalPrice: cartTotal
      });
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      console.error('Order Error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to place order. Please try again.';
      
      if (errorMessage.toLowerCase().includes('address')) {
        if (window.confirm(`${errorMessage}\n\nWould you like to go to your profile to add an address?`)) {
          navigate('/profile');
        }
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsPlacing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="cart-success container" style={{ textAlign: 'center', padding: '10rem 0' }}>
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            background: 'var(--success)', 
            margin: '0 auto 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <ShieldCheck size={60} />
          </div>
          <h1 className="gradient-text" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>Order Confirmed!</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            The vibes are headed your way! Your premium gear is being prepared for fulfillment.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <button onClick={() => navigate('/profile')} className="btn btn-outline" style={{ padding: '1rem 2.5rem' }}>
              View History
            </button>
            <button onClick={() => navigate('/shop')} className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
              Keep Shopping
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty container" style={{ textAlign: 'center', padding: '10rem 0' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            background: 'var(--bg-glass)', 
            margin: '0 auto 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)'
          }}>
            <ShoppingBag size={48} />
          </div>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Empty Vibes</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.125rem' }}>Your shopping bag is waiting for its first item.</p>
          <button onClick={() => navigate('/shop')} className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
            Explore Collections
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Shopping Bag</h1>
          <p style={{ color: 'var(--text-muted)' }}>You have {cartItems.length} items in your bag</p>
        </div>
        <Link to="/shop" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '600' }}>
          <ArrowLeft size={18} /> Continue Shopping
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '5rem', alignItems: 'start' }}>
        <div className="cart-items">
          <AnimatePresence mode="popLayout">
            {cartItems.map(item => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={item.id} 
                className="glass" 
                style={{ display: 'flex', gap: '2rem', padding: '2rem', marginBottom: '1.5rem', alignItems: 'center' }}
              >
                <div style={{ flexShrink: 0, borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                  <img src={item.imageUrl} alt={item.name} style={{ width: '140px', height: '140px', objectFit: 'cover' }} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Category: {item.category}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}
                      className="hover-danger"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '0.25rem' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ padding: '0 1.25rem', fontWeight: 'bold', fontSize: '1.125rem' }}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '0.25rem' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Unit Price: {formatPrice(item.price)}</p>
                      <p style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--primary)', marginTop: '0.25rem' }}>{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="cart-summary glass" 
          style={{ padding: '3rem', position: 'sticky', top: '7rem', border: '1px solid var(--primary-soft)' }}
        >
          <h2 style={{ marginBottom: '2.5rem', fontSize: '1.75rem' }}>Order Summary</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Shipping Fee</span>
              <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Tax (GST 18%)</span>
              <span>Included</span>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--glass-border)', margin: '1.5rem 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>Grand Total</span>
            <div style={{ textAlign: 'right' }}>
              <div className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>{formatPrice(cartTotal)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Prices inclusive of all taxes</div>
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1.5rem', fontSize: '1.25rem', borderRadius: '16px', opacity: isPlacing ? 0.7 : 1 }}
            disabled={isPlacing}
            onClick={handlePlaceOrder}
          >
            {isPlacing ? 'Processing...' : 'Place Your Order'} <ArrowRight size={22} style={{ marginLeft: '1rem' }} />
          </button>
          
          <div style={{ marginTop: '3rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <ShieldCheck size={20} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Secure Pay</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Truck size={20} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Free Pan-India</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <RefreshCw size={20} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Easy Returns</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <style>{`
        .hover-danger:hover {
          color: var(--danger) !important;
          transform: scale(1.1);
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default Cart;
