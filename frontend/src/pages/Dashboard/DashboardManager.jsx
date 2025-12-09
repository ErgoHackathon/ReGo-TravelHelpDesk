// pages/dashboard/DashboardManager.jsx
import React, { useState, useEffect, useMemo } from 'react';
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
  Typography,
  Button,
  Stack
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
import managerService from '../../services/managerService';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

// Icon Mapping
const ICON_MAP = {
  FlightTakeoff: <FlightTakeoff sx={{ fontSize: 35 }} />,
  Group: <Group sx={{ fontSize: 35 }} />,
  People: <People sx={{ fontSize: 35 }} />,
  Assignment: <Assignment sx={{ fontSize: 35 }} />,
  PendingActions: <PendingActions sx={{ fontSize: 35 }} />,
  CheckCircle: <CheckCircle sx={{ fontSize: 35 }} />,
  Cancel: <Cancel sx={{ fontSize: 35 }} />,
  AttachMoney: <AttachMoney sx={{ fontSize: 35 }} />
};

// Status Labels
const STATUS_LABEL = {
  1: 'PENDING',
  2: 'APPROVED',
  3: 'REJECTED'
};

// Animated Stat Card Component
const statCardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
  }),
  hover: { y: -4, scale: 1.02, transition: { duration: 0.2 } }
};

const AnimatedStatCard = ({ stat, index }) => (
  <motion.div variants={statCardVariants} custom={index} initial="initial" animate="animate" whileHover="hover" style={{ height: '100%' }}>
    <StatDisplay
      title={stat.title}
      value={stat.value}
      icon={ICON_MAP[stat.iconKey] || <FlightTakeoff />}
      trend={stat.trend}
      color={stat.color}
    />
  </motion.div>
);

// Filter Button Component
const FilterButton = ({ label, value, filterStatus, setFilterStatus }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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

const DashboardManager = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { stats, getAllDetails, allEmployees, loading } = useSelector(state => state.dashboard);

  const [showRaiseRequestModal, setShowRaiseRequestModal] = useState(false);
  const [checkedEmployees, setCheckedEmployees] = useState([]);
  const [dates, setDates] = useState({});
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [remark, setRemark] = useState("");
  const [requestSubmit, setRequestSubmit] = useState(false);

  const [filterStatus, setFilterStatus] = useState('PENDING');

  // Employees not on travel
  const employeesNotOnTravel = useMemo(() => {
    const travellingIds = new Set(getAllDetails.map(emp => emp?.empId));
    return allEmployees.filter(emp => !travellingIds.has(emp?.empId));
  }, [getAllDetails, allEmployees]);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch, requestSubmit]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  const handleViewDetails = (id) => {
    navigate(`/application/${id}`);
  };

  const resetFields = () => {
    setCountry('');
    setCity('');
    setRemark('');
    setDates({});
    setCheckedEmployees([]);
  };

  const handleCloseModal = () => {
    resetFields();
    setShowRaiseRequestModal(false);
  };

  const handleCheckboxChange = (employeeId) => {
    setCheckedEmployees(prev =>
      prev.includes(employeeId) ? prev.filter(id => id !== employeeId) : [...prev, employeeId]
    );
  };

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const handleDateChange = (employeeId, dateType, value) => {
    setDates(prev => ({
      ...prev,
      [employeeId]: { ...prev[employeeId], [dateType]: value }
    }));
  };

  const handleSubmitRequest = async () => {
    const jsonData = checkedEmployees.map(empId => ({
      empId,
      country,
      city,
      travelStartDate: dates[empId]?.startDate || null,
      travelEndDate: dates[empId]?.endDate || null,
      status: 1,
      rptEmpId: user.empId,
      remark
    }));

    try {
      const results = await Promise.all(
        jsonData.map(travelRequest => managerService.createTravelRequest(travelRequest))
      );

      if (results.every(res => res === 'Inserted')) {
        toast.success('Request Submitted');
      } else {
        toast.error('Some requests failed');
      }
    } catch (err) {
      toast.error('Request Failed');
      console.error(err);
    }

    setShowRaiseRequestModal(false);
    setRequestSubmit(true);
  };

  const getFilteredApprovals = () => {
    if (filterStatus === 'ALL') return getAllDetails;
    const statusMap = { PENDING: 1, APPROVED: 2, REJECTED: 3 };
    return getAllDetails.filter(req => req.status === statusMap[filterStatus]);
  };

  const filteredApprovals = getFilteredApprovals();

  if (loading) return <LoadingSpinner />;

  const displayStats = stats && stats.length > 0 ? stats : [
    { title: 'Requests Raised', value: 24, iconKey: 'FlightTakeoff' },
    { title: 'Pending Approvals', value: 5, iconKey: 'Assignment' },
    { title: 'Total Reports', value: 12, iconKey: 'Group' }
  ];

  const firstName = user?.name.split(" ")[0] || '';
  const lastName = user?.name.split(" ")[1] || '';

  return (
    <BaseLayout variant="dashboard">
      <Navbar user={user} onLogout={handleLogout} />

      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <UserAvatar firstName={firstName} lastName={lastName} size="large" />
          <Box>
            <SharedTypography variant="pageTitle">
              {user?.role === 'MANAGER' ? 'Manager Dashboard' : `${user?.role} Dashboard`}
            </SharedTypography>
            <StatusChip label={`${user?.role} - ${user?.department}`} variant="default" />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <SharedButton
              variant="contained"
              startIcon={<FlightTakeoff />}
              sx={{ bgcolor: "#b22a2a", "&:hover": { bgcolor: "#8b1f1f" }, minWidth: 200 }}
              onClick={() => setShowRaiseRequestModal(true)}
            >
              Raise Travel Request
            </SharedButton>
          </motion.div>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {displayStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <AnimatedStatCard stat={stat} index={index} />
            </Grid>
          ))}
        </Grid>

        {/* Recent Applications Table */}
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
            {filteredApprovals.length > 0 ? filteredApprovals.map(req => (
              <TableRow key={req.id}>
                <TableCell>{req.id}</TableCell>
                <TableCell>{req.employeeDetails?.empName}</TableCell>
                <TableCell>{req.destination}</TableCell>
                <TableCell>
                  <StatusChip label={STATUS_LABEL[req.status] || 'PENDING'} />
                </TableCell>
                <TableCell>
                  <SharedButton
                    variant="outlined"
                    size="small"
                    endIcon={<ArrowForward fontSize="small" />}
                    onClick={() => handleViewDetails(req.id)}
                    sx={{
                      borderColor: '#e2e8f0',
                      color: '#64748b',
                      '&:hover': { borderColor: '#b91c1c', color: '#b91c1c', bgcolor: '#fef2f2' }
                    }}
                  >
                    View Details
                  </SharedButton>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#64748b' }}>
                  No requests found matching filter "{filterStatus}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </SharedTable>

        {/* Raise Request Modal */}
        <SharedModal
          open={showRaiseRequestModal}
          onClose={handleCloseModal}
          title="Raise New Travel Request"
          maxWidth="md"
          fullWidth
        >
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
              Fill in the details below to submit a new travel request for your team.
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Destination Country"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Destination City"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Reason for Travel"
                  value={remark}
                  onChange={e => setRemark(e.target.value)}
                />
              </Grid>
            </Grid>

            {/* Employee Selection */}
            <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Employee Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Departure Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Arrival Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeesNotOnTravel.length > 0 ? employeesNotOnTravel.map(emp => (
                    <TableRow key={emp.empId}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          size="small"
                          checked={checkedEmployees.includes(emp.empId)}
                          onChange={() => handleCheckboxChange(emp.empId)}
                        />
                      </TableCell>
                      <TableCell>{emp.name}</TableCell>
                      <TableCell>
                        <TextField
                          type="date"
                          size="small"
                          fullWidth
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                          value={dates[emp.empId]?.startDate || ''}
                          inputProps={{ min: getTodayDate() }}
                          onChange={e => handleDateChange(emp.empId, 'startDate', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="date"
                          size="small"
                          fullWidth
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                          value={dates[emp.empId]?.endDate || ''}
                          inputProps={{ min: dates[emp.empId]?.startDate || getTodayDate() }}
                          onChange={e => handleDateChange(emp.empId, 'endDate', e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#64748b' }}>
                        No employees available for travel
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>

            {/* Modal Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <SharedButton
                variant="outlined"
                onClick={handleCloseModal}
                sx={{ borderColor: '#e2e8f0', color: '#64748b', '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' } }}
              >
                Cancel
              </SharedButton>
              <SharedButton
                variant="contained"
                onClick={handleSubmitRequest}
                sx={{ bgcolor: '#b91c1c', '&:hover': { bgcolor: '#991b1b' }, px: 4 }}
              >
                Submit Request
              </SharedButton>
            </Box>
          </Box>
        </SharedModal>
      </Box>
    </BaseLayout>
  );
};

export default DashboardManager;
