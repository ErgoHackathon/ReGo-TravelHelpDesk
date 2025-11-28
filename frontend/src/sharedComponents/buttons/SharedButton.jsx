import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: 8,
  fontWeight: 600,
}));

export default function SharedButton(props) {
  return <StyledButton {...props} />;
}
