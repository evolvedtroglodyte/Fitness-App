import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'terminal' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className,
  'aria-label': ariaLabel,
}) => {
  const baseClasses = 'font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary/50',
    secondary: 'bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-surface-light focus:ring-gray-300',
    terminal: 'bg-transparent border border-primary text-primary hover:bg-primary/10 focus:ring-primary/30',
    danger: 'bg-fitness-error text-white hover:bg-fitness-error/90 focus:ring-fitness-error/50',
  };

  const sizeClasses = {
    sm: 'px-3 py-3 text-sm md:py-1.5',    // 44px min on mobile
    md: 'px-4 py-3.5 text-base md:py-2',  // 44px min on mobile
    lg: 'px-6 py-3.5 text-lg md:py-3',    // 44px min on mobile
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && disabledClasses,
        fullWidth && 'w-full',
        className
      )}
    >
      {children}
    </motion.button>
  );
};