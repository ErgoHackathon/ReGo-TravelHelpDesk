// pages/dashboard/DashboardEmployee.jsx
import React, { useEffect, useState, useCallback } from 'react';
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
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Flight,
  CloudUpload,
  Description,
  UploadFile,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { fetchDashboardData, updateRequestStatus } from '../../redux/slices/dashboardSlice';
import { logout } from '../../features/authSlice';
import documentService from '../../services/documentService';
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
  { label: 'Submitted', completed: false },
  { label: 'Manager Approval', completed: false },
  { label: 'Documents Upload', completed: false },
  { label: 'Booking', completed: false },
  { label: 'Completed', completed: false }
];

// Map status number to step index
const getStepIndex = (status) => {
  switch (status) {
    case 0: return 0;
    case 1: return 1;
    case 2: return 2;
    case 3: return 4;
    case 4: return -1;
    default: return 0;
  }
};

const DashboardEmployee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { activeRequest, recentRequests = [], loading } = useSelector((state) => state.dashboard);

  // State
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch dashboard data
  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Fetch document types when modal opens
  useEffect(() => {
    if (showDocumentsModal) {
      fetchDocumentTypes();
    }
  }, [showDocumentsModal]);

  const fetchDocumentTypes = async () => {
    setLoadingDocs(true);
    try {
      const types = await documentService.getAllDocumentTypes();
      setDocumentTypes(types);
      console.log('📋 Document types loaded:', types);
    } catch (error) {
      console.error('❌ Error fetching document types:', error);
      showSnackbarMessage('Failed to load document types', 'error');
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  const showSnackbarMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Open upload modal for a document
  const openUploadModal = (doc) => {
    setSelectedDoc(doc);
    setShowUploadModal(true);
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!selectedDoc || !user?.empId) {
      showSnackbarMessage('Missing document or user information', 'error');
      return;
    }

    // Validate file
    const validation = documentService.validateFile(file);
    if (!validation.valid) {
      showSnackbarMessage(validation.error, 'error');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const isUpdate = !!uploadedDocuments[selectedDoc.id];

      await documentService.uploadDocument(
        user.empId,
        selectedDoc.id,
        file,
        isUpdate
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Update local state
      setUploadedDocuments(prev => ({
        ...prev,
        [selectedDoc.id]: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadedAt: new Date().toISOString()
        }
      }));

      showSnackbarMessage(`${selectedDoc.name} uploaded successfully!`, 'success');

      // Close modal after short delay
      setTimeout(() => {
        setShowUploadModal(false);
        setSelectedDoc(null);
        setUploadProgress(0);
      }, 500);

    } catch (error) {
      console.error('❌ Upload error:', error);
      showSnackbarMessage(error.message || 'Failed to upload document', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      showSnackbarMessage(error.message, 'error');
      return;
    }

    if (acceptedFiles.length > 0) {
      handleFileUpload(acceptedFiles[0]);
    }
  }, [selectedDoc, user?.empId, uploadedDocuments]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    disabled: uploading
  });

  // Get steps with current status
  const getSteps = () => {
    const currentStepIndex = getStepIndex(activeRequest?.status || 0);
    return DEFAULT_STEPS.map((step, index) => ({
      ...step,
      completed: index < currentStepIndex,
      active: index === currentStepIndex
    }));
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Get upload stats
  const getUploadStats = () => {
    const uploaded = Object.keys(uploadedDocuments).length;
    const total = documentTypes.length;
    return { uploaded, total, percentage: total > 0 ? (uploaded / total) * 100 : 0 };
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const uploadStats = getUploadStats();

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
            <StatusChip label={user?.role || 'EMPLOYEE'} variant="default" />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <SharedButton
            variant="contained"
            startIcon={<Flight />}
            onClick={() => navigate('/create-request')}
            sx={{ bgcolor: '#b91c1c', '&:hover': { bgcolor: '#991b1b' } }}
          >
            Raise Travel Request
          </SharedButton>
        </Box>

        {/* Active Application Card */}
        {activeRequest ? (
          <SharedCard variant="dashboard" sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Your Active Travel Application
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  {activeRequest.destination || `${activeRequest.city}, ${activeRequest.country}`}
                </Typography>
              </Box>
              <StatusChip label={activeRequest.statusLabel || 'Pending'} />
            </Box>

            {/* Stepper */}
            <Box sx={{ width: '100%', mb: 4 }}>
              <Stepper activeStep={getStepIndex(activeRequest.status)} alternativeLabel>
                {getSteps().map((step, index) => (
                  <Step key={index} completed={step.completed}>
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
                onClick={() => setShowDocumentsModal(true)}
                sx={{ bgcolor: '#b91c1c', '&:hover': { bgcolor: '#991b1b' }, px: 4, py: 1.5 }}
              >
                Upload Documents
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

        {/* Travel History */}
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
                    <TableCell><StatusChip label={request.statusLabel} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SharedCard>
        )}
      </Box>

      {/* ============================================ */}
      {/* DOCUMENTS LIST MODAL */}
      {/* ============================================ */}
      {/* ============================================ */}
{/* DOCUMENTS LIST MODAL - MODERN DESIGN */}
{/* ============================================ */}
<SharedModal
  open={showDocumentsModal}
  onClose={() => setShowDocumentsModal(false)}
  title="Upload Required Documents"
  maxWidth="md"
  fullWidth
>
  {loadingDocs ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <CircularProgress />
    </Box>
  ) : (
    <Box sx={{ width: '100%' }}>
      {/* Header Card with Progress */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #b91c1c 0%, #764ba2 100%)',
          borderRadius: 3,
          p: 3,
          mb: 3,
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CloudUpload sx={{ fontSize: 28 }} />
            <Typography variant="h6" fontWeight={600}>
              Document Upload Center
            </Typography>
          </Box>
          <Chip
            label={`${uploadStats.uploaded}/${uploadStats.total} Completed`}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 600,
              '& .MuiChip-label': { px: 2 }
            }}
          />
        </Box>
        
        <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
          Please upload all required documents. Supported formats: PNG, JPG, PDF (Max 5MB)
        </Typography>
        
        {/* Progress Bar */}
        <Box sx={{ position: 'relative' }}>
          <LinearProgress
            variant="determinate"
            value={uploadStats.percentage}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                bgcolor: '#4ade80',
              }
            }}
          />
          <Typography 
            variant="caption" 
            sx={{ 
              position: 'absolute', 
              right: 0, 
              top: 14,
              opacity: 0.9 
            }}
          >
            {Math.round(uploadStats.percentage)}% Complete
          </Typography>
        </Box>
      </Box>

      {/* Documents Grid */}
      <Box sx={{ 
        maxHeight: '50vh', 
        overflowY: 'auto',
        pr: 1,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f5f9',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#cbd5e1',
          borderRadius: '3px',
          '&:hover': {
            background: '#94a3b8',
          }
        },
      }}>
        <Grid container spacing={2}>
          {documentTypes.map((doc, index) => {
            const uploaded = uploadedDocuments[doc.id];
            
            return (
              <Grid item xs={12} key={doc.id}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: uploaded ? '#bbf7d0' : '#e2e8f0',
                    bgcolor: uploaded ? '#f0fdf4' : '#fafafa',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: uploaded ? '#86efac' : '#b91c1c',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  {/* Document Icon */}
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: uploaded ? '#dcfce7' : '#fee2e2',
                      color: uploaded ? '#16a34a' : '#b91c1c',
                      flexShrink: 0,
                    }}
                  >
                    {uploaded ? (
                      <CheckCircle sx={{ fontSize: 28 }} />
                    ) : (
                      <Description sx={{ fontSize: 28 }} />
                    )}
                  </Box>

                  {/* Document Info */}
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography 
                        variant="subtitle1" 
                        fontWeight={600}
                        sx={{ 
                          color: '#1e293b',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {doc.name}
                      </Typography>
                      <Chip
                        size="small"
                        label={uploaded ? 'UPLOADED' : 'PENDING'}
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          bgcolor: uploaded ? '#dcfce7' : '#fef3c7',
                          color: uploaded ? '#16a34a' : '#d97706',
                          border: 'none',
                        }}
                      />
                    </Box>
                    
                    {uploaded ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          📄 {uploaded.fileName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          •
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {formatFileSize(uploaded.fileSize)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          •
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#16a34a' }}>
                          ✓ {new Date(uploaded.uploadedAt).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        No file uploaded yet • Click to upload
                      </Typography>
                    )}
                  </Box>

                  {/* Upload Button */}
                  <Button
                    variant={uploaded ? 'outlined' : 'contained'}
                    size="small"
                    onClick={() => openUploadModal(doc)}
                    startIcon={uploaded ? <UploadFile /> : <CloudUpload />}
                    sx={{
                      minWidth: 110,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      flexShrink: 0,
                      ...(uploaded ? {
                        borderColor: '#16a34a',
                        color: '#16a34a',
                        '&:hover': {
                          borderColor: '#15803d',
                          bgcolor: '#f0fdf4',
                        }
                      } : {
                        bgcolor: '#b91c1c',
                        '&:hover': {
                          bgcolor: '#991b1b',
                        }
                      })
                    }}
                  >
                    {uploaded ? 'Replace' : 'Upload'}
                  </Button>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Footer Actions */}
      <Box 
        sx={{ 
          mt: 3, 
          pt: 3,
          borderTop: '1px solid #e2e8f0',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Button 
          onClick={() => setShowDocumentsModal(false)} 
          sx={{ 
            color: '#64748b',
            '&:hover': { bgcolor: '#f1f5f9' }
          }}
        >
          Cancel
        </Button>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              // Save draft functionality
              showSnackbarMessage('Progress saved!', 'info');
            }}
            sx={{ 
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': { 
                borderColor: '#cbd5e1',
                bgcolor: '#f8fafc'
              }
            }}
          >
            Save Draft
          </Button>
          
          <Button
            variant="contained"
            disabled={uploadStats.uploaded === 0}
            onClick={() => {
              showSnackbarMessage('Documents submitted successfully!', 'success');
              setShowDocumentsModal(false);
            }}
            startIcon={<CheckCircle />}
            sx={{
              bgcolor: uploadStats.uploaded === uploadStats.total ? '#16a34a' : '#3b82f6',
              '&:hover': {
                bgcolor: uploadStats.uploaded === uploadStats.total ? '#15803d' : '#2563eb',
              },
              '&.Mui-disabled': {
                bgcolor: '#e2e8f0',
                color: '#94a3b8'
              }
            }}
          >
            {uploadStats.uploaded === uploadStats.total 
              ? 'Submit All Documents' 
              : `Submit (${uploadStats.uploaded}/${uploadStats.total})`
            }
          </Button>
        </Box>
      </Box>
    </Box>
  )}
</SharedModal>

      {/* ============================================ */}
      {/* FILE UPLOAD MODAL (Drag & Drop) */}
      {/* ============================================ */}
      <SharedModal
        open={showUploadModal}
        onClose={() => !uploading && setShowUploadModal(false)}
        title={selectedDoc ? `Upload ${selectedDoc.name}` : 'Upload Document'}
        maxWidth="sm"
      >
        {/* Drag & Drop Zone */}
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? '#b91c1c' : uploading ? '#94a3b8' : '#cbd5e1',
            borderRadius: 2,
            p: 6,
            textAlign: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            bgcolor: isDragActive ? '#fef2f2' : '#f8fafc',
            transition: 'all 0.2s',
            opacity: uploading ? 0.7 : 1,
            '&:hover': !uploading ? {
              borderColor: '#b91c1c',
              bgcolor: '#fef2f2'
            } : {}
          }}
        >
          <input {...getInputProps()} />

          {uploading ? (
            <Box>
              <CircularProgress size={48} sx={{ mb: 2, color: '#b91c1c' }} />
              <Typography variant="h6" color="text.secondary">
                Uploading... {uploadProgress}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
              />
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{
                  p: 2,
                  bgcolor: isDragActive ? '#b91c1c' : '#fee2e2',
                  borderRadius: '50%',
                  color: isDragActive ? 'white' : '#b91c1c',
                  transition: 'all 0.2s'
                }}>
                  <UploadFile fontSize="large" />
                </Box>
              </Box>

              <Typography variant="h6" sx={{ mb: 1, color: '#1e293b' }}>
                {isDragActive ? 'Drop the file here!' : 'Drag & drop or click to upload'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supported: PNG, JPG, PDF (Max 5MB)
              </Typography>
            </>
          )}
        </Box>

        {/* Cancel Button */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={() => setShowUploadModal(false)}
            disabled={uploading}
            sx={{ color: '#64748b' }}
          >
            Cancel
          </Button>
        </Box>
      </SharedModal>

      {/* ============================================ */}
      {/* SNACKBAR NOTIFICATIONS */}
      {/* ============================================ */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </BaseLayout>
  );
};

export default DashboardEmployee;