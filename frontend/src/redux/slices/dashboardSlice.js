import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import apiConfig from '../../config/apiConfig';
import dashboardService from '../../services/dashboardService';

// Inline Mock Data (since JSON files don't exist)
const mockDashboardStats = [
  { title: 'Total Requests', value: 24, iconKey: 'FlightTakeoff', trend: '+12%' },
  { title: 'Pending', value: 5, iconKey: 'PendingActions', trend: '+2' },
  { title: 'Approved', value: 15, iconKey: 'CheckCircle', trend: '+8%' }
];

const mockPendingApprovals = [
  { id: 'req-001', employee: 'John Doe', destination: 'New York', departure: '2025-12-15', status: 'MANAGER_REVIEW' },
  { id: 'req-002', employee: 'Jane Smith', destination: 'London', departure: '2025-12-10', status: 'MANAGER_REVIEW' }
];

const mockEmployeeActiveRequest = {
  id: 'req-001',
  destination: 'New York, USA',
  departure: '2025-12-15',
  return: '2025-12-20',
  status: 'APPROVED',
  steps: [
    { label: 'Submitted', completed: true, active: false },
    { label: 'Manager Approved', completed: true, active: false },
    { label: 'Documents Required', completed: false, active: true },
    { label: 'Booking', completed: false, active: false }
  ],
  documents: [
    { id: 'doc-1', name: 'Passport Front', status: 'PENDING' },
    { id: 'doc-2', name: 'Passport Back', status: 'PENDING' },
    { id: 'doc-3', name: 'Visa Application', status: 'PENDING' }
  ]
};

// Async Thunks
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetch',
  async (_, { getState }) => {
    if (apiConfig.USE_MOCK_API) {
      const { auth } = getState();
      const userRole = auth.user?.role;

      // Use dashboardService for mock data
      const stats = await dashboardService.getDashboardStats(userRole);
      const pendingApprovals = await dashboardService.getPendingApprovals();

      return {
        stats: stats || mockDashboardStats,
        pendingApprovals: pendingApprovals || mockPendingApprovals,
        activeRequest: mockEmployeeActiveRequest
      };
    }
    const [statsRes, approvalsRes] = await Promise.all([
      api.get(apiConfig.ENDPOINTS.DASHBOARD_STATS),
      api.get(apiConfig.ENDPOINTS.PENDING_APPROVALS)
    ]);
    return {
      stats: statsRes.data?.data || statsRes.data,
      pendingApprovals: approvalsRes.data?.data || approvalsRes.data
    };
  }
);

export const fetchTravelDeskData = createAsyncThunk(
  'dashboard/fetchTravelDesk',
  async () => {
    if (apiConfig.USE_MOCK_API) {
      const pendingRequests = await dashboardService.getPendingRequests();
      return { pendingRequests: pendingRequests || [] };
    }
    const response = await api.get(apiConfig.ENDPOINTS.TRAVEL_DESK.PENDING_REQUESTS);
    return { pendingRequests: response.data?.data || response.data };
  }
);

const initialState = {
  stats: [],
  pendingApprovals: [],
  loading: false,
  error: null,
  activeRequest: null,
  pendingRequests: [], // For Travel Desk
  notifications: [
    { id: 1, message: "New travel request from John Doe", read: false, time: "10 mins ago" },
    { id: 2, message: "Flight booking confirmed for NY", read: true, time: "2 hours ago" }
  ],
  approvalHistory: [
    { role: 'MANAGER', name: 'Alice Manager', status: 'APPROVED', comment: 'Approved, proceed.', date: '2025-11-26 10:30 AM' },
    { role: 'AVP', name: 'Bob AVP', status: 'PENDING', comment: '', date: '' }
  ]
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateRequestStatus: (state, action) => {
      const { id, status, stepIndex } = action.payload;
      if (state.activeRequest && state.activeRequest.id === id) {
        state.activeRequest.status = status;
        if (stepIndex !== undefined) {
          state.activeRequest.steps = state.activeRequest.steps.map((step, index) => ({
            ...step,
            completed: index < stepIndex,
            active: index === stepIndex
          }));
        }
      }
      const approvalIndex = state.pendingApprovals.findIndex(r => r.id === id);
      if (approvalIndex !== -1) {
        state.pendingApprovals[approvalIndex].status = status;
      }
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now(),
        message: action.payload,
        read: false,
        time: "Just now"
      });
    },
    markNotificationRead: (state, action) => {
      const notif = state.notifications.find(n => n.id === action.payload);
      if (notif) notif.read = true;
    },
    addApprovalHistory: (state, action) => {
      state.approvalHistory.push(action.payload);
    },
    // Travel Desk Actions
    processBooking: (state, action) => {
      // Logic to move request from pending to booked
      const { id, bookingDetails } = action.payload;
      // Update status logic here
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.pendingApprovals = action.payload.pendingApprovals;
        state.activeRequest = action.payload.activeRequest;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTravelDeskData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTravelDeskData.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = action.payload.pendingRequests;
      })
      .addCase(fetchTravelDeskData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  updateRequestStatus,
  addNotification,
  markNotificationRead,
  addApprovalHistory,
  processBooking
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
