// pages/dashboard/DashboardManager.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Typography,
  Button,
  Stack,
  Skeleton
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
  AttachMoney,
  FilterList
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

// Animation variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.08
    }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const cardVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  hover: {
    y: -4,
    boxShadow: "0 12px 24px -8px rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.2 }
  }
};

const statCardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: index * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }),
  hover: {
    y: -4,
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

const tableRowVariants = {
  initial: { opacity: 0, x: -10 },
  animate: (index) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      delay: index * 0.05,
      ease: [0, 0, 0.2, 1]
    }
  }),
  hover: {
    backgroundColor: "rgba(185, 28, 28, 0.03)",
    x: 4,
    transition: { duration: 0.2 }
  }
};

const filterButtonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
  selected: { scale: 1, backgroundColor: "#1e293b" }
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } }
};

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

// Animated Stat Card Component
const AnimatedStatCard = ({ stat, index }) => {
  return (
    <motion.div
      variants={statCardVariants}
      custom={index}
      initial="initial"
      animate="animate"
      whileHover="hover"
      style={{ height: '100%' }}
    >
      <StatDisplay
        title={stat.title}
        value={stat.value}
        icon={ICON_MAP[stat.iconKey] || <FlightTakeoff />}
        trend={stat.trend}
        color={stat.color}
      />
    </motion.div>
  );
};

const DashboardManager = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { stats, pendingApprovals, loading } = useSelector((state) => state.dashboard);
  const [showRaiseRequestModal, setShowRaiseRequestModal] = useState(false);

  // Filter State
  const [filterStatus, setFilterStatus] = useState('ALL');

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

  // Filter Logic
  const getFilteredApprovals = () => {
    if (filterStatus === 'ALL') return pendingApprovals;

    return pendingApprovals.filter(req => {
      if (filterStatus === 'PENDING') return req.status.includes('REVIEW') || req.status === 'PENDING';
      if (filterStatus === 'APPROVED') return req.status.includes('APPROVED');
      if (filterStatus === 'REJECTED') return req.status === 'REJECTED';
      return req.status === filterStatus;
    });
  };

  const filteredApprovals = getFilteredApprovals();

  const FilterButton = ({ label, value }) => (
    <motion.div
      variants={filterButtonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
    >
      <Button
        variant={filterStatus === value ? "contained" : "outlined"}
        size="small"
        onClick={() => setFilterStatus(value)}
        sx={{
          borderRadius: 5,
          textTransform: 'none',
          borderColor: filterStatus === value ? 'transparent' : '#e2e8f0',
          bgcolor: filterStatus === value ? '#1e293b' : 'transparent',
          color: filterStatus === value ? '#fff' : '#64748b',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: filterStatus === value ? '#0f172a' : '#f1f5f9',
            borderColor: filterStatus === value ? 'transparent' : '#cbd5e1'
          }
        }}
      >
        {label}
      </Button>
    </motion.div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  const defaultStats = [
    { title: 'Requests Raised', value: 24, iconKey: 'FlightTakeoff' },
    { title: 'Pending Approvals', value: 5, iconKey: 'Assignment' },
    { title: 'Total Reports', value: 12, iconKey: 'Group' }
  ];

  const displayStats = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <BaseLayout variant="dashboard">
      <Navbar user={user} onLogout={handleLogout} />

      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <motion.div variants={cardVariants}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <UserAvatar
                  firstName={user?.firstName}
                  lastName={user?.lastName}
                  size="large"
                />
              </motion.div>
              <Box>
                <SharedTypography variant="pageTitle">
                  {user?.role === 'MANAGER' ? 'Manager Dashboard' : `${user?.role} Dashboard`}
                </SharedTypography>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <StatusChip
                    label={`${user?.role} - ${user?.department}`}
                    variant="default"
                  />
                </motion.div>
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              {/* Raise Travel Request Button */}
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
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
              </motion.div>
            </Box>
          </motion.div>

          {/* Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {displayStats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <AnimatedStatCard stat={stat} index={index} />
              </Grid>
            ))}
          </Grid>

          {/* Recent Application Status Table */}
          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <SharedCard variant="dashboard">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <SharedTypography variant="cardTitle">
                  Recent Application Status
                </SharedTypography>

                {/* Filter Bar */}
                <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                  <FilterButton label="All" value="ALL" />
                  <FilterButton label="Pending" value="PENDING" />
                  <FilterButton label="Approved" value="APPROVED" />
                  <FilterButton label="Rejected" value="REJECTED" />
                  <FilterButton label="Manager Review" value="MANAGER_REVIEW" />
                  {(user?.role === 'AVP' || user?.role === 'SVP') && (
                    <FilterButton label="Travel Desk" value="TRAVEL_DESK_REVIEW" />
                  )}
                </Stack>
              </Box>

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
                  <AnimatePresence mode="popLayout">
                    {filteredApprovals.length > 0 ? filteredApprovals.map((request, index) => (
                      <motion.tr
                        key={request.id}
                        variants={tableRowVariants}
                        custom={index}
                        initial="initial"
                        animate="animate"
                        whileHover="hover"
                        exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                        layout
                        style={{ display: 'table-row' }}
                      >
                        <TableCell>
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            {request.id}
                          </motion.span>
                        </TableCell>
                        <TableCell>{request.employee}</TableCell>
                        <TableCell>{request.destination}</TableCell>
                        <TableCell>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, delay: index * 0.05 + 0.1 }}
                          >
                            <StatusChip label={request.status || 'PENDING_MANAGER'} />
                          </motion.div>
                        </TableCell>
                        <TableCell>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
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
                          </motion.div>
                        </TableCell>
                      </motion.tr>
                    )) : (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ display: 'table-row' }}
                      >
                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#64748b' }}>
                          <motion.div
                            initial={{ y: 10 }}
                            animate={{ y: 0 }}
                          >
                            No requests found matching filter "{filterStatus}"
                          </motion.div>
                        </TableCell>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </TableBody>
              </SharedTable>
            </SharedCard>
          </motion.div>
        </Box>
      </motion.div>

      {/* Raise New Request Modal */}
      <SharedModal
        open={showRaiseRequestModal}
        onClose={() => setShowRaiseRequestModal(false)}
        title="Raise New Travel Request"
        maxWidth="md"
        fullWidth
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
              Fill in the details below to submit a new travel request for your team.
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <TextField
                    fullWidth
                    label="Destination City/Country"
                    variant="outlined"
                    placeholder="e.g. London, UK"
                    InputLabelProps={{ shrink: true }}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <TextField
                    fullWidth
                    label="Reason for Travel"
                    variant="outlined"
                    placeholder="e.g. Client Meeting"
                    InputLabelProps={{ shrink: true }}
                  />
                </motion.div>
              </Grid>
            </Grid>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
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
                      {['John Doe', 'Jane Smith'].map((name, index) => (
                        <motion.tr
                          key={name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.25 + index * 0.05 }}
                          style={{ display: 'table-row' }}
                        >
                          <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
                          <TableCell>{name}</TableCell>
                          <TableCell>
                            <TextField 
                              type="date" 
                              size="small" 
                              fullWidth 
                              variant="standard" 
                              InputProps={{ disableUnderline: true }} 
                            />
                          </TableCell>
                          <TableCell>
                            <TextField 
                              type="date" 
                              size="small" 
                              fullWidth 
                              variant="standard" 
                              InputProps={{ disableUnderline: true }} 
                            />
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <SharedButton
                    variant="outlined"
                    onClick={() => setShowRaiseRequestModal(false)}
                    sx={{ 
                      borderColor: '#e2e8f0', 
                      color: '#64748b', 
                      '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' } 
                    }}
                  >
                    Cancel
                  </SharedButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <SharedButton
                    variant="contained"
                    onClick={() => {
                      setShowRaiseRequestModal(false);
                    }}
                    sx={{ bgcolor: '#b91c1c', '&:hover': { bgcolor: '#991b1b' }, px: 4 }}
                  >
                    Review & Submit Request
                  </SharedButton>
                </motion.div>
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </SharedModal>
    </BaseLayout>
  );
};

export default DashboardManager;