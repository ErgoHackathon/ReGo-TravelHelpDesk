import React from 'react';
import { Skeleton } from '@mui/material';

export const ContentLoader = ({ variant = 'rectangular', ...props }) => (
  <Skeleton 
    variant={variant} 
    animation="wave" 
    {...props} 
  />
);
