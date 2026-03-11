"use client";
import React from "react";
import { motion } from "framer-motion";
import { M2Icon } from "./M2IconSet";

export function M2BannerGolden({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden border border-[var(--m2-gold)]/30 group bg-zinc-950">
      {/* Background Motion */}
      <motion.div 
        animate={{ 
          background: [
            "radial-gradient(circle at 0% 0%, rgba(212,175,55,0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, rgba(212,175,55,0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 0% 0%, rgba(212,175,55,0.05) 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute inset-0 z-0"
      />
      
      {/* Floating Icons */}
      <div className="absolute inset-0 z-10 overflow-hidden opacity-10">
        <M2Icon className="absolute -top-10 -left-10 w-48 rotate-12 fill-[var(--m2-gold)]" />
        <M2Icon className="absolute -bottom-10 -right-10 w-64 -rotate-12 fill-[var(--m2-gold)]" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-black/40 backdrop-blur-sm">
        <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-4xl font-bold font-outfit text-white tracking-widest uppercase">{title}</h2>
          <div className="h-0.5 w-24 bg-[var(--m2-gold)] mx-auto my-4 shadow-[0_0_10px_var(--m2-gold)]" />
          <p className="text-[var(--m2-gold)] text-xs md:text-sm font-mono tracking-widest uppercase">{subtitle}</p>
        </motion.div>
      </div>
    </div>
  );
}

export function M2BannerSidebar() {
  return (
    <div className="w-full p-4 rounded-xl bg-gradient-to-br from-zinc-900 to-black border border-white/5 space-y-3">
      <M2Icon className="w-8 h-auto fill-[var(--m2-gold)]" />
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-white uppercase tracking-tighter">Strategic Account</p>
        <p className="text-[9px] text-[var(--m2-text-muted)] uppercase">Mahmoud Awaleh · Founder</p>
      </div>
    </div>
  );
}
