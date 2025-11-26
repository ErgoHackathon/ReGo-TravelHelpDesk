import api from './api';

const authService = {
  /**
   * Register a new user
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    
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
   * Login user
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.success) {
      const { user, token, refreshToken } = response.data.data;
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      return response.data.data;
    }
    
    throw new Error('Login failed');
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      // Clear localStorage even if API call fails
      authService.clearLocalStorage();
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

    const response = await api.post('/auth/refresh', { refreshToken });
    
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
    const response = await api.get('/auth/profile');
    
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
    const response = await api.put('/auth/profile', profileData);
    
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
    const response = await api.post('/auth/change-password', passwordData);
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