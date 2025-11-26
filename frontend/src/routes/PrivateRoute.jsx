import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CircularProgress, Box } from '@mui/material';
import authService from '../services/authService';

/**
 * PrivateRoute Component
 * Protects routes from unauthorized access
 * Redirects to login if user is not authenticated
 */
const PrivateRoute = ({ children }) => {
  const { loading } = useSelector((state) => state.auth);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const isAuth = authService.isAuthenticated();
  // Redirect to login if not authenticated
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content
  return children;
};

export default PrivateRoute;