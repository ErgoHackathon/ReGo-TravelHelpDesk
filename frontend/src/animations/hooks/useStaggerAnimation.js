// ===========================================
// STAGGER ANIMATION HOOK
// ===========================================
// Easily create staggered animations for lists
// ===========================================

import { useMemo } from 'react';

export const useStaggerAnimation = (itemCount, baseDelay = 0.1) => {
  const staggerDelays = useMemo(() => {
    return Array.from({ length: itemCount }, (_, i) => baseDelay * i);
  }, [itemCount, baseDelay]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: baseDelay,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return { staggerDelays, containerVariants, itemVariants };
};

export default useStaggerAnimation;