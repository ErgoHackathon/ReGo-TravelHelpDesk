import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardService from '../../services/dashboardService';
import managerService from '../../services/managerService';

// Fallback stats
const fallbackStats = [
  { title: 'Total Requests', value: 0, iconKey: 'Flight', color: 'primary', trend: '' },
  { title: 'Pending', value: 0, iconKey: 'PendingActions', color: 'warning', trend: '' },
  { title: 'Approved', value: 0, iconKey: 'CheckCircle', color: 'success', trend: '' },
  { title: 'Rejected', value: 0, iconKey: 'Cancel', color: 'error', trend: '' }
];

// ============================================
// ASYNC THUNKS
// ============================================

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetch',
  async (_, { getState }) => {
    const { auth } = getState();
    const user = auth.user;
    const userRole = user?.role;
    const userId = user?.empId;

    console.log('📊 Fetching dashboard data for:', { role: userRole, empId: userId });

    // Get stats
    const statsData = await dashboardService.getDashboardStats(userRole, userId);
    console.log("statsData:::::::: ", statsData)

    // Get all employees under MANAGER, AVP, SVP or CHRO
    let allEmployees = []
    if (userRole === 'MANAGER' || userRole === 'SVP' || userRole === 'CHRO') {
      allEmployees = await managerService.getTeam(userId)
      console.log("allEmployees::::::::::: ", allEmployees)
    }

    // Get all the travel details
    let getAllDetails = []
    if (userRole === 'MANAGER' 
      // || userRole === 'CHRO'
    ) {
      getAllDetails = await dashboardService.getAllDetails(userId)
      console.log("getAllDetails::::::::::: ", getAllDetails)
    }else if(userRole === 'AVP' ){
      getAllDetails = await dashboardService.getAllAvpDetails(userId)
      console.log("getAllDetails::::::::::: ", getAllDetails)
    }else if(userRole === 'SVP' ){
      getAllDetails = await dashboardService.getAllSvpDetails(userId)
      console.log("getAllDetails::::::::::: ", getAllDetails)
    }

    // Only get pending approvals for managers
    let pendingApprovals = [];
    if (userRole === 'MANAGER' || userRole === 'AVP' || userRole === 'SVP' || userRole === 'CHRO') {
      pendingApprovals = await dashboardService.getPendingApprovals(userId);
    }

    // Get recent requests
    const recentRequests = await dashboardService.getRecentRequests(userId, userRole);
    const activeRequest = recentRequests.length > 0 ? recentRequests[0] : null;

    return {
      stats: statsData?.stats || fallbackStats,
      pendingApprovals: pendingApprovals || [],
      getAllDetails: getAllDetails || [],
      allEmployees: allEmployees || [],
      activeRequest: activeRequest,
      recentRequests: recentRequests || []
    };
  }
);

// export const updateTravelRequest = createA

export const fetchTravelDeskData = createAsyncThunk(
  'dashboard/fetchTravelDesk',
  async () => {
    console.log('📊 Fetching travel desk data');
    const pendingRequests = await dashboardService.getPendingRequests();
    return { pendingRequests: pendingRequests || [] };
  }
);

// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  stats: fallbackStats,
  pendingApprovals: [],
  getAllDetails: [],
  allEmployees: [],
  recentRequests: [],
  loading: false,
  error: null,
  activeRequest: null,
  pendingRequests: [],
  notifications: [
    { id: 1, message: "Welcome to Travel Management System", read: false, time: "Just now" }
  ],
  approvalHistory: []
};

// ============================================
// SLICE
// ============================================

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
    
    clearError: (state) => {
      state.error = null;
    },

    // ✅ ADD THIS - Missing export
    addApprovalHistory: (state, action) => {
      state.approvalHistory.push(action.payload);
    },

    // ✅ ADD THIS - Missing export
    processBooking: (state, action) => {
      const { id, bookingDetails } = action.payload;
      const requestIndex = state.pendingRequests.findIndex(r => r.id === id);
      if (requestIndex !== -1) {
        state.pendingRequests[requestIndex] = {
          ...state.pendingRequests[requestIndex],
          status: 'BOOKING_COMPLETED',
          bookingDetails: bookingDetails
        };
      }
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
        state.getAllDetails = action.payload.getAllDetails;
        state.allEmployees = action.payload.allEmployees;
        state.pendingApprovals = action.payload.pendingApprovals;
        state.activeRequest = action.payload.activeRequest;
        state.recentRequests = action.payload.recentRequests;
        state.error = null;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.stats = fallbackStats;
      })
      .addCase(fetchTravelDeskData.pending, (state) => {
        state.loading = true;
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

// ✅ EXPORT ALL ACTIONS
export const {
  updateRequestStatus,
  addNotification,
  markNotificationRead,
  clearError,
  addApprovalHistory,  // ✅ Added
  processBooking       // ✅ Added
} = dashboardSlice.actions;

export default dashboardSlice.reducer;