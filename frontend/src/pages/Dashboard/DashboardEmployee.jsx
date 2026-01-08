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
  Warning as WarningIcon,
  Hotel as HotelIcon,
  FlightTakeoff as FlightTakeoffIcon,
  HealthAndSafety as InsuranceIcon,
  Badge as VisaIcon,
  CalendarMonth as AppointmentIcon,
  FolderOpen as FolderIcon,
  Pending as PendingIcon,
  HourglassEmpty as WaitingIcon
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
  canEmployeeUploadDocuments,
  getStepperConfig,
  getStatusConfig,
  STATUS_CODES,
  DOCUMENT_IDS,
  DOCUMENT_GROUPS,
  ROLE_IDS,
  ACTIONS,
  canPerformAction
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
const OPTIONAL_DOCUMENT_NAMES = ['visa'];
const OPTIONAL_DOCUMENT_IDS = [1];
const PASSPORT_DOCUMENT_ID = 1;

// Document names mapping for display
const DOCUMENT_NAMES = {
  [DOCUMENT_IDS.PASSPORT]: 'Passport',
  [DOCUMENT_IDS.INVITATION_LETTER]: 'Invitation Letter',
  [DOCUMENT_IDS.COVER_LETTER]: 'Cover Letter',
  [DOCUMENT_IDS.KT_PLAN]: 'KT Plan',
  [DOCUMENT_IDS.HOTEL_BOOKING]: 'Hotel Booking',
  [DOCUMENT_IDS.FLIGHT_BOOKING]: 'Flight Booking',
  [DOCUMENT_IDS.TRAVEL_INSURANCE]: 'Travel Insurance',
  [DOCUMENT_IDS.VISA_FORM]: 'Visa Form',
  [DOCUMENT_IDS.LETTER_OF_INTENT]: 'Letter of Intent',
  [DOCUMENT_IDS.VISA]: 'Visa',
  [DOCUMENT_IDS.INSURANCE_DECLARATION]: 'Insurance Declaration',
  [DOCUMENT_IDS.VISA_APPOINTMENT]: 'Visa Appointment',
};

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
// OCR DATA CARD COMPONENT (same as before)
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
// UPDATED DOCUMENT SECTION COMPONENT
// Shows ALL documents (uploaded + pending)
// ==========================================
const DocumentSection = ({
  title,
  icon,
  documentIds,  // Changed from documents to documentIds array
  documentTypes,
  uploadedDocuments,
  onView,
  onDownload,
  bgColor = '#f8fafc',
  borderColor = '#e2e8f0',
  chipColor = '#3b82f6',
  chipBgColor = '#eff6ff',
  showPending = false,  // Whether to show pending/not-uploaded docs
  pendingMessage = 'Pending from Travel Desk'
}) => {
  const getFileIcon = (fileType, docId) => {
    const iconMap = {
      [DOCUMENT_IDS.PASSPORT]: <Description sx={{ fontSize: 24, color: chipColor }} />,
      [DOCUMENT_IDS.HOTEL_BOOKING]: <HotelIcon sx={{ fontSize: 24, color: chipColor }} />,
      [DOCUMENT_IDS.FLIGHT_BOOKING]: <FlightTakeoffIcon sx={{ fontSize: 24, color: chipColor }} />,
      [DOCUMENT_IDS.TRAVEL_INSURANCE]: <InsuranceIcon sx={{ fontSize: 24, color: chipColor }} />,
      [DOCUMENT_IDS.VISA]: <VisaIcon sx={{ fontSize: 24, color: chipColor }} />,
      [DOCUMENT_IDS.VISA_APPOINTMENT]: <AppointmentIcon sx={{ fontSize: 24, color: chipColor }} />,
    };

    if (iconMap[docId]) return iconMap[docId];
    if (!fileType) return <Description sx={{ fontSize: 24, color: chipColor }} />;
    if (fileType.includes('pdf')) return <PictureAsPdf sx={{ fontSize: 24, color: '#ef4444' }} />;
    if (fileType.includes('image')) return <ImageIcon sx={{ fontSize: 24, color: '#3b82f6' }} />;
    return <Description sx={{ fontSize: 24, color: '#64748b' }} />;
  };

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

  if (!documentIds || documentIds.length === 0) return null;

  // Get documents info
  const documentsToShow = documentIds.map(docId => {
    const docType = documentTypes.find(d => d.id === docId);
    const uploaded = uploadedDocuments[docId];
    const isUploaded = !!uploaded;

    return {
      id: docId,
      name: docType?.name || DOCUMENT_NAMES[docId] || `Document ${docId}`,
      isUploaded,
      uploaded
    };
  });

  // Filter based on showPending
  const filteredDocs = showPending
    ? documentsToShow
    : documentsToShow.filter(d => d.isUploaded);

  if (filteredDocs.length === 0) return null;

  const uploadedCount = documentsToShow.filter(d => d.isUploaded).length;

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box sx={{
          p: 1,
          borderRadius: 1.5,
          bgcolor: chipBgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
        <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#1e293b' }}>
          {title}
        </Typography>
        <Chip
          size="small"
          label={`${uploadedCount}/${documentIds.length} files`}
          sx={{
            bgcolor: uploadedCount === documentIds.length ? '#dcfce7' : chipBgColor,
            color: uploadedCount === documentIds.length ? '#16a34a' : chipColor,
            fontWeight: 600
          }}
        />
      </Box>

      {filteredDocs.map((doc, index) => (
        <motion.div
          key={doc.id}
          variants={documentCardVariants}
          custom={index}
          whileHover={doc.isUploaded ? "hover" : undefined}
          style={{ marginBottom: 8 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: 2,
              border: `1px solid ${doc.isUploaded ? borderColor : '#fde68a'}`,
              bgcolor: doc.isUploaded ? bgColor : '#fffbeb',
              transition: 'all 0.2s ease',
              opacity: doc.isUploaded ? 1 : 0.8,
            }}
          >
            {/* Document Icon */}
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: doc.isUploaded ? chipBgColor : '#fef3c7',
                flexShrink: 0,
              }}
            >
              {doc.isUploaded ? (
                getFileIcon(doc.uploaded?.fileType, doc.id)
              ) : (
                <WaitingIcon sx={{ fontSize: 24, color: '#f59e0b' }} />
              )}
            </Box>

            {/* Document Info */}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#1e293b' }}>
                  {doc.name}
                </Typography>
                <Chip
                  size="small"
                  icon={doc.isUploaded ? <CheckCircle sx={{ fontSize: 12 }} /> : <PendingIcon sx={{ fontSize: 12 }} />}
                  label={doc.isUploaded ? 'Uploaded' : 'Pending'}
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    bgcolor: doc.isUploaded ? '#dcfce7' : '#fef3c7',
                    color: doc.isUploaded ? '#16a34a' : '#d97706',
                  }}
                />
              </Box>

              {doc.isUploaded ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    {doc.uploaded?.fileName || 'Document'}
                  </Typography>
                  {doc.uploaded?.fileSize && (
                    <>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>•</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {formatFileSize(doc.uploaded.fileSize)}
                      </Typography>
                    </>
                  )}
                  {doc.uploaded?.uploadedAt && (
                    <>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>•</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {formatDate(doc.uploaded.uploadedAt)}
                      </Typography>
                    </>
                  )}
                </Box>
              ) : (
                <Typography variant="caption" sx={{ color: '#d97706' }}>
                  {pendingMessage}
                </Typography>
              )}
            </Box>

            {/* Action Buttons - Only for uploaded */}
            {doc.isUploaded && (
              <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                <Tooltip title="View">
                  <IconButton
                    size="small"
                    onClick={() => onView({ id: doc.id, name: doc.name })}
                    sx={{
                      color: '#3b82f6',
                      bgcolor: '#eff6ff',
                      '&:hover': { bgcolor: '#dbeafe' }
                    }}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download">
                  <IconButton
                    size="small"
                    onClick={() => onDownload({ id: doc.id, name: doc.name })}
                    sx={{
                      color: '#16a34a',
                      bgcolor: '#f0fdf4',
                      '&:hover': { bgcolor: '#dcfce7' }
                    }}
                  >
                    <Download fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </motion.div>
      ))}
    </Box>
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
  const [travelDeskDocuments, setTravelDeskDocuments] = useState({});
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showViewOnlyModal, setShowViewOnlyModal] = useState(false);

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

  // Can view all documents (status 15+)
  const canViewAllDocuments = useMemo(() => {
    return currentStatus >= 15;
  }, [currentStatus]);

  // Check if all required documents are uploaded
  const allRequiredUploaded = useMemo(() => {
    if (!documentTypes || documentTypes.length === 0) return false;
    const requiredDocs = documentTypes.filter(d => d.required === true);
    if (requiredDocs.length === 0) {
      return Object.keys(uploadedDocuments).length > 0;
    }
    return requiredDocs.every(doc => !!uploadedDocuments[doc.id]);
  }, [documentTypes, uploadedDocuments]);

  const isPassportVerified = useMemo(() => {
    const passportUploaded = !!uploadedDocuments[PASSPORT_DOCUMENT_ID];
    return passportUploaded && isOCRVerified;
  }, [uploadedDocuments, isOCRVerified]);

  const canSubmitDocuments = useMemo(() => {
    return allRequiredUploaded && isPassportVerified;
  }, [allRequiredUploaded, isPassportVerified]);

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

  // Combine all documents for viewing
  const allDocuments = useMemo(() => {
    return {
      ...uploadedDocuments,
      ...travelDeskDocuments
    };
  }, [uploadedDocuments, travelDeskDocuments]);

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

  useEffect(() => {
    if (showViewOnlyModal && user?.empId) {
      fetchAllDocumentsForView();
    }
  }, [showViewOnlyModal, user?.empId]);

  useEffect(() => {
    if (uploadedDocuments[PASSPORT_DOCUMENT_ID] && !passportOCRData && !loadingOCR) {
      fetchPassportOCR();
    }
  }, [uploadedDocuments]);

  // ==========================================
  // HANDLERS
  // ==========================================

  // Fetch all documents for view-only mode (status 15+)
  const fetchAllDocumentsForView = async () => {
    setLoadingDocs(true);
    try {
      // Fetch document types
      let types = await documentService.getAllDocumentTypes();
      types = types.map(doc => {
        const isOptionalByName = OPTIONAL_DOCUMENT_NAMES.some(name =>
          doc.name.toLowerCase().trim() === name.toLowerCase().trim()
        );
        const isOptionalById = OPTIONAL_DOCUMENT_IDS.includes(doc.id);
        return { ...doc, required: !(isOptionalByName || isOptionalById) };
      });
      setDocumentTypes(types);

      // Fetch employee uploaded documents
      if (user?.empId) {
        try {
          const uploadedMap = await documentService.getEmployeeUploadedDocuments(user.empId);
          if (uploadedMap && typeof uploadedMap === 'object') {
            setUploadedDocuments(uploadedMap);
            console.log('📋 Employee documents:', Object.keys(uploadedMap));
          }
        } catch (err) {
          console.log('📋 No employee documents found');
        }
      }

      // Fetch travel desk documents
      const tId = activeRequest?.travelId || activeRequest?.tId || recentRequests[0]?.travelId;
      if (tId && currentStatus >= 15) {
        console.log('📋 Fetching TD documents for tId:', tId);
        await fetchTravelDeskDocuments(tId);
      }

    } catch (error) {
      console.error('❌ Error fetching documents:', error);
      showSnackbarMessage('Failed to load documents', 'error');
    } finally {
      setLoadingDocs(false);
    }
  };

  // Fetch Travel Desk documents (Visa, Hotel, Flight, Insurance)
  const fetchTravelDeskDocuments = async (tId) => {
    const tdDocIds = [...DOCUMENT_GROUPS.TD_ALL];
    const tdDocsMap = {};

    console.log('📋 Fetching TD documents:', tdDocIds);

    for (const docId of tdDocIds) {
      try {
        // Try to get document with content
        const docData = await documentService.getDocumentWithContent(user.empId, docId, tId);

        if (docData && (docData.base64String || docData.fileName)) {
          tdDocsMap[docId] = {
            fileName: docData.fileName || DOCUMENT_NAMES[docId] || `document_${docId}`,
            fileType: docData.fileType || 'application/pdf',
            fileSize: docData.fileSize,
            base64String: docData.base64String,
            uploadedAt: docData.uploadedAt || new Date().toISOString()
          };
          console.log(`✅ TD Document ${docId} found:`, tdDocsMap[docId].fileName);
        }
      } catch (err) {
        console.log(`📋 TD Document ${docId} not uploaded yet`);
      }
    }

    if (Object.keys(tdDocsMap).length > 0) {
      setTravelDeskDocuments(tdDocsMap);
      console.log('📋 Total TD documents loaded:', Object.keys(tdDocsMap).length);
    }
  };

  // Fetch documents data with required/optional flag
  const fetchDocumentsData = async () => {
    setLoadingDocs(true);
    try {
      let types = await documentService.getAllDocumentTypes();

      types = types.map(doc => {
        const isOptionalByName = OPTIONAL_DOCUMENT_NAMES.some(name =>
          doc.name.toLowerCase().trim() === name.toLowerCase().trim()
        );
        const isOptionalById = OPTIONAL_DOCUMENT_IDS.includes(doc.id);
        return { ...doc, required: !(isOptionalByName || isOptionalById) };
      });

      setDocumentTypes(types);

      if (user?.empId) {
        try {
          const uploadedMap = await documentService.getEmployeeUploadedDocuments(user.empId);
          if (uploadedMap && typeof uploadedMap === 'object') {
            setUploadedDocuments(uploadedMap);
          }
        } catch (err) {
          console.log('📋 No uploaded documents found');
        }

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
        setIsOCRVerified(false);
      }
    } catch (error) {
      console.log('📋 No passport OCR data found');
    } finally {
      setLoadingOCR(false);
    }
  };

  const handleOpenViewOnlyDocuments = () => {
    setShowViewOnlyModal(true);
  };

  const handleEditOCR = () => {
    setIsEditingOCR(true);
    setEditedOCRData({ ...passportOCRData });
  };

  const handleSaveOCR = async () => {
    try {
      showSnackbarMessage('Saving passport data...', 'info');
      const response = await documentService.updatePassportOCRInfo(user.empId, editedOCRData);

      if (response.status === 'Success' || response.Status === 'Success') {
        setPassportOCRData(editedOCRData);
        setIsEditingOCR(false);
        showSnackbarMessage('Passport data updated successfully!', 'success');
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating OCR data:', error);
      showSnackbarMessage(error.message || 'Failed to update passport data', 'error');
    }
  };

  const handleCancelOCR = () => {
    setEditedOCRData({ ...passportOCRData });
    setIsEditingOCR(false);
  };

  const handleOCRFieldChange = (field, value) => {
    setEditedOCRData(prev => ({ ...prev, [field]: value }));
  };

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

      if (selectedDoc.id === PASSPORT_DOCUMENT_ID) {
        showSnackbarMessage('Processing passport with OCR...', 'info');
        setIsOCRVerified(false);
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
    const docId = doc.id || doc.documentID;
    const uploaded = allDocuments[docId];
    if (!uploaded) {
      showSnackbarMessage('Document not available', 'warning');
      return;
    }

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

      const tId = activeRequest?.travelId || activeRequest?.tId;
      const fileData = await documentService.getDocumentWithContent(user.empId, docId, tId);

      if (fileData && fileData.base64String) {
        // Update appropriate state
        if (DOCUMENT_GROUPS.TD_ALL.includes(docId)) {
          setTravelDeskDocuments(prev => ({
            ...prev,
            [docId]: { ...prev[docId], base64String: fileData.base64String, fileType: fileData.fileType }
          }));
        } else {
          setUploadedDocuments(prev => ({
            ...prev,
            [docId]: { ...prev[docId], base64String: fileData.base64String, fileType: fileData.fileType }
          }));
        }

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

  const handleDownloadDocument = async (doc) => {
    const docId = doc.id || doc.documentID;
    const uploaded = allDocuments[docId];

    if (!uploaded) {
      showSnackbarMessage('Document not available for download', 'warning');
      return;
    }

    try {
      let base64Data = uploaded?.base64String;

      if (!base64Data) {
        const tId = activeRequest?.travelId || activeRequest?.tId;
        const fileData = await documentService.getDocumentWithContent(user.empId, docId, tId);
        base64Data = fileData?.base64String;
      }

      if (base64Data) {
        const link = document.createElement('a');
        link.href = `data:${uploaded?.fileType || 'application/pdf'};base64,${base64Data}`;
        link.download = uploaded?.fileName || `${doc.name}.pdf`;
        link.click();
        showSnackbarMessage('Document downloaded!', 'success');
      } else {
        showSnackbarMessage('Document not available for download', 'warning');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      showSnackbarMessage('Failed to download document', 'error');
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

  const handleSubmitDocuments = async () => {
  if (!canSubmitDocuments) {
    if (!allRequiredUploaded) {
      showSnackbarMessage('Please upload all required documents before submitting.', 'error');
    } else if (!isPassportVerified) {
      showSnackbarMessage('Please verify your passport OCR data before submitting.', 'error');
    }
    return;
  }

  // ✅ DEBUG: Log all possible sources
  console.log('🔍 DEBUG - activeRequest:', activeRequest);
  console.log('🔍 DEBUG - recentRequests[0]:', recentRequests[0]);
  console.log('🔍 DEBUG - user:', user);

  // ✅ FIX: Try multiple field names
  const tId = activeRequest?.travelId || 
              activeRequest?.tId || 
              activeRequest?.TId ||
              recentRequests[0]?.travelId || 
              recentRequests[0]?.tId ||
              recentRequests[0]?.TId;
  
  const empId = activeRequest?.employeeId || 
                activeRequest?.empId || 
                activeRequest?.EmpId ||
                recentRequests[0]?.employeeId ||
                recentRequests[0]?.empId || 
                recentRequests[0]?.EmpId ||
                user?.empId ||
                user?.EmpId;

  // ✅ DEBUG: Log extracted values
  console.log('🔍 DEBUG - Extracted tId:', tId);
  console.log('🔍 DEBUG - Extracted empId:', empId);

  if (!tId) {
    showSnackbarMessage('No active travel request found. tId is missing.', 'error');
    console.error('❌ tId is undefined/null');
    return;
  }

  if (!empId) {
    showSnackbarMessage('Employee ID not found.', 'error');
    console.error('❌ empId is undefined/null');
    return;
  }

  setIsSubmitting(true);

  try {
    console.log('📤 Calling submitDocumentsThunk with:', { tId, empId });
    const result = await dispatch(submitDocumentsThunk({ tId, empId })).unwrap();

    if (result.success) {
      showSnackbarMessage('Documents submitted successfully! Helpdesk will review.', 'success');
      setTimeout(() => setShowDocumentsModal(false), 2000);
    }
  } catch (error) {
    console.error('❌ Submit documents error:', error);
    showSnackbarMessage(error || 'Failed to submit documents.', 'error');
  } finally {
    setIsSubmitting(false);
  }
};

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      showSnackbarMessage(rejectedFiles[0].errors[0].message, 'error');
      return;
    }
    if (acceptedFiles.length > 0) {
      handleFileUpload(acceptedFiles[0]);
    }
  }, [selectedDoc, user?.empId, uploadedDocuments]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'], 'application/pdf': ['.pdf'] },
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
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return <Description sx={{ fontSize: 28, color: '#b91c1c' }} />;
    if (fileType.includes('pdf')) return <PictureAsPdf sx={{ fontSize: 28, color: '#ef4444' }} />;
    if (fileType.includes('image')) return <ImageIcon sx={{ fontSize: 28, color: '#3b82f6' }} />;
    return <Description sx={{ fontSize: 28, color: '#64748b' }} />;
  };

  const getStatusInfo = (status) => statusToChip(status);

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

      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
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
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <StatusChip label={user?.role || 'EMPLOYEE'} variant="default" />
                </motion.div>
              </Box>
            </Box>
          </motion.div>

          {/* Active Application Card */}
          <AnimatePresence mode="wait">
            {activeRequest ? (
              <motion.div key="active-request" variants={cardVariants} initial="initial" animate="animate" whileHover="hover">
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
                        sx={{ bgcolor: getStatusInfo(currentStatus).bgColor, fontWeight: 600 }}
                      />
                    </motion.div>
                  </Box>

                  {/* Stepper */}
                  <Box sx={{ width: '100%', mb: 4 }}>
                    <Stepper activeStep={stepperConfig.activeStep} alternativeLabel>
                      {stepperConfig.steps.map((label, index) => (
                        <Step key={index} completed={stepperConfig.completed[index]}>
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                            <StepLabel>{label}</StepLabel>
                          </motion.div>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>

                  {/* Travel Details */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
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
                      <strong>Action Required:</strong> Please upload your documents and verify passport OCR data to proceed.
                    </Alert>
                  )}

                  {currentStatus === 14 && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                      <strong>Documents Submitted:</strong> Helpdesk is reviewing your documents.
                    </Alert>
                  )}

                  {currentStatus === 15 && (
                    <Alert severity="info" sx={{ mb: 3 }} icon={<Flight />}>
                      <strong>Booking In Progress:</strong> Travel desk is booking your flights and hotels.
                    </Alert>
                  )}

                  {currentStatus >= 16 && (
                    <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircle />}>
                      <strong>Tickets Ready:</strong> Your bookings are complete. View all documents below.
                    </Alert>
                  )}

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                    {canUpload && (
                      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <Button
                          variant="contained"
                          startIcon={<CloudUpload />}
                          onClick={() => setShowDocumentsModal(true)}
                          sx={{ bgcolor: '#b91c1c', '&:hover': { bgcolor: '#991b1b' }, px: 4, py: 1.5 }}
                        >
                          Upload Documents
                        </Button>
                      </motion.div>
                    )}

                    {canViewAllDocuments && (
                      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <Button
                          variant="contained"
                          startIcon={<FolderIcon />}
                          onClick={handleOpenViewOnlyDocuments}
                          sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, px: 4, py: 1.5 }}
                        >
                          View All Documents
                        </Button>
                      </motion.div>
                    )}

                    {currentStatus === 14 && (
                      <Chip
                        icon={<CheckCircle />}
                        label="Documents Submitted - Under Review"
                        sx={{ bgcolor: '#dbeafe', color: '#1d4ed8', fontWeight: 600, py: 2.5, px: 1 }}
                      />
                    )}
                  </Box>
                </SharedCard>
              </motion.div>
            ) : (
              <motion.div key="no-request" variants={cardVariants} initial="initial" animate="animate">
                <SharedCard sx={{ textAlign: 'center', py: 4 }}>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                    <Flight sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                  </motion.div>
                  <Typography variant="h6" color="text.secondary">No active travel applications</Typography>
                </SharedCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Travel History - same as before */}
          {recentRequests && recentRequests.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <SharedCard variant="dashboard" sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Your Travel History</Typography>
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
                            <Chip label={statusInfo.shortLabel || statusInfo.label} size="small" color={statusInfo.color} sx={{ bgcolor: statusInfo.bgColor }} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </SharedCard>
            </motion.div>
          )}
        </Box>
      </motion.div>

      {/* ==========================================
          VIEW-ONLY DOCUMENTS MODAL (Status 15+)
          Shows ALL document categories
      ========================================== */}
      <SharedModal
        open={showViewOnlyModal}
        onClose={() => setShowViewOnlyModal(false)}
        title="Your Travel Documents"
        maxWidth="md"
        fullWidth
      >
        <AnimatePresence mode="wait">
          {loadingDocs ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Box sx={{ p: 2 }}>
                <Skeleton variant="rounded" height={100} sx={{ mb: 3, borderRadius: 3 }} />
                {[1, 2, 3].map((i) => (
                  <Box key={i} sx={{ mb: 3 }}>
                    <Skeleton variant="text" width={200} sx={{ mb: 1 }} />
                    <Skeleton variant="rounded" height={60} sx={{ mb: 1 }} />
                    <Skeleton variant="rounded" height={60} />
                  </Box>
                ))}
              </Box>
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Box sx={{ width: '100%' }}>
                {/* Header */}
                <Box
                  sx={{
                    background: currentStatus >= 16
                      ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                      : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    borderRadius: 3,
                    p: 3,
                    mb: 3,
                    color: 'white',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    {currentStatus >= 16 ? <CheckCircle sx={{ fontSize: 28 }} /> : <Flight sx={{ fontSize: 28 }} />}
                    <Typography variant="h6" fontWeight={600}>
                      {currentStatus >= 17
                        ? 'Travel Completed - All Documents'
                        : currentStatus >= 16
                          ? 'Tickets Ready - View Documents'
                          : 'Booking In Progress - Your Documents'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {currentStatus >= 16
                      ? 'Your travel bookings are complete. View and download all documents below.'
                      : 'Travel desk is processing your bookings. Documents will appear as they are uploaded.'}
                  </Typography>
                </Box>

                {/* Document Summary */}
                <Alert
                  severity={currentStatus >= 16 ? 'success' : 'info'}
                  sx={{ mb: 3 }}
                  icon={currentStatus >= 16 ? <CheckCircle /> : <Flight />}
                >
                  <Typography variant="body2">
                    <strong>Status:</strong> {getStatusInfo(currentStatus).description}
                  </Typography>
                </Alert>

                {/* Document Sections */}
                <Box sx={{ maxHeight: '50vh', overflowY: 'auto', pr: 1 }}>

                  {/* Section 1: Employee Uploaded Documents */}
                  <DocumentSection
                    title="Your Uploaded Documents"
                    icon={<Description sx={{ color: '#16a34a' }} />}
                    documentIds={DOCUMENT_GROUPS.EMPLOYEE_UPLOADS}
                    documentTypes={documentTypes}
                    uploadedDocuments={allDocuments}
                    onView={handleViewDocument}
                    onDownload={handleDownloadDocument}
                    bgColor="#f0fdf4"
                    borderColor="#86efac"
                    chipColor="#16a34a"
                    chipBgColor="#dcfce7"
                    showPending={false}
                  />

                  {/* Section 2: Visa Documents (TD uploads at status 14) */}
                  <DocumentSection
                    title="Visa Documents"
                    icon={<VisaIcon sx={{ color: '#7c3aed' }} />}
                    documentIds={DOCUMENT_GROUPS.TD_VISA_REVIEW}
                    documentTypes={documentTypes}
                    uploadedDocuments={allDocuments}
                    onView={handleViewDocument}
                    onDownload={handleDownloadDocument}
                    bgColor="#faf5ff"
                    borderColor="#c4b5fd"
                    chipColor="#7c3aed"
                    chipBgColor="#ede9fe"
                    showPending={true}
                    pendingMessage="Pending from Travel Desk"
                  />

                  {/* Section 3: Travel Bookings (TD uploads at status 15) */}
                  <DocumentSection
                    title="Travel Bookings"
                    icon={<FlightTakeoffIcon sx={{ color: '#0ea5e9' }} />}
                    documentIds={DOCUMENT_GROUPS.TD_BOOKING}
                    documentTypes={documentTypes}
                    uploadedDocuments={allDocuments}
                    onView={handleViewDocument}
                    onDownload={handleDownloadDocument}
                    bgColor="#f0f9ff"
                    borderColor="#7dd3fc"
                    chipColor="#0ea5e9"
                    chipBgColor="#e0f2fe"
                    showPending={true}
                    pendingMessage="Booking in progress..."
                  />

                  {/* No documents at all */}
                  {Object.keys(allDocuments).length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Description sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                      <Typography color="text.secondary">No documents found</Typography>
                    </Box>
                  )}
                </Box>

                {/* Document Stats */}
                <Box sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2
                }}>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Your Docs</Typography>
                      <Typography variant="h6" fontWeight={600} color="#16a34a">
                        {DOCUMENT_GROUPS.EMPLOYEE_UPLOADS.filter(id => allDocuments[id]).length}/{DOCUMENT_GROUPS.EMPLOYEE_UPLOADS.length}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Visa Docs</Typography>
                      <Typography variant="h6" fontWeight={600} color="#7c3aed">
                        {DOCUMENT_GROUPS.TD_VISA_REVIEW.filter(id => allDocuments[id]).length}/{DOCUMENT_GROUPS.TD_VISA_REVIEW.length}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Bookings</Typography>
                      <Typography variant="h6" fontWeight={600} color="#0ea5e9">
                        {DOCUMENT_GROUPS.TD_BOOKING.filter(id => allDocuments[id]).length}/{DOCUMENT_GROUPS.TD_BOOKING.length}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => setShowViewOnlyModal(false)}
                    sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
                  >
                    Close
                  </Button>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </SharedModal>

      {/* Upload Modal - Same as before */}
      <SharedModal
        open={showDocumentsModal}
        onClose={() => !isSubmissionInProgress && setShowDocumentsModal(false)}
        title="Upload Required Documents"
        maxWidth="md"
        fullWidth
      >
        {/* ... Same upload modal content as before ... */}
        <AnimatePresence mode="wait">
          {loadingDocs ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Box sx={{ p: 2 }}>
                <Skeleton variant="rounded" height={120} sx={{ mb: 3, borderRadius: 3 }} />
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} variant="rounded" height={70} sx={{ mb: 2, borderRadius: 2 }} />
                ))}
              </Box>
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Box sx={{ width: '100%' }}>
                {/* Header with Progress */}
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 50%, #7f1d1d 100%)',
                    borderRadius: 3,
                    p: 3,
                    mb: 3,
                    color: 'white',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CloudUpload sx={{ fontSize: 28 }} />
                      <Typography variant="h6" fontWeight={600}>Document Upload Center</Typography>
                    </Box>
                    <Chip
                      label={`${uploadStats.requiredUploaded}/${uploadStats.required} Required`}
                      sx={{
                        bgcolor: uploadStats.allRequiredDone ? '#4ade80' : 'rgba(255,255,255,0.2)',
                        color: uploadStats.allRequiredDone ? '#166534' : 'white',
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                    Upload all required documents and verify passport OCR data.
                  </Typography>

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

                {/* Passport OCR */}
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

                {/* Documents List */}
                <Box sx={{ maxHeight: '40vh', overflowY: 'auto', pr: 1 }}>
                  <motion.div variants={staggerContainer} initial="initial" animate="animate">
                    {documentTypes
                      .filter(doc => DOCUMENT_GROUPS.EMPLOYEE_UPLOADS.includes(doc.id))
                      .map((doc, index) => {
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
                              }}
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
                                }}
                              >
                                {isUploaded ? getFileIcon(uploaded.fileType) : <Description sx={{ fontSize: 28, color: '#b91c1c' }} />}
                              </Box>

                              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                                  <Typography variant="subtitle1" fontWeight={600}>{doc.name}</Typography>
                                  <Chip size="small" label={isRequired ? 'Required' : 'Optional'}
                                    sx={{ height: 20, fontSize: '0.65rem', bgcolor: isRequired ? '#fee2e2' : '#f0f9ff', color: isRequired ? '#dc2626' : '#0369a1', fontWeight: 600 }} />
                                  <Chip size="small" icon={isUploaded ? <CheckCircle sx={{ fontSize: 14 }} /> : <ErrorIcon sx={{ fontSize: 14 }} />}
                                    label={isUploaded ? 'UPLOADED' : 'PENDING'}
                                    sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: isUploaded ? '#dcfce7' : '#fef3c7', color: isUploaded ? '#16a34a' : '#d97706' }} />
                                  {isPassport && isUploaded && (
                                    <Chip size="small" icon={isOCRVerified ? <VerifiedIcon sx={{ fontSize: 14 }} /> : <WarningIcon sx={{ fontSize: 14 }} />}
                                      label={isOCRVerified ? 'OCR Verified' : 'OCR Pending'}
                                      sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: isOCRVerified ? '#dcfce7' : '#fef3c7', color: isOCRVerified ? '#16a34a' : '#d97706' }} />
                                  )}
                                </Box>

                                {isUploaded ? (
                                  <Typography variant="caption" sx={{ color: '#64748b' }}>📄 {uploaded.fileName} • {formatFileSize(uploaded.fileSize)}</Typography>
                                ) : (
                                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>No file uploaded yet</Typography>
                                )}
                              </Box>

                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                {isUploaded && (
                                  <>
                                    <IconButton size="small" onClick={() => handleViewDocument(doc)} sx={{ color: '#3b82f6' }}><Visibility fontSize="small" /></IconButton>
                                    <IconButton size="small" onClick={() => handleDeleteDocument(doc)} sx={{ color: '#ef4444' }}><Delete fontSize="small" /></IconButton>
                                  </>
                                )}
                                <Button
                                  variant={isUploaded ? 'outlined' : 'contained'}
                                  size="small"
                                  onClick={() => openUploadModal(doc)}
                                  startIcon={isUploaded ? <UploadFile /> : <CloudUpload />}
                                  sx={{
                                    ml: 1, minWidth: 100, borderRadius: 2, textTransform: 'none', fontWeight: 600,
                                    ...(isUploaded ? { borderColor: '#16a34a', color: '#16a34a' } : { bgcolor: '#b91c1c', '&:hover': { bgcolor: '#991b1b' } })
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

                {/* Footer */}
                <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Button onClick={() => setShowDocumentsModal(false)} disabled={isSubmissionInProgress} sx={{ color: '#64748b' }}>Cancel</Button>

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {uploadStats.requiredUploaded}/{uploadStats.required} required
                    </Typography>

                    <Button
                      variant="contained"
                      onClick={handleSubmitDocuments}
                      disabled={!canSubmitDocuments || isSubmissionInProgress}
                      startIcon={isSubmissionInProgress ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                      sx={{
                        minWidth: 200,
                        bgcolor: canSubmitDocuments ? '#16a34a' : '#94a3b8',
                        '&:hover': { bgcolor: canSubmitDocuments ? '#15803d' : '#94a3b8' },
                      }}
                    >
                      {isSubmissionInProgress ? 'Submitting...' : 'Submit Documents'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </SharedModal>

      {/* Upload File Modal */}
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
            borderColor: isDragActive ? '#b91c1c' : '#cbd5e1',
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
              <Typography variant="h6" color="text.secondary">Uploading... {uploadProgress}%</Typography>
              <Box sx={{ mt: 2, height: 8, borderRadius: 4, bgcolor: '#e2e8f0', overflow: 'hidden' }}>
                <Box sx={{ width: `${uploadProgress}%`, height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #b91c1c, #ef4444)' }} />
              </Box>
            </Box>
          ) : (
            <Box>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ p: 2, bgcolor: isDragActive ? '#b91c1c' : '#fee2e2', borderRadius: '50%', color: isDragActive ? 'white' : '#b91c1c' }}>
                  <UploadFile fontSize="large" />
                </Box>
              </Box>
              <Typography variant="h6" sx={{ mb: 1 }}>{isDragActive ? 'Drop here!' : 'Drag & drop or click'}</Typography>
              <Typography variant="body2" color="text.secondary">PNG, JPG, PDF (Max 5MB)</Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => setShowUploadModal(false)} disabled={uploading}>Cancel</Button>
        </Box>
      </SharedModal>

      {/* Preview Modal */}
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
                <iframe src={`data:application/pdf;base64,${previewData.base64}`} width="100%" height="100%" style={{ border: 'none', borderRadius: 8 }} title={previewData.fileName} />
              </Box>
            ) : (
              <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                <img src={`data:${previewData.fileType};base64,${previewData.base64}`} alt={previewData.fileName} style={{ maxWidth: '100%', maxHeight: '55vh', borderRadius: 8 }} />
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

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </BaseLayout>
  );
};

export default DashboardEmployee;