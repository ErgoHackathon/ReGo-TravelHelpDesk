// pages/TravelDesk/TravelDeskPortal.jsx
import React, { useEffect, useState, useCallback } from 'react';
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
  Alert,
  Button,
  Divider,
  Skeleton,
  TextField,
  LinearProgress
} from '@mui/material';
import { 
  FlightTakeoff, 
  Refresh, 
  Visibility,
  Description,
  CheckCircle,
  Schedule,
  Flight,
  Download,
  Upload,
  Done,
  Person,
  CalendarToday,
  LocationOn,
  CloudUpload,
  UploadFile,
  PictureAsPdf,
  Image as ImageIcon,
  Edit,
  Verified,
  Warning,
  Cancel,
  Email,
  Phone,
  Badge as BadgeIcon,
  Business,
  Hotel,
  AirplanemodeActive,
  HealthAndSafety,
  EventNote
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

import { 
  statusToChip, 
  getStatusLabel,
  STATUS_CODES,
  TD_STATUS_GROUPS,
  isInStatusGroup,
  DOCUMENT_IDS,
  DOCUMENT_GROUPS
} from '../../utils/statusMapper';

import Navbar from '../../components/shared/navigation/Navbar';
import BaseLayout from '../../components/layout/BaseLayout';
import { 
  SharedButton, 
  SharedTypography, 
  UserAvatar,
  SharedModal
} from '../../components/shared';

import { 
  fetchTravelDeskData, 
  processBooking 
} from '../../redux/slices/dashboardSlice';
import { logout } from '../../features/authSlice';
import documentService from '../../services/documentService';
import realApi from '../../services/api/realApi';

// ==========================================
// CONSTANTS
// ==========================================
const VISA_DOCUMENT_ID = 10;
const VISA_APPOINTMENT_DOCUMENT_ID = 12;
const VISA_FORM_DOCUMENT_ID = 8;
const HOTEL_BOOKING_DOCUMENT_ID = 5;
const FLIGHT_BOOKING_DOCUMENT_ID = 6;
const TRAVEL_INSURANCE_DOCUMENT_ID = 7;

// Documents that employee uploads
const EMPLOYEE_DOCUMENT_IDS = [1, 2, 3, 4, 9, 11];

// Documents for Status 14 (Visa Review)
const STATUS_14_UPLOAD_DOCS = [VISA_FORM_DOCUMENT_ID, VISA_DOCUMENT_ID, VISA_APPOINTMENT_DOCUMENT_ID];

// Documents for Status 15 (Booking)
const STATUS_15_UPLOAD_DOCS = [HOTEL_BOOKING_DOCUMENT_ID, FLIGHT_BOOKING_DOCUMENT_ID, TRAVEL_INSURANCE_DOCUMENT_ID];

// Documents to hide in Status 14
const HIDE_IN_STATUS_14 = [HOTEL_BOOKING_DOCUMENT_ID, FLIGHT_BOOKING_DOCUMENT_ID, TRAVEL_INSURANCE_DOCUMENT_ID];

// ==========================================
// ANIMATION VARIANTS
// ==========================================
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.1 } }
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
// HELPER COMPONENTS
// ==========================================
const PageWrapper = ({ children }) => (
  <Box sx={{ p: 3 }}>{children}</Box>
);

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
      }}
    />
  );
};

const PriorityBadge = ({ statusId }) => {
  const badges = {
    6: { 
      icon: <FlightTakeoff sx={{ fontSize: 14 }} />, 
      label: 'New Request', 
      bg: '#dbeafe', 
      color: '#1e40af', 
      border: '#3b82f6' 
    },
    13: { 
      icon: <Schedule sx={{ fontSize: 14 }} />, 
      label: 'Awaiting Docs', 
      bg: '#f3f4f6', 
      color: '#6b7280', 
      border: '#d1d5db' 
    },
    14: { 
      icon: <Description sx={{ fontSize: 14 }} />, 
      label: 'Upload Visa & Appointment', 
      bg: '#fef3c7', 
      color: '#92400e', 
      border: '#fbbf24' 
    },
    7: { 
      icon: <CalendarToday sx={{ fontSize: 14 }} />, 
      label: 'Manager: New Dates', 
      bg: '#e0e7ff', 
      color: '#3730a3', 
      border: '#6366f1' 
    },
    8: { 
      icon: <CalendarToday sx={{ fontSize: 14 }} />, 
      label: 'AVP: New Dates', 
      bg: '#e0e7ff', 
      color: '#3730a3', 
      border: '#6366f1' 
    },
    9: { 
      icon: <CalendarToday sx={{ fontSize: 14 }} />, 
      label: 'SVP: New Dates', 
      bg: '#e0e7ff', 
      color: '#3730a3', 
      border: '#6366f1' 
    },
    10: { 
      icon: <Flight sx={{ fontSize: 14 }} />, 
      label: 'Ready for Booking', 
      bg: '#dbeafe', 
      color: '#1e40af', 
      border: '#3b82f6' 
    },
    11: { 
      icon: <Flight sx={{ fontSize: 14 }} />, 
      label: 'Ready for Booking', 
      bg: '#dbeafe', 
      color: '#1e40af', 
      border: '#3b82f6' 
    },
    12: { 
      icon: <Flight sx={{ fontSize: 14 }} />, 
      label: 'Ready for Booking', 
      bg: '#dbeafe', 
      color: '#1e40af', 
      border: '#3b82f6' 
    },
    15: { 
      icon: <Hotel sx={{ fontSize: 14 }} />, 
      label: 'Upload Bookings', 
      bg: '#f5f3ff', 
      color: '#7c3aed', 
      border: '#8b5cf6' 
    },
    16: { 
      icon: <CheckCircle sx={{ fontSize: 14 }} />, 
      label: 'Sent to Employee', 
      bg: '#dcfce7', 
      color: '#16a34a', 
      border: '#22c55e' 
    },
    17: { 
      icon: <Done sx={{ fontSize: 14 }} />, 
      label: 'Completed', 
      bg: '#bbf7d0', 
      color: '#15803d', 
      border: '#16a34a' 
    },
    18: { 
      icon: <Cancel sx={{ fontSize: 14 }} />, 
      label: 'Visa Rejected', 
      bg: '#fee2e2', 
      color: '#dc2626', 
      border: '#ef4444' 
    },
  };
  
  const badge = badges[statusId];
  if (!badge) return null;
  
  return (
    <Chip
      icon={badge.icon}
      label={badge.label}
      size="small"
      sx={{ 
        bgcolor: badge.bg, 
        color: badge.color, 
        fontWeight: 600, 
        fontSize: '0.7rem', 
        border: `1px solid ${badge.border}` 
      }}
    />
  );
};

const StatsCard = ({ title, value, icon, color, bgColor }) => (
  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Card sx={{ p: 2, bgcolor: bgColor, border: `1px solid ${color}20`, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color }}>{value}</Typography>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
        </Box>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}20` }}>{icon}</Box>
      </Box>
    </Card>
  </motion.div>
);

// ==========================================
// DOCUMENT UPLOAD CARD COMPONENT
// ==========================================
const DocumentUploadCard = ({ 
  doc, 
  isUploaded, 
  uploadedData,
  onUpload, 
  onView,
  uploading,
  disabled 
}) => {
  const getDocIcon = (docId) => {
    switch(docId) {
      case VISA_DOCUMENT_ID: return <Verified sx={{ fontSize: 24, color: '#f59e0b' }} />;
      case VISA_APPOINTMENT_DOCUMENT_ID: return <EventNote sx={{ fontSize: 24, color: '#8b5cf6' }} />;
      case HOTEL_BOOKING_DOCUMENT_ID: return <Hotel sx={{ fontSize: 24, color: '#3b82f6' }} />;
      case FLIGHT_BOOKING_DOCUMENT_ID: return <AirplanemodeActive sx={{ fontSize: 24, color: '#0ea5e9' }} />;
      case TRAVEL_INSURANCE_DOCUMENT_ID: return <HealthAndSafety sx={{ fontSize: 24, color: '#16a34a' }} />;
      default: return <Description sx={{ fontSize: 24, color: '#64748b' }} />;
    }
  };

  const docId = doc.documentID || doc.id;
  const docName = doc.documentName || doc.name;

  return (
    <Card 
      sx={{ 
        p: 2, 
        border: isUploaded ? '2px solid #86efac' : '2px dashed #d1d5db',
        bgcolor: isUploaded ? '#f0fdf4' : '#fafafa',
        borderRadius: 2,
        opacity: disabled ? 0.6 : 1
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            bgcolor: isUploaded ? '#dcfce7' : '#f3f4f6' 
          }}>
            {getDocIcon(docId)}
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>{docName}</Typography>
            {isUploaded && uploadedData && (
              <Typography variant="caption" color="text.secondary">
                📄 {uploadedData.fileName} • {formatFileSize(uploadedData.fileSize)}
              </Typography>
            )}
            {!isUploaded && (
              <Typography variant="caption" color="error.main">
                Required - Please upload
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {isUploaded && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() => onView(doc)}
              disabled={disabled}
            >
              View
            </Button>
          )}
          <Button
            size="small"
            variant={isUploaded ? "outlined" : "contained"}
            startIcon={uploading ? <CircularProgress size={16} /> : <CloudUpload />}
            onClick={() => onUpload(doc)}
            disabled={disabled || uploading}
            sx={isUploaded ? {} : { bgcolor: '#3b82f6' }}
          >
            {uploading ? 'Uploading...' : isUploaded ? 'Replace' : 'Upload'}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

// ==========================================
// VISA OCR CARD COMPONENT
// ==========================================
const VisaOCRCard = ({ 
  data, 
  isVerified, 
  onEdit, 
  onVerify, 
  loading 
}) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  const formatGender = (sex) => {
    if (!sex) return '-';
    return sex.toUpperCase() === 'M' ? 'Male' : sex.toUpperCase() === 'F' ? 'Female' : sex;
  };

  if (!data) {
    return (
      <Card sx={{ border: `1px solid #fbbf24`, borderRadius: 2, bgcolor: '#fffbeb' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Warning sx={{ color: '#f59e0b' }} />
            <Typography variant="h6" fontWeight={600}>Visa OCR Data</Typography>
          </Box>
          <Alert severity="warning">
            Upload visa document to extract OCR data for verification.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      border: `2px solid ${isVerified ? '#86efac' : '#fbbf24'}`, 
      borderRadius: 2,
      bgcolor: isVerified ? '#f0fdf4' : '#fffbeb'
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isVerified ? <CheckCircle sx={{ color: '#16a34a' }} /> : <Warning sx={{ color: '#f59e0b' }} />}
            <Typography variant="h6" fontWeight={600}>Visa OCR Data</Typography>
            <Chip 
              size="small" 
              label={isVerified ? 'Verified' : 'Pending Verification'}
              sx={{ 
                bgcolor: isVerified ? '#dcfce7' : '#fef3c7',
                color: isVerified ? '#16a34a' : '#92400e',
                fontWeight: 600
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined" startIcon={<Edit />} onClick={onEdit} disabled={loading}>
              Edit
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">Full Name</Typography>
            <Typography variant="body1" fontWeight={600}>{data.fullName || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">Visa Number</Typography>
            <Typography variant="body1" fontWeight={600}>{data.visaNumber || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">Nationality</Typography>
            <Typography variant="body1" fontWeight={600}>{data.nationality || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
            <Typography variant="body1" fontWeight={600}>{formatDate(data.dateOfBirth)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">Gender</Typography>
            <Typography variant="body1" fontWeight={600}>{formatGender(data.sex)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">Expiry Date</Typography>
            <Typography variant="body1" fontWeight={600}>{formatDate(data.expiryDate)}</Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Chip
            size="small"
            icon={data.compositeCheck ? <CheckCircle /> : <Warning />}
            label={`MRZ Check: ${data.compositeCheck ? 'Passed' : 'Failed'}`}
            sx={{
              bgcolor: data.compositeCheck ? '#dcfce7' : '#fee2e2',
              color: data.compositeCheck ? '#16a34a' : '#dc2626',
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

// ==========================================
// VISA OCR EDIT MODAL
// ==========================================
const VisaOCREditModal = ({ open, onClose, data, onSave, loading }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (data) {
      setFormData({
        fullName: data.fullName || '',
        visaNumber: data.visaNumber || '',
        nationality: data.nationality || '',
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
        sex: data.sex || '',
        expiryDate: data.expiryDate ? data.expiryDate.split('T')[0] : '',
        issuer: data.issuer || '',
        compositeCheck: data.compositeCheck ?? true
      });
    }
  }, [data]);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <SharedModal open={open} onClose={onClose} title="Edit Visa OCR Data" maxWidth="sm">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Full Name" value={formData.fullName} onChange={handleChange('fullName')} size="small" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Visa Number" value={formData.visaNumber} onChange={handleChange('visaNumber')} size="small" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Nationality" value={formData.nationality} onChange={handleChange('nationality')} size="small" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={handleChange('dateOfBirth')} size="small" InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Gender" select value={formData.sex} onChange={handleChange('sex')} size="small" SelectProps={{ native: true }}>
            <option value="">Select</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Expiry Date" type="date" value={formData.expiryDate} onChange={handleChange('expiryDate')} size="small" InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Issuing Country" value={formData.issuer} onChange={handleChange('issuer')} size="small" />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(formData)} disabled={loading} sx={{ bgcolor: '#3b82f6' }}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </SharedModal>
  );
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================
const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const getFileIcon = (fileType) => {
  if (!fileType) return <Description sx={{ fontSize: 24, color: '#64748b' }} />;
  if (fileType.includes('pdf')) return <PictureAsPdf sx={{ fontSize: 24, color: '#ef4444' }} />;
  if (fileType.includes('image')) return <ImageIcon sx={{ fontSize: 24, color: '#3b82f6' }} />;
  return <Description sx={{ fontSize: 24, color: '#64748b' }} />;
};

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

  // Core State
  const [tabValue, setTabValue] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Document Modal State
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeDocuments, setEmployeeDocuments] = useState({});
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loadingEmployeeDocs, setLoadingEmployeeDocs] = useState(false);
  
  // Document Upload State
  const [uploadingDocId, setUploadingDocId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Preview State
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Visa OCR State
  const [visaOCRData, setVisaOCRData] = useState(null);
  const [visaVerified, setVisaVerified] = useState(false);
  const [loadingOCR, setLoadingOCR] = useState(false);
  
  // Visa OCR Edit Modal State
  const [showVisaEditModal, setShowVisaEditModal] = useState(false);
  const [savingOCR, setSavingOCR] = useState(false);

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
  const statusCounts = React.useMemo(() => {
    const counts = {
      newRequests: 0,
      awaitingDocs: 0,
      visaReview: 0,
      managerDates: 0,
      readyForBooking: 0,
      uploadBookings: 0,
      completed: 0
    };
    
    pendingRequests?.forEach(req => {
      switch(req.statusId) {
        case 6: counts.newRequests++; break;
        case 13: counts.awaitingDocs++; break;
        case 14: counts.visaReview++; break;
        case 7: case 8: case 9: counts.managerDates++; break;
        case 10: case 11: case 12: counts.readyForBooking++; break;
        case 15: counts.uploadBookings++; break;
        default: break;
      }
    });
    
    completedRequests?.forEach(req => {
      if (req.statusId === 16 || req.statusId === 17) counts.completed++;
    });
    
    return counts;
  }, [pendingRequests, completedRequests]);

  const sortedPendingRequests = React.useMemo(() => {
    if (!pendingRequests) return [];
    
    return [...pendingRequests].sort((a, b) => {
      const priorityOrder = { 
        6: 1,   // New requests
        14: 2,  // Visa review
        15: 3,  // Upload bookings
        10: 4, 11: 4, 12: 4,  // Ready for booking
        7: 5, 8: 5, 9: 5,     // Manager dates
        13: 6   // Awaiting docs
      };
      return (priorityOrder[a.statusId] || 99) - (priorityOrder[b.statusId] || 99);
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
      navigate('/login', { replace: true });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchTravelDeskData());
    setRefreshing(false);
    toast.success('Data refreshed!');
  };

  // Request Documents from Employee (Status 6 → 13)
  const handleRequestDocuments = async (req) => {
    try {
      await dispatch(processBooking({ 
        tId: req.tId, 
        newStatus: 13,
        empId: req.employeeId
      })).unwrap();
      
      toast.success('Document request sent to employee!');
      dispatch(fetchTravelDeskData());
    } catch (err) {
      console.error('Failed to request documents:', err);
      toast.error('Failed to request documents');
    }
  };

  // View Employee Documents Modal
  const handleViewEmployeeDocuments = async (req) => {
    setSelectedEmployee(req);
    setShowDocumentsModal(true);
    setLoadingEmployeeDocs(true);
    setVisaOCRData(null);
    setVisaVerified(false);

    try {
      // Get all document types
      const typesResponse = await realApi.getAllDocumentsList();
      const types = typesResponse?.result || [];
      setDocumentTypes(types);
      
      // Get uploaded documents
      const docs = await documentService.getHelpDeskEmployeeDocuments(req.employeeId);
      setEmployeeDocuments(docs || {});
      
      // Load Visa OCR if visa is uploaded
      if (docs && docs[VISA_DOCUMENT_ID]) {
        try {
          const visaInfo = await realApi.getVisaInfo(req.employeeId);
          console.log("visaInfo:::",visaInfo)
          if (visaInfo?.status === 'Success' && visaInfo?.result) {
            setVisaOCRData(visaInfo.result);
            setVisaVerified(visaInfo.result.isVerified ?? false);
          }
        } catch (e) {
          console.log('Visa OCR not available yet');
        }
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoadingEmployeeDocs(false);
    }
  };

  // Handle Document Upload
  const handleDocumentUpload = async (doc, file) => {
    if (!selectedEmployee || !file) return;

    const docId = doc.documentID || doc.id;
    setUploadingDocId(docId);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 15, 90));
      }, 200);

      await documentService.helpDeskUploadDocument(
        selectedEmployee.employeeId, 
        docId, 
        file
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Update local state
      setEmployeeDocuments(prev => ({
        ...prev,
        [docId]: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadedAt: new Date().toISOString()
        }
      }));

      toast.success(`${doc.documentName || 'Document'} uploaded successfully!`);

      // If visa was uploaded, try to fetch OCR data
      if (docId === VISA_DOCUMENT_ID) {
        setTimeout(async () => {
          try {
            const visaInfo = await realApi.getVisaInfo(selectedEmployee.employeeId);
            if (visaInfo?.status === 'Success' && visaInfo?.result) {
              setVisaOCRData(visaInfo.result);
            }
          } catch (e) {
            console.log('OCR processing...');
          }
        }, 2000);
      }

    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(`Failed to upload ${doc.documentName || 'document'}`);
    } finally {
      setUploadingDocId(null);
      setUploadProgress(0);
    }
  };

  // File input handler
  const handleFileSelect = (doc) => (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      handleDocumentUpload(doc, file);
    }
  };

  // View Document
  const handleViewDocument = async (doc) => {
    const docId = doc.documentID || doc.id;
    const uploaded = employeeDocuments[docId];
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
        return;
      }

      toast.info('Loading document...');
      const fileData = await documentService.getHelpDeskDocumentWithContent(selectedEmployee.employeeId, docId);
      
      if (fileData?.base64String) {
        setEmployeeDocuments(prev => ({
          ...prev,
          [docId]: { ...prev[docId], base64String: fileData.base64String, fileType: fileData.fileType }
        }));
        
        setPreviewData({
          fileName: uploaded.fileName || fileData.fileName,
          fileType: fileData.fileType || uploaded.fileType,
          base64: fileData.base64String,
        });
        setShowPreviewModal(true);
      } else {
        toast.warning('Document preview not available');
      }
    } catch (error) {
      toast.error('Failed to load document');
    } finally {
      setLoadingPreview(false);
    }
  };

  // Save Visa OCR Edits
  const handleSaveVisaOCR = async (formData) => {
    setSavingOCR(true);
    try {
      await realApi.updateVisaInfo(selectedEmployee.employeeId, formData);
      setVisaOCRData(prev => ({ ...prev, ...formData }));
      toast.success('Visa info updated!');
      setShowVisaEditModal(false);
    } catch (error) {
      toast.error('Failed to update visa info');
    } finally {
      setSavingOCR(false);
    }
  };

  // Submit Visa Documents and Move to Status 7 (Manager Final)
  const handleSubmitVisaDocuments = async () => {
    if (!selectedEmployee) return;

    // Check if required documents are uploaded
    const visaUploaded = !!employeeDocuments[VISA_DOCUMENT_ID];
    const appointmentUploaded = !!employeeDocuments[VISA_APPOINTMENT_DOCUMENT_ID];

    if (!visaUploaded || !appointmentUploaded) {
      toast.error('Please upload both Visa and Visa Appointment documents');
      return;
    }

    setLoadingOCR(true);
    try {
      // Move to Status 7 (Manager Final Initiated)
      await dispatch(processBooking({ 
        tId: selectedEmployee.tId, 
        newStatus: 7,
        empId: selectedEmployee.employeeId
      })).unwrap();
      
      toast.success('Documents submitted! Sent to Manager for new dates.');
      setShowDocumentsModal(false);
      dispatch(fetchTravelDeskData());
    } catch (error) {
      console.error('Failed to submit:', error);
      toast.error('Failed to submit documents');
    } finally {
      setLoadingOCR(false);
    }
  };

  // Submit Booking Documents and Move to Status 16 (Employee Dashboard)
  const handleSubmitBookingDocuments = async () => {
    if (!selectedEmployee) return;

    // Check if required documents are uploaded
    const hotelUploaded = !!employeeDocuments[HOTEL_BOOKING_DOCUMENT_ID];
    const flightUploaded = !!employeeDocuments[FLIGHT_BOOKING_DOCUMENT_ID];
    const insuranceUploaded = !!employeeDocuments[TRAVEL_INSURANCE_DOCUMENT_ID];

    if (!hotelUploaded || !flightUploaded || !insuranceUploaded) {
      toast.error('Please upload Hotel Booking, Flight Booking, and Travel Insurance');
      return;
    }

    setLoadingOCR(true);
    try {
      // Move to Status 16 (Employee Dashboard)
      await dispatch(processBooking({ 
        tId: selectedEmployee.tId, 
        newStatus: 16,
        empId: selectedEmployee.employeeId
      })).unwrap();
      
      toast.success('Booking documents uploaded! Sent to Employee dashboard.');
      setShowDocumentsModal(false);
      dispatch(fetchTravelDeskData());
    } catch (error) {
      console.error('Failed to submit:', error);
      toast.error('Failed to submit booking documents');
    } finally {
      setLoadingOCR(false);
    }
  };

  // Reject Visa
  const handleRejectVisa = async () => {
    if (!selectedEmployee) return;
    
    try {
      await dispatch(processBooking({ 
        tId: selectedEmployee.tId, 
        newStatus: 18,
        empId: selectedEmployee.employeeId
      })).unwrap();
      toast.success('Visa rejected');
      setShowDocumentsModal(false);
      dispatch(fetchTravelDeskData());
    } catch (err) {
      toast.error('Failed to reject visa');
    }
  };

  // Start Booking (Status 10/11/12 → 15)
  const handleStartBooking = async (req) => {
    try {
      await dispatch(processBooking({ 
        tId: req.tId, 
        newStatus: 15,
        empId: req.employeeId
      })).unwrap();
      toast.success('Moved to booking phase!');
      dispatch(fetchTravelDeskData());
    } catch (err) {
      toast.error('Failed to start booking');
    }
  };

  // Get Card Style
  const getCardStyle = (statusId) => {
    const styles = {
      6: { bg: '#eff6ff', border: '#3b82f6', borderLeft: '4px solid #3b82f6' },
      13: { bg: '#f9fafb', border: '#d1d5db', borderLeft: '4px solid #9ca3af' },
      14: { bg: '#fffbeb', border: '#f59e0b', borderLeft: '4px solid #f59e0b' },
      7: { bg: '#eef2ff', border: '#6366f1', borderLeft: '4px solid #6366f1' },
      8: { bg: '#eef2ff', border: '#6366f1', borderLeft: '4px solid #6366f1' },
      9: { bg: '#eef2ff', border: '#6366f1', borderLeft: '4px solid #6366f1' },
      10: { bg: '#dbeafe', border: '#3b82f6', borderLeft: '4px solid #3b82f6' },
      11: { bg: '#dbeafe', border: '#3b82f6', borderLeft: '4px solid #3b82f6' },
      12: { bg: '#dbeafe', border: '#3b82f6', borderLeft: '4px solid #3b82f6' },
      15: { bg: '#f5f3ff', border: '#8b5cf6', borderLeft: '4px solid #8b5cf6' },
      16: { bg: '#f0fdf4', border: '#22c55e', borderLeft: '4px solid #22c55e' },
      17: { bg: '#f0fdf4', border: '#16a34a', borderLeft: '4px solid #16a34a' },
      18: { bg: '#fef2f2', border: '#ef4444', borderLeft: '4px solid #ef4444' },
    };
    return styles[statusId] || { bg: '#ffffff', border: '#e5e7eb', borderLeft: '1px solid #e5e7eb' };
  };

  // Get Action Button
  const getActionButton = (req) => {
    const { statusId } = req;
    
    switch (statusId) {
      case 6:
        return (
          <SharedButton
            variant="contained"
            onClick={() => handleRequestDocuments(req)}
            disabled={bookingInProgress}
            startIcon={<Upload />}
            sx={{ bgcolor: "#3b82f6", '&:hover': { bgcolor: '#2563eb' }, mr: 1 }}
          >
            {bookingInProgress ? "Processing..." : "Request Documents"}
          </SharedButton>
        );
      
      case 13:
        return (
          <Tooltip title="Waiting for employee to upload documents">
            <span>
              <SharedButton 
                variant="outlined" 
                disabled 
                startIcon={<Schedule />}
                sx={{ mr: 1, color: '#6b7280', borderColor: '#d1d5db' }}
              >
                Awaiting Docs
              </SharedButton>
            </span>
          </Tooltip>
        );
      
      case 14:
        return (
          <SharedButton
            variant="contained"
            onClick={() => handleViewEmployeeDocuments(req)}
            startIcon={<Upload />}
            sx={{ bgcolor: "#f59e0b", '&:hover': { bgcolor: '#d97706' }, mr: 1 }}
          >
            Upload Visa & Appointment
          </SharedButton>
        );
      
      case 7:
      case 8:
      case 9:
        return (
          <Tooltip title="Waiting for Manager/AVP/SVP to provide new dates">
            <span>
              <SharedButton 
                variant="outlined" 
                disabled 
                startIcon={<CalendarToday />}
                sx={{ mr: 1, color: '#6366f1', borderColor: '#c7d2fe' }}
              >
                Awaiting New Dates
              </SharedButton>
            </span>
          </Tooltip>
        );
      
      case 10:
      case 11:
      case 12:
        return (
          <SharedButton
            variant="contained"
            onClick={() => handleStartBooking(req)}
            disabled={bookingInProgress}
            startIcon={<Flight />}
            sx={{ bgcolor: "#3b82f6", mr: 1 }}
          >
            {bookingInProgress ? "Processing..." : "Start Booking"}
          </SharedButton>
        );
      
      case 15:
        return (
          <SharedButton
            variant="contained"
            onClick={() => handleViewEmployeeDocuments(req)}
            startIcon={<Hotel />}
            sx={{ bgcolor: "#8b5cf6", '&:hover': { bgcolor: '#7c3aed' }, mr: 1 }}
          >
            Upload Bookings
          </SharedButton>
        );
      
      case 16:
        return (
          <Chip
            icon={<CheckCircle sx={{ fontSize: 16 }} />}
            label="Sent to Employee"
            size="small"
            sx={{ bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 600 }}
          />
        );
      
      case 17:
        return (
          <Chip
            icon={<Done sx={{ fontSize: 16 }} />}
            label="Completed"
            size="small"
            sx={{ bgcolor: '#bbf7d0', color: '#15803d', fontWeight: 600 }}
          />
        );
      
      default:
        return null;
    }
  };

  // Get documents to display based on status
  const getDocumentsForCurrentStatus = () => {
    const currentStatus = selectedEmployee?.statusId;
    
    // Employee uploaded documents (always show if uploaded)
    const employeeUploadedDocs = documentTypes.filter(doc => {
      const docId = doc.documentID;
      const isEmployeeDoc = EMPLOYEE_DOCUMENT_IDS.includes(docId);
      const isUploaded = !!employeeDocuments[docId];
      return isEmployeeDoc && isUploaded;
    });

    // Travel Desk upload docs based on status
    let tdUploadDocs = [];
    
    if (currentStatus === 14) {
      // Status 14: Show Visa and Visa Appointment for upload
      tdUploadDocs = documentTypes.filter(doc => 
        STATUS_14_UPLOAD_DOCS.includes(doc.documentID)
      );
    } else if (currentStatus === 15) {
      // Status 15: Show all uploaded + Hotel, Flight, Insurance for upload
      const visaDocs = documentTypes.filter(doc => 
        STATUS_14_UPLOAD_DOCS.includes(doc.documentID) && employeeDocuments[doc.documentID]
      );
      const bookingDocs = documentTypes.filter(doc => 
        STATUS_15_UPLOAD_DOCS.includes(doc.documentID)
      );
      tdUploadDocs = [...visaDocs, ...bookingDocs];
    }

    return { employeeUploadedDocs, tdUploadDocs };
  };

  // Check if all required docs are uploaded for current status
  const areRequiredDocsUploaded = () => {
    const currentStatus = selectedEmployee?.statusId;
    
    if (currentStatus === 14) {
      return !!employeeDocuments[VISA_DOCUMENT_ID] && !!employeeDocuments[VISA_APPOINTMENT_DOCUMENT_ID];
    }
    
    if (currentStatus === 15) {
      return !!employeeDocuments[HOTEL_BOOKING_DOCUMENT_ID] && 
             !!employeeDocuments[FLIGHT_BOOKING_DOCUMENT_ID] && 
             !!employeeDocuments[TRAVEL_INSURANCE_DOCUMENT_ID];
    }
    
    return false;
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <BaseLayout variant="dashboard">
      <Navbar user={user} onLogout={handleLogout} />

      <PageWrapper>
        <motion.div variants={pageVariants} initial="initial" animate="animate">
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center", mb: 4, gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <UserAvatar firstName={user?.firstName} lastName={user?.lastName} size="large" />
              <Box>
                <SharedTypography variant="h5" sx={{ fontWeight: 600 }}>
                  Welcome, {user?.firstName || 'Travel Desk'}!
                </SharedTypography>
                <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                  <Chip label={user?.role?.replace("_", " ") || "Travel Desk"} size="small" sx={{ bgcolor: "#b91c1c", color: '#fff', fontWeight: 600 }} />
                </Box>
              </Box>
            </Box>

            <Tooltip title="Refresh data">
              <IconButton onClick={handleRefresh} disabled={refreshing} sx={{ bgcolor: '#f1f5f9' }}>
                <motion.div animate={refreshing ? { rotate: 360 } : {}} transition={{ duration: 1, repeat: refreshing ? Infinity : 0 }}>
                  <Refresh />
                </motion.div>
              </IconButton>
            </Tooltip>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={6} md={1.7}>
              <StatsCard title="New" value={statusCounts.newRequests} icon={<FlightTakeoff sx={{ color: '#3b82f6', fontSize: 24 }} />} color="#3b82f6" bgColor="#dbeafe" />
            </Grid>
            <Grid item xs={6} md={1.7}>
              <StatsCard title="Awaiting Docs" value={statusCounts.awaitingDocs} icon={<Schedule sx={{ color: '#6b7280', fontSize: 24 }} />} color="#6b7280" bgColor="#f9fafb" />
            </Grid>
            <Grid item xs={6} md={1.7}>
              <StatsCard title="Visa Review" value={statusCounts.visaReview} icon={<Verified sx={{ color: '#f59e0b', fontSize: 24 }} />} color="#f59e0b" bgColor="#fffbeb" />
            </Grid>
            <Grid item xs={6} md={1.7}>
              <StatsCard title="Mgr Dates" value={statusCounts.managerDates} icon={<CalendarToday sx={{ color: '#6366f1', fontSize: 24 }} />} color="#6366f1" bgColor="#eef2ff" />
            </Grid>
            <Grid item xs={6} md={1.7}>
              <StatsCard title="Ready" value={statusCounts.readyForBooking} icon={<Flight sx={{ color: '#0ea5e9', fontSize: 24 }} />} color="#0ea5e9" bgColor="#e0f2fe" />
            </Grid>
            <Grid item xs={6} md={1.7}>
              <StatsCard title="Bookings" value={statusCounts.uploadBookings} icon={<Hotel sx={{ color: '#8b5cf6', fontSize: 24 }} />} color="#8b5cf6" bgColor="#f5f3ff" />
            </Grid>
            <Grid item xs={6} md={1.7}>
              <StatsCard title="Done" value={statusCounts.completed} icon={<CheckCircle sx={{ color: '#16a34a', fontSize: 24 }} />} color="#16a34a" bgColor="#f0fdf4" />
            </Grid>
          </Grid>

          <Typography variant="h5" sx={{ fontSize: "1.8rem", mb: 2, fontWeight: 600 }}>
            Travel Desk Portal
          </Typography>
          
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
              <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><span>Pending</span><Badge badgeContent={pendingRequests?.length || 0} color="error" /></Box>} />
              <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><span>Completed</span><Badge badgeContent={completedRequests?.length || 0} color="success" /></Box>} />
            </Tabs>
          </Box>

          {/* Pending Requests */}
          <AnimatePresence mode="wait">
            {tabValue === 0 && (
              <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card sx={{ p: 3, border: "1.5px solid #b91c1c", borderTop: `7px solid #b91c1c`, borderRadius: 2 }}>
                  <CardContent sx={{ p: 0 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Pending Requests
                    </Typography>
                    
                    {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress sx={{ color: '#b91c1c' }} /></Box>}
                    
                    {!loading && sortedPendingRequests?.length === 0 && (
                      <Alert severity="info">No pending requests. All caught up! 🎉</Alert>
                    )}

                    {!loading && sortedPendingRequests?.map((req, index) => {
                      const cardStyle = getCardStyle(req.statusId);
                      
                      return (
                        <motion.div key={req.tId || index} variants={listItemVariants} initial="initial" animate="animate" custom={index}>
                          <Card sx={{ mb: 2, p: 2.5, border: `1px solid ${cardStyle.border}`, borderLeft: cardStyle.borderLeft, backgroundColor: cardStyle.bg, borderRadius: 2 }}>
                            <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                  <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Person sx={{ color: '#64748b' }} />
                                  </Box>
                                  
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: '#1e293b' }}>
                                      {req.id}: {req.employee}
                                    </Typography>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <LocationOn sx={{ fontSize: 16, color: '#64748b' }} />
                                        <Typography variant="body2" color="text.secondary">{req.destination}</Typography>
                                      </Box>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <CalendarToday sx={{ fontSize: 16, color: '#64748b' }} />
                                        <Typography variant="body2" color="text.secondary">{req.departure}</Typography>
                                      </Box>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                                      <StatusChipMapped statusId={req.statusId} />
                                      <PriorityBadge statusId={req.statusId} />
                                    </Box>
                                  </Box>
                                </Box>
                              </Grid>

                              <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                  {getActionButton(req)}
                                  
                                  <SharedButton 
                                    variant="outlined" 
                                    onClick={() => handleViewEmployeeDocuments(req)} 
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

            {/* Completed Requests */}
            {tabValue === 1 && (
              <motion.div key="completed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card sx={{ p: 3, border: "1.5px solid #16a34a", borderTop: `7px solid #16a34a`, borderRadius: 2 }}>
                  <CardContent sx={{ p: 0 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Completed Bookings</Typography>
                    
                    {!loading && completedRequests?.length === 0 && (
                      <Alert severity="info">No completed bookings yet.</Alert>
                    )}

                    {!loading && completedRequests?.map((req, index) => {
                      const cardStyle = getCardStyle(req.statusId);
                      
                      return (
                        <motion.div key={req.tId || index} variants={listItemVariants} initial="initial" animate="animate" custom={index}>
                          <Card sx={{ mb: 2, p: 2.5, border: `1px solid ${cardStyle.border}`, borderLeft: cardStyle.borderLeft, backgroundColor: cardStyle.bg, borderRadius: 2 }}>
                            <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                              <Grid item xs={12} md={8}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                  <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircle sx={{ color: '#16a34a' }} />
                                  </Box>
                                  
                                  <Box>
                                    <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>{req.id}: {req.employee}</Typography>
                                    <Typography variant="body2" color="text.secondary">{req.destination}</Typography>
                                    <Box sx={{ mt: 1.5 }}><StatusChipMapped statusId={req.statusId} /></Box>
                                  </Box>
                                </Box>
                              </Grid>

                              <Grid item xs={12} md={4}>
                                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
                                  <SharedButton variant="outlined" onClick={() => handleViewEmployeeDocuments(req)} startIcon={<Visibility />}>
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

      {/* ==========================================
          DOCUMENTS MODAL
      ========================================== */}
      <SharedModal
        open={showDocumentsModal}
        onClose={() => setShowDocumentsModal(false)}
        title={`Documents - ${selectedEmployee?.employee || 'Employee'} (Status: ${selectedEmployee?.statusId})`}
        maxWidth="lg"
        fullWidth
      >
        {loadingEmployeeDocs ? (
          <Box sx={{ p: 2 }}>
            <Skeleton variant="rounded" height={80} sx={{ mb: 2 }} />
            <Skeleton variant="rounded" height={150} sx={{ mb: 2 }} />
            <Skeleton variant="rounded" height={200} />
          </Box>
        ) : (
          <Box>
            {/* Employee Info Header */}
            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">Employee</Typography>
                  <Typography variant="body2" fontWeight={600}>{selectedEmployee?.employee}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">Destination</Typography>
                  <Typography variant="body2" fontWeight={600}>{selectedEmployee?.destination}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">Departure</Typography>
                  <Typography variant="body2" fontWeight={600}>{selectedEmployee?.departure}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <StatusChipMapped statusId={selectedEmployee?.statusId} />
                </Grid>
              </Grid>
            </Box>

            {/* ==========================================
                STATUS 14: VISA REVIEW
            ========================================== */}
            {selectedEmployee?.statusId === 14 && (
              <>
                {/* Section: Employee Uploaded Documents */}
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person sx={{ color: '#3b82f6' }} />
                  Employee Uploaded Documents
                </Typography>

                <Box sx={{ maxHeight: '25vh', overflowY: 'auto', mb: 3 }}>
                  {documentTypes
                    .filter(doc => EMPLOYEE_DOCUMENT_IDS.includes(doc.documentID) && employeeDocuments[doc.documentID])
                    .map((doc) => (
                      <Box
                        key={doc.documentID}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          mb: 1,
                          borderRadius: 2,
                          border: '1px solid #86efac',
                          bgcolor: '#f0fdf4',
                        }}
                      >
                        <Box sx={{ width: 40, height: 40, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#dcfce7' }}>
                          {getFileIcon(employeeDocuments[doc.documentID]?.fileType)}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>{doc.documentName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            📄 {employeeDocuments[doc.documentID]?.fileName} • {formatFileSize(employeeDocuments[doc.documentID]?.fileSize)}
                          </Typography>
                        </Box>
                        <Button size="small" variant="outlined" onClick={() => handleViewDocument(doc)} startIcon={<Visibility />}>
                          View
                        </Button>
                      </Box>
                    ))}
                  
                  {documentTypes.filter(doc => EMPLOYEE_DOCUMENT_IDS.includes(doc.documentID) && employeeDocuments[doc.documentID]).length === 0 && (
                    <Alert severity="warning">No documents uploaded by employee yet.</Alert>
                  )}
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Section: Upload Visa & Visa Appointment */}
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Verified sx={{ color: '#f59e0b' }} />
                  Upload Visa Documents (Required)
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {documentTypes
                    .filter(doc => STATUS_14_UPLOAD_DOCS.includes(doc.documentID))
                    .map((doc) => {
                      const docId = doc.documentID;
                      const isUploaded = !!employeeDocuments[docId];
                      
                      return (
                        <Grid item xs={12} md={6} key={docId}>
                          <DocumentUploadCard
                            doc={doc}
                            isUploaded={isUploaded}
                            uploadedData={employeeDocuments[docId]}
                            onUpload={() => document.getElementById(`file-input-${docId}`).click()}
                            onView={() => handleViewDocument(doc)}
                            uploading={uploadingDocId === docId}
                            disabled={loadingOCR}
                          />
                          <input
                            id={`file-input-${docId}`}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            style={{ display: 'none' }}
                            onChange={handleFileSelect(doc)}
                          />
                        </Grid>
                      );
                    })}
                </Grid>

                {/* Visa OCR Section (only show if visa uploaded) */}
                {employeeDocuments[VISA_DOCUMENT_ID] && (
                  <Box sx={{ mb: 3 }}>
                    <VisaOCRCard
                      data={visaOCRData}
                      isVerified={visaVerified}
                      onEdit={() => setShowVisaEditModal(true)}
                      onVerify={() => {}}
                      loading={loadingOCR}
                    />
                  </Box>
                )}

                {/* Footer Actions */}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Button onClick={() => setShowDocumentsModal(false)}>Close</Button>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleRejectVisa}
                      startIcon={<Cancel />}
                      disabled={bookingInProgress}
                    >
                      Reject
                    </Button>
                    
                    <Tooltip title={!areRequiredDocsUploaded() ? "Upload both Visa and Visa Appointment first" : "Submit and send for new dates"}>
                      <span>
                        <Button
                          variant="contained"
                          onClick={handleSubmitVisaDocuments}
                          disabled={!areRequiredDocsUploaded() || loadingOCR}
                          startIcon={loadingOCR ? <CircularProgress size={16} /> : <Done />}
                          sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' } }}
                        >
                          {loadingOCR ? 'Processing...' : 'Submit & Request New Dates'}
                        </Button>
                      </span>
                    </Tooltip>
                  </Box>
                </Box>
              </>
            )}

            {/* ==========================================
                STATUS 15: UPLOAD BOOKINGS
            ========================================== */}
            {selectedEmployee?.statusId === 15 && (
              <>
                {/* Section: All Previously Uploaded Documents */}
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ color: '#16a34a' }} />
                  Uploaded Documents
                </Typography>

                <Box sx={{ maxHeight: '20vh', overflowY: 'auto', mb: 3 }}>
                  {documentTypes
                    .filter(doc => {
                      const docId = doc.documentID;
                      // Show employee docs + visa docs that are uploaded
                      return (EMPLOYEE_DOCUMENT_IDS.includes(docId) || STATUS_14_UPLOAD_DOCS.includes(docId)) 
                             && employeeDocuments[docId];
                    })
                    .map((doc) => (
                      <Box
                        key={doc.documentID}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 1.5,
                          mb: 1,
                          borderRadius: 2,
                          border: '1px solid #86efac',
                          bgcolor: '#f0fdf4',
                        }}
                      >
                        <Box sx={{ width: 36, height: 36, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#dcfce7' }}>
                          {getFileIcon(employeeDocuments[doc.documentID]?.fileType)}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" fontWeight={600}>{doc.documentName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {employeeDocuments[doc.documentID]?.fileName}
                          </Typography>
                        </Box>
                        <IconButton size="small" onClick={() => handleViewDocument(doc)}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Section: Upload Booking Documents */}
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Hotel sx={{ color: '#8b5cf6' }} />
                  Upload Booking Documents (Required)
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {documentTypes
                    .filter(doc => STATUS_15_UPLOAD_DOCS.includes(doc.documentID))
                    .map((doc) => {
                      const docId = doc.documentID;
                      const isUploaded = !!employeeDocuments[docId];
                      
                      return (
                        <Grid item xs={12} md={4} key={docId}>
                          <DocumentUploadCard
                            doc={doc}
                            isUploaded={isUploaded}
                            uploadedData={employeeDocuments[docId]}
                            onUpload={() => document.getElementById(`file-input-${docId}`).click()}
                            onView={() => handleViewDocument(doc)}
                            uploading={uploadingDocId === docId}
                            disabled={loadingOCR}
                          />
                          <input
                            id={`file-input-${docId}`}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            style={{ display: 'none' }}
                            onChange={handleFileSelect(doc)}
                          />
                        </Grid>
                      );
                    })}
                </Grid>

                {/* Footer Actions */}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Button onClick={() => setShowDocumentsModal(false)}>Close</Button>
                  
                  <Tooltip title={!areRequiredDocsUploaded() ? "Upload all booking documents first" : "Complete and send to employee"}>
                    <span>
                      <Button
                        variant="contained"
                        onClick={handleSubmitBookingDocuments}
                        disabled={!areRequiredDocsUploaded() || loadingOCR}
                        startIcon={loadingOCR ? <CircularProgress size={16} /> : <Done />}
                        sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' } }}
                      >
                        {loadingOCR ? 'Processing...' : 'Complete & Send to Employee'}
                      </Button>
                    </span>
                  </Tooltip>
                </Box>
              </>
            )}

            {/* ==========================================
                OTHER STATUSES: VIEW ONLY
            ========================================== */}
            {selectedEmployee?.statusId !== 14 && selectedEmployee?.statusId !== 15 && (
              <>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  All Documents
                </Typography>

                <Box sx={{ maxHeight: '50vh', overflowY: 'auto' }}>
                  {documentTypes.map((doc) => {
                    const docId = doc.documentID;
                    const isUploaded = !!employeeDocuments[docId];
                    
                    if (!isUploaded) return null;
                    
                    return (
                      <Box
                        key={docId}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          mb: 1,
                          borderRadius: 2,
                          border: '1px solid #86efac',
                          bgcolor: '#f0fdf4',
                        }}
                      >
                        <Box sx={{ width: 40, height: 40, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#dcfce7' }}>
                          {getFileIcon(employeeDocuments[docId]?.fileType)}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>{doc.documentName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            📄 {employeeDocuments[docId]?.fileName} • {formatFileSize(employeeDocuments[docId]?.fileSize)}
                          </Typography>
                        </Box>
                                                <Button size="small" variant="outlined" onClick={() => handleViewDocument(doc)} startIcon={<Visibility />}>
                          View
                        </Button>
                      </Box>
                    );
                  })}
                  
                  {Object.keys(employeeDocuments).length === 0 && (
                    <Alert severity="info">No documents uploaded yet.</Alert>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button onClick={() => setShowDocumentsModal(false)}>Close</Button>
                </Box>
              </>
            )}
          </Box>
        )}
      </SharedModal>

      {/* Visa OCR Edit Modal */}
      <VisaOCREditModal
        open={showVisaEditModal}
        onClose={() => setShowVisaEditModal(false)}
        data={visaOCRData}
        onSave={handleSaveVisaOCR}
        loading={savingOCR}
      />

      {/* Document Preview Modal */}
      <SharedModal
        open={showPreviewModal}
        onClose={() => { setShowPreviewModal(false); setPreviewData(null); }}
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
                  style={{ maxWidth: '100%', maxHeight: '55vh', borderRadius: 8 }}
                />
              </Box>
            )}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button variant="outlined" onClick={() => setShowPreviewModal(false)}>Close</Button>
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
    </BaseLayout>
  );
};

export default TravelDeskPortal;