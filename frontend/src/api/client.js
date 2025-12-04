/**
 * API Client
 * Unified Axios instance with interceptors for token management,
 * error handling, retry logic, and request cancellation
 */

import axios from 'axios';
import { toast } from 'react-toastify';
import apiConfig from '../config/apiConfig';
import { STORAGE_KEYS, ERROR_MESSAGES } from '../utils/constants';

// ============================================
// CREATE AXIOS INSTANCE
// ============================================

const apiClient = axios.create({
    baseURL: apiConfig.API_BASE_URL,
    timeout: apiConfig.TIMEOUT,
    headers: {
        'Accept': 'application/json'
    }
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================

/**
 * Add authentication token to requests
 * Add request timestamp for debugging
 */
apiClient.interceptors.request.use(
    (config) => {
        // Add access token if available
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // ✅ FIX: Handle Content-Type based on data type
        if (config.data instanceof FormData) {
            // FormData - let browser set Content-Type with boundary
            delete config.headers['Content-Type'];
        } else if (config.data !== null && config.data !== undefined) {
            // JSON data - set application/json
            config.headers['Content-Type'] = 'application/json';
        }

        // Add request timestamp for debugging
        config.metadata = { startTime: new Date() };

        // Log request in development
        if (process.env.NODE_ENV === 'development') {
            const logData = config.data instanceof FormData 
                ? '[FormData]' 
                : config.data;
            console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, logData);
        }

        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================

/**
 * Handle responses and errors
 * Implement token refresh on 401
 * Show error toasts for failed requests
 */
apiClient.interceptors.response.use(
    (response) => {
        // Calculate request duration
        const duration = new Date() - response.config.metadata.startTime;

        // Log response in development
        if (process.env.NODE_ENV === 'development') {
            console.log(
                `[API Response] ${response.config.method.toUpperCase()} ${response.config.url} (${duration}ms)`,
                response.data
            );
        }

        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Log error in development
        if (process.env.NODE_ENV === 'development') {
            console.error('[API Error]', {
                url: originalRequest?.url,
                method: originalRequest?.method,
                status: error.response?.status,
                message: error.message,
                data: error.response?.data
            });
        }

        // ==========================================
        // HANDLE 401 UNAUTHORIZED - TOKEN REFRESH
        // ==========================================
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Attempt to refresh token
                const response = await axios.post(
                    `${apiConfig.API_BASE_URL}${apiConfig.ENDPOINTS.AUTH.REFRESH_TOKEN}`,
                    { refreshToken }
                );

                const { accessToken } = response.data.data;

                // Store new access token
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed - clear tokens and redirect to login
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER);

                // Redirect to login
                window.location.href = '/login';

                return Promise.reject(refreshError);
            }
        }

        // ==========================================
        // HANDLE OTHER ERRORS
        // ==========================================

        // Extract error message
        const errorMessage = getErrorMessage(error);

        // Don't show toast for certain error codes (handled by components)
        const silentErrorCodes = [400, 422]; // Validation errors
        if (!silentErrorCodes.includes(error.response?.status)) {
            toast.error(errorMessage);
        }

        return Promise.reject(error);
    }
);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Extract user-friendly error message from error object
 * @param {Error} error - Axios error object
 * @returns {string} - User-friendly error message
 */
const getErrorMessage = (error) => {
    // Network error
    if (!error.response) {
        return ERROR_MESSAGES.NETWORK_ERROR;
    }

    // Server provided error message
    if (error.response.data?.error?.message) {
        return error.response.data.error.message;
    }

    if (error.response.data?.message) {
        return error.response.data.message;
    }

    // HTTP status code errors
    switch (error.response.status) {
        case 400:
            return ERROR_MESSAGES.VALIDATION_ERROR;
        case 401:
            return ERROR_MESSAGES.UNAUTHORIZED;
        case 403:
            return ERROR_MESSAGES.UNAUTHORIZED;
        case 404:
            return ERROR_MESSAGES.NOT_FOUND;
        case 500:
        case 502:
        case 503:
            return ERROR_MESSAGES.SERVER_ERROR;
        default:
            return ERROR_MESSAGES.GENERIC_ERROR;
    }
};

/**
 * Create cancel token source for request cancellation
 * @returns {CancelTokenSource} - Axios cancel token source
 */
export const createCancelToken = () => {
    return axios.CancelToken.source();
};

/**
 * Check if error is due to request cancellation
 * @param {Error} error - Error object
 * @returns {boolean} - True if cancelled
 */
export const isCancel = (error) => {
    return axios.isCancel(error);
};

// ============================================
// RETRY LOGIC
// ============================================

/**
 * Retry failed request with exponential backoff
 * @param {Function} requestFn - Request function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} delay - Initial delay in ms
 * @returns {Promise} - Request promise
 */
export const retryRequest = async (requestFn, maxRetries = apiConfig.RETRY_ATTEMPTS, delay = apiConfig.RETRY_DELAY) => {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await requestFn();
        } catch (error) {
            lastError = error;

            // Don't retry on client errors (4xx)
            if (error.response && error.response.status >= 400 && error.response.status < 500) {
                throw error;
            }

            // Don't retry if cancelled
            if (isCancel(error)) {
                throw error;
            }

            // Wait before retrying (exponential backoff)
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
            }
        }
    }

    throw lastError;
};

// ============================================
// API METHODS
// ============================================

/**
 * GET request
 * @param {string} url - Request URL
 * @param {object} config - Axios config
 * @returns {Promise} - Response promise
 */
export const get = (url, config = {}) => {
    return apiClient.get(url, config);
};

/**
 * POST request
 * @param {string} url - Request URL
 * @param {object} data - Request data
 * @param {object} config - Axios config
 * @returns {Promise} - Response promise
 */
export const post = (url, data, config = {}) => {
    return apiClient.post(url, data, config);
};

/**
 * PUT request
 * @param {string} url - Request URL
 * @param {object} data - Request data
 * @param {object} config - Axios config
 * @returns {Promise} - Response promise
 */
export const put = (url, data, config = {}) => {
    return apiClient.put(url, data, config);
};

/**
 * PATCH request
 * @param {string} url - Request URL
 * @param {object} data - Request data
 * @param {object} config - Axios config
 * @returns {Promise} - Response promise
 */
export const patch = (url, data, config = {}) => {
    return apiClient.patch(url, data, config);
};

/**
 * DELETE request
 * @param {string} url - Request URL
 * @param {object} config - Axios config
 * @returns {Promise} - Response promise
 */
export const del = (url, config = {}) => {
    return apiClient.delete(url, config);
};

// ============================================
// EXPORTS
// ============================================

export default apiClient;

export {
    get as apiGet,
    post as apiPost,
    put as apiPut,
    patch as apiPatch,
    del as apiDelete
};
