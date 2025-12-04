// pages/dashboard/DashboardEmployee.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Flight,
  CloudUpload,
  Description,
  UploadFile,
  PendingActions,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { fetchDashboardData, updateRequestStatus } from '../../redux/slices/dashboardSlice';
import { logout } from '../../features/authSlice';
import BaseLayout from '../../components/layout/BaseLayout';
import {
  SharedCard,
  SharedTypography,
  StatusChip,
  LoadingSpinner,
  UserAvatar,
  Navbar,
  SharedModal,
  SharedButton
} from '../../components/shared';

// Default steps for travel workflow
const DEFAULT_STEPS = [
  { label: 'Submitted', completed: false, active: false },
  { label: 'Manager Approval', completed: false, active: false },
  { label: 'Documents Upload', completed: false, active: false },
  { label: 'Booking', completed: false, active: false },
  { label: 'Completed', completed: false, active: false }
];

// Map status number to step index
const getStepIndex = (status) => {
  switch (status) {
    case 0: return 0; // Pending
    case 1: return 1; // Submitted
    case 2: return 2; // Approved
    case 3: return 4; // Completed
    case 4: return -1; // Rejected
    default: return 0;
  }
};

const DashboardEmployee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { 
    activeRequest, 
    recentRequests = [], 
    stats = [], 
    loading 
  } = useSelector((state) => state.dashboard);

  // Modals state
  const [showDocumentsListModal, setShowDocumentsListModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [activeDoc, setActiveDoc] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (activeRequest?.documents) {
      setDocuments(activeRequest.documents);
    }
  }, [activeRequest]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  // --- Upload Logic ---
  const openUploadModal = (doc) => {
    setActiveDoc(doc);
    setShowUploadModal(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && activeDoc) {
      processFile(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && activeDoc) {
      processFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const processFile = (file) => {
    setDocuments(prev => prev.map(d =>
      d.id === activeDoc.id ? { ...d, status: 'UPLOADED', fileName: file.name } : d
    ));
    setShowUploadModal(false);
    setActiveDoc(null);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmitAll = () => {
    if (activeRequest) {
      dispatch(updateRequestStatus({
        id: activeRequest.id,
        status: 'UNDER_REVIEW',
        stepIndex: 2
      }));
    }
    setShowDocumentsListModal(false);
  };

  // ✅ Get steps with fallback
  const getSteps = () => {
    if (activeRequest?.steps) {
      return activeRequest.steps;
    }
    
    // Create steps based on current status
    const currentStepIndex = getStepIndex(activeRequest?.status || 0);
    return DEFAULT_STEPS.map((step, index) => ({
      ...step,
      completed: index < currentStepIndex,
      active: index === currentStepIndex
    }));
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
            firstName={user?.firstName || user?.name?.split(' ')[0]}
            lastName={user?.lastName || user?.name?.split(' ')[1]}
            size="large"
          />
          <Box>
            <SharedTypography variant="pageTitle">
              Welcome, {user?.name || user?.fullName || 'Employee'}!
            </SharedTypography>
            <StatusChip
              label={user?.role || 'EMPLOYEE'}
              variant="default"
            />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <SharedButton
            variant="contained"
            startIcon={<Flight />}
            onClick={() => navigate('/create-request')}
            sx={{
              bgcolor: '#b91c1c',
              '&:hover': { bgcolor: '#991b1b' }
            }}
          >
            Raise Travel Request
          </SharedButton>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {(stats || []).map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: stat.color === 'warning' ? '#fef3c7' : 
                               stat.color === 'success' ? '#d1fae5' : 
                               stat.color === 'error' ? '#fee2e2' : '#dbeafe'
                    }}>
                      {stat.iconKey === 'PendingActions' && <PendingActions color="warning" />}
                      {stat.iconKey === 'CheckCircle' && <CheckCircle color="success" />}
                      {stat.iconKey === 'Cancel' && <Cancel color="error" />}
                      {stat.iconKey === 'Flight' && <Flight color="primary" />}
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Active Application Card */}
        {activeRequest ? (
          <SharedCard variant="dashboard" sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Your Active Travel Application
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  {activeRequest.id} • {activeRequest.destination || `${activeRequest.city}, ${activeRequest.country}`}
                </Typography>
              </Box>
              <StatusChip label={activeRequest.statusLabel || activeRequest.status} />
            </Box>

            {/* Stepper - ✅ FIXED with fallback */}
            <Box sx={{ width: '100%', mb: 4 }}>
              <Stepper 
                activeStep={getStepIndex(activeRequest.status)} 
                alternativeLabel
              >
                {getSteps().map((step, index) => (
                  <Step key={step.label || index} completed={step.completed}>
                    <StepLabel>{step.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Travel Details */}
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">Destination</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {activeRequest.destination || `${activeRequest.city}, ${activeRequest.country}`}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">Departure</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {new Date(activeRequest.departureDate || activeRequest.travelStartDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">Return</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {new Date(activeRequest.returnDate || activeRequest.travelEndDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">Purpose</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {activeRequest.purpose || activeRequest.remark}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Action Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => setShowDocumentsListModal(true)}
                disabled={activeRequest.status === 3 || activeRequest.status === 4}
                sx={{
                  bgcolor: '#b91c1c',
                  '&:hover': { bgcolor: '#991b1b' },
                  px: 4,
                  py: 1.5
                }}
              >
                {activeRequest.status >= 2 ? 'View/Upload Documents' : 'Upload Required Documents'}
              </Button>
            </Box>
          </SharedCard>
        ) : (
          <SharedCard sx={{ textAlign: 'center', py: 4 }}>
            <Flight sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No active travel applications
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Click the button above to raise a new travel request
            </Typography>
          </SharedCard>
        )}

        {/* Recent Requests */}
        {recentRequests && recentRequests.length > 0 && (
          <SharedCard sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Your Travel History
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Destination</TableCell>
                  <TableCell>Dates</TableCell>
                  <TableCell>Purpose</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentRequests.map((request, index) => (
                  <TableRow key={request.id || index}>
                    <TableCell>{request.destination}</TableCell>
                    <TableCell>
                      {new Date(request.departureDate).toLocaleDateString()} - {new Date(request.returnDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{request.purpose}</TableCell>
                    <TableCell>
                      <StatusChip label={request.statusLabel} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SharedCard>
        )}
      </Box>

      {/* Documents List Modal */}
      <SharedModal
        open={showDocumentsListModal}
        onClose={() => setShowDocumentsListModal(false)}
        title={`Required Documents for ${activeRequest?.id || 'Travel Request'}`}
        maxWidth="md"
      >
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Document Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(documents || []).map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Description color="action" fontSize="small" />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>{doc.name}</Typography>
                      {doc.fileName && (
                        <Typography variant="caption" color="text.secondary">
                          {doc.fileName}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <StatusChip
                    label={doc.status}
                    color={doc.status === 'UPLOADED' ? 'success' : 'warning'}
                  />
                </TableCell>
                <TableCell align="center">
                  {doc.status === 'PENDING' ? (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CloudUpload />}
                      onClick={() => openUploadModal(doc)}
                      sx={{ textTransform: 'none' }}
                    >
                      Upload
                    </Button>
                  ) : (
                    <Button
                      variant="text"
                      size="small"
                      color="primary"
                      onClick={() => openUploadModal(doc)}
                      sx={{ textTransform: 'none' }}
                    >
                      Re-upload
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {documents.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography color="text.secondary">
                    No documents required yet
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmitAll}
            disabled={documents.length === 0 || documents.some(d => d.status === 'PENDING')}
            sx={{ px: 4 }}
          >
            Submit All Documents
          </Button>
        </Box>
      </SharedModal>

      {/* Upload Modal */}
      <SharedModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title={activeDoc ? `Upload ${activeDoc.name}` : 'Upload Document'}
        maxWidth="sm"
      >
        <Box
          sx={{
            border: '2px dashed #cbd5e1',
            borderRadius: 2,
            p: 6,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: '#f8fafc',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: '#b91c1c',
              bgcolor: '#fef2f2'
            }
          }}
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />

          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ p: 2, bgcolor: '#fee2e2', borderRadius: '50%', color: '#b91c1c' }}>
              <UploadFile fontSize="large" />
            </Box>
          </Box>
          
          <Typography variant="h6" sx={{ mb: 1, color: '#1e293b' }}>
            Click or Drag file to upload
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supported formats: PDF, JPG, PNG (Max 5MB)
          </Typography>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={() => setShowUploadModal(false)}
            sx={{ color: '#64748b' }}
          >
            Cancel
          </Button>
        </Box>
      </SharedModal>
    </BaseLayout>
  );
};

export default DashboardEmployee;