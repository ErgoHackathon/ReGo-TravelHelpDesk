/**
 * API Configuration
 * Centralized API configuration for the ReGo Travel Management System
 */

// ============================================
// MOCK API TOGGLE
// ============================================
const USE_MOCK_API = false; // ✅ Set to FALSE to use real API

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
// API ENDPOINTS - MAPPED TO YOUR BACKEND
// ============================================
const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/LoginRequest',
    GET_ROLES: '/api/GetRollMaster',
  },

  // Employee
  EMPLOYEE: {
    GET_DATA: '/api/employee/GetEmployeeData',
    GET_TRAVEL: '/api/employee/TravelDetailByEmpId',
    ADD_DOCUMENT: '/api/employee/AddDocument',
    UPDATE_DOCUMENT: '/api/employee/UpdateDocument',
  },

  // Manager
  MANAGER: {
    GET_TEAM: '/api/manager/GetEmployeesByRptId',
    GET_TEAM_TRAVEL: '/api/manager/TravelDetailByRptId',
    INSERT_TRAVEL: '/api/manager/InsertTravelDetail',
  },

  // HelpDesk / Travel Desk
  HELPDESK: {
    GET_EMPLOYEE_DOCUMENTS: '/api/HelpDesk/GetEmployeeDocuments',
  },

  // Travel
  TRAVEL: {
    UPDATE_STATUS: '/api/UpdateTravelStatus',
  },

  // Documents
  DOCUMENTS: {
    GET_ALL_TYPES: '/api/GetAllDocumentsList',
  },
};

// ============================================
// STATUS CODES (from your TMS_TravelMaster.Status)
// ============================================
const TRAVEL_STATUS = {
  PENDING: 0,
  SUBMITTED: 1,
  MANAGER_APPROVED: 2,
  COMPLETED: 3,
  REJECTED: 4,
};

const TRAVEL_STATUS_LABELS = {
  0: 'Pending',
  1: 'Submitted',
  2: 'Manager Approved',
  3: 'Completed',
  4: 'Rejected',
};

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
  TRAVEL_STATUS,
  TRAVEL_STATUS_LABELS,
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
  TRAVEL_STATUS,
  TRAVEL_STATUS_LABELS,
  ROLE_ID_MAP,
  replaceParams,
  buildUrl
};