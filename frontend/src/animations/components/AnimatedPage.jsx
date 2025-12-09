// animations/components/AnimatedPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants, dashboardPageVariants, authPageVariants } from '../variants';
import { prefersReducedMotion } from '../config/animationConfig';

const AnimatedPage = ({
  children,
  variant = 'default',
  className = '',
  style = {},
}) => {
  const reducedMotion = prefersReducedMotion();

  const variants = {
    default: pageVariants,
    dashboard: dashboardPageVariants,
    auth: authPageVariants,
    none: {
      initial: {},
      animate: {},
      exit: {},
    },
  };

  const selectedVariant = reducedMotion ? variants.none : variants[variant];

  return (
    <motion.div
      variants={selectedVariant}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
      style={{
        width: '100%',
        minHeight: '100vh',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;