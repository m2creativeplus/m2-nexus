"use client";

import React from "react";
import { GlassCard } from "@/components/ui/M2BrandUI";
import { Users, TrendingUp, DollarSign } from "lucide-react";

export function NegotiationCommand() {
  return (
    <GlassCard className="border-[var(--m2-gold)]/30 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Users size={80} />
      </div>
      
      <div className="relative z-10 flex flex-col h-full uppercase">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-full border border-[var(--m2-gold)]/50 flex items-center justify-center bg-black overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.3)]">
             <img src="/branding/somaliland_coat_of_arms.png" alt="SNPA/Somaliland" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-outfit text-white">Negotiation Command</h3>
            <p className="text-[10px] text-[var(--m2-gold)] tracking-[0.25em] uppercase font-bold">SNPA • Republic of Somaliland</p>
          </div>
        </div>

        <div className="space-y-6 flex-1">
          <div className="space-y-2">
            <div className="flex justify-between text-xs uppercase tracking-widest text-[var(--m2-text-muted)]">
              <span>Sentiment Score</span>
              <span className="text-[var(--m2-gold)]">74% Favorable</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-[var(--m2-gold)] w-[74%]" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--m2-gold)]/10 border border-[var(--m2-gold)]/20">
            <p className="text-[10px] uppercase tracking-widest text-[var(--m2-gold)] mb-1">Unpaid Value Ticker</p>
            <p className="text-3xl font-bold font-mono text-white">$56,500.00</p>
            <p className="text-[8px] text-[var(--m2-text-muted)] mt-1 uppercase tracking-tighter">Accumulated Strategic Value Since Q4 2025</p>
          </div>
        </div>

        <button className="mt-8 w-full py-3 rounded-lg border border-[var(--m2-gold)] text-[var(--m2-gold)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--m2-gold)] hover:text-black transition-all">
          Enter Live Negotiation Mode
        </button>
      </div>
    </GlassCard>
  );
}
