import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, TableBody, TableCell, TableRow } from '@mui/material';
import { FlightTakeoff, Group } from '@mui/icons-material'; // ✅ Correct icon imports
import { fetchDashboardData } from '../../redux/slices/dashboardSlice';

import {
  InfoDisplay,
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

const DashboardManager = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, pendingApprovals, loading } = useSelector((state) => state.dashboard);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // ✅ Define the missing function
  const handleRaiseNewRequest = () => {
    console.log("Raise Travel Request clicked");
    // You can open a modal or navigate to a raise request page here
  };

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
              Manager Dashboard
            </SharedTypography>
            <StatusChip 
              label={`${user?.role} - ${user?.department}`}
              variant="default"
            />
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
            onClick={handleRaiseNewRequest} // ✅ fixed
          >
            Raise Travel Request
          </SharedButton>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatDisplay
              title="Team Members"
              value={stats?.teamCount || 0}
              icon={<Group />}
            />
          </Grid>
          {/* Add other stats here */}
        </Grid>

        {/* Approvals Table */}
        <SharedCard variant="dashboard">
          <SharedTypography variant="cardTitle">
            Pending Approvals
          </SharedTypography>

          <SharedTable>
            <TableHeader
              columns={[
                { id: 'id', label: 'Request ID' },
                { id: 'employee', label: 'Employee' },
                { id: 'destination', label: 'Destination' },
                { id: 'status', label: 'Status' },
                { id: 'actions', label: 'Actions' }
              ]}
            />

            <TableBody>
              {pendingApprovals.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.employee}</TableCell>
                  <TableCell>{request.destination}</TableCell>
                  <TableCell>
                    <StatusChip
                      label={request.status}
                      variant={request.statusVariant}
                    />
                  </TableCell>
                  <TableCell>
                    <SharedButton
                      variant="table"
                      onClick={() => setSelectedRequest(request)}
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

      {/* Request Details Modal */}
      <SharedModal
        open={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Request Details"
      >
        <InfoDisplay
          items={[
            { label: 'Employee', value: selectedRequest?.employee },
            { label: 'Destination', value: selectedRequest?.destination },
            { label: 'Date', value: selectedRequest?.date },
            { label: 'Status', value: selectedRequest?.status }
          ]}
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <SharedButton
            variant="secondary"
            onClick={() => setSelectedRequest(null)}
          >
            Close
          </SharedButton>
          <SharedButton
            variant="primary"
            onClick={() => {/* Handle approve */}}
          >
            Approve
          </SharedButton>
        </Box>
      </SharedModal>
    </BaseLayout>
  );
};

export default DashboardManager;
