import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
  getMe: () => api.get('/auth/me'),
  googleLogin: () => {
    // Use full URL to Google OAuth endpoint
    const baseURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    window.location.href = `${baseURL}/api/auth/google`;
  }
};

// Password endpoints
export const passwordAPI = {
  forgotPassword: (email) => api.post('/password/forgot', { email })
};

export default api;