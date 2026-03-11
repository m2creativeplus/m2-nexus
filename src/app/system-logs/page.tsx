"use client";
import { Header } from "@/components/Header";

export default function SystemLogsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tighter gold-text uppercase">SYSTEM LOGS</h1>
          <p className="text-sm text-zinc-400">Chronological audit trail of all M2 Nexus internal operations.</p>
        </div>
        
        <div className="glass-card font-mono text-[10px] p-6 bg-black/40 h-[600px] overflow-y-auto border-white/5">
           <div className="space-y-1">
             <p className="text-zinc-500"><span className="text-zinc-600">[{new Date().toISOString()}]</span> nexus_os_boot: status: OK</p>
             <p className="text-green-500/80"><span className="text-zinc-600">[{new Date().toISOString()}]</span> auth_engine: user: mahmoudawaleh: status: SECURE</p>
             <p className="text-yellow-500/80"><span className="text-zinc-600">[{new Date().toISOString()}]</span> bkg_worker: guardian_sync: status: PENDING</p>
             <p className="text-zinc-500"><span className="text-zinc-600">[{new Date().toISOString()}]</span> cloud_check: v0_vercel: status: CONNECTED</p>
           </div>
        </div>
      </main>
      <footer className="px-8 py-4 text-center text-[10px]" style={{ borderTop: "1px solid var(--m2-border)", color: "var(--m2-text-muted)" }}>
        M2 NEXUS v2.0 — Powered by Gemini 2.0 Flash · M2 Creative & Consulting · Hargeisa, Somaliland · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
