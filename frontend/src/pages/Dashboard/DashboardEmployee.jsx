// pages/dashboard/DashboardEmployee.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
  Skeleton,
  TextField,
  Divider,
  Card,
  CardContent
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
  Image as ImageIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { 
  fetchDashboardData, 
  updateRequestStatus,
  submitDocumentsThunk 
} from '../../redux/slices/dashboardSlice';
import { logout } from '../../features/authSlice';
import documentService from '../../services/documentService';
import { 
  statusToChip, 
  getStatusLabel, 
  canUploadDocuments,
  getStepperConfig,
  STATUS_CODES
} from '../../utils/statusMapper';
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

// ==========================================
// CONSTANTS
// ==========================================

// Documents that are OPTIONAL (not required)
const OPTIONAL_DOCUMENT_NAMES = ['visa'];
const OPTIONAL_DOCUMENT_IDS = [1]; 

// Document ID for Passport (for OCR)
const PASSPORT_DOCUMENT_ID = 1; // Adjust based on your backend

// ==========================================
// ANIMATION VARIANTS
// ==========================================
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

// ==========================================
// OCR DATA CARD COMPONENT
// ==========================================
const PassportOCRCard = ({ 
  ocrData, 
  isEditing, 
  editedData, 
  onEdit, 
  onSave, 
  onCancel, 
  onChange,
  isVerified,
  onVerify
}) => {
  if (!ocrData) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const fields = [
    { key: 'fullName', label: 'Full Name', value: ocrData.fullName },
    { key: 'passportNumber', label: 'Passport Number', value: ocrData.passportNumber },
    { key: 'nationality', label: 'Nationality', value: ocrData.nationality },
    { key: 'dateOfBirth', label: 'Date of Birth', value: formatDate(ocrData.dateOfBirth), type: 'date' },
    { key: 'sex', label: 'Gender', value: ocrData.sex === 'M' ? 'Male' : 'Female' },
    { key: 'expiryDate', label: 'Expiry Date', value: formatDate(ocrData.expiryDate), type: 'date' },
    { key: 'issuer', label: 'Issuing Country', value: ocrData.issuer },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card 
        sx={{ 
          mt: 2, 
          border: isVerified ? '2px solid #22c55e' : '2px solid #f59e0b',
          borderRadius: 2,
          bgcolor: isVerified ? '#f0fdf4' : '#fffbeb'
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isVerified ? (
                <VerifiedIcon sx={{ color: '#22c55e' }} />
              ) : (
                <WarningIcon sx={{ color: '#f59e0b' }} />
              )}
              <Typography variant="h6" fontWeight={600}>
                Passport OCR Data
              </Typography>
              <Chip
                size="small"
                label={isVerified ? 'Verified' : 'Pending Verification'}
                sx={{
                  bgcolor: isVerified ? '#dcfce7' : '#fef3c7',
                  color: isVerified ? '#16a34a' : '#d97706',
                  fontWeight: 600
                }}
              />
            </Box>
            
            {!isVerified && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {isEditing ? (
                  <>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={onSave}
                      sx={{ bgcolor: '#22c55e', '&:hover': { bgcolor: '#16a34a' } }}
                    >
                      Save
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={onEdit}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<VerifiedIcon />}
                      onClick={onVerify}
                      sx={{ bgcolor: '#22c55e', '&:hover': { bgcolor: '#16a34a' } }}
                    >
                      Verify & Confirm
                    </Button>
                  </>
                )}
              </Box>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            {fields.map((field) => (
              <Grid item xs={12} sm={6} md={4} key={field.key}>
                {isEditing && !isVerified ? (
                  <TextField
                    fullWidth
                    size="small"
                    label={field.label}
                    value={editedData[field.key] || ''}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    type={field.type === 'date' ? 'date' : 'text'}
                    InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
                  />
                ) : (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {field.label}
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {field.value || '-'}
                    </Typography>
                  </Box>
                )}
              </Grid>
            ))}
          </Grid>

          {ocrData.compositeCheck !== undefined && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                size="small"
                icon={ocrData.compositeCheck ? <CheckCircle /> : <ErrorIcon />}
                label={ocrData.compositeCheck ? 'MRZ Check: Passed' : 'MRZ Check: Failed'}
                sx={{
                  bgcolor: ocrData.compositeCheck ? '#dcfce7' : '#fee2e2',
                  color: ocrData.compositeCheck ? '#16a34a' : '#dc2626',
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================
const DashboardEmployee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { 
    activeRequest, 
    recentRequests = [], 
    loading,
    submittingDocuments 
  } = useSelector((state) => state.dashboard);

  // ==========================================
  // STATE
  // ==========================================
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // OCR State
  const [passportOCRData, setPassportOCRData] = useState(null);
  const [loadingOCR, setLoadingOCR] = useState(false);
  const [isEditingOCR, setIsEditingOCR] = useState(false);
  const [editedOCRData, setEditedOCRData] = useState({});
  const [isOCRVerified, setIsOCRVerified] = useState(false);

  // ==========================================
  // COMPUTED VALUES
  // ==========================================
  
  const currentStatus = useMemo(() => {
    return activeRequest?.status || 
           activeRequest?.statusId || 
           recentRequests[0]?.status || 
           recentRequests[0]?.statusId || 
           0;
  }, [activeRequest, recentRequests]);

  const canUpload = useMemo(() => {
    return canUploadDocuments(currentStatus);
  }, [currentStatus]);

  const stepperConfig = useMemo(() => {
    return getStepperConfig(currentStatus);
  }, [currentStatus]);

  // Check if all required documents are uploaded (9 required, Visa is optional)
  const allRequiredUploaded = useMemo(() => {
    if (!documentTypes || documentTypes.length === 0) return false;
    
    // Filter only required documents
    const requiredDocs = documentTypes.filter(d => d.required === true);
    
    console.log('📋 Required docs:', requiredDocs.map(d => d.name));
    console.log('📋 Uploaded:', Object.keys(uploadedDocuments));
    
    if (requiredDocs.length === 0) {
      return Object.keys(uploadedDocuments).length > 0;
    }
    
    return requiredDocs.every(doc => !!uploadedDocuments[doc.id]);
  }, [documentTypes, uploadedDocuments]);

  // Check if passport is uploaded and OCR is verified
  const isPassportVerified = useMemo(() => {
    const passportUploaded = !!uploadedDocuments[PASSPORT_DOCUMENT_ID];
    return passportUploaded && isOCRVerified;
  }, [uploadedDocuments, isOCRVerified]);

  // Can submit: all required docs uploaded + passport OCR verified
  const canSubmitDocuments = useMemo(() => {
    return allRequiredUploaded && isPassportVerified;
  }, [allRequiredUploaded, isPassportVerified]);

  // Get upload statistics
  const uploadStats = useMemo(() => {
    const uploaded = Object.keys(uploadedDocuments).length;
    const total = documentTypes.length;
    
    const requiredDocs = documentTypes.filter(d => d.required === true);
    const required = requiredDocs.length;
    const requiredUploaded = requiredDocs.filter(doc => !!uploadedDocuments[doc.id]).length;
    
    return { 
      uploaded, 
      total, 
      required,
      requiredUploaded,
      percentage: total > 0 ? (uploaded / total) * 100 : 0,
      requiredPercentage: required > 0 ? (requiredUploaded / required) * 100 : 0,
      allRequiredDone: requiredUploaded >= required
    };
  }, [documentTypes, uploadedDocuments]);

  const isSubmissionInProgress = isSubmitting || submittingDocuments;

  // ==========================================
  // EFFECTS
  // ==========================================
  
  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (showDocumentsModal && user?.empId) {
      fetchDocumentsData();
    }
  }, [showDocumentsModal, user?.empId]);

  // Fetch OCR data when passport is uploaded
  useEffect(() => {
    if (uploadedDocuments[PASSPORT_DOCUMENT_ID] && !passportOCRData && !loadingOCR) {
      fetchPassportOCR();
    }
  }, [uploadedDocuments]);

  // ==========================================
  // HANDLERS
  // ==========================================

  // Fetch documents data with required/optional flag
  const fetchDocumentsData = async () => {
    setLoadingDocs(true);
    try {
      let types = await documentService.getAllDocumentTypes();
      
      console.log('📋 Raw document types:', types);
      
      // Apply required/optional flag
      types = types.map(doc => {
        const isOptionalByName = OPTIONAL_DOCUMENT_NAMES.some(name => 
          doc.name.toLowerCase().trim() === name.toLowerCase().trim()
        );
        const isOptionalById = OPTIONAL_DOCUMENT_IDS.includes(doc.id);
        const isOptional = isOptionalByName || isOptionalById;
        
        return {
          ...doc,
          required: !isOptional
        };
      });
      
      // Log for debugging
      const requiredDocs = types.filter(d => d.required);
      const optionalDocs = types.filter(d => !d.required);
      console.log('📋 Required documents:', requiredDocs.map(d => `${d.name} (ID: ${d.id})`));
      console.log('📋 Optional documents:', optionalDocs.map(d => `${d.name} (ID: ${d.id})`));
      
      setDocumentTypes(types);

      // Fetch uploaded documents
      if (documentService.getEmployeeUploadedDocuments && user?.empId) {
        try {
          const uploadedMap = await documentService.getEmployeeUploadedDocuments(user.empId);
          if (uploadedMap && typeof uploadedMap === 'object') {
            setUploadedDocuments(uploadedMap);
            console.log('📋 Uploaded documents:', Object.keys(uploadedMap));
          }
        } catch (err) {
          console.log('📋 No uploaded documents found');
        }
      }

      // Check if passport OCR data exists
      if (user?.empId) {
        await fetchPassportOCR();
      }
    } catch (error) {
      console.error('❌ Error fetching documents:', error);
      showSnackbarMessage('Failed to load document types', 'error');
    } finally {
      setLoadingDocs(false);
    }
  };

  // Fetch Passport OCR data
  const fetchPassportOCR = async () => {
    if (!user?.empId) return;
    
    setLoadingOCR(true);
    try {
      const response = await documentService.getPassportOCRInfo(user.empId);
      
      if (response && response.status === 'Success' && response.result) {
        setPassportOCRData(response.result);
        setEditedOCRData(response.result);
        
        // Check if already verified (you might want to store this in backend)
        // For now, we'll assume it needs verification each time
        setIsOCRVerified(false);
        
        console.log('📋 Passport OCR data loaded:', response.result);
      }
    } catch (error) {
      console.log('📋 No passport OCR data found or error:', error);
    } finally {
      setLoadingOCR(false);
    }
  };

  // Handle OCR Edit
  const handleEditOCR = () => {
    setIsEditingOCR(true);
    setEditedOCRData({ ...passportOCRData });
  };

  // Handle OCR Save
// Handle OCR Save
const handleSaveOCR = async () => {
  try {
    showSnackbarMessage('Saving passport data...', 'info');
    
    // Call API to update OCR data
    const response = await documentService.updatePassportOCRInfo(user.empId, editedOCRData);
    
    if (response.status === 'Success' || response.Status === 'Success') {
      setPassportOCRData(editedOCRData);
      setIsEditingOCR(false);
      showSnackbarMessage('Passport data updated successfully!', 'success');
    } else {
      throw new Error(response.message || response.Message || 'Update failed');
    }
  } catch (error) {
    console.error('Error updating OCR data:', error);
    showSnackbarMessage(error.message || 'Failed to update passport data', 'error');
  }
};

  // Handle OCR Cancel
  const handleCancelOCR = () => {
    setEditedOCRData({ ...passportOCRData });
    setIsEditingOCR(false);
  };

  // Handle OCR Field Change
  const handleOCRFieldChange = (field, value) => {
    setEditedOCRData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle OCR Verify
  const handleVerifyOCR = () => {
    setIsOCRVerified(true);
    showSnackbarMessage('Passport data verified successfully!', 'success');
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

  const openUploadModal = (doc) => {
    setSelectedDoc(doc);
    setShowUploadModal(true);
  };

  // Handle file upload with OCR trigger for passport
  const handleFileUpload = async (file) => {
    if (!selectedDoc || !user?.empId) {
      showSnackbarMessage('Missing document or user information', 'error');
      return;
    }

    const validation = documentService.validateFile(file);
    if (!validation.valid) {
      showSnackbarMessage(validation.error, 'error');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
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

      // If passport was uploaded, trigger OCR
      if (selectedDoc.id === PASSPORT_DOCUMENT_ID) {
        showSnackbarMessage('Processing passport with OCR...', 'info');
        setIsOCRVerified(false); // Reset verification
        
        // Small delay to let backend process
        setTimeout(async () => {
          await fetchPassportOCR();
        }, 1500);
      }

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

  const handleViewDocument = async (doc) => {
    const uploaded = uploadedDocuments[doc.id];
    if (!uploaded) return;

    setLoadingPreview(true);
    try {
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
      
      const fileData = await documentService.getDocumentWithContent(user.empId, doc.id);
      
      if (fileData && fileData.base64String) {
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

  const handleDeleteDocument = async (doc) => {
    if (!window.confirm(`Are you sure you want to delete "${doc.name}"?`)) return;

    try {
      showSnackbarMessage('Deleting document...', 'info');
      
      await documentService.deleteDocument(user.empId, doc.id);
      
      setUploadedDocuments(prev => {
        const newState = { ...prev };
        delete newState[doc.id];
        return newState;
      });

      // If passport was deleted, clear OCR data
      if (doc.id === PASSPORT_DOCUMENT_ID) {
        setPassportOCRData(null);
        setIsOCRVerified(false);
      }

      showSnackbarMessage(`${doc.name} deleted successfully!`, 'success');
    } catch (error) {
      console.error('Error deleting document:', error);
      showSnackbarMessage(error.message || 'Failed to delete document', 'error');
    }
  };

  // Submit Documents (Status 13 → 14)
  const handleSubmitDocuments = async () => {
    if (!canSubmitDocuments) {
      if (!allRequiredUploaded) {
        showSnackbarMessage('Please upload all required documents before submitting.', 'error');
      } else if (!isPassportVerified) {
        showSnackbarMessage('Please verify your passport OCR data before submitting.', 'error');
      }
      return;
    }
    console.log("activeRequsest:::",activeRequest);
    const tId = activeRequest?.travelId || 
                activeRequest?.tId || 
                recentRequests[0]?.travelId || 
                recentRequests[0]?.tId;
    const empId =activeRequest?.employeeId || 
                activeRequest?.empId || 
                recentRequests[0]?.employeeId || 
                recentRequests[0]?.empId;

    console.log("empId:::",empId);
    if (!tId) {
      showSnackbarMessage('No active travel request found.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('📄 Submitting documents for tId:', tId, empId);
      
      const result = await dispatch(submitDocumentsThunk({ 
        tId, 
        empId
      })).unwrap();

      if (result.success) {
        showSnackbarMessage(
          'Documents submitted successfully! Helpdesk will review your documents.', 
          'success'
        );
        
        setTimeout(() => {
          setShowDocumentsModal(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Submit documents error:', error);
      
      try {
        const response = await documentService.submitDocuments(tId, user?.empId);
        
        if (response.status === 'Success') {
          dispatch(updateRequestStatus({
            tId,
            statusId: 14,
            empId,
            statusLabel: getStatusLabel(14)
          }));
          
          showSnackbarMessage('Documents submitted successfully!', 'success');
          
          setTimeout(() => {
            setShowDocumentsModal(false);
            dispatch(fetchDashboardData());
          }, 1500);
        } else {
          throw new Error(response.result || 'Submission failed');
        }
      } catch (fallbackError) {
        showSnackbarMessage(
          fallbackError.message || 'Failed to submit documents. Please try again.', 
          'error'
        );
      }
    } finally {
      setIsSubmitting(false);
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

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return <Description sx={{ fontSize: 28, color: '#b91c1c' }} />;
    if (fileType.includes('pdf')) return <PictureAsPdf sx={{ fontSize: 28, color: '#ef4444' }} />;
    if (fileType.includes('image')) return <ImageIcon sx={{ fontSize: 28, color: '#3b82f6' }} />;
    return <Description sx={{ fontSize: 28, color: '#64748b' }} />;
  };

  const getStatusInfo = (status) => {
    return statusToChip(status);
  };

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (loading) {
    return <LoadingSpinner />;
  }

  // ==========================================
  // RENDER
  // ==========================================
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
                      <Chip
                        label={getStatusInfo(currentStatus).label}
                        color={getStatusInfo(currentStatus).color}
                        sx={{ 
                          bgcolor: getStatusInfo(currentStatus).bgColor,
                          fontWeight: 600
                        }}
                      />
                    </motion.div>
                  </Box>

                  {/* Stepper */}
                  <Box sx={{ width: '100%', mb: 4 }}>
                    <Stepper activeStep={stepperConfig.activeStep} alternativeLabel>
                      {stepperConfig.steps.map((label, index) => (
                        <Step key={index} completed={stepperConfig.completed[index]}>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <StepLabel>{label}</StepLabel>
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

                  {/* Status-based messages */}
                  {currentStatus === 13 && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                      <Typography variant="body2">
                        <strong>Action Required:</strong> Please upload your documents and verify passport OCR data to proceed.
                      </Typography>
                    </Alert>
                  )}

                  {currentStatus === 14 && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                      <Typography variant="body2">
                        <strong>Documents Submitted:</strong> Helpdesk is reviewing your documents. You will be notified once the review is complete.
                      </Typography>
                    </Alert>
                  )}

                  {/* Action Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Tooltip 
                        title={
                          canUpload 
                            ? 'Upload required documents for your travel' 
                            : currentStatus === 14 
                              ? 'Documents already submitted. Waiting for review.' 
                              : 'Document upload not available for current status'
                        }
                      >
                        <span>
                          <Button
                            disabled={!canUpload}
                            variant="contained"
                            startIcon={<CloudUpload />}
                            onClick={() => setShowDocumentsModal(true)}
                            sx={{ 
                              bgcolor: '#b91c1c', 
                              '&:hover': { bgcolor: '#991b1b' }, 
                              px: 4, 
                              py: 1.5,
                              '&.Mui-disabled': {
                                bgcolor: '#e2e8f0',
                                color: '#94a3b8'
                              }
                            }}
                          >
                            {currentStatus === 14 ? 'Documents Submitted' : 'Upload Documents'}
                          </Button>
                        </span>
                      </Tooltip>
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
                      {recentRequests.map((request, index) => {
                        const statusInfo = getStatusInfo(request.status || request.statusId);
                        return (
                          <TableRow key={request.id || index}>
                            <TableCell>{request.destination}</TableCell>
                            <TableCell>
                              {new Date(request.departureDate).toLocaleDateString()} - {new Date(request.returnDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{request.purpose}</TableCell>
                            <TableCell>
                              <Chip
                                label={statusInfo.shortLabel || statusInfo.label}
                                size="small"
                                color={statusInfo.color}
                                sx={{ bgcolor: statusInfo.bgColor }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </SharedCard>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </motion.div>

      {/* ==========================================
          DOCUMENTS LIST MODAL
      ========================================== */}
      <SharedModal
        open={showDocumentsModal}
        onClose={() => !isSubmissionInProgress && setShowDocumentsModal(false)}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CloudUpload sx={{ fontSize: 28 }} />
                        <Typography variant="h6" fontWeight={600}>
                          Document Upload Center
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={`${uploadStats.requiredUploaded}/${uploadStats.required} Required`}
                          sx={{
                            bgcolor: uploadStats.allRequiredDone ? '#4ade80' : 'rgba(255,255,255,0.2)',
                            color: uploadStats.allRequiredDone ? '#166534' : 'white',
                            fontWeight: 600,
                          }}
                        />
                        <Tooltip title="Refresh documents">
                          <IconButton
                            size="small"
                            onClick={fetchDocumentsData}
                            sx={{ color: 'white' }}
                          >
                            <Refresh />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                      Please upload all required documents (9 required, Visa is optional). Verify passport OCR data before submitting.
                    </Typography>
                    
                    {/* Progress Bar */}
                    <Box sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadStats.requiredPercentage}%` }}
                        transition={{ duration: 0.8 }}
                        style={{
                          height: '100%',
                          borderRadius: 5,
                          background: uploadStats.allRequiredDone 
                            ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                            : 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                        }}
                      />
                    </Box>
                  </Box>
                </motion.div>

                {/* Passport OCR Section */}
                {(passportOCRData || loadingOCR) && (
                  <Box sx={{ mb: 3 }}>
                    {loadingOCR ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                        <CircularProgress size={24} />
                        <Typography>Processing passport with OCR...</Typography>
                      </Box>
                    ) : (
                      <PassportOCRCard
                        ocrData={passportOCRData}
                        isEditing={isEditingOCR}
                        editedData={editedOCRData}
                        onEdit={handleEditOCR}
                        onSave={handleSaveOCR}
                        onCancel={handleCancelOCR}
                        onChange={handleOCRFieldChange}
                        isVerified={isOCRVerified}
                        onVerify={handleVerifyOCR}
                      />
                    )}
                  </Box>
                )}

                {/* OCR Verification Warning */}
                {uploadedDocuments[PASSPORT_DOCUMENT_ID] && !isOCRVerified && !loadingOCR && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Passport Verification Required:</strong> Please verify your passport OCR data above before submitting documents.
                    </Typography>
                  </Alert>
                )}

                {/* Documents Grid */}
                <Box sx={{ maxHeight: '40vh', overflowY: 'auto', pr: 1 }}>
                  <motion.div variants={staggerContainer} initial="initial" animate="animate">
                    {documentTypes.map((doc, index) => {
                      const uploaded = uploadedDocuments[doc.id];
                      const isUploaded = !!uploaded;
                      const isRequired = doc.required === true;
                      const isPassport = doc.id === PASSPORT_DOCUMENT_ID;
                      
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

                            {/* Document Info */}
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                                <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#1e293b' }}>
                                  {doc.name}
                                </Typography>
                                
                                {/* Required/Optional Badge */}
                                <Chip
                                  size="small"
                                  label={isRequired ? 'Required' : 'Optional'}
                                  sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    bgcolor: isRequired ? '#fee2e2' : '#f0f9ff',
                                    color: isRequired ? '#dc2626' : '#0369a1',
                                    fontWeight: 600
                                  }}
                                />
                                
                                {/* Upload Status */}
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
                                  }}
                                />
                                
                                {/* Passport OCR Status */}
                                {isPassport && isUploaded && (
                                  <Chip
                                    size="small"
                                    icon={isOCRVerified ? <VerifiedIcon sx={{ fontSize: 14 }} /> : <WarningIcon sx={{ fontSize: 14 }} />}
                                    label={isOCRVerified ? 'OCR Verified' : 'OCR Pending'}
                                    sx={{
                                      height: 22,
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      bgcolor: isOCRVerified ? '#dcfce7' : '#fef3c7',
                                      color: isOCRVerified ? '#16a34a' : '#d97706',
                                    }}
                                  />
                                )}
                              </Box>
                              
                              {isUploaded ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                  <Typography variant="caption" sx={{ color: '#64748b' }}>
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
                                </Box>
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
                                    <IconButton
                                      size="small"
                                      onClick={() => handleViewDocument(doc)}
                                      disabled={loadingPreview}
                                      sx={{ color: '#3b82f6' }}
                                    >
                                      <Visibility fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteDocument(doc)}
                                      sx={{ color: '#ef4444' }}
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
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
                                  } : {
                                    bgcolor: '#b91c1c',
                                    '&:hover': { bgcolor: '#991b1b' }
                                  })
                                }}
                              >
                                {isUploaded ? 'Replace' : 'Upload'}
                              </Button>
                            </Box>
                          </Box>
                        </motion.div>
                      );
                    })}
                  </motion.div>
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
                    disabled={isSubmissionInProgress}
                    sx={{ color: '#64748b' }}
                  >
                    Cancel
                  </Button>
                  
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" color="text.secondary">
                        {uploadStats.requiredUploaded}/{uploadStats.required} required docs
                      </Typography>
                      {!isOCRVerified && uploadedDocuments[PASSPORT_DOCUMENT_ID] && (
                        <Typography variant="caption" color="warning.main">
                          ⚠️ Verify passport OCR data
                        </Typography>
                      )}
                    </Box>
                    
                    <Tooltip 
                      title={
                        canSubmitDocuments 
                          ? 'Submit documents for Helpdesk review' 
                          : !allRequiredUploaded 
                            ? `Upload ${uploadStats.required - uploadStats.requiredUploaded} more required document(s)`
                            : 'Verify passport OCR data first'
                      }
                      arrow
                    >
                      <span>
                        <Button
                          variant="contained"
                          onClick={handleSubmitDocuments}
                          disabled={!canSubmitDocuments || isSubmissionInProgress}
                          startIcon={
                            isSubmissionInProgress 
                              ? <CircularProgress size={18} color="inherit" /> 
                              : <SendIcon />
                          }
                          sx={{
                            minWidth: 200,
                            bgcolor: canSubmitDocuments ? '#16a34a' : '#94a3b8',
                            '&:hover': {
                              bgcolor: canSubmitDocuments ? '#15803d' : '#94a3b8',
                            },
                            '&.Mui-disabled': { 
                              bgcolor: '#e2e8f0', 
                              color: '#94a3b8' 
                            }
                          }}
                        >
                          {isSubmissionInProgress ? 'Submitting...' : 'Submit Documents'}
                        </Button>
                      </span>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </SharedModal>

      {/* Upload Modal */}
      <SharedModal
        open={showUploadModal}
        onClose={() => !uploading && setShowUploadModal(false)}
        title={selectedDoc ? `Upload ${selectedDoc.name}` : 'Upload Document'}
        maxWidth="sm"
      >
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
            opacity: uploading ? 0.7 : 1,
          }}
        >
          <input {...getInputProps()} />

          {uploading ? (
            <Box>
              <CircularProgress size={48} sx={{ mb: 2, color: '#b91c1c' }} />
              <Typography variant="h6" color="text.secondary">
                Uploading... {uploadProgress}%
              </Typography>
              <Box sx={{ mt: 2, height: 8, borderRadius: 4, bgcolor: '#e2e8f0', overflow: 'hidden' }}>
                <Box
                  sx={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #b91c1c, #ef4444)'
                  }}
                />
              </Box>
            </Box>
          ) : (
            <Box>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{
                  p: 2,
                  bgcolor: isDragActive ? '#b91c1c' : '#fee2e2',
                  borderRadius: '50%',
                  color: isDragActive ? 'white' : '#b91c1c',
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
              
              {selectedDoc?.id === PASSPORT_DOCUMENT_ID && (
                <Alert severity="info" sx={{ mt: 2, textAlign: 'left' }}>
                  After uploading, OCR will automatically extract passport data for verification.
                </Alert>
              )}
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => setShowUploadModal(false)} disabled={uploading} sx={{ color: '#64748b' }}>
            Cancel
          </Button>
        </Box>
      </SharedModal>

      {/* Preview Modal */}
      <SharedModal
        open={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setPreviewData(null);
        }}
        title={`Preview: ${previewData?.fileName || 'Document'}`}
        maxWidth="md"
      >
        {previewData && (
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
                <img
                  src={`data:${previewData.fileType};base64,${previewData.base64}`}
                  alt={previewData.fileName}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '55vh',
                    borderRadius: 8,
                  }}
                />
              </Box>
            )}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button variant="outlined" onClick={() => setShowPreviewModal(false)}>
                Close
              </Button>
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
            </Box>
          </Box>
        )}
      </SharedModal>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </BaseLayout>
  );
};

export default DashboardEmployee;