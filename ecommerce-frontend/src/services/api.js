import axios from 'axios';

// Switch this back to the Render URL once you deploy the latest backend code:
//const API_BASE_URL = 'https://ecommerce-website-2i22.onrender.com/api';
const API_BASE_URL = 'https://ecommerce-website-2i22.onrender.com/api';
//const API_BASE_URL = 'http://localhost:8080/api';
//comments
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include X-User-Id 
api.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('vibe_user');
    if (userString) {
      const user = JSON.parse(userString);
      if (user?.userId) {
        config.headers['X-User-Id'] = user.userId;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to get current userId
const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('vibe_user'));
  return user?.userId;
};

export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  search: (query) => api.get(`/products/search?q=${query}`),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  getFeatured: () => api.get('/products/featured'),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const cartAPI = {
  get: () => api.get(`/cart/${getUserId()}`),
  addItem: (product) => api.post(`/cart/${getUserId()}/items`, { productId: product.id, quantity: 1 }),
  updateItem: (productId, quantity) => api.put(`/cart/${getUserId()}/items/${productId}`, { quantity }),
  removeItem: (productId) => api.delete(`/cart/${getUserId()}/items/${productId}`),
  clear: () => api.delete(`/cart/${getUserId()}`),
};

export const orderAPI = {
  place: (orderData) => api.post(`/orders/${getUserId()}`, orderData),
  getUserOrders: () => api.get(`/orders/${getUserId()}`),
  getById: (orderId) => api.get(`/orders/${getUserId()}/${orderId}`),
  cancel: (orderId) => api.put(`/orders/${getUserId()}/${orderId}/cancel`),
  requestReturn: (orderId) => api.put(`/orders/${getUserId()}/${orderId}/return`),
  // Admin Methods
  getAllOrders: () => api.get('/orders/admin/all'),
  updateStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, { status }),
  processReturn: (orderId, isDamaged) => api.put(`/orders/${orderId}/process-return`, { isDamaged }),
};

export const adminAPI = {
  addProduct: (product) => api.post('/products', product),
  updateProduct: (id, product) => api.put(`/products/${id}`, product),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export const userAPI = {
  getProfile: () => api.get(`/users/${getUserId()}/profile`),
  updateProfile: (data) => api.put(`/users/${getUserId()}/profile`, data),
  changePassword: (data) => api.put(`/users/${getUserId()}/password`, data),
  addAddress: (address) => api.post(`/users/${getUserId()}/addresses`, address),
  updateAddress: (id, address) => api.put(`/users/${getUserId()}/addresses/${id}`, address),
  deleteAddress: (id) => api.delete(`/users/${getUserId()}/addresses/${id}`),
  setDefaultAddress: (id) => api.put(`/users/${getUserId()}/addresses/${id}/default`),
};

export default api;
