'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { PropsWithChildren } from 'react';

type RevealProps = PropsWithChildren<{
  delay?: number;
  y?: number;
  className?: string;
  duration?: number;
}>;

export default function Reveal({ children, delay = 0.05, y = 16, className }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}

export function RevealY({ children, delay = 0.05, className }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={
        prefersReducedMotion
          ? false
          : {
              opacity: 0,
              y: -200, // Start from higher position for dramatic fall
            }
      }
      whileInView={
        prefersReducedMotion
          ? {}
          : {
              opacity: 1,
              y: 0, // Fall to natural position
            }
      }
      viewport={{ once: true, margin: '80px 0px 0px 0px' }}
      transition={{
        duration: 1.2, // Longer duration for smooth fall
        ease: [0.25, 0.46, 0.45, 0.94], // Natural easing curve
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
