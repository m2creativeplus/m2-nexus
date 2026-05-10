"use client";
import { useEffect, useState } from "react";
import { Shield, Zap, RefreshCw, CheckCircle2 } from "lucide-react";
import { GlassCard } from "./ui/M2BrandUI";

interface Mission {
  git_status: string;
  last_checked: string;
}

export function SovereignMonitor() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchTruth = async () => {
    try {
      const res = await fetch('/api/system/truth');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await new Promise(r => setTimeout(r, 2000));
      await fetchTruth();
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchTruth();
    const id = setInterval(fetchTruth, 10000);
    return () => clearInterval(id);
  }, []);

  const stats = [
    { label: "Missions Tracked", value: data?.missions ? Object.keys(data.missions).length : "...", status: "Synchronized", color: "var(--m2-gold)" },
    { label: "Forensic Status", value: data?.system_agents?.forensic_audit || "...", status: data?.system_agents?.forensic_audit === 'Success' ? 'Secure' : 'Scanning', color: "var(--m2-purple)" },
    { label: "Data Integrity", value: data?.workspace_integrity || "...", status: "High", color: "var(--m2-green)" },
    { label: "System Uptime", value: "14d 7h", status: "Nominal", color: "var(--m2-blue)" },
  ];

  return (
    <GlassCard className="border-[var(--m2-gold)]/20 overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--m2-gold)]/10 flex items-center justify-center border border-[var(--m2-gold)]/20">
            <Shield className="w-5 h-5 text-[var(--m2-gold)]" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-outfit text-white">Sovereign Intelligence Monitor</h3>
            <p className="text-[var(--m2-text-muted)] text-[10px] uppercase tracking-widest">Real-time Forensic Feed</p>
          </div>
        </div>
        <button 
          onClick={handleSync}
          disabled={syncing}
          className="p-2 rounded-lg bg-[var(--m2-gold)]/10 border border-[var(--m2-gold)]/20 text-[var(--m2-gold)] hover:bg-[var(--m2-gold)]/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[var(--m2-gold)]/20 transition-all group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase tracking-wider text-[var(--m2-text-muted)]">{stat.label}</span>
              <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded`} style={{ background: `color-mix(in srgb, ${stat.color} 15%, transparent)`, color: stat.color }}>{stat.status}</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono transition-colors group-hover:text-[var(--m2-gold)]" style={{ color: loading ? 'var(--m2-text-muted)' : 'inherit' }}>
              {loading ? "..." : stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/5 flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 text-[10px] text-[var(--m2-gold)] uppercase tracking-[0.2em] font-bold mb-3 sticky top-0 bg-black/40 py-1">
          <Zap className="w-3 h-3" /> Mission Sync Status
        </div>
        <div className="space-y-2 font-mono text-[10px]">
          {data?.missions ? Object.entries(data.missions).map(([name, m]) => {
            const mission = m as Mission;
            return (
              <div key={name} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                <span className="text-zinc-300 truncate pr-2">{name}</span>
                <span className={`shrink-0 flex items-center gap-1 ${mission.git_status === 'Clean' ? 'text-green-500' : 'text-amber-500'}`}>
                  {mission.git_status === 'Clean' && <CheckCircle2 className="w-2.5 h-2.5" />}
                  {mission.git_status}
                </span>
              </div>
            );
          }) : (
            <div className="text-zinc-600 italic">No mission data available...</div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
