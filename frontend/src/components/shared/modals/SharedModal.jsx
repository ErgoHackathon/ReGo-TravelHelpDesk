// components/shared/SharedModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, IconButton, Typography, Box } from '@mui/material';
import { Close } from '@mui/icons-material';

const modalBackdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15, delay: 0.1 } }
};

const modalContentVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 30 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10,
    transition: { duration: 0.15 }
  }
};

const SharedModal = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'md',
  fullWidth = true,
  showCloseButton = true,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth={maxWidth}
          fullWidth={fullWidth}
          PaperProps={{
            component: motion.div,
            variants: modalContentVariants,
            initial: 'initial',
            animate: 'animate',
            exit: 'exit',
            sx: {
              borderRadius: 3,
              maxHeight: '90vh',
              m: 2,
              overflow: 'hidden',
            },
          }}
          BackdropProps={{
            component: motion.div,
            variants: modalBackdropVariants,
            initial: 'initial',
            animate: 'animate',
            exit: 'exit',
          }}
        >
          {/* Header - Fixed: Using Box instead of DialogTitle to avoid h6 inside h2 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2.5,
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            <Typography 
              variant="h6" 
              component="div" 
              fontWeight={600} 
              sx={{ color: '#1e293b' }}
            >
              {title}
            </Typography>
            {showCloseButton && (
              <motion.div 
                whileHover={{ rotate: 90 }} 
                transition={{ duration: 0.2 }}
              >
                <IconButton
                  onClick={onClose}
                  size="small"
                  sx={{
                    color: '#64748b',
                    '&:hover': { bgcolor: '#fee2e2', color: '#b91c1c' },
                  }}
                >
                  <Close />
                </IconButton>
              </motion.div>
            )}
          </Box>

          <DialogContent sx={{ p: 3 }}>
            {children}
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default SharedModal;