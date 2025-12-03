/**
 * Validation Utilities
 * Reusable validation functions for forms and data
 */

import { VALIDATION } from './constants';

// ============================================
// EMAIL VALIDATION
// ============================================

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const validateEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    return VALIDATION.EMAIL_REGEX.test(email.trim());
};

/**
 * Get email validation error message
 * @param {string} email - Email to validate
 * @returns {string|null} - Error message or null if valid
 */
export const getEmailError = (email) => {
    if (!email) return 'Email is required';
    if (!validateEmail(email)) return 'Invalid email address';
    return null;
};

// ============================================
// PASSWORD VALIDATION
// ============================================

/**
 * Validate password strength
 * Must be at least 8 characters with uppercase, lowercase, and number
 * @param {string} password - Password to validate
 * @returns {boolean} - True if valid
 */
export const validatePassword = (password) => {
    if (!password || typeof password !== 'string') return false;
    return password.length >= VALIDATION.PASSWORD_MIN_LENGTH &&
        VALIDATION.PASSWORD_REGEX.test(password);
};

/**
 * Get password validation error message
 * @param {string} password - Password to validate
 * @returns {string|null} - Error message or null if valid
 */
export const getPasswordError = (password) => {
    if (!password) return 'Password is required';
    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
        return `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;
    }
    if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
    if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
    if (!/\d/.test(password)) return 'Password must contain a number';
    return null;
};

/**
 * Calculate password strength
 * @param {string} password - Password to check
 * @returns {object} - { score: 0-4, label: string, color: string }
 */
export const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: 'None', color: 'error' };

    let score = 0;

    // Length
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character variety
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['error', 'warning', 'info', 'success', 'success'];

    return {
        score: Math.min(score, 4),
        label: labels[Math.min(score, 4)],
        color: colors[Math.min(score, 4)]
    };
};

// ============================================
// PHONE VALIDATION
// ============================================

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export const validatePhone = (phone) => {
    if (!phone || typeof phone !== 'string') return false;
    return VALIDATION.PHONE_REGEX.test(phone.trim());
};

/**
 * Get phone validation error message
 * @param {string} phone - Phone to validate
 * @returns {string|null} - Error message or null if valid
 */
export const getPhoneError = (phone) => {
    if (!phone) return null; // Phone is optional in most cases
    if (!validatePhone(phone)) return 'Invalid phone number';
    return null;
};

// ============================================
// DATE VALIDATION
// ============================================

/**
 * Validate date is in the future
 * @param {string|Date} date - Date to validate
 * @returns {boolean} - True if in future
 */
export const isFutureDate = (date) => {
    if (!date) return false;
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate >= today;
};

/**
 * Validate date is in the past
 * @param {string|Date} date - Date to validate
 * @returns {boolean} - True if in past
 */
export const isPastDate = (date) => {
    if (!date) return false;
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate < today;
};

/**
 * Validate date range (end after start)
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {boolean} - True if valid range
 */
export const isValidDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    return new Date(endDate) >= new Date(startDate);
};

/**
 * Get date validation error
 * @param {string|Date} date - Date to validate
 * @param {object} options - { required, future, past }
 * @returns {string|null} - Error message or null
 */
export const getDateError = (date, options = {}) => {
    const { required = false, future = false, past = false } = options;

    if (!date && required) return 'Date is required';
    if (!date) return null;

    const inputDate = new Date(date);
    if (isNaN(inputDate.getTime())) return 'Invalid date';

    if (future && !isFutureDate(date)) return 'Date must be in the future';
    if (past && !isPastDate(date)) return 'Date must be in the past';

    return null;
};

// ============================================
// FILE VALIDATION
// ============================================

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSize - Max size in bytes (default 10MB)
 * @returns {boolean} - True if valid
 */
export const validateFileSize = (file, maxSize = VALIDATION.MAX_FILE_SIZE) => {
    if (!file) return false;
    return file.size <= maxSize;
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {string[]} allowedTypes - Allowed MIME types
 * @returns {boolean} - True if valid
 */
export const validateFileType = (file, allowedTypes = VALIDATION.ALLOWED_FILE_TYPES) => {
    if (!file) return false;
    return allowedTypes.includes(file.type);
};

/**
 * Get file validation error
 * @param {File} file - File to validate
 * @param {object} options - { required, maxSize, allowedTypes }
 * @returns {string|null} - Error message or null
 */
export const getFileError = (file, options = {}) => {
    const {
        required = false,
        maxSize = VALIDATION.MAX_FILE_SIZE,
        allowedTypes = VALIDATION.ALLOWED_FILE_TYPES
    } = options;

    if (!file && required) return 'File is required';
    if (!file) return null;

    if (!validateFileSize(file, maxSize)) {
        return `File size must be less than ${maxSize / (1024 * 1024)}MB`;
    }

    if (!validateFileType(file, allowedTypes)) {
        return 'Invalid file type. Allowed: ' + allowedTypes.join(', ');
    }

    return null;
};

// ============================================
// NUMBER VALIDATION
// ============================================

/**
 * Validate number is positive
 * @param {number} value - Value to validate
 * @returns {boolean} - True if positive
 */
export const isPositiveNumber = (value) => {
    return typeof value === 'number' && value > 0;
};

/**
 * Validate number is in range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} - True if in range
 */
export const isInRange = (value, min, max) => {
    return typeof value === 'number' && value >= min && value <= max;
};

/**
 * Get number validation error
 * @param {number} value - Value to validate
 * @param {object} options - { required, min, max, positive }
 * @returns {string|null} - Error message or null
 */
export const getNumberError = (value, options = {}) => {
    const { required = false, min, max, positive = false } = options;

    if ((value === null || value === undefined || value === '') && required) {
        return 'This field is required';
    }
    if (value === null || value === undefined || value === '') return null;

    const num = Number(value);
    if (isNaN(num)) return 'Must be a valid number';

    if (positive && num <= 0) return 'Must be a positive number';
    if (min !== undefined && num < min) return `Must be at least ${min}`;
    if (max !== undefined && num > max) return `Must be at most ${max}`;

    return null;
};

// ============================================
// TEXT VALIDATION
// ============================================

/**
 * Validate text length
 * @param {string} text - Text to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {boolean} - True if valid
 */
export const validateTextLength = (text, minLength = 0, maxLength = Infinity) => {
    if (!text || typeof text !== 'string') return false;
    return text.trim().length >= minLength && text.trim().length <= maxLength;
};

/**
 * Get text validation error
 * @param {string} text - Text to validate
 * @param {object} options - { required, minLength, maxLength }
 * @returns {string|null} - Error message or null
 */
export const getTextError = (text, options = {}) => {
    const { required = false, minLength = 0, maxLength = Infinity } = options;

    if (!text && required) return 'This field is required';
    if (!text) return null;

    const trimmed = text.trim();
    if (trimmed.length < minLength) {
        return `Must be at least ${minLength} characters`;
    }
    if (trimmed.length > maxLength) {
        return `Must be at most ${maxLength} characters`;
    }

    return null;
};

// ============================================
// FORM VALIDATION
// ============================================

/**
 * Validate entire form object
 * @param {object} values - Form values
 * @param {object} schema - Validation schema
 * @returns {object} - Errors object
 */
export const validateForm = (values, schema) => {
    const errors = {};

    Object.keys(schema).forEach(field => {
        const rules = schema[field];
        const value = values[field];

        if (rules.email) {
            const error = getEmailError(value);
            if (error) errors[field] = error;
        }

        if (rules.password) {
            const error = getPasswordError(value);
            if (error) errors[field] = error;
        }

        if (rules.phone) {
            const error = getPhoneError(value);
            if (error) errors[field] = error;
        }

        if (rules.date) {
            const error = getDateError(value, rules.date);
            if (error) errors[field] = error;
        }

        if (rules.number) {
            const error = getNumberError(value, rules.number);
            if (error) errors[field] = error;
        }

        if (rules.text) {
            const error = getTextError(value, rules.text);
            if (error) errors[field] = error;
        }

        if (rules.custom && typeof rules.custom === 'function') {
            const error = rules.custom(value, values);
            if (error) errors[field] = error;
        }
    });

    return errors;
};

/**
 * Check if form has errors
 * @param {object} errors - Errors object
 * @returns {boolean} - True if has errors
 */
export const hasErrors = (errors) => {
    return Object.keys(errors).length > 0;
};
