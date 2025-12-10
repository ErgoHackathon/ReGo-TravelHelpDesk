// pages/dashboard/DashboardEmployee.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  LinearProgress,
  IconButton,
  Tooltip,
  Skeleton
} from '@mui/material';
import {
  Flight,
  CloudUpload,
  Description,
  UploadFile,
  CheckCircle,
  Error as ErrorIcon,
  Visibility,
  Download,
  Delete,
  Refresh,
  PictureAsPdf,
  Image as ImageIcon
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

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      when: "beforeChildren",
      staggerChildren: 0.08
    }
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } }
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

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const staggerItem = {
  initial: { opacity: 0, x: -12 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }
  }
};

const documentCardVariants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      delay: index * 0.04,
      ease: [0, 0, 0.2, 1]
    }
  }),
  hover: {
    y: -2,
    boxShadow: "0 8px 20px -4px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2 }
  }
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } }
};

const uploadZoneVariants = {
  initial: { borderColor: "#cbd5e1", backgroundColor: "#f8fafc" },
  hover: { 
    borderColor: "#b91c1c", 
    backgroundColor: "rgba(185, 28, 28, 0.03)",
    transition: { duration: 0.2 }
  },
  active: { 
    borderColor: "#b91c1c", 
    backgroundColor: "rgba(185, 28, 28, 0.08)",
    scale: 1.01,
    transition: { duration: 0.2 }
  }
};

const progressVariants = {
  initial: { width: 0 },
  animate: (value) => ({
    width: `${value}%`,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] }
  })
};

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
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch dashboard data
  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Fetch document types and uploaded documents when modal opens
  useEffect(() => {
    if (showDocumentsModal && user?.empId) {
      fetchDocumentsData();
    }
  }, [showDocumentsModal, user?.empId]);

  // Fetch both document types and uploaded documents
  const fetchDocumentsData = async () => {
    setLoadingDocs(true);
    try {
      // Fetch document types
      const types = await documentService.getAllDocumentTypes();
      setDocumentTypes(types);
      console.log('📋 Document types loaded:', types);

      // Fetch uploaded documents if the method exists
      if (documentService.getEmployeeUploadedDocuments) {
        try {
          const uploadedMap = await documentService.getEmployeeUploadedDocuments(user.empId);
          if (uploadedMap && typeof uploadedMap === 'object') {
            setUploadedDocuments(uploadedMap);
            console.log('📋 Uploaded documents loaded:', uploadedMap);
          }
        } catch (err) {
          console.log('📋 No uploaded documents found or API not available');
        }
      }
    } catch (error) {
      console.error('❌ Error fetching documents data:', error);
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

  // View document
  // View document - UPDATED
const handleViewDocument = async (doc) => {
  const uploaded = uploadedDocuments[doc.id];
  if (!uploaded) return;

  setLoadingPreview(true);
  try {
    // Check if we already have the base64 cached
    if (uploaded.base64String) {
      setPreviewData({
        fileName: uploaded.fileName,
        fileType: uploaded.fileType,
        base64: uploaded.base64String,
      });
      setShowPreviewModal(true);
      setLoadingPreview(false);
      return;
    }

    showSnackbarMessage('Loading document...', 'info');
    
    // Fetch document with content from API
    const fileData = await documentService.getDocumentWithContent(user.empId, doc.id);
    
    if (fileData && fileData.base64String) {
      // Cache the base64 in local state
      setUploadedDocuments(prev => ({
        ...prev,
        [doc.id]: { 
          ...prev[doc.id], 
          base64String: fileData.base64String,
          fileType: fileData.fileType || prev[doc.id]?.fileType
        }
      }));
      
      setPreviewData({
        fileName: uploaded.fileName || fileData.fileName,
        fileType: fileData.fileType || uploaded.fileType,
        base64: fileData.base64String,
      });
      setShowPreviewModal(true);
    } else {
      showSnackbarMessage('Document preview not available', 'warning');
    }
  } catch (error) {
    console.error('Error viewing document:', error);
    showSnackbarMessage('Failed to load document', 'error');
  } finally {
    setLoadingPreview(false);
  }
};
  // Delete document
const handleDeleteDocument = async (doc) => {
  if (!window.confirm(`Are you sure you want to delete "${doc.name}"?`)) return;

  try {
    showSnackbarMessage('Deleting document...', 'info');
    
    // Call the delete API
    await documentService.deleteDocument(user.empId, doc.id);
    
    // Remove from local state
    setUploadedDocuments(prev => {
      const newState = { ...prev };
      delete newState[doc.id];
      return newState;
    });

    showSnackbarMessage(`${doc.name} deleted successfully!`, 'success');
  } catch (error) {
    console.error('Error deleting document:', error);
    showSnackbarMessage(error.message || 'Failed to delete document', 'error');
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
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get file icon
  const getFileIcon = (fileType) => {
    if (!fileType) return <Description sx={{ fontSize: 28, color: '#b91c1c' }} />;
    if (fileType.includes('pdf')) return <PictureAsPdf sx={{ fontSize: 28, color: '#ef4444' }} />;
    if (fileType.includes('image')) return <ImageIcon sx={{ fontSize: 28, color: '#3b82f6' }} />;
    return <Description sx={{ fontSize: 28, color: '#64748b' }} />;
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

      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <motion.div variants={staggerItem}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <UserAvatar
                  firstName={user?.firstName || user?.name?.split(' ')[0]}
                  lastName={user?.lastName || user?.name?.split(' ')[1]}
                  size="large"
                />
              </motion.div>
              <Box>
                <SharedTypography variant="pageTitle">
                  Welcome, {user?.name || user?.fullName || 'Employee'}!
                </SharedTypography>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <StatusChip label={user?.role || 'EMPLOYEE'} variant="default" />
                </motion.div>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <SharedButton
                  variant="contained"
                  startIcon={<Flight />}
                  onClick={() => navigate('/create-request')}
                  sx={{ bgcolor: '#b91c1c', '&:hover': { bgcolor: '#991b1b' } }}
                >
                  Raise Travel Request
                </SharedButton>
              </motion.div>
            </Box>
          </motion.div>

          {/* Active Application Card */}
          <AnimatePresence mode="wait">
            {activeRequest ? (
              <motion.div
                key="active-request"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
              >
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
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.2 }}
                    >
                      <StatusChip label={activeRequest.statusLabel || 'Pending'} />
                    </motion.div>
                  </Box>

                  {/* Stepper */}
                  <Box sx={{ width: '100%', mb: 4 }}>
                    <Stepper activeStep={getStepIndex(activeRequest.status)} alternativeLabel>
                      {getSteps().map((step, index) => (
                        <Step key={index} completed={step.completed}>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <StepLabel>{step.label}</StepLabel>
                          </motion.div>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>

                  {/* Travel Details */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
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
                  </motion.div>

                  {/* Action Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {console.log("rrecentRequests::::::: ", recentRequests)}
                      <Button
                        disabled={recentRequests[0]?.status<13}
                        variant="contained"
                        startIcon={<CloudUpload />}
                        onClick={() => setShowDocumentsModal(true)}
                        sx={{ bgcolor: '#b91c1c', '&:hover': { bgcolor: '#991b1b' }, px: 4, py: 1.5 }}
                      >
                        Upload Documents
                      </Button>
                    </motion.div>
                  </Box>
                </SharedCard>
              </motion.div>
            ) : (
              <motion.div
                key="no-request"
                variants={cardVariants}
                initial="initial"
                animate="animate"
              >
                <SharedCard sx={{ textAlign: 'center', py: 4 }}>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Flight sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                  </motion.div>
                  <Typography variant="h6" color="text.secondary">
                    No active travel applications
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Click the button above to raise a new travel request
                  </Typography>
                </SharedCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Travel History */}
          <AnimatePresence>
            {recentRequests && recentRequests.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <SharedCard variant="dashboard" sx={{ mt: 4 }}>
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
                        <motion.tr
                          key={request.id || index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          style={{ display: 'table-row' }}
                        >
                          <TableCell>{request.destination}</TableCell>
                          <TableCell>
                            {new Date(request.departureDate).toLocaleDateString()} - {new Date(request.returnDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{request.purpose}</TableCell>
                          <TableCell><StatusChip label={request.statusLabel} /></TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </SharedCard>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </motion.div>

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
        <AnimatePresence mode="wait">
          {loadingDocs ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box sx={{ p: 2 }}>
                <Skeleton variant="rounded" height={120} sx={{ mb: 3, borderRadius: 3 }} />
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} variant="rounded" height={70} sx={{ mb: 2, borderRadius: 2 }} />
                ))}
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box sx={{ width: '100%' }}>
                {/* Header Card with Progress */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 50%, #7f1d1d 100%)',
                      borderRadius: 3,
                      p: 3,
                      mb: 3,
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Subtle pattern overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '40%',
                        height: '100%',
                        background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
                        pointerEvents: 'none'
                      }}
                    />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, position: 'relative' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <CloudUpload sx={{ fontSize: 28 }} />
                        </motion.div>
                        <Typography variant="h6" fontWeight={600}>
                          Document Upload Center
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                        >
                          <Chip
                            label={`${uploadStats.uploaded}/${uploadStats.total} Completed`}
                            sx={{
                              bgcolor: uploadStats.uploaded === uploadStats.total ? '#4ade80' : 'rgba(255,255,255,0.2)',
                              color: uploadStats.uploaded === uploadStats.total ? '#166534' : 'white',
                              fontWeight: 600,
                              '& .MuiChip-label': { px: 2 }
                            }}
                          />
                        </motion.div>
                        <Tooltip title="Refresh documents">
                          <IconButton
                            size="small"
                            onClick={fetchDocumentsData}
                            sx={{ 
                              color: 'white', 
                              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                            }}
                          >
                            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                              <Refresh />
                            </motion.div>
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                      Please upload all required documents. Supported formats: PNG, JPG, PDF (Max 5MB)
                    </Typography>
                    
                    {/* Animated Progress Bar */}
                    <Box sx={{ position: 'relative' }}>
                      <Box sx={{ 
                        height: 10, 
                        borderRadius: 5, 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        overflow: 'hidden'
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadStats.percentage}%` }}
                          transition={{ duration: 0.8, ease: [0, 0, 0.2, 1] }}
                          style={{
                            height: '100%',
                            borderRadius: 5,
                            background: uploadStats.uploaded === uploadStats.total 
                              ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                              : 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                          }}
                        />
                      </Box>
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
                </motion.div>

                {/* Documents Grid */}
                <Box sx={{ 
                  maxHeight: '50vh', 
                  overflowY: 'auto',
                  pr: 1,
                  '&::-webkit-scrollbar': { width: '6px' },
                  '&::-webkit-scrollbar-track': { background: '#f1f5f9', borderRadius: '3px' },
                  '&::-webkit-scrollbar-thumb': { 
                    background: '#cbd5e1', 
                    borderRadius: '3px',
                    '&:hover': { background: '#94a3b8' }
                  },
                }}>
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {documentTypes.map((doc, index) => {
                      const uploaded = uploadedDocuments[doc.id];
                      const isUploaded = !!uploaded;
                      
                      return (
                        <motion.div
                          key={doc.id}
                          variants={documentCardVariants}
                          custom={index}
                          whileHover="hover"
                          style={{ marginBottom: 12 }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              p: 2,
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: isUploaded ? '#86efac' : '#e2e8f0',
                              bgcolor: isUploaded ? '#f0fdf4' : '#fafafa',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {/* Document Icon */}
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: index * 0.03 + 0.1 }}
                            >
                              <Box
                                sx={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 2,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  bgcolor: isUploaded ? '#dcfce7' : '#fee2e2',
                                  flexShrink: 0,
                                }}
                              >
                                {isUploaded ? (
                                  getFileIcon(uploaded.fileType)
                                ) : (
                                  <Description sx={{ fontSize: 28, color: '#b91c1c' }} />
                                )}
                              </Box>
                            </motion.div>

                            {/* Document Info */}
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                                <Typography 
                                  variant="subtitle1" 
                                  fontWeight={600}
                                  sx={{ color: '#1e293b' }}
                                >
                                  {doc.name}
                                </Typography>
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 25, delay: index * 0.03 + 0.15 }}
                                >
                                  <Chip
                                    size="small"
                                    icon={isUploaded ? <CheckCircle sx={{ fontSize: 14 }} /> : <ErrorIcon sx={{ fontSize: 14 }} />}
                                    label={isUploaded ? 'UPLOADED' : 'PENDING'}
                                    sx={{
                                      height: 22,
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      bgcolor: isUploaded ? '#dcfce7' : '#fef3c7',
                                      color: isUploaded ? '#16a34a' : '#d97706',
                                      '& .MuiChip-icon': {
                                        color: isUploaded ? '#16a34a' : '#d97706',
                                      }
                                    }}
                                  />
                                </motion.div>
                              </Box>
                              
                              {isUploaded ? (
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.03 + 0.2 }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                    <Typography 
                                      variant="caption" 
                                      sx={{ 
                                        color: '#64748b',
                                        maxWidth: 200,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                      }}
                                    >
                                      📄 {uploaded.fileName}
                                    </Typography>
                                    {uploaded.fileSize && (
                                      <>
                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>•</Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                          {formatFileSize(uploaded.fileSize)}
                                        </Typography>
                                      </>
                                    )}
                                    {uploaded.uploadedAt && (
                                      <>
                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>•</Typography>
                                        <Typography variant="caption" sx={{ color: '#16a34a' }}>
                                          ✓ {formatDate(uploaded.uploadedAt)}
                                        </Typography>
                                      </>
                                    )}
                                  </Box>
                                </motion.div>
                              ) : (
                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                  No file uploaded yet • Click to upload
                                </Typography>
                              )}
                            </Box>

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                              {isUploaded && (
                                <>
                                  <Tooltip title="View document">
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                      <IconButton
                                        size="small"
                                        onClick={() => handleViewDocument(doc)}
                                        disabled={loadingPreview}
                                        sx={{ color: '#3b82f6', '&:hover': { bgcolor: '#eff6ff' } }}
                                      >
                                        <Visibility fontSize="small" />
                                      </IconButton>
                                    </motion.div>
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                      <IconButton
                                        size="small"
                                        onClick={() => handleDeleteDocument(doc)}
                                        sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}
                                      >
                                        <Delete fontSize="small" />
                                      </IconButton>
                                    </motion.div>
                                  </Tooltip>
                                </>
                              )}
                              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                  variant={isUploaded ? 'outlined' : 'contained'}
                                  size="small"
                                  onClick={() => openUploadModal(doc)}
                                  startIcon={isUploaded ? <UploadFile /> : <CloudUpload />}
                                  sx={{
                                    ml: 1,
                                    minWidth: 100,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    ...(isUploaded ? {
                                      borderColor: '#16a34a',
                                      color: '#16a34a',
                                      '&:hover': { borderColor: '#15803d', bgcolor: '#f0fdf4' }
                                    } : {
                                      bgcolor: '#b91c1c',
                                      '&:hover': { bgcolor: '#991b1b' }
                                    })
                                  }}
                                >
                                  {isUploaded ? 'Replace' : 'Upload'}
                                </Button>
                              </motion.div>
                            </Box>
                          </Box>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </Box>

                {/* Footer Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
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
                      sx={{ color: '#64748b', '&:hover': { bgcolor: '#f1f5f9' } }}
                    >
                      Cancel
                    </Button>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outlined"
                          onClick={() => showSnackbarMessage('Progress saved!', 'info')}
                          sx={{ 
                            borderColor: '#e2e8f0',
                            color: '#64748b',
                            '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' }
                          }}
                        >
                          Save Draft
                        </Button>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
                            '&.Mui-disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' }
                          }}
                        >
                          {uploadStats.uploaded === uploadStats.total 
                            ? 'Submit All Documents' 
                            : `Submit (${uploadStats.uploaded}/${uploadStats.total})`
                          }
                        </Button>
                      </motion.div>
                    </Box>
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            {...getRootProps()}
            component={motion.div}
            animate={isDragActive ? "active" : "initial"}
            whileHover={!uploading ? "hover" : undefined}
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
            }}
          >
            <input {...getInputProps()} />

            <AnimatePresence mode="wait">
              {uploading ? (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Box>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    >
                      <CircularProgress size={48} sx={{ mb: 2, color: '#b91c1c' }} />
                    </motion.div>
                    <Typography variant="h6" color="text.secondary">
                      Uploading... {uploadProgress}%
                    </Typography>
                    <Box sx={{ mt: 2, position: 'relative', height: 8, borderRadius: 4, bgcolor: '#e2e8f0', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        style={{
                          height: '100%',
                          borderRadius: 4,
                          background: 'linear-gradient(90deg, #b91c1c, #ef4444)'
                        }}
                      />
                    </Box>
                  </Box>
                </motion.div>
              ) : (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <motion.div
                      animate={isDragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Box sx={{
                        p: 2,
                        bgcolor: isDragActive ? '#b91c1c' : '#fee2e2',
                        borderRadius: '50%',
                        color: isDragActive ? 'white' : '#b91c1c',
                        transition: 'all 0.2s'
                      }}>
                        <UploadFile fontSize="large" />
                      </Box>
                    </motion.div>
                  </Box>

                  <Typography variant="h6" sx={{ mb: 1, color: '#1e293b' }}>
                    {isDragActive ? 'Drop the file here!' : 'Drag & drop or click to upload'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supported: PNG, JPG, PDF (Max 5MB)
                  </Typography>

                  {uploadedDocuments[selectedDoc?.id] && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Alert severity="info" sx={{ mt: 2, textAlign: 'left' }}>
                        This will replace: <strong>{uploadedDocuments[selectedDoc.id].fileName}</strong>
                      </Alert>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </motion.div>

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
      {/* DOCUMENT PREVIEW MODAL */}
      {/* ============================================ */}
      <SharedModal
        open={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setPreviewData(null);
        }}
        title={`Preview: ${previewData?.fileName || 'Document'}`}
        maxWidth="md"
      >
        <AnimatePresence>
          {previewData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Box sx={{ textAlign: 'center' }}>
                {previewData.fileType?.includes('pdf') ? (
                  <Box sx={{ height: '60vh', minHeight: 400 }}>
                    <iframe
                      src={`data:application/pdf;base64,${previewData.base64}`}
                      width="100%"
                      height="100%"
                      style={{ border: 'none', borderRadius: 8 }}
                      title={previewData.fileName}
                    />
                  </Box>
                ) : (
                  <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src={`data:${previewData.fileType};base64,${previewData.base64}`}
                      alt={previewData.fileName}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '55vh',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    />
                  </Box>
                )}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setShowPreviewModal(false);
                      setPreviewData(null);
                    }}
                  >
                    Close
                  </Button>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = `data:${previewData.fileType};base64,${previewData.base64}`;
                        link.download = previewData.fileName;
                        link.click();
                      }}
                      sx={{ bgcolor: '#3b82f6' }}
                    >
                      Download
                    </Button>
                  </motion.div>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
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
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
        >
          <Alert
            onClose={closeSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </motion.div>
      </Snackbar>
    </BaseLayout>
  );
};

export default DashboardEmployee;