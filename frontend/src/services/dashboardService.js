/**
 * Dashboard Service
 */

import api from './apiService';
import employeeService from './employeeService';
import managerService from './managerService';
import realApi from './api/realApi'; 
const STATUS = {
  // 
  MANAGER_INITIATED: 1,
  AVP_INITIATED: 2,
  SVP_INITIATED: 3,
  
  // Initial Approved
  MANAGER_APPROVED: 4,
  AVP_APPROVED: 5,
  SVP_APPROVED: 6,
  
  // Final Initiated
  MANAGER_FINAL_INITIATED: 7,
  AVP_FINAL_INITIATED: 8,
  SVP_FINAL_INITIATED: 9,
  
  // Final Approved
  MANAGER_FINAL_APPROVED: 10,
  AVP_FINAL_APPROVED: 11,
  SVP_FINAL_APPROVED: 12,
  
  // HelpDesk/Travel Desk statuses
  DOCUMENT_PENDING: 13,
  DOCUMENT_REVIEW_PENDING: 14,  // HelpDesk reviews documents
  PENDING_TICKETS: 15,          // HelpDesk books tickets
  TICKETS_UPLOADED: 16,         // Booking completed
  COMPLETED: 17                 // Travel completed
};

// Status IDs that Travel Desk needs to work on
const HELPDESK_PENDING_STATUSES = [
  STATUS.DOCUMENT_REVIEW_PENDING,  // 14
  STATUS.PENDING_TICKETS           // 15
];

// Status IDs for completed bookings
const HELPDESK_COMPLETED_STATUSES = [
  STATUS.TICKETS_UPLOADED,  // 16
  STATUS.COMPLETED          // 17
];

// ============================================
// STATUS LABEL MAPPING
// ============================================
const getStatusLabel = (statusId) => {
  const statusMap = {
    1: 'Manager Initiated',
    2: 'AVP/DVP Initiated',
    3: 'SVP Initiated',
    4: 'Manager Approved',
    5: 'AVP/DVP Approved',
    6: 'SVP Approved',
    7: 'Final - Manager Initiated',
    8: 'Final - AVP/DVP Initiated',
    9: 'Final - SVP Initiated',
    10: 'Final - Manager Approved',
    11: 'Final - AVP/DVP Approved',
    12: 'Final - SVP Approved',
    13: 'Document Pending',
    14: 'Document Review Pending',
    15: 'Pending Flight/Hotel',
    16: 'Tickets Uploaded',
    17: 'Completed'
  };
  return statusMap[statusId] || 'Unknown';
};

// ============================================
// EMPLOYEE NAME CACHE (for performance)
// ============================================
const employeeCache = new Map();

const getEmployeeName = async (empId) => {
  if (!empId) return 'Unknown';
  
  if (employeeCache.has(empId)) {
    return employeeCache.get(empId);
  }
  
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
  if (!dateString || dateString === '0001-01-01T00:00:00') {
    return 'Not Set';
  }
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

// ============================================
// DASHBOARD SERVICE
// ============================================
const dashboardService = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (role, userId) => {
    console.log('🟢 Getting dashboard stats for:', { role, userId });

    if (!userId) {
      console.warn('⚠️ No userId provided');
      return getEmptyStats();
    }

    try {
      let travels = [];

      // ✅ Handle Travel Desk / Helpdesk role
      if (role === 'TRAVEL_DESK' || role === 'Helpdesk' || role === 'HELPDESK') {
        const response = await realApi.getAllTravelDetails();
        travels = response?.result || response?.Result || [];
        
        // Travel Desk specific stats
        const stats = {
          totalRequests: travels.length,
          pendingReview: travels.filter(t => t.status === 14).length,
          pendingBooking: travels.filter(t => t.status === 15).length,
          completed: travels.filter(t => t.status === 16 || t.status === 17).length,
        };

        const formattedStats = [
          { title: 'Total Requests', value: stats.totalRequests, iconKey: 'Flight', color: 'primary', trend: '' },
          { title: 'Pending Review', value: stats.pendingReview, iconKey: 'RateReview', color: 'warning', trend: '' },
          { title: 'Pending Booking', value: stats.pendingBooking, iconKey: 'FlightTakeoff', color: 'info', trend: '' },
          { title: 'Completed', value: stats.completed, iconKey: 'CheckCircle', color: 'success', trend: '' }
        ];

        return { ...stats, stats: formattedStats };
      }

      // ✅ Manager roles
      if (role === 'MANAGER' || role === 'AVP' || role === 'SVP' || role === 'CHRO') {
        travels = await managerService.getTeamTravel(userId);
        console.log("travels:::::::: ", travels)
      }
      else if(role === 'AVP'){
        travels = await managerService.getAvpTeamTravel(userId);
        console.log("travels:::::::: ", travels)
      }
      else if(role === 'SVP'){
        travels = await managerService.getSvpTeamTravel(userId);
        console.log("travels:::::::: ", travels)
      }
      else {
        // Employees see their own travel requests
        travels = await employeeService.getEmployeeTravel(userId);
      }

      // Calculate stats
      const stats = {
        totalRequests: travels.length,
        pending: travels.filter(t => t.status === 0 || t.status === 1 || t.status === 2 || t.status === 3 || t.status === 13 || t.status === 14 || t.status === 15 || t.status === 16).length,
        approved: travels.filter(t => t.status === 5 || t.status === 4 || t.status === 6).length,
        completed: travels.filter(t => t.status === 17).length,
        rejected: travels.filter(t => t.status === 18).length,
      };

      console.log("stats here:::::::: ", stats);

      // Format for display
      const formattedStats = [
        { title: 'Total Requests', value: stats.totalRequests, iconKey: 'Flight', color: 'primary', trend: '' },
        { title: 'Pending', value: stats.pending, iconKey: 'PendingActions', color: 'warning', trend: '' },
        { title: 'Approved', value: stats.approved, iconKey: 'CheckCircle', color: 'success', trend: '' },
        { title: 'Rejected', value: stats.rejected, iconKey: 'Cancel', color: 'error', trend: '' }
      ];

      console.log('📊 Stats calculated:', stats);
      console.log("formattedStats:::::::: ", formattedStats);
      
      return { ...stats, stats: formattedStats };

    } catch (error) {
      console.error('❌ Error getting stats:', error);
      return getEmptyStats();
    }
  },

  /**
   * Get pending approvals (for managers only)
   */
  getPendingApprovals: async (managerId) => {
    console.log('🟢 Getting pending approvals for:', managerId);

    if (!managerId) {
      console.warn('⚠️ No managerId provided');
      return [];
    }

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

    if (!managerId) {
      console.warn('⚠️ No managerId provided');
      return [];
    }

    try {
      const travels = await managerService.getTeamTravel(managerId);

      const travelsWithEmployeeDetails = await Promise.all(travels.map(async travel => {
        const employeeDetails = await employeeService.getEmployeeProfile(travel?.empId);
        console.log("employeeDetails:::::::::: ", employeeDetails);
        
        return {
          ...travel,
          employeeDetails
        };
      }));

      return travelsWithEmployeeDetails;
    } catch (error) {
      console.error('❌ Error getting pending approvals:', error);
      return [];
    }
  },

  getAllAvpDetails: async (managerId) => {
    console.log('🟢 Getting all requests for AVP:', managerId);

    if (!managerId) {
      console.warn('⚠️ No managerId provided');
      return [];
    }

    try {
      const travels = await managerService.getAvpTeamTravel(managerId);
      // const pending = travels.filter(t => t.status === 0 || t.status === 1);
      // console.log('📊 Pending approvals:', pending.length);
      // travels?.forEach(async travel => {
      //   const employeeDetails = await employeeService.getEmployeeProfile(travel.empId)
      //   console.log("employeeDetails:::::::::: ", employeeDetails)
      //   {...travel, }
      // });

      const travelsWithEmployeeDetails = await Promise.all(travels.map(async travel => {
        const employeeDetails = await employeeService.getEmployeeProfile(travel?.empId);
        console.log("employeeDetails:::::::::: ", employeeDetails);
        
        // Return a new object that combines travel and employeeDetails
        return {
            ...travel, // Spread the existing travel properties
            employeeDetails // Add the employee details
        };
    }));

      return travelsWithEmployeeDetails;
    } catch (error) {
      console.error('❌ Error getting pending approvals:', error);
      return [];
    }
  },

  getAllSvpDetails: async (managerId) => {
    console.log('🟢 Getting all requests for AVP:', managerId);

    if (!managerId) {
      console.warn('⚠️ No managerId provided');
      return [];
    }

    try {
      const travels = await managerService.getSvpTeamTravel(managerId);
      // const pending = travels.filter(t => t.status === 0 || t.status === 1);
      // console.log('📊 Pending approvals:', pending.length);
      // travels?.forEach(async travel => {
      //   const employeeDetails = await employeeService.getEmployeeProfile(travel.empId)
      //   console.log("employeeDetails:::::::::: ", employeeDetails)
      //   {...travel, }
      // });

      const travelsWithEmployeeDetails = await Promise.all(travels.map(async travel => {
        const employeeDetails = await employeeService.getEmployeeProfile(travel?.empId);
        console.log("employeeDetails:::::::::: ", employeeDetails);
        
        return {
          ...travel,
          employeeDetails
        };
      }));

      return travelsWithEmployeeDetails;
    } catch (error) {
      console.error('❌ Error getting pending approvals:', error);
      return [];
    }
  },

  /**
   * Get recent travel requests
   */
  getRecentRequests: async (empId, role) => {
    console.log('🟢 Getting recent requests for:', { empId, role });

    if (!empId) return [];

    try {
      let travels = [];

      // ✅ Handle Travel Desk
      if (role === 'TRAVEL_DESK' || role === 'Helpdesk' || role === 'HELPDESK') {
        const response = await realApi.getAllTravelDetails();
        travels = response?.result || response?.Result || [];
        return travels.slice(0, 5);
      }

      if (role === 'MANAGER' || role === 'AVP' || role === 'SVP' || role === 'CHRO') {
        travels = await managerService.getTeamTravel(empId);
      } else {
        travels = await employeeService.getEmployeeTravel(empId);
      }

      return travels.slice(0, 5);
    } catch (error) {
      console.error('❌ Error getting recent requests:', error);
      return [];
    }
  },
  
  updateRequestStatus: async (travelId, status) =>{
    console.log("we are in here:::::::::", travelId, status )
    const updateRequest = await api.updateTravelStatus(travelId, status)
    
  },

  // ============================================
  // ✅ NEW: TRAVEL DESK / HELPDESK METHODS
  // ============================================

  // ============================================
  // ✅ NEW: TRAVEL DESK / HELPDESK METHODS
  // ============================================

  /**
   * Get pending requests for Travel Desk
   * Filters: Status 14 (Document Review) and 15 (Pending Tickets)
   * Filters: Status 14 (Document Review) and 15 (Pending Tickets)
   */
  getPendingRequests: async () => {
    console.log('🟢 Getting pending requests for Travel Desk');

    try {
      const response = await realApi.getAllTravelDetails();
      console.log('📊 GetAllTravelDetails response:', response);

      const travels = response?.result || response?.Result || [];
      
      // ✅ DEBUG: Log actual status values
      console.log('📊 All travels with status:', travels.map(t => ({
        tId: t.tId,
        empId: t.empId,
        status: t.status,
        city: t.city,
        country: t.country
      })));

      if (travels.length === 0) {
        console.log('📊 No travel details found');
        return [];
      }

      // Filter for pending HelpDesk statuses (14, 15)
      const pendingBookings = travels.filter(travel =>
        HELPDESK_PENDING_STATUSES.includes(travel.status)
      );

      console.log('📊 Filtered pending bookings:', pendingBookings.length);

      // Transform to match frontend expected format
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

      console.log('📊 Transformed pending requests:', transformedData);
      return transformedData;

    } catch (error) {
      console.error('❌ Error fetching pending requests:', error);
      return [];
    }
  },

  /**
   * Get completed bookings for Travel Desk
   * Filters: Status 16 (Tickets Uploaded) and 17 (Completed)
   */
  getCompletedBookings: async () => {
    console.log('🟢 Getting completed bookings for Travel Desk');

    try {
      const response = await realApi.getAllTravelDetails();
      const travels = response?.result || response?.Result || [];

      // Filter for completed statuses (16, 17)
      const completed = travels.filter(travel =>
        HELPDESK_COMPLETED_STATUSES.includes(travel.status)
      );

      console.log('📊 Completed bookings:', completed.length);

      // Transform data
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

  /**
   * Process booking - Update status to 16 (Tickets Uploaded)
   * @param {number} travelId - Travel ID
   * @returns {Promise<object>} - API response
   */
  processBooking: async (travelId) => {
    console.log('🟢 Processing booking for travel:', travelId);

    try {
      const response = await realApi.updateTravelStatus(travelId, STATUS.TICKETS_UPLOADED);
      console.log('📊 Process booking response:', response);
      return response;
    } catch (error) {
      console.error('❌ Error processing booking:', error);
      throw error;
    }
  },

  /**
   * Mark travel as completed - Update status to 17
   * @param {number} travelId - Travel ID
   * @returns {Promise<object>} - API response
   */
  markAsCompleted: async (travelId) => {
    console.log('🟢 Marking travel as completed:', travelId);

    try {
      const response = await realApi.updateTravelStatus(travelId, STATUS.COMPLETED);
      console.log('📊 Mark completed response:', response);
      return response;
    } catch (error) {
      console.error('❌ Error marking as completed:', error);
      throw error;
    }
  },

  /**
   * Get employee passport info (for Travel Desk)
   * @param {string} empId - Employee ID
   * @returns {Promise<object>} - Passport info
   */
  getPassportInfo: async (empId) => {
    console.log('🟢 Getting passport info for:', empId);

    try {
      const response = await realApi.getPassportInfo(empId);
      return response;
    } catch (error) {
      console.error('❌ Error fetching passport info:', error);
      throw error;
    }
  },


  /**
   * Get employee documents (for Travel Desk review)
   * @param {string} empId - Employee ID
   * @param {number} documentId - Document ID
   * @returns {Promise<object>} - Document data
   */
  getEmployeeDocuments: async (empId, documentId) => {
    console.log('🟢 Getting employee documents:', { empId, documentId });

    try {
      const response = await realApi.getEmployeeDocuments(empId, documentId);
      return response;
    } catch (error) {
      console.error('❌ Error fetching employee documents:', error);
      throw error;
    }
  }
};

// ============================================
// HELPER - Empty Stats
// ============================================
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

// ============================================
// EXPORTS
// ============================================
export default dashboardService;
export { STATUS, getStatusLabel, HELPDESK_PENDING_STATUSES, HELPDESK_COMPLETED_STATUSES };