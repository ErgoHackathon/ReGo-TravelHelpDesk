// ===========================================
// ANIMATED PAGE WRAPPER
// ===========================================
// Wrap your page content with this component
// for automatic enter/exit animations
// ===========================================

import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '../variants';

const AnimatedPage = ({ 
  children, 
  variant = 'default', // 'default', 'slide', 'fade'
  className = '',
  style = {}
}) => {
  const variants = {
    default: pageVariants,
    slide: {
      initial: { x: 100, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: { duration: 0.5 } },
      exit: { x: -100, opacity: 0, transition: { duration: 0.3 } }
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.4 } },
      exit: { opacity: 0, transition: { duration: 0.2 } }
    }
  };

  return (
    <motion.div
      variants={variants[variant]}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
      style={{ 
        width: '100%', 
        minHeight: '100vh',
        ...style 
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;