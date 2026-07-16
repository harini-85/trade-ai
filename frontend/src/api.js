import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (payload) => api.post('/auth/register', payload),
};

export const productApi = {
  getProducts: () => api.get('/products'),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (payload) => api.post('/products', payload),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getRankings: (id) => api.get(`/products/${id}/rankings`),
  getCompliance: (id, countryId) => api.get(`/products/${id}/compliance/${countryId}`),
  getCost: (id, countryId) => api.get(`/products/${id}/cost/${countryId}`),
  runWhatIf: (id, inputs) => api.post(`/products/${id}/what-if`, inputs),
  explain: (id, countryId, lang) => api.post(`/products/${id}/explain/${countryId}`, { language: lang }),
  chat: (id, countryId, msg, lang) => api.post(`/products/${id}/chat/${countryId}`, { message: msg, language: lang }),
};

export const ordersApi = {
  getPurchaseRequests: () => api.get('/orders-workflow/purchase-requests'),
  createPurchaseRequest: (productId) => api.post('/orders-workflow/purchase-requests', { product_id: productId }),
  getQuotes: () => api.get('/orders-workflow/logistics-quotes'),
  createQuote: (requestId, price, deliveryDays) => api.post('/orders-workflow/logistics-quotes', {
    purchase_request_id: requestId,
    price,
    delivery_days: deliveryDays
  }),
  acceptQuote: (quoteId) => api.post(`/orders-workflow/logistics-quotes/${quoteId}/accept`),
  getOrders: () => api.get('/orders-workflow/orders'),
  updateStatus: (orderId, status, trackingStatus) => api.patch(`/orders-workflow/orders/${orderId}/status`, {
    status,
    tracking_status: trackingStatus
  }),
};

export const chatApi = {
  getHistory: (partnerId) => api.get(`/chat/history/${partnerId}`),
};

export default api;
