// src/components/shared/dashboard/DashboardLayout.jsx
import React from 'react';
import { Box, Container } from '@mui/material';
import BaseLayout from '../../components/layout/BaseLayout';
import AnimatedNavbar from '../../layout/AnimatedNavbar'; // if using this
import Navbar from '../navigation/Navbar'; // this exists

const DashboardLayout = ({ children }) => (
  <BaseLayout variant="dashboard">
    <AnimatedNavbar />
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {children}
    </Container>
  </BaseLayout>
);

// src/components/shared/dashboard/StatCards.jsx