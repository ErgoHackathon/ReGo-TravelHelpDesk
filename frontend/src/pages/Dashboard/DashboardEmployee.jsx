import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { fetchDashboardData } from '../../redux/slices/dashboardSlice';

const DashboardEmployee = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, pendingApprovals, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const icons = [<Flight />, <TrendingUp />, <CalendarToday />, <AttachMoney />];

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

      <Box component="main" sx={{ flexGrow: 1, mt: 8 }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          
          {/* Welcome */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 60, height: 60, bgcolor: '#E63946' }}>
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </Avatar>

                <Box>
                  <Typography variant="h4">
                    Welcome back, {user?.firstName}!
                  </Typography>

                  <Chip
                    label={user?.role?.replace('_', ' ')}
                    size="small"
                    sx={{ mt: 1, bgcolor: '#E63946', color: 'white' }}
                  />
                </Box>
              </Box>

              <Button
                variant="contained"
                startIcon={<AddCircleOutline />}
                sx={{ bgcolor: '#E63946', '&:hover': { bgcolor: '#D62828' }, textTransform: 'none' }}
              >
                New Travel Request
              </Button>
            </Box>
          </Box>

          {/* Stats */}
          <Grid container spacing={3}>
            {(stats || []).map((stat, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={{ bgcolor: stat.color || '#E63946', color: 'white' }}>
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

          {/* Recent Requests */}
          <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Pending Approvals
            </Typography>

            {loading && <Typography>Loading...</Typography>}

            <List>
              {(pendingApprovals || []).map((item, i) => (
                <React.Fragment key={i}>
                  <ListItem sx={{ borderRadius: 1 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography fontWeight={600}>{item.id}</Typography>
                          <Chip label={item.status || item.urgency} color="warning" size="small" />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2">
                          {item.destination} • {item.date} • {item.amount}
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

export default DashboardEmployee;
