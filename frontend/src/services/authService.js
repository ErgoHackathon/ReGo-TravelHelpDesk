/**
 * Authentication Service
 * Handles all authentication-related API calls
 * Automatically switches between mock and real API based on environment
 */

import apiClient from '../api/client';
import mockDataService from './mockDataService';
import apiConfig, { ENDPOINTS } from '../config/apiConfig';
import { STORAGE_KEYS } from '../utils/constants';
import { ROLE_ID_MAP,ROLES } from '../utils/constants';

const authService = {
  /**
   * Login user
   * @param {object} credentials - { email, password }
   * @returns {Promise<object>} - { user, token, refreshToken }
   */
  login: async (credentials) => {
  let response;

  if (apiConfig.USE_MOCK_API) {
    console.log('🔵 Using MOCK API for login');
    response = await mockDataService.login(credentials);
  } else {
    console.log('🟢 Using REAL API for login');
    response = await apiClient.post(`${ENDPOINTS.AUTH.LOGIN}`, null, {
      params: {
        username: credentials.email,
        password: credentials.password
      }
    });
  }

  console.log('Login API response:', response.data);

  if (response.data.status === 'Success') {
    const userId = response.data.result; // backend only returns an ID
    // If you need full user info or token, call getProfile or another endpoint
    const user = { id: userId, email: credentials.email, role: ROLES.EMPLOYEE };
    const token = 'dummy-token'; // Replace with actual token if backend provides later
    const refreshToken = null;

    // Store in localStorage
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    if (refreshToken) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

    console.log('✅ Login successful:', user.email);
    return { user, token, refreshToken };
  }

  throw new Error('Login failed');
},

  /**
   * Register a new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} - { user, token, refreshToken }
   */
  register: async (userData) => {
    let response;

    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK API for register');
      response = await mockDataService.register(userData);
    } else {
      console.log('🟢 Using REAL API for register');
      response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);
    }

    if (response.data.success) {
      const { user, token, refreshToken } = response.data.data;

      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

      console.log('✅ Registration successful:', user.email);
      return response.data.data;
    }

    throw new Error(response.data.error?.message || 'Registration failed');
  },

  
  /**
   * Get user profile
   * @returns {Promise<object>} - User object
   */
  getProfile: async () => {
    let response;

    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK API for getProfile');
      response = await mockDataService.getProfile();
    } else {
      console.log('🟢 Using REAL API for getProfile');
      response = await apiClient.get(ENDPOINTS.AUTH.GET_PROFILE);
    }

    if (response.data.success) {
      const user = response.data.data;

      // Map numeric role ID to frontend role string
      const roleName = ROLE_ID_MAP[user.refRoleId] || ROLES.EMPLOYEE;
      const userWithRole = { ...user, role: roleName };

      // Update localStorage
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userWithRole));

      return userWithRole;
    }

    throw new Error('Failed to get profile');
  },

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      if (apiConfig.USE_MOCK_API) {
        console.log('🔵 Using MOCK API for logout');
        await mockDataService.logout();
      } else {
        console.log('🟢 Using REAL API for logout');
        await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
      }
    } finally {
      // Clear localStorage even if API call fails
      authService.clearLocalStorage();
      console.log('✅ Logged out successfully');
    }
  },

  /**
   * Refresh access token
   * @returns {Promise<object>} - { token }
   */
  refreshToken: async () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    if (apiConfig.USE_MOCK_API) {
      // For mock, just return the existing token
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      return { token };
    }

    const response = await apiClient.post(ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });

    if (response.data.success) {
      const { token } = response.data.data;
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      return { token };
    }

    throw new Error('Token refresh failed');
  },

  /**
   * Get user profile
   * @returns {Promise<object>} - User object
   */
  getProfile: async () => {
    let response;

    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK API for getProfile');
      response = await mockDataService.getProfile();
    } else {
      console.log('🟢 Using REAL API for getProfile');
      response = await apiClient.get(ENDPOINTS.AUTH.GET_PROFILE);
    }

    if (response.data.success) {
      const user = response.data.data;

      // Update localStorage
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      return user;
    }

    throw new Error('Failed to get profile');
  },

  /**
   * Update user profile
   * @param {object} updates - Profile updates
   * @returns {Promise<object>} - Updated user object
   */
  updateProfile: async (updates) => {
    let response;

    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK API for updateProfile');
      response = await mockDataService.updateProfile(updates);
    } else {
      console.log('🟢 Using REAL API for updateProfile');
      response = await apiClient.put(ENDPOINTS.AUTH.UPDATE_PROFILE, updates);
    }

    if (response.data.success) {
      const user = response.data.data;

      // Update localStorage
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      return user;
    }

    throw new Error('Failed to update profile');
  },

  /**
   * Change password
   * @param {object} passwords - { currentPassword, newPassword }
   * @returns {Promise<void>}
   */
  changePassword: async (passwords) => {
    let response;

    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK API for changePassword');
      // Mock doesn't actually change password
      response = { data: { success: true } };
    } else {
      console.log('🟢 Using REAL API for changePassword');
      response = await apiClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, passwords);
    }

    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to change password');
    }
  },

  /**
   * Get current user from localStorage
   * @returns {object|null} - User object or null
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },

  /**
   * Get access token from localStorage
   * @returns {string|null} - Access token or null
   */
  getAccessToken: () => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if authenticated
   */
  isAuthenticated: () => {
    const token = authService.getAccessToken();
    const user = authService.getCurrentUser();
    return !!(token && user);
  },

  /**
   * Clear all auth data from localStorage
   */
  clearLocalStorage: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
};

export default authService;