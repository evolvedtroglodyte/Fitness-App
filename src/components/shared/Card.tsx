import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  terminal?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  hoverable = false,
  terminal = false,
}) => {
  const Component = onClick ? motion.button : motion.div;

  const baseClasses = 'p-4 rounded-xl transition-all duration-300';

  const styleClasses = terminal
    ? 'bg-light-card dark:bg-dark-card border border-primary/30 dark:border-primary/30 shadow-sm'
    : 'bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-sm';

  const hoverClasses = hoverable
    ? terminal
      ? 'hover:shadow-lg hover:border-primary/50'
      : 'hover:shadow-md hover:border-light-border-light dark:hover:border-dark-border-light'
    : '';

  return (
    <Component
      className={clsx(
        baseClasses,
        styleClasses,
        hoverClasses,
        onClick && 'cursor-pointer',
        'w-full',
        className
      )}
      onClick={onClick}
      whileHover={hoverable ? { y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
    >
      {children}
    </Component>
  );
};