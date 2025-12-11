// pages/TravelDesk/TravelDeskPortal.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Grid,
  Typography,
  CardContent,
  Card,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Badge,
  Divider,
  Alert,
  Button
} from '@mui/material';
import { 
  FlightTakeoff, 
  Refresh, 
  Visibility,
  Description,
  CheckCircle,
  Schedule,
  Flight,
  Hotel,
  Upload,
  Done,
  Warning,
  Person,
  CalendarToday,
  LocationOn
} from '@mui/icons-material';
import { toast } from 'react-toastify';

// Import status mapper
import { 
  statusToChip, 
  getStatusLabel, 
  getStatusShortLabel,
  STATUS_CODES,
  areDocumentsSubmitted,
  isInBookingPhase,
  isCompleted,
  getNextStatus,
  getAvailableActions
} from '../../utils/statusMapper';

// Component imports
import Navbar from '../../components/shared/navigation/Navbar';
import BaseLayout from '../../components/layout/BaseLayout';
import PendingRequestModal from '../../components/PendingRequestModal';
import { 
  SharedButton, 
  SharedTypography, 
  UserAvatar 
} from '../../components/shared';

// Redux imports
import { 
  fetchTravelDeskData, 
  processBooking 
} from '../../redux/slices/dashboardSlice';
import { logout } from '../../features/authSlice';

// ==========================================
// ANIMATION VARIANTS
// ==========================================
const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.4, staggerChildren: 0.1 }
  }
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  hover: {
    y: -2,
    boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2 }
  }
};

const listItemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: (index) => ({
    opacity: 1,
    x: 0,
    transition: { delay: index * 0.05, duration: 0.3 }
  })
};

// ==========================================
// WRAPPER COMPONENT
// ==========================================
const PageWrapper = ({ children }) => (
  <Box sx={{ p: 3 }}>{children}</Box>
);

// ==========================================
// STATUS CHIP COMPONENT
// ==========================================
const StatusChipMapped = ({ statusId, size = "small" }) => {
  const chipInfo = statusToChip(statusId);
  
  return (
    <Chip
      label={chipInfo.shortLabel || chipInfo.label}
      size={size}
      sx={{
        bgcolor: chipInfo.bgColor,
        color: chipInfo.color === 'error' ? '#dc2626' :
               chipInfo.color === 'warning' ? '#d97706' :
               chipInfo.color === 'success' ? '#16a34a' :
               chipInfo.color === 'info' ? '#0284c7' : '#64748b',
        fontWeight: 600,
        border: `1px solid ${chipInfo.bgColor}`,
        '& .MuiChip-label': { px: 1.5 }
      }}
    />
  );
};

// ==========================================
// PRIORITY BADGE COMPONENT
// ==========================================
const PriorityBadge = ({ statusId }) => {
  // Status 14 = Documents submitted, needs review
  // Status 15 = Pending tickets, needs booking
  if (statusId === 14) {
    return (
      <Chip
        icon={<Description sx={{ fontSize: 14 }} />}
        label="Documents Ready"
        size="small"
        sx={{
          bgcolor: '#fef3c7',
          color: '#92400e',
          fontWeight: 600,
          fontSize: '0.7rem',
          border: '1px solid #fbbf24',
          '& .MuiChip-icon': { color: '#92400e' }
        }}
      />
    );
  }
  
  if (statusId === 15) {
    return (
      <Chip
        icon={<Flight sx={{ fontSize: 14 }} />}
        label="Booking Required"
        size="small"
        sx={{
          bgcolor: '#dbeafe',
          color: '#1e40af',
          fontWeight: 600,
          fontSize: '0.7rem',
          border: '1px solid #3b82f6',
          '& .MuiChip-icon': { color: '#1e40af' }
        }}
      />
    );
  }
  
  if (statusId === 13) {
    return (
      <Chip
        icon={<Schedule sx={{ fontSize: 14 }} />}
        label="Awaiting Docs"
        size="small"
        sx={{
          bgcolor: '#f3f4f6',
          color: '#6b7280',
          fontWeight: 600,
          fontSize: '0.7rem',
          border: '1px solid #d1d5db',
          '& .MuiChip-icon': { color: '#6b7280' }
        }}
      />
    );
  }
  
  return null;
};

// ==========================================
// STATS CARD COMPONENT
// ==========================================
const StatsCard = ({ title, value, icon, color, bgColor }) => (
  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Card sx={{ 
      p: 2, 
      bgcolor: bgColor, 
      border: `1px solid ${color}20`,
      borderRadius: 2
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Box sx={{ 
          p: 1.5, 
          borderRadius: 2, 
          bgcolor: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
      </Box>
    </Card>
  </motion.div>
);

// ==========================================
// MAIN COMPONENT
// ==========================================
const TravelDeskPortal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { 
    pendingRequests, 
    completedRequests, 
    loading, 
    bookingInProgress,
    error 
  } = useSelector((state) => state.dashboard);

  // State
  const [pendingRequestModalOpen, setPendingRequestModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedTId, setSelectedTId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // ==========================================
  // EFFECTS
  // ==========================================
  useEffect(() => {
    dispatch(fetchTravelDeskData());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // ==========================================
  // COMPUTED VALUES
  // ==========================================
  
  // Count requests by status
  const statusCounts = React.useMemo(() => {
    const counts = {
      documentsReady: 0,    // Status 14 - Documents submitted, need review
      bookingRequired: 0,   // Status 15 - Need to book tickets
      awaitingDocs: 0,      // Status 13 - Waiting for employee to upload
      ticketsUploaded: 0,   // Status 16 - Tickets uploaded
      completed: 0          // Status 17 - Completed
    };
    
    pendingRequests?.forEach(req => {
      if (req.statusId === 13) counts.awaitingDocs++;
      if (req.statusId === 14) counts.documentsReady++;
      if (req.statusId === 15) counts.bookingRequired++;
    });
    
    completedRequests?.forEach(req => {
      if (req.statusId === 16) counts.ticketsUploaded++;
      if (req.statusId === 17) counts.completed++;
    });
    
    return counts;
  }, [pendingRequests, completedRequests]);

  // Sort pending requests by priority (14 first, then 15, then 13)
  const sortedPendingRequests = React.useMemo(() => {
    if (!pendingRequests) return [];
    
    return [...pendingRequests].sort((a, b) => {
      const priorityOrder = { 14: 1, 15: 2, 13: 3 };
      const aPriority = priorityOrder[a.statusId] || 99;
      const bPriority = priorityOrder[b.statusId] || 99;
      return aPriority - bPriority;
    });
  }, [pendingRequests]);

  // ==========================================
  // HANDLERS
  // ==========================================
  
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login', { replace: true });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchTravelDeskData());
    setRefreshing(false);
    toast.success('Data refreshed!');
  };

  const handleViewRequest = (id, tId) => {
    console.log("Opening Modal for:", id, tId);
    setSelectedId(id);
    setSelectedTId(tId);
    setPendingRequestModalOpen(true);
  };

  // Process to next status (14 → 15)
  const handleStartBooking = async (req) => {
    try {
      await dispatch(processBooking({ 
        tId: req.tId, 
        newStatus: 15 // PENDING_TICKETS
      })).unwrap();
      toast.success("Moved to Booking Phase!");
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  // Upload tickets (15 → 16)
  const handleUploadTickets = async (req) => {
    try {
      await dispatch(processBooking({ 
        tId: req.tId, 
        newStatus: 7
      })).unwrap();
      toast.success("Initiated Final Approval");
    }catch (err) {
      toast.error("Failed to Initiate Final Approval");
    }
  };
  // Upload tickets (15 → 16)
  //   const handleUploadTickets = async (req) => {
  //   try {
  //     await dispatch(processBooking({ 
  //       tId: req.tId, 
  //       newStatus: 7
  //     })).unwrap();
  //     toast.success("Initiated Final Approval");
  //   }catch (err) {
  //     toast.error("Failed to Initiate Final Approval");
  //   }
  // };
  // Complete booking (16 → 17)
  const handleMarkCompleted = async (req) => {
    try {
      await dispatch(processBooking({ 
        tId: req.tId, 
        newStatus: 17 // COMPLETED
      })).unwrap();
      toast.success("Travel marked as Completed!");
    } catch (err) {
      toast.error("Failed to complete.");
    }
  };

  // Get action button based on status
  const getActionButton = (req) => {
    const { statusId, tId } = req;
    
    switch (statusId) {
      case 13:
        // Awaiting documents - no action available
        return (
          <Tooltip title="Waiting for employee to upload documents">
            <span>
              <SharedButton
                variant="outlined"
                disabled
                sx={{ mr: 2 }}
              >
                Awaiting Docs
              </SharedButton>
            </span>
          </Tooltip>
        );
        
      case 14:
        // Documents ready - Start booking
        return (
          <SharedButton
            variant="contained"
            onClick={() => handleStartBooking(req)}
            disabled={bookingInProgress}
            startIcon={<Flight />}
            sx={{
              bgcolor: "#3b82f6",
              "&:hover": { bgcolor: "#2563eb" },
              mr: 2,
            }}
          >
            {bookingInProgress ? "Processing..." : "Start Booking"}
          </SharedButton>
        );
        
      case 15:
        // Booking in progress - Upload tickets
        return (
          <SharedButton
            variant="contained"
            onClick={() => handleUploadTickets(req)}
            disabled={bookingInProgress}
            startIcon={<Upload />}
            sx={{
              bgcolor: "#16a34a",
              "&:hover": { bgcolor: "#15803d" },
              mr: 2,
            }}
          >
            {bookingInProgress ? "Processing..." : "Upload Tickets"}
          </SharedButton>
        );
        
      case 16:
        // Tickets uploaded - Mark completed
        return (
          <SharedButton
            variant="contained"
            onClick={() => handleMarkCompleted(req)}
            disabled={bookingInProgress}
            startIcon={<Done />}
            sx={{
              bgcolor: "#7c3aed",
              "&:hover": { bgcolor: "#6d28d9" },
              mr: 2,
            }}
          >
            {bookingInProgress ? "Processing..." : "Mark Completed"}
          </SharedButton>
        );
        
      default:
        return null;
    }
  };

  // Get card styling based on status
  const getCardStyle = (statusId) => {
    switch (statusId) {
      case 14:
        return {
          bg: '#fffbeb',
          border: '#f59e0b',
          borderLeft: '4px solid #f59e0b'
        };
      case 15:
        return {
          bg: '#eff6ff',
          border: '#3b82f6',
          borderLeft: '4px solid #3b82f6'
        };
      case 13:
        return {
          bg: '#f9fafb',
          border: '#d1d5db',
          borderLeft: '4px solid #9ca3af'
        };
      case 16:
        return {
          bg: '#f0fdf4',
          border: '#22c55e',
          borderLeft: '4px solid #22c55e'
        };
      case 17:
        return {
          bg: '#f0fdf4',
          border: '#16a34a',
          borderLeft: '4px solid #16a34a'
        };
      default:
        return {
          bg: '#ffffff',
          border: '#e5e7eb',
          borderLeft: '1px solid #e5e7eb'
        };
    }
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <BaseLayout variant="dashboard">
      <Navbar user={user} onLogout={handleLogout} />
      
      {/* View Details Modal */}
      <PendingRequestModal
        open={pendingRequestModalOpen}
        onClose={() => setPendingRequestModalOpen(false)}
        requestId={selectedTId}
      />

      <PageWrapper>
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
        >
          {/* ==========================================
              HEADER SECTION
          ========================================== */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              alignItems: "center",
              mb: 4,
              gap: 2
            }}
          >
            {/* Welcome Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <UserAvatar firstName={user?.firstName} lastName={user?.lastName} size="large" />
              </motion.div>

              <Box>
                <SharedTypography variant="h5" sx={{ fontWeight: 600 }}>
                  Welcome, {user?.firstName || 'Travel Desk'}!
                </SharedTypography>

                <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                  <Chip
                    label={user?.role?.replace("_", " ") || "Travel Desk"}
                    size="small"
                    sx={{ bgcolor: "#b91c1c", color: '#fff', fontWeight: 600 }}
                  />
                  {user?.department && (
                    <Chip
                      label={user.department}
                      size="small"
                      sx={{ bgcolor: "#f5f5f5", color: '#000', fontWeight: 600 }}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Tooltip title="Refresh data">
                <IconButton 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  sx={{ 
                    bgcolor: '#f1f5f9',
                    '&:hover': { bgcolor: '#e2e8f0' }
                  }}
                >
                  <motion.div
                    animate={refreshing ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: refreshing ? Infinity : 0 }}
                  >
                    <Refresh />
                  </motion.div>
                </IconButton>
              </Tooltip>
              
              <SharedButton
                variant="contained"
                startIcon={<FlightTakeoff />}
                sx={{
                  bgcolor: "#b91c1c",
                  "&:hover": { bgcolor: "#991b1b" },
                  minWidth: 180,
                }}
                onClick={() => toast.info("Create New Booking feature coming soon")}
              >
                New Booking
              </SharedButton>
            </Box>
          </Box>

          {/* ==========================================
              STATS CARDS
          ========================================== */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6} md={3}>
              <StatsCard
                title="Documents Ready"
                value={statusCounts.documentsReady}
                icon={<Description sx={{ color: '#f59e0b', fontSize: 28 }} />}
                color="#f59e0b"
                bgColor="#fffbeb"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatsCard
                title="Booking Required"
                value={statusCounts.bookingRequired}
                icon={<Flight sx={{ color: '#3b82f6', fontSize: 28 }} />}
                color="#3b82f6"
                bgColor="#eff6ff"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatsCard
                title="Awaiting Docs"
                value={statusCounts.awaitingDocs}
                icon={<Schedule sx={{ color: '#6b7280', fontSize: 28 }} />}
                color="#6b7280"
                bgColor="#f9fafb"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatsCard
                title="Completed"
                value={statusCounts.completed + statusCounts.ticketsUploaded}
                icon={<CheckCircle sx={{ color: '#16a34a', fontSize: 28 }} />}
                color="#16a34a"
                bgColor="#f0fdf4"
              />
            </Grid>
          </Grid>

          {/* ==========================================
              MAIN CONTENT
          ========================================== */}
          <Typography variant="h5" sx={{ fontSize: "1.8rem", mb: 2, fontWeight: 600 }}>
            Travel Desk Portal
          </Typography>
          
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={(e, v) => setTabValue(v)}
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem'
                }
              }}
            >
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>Pending</span>
                    <Badge 
                      badgeContent={pendingRequests?.length || 0} 
                      color="error"
                      sx={{ '& .MuiBadge-badge': { fontWeight: 600 } }}
                    />
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>Completed</span>
                    <Badge 
                      badgeContent={completedRequests?.length || 0} 
                      color="success"
                      sx={{ '& .MuiBadge-badge': { fontWeight: 600 } }}
                    />
                  </Box>
                } 
              />
            </Tabs>
          </Box>

          {/* ==========================================
              PENDING REQUESTS TAB
          ========================================== */}
          <AnimatePresence mode="wait">
            {tabValue === 0 && (
              <motion.div
                key="pending"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    p: 3,
                    border: "1.5px solid #b91c1c",
                    borderTop: `7px solid #b91c1c`,
                    borderRadius: 2
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Pending Requests for Review
                      </Typography>
                      
                      {/* Priority Legend */}
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box sx={{ width: 12, height: 12, bgcolor: '#f59e0b', borderRadius: 1 }} />
                          <Typography variant="caption">Docs Ready ({statusCounts.documentsReady})</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box sx={{ width: 12, height: 12, bgcolor: '#3b82f6', borderRadius: 1 }} />
                          <Typography variant="caption">Booking ({statusCounts.bookingRequired})</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box sx={{ width: 12, height: 12, bgcolor: '#9ca3af', borderRadius: 1 }} />
                          <Typography variant="caption">Awaiting ({statusCounts.awaitingDocs})</Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    {loading && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress sx={{ color: '#b91c1c' }} />
                      </Box>
                    )}
                    
                    {!loading && sortedPendingRequests?.length === 0 && (
                      <Alert severity="info" sx={{ borderRadius: 2 }}>
                        <Typography>No pending requests found. All caught up! 🎉</Typography>
                      </Alert>
                    )}

                    {!loading && sortedPendingRequests?.map((req, index) => {
                      const cardStyle = getCardStyle(req.statusId);
                      
                      return (
                        <motion.div
                          key={req.tId || index}
                          variants={listItemVariants}
                          initial="initial"
                          animate="animate"
                          custom={index}
                          whileHover={{ scale: 1.005 }}
                        >
                          <Card
                            sx={{
                              mb: 2,
                              p: 2.5,
                              border: `1px solid ${cardStyle.border}`,
                              borderLeft: cardStyle.borderLeft,
                              backgroundColor: cardStyle.bg,
                              borderRadius: 2,
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Grid
                              container
                              justifyContent="space-between"
                              alignItems="center"
                              spacing={2}
                            >
                              {/* Request Info */}
                              <Grid item xs={12} md={7}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                  {/* Avatar */}
                                  <Box sx={{ 
                                    width: 48, 
                                    height: 48, 
                                    borderRadius: 2, 
                                    bgcolor: '#e2e8f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}>
                                    <Person sx={{ color: '#64748b' }} />
                                  </Box>
                                  
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: '#1e293b' }}>
                                      {req.id}: {req.employee}
                                    </Typography>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <LocationOn sx={{ fontSize: 16, color: '#64748b' }} />
                                        <Typography variant="body2" color="text.secondary">
                                          {req.destination}
                                        </Typography>
                                      </Box>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <CalendarToday sx={{ fontSize: 16, color: '#64748b' }} />
                                        <Typography variant="body2" color="text.secondary">
                                          {req.departure}
                                        </Typography>
                                      </Box>
                                    </Box>
                                    
                                    {/* Status Chips */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                                      <StatusChipMapped statusId={req.statusId} />
                                      <PriorityBadge statusId={req.statusId} />
                                    </Box>
                                  </Box>
                                </Box>
                              </Grid>

                              {/* Action Buttons */}
                              <Grid item xs={12} md={5}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  justifyContent: { xs: 'flex-start', md: 'flex-end' },
                                  alignItems: 'center',
                                  gap: 1,
                                  flexWrap: 'wrap'
                                }}>
                                  {getActionButton(req)}
                                  
                                  <SharedButton 
                                    variant="outlined" 
                                    onClick={() => handleViewRequest(req.id, req.tId)}
                                    startIcon={<Visibility />}
                                  >
                                    View Details
                                  </SharedButton>
                                </Box>
                              </Grid>
                            </Grid>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* ==========================================
                COMPLETED REQUESTS TAB
            ========================================== */}
            {tabValue === 1 && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    p: 3,
                    border: "1.5px solid #16a34a",
                    borderTop: `7px solid #16a34a`,
                    borderRadius: 2
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Completed Bookings
                    </Typography>
                    
                    {loading && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress sx={{ color: '#16a34a' }} />
                      </Box>
                    )}
                    
                    {!loading && completedRequests?.length === 0 && (
                      <Alert severity="info" sx={{ borderRadius: 2 }}>
                        <Typography>No completed bookings yet.</Typography>
                      </Alert>
                    )}

                    {!loading && completedRequests?.map((req, index) => {
                      const cardStyle = getCardStyle(req.statusId);
                      
                      return (
                        <motion.div
                          key={req.tId || index}
                          variants={listItemVariants}
                          initial="initial"
                          animate="animate"
                          custom={index}
                          whileHover={{ scale: 1.005 }}
                        >
                          <Card
                            sx={{
                              mb: 2,
                              p: 2.5,
                              border: `1px solid ${cardStyle.border}`,
                              borderLeft: cardStyle.borderLeft,
                              backgroundColor: cardStyle.bg,
                              borderRadius: 2
                            }}
                          >
                            <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                              {/* Request Info */}
                              <Grid item xs={12} md={8}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                  <Box sx={{ 
                                    width: 48, 
                                    height: 48, 
                                    borderRadius: 2, 
                                    bgcolor: '#dcfce7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}>
                                    <CheckCircle sx={{ color: '#16a34a' }} />
                                  </Box>
                                  
                                  <Box>
                                    <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: '#1e293b' }}>
                                      {req.id}: {req.employee}
                                    </Typography>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <LocationOn sx={{ fontSize: 16, color: '#64748b' }} />
                                        <Typography variant="body2" color="text.secondary">
                                          {req.destination}
                                        </Typography>
                                      </Box>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <CalendarToday sx={{ fontSize: 16, color: '#64748b' }} />
                                        <Typography variant="body2" color="text.secondary">
                                          {req.departure}
                                        </Typography>
                                      </Box>
                                    </Box>
                                    
                                    <Box sx={{ mt: 1.5 }}>
                                      <StatusChipMapped statusId={req.statusId} />
                                    </Box>
                                  </Box>
                                </Box>
                              </Grid>

                              {/* Actions */}
                              <Grid item xs={12} md={4}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  justifyContent: { xs: 'flex-start', md: 'flex-end' },
                                  alignItems: 'center',
                                  gap: 1
                                }}>
                                  {/* Show Mark Completed button for status 16 */}
                                  {req.statusId === 16 && (
                                    <SharedButton
                                      variant="contained"
                                      onClick={() => handleMarkCompleted(req)}
                                      disabled={bookingInProgress}
                                      startIcon={<Done />}
                                      sx={{
                                        bgcolor: "#7c3aed",
                                        "&:hover": { bgcolor: "#6d28d9" },
                                        mr: 1,
                                      }}
                                    >
                                      Mark Completed
                                    </SharedButton>
                                  )}
                                  
                                  <SharedButton 
                                    variant="outlined" 
                                    onClick={() => handleViewRequest(req.id, req.tId)}
                                    startIcon={<Visibility />}
                                  >
                                    View
                                  </SharedButton>
                                </Box>
                              </Grid>
                            </Grid>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </PageWrapper>
    </BaseLayout>
  );
};

export default TravelDeskPortal;