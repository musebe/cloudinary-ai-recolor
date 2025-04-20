'use client';

import { useState, useEffect } from 'react';
import { motion, MotionProps } from 'motion/react';
import clsx from 'clsx';

interface SkeletonCardProps {
  /** Additional Tailwind classes to override size, shape, etc. */
  className?: string;
}

function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

export function SkeletonCard({ className = '' }: SkeletonCardProps) {
  const prefersReduced = usePrefersReducedMotion();

  // Choose animation props based on user preference
  const animationProps: MotionProps = prefersReduced
    ? {
        initial: { opacity: 0.6 },
        animate: { opacity: 0.6 },
        transition: {},
      }
    : {
        initial: { opacity: 0.3 },
        animate: { opacity: 0.6 },
        transition: {
          repeat: Infinity,
          duration: 1,
          repeatType: 'reverse',
        },
      };

  return (
    <motion.div
      aria-hidden='true'
      {...animationProps}
      className={clsx('h-48 w-full rounded-xl bg-muted', className)}
    />
  );
}
