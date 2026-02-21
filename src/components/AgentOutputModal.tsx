"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export function AgentOutputModal({ agentName, output, onClose }: { agentName: string; output: string; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: "1px solid var(--m2-border)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--m2-purple-glow)" }}>
              <Sparkles className="w-4 h-4" style={{ color: "var(--m2-purple)" }} />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--m2-text-primary)" }}>{agentName}</h3>
              <p className="text-[10px]" style={{ color: "var(--m2-text-muted)" }}>Gemini 2.0 Flash · M2 Intelligence Output</p>
            </div>
            <button onClick={onClose} className="ml-auto text-xs px-3 py-1 rounded-lg transition-colors hover:bg-white/5" style={{ background: "var(--m2-surface)", color: "var(--m2-text-muted)" }}>
              Close
            </button>
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--m2-text-secondary)" }}>
            {output}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
