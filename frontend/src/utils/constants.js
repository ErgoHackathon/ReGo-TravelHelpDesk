/**
 * Application Constants
 * Centralized constants for the ReGo Travel Management System
 */

// ============================================
// API CONSTANTS
// ============================================

export const API_TIMEOUT = 30000; // 30 seconds
export const API_RETRY_ATTEMPTS = 3;
export const API_RETRY_DELAY = 1000; // 1 second

// ============================================
// USER ROLES
// ============================================

export const ROLES = {
  EMPLOYEE: 'EMPLOYEE',
  MANAGER: 'MANAGER',
  AVP: 'AVP',
  SVP: 'SVP',
  CHRO: 'CHRO',
  FINANCE: 'FINANCE',
  ADMIN: 'ADMIN',
  TRAVEL_DESK: 'TRAVEL_DESK'
};

export const ROLE_LABELS = {
  [ROLES.EMPLOYEE]: 'Employee',
  [ROLES.MANAGER]: 'Manager',
  [ROLES.AVP]: 'AVP',
  [ROLES.SVP]: 'SVP',
  [ROLES.CHRO]: 'CHRO',
  [ROLES.FINANCE]: 'Finance',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.TRAVEL_DESK]: 'Travel Desk'
};

// ============================================
// REQUEST STATUS
// ============================================

export const REQUEST_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  MANAGER_REVIEW: 'MANAGER_REVIEW',
  AVP_REVIEW: 'AVP_REVIEW',
  SVP_REVIEW: 'SVP_REVIEW',
  CHRO_REVIEW: 'CHRO_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  BOOKING_IN_PROGRESS: 'BOOKING_IN_PROGRESS',
  BOOKED: 'BOOKED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export const STATUS_LABELS = {
  [REQUEST_STATUS.DRAFT]: 'Draft',
  [REQUEST_STATUS.SUBMITTED]: 'Submitted',
  [REQUEST_STATUS.MANAGER_REVIEW]: 'Manager Review',
  [REQUEST_STATUS.AVP_REVIEW]: 'AVP Review',
  [REQUEST_STATUS.SVP_REVIEW]: 'SVP Review',
  [REQUEST_STATUS.CHRO_REVIEW]: 'CHRO Review',
  [REQUEST_STATUS.APPROVED]: 'Approved',
  [REQUEST_STATUS.REJECTED]: 'Rejected',
  [REQUEST_STATUS.BOOKING_IN_PROGRESS]: 'Booking in Progress',
  [REQUEST_STATUS.BOOKED]: 'Booked',
  [REQUEST_STATUS.COMPLETED]: 'Completed',
  [REQUEST_STATUS.CANCELLED]: 'Cancelled'
};

export const STATUS_COLORS = {
  [REQUEST_STATUS.DRAFT]: 'default',
  [REQUEST_STATUS.SUBMITTED]: 'info',
  [REQUEST_STATUS.MANAGER_REVIEW]: 'warning',
  [REQUEST_STATUS.AVP_REVIEW]: 'warning',
  [REQUEST_STATUS.SVP_REVIEW]: 'warning',
  [REQUEST_STATUS.CHRO_REVIEW]: 'warning',
  [REQUEST_STATUS.APPROVED]: 'success',
  [REQUEST_STATUS.REJECTED]: 'error',
  [REQUEST_STATUS.BOOKING_IN_PROGRESS]: 'info',
  [REQUEST_STATUS.BOOKED]: 'success',
  [REQUEST_STATUS.COMPLETED]: 'success',
  [REQUEST_STATUS.CANCELLED]: 'error'
};

// ============================================
// APPROVAL STATUS
// ============================================

export const APPROVAL_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  DELEGATED: 'DELEGATED'
};

// ============================================
// DOCUMENT TYPES
// ============================================

export const DOCUMENT_TYPES = {
  PASSPORT: 'PASSPORT',
  VISA: 'VISA',
  FLIGHT_TICKET: 'FLIGHT_TICKET',
  HOTEL_BOOKING: 'HOTEL_BOOKING',
  INSURANCE: 'INSURANCE',
  RECEIPT: 'RECEIPT',
  INVOICE: 'INVOICE',
  OTHER: 'OTHER'
};

export const DOCUMENT_TYPE_LABELS = {
  [DOCUMENT_TYPES.PASSPORT]: 'Passport',
  [DOCUMENT_TYPES.VISA]: 'Visa',
  [DOCUMENT_TYPES.FLIGHT_TICKET]: 'Flight Ticket',
  [DOCUMENT_TYPES.HOTEL_BOOKING]: 'Hotel Booking',
  [DOCUMENT_TYPES.INSURANCE]: 'Insurance',
  [DOCUMENT_TYPES.RECEIPT]: 'Receipt',
  [DOCUMENT_TYPES.INVOICE]: 'Invoice',
  [DOCUMENT_TYPES.OTHER]: 'Other'
};

// ============================================
// EXPENSE CATEGORIES
// ============================================

export const EXPENSE_CATEGORIES = {
  FLIGHT: 'FLIGHT',
  HOTEL: 'HOTEL',
  MEALS: 'MEALS',
  LOCAL_TRANSPORT: 'LOCAL_TRANSPORT',
  TAXI: 'TAXI',
  FUEL: 'FUEL',
  PARKING: 'PARKING',
  VISA_FEES: 'VISA_FEES',
  INSURANCE: 'INSURANCE',
  MISCELLANEOUS: 'MISCELLANEOUS'
};

export const EXPENSE_CATEGORY_LABELS = {
  [EXPENSE_CATEGORIES.FLIGHT]: 'Flight',
  [EXPENSE_CATEGORIES.HOTEL]: 'Hotel',
  [EXPENSE_CATEGORIES.MEALS]: 'Meals',
  [EXPENSE_CATEGORIES.LOCAL_TRANSPORT]: 'Local Transport',
  [EXPENSE_CATEGORIES.TAXI]: 'Taxi',
  [EXPENSE_CATEGORIES.FUEL]: 'Fuel',
  [EXPENSE_CATEGORIES.PARKING]: 'Parking',
  [EXPENSE_CATEGORIES.VISA_FEES]: 'Visa Fees',
  [EXPENSE_CATEGORIES.INSURANCE]: 'Insurance',
  [EXPENSE_CATEGORIES.MISCELLANEOUS]: 'Miscellaneous'
};

// ============================================
// TRAVEL TYPES
// ============================================

export const TRAVEL_TYPES = {
  DOMESTIC: 'DOMESTIC',
  INTERNATIONAL: 'INTERNATIONAL'
};

// ============================================
// BOOKING TYPES
// ============================================

export const BOOKING_TYPES = {
  FLIGHT: 'FLIGHT',
  HOTEL: 'HOTEL',
  VISA: 'VISA',
  INSURANCE: 'INSURANCE',
  CAR_RENTAL: 'CAR_RENTAL',
  TRAIN: 'TRAIN'
};

// ============================================
// CURRENCIES
// ============================================

export const CURRENCIES = {
  INR: 'INR',
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  AED: 'AED',
  SGD: 'SGD'
};

export const CURRENCY_SYMBOLS = {
  [CURRENCIES.INR]: '₹',
  [CURRENCIES.USD]: '$',
  [CURRENCIES.EUR]: '€',
  [CURRENCIES.GBP]: '£',
  [CURRENCIES.AED]: 'AED',
  [CURRENCIES.SGD]: 'S$'
};

// ============================================
// PAGINATION
// ============================================

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// ============================================
// DATE FORMATS
// ============================================

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DISPLAY_DATE_FORMAT = 'MMM DD, YYYY';
export const DISPLAY_DATETIME_FORMAT = 'MMM DD, YYYY HH:mm';

// ============================================
// VALIDATION RULES
// ============================================

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
};

// ============================================
// UI CONSTANTS
// ============================================

export const THEME_COLORS = {
  PRIMARY: '#b91c1c',
  PRIMARY_LIGHT: '#c15454',
  PRIMARY_DARK: '#8b1f1f',
  SECONDARY: '#fef2f2',
  BACKGROUND: '#fef2f2',
  PAPER: '#ffffff',
  ERROR: '#d32f2f',
  WARNING: '#ed6c02',
  INFO: '#0288d1',
  SUCCESS: '#2e7d32'
};

export const DRAWER_WIDTH = 240;
export const NAVBAR_HEIGHT = 64;

// ============================================
// NOTIFICATION TYPES
// ============================================

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// ============================================
// LOCAL STORAGE KEYS
// ============================================

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// ============================================
// ROUTES
// ============================================

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  TRAVEL_REQUESTS: '/dashboard/travel-requests',
  CREATE_REQUEST: '/dashboard/travel-requests/create',
  VIEW_REQUEST: '/dashboard/travel-requests/:id',
  APPROVALS: '/dashboard/approvals',
  DOCUMENTS: '/dashboard/documents',
  BOOKINGS: '/dashboard/bookings',
  EXPENSES: '/dashboard/expenses',
  PROFILE: '/dashboard/profile'
};

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'The requested resource was not found.',
  GENERIC_ERROR: 'An error occurred. Please try again.'
};

// ============================================
// SUCCESS MESSAGES
// ============================================

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  REGISTER_SUCCESS: 'Registration successful!',
  REQUEST_CREATED: 'Travel request created successfully.',
  REQUEST_UPDATED: 'Travel request updated successfully.',
  REQUEST_SUBMITTED: 'Travel request submitted for approval.',
  APPROVAL_SUCCESS: 'Request approved successfully.',
  REJECTION_SUCCESS: 'Request rejected.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  PASSWORD_CHANGED: 'Password changed successfully.'
};
