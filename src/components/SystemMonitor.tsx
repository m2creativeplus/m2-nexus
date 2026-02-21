"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { Monitor, Cpu, MemoryStick, HardDrive } from "lucide-react";

interface CpuDataPoint { v: number; }

export function SystemMonitor() {
  const [stats, setStats] = useState({ cpu: 22, ram: 57, storage: 67 });
  const [history, setHistory] = useState<CpuDataPoint[]>(Array.from({ length: 20 }, () => ({ v: Math.round(15 + Math.random() * 25) })));

  useEffect(() => {
    const id = setInterval(() => {
      const cpu = Math.round(15 + Math.random() * 35);
      const ram = Math.round(52 + Math.random() * 20);
      setStats(prev => ({ ...prev, cpu, ram }));
      setHistory(prev => [...prev.slice(-19), { v: cpu }]);
    }, 3000);
    return () => clearInterval(id);
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
        <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: "var(--m2-text-secondary)" }}>System Monitor</h2>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: "var(--m2-surface)", color: "var(--m2-green)" }}>LIVE</span>
          <span className="text-xs" style={{ color: "var(--m2-text-muted)" }}>Uptime: 14d 7h 23m</span>
        </div>
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
            {m.label === "CPU" ? (
              <div style={{ height: 40 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={m.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={m.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      contentStyle={{ background: "var(--m2-void)", border: "none", borderRadius: 6, fontSize: 10 }}
                    />
                    <Area type="monotone" dataKey="v" stroke={m.color} strokeWidth={1.5} fill="url(#cpuGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="status-bar">
                <div className="status-bar-fill" style={{ width: `${m.value}%`, background: `linear-gradient(90deg, ${m.color}80, ${m.color})` }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
