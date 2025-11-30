import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal, Box, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      duration: 0.2
    }
  }
};

const AnimatedModal = ({
  open,
  onClose,
  children,
  maxWidth = 600,
  showCloseButton = true,
  sx = {}
}) => {
  return (
    <AnimatePresence>
      {open && (
        <Modal
          open={open}
          onClose={onClose}
          closeAfterTransition
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}
        >
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={onClose}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: maxWidth,
                maxHeight: '90vh',
                overflow: 'auto'
              }}
            >
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                  position: 'relative',
                  p: 4,
                  ...sx
                }}
              >
                {/* Close button */}
                {showCloseButton && (
                  <motion.div
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16
                    }}
                  >
                    <IconButton
                      onClick={onClose}
                      sx={{
                        bgcolor: 'rgba(185, 28, 28, 0.1)',
                        '&:hover': {
                          bgcolor: 'rgba(185, 28, 28, 0.2)',
                          transform: 'rotate(90deg)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Close sx={{ color: '#b91c1c' }} />
                    </IconButton>
                  </motion.div>
                )}

                {children}
              </Box>
            </motion.div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default AnimatedModal;