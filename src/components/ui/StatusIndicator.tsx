import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'active' | 'processing' | 'error' | 'offline' | 'idle';

export function StatusIndicator({ status }: { status: StatusType }) {
  const colors = {
    active: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]",
    processing: "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)] animate-pulse",
    error: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]",
    offline: "bg-zinc-600",
    idle: "bg-yellow-500/50 shadow-[0_0_8px_rgba(234,179,8,0.3)]"
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2 h-2 rounded-full", colors[status])} />
      <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono">
        {status}
      </span>
    </div>
  );
}
