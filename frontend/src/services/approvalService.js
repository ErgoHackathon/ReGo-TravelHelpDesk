/**
 * Approval Service
 * Handles all approval-related API calls
 * Matches ReGo_Backend_API_and_DB_Spec_v1.md
 */

import apiClient from '../api/client';
import apiConfig, { ENDPOINTS } from '../config/apiConfig';

/**
 * Submit approval/rejection for a travel request
 * Used by all approving roles: MANAGER, AVP, SVP, CHRO, FINANCE
 * @param {object} approvalData - { requestId, approvedBy, role, action, comments }
 * @returns {Promise<object>} - { status }
 */
export const submitApproval = async (approvalData) => {
    if (apiConfig.USE_MOCK_API) {
        console.log('🔵 Using MOCK API for submitApproval');

        // Determine next status based on role and action
        const { role, action } = approvalData;
        let nextStatus = 'PENDING_MANAGER';

        if (action === 'APPROVED') {
            switch (role) {
                case 'MANAGER':
                    nextStatus = 'PENDING_AVP';
                    break;
                case 'AVP':
                    nextStatus = 'PENDING_SVP';
                    break;
                case 'SVP':
                    nextStatus = 'PENDING_CHRO';
                    break;
                case 'CHRO':
                    nextStatus = 'PENDING_FINANCE';
                    break;
                case 'FINANCE':
                    nextStatus = 'PENDING_TRAVEL_DESK';
                    break;
                default:
                    nextStatus = 'APPROVED';
            }
        } else if (action === 'REJECTED') {
            nextStatus = 'REJECTED';
        } else if (action === 'RETURNED') {
            nextStatus = 'RETURNED';
        }

        return { status: nextStatus };
    }

    console.log('🟢 Using REAL API for submitApproval');
    const response = await apiClient.post(ENDPOINTS.APPROVAL_SUBMIT, approvalData);
    return response.data;
};

const approvalService = {
    submitApproval
};

export default approvalService;
