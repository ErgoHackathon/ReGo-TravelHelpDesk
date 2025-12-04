// src/components/shared/chips/StatusChip.jsx
import React from 'react';
import { Chip } from '@mui/material';

const getStatusColor = (status) => {
  if (!status) return 'default';
  const s = status.toLowerCase();
  if (s.includes('approved') || s.includes('completed')) return 'success';
  if (s.includes('pending') || s.includes('review') || s.includes('process') || s.includes('awaiting') || s.includes('progress')) return 'warning';
  if (s.includes('rejected') || s.includes('cancelled')) return 'error';
  if (s.includes('booked') || s.includes('confirmed')) return 'info';
  return 'default';
};

const StatusChip = ({ label, color }) => {
  const chipColor = color || getStatusColor(label);
  return (
    <Chip
      label={label}
      color={chipColor}
      size="small"
      sx={{ fontWeight: 500 }}
    />
  );
};

export default StatusChip;
