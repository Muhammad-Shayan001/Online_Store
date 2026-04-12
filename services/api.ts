import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://os-backend-production-92e5.up.railway.app/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for cross-origin cookies between Vercel and Railway
});

// Add a request interceptor to include token if we stored it (Wait, we use httpOnly cookies)
// So we don't need to manually attach token for JWT if using Cookies.
// BUT, my backend implementation uses `req.cookies.jwt`.
// So simple axios requests with `withCredentials: true` is enough?
// However, I put `res.cookie` in backend.
// Does Axios send cookies automatically? Needs `withCredentials: true`.

// BUT, `generateToken` handles the cookie setting.
// I just need to make sure axios sends cookies.

// Wait, I can't easily rely on HttpOnly cookies if looking at local development across ports without proper setup, 
// but Vite proxy handles this well.
// So `withCredentials: true` is not strictly needed if proxied, but good practice.
// Actually, proxy makes it same domain, so cookies "just work".

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    return Promise.reject(message);
    // User can catch this.
  }
);

export const ProductService = {
  getProducts: async (keyword = '', pageNumber = 1) => {
    const { data } = await api.get(`/products?keyword=${keyword}&pageNumber=${pageNumber}`);
    return data;
  },
  getProductById: async (id: string) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },
  createProduct: async () => {
    const { data } = await api.post(`/products`, {});
    return data;
  },
  updateProduct: async (id: string, productData: any) => {
    const { data } = await api.put(`/products/${id}`, productData);
    return data;
  },
  deleteProduct: async (id: string) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },
  createReview: async (id: string, review: any) => {
    const { data } = await api.post(`/products/${id}/reviews`, review);
    return data;
  },
};

export const UserService = {
  login: async (credentials: any) => {
    const { data } = await api.post('/users/login', credentials);
    return data;
  },
  register: async (userData: any) => {
    const { data } = await api.post('/users', userData);
    return data;
  },
  logout: async () => {
    const { data } = await api.post('/users/logout');
    return data;
  },
  verifyOTP: async (otp: string) => {
      const { data } = await api.post('/users/verify-otp', { otp });
      return data;
  },
  getProfile: async () => {
      const { data } = await api.get('/users/profile');
      return data;
  },
  updateProfile: async (userData: any) => {
      const { data } = await api.put('/users/profile', userData);
      return data;
  },
  forgotPassword: async (email: string) => {
      const { data } = await api.post('/users/forgot-password', { email });
      return data;
  },
  resetPassword: async (token: string, password: string) => {
      const { data } = await api.put(`/users/reset-password/${token}`, { password });
      return data;
  },
  getWishlist: async () => {
    const { data } = await api.get('/users/wishlist');
    return data;
  },
  addToWishlist: async (productId: string) => {
    const { data } = await api.post('/users/wishlist', { productId });
    return data;
  },
  removeFromWishlist: async (productId: string) => {
    const { data } = await api.delete(`/users/wishlist/${productId}`);
    return data;
  }
};

export const OrderService = {
    createOrder: async (orderData: any) => {
        const { data } = await api.post('/orders', orderData);
        return data;
    },
    getOrderById: async (id: string) => {
        const { data } = await api.get(`/orders/${id}`);
        return data;
    },
    cancelOrder: async (id: string) => {
        const { data } = await api.put(`/orders/${id}/cancel`);
        return data;
    },
    getMyOrders: async () => {
        const { data } = await api.get('/orders/myorders');
        return data;
    },
    getOrders: async () => {
        const { data } = await api.get('/orders');
        return data;
    },
    payOrder: async (id: string, paymentResult: any) => {
        const { data } = await api.put(`/orders/${id}/pay`, paymentResult);
        return data;
    },
    deliverOrder: async (id: string) => {
        const { data } = await api.put(`/orders/${id}/deliver`);
        return data;
    }
};

export const TicketService = {
    createTicket: async (ticketData: any) => {
      const response = await api.post('/tickets', ticketData);
      return response.data;
    },
    getTickets: async () => {
      const response = await api.get('/tickets');
      return response.data;
    },
    updateTicket: async (id: string, updates: any) => {
      const response = await api.put(`/tickets/${id}`, updates);
      return response.data;
    }
};

export default api;
