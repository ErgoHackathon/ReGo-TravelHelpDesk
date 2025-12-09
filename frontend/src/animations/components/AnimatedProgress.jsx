// animations/components/AnimatedProgress.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Box, LinearProgress } from '@mui/material';
import { ANIMATION_CONFIG } from '../config/animationConfig';

const AnimatedProgress = ({
  value = 0,
  color = 'primary',
  height = 8,
  showGlow = false,
  sx = {},
}) => {
  const glowColor = color === 'success' ? '22, 163, 74' : '185, 28, 28';

  return (
    <Box sx={{ position: 'relative', width: '100%', ...sx }}>
      <LinearProgress
        variant="determinate"
        value={0}
        sx={{
          height,
          borderRadius: height / 2,
          bgcolor: '#e2e8f0',
          '& .MuiLinearProgress-bar': {
            borderRadius: height / 2,
          },
        }}
      />
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{
          duration: ANIMATION_CONFIG.duration.slow,
          ease: ANIMATION_CONFIG.easing.decelerate,
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          borderRadius: height / 2,
          background:
            color === 'success'
              ? 'linear-gradient(90deg, #22c55e, #16a34a)'
              : 'linear-gradient(90deg, #ef4444, #b91c1c)',
          boxShadow: showGlow ? `0 0 12px rgba(${glowColor}, 0.4)` : 'none',
        }}
      />
    </Box>
  );
};

export default AnimatedProgress;