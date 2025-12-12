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
  TextField
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
  Business
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

import { 
  statusToChip, 
  getStatusLabel,
  STATUS_CODES,
  TD_STATUS_GROUPS,
  isInStatusGroup
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
import api from '../../services/apiService';

// ==========================================
// CONSTANTS
// ==========================================
const VISA_DOCUMENT_ID = 10;

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
    13: { icon: <Schedule sx={{ fontSize: 14 }} />, label: 'Awaiting Docs', bg: '#f3f4f6', color: '#6b7280', border: '#d1d5db' },
    14: { icon: <Description sx={{ fontSize: 14 }} />, label: 'Review & Upload Visa', bg: '#fef3c7', color: '#92400e', border: '#fbbf24' },
    10: { icon: <Flight sx={{ fontSize: 14 }} />, label: 'Ready for Booking', bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' },
    11: { icon: <Flight sx={{ fontSize: 14 }} />, label: 'Ready for Booking', bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' },
    12: { icon: <Flight sx={{ fontSize: 14 }} />, label: 'Ready for Booking', bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' },
    15: { icon: <Flight sx={{ fontSize: 14 }} />, label: 'Book Tickets', bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' }
  };
  
  const badge = badges[statusId];
  if (!badge) return null;
  
  return (
    <Chip
      icon={badge.icon}
      label={badge.label}
      size="small"
      sx={{ bgcolor: badge.bg, color: badge.color, fontWeight: 600, fontSize: '0.7rem', border: `1px solid ${badge.border}` }}
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
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isVerified ? (
              <CheckCircle sx={{ color: '#16a34a' }} />
            ) : (
              <Warning sx={{ color: '#f59e0b' }} />
            )}
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
            <Button
              size="small"
              variant="outlined"
              startIcon={<Edit />}
              onClick={onEdit}
              disabled={loading}
            >
              Edit
            </Button>
            {!isVerified && (
              <Button
                size="small"
                variant="contained"
                startIcon={<Verified />}
                onClick={onVerify}
                disabled={loading}
                sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' } }}
              >
                {loading ? 'Verifying...' : 'Verify & Confirm'}
              </Button>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Data Grid */}
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
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">Issuing Country</Typography>
            <Typography variant="body1" fontWeight={600}>{data.issuer || '-'}</Typography>
          </Grid>
        </Grid>

        {/* MRZ Check */}
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
          <TextField
            fullWidth
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange('fullName')}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Visa Number"
            value={formData.visaNumber}
            onChange={handleChange('visaNumber')}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nationality"
            value={formData.nationality}
            onChange={handleChange('nationality')}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange('dateOfBirth')}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Gender"
            select
            value={formData.sex}
            onChange={handleChange('sex')}
            size="small"
            SelectProps={{ native: true }}
          >
            <option value="">Select</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Expiry Date"
            type="date"
            value={formData.expiryDate}
            onChange={handleChange('expiryDate')}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Issuing Country"
            value={formData.issuer}
            onChange={handleChange('issuer')}
            size="small"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => onSave(formData)}
          disabled={loading}
          sx={{ bgcolor: '#3b82f6' }}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </SharedModal>
  );
};

// ==========================================
// EMPLOYEE DETAILS MODAL
// ==========================================
const EmployeeDetailsModal = ({ open, onClose, employeeData, travelData, loading }) => {
  if (loading) {
    return (
      <SharedModal open={open} onClose={onClose} title="Employee Details" maxWidth="md">
        <Box sx={{ p: 2 }}>
          <Skeleton variant="rounded" height={100} sx={{ mb: 2 }} />
          <Skeleton variant="rounded" height={200} />
        </Box>
      </SharedModal>
    );
  }

  return (
    <SharedModal open={open} onClose={onClose} title="Employee & Travel Details" maxWidth="md">
      {employeeData && (
        <Box>
          {/* Employee Info Section */}
          <Card sx={{ mb: 3, border: '1px solid #e2e8f0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <UserAvatar 
                  firstName={employeeData.firstName} 
                  lastName={employeeData.lastName} 
                  size="large" 
                />
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {employeeData.firstName} {employeeData.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {employeeData.designation || 'Employee'}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BadgeIcon sx={{ color: '#64748b', fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Employee ID</Typography>
                      <Typography variant="body2" fontWeight={600}>{employeeData.empId}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email sx={{ color: '#64748b', fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Email</Typography>
                      <Typography variant="body2" fontWeight={600}>{employeeData.email}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone sx={{ color: '#64748b', fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Phone</Typography>
                      <Typography variant="body2" fontWeight={600}>{employeeData.phone || '-'}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business sx={{ color: '#64748b', fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Department</Typography>
                      <Typography variant="body2" fontWeight={600}>{employeeData.department || '-'}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person sx={{ color: '#64748b', fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Reporting Manager</Typography>
                      <Typography variant="body2" fontWeight={600}>{employeeData.reportingManager || '-'}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Travel Details Section */}
          {travelData && (
            <Card sx={{ border: '1px solid #e2e8f0' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Travel Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary">Destination</Typography>
                    <Typography variant="body1" fontWeight={600}>{travelData.destination}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary">Departure Date</Typography>
                    <Typography variant="body1" fontWeight={600}>{travelData.departureDate}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary">Return Date</Typography>
                    <Typography variant="body1" fontWeight={600}>{travelData.returnDate || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary">Purpose</Typography>
                    <Typography variant="body1" fontWeight={600}>{travelData.purpose || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary">Status</Typography>
                    <StatusChipMapped statusId={travelData.statusId} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary">Travel ID</Typography>
                    <Typography variant="body1" fontWeight={600}>{travelData.tId}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </SharedModal>
  );
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
  
  // Visa Upload State
  const [showVisaUploadModal, setShowVisaUploadModal] = useState(false);
  const [uploadingVisa, setUploadingVisa] = useState(false);
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

  // Employee Details Modal State
  const [showEmployeeDetailsModal, setShowEmployeeDetailsModal] = useState(false);
  const [employeeDetailsData, setEmployeeDetailsData] = useState(null);
  const [travelDetailsData, setTravelDetailsData] = useState(null);
  const [loadingEmployeeDetails, setLoadingEmployeeDetails] = useState(false);

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
      awaitingDocs: 0,
      reviewVisa: 0,
      readyForBooking: 0,
      booking: 0,
      completed: 0
    };
    
    pendingRequests?.forEach(req => {
      if (req.statusId === 13) counts.awaitingDocs++;
      if (req.statusId === 14) counts.reviewVisa++;
      if (isInStatusGroup(req.statusId, 'FINAL_APPROVED_READY_FOR_BOOKING')) counts.readyForBooking++;
      if (req.statusId === 15) counts.booking++;
    });
    
    completedRequests?.forEach(req => {
      if (req.statusId === 16 || req.statusId === 17) counts.completed++;
    });
    
    return counts;
  }, [pendingRequests, completedRequests]);

  const sortedPendingRequests = React.useMemo(() => {
    if (!pendingRequests) return [];
    return [...pendingRequests].sort((a, b) => {
      // Priority: 14 (review visa) > 10/11/12 (ready for booking) > 15 (booking) > 13 (awaiting)
      const priorityOrder = { 14: 1, 10: 2, 11: 2, 12: 2, 15: 3, 13: 4 };
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

  // View Employee Details - Fetch Real Data
  const handleViewDetails = async (req) => {
    setShowEmployeeDetailsModal(true);
    setLoadingEmployeeDetails(true);
    setEmployeeDetailsData(null);
    setTravelDetailsData(null);

    try {
      // Fetch employee data
      const empResponse = await api.getEmployeeData(req.employeeId);
      if (empResponse?.status === 'Success' && empResponse?.result) {
        setEmployeeDetailsData(empResponse.result);
      }

      // Fetch travel details
      const travelResponse = await api.getTravelDetailByTId(req.tId);
      if (travelResponse?.status === 'Success' && travelResponse?.result) {
        const travel = Array.isArray(travelResponse.result) 
          ? travelResponse.result[0] 
          : travelResponse.result;
        setTravelDetailsData({
          tId: travel.tId,
          destination: travel.destination,
          departureDate: travel.fromDate,
          returnDate: travel.toDate,
          purpose: travel.purpose || travel.travelPurpose,
          statusId: travel.statusId || travel.status
        });
      }
    } catch (error) {
      console.error('Error fetching details:', error);
      toast.error('Failed to load employee details');
    } finally {
      setLoadingEmployeeDetails(false);
    }
  };

  // View Employee Documents & Load Visa OCR
  const handleViewEmployeeDocuments = async (req) => {
    setSelectedEmployee(req);
    setShowDocumentsModal(true);
    setLoadingEmployeeDocs(true);
    setVisaOCRData(null);
    setVisaVerified(false);

    try {
      const types = await documentService.getAllDocumentTypesForHelpDesk();
      setDocumentTypes(types);
      
      const docs = await documentService.getHelpDeskEmployeeDocuments(req.employeeId);
      setEmployeeDocuments(docs);
      
      // Load Visa OCR if visa is uploaded
      if (docs[VISA_DOCUMENT_ID]) {
        try {
          const visaInfo = await documentService.getVisaOCRInfo(req.employeeId);
          if (visaInfo?.status === 'Success' && visaInfo?.result) {
            setVisaOCRData(visaInfo.result);
            setVisaVerified(visaInfo.result.isVerified ?? false);
          }
        } catch (e) {
          console.log('Visa OCR not available yet');
        }
      }
    } catch (error) {
      toast.error('Failed to load documents');
    } finally {
      setLoadingEmployeeDocs(false);
    }
  };

  // View Document Preview
  const handleViewDocument = async (doc) => {
    const uploaded = employeeDocuments[doc.id];
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
      const fileData = await documentService.getHelpDeskDocumentWithContent(selectedEmployee.employeeId, doc.id);
      
      if (fileData?.base64String) {
        setEmployeeDocuments(prev => ({
          ...prev,
          [doc.id]: { ...prev[doc.id], base64String: fileData.base64String, fileType: fileData.fileType }
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

  // Handle Visa Upload
  const handleVisaUpload = async (file) => {
    if (!selectedEmployee) return;

    const validation = documentService.validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setUploadingVisa(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await documentService.helpDeskUploadVisa(selectedEmployee.employeeId, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setEmployeeDocuments(prev => ({
        ...prev,
        [VISA_DOCUMENT_ID]: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadedAt: new Date().toISOString()
        }
      }));

      toast.success('Visa uploaded successfully! OCR data will be available shortly.');

      // Try to fetch OCR data after upload
      setTimeout(async () => {
        try {
          const visaInfo = await documentService.getVisaOCRInfo(selectedEmployee.employeeId);
          if (visaInfo?.status === 'Success' && visaInfo?.result) {
            setVisaOCRData(visaInfo.result);
          }
        } catch (e) {
          console.log('OCR processing...');
        }
      }, 2000);

      setShowVisaUploadModal(false);
      setUploadProgress(0);
    } catch (error) {
      toast.error(error.message || 'Failed to upload visa');
    } finally {
      setUploadingVisa(false);
    }
  };

  // Dropzone for Visa
  const onDropVisa = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast.error(rejectedFiles[0].errors[0].message);
      return;
    }
    if (acceptedFiles.length > 0) handleVisaUpload(acceptedFiles[0]);
  }, [selectedEmployee]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropVisa,
    accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'], 'application/pdf': ['.pdf'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    disabled: uploadingVisa
  });

  // Save Visa OCR Edits
  const handleSaveVisaOCR = async (formData) => {
    setSavingOCR(true);
    try {
      await documentService.updateVisaOCRInfo(selectedEmployee.employeeId, formData);
      setVisaOCRData(prev => ({ ...prev, ...formData }));
      toast.success('Visa info updated!');
      setShowVisaEditModal(false);
    } catch (error) {
      toast.error('Failed to update visa info');
    } finally {
      setSavingOCR(false);
    }
  };

  // Verify Visa OCR & Move to Final Approval (Status 7)
  // Verify Visa OCR & Move to Final Approval (Status 7)
const handleVerifyVisaAndInitiateFinalApproval = async () => {
  if (!selectedEmployee || !visaOCRData) return;

  setLoadingOCR(true);
  try {
    // Update visa with verified flag
    const data = { ...visaOCRData, compositeCheck: true };
    await documentService.updateVisaOCRInfo(selectedEmployee.employeeId, data);
    
    // Move to Status 7 (Final Initiated for Manager)
    await dispatch(processBooking({ 
      tId: selectedEmployee.tId, 
      newStatus: 7,
      empId: selectedEmployee.employeeId  // ✅ ADD THIS
    })).unwrap();
    
    setVisaVerified(true);
    toast.success('Visa verified! Sent for final manager approval.');
    setShowDocumentsModal(false);
    dispatch(fetchTravelDeskData());
  } catch (error) {
    toast.error('Failed to verify visa');
  } finally {
    setLoadingOCR(false);
  }
};

  // Reject Visa (Status 18)
 const handleRejectVisa = async () => {
  try {
    await dispatch(processBooking({ 
      tId: selectedEmployee.tId, 
      newStatus: 18,
      empId: selectedEmployee.employeeId  // ✅ ADD THIS
    })).unwrap();
    toast.success('Visa rejected');
    setShowDocumentsModal(false);
  } catch (err) {
    toast.error('Failed to reject visa');
  }
};

  // Start Booking (for status 10/11/12 - after final approval)
const handleStartBooking = async (req) => {
  try {
    await dispatch(processBooking({ 
      tId: req.tId, 
      newStatus: 15,
      empId: req.employeeId  // ✅ ADD THIS
    })).unwrap();
    toast.success('Moved to booking phase!');
  } catch (err) {
    toast.error('Failed to start booking');
  }
};

  // Upload Tickets & Complete (Status 16 → 17)
  const handleUploadTicketsAndComplete = async (req) => {
  try {
    await dispatch(processBooking({ 
      tId: req.tId, 
      newStatus: 16,
      empId: req.employeeId  // ✅ ADD THIS
    })).unwrap();
    
    await dispatch(processBooking({ 
      tId: req.tId, 
      newStatus: 17,
      empId: req.employeeId  // ✅ ADD THIS
    })).unwrap();
    
    toast.success('Travel marked as completed!');
  } catch (err) {
    toast.error('Failed to complete');
  }
};

  // Utilities
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

  const getCardStyle = (statusId) => {
    const styles = {
      13: { bg: '#f9fafb', border: '#d1d5db', borderLeft: '4px solid #9ca3af' },
      14: { bg: '#fffbeb', border: '#f59e0b', borderLeft: '4px solid #f59e0b' },
      10: { bg: '#dbeafe', border: '#3b82f6', borderLeft: '4px solid #3b82f6' },
      11: { bg: '#dbeafe', border: '#3b82f6', borderLeft: '4px solid #3b82f6' },
      12: { bg: '#dbeafe', border: '#3b82f6', borderLeft: '4px solid #3b82f6' },
      15: { bg: '#eff6ff', border: '#3b82f6', borderLeft: '4px solid #3b82f6' },
      16: { bg: '#f0fdf4', border: '#22c55e', borderLeft: '4px solid #22c55e' },
      17: { bg: '#f0fdf4', border: '#16a34a', borderLeft: '4px solid #16a34a' },
      18: { bg: '#fef2f2', border: '#ef4444', borderLeft: '4px solid #ef4444' }
    };
    return styles[statusId] || { bg: '#ffffff', border: '#e5e7eb', borderLeft: '1px solid #e5e7eb' };
  };

  const getActionButton = (req) => {
    const { statusId } = req;
    
    switch (statusId) {
      case 13:
        return (
          <Tooltip title="Waiting for employee to upload documents">
            <span>
              <SharedButton variant="outlined" disabled sx={{ mr: 1 }}>
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
            Upload Visa & Verify
          </SharedButton>
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
            onClick={() => handleUploadTicketsAndComplete(req)}
            disabled={bookingInProgress}
            startIcon={<Done />}
            sx={{ bgcolor: "#16a34a", mr: 1 }}
          >
            {bookingInProgress ? "Processing..." : "Complete & Upload Tickets"}
          </SharedButton>
        );
        
      default:
        return null;
    }
  };

  const isVisaUploaded = employeeDocuments[VISA_DOCUMENT_ID];

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
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6} md={2.4}>
              <StatsCard title="Awaiting Docs" value={statusCounts.awaitingDocs} icon={<Schedule sx={{ color: '#6b7280', fontSize: 28 }} />} color="#6b7280" bgColor="#f9fafb" />
            </Grid>
            <Grid item xs={6} md={2.4}>
              <StatsCard title="Review & Visa" value={statusCounts.reviewVisa} icon={<Description sx={{ color: '#f59e0b', fontSize: 28 }} />} color="#f59e0b" bgColor="#fffbeb" />
            </Grid>
            <Grid item xs={6} md={2.4}>
              <StatsCard title="Ready to Book" value={statusCounts.readyForBooking} icon={<Flight sx={{ color: '#3b82f6', fontSize: 28 }} />} color="#3b82f6" bgColor="#dbeafe" />
            </Grid>
            <Grid item xs={6} md={2.4}>
              <StatsCard title="Booking" value={statusCounts.booking} icon={<FlightTakeoff sx={{ color: '#8b5cf6', fontSize: 28 }} />} color="#8b5cf6" bgColor="#f5f3ff" />
            </Grid>
            <Grid item xs={6} md={2.4}>
              <StatsCard title="Completed" value={statusCounts.completed} icon={<CheckCircle sx={{ color: '#16a34a', fontSize: 28 }} />} color="#16a34a" bgColor="#f0fdf4" />
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
                                    onClick={() => handleViewDetails(req)} 
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
                                  <SharedButton variant="outlined" onClick={() => handleViewDetails(req)} startIcon={<Visibility />}>
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
          DOCUMENTS & VISA MODAL
      ========================================== */}
      <SharedModal
        open={showDocumentsModal}
        onClose={() => setShowDocumentsModal(false)}
        title={`Documents & Visa Verification - ${selectedEmployee?.employee || 'Employee'}`}
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

            {/* VISA SECTION - ON TOP */}
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FlightTakeoff sx={{ color: '#f59e0b' }} />
              Visa Upload & Verification
            </Typography>

            {/* Visa Upload Card */}
            <Card sx={{ mb: 3, border: isVisaUploaded ? '2px solid #86efac' : '2px dashed #fbbf24', bgcolor: isVisaUploaded ? '#f0fdf4' : '#fffbeb' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isVisaUploaded ? '#dcfce7' : '#fef3c7',
                    }}>
                      {isVisaUploaded ? getFileIcon(employeeDocuments[VISA_DOCUMENT_ID]?.fileType) : <CloudUpload sx={{ fontSize: 28, color: '#f59e0b' }} />}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>Visa Document</Typography>
                      {isVisaUploaded ? (
                        <Typography variant="body2" color="text.secondary">
                          📄 {employeeDocuments[VISA_DOCUMENT_ID].fileName} • {formatFileSize(employeeDocuments[VISA_DOCUMENT_ID].fileSize)}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Upload visa to proceed with verification
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {isVisaUploaded && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewDocument({ id: VISA_DOCUMENT_ID })}
                        startIcon={<Visibility />}
                      >
                        View
                      </Button>
                    )}
                    <Button
                      variant={isVisaUploaded ? "outlined" : "contained"}
                      onClick={() => setShowVisaUploadModal(true)}
                      startIcon={<CloudUpload />}
                      sx={isVisaUploaded ? { borderColor: '#16a34a', color: '#16a34a' } : { bgcolor: '#f59e0b', '&:hover': { bgcolor: '#d97706' } }}
                    >
                      {isVisaUploaded ? 'Replace' : 'Upload Visa'}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Visa OCR Verification */}
            <Box sx={{ mb: 3 }}>
              <VisaOCRCard
                data={visaOCRData}
                isVerified={visaVerified}
                onEdit={() => setShowVisaEditModal(true)}
                onVerify={handleVerifyVisaAndInitiateFinalApproval}
                loading={loadingOCR}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Other Documents List */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Employee Documents ({Object.keys(employeeDocuments).filter(id => parseInt(id) !== VISA_DOCUMENT_ID).length})
            </Typography>

            <Box sx={{ maxHeight: '30vh', overflowY: 'auto', pr: 1, mb: 3 }}>
              {documentTypes
                .filter(doc => doc.id !== VISA_DOCUMENT_ID)
                .map((doc) => {
                  const uploaded = employeeDocuments[doc.id];
                  const isUploaded = !!uploaded;
                  
                  return (
                    <Box
                      key={doc.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        mb: 1,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: isUploaded ? '#86efac' : '#e2e8f0',
                        bgcolor: isUploaded ? '#f0fdf4' : '#fafafa',
                      }}
                    >
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: isUploaded ? '#dcfce7' : '#f3f4f6',
                      }}>
                        {isUploaded ? getFileIcon(uploaded.fileType) : <Description sx={{ color: '#9ca3af' }} />}
                      </Box>

                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle2" fontWeight={600}>{doc.name}</Typography>
                          <Chip
                            size="small"
                            label={isUploaded ? 'Uploaded' : 'Missing'}
                            sx={{
                              height: 20,
                              fontSize: '0.65rem',
                              bgcolor: isUploaded ? '#dcfce7' : '#fee2e2',
                              color: isUploaded ? '#16a34a' : '#dc2626',
                            }}
                          />
                        </Box>
                        {isUploaded && (
                          <Typography variant="caption" color="text.secondary">
                            📄 {uploaded.fileName} • {formatFileSize(uploaded.fileSize)}
                          </Typography>
                        )}
                      </Box>

                      {isUploaded && (
                        <Tooltip title="View Document">
                          <IconButton size="small" onClick={() => handleViewDocument(doc)} disabled={loadingPreview}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  );
                })}
            </Box>

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
                  disabled={bookingInProgress || !isVisaUploaded}
                >
                  Reject Visa
                </Button>
                
                <Tooltip title={!isVisaUploaded ? "Upload visa first" : !visaOCRData ? "OCR data not available" : "Verify visa and send for final approval"}>
                  <span>
                    <Button
                      variant="contained"
                      onClick={handleVerifyVisaAndInitiateFinalApproval}
                      disabled={!isVisaUploaded || !visaOCRData || visaVerified || loadingOCR}
                      startIcon={<Verified />}
                      sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' } }}
                    >
                      {loadingOCR ? 'Processing...' : 'Verify & Send for Final Approval'}
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            </Box>
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

      {/* Visa Upload Modal */}
      <SharedModal
        open={showVisaUploadModal}
        onClose={() => !uploadingVisa && setShowVisaUploadModal(false)}
        title="Upload Visa Document"
        maxWidth="sm"
      >
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? '#f59e0b' : uploadingVisa ? '#94a3b8' : '#cbd5e1',
            borderRadius: 2,
            p: 6,
            textAlign: 'center',
            cursor: uploadingVisa ? 'not-allowed' : 'pointer',
            bgcolor: isDragActive ? '#fffbeb' : '#f8fafc',
            opacity: uploadingVisa ? 0.7 : 1,
          }}
        >
          <input {...getInputProps()} />
          {uploadingVisa ? (
            <Box>
              <CircularProgress size={48} sx={{ mb: 2, color: '#f59e0b' }} />
              <Typography variant="h6" color="text.secondary">Uploading Visa... {uploadProgress}%</Typography>
              <Box sx={{ mt: 2, height: 8, borderRadius: 4, bgcolor: '#e2e8f0', overflow: 'hidden' }}>
                <Box sx={{ width: `${uploadProgress}%`, height: '100%', bgcolor: '#f59e0b', borderRadius: 4 }} />
              </Box>
            </Box>
          ) : (
            <Box>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ p: 2, bgcolor: isDragActive ? '#f59e0b' : '#fef3c7', borderRadius: '50%', color: isDragActive ? 'white' : '#f59e0b' }}>
                  <UploadFile fontSize="large" />
                </Box>
              </Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {isDragActive ? 'Drop the Visa file here!' : 'Drag & drop or click to upload Visa'}
              </Typography>
              <Typography variant="body2" color="text.secondary">Supported: PNG, JPG, PDF (Max 5MB)</Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => setShowVisaUploadModal(false)} disabled={uploadingVisa}>Cancel</Button>
        </Box>
      </SharedModal>

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

      {/* Employee Details Modal */}
      <EmployeeDetailsModal
        open={showEmployeeDetailsModal}
        onClose={() => setShowEmployeeDetailsModal(false)}
        employeeData={employeeDetailsData}
        travelData={travelDetailsData}
        loading={loadingEmployeeDetails}
      />
    </BaseLayout>
  );
};

export default TravelDeskPortal;