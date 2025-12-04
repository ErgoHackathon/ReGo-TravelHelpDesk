// src/pages/auth/Register.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { register } from '../../features/authSlice';
import { toast } from 'react-toastify';

import {
  SharedButton,
  SharedCard,
  FormInput,
  FormSelect,
  LoadingSpinner
} from '../../components/shared';


const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string()
    .min(6, 'Min 6 characters')
    .required('Required'),
  firstName: Yup.string()
    .required('Required'),
  lastName: Yup.string()
    .required('Required'),
  role: Yup.string()
    .required('Required')
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const initialValues = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'EMPLOYEE',
    department: '',
    phone: ''
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(register(values)).unwrap();
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <SharedCard variant="auth">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormInput
                    name="firstName"
                    label="First Name"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput
                    name="lastName"
                    label="Last Name"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormInput
                    name="email"
                    label="Email"
                    type="email"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormInput
                    name="password"
                    label="Password"
                    type="password"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormSelect
                    name="role"
                    label="Role"
                    options={[
                      { value: 'EMPLOYEE', label: 'Employee' },
                      { value: 'MANAGER', label: 'Manager' }
                    ]}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput
                    name="department"
                    label="Department"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormInput
                    name="phone"
                    label="Phone"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <SharedButton
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading || isSubmitting}
                >
                  {loading ? <LoadingSpinner size={24} /> : 'Register'}
                </SharedButton>
              </Box>
            </Form>
          )}
        </Formik>
      </SharedCard>
    </Box>
  );
};

export default Register;