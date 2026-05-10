"use client";
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/preserve-manual-memoization */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Shield, Activity, Terminal, Cpu, MemoryStick, HardDrive,
  Network, RefreshCw, AlertTriangle, CheckCircle, XCircle,
  Info, Zap, GitBranch, Clock, ChevronRight, Eye,
  Lock, Unlock, Search, Filter, TrendingUp, Server,
  FolderOpen, GitCommit, ListTodo, Play, RotateCcw,
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface SystemStats {
  machine: string; timestamp: string; uptime: string;
  cpu: { usage: number; user: number; sys: number; idle: number; load: { '1m': number; '5m': number; '15m': number } };
  memory: { totalGB: number; usedGB: number; freeGB: number; percent: number; wiredGB: number; activeGB: number };
  disk: { size: string; used: string; available: string; percent: number };
  network: { mbIn: number; mbOut: number };
}
interface Process { user: string; pid: number; cpu: number; mem: number; rss: number; stat: string; command: string; name: string }
interface Finding { severity: 'CRITICAL'|'HIGH'|'MEDIUM'|'LOW'; category: string; file: string; line: string; match: string; description: string }
interface SecurityData {
  score: number; riskLevel: string; timestamp: string;
  summary: { critical: number; high: number; medium: number; low: number; total: number };
  findings: Finding[];
  unprotectedRoutes: string[];
  npmVulnerabilities: { name: string; severity: string; title: string; url: string }[];
  envVarsUsed: string[];
}
interface TerminalData {
  timestamp: string;
  zshHistory: { timestamp: string; command: string; category: string }[];
  recentFiles: string[];
  terminalProcesses: { pid: string; cpu: string; mem: string; command: string }[];
  lastLogins: string[];
  gitLog: { hash: string; message: string }[];
}
interface TasksData {
  timestamp: string;
  summary: { total: number; clean: number; dirty: number; totalUncommitted: number };
  projects: Array<{
    name: string; path: string; url: string|null; tech: string;
    status: string; branch: string; uncommitted: number;
    lastCommit: { hash: string; message: string } | null;
    recentCommits: { hash: string; message: string }[];
  }>;
  activeTasks: Array<{ project: string; tasks: { text: string; done: boolean }[] }>;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: 'text-red-400 bg-red-500/10 border-red-500/30',
  HIGH:     'text-orange-400 bg-orange-500/10 border-orange-500/30',
  MEDIUM:   'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  LOW:      'text-blue-400 bg-blue-500/10 border-blue-500/30',
};
const CATEGORY_COLOR: Record<string, string> = {
  git: 'text-orange-400', npm: 'text-green-400', deploy: 'text-purple-400',
  filesystem: 'text-blue-400', runtime: 'text-cyan-400', package: 'text-yellow-400',
  network: 'text-pink-400', search: 'text-zinc-400', shell: 'text-zinc-500',
};

function GaugeRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 36; const c = 2 * Math.PI * r;
  const filled = (value / 100) * c;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${filled} ${c}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease' }} />
      </svg>
      <div className="text-center -mt-16">
        <p className="text-2xl font-bold font-mono" style={{ color }}>{value}%</p>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{label}</p>
      </div>
      <div className="mt-8" />
    </div>
  );
}

function StatBar({ label, value, max, color, unit = '' }: { label: string; value: number; max: number; color: string; unit?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-zinc-400">{label}</span>
        <span className="font-mono" style={{ color }}>{value}{unit} <span className="text-zinc-600">/ {max}{unit}</span></span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function Pill({ label, color = 'zinc' }: { label: string; color?: string }) {
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest 
      ${color === 'red' ? 'bg-red-500/15 text-red-400' :
        color === 'orange' ? 'bg-orange-500/15 text-orange-400' :
        color === 'yellow' ? 'bg-yellow-500/15 text-yellow-400' :
        color === 'green' ? 'bg-green-500/15 text-green-400' :
        color === 'blue' ? 'bg-blue-500/15 text-blue-400' :
        color === 'purple' ? 'bg-purple-500/15 text-purple-400' :
        'bg-zinc-500/15 text-zinc-400'}`}>{label}</span>
  );
}

// ─── TAB: SYSTEM MONITOR ──────────────────────────────────────────────────────
function SystemMonitorTab() {
  const [data, setData] = useState<SystemStats | null>(null);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'cpu'|'mem'>('cpu');
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const fetch = useCallback(async () => {
    const [sRes, pRes] = await Promise.all([
      globalThis.fetch('/api/admin/system-stats'),
      globalThis.fetch('/api/admin/processes'),
    ]);
    const s = await sRes.json();
    const p = await pRes.json();
    setData(s);
    setProcesses(p.processes ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
    intervalRef.current = setInterval(fetch, 5000);
    return () => clearInterval(intervalRef.current);
  }, [fetch]);

  if (loading) return <Loader label="Sampling macOS performance counters..." />;

  const sorted = [...processes].sort((a, b) => view === 'cpu' ? b.cpu - a.cpu : b.mem - a.mem).slice(0, 30);

  return (
    <div className="space-y-8">
      {/* Machine Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-lg">{data?.machine}</h3>
          <p className="text-zinc-500 text-xs font-mono">Uptime: {data?.uptime} · Live refresh every 5s</p>
        </div>
        <LiveIndicator />
      </div>

      {/* Gauge Row */}
      <div className="grid grid-cols-3 gap-6">
        <GaugeCard title="CPU Usage">
          <GaugeRing value={data?.cpu.usage ?? 0} label="CPU" color="#f59e0b" />
          <div className="space-y-2 flex-1">
            <StatBar label="User" value={data?.cpu.user ?? 0} max={100} color="#f59e0b" unit="%" />
            <StatBar label="System" value={data?.cpu.sys ?? 0} max={100} color="#fb923c" unit="%" />
            <StatBar label="Idle" value={data?.cpu.idle ?? 0} max={100} color="#4ade80" unit="%" />
            <div className="pt-2 border-t border-white/5 space-y-1 text-xs text-zinc-500">
              <div className="flex justify-between"><span>Load 1m</span><span className="font-mono text-white">{data?.cpu.load['1m']}</span></div>
              <div className="flex justify-between"><span>Load 5m</span><span className="font-mono text-white">{data?.cpu.load['5m']}</span></div>
              <div className="flex justify-between"><span>Load 15m</span><span className="font-mono text-white">{data?.cpu.load['15m']}</span></div>
            </div>
          </div>
        </GaugeCard>

        <GaugeCard title="Memory">
          <GaugeRing value={data?.memory.percent ?? 0} label="RAM" color="#a78bfa" />
          <div className="space-y-2 flex-1">
            <StatBar label="Used" value={data?.memory.usedGB ?? 0} max={data?.memory.totalGB ?? 16} color="#a78bfa" unit="GB" />
            <StatBar label="Wired" value={data?.memory.wiredGB ?? 0} max={data?.memory.totalGB ?? 16} color="#818cf8" unit="GB" />
            <StatBar label="Active" value={data?.memory.activeGB ?? 0} max={data?.memory.totalGB ?? 16} color="#6366f1" unit="GB" />
            <div className="pt-2 border-t border-white/5 text-xs text-zinc-500">
              <div className="flex justify-between"><span>Free</span><span className="font-mono text-white">{data?.memory.freeGB} GB</span></div>
              <div className="flex justify-between"><span>Total</span><span className="font-mono text-white">{data?.memory.totalGB} GB</span></div>
            </div>
          </div>
        </GaugeCard>

        <GaugeCard title="Disk & Network">
          <GaugeRing value={data?.disk.percent ?? 0} label="Disk" color="#34d399" />
          <div className="space-y-2 flex-1">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-zinc-500">Size</p>
                <p className="text-white font-mono font-bold">{data?.disk.size}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-zinc-500">Used</p>
                <p className="text-white font-mono font-bold">{data?.disk.used}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-zinc-500">Free</p>
                <p className="text-green-400 font-mono font-bold">{data?.disk.available}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-zinc-500">Usage</p>
                <p className={`font-mono font-bold ${(data?.disk.percent ?? 0) > 80 ? 'text-red-400' : 'text-green-400'}`}>{data?.disk.percent}%</p>
              </div>
            </div>
            <div className="pt-2 border-t border-white/5 space-y-1 text-xs text-zinc-500">
              <div className="flex justify-between"><span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-green-400" /> Net In</span><span className="font-mono text-white">{data?.network.mbIn} MB</span></div>
              <div className="flex justify-between"><span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 rotate-180 text-blue-400" /> Net Out</span><span className="font-mono text-white">{data?.network.mbOut} MB</span></div>
            </div>
          </div>
        </GaugeCard>
      </div>

      {/* Process Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-bold">Live Processes ({processes.length} total)</h4>
          <div className="flex gap-2">
            <button onClick={() => setView('cpu')} className={`px-3 py-1 rounded text-xs font-bold transition-all ${view==='cpu' ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-500 hover:text-white'}`}>By CPU</button>
            <button onClick={() => setView('mem')} className={`px-3 py-1 rounded text-xs font-bold transition-all ${view==='mem' ? 'bg-purple-500/20 text-purple-400' : 'text-zinc-500 hover:text-white'}`}>By MEM</button>
          </div>
        </div>
        <div className="border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-white/5">
              <tr className="text-zinc-500 font-mono uppercase tracking-wider">
                <th className="text-left px-4 py-2">PID</th>
                <th className="text-left px-4 py-2">Process</th>
                <th className="text-left px-4 py-2">User</th>
                <th className="text-right px-4 py-2">CPU%</th>
                <th className="text-right px-4 py-2">MEM%</th>
                <th className="text-right px-4 py-2">RSS</th>
                <th className="text-left px-4 py-2">State</th>
                <th className="text-right px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <tr key={p.pid} className={`border-t border-white/5 hover:bg-white/5 transition-colors ${i === 0 ? 'bg-amber-500/5' : ''}`}>
                  <td className="px-4 py-2 font-mono text-zinc-500">{p.pid}</td>
                  <td className="px-4 py-2 font-mono text-white truncate max-w-[200px]" title={p.command}>{p.name}</td>
                  <td className="px-4 py-2 text-zinc-500">{p.user}</td>
                  <td className={`px-4 py-2 text-right font-bold font-mono ${p.cpu > 10 ? 'text-orange-400' : p.cpu > 5 ? 'text-yellow-400' : 'text-zinc-400'}`}>{p.cpu.toFixed(1)}</td>
                  <td className={`px-4 py-2 text-right font-mono ${p.mem > 5 ? 'text-purple-400' : 'text-zinc-400'}`}>{p.mem.toFixed(1)}</td>
                  <td className="px-4 py-2 text-right font-mono text-zinc-500">{Math.round(p.rss / 1024)}M</td>
                  <td className="px-4 py-2"><span className="text-zinc-600 font-mono">{p.stat}</span></td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={async () => {
                      if (!confirm(`Kill process ${p.pid}?`)) return;
                      await globalThis.fetch('/api/admin/actions', { method: 'POST', body: JSON.stringify({ action: 'kill-process', payload: { pid: p.pid } }) });
                      setProcesses(all => all.filter(x => x.pid !== p.pid));
                    }} className="px-2 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded text-[10px] font-bold uppercase tracking-widest transition-all">Kill</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: SECURITY AGENT ─────────────────────────────────────────────────────
function SecurityAgentTab() {
  const [data, setData] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAction = async (action: string, payload?: unknown) => {
    setActionLoading(action);
    try {
      await globalThis.fetch('/api/admin/actions', { method: 'POST', body: JSON.stringify({ action, payload }) });
      if (action.includes('delete') || action.includes('enforce')) {
        setTimeout(runScan, 1000);
      }
    } catch(e) {}
    setActionLoading(null);
  };

  const runScan = useCallback(async () => {
    setLoading(true);
    const res = await globalThis.fetch('/api/admin/security-scan');
    const d = await res.json();
    setData(d);
    setLoading(false);
  }, []);

  const filtered = (data?.findings ?? []).filter(f =>
    (filter === 'ALL' || f.severity === filter) &&
    (search === '' || f.file.toLowerCase().includes(search.toLowerCase()) || f.match.toLowerCase().includes(search.toLowerCase()))
  );

  const scoreColor = data ? (data.score < 40 ? '#f87171' : data.score < 60 ? '#fb923c' : data.score < 80 ? '#facc15' : '#4ade80') : '#4ade80';

  return (
    <div className="space-y-8">
      {/* Header with Scan Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2"><Shield className="w-5 h-5 text-amber-400" /> Security Reviewer Agent</h3>
          <p className="text-zinc-500 text-xs mt-1">Live OWASP Top 10 scanner · Pattern matching across all source files</p>
        </div>
        <button onClick={runScan} disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-all disabled:opacity-50">
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {loading ? 'Scanning...' : 'Run Security Scan'}
        </button>
      </div>

      {!data && !loading && (
        <EmptyState icon={<Shield className="w-12 h-12 text-zinc-600" />}
          label="Click 'Run Security Scan' to analyze your codebase" />
      )}

      {loading && <Loader label="Running OWASP pattern scanner across m2-nexus source files..." />}

      {data && !loading && (
        <>
          {/* Score + Summary */}
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-2 glass-card rounded-2xl p-6 flex items-center gap-6">
              <div className="relative">
                <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={scoreColor} strokeWidth="10"
                    strokeDasharray={`${(data.score / 100) * 251} 251`} strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1s ease' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold font-mono" style={{ color: scoreColor }}>{data.score}</p>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Score</p>
                </div>
              </div>
              <div>
                <Pill label={data.riskLevel} color={data.riskLevel === 'CRITICAL' ? 'red' : data.riskLevel === 'HIGH' ? 'orange' : data.riskLevel === 'MEDIUM' ? 'yellow' : 'green'} />
                <p className="text-white font-bold mt-2">Security Posture</p>
                <p className="text-zinc-500 text-xs mt-1">Last scan: {new Date(data.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
            {[
              { label: 'Critical', count: data.summary.critical, color: 'text-red-400', bg: 'bg-red-500/10' },
              { label: 'High', count: data.summary.high, color: 'text-orange-400', bg: 'bg-orange-500/10' },
              { label: 'Medium', count: data.summary.medium, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              { label: 'Low', count: data.summary.low, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            ].map(s => (
              <div key={s.label} className={`glass-card rounded-2xl p-5 flex flex-col items-center justify-center text-center border border-white/5 ${s.bg}`}>
                <p className={`text-3xl font-bold font-mono ${s.color}`}>{s.count}</p>
                <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-2xl p-5 border border-amber-500/20">
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Recommended Security Actions
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleAction('delete-zombie-login')} disabled={actionLoading==='delete-zombie-login'} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-left group">
                <div>
                  <p className="text-white text-xs font-bold">Delete Zombie Login Route</p>
                  <p className="text-zinc-500 text-[10px] mt-0.5">Removes insecure /api/login endpoint</p>
                </div>
                {actionLoading==='delete-zombie-login' ? <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" /> : <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400" />}
              </button>
              
              <button onClick={() => handleAction('enforce-auth')} disabled={actionLoading==='enforce-auth'} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-left group">
                <div>
                  <p className="text-white text-xs font-bold">Enforce Auth on Admin Routes</p>
                  <p className="text-zinc-500 text-[10px] mt-0.5">Wraps endpoints with Clerk auth().protect()</p>
                </div>
                {actionLoading==='enforce-auth' ? <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" /> : <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400" />}
              </button>
            </div>
          </div>

          {/* Unprotected Routes */}
          {data.unprotectedRoutes.length > 0 && (
            <div className="glass-card rounded-2xl p-5 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Unlock className="w-4 h-4 text-orange-400" />
                <h4 className="text-orange-400 font-bold text-sm">{data.unprotectedRoutes.length} Unprotected API Routes</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {data.unprotectedRoutes.map(r => (
                  <div key={r} className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-white/5 px-3 py-2 rounded-lg">
                    <Unlock className="w-3 h-3 text-orange-400 shrink-0" />
                    {r.replace('/Volumes/MAC DATA/Antigraphity/M2_PROJECTS_HUB/01_ACTIVE_MISSIONS/m2-nexus/src/', '')}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NPM Vulnerabilities */}
          {data.npmVulnerabilities.length > 0 && (
            <div className="glass-card rounded-2xl p-5 border border-red-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <h4 className="text-red-400 font-bold text-sm">{data.npmVulnerabilities.length} npm Vulnerabilities</h4>
                </div>
                <button onClick={() => handleAction('npm-audit-fix')} disabled={actionLoading==='npm-audit-fix'} className="flex items-center gap-2 px-3 py-1 bg-red-400/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded transition-colors text-[10px] uppercase font-bold tracking-widest">
                  {actionLoading==='npm-audit-fix' ? <RefreshCw className="w-3 h-3 animate-spin"/> : <Zap className="w-3 h-3" />}
                  Auto Fix (npm audit fix)
                </button>
              </div>
              <div className="space-y-2">
                {data.npmVulnerabilities.map((v, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs bg-white/5 px-3 py-2 rounded-lg">
                    <Pill label={v.severity} color={v.severity === 'critical' ? 'red' : v.severity === 'high' ? 'orange' : 'yellow'} />
                    <span className="font-mono text-white">{v.name}</span>
                    <span className="text-zinc-500 flex-1 truncate">{v.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Findings Table */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search findings..." className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-600 w-64 focus:outline-none focus:border-amber-500/50" />
              </div>
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${filter === s ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-zinc-500 hover:text-white border border-white/5'}`}>
                  {s}
                </button>
              ))}
              <span className="text-zinc-600 text-xs ml-auto">{filtered.length} findings</span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filtered.length === 0 && <EmptyState icon={<CheckCircle className="w-8 h-8 text-green-400" />} label="No findings match your filter" />}
              {filtered.map((f, i) => (
                <div key={i} className={`rounded-xl border p-4 space-y-2 transition-all hover:bg-white/5 ${SEVERITY_COLOR[f.severity]}`}>
                  <div className="flex items-start gap-3">
                    <Pill label={f.severity} color={f.severity === 'CRITICAL' ? 'red' : f.severity === 'HIGH' ? 'orange' : f.severity === 'MEDIUM' ? 'yellow' : 'blue'} />
                    <Pill label={f.category} />
                    <span className="font-mono text-xs text-zinc-300 flex-1 truncate">{f.file}:{f.line}</span>
                  </div>
                  <p className="text-zinc-400 text-xs">{f.description}</p>
                  <code className="block bg-black/40 rounded-lg px-3 py-2 text-xs font-mono text-zinc-300 break-all">{f.match}</code>
                  <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                    <button onClick={() => handleAction(`ignore-${i}`)} className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] uppercase font-bold tracking-widest text-zinc-400 transition-colors">Ignore</button>
                    <button onClick={() => handleAction(`remediate-${i}`)} className="flex items-center gap-1 px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded text-[10px] uppercase font-bold tracking-widest text-amber-500 transition-colors">
                      {actionLoading === `remediate-${i}` ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Shield className="w-3 h-3" />}
                      Remediate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Env Vars */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-amber-400" />
              <h4 className="text-white font-bold text-sm">Environment Variables Used ({data.envVarsUsed.length})</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.envVarsUsed.map(v => (
                <span key={v} className="px-2 py-1 bg-white/5 rounded-lg text-xs font-mono text-zinc-300 border border-white/10">{v}</span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── TAB: TERMINAL LOGS ───────────────────────────────────────────────────────
function TerminalLogsTab() {
  const [data, setData] = useState<TerminalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState('all');

  useEffect(() => {
    globalThis.fetch('/api/admin/terminal-logs').then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) return <Loader label="Reading ~/.zsh_history and terminal activity..." />;

  const categories = ['all', 'git', 'npm', 'deploy', 'filesystem', 'network', 'runtime', 'shell'];
  const history = (data?.zshHistory ?? []).filter(h => catFilter === 'all' || h.category === catFilter);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-6">
        {/* Shell History */}
        <div className="col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-bold flex items-center gap-2"><Terminal className="w-4 h-4 text-green-400" /> ZSH History ({data?.zshHistory.length} commands)</h4>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${catFilter === c ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'text-zinc-600 hover:text-zinc-400 border border-white/5'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="bg-black/60 rounded-xl border border-white/10 overflow-hidden font-mono text-xs">
            <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2 bg-white/5">
              <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500/60" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" /><div className="w-2.5 h-2.5 rounded-full bg-green-500/60" /></div>
              <span className="text-zinc-600">~/.zsh_history</span>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-4 space-y-1">
              {history.map((h, i) => (
                <div key={i} className="flex gap-3 group hover:bg-white/5 px-2 py-1 rounded">
                  <span className="text-zinc-700 shrink-0 w-20 truncate">{new Date(h.timestamp).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className={`shrink-0 w-16 ${CATEGORY_COLOR[h.category] ?? 'text-zinc-600'}`}>[{h.category}]</span>
                  <span className="text-green-300 break-all">{h.command}</span>
                </div>
              ))}
              {history.length === 0 && <p className="text-zinc-700 text-center py-4">No commands in this category</p>}
            </div>
          </div>
        </div>

        {/* Side Column */}
        <div className="space-y-4">
          {/* Git Log */}
          <div className="glass-card rounded-xl p-4">
            <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><GitCommit className="w-4 h-4 text-amber-400" /> Recent Git Activity</h4>
            <div className="space-y-2">
              {(data?.gitLog ?? []).slice(0, 8).map((g, i) => (
                <div key={i} className="flex gap-2 text-xs">
                  <span className="font-mono text-amber-400 shrink-0">{g.hash}</span>
                  <span className="text-zinc-400 truncate">{g.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Terminal Processes */}
          <div className="glass-card rounded-xl p-4">
            <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-400" /> Active Terminal Processes</h4>
            <div className="space-y-2">
              {(data?.terminalProcesses ?? []).slice(0, 8).map((p, i) => (
                <div key={i} className="text-xs">
                  <div className="flex gap-2">
                    <span className="font-mono text-zinc-600">{p.pid}</span>
                    <span className="text-zinc-300 truncate flex-1">{p.command}</span>
                    <span className="text-amber-400 font-mono shrink-0">{p.cpu}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Files */}
          <div className="glass-card rounded-xl p-4">
            <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><FolderOpen className="w-4 h-4 text-purple-400" /> Recently Modified Files</h4>
            <div className="space-y-1.5">
              {(data?.recentFiles ?? []).slice(0, 10).map((f, i) => (
                <div key={i} className="text-xs font-mono text-zinc-500 truncate hover:text-zinc-300 transition-colors">{f}</div>
              ))}
              {(data?.recentFiles ?? []).length === 0 && <p className="text-zinc-700 text-xs">No recently modified files</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: ACTIVE TASKS ────────────────────────────────────────────────────────
function ActiveTasksTab() {
  const [data, setData] = useState<TasksData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    globalThis.fetch('/api/admin/tasks').then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) return <Loader label="Reading project git status and active task files..." />;

  return (
    <div className="space-y-8">
      {/* Summary Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: data?.summary.total, icon: FolderOpen, color: 'text-amber-400' },
          { label: 'Clean', value: data?.summary.clean, icon: CheckCircle, color: 'text-green-400' },
          { label: 'Uncommitted Changes', value: data?.summary.dirty, icon: AlertTriangle, color: 'text-orange-400' },
          { label: 'Unstaged Files', value: data?.summary.totalUncommitted, icon: GitBranch, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <div><p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p><p className="text-zinc-500 text-xs">{s.label}</p></div>
          </div>
        ))}
      </div>

      {/* Projects Grid */}
      <div>
        <h4 className="text-white font-bold mb-4">Active Mission Projects</h4>
        <div className="grid grid-cols-2 gap-4">
          {(data?.projects ?? []).map(p => (
            <div key={p.name} className={`glass-card rounded-2xl p-5 border transition-all hover:border-amber-500/20 ${p.status === 'dirty' ? 'border-orange-500/20' : p.status === 'missing' ? 'border-red-500/10 opacity-50' : 'border-white/5'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h5 className="text-white font-bold">{p.name}</h5>
                  <p className="text-zinc-600 text-xs font-mono mt-0.5">{p.tech}</p>
                </div>
                <Pill label={p.status === 'dirty' ? 'DIRTY' : p.status === 'missing' ? 'MISSING' : 'CLEAN'}
                  color={p.status === 'dirty' ? 'orange' : p.status === 'missing' ? 'red' : 'green'} />
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                <GitBranch className="w-3 h-3" />
                <span className="font-mono">{p.branch}</span>
                {p.uncommitted > 0 && <span className="text-orange-400 ml-auto">{p.uncommitted} unstaged</span>}
              </div>
              {p.lastCommit && (
                <div className="bg-white/5 rounded-lg px-3 py-2 flex items-center gap-2 text-xs">
                  <span className="font-mono text-amber-400">{p.lastCommit.hash}</span>
                  <span className="text-zinc-400 truncate">{p.lastCommit.message}</span>
                </div>
              )}
              {p.url && (
                <a href={p.url} target="_blank" rel="noreferrer"
                  className="mt-3 flex items-center gap-1 text-xs text-zinc-600 hover:text-amber-400 transition-colors">
                  <ChevronRight className="w-3 h-3" /> {p.url.replace('https://', '')}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active Agent Tasks */}
      {(data?.activeTasks ?? []).length > 0 && (
        <div>
          <h4 className="text-white font-bold mb-4 flex items-center gap-2"><ListTodo className="w-4 h-4 text-amber-400" /> Active Agent Task Lists</h4>
          <div className="grid grid-cols-2 gap-4">
            {(data?.activeTasks ?? []).map(t => (
              <div key={t.project} className="glass-card rounded-2xl p-5 border border-white/5">
                <p className="text-zinc-500 text-xs font-mono mb-3">Session: {t.project}</p>
                <div className="space-y-2">
                  {t.tasks.map((task, i) => (
                    <div key={i} className={`flex items-start gap-2 text-xs ${task.done ? 'text-zinc-600 line-through' : 'text-zinc-300'}`}>
                      {task.done ? <CheckCircle className="w-3 h-3 text-green-500 shrink-0 mt-0.5" /> : <div className="w-3 h-3 border border-zinc-600 rounded-sm shrink-0 mt-0.5" />}
                      {task.text}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function GaugeCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <h4 className="text-zinc-400 text-xs uppercase tracking-widest font-bold">{title}</h4>
      <div className="flex gap-4">{children}</div>
    </div>
  );
}
function Loader({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
      <p className="text-zinc-500 text-xs font-mono">{label}</p>
    </div>
  );
}
function EmptyState({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      {icon}
      <p className="text-zinc-600 text-sm text-center">{label}</p>
    </div>
  );
}
function LiveIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Live</span>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'security', label: 'Security Agent', icon: Shield },
  { id: 'system', label: 'System Monitor', icon: Cpu },
  { id: 'terminal', label: 'Terminal Logs', icon: Terminal },
  { id: 'tasks', label: 'Active Tasks', icon: ListTodo },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('security');

  return (
    <div className="min-h-screen bg-[var(--m2-void)]">
      <main className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Super Admin Command Center</h1>
                <p className="text-zinc-500 text-xs font-mono">M2 NEXUS · Sovereign Monitoring & Security Intelligence</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-600 font-mono">
            <Clock className="w-3 h-3" />
            {new Date().toLocaleString('en', { weekday: 'short', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 w-fit">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'security' && <SecurityAgentTab />}
          {activeTab === 'system' && <SystemMonitorTab />}
          {activeTab === 'terminal' && <TerminalLogsTab />}
          {activeTab === 'tasks' && <ActiveTasksTab />}
        </div>
      </main>
    </div>
  );
}
