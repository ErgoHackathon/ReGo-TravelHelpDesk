import axios from 'axios';
import { toast } from 'react-toastify';
import apiConfig from '../config/apiConfig';

/**
 * Axios instance configured for .NET backend
 * This handles all HTTP requests to the real API
 */

// Create axios instance with config from apiConfig
const api = axios.create({
  baseURL: apiConfig.REAL_API_BASE_URL,
  headers: apiConfig.HEADERS,
  timeout: apiConfig.TIMEOUT,
});

// Request interceptor - add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error
    console.error(`❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, error.response?.status);

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('🔄 Attempting token refresh...');
        
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post(
            `${apiConfig.REAL_API_BASE_URL}${apiConfig.ENDPOINTS.REFRESH_TOKEN}`,
            { refreshToken }
          );

          const { token } = response.data.data;
          localStorage.setItem('accessToken', token);

          console.log('✅ Token refreshed successfully');

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        
        // Refresh failed - logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.error?.message || 
                        error.response?.data?.message || 
                        error.message || 
                        'An error occurred';
    
    // Don't show toast for certain errors (to avoid spam)
    const silentErrorCodes = [401, 404];
    if (!silentErrorCodes.includes(error.response?.status)) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default api;

/**
 * EXAMPLE USAGE:
 * 
 * import api from './services/api';
 * 
 * // GET request
 * const response = await api.get('/travel-requests');
 * 
 * // POST request
 * const response = await api.post('/travel-requests', data);
 * 
 * // PUT request
 * const response = await api.put('/travel-requests/123', data);
 * 
 * // DELETE request
 * const response = await api.delete('/travel-requests/123');
 */