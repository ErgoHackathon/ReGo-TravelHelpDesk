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
  IconButton
} from '@mui/material';
import {
  Flight,
  CloudUpload,
  CheckCircle,
  Description,
  Close,
  UploadFile
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

const DashboardEmployee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { activeRequest, loading } = useSelector((state) => state.dashboard);

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
    // Update local state
    setDocuments(prev => prev.map(d =>
      d.id === activeDoc.id ? { ...d, status: 'UPLOADED', fileName: file.name } : d
    ));

    // Close upload modal
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
            firstName={user?.firstName}
            lastName={user?.lastName}
            size="large"
          />
          <Box>
            <SharedTypography variant="pageTitle">
              Employee Dashboard
            </SharedTypography>
            <StatusChip
              label={user?.role}
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

        {/* Active Application Card */}
        {activeRequest ? (
          <SharedCard variant="dashboard" sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Your Active Travel Application
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  {activeRequest.id} • {activeRequest.destination}
                </Typography>
              </Box>
              <StatusChip label={activeRequest.status} />
            </Box>

            {/* Stepper */}
            <Box sx={{ width: '100%', mb: 4 }}>
              <Stepper activeStep={activeRequest.status === 'UNDER_REVIEW' ? 2 : 1} alternativeLabel>
                {activeRequest.steps.map((step) => (
                  <Step key={step.label} completed={step.completed}>
                    <StepLabel>{step.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Action Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => setShowDocumentsListModal(true)}
                disabled={activeRequest.status !== 'AWAITING_DOCUMENTS'}
                sx={{
                  bgcolor: '#b91c1c',
                  '&:hover': { bgcolor: '#991b1b' },
                  px: 4,
                  py: 1.5
                }}
              >
                {activeRequest.status === 'AWAITING_DOCUMENTS' ? 'Upload Required Documents' : 'Documents Submitted'}
              </Button>
            </Box>
          </SharedCard>
        ) : (
          <SharedCard>
            <Typography>No active travel applications.</Typography>
          </SharedCard>
        )}
      </Box>

      {/* 1. Documents List Modal */}
      <SharedModal
        open={showDocumentsListModal}
        onClose={() => setShowDocumentsListModal(false)}
        title={`Required Documents for ${activeRequest?.id}`}
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
            {documents.map((doc) => (
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
          </TableBody>
        </Table>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmitAll}
            disabled={documents.some(d => d.status === 'PENDING')}
            sx={{ px: 4 }}
          >
            Submit All Documents
          </Button>
        </Box>
      </SharedModal>

      {/* 2. Drag & Drop Upload Modal */}
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
