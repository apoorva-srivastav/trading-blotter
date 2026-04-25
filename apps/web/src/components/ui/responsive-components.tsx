'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Responsive Container Component
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function ResponsiveContainer({ 
  children, 
  className, 
  size = 'full' 
}: ResponsiveContainerProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'w-full'
  };

  return (
    <div className={cn(
      'responsive-container mx-auto',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
}

// Responsive Grid Component
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export function ResponsiveGrid({ 
  children, 
  className, 
  cols = { default: 1, lg: 2, '2xl': 3 },
  gap = 'md'
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const getGridCols = () => {
    const classes = [];
    if (cols.default) classes.push(`grid-cols-${cols.default}`);
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
    if (cols['2xl']) classes.push(`2xl:grid-cols-${cols['2xl']}`);
    return classes.join(' ');
  };

  return (
    <div className={cn(
      'grid',
      getGridCols(),
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}

// Responsive Text Component
interface ResponsiveTextProps {
  children: React.ReactNode;
  className?: string;
  size?: {
    default?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export function ResponsiveText({ 
  children, 
  className, 
  size = { default: 'text-sm', md: 'md:text-base' },
  weight = 'normal'
}: ResponsiveTextProps) {
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const getSizeClasses = () => {
    const classes = [];
    if (size.default) classes.push(size.default);
    if (size.sm) classes.push(size.sm);
    if (size.md) classes.push(size.md);
    if (size.lg) classes.push(size.lg);
    if (size.xl) classes.push(size.xl);
    return classes.join(' ');
  };

  return (
    <span className={cn(
      getSizeClasses(),
      weightClasses[weight],
      className
    )}>
      {children}
    </span>
  );
}

// Responsive Card Component
interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export function ResponsiveCard({ 
  children, 
  className, 
  padding = 'md',
  shadow = 'sm'
}: ResponsiveCardProps) {
  const paddingClasses = {
    sm: 'p-2 sm:p-3',
    md: 'p-3 sm:p-4 lg:p-6',
    lg: 'p-4 sm:p-6 lg:p-8',
    xl: 'p-6 sm:p-8 lg:p-10'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  return (
    <div className={cn(
      'bg-white rounded-lg border border-gray-200',
      paddingClasses[padding],
      shadowClasses[shadow],
      className
    )}>
      {children}
    </div>
  );
}

// Responsive Button Component
interface ResponsiveButtonProps {
  children: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function ResponsiveButton({ 
  children, 
  className, 
  size = 'md',
  variant = 'primary',
  fullWidth = false,
  onClick,
  disabled = false
}: ResponsiveButtonProps) {
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm',
    md: 'px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base',
    lg: 'px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg'
  };

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}

// Responsive Stack Component (Flex Layout)
interface ResponsiveStackProps {
  children: React.ReactNode;
  className?: string;
  direction?: {
    default?: 'row' | 'col';
    sm?: 'row' | 'col';
    md?: 'row' | 'col';
    lg?: 'row' | 'col';
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

export function ResponsiveStack({ 
  children, 
  className, 
  direction = { default: 'col', md: 'row' },
  gap = 'md',
  align = 'start',
  justify = 'start'
}: ResponsiveStackProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const getDirectionClasses = () => {
    const classes = [];
    if (direction.default) {
      classes.push(direction.default === 'row' ? 'flex-row' : 'flex-col');
    }
    if (direction.sm) {
      classes.push(direction.sm === 'row' ? 'sm:flex-row' : 'sm:flex-col');
    }
    if (direction.md) {
      classes.push(direction.md === 'row' ? 'md:flex-row' : 'md:flex-col');
    }
    if (direction.lg) {
      classes.push(direction.lg === 'row' ? 'lg:flex-row' : 'lg:flex-col');
    }
    return classes.join(' ');
  };

  return (
    <div className={cn(
      'flex',
      getDirectionClasses(),
      gapClasses[gap],
      alignClasses[align],
      justifyClasses[justify],
      className
    )}>
      {children}
    </div>
  );
}

// Mobile Navigation Toggle Component
interface MobileNavToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function MobileNavToggle({ isOpen, onToggle, className }: MobileNavToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
        className
      )}
      aria-label="Toggle navigation"
    >
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {isOpen ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        )}
      </svg>
    </button>
  );
}

// Responsive Table Wrapper
interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <div className={cn(
      'overflow-x-auto -mx-2 sm:-mx-3 lg:-mx-4',
      className
    )}>
      <div className="inline-block min-w-full py-2 align-middle px-2 sm:px-3 lg:px-4">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
