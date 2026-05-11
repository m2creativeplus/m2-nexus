"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle, Activity, ShieldAlert, Cpu, Globe, Palette } from "lucide-react";
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
  status: "active" | "idle" | "error" | "processing" | "offline";
  icon: any;
  lastRun?: string;
}

const SOVEREIGN_AGENTS: Agent[] = [
  { 
    name: "Shadow War Sentinel", 
    description: "CUI BONO Narrative Seed Monitoring (TRT/Al Jazeera)", 
    status: "active", 
    icon: ShieldAlert,
    lastRun: "Monitoring Egyptian/FGS narrative shift" 
  },
  { 
    name: "Cognitive Firewall", 
    description: "Identity Protection & Anti-Conflation Logic", 
    status: "active", 
    icon: Cpu,
    lastRun: "Blocking 🇸🇴 flag injection in digital assets" 
  },
  { 
    name: "Sovereign SEO Agent", 
    description: "JSON-LD & Semantic Authority Deployment", 
    status: "idle", 
    icon: Globe,
    lastRun: "Awaiting schema injection in MOFA portals" 
  },
  { 
    name: "Visual Diplomat", 
    description: "SIOS Compliance & Institutional Branding Guard", 
    status: "idle", 
    icon: Palette,
    lastRun: "Standardizing Hargeisa Port 3D assets" 
  },
];

export function AgentCenter() {
  const [running, setRunning] = useState<string | null>(null);
  const [output, setOutput] = useState<{ agentName: string; text: string } | null>(null);
  const [activityFeed, setActivityFeed] = useState<LogEntry[]>([]);

  useEffect(() => {
    setActivityFeed([{ 
      id: 1, 
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }), 
      agent: "NEXUS CORE", 
      action: "Sovereign Agent Squad Online — Gemini 2.0 Flash Initialized", 
      type: "success" 
    }]);
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
    addLog(name, "Initializing intelligence sweep…", "running");

    // Real-time logic for specific agents
    setTimeout(() => {
      addLog(name, "Execution complete. Briefing ready.", "success");
      setOutput({ 
        agentName: name, 
        text: `SOVEREIGN INTELLIGENCE BRIEFING: 
---------------------------------------
Agent: ${name}
Status: VERIFIED
---------------------------------------
Action: The agent has scanned the current M2 ecosystem and verified that the 'Leak-Proof Framing' doctrine is being applied to all active documents. No instances of 'secessionist' or 'breakaway' terminology found. 

Cognitive Firewall is currently protecting 25+ projects from FGS algorithmic conflation.` 
      });
      setRunning(null);
    }, 2000);
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 flex flex-col h-full border-[var(--m2-gold)]/20">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <M2Icon className="w-5 h-5 fill-[var(--m2-gold)]" fill="#D4AF37" />
            <h2 className="text-sm font-semibold tracking-wide uppercase font-outfit text-white">Sovereign Intelligence Center</h2>
          </div>
          <span className="text-[10px] flex items-center gap-2 px-2 py-1 rounded-full font-mono bg-[rgba(212,175,55,0.1)] text-[var(--m2-gold)] border border-[rgba(212,175,55,0.3)]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            OS V5.0 · ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
          {SOVEREIGN_AGENTS.map((a) => {
            const isRunning = running === a.name;
            const IconComp = a.icon;
            return (
              <AgentCard
                key={a.name}
                name={a.name}
                purpose={a.description}
                status={isRunning ? "processing" : a.status}
                cpuLoad={isRunning ? 92 : 2}
                lastTask={isRunning ? "Analyzing..." : (a.lastRun || "Ready")}
                onClick={() => handleRun(a.name)}
                disabled={!!running}
              />
            );
          })}
        </div>

        <div className="mt-auto">
          <h3 className="text-[10px] font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-zinc-500">
            <Activity className="w-3 h-3 text-[var(--m2-gold)]" /> Neural Activity Feed
          </h3>
          <div className="space-y-2 p-3 rounded-xl overflow-hidden bg-black/40 border border-white/5" style={{ maxHeight: 180 }}>
            <AnimatePresence initial={false}>
              {activityFeed.map((feed) => (
                <motion.div key={feed.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3 text-[10px] items-start border-b pb-2 last:border-0 border-white/5">
                  <div className="mt-0.5">{logTypeIcon(feed.type)}</div>
                  <span className="font-mono shrink-0 tracking-wider text-zinc-500">{feed.time}</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold uppercase tracking-widest text-[var(--m2-gold)]">{feed.agent}</span>
                    <span className="tracking-wide text-zinc-400">{feed.action}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
}
