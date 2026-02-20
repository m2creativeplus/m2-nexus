"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Cpu,
  HardDrive,
  MemoryStick,
  Zap,
  Globe,
  Shield,
  Car,
  Landmark,
  Stamp,
  Monitor,
  Terminal,
  Play,
  Trash2,
  FolderSync,
  FileText,
  BarChart3,
  Clock,
  Circle,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

const projects = [
  { name: "M2 VPN", icon: Shield, status: "live", statusLabel: "Deployed", description: "Sovereign Privacy & Security VPN", color: "#22c55e" },
  { name: "MASS VWMS", icon: Car, status: "live", statusLabel: "Production", description: "Vehicle Workshop Management System", color: "#22c55e" },
  { name: "Guurti Portal", icon: Landmark, status: "active", statusLabel: "Migration", description: "Parliamentary Portal — WP → Next.js", color: "#f59e0b" },
  { name: "Gov Profiles", icon: Globe, status: "planned", statusLabel: "Scaffold", description: "Government Digital Profile Suite + QR", color: "#8b5cf6" },
  { name: "Moving Ads", icon: Car, status: "ready", statusLabel: "PRD Complete", description: "Mobile Billboard + Creator Economy", color: "#3b82f6" },
  { name: "Postal Ecosystem", icon: Stamp, status: "research", statusLabel: "Strategy", description: "Phygital Stamps — NFC + Blockchain", color: "#ec4899" },
];

const agents = [
  { name: "Daily Cleanup", icon: Trash2, script: "clear_caches.sh", description: "Clear caches, temp files, log rotation", lastRun: "Jan 25" },
  { name: "Storage Check", icon: HardDrive, script: "m2_mission_control.sh", description: "System health, disk space, CPU/RAM", lastRun: "Jan 22" },
  { name: "Content Engine", icon: FileText, script: "m2_content_engine.py", description: "Generate 300 Stories content drafts", lastRun: "Never" },
  { name: "Photo Organizer", icon: FolderSync, script: "m2_photo_organizer.sh", description: "Sort and organize imported photos", lastRun: "Jan 22" },
];

const contentTiers = [
  { label: "HERO", target: 15, done: 3, color: "#fbbf24" },
  { label: "HUB", target: 50, done: 0, color: "#3b82f6" },
  { label: "HYGIENE", target: 235, done: 0, color: "#8b5cf6" },
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

function Badge({ status, label, color }: { status: string; label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
      {status === "live"
        ? <span className="w-1.5 h-1.5 rounded-full pulse-live" style={{ background: color }} />
        : <Circle className="w-2.5 h-2.5" />}
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════════════════════ */

function Header() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: "var(--m2-border)" }}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center gold-glow"
          style={{ background: "linear-gradient(135deg, var(--m2-gold), #f59e0b)" }}>
          <Zap className="w-5 h-5" style={{ color: "var(--m2-void)" }} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight gold-text" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
            M2 NEXUS
          </h1>
          <p className="text-xs" style={{ color: "var(--m2-text-muted)" }}>Sovereign AI Dashboard</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--m2-text-secondary)" }}>
          <span className="w-2 h-2 rounded-full pulse-live" style={{ background: "var(--m2-green)" }} />
          System Online
        </div>
        <div className="text-sm font-mono" style={{ color: "var(--m2-gold-dim)" }}>
          <Clock className="w-3.5 h-3.5 inline mr-1.5" />{time}
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════
   QUICK STATS
   ═══════════════════════════════════════════════════════════ */

function QuickStats() {
  const items = [
    { label: "Active Projects", value: "6", icon: BarChart3, color: "var(--m2-gold)" },
    { label: "Agents Ready", value: "4", icon: Terminal, color: "var(--m2-purple)" },
    { label: "Content Done", value: "3/300", icon: FileText, color: "var(--m2-blue)" },
    { label: "Revenue Streams", value: "7", icon: Zap, color: "var(--m2-green)" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * i }}
          className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `color-mix(in srgb, ${s.color} 15%, transparent)` }}>
            <s.icon className="w-5 h-5" style={{ color: s.color }} />
          </div>
          <div>
            <div className="text-lg font-bold" style={{ color: s.color, fontFamily: "var(--font-outfit)" }}>{s.value}</div>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--m2-text-muted)" }}>{s.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SYSTEM MONITOR
   ═══════════════════════════════════════════════════════════ */

function SystemMonitor() {
  const [stats, setStats] = useState({ cpu: 0, ram: 0, storage: 0, uptime: "—" });
  useEffect(() => {
    const up = () => setStats({ cpu: Math.round(15 + Math.random() * 25), ram: Math.round(55 + Math.random() * 15), storage: 67, uptime: "14d 7h 23m" });
    up(); const id = setInterval(up, 5000); return () => clearInterval(id);
  }, []);

  const metrics = [
    { label: "CPU", value: stats.cpu, icon: Cpu, color: stats.cpu > 80 ? "#ef4444" : "#22c55e", unit: "%" },
    { label: "RAM", value: stats.ram, icon: MemoryStick, color: stats.ram > 85 ? "#ef4444" : "#f59e0b", unit: "%" },
    { label: "Storage", value: stats.storage, icon: HardDrive, color: stats.storage > 90 ? "#ef4444" : "#3b82f6", unit: "%" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <Monitor className="w-4 h-4" style={{ color: "var(--m2-gold)" }} />
        <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: "var(--m2-text-secondary)", fontFamily: "var(--font-outfit)" }}>System Monitor</h2>
        <span className="ml-auto text-xs" style={{ color: "var(--m2-text-muted)" }}>Uptime: {stats.uptime}</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl p-4" style={{ background: "var(--m2-surface)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <m.icon className="w-4 h-4" style={{ color: m.color }} />
                <span className="text-xs font-medium" style={{ color: "var(--m2-text-secondary)" }}>{m.label}</span>
              </div>
              <span className="text-lg font-bold tabular-nums" style={{ color: m.color }}>{m.value}<span className="text-xs font-normal">{m.unit}</span></span>
            </div>
            <div className="status-bar">
              <div className="status-bar-fill" style={{ width: `${m.value}%`, background: `linear-gradient(90deg, ${m.color}80, ${m.color})` }} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROJECT HUB
   ═══════════════════════════════════════════════════════════ */

function ProjectHub() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-4 h-4" style={{ color: "var(--m2-gold)" }} />
        <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: "var(--m2-text-secondary)", fontFamily: "var(--font-outfit)" }}>Unified Project Hub</h2>
        <span className="ml-auto text-xs" style={{ color: "var(--m2-text-muted)" }}>{projects.length} Projects</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {projects.map((p) => (
          <motion.div key={p.name} whileHover={{ scale: 1.02 }} className="rounded-xl p-4 cursor-pointer transition-all"
            style={{ background: "var(--m2-surface)", borderLeft: `3px solid ${p.color}` }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${p.color}15` }}>
                  <p.icon className="w-4 h-4" style={{ color: p.color }} />
                </div>
                <h3 className="text-sm font-semibold" style={{ color: "var(--m2-text-primary)" }}>{p.name}</h3>
              </div>
              <Badge status={p.status} label={p.statusLabel} color={p.color} />
            </div>
            <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--m2-text-muted)" }}>{p.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   AGENT COMMAND CENTER
   ═══════════════════════════════════════════════════════════ */

function AgentCenter() {
  const [running, setRunning] = useState<string | null>(null);
  const handleRun = (name: string) => { setRunning(name); setTimeout(() => setRunning(null), 3000); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <Terminal className="w-4 h-4" style={{ color: "var(--m2-purple)" }} />
        <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: "var(--m2-text-secondary)", fontFamily: "var(--font-outfit)" }}>Agent Command Center</h2>
      </div>
      <div className="space-y-2">
        {agents.map((a) => (
          <div key={a.name} className="flex items-center gap-4 rounded-xl p-3 transition-colors" style={{ background: "var(--m2-surface)" }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--m2-purple-glow)" }}>
              <a.icon className="w-4 h-4" style={{ color: "var(--m2-purple)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium" style={{ color: "var(--m2-text-primary)" }}>{a.name}</span>
                <code className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: "var(--m2-void)", color: "var(--m2-text-muted)" }}>{a.script}</code>
              </div>
              <p className="text-xs truncate" style={{ color: "var(--m2-text-muted)" }}>{a.description}</p>
            </div>
            <span className="text-[10px] whitespace-nowrap" style={{ color: "var(--m2-text-muted)" }}>{a.lastRun}</span>
            <button onClick={() => handleRun(a.name)} disabled={running === a.name}
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all cursor-pointer"
              style={{ background: running === a.name ? "var(--m2-green)" : "var(--m2-gold-subtle)", border: `1px solid ${running === a.name ? "var(--m2-green)" : "var(--m2-border)"}` }}>
              {running === a.name
                ? <Activity className="w-3.5 h-3.5 text-white animate-pulse" />
                : <Play className="w-3.5 h-3.5" style={{ color: "var(--m2-gold)" }} />}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONTENT MATRIX
   ═══════════════════════════════════════════════════════════ */

function ContentMatrix() {
  const total = contentTiers.reduce((s, t) => s + t.target, 0);
  const done = contentTiers.reduce((s, t) => s + t.done, 0);
  const pct = Math.round((done / total) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <FileText className="w-4 h-4" style={{ color: "var(--m2-gold)" }} />
        <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: "var(--m2-text-secondary)", fontFamily: "var(--font-outfit)" }}>300 Stories — Content Matrix</h2>
        <span className="ml-auto text-sm font-bold gold-text">{done}/{total}</span>
      </div>
      <div className="mb-5">
        <div className="status-bar" style={{ height: 10, borderRadius: 5 }}>
          <div className="status-bar-fill" style={{ width: `${pct}%`, borderRadius: 5, background: "linear-gradient(90deg, var(--m2-gold), #f59e0b, var(--m2-purple))" }} />
        </div>
        <p className="text-[10px] mt-1.5" style={{ color: "var(--m2-text-muted)" }}>{pct}% Complete — {total - done} stories remaining</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {contentTiers.map((t) => (
          <div key={t.label} className="rounded-xl p-3 text-center" style={{ background: "var(--m2-surface)" }}>
            <div className="text-2xl font-bold tabular-nums" style={{ color: t.color }}>{t.done}<span className="text-xs font-normal" style={{ color: "var(--m2-text-muted)" }}>/{t.target}</span></div>
            <p className="text-[10px] mt-1" style={{ color: "var(--m2-text-muted)" }}>{t.label}</p>
            <div className="status-bar mt-2">
              <div className="status-bar-fill" style={{ width: `${Math.round((t.done / t.target) * 100)}%`, background: t.color }} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6">
        <QuickStats />
        <SystemMonitor />
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3"><ProjectHub /></div>
          <div className="xl:col-span-2"><AgentCenter /></div>
        </div>
        <ContentMatrix />
      </main>
      <footer className="px-8 py-4 text-center text-[10px]" style={{ borderTop: "1px solid var(--m2-border)", color: "var(--m2-text-muted)" }}>
        M2 NEXUS v1.0 — Powered by M2 Creative &amp; Consulting · Hargeisa, Somaliland · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
