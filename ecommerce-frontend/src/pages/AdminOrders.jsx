import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronDown, User, Calendar, CreditCard } from 'lucide-react';
import { orderAPI } from '../services/api';
import { formatPrice } from '../utils/format';
import { motion, AnimatePresence } from 'framer-motion';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getAllOrders();
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      // Mock data for demo if backend endpoint is not yet available
      setOrders([
        { id: 'ORD-001', userId: 'user1', totalAmount: 25999.00, status: 'PLACED', placedAt: new Date(), items: [{ name: 'Test Product', quantity: 1, price: 25999 }] },
        { id: 'ORD-002', userId: 'user2', totalAmount: 1299.00, status: 'SHIPPED', placedAt: new Date(), items: [{ name: 'Headphones', quantity: 1, price: 1299 }] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PLACED': return <Clock size={16} color="var(--accent)" />;
      case 'SHIPPED': return <Truck size={16} color="var(--primary)" />;
      case 'DELIVERED': return <CheckCircle size={16} color="var(--success)" />;
      case 'CANCELLED': return <XCircle size={16} color="var(--danger)" />;
      case 'RETURN_REQUESTED': return <Clock size={16} color="var(--accent)" />;
      case 'REFUNDED': return <CreditCard size={16} color="var(--success)" />;
      default: return <Package size={16} />;
    }
  };

  const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="admin-orders container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 className="gradient-text">Customer Orders</h1>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['ALL', 'PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'REFUNDED'].map(stat => (
            <button 
              key={stat}
              onClick={() => setFilter(stat)}
              className={filter === stat ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}
            >
              {stat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loader">Analyzing logistics records...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
          {filteredOrders.map(order => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={order.id} 
              className="glass" 
              style={{ padding: '2rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', color: 'var(--primary)' }}>{order.id}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    <Calendar size={14} /> {new Date(order.placedAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-glass)', padding: '0.5rem 1rem', borderRadius: '1rem', fontSize: '0.85rem' }}>
                  {getStatusIcon(order.status)}
                  <span style={{ fontWeight: 'bold' }}>{order.status}</span>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <User size={18} color="var(--text-muted)" />
                  <span style={{ fontWeight: '500' }}>Customer: {order.userId}</span>
                </div>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.name} × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1rem', background: 'var(--bg-glass)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <CreditCard size={18} />
                  <span>Total Amount</span>
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>{formatPrice(order.totalAmount)}</span>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                {order.status === 'RETURN_REQUESTED' ? (
                  <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                    <button 
                      onClick={() => {
                        if(window.confirm('Approve refund? Product must not be damaged.')) {
                          orderAPI.processReturn(order.id, false).then(() => fetchOrders());
                        }
                      }}
                      className="btn btn-primary" 
                      style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem' }}
                    >
                      Approve (Safe)
                    </button>
                    <button 
                      onClick={() => {
                        if(window.confirm('Reject refund? Product will be marked as delivered (Damaged).')) {
                          orderAPI.processReturn(order.id, true).then(() => fetchOrders());
                        }
                      }}
                      className="btn-outline" 
                      style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                    >
                      Reject (Damaged)
                    </button>
                  </div>
                ) : (
                  <div style={{ position: 'relative', flex: 1 }}>
                    <select 
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      value={order.status}
                      disabled={['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(order.status)}
                      className="glass"
                      style={{ 
                        padding: '0.75rem 2.5rem 0.75rem 1rem', 
                        width: '100%', 
                        appearance: 'none', 
                        cursor: ['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(order.status) ? 'not-allowed' : 'pointer', 
                        outline: 'none',
                        opacity: ['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(order.status) ? 0.6 : 1
                      }}
                    >
                      <option value="PLACED">Placed</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                      {order.status === 'REFUNDED' && <option value="REFUNDED">Refunded</option>}
                    </select>
                    {!['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(order.status) && (
                      <ChevronDown size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
