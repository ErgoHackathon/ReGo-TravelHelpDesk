import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  AddCircleOutline,
  Flight,
  AttachMoney,
  CalendarToday,
  TrendingUp
} from '@mui/icons-material';
import Navbar from '../../components/layout/Navbar';

const DashboardEmployee = () => {
  const { user } = useSelector((state) => state.auth);

  // Mock stats data
  const stats = [
    { title: 'Active Requests', value: 3, icon: <Flight />, color: '#E63946' },
    { title: 'Pending Approvals', value: 2, icon: <TrendingUp />, color: '#FFA726' },
    { title: 'Upcoming Trips', value: 1, icon: <CalendarToday />, color: '#2196F3' },
    { title: 'Pending Expenses', value: '₹12,450', icon: <AttachMoney />, color: '#4CAF50' }
  ];

  // Mock recent requests
  const recentRequests = [
    { id: 'TR-2025-001', destination: 'Mumbai, India', date: '2025-12-15', status: 'PENDING', amount: '₹25,000' },
    { id: 'TR-2025-002', destination: 'Bangalore, India', date: '2025-12-20', status: 'APPROVED', amount: '₹18,000' },
    { id: 'TR-2025-003', destination: 'Delhi, India', date: '2026-01-05', status: 'DRAFT', amount: '₹30,000' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      PENDING: 'warning',
      APPROVED: 'success',
      REJECTED: 'error'
    };
    return colors[status] || 'default';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Add padding for fixed navbar */}
      <Box component="main" sx={{ flexGrow: 1, mt: 8 }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* Welcome Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: '#E63946',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}
                >
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
                    Welcome back, {user?.firstName}!
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                    <Chip
                      label={user?.role?.replace('_', ' ')}
                      size="small"
                      sx={{ bgcolor: '#E63946', color: 'white' }}
                    />
                    {user?.department && (
                      <Chip
                        label={user.department}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Box>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddCircleOutline />}
                sx={{
                  bgcolor: '#E63946',
                  '&:hover': { bgcolor: '#D62828' },
                  textTransform: 'none',
                  px: 3
                }}
              >
                New Travel Request
              </Button>
            </Box>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', bgcolor: stat.color, color: 'white' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                          {stat.title}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {stat.value}
                        </Typography>
                      </Box>
                      <Box sx={{ opacity: 0.8 }}>
                        {React.cloneElement(stat.icon, { sx: { fontSize: 40 } })}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Recent Requests */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Recent Travel Requests
            </Typography>
            <List>
              {recentRequests.map((request, index) => (
                <React.Fragment key={request.id}>
                  <ListItem
                    sx={{
                      '&:hover': { bgcolor: '#F5F5F5' },
                      cursor: 'pointer',
                      borderRadius: 1
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {request.id}
                          </Typography>
                          <Chip
                            label={request.status}
                            color={getStatusColor(request.status)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Destination:</strong> {request.destination}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Travel Date:</strong> {request.date} | <strong>Amount:</strong> {request.amount}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentRequests.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>

          {/* Quick Actions */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="#E63946">
                    Quick Actions
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Submit expense claims, upload documents, or check request status
                  </Typography>
                  <Button variant="outlined" sx={{ borderColor: '#E63946', color: '#E63946' }}>
                    Submit Expenses
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="#E63946">
                    Upcoming Travel
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    View your confirmed bookings and travel details
                  </Typography>
                  <Button variant="outlined" sx={{ borderColor: '#E63946', color: '#E63946' }}>
                    View Bookings
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardEmployee;