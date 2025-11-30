import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: '#b91c1c',
        boxShadow: '0 4px 20px rgba(185, 28, 28, 0.15)'
      }}
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
