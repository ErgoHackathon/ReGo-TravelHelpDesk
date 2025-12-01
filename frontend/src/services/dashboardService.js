/**
 * Dashboard Service
 * Provides mock dashboard data for development
 * Will be replaced with real API calls when backend is ready
 */

import apiClient from '../api/client';
import apiConfig, { ENDPOINTS } from '../config/apiConfig';
import {
  People as PeopleIcon,
  PendingActions as PendingActionsIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Flight as FlightIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';

const dashboardService = {
  /**
   * Get dashboard statistics
   * @param {string} role - User role
   * @returns {Promise<Array>} - Array of stat objects
   */
  getDashboardStats: async (role) => {
    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK data for dashboard stats');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getMockStats(role));
        }, 500);
      });
    }

    // Real API call
    console.log('🟢 Using REAL API for dashboard stats');
    const response = await apiClient.get(ENDPOINTS.DASHBOARD.STATS);
    return response.data.data.stats;
  },

  /**
   * Get pending approvals
   * @returns {Promise<Array>} - Array of pending approval objects
   */
  getPendingApprovals: async () => {
    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK data for pending approvals');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getMockPendingApprovals());
        }, 500);
      });
    }

    // Real API call
    console.log('🟢 Using REAL API for pending approvals');
    const response = await apiClient.get(ENDPOINTS.APPROVALS.PENDING);
    return response.data.data.approvals;
  },

  /**
   * Get pending travel desk requests
   * @returns {Promise<Array>} - Array of pending request objects
   */
  getPendingRequests: async () => {
    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK data for pending requests');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getMockPendingRequests());
        }, 500);
      });
    }

    // Real API call
    console.log('🟢 Using REAL API for pending requests');
    const response = await apiClient.get(ENDPOINTS.TRAVEL_REQUESTS.LIST, {
      params: { status: 'PENDING' }
    });
    return response.data.data.requests;
  }
};

// ============================================
// MOCK DATA FUNCTIONS
// ============================================

/**
 * Get mock dashboard stats based on role
 * @param {string} role - User role
 * @returns {Array} - Mock stats
 */
const getMockStats = (role) => {
  const commonStats = [
    {
      title: 'Total Requests',
      value: 24,
      iconKey: 'Flight',
      color: 'primary',
      trend: '+12%'
    },
    {
      title: 'Pending Approvals',
      value: 5,
      iconKey: 'PendingActions',
      color: 'warning',
      trend: '+2'
    },
    {
      title: 'Approved',
      value: 15,
      iconKey: 'CheckCircle',
      color: 'success',
      trend: '+8%'
    },
    {
      title: 'Rejected',
      value: 4,
      iconKey: 'Cancel',
      color: 'error',
      trend: '-2'
    }
  ];

  if (role === 'MANAGER' || role === 'AVP' || role === 'SVP' || role === 'CHRO') {
    return [
      {
        title: 'Team Requests',
        value: 18,
        iconKey: 'People',
        color: 'primary',
        trend: '+5'
      },
      ...commonStats
    ];
  }

  if (role === 'TRAVEL_DESK' || role === 'ADMIN') {
    return [
      {
        title: 'Pending Processing',
        value: 12,
        iconKey: 'PendingActions',
        color: 'warning',
        trend: '+3'
      },
      {
        title: 'Total Bookings',
        value: 45,
        iconKey: 'Flight',
        color: 'info',
        trend: '+15%'
      },
      {
        title: 'Completed',
        value: 33,
        iconKey: 'CheckCircle',
        color: 'success',
        trend: '+10'
      }
    ];
  }

  if (role === 'FINANCE') {
    return [
      {
        title: 'Pending Reimbursements',
        value: 8,
        iconKey: 'AttachMoney',
        color: 'warning',
        trend: '+2'
      },
      {
        title: 'Total Amount',
        value: '₹2,45,000',
        iconKey: 'AttachMoney',
        color: 'success',
        trend: '+18%'
      },
      ...commonStats.slice(2)
    ];
  }

  return commonStats;
};

/**
 * Get mock pending approvals
 * @returns {Array} - Mock approvals
 */
const getMockPendingApprovals = () => {
  return [
    {
      id: 'req-001',
      requestNumber: 'TR-2025-001',
      employeeName: 'John Doe',
      destination: 'New York, USA',
      departureDate: '2025-12-15',
      returnDate: '2025-12-20',
      estimatedCost: 150000,
      purpose: 'Client meeting and product demo',
      status: 'MANAGER_REVIEW',
      priority: 'HIGH',
      submittedAt: '2025-11-25T10:30:00Z'
    },
    {
      id: 'req-002',
      requestNumber: 'TR-2025-002',
      employeeName: 'Jane Smith',
      destination: 'London, UK',
      departureDate: '2025-12-10',
      returnDate: '2025-12-15',
      estimatedCost: 180000,
      purpose: 'Technical conference attendance',
      status: 'MANAGER_REVIEW',
      priority: 'MEDIUM',
      submittedAt: '2025-11-24T14:15:00Z'
    },
    {
      id: 'req-003',
      requestNumber: 'TR-2025-003',
      employeeName: 'Mike Johnson',
      destination: 'Singapore',
      departureDate: '2025-12-08',
      returnDate: '2025-12-12',
      estimatedCost: 120000,
      purpose: 'Partner meeting',
      status: 'AVP_REVIEW',
      priority: 'MEDIUM',
      submittedAt: '2025-11-23T09:00:00Z'
    },
    {
      id: 'req-004',
      requestNumber: 'TR-2025-004',
      employeeName: 'Sarah Williams',
      destination: 'Dubai, UAE',
      departureDate: '2025-12-18',
      returnDate: '2025-12-22',
      estimatedCost: 95000,
      purpose: 'Training program',
      status: 'MANAGER_REVIEW',
      priority: 'LOW',
      submittedAt: '2025-11-26T11:45:00Z'
    },
    {
      id: 'req-005',
      requestNumber: 'TR-2025-005',
      employeeName: 'Robert Brown',
      destination: 'Tokyo, Japan',
      departureDate: '2025-12-20',
      returnDate: '2025-12-25',
      estimatedCost: 200000,
      purpose: 'Strategic planning meeting',
      status: 'SVP_REVIEW',
      priority: 'HIGH',
      submittedAt: '2025-11-22T16:20:00Z'
    }
  ];
};

/**
 * Get mock pending requests for travel desk
 * @returns {Array} - Mock requests
 */
const getMockPendingRequests = () => {
  return [
    {
      id: 'req-006',
      requestNumber: 'TR-2025-006',
      employeeName: 'Alice Cooper',
      destination: 'Paris, France',
      departureDate: '2025-12-12',
      returnDate: '2025-12-16',
      estimatedCost: 165000,
      purpose: 'Business development',
      status: 'APPROVED',
      priority: 'HIGH',
      approvedAt: '2025-11-27T10:00:00Z',
      needsBooking: true
    },
    {
      id: 'req-007',
      requestNumber: 'TR-2025-007',
      employeeName: 'David Lee',
      destination: 'Sydney, Australia',
      departureDate: '2025-12-14',
      returnDate: '2025-12-19',
      estimatedCost: 220000,
      purpose: 'Regional conference',
      status: 'APPROVED',
      priority: 'MEDIUM',
      approvedAt: '2025-11-26T15:30:00Z',
      needsBooking: true
    },
    {
      id: 'req-008',
      requestNumber: 'TR-2025-008',
      employeeName: 'Emma Watson',
      destination: 'Berlin, Germany',
      departureDate: '2025-12-09',
      returnDate: '2025-12-13',
      estimatedCost: 140000,
      purpose: 'Technical workshop',
      status: 'BOOKING_IN_PROGRESS',
      priority: 'HIGH',
      approvedAt: '2025-11-25T09:15:00Z',
      needsBooking: false
    }
  ];
};

export default dashboardService;
