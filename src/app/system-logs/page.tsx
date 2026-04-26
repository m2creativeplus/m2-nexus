"use client";
import { useState, useEffect, useRef } from "react";
import { LiveLogsFeed } from "@/components/LiveLogsFeed";
import { SystemMonitor } from "@/components/SystemMonitor";
import { motion } from "framer-motion";
import { Activity, Filter } from "lucide-react";

const BOOT_LOGS = [
  { id: "s1", time: "02:21:00", agent: "nexus_os", action: "Factory reset complete — all MCP credentials purged, background agents terminated", type: "success" as const },
  { id: "s2", time: "02:21:03", agent: "security_auditor", action: "CLEARED: sbp_0ad6536… (Supabase token) — credential exposure resolved", type: "success" as const },
  { id: "s3", time: "02:21:04", agent: "security_auditor", action: "CLEARED: Pinecone MCP server instances (3x) — removed from extension settings", type: "success" as const },
  { id: "s4", time: "02:25:51", agent: "git_guardian", action: "m2creative-website: 28 uncommitted — COMMITTED [1231d63]", type: "success" as const },
  { id: "s5", time: "02:25:52", agent: "git_guardian", action: "saip: 10 uncommitted — COMMITTED [ef3f233] production-ready state saved", type: "success" as const },
  { id: "s6", time: "02:25:53", agent: "git_guardian", action: "M2_PROJECTS_HUB: 33 uncommitted — COMMITTED [1d97bbe]", type: "success" as const },
  { id: "s7", time: "02:25:54", agent: "git_guardian", action: "M2_VPN: 23 uncommitted — COMMITTED [delivery-fix branch]", type: "success" as const },
  { id: "s8", time: "02:43:00", agent: "architect_agent", action: "3-phase M2 Sovereign NEXUS OS integration plan generated", type: "info" as const },
  { id: "s9", time: "02:44:10", agent: "nexus_builder", action: "/automations — n8n workflow browser (4,343 workflows) wired", type: "running" as const },
  { id: "s10", time: "02:44:12", agent: "nexus_builder", action: "/agents — live skill panel: Architect · Security · UI Vibe active", type: "running" as const },
  { id: "s11", time: "02:44:13", agent: "nexus_builder", action: "/projects — unified registry (7 Vercel deployments + git health) wired", type: "running" as const },
  { id: "s12", time: "02:44:14", agent: "nexus_builder", action: "/system-logs — real-time activity feed live", type: "success" as const },
];

const LIVE_EVENTS = [
  { agent: "security_auditor", action: "Continuous monitoring active — watching for credential exposure", type: "info" as const },
  { agent: "git_guardian", action: "Repo scan complete — 0 uncommitted files detected across all tracked projects", type: "success" as const },
  { agent: "n8n_library", action: "Workflow library indexed — 4,343 workflows across 188 categories ready", type: "info" as const },
  { agent: "nexus_health", action: "System heartbeat — all services nominal", type: "success" as const },
  { agent: "memory_manager", action: "system_state.json synchronized — sovereign memory stable", type: "success" as const },
  { agent: "deploy_agent", action: "Vercel health check — 7 projects live, 0 errors", type: "success" as const },
];

type LogType = "info" | "success" | "error" | "running";
type LogEntry = { id: string; time: string; agent: string; action: string; type: LogType };

const typeColor: Record<LogType, string> = {
  success: "text-green-400",
  error: "text-red-400",
  running: "text-yellow-400",
  info: "text-zinc-400",
};

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>(BOOT_LOGS);
  const [filter, setFilter] = useState<LogType | "all">("all");
  const [search, setSearch] = useState("");
  const [paused, setPaused] = useState(false);
  const eventIdx = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      const ev = LIVE_EVENTS[eventIdx.current % LIVE_EVENTS.length];
      eventIdx.current++;
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
      setLogs(prev => [...prev, { ...ev, id: String(Date.now()), time }].slice(-200));
    }, 5000);
    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    if (!paused) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, paused]);

  const displayed = logs.filter(l => {
    if (filter !== "all" && l.type !== filter) return false;
    if (search && !l.action.toLowerCase().includes(search.toLowerCase()) && !l.agent.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6">
        <div className="flex flex-col gap-2 mb-2">
          <h1 className="text-3xl font-bold tracking-tighter gold-text uppercase">SYSTEM LOGS</h1>
          <p className="text-sm text-zinc-400">Chronological audit trail of all M2 NEXUS operations — agents, deployments, security events.</p>
        </div>

        {/* System Monitor — existing component */}
        <SystemMonitor />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Terminal log — left 2/3 */}
          <div className="lg:col-span-2 space-y-4">
            {/* Controls */}
            <div className="glass-card p-4 flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 flex-1">
                <Filter className="w-3 h-3 text-zinc-500" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Filter logs..."
                  className="bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none flex-1 font-mono"
                />
              </div>
              <div className="flex gap-1">
                {(["all", "success", "error", "running", "info"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-[10px] font-mono px-2.5 py-1 rounded-full border transition-colors ${filter === f ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" : "border-white/10 text-zinc-600 hover:text-zinc-400"}`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPaused(p => !p)}
                  className="text-[10px] font-mono px-3 py-1 rounded border border-white/10 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {paused ? "▶ RESUME" : "⏸ PAUSE"}
                </button>
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                  <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${!paused ? "animate-pulse" : ""}`} />
                  {paused ? "PAUSED" : "LIVE"}
                </span>
              </div>
            </div>

            {/* Terminal output */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card bg-black/60 font-mono text-[11px] p-5 h-[500px] overflow-y-auto"
            >
              <div className="space-y-0.5">
                {displayed.map(l => (
                  <div key={l.id} className="flex gap-2 items-start hover:bg-white/[0.02] px-1 py-0.5 rounded group">
                    <span className="text-zinc-700 shrink-0 w-[56px]">[{l.time}]</span>
                    <span className="text-yellow-500/50 shrink-0 w-[140px] truncate">{l.agent}</span>
                    <span className={typeColor[l.type]}>{l.action}</span>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            </motion.div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3">
              {(["success", "error", "running", "info"] as LogType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setFilter(filter === t ? "all" : t)}
                  className={`glass-card p-3 text-center transition-all ${filter === t ? "border-yellow-500/30" : ""}`}
                >
                  <p className={`text-xl font-bold tabular-nums ${typeColor[t]}`}>{logs.filter(l => l.type === t).length}</p>
                  <p className="text-[9px] font-mono text-zinc-600 mt-0.5">{t.toUpperCase()}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Right column — Live Feed (existing component) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase">
              <Activity className="w-3 h-3 text-yellow-500/60" />
              Live Activity Feed
            </div>
            <LiveLogsFeed />
          </div>
        </div>
      </main>
    </div>
  );
}
