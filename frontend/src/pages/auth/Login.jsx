// src/pages/auth/Login.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Alert, Divider } from '@mui/material';
import { Flight, LockOutlined } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { login, clearError } from '../../features/authSlice';
import { toast } from 'react-toastify';

import {
  SharedCard,
  SharedButton,
  FormInput,
  LoadingSpinner
} from '../../components/shared';

// Validation Schema - Allow shorter passwords for testing
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(4, 'Password must be at least 4 characters') // Changed from 6 to 4 for test accounts
    .required('Password is required')
});

// Animation variants
const containerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, loginError } = useSelector((state) => state.auth);

  // Clear errors on component mount
  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log('🔐 Login: Submitting for:', values.email);
    
    try {
      const result = await dispatch(login(values)).unwrap();
      console.log('🔐 Login: Success:', result);
      toast.success('Login successful!');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('🔐 Login: Failed:', error);
      toast.error(error || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#fef2f2',
        p: 2
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        style={{ width: '100%', maxWidth: 420 }}
      >
        <SharedCard
          sx={{
            width: '100%',
            p: 4,
            borderTop: '8px solid #b91c1c'
          }}
        >
          {/* Logo & Title */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Flight 
                sx={{ 
                  fontSize: 70, 
                  color: '#b91c1c', 
                  mb: 2 
                }} 
              />
            </motion.div>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                color: '#b91c1c'
              }}
            >
              Welcome to ReGo
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Sign in to access your travel dashboard
            </Typography>
          </Box>

          {/* Error Alert */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert severity="error" sx={{ mb: 2 }}>
                {loginError}
              </Alert>
            </motion.div>
          )}

          <Formik
            initialValues={{ 
              email: '', 
              password: '' 
            }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                <FormInput
                  name="email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  fullWidth
                  sx={{ mb: 2 }}
                />

                <FormInput
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  fullWidth
                  sx={{ mb: 3 }}
                />

                <SharedButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading || isSubmitting}
                  startIcon={loading ? <LoadingSpinner size={20} /> : <LockOutlined />}
                  sx={{
                    py: 1.5,
                    bgcolor: '#b91c1c',
                    '&:hover': {
                      bgcolor: '#8b1f1f'
                    }
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </SharedButton>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <SharedButton
                    variant="text"
                    onClick={() => navigate('/forgot-password')}
                    sx={{ 
                      color: '#b91c1c',
                      '&:hover': {
                        bgcolor: 'transparent',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Forgot Password?
                  </SharedButton>
                </Box>
              </Form>
            )}
          </Formik>
        </SharedCard>
      </motion.div>
    </Box>
  );
};

export default Login;