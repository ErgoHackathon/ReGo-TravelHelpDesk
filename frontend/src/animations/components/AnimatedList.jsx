// animations/components/AnimatedList.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, listItemVariants } from '../variants';
import { prefersReducedMotion } from '../config/animationConfig';

const AnimatedList = ({
  children,
  items,
  renderItem,
  keyExtractor,
  className = '',
  itemClassName = '',
}) => {
  const reducedMotion = prefersReducedMotion();

  if (reducedMotion) {
    return (
      <div className={className}>
        {items.map((item, index) => (
          <div key={keyExtractor ? keyExtractor(item, index) : index} className={itemClassName}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className={className}
    >
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={keyExtractor ? keyExtractor(item, index) : index}
            variants={listItemVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover="hover"
            layout
            className={itemClassName}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnimatedList;