/**
 * Employee Service
 * Handles all employee-specific API calls
 */

import apiClient from '../api/client';
import apiConfig, { ENDPOINTS, TRAVEL_STATUS_LABELS } from '../config/apiConfig';

const employeeService = {
  /**
   * Get employee profile data
   * @param {string} idOrEmail - Employee ID or email address
   */
  getEmployeeProfile: async (idOrEmail) => {
    console.log('🟢 Getting employee profile for:', idOrEmail);

    const formData = new FormData();
    formData.append('IDorEmail', idOrEmail);

    const response = await apiClient.post(ENDPOINTS.EMPLOYEE.GET_DATA, formData);
    console.log('Employee API response:', response.data);

    const data = response.data?.result;

    if (!data || response.data?.status !== 'Success') {
      throw new Error('Failed to fetch employee profile');
    }

    return {
      empId: data.empId,
      empName: data.name,
      email: data.email,
      rptEmpId: data.rptEmpId,
      refRoleId: data.refRoleId || apiConfig.ROLE_ID_MAP[101],
      department: data.department || '',
      designation: data.designation || ''
    };
  },

  /**
   * Get employee travel details
   * @param {string|number} empId - Employee ID
   */
  getEmployeeTravel: async (empId) => {
    console.log('🟢 Getting travel details for empId:', empId);

    const formData = new FormData();
    formData.append('id', empId);

    const response = await apiClient.post(ENDPOINTS.EMPLOYEE.GET_TRAVEL, formData);
    console.log('Travel API response:', response.data);

    if (response.data?.status !== 'Success' || !response.data?.result) {
      console.warn('No travel data found');
      return [];
    }

    const travels = Array.isArray(response.data.result)
      ? response.data.result
      : [response.data.result];

    // Map backend data to frontend format
    return travels.map(travel => ({
      id: `${travel.empId}-${travel.country}-${travel.travelStartDate}`,
      empId: travel.empId,
      country: travel.country,
      city: travel.city,
      destination: `${travel.city}, ${travel.country}`,
      remark: travel.remark,
      purpose: travel.remark,
      suggestedDate: travel.suggestedDate,
      travelStartDate: travel.travelStartDate,
      travelEndDate: travel.travelEndDate,
      departureDate: travel.travelStartDate,
      returnDate: travel.travelEndDate,
      status: travel.status,
      statusLabel: TRAVEL_STATUS_LABELS[travel.status] || 'Unknown',
      rptEmpId: travel.rptEmpId
    }));
  },

  /**
   * Add document for employee
   * @param {string} empId - Employee ID
   * @param {number} documentId - Document type ID
   * @param {File} document - Document file
   */
  addDocument: async (empId, documentId, document) => {
    console.log('🟢 Adding document for empId:', empId);

    const formData = new FormData();
    formData.append('empId', empId);
    formData.append('documentId', documentId);
    formData.append('document', document);

    const response = await apiClient.post(ENDPOINTS.EMPLOYEE.ADD_DOCUMENT, formData);
    console.log('Add document response:', response.data);

    if (response.data?.status !== 'Success') {
      throw new Error('Failed to add document');
    }

    return response.data.result;
  },

  /**
   * Update document for employee
   */
  updateDocument: async (empId, documentId, document) => {
    console.log('🟢 Updating document for empId:', empId);

    const formData = new FormData();
    formData.append('empId', empId);
    formData.append('documentId', documentId);
    formData.append('document', document);

    const response = await apiClient.post(ENDPOINTS.EMPLOYEE.UPDATE_DOCUMENT, formData);
    console.log('Update document response:', response.data);

    if (response.data?.status !== 'Success') {
      throw new Error('Failed to update document');
    }

    return response.data.result;
  }
};

export default employeeService;