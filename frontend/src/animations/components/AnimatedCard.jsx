// animations/components/AnimatedCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@mui/material';
import { cardVariants, glowCardVariants, statCardVariants } from '../variants';
import { prefersReducedMotion } from '../config/animationConfig';

const variantMap = {
  default: cardVariants,
  glow: glowCardVariants,
  stat: statCardVariants,
};

const AnimatedCard = ({
  children,
  variant = 'default',
  delay = 0,
  enableHover = true,
  sx = {},
  ...props
}) => {
  const reducedMotion = prefersReducedMotion();
  const selectedVariant = variantMap[variant] || cardVariants;

  if (reducedMotion) {
    return (
      <Card sx={{ height: '100%', ...sx }} {...props}>
        {children}
      </Card>
    );
  }

  return (
    <motion.div
      variants={selectedVariant}
      initial="initial"
      animate="animate"
      whileHover={enableHover ? "hover" : undefined}
      whileTap={enableHover ? "tap" : undefined}
      custom={delay}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          height: '100%',
          transition: 'box-shadow 0.2s ease',
          ...sx,
        }}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;