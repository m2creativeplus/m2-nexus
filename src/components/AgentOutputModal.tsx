"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Video, Loader2, AlertCircle } from "lucide-react";
import { AvatarSpeaker } from "./AvatarSpeaker";

export function AgentOutputModal({ agentName, output, onClose }: { agentName: string; output: string; onClose: () => void }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "generating" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [talkId, setTalkId] = useState<string | null>(null);

  const handleGenerate = async () => {
    setStatus("generating");
    setError(null);
    try {
      const res = await fetch("/api/did/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: output, persona: "m2-creative" })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to create D-ID talk");
      if (!data.id) throw new Error("No talk ID returned from D-ID");
      
      setTalkId(data.id);
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setError(err.message || "Failed to initiate avatar generation.");
    }
  };

  useEffect(() => {
    if (!talkId || status !== "generating") return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/did/poll/${talkId}`);
        const data = await res.json();
        
        if (data.status === "done" && data.result_url) {
          setVideoUrl(data.result_url);
          setStatus("ready");
        } else if (data.status === "error" || data.status === "rejected") {
          setStatus("error");
          setError("Avatar generation failed on D-ID servers.");
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    };

    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [talkId, status]);

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
          className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col gap-4"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 pb-4 shrink-0" style={{ borderBottom: "1px solid var(--m2-border)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--m2-purple-glow)" }}>
              <Sparkles className="w-4 h-4" style={{ color: "var(--m2-purple)" }} />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--m2-text-primary)" }}>{agentName}</h3>
              <p className="text-[10px]" style={{ color: "var(--m2-text-muted)" }}>Gemini 2.0 Flash · M2 Intelligence Output</p>
            </div>
            
            <div className="ml-auto flex items-center gap-3">
              {status === "idle" && (
                <button 
                  onClick={handleGenerate} 
                  className="flex items-center gap-2 text-[11px] font-bold px-4 py-1.5 rounded-lg transition-transform hover:scale-105 shadow-lg" 
                  style={{ background: "var(--m2-gold)", color: "var(--m2-void)" }}
                >
                  <Video className="w-3.5 h-3.5" />
                  Generate Avatar Briefing
                </button>
              )}
              <button onClick={onClose} className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5" style={{ background: "var(--m2-surface)", color: "var(--m2-text-muted)" }}>
                Close
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {(status === "idle" || status === "error") && (
              <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--m2-text-secondary)" }}>
                {output}
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 rounded-lg flex items-start gap-2 text-xs" style={{ background: "rgba(239,68,68,0.1)", color: "var(--m2-red)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p><strong>Generation Error:</strong> {error}</p>
              </div>
            )}

            {(status === "generating" || status === "ready") && (
              <AvatarSpeaker 
                videoUrl={videoUrl || undefined}
                status={status === "generating" ? "generating" : "ready"}
                title={`${agentName} Intelligence Report`}
                persona="m2-creative"
                caption={status === "ready" ? "Briefing complete." : "Generating intelligence briefing..."}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
