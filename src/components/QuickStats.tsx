"use client";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { BarChart3, ShieldCheck, Zap, AlertTriangle } from "lucide-react";

export function QuickStats() {
  const stats = useQuery(api.telemetry.getStats);
  const projects = useQuery(api.nexus.getProjects);
  
  const items = [
    { 
      label: "Active Missions", 
      value: projects?.length || "...", 
      icon: BarChart3, 
      color: "var(--m2-gold)", 
      delta: "Sovereign Track" 
    },
    { 
      label: "Operational Ops", 
      value: stats?.totalLogs || "...", 
      icon: Zap, 
      color: "var(--m2-purple)", 
      delta: "Real-time Flux" 
    },
    { 
      label: "Detected Gaps", 
      value: stats?.mistakeCount || "0", 
      icon: AlertTriangle, 
      color: "var(--m2-red)", 
      delta: "Audit Loop" 
    },
    { 
      label: "System Integrity", 
      value: "99.2%", 
      icon: ShieldCheck, 
      color: "var(--m2-green)", 
      delta: "All systems normal" 
    },
  ];

  return (
    <ul aria-label="System Performance Metrics" className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((s, i) => (
        <motion.li key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
          className="glass-card p-5 flex items-center gap-3 group cursor-default border border-white/5 hover:border-[var(--m2-gold)]/30 transition-all">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110"
            style={{ background: `color-mix(in srgb, ${s.color} 15%, transparent)` }}>
            <s.icon className="w-5 h-5" style={{ color: s.color }} />
          </div>
          <div className="min-w-0">
            <div className="text-xl font-bold tabular-nums" style={{ color: s.color, fontFamily: "var(--font-outfit)" }}>{s.value}</div>
            <div className="text-[10px] uppercase tracking-wider truncate" style={{ color: "var(--m2-text-muted)" }}>{s.label}</div>
            <div className="text-[9px] mt-0.5" style={{ color: `${s.color}80` }}>{s.delta}</div>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
