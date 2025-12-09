// animations/variants/pageTransitions.js
// ===========================================
// PROFESSIONAL PAGE TRANSITIONS
// ===========================================
// Smooth, subtle page transitions inspired by
// Apple, Google Material, and Stripe
// ===========================================

import { ANIMATION_CONFIG } from '../config/animationConfig';

const { duration, easing } = ANIMATION_CONFIG;

// Default page transition - Subtle fade + scale
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
    scale: 0.995,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: duration.normal,
      ease: easing.smooth,
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.995,
    transition: {
      duration: duration.fast,
      ease: easing.accelerate,
    },
  },
};

// Shared axis transition (Material Design 3)
export const sharedAxisX = {
  enter: (direction = 1) => ({
    x: direction * 30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.decelerate,
    },
  },
  exit: (direction = 1) => ({
    x: direction * -30,
    opacity: 0,
    transition: {
      duration: duration.fast,
      ease: easing.accelerate,
    },
  }),
};

// Container transform (for modals/expanding cards)
export const containerTransform = {
  initial: {
    opacity: 0,
    scale: 0.92,
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
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: duration.fast,
      ease: easing.accelerate,
    },
  },
};

// Fade through (for tab switching)
export const fadeThrough = {
  initial: { opacity: 0, scale: 0.98 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.normal,
      ease: easing.decelerate,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    transition: {
      duration: duration.fast,
      ease: easing.accelerate,
    },
  },
};

// Dashboard specific transition
export const dashboardPageVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.decelerate,
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: duration.fast,
    },
  },
};

// Login/Auth page transition
export const authPageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.96,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: duration.slow,
      ease: easing.smooth,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: duration.fast,
    },
  },
};

export default pageVariants;