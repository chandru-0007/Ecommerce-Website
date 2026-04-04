import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Upload } from 'lucide-react';
import { productAPI, adminAPI } from '../services/api';
import { formatPrice } from '../utils/format';
import { motion, AnimatePresence } from 'framer-motion';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    imageUrl: '',
    isFeatured: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await productAPI.getAll();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      description: '', 
      price: '', 
      category: '', 
      brand: '', 
      stock: '', 
      imageUrl: '', 
      isFeatured: false 
    });
    setIsEditing(false);
    setEditProductId(null);
  };

  const handleEditClick = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand || '',
      stock: product.stock,
      imageUrl: product.imageUrl,
      isFeatured: product.isFeatured || false
    });
    setEditProductId(product.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await adminAPI.updateProduct(editProductId, formData);
      } else {
        await adminAPI.addProduct(formData);
      }
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert(`Failed to ${isEditing ? 'update' : 'add'} product`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await adminAPI.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        console.error('Delete error:', err);
        const errorMessage = err.response?.data?.message || err.response?.data || 'Access Denied: Only admins can delete products.';
        alert(`Failed to delete product: ${errorMessage}`);
      }
    }
  };

  return (
    <div className="admin-products container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h1 className="gradient-text">Manage Inventory</h1>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary">
          <Plus size={20} /> Add New Product
        </button>
      </div>

      <div className="glass" style={{ width: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1.25rem' }}>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={product.imageUrl} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                  <span style={{ fontWeight: '500' }}>{product.name}</span>
                </td>
                <td><span className="badge" style={{ background: 'var(--bg-glass)', color: 'var(--text-muted)' }}>{product.category}</span></td>
                <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{formatPrice(product.price)}</td>
                <td>
                  <span style={{ color: product.stock < 10 ? 'var(--danger)' : 'var(--success)', fontWeight: '600' }}>
                    {product.stock} units
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <button onClick={() => handleEditClick(product)} className="btn-outline" style={{ padding: '0.5rem' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(product.id)} className="btn-outline" style={{ padding: '0.5rem', color: 'var(--danger)' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass" 
              style={{ width: '100%', maxWidth: '600px', padding: '3rem', position: 'relative' }}
            >
              <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
              
              <h2 className="gradient-text" style={{ marginBottom: '2rem' }}>{isEditing ? 'Edit Vibe Product' : 'Add New Vibe Product'}</h2>
              
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Product Name</label>
                  <input required placeholder="Ultra Headphones..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Description</label>
                  <textarea rows="3" required placeholder="Tell a story about this product..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Price (INR)</label>
                  <input type="number" required placeholder="15999" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Category</label>
                  <input required placeholder="Electronics" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Brand</label>
                  <input placeholder="VibeAudio" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Stock</label>
                  <input type="number" required placeholder="50" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Image URL</label>
                  <div style={{ position: 'relative' }}>
                    <Upload size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input required placeholder="https://..." style={{ paddingLeft: '3rem' }} value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                  {loading ? (isEditing ? 'Updating...' : 'Creating Product...') : (isEditing ? 'Save Changes' : 'Confirm and Add to Inventory')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
