import React from 'react';
import { motion } from 'framer-motion';
import { Target, Heart, Award, Users, Rocket, Sparkles } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Happy Customers', value: '50K+', icon: <Users size={24} /> },
    { label: 'Premium Products', value: '1.2K+', icon: <Award size={24} /> },
    { label: 'Cities Covered', value: '200+', icon: <Rocket size={24} /> },
    { label: 'Design Awards', value: '12', icon: <Sparkles size={24} /> },
  ];

  return (
    <div className="about-page container" style={{ paddingBottom: '10rem' }}>
      <header style={{ textAlign: 'center', padding: '6rem 0' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="badge" style={{ background: 'var(--accent-soft)', color: 'var(--accent)', marginBottom: '1.5rem' }}>Our Story</span>
          <h1 className="gradient-text" style={{ fontSize: '4.5rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
            Elevating the Everyday <br /> Through Pure Vibe.
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.8' }}>
            VibeStore isn't just an e-commerce platform. It's a curated experience for those who value aesthetics as much as performance.
          </p>
        </motion.div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '8rem' }}>
        <motion.div 
          whileHover={{ y: -10 }}
          className="glass" 
          style={{ padding: '3rem', textAlign: 'center' }}
        >
          <div style={{ width: '60px', height: '60px', background: 'var(--accent-soft)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <Target size={32} />
          </div>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Our Mission</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>To bridge the gap between high-end industrial design and functional utility, making premium aesthetics accessible to all.</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -10 }}
          className="glass" 
          style={{ padding: '3rem', textAlign: 'center' }}
        >
          <div style={{ width: '60px', height: '60px', background: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <Heart size={32} />
          </div>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Core Values</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>Transparency, sustainability, and uncompromising quality are the pillars of everything we curate.</p>
        </motion.div>
      </section>

      <section className="glass" style={{ padding: '6rem 3rem', marginBottom: '8rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)', zIndex: 0 }} />
        
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Vibe By The Numbers</h2>
          <p style={{ color: 'var(--text-muted)' }}>The impact we've made since our inception in 2024.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', position: 'relative', zIndex: 1 }}>
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'inline-block' }}>{stat.icon}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }} className="gradient-text">{stat.value}</div>
              <div style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '3rem' }}>Ready to join the vibe?</h2>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary" 
          style={{ padding: '1.25rem 3rem', fontSize: '1.125rem' }}
          onClick={() => window.location.href = '/shop'}
        >
          Start Shopping
        </motion.button>
      </section>
    </div>
  );
};

export default About;
