"use client";

import { motion } from "framer-motion";
import { Activity, ShieldCheck, TrendingDown, Landmark, AlertTriangle, CheckCircle2 } from "lucide-react";
import { GlassCard } from "./ui/M2BrandUI";

export function InternalAuditMonitor() {
  const vulnerabilities = [
    {
      domain: "Fiscal Integrity",
      metric: "Unpaid Docs: $56.5K",
      threat: "Institutional Credibility Leak",
      status: "CRITICAL",
      icon: TrendingDown,
      color: "var(--m2-red)"
    },
    {
      domain: "Branding Coherence",
      metric: "SIOS Adoption: 65%",
      threat: "Visual Identity Fragmentation",
      status: "WARNING",
      icon: Landmark,
      color: "var(--m2-gold)"
    },
    {
      domain: "Data Sovereignty",
      metric: "TLD: .so (Dependency)",
      threat: "External Control Risk",
      status: "STABLE",
      icon: ShieldCheck,
      color: "var(--m2-green)"
    }
  ];

  return (
    <GlassCard className="h-full flex flex-col border-[var(--m2-gold)]/20">
      <div className="p-5 border-b border-[var(--m2-border)] flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-[var(--m2-gold)]" />
          <div>
            <h3 className="font-bold font-outfit tracking-wide text-white">Institutional Health Monitor</h3>
            <p className="text-[10px] text-[var(--m2-gold)] uppercase tracking-widest font-mono">Internal Vulnerability Audit</p>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto">
        
        {/* Reality Check Header */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Self-Audit Required</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Sovereignty is vulnerable to internal decay. The system has flagged $56.5K in institutional debt and 35% non-compliance in visual diplomacy.
          </p>
        </div>

        {/* Vulnerability List */}
        <div className="space-y-3">
          {vulnerabilities.map((v, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${v.color}15` }}>
                  <v.icon className="w-5 h-5" style={{ color: v.color }} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{v.domain}</p>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{v.metric}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  v.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 
                  v.status === 'WARNING' ? 'bg-amber-500/20 text-amber-400' : 
                  'bg-green-500/20 text-green-400'
                }`}>
                  {v.status}
                </span>
                <p className="text-[8px] text-zinc-600 mt-1 uppercase tracking-tighter">{v.threat}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Verification Checkmark */}
        <div className="mt-auto pt-4 flex items-center justify-center gap-2 text-[10px] text-zinc-600 font-mono italic">
          <CheckCircle2 className="w-3 h-3" />
          Data Verified via M2-BRAIN Reality Anchor
        </div>

      </div>
    </GlassCard>
  );
}
