// ===========================================
// PAGE TRANSITION VARIANTS
// ===========================================
// These define how pages enter and exit
// Adjust 'duration' to make faster/slower
// ===========================================

export const pageVariants = {
  // Initial state (before page appears)
  initial: {
    opacity: 0,
    scale: 0.96,
    y: 20,
  },
  
  // Animated state (when page is visible)
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom easing curve
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  
  // Exit state (when navigating away)
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

// Slide from right (for forward navigation)
export const slideInRight = {
  initial: { x: 100, opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { 
    x: -100, 
    opacity: 0,
    transition: { duration: 0.3 }
  },
};

// Slide from bottom (for modals)
export const slideInBottom = {
  initial: { y: 50, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: { 
    y: 50, 
    opacity: 0,
    transition: { duration: 0.3 }
  },
};

// Fade only (for subtle transitions)
export const fadeOnly = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.4 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  },
};