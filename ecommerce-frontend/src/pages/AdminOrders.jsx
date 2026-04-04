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
      // Enhanced Mock data removed in favor of real API data
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '900px', margin: '0 auto' }}>
          {[1, 2, 3].map(n => (
            <div key={n} className="glass" style={{ padding: '2.5rem', height: '300px' }}>
              <div className="skeleton skeleton-title" style={{ width: '40%' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem', marginTop: '2rem' }}>
                <div className="skeleton" style={{ height: '100px' }} />
                <div className="skeleton" style={{ height: '100px' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="admin-orders-list"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          initial="hidden"
          animate="show"
          style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '900px', margin: '0 auto' }}
        >
          {filteredOrders.map(order => (
            <motion.div 
              layout
              variants={{
                hidden: { opacity: 0, x: -50 },
                show: { opacity: 1, x: 0 }
              }}
              key={order.id} 
              className="glass order-card-premium" 
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '2.5rem' }}>
                {/* Header: ID and Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                  <div>
                    <div style={{ textTransform: 'uppercase', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '0.5rem' }}>Reference Batch</div>
                    <motion.h3 
                      whileHover={{ scale: 1.02 }}
                      style={{ fontSize: '1.5rem', fontFamily: 'monospace', cursor: 'help' }}
                      title={order.id}
                    >
                      {order.id}
                    </motion.h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                      <Calendar size={14} /> {new Date(order.placedAt).toLocaleString()}
                    </div>
                  </div>
                  <motion.div 
                    animate={{ 
                      scale: order.status === 'PLACED' ? [1, 1.05, 1] : 1,
                      rotate: order.status === 'RETURN_REQUESTED' ? [0, -2, 2, 0] : 0
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.75rem', 
                      background: 'var(--bg-glass)', padding: '0.75rem 1.25rem', 
                      borderRadius: '14px', border: '1px solid var(--glass-border)',
                      boxShadow: order.status === 'PLACED' ? '0 0 15px var(--primary-soft)' : 'none'
                    }}
                  >
                    {getStatusIcon(order.status)}
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{order.status}</span>
                  </motion.div>
                </div>

                {/* Customer Info Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem', marginBottom: '2.5rem', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      <User size={18} color="var(--primary)" />
                      <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{order.userName || 'System User'}</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Package size={14} /> ID: {order.userId.slice(-6)}
                    </div>
                    {order.userEmail && <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{order.userEmail}</div>}
                  </div>
                  <div style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                      <Truck size={18} />
                      <span style={{ fontWeight: '600' }}>Delivery Destination</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                      {order.deliveryAddress ? (
                        <>
                          {order.deliveryAddress.street}, {order.deliveryAddress.city}<br />
                          {order.deliveryAddress.state}, {order.deliveryAddress.postalCode}<br />
                          {order.deliveryAddress.country}
                        </>
                      ) : 'No shipping address provided.'}
                    </p>
                  </div>
                </div>

                {/* Items Section */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-main)' }}>Consignment Details</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="glass" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 1.5rem', alignItems: 'center', background: 'var(--bg-glass)', border: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                          <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                            <img src={item.imageUrl || 'https://via.placeholder.com/50'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: '500' }}>{item.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quantity: {item.quantity}</div>
                          </div>
                        </div>
                        <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer: Amount and Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div className="glass" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--primary-soft)', border: 'none' }}>
                      <CreditCard size={20} color="var(--primary)" />
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Consignment Value</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{formatPrice(order.totalAmount)}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ width: '300px' }}>
                    {order.status === 'RETURN_REQUESTED' ? (
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                          onClick={() => {
                            if(window.confirm('Approve refund? Product must not be damaged.')) {
                              orderAPI.processReturn(order.id, false).then(() => fetchOrders());
                            }
                          }}
                          className="btn btn-primary" 
                          style={{ flex: 1, padding: '1rem' }}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm('Reject refund? Product will be marked as delivered (Damaged).')) {
                              orderAPI.processReturn(order.id, true).then(() => fetchOrders());
                            }
                          }}
                          className="btn-outline" 
                          style={{ flex: 1, padding: '1rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div style={{ position: 'relative' }}>
                        <select 
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          value={order.status}
                          disabled={['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(order.status)}
                          className="glass"
                          style={{ 
                            padding: '1rem 3rem 1rem 1.5rem', 
                            width: '100%', 
                            appearance: 'none', 
                            cursor: ['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(order.status) ? 'not-allowed' : 'pointer', 
                            outline: 'none',
                            fontSize: '0.9rem',
                            fontWeight: '600',
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
                          <ChevronDown size={18} style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AdminOrders;
