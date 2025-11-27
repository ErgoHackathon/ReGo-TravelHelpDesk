import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button
} from '@mui/material';
import {
  PendingActions,
  People,
  CheckCircle,
  TrendingUp
} from '@mui/icons-material';
import Navbar from '../../components/layout/Navbar';

const DashboardManager = () => {
  const { user } = useSelector((state) => state.auth);

  // Mock stats data
  const stats = [
    { title: 'Team Requests', value: 12, icon: <People />, color: '#E63946' },
    { title: 'Pending My Approval', value: 5, icon: <PendingActions />, color: '#FFA726' },
    { title: 'Approved Today', value: 8, icon: <CheckCircle />, color: '#4CAF50' },
    { title: 'Budget Used', value: '₹3.2L', icon: <TrendingUp />, color: '#2196F3' }
  ];

  // Mock pending approvals
  const pendingApprovals = [
    { 
      id: 'TR-2025-015', 
      employee: 'Rahul Sharma', 
      destination: 'Singapore', 
      amount: '₹85,000',
      urgency: 'high',
      date: '2025-12-10'
    },
    { 
      id: 'TR-2025-016', 
      employee: 'Priya Patel', 
      destination: 'Dubai, UAE', 
      amount: '₹65,000',
      urgency: 'medium',
      date: '2025-12-15'
    },
    { 
      id: 'TR-2025-017', 
      employee: 'Amit Kumar', 
      destination: 'Mumbai, India', 
      amount: '₹22,000',
      urgency: 'low',
      date: '2025-12-20'
    },
    { 
      id: 'TR-2025-018', 
      employee: 'Neha Singh', 
      destination: 'London, UK', 
      amount: '₹1,25,000',
      urgency: 'high',
      date: '2025-12-08'
    }
  ];

  const getUrgencyColor = (urgency) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'info'
    };
    return colors[urgency] || 'default';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Add padding for fixed navbar */}
      <Box component="main" sx={{ flexGrow: 1, mt: 8 }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* Welcome Section */}
          <Box sx={{ mb: 4 }}>
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
                  Welcome, {user?.firstName}!
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                  <Chip
                    label={user?.role?.replace('_', ' ')}
                    size="small"
                    sx={{ bgcolor: '#E63946', color: 'white' }}
                  />
                  {user?.department && (
                    <Chip
                      label={`Team Lead - ${user.department}`}
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Box>
              </Box>
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

          {/* Pending Approvals */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Pending Approvals
              </Typography>
              <Chip
                label={`${pendingApprovals.length} pending`}
                sx={{ bgcolor: '#FFA726', color: 'white' }}
              />
            </Box>
            <List>
              {pendingApprovals.map((request, index) => (
                <React.Fragment key={request.id}>
                  <ListItem
                    sx={{
                      '&:hover': { bgcolor: '#F5F5F5' },
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {request.id}
                            </Typography>
                            <Chip
                              label={request.urgency.toUpperCase()}
                              color={getUrgencyColor(request.urgency)}
                              size="small"
                            />
                          </Box>
                          <Typography variant="h6" color="#E63946">
                            {request.amount}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Employee:</strong> {request.employee}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Destination:</strong> {request.destination} | <strong>Travel Date:</strong> {request.date}
                          </Typography>
                          <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#45a049' } }}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                            >
                              Reject
                            </Button>
                            <Button
                              size="small"
                              variant="text"
                              sx={{ color: '#E63946' }}
                            >
                              View Details
                            </Button>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < pendingApprovals.length - 1 && <Divider sx={{ my: 1 }} />}
                </React.Fragment>
              ))}
            </List>
          </Paper>

          {/* Quick Stats */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="#E63946">
                    Team Overview
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Your team has 12 active travel requests this month
                  </Typography>
                  <Button variant="outlined" sx={{ borderColor: '#E63946', color: '#E63946' }}>
                    View Team Requests
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="#E63946">
                    Budget Tracker
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    ₹3.2L used of ₹10L monthly budget (32%)
                  </Typography>
                  <Button variant="outlined" sx={{ borderColor: '#E63946', color: '#E63946' }}>
                    View Budget Details
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

export default DashboardManager;