// ===========================================
// COMPONENT ANIMATION VARIANTS
// ===========================================
// Reusable animations for UI components
// ===========================================

// Card entrance animation
export const cardVariants = {
  initial: { 
    opacity: 0, 
    y: 30,
    scale: 0.95 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(185, 28, 28, 0.15)",
    transition: { duration: 0.3, ease: "easeOut" }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// Button animations
export const buttonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.03,
    y: -2,
    boxShadow: "0 10px 30px rgba(185, 28, 28, 0.3)",
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: { 
    scale: 0.97,
    y: 0,
    transition: { duration: 0.1 }
  }
};

// Icon rotation/bounce
export const iconVariants = {
  initial: { rotate: 0, scale: 1 },
  hover: { 
    rotate: [0, -10, 10, -5, 5, 0],
    scale: 1.1,
    transition: { duration: 0.5 }
  },
  tap: { scale: 0.9 }
};

// Plane icon special animation
export const planeVariants = {
  initial: { x: 0, y: 0, rotate: 0 },
  hover: {
    x: [0, 5, 0],
    y: [0, -3, 0],
    rotate: [0, 5, 0],
    transition: { 
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  takeoff: {
    x: [0, 200],
    y: [0, -100],
    rotate: [0, -45],
    opacity: [1, 0],
    transition: { duration: 0.8, ease: "easeIn" }
  }
};

// Stagger container (for lists)
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  }
};

// Stagger item (for list items)
export const staggerItem = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// Table row animation
export const tableRowVariants = {
  initial: { opacity: 0, x: -30 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  hover: {
    backgroundColor: "rgba(185, 28, 28, 0.05)",
    x: 5,
    transition: { duration: 0.2 }
  }
};

// Stat card number animation trigger
export const statCardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.9 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  hover: {
    y: -5,
    transition: { duration: 0.3 }
  }
};

// Chip/Badge pop animation
export const chipVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25
    }
  }
};

// Success checkmark draw
export const checkmarkVariants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: { 
    pathLength: 1, 
    opacity: 1,
    transition: {
      pathLength: { duration: 0.5, ease: "easeInOut" },
      opacity: { duration: 0.2 }
    }
  }
};

// Pulse animation (for pending status)
export const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Skeleton shimmer effect
export const shimmerVariants = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear"
    }
  }
};