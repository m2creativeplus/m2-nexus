"use client";
import { useEffect, useState } from "react";
import { Clock, Activity, ShieldCheck } from "lucide-react";

export function RightPanel() {
  const [logs, setLogs] = useState<{ time: string; msg: string; type: 'info' | 'success' | 'warn' }[]>([]);

  useEffect(() => {
    const initialLogs = [
      { time: new Date().toLocaleTimeString(), msg: "Nexus OS Initialized.", type: 'info' },
      { time: new Date().toLocaleTimeString(), msg: "Sovereign Vault Locked.", type: 'success' },
      { time: new Date().toLocaleTimeString(), msg: "Gemini 2.0 Connected.", type: 'success' },
    ];
    setLogs(initialLogs as any);
  }, []);

  return (
    <aside className="w-[340px] h-screen fixed right-0 top-0 glass-card rounded-none border-y-0 border-r-0 border-l border-white/10 flex flex-col z-[60] bg-black/20 backdrop-blur-xl">
      <div className="p-6 border-b border-white/5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Live Intelligence Feed</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-3 h-3 text-green-500" />
              <span className="text-[10px] text-zinc-500 uppercase">Agents</span>
            </div>
            <p className="text-lg font-bold text-white">12</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-3 h-3 text-yellow-500" />
              <span className="text-[10px] text-zinc-500 uppercase">Health</span>
            </div>
            <p className="text-lg font-bold text-white">98%</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-3 text-[10px] font-mono border-l border-white/10 pl-3 py-1">
            <span className="text-zinc-600 shrink-0">{log.time}</span>
            <span className={log.type === 'success' ? 'text-green-500' : 'text-zinc-400'}>{log.msg}</span>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-white/5 bg-black/40">
        <div className="flex items-center justify-between text-[10px] mb-2">
           <span className="text-zinc-500">Uptime</span>
           <span className="text-white font-mono">14d 07h 23m</span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
           <div className="w-full h-full bg-yellow-500/50 animate-pulse"></div>
        </div>
      </div>
    </aside>
  );
}
