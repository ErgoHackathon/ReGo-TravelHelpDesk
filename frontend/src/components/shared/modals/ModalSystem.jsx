// src/components/shared/modals/ModalSystem.jsx
import React from 'react';
import { SharedModal } from './SharedModal';
import { SharedTypography } from '../typography';
import { SharedButton } from '../buttons';
import { Box } from '@mui/material';

export const ConfirmModal = ({ 
  open, 
  onClose, 
  title, 
  message, 
  onConfirm 
}) => (
  <SharedModal open={open} onClose={onClose}>
    <SharedTypography variant="cardTitle">{title}</SharedTypography>
    <SharedTypography variant="body1">{message}</SharedTypography>
    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
      <SharedButton variant="secondary" onClick={onClose}>
        Cancel
      </SharedButton>
      <SharedButton variant="primary" onClick={onConfirm}>
        Confirm
      </SharedButton>
    </Box>
  </SharedModal>
);

export const FormModal = ({ 
  open, 
  onClose, 
  title, 
  children 
}) => (
  <SharedModal open={open} onClose={onClose}>
    <SharedTypography variant="cardTitle">{title}</SharedTypography>
    {children}
  </SharedModal>
);