// animations/components/AnimatedButton.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@mui/material';
import { buttonVariants, primaryButtonVariants, iconVariants } from '../variants';
import { prefersReducedMotion } from '../config/animationConfig';

const AnimatedButton = ({
  children,
  variant = 'default',
  startIcon,
  endIcon,
  animateIcon = true,
  sx = {},
  ...props
}) => {
  const reducedMotion = prefersReducedMotion();
  const MotionButton = motion(Button);
  
  const selectedVariant = variant === 'primary' ? primaryButtonVariants : buttonVariants;

  if (reducedMotion) {
    return (
      <Button startIcon={startIcon} endIcon={endIcon} sx={sx} {...props}>
        {children}
      </Button>
    );
  }

  return (
    <MotionButton
      variants={selectedVariant}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
      startIcon={
        startIcon && animateIcon ? (
          <motion.span
            variants={iconVariants}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {startIcon}
          </motion.span>
        ) : (
          startIcon
        )
      }
      endIcon={
        endIcon && animateIcon ? (
          <motion.span
            variants={iconVariants}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {endIcon}
          </motion.span>
        ) : (
          endIcon
        )
      }
      {...props}
    >
      {children}
    </MotionButton>
  );
};

export default AnimatedButton;