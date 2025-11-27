import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Avatar,
  Chip,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Flight,
  Logout,
  AccountCircle,
  ArrowForward,
  CheckCircle
} from '@mui/icons-material';
import { logout } from '../features/authSlice';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  // Get role color
  const getRoleColor = (role) => {
    const colors = {
      EMPLOYEE: 'default',
      MANAGER: 'primary',
      AVP: 'secondary',
      SVP: 'warning',
      CHRO: 'error',
      TRAVEL_DESK: 'info',
      FINANCE: 'success',
      ADMIN: 'error'
    };
    return colors[role] || 'default';
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <Flight sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ReGo - Travel Management
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              {user?.firstName} {user?.lastName}
            </Typography>
            
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>
                <AccountCircle sx={{ mr: 1 }} /> Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Section */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}
              >
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                Welcome back, {user?.firstName}!
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                <Chip
                  label={user?.role?.replace('_', ' ')}
                  color={getRoleColor(user?.role)}
                  size="small"
                />
                {user?.department && (
                  <Chip
                    label={user.department}
                    variant="outlined"
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Success Message */}
        <Paper sx={{ p: 3, mb: 4, bgcolor: 'success.lighter' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircle color="success" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6" color="success.dark" gutterBottom>
                Stage 2 Complete! 🎉
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Authentication system is working perfectly. You're now logged in and can access protected routes.
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Feature Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Travel Requests
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Create and manage your travel requests with ease.
                </Typography>
                <Typography variant="caption" color="info.main">
                  Coming in Stage 3
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Approvals
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Review and approve travel requests from your team.
                </Typography>
                <Typography variant="caption" color="info.main">
                  Coming in Stage 4
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Expenses
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Submit and track your travel expenses and reimbursements.
                </Typography>
                <Typography variant="caption" color="info.main">
                  Coming in Stage 6
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* User Info Section */}
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Your Profile
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{user?.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Employee ID
              </Typography>
              <Typography variant="body1">{user?.employeeId || 'Not set'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Department
              </Typography>
              <Typography variant="body1">{user?.department || 'Not assigned'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body1">{user?.phone || 'Not provided'}</Typography>
            </Grid>
          </Grid>
          
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={handleProfile}
            endIcon={<ArrowForward />}
          >
            Edit Profile
          </Button>
        </Paper>

        {/* Next Steps */}
        <Paper sx={{ p: 3, mt: 4, bgcolor: 'info.lighter' }}>
          <Typography variant="h6" gutterBottom color="info.dark">
            What's Next?
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Stage 2 (Authentication) is complete! Here's what we'll build in the next stages:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li>
              <Typography variant="body2">
                <strong>Stage 3:</strong> Travel Request Creation & Document Upload
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>Stage 4:</strong> Multi-level Approval Workflow
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>Stage 5:</strong> AI Recommendations & Bookings
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>Stage 6:</strong> Expense Tracking & Reimbursement
              </Typography>
            </li>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;