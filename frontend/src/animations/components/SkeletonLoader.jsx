import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';

const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

const AnimatedSkeleton = ({ 
  variant = 'rectangular', 
  width, 
  height, 
  sx = {} 
}) => {
  return (
    <motion.div
      variants={shimmer}
      animate="animate"
      style={{
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        borderRadius: variant === 'circular' ? '50%' : '4px',
        width: width,
        height: height,
        ...sx
      }}
    />
  );
};

// Pre-built skeleton layouts
export const CardSkeleton = () => (
  <Box sx={{ p: 2 }}>
    <AnimatedSkeleton height={140} sx={{ mb: 2, borderRadius: '8px' }} />
    <AnimatedSkeleton height={20} width="80%" sx={{ mb: 1 }} />
    <AnimatedSkeleton height={20} width="60%" />
  </Box>
);

export const TableRowSkeleton = ({ columns = 4 }) => (
  <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
    {[...Array(columns)].map((_, i) => (
      <AnimatedSkeleton 
        key={i} 
        height={20} 
        sx={{ flex: 1 }} 
      />
    ))}
  </Box>
);

export const StatCardSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <AnimatedSkeleton height={16} width={100} sx={{ mb: 2 }} />
    <AnimatedSkeleton height={40} width={80} sx={{ mb: 1 }} />
    <AnimatedSkeleton height={14} width={120} />
  </Box>
);

export const DashboardSkeleton = () => (
  <Box sx={{ p: 3 }}>
    {/* Header skeleton */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
      <AnimatedSkeleton variant="circular" width={60} height={60} />
      <Box sx={{ flex: 1 }}>
        <AnimatedSkeleton height={28} width={200} sx={{ mb: 1 }} />
        <AnimatedSkeleton height={20} width={150} />
      </Box>
      <AnimatedSkeleton height={40} width={180} sx={{ borderRadius: '8px' }} />
    </Box>
    
    {/* Stats skeleton */}
    <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
      {[1, 2, 3].map(i => (
        <Box key={i} sx={{ flex: 1 }}>
          <StatCardSkeleton />
        </Box>
      ))}
    </Box>
    
    {/* Table skeleton */}
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      {[1, 2, 3, 4].map(i => (
        <TableRowSkeleton key={i} columns={5} />
      ))}
    </Box>
  </Box>
);

export default AnimatedSkeleton;