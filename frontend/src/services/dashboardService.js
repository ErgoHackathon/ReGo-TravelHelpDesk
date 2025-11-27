// services/dashboardService.js

// Mock icons can be simple strings or you can import MUI icons if needed
import { People, PendingActions, CheckCircle, TrendingUp } from '@mui/icons-material';

// Mock dashboard stats
export const getDashboardStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          { title: 'Team Requests', value: 12, icon: <People />, color: '#E63946' },
          { title: 'Pending My Approval', value: 5, icon: <PendingActions />, color: '#FFA726' },
          { title: 'Approved Today', value: 8, icon: <CheckCircle />, color: '#4CAF50' },
          { title: 'Budget Used', value: '₹3.2L', icon: <TrendingUp />, color: '#2196F3' },
        ],
      });
    }, 500); // simulate network delay
  });
};

// Mock pending approvals
export const getPendingApprovals = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
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
        ],
      });
    }, 500); // simulate network delay
  });
};
