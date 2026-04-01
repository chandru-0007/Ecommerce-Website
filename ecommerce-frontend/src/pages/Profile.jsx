import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, LogOut, Package, CreditCard, ChevronRight, Settings, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { formatPrice } from '../utils/format';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, logout, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getUserOrders();
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page container">
      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '3rem', alignItems: 'start' }}>
        {/* Sidebar Info */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass" 
          style={{ padding: '3rem', textAlign: 'center' }}
        >
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary), var(--accent))', 
            margin: '0 auto 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)'
          }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{user?.username}</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            <Mail size={16} /> {user?.email}
          </div>

          <div className="badge" style={{ 
            background: isAdmin ? 'rgba(139, 92, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
            color: isAdmin ? 'var(--accent)' : 'var(--success)', 
            marginBottom: '3rem',
            display: 'inline-block'
          }}>
            <Shield size={12} style={{ marginRight: '0.25rem' }} /> {user?.role} Account
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button onClick={() => navigate('/settings')} className="btn btn-outline" style={{ width: '100%' }}>
              <Settings size={18} /> Account Settings
            </button>
            <button onClick={handleLogout} className="btn-outline" style={{ width: '100%', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {isAdmin ? (
            <div className="admin-hub">
              <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '2.5rem' }}>Admin Control Center</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <Link to="/admin/products" className="glass" style={{ padding: '2.5rem', textAlign: 'center', textDecoration: 'none', color: 'inherit', border: '1px solid var(--accent)' }}>
                  <Package size={48} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Manage Products</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Inventory control, adding new items, and pricing.</p>
                </Link>
                
                <Link to="/admin/orders" className="glass" style={{ padding: '2.5rem', textAlign: 'center', textDecoration: 'none', color: 'inherit', border: '1px solid var(--primary)' }}>
                  <CreditCard size={48} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Manage Orders</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Customer fulfillment and logistics tracking.</p>
                </Link>
              </div>

              <div className="glass" style={{ marginTop: '3rem', padding: '2.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Quick Stats</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>12+</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active Products</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>₹1.2L</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Revenue</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>24</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pending Orders</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="customer-hub">
              <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '2.5rem' }}>Your Journey</h2>
              
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Recent Orders</h3>
              
              {loading ? (
                <div className="loader">Filing your records...</div>
              ) : orders.length === 0 ? (
                <div className="glass" style={{ padding: '4rem', textAlign: 'center' }}>
                  <Package size={48} color="var(--text-muted)" style={{ marginBottom: '1.5rem' }} />
                  <p style={{ color: 'var(--text-muted)' }}>No orders placed yet. Start your vibe journey today!</p>
                  <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Go to Shop</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {orders.map(order => {
                    const deliveredTime = order.deliveredAt ? new Date(order.deliveredAt).getTime() : new Date(order.updatedAt).getTime();
                    const now = new Date().getTime();
                    const isReturnable = order.status === 'DELIVERED' && (now - deliveredTime) <= (5 * 24 * 60 * 60 * 1000);
                    const daysLeft = Math.ceil((5 * 24 * 60 * 60 * 1000 - (now - deliveredTime)) / (24 * 60 * 60 * 1000));

                    return (
                      <div key={order.id} className="glass" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
                          <div style={{ background: 'var(--bg-glass)', padding: '0.75rem', borderRadius: '12px' }}>
                            <Package size={24} color="var(--primary)" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>Order #{order.id.slice(-8)}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(order.placedAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--success)' }}>{formatPrice(order.totalAmount)}</div>
                            <div className="badge" style={{ 
                              fontSize: '0.7rem', 
                              padding: '0.15rem 0.5rem',
                              background: order.status === 'DELIVERED' ? 'rgba(16, 185, 129, 0.1)' : 
                                         order.status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                              color: order.status === 'DELIVERED' ? 'var(--success)' : 
                                     order.status === 'CANCELLED' ? 'var(--danger)' : 'var(--primary)'
                            }}>
                              {order.status}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            {order.status === 'PLACED' && (
                              <button 
                                onClick={() => {
                                  if(window.confirm('Cancel this order?')) {
                                    orderAPI.cancel(order.id).then(() => fetchOrders()).catch(err => alert(err.response?.data?.message || 'Failed'));
                                  }
                                }}
                                className="btn-outline" 
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                              >
                                Cancel Order
                              </button>
                            )}
                            
                            {isReturnable && (
                              <div style={{ textAlign: 'center' }}>
                                <button 
                                  onClick={() => {
                                    if(window.confirm('Request a return for this order?')) {
                                      orderAPI.requestReturn(order.id).then(() => fetchOrders()).catch(err => alert(err.response?.data?.message || 'Failed'));
                                    }
                                  }}
                                  className="btn-primary" 
                                  style={{ padding: '0.4rem 1.2rem', fontSize: '0.75rem' }}
                                >
                                  Request Return
                                </button>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                  {daysLeft} days left to return
                                </div>
                              </div>
                            )}

                            {(order.status === 'DELIVERED' && !isReturnable) && (
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                Return window closed
                              </div>
                            )}
                          </div>
                          
                          <ChevronRight size={20} color="var(--text-muted)" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="glass" style={{ marginTop: '3rem', padding: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ marginBottom: '0.5rem' }}>Premium Support</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>As a vibe member, you have access to priority support.</p>
                </div>
                <button className="btn btn-outline"><ExternalLink size={18} /> Contact VibeCare</button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
