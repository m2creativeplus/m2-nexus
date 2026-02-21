"use client";
import { motion } from "framer-motion";
import { BarChart3, Sparkles, TrendingUp, Zap } from "lucide-react";

export function QuickStats() {
  const items = [
    { label: "Active Projects", value: "7", icon: BarChart3, color: "var(--m2-gold)", delta: "+2 this month" },
    { label: "Agents Ready", value: "4", icon: Sparkles, color: "var(--m2-purple)", delta: "Gemini 2.0 Flash" },
    { label: "Vercel Deployments", value: "22", icon: TrendingUp, color: "var(--m2-blue)", delta: "Live in Production" },
    { label: "System Uptime", value: "99.9%", icon: Zap, color: "var(--m2-green)", delta: "All systems normal" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
          className="glass-card p-5 flex items-center gap-3 group cursor-default">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110"
            style={{ background: `color-mix(in srgb, ${s.color} 15%, transparent)` }}>
            <s.icon className="w-5 h-5" style={{ color: s.color }} />
          </div>
          <div className="min-w-0">
            <div className="text-xl font-bold tabular-nums" style={{ color: s.color, fontFamily: "var(--font-outfit)" }}>{s.value}</div>
            <div className="text-[10px] uppercase tracking-wider truncate" style={{ color: "var(--m2-text-muted)" }}>{s.label}</div>
            <div className="text-[9px] mt-0.5" style={{ color: `${s.color}80` }}>{s.delta}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
