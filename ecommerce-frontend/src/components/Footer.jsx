import React from 'react';
import { Send, Globe, Link as LinkIcon, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="footer glass" style={{ marginTop: '5rem', borderTop: '1px solid var(--glass-border)', padding: '5rem 0 2rem' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: '4rem' }}>
        <div className="footer-brand">
          <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1.5rem', letterSpacing: '-1px' }}>VIBE STORE</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2rem' }}>
            Elevating your lifestyle with curated premium essentials. Experience the perfect blend of high-end design and functional brilliance.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {[Globe, LinkIcon, MessageCircle].map((Icon, i) => (
              <a key={i} href="#" style={{ background: 'var(--bg-glass)', padding: '0.75rem', borderRadius: '50%', color: 'var(--text-main)', transition: '0.3s' }}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-links">
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Collection</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Electronics', 'Fashion', 'Home Decor', 'Accessories', 'Limited Drops'].map(link => (
              <li key={link}><a href="/shop" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.95rem' }}>{link}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer-links">
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Support</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Track Order', 'Shipping Policy', 'Returns & Refunds', 'Privacy Policy', 'Terms of Service'].map(link => (
              <li key={link}><a href="#" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.95rem' }}>{link}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer-newsletter">
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Stay in the Vibe</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <div style={{ position: 'relative' }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="glass" 
              style={{ padding: '1rem 3.5rem 1rem 1.5rem', width: '100%', borderRadius: '12px' }}
            />
            <button className="btn btn-primary" style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', padding: '0.5rem' }}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <p>© 2026 Vibe Store. Crafted for the Modern Lifestyle.</p>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={14} /> support@vibestore.com</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} /> +91 1800-VIBE-00</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
