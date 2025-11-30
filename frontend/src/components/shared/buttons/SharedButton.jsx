// src/components/shared/buttons/SharedButton.jsx
import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled MUI Button
const StyledButton = styled(Button)(({ theme, variant = 'primary' }) => ({
  textTransform: 'none',
  borderRadius: 8,
  fontWeight: 600,
  // ... add more button styles if needed
}));

// SharedButton component
const SharedButton = ({ variant, children, ...props }) => (
  <StyledButton variant={variant} {...props}>
    {children}
  </StyledButton>
);

export default SharedButton;
