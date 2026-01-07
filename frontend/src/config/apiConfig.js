/**
 * API Configuration
 * Centralized API configuration for the ReGo Travel Management System
 * Aligned with Swagger API Specification v1.0
 */

// ============================================
// MOCK API TOGGLE
// ============================================
// Read from environment variable, fallback to false (use real API)
const USE_MOCK_API = process.env.REACT_APP_ENABLE_MOCK_API === 'true';

// DEBUG: Log the toggle status
console.log('🔧 API CONFIG:', {
  REACT_APP_ENABLE_MOCK_API: process.env.REACT_APP_ENABLE_MOCK_API,
  USE_MOCK_API: USE_MOCK_API,
  willUseMockAPI: USE_MOCK_API ? 'YES - Mock Data' : 'NO - Real Backend'
});

// ============================================
// API BASE URL
// ============================================
const REAL_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7133';
const API_BASE_URL = USE_MOCK_API ? '' : REAL_API_BASE_URL;

// ============================================
// REQUEST CONFIGURATION
// ============================================
const TIMEOUT = 30000;
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

const HEADERS = {
  'Accept': 'application/json'
};

// ============================================
// API ENDPOINTS - SWAGGER-ALIGNED
// ============================================
const ENDPOINTS = {
  // ========== COMMON APIs ==========
  COMMON: {
    GET_ROLE_MASTER: '/api/GetRoleMaster',
    LOGIN_REQUEST: '/api/LoginRequest',
    UPDATE_TRAVEL_STATUS: '/api/UpdateTravelStatus',
    GET_ALL_DOCUMENTS_LIST: '/api/GetAllDocumentsList',
    GET_STATUS_MASTER: '/api/GetStatusMaster',
    GET_STATUS_HISTORY: '/api/GetStatusHistory',
    GET_EMPLOYEE_DETAIL: '/api/GetEmployeeDetail',
  },

  // ========== EMPLOYEE APIs ==========
  EMPLOYEE: {
    TRAVEL_DETAIL_BY_EMP_ID: '/api/employee/TravelDetailByEmpId',
    TRAVEL_DETAIL_BY_TID: '/api/employee/TravelDetailByTID',
    ADD_DOCUMENT: '/api/employee/AddDocument',
    DELETE_DOCUMENT: '/api/employee/DeleteDocument',
    UPDATE_PASSPORT_INFO: '/api/employee/UpdatePassportInfo',
    GET_UPLOADED_DOCUMENTS: '/api/employee/GetUploadedDocuments',
  },

  // ========== MANAGER APIs ==========
  MANAGER: {
    GET_EMPLOYEES_BY_RPT_ID: '/api/manager/GetEmployeesByRptId',
    TRAVEL_DETAIL_BY_RPT_ID: '/api/manager/TravelDetailByRptId',
    INSERT_TRAVEL_DETAIL: '/api/manager/InsertTravelDetail',
    GET_SVP_EMPLOYEES: '/api/manager/GetSvpEmployees',
    GET_AVP_EMPLOYEES: '/api/manager/GetAvpEmployees',
    UPDATE_FINAL_DATES: '/api/manager/UpdateFinalDates',
  },

  // ========== HELPDESK / TRAVEL DESK APIs ==========
  HELPDESK: {
    GET_EMPLOYEE_DOCUMENTS: '/api/HelpDesk/GetEmployeeDocuments',
    GET_PASSPORT_INFO: '/api/HelpDesk/GetPassportInfo',
    GET_ALL_TRAVEL_DETAILS: '/api/HelpDesk/GetAllTravelDetails',
    UPDATE_VISA_INFO: '/api/HelpDesk/UpdateVisaInfo',
    GET_VISA_INFO: '/api/HelpDesk/GetVisaInfo',
  },

  // ========== LEGACY ALIASES (Backward Compatibility) ==========
  AUTH: {
    LOGIN: '/api/LoginRequest',
    GET_ROLES: '/api/GetRoleMaster',
  },
  TRAVEL: {
    UPDATE_STATUS: '/api/UpdateTravelStatus',
  },
  DOCUMENTS: {
    GET_ALL_TYPES: '/api/GetAllDocumentsList',
  },
};

// ============================================
// ============================================
// STATUS CODES
// ============================================
// DEPRECATED: Status codes have been moved to statusMapper.js
// Use: import { STATUS_CODES } from '../utils/statusMapper'
// StatusMapper is the SINGLE SOURCE OF TRUTH for status handling
// ============================================

// ============================================
// ROLE MAPPING
// ============================================
const ROLE_ID_MAP = {
  101: 'EMPLOYEE',
  102: 'MANAGER',
  103: 'TRAVEL_DESK',
  104: 'AVP',
  105: 'SVP',
};

// ============================================
// HELPER FUNCTIONS
// ============================================
const replaceParams = (endpoint, params = {}) => {
  let url = endpoint;
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  return url;
};

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
  ROLE_ID_MAP,
  replaceParams,
  buildUrl
};

export default apiConfig;

export {
  USE_MOCK_API,
  API_BASE_URL,
  REAL_API_BASE_URL,
  TIMEOUT,
  RETRY_ATTEMPTS,
  RETRY_DELAY,
  HEADERS,
  ENDPOINTS,
  ROLE_ID_MAP,
  replaceParams,
  buildUrl
};