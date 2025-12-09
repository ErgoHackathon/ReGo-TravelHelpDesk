// animations/components/PageLoader.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { Flight } from '@mui/icons-material';

const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        zIndex: 9999,
      }}
    >
      {/* Animated plane with subtle movement */}
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Flight sx={{ fontSize: 48, color: '#b91c1c' }} />
        </motion.div>
      </motion.div>

      {/* Subtle line animation */}
      <Box sx={{ width: 120, height: 2, mt: 3, bgcolor: '#f1f5f9', borderRadius: 1, overflow: 'hidden' }}>
        <motion.div
          style={{
            width: '40%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, #b91c1c, transparent)',
            borderRadius: 4,
          }}
          animate={{ x: ['-100%', '350%'] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </Box>

      {/* Loading text with fade */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Typography variant="body2" sx={{ mt: 2, color: '#64748b', fontWeight: 500 }}>
          {message}
        </Typography>
      </motion.div>
    </Box>
  );
};

export default PageLoader;