import React from 'react';
import { Zap, Activity, Clock, Play, Server, Database } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function AutomationsPage() {
  const workflows = [
    { id: 1, name: "SEO Daily Audit", status: "active", runs: 142, lastRun: "10 mins ago", target: "m2creative.com" },
    { id: 2, name: "CrewAI Productivity Sync", status: "active", runs: 89, lastRun: "1 hour ago", target: "M2 Workspace" },
    { id: 3, name: "Database Backup (Convex)", status: "active", runs: 30, lastRun: "12 hours ago", target: "m2-nexus" },
    { id: 4, name: "Social Media Campaign Sync", status: "paused", runs: 412, lastRun: "2 days ago", target: "Omni-Channel" }
  ];

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-[#D4AF37] uppercase flex items-center gap-3">
              <Zap className="w-8 h-8" /> n8n Workflows
            </h1>
            <p className="text-sm text-zinc-400 font-mono mt-2">
              Centralized orchestration of 4,343 automated tasks across the M2 Ecosystem.
            </p>
          </div>
          <button className="px-6 py-2 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-sm rounded hover:bg-[#D4AF37]/80 transition-colors">
            + New Workflow
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Active Workflows", value: "4,343", icon: Activity, color: "text-emerald-400" },
            { label: "Tasks Executed (24h)", value: "128.4K", icon: Zap, color: "text-[#D4AF37]" },
            { label: "Compute Hours Saved", value: "842", icon: Clock, color: "text-blue-400" },
            { label: "Error Rate", value: "0.02%", icon: Server, color: "text-red-400" },
          ].map((stat, i) => (
            <GlassCard key={i} className="p-6 border-white/5">
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">{stat.label}</p>
                <stat.icon className={`w-5 h-5 ${stat.color} opacity-80`} />
              </div>
              <p className={`text-3xl font-light ${stat.color}`}>{stat.value}</p>
            </GlassCard>
          ))}
        </div>

        {/* Workflow Grid */}
        <div>
          <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Active Orchestrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflows.map((wf) => (
              <GlassCard key={wf.id} className="p-0 border-white/10 overflow-hidden flex flex-col">
                <div className="p-5 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                      <Database className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <span className={`px-2 py-1 text-[10px] uppercase tracking-widest font-bold rounded ${
                      wf.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {wf.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-white mb-1">{wf.name}</h3>
                  <p className="text-xs text-zinc-500 font-mono">Target: {wf.target}</p>
                </div>
                <div className="bg-black/40 p-4 border-t border-white/5 flex items-center justify-between">
                  <div className="text-[10px] text-zinc-500 font-mono space-y-1">
                    <p>Runs: {wf.runs}</p>
                    <p>Last: {wf.lastRun}</p>
                  </div>
                  <button className="w-8 h-8 rounded bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] transition-colors">
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
