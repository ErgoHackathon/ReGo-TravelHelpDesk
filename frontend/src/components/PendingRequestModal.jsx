import * as React from "react";
import {
  Modal,
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Button,
  Chip,
  CircularProgress,
  Alert
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchViewDetailsData, clearViewDetails } from "../redux/slices/dashboardSlice";
import { Download, Close, Description, Person, Flight, Info } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "#fff",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh",
  overflowY: "auto",
  outline: "none"
};

export default function PendingRequestModal({ open, onClose, requestId }) {
  const dispatch = useDispatch();
  
  // Redux State
  const details = useSelector(state => state.dashboard.viewRequestDetails);
  const loading = useSelector(state => state.dashboard.detailsLoading);
  const error = useSelector(state => state.dashboard.error);

  // Fetch details when modal opens
  React.useEffect(() => {
    if (open && requestId) {
      console.log("📊 Modal opening for Request ID:", requestId);
      dispatch(fetchViewDetailsData(requestId));
    }
  }, [open, requestId, dispatch]);

  // Handle closing (Clear data so it doesn't flash old data next time)
  const handleClose = () => {
    dispatch(clearViewDetails());
    onClose();
  };

  // Helper for Chip colors
  const getStatusColor = (status) => {
    if (!status) return 'default';
    const s = status.toLowerCase();
    if (s.includes('approved') || s.includes('completed') || s.includes('uploaded')) return 'success';
    if (s.includes('pending') || s.includes('initiated') || s.includes('review')) return 'warning';
    if (s.includes('rejected')) return 'error';
    return 'default'; // Safe fallback
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        
        {/* --- HEADER --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#111' }}>
              Request Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {requestId ? `TR-${String(requestId).padStart(4, '0')}` : '...'}
            </Typography>
          </Box>
          <Button onClick={handleClose} sx={{ minWidth: 'auto', color: '#666' }}>
            <Close />
          </Button>
        </Box>

        {/* --- LOADING STATE --- */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress size={40} thickness={4} />
          </Box>
        )}

        {/* --- ERROR STATE --- */}
        {!loading && error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* --- CONTENT --- */}
        {!loading && !error && details && (
          <Grid container spacing={3}>

            {/* 1. EMPLOYEE INFORMATION */}
            <Grid item xs={12} md={7}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Person color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    Employee Information
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Name</Typography>
                    <Typography variant="body1" fontWeight={500}>{details.employeeName}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">ID</Typography>
                    <Typography variant="body1" fontWeight={500}>{details.employeeId}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{details.email}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Department</Typography>
                    <Typography variant="body2">{details.department}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* 2. STATUS & DATES */}
            <Grid item xs={12} md={5}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#fff', border: '1px solid #e2e8f0', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Info color="info" />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    Status
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>Current Status</Typography>
                    <Chip 
                      label={details.status} 
                      color={getStatusColor(details.status)} 
                      sx={{ fontWeight: 600 }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Requested On</Typography>
                    <Typography variant="body2">{details.requestedOn}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Last Updated</Typography>
                    <Typography variant="body2">{details.lastUpdated}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* 3. TRAVEL DETAILS */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Flight color="warning" />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    Travel Details
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Travel Type</Typography>
                    <Typography variant="body1">{details.travelType}</Typography>
                  </Grid>

                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="text.secondary">From</Typography>
                    <Typography variant="body1">{details.from}</Typography>
                  </Grid>

                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="text.secondary">To</Typography>
                    <Typography variant="body1" fontWeight={600}>{details.to}</Typography>
                  </Grid>

                  <Grid item xs={6} md={3}>
                     {/* Spacer */}
                  </Grid>

                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Departure</Typography>
                    <Typography variant="body1">{details.departureDate}</Typography>
                  </Grid>

                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Return</Typography>
                    <Typography variant="body1">{details.returnDate}</Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Purpose</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      "{details.purpose}"
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* 4. ATTACHMENTS */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#f1f5f9', border: '1px dashed #cbd5e1' }}>
                <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem', fontWeight: 600 }}>
                  Attachments ({details.attachments?.length || 0})
                </Typography>

                {details.attachments && details.attachments.length > 0 ? (
                  <Grid container spacing={2}>
                    {details.attachments.map((file, i) => (
                      <Grid item xs={12} sm={6} md={4} key={i}>
                        <Paper sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
                            <Description fontSize="small" color="action" />
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="body2" noWrap>{file.fileName}</Typography>
                              <Typography variant="caption" color="text.secondary">{file.size} MB</Typography>
                            </Box>
                          </Box>
                          <Button size="small" sx={{ minWidth: 'auto' }}>
                            <Download fontSize="small" />
                          </Button>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No documents attached.
                  </Typography>
                )}
              </Paper>
            </Grid>

          </Grid>
        )}

        {/* --- EMPTY STATE (Loaded but no details) --- */}
        {!loading && !error && !details && (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography color="text.secondary">No details available for this request.</Typography>
          </Box>
        )}

        {/* --- FOOTER --- */}
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={handleClose} variant="outlined" color="inherit">
            Close
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<Download />}
            disabled={!details || loading}
            onClick={() => alert("PDF Download logic here")}
          >
            Download PDF
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}