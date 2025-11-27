/**
 * API Configuration
 * 
 * INSTRUCTIONS FOR SWITCHING TO REAL .NET API:
 * 1. Change USE_MOCK_API to false
 * 2. Update REAL_API_BASE_URL with your .NET backend URL
 * 3. That's it! Everything else works automatically.
 */

const apiConfig = {
  // Toggle between mock and real API
  USE_MOCK_API: true, // Set to FALSE when .NET backend is ready
  
  // Mock API settings
  MOCK_DELAY: 800, // Milliseconds to simulate network delay
  
  // Real API settings (Update these when backend is ready)
  REAL_API_BASE_URL: process.env.REACT_APP_API_URL || 'https://your-dotnet-api.com/api',
  
  // API endpoints (these will work for both mock and real API)
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    GET_PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    
    // Travel Request endpoints (for future)
    TRAVEL_REQUESTS: '/travel-requests',
    TRAVEL_REQUEST_BY_ID: (id) => `/travel-requests/${id}`,
    SUBMIT_REQUEST: (id) => `/travel-requests/${id}/submit`,
    
    // Approval endpoints (for future)
    PENDING_APPROVALS: '/approvals/pending',
    APPROVE_REQUEST: (id) => `/approvals/${id}/approve`,
    REJECT_REQUEST: (id) => `/approvals/${id}/reject`,
    
    // Document endpoints (for future)
    UPLOAD_DOCUMENT: '/documents/upload',
    GET_DOCUMENTS: '/documents',
    
    // Expense endpoints (for future)
    SUBMIT_EXPENSE: '/expenses',
    GET_EXPENSES: '/expenses'
  },
  
  // Request timeout
  TIMEOUT: 30000, // 30 seconds
  
  // Headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export default apiConfig;

/**
 * HOW TO USE IN YOUR CODE:
 * 
 * import apiConfig from './config/apiConfig';
 * 
 * // Check if using mock
 * if (apiConfig.USE_MOCK_API) {
 *   // Use mock data
 * } else {
 *   // Use real API
 * }
 * 
 * // Get endpoint
 * const loginUrl = apiConfig.ENDPOINTS.LOGIN;
 */