/**
 * Employee Service
 * Handles all employee-specific API calls
 * Automatically switches between mock and real API based on environment
 */

import apiClient from '../api/client';
import apiConfig, { ENDPOINTS } from '../config/apiConfig';
import { statusToChip } from '../utils/statusMapper';

/**
 * Get employee profile data
 * @param {string} idOrEmail - Employee ID or email address
 * @returns {Promise<object>} - Employee profile object
 */
export const getEmployeeProfile = async (idOrEmail) => {
    if (apiConfig.USE_MOCK_API) {
        console.log('🔵 Using MOCK API for getEmployeeProfile');
        // Return mock employee data
        return {
            empId: 1001,
            empName: 'John Doe',
            email: idOrEmail,
            refRoleId: 101,
            rptEmpId: 2001,
            department: 'Engineering',
            designation: 'Software Engineer'
        };
    }

    console.log('🟢 Using REAL API for getEmployeeProfile');
    const response = await apiClient.get(ENDPOINTS.EMPLOYEE_GET, {
        params: { IDorEmail: idOrEmail }
    });

    // Backend may return array or single object
    const data = Array.isArray(response.data) ? response.data[0] : response.data;

    // Normalize field names (backend may use PascalCase)
    return {
        empId: Number(data?.empId ?? data?.EmpId ?? 0),
        empName: data?.empName ?? data?.EmpName ?? '',
        email: data?.email ?? data?.Email ?? idOrEmail,
        refRoleId: Number(data?.refRoleId ?? data?.RefRoleId ?? 101),
        rptEmpId: data?.rptEmpId ?? data?.RptEmpId ?? null,
        department: data?.department ?? data?.Department ?? '',
        designation: data?.designation ?? data?.Designation ?? ''
    };
};

/**
 * Get employee travel details
 * @param {number} empId - Employee ID
 * @returns {Promise<Array>} - Array of travel request objects
 */
export const getEmployeeTravel = async (empId) => {
    if (apiConfig.USE_MOCK_API) {
        console.log('🔵 Using MOCK API for getEmployeeTravel');
        // Return mock travel data
        return [
            {
                id: 'req-001',
                empId: empId,
                destination: 'New York, USA',
                departureDate: '2025-12-15',
                returnDate: '2025-12-20',
                status: 2, // Manager Approved
                purpose: 'Client meeting',
                estimatedCost: 150000
            }
        ];
    }

    console.log('🟢 Using REAL API for getEmployeeTravel');
    const response = await apiClient.get(ENDPOINTS.EMPLOYEE_TRAVEL, {
        params: { id: empId }
    });

    const travels = Array.isArray(response.data) ? response.data : [response.data];

    // Map status codes to frontend format
    return travels.map(travel => ({
        ...travel,
        statusInfo: statusToChip(travel.status || travel.Status || 0)
    }));
};

const employeeService = {
    getEmployeeProfile,
    getEmployeeTravel
};

export default employeeService;
