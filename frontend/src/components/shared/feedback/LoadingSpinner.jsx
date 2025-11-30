// src/components/shared/feedback/LoadingSpinner.jsx
import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = ({ size = 40 }) => (
  <Box sx={{ 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    p: 3 
  }}>
    <CircularProgress size={size} sx={{ color: '#b91c1c' }} />
  </Box>
);

export default LoadingSpinner;