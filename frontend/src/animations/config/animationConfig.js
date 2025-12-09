// animations/config/animationConfig.js
// ===========================================
// ANIMATION CONFIGURATION
// ===========================================
// Central configuration for all animations
// Ensures consistency across the entire app
// ===========================================

export const ANIMATION_CONFIG = {
  // Timing constants (in seconds)
  duration: {
    instant: 0.1,
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    slower: 0.8,
    slowest: 1.2,
  },

  // Professional easing curves
  easing: {
    // Standard Material Design easings
    standard: [0.4, 0.0, 0.2, 1],
    decelerate: [0.0, 0.0, 0.2, 1],
    accelerate: [0.4, 0.0, 1, 1],
    
    // Custom professional easings
    smooth: [0.25, 0.46, 0.45, 0.94],
    bounce: [0.68, -0.55, 0.265, 1.55],
    elastic: [0.175, 0.885, 0.32, 1.275],
    
    // Apple-inspired easings
    apple: [0.25, 0.1, 0.25, 1],
    appleSpring: { type: "spring", stiffness: 300, damping: 30 },
  },

  // Stagger delays
  stagger: {
    fast: 0.03,
    normal: 0.05,
    slow: 0.08,
    verySlow: 0.12,
  },

  // Theme colors
  colors: {
    primary: '#b91c1c',
    primaryLight: '#fee2e2',
    primaryDark: '#991b1b',
    success: '#16a34a',
    warning: '#d97706',
    info: '#3b82f6',
  },

  // Breakpoints for responsive animations
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
  },
};

// Check for reduced motion preference
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Get animation settings based on user preference
export const getAnimationSettings = () => {
  if (prefersReducedMotion()) {
    return {
      duration: { ...ANIMATION_CONFIG.duration, fast: 0, normal: 0, slow: 0.1 },
      shouldAnimate: false,
    };
  }
  return {
    duration: ANIMATION_CONFIG.duration,
    shouldAnimate: true,
  };
};

export default ANIMATION_CONFIG;
