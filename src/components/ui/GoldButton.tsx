import React from 'react';
import { cn } from '@/lib/utils';

interface GoldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function GoldButton({ children, className, variant = 'solid', size = 'md', ...props }: GoldButtonProps) {
  const baseStyles = "btn";
  
  const variants = {
    solid: "btn-primary",
    outline: "btn-secondary",
    ghost: "btn-ghost"
  };

  const sizes = {
    sm: "btn-sm",
    md: "btn-md",
    lg: "btn-lg"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
