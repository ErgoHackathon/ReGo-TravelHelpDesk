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
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#fff6f6" }}>
      <RaiseRequestModal open={requestModalOpen} onClose={()=>setRequestModalOpen(false)} />
      {/* Your Navbar at the top */}
      <Navbar />

      {/* Main content with padding for fixed Navbar */}
      <Box component="main" sx={{ flexGrow: 1, mt: 8, width: "100%" }}>
        <Container maxWidth={false} sx={{ py: 4 }}>
          {/* Welcome + Raise Travel Request button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
              px: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* Welcome Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: "#b22a2a",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                }}
              >
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
                  Welcome, {user.firstName}!
                </Typography>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 0.5, flexWrap: "wrap" }}>
                  <Chip
                    label={user.role.replace("_", " ")}
                    size="small"
                    sx={{ bgcolor: "#b22a2a", color: "white" }}
                  />
                  {user.department && (
                    <Chip label={`Team Lead - ${user.department}`} variant="outlined" size="small" />
                  )}
                </Box>
              </Box>
            </Box>


            {/* Raise Travel Request Button */}
            <Button
              variant="contained"
              startIcon={<FlightTakeoff />}
              sx={{
                bgcolor: "#b22a2a",
                "&:hover": { bgcolor: "#8b1f1f" },
                textTransform: "none",
                minWidth: 200,
              }}
              onClick={handleRaiseNewRequest}
            >
              Raise Travel Request
            </Button>
          </Box>

          {/* Cards */}
          <Grid container spacing={3} mb={6} px={3}>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  border: "1.5px solid",
                  borderColor: "#b91c1c",
                  borderTop: "7px solid #b91c1c",
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="grey.600" gutterBottom>
                      Requests Raised (Last 30 Days)
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      12
                    </Typography>
                  </Box>

                  <FlightTakeoff sx={{ fontSize: 40, color: "#f9b6b6" }} />
                </Box>
              </Paper>

            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  border: "1.5px solid",
                  borderColor: "#f5d67a",
                  borderTop: "7px solid #f5d67a",
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="grey.600" gutterBottom>
                      Pending Approvals
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      3
                    </Typography>
                  </Box>

                  <AccessTime sx={{ fontSize: 40, color: "#e1b300" }} />
                </Box>
              </Paper>

            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  border: "1.5px solid",
                  borderColor: "#c7cbd6",
                  borderTop: "7px solid #c7cbd6",
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="grey.600" gutterBottom>
                      Total Reports
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      25
                    </Typography>
                  </Box>

                  <Group sx={{ fontSize: 40, color: "#a4acc9" }} />
                </Box>
              </Paper>

            </Grid>
          </Grid>

          {/* Recent Application Status Table */}
          <Box component={Paper} p={3} borderRadius={2} boxShadow={3} px={3} pb={6} m={3}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Recent Application Status
            </Typography>

            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f9f9f9", margin:'10px' }}>
                  <TableCell sx={{ fontWeight: "bold", color: "grey.500" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "grey.500" }}>EMPLOYEES</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "grey.500" }}>DESTINATION</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "grey.500" }}>STATUS</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "grey.500", textAlign:'right' }}>ACTION</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingApprovals?.map(
                  ({
                    id,
                    employee,
                    destination,
                    status,
                    statusColor,
                    actionText,
                    actionColor,
                    extraActionText,
                    extraActionColor,
                    urgency
                  }) => (
                    <TableRow key={id} hover>
                      <TableCell sx={{ fontFamily: "monospace" }}>{id}</TableCell>
                      <TableCell sx={{ color: "grey.700" }}>{employee}</TableCell>
                      <TableCell>{destination}</TableCell>
                      <TableCell>
                        <Chip
                          label={status}
                          // color={statusColor}
                          size="small"
                          sx={{ fontWeight: "bold", textTransform: "none", bgcolor: statusColor }}
                        />
                      </TableCell>
                      <TableCell sx={{textAlign:'right'}}>
                        <Stack direction="row" alignItems="center">
                          <Grid item container direction="row">
                            <Grid item xs={6}>
                              {extraActionText && (
                                <Button
                                  size="small"
                                  // color={extraActionColor}
                                  startIcon={<Send />}
                                  sx={{ textTransform: "none", fontWeight: "bold", color: extraActionColor, bgcolor: statusColor }}
                                >
                                  {extraActionText}
                                </Button>
                              )}
                            </Grid>

                            <Grid item xs={6}>
                              <Button
                                size="small"
                                // color={actionColor}
                                sx={{ textTransform: "none", fontWeight: "bold", color: actionColor }}
                              >
                                {actionText}
                              </Button>
                            </Grid>
                          </Grid>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardManager;
