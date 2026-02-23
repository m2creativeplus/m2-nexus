import React from 'react';
import { cn } from '@/lib/utils';

interface GoldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function GoldButton({ children, className, variant = 'solid', size = 'md', ...props }: GoldButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/50 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    solid: "bg-gold-500 text-black hover:bg-gold-400 shadow-[0_0_15px_rgba(212,175,55,0.3)]",
    outline: "border border-gold-500/50 text-gold-500 hover:bg-gold-500/10",
    ghost: "text-gold-500 hover:bg-gold-500/10"
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-8 text-base"
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
