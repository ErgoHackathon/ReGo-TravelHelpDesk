// ===========================================
// FLIP BOARD COMPONENT
// ===========================================
// Airport-style flip text animation
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography } from '@mui/material';


const FlipChar = ({ char, delay = 0 }) => {
  return (
    <Box
      sx={{
        display: 'inline-block',
        position: 'relative',
        width: char === ' ' ? '0.3em' : '0.6em',
        height: '1.2em',
        perspective: '500px',
        mx: '1px'
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={char}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{
            duration: 0.3,
            delay: delay,
            ease: "easeOut"
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#1a1a1a',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformStyle: 'preserve-3d',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          <Typography
            sx={{
              color: '#fff',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              fontSize: 'inherit',
              textTransform: 'uppercase'
            }}
          >
            {char}
          </Typography>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

const FlipBoard = ({ 
  text, 
  fontSize = '1.5rem',
  staggerDelay = 0.05,
  color = '#b91c1c',
  backgroundColor = '#1a1a1a'
}) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  return (
    <Box
      sx={{
        display: 'inline-flex',
        padding: '8px 12px',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: '4px',
        fontSize: fontSize
      }}
    >
      {displayText.split('').map((char, index) => (
        <FlipChar 
          key={`${index}-${char}`} 
          char={char} 
          delay={index * staggerDelay}
        />
      ))}
    </Box>
  );
};

export default FlipBoard;