import React from 'react';
import { cn } from '@/lib/utils'; // Assuming tailwind-merge util exists, else just standard classname appending

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md",
        hoverEffect && "transition-all duration-300 hover:border-yellow-500/30 hover:shadow-[0_0_20px_rgba(212,175,55,0.05)] hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
