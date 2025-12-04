/**
 * Employee Service
 * Handles all employee-specific API calls
 */

import apiClient from '../api/client';
import apiConfig from '../config/apiConfig';

// Status labels
const TRAVEL_STATUS_LABELS = {
  0: 'Pending',
  1: 'Submitted',
  2: 'Approved',
  3: 'Completed',
  4: 'Rejected',
};

const employeeService = {
  /**
   * Get employee profile data
   * API: POST /api/employee/GetEmployeeData (FormData)
   */
  getEmployeeProfile: async (idOrEmail) => {
    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK API for getEmployeeProfile');
      return {
        empId: '787',
        empName: 'Abhishek Kumar',
        email: idOrEmail,
        rptEmpId: '828',
        refRoleId: 101,
      };
    }

    console.log('🟢 Getting employee profile for:', idOrEmail);

    const formData = new FormData();
    formData.append('IDorEmail', idOrEmail);

    const response = await apiClient.post('/api/employee/GetEmployeeData', formData);
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
      refRoleId: data.refRoleId || 101,
    };
  },

  /**
   * Get employee travel details
   * API: POST /api/employee/TravelDetailByEmpId?id=xxx (Query Parameter)
   */
  getEmployeeTravel: async (empId) => {
    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK API for getEmployeeTravel');
      return [
        {
          id: 'tr-001',
          empId: empId,
          destination: 'Berlin, Germany',
          departureDate: '2025-12-01',
          returnDate: '2025-12-05',
          status: 1,
          statusLabel: 'Submitted',
          purpose: 'Client meeting'
        }
      ];
    }

    console.log('🟢 Getting travel details for empId:', empId);

    if (!empId) {
      console.warn('⚠️ No empId provided');
      return [];
    }

    try {
      // ✅ FIX: Use query parameter (not FormData)
      const response = await apiClient.post(
        `/api/employee/TravelDetailByEmpId?id=${empId}`,
        null  // Empty body
      );

      console.log('Travel API response:', response.data);

      // Handle no data
      if (response.data?.status === 'Functional Failure' || !response.data?.result) {
        console.log('📭 No travel data found for employee');
        return [];
      }

      if (response.data?.status !== 'Success') {
        console.warn('⚠️ Unexpected response:', response.data);
        return [];
      }

      // ✅ FIX: API returns single object, convert to array
      const result = response.data.result;
      const travels = Array.isArray(result) ? result : [result];

      // Map to frontend format
      return travels.map((travel, index) => ({
        id: `${travel.empId}-${index}`,
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

    } catch (error) {
      console.error('❌ Error fetching travel details:', error);
      return [];
    }
  },

  /**
   * Add document for employee
   * API: POST /api/employee/AddDocument (FormData)
   */
  addDocument: async (empId, documentId, document) => {
    console.log('🟢 Adding document:', { empId, documentId });

    const formData = new FormData();
    formData.append('empId', empId);
    formData.append('documentId', documentId);
    formData.append('document', document);

    const response = await apiClient.post('/api/employee/AddDocument', formData);
    
    if (response.data?.status !== 'Success') {
      throw new Error('Failed to add document');
    }

    return response.data.result;
  },

  /**
   * Update document for employee
   * API: POST /api/employee/UpdateDocument (FormData)
   */
  updateDocument: async (empId, documentId, document) => {
    console.log('🟢 Updating document:', { empId, documentId });

    const formData = new FormData();
    formData.append('empId', empId);
    formData.append('documentId', documentId);
    formData.append('document', document);

    const response = await apiClient.post('/api/employee/UpdateDocument', formData);
    
    if (response.data?.status !== 'Success') {
      throw new Error('Failed to update document');
    }

    return response.data.result;
  }
};

export default employeeService;