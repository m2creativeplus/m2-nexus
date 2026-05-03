"use client";
import { useState } from "react";
import { Activity, HardDrive, Terminal, Shield, FolderSync } from "lucide-react";

export default function ControlCenterPage() {
  const [logs, setLogs] = useState<string[]>(["System initialized. Waiting for commands..."]);
  const [isRunning, setIsRunning] = useState(false);

  const runOrganizer = async () => {
    setIsRunning(true);
    setLogs((prev) => [...prev, "> Initiating M2 File Organizer Agent..."]);
    
    try {
      const response = await fetch("/api/control-center", { method: "POST" });
      const data = await response.json();
      
      if (data.status === "success") {
        setLogs((prev) => [
          ...prev, 
          `> Agent execution successful.`,
          `> Screenshots moved: ${data.stats?.screenshots || 0}`,
          `> Videos archived: ${data.stats?.videos || 0}`,
          `> Legacy projects organized: ${data.stats?.legacy || 0}`,
          `> Miscellaneous files categorized: ${data.stats?.misc || 0}`
        ]);
      } else {
        setLogs((prev) => [...prev, `> Error: ${data.error}`]);
      }
    } catch (err) {
      setLogs((prev) => [...prev, "> Failed to connect to local Control Tower daemon."]);
    }
    
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-mono">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Shield className="text-[#D4AF37]" />
              M2 CONTROL TOWER
            </h1>
            <p className="text-white/50 mt-2">Sovereign Intelligence OS & File Automation Daemon</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
              <Activity className="w-4 h-4" />
              System Active
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          
          {/* Main Controls */}
          <div className="md:col-span-2 space-y-6">
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
                <HardDrive className="text-[#D4AF37]" />
                <h2 className="text-xl font-semibold">Autonomous File System Agent</h2>
              </div>
              <p className="text-white/60 text-sm mb-6">
                Deploy the OpenClaw-inspired file organizer. This will scan ~/Documents/ and apply M2 Global Rules to automatically sort screenshots, screen recordings, and legacy projects into structured sovereign directories.
              </p>
              
              <button 
                onClick={runOrganizer}
                disabled={isRunning}
                className="w-full py-4 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] font-bold transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <Activity className="animate-spin w-5 h-5" />
                ) : (
                  <FolderSync className="w-5 h-5" />
                )}
                {isRunning ? "AGENT EXECUTING..." : "DEPLOY FILE ORGANIZER AGENT"}
              </button>
            </div>

            {/* Live Terminal Log */}
            <div className="bg-black border border-white/10 rounded-xl overflow-hidden flex flex-col h-64">
              <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2 text-xs text-white/50">
                <Terminal className="w-4 h-4" />
                m2_control_tower_log.sh
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-2 font-mono text-sm text-[#00ffcc]">
                {logs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
                {isRunning && <div className="animate-pulse">_</div>}
              </div>
            </div>

          </div>

          {/* System Status */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm h-fit space-y-6">
            <h3 className="text-lg font-semibold border-b border-white/10 pb-3 flex justify-between">
              System Status
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">LM Studio Stream</span>
                <span className="text-red-500">Offline</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">M2 OpenClaw Agent</span>
                <span className="text-green-400">Standby</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Memory Engine (SQLite)</span>
                <span className="text-[#D4AF37]">Initialized</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Terminal Hook</span>
                <span className="text-green-400">Active</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h4 className="text-xs text-white/40 uppercase tracking-wider mb-3">Background Daemons</h4>
              <div className="flex flex-col gap-2">
                <div className="px-3 py-2 bg-black/50 border border-white/5 rounded flex justify-between items-center text-xs text-white/60">
                  <span>mac_forensic_audit</span>
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                </div>
                <div className="px-3 py-2 bg-black/50 border border-white/5 rounded flex justify-between items-center text-xs text-white/60">
                  <span>auto_project_sync</span>
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
