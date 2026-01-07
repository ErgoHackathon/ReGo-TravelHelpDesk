// src/components/shared/feedback/LoadingSpinner.jsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({
  size = 40,
  message,
  fullHeight = false
}) => (
  <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    minHeight: fullHeight ? '50vh' : 'auto',
    p: 3
  }}>
    <CircularProgress size={size} sx={{ color: '#b91c1c' }} />
    {message && (
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {message}
      </Typography>
    )}
  </Box>
);

export default LoadingSpinner;