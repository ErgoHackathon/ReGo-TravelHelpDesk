import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import PrivateRoute from './PrivateRoute';
import Tickets from '../pages/Tickets';
import FAQs from '../pages/FAQs';
import Notifications from '../pages/Notifications';
import Profile from '../pages/Profile';
import TravelRequests from '../pages/TravelRequests';
import TravelRequestDetail from '../pages/TravelRequestDetail';
import CreateRequest from '../pages/CreateRequest';
import Approvals from '../pages/Approvals';
import NotificationsCenter from '../pages/NotificationsCenter';

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

      <Route
        path="/tickets"
        element={
          <PrivateRoute>
            <Tickets />
          </PrivateRoute>
        }
      />

      <Route
        path="/faqs"
        element={
          <PrivateRoute>
            <FAQs />
          </PrivateRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <NotificationsCenter />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/travel-requests"
        element={
          <PrivateRoute>
            <TravelRequests />
          </PrivateRoute>
        }
      />

      <Route
        path="/travel-requests/new"
        element={
          <PrivateRoute>
            <CreateRequest />
          </PrivateRoute>
        }
      />

      <Route
        path="/travel-requests/:id"
        element={
          <PrivateRoute>
            <TravelRequestDetail />
          </PrivateRoute>
        }
      />

      <Route
        path="/approvals"
        element={
          <PrivateRoute>
            <Approvals />
          </PrivateRoute>
        }
      />

      {/* Routes to be added in later stages */}
      {/* <Route path="/expenses" element={<PrivateRoute><Expenses /></PrivateRoute>} /> */}

      {/* 404 Not Found - redirect to dashboard if authenticated, otherwise to login */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;