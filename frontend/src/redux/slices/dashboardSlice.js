import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // your axios instance
import apiConfig from '../../config/apiConfig';

/**
 * MOCK DATA FALLBACK (used only when USE_MOCK_API = true)
 */
const mockDashboardStats = {
  data: [
    { title: 'Team Requests', value: 12, icon: '👥', color: '#E63946' },
    { title: 'Pending My Approval', value: 5, icon: '⏳', color: '#FFA726' },
    { title: 'Approved Today', value: 8, icon: '✅', color: '#4CAF50' },
    { title: 'Budget Used', value: '₹3.2L', icon: '📈', color: '#2196F3' },
  ]
};

const mockPendingApprovals = {
  data: [
    { 
      id: 'TR-2025-015', 
      employee: 'Rahul Sharma', 
      destination: 'Singapore', 
      amount: '₹85,000',
      urgency: 'high',
      date: '2025-12-10'
    },
    { 
      id: 'TR-2025-016', 
      employee: 'Priya Patel', 
      destination: 'Dubai, UAE', 
      amount: '₹65,000',
      urgency: 'medium',
      date: '2025-12-15'
    },
    { 
      id: 'TR-2025-017', 
      employee: 'Amit Kumar', 
      destination: 'Mumbai, India', 
      amount: '₹22,000',
      urgency: 'low',
      date: '2025-12-20'
    },
    { 
      id: 'TR-2025-018', 
      employee: 'Neha Singh', 
      destination: 'London, UK', 
      amount: '₹1,25,000',
      urgency: 'high',
      date: '2025-12-08'
    }
  ]
};

const mockPendingRequests = {
  data: [
    {
      id: "RG-1995",
      employee: "Michael R.",
      destination: "Delhi, India",
      departure: "2025-11-25",
      status: "Awaiting Flight/Visa Booking",
      isPriority: true,
    },
    {
      id: "RG-2002",
      employee: "Ben K.",
      destination: "Singapore",
      departure: "2026-01-15",
      status: "Documents Received, Awaiting Final Booking",
      isPriority: true,
    },
    {
      id: "RG-2002",
      employee: "John Smith",
      destination: "Dusseldorf",
      departure: "2026-01-15",
      status: "Documents Received, Awaiting Final Booking",
      isPriority: false,
    }
  ],
};


/**
 * MAIN THUNK — SWITCHES BETWEEN MOCK + REAL API
 */
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetch',
  async () => {
    // If configured to use mock API → return mock data
    if (apiConfig.USE_MOCK_API) {
      console.log("⚠ Using MOCK Dashboard API");
      return {
        stats: mockDashboardStats.data,
        pendingApprovals: mockPendingApprovals.data
      };
    }

    // Otherwise, call the REAL .NET API
    console.log("🚀 Using REAL Dashboard API");

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
  'traveldesk/fetch',
  async () => {
    if (apiConfig.USE_MOCK_API) {
      console.log("⚠ Using MOCK Dashboard API");
      return {
        stats: mockPendingRequests.data,
        pendingRequests: mockPendingRequests // ← FIXED
      };
    }

    console.log("🚀 Using REAL Dashboard API");
    const [statsRes, approvalsRes] = await Promise.all([
      api.get(apiConfig.ENDPOINTS.DASHBOARD_STATS),
      api.get(apiConfig.ENDPOINTS.PENDING_APPROVALS)
    ]);

    return {
      stats: statsRes.data?.data || statsRes.data,
      pendingRequests: approvalsRes.data // MUST match component shape
    };
  }
);

/**
 * REDUX SLICE
 */
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: [],
    pendingApprovals: [],
    loading: false,
    error: null,
    pendingRequests: [],
  },
  reducers: {},
  extraReducers: (builder) => {
  builder
    /* DASHBOARD DATA */
    .addCase(fetchDashboardData.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchDashboardData.fulfilled, (state, action) => {
      state.loading = false;
      state.stats = action.payload.stats;
      state.pendingApprovals = action.payload.pendingApprovals;
    })
    .addCase(fetchDashboardData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })

    /* TRAVEL DESK DATA — ADD THIS PART */
    .addCase(fetchTravelDeskData.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchTravelDeskData.fulfilled, (state, action) => {
      state.loading = false;
      state.pendingRequests = action.payload.pendingRequests.data; // <-- FIX
    })
    .addCase(fetchTravelDeskData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
}

});

export default dashboardSlice.reducer;
