"use client";

import { useEffect, useState } from "react";
import { FolderGit2, Blocks, ServerCog, Search, Network } from "lucide-react";

interface Project {
  name: string;
  path: string;
  type: string;
}

interface Extension {
  id: string;
  name: string;
  status: string;
  description: string;
  category: string;
}

export default function LibraryPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [components, setComponents] = useState<Project[]>([]);
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [regRes, extRes] = await Promise.all([
          fetch("/api/mcp/registry"),
          fetch("/api/mcp/extensions"),
        ]);
        const regData = await regRes.json();
        const extData = await extRes.json();

        if (regData.success) {
          setProjects(regData.data.projects || []);
          setComponents(regData.data.components || []);
        }
        if (extData.success) {
          setExtensions(extData.data.extensions || []);
        }
      } catch (err) {
        console.error("Failed to fetch library registry:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <ServerCog className="w-12 h-12 text-[#D4AF37] animate-pulse" />
        <h2 className="text-zinc-400 font-mono text-sm tracking-widest uppercase">Syncing M2 Registry...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <header className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Network className="w-8 h-8 text-[#D4AF37]" />
            Component Library & MCP Database
          </h1>
          <p className="text-zinc-500 mt-2 font-mono text-sm">
            Unified sovereign registry of M2 active missions, dev components, and AI tool extensions.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Missions Database */}
        <section className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-blue-400" />
              Active Missions Database
            </h2>
            <span className="px-2 py-1 text-xs font-mono bg-zinc-800 text-zinc-400 rounded-md">
              {projects.length} nodes
            </span>
          </div>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700">
            {projects.map((proj) => (
              <div key={proj.path} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-blue-500/30 transition-all group">
                <h3 className="font-medium text-zinc-200 group-hover:text-blue-400 transition-colors">{proj.name}</h3>
                <p className="text-xs text-zinc-500 font-mono mt-2 truncate" title={proj.path}>
                  {proj.path.replace('/Volumes/MAC DATA/Antigraphity', '~')}
                </p>
              </div>
            ))}
            {projects.length === 0 && <div className="p-4 text-center text-zinc-600 border border-zinc-800/50 rounded-xl border-dashed">No active missions found.</div>}
          </div>
        </section>

        {/* Component Library */}
        <section className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
              <Blocks className="w-5 h-5 text-purple-400" />
              Reusable Component Library
            </h2>
            <span className="px-2 py-1 text-xs font-mono bg-zinc-800 text-zinc-400 rounded-md">
              {components.length} chunks
            </span>
          </div>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700">
            {components.map((comp) => (
              <div key={comp.path} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-purple-500/30 transition-all group cursor-pointer">
                <h3 className="font-medium text-zinc-200 group-hover:text-purple-400 transition-colors">{comp.name}</h3>
                <p className="text-xs text-zinc-500 font-mono mt-2 truncate" title={comp.path}>
                  {comp.path.replace('/Volumes/MAC DATA/Antigraphity', '~')}
                </p>
              </div>
            ))}
            {components.length === 0 && <div className="p-4 text-center text-zinc-600 border border-zinc-800/50 rounded-xl border-dashed">No library components found.</div>}
          </div>
        </section>

        {/* MCP Extensions Hub */}
        <section className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
              <ServerCog className="w-5 h-5 text-[#D4AF37]" />
              MCP AI Extensions Hub
            </h2>
            <span className="px-2 py-1 text-xs font-mono bg-zinc-800 text-zinc-400 rounded-md">
              {extensions.length} active
            </span>
          </div>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700">
            {extensions.map((ext) => (
              <div key={ext.id} className="p-4 rounded-xl border border-zinc-800 bg-black hover:border-[#D4AF37]/50 shadow-lg shadow-black/50 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-[#D4AF37]/80 shadow-[0_0_15px_#D4AF37]" />
                <div className="flex justify-between items-start pr-4">
                  <h3 className="font-medium text-zinc-100">{ext.name}</h3>
                  <span className="flex h-2 w-2 relative mt-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {ext.description}
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="px-2 py-1 text-[10px] font-mono text-zinc-400 bg-zinc-800/50 rounded border border-zinc-700/50 uppercase">
                    {ext.category}
                  </span>
                  <span className="px-2 py-1 text-[10px] font-mono text-green-400/80 bg-green-500/10 rounded border border-green-500/20 uppercase">
                    CONNECTED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
