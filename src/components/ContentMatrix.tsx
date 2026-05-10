"use client";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Tier {
  label: string;
  target: number;
  done: number;
  color: string;
}

export function ContentMatrix() {
  const dynamicTiers = useQuery(api.contentItems.getContentTiers);
  const _tiers = (dynamicTiers as Tier[]) || [
    { label: "HERO", target: 15, done: 0, color: "#fbbf24" },
    { label: "HUB", target: 50, done: 0, color: "#3b82f6" },
    { label: "HYGIENE", target: 235, done: 0, color: "#8b5cf6" },
  ]; // fallback while loading

  const total = Array.isArray(_tiers) ? _tiers.reduce((s: number, t: Tier) => s + (t?.target || 0), 0) : 0;
  const done = Array.isArray(_tiers) ? _tiers.reduce((s: number, t: Tier) => s + (t?.done || 0), 0) : 0;
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
        {Array.isArray(_tiers) && _tiers.map((t, i) => (
          <div key={t?.label || i} className="rounded-xl p-4 text-center" style={{ background: "var(--m2-surface)" }}>
            <div className="text-2xl font-bold tabular-nums" style={{ color: t?.color || "var(--m2-gold)" }}>{t?.done || 0}<span className="text-xs font-normal" style={{ color: "var(--m2-text-muted)" }}>/{t?.target || 0}</span></div>
            <p className="text-[10px] mt-1" style={{ color: "var(--m2-text-muted)" }}>{t?.label || "N/A"}</p>
            <div className="status-bar mt-2">
              <div className="status-bar-fill" style={{ width: `${Math.max(Math.round(((t?.done || 0) / (t?.target || 1)) * 100), 2)}%`, background: t?.color || "var(--m2-gold)" }} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
