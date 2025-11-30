// ===========================================
// PAGE LOADER COMPONENT
// ===========================================
// Full-page loading with animated plane
// ===========================================

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
        backgroundColor: '#fef2f2',
        zIndex: 9999
      }}
    >
      {/* Animated plane */}
      <motion.div
        animate={{
          x: [-100, 100, -100],
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Flight sx={{ fontSize: 60, color: '#b91c1c' }} />
      </motion.div>

      {/* Flight path line */}
      <Box sx={{ width: 200, height: 2, mt: 2, position: 'relative', overflow: 'hidden' }}>
        <motion.div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, #b91c1c, transparent)'
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </Box>

      {/* Loading text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Typography 
          variant="body1" 
          sx={{ mt: 3, color: '#b91c1c', fontWeight: 500 }}
        >
          {message}
        </Typography>
      </motion.div>

      {/* Dots animation */}
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#b91c1c'
            }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PageLoader;