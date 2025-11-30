import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export const PageLoader = () => (
  <Box 
    sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}
  >
    <CircularProgress sx={{ color: '#b91c1c' }} />
  </Box>
);