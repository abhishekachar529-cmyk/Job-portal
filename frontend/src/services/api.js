// frontend/src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// ✅ Add token to requests with better debugging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // ✅ Debug logging
    console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
    
    if (token) {
      // ✅ Trim token to remove any whitespace
      const cleanToken = token.trim();
      config.headers.Authorization = `Bearer ${cleanToken}`;
      console.log('🔑 Token attached:', cleanToken.substring(0, 20) + '...');
    } else {
      console.log('⚠️ No token found');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ Handle response errors with better messages
api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error);
    
    if (error.response) {
      // Server responded with error status
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      
      // ✅ Handle different error status codes
      if (error.response.status === 401) {
        console.log('🔒 Unauthorized - Clearing session');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // ✅ Redirect to login with current path for return
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
      
      if (error.response.status === 403) {
        console.log('🚫 Forbidden - Insufficient permissions');
      }
      
      if (error.response.status === 404) {
        console.log('🔍 Not Found - Endpoint does not exist');
      }
      
      if (error.response.status === 500) {
        console.log('💥 Server Error - Please try again later');
      }
      
    } else if (error.request) {
      // Request made but no response
      console.error('📡 No response received:', error.request);
      console.error('💡 Check if backend is running on port 5000');
    } else {
      // Something else happened
      console.error('❌ Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// ✅ Helper methods for common requests
export const apiService = {
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  delete: (url, config) => api.delete(url, config),
  patch: (url, data, config) => api.patch(url, data, config),
};

export default api;