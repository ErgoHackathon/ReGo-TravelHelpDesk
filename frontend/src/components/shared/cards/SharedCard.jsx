// src/components/shared/cards/SharedCard.jsx
import React from 'react';
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme, variant = 'default' }) => ({
  borderRadius: 12,
  transition: 'all 0.2s ease',
  
  ...(variant === 'stat' && {
    padding: theme.spacing(3),
    border: '1.5px solid',
    borderTop: '7px solid',
  }),

  ...(variant === 'dashboard' && {
    padding: theme.spacing(3),
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  }),

  ...(variant === 'auth' && {
    padding: theme.spacing(4),
    maxWidth: 400,
    margin: '0 auto',
    borderTop: `8px solid ${theme.palette.primary.main}`,
  })
}));

const SharedCard = ({ variant = 'default', children, ...props }) => {
  return (
    <StyledCard variant={variant} {...props}>
      {children}
    </StyledCard>
  );
};

export default SharedCard;