import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Plus, Trash2, Shield, Lock, Save, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({ phoneNumber: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [addressForm, setAddressForm] = useState({ 
    fullName: '', street: '', city: '', state: '', postalCode: '', country: 'India' 
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await userAPI.getProfile();
      setProfile(res.data);
      setProfileForm({ 
        phoneNumber: res.data.phoneNumber || '', 
        email: res.data.email || '' 
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, error = false) => {
    setMessage(msg);
    setIsError(error);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await userAPI.updateProfile(profileForm);
      showToast('Profile updated successfully');
      fetchProfile();
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', true);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Passwords do not match', true);
      return;
    }
    try {
      await userAPI.changePassword(passwordForm);
      showToast('Password changed successfully');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', true);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await userAPI.addAddress(addressForm);
      showToast('Address added');
      setShowAddressForm(false);
      setAddressForm({ fullName: '', street: '', city: '', state: '', postalCode: '', country: 'India' });
      fetchProfile();
    } catch (err) {
      showToast('Failed to add address', true);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Delete this address?')) {
      try {
        await userAPI.deleteAddress(id);
        fetchProfile();
      } catch (err) {
        showToast('Delete failed', true);
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await userAPI.setDefaultAddress(id);
      fetchProfile();
      showToast('Default address updated');
    } catch (err) {
      showToast('Failed to set default', true);
    }
  };

  if (loading) return <div className="container" style={{ padding: '5rem' }}><div className="loader">Syncing your vibe settings...</div></div>;

  return (
    <div className="settings-page container">
      <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate('/profile')} className="btn-outline" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem' }}>Account Settings</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '4rem' }}>
        {/* Nav */}
        <div className="glass" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{ 
              width: '100%', padding: '1rem', textAlign: 'left', borderRadius: '12px', border: 'none',
              background: activeTab === 'profile' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'profile' ? 'white' : 'var(--text-main)',
              display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '0.5rem'
            }}
          >
            <User size={18} /> Profile Details
          </button>
          <button 
            onClick={() => setActiveTab('addresses')}
            style={{ 
              width: '100%', padding: '1rem', textAlign: 'left', borderRadius: '12px', border: 'none',
              background: activeTab === 'addresses' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'addresses' ? 'white' : 'var(--text-main)',
              display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '0.5rem'
            }}
          >
            <MapPin size={18} /> Addresses
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            style={{ 
              width: '100%', padding: '1rem', textAlign: 'left', borderRadius: '12px', border: 'none',
              background: activeTab === 'security' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'security' ? 'white' : 'var(--text-main)',
              display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer'
            }}
          >
            <Lock size={18} /> Security
          </button>
        </div>

        {/* Content */}
        <div>
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div key="p" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 style={{ marginBottom: '2rem' }}>Personal Information</h3>
                <form onSubmit={handleUpdateProfile} className="glass" style={{ padding: '2.5rem', maxWidth: '600px' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Username</label>
                    <input value={profile?.username} disabled style={{ background: 'var(--bg-glass)', opacity: 0.7 }} />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Email Address</label>
                    <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} />
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Phone Number</label>
                    <input value={profileForm.phoneNumber} onChange={e => setProfileForm({...profileForm, phoneNumber: e.target.value})} placeholder="Enter phone" />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Save size={18} /> Update Profile
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div key="a" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h3>Your Delivery Addresses</h3>
                  <button onClick={() => setShowAddressForm(!showAddressForm)} className="btn btn-primary btn-sm">
                    {showAddressForm ? <ArrowLeft size={16} /> : <Plus size={16} />} 
                    {showAddressForm ? ' Back' : ' Add New Address'}
                  </button>
                </div>

                {showAddressForm ? (
                  <form onSubmit={handleAddAddress} className="glass" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <input required placeholder="Full Name" value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <input required placeholder="Street Address" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} />
                    </div>
                    <div>
                      <input required placeholder="City" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
                    </div>
                    <div>
                      <input required placeholder="State" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} />
                    </div>
                    <div>
                      <input required placeholder="Postal Code" value={addressForm.postalCode} onChange={e => setAddressForm({...addressForm, postalCode: e.target.value})} />
                    </div>
                    <div>
                      <input required placeholder="Country" value={addressForm.country} onChange={e => setAddressForm({...addressForm, country: e.target.value})} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>Save Address</button>
                  </form>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {profile?.addresses?.length === 0 ? (
                      <div className="glass" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        You haven't saved any addresses yet. Add one to place orders!
                      </div>
                    ) : (
                      profile?.addresses?.map(addr => (
                        <div key={addr.addressId} className="glass" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <div style={{ background: 'var(--bg-glass)', padding: '0.75rem', borderRadius: '12px', height: 'fit-content' }}>
                              <MapPin size={24} color="var(--primary)" />
                            </div>
                            <div>
                              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                                {addr.fullName} 
                                {addr.addressId === profile.defaultAddressId && (
                                  <span className="badge" style={{ marginLeft: '1rem', background: 'var(--success-soft)', color: 'var(--success)', fontSize: '0.7rem' }}>Default</span>
                                )}
                              </div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                {addr.street}, {addr.city}<br />
                                {addr.state}, {addr.postalCode}<br />
                                {addr.country}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {addr.addressId !== profile.defaultAddressId && (
                              <button onClick={() => handleSetDefault(addr.addressId)} className="btn-outline btn-sm">Set Default</button>
                            )}
                            <button onClick={() => handleDeleteAddress(addr.addressId)} style={{ border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}>
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div key="s" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3>Security Settings</h3>
                <form onSubmit={handleChangePassword} className="glass" style={{ padding: '2.5rem', maxWidth: '600px' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Current Password</label>
                    <input type="password" required value={passwordForm.oldPassword} onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})} />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>New Password</label>
                    <input type="password" required value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} />
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Confirm New Password</label>
                    <input type="password" required value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Lock size={18} /> Update Password
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{ 
              position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000,
              padding: '1rem 2rem', borderRadius: '12px', color: 'white',
              background: isError ? 'var(--danger)' : 'var(--success)',
              display: 'flex', alignItems: 'center', gap: '1rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}
          >
            {isError ? <Shield size={20} /> : <CheckCircle2 size={20} />}
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
