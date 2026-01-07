/**
 * Common Service
 * Handles common APIs used across all roles
 * Aligned with Swagger API Specification
 */

import apiClient from '../api/client';
import apiConfig, { ENDPOINTS } from '../config/apiConfig';

const commonService = {
    /**
     * Update travel status
     * API: POST /api/UpdateTravelStatus
     * @param {number} tId - Travel ID
     * @param {number} status - New status code
     * @param {string} empId - Employee ID
     * @param {string} comment - Comment/reason
     */
    updateTravelStatus: async (tId, status, empId, comment = '') => {
        if (apiConfig.USE_MOCK_API) {
            console.log('🔵 MOCK: Updating travel status', { tId, status, empId, comment });
            return {
                status: 'Success',
                result: 'Status updated successfully'
            };
        }

        console.log('🟢 Updating travel status:', { tId, status, empId, comment });

        const formData = new FormData();
        formData.append('TID', tId.toString());
        formData.append('Status', status.toString());
        formData.append('EmpId', empId);
        formData.append('Comment', comment);

        const response = await apiClient.post(ENDPOINTS.COMMON.UPDATE_TRAVEL_STATUS, formData);
        return response.data;
    },

    /**
     * Get status history for a travel request
     * API: POST /api/GetStatusHistory?Tid={tId}
     * @param {number} tId - Travel ID
     */
    getStatusHistory: async (tId) => {
        if (apiConfig.USE_MOCK_API) {
            console.log('🔵 MOCK: Getting status history for tId:', tId);
            return {
                status: 'Success',
                result: [
                    {
                        sh_Id: 1,
                        tId: tId,
                        empId: '787',
                        current_Status: 1,
                        comment: 'Initiated',
                        dateofAction: '2025-12-29T14:54:51.839'
                    },
                    {
                        sh_Id: 2,
                        tId: tId,
                        empId: '728',
                        current_Status: 2,
                        comment: 'Approved by manager',
                        dateofAction: '2025-12-29T15:51:44.494'
                    }
                ]
            };
        }

        console.log('🟢 Getting status history for tId:', tId);
        const response = await apiClient.post(
            `${ENDPOINTS.COMMON.GET_STATUS_HISTORY}?Tid=${tId}`
        );
        return response.data;
    },

    /**
     * Get employee details by ID or email
     * API: POST /api/GetEmployeeDetail
     * @param {string} empIdOrEmail - Employee ID or email
     */
    getEmployeeDetail: async (empIdOrEmail) => {
        if (apiConfig.USE_MOCK_API) {
            console.log('🔵 MOCK: Getting employee detail for:', empIdOrEmail);
            return {
                status: 'Success',
                result: {
                    empId: '787',
                    name: 'Abhishek Kumar',
                    email: 'Abhishek.Kumar@gmail.com',
                    rptEmpId: '728',
                    refRoleId: 101
                }
            };
        }

        console.log('🟢 Getting employee detail for:', empIdOrEmail);

        const formData = new FormData();
        formData.append('EmpIdOrEmail', empIdOrEmail);

        const response = await apiClient.post(ENDPOINTS.COMMON.GET_EMPLOYEE_DETAIL, formData);
        return response.data;
    },

    /**
     * Get all document types
     * API: GET /api/GetAllDocumentsList
     */
    getAllDocumentsList: async () => {
        if (apiConfig.USE_MOCK_API) {
            console.log('🔵 MOCK: Getting all documents list');
            return {
                status: 'Success',
                result: [
                    { documentID: 1, documentName: 'Passport' },
                    { documentID: 2, documentName: 'Invitation Letter' },
                    { documentID: 3, documentName: 'Cover Letter' },
                    { documentID: 4, documentName: 'KT plan' },
                    { documentID: 5, documentName: 'Hotel Booking' },
                    { documentID: 6, documentName: 'Flight Booking' },
                    { documentID: 7, documentName: 'Travel Insurance' },
                    { documentID: 8, documentName: 'Visa Form' },
                    { documentID: 9, documentName: 'Letter of Intent' },
                    { documentID: 10, documentName: 'Visa' },
                    { documentID: 11, documentName: 'Insurance Declaration' },
                    { documentID: 12, documentName: 'Visa Appointment' }
                ]
            };
        }

        console.log('🟢 Getting all documents list');
        const response = await apiClient.get(ENDPOINTS.COMMON.GET_ALL_DOCUMENTS_LIST);
        return response.data;
    },

    /**
     * Get status master
     * API: GET /api/GetStatusMaster
     */
    getStatusMaster: async () => {
        if (apiConfig.USE_MOCK_API) {
            console.log('🔵 MOCK: Getting status master');
            return {
                status: 'Success',
                result: [
                    { statusId: 1, status: 'Request Initiated', note: 'Initial Manager initiated', refRoleID: 102 },
                    { statusId: 2, status: 'Request Initiated', note: 'Initial Avp/Dvp initiated', refRoleID: 104 },
                    { statusId: 3, status: 'Request Initiated', note: 'Initial Svp initiated', refRoleID: 105 },
                    { statusId: 4, status: 'Request Approved', note: 'Initial Manager Approved', refRoleID: 102 },
                    { statusId: 5, status: 'Request Approved', note: 'Initial Avp/Dvp Approved', refRoleID: 104 },
                    { statusId: 6, status: 'Request Approved', note: 'Initial Svp Approved', refRoleID: 105 },
                    { statusId: 7, status: 'Final initiated', note: 'Manager final initiated', refRoleID: 102 },
                    { statusId: 8, status: 'Final initiated', note: 'Avp/Dvp final initiated', refRoleID: 104 },
                    { statusId: 9, status: 'Final initiated', note: 'Svp final initiated', refRoleID: 105 },
                    { statusId: 10, status: 'Final Approved', note: 'Manager final Approved', refRoleID: 102 },
                    { statusId: 11, status: 'Final Approved', note: 'Avp/Dvp final Approved', refRoleID: 104 },
                    { statusId: 12, status: 'Final Approved', note: 'Svp final Approved', refRoleID: 105 },
                    { statusId: 13, status: 'Initial Document Pending', note: 'Document Pending From Employee', refRoleID: 101 },
                    { statusId: 14, status: 'Initial Document review and visa Pending', note: 'Review Pending From Helpdesk', refRoleID: 103 },
                    { statusId: 15, status: 'Pending Flight/Hotel Ticket', note: 'Pending Ticket From Helpdesk', refRoleID: 103 },
                    { statusId: 16, status: 'Uploaded Flight/Hotel Ticket', note: 'Ticket uploaded From Helpdesk', refRoleID: 103 },
                    { statusId: 17, status: 'Final Completed', note: 'Employee Travel Completed', refRoleID: 101 },
                    { statusId: 18, status: 'Rejected', note: 'Visa Rejected', refRoleID: 103 },
                    { statusId: 19, status: 'AVP/DVP Rejected', note: 'AVP/DVP Rejected', refRoleID: 104 },
                    { statusId: 20, status: 'SVP Rejected', note: 'SVP Rejected', refRoleID: 105 }
                ]
            };
        }

        console.log('🟢 Getting status master');
        const response = await apiClient.get(ENDPOINTS.COMMON.GET_STATUS_MASTER);
        return response.data;
    },

    /**
     * Get role master
     * API: GET /api/GetRoleMaster
     */
    getRoleMaster: async () => {
        if (apiConfig.USE_MOCK_API) {
            console.log('🔵 MOCK: Getting role master');
            return {
                status: 'Success',
                result: [
                    { roleID: 101, roleName: 'Employee' },
                    { roleID: 102, roleName: 'Manager' },
                    { roleID: 103, roleName: 'Helpdesk' },
                    { roleID: 104, roleName: 'DVP/AVP' },
                    { roleID: 105, roleName: 'SVP' }
                ]
            };
        }

        console.log('🟢 Getting role master');
        const response = await apiClient.get(ENDPOINTS.COMMON.GET_ROLE_MASTER);
        return response.data;
    }
};

export default commonService;
