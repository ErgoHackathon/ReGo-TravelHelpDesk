import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock API service functions
const getDashboardStats = async () => {
  return {
    data: [
      { title: 'Team Requests', value: 12, icon: '👥', color: '#E63946' },
      { title: 'Pending My Approval', value: 5, icon: '⏳', color: '#FFA726' },
      { title: 'Approved Today', value: 8, icon: '✅', color: '#4CAF50' },
      { title: 'Budget Used', value: '₹3.2L', icon: '📈', color: '#2196F3' },
    ]
  };
};

const getPendingApprovals = async () => {
  return {
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
};

// Async thunk
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetch',
  async () => {
    const [statsRes, approvalsRes] = await Promise.all([
      getDashboardStats(),
      getPendingApprovals()
    ]);
    return {
      stats: statsRes.data,
      pendingApprovals: approvalsRes.data
    };
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: [],
    pendingApprovals: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  }
});

export default dashboardSlice.reducer;
