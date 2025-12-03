/**
 * Travel Request Service
 * Handles all travel request-related API calls
 * Matches ReGo_Backend_API_and_DB_Spec_v1.md
 */

import apiClient from '../api/client';
import apiConfig, { ENDPOINTS } from '../config/apiConfig';

/**
 * Create a new travel request (Employee)
 * @param {object} requestData - { userId, fromLocation, toLocation, startDate, endDate, purpose }
 * @returns {Promise<object>} - { requestId, status }
 */
export const createTravelRequest = async (requestData) => {
    if (apiConfig.USE_MOCK_API) {
        console.log('🔵 Using MOCK API for createTravelRequest');
        return {
            requestId: Math.floor(Math.random() * 1000) + 100,
            status: 'PENDING_MANAGER'
        };
    }

    console.log('🟢 Using REAL API for createTravelRequest');
    const response = await apiClient.post(ENDPOINTS.TRAVEL_REQUEST_CREATE, requestData);
    return response.data;
};

/**
 * Get travel requests by user ID
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - Array of travel requests
 */
export const getTravelRequestsByUser = async (userId) => {
    if (apiConfig.USE_MOCK_API) {
        console.log('🔵 Using MOCK API for getTravelRequestsByUser');
        return [
            {
                requestId: 101,
                userId: userId,
                fromLocation: 'Mumbai',
                toLocation: 'Bangalore',
                startDate: '2025-12-15',
                endDate: '2025-12-18',
                purpose: 'Client meeting',
                status: 'PENDING_MANAGER',
                createdAt: '2025-12-01T10:00:00Z'
            }
        ];
    }

    console.log('🟢 Using REAL API for getTravelRequestsByUser');
    const response = await apiClient.get(`${ENDPOINTS.TRAVEL_REQUEST_BY_USER}/${userId}`);
    return response.data;
};

/**
 * Get travel request by ID (with full details)
 * @param {number} requestId - Request ID
 * @returns {Promise<object>} - { requestId, status, details, approvals, documents, booking }
 */
export const getTravelRequestById = async (requestId) => {
    if (apiConfig.USE_MOCK_API) {
        console.log('🔵 Using MOCK API for getTravelRequestById');
        return {
            requestId: requestId,
            status: 'PENDING_MANAGER',
            details: {
                fromLocation: 'Mumbai',
                toLocation: 'Bangalore',
                startDate: '2025-12-15',
                endDate: '2025-12-18',
                purpose: 'Client meeting'
            },
            approvals: [],
            documents: [],
            booking: null
        };
    }

    console.log('🟢 Using REAL API for getTravelRequestById');
    const response = await apiClient.get(`${ENDPOINTS.TRAVEL_REQUEST_BY_ID}/${requestId}`);
    return response.data;
};

const travelRequestService = {
    createTravelRequest,
    getTravelRequestsByUser,
    getTravelRequestById
};

export default travelRequestService;
