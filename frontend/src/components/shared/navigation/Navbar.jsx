import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Badge
} from '@mui/material';
import { Notifications } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { markNotificationRead } from '../../../redux/slices/dashboardSlice';

const Navbar = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const { notifications } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();

  const handleMarkRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: '#b91c1c',
        boxShadow: '0 4px 20px rgba(185, 28, 28, 0.15)'
      }}
      // className='navbar'
    >
      <Toolbar>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/dashboard')}
          >
            ReGo
          </Typography>
        </motion.div>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton
          sx={{ mr: 2, color: 'white' }}
          onClick={(e) => setNotifAnchorEl(e.currentTarget)}
        >
          <Badge badgeContent={notifications.filter(n => !n.read).length} color="warning">
            <Notifications />
          </Badge>
        </IconButton>

        <Menu
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={() => setNotifAnchorEl(null)}
          PaperProps={{
            sx: { mt: 1, borderRadius: 2, minWidth: 300, maxHeight: 400 }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0' }}>
            <Typography variant="subtitle1" fontWeight={600}>Notifications</Typography>
          </Box>
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <MenuItem
                key={notif.id}
                onClick={() => {
                  handleMarkRead(notif.id);
                  setNotifAnchorEl(null);
                }}
                sx={{
                  py: 1.5,
                  display: 'block',
                  bgcolor: notif.read ? 'transparent' : '#fef2f2'
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'normal', fontWeight: notif.read ? 400 : 600 }}>
                  {notif.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">{notif.time}</Typography>
              </MenuItem>
            ))
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">No new notifications</Typography>
            </Box>
          )}
        </Menu>

        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ p: 0 }}
        >
          <Avatar
            sx={{
              bgcolor: 'white',
              color: '#b91c1c'
            }}
          >
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 2,
              minWidth: 150
            }
          }}
        >
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
