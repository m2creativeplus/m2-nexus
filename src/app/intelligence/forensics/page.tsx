"use client";

import React, { useState, useEffect } from "react";
import { Brain, Activity, FolderGit2, AlertTriangle, Zap } from "lucide-react";

export default function ForensicDashboard() {
  const [lastRun, setLastRun] = useState("Syncing...");

  useEffect(() => {
    // Simulate real-time fetch from local agent
    setTimeout(() => {
      setLastRun(new Date().toLocaleString());
    }, 1500);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-zinc-950 min-h-screen text-zinc-100 font-sans">
      <header className="flex justify-between items-end border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Brain className="w-8 h-8 text-[#D4AF37]" />
            M2 Sovereign Forensics
          </h1>
          <p className="text-zinc-400">Autonomous Digital Footprint & Workflow Intelligence</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-zinc-500">Last Agent Cycle</div>
          <div className="font-mono text-[#D4AF37]">{lastRun}</div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Cards */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
          <FolderGit2 className="w-6 h-6 text-blue-400 mb-4" />
          <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">Active Scaffolds</h3>
          <div className="text-3xl font-light">42 Repos</div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
          <Activity className="w-6 h-6 text-emerald-400 mb-4" />
          <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">Workflow Efficiency</h3>
          <div className="text-3xl font-light">68%</div>
          <p className="text-xs text-emerald-500 mt-2">+12% since last optimization</p>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
          <AlertTriangle className="w-6 h-6 text-amber-400 mb-4" />
          <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">Duplication Alerts</h3>
          <div className="text-3xl font-light text-amber-400">3 Clusters</div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/50 to-transparent"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#D4AF37]" />
            Actionable Optimizations
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-4 p-4 rounded-lg bg-black/40 border border-zinc-800">
              <div className="p-2 bg-zinc-800 rounded-md text-sm font-mono text-zinc-300">01</div>
              <div>
                <h4 className="font-medium text-white">Merge Dashboards</h4>
                <p className="text-sm text-zinc-400 mt-1">M2_Creative_OS and M2_Orbit overlap by 80%. Migrate routing logic into M2_Nexus to consolidate focus.</p>
              </div>
            </li>
            <li className="flex items-start gap-4 p-4 rounded-lg bg-black/40 border border-zinc-800">
              <div className="p-2 bg-zinc-800 rounded-md text-sm font-mono text-zinc-300">02</div>
              <div>
                <h4 className="font-medium text-white">Purge Documents Mirror</h4>
                <p className="text-sm text-zinc-400 mt-1">29,000+ unindexed files in legacy archive causing AI context drift. Recommend zip archiving.</p>
              </div>
            </li>
          </ul>
        </section>

        <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-6">Recent Agent Execution Logs</h2>
          <div className="font-mono text-xs text-zinc-500 space-y-2 bg-black p-4 rounded-lg h-64 overflow-y-auto">
            <p>[SYSTEM] Initializing forensic chron job...</p>
            <p>[DATA] Extracting Chrome history (dev filter applied)... 1000 records pulled.</p>
            <p>[DATA] Auditing GitHub Repositories... 42 identified.</p>
            <p>[DATA] Traversing /Volumes/MAC DATA/Antigraphity... 239 packages mapped.</p>
            <p className="text-emerald-500">[AI] Local Model synthesis complete.</p>
            <p>[DB] Upserting timeline to Convex Memory schema...</p>
            <p className="text-emerald-500">[OK] Cycle complete. Zero anomalies.</p>
            <span className="animate-pulse">_</span>
          </div>
        </section>
      </div>
    </div>
  );
}
