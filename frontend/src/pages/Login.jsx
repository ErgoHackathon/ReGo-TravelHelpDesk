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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#fef2f2",
        p: 2
      }}
    >
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
          >
            <TextField
              label="Email"
              type="email"
              fullWidth
              size="small"
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
              fullWidth
              size="small"
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

            <Button
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
            </Button>
          </Box>
        </Card>
      </Fade>
    </Box>
  );
};

export default LoginPage;



// const Login = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { loading, loginError, isAuthenticated } = useSelector((state) => state.auth);

//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   // Redirect if already authenticated
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate('/dashboard');
//     }
//   }, [isAuthenticated, navigate]);

//   // Clear errors on unmount
//   useEffect(() => {
//     return () => {
//       dispatch(clearError());
//     };
//   }, [dispatch]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic validation
//     if (!formData.email || !formData.password) {
//       toast.error('Please fill in all fields');
//       return;
//     }

//     try {
//       await dispatch(login(formData)).unwrap();
//       toast.success('Login successful!');
//       navigate('/dashboard');
//     } catch (error) {
//       // Error is handled by Redux and displayed in UI
//     }
//   };

//   const handleTogglePassword = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//         py: 4
//       }}
//     >
//       <Container maxWidth="sm">
//         <Paper
//           elevation={10}
//           sx={{
//             p: 4,
//             borderRadius: 3
//           }}
//         >
//           {/* Logo/Header */}
//           <Box sx={{ textAlign: 'center', mb: 3 }}>
//             <Flight sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
//             <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
//               ReGo
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Corporate Travel Management
//             </Typography>
//           </Box>

//           {/* Login Form */}
//           <Box component="form" onSubmit={handleSubmit}>
//             <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
//               Sign In
//             </Typography>

//             {loginError && (
//               <Alert severity="error" sx={{ mb: 2 }}>
//                 {loginError}
//               </Alert>
//             )}

//             <TextField
//               fullWidth
//               label="Email Address"
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               margin="normal"
//               required
//               autoComplete="email"
//               autoFocus
//               disabled={loading}
//             />

//             <TextField
//               fullWidth
//               label="Password"
//               name="password"
//               type={showPassword ? 'text' : 'password'}
//               value={formData.password}
//               onChange={handleChange}
//               margin="normal"
//               required
//               autoComplete="current-password"
//               disabled={loading}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       onClick={handleTogglePassword}
//                       edge="end"
//                       disabled={loading}
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 )
//               }}
//             />

//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={rememberMe}
//                   onChange={(e) => setRememberMe(e.target.checked)}
//                   color="primary"
//                   disabled={loading}
//                 />
//               }
//               label="Remember me"
//               sx={{ mt: 1 }}
//             />

//             <Button
//               fullWidth
//               type="submit"
//               variant="contained"
//               size="large"
//               disabled={loading}
//               startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
//               sx={{
//                 mt: 3,
//                 mb: 2,
//                 py: 1.5,
//                 textTransform: 'none',
//                 fontSize: '1rem',
//                 fontWeight: 'bold'
//               }}
//             >
//               {loading ? 'Signing In...' : 'Sign In'}
//             </Button>

//             <Box sx={{ textAlign: 'center', mt: 2 }}>
//               <Typography variant="body2" color="text.secondary">
//                 Don't have an account?{' '}
//                 <Link
//                   component={RouterLink}
//                   to="/register"
//                   underline="hover"
//                   fontWeight="bold"
//                 >
//                   Sign Up
//                 </Link>
//               </Typography>
//             </Box>

//             <Box sx={{ textAlign: 'center', mt: 1 }}>
//               <Link
//                 component={RouterLink}
//                 to="/forgot-password"
//                 variant="body2"
//                 underline="hover"
//                 color="text.secondary"
//               >
//                 Forgot password?
//               </Link>
//             </Box>
//           </Box>
//         </Paper>

//         {/* Demo Credentials (Remove in production) */}
//         <Paper
//           sx={{
//             mt: 2,
//             p: 2,
//             bgcolor: 'info.lighter',
//             borderRadius: 2
//           }}
//         >
//           <Typography variant="caption" color="text.secondary" display="block">
//             <strong>Demo Credentials (for testing):</strong>
//           </Typography>
//           <Typography variant="caption" color="text.secondary" display="block">
//             Email: demo@company.com
//           </Typography>
//           <Typography variant="caption" color="text.secondary" display="block">
//             Password: Demo123!
//           </Typography>
//         </Paper>
//       </Container>
//     </Box>
//   );
// };

// export default Login;


  // export default LoginPa;