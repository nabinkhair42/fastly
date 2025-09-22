'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

type RevealProps = PropsWithChildren<{
  delay?: number;
  y?: number;
  className?: string;
}>;

export default function Reveal({
  children,
  delay = 0.05,
  y = 16,
  className,
}: RevealProps) {
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
