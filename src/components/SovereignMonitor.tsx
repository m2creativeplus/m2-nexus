"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Globe, Radar, Activity, TriangleAlert } from "lucide-react";
import { GlassCard } from "./ui/M2BrandUI";

export function SovereignMonitor() {
  const narrativeThreats = [
    {
      source: "TRT World (Turkey)",
      seed: "Breakaway region / Secessionist",
      motive: "Protect Mogadishu port monopoly",
      status: "ACTIVE",
      level: "AMBER"
    },
    {
      source: "Al-Ahram (Egypt)",
      seed: "Red Sea Destabilization",
      motive: "GERD Nile negotiations leverage",
      status: "ESCALATING",
      level: "RED"
    },
    {
      source: "SNTV (FGS)",
      seed: "Territorial Integrity Violation",
      motive: "Deny economic & physical agency",
      status: "CONSTANT",
      level: "AMBER"
    },
    {
      source: "IRNA (Iran)",
      seed: "Zionist Foothold in Africa",
      motive: "Counter Israel/UAE alignments",
      status: "MONITORING",
      level: "AMBER"
    }
  ];

  return (
    <GlassCard className="h-full flex flex-col overflow-hidden border-[var(--m2-gold)]/20">
      <div className="p-5 border-b border-[var(--m2-border)] flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-[var(--m2-red)] animate-pulse" />
          <div>
            <h3 className="font-bold font-outfit tracking-wide text-white">Shadow War Monitor</h3>
            <p className="text-[10px] text-[var(--m2-gold)] uppercase tracking-widest font-mono">CUI BONO Narrative Tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-[var(--m2-green)]/10 border border-[var(--m2-green)]/30 rounded-full">
          <Activity className="w-3 h-3 text-[var(--m2-green)] animate-pulse" />
          <span className="text-[10px] font-bold text-[var(--m2-green)]">AUTO-PILOT: ACTIVE</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
        
        {/* Global Event Tracker */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[var(--m2-gold)]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Flashpoint Event</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">Dec 2025 - Present</span>
          </div>
          <p className="text-sm text-zinc-300">
            Israel Re-Recognition Fallout. FGS, Egypt, and Turkey executing coordinated narrative suppression to strip Somaliland diplomatic agency.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Activity className="w-3 h-3 text-[var(--m2-green)]" />
            <span className="text-[10px] text-[var(--m2-green)] uppercase tracking-widest">Deploying Leak-Proof Counter-Narrative</span>
          </div>
        </div>

        {/* Narrative Threat Matrix */}
        <div className="space-y-3 mt-2">
          <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono pl-1">Active Narrative Seeds</h4>
          
          {narrativeThreats.map((threat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-3 rounded-lg border ${threat.level === 'RED' ? 'bg-red-500/5 border-red-500/30' : 'bg-amber-500/5 border-amber-500/20'} flex flex-col gap-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{threat.source}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${threat.level === 'RED' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {threat.status}
                </span>
              </div>
              
              <div className="flex items-start gap-2">
                <TriangleAlert className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${threat.level === 'RED' ? 'text-red-400' : 'text-amber-400'}`} />
                <div>
                  <p className="text-xs text-zinc-300">Seed: <span className="text-white">"{threat.seed}"</span></p>
                  <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">Motive: {threat.motive}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </GlassCard>
  );
}
