import React from 'react';
import { ShoppingCart, LogIn, User, LogOut, Package, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: '1rem',
      margin: '1rem',
      padding: '0.75rem 1.5rem',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
        <Package className="gradient-text" />
        <span className="gradient-text">VibeStore</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/shop" style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '500', textDecoration: 'none' }}>Shop</Link>
          <Link to="/about" style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '500', textDecoration: 'none' }}>About</Link>
        </div>

        <div style={{
          height: '1.5rem',
          width: '1px',
          background: 'var(--glass-border)',
          margin: '0 0.5rem'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/cart" style={{ position: 'relative', color: 'inherit' }}>
            <ShoppingCart size={22} color="var(--text-main)" />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'var(--primary)',
                color: 'white',
                fontSize: '0.7rem',
                minWidth: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px',
                fontWeight: 'bold'
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/profile" style={{ color: 'inherit' }}>
                <User size={22} color="var(--text-main)" />
              </Link>
              <button onClick={logout} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}>
                <LogOut size={22} color="var(--danger)" />
              </button>
            </div>
          ) : (
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit' }}>
              <LogIn size={22} color="var(--text-main)" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
