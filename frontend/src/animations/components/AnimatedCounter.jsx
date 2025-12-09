// animations/components/AnimatedCounter.jsx
import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { prefersReducedMotion } from '../config/animationConfig';

const AnimatedCounter = ({
  value,
  duration = 1.5,
  prefix = '',
  suffix = '',
  decimals = 0,
  style = {},
  className = '',
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const reducedMotion = prefersReducedMotion();

  // Parse numeric value
  const numericValue =
    typeof value === 'string'
      ? parseFloat(value.replace(/[^0-9.-]/g, '')) || 0
      : value;

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: duration * 1000,
  });

  const displayValue = useTransform(springValue, (latest) => {
    const formatted = decimals > 0 ? latest.toFixed(decimals) : Math.floor(latest).toLocaleString();
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    if (isInView && !reducedMotion) {
      springValue.set(numericValue);
    }
  }, [isInView, numericValue, springValue, reducedMotion]);

  if (reducedMotion) {
    return (
      <span ref={ref} style={style} className={className}>
        {prefix}
        {decimals > 0 ? numericValue.toFixed(decimals) : numericValue.toLocaleString()}
        {suffix}
      </span>
    );
  }

  return (
    <motion.span ref={ref} style={style} className={className}>
      {displayValue}
    </motion.span>
  );
};

export default AnimatedCounter;