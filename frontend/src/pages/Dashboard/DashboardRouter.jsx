import React from 'react';
import { useSelector } from 'react-redux';
import DashboardEmployee from './DashboardEmployee';
import DashboardManager from './DashboardManager';
// Import other dashboards when ready
// import DashboardSVP from './DashboardSVP';
// import DashboardAdmin from './DashboardAdmin';

/**
 * Dashboard Router - Shows correct dashboard based on user role
 */
const DashboardRouter = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Route to correct dashboard based on role
  switch (user.role) {
    case 'EMPLOYEE':
      return <DashboardEmployee />;
    
    case 'MANAGER':
    case 'AVP':
      return <DashboardManager />;
    
    case 'SVP':
    case 'CHRO':
    case 'FINANCE':
      // Temporarily show Manager dashboard until we create SVP dashboard
      return <DashboardManager />;
    
    case 'ADMIN':
    case 'TRAVEL_DESK':
      // Temporarily show Employee dashboard until we create Admin dashboard
      return <DashboardEmployee />;
    
    default:
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Unknown Role: {user.role}</h2>
          <p>Please contact administrator</p>
        </div>
      );
  }
};

export default DashboardRouter;