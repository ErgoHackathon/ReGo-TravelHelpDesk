import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/apiService';
import dashboardService from '../../services/dashboardService';
import managerService from '../../services/managerService';
import { getStatusLabel as mapStatusLabel } from '../../utils/statusMapper';

const fallbackStats = [
  { title: 'Total Requests', value: 0, iconKey: 'Flight', color: 'primary', trend: '' },
  { title: 'Pending', value: 0, iconKey: 'PendingActions', color: 'warning', trend: '' },
  { title: 'Approved', value: 0, iconKey: 'CheckCircle', color: 'success', trend: '' },
  { title: 'Rejected', value: 0, iconKey: 'Cancel', color: 'error', trend: '' }
];

const getStatusLabel = (statusId) => mapStatusLabel(statusId);

const formatDate = (dateString) => {
  if (!dateString || dateString === '0001-01-01T00:00:00') return 'Not Set';
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  } catch { return dateString; }
};

const getEmployeeName = async (empId) => {
  if (!empId) return 'Unknown';
  try {
    const response = await api.getEmployeeData(empId);
    const result = response?.Result || response?.result;
    if (result) {
      return result.Name || result.name || `Employee ${empId}`;
    }
  } catch (error) { console.error(error); }
  return `Employee ${empId}`;
};

// ============================================
// ASYNC THUNKS
// ============================================

// dashboardSlice.js - fetchDashboardData thunk

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetch',
  async (_, { getState }) => {
    const { auth } = getState();
    const user = auth.user;
    const userRole = user?.role;
    const userId = user?.empId;
    const userRoleID = user?.roleId;

    console.log('📊 Fetching dashboard data for:', { role: userRole, empId: userId });

    // 1. Get Stats
    const statsData = await dashboardService.getDashboardStats(userRole, userId, userRoleID);

    // 2. Get Recent Requests (Active Request)
    const recentRequests = await dashboardService.getRecentRequests(userId, userRole);
    console.log('🔍 DEBUG - recentRequests returned:', recentRequests);
    
    const activeRequest = recentRequests.length > 0 ? recentRequests[0] : null;
    console.log('🔍 DEBUG - activeRequest set to:', activeRequest);

    // 3. Define missing variables based on role
    let allEmployees = [];
    let getAllDetails = [];
    let pendingApprovals = [];

    // Logic for Managers/Approvers
    if (['MANAGER', 'AVP', 'SVP', 'CHRO'].includes(userRole)) {
      try {
        // Get Team (Managers/SVP/CHRO)
        if (userRole !== 'AVP') { 
             allEmployees = await managerService.getTeam(userId) || []; 
        }

        // Get Pending Approvals
        pendingApprovals = await dashboardService.getPendingApprovals(userId) || [];

        // Get All Details based on specific role
        if (userRole === 'MANAGER') {
          getAllDetails = await dashboardService.getAllDetails(userId) || [];
        } else if (userRole === 'AVP') {
          getAllDetails = await dashboardService.getAllAvpDetails(userId) || [];
        } else if (userRole === 'SVP') {
          getAllDetails = await dashboardService.getAllSvpDetails(userId) || [];
        }
      } catch (error) {
        console.error('Error fetching manager data:', error);
      }
    }

    // 4. Return complete object
    return {
      stats: statsData?.stats || [],
      pendingApprovals: pendingApprovals,
      getAllDetails: getAllDetails,
      allEmployees: allEmployees,
      activeRequest: activeRequest,
      recentRequests: recentRequests || []
    };
  }
);
// src/redux/slices/dashboardSlice.js

// ... imports

export const fetchTravelDeskData = createAsyncThunk(
  'traveldesk/fetch',
  async (_, { rejectWithValue }) => {
    try {
      // 1. Get ALL requests
      const response = await api.getAllTravelDetails();
      const travels = response?.result || response?.Result || [];

      console.log('📊 [TravelDesk] Raw API Data:', travels);

      if (!travels || travels.length === 0) {
        return { pendingRequests: [], completedRequests: [] };
      }

      // 2. Map Data (Handle Capital vs Small letters)
      const allRequests = await Promise.all(
        travels.map(async (item) => {
          // ⚠️ KEY FIX: Check both tId and TId, status and Status
          const tId = item.tId || item.TId || item.TID;
          const empId = item.empId || item.EmpId;
          const status = item.status !== undefined ? item.status : item.Status;
          const country = item.country || item.Country;
          const city = item.city || item.City;
          const remark = item.remark || item.Remark;
          const travelStartDate = item.travelStartDate || item.TravelStartDate;
          
          const employeeName = await getEmployeeName(empId);

          return {
            id: `TR-${String(tId).padStart(4, '0')}`,
            tId: tId,
            employee: employeeName,
            employeeId: empId,
            destination: `${city || ''}, ${country || ''}`.replace(/^, |, $/g, '') || 'N/A',
            departure: formatDate(travelStartDate),
            status: getStatusLabel(status),
            statusId: status, // This was undefined before!
            remark: remark,
          };
        })
      );

      console.log('📊 [TravelDesk] Mapped Data:', allRequests);

      // 3. Separate Pending vs Completed
      // Pending: Status < 16 (includes 14 for Visa Review)
      const pendingRequests = allRequests.filter(req => req.statusId !== undefined && req.statusId < 16);
      
      // Completed: Status >= 16
      const completedRequests = allRequests.filter(req => req.statusId !== undefined && req.statusId >= 16);

      return {
        pendingRequests,
        completedRequests
      };
    } catch (error) {
      console.error("Travel Desk Fetch Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchViewDetailsData = createAsyncThunk(
  'traveldesk/fetchById',
  async (requestId, { rejectWithValue }) => {
    const numericId = typeof requestId === 'string' ? parseInt(requestId.replace(/\D/g, ''), 10) : requestId;

    try {
      const travelResponse = await api.getTravelDetailByTId(numericId);
      const travel = travelResponse?.Result || travelResponse?.result;

      if (!travel) throw new Error("Travel details not found");

      let employee = {};
      try {
        const empRes = await api.getEmployeeData(travel.empId);
        employee = empRes?.Result || empRes?.result || {};
      } catch (e) { console.warn("No employee data"); }

      return {
        data: {
          employeeName: employee.Name || employee.name || `Employee ${travel.empId}`,
          employeeId: travel.empId,
          email: employee.Email || employee.email || 'N/A',
          phone: employee.Phone || employee.phone || 'N/A',
          department: employee.Department || employee.department || 'N/A',
          status: getStatusLabel(travel.status || travel.Status),
          statusId: travel.status || travel.Status,
          requestedOn: formatDate(travel.suggestedDate),
          lastUpdated: formatDate(travel.travelStartDate),
          travelType: (travel.country || '').toLowerCase() === 'india' ? 'Domestic' : 'International',
          from: travel.fromLocation || 'Office',
          to: `${travel.city || ''}, ${travel.country || ''}`,
          departureDate: formatDate(travel.travelStartDate),
          returnDate: formatDate(travel.travelEndDate),
          purpose: travel.remark || 'Business',
          attachments: []
        }
      };
    } catch (error) {
      console.error("View Details Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const processBooking = createAsyncThunk(
  'traveldesk/processBooking',
  async ({ tId, newStatus = 16, empId }, { rejectWithValue, dispatch }) => {
    try {
      const comment = "Status updated by Travel Desk";

      // FIX: Pass empId and comment to updateTravelStatus
      await api.updateTravelStatus(tId, newStatus, empId, comment);

      dispatch(fetchTravelDeskData());
      return { success: true, tId, newStatus, empId };
    } catch (error) {
      console.error("Process Booking Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Submit Documents Thunk (Status 13 → 14)
export const submitDocumentsThunk = createAsyncThunk(
  'dashboard/submitDocuments',
  async ({ tId, empId }, { rejectWithValue, dispatch }) => {
    try {
      console.log('📄 submitDocumentsThunk called with:', { tId, empId });
      
      // ✅ Validate inputs
      if (!tId) {
        console.error('❌ tId is missing!');
        throw new Error('Travel ID (tId) is required');
      }
      if (!empId) {
        console.error('❌ empId is missing!');
        throw new Error('Employee ID (empId) is required');
      }

      const NEW_STATUS = 14;

      console.log('📤 Calling api.updateTravelStatus with:', {
        tId,
        status: NEW_STATUS,
        empId,
        comment: 'Documents submitted by employee'
      });

      const response = await api.updateTravelStatus(
        tId,
        NEW_STATUS,
        empId,
        'Documents submitted by employee'
      );

      console.log('📥 API Response:', response);

      // ✅ Check response
      if (response.status !== 'Success') {
        console.error('❌ API returned non-success:', response);
        throw new Error(response.result || response.message || 'Failed to submit documents');
      }

      console.log('✅ Status updated successfully!');
      
      // Refresh dashboard data
      dispatch(fetchDashboardData());

      return {
        success: true,
        tId,
        previousStatus: 13,
        newStatus: NEW_STATUS,
        statusLabel: getStatusLabel(NEW_STATUS)
      };
    } catch (error) {
      console.error("❌ submitDocumentsThunk Error:", error);
      return rejectWithValue(error.message || error);
    }
  }
);
// ============================================
// REDUX SLICE
// ============================================
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: fallbackStats,
    pendingApprovals: [],
    getAllDetails: [],
    allEmployees: [],
    recentRequests: [],
    activeRequest: null,
    pendingRequests: [],
    completedRequests: [],
    viewRequestDetails: null,
    loading: false,
    detailsLoading: false,
    bookingInProgress: false,
    submittingDocuments: false,
    error: null,
    notifications: [
      { id: 1, message: "Welcome to Travel Management System", read: false, time: "Just now" }
    ],
    approvalHistory: []
  },
  reducers: {
    updateRequestStatus: (state, action) => {
      const { id, tId, status, statusId, statusLabel } = action.payload;
      const newStatus = status || statusId;
      const newStatusLabel = statusLabel || getStatusLabel(newStatus);
      const requestId = id || tId;

      if (state.activeRequest) {
        const activeId = state.activeRequest.id || state.activeRequest.tId || state.activeRequest.travelId;
        if (activeId === requestId || state.activeRequest.travelId === requestId) {
          state.activeRequest.status = newStatus;
          state.activeRequest.statusId = newStatus;
          state.activeRequest.statusLabel = newStatusLabel;
        }
      }

      const recentIdx = state.recentRequests.findIndex(r =>
        r.id === requestId || r.tId === requestId || r.travelId === requestId
      );
      if (recentIdx !== -1) {
        state.recentRequests[recentIdx].status = newStatus;
        state.recentRequests[recentIdx].statusId = newStatus;
        state.recentRequests[recentIdx].statusLabel = newStatusLabel;
      }

      const approvalIdx = state.pendingApprovals.findIndex(r =>
        r.id === requestId || r.tId === requestId
      );
      if (approvalIdx !== -1) {
        state.pendingApprovals[approvalIdx].status = newStatus;
        state.pendingApprovals[approvalIdx].statusId = newStatus;
      }

      const pendingIdx = state.pendingRequests.findIndex(r =>
        r.id === requestId || r.tId === requestId
      );
      if (pendingIdx !== -1) {
        state.pendingRequests[pendingIdx].status = newStatusLabel;
        state.pendingRequests[pendingIdx].statusId = newStatus;
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

    addApprovalHistory: (state, action) => {
      state.approvalHistory.push(action.payload);
    },

    clearViewDetails: (state) => {
      state.viewRequestDetails = null;
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
        state.error = null;
      })
      .addCase(fetchTravelDeskData.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = action.payload.pendingRequests;
        state.completedRequests = action.payload.completedRequests;
        state.error = null;
      })
      .addCase(fetchTravelDeskData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(fetchViewDetailsData.pending, (state) => {
        state.detailsLoading = true;
        state.viewRequestDetails = null;
        state.error = null;
      })
      .addCase(fetchViewDetailsData.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.viewRequestDetails = action.payload.data;
      })
      .addCase(fetchViewDetailsData.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(processBooking.pending, (state) => {
        state.bookingInProgress = true;
      })
      .addCase(processBooking.fulfilled, (state) => {
        state.bookingInProgress = false;
      })
      .addCase(processBooking.rejected, (state, action) => {
        state.bookingInProgress = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(submitDocumentsThunk.pending, (state) => {
        state.submittingDocuments = true;
        state.error = null;
      })
      .addCase(submitDocumentsThunk.fulfilled, (state, action) => {
        state.submittingDocuments = false;
        const { tId, newStatus, statusLabel } = action.payload;

        if (state.activeRequest &&
          (state.activeRequest.tId === tId || state.activeRequest.travelId === tId)) {
          state.activeRequest.status = newStatus;
          state.activeRequest.statusId = newStatus;
          state.activeRequest.statusLabel = statusLabel;
        }

        const idx = state.recentRequests.findIndex(r =>
          r.tId === tId || r.travelId === tId
        );
        if (idx !== -1) {
          state.recentRequests[idx].status = newStatus;
          state.recentRequests[idx].statusId = newStatus;
          state.recentRequests[idx].statusLabel = statusLabel;
        }

        state.notifications.unshift({
          id: Date.now(),
          message: "Documents submitted successfully! Helpdesk will review.",
          read: false,
          time: "Just now"
        });
      })
      .addCase(submitDocumentsThunk.rejected, (state, action) => {
        state.submittingDocuments = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  updateRequestStatus,
  addNotification,
  markNotificationRead,
  clearError,
  addApprovalHistory,
  clearViewDetails
} = dashboardSlice.actions;

export default dashboardSlice.reducer;