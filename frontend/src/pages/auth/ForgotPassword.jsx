// src/pages/auth/ForgotPassword.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { Engineering } from '@mui/icons-material';
import { SharedButton, SharedCard, SharedTypography } from '../../components/shared';

const ForgotPassword = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#fef2f2',
      p: 2
    }}>
      <SharedCard variant="auth">
        <Box sx={{ textAlign: 'center' }}>
          <Engineering sx={{ 
            fontSize: 70, 
            color: '#b91c1c', 
            mb: 2 
          }} />
          
          <SharedTypography variant="h6">
            Page Under Construction
          </SharedTypography>
          
          <SharedButton
            variant="primary"
            onClick={() => navigate('/login')}
            sx={{ mt: 3 }}
          >
            Back to Login
          </SharedButton>
        </Box>
      </SharedCard>
    </Box>
  );
};

export default ForgotPassword;