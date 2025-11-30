import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Flight
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../features/authSlice';
import { toast } from 'react-toastify';

const AnimatedNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

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

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: '#b91c1c',
          boxShadow: '0 4px 20px rgba(185, 28, 28, 0.3)'
        }}
      >
        <Toolbar>
          {/* Animated Logo */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          >
            <Flight sx={{ mr: 1, fontSize: 28 }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ flexGrow: 1, fontWeight: 600, cursor: 'pointer' }}
              onClick={() => navigate('/dashboard')}
            >
              ReGo - Travel Management
            </Typography>
          </motion.div>

          <Box sx={{ flexGrow: 1 }} />

          {/* User section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ display: 'flex', alignItems: 'center', gap: 16 }}
          >
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user?.firstName} {user?.lastName}
            </Typography>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'white',
                    color: '#b91c1c',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </Avatar>
              </IconButton>
            </motion.div>

            <AnimatePresence>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                TransitionComponent={motion.div}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 2,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MenuItem onClick={handleProfile}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <AccountCircle sx={{ mr: 1, color: '#b91c1c' }} /> Profile
                    </motion.div>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Logout sx={{ mr: 1, color: '#b91c1c' }} /> Logout
                    </motion.div>
                  </MenuItem>
                </motion.div>
              </Menu>
            </AnimatePresence>
          </motion.div>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

export default AnimatedNavbar;