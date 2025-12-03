/**
 * Manager Service
 * Handles all manager-specific API calls
 * Automatically switches between mock and real API based on environment
 */

import apiClient from '../api/client';
import apiConfig, { ENDPOINTS } from '../config/apiConfig';
import { statusToChip } from '../utils/statusMapper';

/**
 * Get team members reporting to this manager
 * @param {number} managerId - Manager's employee ID
 * @returns {Promise<Array>} - Array of employee objects
 */
export const getTeam = async (managerId) => {
    if (apiConfig.USE_MOCK_API) {
        console.log('🔵 Using MOCK API for getTeam');
        // Return mock team data
        return [
            {
                empId: 1001,
                empName: 'John Doe',
                email: 'john.doe@company.com',
                designation: 'Software Engineer',
                department: 'Engineering'
            },
            {
                empId: 1002,
                empName: 'Jane Smith',
                email: 'jane.smith@company.com',
                designation: 'Senior Developer',
                department: 'Engineering'
            }
        ];
    }

    console.log('🟢 Using REAL API for getTeam');
    const response = await apiClient.get(ENDPOINTS.MANAGER_TEAM, {
        params: { ID: managerId }
    });

    const team = Array.isArray(response.data) ? response.data : [response.data];

    // Normalize field names
    return team.map(emp => ({
        empId: Number(emp?.empId ?? emp?.EmpId ?? 0),
        empName: emp?.empName ?? emp?.EmpName ?? '',
        email: emp?.email ?? emp?.Email ?? '',
        designation: emp?.designation ?? emp?.Designation ?? '',
        department: emp?.department ?? emp?.Department ?? ''
    }));
};

/**
 * Get travel requests for manager's team
 * @param {number} managerId - Manager's employee ID
 * @returns {Promise<Array>} - Array of travel request objects
 */
export const getManagerTravel = async (managerId) => {
    if (apiConfig.USE_MOCK_API) {
        console.log('🔵 Using MOCK API for getManagerTravel');
        // Return mock travel data
        return [
            {
                id: 'req-001',
                empId: 1001,
                empName: 'John Doe',
                destination: 'New York, USA',
                departureDate: '2025-12-15',
                returnDate: '2025-12-20',
                status: 1, // Submitted
                purpose: 'Client meeting',
                estimatedCost: 150000
            },
            {
                id: 'req-002',
                empId: 1002,
                empName: 'Jane Smith',
                destination: 'London, UK',
                departureDate: '2025-12-10',
                returnDate: '2025-12-15',
                status: 2, // Manager Approved
                purpose: 'Conference',
                estimatedCost: 180000
            }
        ];
    }

    console.log('🟢 Using REAL API for getManagerTravel');
    const response = await apiClient.get(ENDPOINTS.MANAGER_TRAVEL, {
        params: { id: managerId }
    });

    const travels = Array.isArray(response.data) ? response.data : [response.data];

    // Map status codes to frontend format
    return travels.map(travel => ({
        ...travel,
        statusInfo: statusToChip(travel.status || travel.Status || 0)
    }));
};

/**
 * Create travel requests for team members (bulk insert)
 * @param {Array} payloadArray - Array of travel request objects
 * @returns {Promise<object>} - Response from backend
 */
export const createTravelRequests = async (payloadArray) => {
    if (apiConfig.USE_MOCK_API) {
        console.log('🔵 Using MOCK API for createTravelRequests');
        // Return mock success response
        return {
            success: true,
            message: 'Travel requests created successfully',
            count: payloadArray.length
        };
    }

    console.log('🟢 Using REAL API for createTravelRequests');
    const response = await apiClient.post(
        ENDPOINTS.MANAGER_INSERT_TRAVEL,
        payloadArray
    );

    return response.data;
};

/**
 * Update travel request status
 * @param {number} empId - Employee ID
 * @param {number} status - Numeric status code (1-5)
 * @returns {Promise<object>} - Response from backend
 */
export const updateTravelStatus = async (empId, status) => {
    if (apiConfig.USE_MOCK_API) {
        console.log('🔵 Using MOCK API for updateTravelStatus');
        // Return mock success response
        return {
            success: true,
            message: 'Travel status updated successfully'
        };
    }

    console.log('🟢 Using REAL API for updateTravelStatus');
    const response = await apiClient.post(
        ENDPOINTS.TRAVEL_UPDATE_STATUS,
        null,
        {
            params: { empId, status }
        }
    );

    return response.data;
};

const managerService = {
    getTeam,
    getManagerTravel,
    createTravelRequests,
    updateTravelStatus
};

export default managerService;
