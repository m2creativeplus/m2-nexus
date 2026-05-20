"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type LogType = "gap" | "win" | "improvement" | "error" | "lesson";

interface LearningEntry {
  id: number;
  type: LogType;
  timestamp: string;
  description: string;
  lesson: string;
  project: string;
}

interface MetricCard {
  label: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  delta: string;
}

// ─── Static seed data (real audit history from this workspace) ──────────────
const SEED_LOGS: LearningEntry[] = [
  { id: 1, type: "error",       timestamp: "2026-04-20 06:47", project: "m2-nexus",      description: "Port 3001 collision with zombie Node process",                          lesson: "Always kill orphan processes before starting dev servers. Use lsof -ti :<port> | xargs kill -9" },
  { id: 2, type: "gap",         timestamp: "2026-04-20 06:52", project: "kaltirsi",      description: "localhost:3000 assigned to ALL projects causing cascade failures",       lesson: "Every project must have a hardcoded unique port in package.json from day one." },
  { id: 3, type: "error",       timestamp: "2026-04-24 04:13", project: "m2-crewai",     description: "tiktoken pip wheel failed to build on Python 3.14 (ABI mismatch)",      lesson: "CrewAI requires Python 3.11/3.12. Always pin the runtime version in requirements.txt." },
  { id: 4, type: "gap",         timestamp: "2026-04-24 04:45", project: "m2-nexus",      description: "Missing @/components/ui/button component — SEO Audit page broken",      lesson: "Audit component imports before deploying new pages. Shared UI atoms must be created first." },
  { id: 5, type: "improvement", timestamp: "2026-04-24 04:45", project: "m2-nexus",      description: "CrewAI microservice separated into its own Python FastAPI process",      lesson: "Never couple Python AI backends to Next.js runtimes. Keep languages in isolated services." },
  { id: 6, type: "win",         timestamp: "2026-04-24 04:46", project: "workspace",     description: "M2 Autopilot Master Prompt fully rewritten with CrewAI Omni-Loop logic", lesson: "System prompts are living documents — version them and update after every session." },
  { id: 7, type: "gap",         timestamp: "2026-04-20 03:45", project: "M2_PROJECTS_HUB", description: "235 uncommitted files discovered in workspace root git repo",          lesson: "Run git status across all projects at session start. Auto-commit checkpoints must be scheduled." },
  { id: 8, type: "win",         timestamp: "2026-04-20 03:48", project: "workspace",     description: "8.5 GB of macOS system caches purged via Parallel Orchestrator",        lesson: "Cache hygiene is automated now. m2_parallel_orchestrator.sh runs on session start." },
  { id: 9, type: "improvement", timestamp: "2026-04-25 14:53", project: "m2-nexus",      description: "Button component created — resolves seo-audit TypeScript TS2307 error", lesson: "Always scaffold the full UI component library before building feature pages." },
];

const LIVE_EVENTS: Omit<LearningEntry, "id" | "timestamp">[] = [
  { type: "win",         project: "m2-nexus",    description: "TypeScript compiler: 0 errors", lesson: "Keep tsc --noEmit as a pre-push gate in package.json scripts." },
  { type: "improvement", project: "kaltirsi",    description: "Cinematic Hero Section promoted to top of Ecological Dashboard", lesson: "Hierarchy decisions belong in architecture reviews, not mid-sprint." },
  { type: "gap",         project: "workspace",   description: "LM Studio not auto-starting with system", lesson: "Add LM Studio to macOS Login Items to ensure localhost:1234 is always live." },
  { type: "lesson",      project: "m2-nexus",    description: "Multiple dev sessions lost to port conflicts", lesson: "The port registry is now canonical: Nexus=3001, Kaltirsi=3002, M2Site=3003, CrewAI=8000." },
];

const TYPE_STYLES: Record<LogType, { label: string; border: string; bg: string; badge: string; text: string }> = {
  win:         { label: "WIN",         border: "border-l-emerald-500", bg: "bg-emerald-500/5",  badge: "bg-emerald-950 text-emerald-400 border-emerald-800",    text: "text-emerald-300" },
  gap:         { label: "GAP",         border: "border-l-amber-500",   bg: "bg-amber-500/5",    badge: "bg-amber-950 text-amber-400 border-amber-800",           text: "text-amber-300"   },
  error:       { label: "ERROR",       border: "border-l-red-500",     bg: "bg-red-500/5",      badge: "bg-red-950 text-red-400 border-red-800",                 text: "text-red-300"     },
  improvement: { label: "IMPROVEMENT", border: "border-l-blue-400",    bg: "bg-blue-500/5",     badge: "bg-blue-950 text-blue-400 border-blue-800",              text: "text-blue-300"    },
  lesson:      { label: "LESSON",      border: "border-l-[#D4AF37]",   bg: "bg-[#D4AF37]/5",   badge: "bg-black text-[#D4AF37] border-[#D4AF37]/40",            text: "text-[#D4AF37]"   },
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function CrewAITelemetryDashboard() {
  const [auditStatus, setAuditStatus] = useState<"standby" | "running" | "done" | "offline">("standby");
  const [logs, setLogs] = useState<LearningEntry[]>(SEED_LOGS);
  const [filter, setFilter] = useState<LogType | "all">("all");
  const [metrics, setMetrics] = useState<MetricCard[]>([
    { label: "Tokens Saved",        value: 14500, unit: "tokens", trend: "up",     delta: "+2.1k this session"   },
    { label: "Automations Run",     value: 12,    unit: "tasks",  trend: "up",     delta: "+3 since yesterday"   },
    { label: "Errors Converted",    value: 9,     unit: "lessons",trend: "up",     delta: "all from real audits" },
    { label: "Time Recovered",      value: 4.5,   unit: "hrs",    trend: "stable", delta: "via port/cache fixes" },
  ]);
  const [crewStatus, setCrewStatus] = useState({ nexus: false, kaltirsi: false, m2site: false, crewai: false });
  const eventIdxRef = useRef(0);
  const nextIdRef    = useRef(SEED_LOGS.length + 1);
  const bottomRef    = useRef<HTMLDivElement>(null);

  // ─── Probe local servers ────────────────────────────────────────────────
  useEffect(() => {
    const probe = async (port: number, key: keyof typeof crewStatus) => {
      try {
        const res = await fetch(`http://localhost:${port}`, { signal: AbortSignal.timeout(2000), mode: "no-cors" });
        setCrewStatus(prev => ({ ...prev, [key]: true }));
      } catch { /* offline */ }
    };
    probe(3001, "nexus");
    probe(3002, "kaltirsi");
    probe(3003, "m2site");
    probe(8000, "crewai");
  }, []);

  // ─── Sovereign Core Telemetry Integration ────────────────────────────
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch("/api/sovereign/telemetry");
        const data = await res.json();
        if (data.success && data.logs.length > 0) {
          // Map Sovereign logs to LearningEntry format
          const newLogs: LearningEntry[] = data.logs.map((log: any, idx: number) => ({
            id: nextIdRef.current++,
            type: log.status === "success" ? "win" : "error",
            timestamp: log.timestamp.replace("T", " ").substring(0, 16),
            description: `[${log.model}] ${log.task}`,
            lesson: log.status === "success" 
              ? `Execution completed in ${log.duration_ms}ms.` 
              : `Failure detected: ${log.errors.join(", ")}`,
            project: log.project
          }));

          setLogs(prev => {
            // Merge and deduplicate (by timestamp + description)
            const combined = [...newLogs, ...prev];
            const unique = combined.filter((v, i, a) => 
              a.findIndex(t => t.timestamp === v.timestamp && t.description === v.description) === i
            );
            return unique.slice(0, 100);
          });

          // Update metrics based on logs
          setMetrics(prev => prev.map(m => {
            if (m.label === "Automations Run") return { ...m, value: data.logs.length };
            if (m.label === "Time Recovered") return { ...m, value: Math.round(data.logs.reduce((acc: number, l: any) => acc + l.duration_ms, 0) / 1000 / 60 / 60 * 10) / 10 };
            return m;
          }));
        }
      } catch (err) {
        console.error("Failed to fetch sovereign telemetry:", err);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000); // Polling every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // ─── Trigger audit ──────────────────────────────────────────────────────
  const runAudit = useCallback(async () => {
    setAuditStatus("running");
    try {
      const res = await fetch("http://localhost:8000/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_path: "/Volumes/MAC DATA/Antigraphity/M2_PROJECTS_HUB", focus_area: "Productivity & Gaps" }),
        signal: AbortSignal.timeout(15000),
      });
      const data = await res.json();
      setAuditStatus(data.status === "success" ? "done" : "offline");
    } catch {
      setAuditStatus("offline");
    }
  }, []);

  const displayed = filter === "all" ? logs : logs.filter(l => l.type === filter);

  const statusLabels: Record<typeof auditStatus, { label: string; color: string }> = {
    standby: { label: "⏳ STANDBY — Awaiting Trigger",                     color: "text-zinc-400" },
    running: { label: "⚡ RUNNING — Scanning Workspace...",                 color: "text-amber-400" },
    done:    { label: "✅ AUDIT COMPLETE — Insights Synced",               color: "text-emerald-400" },
    offline: { label: "⚠️  LLM Offline — Start LM Studio on :1234 first", color: "text-red-400" },
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <div className="max-w-[1440px] mx-auto p-6 md:p-8 space-y-8">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-[#D4AF37]">
              M2 Continuous Intelligence
            </h1>
            <p className="text-white/40 text-sm mt-1 font-mono">
              CrewAI Telemetry · Daily Statistical Index · Live Learning Mirror
            </p>
          </div>
          <button
            onClick={runAudit}
            disabled={auditStatus === "running"}
            className="px-5 py-2.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded text-[#D4AF37] text-sm font-bold tracking-widest uppercase transition-all disabled:opacity-50 disabled:cursor-wait"
          >
            {auditStatus === "running" ? "⚡ Scanning..." : "▶ Trigger Autonomous Audit"}
          </button>
        </div>

        {/* ── Engine Status ───────────────────────────────────────────── */}
        <div className={`text-xs font-mono px-4 py-2 border border-white/5 rounded bg-black/40 ${statusLabels[auditStatus].color}`}>
          {statusLabels[auditStatus].label}
        </div>

        {/* ── Local Server Registry ────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { key: "nexus",    label: "M2 Nexus",    port: 3001 },
            { key: "kaltirsi", label: "Kaltirsi OS",  port: 3002 },
            { key: "m2site",   label: "M2 Website",   port: 3003 },
            { key: "crewai",   label: "CrewAI Engine", port: 8000 },
          ].map(srv => {
            const online = crewStatus[srv.key as keyof typeof crewStatus];
            return (
              <div key={srv.key} className={`p-4 rounded border ${online ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/5 bg-black/30"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${online ? "bg-emerald-400 animate-pulse" : "bg-zinc-700"}`} />
                  <span className="text-xs font-mono text-zinc-500 uppercase">{srv.label}</span>
                </div>
                <p className="text-sm font-bold font-mono">{online ? "ONLINE" : "OFFLINE"}</p>
                <p className="text-[10px] text-zinc-600 font-mono mt-0.5">::{srv.port}</p>
              </div>
            );
          })}
        </div>

        {/* ── Metric Cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="p-5 border border-[#D4AF37]/10 bg-black/50 rounded">
              <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2">{m.label}</p>
              <p className="text-3xl font-light text-[#D4AF37] tabular-nums">{m.value.toLocaleString()}</p>
              <p className="text-[10px] text-zinc-600 font-mono mt-1">{m.unit} · {m.delta}</p>
            </div>
          ))}
        </div>

        {/* ── Learning Mirror ──────────────────────────────────────────── */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-base font-bold uppercase tracking-widest text-[#D4AF37]">
              Daily Learning Mirror
            </h2>
            {/* Filter pills */}
            <div className="flex flex-wrap gap-2">
              {(["all", "win", "gap", "error", "improvement", "lesson"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-[10px] font-mono px-3 py-1 rounded-full border transition-all uppercase ${
                    filter === f
                      ? "bg-[#D4AF37]/20 border-[#D4AF37]/50 text-[#D4AF37]"
                      : "border-white/10 text-zinc-600 hover:text-zinc-300"
                  }`}
                >
                  {f} {f === "all" ? `(${logs.length})` : `(${logs.filter(l => l.type === f).length})`}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {displayed.map(log => {
              const style = TYPE_STYLES[log.type];
              return (
                <div key={log.id} className={`border-l-2 ${style.border} ${style.bg} p-4 rounded-r transition-colors`}>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`px-2 py-0.5 text-[10px] font-bold tracking-widest border rounded ${style.badge}`}>
                      {style.label}
                    </span>
                    <span className="text-[10px] text-zinc-600 font-mono">{log.project}</span>
                    <span className="text-[10px] text-zinc-700 font-mono ml-auto">{log.timestamp}</span>
                  </div>
                  <p className="text-white/75 text-sm mb-1.5">
                    <span className="text-white/40 mr-1">INCIDENT:</span>{log.description}
                  </p>
                  <p className={`text-sm font-mono ${style.text}`}>
                    <span className="opacity-60 mr-1">LESSON:</span>{log.lesson}
                  </p>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>

      </div>
    </div>
  );
}
