"use client";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function ContentMatrix() {
  const dynamicTiers = useQuery(api.contentItems.getContentTiers);
  const _tiers = dynamicTiers || [
    { label: "HERO", target: 15, done: 0, color: "#fbbf24" },
    { label: "HUB", target: 50, done: 0, color: "#3b82f6" },
    { label: "HYGIENE", target: 235, done: 0, color: "#8b5cf6" },
  ]; // fallback while loading

  const total = _tiers.reduce((s: number, t: any) => s + t.target, 0);
  const done = _tiers.reduce((s: number, t: any) => s + t.done, 0);
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <FileText className="w-4 h-4" style={{ color: "var(--m2-gold)" }} />
        <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: "var(--m2-text-secondary)" }}>300 Stories — Content Matrix</h2>
        <span className="ml-auto text-sm font-bold gold-text">{done}/{total}</span>
      </div>
      <div className="mb-5">
        <div className="status-bar" style={{ height: 10, borderRadius: 5 }}>
          <div className="status-bar-fill" style={{ width: `${pct || 2}%`, borderRadius: 5, background: "linear-gradient(90deg, var(--m2-gold), #f59e0b, var(--m2-purple))" }} />
        </div>
        <p className="text-[10px] mt-1.5" style={{ color: "var(--m2-text-muted)" }}>{pct}% Complete — {total - done} stories remaining</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {_tiers.map((t: any) => (
          <div key={t.label} className="rounded-xl p-4 text-center" style={{ background: "var(--m2-surface)" }}>
            <div className="text-2xl font-bold tabular-nums" style={{ color: t.color }}>{t.done}<span className="text-xs font-normal" style={{ color: "var(--m2-text-muted)" }}>/{t.target}</span></div>
            <p className="text-[10px] mt-1" style={{ color: "var(--m2-text-muted)" }}>{t.label}</p>
            <div className="status-bar mt-2">
              <div className="status-bar-fill" style={{ width: `${Math.max(Math.round((t.done / t.target) * 100), 2)}%`, background: t.color }} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
