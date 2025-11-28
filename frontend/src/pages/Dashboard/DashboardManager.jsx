import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Chip,
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
} from '@mui/material';
import {
  PendingActions,
  People,
  CheckCircle,
  TrendingUp,
  FlightTakeoff,
  AccessTime,
  Group,
  Send
} from '@mui/icons-material';
import Navbar from '../../components/layout/Navbar';
import { fetchDashboardData } from '../../redux/slices/dashboardSlice';
import RaiseRequestModal from '../../components/RaiseRequestModal';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SharedButton from '../../sharedComponents/buttons/SharedButton';
import PageWrapper from '../../sharedComponents/layout/PageWrapper';
import { SharedCard, SharedTable, SharedTypography, StatCard, StatusChip, TableHeader, TableRowActionButtons } from '../../sharedComponents';
import UserAvatar from '../../sharedComponents/avatars/UserAvatars';

const DashboardManager = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, pendingApprovals, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const icons = [<People />, <PendingActions />, <CheckCircle />, <TrendingUp />];
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  // Mock stats data
  // stats = [
  //   { title: 'Team Requests', value: 12, icon: <People />, color: '#b91c1c' },
  //   { title: 'Pending My Approval', value: 5, icon: <PendingActions />, color: '#FFA726' },
  //   { title: 'Approved Today', value: 8, icon: <CheckCircle />, color: '#4CAF50' },
  //   { title: 'Budget Used', value: '₹3.2L', icon: <TrendingUp />, color: '#2196F3' }
  // ];

  // Mock pending approvals
  // pendingApprovals = [
  //   {
  //     id: 'TR-2025-015',
  //     employee: 'Rahul Sharma',
  //     destination: 'Singapore',
  //     amount: '₹85,000',
  //     urgency: 'high',
  //     date: '2025-12-10',
  //     status: 'Pending SVP Approval',
  //     statusColor: '#fef9c3'
  //   },
  //   {
  //     id: 'TR-2025-016',
  //     employee: 'Priya Patel',
  //     destination: 'Dubai, UAE',
  //     amount: '₹65,000',
  //     urgency: 'medium',
  //     date: '2025-12-15',
  //     status: 'Travel Desk Approved',
  //     statusColor: '#dcfce7'
  //   },
  //   {
  //     id: 'TR-2025-017',
  //     employee: 'Amit Kumar',
  //     destination: 'Mumbai, India',
  //     amount: '₹22,000',
  //     urgency: 'low',
  //     date: '2025-12-20',
  //     status: 'Pending SVP Approval',
  //     actionText: 'View Details',
  //     actionColor: '#b91c1c',
  //     statusColor: '#fef9c3'
  //   },
  //   {
  //     id: 'TR-2025-018',
  //     employee: 'Neha Singh',
  //     destination: 'London, UK',
  //     amount: '₹1,25,000',
  //     urgency: 'high',
  //     date: '2025-12-08',
  //     status: 'Travel Desk Approved',
  //     extraActionText: 'Send Document Request',
  //     extraActionColor: '#79cc98',
  //     statusColor: '#dcfce7'
  //   }
  // ];

  const getUrgencyColor = (urgency) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'info'
    };
    return colors[urgency] || 'default';
  };

  const handleRaiseNewRequest = () =>{
      setRequestModalOpen(true)
  }

  return (
   (
    <Box sx={{ bgcolor: "#fff6f6" }}>
      <Navbar />
      <RaiseRequestModal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
      />

      <PageWrapper>
        {/* Top Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            alignItems: "center",
            mb: 4,
          }}
        >
          {/* Welcome Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <UserAvatar firstName={user.firstName} lastName={user.lastName} />

            <Box>
              <SharedTypography>Welcome, {user.firstName}!</SharedTypography>

              <Box sx={{ display: "flex", gap: 1 }}>
                <StatusChip
                  label={user.role.replace("_", " ")}
                  color="#b22a2a"
                />

                {user.department && (
                  <StatusChip
                    label={`Team Lead - ${user.department}`}
                    color="#f5f5f5"
                  />
                )}
              </Box>
            </Box>
          </Box>

          {/* Raise Travel Request Button */}
          <SharedButton
            variant="contained"
            startIcon={<FlightTakeoff />}
            sx={{
              bgcolor: "#b22a2a",
              "&:hover": { bgcolor: "#8b1f1f" },
              minWidth: 200,
            }}
            onClick={handleRaiseNewRequest}
          >
            Raise Travel Request
          </SharedButton>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="Requests Raised (Last 30 Days)"
              value="12"
              icon={<FlightTakeoff sx={{ fontSize: 40, color: "#f9b6b6" }} />}
              color="#b91c1c"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <StatCard
              title="Pending Approvals"
              value="3"
              icon={<AccessTime sx={{ fontSize: 40, color: "#e1b300" }} />}
              color="#f5d67a"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <StatCard
              title="Total Reports"
              value="25"
              icon={<Group sx={{ fontSize: 40, color: "#a4acc9" }} />}
              color="#c7cbd6"
            />
          </Grid>
        </Grid>

        {/* Recent Applications Table */}
        <SharedCard sx={{ p: 3, mb: 5 }}>
          <SharedTypography variant="h6">Recent Application Status</SharedTypography>

          <SharedTable>
            <TableHeader
              columns={[
                "ID",
                "EMPLOYEE",
                "DESTINATION",
                "STATUS",
                "ACTION",
              ]}
            />

            <TableBody>
              {pendingApprovals?.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ fontFamily: "monospace" }}>
                    {row.id}
                  </TableCell>

                  <TableCell>{row.employee}</TableCell>

                  <TableCell>{row.destination}</TableCell>

                  <TableCell>
                    <StatusChip
                      label={row.status}
                      color={row.statusColor}
                    />
                  </TableCell>

                  <TableCell sx={{ textAlign: "right" }}>
                    <TableRowActionButtons
                      actionText={row.actionText}
                      actionColor={row.actionColor}
                      extraActionText={row.extraActionText}
                      extraActionColor={row.extraActionColor}
                      statusColor={row.statusColor}
                      startIcon={<Send />}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </SharedTable>
        </SharedCard>
      </PageWrapper>
    </Box>
   )
  );
};

export default DashboardManager;
