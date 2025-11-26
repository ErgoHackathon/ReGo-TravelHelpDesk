import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <Container sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>ReGo - Travel HelpDesk</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>A polished demo of travel support workflows</Typography>
        <Button component={Link} to="/login" variant="contained" sx={{ mr: 2 }}>Get Started</Button>
        <Button component={Link} to="/register" variant="outlined">Sign Up</Button>
      </Box>
    </Container>
  );
}
