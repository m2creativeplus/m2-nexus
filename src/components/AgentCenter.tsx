"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Play, CheckCircle2, AlertCircle, Activity } from "lucide-react";
import { AgentOutputModal } from "./AgentOutputModal";
import { AgentCard } from "./ui/AgentCard";
import { M2Icon } from "./M2IconSet";

interface LogEntry {
  id: number;
  time: string;
  agent: string;
  action: string;
  type: "info" | "success" | "error" | "running";
}

interface Agent {
  name: string;
  description: string;
  status: string;
  icon?: string;
  lastRun?: string;
}

// Static fallback agents (always works — loaded when Convex isn't available)
const STATIC_AGENTS: Agent[] = [
  { name: "Antigravity IDE", description: "Maximum Capacity Build Agent", status: "idle", lastRun: "Ready" },
  { name: "DPIA Intel Unit", description: "Digital Presence Audits & Scoring", status: "idle", lastRun: "Ready" },
  { name: "OpenClaw Gateway", description: "Terminal Multi-Agent Hub", status: "idle", lastRun: "Ready" },
  { name: "Daily Systems Check", description: "Operations & Git Status", status: "idle", lastRun: "Ready" },
];

export function AgentCenter() {
  const [agents, setAgents] = useState<Agent[]>(STATIC_AGENTS);
  const [running, setRunning] = useState<string | null>(null);
  const [output, setOutput] = useState<{ agentName: string; text: string } | null>(null);
  const [activityFeed, setActivityFeed] = useState<LogEntry[]>([
    { id: 1, time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }), agent: "NEXUS OS", action: "System online — Gemini 2.0 Flash ready", type: "success" },
  ]);

  // Try to load dynamic agents from API
  useEffect(() => {
    fetch("/api/feeds/agents")
      .then(r => r.json())
      .then(d => {
        if (d?.data && Array.isArray(d.data) && d.data.length > 0) {
          setAgents(d.data);
        }
      })
      .catch(() => {}); // Keep static agents on fail
  }, []);

  const addLog = useCallback((agent: string, action: string, type: LogEntry["type"]) => {
    setActivityFeed(prev => [{
      id: Date.now(),
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      agent, action, type
    }, ...prev].slice(0, 8));
  }, []);

  const handleRun = async (name: string) => {
    if (running) return;
    setRunning(name);
    addLog(name, "Initializing Gemini 2.0 Flash agent…", "running");

    try {
      const res = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentName: name })
      });
      const data = await res.json();

      if (data.success) {
        addLog(name, "Intelligence sweep complete. Tap to view output.", "success");
        setOutput({ agentName: name, text: data.output });
      } else {
        addLog(name, `Error: ${data.error}`, "error");
      }
    } catch {
      addLog(name, "Network error: Could not reach Gemini API.", "error");
    } finally {
      setRunning(null);
    }
  };

  const logTypeIcon = (type: LogEntry["type"]) => {
    if (type === "success") return <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: "var(--m2-green)" }} />;
    if (type === "error") return <AlertCircle className="w-3 h-3 shrink-0" style={{ color: "var(--m2-red)" }} />;
    if (type === "running") return <Loader2 className="w-3 h-3 shrink-0 animate-spin" style={{ color: "var(--m2-purple)" }} />;
    return <Activity className="w-3 h-3 shrink-0" style={{ color: "var(--m2-blue)" }} />;
  };

  return (
    <>
      {output && <AgentOutputModal agentName={output.agentName} output={output.text} onClose={() => setOutput(null)} />}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <M2Icon className="w-5 h-5 fill-[var(--m2-gold)]" fill="#D4AF37" />
            <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: "var(--m2-text-secondary)" }}>Nexus Intelligence Center</h2>
          </div>
          <span className="text-[10px] flex items-center gap-2 px-2 py-1 rounded-full font-mono bg-[rgba(212,175,55,0.1)] text-[var(--m2-gold)] border border-[rgba(212,175,55,0.3)]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            SYSTEM OS · 2.0 FLASH
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-5">
          {agents.map((a) => {
            const isRunning = running === a.name;
            return (
              <AgentCard
                key={a.name}
                name={a.name}
                purpose={a.description}
                status={isRunning ? "processing" : ((a.status as "active" | "idle" | "error" | "processing" | "offline") || "idle")}
                cpuLoad={isRunning ? 85 : 5}
                lastTask={isRunning ? "Initializing sweep..." : (a.lastRun || "System ready")}
                onClick={() => handleRun(a.name)}
                disabled={!!running}
              />
            );
          })}
        </div>

        <div className="mt-auto">
          <h3 className="text-[10px] font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: "var(--m2-text-muted)" }}>
            <Activity className="w-3 h-3" style={{ color: "var(--m2-gold)" }} /> Neural Activity Feed
          </h3>
          <div className="space-y-2 p-3 rounded-xl overflow-hidden" style={{ background: "var(--m2-void)", border: "1px solid var(--m2-border)", maxHeight: 160 }}>
            <AnimatePresence initial={false}>
              {activityFeed.map((feed) => (
                <motion.div key={feed.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2 text-[10px] items-start border-b pb-1.5 last:border-0" style={{ borderColor: "var(--m2-border)" }}>
                  {logTypeIcon(feed.type)}
                  <span className="font-mono shrink-0" style={{ color: "var(--m2-text-muted)" }}>{feed.time}</span>
                  <span className="font-bold shrink-0" style={{ color: "var(--m2-gold)" }}>{feed.agent}</span>
                  <span className="truncate" style={{ color: "var(--m2-text-muted)" }}>{feed.action}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
}
