import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import apiConfig from '../../config/apiConfig';

// Mock Data Imports
import mockDashboardStats from '../../mock/dashboardStats.json';
import mockPendingApprovals from '../../mock/pendingApprovals.json';
import mockEmployeeActiveRequest from '../../mock/employeeActiveRequest.json';

// Async Thunks
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetch',
  async () => {
    if (apiConfig.USE_MOCK_API) {
      return {
        stats: mockDashboardStats.data,
        pendingApprovals: mockPendingApprovals.data,
        activeRequest: mockEmployeeActiveRequest.data
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
