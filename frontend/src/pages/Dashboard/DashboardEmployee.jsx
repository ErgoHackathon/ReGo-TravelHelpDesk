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
  TableRow
} from '@mui/material';
import {
  Flight,
  CloudUpload,
  CheckCircle,
  Description
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
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documents, setDocuments] = useState([]);
  const fileInputRef = useRef(null);
  const [activeDocId, setActiveDocId] = useState(null);

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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && activeDocId) {
      processFile(file, activeDocId);
    }
  };

  const handleDrop = (event, docId) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      processFile(file, docId);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const processFile = (file, docId) => {
    setDocuments(prev => prev.map(doc =>
      doc.id === docId ? { ...doc, status: 'UPLOADED', fileName: file.name } : doc
    ));
    setActiveDocId(null);
  };

  const triggerFileUpload = (docId) => {
    setActiveDocId(docId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmitAll = () => {
    // Update local status and close modal
    if (activeRequest) {
      dispatch(updateRequestStatus({
        id: activeRequest.id,
        status: 'UNDER_REVIEW',
        stepIndex: 2
      }));
    }
    setShowUploadModal(false);
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
                onClick={() => setShowUploadModal(true)}
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

      {/* Upload Documents Modal */}
      <SharedModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title={`Required Documents for ${activeRequest?.id}`}
        maxWidth="md"
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Document Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Upload</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Description color="action" fontSize="small" />
                    <Box>
                      <Typography variant="body2">{doc.name}</Typography>
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
                <TableCell>
                  {doc.status === 'PENDING' ? (
                    <Box
                      sx={{
                        border: '2px dashed #e2e8f0',
                        borderRadius: 1,
                        p: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }
                      }}
                      onClick={() => triggerFileUpload(doc.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, doc.id)}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                        <CloudUpload color="action" fontSize="small" />
                        <Typography variant="caption" color="text.secondary">
                          Click or Drag File
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Button
                      size="small"
                      color="success"
                      startIcon={<CheckCircle />}
                      sx={{ textTransform: 'none' }}
                    >
                      Uploaded
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
    </BaseLayout>
  );
};

export default DashboardEmployee;
