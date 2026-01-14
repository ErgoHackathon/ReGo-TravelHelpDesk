// pages/dashboard/DashboardManager.jsx - COMPLETE CORRECTED CODE
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
  FilterList,
  ConnectingAirportsOutlined,
  Report,
  Dashboard,
  Summarize
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
import managerService from '../../services/managerService';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

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
  'Flight': <FlightTakeoff sx={{ fontSize: 35 }} />,
  'FlightTakeoff': <FlightTakeoff sx={{ fontSize: 35 }} />,
  'Group': <Group sx={{ fontSize: 35 }} />,
  'People': <People sx={{ fontSize: 35 }} />,
  'Assignment': <Assignment sx={{ fontSize: 35 }} />,
  'PendingActions': <PendingActions sx={{ fontSize: 35 }} />,
  'CheckCircle': <CheckCircle sx={{ fontSize: 35 }} />,
  'Cancel': <Cancel sx={{ fontSize: 35 }} />,
  'AttachMoney': <AttachMoney sx={{ fontSize: 35 }} />
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

// ============================================
// ✅ HELPER: Normalize Role ID
// Backend returns 1-5, some code expects 101-105
// This function handles BOTH formats
// ============================================
const normalizeRoleId = (roleId) => {
  // If roleId is 1-5, return as is
  // If roleId is 101-105, convert to 1-5 format
  if (roleId >= 101 && roleId <= 105) {
    return roleId - 100; // 102 → 2, 104 → 4, etc.
  }
  return roleId; // Already 1-5 format
};

// ============================================
// ✅ Check if user is Manager (roleId 2 or 102)
// ============================================
const isManager = (roleId) => {
  const normalized = normalizeRoleId(roleId);
  return normalized === 2;
};

// ============================================
// ✅ Check if user is AVP (roleId 4 or 104)
// ============================================
const isAVP = (roleId) => {
  const normalized = normalizeRoleId(roleId);
  return normalized === 4;
};

// ============================================
// ✅ Check if user is SVP (roleId 5 or 105)
// ============================================
const isSVP = (roleId) => {
  const normalized = normalizeRoleId(roleId);
  return normalized === 5;
};

const DashboardManager = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { stats, pendingApprovals, getAllDetails, allEmployees, loading } = useSelector((state) => state.dashboard);

  const [showRaiseRequestModal, setShowRaiseRequestModal] = useState(false);
  const [checkedEmployees, setCheckedEmployees] = useState([]);
  const [dates, setDates] = useState({});
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [remark, setRemark] = useState("");
  const [requestSubmit, setRequestSubmit] = useState(false);
  const [requestSubmitStatus, setRequestSubmitStatus] = useState(0);
  const [filterStatus, setFilterStatus] = useState('PENDING');

  // ✅ STABILITY FIX: Ensure arrays exist before .map()
  const safeGetAllDetails = getAllDetails || [];
  const safeAllEmployees = allEmployees || [];

  const travellingEmployeeIds = new Set(safeGetAllDetails.map(employee => employee?.empId));

  const emplyeesNotOnTravel = safeAllEmployees.filter(employee => !travellingEmployeeIds.has(employee?.empId));

  // Add inside the component, after safeGetAllDetails is defined
  useEffect(() => {
    if (safeGetAllDetails.length > 0) {
      console.log('📊 Dashboard Debug:', {
        userRole: user?.role,
        userRoleId: user?.roleId,
        normalizedRoleId: normalizeRoleId(user?.roleId),
        totalRequests: safeGetAllDetails.length,
        allStatuses: safeGetAllDetails.map(r => ({
          id: r.travelLabel || r.id,
          status: r.status,
          empName: r.employeeDetails?.empName
        }))
      });
    }
  }, [safeGetAllDetails, user]);

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
    setCheckedEmployees((prev) => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleDateChange = (employeeId, dateType, value) => {
    setDates((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [dateType]: value,
      },
    }));
  };

  // ✅ FIXED: Use normalized role check
  const getStatusToSubmitWhileRaisingRequest = (user) => {
    const roleId = user?.roleId;
    
    if (isManager(roleId)) return 1;  // Manager initiated
    if (isAVP(roleId)) return 2;      // AVP initiated
    if (isSVP(roleId)) return 3;      // SVP initiated
    
    return 1; // Default to Manager initiated
  };

  const handleSubmitRequest = async () => {
    // Get status first
    const requestStatus = getStatusToSubmitWhileRaisingRequest(user);

    // ✅ Validate status
    if (!requestStatus || requestStatus === 0) {
      console.error('❌ Invalid status:', requestStatus, 'for user:', user);
      toast.error('Unable to determine request status. Please contact admin.');
      return;
    }

    const jsonData = checkedEmployees.map(employeeId => {
      const startDate = dates[employeeId]?.startDate;
      const endDate = dates[employeeId]?.endDate;

      // ✅ Validate dates
      if (!startDate || !endDate) {
        toast.error(`Please select dates for all employees`);
        return null;
      }

      return {
        empId: employeeId,
        country: country,
        city: city,
        travelStartDate: startDate,
        travelEndDate: endDate,
        status: requestStatus,
        rptEmpId: user.empId,
        remark: remark
      };
    }).filter(Boolean); // Remove null entries

    if (jsonData.length === 0) {
      toast.error('No valid requests to submit');
      return;
    }

    // Debug log
    console.log('📤 Submitting travel requests:', jsonData);

    let allSuccess = true;
    for (const travelRequest of jsonData) {
      try {
        const response = await managerService.createTravelRequest(travelRequest);
        console.log('✅ Response:', response);
        if (response !== 'Inserted') {
          allSuccess = false;
        }
      } catch (error) {
        allSuccess = false;
        console.error("❌ Request failed:", error);
      }
    }

    if (allSuccess) {
      toast.success('Request Submitted');
      resetFields();
    } else {
      toast.error('Request Failed');
    }

    setShowRaiseRequestModal(false);
    setRequestSubmit(true);
  };

  // ============================================
  // ✅ COMPLETELY FIXED: getFilteredApprovals
  // Now uses normalized roleId checking
  // ============================================
  const getFilteredApprovals = useMemo(() => {
    // ✅ DEBUG: Log everything
    console.log('🔍 FILTER DEBUG START ============');
    console.log('🔍 filterStatus:', filterStatus);
    console.log('🔍 user.roleId:', user?.roleId);
    console.log('🔍 normalized roleId:', normalizeRoleId(user?.roleId));
    console.log('🔍 safeGetAllDetails:', safeGetAllDetails);
    console.log('🔍 safeGetAllDetails.length:', safeGetAllDetails?.length);

    if (safeGetAllDetails?.length > 0) {
      console.log('🔍 First item:', safeGetAllDetails[0]);
      console.log('🔍 All statuses:', safeGetAllDetails.map(r => ({
        id: r.travelLabel || r.id,
        status: r.status,
        statusType: typeof r.status
      })));
    }

    if (filterStatus === 'ALL') {
      console.log('🔍 Returning ALL:', safeGetAllDetails.length);
      return safeGetAllDetails;
    }

    // ============================================
    // ✅ STATUS MAPS BASED ON ROLE
    // ============================================
    
    // Manager (roleId 2 or 102):
    // PENDING = Status 1 (Manager initiated - needs to approve), 7 (Final initiated)
    // APPROVED = Status 4+ (everything after manager approved)
    const managerStatusMap = {
      PENDING: [1, 7],
      APPROVED: [4, 5, 6, 10, 11, 12, 13, 14, 15, 16, 17],
      REJECTED: [18, 19, 20]
    };

    // AVP (roleId 4 or 104):
    // PENDING = Status 2 (AVP initiated), 4 (Manager approved - waiting for AVP), 8, 10
    // APPROVED = Status 5+ (AVP approved and beyond)
    const avpStatusMap = {
      PENDING: [2, 4, 8, 10],
      APPROVED: [5, 6, 11, 12, 13, 14, 15, 16, 17],
      REJECTED: [18, 19, 20]
    };

    // SVP (roleId 5 or 105):
    // PENDING = Status 3 (SVP initiated), 5 (AVP approved - waiting for SVP), 9, 11
    // APPROVED = Status 6+ (SVP approved and beyond)
    const svpStatusMap = {
      PENDING: [3, 5, 9, 11],
      APPROVED: [6, 12, 13, 14, 15, 16, 17],
      REJECTED: [18, 19, 20]
    };

    let targetStatuses = [];
    const roleId = user?.roleId;

    // ✅ FIXED: Use normalized role checking
    if (isManager(roleId)) {
      targetStatuses = managerStatusMap[filterStatus] || [];
      console.log('🔍 Using MANAGER status map');
    } else if (isAVP(roleId)) {
      targetStatuses = avpStatusMap[filterStatus] || [];
      console.log('🔍 Using AVP status map');
    } else if (isSVP(roleId)) {
      targetStatuses = svpStatusMap[filterStatus] || [];
      console.log('🔍 Using SVP status map');
    } else {
      console.log('🔍 Unknown role, using empty targetStatuses');
    }

    console.log('🔍 targetStatuses for', filterStatus, ':', targetStatuses);

    const filtered = safeGetAllDetails.filter(req => {
      const reqStatus = Number(req.status);
      const isMatch = targetStatuses.includes(reqStatus);
      console.log(`🔍 Checking request ${req.travelLabel}: status=${reqStatus}, isMatch=${isMatch}`);
      return isMatch;
    });

    console.log('🔍 Filtered result:', filtered.length, 'items');
    console.log('🔍 FILTER DEBUG END ============');

    return filtered;

  }, [filterStatus, safeGetAllDetails, user?.roleId]);

  const handleFilter = (value) => {
    setFilterStatus(value);
  };

  // ✅ FIXED FilterButton Component
  const FilterButton = ({ label, value }) => (
    <motion.div variants={filterButtonVariants} whileHover="hover" whileTap="tap">
      <Button
        variant={filterStatus === value ? "contained" : "outlined"}
        size="small"
        onClick={() => handleFilter(value)}
        sx={{
          borderRadius: 5,
          textTransform: 'none',
          borderColor: filterStatus === value ? 'transparent' : '#e2e8f0',
          bgcolor: filterStatus === value ? '#1e293b' : 'transparent',
          color: filterStatus === value ? '#fff' : '#64748b',
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

  const handleGenerateReports = () => {
    toast.info("Coming Soon")
  }

  const firstName = user?.name?.split(" ")[0] || '';
  const lastName = user?.name?.split(" ")[1] || "";

  const displayStats = stats && stats.length > 0 ? stats : [
    { title: 'Requests Raised', value: 24, iconKey: 'FlightTakeoff' },
    { title: 'Pending Approvals', value: 5, iconKey: 'Assignment' },
    { title: 'Total Reports', value: 12, iconKey: 'Group' }
  ];

  return (
    <BaseLayout variant="dashboard">
      <Navbar user={user} onLogout={handleLogout} />

      <Box sx={{ p: 3 }}>
        {/* Header */}
        <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <UserAvatar
              firstName={firstName}
              lastName={lastName}
              size="large"
            />
            <Box>
              <SharedTypography variant="pageTitle">
                {user?.role === 'MANAGER' ? 'Manager Dashboard' : `${user?.role} Dashboard`}
              </SharedTypography>
              <StatusChip
                label={`${user?.role} - ${user?.department || 'Department'}`}
                variant="default"
              />
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
                  minWidth: 150,
                }}
                onClick={() => setShowRaiseRequestModal(true)}
              >
                Raise Travel Request
              </SharedButton>
            </motion.div>

            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <SharedButton
                variant="contained"
                startIcon={<Summarize />}
                sx={{
                  bgcolor: "#b22a2a",
                  "&:hover": { bgcolor: "#8b1f1f" },
                  minWidth: 150,
                }}
                onClick={() => handleGenerateReports(true)}
              >
                Generate Reports
              </SharedButton>
            </motion.div>
          </Box>

          {/* Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {displayStats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={12 / stats.length} key={index}>
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
            <SharedCard sx={{
              p: 3,
              border: "1.5px solid #b91c1c",
              borderTop: `7px solid #b91c1c`,
              borderRadius: 2
            }}>
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
                </Stack>
              </Box>

              <SharedTable>
                <TableHeader
                  columns={[
                    { id: 'id', label: 'Request ID' },
                    { id: 'empid', label: 'Employee ID' },
                    { id: 'employee', label: 'Employee Name' },
                    { id: 'destination', label: 'Destination' },
                    { id: 'actions', label: 'Action' }
                  ]}
                />

                <TableBody>
                  {getFilteredApprovals.length > 0 ? getFilteredApprovals.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.travelLabel}</TableCell>
                      <TableCell>{request.employeeDetails?.empId}</TableCell>
                      <TableCell>{request.employeeDetails?.empName}</TableCell>
                      <TableCell>{request.destination}</TableCell>
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
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#64748b' }}>
                        No requests found matching filter "{filterStatus}"
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </SharedTable>
            </SharedCard>
          </motion.div>
        </motion.div>

        {/* Raise New Request Modal */}
        <SharedModal
          open={showRaiseRequestModal}
          onClose={handleCloseModal}
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
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Destination Country"
                    variant="outlined"
                    placeholder="e.g. Germany"
                    InputLabelProps={{ shrink: true }}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Destination City"
                    variant="outlined"
                    placeholder="e.g. Berlin"
                    InputLabelProps={{ shrink: true }}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Reason for Travel"
                    variant="outlined"
                    placeholder="e.g. Client Meeting"
                    InputLabelProps={{ shrink: true }}
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                  />
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
                          <TableCell padding="checkbox"></TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Employee Id</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Employee Name</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Departure Date</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Arrival Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {emplyeesNotOnTravel.length > 0 ? emplyeesNotOnTravel.map((employee) => {
                          const startDate = dates[employee.empId]?.startDate || '';
                          const endDate = dates[employee.empId]?.endDate || '';
                          return (
                            <TableRow key={employee.id}>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  size="small"
                                  checked={checkedEmployees.includes(employee.empId)}
                                  onChange={() => handleCheckboxChange(employee.empId)} />
                              </TableCell>
                              <TableCell>{employee?.empId}</TableCell>
                              <TableCell>{employee?.name}</TableCell>
                              <TableCell>
                                <TextField
                                  type="date"
                                  size="small"
                                  fullWidth
                                  variant="standard"
                                  InputProps={{ disableUnderline: true }}
                                  onChange={(e) => handleDateChange(employee?.empId, 'startDate', e.target.value)}
                                  inputProps={{
                                    min: getTodayDate(),
                                  }}
                                  value={startDate}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="date"
                                  size="small"
                                  fullWidth
                                  variant="standard"
                                  InputProps={{ disableUnderline: true }}
                                  onChange={(e) => handleDateChange(employee.empId, 'endDate', e.target.value)}
                                  inputProps={{
                                    min: startDate || getTodayDate(),
                                  }}
                                  value={endDate}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        }) : (
                          <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#64748b' }}>
                              No available employees
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </Box>
                </Box>

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
                    disabled={!(country && city && checkedEmployees.length > 0)}
                    sx={{ bgcolor: '#b91c1c', '&:hover': { bgcolor: '#991b1b' }, px: 4 }}
                  >
                    Submit Request
                  </SharedButton>
                </Box>
              </motion.div>
            </Box>
          </motion.div>
        </SharedModal>
      </Box>
    </BaseLayout>
  );
};

export default DashboardManager;