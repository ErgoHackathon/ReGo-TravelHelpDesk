// src/components/shared/chips/StatusChip.jsx
import React from 'react';
import { Chip } from '@mui/material';

const StatusChip = ({ label, color = 'default' }) => (
  <Chip
    label={label}
    color={color}
    size="small"
  />
);

export default StatusChip;
