/**
 * Dashboard Service
 */

import api from './apiService';
import employeeService from './employeeService';
import managerService from './managerService';

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

      // ✅ FIX: Different API based on role
      if (role === 'MANAGER' || role === 'AVP' || role === 'SVP' || role === 'CHRO') {
        // Managers see team's travel requests
        travels = await managerService.getTeamTravel(userId);
        console.log("travels:::::::: ", travels)
      }
      // else if(role === 'SVP'){
      //   travels = await managerService.getSVPTeamTravel(userId);
      //   console.log("travels:::::::: ", travels)
      // }
      else {
        // Employees see their own travel requests
        travels = await employeeService.getEmployeeTravel(userId);
      }

      // Calculate stats
      const stats = {
        totalRequests: travels.length,
        pending: travels.filter(t => t.status === 0 || t.status === 1 || t.status === 2 || t.status === 3 || t.status ===13 || t.status===14 || t.status===15 || t.status===16).length,
        approved: travels.filter(t => t.status === 5 || t.status === 4 || t.status === 6).length,
        completed: travels.filter(t => t.status === 17).length,
        rejected: travels.filter(t => t.status === 18).length,
      };

      console.log("stats here:::::::: ", stats)

      // Format for display
      const formattedStats = [
        { title: 'Total Requests', value: stats.totalRequests, iconKey: 'Flight', color: 'primary', trend: '' },
        { title: 'Pending', value: stats.pending, iconKey: 'PendingActions', color: 'warning', trend: '' },
        { title: 'Approved', value: stats.approved, iconKey: 'CheckCircle', color: 'success', trend: '' },
        { title: 'Rejected', value: stats.rejected, iconKey: 'Cancel', color: 'error', trend: '' }
      ];

      console.log('📊 Stats calculated:', stats);

      console.log("formattedStats:::::::: ", formattedStats)
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

  /**
   * Get recent travel requests
   */
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

      return travels.slice(0, 5);
    } catch (error) {
      console.error('❌ Error getting recent requests:', error);
      return [];
    }
  },
  
  updateRequestStatus: async (travelId, status) =>{
    const updateRequest = await api.updateTravelStatus(travelId, status)
  },

  /**
   * Get pending requests for Travel Desk
   */
  getPendingRequests: async () => {
    // TODO: Need backend API for this
    return [];
  }
};

// Helper
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