// ===========================================
// ANIMATED CARD COMPONENT
// ===========================================
// Cards with entrance animation and hover effects
// ===========================================

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@mui/material';
import { cardVariants } from '../variants';

const AnimatedCard = ({ 
  children, 
  delay = 0,
  enableHover = true,
  sx = {},
  ...props 
}) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={enableHover ? "hover" : undefined}
      whileTap={enableHover ? "tap" : undefined}
      transition={{ delay }}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          height: '100%',
          transition: 'box-shadow 0.3s ease',
          ...sx
        }}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;