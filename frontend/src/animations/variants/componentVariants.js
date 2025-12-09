// animations/variants/componentVariants.js
// ===========================================
// PROFESSIONAL COMPONENT ANIMATIONS
// ===========================================
// Micro-interactions that feel native and polished
// ===========================================

import { ANIMATION_CONFIG } from '../config/animationConfig';

const { duration, easing, colors } = ANIMATION_CONFIG;

// ============================================
// CARD ANIMATIONS
// ============================================

export const cardVariants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.decelerate,
    },
  },
  hover: {
    y: -4,
    boxShadow: "0 12px 24px -8px rgba(0, 0, 0, 0.15)",
    transition: {
      duration: duration.fast,
      ease: easing.standard,
    },
  },
  tap: {
    scale: 0.995,
    transition: {
      duration: duration.instant,
    },
  },
};

// Card with glow effect (for important items)
export const glowCardVariants = {
  ...cardVariants,
  hover: {
    y: -4,
    boxShadow: `0 12px 24px -8px rgba(185, 28, 28, 0.25), 0 0 0 1px rgba(185, 28, 28, 0.1)`,
    transition: {
      duration: duration.fast,
      ease: easing.standard,
    },
  },
};

// Stat card with number animation trigger
export const statCardVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: duration.normal,
      ease: easing.smooth,
    },
  },
  hover: {
    y: -2,
    transition: {
      duration: duration.fast,
      ease: easing.standard,
    },
  },
};

// ============================================
// BUTTON ANIMATIONS
// ============================================

export const buttonVariants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: duration.fast,
      ease: easing.standard,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: duration.instant,
    },
  },
};

// Primary action button (more emphasis)
export const primaryButtonVariants = {
  initial: {
    scale: 1,
    boxShadow: "0 2px 4px rgba(185, 28, 28, 0.2)",
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 8px 16px rgba(185, 28, 28, 0.3)",
    transition: {
      duration: duration.fast,
      ease: easing.standard,
    },
  },
  tap: {
    scale: 0.98,
    boxShadow: "0 2px 4px rgba(185, 28, 28, 0.2)",
    transition: {
      duration: duration.instant,
    },
  },
};

// Icon button with rotation
export const iconButtonVariants = {
  initial: { rotate: 0 },
  hover: {
    rotate: 15,
    scale: 1.1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
    },
  },
  tap: {
    scale: 0.9,
    rotate: 0,
  },
};

// ============================================
// ICON ANIMATIONS
// ============================================

export const iconVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.15,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.9 },
};

// Plane icon (brand specific)
export const planeVariants = {
  initial: { x: 0, y: 0, rotate: 0 },
  hover: {
    x: 3,
    y: -2,
    rotate: -5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  flying: {
    x: [0, 5, 0],
    y: [0, -3, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  takeoff: {
    x: 200,
    y: -100,
    rotate: -30,
    opacity: 0,
    transition: {
      duration: 0.8,
      ease: easing.accelerate,
    },
  },
};

// Upload icon animation
export const uploadIconVariants = {
  initial: { y: 0 },
  hover: {
    y: [-2, 2, -2],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ============================================
// TABLE & LIST ANIMATIONS
// ============================================

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.decelerate,
    },
  },
};

export const tableRowVariants = {
  initial: {
    opacity: 0,
    x: -8,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.normal,
      ease: easing.decelerate,
    },
  },
  hover: {
    backgroundColor: "rgba(185, 28, 28, 0.03)",
    transition: {
      duration: duration.fast,
    },
  },
  exit: {
    opacity: 0,
    x: -8,
    transition: {
      duration: duration.fast,
    },
  },
};

// List item with slide
export const listItemVariants = {
  initial: {
    opacity: 0,
    x: -12,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.normal,
      ease: easing.decelerate,
    },
  },
  hover: {
    x: 4,
    backgroundColor: "rgba(185, 28, 28, 0.03)",
    transition: {
      duration: duration.fast,
    },
  },
};

// ============================================
// FORM & INPUT ANIMATIONS
// ============================================

export const inputFocusVariants = {
  initial: {
    scale: 1,
    borderColor: "#e2e8f0",
  },
  focus: {
    scale: 1.01,
    borderColor: colors.primary,
    boxShadow: `0 0 0 3px rgba(185, 28, 28, 0.1)`,
    transition: {
      duration: duration.fast,
    },
  },
};

export const formFieldVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.decelerate,
    },
  },
};

// ============================================
// CHIP & BADGE ANIMATIONS
// ============================================

export const chipVariants = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25,
    },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: {
      duration: duration.fast,
    },
  },
};

export const badgePulse = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Notification badge pop
export const notificationBadgeVariants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 600,
      damping: 15,
    },
  },
};

// ============================================
// SKELETON & LOADING ANIMATIONS
// ============================================

export const shimmerVariants = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export const pulseVariants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ============================================
// SUCCESS & FEEDBACK ANIMATIONS
// ============================================

export const checkmarkVariants = {
  initial: {
    pathLength: 0,
    opacity: 0,
  },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: 0.4,
        ease: easing.decelerate,
      },
      opacity: {
        duration: 0.1,
      },
    },
  },
};

export const successCircleVariants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

export const rippleVariants = {
  initial: {
    scale: 0.8,
    opacity: 1,
  },
  animate: {
    scale: 2,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: easing.decelerate,
    },
  },
};

// ============================================
// TOOLTIP & POPOVER ANIMATIONS
// ============================================

export const tooltipVariants = {
  initial: {
    opacity: 0,
    y: 4,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: duration.fast,
      ease: easing.decelerate,
    },
  },
  exit: {
    opacity: 0,
    y: 2,
    scale: 0.98,
    transition: {
      duration: duration.instant,
    },
  },
};

export const dropdownVariants = {
  initial: {
    opacity: 0,
    y: -8,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: duration.fast,
      ease: easing.decelerate,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.98,
    transition: {
      duration: duration.instant,
    },
  },
};

// ============================================
// MODAL ANIMATIONS
// ============================================

export const modalBackdropVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: duration.normal,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: duration.fast,
      delay: 0.1,
    },
  },
};

export const modalContentVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: duration.fast,
    },
  },
};

// ============================================
// STEPPER & PROGRESS ANIMATIONS
// ============================================

export const stepperVariants = {
  inactive: {
    scale: 1,
    backgroundColor: "#e2e8f0",
  },
  active: {
    scale: 1.1,
    backgroundColor: colors.primary,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
    },
  },
  completed: {
    scale: 1,
    backgroundColor: colors.success,
  },
};

export const progressBarVariants = {
  initial: { width: 0 },
  animate: (progress) => ({
    width: `${progress}%`,
    transition: {
      duration: duration.slow,
      ease: easing.decelerate,
    },
  }),
};

// ============================================
// DOCUMENT UPLOAD ANIMATIONS
// ============================================

export const documentCardVariants = {
  initial: {
    opacity: 0,
    y: 12,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: duration.normal,
      ease: easing.decelerate,
    },
  },
  hover: {
    y: -2,
    boxShadow: "0 8px 20px -4px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: duration.fast,
    },
  },
  uploaded: {
    borderColor: colors.success,
    backgroundColor: "rgba(22, 163, 74, 0.05)",
  },
  pending: {
    borderColor: "#e2e8f0",
    backgroundColor: "#fafafa",
  },
};

export const uploadZoneVariants = {
  initial: {
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
  },
  hover: {
    borderColor: colors.primary,
    backgroundColor: "rgba(185, 28, 28, 0.03)",
    transition: {
      duration: duration.fast,
    },
  },
  active: {
    borderColor: colors.primary,
    backgroundColor: "rgba(185, 28, 28, 0.08)",
    scale: 1.01,
    transition: {
      duration: duration.fast,
    },
  },
};

export const fileUploadProgressVariants = {
  initial: { scaleX: 0 },
  animate: (progress) => ({
    scaleX: progress / 100,
    transition: {
      duration: duration.fast,
    },
  }),
};