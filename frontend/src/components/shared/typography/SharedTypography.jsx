// src/sharedComponents/typography/SharedTypography.jsx
import React from 'react';
import { Typography } from '@mui/material';

const variants = {
  pageTitle: {
    variant: 'h4',
    fontWeight: 700,
    mb: 3
  },
  sectionTitle: {
    variant: 'h6',
    fontWeight: 600,
    mb: 2
  },
  cardTitle: {
    variant: 'h6',
    fontWeight: 600,
    color: '#b91c1c'
  },
  label: {
    variant: 'body2',
    color: 'text.secondary'
  },
  error: {
    variant: 'body2',
    color: 'error',
    fontSize: '0.875rem'
  }
};

const SharedTypography = ({ variant = 'body1', children, ...props }) => {
  const variantStyles = variants[variant] || {};
  
  return (
    <Typography {...variantStyles} {...props}>
      {children}
    </Typography>
  );
};

export default SharedTypography;