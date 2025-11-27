import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { fetchDashboardData } from '../../redux/slices/dashboardSlice';

const DashboardManager = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, pendingApprovals, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const icons = [<People />, <PendingActions />, <CheckCircle />, <TrendingUp />];

  const getUrgencyColor = (urgency) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'info'
    };
    return colors[urgency] || 'default';
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <Box sx={{ mt: 8, flexGrow: 1 }}>
        <Container maxWidth="lg">
          
          {/* Welcome */}
          <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
            <Avatar sx={{ width: 60, height: 60, bgcolor: '#E63946' }}>
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </Avatar>

            <Box>
              <Typography variant="h4">Welcome, {user?.firstName}!</Typography>
              <Chip
                label={user?.role?.replace('_', ' ')}
                size="small"
                sx={{ mt: 1, bgcolor: '#E63946', color: 'white' }}
              />
            </Box>
          </Box>

          {/* Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {(stats || []).map((stat, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={{ bgcolor: stat.color, color: 'white' }}>
                  <CardContent>
                    <Typography variant="body2">{stat.title}</Typography>
                    <Typography variant="h4" fontWeight="bold">{stat.value}</Typography>

                    {React.cloneElement(icons[i % icons.length], {
                      sx: { fontSize: 40, opacity: 0.8 }
                    })}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pending Approvals */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Pending Approvals</Typography>
              <Chip
                label={`${pendingApprovals?.length || 0} pending`}
                sx={{ bgcolor: '#FFA726', color: 'white' }}
              />
            </Box>

            {loading && <Typography>Loading...</Typography>}

            <List>
              {(pendingApprovals || []).map((req, i) => (
                <React.Fragment key={i}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography fontWeight={600}>{req.id}</Typography>
                            <Chip
                              label={req.urgency?.toUpperCase()}
                              color={getUrgencyColor(req.urgency)}
                              size="small"
                            />
                          </Box>

                          <Typography variant="h6" color="#E63946">
                            {req.amount}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2">
                          {req.employee} • {req.destination} • {req.date}
                        </Typography>
                      }
                    />
                  </ListItem>

                  {i < pendingApprovals.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardManager;
