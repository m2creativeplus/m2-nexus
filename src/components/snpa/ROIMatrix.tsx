"use client";

import React from "react";
import { GlassCard } from "@/components/ui/M2BrandUI";
import { LineChart, BarChart } from "lucide-react";

export function ROIMatrix() {
  return (
    <GlassCard className="border-[rgba(255,255,255,0.1)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center">
           <LineChart className="w-6 h-6 text-[#00FF88]" />
        </div>
        <div>
          <h3 className="text-xl font-bold font-outfit text-white">ROI & Production Matrix</h3>
          <p className="text-xs text-[var(--m2-text-muted)]">Efficiency Scaling Model</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="aspect-video bg-black/40 rounded-xl border border-white/5 flex items-center justify-center relative group">
           <div className="p-4 text-center">
             <BarChart className="w-12 h-12 text-zinc-800 mx-auto mb-2 group-hover:text-[var(--m2-gold)] transition-colors" />
             <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 group-hover:text-zinc-400 transition-colors italic">Real-time Visualization Engine Pending Data Wire</p>
           </div>
           
           <div className="absolute bottom-4 left-4 right-4 flex justify-between gap-2">
             <div className="px-3 py-1 bg-black/60 rounded border border-white/10 text-[8px] uppercase tracking-widest text-[#00FF88]">Min: $1.5M</div>
             <div className="px-3 py-1 bg-black/60 rounded border border-white/10 text-[8px] uppercase tracking-widest text-[var(--m2-gold)]">Max: $14M</div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-[8px] uppercase tracking-widest text-zinc-500 mb-1">OEE Prediction</p>
            <p className="text-xl font-mono text-white">85.4%</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-[8px] uppercase tracking-widest text-zinc-500 mb-1">Hours Saved/Year</p>
            <p className="text-xl font-mono text-white">10,400</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
