// ===========================================
// ANIMATED BUTTON COMPONENT
// ===========================================
// Enhanced button with hover lift and icon animation
// ===========================================

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@mui/material';
import { buttonVariants, iconVariants } from '../variants';

const AnimatedButton = ({
  children,
  startIcon,
  endIcon,
  animateIcon = true,
  sx = {},
  ...props
}) => {
  const MotionButton = motion.create ? motion.create(Button) : motion(Button);

  return (
    <MotionButton
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        ...sx
      }}
      startIcon={
        startIcon && animateIcon ? (
          <motion.span
            variants={iconVariants}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {startIcon}
          </motion.span>
        ) : startIcon
      }
      endIcon={
        endIcon && animateIcon ? (
          <motion.span
            variants={iconVariants}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {endIcon}
          </motion.span>
        ) : endIcon
      }
      {...props}
    >
      {children}

      {/* Ripple effect overlay */}
      <motion.span
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transform: 'translateX(-100%)',
        }}
        whileHover={{
          transform: 'translateX(100%)',
          transition: { duration: 0.6, ease: 'easeInOut' }
        }}
      />
    </MotionButton>
  );
};

export default AnimatedButton;