import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import PrivateRoute from './PrivateRoute';

// Main routing component
function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
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