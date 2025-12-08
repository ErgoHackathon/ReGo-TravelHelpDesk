/**
 * Manager Service
 * Handles all manager-specific API calls
 * Connected to real backend APIs
 */

import apiClient from '../api/client';
import apiConfig, { ENDPOINTS } from '../config/apiConfig';

// Status labels mapping
const TRAVEL_STATUS_LABELS = {
  0: 'Pending',
  1: 'Submitted',
  2: 'Manager Approved',
  3: 'Completed',
  4: 'Rejected',
};

const managerService = {
  /**
   * Get team members reporting to manager
   * API: POST /api/manager/GetEmployeesByRptId
   * @param {string|number} managerId - Manager's employee ID
   */
  getTeam: async (managerId) => {
    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK API for getTeam');
      return [
        { empId: '101', name: 'John Doe', email: 'john@demo.com' },
        { empId: '102', name: 'Jane Smith', email: 'jane@demo.com' }
      ];
    }

    console.log('🟢 Getting team for managerId:', managerId);

    const formData = new FormData();
    formData.append('RptId', managerId);

    const response = await apiClient.post('/api/manager/GetEmployeesByRptId', formData);
    console.log('Team API response:', response.data);

    if (response.data?.status !== 'Success' || !response.data?.result) {
      console.warn('No team members found');
      return [];
    }

    const team = Array.isArray(response.data.result)
      ? response.data.result
      : [response.data.result];

    return team.map(member => ({
      empId: member.empId,
      name: member.name,
      email: member.email
    }));
  },

  /**
   * Get travel requests for team members
   * API: POST /api/manager/TravelDetailByRptId
   * @param {string|number} managerId - Manager's employee ID
   */
  getTeamTravel: async (managerId) => {
    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK API for getTeamTravel');
      return [
        {
          id: 'tr-001',
          empId: '101',
          destination: 'Munich, Germany',
          departureDate: '2025-12-10',
          returnDate: '2025-12-20',
          status: 2,
          statusLabel: 'Manager Approved',
          purpose: 'Project kickoff'
        }
      ];
    }

    console.log('🟢 Getting team travel for managerId:', managerId);

    const formData = new FormData();
    formData.append('RptId', managerId.toString());

    const response = await apiClient.post('/api/manager/TravelDetailByRptId', formData);
    console.log('Team travel API response:', response.data);

    if (response.data?.status !== 'Success' || !response.data?.result) {
      console.warn('No team travel data found');
      return [];
    }

    const travels = Array.isArray(response.data.result)
      ? response.data.result
      : [response.data.result];

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
   * Alias for getTeamTravel (backward compatibility)
   */
  getManagerTravel: async (managerId) => {
    return managerService.getTeamTravel(managerId);
  },

  /**
   * Create new travel request
   * API: POST /api/manager/InsertTravelDetail
   * @param {object} travelData - Travel request data
   */
  createTravelRequest: async (travelData) => {
    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK API for createTravelRequest');
      return { success: true, message: 'Travel request created' };
    }

    console.log('🟢 Creating travel request:', travelData);

    const payload = [{
      empId: String(travelData.empId),
      country: travelData.country,
      city: travelData.city,
      remark: travelData.remark || travelData.purpose || '',
      suggestedDate: travelData.suggestedDate || new Date().toISOString(),
      travelStartDate: travelData.travelStartDate || travelData.departureDate,
      travelEndDate: travelData.travelEndDate || travelData.returnDate,
      status: travelData.status || 0,
      rptEmpId: String(travelData.rptEmpId)
    }];

    const response = await apiClient.post('/api/manager/InsertTravelDetail', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Create travel response:', response.data);

    if (response.data?.status !== 'Success') {
      throw new Error(response.data?.result || 'Failed to create travel request');
    }

    return response.data.result;
  },

  /**
   * Update travel status
   * API: POST /api/UpdateTravelStatus
   * @param {string} empId - Employee ID
   * @param {number} status - New status
   */
  updateTravelStatus: async (empId, status) => {
    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK API for updateTravelStatus');
      return { success: true, message: 'Status updated' };
    }

    console.log('🟢 Updating travel status:', { empId, status });

    const formData = new FormData();
    formData.append('empId', empId);
    formData.append('status', status);

    const response = await apiClient.post('/api/UpdateTravelStatus', formData);
    console.log('Update status response:', response.data);

    if (response.data?.status !== 'Success') {
      throw new Error('Failed to update travel status');
    }

    return response.data.result;
  },

  /**
   * Approve travel request
   */
  approveTravelRequest: async (empId) => {
    return managerService.updateTravelStatus(empId, 2); // Status 2 = Manager Approved
  },

  /**
   * Reject travel request
   */
  rejectTravelRequest: async (empId) => {
    return managerService.updateTravelStatus(empId, 4); // Status 4 = Rejected
  }
};

export default managerService;