// ===========================================
// SCROLL ANIMATION HOOK
// ===========================================
// Trigger animations when element enters viewport
// ===========================================

import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const useScrollAnimation = (options = {}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true, // Only animate once
    margin: "-100px", // Trigger 100px before element is in view
    ...options
  });

  return { ref, isInView };
};

export default useScrollAnimation;