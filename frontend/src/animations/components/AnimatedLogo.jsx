// ===========================================
// ANIMATED LOGO COMPONENT
// ===========================================
// Animated plane logo with hover effects
// ===========================================

import React from 'react';
import { motion } from 'framer-motion';
import { Flight } from '@mui/icons-material';

const AnimatedLogo = ({ 
  size = 60, 
  color = '#b91c1c',
  enableFloat = true 
}) => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ 
        scale: 1, 
        rotate: 0,
        ...(enableFloat && {
          y: [0, -5, 0],
        })
      }}
      transition={{
        scale: { type: "spring", stiffness: 200, damping: 15 },
        rotate: { type: "spring", stiffness: 200, damping: 15 },
        y: { 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }
      }}
      whileHover={{
        scale: 1.1,
        rotate: [0, -10, 10, 0],
        transition: { duration: 0.5 }
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }}
    >
      <Flight 
        sx={{ 
          fontSize: size, 
          color: color,
          filter: 'drop-shadow(0 4px 8px rgba(185, 28, 28, 0.3))'
        }} 
      />
    </motion.div>
  );
};

export default AnimatedLogo;