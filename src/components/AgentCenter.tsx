"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Shield, Terminal, Cpu, Code2, Play, CheckCircle2, AlertCircle, Activity } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AgentOutputModal } from "./AgentOutputModal";
import { AgentCard } from "./ui/AgentCard";

interface LogEntry {
  id: number;
  time: string;
  agent: string;
  action: string;
  type: "info" | "success" | "error" | "running";
}

export function AgentCenter() {
  const dynamicAgents = useQuery(api.nexus.getAgents);
  const _agents = dynamicAgents || [];
  
  // Real Convex query replacing the hardcoded data
  const rawLogs = useQuery(api.m2_agent.getLogs);
  const logMutation = useMutation(api.m2_agent.createLog);

  const [running, setRunning] = useState<string | null>(null);
  const [output, setOutput] = useState<{ agentName: string; text: string } | null>(null);
  const [activityFeed, setActivityFeed] = useState<LogEntry[]>([]);

  // Sync Convex DB to Local UI State
  useEffect(() => {
    if (rawLogs) {
      setActivityFeed(rawLogs.map(l => ({
        id: l._creationTime,
        time: new Date(l._creationTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
        agent: l.agent,
        action: l.action,
        type: l.type as any
      })));
    }
  }, [rawLogs]);

  const addLog = useCallback(async (agent: string, action: string, type: LogEntry["type"]) => {
    // Write instantly to the real cloud database if connected
    if (logMutation) {
      logMutation({ agent, action, type });
    } else {
      // Offline fallback
      setActivityFeed(prev => [{
        id: Date.now(),
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
        agent, action, type
      }, ...prev].slice(0, 8));
    }
  }, [logMutation]);

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
            <Sparkles className="w-4 h-4" style={{ color: "var(--m2-purple)" }} />
            <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: "var(--m2-text-secondary)" }}>Gemini Agent Center</h2>
          </div>
          <span className="text-[10px] flex items-center gap-2 px-2 py-1 rounded-full font-mono" style={{ background: "var(--m2-purple-glow)", color: "var(--m2-purple)", border: "1px solid rgba(139,92,246,0.3)" }}>
            {dynamicAgents === undefined && <Loader2 className="w-3 h-3 animate-spin" />}
            2.0 Flash LIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-5">
          {_agents.map((a: any) => {
            const isRunning = running === a.name;
            const statusType = isRunning ? "processing" : (a.status || "idle");
            
            return (
              <AgentCard 
                key={a.name}
                name={a.name}
                purpose={a.description}
                status={statusType}
                cpuLoad={isRunning ? 85 : 5}
                lastTask={isRunning ? "Initializing sweep..." : "System ready"}
                onClick={() => handleRun(a.name)}
                disabled={!!running}
              />
            );
          })}
        </div>

        <div className="mt-auto">
          <h3 className="text-[10px] font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: "var(--m2-text-muted)" }}>
            <Activity className="w-3 h-3" style={{ color: "var(--m2-purple)" }} /> Live Intelligence Log
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
