import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from '../pages/Register';
import DashboardRouter from '../pages/Dashboard/DashboardRouter';
import PrivateRoute from './PrivateRoute';
import LoginPage from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';


// Main routing component
function AppRoutes() {
  return (
    <Routes>
      Public routes
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardRouter />
          </PrivateRoute>
        }
      />

      {/* Placeholder for forgot password */}
      <Route 
        path="/forgot-password" 
        element={
          // <div style={{ padding: '50px', textAlign: 'center', backgroundColor:'#fef2f2' }}>
          //   <h2>Forgot Password</h2>
          //   <p>This feature will be implemented in a later phase.</p>
          //   <a href="/login">Back to Login</a>
          // </div>
          <ForgotPassword />
        } 
      />

      {/* Routes to be added in later stages */}
      {/* <Route path="/travel-requests" element={<PrivateRoute><TravelRequests /></PrivateRoute>} /> */}
      {/* <Route path="/approvals" element={<PrivateRoute><Approvals /></PrivateRoute>} /> */}
      {/* <Route path="/expenses" element={<PrivateRoute><Expenses /></PrivateRoute>} /> */}

      {/* 404 Not Found - redirect to dashboard if authenticated, otherwise to login */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;