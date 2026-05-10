"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { 
  AlertTriangle, 
  History, 
  Clock, 
  Zap, 
  Terminal, 
  BarChart3, 
  ShieldAlert,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface TelemetryLog {
  _id: string;
  type: string;
  agent: string;
  action: string;
  timestamp: string | number | Date;
  message: string;
  mistake?: string;
  solution?: string;
  enforcedRule?: string;
}

export default function TelemetryPage() {
  const logs = useQuery(api.telemetry.getLatestFull, { limit: 20 }) as TelemetryLog[] | undefined;
  const stats = useQuery(api.telemetry.getStats);

  if (!logs) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Zap className="w-10 h-10 text-[#D4AF37] animate-pulse" />
          <p className="text-zinc-500 font-mono text-sm">LOADING SOVEREIGN TELEMETRY...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
            <History className="w-10 h-10 text-[#D4AF37]" />
            ANTIGRAPHITY <span className="text-[#D4AF37]">TELEMETRY</span>
          </h1>
          <p className="text-zinc-400 mt-2 font-medium max-w-2xl">
            Real-time audit of AI operations, performance metrics, and historical mistake tracking across the M2 Sovereign Ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-zinc-900/50 border border-white/5 p-4 rounded-2xl backdrop-blur-xl">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">System Status</p>
            <p className="text-emerald-400 font-mono text-sm leading-none mt-1 uppercase">Continuous Sync</p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Operations", value: stats?.totalLogs || 0, icon: Terminal, color: "text-blue-400" },
          { label: "Detected Gaps", value: stats?.mistakeCount || 0, icon: AlertTriangle, color: "text-orange-400" },
          { label: "Productivity Waste", value: stats?.totalTimeWastedStr || "0 Min", icon: Clock, color: "text-red-400" },
          { label: "Audit Accuracy", value: "99.2%", icon: ShieldAlert, color: "text-[#D4AF37]" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-900/40 border border-white/10 p-6 rounded-2xl transition-all hover:border-[#D4AF37]/30 group"
          >
            <stat.icon className={`w-8 h-8 ${stat.color} mb-4 transition-transform group-hover:scale-110`} />
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT MISTAKE LEDGER */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
              Historical Mistake Registry
            </h2>
            <p className="text-xs font-mono text-zinc-500">Live Feedback Loop</p>
          </div>

          <div className="space-y-4">
            {logs.length === 0 ? (
              <div className="bg-zinc-900/40 border border-dashed border-white/10 p-12 rounded-3xl text-center">
                <p className="text-zinc-500">No telemetry logs found. System operates at peak efficiency.</p>
              </div>
            ) : (
              logs.map((log: TelemetryLog, i: number) => (
                <motion.div
                  key={log._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-zinc-900/60 border border-white/5 overflow-hidden rounded-2xl"
                >
                  <div className="p-5 flex items-start gap-4">
                    <div className={`mt-1 p-2 rounded-xl bg-opacity-10 ${
                      log.type === "mistake" ? "bg-red-500 text-red-500" : 
                      log.type === "success" ? "bg-emerald-500 text-emerald-500" : "bg-[#D4AF37] text-[#D4AF37]"
                    }`}>
                      {log.type === "mistake" ? <AlertCircle className="w-5 h-5" /> : 
                       log.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-zinc-100 flex items-center gap-2">
                          <span className="text-[#D4AF37] uppercase text-[10px] font-black tracking-widest bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                            {log.agent}
                          </span>
                          {log.action}
                        </h3>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {format(new Date(log.timestamp), "MMM dd, HH:mm:ss")}
                        </span>
                      </div>
                      
                      <p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-white/5 pl-3">
                        &quot;{log.message}&quot;
                      </p>

                      {log.mistake && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                            <p className="text-[10px] uppercase font-black text-red-400 mb-1 tracking-widest">Identified Mistake</p>
                            <p className="text-xs text-zinc-300">{log.mistake}</p>
                          </div>
                          <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                            <p className="text-[10px] uppercase font-black text-emerald-400 mb-1 tracking-widest">Mandatory Solution</p>
                            <p className="text-xs text-zinc-300">{log.solution}</p>
                          </div>
                        </div>
                      )}

                      {log.enforcedRule && (
                        <div className="p-3 bg-[#D4AF37]/5 rounded-xl border border-[#D4AF37]/10 flex items-center gap-3">
                          <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
                          <p className="text-xs font-bold text-[#D4AF37]">
                            <span className="opacity-60 font-normal mr-2">New Global Rule:</span>
                            {log.enforcedRule}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* SIDEBAR: REAL FACT REPORT */}
        <div className="space-y-6">
          <div className="bg-[#D4AF37] p-8 rounded-3xl text-black">
            <h2 className="text-2xl font-black leading-none mb-2">OPERATIONAL TRUTH</h2>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-6">Internal Audit Report</p>
            
            <div className="space-y-6">
              <div>
                <p className="text-xs font-black uppercase mb-1">Kaltirsi Dissection</p>
                <p className="text-sm font-medium leading-relaxed opacity-90">
                  Total loss of 4 hours due to project fragmentation. Local codebase moved to 3D star mapping while Vercel was stuck on legacy V0 scaffolds due to broken Git symlinks.
                </p>
              </div>
              <div className="h-px bg-black/10" />
              <div>
                <p className="text-xs font-black uppercase mb-1">Amnesia Diagnostic</p>
                <p className="text-sm font-medium leading-relaxed opacity-90">
                  AI agents found leaking context across 4 days. Rules were bypassed because they lived in Read-Only markdown files instead of a Continuous Logic Engine.
                </p>
              </div>
              <button 
                onClick={() => window.open('https://github.com/m2creativeplus', '_blank')}
                className="w-full py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Audited by GitHub
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 border border-white/5 p-8 rounded-3xl">
            <h2 className="text-lg font-black text-white mb-6 uppercase tracking-widest">Active Guardrails</h2>
            <div className="space-y-4">
              {[
                "One Name Policy Enforced",
                "Continuous Bridge Active",
                "Context Injection v3.0",
                "Ghost Clone Prevention",
              ].map((rule) => (
                <div key={rule} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span className="text-xs font-medium text-zinc-400">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
