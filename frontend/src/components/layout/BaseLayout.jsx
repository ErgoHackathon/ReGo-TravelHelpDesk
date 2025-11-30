// src/sharedComponents/layout/BaseLayout.jsx
import React from 'react';
import { Box } from '@mui/material';
import { AnimatedPage } from '../../animations';

const BaseLayout = ({ variant = 'default', children }) => {
  const layouts = {
    default: {
      minHeight: '100vh',
      p: 2
    },
    auth: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#fef2f2',
      p: 2
    },
    dashboard: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#fef2f2',
      p: 2,
      pt: 8 // Space for navbar
    }
  };

  return (
    <AnimatedPage>
      <Box sx={layouts[variant]}>
        {children}
      </Box>
    </AnimatedPage>
  );
};

export default BaseLayout;