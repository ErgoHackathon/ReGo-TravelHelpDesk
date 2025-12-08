// pages/dashboard/DashboardManager.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { json, useNavigate } from 'react-router-dom';
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
  AttachMoney,
  FilterList,
  ConnectingAirportsOutlined
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
import realApi from '../../services/api/realApi';
import managerService from '../../services/managerService';

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

const DashboardManager = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  console.log("user in here::::::::::   ", user)
  const { stats, pendingApprovals, getAllDetails, allEmployees, loading } = useSelector((state) => state.dashboard);
  const [showRaiseRequestModal, setShowRaiseRequestModal] = useState(false);
  const [checkedEmployees, setCheckedEmployees] = useState([]);
  const [dates, setDates] = useState({});
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [remark, setRemark] = useState("")

  // Filter State
  const [filterStatus, setFilterStatus] = useState('ALL');
  console.log("pendingApprovals::::::::  ", pendingApprovals)
  console.log("stats on dashboard:::::::::  ", stats)
  console.log("getAllDetails on dash:::::::: ", getAllDetails)

  // useEffect(())

  useEffect(() => {
    dispatch(fetchDashboardData());
    // dispatch(realApi.getTravelDetailByRptId(user?.empId))
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  const handleViewDetails = (id) => {
    navigate(`/application/${id}`);
  };

  const handleCheckboxChange = (employeeId) => {
    setCheckedEmployees((prev) => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId); // Uncheck
      } else {
        return [...prev, employeeId]; // Check
      }
    });
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

  const handleSubmitRequest = () => {
    const jsonData = checkedEmployees.map(employeeId => ({
      empId: employeeId,
      // name: allEmployees.find(emp => emp.empId === employeeId).name,
      country: country,
      city: city,
      travelStartDate: dates[employeeId]?.startDate || null, // Get start date
      travelEndDate: dates[employeeId]?.endDate || null,     // Get end date
      status: 1,
      rptEmpId: user.empId,
      remark: remark
    }));

    console.log("request submit details here",JSON.stringify(jsonData)); // This will log the JSON object
    jsonData.forEach((travelRequest)=>{
      dispatch(managerService.createTravelRequest(travelRequest))
    })
    
    // Here you can also send jsonData to your API or handle it as needed
  }

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
        '&:hover': {
          bgcolor: filterStatus === value ? '#0f172a' : '#f1f5f9',
          borderColor: filterStatus === value ? 'transparent' : '#cbd5e1'
        }
      }}
    >
      {label}
    </Button>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  const firstName = user?.name.split(" ")[0];
  const lastName = user?.name.split(" ")[1];


  return (
    <BaseLayout variant="dashboard">
      <Navbar user={user} onLogout={handleLogout} />

      <Box sx={{ p: 3 }}>
        {/* Header */}
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
            <Grid item xs={12} sm={6} md={12 / stats.length}
              key={index}>
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
              {getAllDetails.length > 0 ? getAllDetails.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.employeeDetails?.empName}</TableCell>
                  <TableCell>{request.destination}</TableCell>
                  <TableCell>
                    {/* <StatusChip label={request.status || 'PENDING_MANAGER'} /> */}
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
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Destination Country"
                variant="outlined"
                placeholder="e.g. Germany"
                InputLabelProps={{ shrink: true }}
                value={country}
                onChange={(e)=>setCountry(e.target.value)}
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
                onChange={(e)=>setCity(e.target.value)}
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
                onChange={(e)=>setRemark(e.target.value)}
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
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Employee Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Departure Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Arrival Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allEmployees.length > 0 ? allEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell padding="checkbox">
                        {console.log("employee.id::::::: ", employee.empId)}
                        <Checkbox
                          size="small"
                          checked={checkedEmployees.includes(employee.empId)}
                          onChange={() => handleCheckboxChange(employee.empId)} />
                      </TableCell>
                      <TableCell>
                        {employee.name}
                      </TableCell>
                      <TableCell>
                        <TextField type="date"
                          size="small"
                          fullWidth
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                          onChange={(e) => handleDateChange(employee.empId, 'startDate', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="date"
                          size="small"
                          fullWidth
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                          onChange={(e) => handleDateChange(employee.empId, 'endDate', e.target.value)} />
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#64748b' }}>
                        No requests found
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
              onClick={() => setShowRaiseRequestModal(false)}
              sx={{ borderColor: '#e2e8f0', color: '#64748b', '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' } }}
            >
              Cancel
            </SharedButton>
            <SharedButton
              variant="contained"
              // disabled={!(country&&city&&name)}
              onClick={() => {
                // setShowRaiseRequestModal(false);
                handleSubmitRequest()
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
