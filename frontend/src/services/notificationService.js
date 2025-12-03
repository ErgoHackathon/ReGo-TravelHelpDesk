/**
 * Notification Service
 * Handles all notification-related API calls
 * Matches ReGo_Backend_API_and_DB_Spec_v1.md
 */

import apiClient from '../api/client';
import apiConfig, { ENDPOINTS } from '../config/apiConfig';

/**
 * Get notifications for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - Array of notification objects
 */
export const getNotifications = async (userId) => {
    if (apiConfig.USE_MOCK_API) {
        console.log('🔵 Using MOCK API for getNotifications');
        return [
            {
                notificationId: 1,
                userId: userId,
                message: 'Your travel request has been approved by manager',
                isRead: false,
                createdAt: '2025-12-03T10:00:00Z'
            },
            {
                notificationId: 2,
                userId: userId,
                message: 'Please upload required documents',
                isRead: false,
                createdAt: '2025-12-02T15:30:00Z'
            }
        ];
    }

    console.log('🟢 Using REAL API for getNotifications');
    const response = await apiClient.get(`${ENDPOINTS.NOTIFICATIONS_GET}/${userId}`);
    return response.data;
};

/**
 * Mark notification as read
 * @param {number} notificationId - Notification ID
 * @returns {Promise<object>} - Success response
 */
export const markNotificationAsRead = async (notificationId) => {
    if (apiConfig.USE_MOCK_API) {
        console.log('🔵 Using MOCK API for markNotificationAsRead');
        return { success: true };
    }

    console.log('🟢 Using REAL API for markNotificationAsRead');
    const response = await apiClient.put(`${ENDPOINTS.NOTIFICATIONS_MARK_READ}/${notificationId}`);
    return response.data;
};

const notificationService = {
    getNotifications,
    markNotificationAsRead
};

export default notificationService;
