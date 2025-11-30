// ===========================================
// SUCCESS ANIMATION COMPONENT
// ===========================================
// Animated checkmark with optional plane takeoff
// ===========================================

import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import { Flight } from '@mui/icons-material';

const SuccessAnimation = ({ 
  show = false,
  size = 80,
  showPlane = true,
  onComplete 
}) => {
  if (!show) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        zIndex: 9999
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        onAnimationComplete={() => {
          setTimeout(() => onComplete?.(), 1500);
        }}
      >
        {/* Circle background */}
        <motion.div
          style={{
            width: size * 1.5,
            height: size * 1.5,
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
        >
          {/* Checkmark SVG */}
          <svg
            width={size}
            height={size}
            viewBox="0 0 50 50"
            style={{ position: 'absolute' }}
          >
            <motion.path
              d="M14 27 L22 35 L37 16"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>

        {/* Plane takeoff */}
        {showPlane && (
          <motion.div
            style={{
              position: 'absolute',
              bottom: '40%',
              left: '50%'
            }}
            initial={{ x: '-50%', y: 0, opacity: 1 }}
            animate={{ 
              x: ['0%', '100%', '200%'],
              y: [0, -50, -150],
              opacity: [1, 1, 0],
              rotate: [0, -15, -30]
            }}
            transition={{ delay: 0.8, duration: 1, ease: "easeIn" }}
          >
            <Flight sx={{ fontSize: 40, color: '#b91c1c' }} />
          </motion.div>
        )}

        {/* Ripple effect */}
        <motion.div
          style={{
            position: 'absolute',
            width: size * 1.5,
            height: size * 1.5,
            borderRadius: '50%',
            border: '3px solid #22c55e'
          }}
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        />
      </motion.div>
    </Box>
  );
};

export default SuccessAnimation;