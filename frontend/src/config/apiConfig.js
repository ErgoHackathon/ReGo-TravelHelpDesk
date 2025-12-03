/**
 * API Configuration
 * Centralized API configuration for the ReGo Travel Management System
 * Controls mock/real API toggle and defines all API endpoints
 */

// ============================================
// MOCK API TOGGLE
// ============================================

/**
 * Toggle between mock and real API
 * Controlled by environment variable REACT_APP_ENABLE_MOCK_API
 * Defaults to true for local development
 */
const USE_MOCK_API = process.env.REACT_APP_ENABLE_MOCK_API === 'true' ||
  process.env.REACT_APP_ENABLE_MOCK_API === undefined;

// ============================================
// API BASE URL
// ============================================

/**
 * Real API base URL from environment variable
 * Falls back to localhost if not set
 */
const REAL_API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

/**
 * Current API base URL (mock or real)
 */
const API_BASE_URL = USE_MOCK_API ? '' : REAL_API_BASE_URL;

// ============================================
// REQUEST CONFIGURATION
// ============================================

const TIMEOUT = 30000; // 30 seconds
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

const HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// ============================================
// API ENDPOINTS
// ============================================

const ENDPOINTS = {
  // ==========================================
  // AUTHENTICATION ENDPOINTS
  // ==========================================
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    GET_PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email'
  },

  // ==========================================
  // DASHBOARD ENDPOINTS
  // ==========================================
  DASHBOARD: {
    STATS: '/dashboard/stats',
    EMPLOYEE_STATS: '/dashboard/employee/stats',
    MANAGER_STATS: '/dashboard/manager/stats',
    TRAVEL_DESK_STATS: '/dashboard/travel-desk/stats',
    FINANCE_STATS: '/dashboard/finance/stats'
  },

  // ==========================================
  // TRAVEL REQUEST ENDPOINTS
  // ==========================================
  TRAVEL_REQUESTS: {
    LIST: '/travel-requests',
    CREATE: '/travel-requests',
    GET: '/travel-requests/:id',
    UPDATE: '/travel-requests/:id',
    DELETE: '/travel-requests/:id',
    SUBMIT: '/travel-requests/:id/submit',
    CANCEL: '/travel-requests/:id/cancel',
    TIMELINE: '/travel-requests/:id/timeline',
    MY_REQUESTS: '/travel-requests/my-requests',
    TEAM_REQUESTS: '/travel-requests/team-requests'
  },

  // ==========================================
  // APPROVAL ENDPOINTS
  // ==========================================
  APPROVALS: {
    PENDING: '/approvals/pending',
    HISTORY: '/approvals/history',
    GET: '/approvals/:id',
    APPROVE: '/approvals/:id/approve',
    REJECT: '/approvals/:id/reject',
    DELEGATE: '/approvals/:id/delegate',
    ADD_COMMENT: '/approvals/:id/comment',
    BULK_APPROVE: '/approvals/bulk-approve',
    BULK_REJECT: '/approvals/bulk-reject'
  },

  // ==========================================
  // DOCUMENT ENDPOINTS
  // ==========================================
  DOCUMENTS: {
    LIST: '/documents',
    UPLOAD: '/documents/upload',
    GET: '/documents/:id',
    DOWNLOAD: '/documents/:id/download',
    DELETE: '/documents/:id',
    VERIFY: '/documents/:id/verify',
    REJECT: '/documents/:id/reject',
    OCR_STATUS: '/documents/:id/ocr-status',
    BY_REQUEST: '/documents/request/:requestId'
  },

  // ==========================================
  // BOOKING ENDPOINTS
  // ==========================================
  BOOKINGS: {
    LIST: '/bookings',
    CREATE: '/bookings',
    GET: '/bookings/:id',
    UPDATE: '/bookings/:id',
    CANCEL: '/bookings/:id',
    BY_REQUEST: '/bookings/request/:requestId',
    CONFIRM: '/bookings/:id/confirm'
  },

  // ==========================================
  // EXPENSE ENDPOINTS
  // ==========================================
  EXPENSES: {
    LIST: '/expenses',
    CREATE: '/expenses',
    GET: '/expenses/:id',
    UPDATE: '/expenses/:id',
    DELETE: '/expenses/:id',
    SUBMIT: '/expenses/:id/submit',
    APPROVE: '/expenses/:id/approve',
    REJECT: '/expenses/:id/reject',
    REIMBURSE: '/expenses/:id/reimburse',
    BY_REQUEST: '/expenses/request/:requestId',
    MY_EXPENSES: '/expenses/my-expenses',
    PENDING_REIMBURSEMENT: '/expenses/pending-reimbursement'
  },

  // ==========================================
  // AI RECOMMENDATION ENDPOINTS
  // ==========================================
  AI: {
    FLIGHT_RECOMMENDATIONS: '/ai/flight-recommendations',
    HOTEL_RECOMMENDATIONS: '/ai/hotel-recommendations',
    DOCUMENT_EXTRACT: '/ai/document-extract',
    EXPENSE_ANOMALY_CHECK: '/ai/expense-anomaly-check',
    ITINERARY_SUGGESTIONS: '/ai/itinerary-suggestions'
  },

  // ==========================================
  // NOTIFICATION ENDPOINTS
  // ==========================================
  NOTIFICATIONS: {
    LIST: '/notifications',
    GET: '/notifications/:id',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/mark-all-read',
    UNREAD_COUNT: '/notifications/unread-count',
    PREFERENCES: '/notifications/preferences',
    DELETE: '/notifications/:id'
  },

  // ==========================================
  // USER MANAGEMENT ENDPOINTS (ADMIN)
  // ==========================================
  USERS: {
    LIST: '/users',
    GET: '/users/:id',
    CREATE: '/users',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
    ACTIVATE: '/users/:id/activate',
    DEACTIVATE: '/users/:id/deactivate',
    RESET_PASSWORD: '/users/:id/reset-password'
  },

  // ==========================================
  // REPORTS ENDPOINTS
  // ==========================================
  REPORTS: {
    TRAVEL_SUMMARY: '/reports/travel-summary',
    EXPENSE_SUMMARY: '/reports/expense-summary',
    DEPARTMENT_REPORT: '/reports/department',
    USER_REPORT: '/reports/user/:userId',
    EXPORT_CSV: '/reports/export/csv',
    EXPORT_PDF: '/reports/export/pdf'
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Replace path parameters in endpoint URL
 * @param {string} endpoint - Endpoint with :params
 * @param {object} params - Parameters to replace
 * @returns {string} - Endpoint with replaced params
 */
const replaceParams = (endpoint, params = {}) => {
  let url = endpoint;
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  return url;
};

/**
 * Build full URL with query parameters
 * @param {string} endpoint - API endpoint
 * @param {object} queryParams - Query parameters
 * @returns {string} - Full URL with query string
 */
const buildUrl = (endpoint, queryParams = {}) => {
  const url = API_BASE_URL + endpoint;
  const params = new URLSearchParams();

  Object.keys(queryParams).forEach(key => {
    if (queryParams[key] !== null && queryParams[key] !== undefined) {
      params.append(key, queryParams[key]);
    }
  });

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
};

// ============================================
// EXPORTS
// ============================================

const apiConfig = {
  USE_MOCK_API,
  API_BASE_URL,
  REAL_API_BASE_URL,
  TIMEOUT,
  RETRY_ATTEMPTS,
  RETRY_DELAY,
  HEADERS,
  ENDPOINTS,
  replaceParams,
  buildUrl
};

export default apiConfig;

// Named exports for convenience
export {
  USE_MOCK_API,
  API_BASE_URL,
  REAL_API_BASE_URL,
  TIMEOUT,
  RETRY_ATTEMPTS,
  RETRY_DELAY,
  HEADERS,
  ENDPOINTS,
  replaceParams,
  buildUrl
};