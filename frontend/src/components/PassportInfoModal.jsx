import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress
} from '@mui/material';
import { Close, CheckCircle, Warning, Person, Badge, CalendarMonth, LocationOn } from '@mui/icons-material';
import realApi from '../services/api/realApi';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: '#fff',
  borderRadius: 3,
  boxShadow: 24,
  
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto'
};

const PassportInfoModal = ({ open, onClose, employeeId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passportInfo, setPassportInfo] = useState(null);

  useEffect(() => {
    if (open && employeeId) {
      fetchPassportInfo();
    }
  }, [open, employeeId]);

  const fetchPassportInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await realApi.getPassportInfo(employeeId);
      const data = response?.Result || response?.result;
      
      if (data) {
        setPassportInfo(data);
      } else {
        setError('Passport information not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch passport info');
    } finally {
      setLoading(false);
    }
  };

  const InfoRow = ({ label, value, icon }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
      {icon && <Box sx={{ mr: 1, color: 'text.secondary' }}>{icon}</Box>}
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140 }}>
        {label}:
      </Typography>
      <Typography variant="body1" fontWeight={500}>{value || 'N/A'}</Typography>
    </Box>
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Passport & Identity Information
          </Typography>
          <Button onClick={onClose}><Close /></Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : passportInfo ? (
          <>
            {/* OCR Verification Status */}
            <Paper sx={{ p: 2, mb: 3, bgcolor: passportInfo.ocrVerified ? '#e8f5e9' : '#fff3e0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {passportInfo.ocrVerified ? (
                  <CheckCircle color="success" fontSize="large" />
                ) : (
                  <Warning color="warning" fontSize="large" />
                )}
                <Box>
                  <Typography variant="h6">
                    {passportInfo.ocrVerified ? 'OCR Verified' : 'Pending Verification'}
                  </Typography>
                  {passportInfo.ocrConfidence && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Typography variant="caption">Confidence:</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={passportInfo.ocrConfidence} 
                        sx={{ width: 100, height: 8, borderRadius: 4 }}
                        color={passportInfo.ocrConfidence > 80 ? 'success' : 'warning'}
                      />
                      <Typography variant="caption" fontWeight="bold">
                        {passportInfo.ocrConfidence}%
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>

            <Grid container spacing={3}>
              {/* Passport Details */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    <Badge sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Passport Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <InfoRow label="Passport Number" value={passportInfo.passportNumber} />
                  <InfoRow label="Full Name" value={passportInfo.fullName} icon={<Person fontSize="small" />} />
                  <InfoRow label="Date of Birth" value={formatDate(passportInfo.dateOfBirth)} icon={<CalendarMonth fontSize="small" />} />
                  <InfoRow label="Place of Birth" value={passportInfo.placeOfBirth} icon={<LocationOn fontSize="small" />} />
                  <InfoRow label="Nationality" value={passportInfo.nationality} />
                </Paper>
              </Grid>

              {/* Validity */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    <CalendarMonth sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Validity
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <InfoRow label="Issue Date" value={formatDate(passportInfo.issueDate)} />
                  <InfoRow label="Expiry Date" value={formatDate(passportInfo.expiryDate)} />
                  <InfoRow label="Issuing Authority" value={passportInfo.issuingAuthority} />
                  
                  {isExpiringSoon(passportInfo.expiryDate) && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      Passport expires within 6 months!
                    </Alert>
                  )}
                </Paper>
              </Grid>

              {/* Other IDs */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Other Identity Documents
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <InfoRow label="PAN Number" value={passportInfo.panNumber} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <InfoRow label="Aadhaar Number" value={passportInfo.aadhaarNumber} />
                    </Grid>
                    <Grid item xs={12}>
                      <InfoRow label="Address" value={passportInfo.address} icon={<LocationOn fontSize="small" />} />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </>
        ) : (
          <Alert severity="info">No passport information available</Alert>
        )}

        <Divider sx={{ my: 3 }} />
        <Box sx={{ textAlign: 'right' }}>
          <Button variant="outlined" onClick={onClose}>Close</Button>
        </Box>
      </Box>
    </Modal>
  );
};

// Helpers
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  } catch { return dateString; }
};

const isExpiringSoon = (expiryDate) => {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
  return expiry < sixMonthsFromNow;
};

export default PassportInfoModal;