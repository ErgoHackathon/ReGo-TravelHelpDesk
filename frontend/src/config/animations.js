/**
 * Animation Configuration
 * Centralized Framer Motion animation variants for consistent animations
 * across the application
 */

// ============================================
// TIMING CONSTANTS
// ============================================

export const duration = {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    verySlow: 0.8
};

export const easing = {
    smooth: [0.6, 0.05, 0.01, 0.9],
    bounce: [0.68, -0.55, 0.265, 1.55],
    elastic: [0.175, 0.885, 0.32, 1.275],
    easeInOut: [0.4, 0, 0.2, 1],
    easeOut: [0, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1]
};

// ============================================
// PAGE TRANSITIONS
// ============================================

export const pageVariants = {
    initial: {
        opacity: 0,
        y: 20
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: duration.normal,
            ease: easing.smooth
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: duration.fast,
            ease: easing.easeIn
        }
    }
};

export const pageSlideVariants = {
    initial: {
        opacity: 0,
        x: -50
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: duration.normal,
            ease: easing.smooth
        }
    },
    exit: {
        opacity: 0,
        x: 50,
        transition: {
            duration: duration.fast
        }
    }
};

// ============================================
// FADE ANIMATIONS
// ============================================

export const fadeIn = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            duration: duration.normal,
            ease: easing.easeOut
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: duration.fast
        }
    }
};

export const fadeInUp = {
    initial: {
        opacity: 0,
        y: 30
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: duration.normal,
            ease: easing.smooth
        }
    },
    exit: {
        opacity: 0,
        y: -30,
        transition: {
            duration: duration.fast
        }
    }
};

export const fadeInDown = {
    initial: {
        opacity: 0,
        y: -30
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: duration.normal,
            ease: easing.smooth
        }
    }
};

// ============================================
// SCALE ANIMATIONS
// ============================================

export const scaleUp = {
    initial: {
        opacity: 0,
        scale: 0.9
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: duration.normal,
            ease: easing.smooth
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: {
            duration: duration.fast
        }
    }
};

export const scaleIn = {
    initial: { scale: 0 },
    animate: {
        scale: 1,
        transition: {
            duration: duration.normal,
            ease: easing.bounce
        }
    },
    exit: {
        scale: 0,
        transition: {
            duration: duration.fast
        }
    }
};

// ============================================
// SLIDE ANIMATIONS
// ============================================

export const slideInLeft = {
    initial: {
        opacity: 0,
        x: -100
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: duration.normal,
            ease: easing.smooth
        }
    }
};

export const slideInRight = {
    initial: {
        opacity: 0,
        x: 100
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: duration.normal,
            ease: easing.smooth
        }
    }
};

// ============================================
// STAGGER ANIMATIONS
// ============================================

export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

export const staggerItem = {
    initial: {
        opacity: 0,
        y: 20
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: duration.normal,
            ease: easing.smooth
        }
    }
};

export const staggerFast = {
    animate: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.05
        }
    }
};

// ============================================
// MODAL ANIMATIONS
// ============================================

export const modalBackdrop = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            duration: duration.fast
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: duration.fast
        }
    }
};

export const modalContent = {
    initial: {
        opacity: 0,
        scale: 0.95,
        y: 20
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: duration.normal,
            ease: easing.smooth
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: {
            duration: duration.fast
        }
    }
};

export const modalSlideUp = {
    initial: {
        opacity: 0,
        y: '100%'
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: duration.normal,
            ease: easing.smooth
        }
    },
    exit: {
        opacity: 0,
        y: '100%',
        transition: {
            duration: duration.normal
        }
    }
};

// ============================================
// BUTTON ANIMATIONS
// ============================================

export const buttonHover = {
    scale: 1.05,
    transition: {
        duration: duration.fast,
        ease: easing.easeOut
    }
};

export const buttonTap = {
    scale: 0.95,
    transition: {
        duration: 0.1
    }
};

export const buttonPulse = {
    scale: [1, 1.05, 1],
    transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: easing.easeInOut
    }
};

// ============================================
// CARD ANIMATIONS
// ============================================

export const cardHover = {
    y: -4,
    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.15)',
    transition: {
        duration: duration.fast,
        ease: easing.easeOut
    }
};

export const cardVariants = {
    initial: {
        opacity: 0,
        y: 20
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: duration.normal,
            ease: easing.smooth
        }
    },
    hover: {
        y: -4,
        boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.15)',
        transition: {
            duration: duration.fast
        }
    }
};

// ============================================
// LIST ANIMATIONS
// ============================================

export const listContainer = {
    animate: {
        transition: {
            staggerChildren: 0.08
        }
    }
};

export const listItem = {
    initial: {
        opacity: 0,
        x: -20
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: duration.normal,
            ease: easing.smooth
        }
    }
};

// ============================================
// TABLE ANIMATIONS
// ============================================

export const tableRow = {
    initial: {
        opacity: 0,
        x: -10
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: duration.fast
        }
    },
    hover: {
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        transition: {
            duration: 0.1
        }
    }
};

// ============================================
// LOADING ANIMATIONS
// ============================================

export const spinner = {
    animate: {
        rotate: 360,
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
        }
    }
};

export const pulse = {
    animate: {
        scale: [1, 1.1, 1],
        opacity: [1, 0.8, 1],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: easing.easeInOut
        }
    }
};

// ============================================
// NOTIFICATION ANIMATIONS
// ============================================

export const notificationSlideIn = {
    initial: {
        opacity: 0,
        x: 100,
        scale: 0.95
    },
    animate: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            duration: duration.normal,
            ease: easing.smooth
        }
    },
    exit: {
        opacity: 0,
        x: 100,
        scale: 0.95,
        transition: {
            duration: duration.fast
        }
    }
};

// ============================================
// NAVBAR ANIMATIONS
// ============================================

export const navbarSlideDown = {
    initial: {
        y: -100,
        opacity: 0
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: duration.normal,
            ease: easing.smooth
        }
    }
};

export const navItemHover = {
    scale: 1.05,
    color: '#b91c1c',
    transition: {
        duration: duration.fast
    }
};

// ============================================
// PARALLAX VARIANTS
// ============================================

export const parallaxSlow = {
    initial: { y: 0 },
    animate: {
        y: -20,
        transition: {
            duration: duration.verySlow,
            ease: easing.easeOut
        }
    }
};

export const parallaxFast = {
    initial: { y: 0 },
    animate: {
        y: -40,
        transition: {
            duration: duration.slow,
            ease: easing.easeOut
        }
    }
};

// ============================================
// EXPORT ALL VARIANTS
// ============================================

const animations = {
    // Timing
    duration,
    easing,

    // Page transitions
    pageVariants,
    pageSlideVariants,

    // Fade
    fadeIn,
    fadeInUp,
    fadeInDown,

    // Scale
    scaleUp,
    scaleIn,

    // Slide
    slideInLeft,
    slideInRight,

    // Stagger
    staggerContainer,
    staggerItem,
    staggerFast,

    // Modal
    modalBackdrop,
    modalContent,
    modalSlideUp,

    // Button
    buttonHover,
    buttonTap,
    buttonPulse,

    // Card
    cardHover,
    cardVariants,

    // List
    listContainer,
    listItem,

    // Table
    tableRow,

    // Loading
    spinner,
    pulse,

    // Notification
    notificationSlideIn,

    // Navbar
    navbarSlideDown,
    navItemHover,

    // Parallax
    parallaxSlow,
    parallaxFast
};

export default animations;
