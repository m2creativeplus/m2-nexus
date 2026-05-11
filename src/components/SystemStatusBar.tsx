"use client";
import { useState, useEffect } from "react";
import { ShieldCheck, Wifi, WifiOff, Database, Cpu, Code2, Brain, ExternalLink, RefreshCw } from "lucide-react";

interface SystemStatus {
  lmStudio: { online: boolean; port: number; models: string[] };
  openClaw: { online: boolean; port: number };
  convex: { connected: boolean };
  sovereignDataLake: { docCount: number; totalBytes: number };
  mcp: { filesystem: boolean };
  plugins: { ragV1: boolean; jsCodeSandbox: boolean };
  timestamp: string;
}

export function SystemStatusBar() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const r = await fetch("/api/system/health");
      const d = await r.json();
      setStatus(d);
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    let mounted = true;
    const fetchStatus = async () => {
      try {
        const r = await fetch("/api/system/health");
        const d = await r.json();
        if (mounted) setStatus(d);
      } catch {}
    };
    fetchStatus();
    const iv = setInterval(fetchStatus, 15_000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, []);

  if (!status || (status as any).error) return null;

  const pills = [
    { label: "LM Studio", ok: status.lmStudio?.online, icon: Cpu, detail: `${status.lmStudio?.models?.length || 0} model${status.lmStudio?.models?.length !== 1 ? "s" : ""}` },
    { label: "OpenClaw", ok: status.openClaw?.online, icon: Brain, detail: `Port ${status.openClaw?.port || 0}` },
    { label: "Convex DB", ok: status.convex?.connected, icon: Database, detail: "Cloud DB" },
    { label: "MCP FS", ok: status.mcp?.filesystem, icon: ShieldCheck, detail: "Filesystem" },
    { label: "RAG v1", ok: status.plugins?.ragV1, icon: Brain, detail: "LMS Plugin" },
    { label: "JS Sandbox", ok: status.plugins?.jsCodeSandbox, icon: Code2, detail: "LMS Plugin" },
    { label: "Data Lake", ok: (status.sovereignDataLake?.docCount || 0) > 0, icon: Database, detail: `${status.sovereignDataLake?.docCount || 0} docs` },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap px-5 py-3 bg-black/20 border-b border-[var(--m2-border)]">
      <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
        <ShieldCheck className="w-3 h-3 text-[var(--m2-gold)]" />
        <span className="uppercase tracking-widest text-[var(--m2-gold)]">System</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap flex-1">
        {pills.map(p => (
          <div key={p.label} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono ${
            p.ok
              ? "border-green-500/20 bg-green-500/5 text-green-400"
              : "border-red-500/20 bg-red-500/5 text-red-500"
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${p.ok ? "bg-green-400 animate-pulse" : "bg-red-500"}`} />
            <span>{p.label}</span>
            <span className="opacity-50">{p.detail}</span>
          </div>
        ))}
      </div>
      <button
        onClick={refresh}
        disabled={loading}
        className="ml-auto p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
      >
        <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
      </button>
    </div>
  );
}
