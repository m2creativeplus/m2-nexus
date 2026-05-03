"use client";
import { useState } from "react";
import { Cpu, Zap, FolderSync, ShieldAlert, GitBranch, Terminal } from "lucide-react";

export default function AgentOrchestrationPage() {
  const [logs, setLogs] = useState<string[]>([
    "System Initialized.",
    "Repositories cloned successfully to M2_EPD_MASTER_HUB/06_SYSTEM_OPS/SCRIPTS/agent_repos",
    "- peeyushsinghal/agentic_framework_file_organizer",
    "- TheSethRose/AI-File-Organizer-Agent",
    "- agentscope-ai/QwenPaw",
    "Ready for parallel agent execution."
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const runParallelAgent = async () => {
    setIsRunning(true);
    setLogs((prev) => [...prev, "> Dispatching Parallel File Organizer Agents (8 Threads)..."]);
    
    try {
      const response = await fetch("/api/agent-orchestration", { method: "POST" });
      const data = await response.json();
      
      if (data.status === "success") {
        setLogs((prev) => [
          ...prev, 
          `> Agents execution completed in ${data.stats?.execution_time_ms}ms`,
          `> Active worker threads deployed: ${data.stats?.agents_deployed}`,
          `> Screenshots archived: ${data.stats?.stats?.screenshots || 0}`,
          `> Legacy projects migrated: ${data.stats?.stats?.legacy || 0}`,
          `> Miscellaneous files categorized: ${data.stats?.stats?.misc || 0}`
        ]);
      } else {
        setLogs((prev) => [...prev, `> Error executing agents: ${data.error}`]);
      }
    } catch (err) {
      setLogs((prev) => [...prev, "> Connection to Agent Runtime failed."]);
    }
    
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-mono">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Cpu className="text-purple-500 w-8 h-8" />
            AGENT ORCHESTRATION LAYER
          </h1>
          <p className="text-white/50 mt-2">Powered by QwenPaw Architecture & M2 Sovereign Rules</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#111] border border-purple-500/20 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </span>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <Zap className="text-purple-500" />
                <h2 className="text-xl font-semibold">Parallel Automation Engine</h2>
              </div>
              
              <p className="text-white/60 text-sm mb-6 max-w-xl">
                This engine uses multi-threaded Python sub-agents inspired by the integrated repositories to execute highly parallelized file organization operations across your workspace.
              </p>
              
              <button 
                onClick={runParallelAgent}
                disabled={isRunning}
                className="w-full py-4 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 font-bold transition-all flex items-center justify-center gap-3"
              >
                {isRunning ? (
                  <Activity className="animate-spin w-5 h-5" />
                ) : (
                  <FolderSync className="w-5 h-5" />
                )}
                {isRunning ? "AGENTS EXECUTING..." : "DEPLOY PARALLEL WORKERS"}
              </button>
            </div>

            <div className="bg-black border border-white/10 rounded-xl flex flex-col h-72">
              <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2 text-xs text-white/50">
                <Terminal className="w-4 h-4" />
                Agent Operations Telemetry
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-2 text-sm text-[#00ffcc]">
                {logs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
                {isRunning && <div className="animate-pulse">_</div>}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold border-b border-white/10 pb-3 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-gray-400" />
                Integrated Frameworks
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  QwenPaw Architecture
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  SethRose AI Organizer
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  Agentic File Framework
                </li>
              </ul>
            </div>
            
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-400 border-b border-red-500/20 pb-3 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                System Safeguards
              </h3>
              <p className="mt-4 text-sm text-white/60">
                Rule 4.4 Override Enforced: Multi-agent systems mapped to localized standard library scripts to prevent bloated dependencies. No Enterprise bloat. High execution speed.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Quick component for spinner since we didn't import it at the top
function Activity({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
  );
}
