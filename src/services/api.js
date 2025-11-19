import axios from 'axios';
import { BASE_URL } from '../constants/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = null; // Get from Redux store or AsyncStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;

      if (status === 401) {
        // Unauthorized - token expired or invalid
        // TODO: Refresh token or logout
        console.log('Unauthorized - redirecting to login');
      } else if (status === 403) {
        console.log('Forbidden - access denied');
      } else if (status === 500) {
        console.log('Server error');
      }

      return Promise.reject(data);
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({ message: 'Network error - no response from server' });
    } else {
      // Something else happened
      return Promise.reject({ message: error.message });
    }
  }
);

export default api;
