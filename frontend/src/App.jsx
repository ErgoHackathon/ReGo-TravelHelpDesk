// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';
<Route path="/dashboard/*" element={<DashboardRouter />} />


// Simple fallback loader
const SimpleLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#fef2f2',
    fontSize: '1.2rem',
    color: '#b91c1c'
  }}>
    Loading...
  </div>
);

// Theme
const theme = createTheme({
  palette: {
    primary: { main: '#b91c1c', light: '#c15454', dark: '#8b1f1f' },
    secondary: { main: '#fef2f2' },
    background: { default: '#fef2f2', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: '8px' } } },
    MuiCard: { styleOverrides: { root: { borderRadius: '12px' } } },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback={<SimpleLoader />}>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/create-request" element={<CreateRequest />} />
              <Route path="/dashboard/*" element={<DashboardRouter />} />
              <Route path="/application/:id" element={<ApplicationStatus />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
