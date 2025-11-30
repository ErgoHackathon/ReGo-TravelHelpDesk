// pages/dashboard/DashboardEmployee.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, TableBody, TableRow, TableCell } from '@mui/material';
import { 
  Flight, 
  TrendingUp, 
  AccessTime, 
  Group 
} from '@mui/icons-material';
import { fetchDashboardData } from '../../redux/slices/dashboardSlice';
// Example: src/pages/Dashboard/DashboardEmployee.jsx
import { SharedModal,SharedTypography,Navbar } from '../../components/shared';
import BaseLayout from '../../components/layout/BaseLayout';


import {
  SharedCard,
  StatDisplay,
  SharedTable,
  TableHeader,
  StatusChip,
  LoadingSpinner,
  UserAvatar
} from '../../components/shared';

const DashboardEmployee = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, pendingApprovals, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <BaseLayout variant="dashboard">
      <Navbar user={user} />
      
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
              Welcome back, {user?.firstName}!
            </SharedTypography>
            <StatusChip 
              label={user?.role}
              variant="default"
            />
          </Box>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatDisplay
              title="Travel Requests"
              value={stats?.requests || 0}
              icon={<Flight />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatDisplay
              title="Pending Approvals"
              value={stats?.pending || 0}
              icon={<AccessTime />}
            />
          </Grid>
          {/* Add other stats */}
        </Grid>

        {/* Table */}
        <SharedCard variant="dashboard">
          <SharedTypography variant="cardTitle">
            Recent Requests
          </SharedTypography>
          
          <SharedTable>
            <TableHeader
              columns={[
                { id: 'id', label: 'Request ID' },
                { id: 'destination', label: 'Destination' },
                { id: 'date', label: 'Date' },
                { id: 'status', label: 'Status' }
              ]}
            />
            <TableBody>
              {pendingApprovals.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.destination}</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>
                    <StatusChip
                      label={request.status}
                      variant={request.statusVariant}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </SharedTable>
        </SharedCard>
      </Box>
    </BaseLayout>
  );
};

export default DashboardEmployee;
