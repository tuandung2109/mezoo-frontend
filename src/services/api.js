import axios from 'axios';

// Auto-detect API URL based on environment
const getApiUrl = () => {
  // 1. Nếu có VITE_API_BASE_URL trong .env, dùng nó
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // 2. Nếu đang chạy local (localhost hoặc 127.0.0.1), dùng local backend
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'https://mozi-backend.onrender.com/api';
  }
  
  // 3. Nếu đang ở production, dùng production backend
  return 'https://mozi-backend.onrender.com/api';
};

const API_URL = getApiUrl();

console.log('🚀 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
