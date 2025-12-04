// src/pages/auth/Login.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { Flight, LockOutlined } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';  // Make sure yup is installed
import { login } from '../../features/authSlice';
import { toast } from 'react-toastify';

import {
  SharedCard,
  SharedButton,
  FormInput,
  LoadingSpinner
} from '../../components/shared';

// Validation Schema
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, loginError } = useSelector((state) => state.auth);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(login(values)).unwrap();
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
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
      <SharedCard
        sx={{
          maxWidth: 400,
          width: '100%',
          p: 4,
          borderTop: '8px solid #b91c1c'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Flight 
            sx={{ 
              fontSize: 70, 
              color: '#b91c1c', 
              mb: 2 
            }} 
          />
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600,
              color: '#b91c1c'
            }}
          >
            Welcome to ReGo
          </Typography>
        </Box>

        <Formik
          initialValues={{ 
            email: '', 
            password: '' 
          }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
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
    </Box>
  );
};

export default Login;