/**
 * API Helper Utilities
 * Centralized API error handling and response processing
 */

/**
 * Handle API errors consistently
 * @param {Error} error - Error object from API call
 * @param {string} context - Context string for logging
 * @returns {object} Standardized error object
 */
export const handleApiError = (error, context = '') => {
    const logPrefix = context ? `[${context}]` : '';
    console.error(`${logPrefix} API Error:`, error);

    const message = error.response?.data?.message
        || error.response?.data?.error
        || error.message
        || 'An unexpected error occurred';

    return {
        success: false,
        error: message,
        statusCode: error.response?.status
    };
};

/**
 * Check if API response is successful
 * @param {object} response - API response object
 * @returns {boolean}
 */
export const isSuccessResponse = (response) => {
    return response?.status === 'Success' || response?.success === true;
};

/**
 * Extract result from API response
 * @param {object} response - API response object
 * @returns {any} Result data or null
 */
export const getResponseData = (response) => {
    return response?.result || response?.data || response?.Result || null;
};

/**
 * Build query string from object
 * @param {object} params - Query parameters
 * @returns {string} Query string
 */
export const buildQueryString = (params) => {
    if (!params || Object.keys(params).length === 0) return '';

    const query = Object.entries(params)
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    return query ? `?${query}` : '';
};
