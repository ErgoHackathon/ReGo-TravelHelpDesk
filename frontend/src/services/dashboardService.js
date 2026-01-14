/**
 * Dashboard Service - CORRECTED VERSION
 */

import api from './apiService';
import employeeService from './employeeService';
import managerService from './managerService';
import { getStatusLabel as mapStatusLabel } from '../utils/statusMapper';

const STATUS = {
  MANAGER_INITIATED: 1,
  AVP_INITIATED: 2,
  SVP_INITIATED: 3,
  MANAGER_APPROVED: 4,
  AVP_APPROVED: 5,
  SVP_APPROVED: 6,
  MANAGER_FINAL_INITIATED: 7,
  AVP_FINAL_INITIATED: 8,
  SVP_FINAL_INITIATED: 9,
  MANAGER_FINAL_APPROVED: 10,
  AVP_FINAL_APPROVED: 11,
  SVP_FINAL_APPROVED: 12,
  DOCUMENT_PENDING: 13,
  DOCUMENT_REVIEW_PENDING: 14,
  PENDING_TICKETS: 15,
  TICKETS_UPLOADED: 16,
  COMPLETED: 17
};

const HELPDESK_PENDING_STATUSES = [STATUS.DOCUMENT_REVIEW_PENDING, STATUS.PENDING_TICKETS];
const HELPDESK_COMPLETED_STATUSES = [STATUS.TICKETS_UPLOADED, STATUS.COMPLETED];

const getStatusLabel = (statusId) => mapStatusLabel(statusId);

const employeeCache = new Map();

const getEmployeeName = async (empId) => {
  if (!empId) return 'Unknown';
  if (employeeCache.has(empId)) return employeeCache.get(empId);

  try {
    const response = await employeeService.getEmployeeProfile(empId);
    const name = response?.Name || response?.name || `Employee ${empId}`;
    employeeCache.set(empId, name);
    return name;
  } catch (error) {
    console.error(`Error fetching employee ${empId}:`, error);
    return `Employee ${empId}`;
  }
};

const formatDate = (dateString) => {
  if (!dateString || dateString === '0001-01-01T00:00:00') return 'Not Set';
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  } catch { return dateString; }
};

// ============================================
// ✅ HELPER: Normalize Role ID
// Backend returns 1-5 from GetRoleMaster
// Some places use 101-105 convention
// ============================================
const normalizeRoleId = (roleId) => {
  if (roleId >= 101 && roleId <= 105) {
    return roleId - 100;
  }
  return roleId;
};

const isManager = (roleId) => normalizeRoleId(roleId) === 2;
const isAVP = (roleId) => normalizeRoleId(roleId) === 4;
const isSVP = (roleId) => normalizeRoleId(roleId) === 5;

// ============================================
// DASHBOARD SERVICE
// ============================================
const dashboardService = {
  /**
   * Get dashboard statistics - CORRECTED
   */
  getDashboardStats: async (role, userId, userRoleID) => {
    console.log('🟢 Getting dashboard stats for:', { role, userId, userRoleID });

    if (!userId) {
      console.warn('⚠️ No userId provided');
      return getEmptyStats();
    }

    try {
      let travels = [];

      if (role === 'MANAGER' || role === 'CHRO') {
        travels = await managerService.getTeamTravel(userId);
      } else if (role === 'AVP') {
        travels = await managerService.getAvpTeamTravel(userId);
      } else if (role === 'SVP') {
        travels = await managerService.getSvpTeamTravel(userId);
      } else {
        travels = await employeeService.getEmployeeTravel(userId);
      }

      if (!Array.isArray(travels)) {
        console.warn('⚠️ travels is not an array:', travels);
        travels = [];
      }

      let stats = {};

      // ============================================
      // ✅ CORRECTED: Stats calculation using normalized role check
      // ============================================
      
      // Manager (roleId 2 or 102)
      // Pending = Status 1 (own initiated), 7 (final initiated)
      // Approved = Status 4+ (manager approved onwards)
      const statsManager = {
        totalRequests: travels.length,
        pending: travels.filter(t => [1, 7].includes(t.status)).length,
        approved: travels.filter(t => [4, 5, 6, 10, 11, 12, 13, 14, 15, 16, 17].includes(t.status)).length,
        rejected: travels.filter(t => [18, 19, 20].includes(t.status)).length,
      };

      // AVP (roleId 4 or 104)
      // Pending = Status 2 (own), 4 (from manager), 8, 10
      // Approved = Status 5+ (AVP approved onwards)
      const statsAVP = {
        totalRequests: travels.length,
        pending: travels.filter(t => [2, 4, 8, 10].includes(t.status)).length,
        approved: travels.filter(t => [5, 6, 11, 12, 13, 14, 15, 16, 17].includes(t.status)).length,
        rejected: travels.filter(t => [18, 19, 20].includes(t.status)).length,
      };

      // SVP (roleId 5 or 105)
      // Pending = Status 3 (own), 5 (from AVP), 9, 11
      // Approved = Status 6+ (SVP approved onwards)
      const statsSVP = {
        totalRequests: travels.length,
        pending: travels.filter(t => [3, 5, 9, 11].includes(t.status)).length,
        approved: travels.filter(t => [6, 12, 13, 14, 15, 16, 17].includes(t.status)).length,
        rejected: travels.filter(t => [18, 19, 20].includes(t.status)).length,
      };

      // ✅ FIXED: Use normalized role checking
      if (isManager(userRoleID)) {
        stats = statsManager;
        console.log('📊 Using Manager stats');
      } else if (isAVP(userRoleID)) {
        stats = statsAVP;
        console.log('📊 Using AVP stats');
      } else if (isSVP(userRoleID)) {
        stats = statsSVP;
        console.log('📊 Using SVP stats');
      } else {
        // Default fallback
        stats = {
          totalRequests: travels.length,
          pending: travels.filter(t => t.status < 6).length,
          approved: travels.filter(t => t.status >= 6 && t.status <= 17).length,
          rejected: travels.filter(t => t.status >= 18).length,
        };
        console.log('📊 Using default stats (unknown role)');
      }

      const formattedStats = [
        { title: 'Total Requests', value: stats.totalRequests, iconKey: 'Flight', color: 'primary', trend: '' },
        { title: 'Pending', value: stats.pending, iconKey: 'PendingActions', color: 'warning', trend: '' },
        { title: 'Approved', value: stats.approved, iconKey: 'CheckCircle', color: 'success', trend: '' },
        { title: 'Rejected', value: stats.rejected, iconKey: 'Cancel', color: 'error', trend: '' }
      ];

      return { ...stats, stats: formattedStats };

    } catch (error) {
      console.error('❌ Error getting stats:', error);
      return getEmptyStats();
    }
  },

  getPendingApprovals: async (managerId) => {
    console.log('🟢 Getting pending approvals for:', managerId);
    if (!managerId) return [];

    try {
      const travels = await managerService.getTeamTravel(managerId);
      const pending = travels.filter(t => t.status === 0 || t.status === 1);
      console.log('📊 Pending approvals:', pending.length);
      return pending;
    } catch (error) {
      console.error('❌ Error getting pending approvals:', error);
      return [];
    }
  },

  getAllDetails: async (managerId) => {
    console.log('🟢 Getting all requests for:', managerId);
    if (!managerId) return [];

    try {
      const travels = await managerService.getTeamTravel(managerId);
      const travelsWithEmployeeDetails = await Promise.all(travels.map(async travel => {
        const employeeDetails = await employeeService.getEmployeeProfile(travel?.empId);
        return { ...travel, employeeDetails };
      }));
      return travelsWithEmployeeDetails;
    } catch (error) {
      console.error('❌ Error getting all details:', error);
      return [];
    }
  },

  getAllAvpDetails: async (managerId) => {
    console.log('🟢 Getting all requests for AVP:', managerId);
    if (!managerId) return [];

    try {
      const travels = await managerService.getAvpTeamTravel(managerId);
      const travelsWithEmployeeDetails = await Promise.all(travels.map(async travel => {
        const employeeDetails = await employeeService.getEmployeeProfile(travel?.empId);
        return { ...travel, employeeDetails };
      }));
      return travelsWithEmployeeDetails;
    } catch (error) {
      console.error('❌ Error getting AVP details:', error);
      return [];
    }
  },

  getAllSvpDetails: async (managerId) => {
    console.log('🟢 Getting all requests for SVP:', managerId);
    if (!managerId) return [];

    try {
      const travels = await managerService.getSvpTeamTravel(managerId);
      const travelsWithEmployeeDetails = await Promise.all(travels.map(async travel => {
        const employeeDetails = await employeeService.getEmployeeProfile(travel?.empId);
        return { ...travel, employeeDetails };
      }));
      return travelsWithEmployeeDetails;
    } catch (error) {
      console.error('❌ Error getting SVP details:', error);
      return [];
    }
  },

  getRecentRequests: async (empId, role) => {
    console.log('🟢 Getting recent requests for:', { empId, role });
    if (!empId) return [];

    try {
      let travels = [];

      if (role === 'MANAGER' || role === 'AVP' || role === 'SVP' || role === 'CHRO') {
        travels = await managerService.getTeamTravel(empId);
      } else {
        travels = await employeeService.getEmployeeTravel(empId);
      }

      console.log('🔍 DEBUG - Raw travels data:', travels);
      console.log('🔍 DEBUG - First travel item:', travels[0]);

      return travels.slice(0, 5);
    } catch (error) {
      console.error('❌ Error getting recent requests:', error);
      return [];
    }
  },

  updateRequestStatus: async (travelId, status) => {
    await api.updateTravelStatus(travelId, status);
  },

  getAllTravelDetails: async () => {
    try {
      console.log('📊 Fetching all travel details for Travel Desk...');
      const response = await api.getAllTravelDetails();
      console.log('📊 GetAllTravelDetails response:', response);

      if (!response || response.status === 'Functional Failure') return [];
      return response.result || response.Result || [];
    } catch (error) {
      console.error('❌ Error fetching all travel details:', error);
      throw error;
    }
  },

  getPendingRequests: async () => {
    console.log('🟢 Getting pending requests for Travel Desk');

    try {
      const response = await dashboardService.getAllTravelDetails();
      const travels = response?.result || response?.Result || [];

      if (travels.length === 0) {
        console.log('📊 No travel details found');
        return [];
      }

      const pendingBookings = travels.filter(travel =>
        HELPDESK_PENDING_STATUSES.includes(travel.status)
      );

      console.log('📊 Filtered pending bookings:', pendingBookings.length);

      const transformedData = await Promise.all(
        pendingBookings.map(async (item) => {
          const employeeName = await getEmployeeName(item.empId);
          return {
            id: item.tId,
            tId: item.tId,
            requestId: `TR-${String(item.tId).padStart(5, '0')}`,
            employee: employeeName,
            employeeId: item.empId,
            destination: `${item.city || ''}, ${item.country || ''}`.replace(/^, |, $/g, ''),
            country: item.country,
            city: item.city,
            departure: formatDate(item.travelStartDate),
            returnDate: formatDate(item.travelEndDate),
            travelStartDate: item.travelStartDate,
            travelEndDate: item.travelEndDate,
            status: getStatusLabel(item.status),
            statusId: item.status,
            remark: item.remark,
            rptEmpId: item.rptEmpId,
            bookingDetails: null
          };
        })
      );

      return transformedData;
    } catch (error) {
      console.error('❌ Error fetching pending requests:', error);
      return [];
    }
  },

  getCompletedBookings: async () => {
    console.log('🟢 Getting completed bookings for Travel Desk');

    try {
      const response = await dashboardService.getAllTravelDetails();
      const travels = response?.result || response?.Result || [];

      if (!Array.isArray(travels)) return [];

      const completed = travels.filter(travel =>
        HELPDESK_COMPLETED_STATUSES.includes(travel.status)
      );

      const transformedData = await Promise.all(
        completed.map(async (item) => {
          const employeeName = await getEmployeeName(item.empId);
          return {
            id: item.tId,
            tId: item.tId,
            requestId: `TR-${String(item.tId).padStart(5, '0')}`,
            employee: employeeName,
            employeeId: item.empId,
            destination: `${item.city || ''}, ${item.country || ''}`.replace(/^, |, $/g, ''),
            status: getStatusLabel(item.status),
            statusId: item.status,
            bookingDetails: {
              airline: item.airline || 'N/A',
              pnr: item.pnr || 'N/A',
              hotelName: item.hotelName || 'N/A'
            }
          };
        })
      );

      return transformedData;
    } catch (error) {
      console.error('❌ Error fetching completed bookings:', error);
      return [];
    }
  },

  processBooking: async (travelId) => {
    console.log('🟢 Processing booking for travel:', travelId);
    try {
      const response = await api.updateTravelStatus(travelId, STATUS.TICKETS_UPLOADED);
      console.log('📊 Process booking response:', response);
      return response;
    } catch (error) {
      console.error('❌ Error processing booking:', error);
      throw error;
    }
  },

  markAsCompleted: async (travelId) => {
    console.log('🟢 Marking travel as completed:', travelId);
    try {
      const response = await api.updateTravelStatus(travelId, STATUS.COMPLETED);
      console.log('📊 Mark completed response:', response);
      return response;
    } catch (error) {
      console.error('❌ Error marking as completed:', error);
      throw error;
    }
  },

  getPassportInfo: async (empId) => {
    console.log('🟢 Getting passport info for:', empId);
    try {
      return await api.getPassportInfo(empId);
    } catch (error) {
      console.error('❌ Error fetching passport info:', error);
      throw error;
    }
  },

  getEmployeeDocuments: async (empId, documentId) => {
    console.log('🟢 Getting employee documents:', { empId, documentId });
    try {
      return await api.getEmployeeDocuments(empId, documentId);
    } catch (error) {
      console.error('❌ Error fetching employee documents:', error);
      throw error;
    }
  }
};

const getEmptyStats = () => ({
  totalRequests: 0,
  pending: 0,
  approved: 0,
  completed: 0,
  rejected: 0,
  stats: [
    { title: 'Total Requests', value: 0, iconKey: 'Flight', color: 'primary', trend: '' },
    { title: 'Pending', value: 0, iconKey: 'PendingActions', color: 'warning', trend: '' },
    { title: 'Approved', value: 0, iconKey: 'CheckCircle', color: 'success', trend: '' },
    { title: 'Rejected', value: 0, iconKey: 'Cancel', color: 'error', trend: '' }
  ]
});

export default dashboardService;