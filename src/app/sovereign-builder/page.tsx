"use client";

import { useState, useEffect, useRef } from "react";
import { Activity, ExternalLink, Code, Zap } from "lucide-react";

const SOVEREIGN_URL = "https://m2-sovereign-engine.vercel.app";
const EMBED_URL = `${SOVEREIGN_URL}/embed/nexus-global`;

export default function SovereignBuilderPage() {
  const [status, setStatus] = useState<"connecting" | "online" | "error">("connecting");
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== SOVEREIGN_URL) return;
      if (event.data?.type === "READY" || event.data?.type === "LOADED") {
        setStatus("online");
      }
      if (event.data?.message) {
        setLastMessage(event.data.message);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const sendCommand = (prompt: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "GENERATE", prompt },
      SOVEREIGN_URL
    );
  };

  const quickPrompts = [
    "Build a gold-themed dashboard card for M2 Nexus",
    "Create a Somaliland government letter template",
    "Generate an analytics chart component in dark mode",
  ];

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">VIBECODING AGENT</h1>
          <p className="text-[#D4AF37] font-mono text-[10px] tracking-widest uppercase mt-0.5">
            Sovereign Engine · AI Code Generator
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Quick prompts */}
          <div className="hidden lg:flex gap-2">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => sendCommand(p)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37]/30 text-[10px] text-zinc-400 hover:text-[#D4AF37] transition-all duration-200 font-mono"
              >
                <Zap className="w-3 h-3" />
                Quick
              </button>
            ))}
          </div>
          {/* Open in new tab */}
          <a
            href={SOVEREIGN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-400 hover:text-white transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open Full
          </a>
          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                status === "online"
                  ? "bg-emerald-500 animate-pulse"
                  : status === "error"
                  ? "bg-red-500"
                  : "bg-amber-500 animate-bounce"
              }`}
            />
            <span className="text-[10px] uppercase tracking-widest text-slate-500">
              {status === "online" ? "Live" : status === "error" ? "Error" : "Connecting"}
            </span>
          </div>
        </div>
      </div>

      {/* Iframe container — fills all remaining height */}
      <div className="flex-1 relative overflow-hidden">
        {status === "connecting" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10 backdrop-blur-sm pointer-events-none">
            <div className="w-16 h-16 rounded-full border border-[#D4AF37]/20 flex items-center justify-center mb-4">
              <Activity className="w-7 h-7 text-[#D4AF37] animate-spin" />
            </div>
            <p className="text-[#D4AF37] font-mono uppercase tracking-widest text-sm">
              Booting Sovereign Engine...
            </p>
            <p className="text-slate-500 text-xs mt-2 font-mono">{SOVEREIGN_URL}</p>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={EMBED_URL}
          className="w-full h-full border-none bg-slate-950"
          onLoad={() => setStatus((s) => (s === "connecting" ? "online" : s))}
          onError={() => setStatus("error")}
          title="M2 Sovereign Builder"
          allow="clipboard-write; clipboard-read; cross-origin-isolated"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        />
      </div>

      {/* Footer status bar */}
      {lastMessage && (
        <div className="shrink-0 px-4 py-1.5 border-t border-white/5 bg-black/30">
          <p className="text-[10px] font-mono text-zinc-600 flex items-center gap-2">
            <Code className="w-3 h-3" />
            {lastMessage}
          </p>
        </div>
      )}
    </div>
  );
}
