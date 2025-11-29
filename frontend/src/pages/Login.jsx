import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Card,
  Fade
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Flight
} from '@mui/icons-material';
import { login, clearError } from '../features/authSlice';
import { toast } from 'react-toastify';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import AirplanemodeActiveOutlinedIcon from "@mui/icons-material/AirplanemodeActiveOutlined";
import { CommonDashboard, SharedButton } from '../sharedComponents';

// ONLY HAS THE LOGIN PAGE UI INTEGRATION WITH BE YE TO BE DONE 
// - ONCE INTEGRATED KINDLY REMPVE THIS COMMENT


const LoginPage=()=> {
  const [show, setShow] = React.useState(false);
  const [icon, setIcon] = useState(<LockOutlinedIcon />); // default icon
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, loginError, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await dispatch(login(formData)).unwrap();
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by Redux and displayed in UI
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  React.useEffect(() => {
    // Trigger the animation when component mounts
    setShow(true);
  }, []);

  return (
    // <Box
    //   sx={{
    //     minHeight: "100vh",
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     bgcolor: "#fef2f2",
    //     p: 2
    //   }}
    // >
    <CommonDashboard page="login">
      <Fade in={show} timeout={600}>
        <Card
          elevation={6}
          sx={{
            width: 360,
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            transform: show ? "translateY(0)" : "translateY(20px)",
            transition: "transform 0.6s ease",
            borderTop: '8px solid #b91c1c', 
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            overflow: 'hidden',  
          }}
        >
          {/* Logo */}
          <Box sx={{ mb: 2 }}>
            {/* <img
              src={Logo}
              alt="Re-Go Logo"
              style={{ width: 90, height: "auto" }}
            /> */}
            <Flight sx={{ width: 90, height: "auto"}} />
          </Box>

          {/* Title */}
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Welcome to Re-Go
          </Typography>

          <Typography
            variant="body2"
            sx={{ mb: 3, opacity: 0.8 }}
          >
            Sign in to access your Travel Desk portal
          </Typography>

          {/* Form */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              mt: 1
            }}
            component="form" onSubmit={handleSubmit}
          >
            <TextField
              label="Email"
              type="email"
              name="email"
              fullWidth
              size="small"
              value={formData.email}
              onChange={handleChange}
              sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    // Default border color
                    "& fieldset": {
                      borderColor: "grey",
                    },
                    // Hover state border color
                    "&:hover fieldset": {
                      borderColor: "#c15454ff",
                    },
                    // Focused (clicked) state border color
                    "&.Mui-focused fieldset": {
                      borderColor: "#c15454ff",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "grey",
                      "&.Mui-focused": {
                        color: "black",
                    },
                  },
              }}
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              fullWidth
              size="small"
              value={formData.password}
              onChange={handleChange}
              sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                      // Default border color
                    "& fieldset": {
                      borderColor: "grey",
                    },
                    // Hover state border color
                    "&:hover fieldset": {
                      borderColor: "#c15454ff",
                    },
                    // Focused (clicked) state border color
                    "&.Mui-focused fieldset": {
                      borderColor: "#c15454ff",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "grey",
                      "&.Mui-focused": {
                        color: "black",
                    },
                  },
              }}
            />

            <SharedButton
              type="submit"
              variant="contained"
              fullWidth
              size="medium"
              // onClick={onLogin}
              onMouseEnter={() => setIcon(<VpnKeyOutlinedIcon fontSize="medium"/>)}   
              onMouseLeave={() => setIcon(<LockOutlinedIcon fontSize="medium"/>)}     
              onMouseDown={() => setIcon(<AirplanemodeActiveOutlinedIcon fontSize="medium"/>)} 
              onMouseUp={() => setIcon(<VpnKeyOutlinedIcon fontSize="medium"/>)}               
              disableRipple
              sx={{
                mt: 1,
                py: 1.2,
                fontWeight: 600,
                fontSize: '1rem',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.2,
                backgroundColor: "#b91c1c",
                borderRadius: "8px",
                transition: "transform 0.15s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                  backgroundColor: "#c15454ff",
                },
                "&:active": {
                  transform: "scale(0.98)",
                  backgroundColor: "#c15454ff",
                },
                 "&.Mui-focusVisible": {
                  backgroundColor: "#c15454ff",
                },
              }}
            >
              {icon} Log In
            </SharedButton>
          </Box>
        </Card>
      </Fade>
    {/* </Box> */}
    </CommonDashboard>
  );
};

export default LoginPage;