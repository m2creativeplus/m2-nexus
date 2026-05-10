"use client";
import { useEffect, useState } from "react";
import { Activity, Cpu } from "lucide-react";
import { SovereignMonitor } from "@/components/SovereignMonitor";

interface MemoryEvent {
  timestamp: string;
  status: string;
  task_id: string;
  output: string;
}

interface TelemetryData {
  heartbeat: {
    status: string;
    safe_mode?: boolean;
    last_task_attempted?: string;
  };
  memoryEvents: MemoryEvent[];
}

export function RightPanel() {
  const [telemetry, setTelemetry] = useState<TelemetryData>({ 
    heartbeat: { status: 'offline' }, 
    memoryEvents: [] 
  });

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/telemetry');
        if (res.ok) {
          const data = await res.json();
          setTelemetry(data);
        }
      } catch (e) {
        console.error("Telemetry poll failed", e);
      }
    };

    fetchTelemetry();
    const id = setInterval(fetchTelemetry, 2000); // poll every 2 seconds
    return () => clearInterval(id);
  }, []);

  const hb = telemetry.heartbeat;
  const isOnline = hb.status && hb.status !== 'offline';
  const isSafeMode = hb.safe_mode;

  return (
    <aside className="w-[340px] h-screen fixed right-0 top-0 glass-card rounded-none border-y-0 border-r-0 border-l border-white/10 flex flex-col z-[60] bg-black/20 backdrop-blur-xl">
      <div className="p-6 border-b border-white/5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 flex justify-between items-center">
          Live Intelligence Feed
          {isSafeMode && <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[9px]">SHADOW MODE</span>}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className={`w-3 h-3 ${isOnline ? 'text-[#D4AF37]' : 'text-zinc-600'}`} />
              <span className="text-[10px] text-zinc-500 uppercase">Engine Status</span>
            </div>
            <p className={`text-sm font-bold uppercase ${isOnline ? 'text-white' : 'text-zinc-600'}`}>
              {hb.status || 'Offline'}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Activity className={`w-3 h-3 ${isOnline ? 'text-green-500' : 'text-zinc-600'}`} />
              <span className="text-[10px] text-zinc-500 uppercase">Last Target</span>
            </div>
            <p className="text-sm font-bold text-white truncate" title={hb.last_task_attempted || 'None'}>
              {hb.last_task_attempted || 'None'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <SovereignMonitor />
        {telemetry.memoryEvents.length === 0 && (
          <div className="text-[10px] text-zinc-600 font-mono text-center mt-10">Awaiting memory stream...</div>
        )}
        {telemetry.memoryEvents.map((log: MemoryEvent, i: number) => {
          const timeStr = new Date(log.timestamp).toLocaleTimeString();
          let color = 'text-zinc-400';
          if (log.status === 'SUCCESS' || log.status === 'SIMULATED_SUCCESS') color = 'text-green-500';
          if (log.status === 'FAILED' || log.status === 'ERROR') color = 'text-red-500';
          if (log.status === 'REJECTED') color = 'text-yellow-500';
          
          return (
            <div key={i} className={`flex flex-col gap-1 text-[10px] font-mono border-l-2 ${color.replace('text-', 'border-')}/30 pl-3 py-1`}>
              <div className="flex justify-between text-zinc-600">
                <span>{timeStr}</span>
                <span className={color}>[{log.status}]</span>
              </div>
              <div className="text-zinc-300 font-bold">{log.task_id}</div>
              <div className="text-zinc-500 leading-snug break-words">{log.output}</div>
            </div>
          );
        })}
      </div>

      <div className="p-6 border-t border-white/5 bg-black/40">
        <div className="flex items-center justify-between text-[10px] mb-2">
           <span className="text-zinc-500">Observability Sync</span>
           <span className="text-white font-mono pulse-live flex items-center gap-1.5"><div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>{isOnline ? 'Live Polling (2s)' : 'Disconnected'}</span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
           <div className={`w-full h-full ${isOnline ? 'bg-green-500/50 animate-pulse' : 'bg-zinc-800'}`}></div>
        </div>
      </div>
    </aside>
  );
}
