// ===========================================
// ANIMATED COUNTER COMPONENT
// ===========================================
// Numbers that count up from 0
// ===========================================

import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const AnimatedCounter = ({ 
  value, 
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  style = {},
  className = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  // Parse the value (handle strings like "₹3.2L")
  const numericValue = typeof value === 'string' 
    ? parseFloat(value.replace(/[^0-9.]/g, '')) || 0
    : value;

  const { number } = useSpring({
    from: { number: 0 },
    to: { number: isInView ? numericValue : 0 },
    delay: 200,
    config: { duration }
  });

  // Extract suffix from original value if it's a string
  const extractedSuffix = typeof value === 'string' 
    ? value.replace(/[0-9.,]/g, '').trim() 
    : suffix;

  return (
    <animated.span ref={ref} style={style} className={className}>
      {number.to(n => {
        const formatted = decimals > 0 
          ? n.toFixed(decimals) 
          : Math.floor(n).toLocaleString();
        return `${prefix}${formatted}${extractedSuffix || suffix}`;
      })}
    </animated.span>
  );
};

export default AnimatedCounter;