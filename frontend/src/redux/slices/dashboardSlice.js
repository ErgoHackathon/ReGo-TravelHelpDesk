import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import realApi from '../../services/api/realApi';
import realApi from '../../services/api/realApi';
import dashboardService from '../../services/dashboardService';
import managerService from '../../services/managerService';
import { getStatusLabel as mapStatusLabel } from '../../utils/statusMapper';
import { getStatusLabel as mapStatusLabel } from '../../utils/statusMapper';

// Fallback stats (UNCHANGED)
const fallbackStats = [
  { title: 'Total Requests', value: 0, iconKey: 'Flight', color: 'primary', trend: '' },
  { title: 'Pending', value: 0, iconKey: 'PendingActions', color: 'warning', trend: '' },
  { title: 'Approved', value: 0, iconKey: 'CheckCircle', color: 'success', trend: '' },
  { title: 'Rejected', value: 0, iconKey: 'Cancel', color: 'error', trend: '' }
];

// ============================================
// HELPERS - Updated with new status codes
// ============================================
const getStatusLabel = (statusId) => {
  // Use the mapper for consistency
  return mapStatusLabel(statusId);
};

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
    const response = await realApi.getEmployeeData(empId);
    const result = response?.Result || response?.result;
    if (result) {
      return result.Name || result.name || `Employee ${empId}`;
    }
  } catch (error) { console.error(error); }
  return `Employee ${empId}`;
};

// ============================================
// ASYNC THUNKS (Keep existing, add new)
// HELPERS - Updated with new status codes
// ============================================
const getStatusLabel = (statusId) => {
  // Use the mapper for consistency
  return mapStatusLabel(statusId);
};

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
    const response = await realApi.getEmployeeData(empId);
    const result = response?.Result || response?.result;
    if (result) {
      return result.Name || result.name || `Employee ${empId}`;
    }
  } catch (error) { console.error(error); }
  return `Employee ${empId}`;
};

// ============================================
// ASYNC THUNKS (Keep existing, add new)
// ============================================

// ... (keep fetchDashboardData unchanged) ...

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetch',
  async (_, { getState }) => {
    const { auth } = getState();
    const user = auth.user;
    const userRole = user?.role;
    const userId = user?.empId;

    console.log('📊 Fetching dashboard data for:', { role: userRole, empId: userId });

    const statsData = await dashboardService.getDashboardStats(userRole, userId);

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

    let pendingApprovals = [];
    if (userRole === 'MANAGER' || userRole === 'AVP' || userRole === 'SVP' || userRole === 'CHRO') {
      pendingApprovals = await dashboardService.getPendingApprovals(userId);
    }

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
  'traveldesk/fetch',
  async (_, { rejectWithValue }) => {
    try {
      console.log("🚀 Using REAL Travel Desk API");
      const response = await realApi.getAllTravelDetails();
      const travels = response?.result || response?.Result || [];

      if (travels.length === 0) return { pendingRequests: [], completedRequests: [] };

      const allRequests = await Promise.all(
        travels.map(async (item) => {
          const employeeName = await getEmployeeName(item.empId);
          return {
            id: `TR-${String(item.tId).padStart(4, '0')}`,
            tId: item.tId,
            employee: employeeName,
            employeeId: item.empId,
            destination: `${item.city || ''}, ${item.country || ''}`.replace(/^, |, $/g, '') || 'N/A',
            departure: formatDate(item.travelStartDate),
            status: getStatusLabel(item.status),
            statusId: item.status,
            remark: item.remark,
          };
        })
      );

      // ✅ Updated filtering based on new status codes
      // Pending: Status 13-15 (documents & booking in progress)
      // Completed: Status 16-17 (tickets uploaded & completed)
      return {
        pendingRequests: allRequests.filter(req => req.statusId < 16),
        completedRequests: allRequests.filter(req => req.statusId >= 16)
      };

    } catch (error) {
      console.error("Travel Desk Fetch Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// ... (keep fetchViewDetailsData unchanged) ...

export const fetchViewDetailsData = createAsyncThunk(
  'traveldesk/fetchById',
  async (requestId, { rejectWithValue }) => {
    const numericId = typeof requestId === 'string' ? parseInt(requestId.replace(/\D/g, ''), 10) : requestId;
    
    try {
      const travelResponse = await realApi.getTravelDetailByTId(numericId);
      const travel = travelResponse?.Result || travelResponse?.result;

      if (!travel) throw new Error("Travel details not found");

      let employee = {};
      try {
        const empRes = await realApi.getEmployeeData(travel.empId);
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
  async ({ tId, newStatus = 16 }, { rejectWithValue, dispatch }) => {
    try {
      console.log('📊 Processing booking:', { tId, newStatus });
      await realApi.updateTravelStatus(tId, newStatus);
      dispatch(fetchTravelDeskData());
      return { success: true, tId, newStatus };
    } catch (error) {
      console.error("Process Booking Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// ✅ NEW: Submit Documents Thunk (Status 13 → 14)
export const submitDocumentsThunk = createAsyncThunk(
  'dashboard/submitDocuments',
  async ({ tId, empId }, { rejectWithValue, dispatch }) => {
    try {
      console.log('📄 Submitting documents:', { tId, empId });
      
      // Status 13 → 14
      // 13 = "Initial Document Pending" (Employee uploads)
      // 14 = "Initial Document review and visa Pending" (Helpdesk reviews)
      const NEW_STATUS = 14;
      
      await realApi.updateTravelStatus(tId, NEW_STATUS);
      
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
      console.error("Submit Documents Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// ============================================
// REDUX SLICE
// ============================================
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    // Employee/Manager Dashboard
    stats: fallbackStats,
    pendingApprovals: [],
    getAllDetails: [],
    allEmployees: [],
    recentRequests: [],
    activeRequest: null,
    
    // Travel Desk
    pendingRequests: [],
    completedRequests: [],
    viewRequestDetails: null,
    
    // UI State
    loading: false,
    detailsLoading: false,
    bookingInProgress: false,
    submittingDocuments: false, // ✅ NEW
    error: null,
    
    // Shared
    notifications: [
      { id: 1, message: "Welcome to Travel Management System", read: false, time: "Just now" }
    ],
    approvalHistory: []
  },
  reducers: {
    // ✅ ENHANCED: updateRequestStatus
    updateRequestStatus: (state, action) => {
      const { id, tId, status, statusId, stepIndex, statusLabel } = action.payload;
      const newStatus = status || statusId;
      const newStatusLabel = statusLabel || getStatusLabel(newStatus);
      const requestId = id || tId;
      
      console.log('🔄 Updating request status:', { requestId, newStatus, newStatusLabel });

      // Update activeRequest
      if (state.activeRequest) {
        const activeId = state.activeRequest.id || state.activeRequest.tId || state.activeRequest.travelId;
        if (activeId === requestId || state.activeRequest.travelId === requestId) {
          state.activeRequest.status = newStatus;
          state.activeRequest.statusId = newStatus;
          state.activeRequest.statusLabel = newStatusLabel;
        }
      }

      // Update in recentRequests
      const recentIdx = state.recentRequests.findIndex(r => 
        r.id === requestId || r.tId === requestId || r.travelId === requestId
      );
      if (recentIdx !== -1) {
        state.recentRequests[recentIdx].status = newStatus;
        state.recentRequests[recentIdx].statusId = newStatus;
        state.recentRequests[recentIdx].statusLabel = newStatusLabel;
      }

      // Update in pendingApprovals
      const approvalIdx = state.pendingApprovals.findIndex(r => 
        r.id === requestId || r.tId === requestId
      );
      if (approvalIdx !== -1) {
        state.pendingApprovals[approvalIdx].status = newStatus;
        state.pendingApprovals[approvalIdx].statusId = newStatus;
      }

      // Update in pendingRequests (Travel Desk)
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
      // DASHBOARD DATA
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

      // TRAVEL DESK DATA
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

      // VIEW DETAILS
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

      // PROCESS BOOKING
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

      // ✅ SUBMIT DOCUMENTS
      .addCase(submitDocumentsThunk.pending, (state) => {
        state.submittingDocuments = true;
        state.error = null;
      })
      .addCase(submitDocumentsThunk.fulfilled, (state, action) => {
        state.submittingDocuments = false;
        const { tId, newStatus, statusLabel } = action.payload;
        
        // Update activeRequest
        if (state.activeRequest && 
            (state.activeRequest.tId === tId || state.activeRequest.travelId === tId)) {
          state.activeRequest.status = newStatus;
          state.activeRequest.statusId = newStatus;
          state.activeRequest.statusLabel = statusLabel;
        }
        
        // Update in recentRequests
        const idx = state.recentRequests.findIndex(r => 
          r.tId === tId || r.travelId === tId
        );
        if (idx !== -1) {
          state.recentRequests[idx].status = newStatus;
          state.recentRequests[idx].statusId = newStatus;
          state.recentRequests[idx].statusLabel = statusLabel;
        }
        
        // Add notification
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