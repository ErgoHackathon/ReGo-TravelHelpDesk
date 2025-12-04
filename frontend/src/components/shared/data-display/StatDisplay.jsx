// src/components/shared/data-display/StatDisplay.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import SharedCard from '../cards/SharedCard'; // if default export


const StatDisplay = ({ title, value, icon, trend }) => (
  <SharedCard>
    <Box sx={{ p: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 1,
        mt: 1 
      }}>
        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
        {icon}
      </Box>

      {trend && (
        <Typography 
          variant="body2"
          color={trend > 0 ? 'success.main' : 'error.main'}
          sx={{ mt: 1 }}
        >
          {trend > 0 ? '+' : ''}{trend}% vs last month
        </Typography>
      )}
    </Box>
  </SharedCard>
);

export default StatDisplay;