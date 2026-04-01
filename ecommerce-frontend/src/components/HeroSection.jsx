import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="glass" style={{ 
      padding: '6rem 4rem', 
      marginTop: '2rem', 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      alignItems: 'center', 
      gap: '4rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '300px', height: '300px', background: 'var(--accent)', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%' }} />

      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="badge" style={{ background: 'var(--accent-soft)', color: 'var(--accent)', marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={14} /> New Arrivals 2026
        </span>
        <h1 style={{ fontSize: '4.5rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.1' }}>
          Redefine Your <span className="gradient-text">Lifestyle</span> Vibe.
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '500px', lineHeight: '1.6' }}>
          Discover a curated collection of premium electronics and accessories designed for the modern era. Experience quality like never before.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/shop" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem', textDecoration: 'none' }}>
            Shop Collection <ArrowRight size={20} />
          </Link>
          <Link to="/about" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.125rem', textDecoration: 'none' }}>
            Learn More
          </Link>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ position: 'relative' }}
      >
        <div className="glass animate-float" style={{ padding: '1rem', borderRadius: '2rem', position: 'relative', zIndex: 1 }}>
          <img 
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000" 
            alt="Premium Headphones" 
            style={{ width: '100%', height: 'auto', borderRadius: '1.5rem', display: 'block' }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
