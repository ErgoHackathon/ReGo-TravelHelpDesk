/**
 * Status Mapper Utility
 * Maps numeric status codes from backend to frontend-friendly status objects
 * Based on TMS_TravelMaster.Status database schema
 */

/**
 * Convert numeric status code to status object for UI display
 * @param {number} code - Numeric status code from backend (1-5)
 * @returns {object} - Status object with key, label, and color
 */
export const statusToChip = (code) => {
    switch (code) {
        case 1:
            return {
                key: 'SUBMITTED',
                label: 'Submitted',
                color: 'info'
            };
        case 2:
            return {
                key: 'MANAGER_APPROVED',
                label: 'Manager Approved',
                color: 'success'
            };
        case 3:
            return {
                key: 'TRAVEL_DESK_REVIEW',
                label: 'Travel Desk Review',
                color: 'warning'
            };
        case 4:
            return {
                key: 'DOCUMENTS_SUBMITTED',
                label: 'Documents Submitted',
                color: 'info'
            };
        case 5:
            return {
                key: 'BOOKED',
                label: 'Booking Confirmed',
                color: 'success'
            };
        default:
            return {
                key: 'UNKNOWN',
                label: 'Unknown',
                color: 'default'
            };
    }
};

/**
 * Get status key from numeric code
 * @param {number} code - Numeric status code
 * @returns {string} - Status key (e.g., 'SUBMITTED')
 */
export const getStatusKey = (code) => {
    return statusToChip(code).key;
};

/**
 * Get status label from numeric code
 * @param {number} code - Numeric status code
 * @returns {string} - Status label (e.g., 'Submitted')
 */
export const getStatusLabel = (code) => {
    return statusToChip(code).label;
};

/**
 * Get status color from numeric code
 * @param {number} code - Numeric status code
 * @returns {string} - MUI chip color (e.g., 'info', 'success')
 */
export const getStatusColor = (code) => {
    return statusToChip(code).color;
};

/**
 * Map status key to numeric code (reverse mapping)
 * @param {string} key - Status key (e.g., 'SUBMITTED')
 * @returns {number} - Numeric status code
 */
export const statusKeyToCode = (key) => {
    const mapping = {
        'SUBMITTED': 1,
        'MANAGER_APPROVED': 2,
        'TRAVEL_DESK_REVIEW': 3,
        'DOCUMENTS_SUBMITTED': 4,
        'BOOKED': 5
    };
    return mapping[key] || 0;
};

const statusMapper = {
    statusToChip,
    getStatusKey,
    getStatusLabel,
    getStatusColor,
    statusKeyToCode
};

export default statusMapper;
