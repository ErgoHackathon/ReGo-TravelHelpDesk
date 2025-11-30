// pages/dashboard/TravelDeskPortal.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid,TableBody,TableCell,TableRow} from '@mui/material';
import { fetchTravelDeskData } from '../../redux/slices/dashboardSlice';
import BaseLayout from '../../components/layout/BaseLayout';
import {
  Navbar,
  SharedCard,
  SharedTypography,
  SharedTable,
  TableHeader,
  StatusChip,
  SharedButton,
  LoadingSpinner,
  SharedModal,
  UserAvatar,
  InfoDisplay
} from '../../components/shared';

const TravelDeskPortal = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { pendingRequests, loading } = useSelector((state) => state.dashboard);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    dispatch(fetchTravelDeskData());
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
              Travel Desk Portal
            </SharedTypography>
            <StatusChip 
              label={user?.role}
              variant="default"
            />
          </Box>
        </Box>

        {/* Pending Requests */}
        <SharedCard variant="dashboard">
          <SharedTypography variant="cardTitle">
            Pending Travel Requests
          </SharedTypography>

          <SharedTable>
            <TableHeader
              columns={[
                { id: 'id', label: 'Request ID' },
                { id: 'employee', label: 'Employee' },
                { id: 'destination', label: 'Destination' },
                { id: 'departure', label: 'Departure' },
                { id: 'status', label: 'Status' },
                { id: 'actions', label: 'Actions' }
              ]}
            />
            <TableBody>
              {pendingRequests.map((request) => (
                <TableRow 
                  key={request.id}
                  sx={request.isPriority ? { bgcolor: '#fee2e2' } : {}}
                >
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.employee}</TableCell>
                  <TableCell>{request.destination}</TableCell>
                  <TableCell>{request.departure}</TableCell>
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
                      Process Request
                    </SharedButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </SharedTable>
        </SharedCard>
      </Box>

      {/* Request Processing Modal */}
      <SharedModal
        open={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Process Travel Request"
      >
        <InfoDisplay
          items={[
            { label: 'Employee', value: selectedRequest?.employee },
            { label: 'Destination', value: selectedRequest?.destination },
            { label: 'Departure', value: selectedRequest?.departure },
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
            onClick={() => {/* Handle process */}}
          >
            Complete Processing
          </SharedButton>
        </Box>
      </SharedModal>
    </BaseLayout>
  );
};

export default TravelDeskPortal;