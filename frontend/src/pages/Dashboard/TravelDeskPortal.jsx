// pages/dashboard/TravelDeskPortal.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  FormControlLabel,
  Checkbox,
  TableBody,
  TableCell,
  TableRow
} from '@mui/material';
import { CheckCircle, Flight, Hotel, Assignment } from '@mui/icons-material';
import { fetchTravelDeskData, processBooking, addNotification } from '../../redux/slices/dashboardSlice';
import { logout } from '../../features/authSlice';
import BaseLayout from '../../components/layout/BaseLayout';
import {
  Navbar,
  SharedTypography,
  StatusChip,
  LoadingSpinner,
  UserAvatar,
  SharedCard,
  SharedTable,
  TableHeader,
  SharedButton,
  SharedModal
} from '../../components/shared';
import { toast } from 'react-toastify';

const TravelDeskPortal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { pendingRequests, loading } = useSelector((state) => state.dashboard);

  const [tabValue, setTabValue] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Booking Form State
  const [bookingData, setBookingData] = useState({
    airline: '',
    flightNumber: '',
    pnr: '',
    cost: '',
    hotelName: '',
    checkIn: '',
    checkOut: '',
    visaProcessed: false,
    insuranceAdded: false
  });

  useEffect(() => {
    dispatch(fetchTravelDeskData());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  const handleProcessBooking = (request) => {
    setSelectedRequest(request);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    if (!bookingData.pnr || !bookingData.airline) {
      toast.error("Please enter Flight details (Airline & PNR)");
      return;
    }

    dispatch(processBooking({ id: selectedRequest.id, bookingDetails: bookingData }));
    dispatch(addNotification(`Booking confirmed for request ${selectedRequest.id}`));

    toast.success("Booking Confirmed & Employee Notified");
    setShowBookingModal(false);
    setBookingData({
      airline: '', flightNumber: '', pnr: '', cost: '',
      hotelName: '', checkIn: '', checkOut: '',
      visaProcessed: false, insuranceAdded: false
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const pendingBookings = (pendingRequests || []).filter(r => r.status !== 'BOOKING_COMPLETED');
  const completedBookings = (pendingRequests || []).filter(r => r.status === 'BOOKING_COMPLETED');

  return (
    <BaseLayout variant="dashboard">
      <Navbar user={user} onLogout={handleLogout} />

      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <UserAvatar firstName={user?.firstName} lastName={user?.lastName} size="large" />
          <Box>
            <SharedTypography variant="pageTitle">Travel Desk Portal</SharedTypography>
            <StatusChip label="Travel Desk" variant="default" />
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} textColor="primary" indicatorColor="primary">
            <Tab label={`Pending Bookings (${pendingBookings.length})`} />
            <Tab label={`Completed Bookings (${completedBookings.length})`} />
          </Tabs>
        </Box>

        {/* Pending Bookings Tab */}
        {tabValue === 0 && (
          <SharedCard variant="dashboard">
            <SharedTable>
              <TableHeader columns={[
                { id: 'id', label: 'Request ID' },
                { id: 'employee', label: 'Employee' },
                { id: 'destination', label: 'Destination' },
                { id: 'dates', label: 'Travel Dates' },
                { id: 'status', label: 'Status' },
                { id: 'action', label: 'Action' }
              ]} />
              <TableBody>
                {pendingBookings.length > 0 ? pendingBookings.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.id}</TableCell>
                    <TableCell>{req.employee}</TableCell>
                    <TableCell>{req.destination}</TableCell>
                    <TableCell>{req.departure}</TableCell>
                    <TableCell><StatusChip label={req.status} /></TableCell>
                    <TableCell>
                      <SharedButton
                        variant="contained"
                        size="small"
                        startIcon={<Assignment />}
                        onClick={() => handleProcessBooking(req)}
                        sx={{ bgcolor: '#ea580c', '&:hover': { bgcolor: '#c2410c' } }}
                      >
                        Process Booking
                      </SharedButton>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No pending bookings.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </SharedTable>
          </SharedCard>
        )}

        {/* Completed Bookings Tab */}
        {tabValue === 1 && (
          <SharedCard variant="dashboard">
            <SharedTable>
              <TableHeader columns={[
                { id: 'id', label: 'Request ID' },
                { id: 'employee', label: 'Employee' },
                { id: 'destination', label: 'Destination' },
                { id: 'details', label: 'Booking Details' },
                { id: 'status', label: 'Status' }
              ]} />
              <TableBody>
                {completedBookings.length > 0 ? completedBookings.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.id}</TableCell>
                    <TableCell>{req.employee}</TableCell>
                    <TableCell>{req.destination}</TableCell>
                    <TableCell>
                      <Typography variant="caption" display="block">Flight: {req.bookingDetails?.airline || 'N/A'}</Typography>
                      <Typography variant="caption" display="block">PNR: {req.bookingDetails?.pnr || 'N/A'}</Typography>
                    </TableCell>
                    <TableCell><StatusChip label="COMPLETED" color="success" /></TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No completed bookings yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </SharedTable>
          </SharedCard>
        )}

        {/* Process Booking Modal */}
        <SharedModal
          open={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          title={`Process Booking for ${selectedRequest?.id}`}
          maxWidth="md"
        >
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, p: 1, bgcolor: '#f1f5f9', borderRadius: 1 }}>
              Traveler: {selectedRequest?.employee} • Destination: {selectedRequest?.destination}
            </Typography>

            <Grid container spacing={3}>
              {/* Flight Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Flight color="primary" /> Flight Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth label="Airline" size="small"
                      value={bookingData.airline}
                      onChange={(e) => setBookingData({ ...bookingData, airline: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth label="Flight Number" size="small"
                      value={bookingData.flightNumber}
                      onChange={(e) => setBookingData({ ...bookingData, flightNumber: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth label="PNR / Booking Ref" size="small"
                      value={bookingData.pnr}
                      onChange={(e) => setBookingData({ ...bookingData, pnr: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth label="Total Cost" size="small" type="number"
                      value={bookingData.cost}
                      onChange={(e) => setBookingData({ ...bookingData, cost: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}><Divider /></Grid>

              {/* Hotel Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Hotel color="primary" /> Hotel Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Hotel Name" size="small"
                      value={bookingData.hotelName}
                      onChange={(e) => setBookingData({ ...bookingData, hotelName: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth label="Check-in" type="date" size="small" InputLabelProps={{ shrink: true }}
                      value={bookingData.checkIn}
                      onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth label="Check-out" type="date" size="small" InputLabelProps={{ shrink: true }}
                      value={bookingData.checkOut}
                      onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <FormControlLabel
                    control={<Checkbox checked={bookingData.visaProcessed} onChange={(e) => setBookingData({ ...bookingData, visaProcessed: e.target.checked })} />}
                    label="Visa Processed"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={bookingData.insuranceAdded} onChange={(e) => setBookingData({ ...bookingData, insuranceAdded: e.target.checked })} />}
                    label="Travel Insurance Added"
                  />
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button variant="outlined" onClick={() => setShowBookingModal(false)}>Cancel</Button>
              <Button variant="outlined" onClick={() => toast.info("Draft Saved")}>Save Draft</Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={handleConfirmBooking}
              >
                Confirm Booking & Notify Employee
              </Button>
            </Box>
          </Box>
        </SharedModal>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} textColor="primary" indicatorColor="primary">
          <Tab label={`Pending Bookings (${pendingBookings.length})`} />
          <Tab label={`Completed Bookings (${completedBookings.length})`} />
        </Tabs>
      </Box>

      {/* Pending Bookings Tab */}
      {tabValue === 0 && (
        <SharedCard variant="dashboard">
          <SharedTable>
            <TableHeader columns={[
              { id: 'id', label: 'Request ID' },
              { id: 'employee', label: 'Employee' },
              { id: 'destination', label: 'Destination' },
              { id: 'dates', label: 'Travel Dates' },
              { id: 'status', label: 'Status' },
              { id: 'action', label: 'Action' }
            ]} />
            <TableBody>
              {pendingBookings.length > 0 ? pendingBookings.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.id}</TableCell>
                  <TableCell>{req.employee}</TableCell>
                  <TableCell>{req.destination}</TableCell>
                  <TableCell>{req.departure}</TableCell>
                  <TableCell><StatusChip label={req.status} /></TableCell>
                  <TableCell>
                    <SharedButton
                      variant="contained"
                      size="small"
                      startIcon={<Assignment />}
                      onClick={() => handleProcessBooking(req)}
                      sx={{ bgcolor: '#ea580c', '&:hover': { bgcolor: '#c2410c' } }}
                    >
                      Process Booking
                    </SharedButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">No pending bookings.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </SharedTable>
        </SharedCard>
      )}

      {/* Completed Bookings Tab */}
      {tabValue === 1 && (
        <SharedCard variant="dashboard">
          <SharedTable>
            <TableHeader columns={[
              { id: 'id', label: 'Request ID' },
              { id: 'employee', label: 'Employee' },
              { id: 'destination', label: 'Destination' },
              { id: 'details', label: 'Booking Details' },
              { id: 'status', label: 'Status' }
            ]} />
            <TableBody>
              {completedBookings.length > 0 ? completedBookings.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.id}</TableCell>
                  <TableCell>{req.employee}</TableCell>
                  <TableCell>{req.destination}</TableCell>
                  <TableCell>
                    <Typography variant="caption" display="block">Flight: {req.bookingDetails?.airline || 'N/A'}</Typography>
                    <Typography variant="caption" display="block">PNR: {req.bookingDetails?.pnr || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell><StatusChip label="COMPLETED" color="success" /></TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">No completed bookings yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </SharedTable>
        </SharedCard>
      )}

      {/* Process Booking Modal */}
      <SharedModal
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title={`Process Booking for ${selectedRequest?.id}`}
        maxWidth="md"
      >
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, p: 1, bgcolor: '#f1f5f9', borderRadius: 1 }}>
            Traveler: {selectedRequest?.employee} • Destination: {selectedRequest?.destination}
          </Typography>

          <Grid container spacing={3}>
            {/* Flight Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Flight color="primary" /> Flight Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth label="Airline" size="small"
                    value={bookingData.airline}
                    onChange={(e) => setBookingData({ ...bookingData, airline: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth label="Flight Number" size="small"
                    value={bookingData.flightNumber}
                    onChange={(e) => setBookingData({ ...bookingData, flightNumber: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth label="PNR / Booking Ref" size="small"
                    value={bookingData.pnr}
                    onChange={(e) => setBookingData({ ...bookingData, pnr: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth label="Total Cost" size="small" type="number"
                    value={bookingData.cost}
                    onChange={(e) => setBookingData({ ...bookingData, cost: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}><Divider /></Grid>

            {/* Hotel Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Hotel color="primary" /> Hotel Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth label="Hotel Name" size="small"
                    value={bookingData.hotelName}
                    onChange={(e) => setBookingData({ ...bookingData, hotelName: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth label="Check-in" type="date" size="small" InputLabelProps={{ shrink: true }}
                    value={bookingData.checkIn}
                    onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth label="Check-out" type="date" size="small" InputLabelProps={{ shrink: true }}
                    value={bookingData.checkOut}
                    onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <FormControlLabel
                  control={<Checkbox checked={bookingData.visaProcessed} onChange={(e) => setBookingData({ ...bookingData, visaProcessed: e.target.checked })} />}
                  label="Visa Processed"
                />
                <FormControlLabel
                  control={<Checkbox checked={bookingData.insuranceAdded} onChange={(e) => setBookingData({ ...bookingData, insuranceAdded: e.target.checked })} />}
                  label="Travel Insurance Added"
                />
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button variant="outlined" onClick={() => setShowBookingModal(false)}>Cancel</Button>
            <Button variant="outlined" onClick={() => toast.info("Draft Saved")}>Save Draft</Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircle />}
              onClick={handleConfirmBooking}
            >
              Confirm Booking & Notify Employee
            </Button>
          </Box>
        </Box>
      </SharedModal>
    </Box>
    </BaseLayout >
  );
};

export default TravelDeskPortal;