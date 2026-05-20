"use client";

import { motion } from "framer-motion";
import { Cpu, Settings, X } from "lucide-react";

export function OpenClawCockpit({ agentName, onClose }: { agentName?: string, onClose?: () => void }) {
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }} 
      animate={{ opacity: 1, y: 0, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.98 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="w-full max-w-6xl h-[90vh] flex flex-col glass-card border rounded-2xl overflow-hidden shadow-2xl" style={{ borderColor: "var(--m2-border)", background: "var(--m2-surface)" }}>
        
        {/* Header Ribbon */}
        <div className="flex items-center justify-between p-4 border-b shrink-0" style={{ borderColor: "var(--m2-border)", background: "rgba(0,0,0,0.5)" }}>
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5" style={{ color: "var(--m2-gold)" }} />
            <div>
              <h2 className="font-bold tracking-widest text-sm uppercase gold-text">OpenClaw Nerve (M2 Integrated)</h2>
              <div className="text-[10px] font-mono" style={{ color: "var(--m2-text-muted)" }}>
                AGENT ENVIRONMENT: {agentName || "ROOT"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors" title="Module Settings"><Settings className="w-4 h-4 text-zinc-400" /></button>
            <button onClick={onClose} className="p-2 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Embedded Nerve Standalone UI */}
        <div className="flex-1 w-full bg-black relative">
          <iframe 
            src={process.env.NEXT_PUBLIC_NERVE_URL || "http://localhost:3080"} 
            className="w-full h-full border-0 absolute inset-0"
            title="OpenClaw Nerve Dashboard"
            allow="microphone"
          />
        </div>

      </div>
    </motion.div>
  );
}
