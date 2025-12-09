// animations/components/AnimatedModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box } from '@mui/material';
import { Close } from '@mui/icons-material';
import { modalBackdropVariants, modalContentVariants } from '../variants';
import { prefersReducedMotion } from '../config/animationConfig';

const AnimatedModal = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'md',
  fullWidth = true,
  showCloseButton = true,
}) => {
  const reducedMotion = prefersReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth={maxWidth}
          fullWidth={fullWidth}
          PaperProps={{
            component: reducedMotion ? 'div' : motion.div,
            ...(reducedMotion
              ? {}
              : {
                  variants: modalContentVariants,
                  initial: 'initial',
                  animate: 'animate',
                  exit: 'exit',
                }),
            sx: {
              borderRadius: 3,
              maxHeight: '90vh',
              m: 2,
              overflow: 'hidden',
            },
          }}
          BackdropProps={{
            component: reducedMotion ? 'div' : motion.div,
            ...(reducedMotion
              ? {}
              : {
                  variants: modalBackdropVariants,
                  initial: 'initial',
                  animate: 'animate',
                  exit: 'exit',
                }),
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2.5,
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            <Typography variant="h6" component="div" fontWeight={600} sx={{ color: '#1e293b' }}>
              {title}
            </Typography>
            {showCloseButton && (
              <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
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

          <DialogContent sx={{ p: 3 }}>{children}</DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default AnimatedModal;