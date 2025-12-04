/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import api from './apiService';
import apiConfig from '../config/apiConfig';
import { STORAGE_KEYS } from '../utils/constants';
import employeeService from './employeeService';

// Role mapping
const ROLE_ID_MAP = {
  101: 'EMPLOYEE',
  102: 'MANAGER',
  103: 'TRAVEL_DESK',
  104: 'AVP',
  105: 'SVP',
};

const authService = {
  /**
   * Login user
   * @param {object} credentials - { email, password }
   * @returns {Promise<object>} - { user, token, refreshToken }
   */
  login: async (credentials) => {
    console.log('🔐 Attempting login for:', credentials.email);

    // Step 1: Call Login API
    const loginResponse = await api.login(credentials.email, credentials.password);
    console.log('Login API response:', loginResponse);

    // Check login success
    if (loginResponse.status !== 'Success' || !loginResponse.result) {
      throw new Error('Invalid email or password');
    }

    const roleId = Number(loginResponse.result);
    console.log('✅ Login successful, roleId:', roleId);

    // Step 2: Get employee profile
    const empData = await employeeService.getEmployeeProfile(credentials.email);
    console.log('Employee data:', empData);

    // Step 3: Map roleId to frontend role
    const roleCode = ROLE_ID_MAP[roleId] || 'EMPLOYEE';

    // Step 4: Build user object
    const user = {
      empId: empData.empId,
      email: credentials.email,
      fullName: empData.empName,
      name: empData.empName,
      role: roleCode,
      roleId: roleId,
      refRoleId: empData.refRoleId || roleId,
      rptEmpId: empData.rptEmpId,
      department: empData.department || '',
      designation: empData.designation || ''
    };

    const token = `token_${Date.now()}`;
    const refreshToken = `refresh_${Date.now()}`;

    // Store in localStorage
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

    console.log('✅ Login complete:', user.email, 'Role:', user.role);

    return { user, token, refreshToken };
  },

  /**
   * Logout user
   */
  logout: async () => {
    console.log('🔐 Logging out');
    authService.clearLocalStorage();
    return { success: true };
  },

  /**
   * Get current user from localStorage
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
   */
  getAccessToken: () => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Check if user is authenticated
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
  },

  /**
   * Get user profile
   */
  getProfile: async () => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    return user;
  },

  /**
   * Refresh token (placeholder)
   */
  refreshToken: async () => {
    const token = authService.getAccessToken();
    return { token };
  }
};

export default authService;