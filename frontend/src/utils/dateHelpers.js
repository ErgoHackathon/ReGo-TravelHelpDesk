/**
 * Date Helper Utilities
 * Centralized date formatting and manipulation
 */

/**
 * Format ISO date string to readable format
 * @param {string} isoDate - ISO date string
 * @param {string} format - 'short' | 'long' | 'date-only'
 * @returns {string} Formatted date
 */
export const formatDate = (isoDate, format = 'short') => {
    if (!isoDate) return '';

    const date = new Date(isoDate);

    if (isNaN(date.getTime())) return '';

    const options = {
        short: { month: 'short', day: 'numeric', year: 'numeric' },
        long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
        'date-only': { month: '2-digit', day: '2-digit', year: 'numeric' }
    };

    return date.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Format ISO date to YYYY-MM-DD for input fields
 * @param {string} isoDate - ISO date string
 * @returns {string} YYYY-MM-DD format
 */
export const toInputDate = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
};

/**
 * Get relative time (e.g., "2 days ago")
 * @param {string} isoDate - ISO date string
 * @returns {string} Relative time string
 */
export const getRelativeTime = (isoDate) => {
    if (!isoDate) return '';

    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return formatDate(isoDate);
};

/**
 * Check if date is in the past
 * @param {string} isoDate - ISO date string
 * @returns {boolean}
 */
export const isPastDate = (isoDate) => {
    if (!isoDate) return false;
    return new Date(isoDate) < new Date();
};

/**
 * Check if date is in the future
 * @param {string} isoDate - ISO date string
 * @returns {boolean}
 */
export const isFutureDate = (isoDate) => {
    if (!isoDate) return false;
    return new Date(isoDate) > new Date();
};
