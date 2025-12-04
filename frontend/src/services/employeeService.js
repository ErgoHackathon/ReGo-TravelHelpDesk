/**
 * Employee Service
 * Clean service - uses apiService for data
 */

import api from './apiService';

const TRAVEL_STATUS_LABELS = {
  0: 'Pending',
  1: 'Submitted',
  2: 'Approved',
  3: 'Completed',
  4: 'Rejected',
};

const employeeService = {
  /**
   * Get employee profile
   */
  getEmployeeProfile: async (idOrEmail) => {
    const response = await api.getEmployeeData(idOrEmail);

    if (response.status !== 'Success' || !response.result) {
      throw new Error('Failed to fetch employee profile');
    }

    const data = response.result;

    return {
      empId: data.empId,
      empName: data.name,
      email: data.email,
      rptEmpId: data.rptEmpId,
      refRoleId: data.refRoleId || 101,
    };
  },

  /**
   * Get employee travel
   */
  getEmployeeTravel: async (empId) => {
    if (!empId) return [];

    const response = await api.getTravelDetailByEmpId(empId);

    if (response.status === 'Functional Failure' || !response.result) {
      return [];
    }

    const result = response.result;
    const travels = Array.isArray(result) ? result : [result];

    return travels.map((travel, index) => ({
      id: `${travel.empId}-${index}`,
      empId: travel.empId,
      country: travel.country,
      city: travel.city,
      destination: `${travel.city}, ${travel.country}`,
      purpose: travel.remark,
      departureDate: travel.travelStartDate,
      returnDate: travel.travelEndDate,
      status: travel.status,
      statusLabel: TRAVEL_STATUS_LABELS[travel.status] || 'Unknown',
      rptEmpId: travel.rptEmpId
    }));
  },

  /**
   * Add document
   */
  addDocument: async (empId, documentId, document) => {
    const response = await api.addDocument(empId, documentId, document);

    if (response.status !== 'Success') {
      throw new Error('Failed to add document');
    }

    return response.result;
  },

  /**
   * Update document
   */
  updateDocument: async (empId, documentId, document) => {
    const response = await api.updateDocument(empId, documentId, document);

    if (response.status !== 'Success') {
      throw new Error('Failed to update document');
    }

    return response.result;
  }
};

export default employeeService;