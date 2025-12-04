// src/components/shared/modals/ModalsContainer.jsx
import React from 'react';
import { Modal, Box, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

const ModalsContainer = ({
  open,
  onClose,
  title,
  children,
  width = 500,
  showCloseButton = true
}) => {
  return (
    <Modal 
      open={open} 
      onClose={onClose}
      aria-labelledby="modal-title"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: width,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {showCloseButton && (
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <Close />
          </IconButton>
        )}

        {title && (
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
          >
            {title}
          </Typography>
        )}

        {children}
      </Box>
    </Modal>
  );
};

export default ModalsContainer;