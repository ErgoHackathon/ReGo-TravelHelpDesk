import api from './api';
import mockDataService from './mockDataService';
import apiConfig from '../config/apiConfig';

/**
 * Auth Service
 * Handles all authentication-related API calls
 * Automatically switches between mock and real API based on apiConfig
 */

const authService = {
  /**
   * Login user
   */
  login: async (credentials) => {
    let response;
    
    if (apiConfig.USE_MOCK_API) {
      // Use mock data
      console.log('🔵 Using MOCK API for login');
      response = await mockDataService.login(credentials);
    } else {
      // Use real .NET API
      console.log('🟢 Using REAL API for login');
      response = await api.post(apiConfig.ENDPOINTS.LOGIN, credentials);
    }
    
    if (response.data.success) {
      const { user, token, refreshToken } = response.data.data;
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      console.log('✅ Login successful:', user.email);
      return response.data.data;
    }
    
    throw new Error('Login failed');
  },

  /**
   * Register a new user
   */
  register: async (userData) => {
    let response;
    
    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK API for register');
      response = await mockDataService.register(userData);
    } else {
      console.log('🟢 Using REAL API for register');
      response = await api.post(apiConfig.ENDPOINTS.REGISTER, userData);
    }
    
    if (response.data.success) {
      const { user, token, refreshToken } = response.data.data;
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      return response.data.data;
    }
    
    throw new Error('Registration failed');
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      if (apiConfig.USE_MOCK_API) {
        console.log('🔵 Using MOCK API for logout');
        await mockDataService.logout();
      } else {
        console.log('🟢 Using REAL API for logout');
        await api.post(apiConfig.ENDPOINTS.LOGOUT);
      }
    } finally {
      // Clear localStorage even if API call fails
      authService.clearLocalStorage();
      console.log('✅ Logged out successfully');
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // For mock, just return the existing token
    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Mock: Returning existing token');
      return localStorage.getItem('accessToken');
    }

    console.log('🟢 Using REAL API for token refresh');
    const response = await api.post(apiConfig.ENDPOINTS.REFRESH_TOKEN, { refreshToken });
    
    if (response.data.success) {
      const { token } = response.data.data;
      localStorage.setItem('accessToken', token);
      return token;
    }
    
    throw new Error('Token refresh failed');
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    let response;
    
    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK API for profile');
      response = await mockDataService.getProfile();
    } else {
      console.log('🟢 Using REAL API for profile');
      response = await api.get(apiConfig.ENDPOINTS.GET_PROFILE);
    }
    
    if (response.data.success) {
      const user = response.data.data;
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    
    throw new Error('Failed to fetch profile');
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData) => {
    // Only real API for now (implement mock if needed)
    console.log('🟢 Using REAL API for update profile');
    const response = await api.put(apiConfig.ENDPOINTS.UPDATE_PROFILE, profileData);
    
    if (response.data.success) {
      const user = response.data.data;
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    
    throw new Error('Failed to update profile');
  },

  /**
   * Change password
   */
  changePassword: async (passwordData) => {
    // Only real API for now (implement mock if needed)
    console.log('🟢 Using REAL API for change password');
    const response = await api.post(apiConfig.ENDPOINTS.CHANGE_PASSWORD, passwordData);
    return response.data;
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Get access token from localStorage
   */
  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  /**
   * Clear all auth data from localStorage
   */
  clearLocalStorage: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

export default authService;