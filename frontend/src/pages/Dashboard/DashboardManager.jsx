// pages/dashboard/DashboardManager.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Checkbox,
  TableHead,
  Table,
  Typography
} from '@mui/material';
import {
  FlightTakeoff,
  Group,
  Assignment,
  ArrowForward,
  CheckCircle,
  Cancel,
  People,
  PendingActions,
  AttachMoney
} from '@mui/icons-material';
import { fetchDashboardData } from '../../redux/slices/dashboardSlice';
import { logout } from '../../features/authSlice';

import {
  Navbar,
  SharedTypography,
  SharedCard,
  StatDisplay,
  SharedTable,
  TableHeader,
  StatusChip,
  SharedButton,
  LoadingSpinner,
  SharedModal,
  UserAvatar
} from '../../components/shared';
import BaseLayout from '../../components/layout/BaseLayout';

// Icon Mapping
const ICON_MAP = {
  'Flight': <FlightTakeoff />,
  'FlightTakeoff': <FlightTakeoff />,
  'Group': <Group />,
  'People': <People />,
  'Assignment': <Assignment />,
  'PendingActions': <PendingActions />,
  'CheckCircle': <CheckCircle />,
  'Cancel': <Cancel />,
  'AttachMoney': <AttachMoney />
};

const DashboardManager = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { stats, pendingApprovals, loading } = useSelector((state) => state.dashboard);
  const [showRaiseRequestModal, setShowRaiseRequestModal] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  const handleViewDetails = (id) => {
    navigate(`/application/${id}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <BaseLayout variant="dashboard">
      <Navbar user={user} onLogout={handleLogout} />

      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <UserAvatar
            firstName={user?.firstName}
            lastName={user?.lastName}
            size="large"
          />
          <Box>
            <SharedTypography variant="pageTitle">
              {user?.role === 'MANAGER' ? 'Manager Dashboard' : `${user?.role} Dashboard`}
            </SharedTypography>
            <StatusChip
              label={`${user?.role} - ${user?.department}`}
              variant="default"
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Raise Travel Request Button */}
          <SharedButton
            variant="contained"
            startIcon={<FlightTakeoff />}
            sx={{
              bgcolor: "#b22a2a",
              "&:hover": { bgcolor: "#8b1f1f" },
              minWidth: 200,
            }}
            onClick={() => setShowRaiseRequestModal(true)}
          >
            Raise Travel Request
          </SharedButton>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {(stats && stats.length > 0 ? stats : [
            { title: 'Requests Raised', value: 24, iconKey: 'FlightTakeoff' },
            { title: 'Pending Approvals', value: 5, iconKey: 'Assignment' },
            { title: 'Total Reports', value: 12, iconKey: 'Group' }
          ]).map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StatDisplay
                title={stat.title}
                value={stat.value}
                icon={ICON_MAP[stat.iconKey] || <FlightTakeoff />}
                trend={stat.trend}
                color={stat.color}
              />
            </Grid>
          ))}
        </Grid>

        {/* Recent Application Status Table */}
        <SharedCard variant="dashboard">
          <SharedTypography variant="cardTitle">
            Recent Application Status
          </SharedTypography>

          <SharedTable>
            <TableHeader
              columns={[
                { id: 'id', label: 'Request ID' },
                { id: 'employee', label: 'Employee' },
                { id: 'destination', label: 'Destination' },
                { id: 'status', label: 'Status' },
                { id: 'actions', label: 'Action' }
              ]}
            />

            <TableBody>
              {pendingApprovals.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.employee}</TableCell>
                  <TableCell>{request.destination}</TableCell>
                  <TableCell>
                    <StatusChip label={request.status || 'PENDING_MANAGER'} />
                  </TableCell>
                  <TableCell>
                    <SharedButton
                      variant="outlined"
                      size="small"
                      endIcon={<ArrowForward fontSize="small" />}
                      onClick={() => handleViewDetails(request.id)}
                      sx={{
                        borderColor: '#e2e8f0',
                        color: '#64748b',
                        '&:hover': {
                          borderColor: '#b91c1c',
                          color: '#b91c1c',
                          bgcolor: '#fef2f2'
                        }
                      }}
                    >
                      View Details
                    </SharedButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </SharedTable>
        </SharedCard>
      </Box>

      {/* Raise New Request Modal */}
      <SharedModal
        open={showRaiseRequestModal}
        onClose={() => setShowRaiseRequestModal(false)}
        title="Raise New Travel Request"
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
            Fill in the details below to submit a new travel request for your team.
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Destination City/Country"
                variant="outlined"
                placeholder="e.g. London, UK"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reason for Travel"
                variant="outlined"
                placeholder="e.g. Client Meeting"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 2 }}>
              Select Employees and Dates
            </Typography>

            <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Employee Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Departure Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Arrival Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover>
                    <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell><TextField type="date" size="small" fullWidth variant="standard" InputProps={{ disableUnderline: true }} /></TableCell>
                    <TableCell><TextField type="date" size="small" fullWidth variant="standard" InputProps={{ disableUnderline: true }} /></TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell><TextField type="date" size="small" fullWidth variant="standard" InputProps={{ disableUnderline: true }} /></TableCell>
                    <TableCell><TextField type="date" size="small" fullWidth variant="standard" InputProps={{ disableUnderline: true }} /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <SharedButton
              variant="outlined"
              onClick={() => setShowRaiseRequestModal(false)}
              sx={{ borderColor: '#e2e8f0', color: '#64748b', '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' } }}
            >
              Cancel
            </SharedButton>
            <SharedButton
              variant="contained"
              onClick={() => {
                console.log("Request Submitted");
                setShowRaiseRequestModal(false);
              }}
              sx={{ bgcolor: '#b91c1c', '&:hover': { bgcolor: '#991b1b' }, px: 4 }}
            >
              Review & Submit Request
            </SharedButton>
          </Box>
        </Box>
      </SharedModal>
    </BaseLayout>
  );
};

export default DashboardManager;
