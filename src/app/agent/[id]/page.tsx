"use client";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";

export default function AgentProfilePage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6">
        <div className="flex flex-col gap-2 mb-6">
          <span className="text-[10px] uppercase tracking-widest text-yellow-500 font-bold">AGENT PROFILE</span>
          <h1 className="text-4xl font-bold tracking-tighter text-white uppercase">
            {id ? id.replace(/-/g, ' ') : 'AGENT PROFILE'}
          </h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-green-500 font-mono">STATUS: OPERATIONAL</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 glass-card p-6 h-96 flex flex-col">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-4">Neural Activity Log</h3>
              <div className="flex-1 bg-black/20 rounded-lg p-4 font-mono text-[10px] text-zinc-400">
                &gt; Listening for mission updates...
              </div>
           </div>
           <div className="glass-card p-6 h-96">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-4">Core Directives</h3>
              <ul className="text-xs space-y-3 text-zinc-300">
                <li className="flex gap-2"><span>•</span> <span>Maintain sovereign design standards.</span></li>
                <li className="flex gap-2"><span>•</span> <span>Automate repetitive GTM workflows.</span></li>
                <li className="flex gap-2"><span>•</span> <span>Protect data integrity across M2 vaults.</span></li>
              </ul>
           </div>
        </div>
      </main>
      <footer className="px-8 py-4 text-center text-[10px]" style={{ borderTop: "1px solid var(--m2-border)", color: "var(--m2-text-muted)" }}>
        M2 NEXUS v2.0 — Powered by Gemini 2.0 Flash · M2 Creative & Consulting · Hargeisa, Somaliland · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
