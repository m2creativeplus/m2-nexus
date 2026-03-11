"use client";
import { Header } from "@/components/Header";

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tighter gold-text uppercase">SETTINGS</h1>
          <p className="text-sm text-zinc-400">Global configuration for the M2 Nexus Sovereign OS environment.</p>
        </div>
        
        <div className="max-w-2xl space-y-4">
           <div className="glass-card p-6 flex items-center justify-between">
             <div>
               <h4 className="text-sm font-semibold text-white">Sovereign Mode</h4>
               <p className="text-xs text-zinc-500">Enforce M2 Zero-Trust Workflow Protocol across all nodes.</p>
             </div>
             <div className="w-10 h-5 bg-yellow-500 rounded-full flex items-center px-1">
               <div className="w-3 h-3 bg-white rounded-full ml-auto"></div>
             </div>
           </div>
           
           <div className="glass-card p-6 flex items-center justify-between opacity-50">
             <div>
               <h4 className="text-sm font-semibold text-white">Cloud Mirroring</h4>
               <p className="text-xs text-zinc-500">Enable real-time synchronization with Google Drive backup.</p>
             </div>
             <div className="w-10 h-5 bg-zinc-700 rounded-full flex items-center px-1">
               <div className="w-3 h-3 bg-zinc-500 rounded-full"></div>
             </div>
           </div>
        </div>
      </main>
      <footer className="px-8 py-4 text-center text-[10px]" style={{ borderTop: "1px solid var(--m2-border)", color: "var(--m2-text-muted)" }}>
        M2 NEXUS v2.0 — Powered by Gemini 2.0 Flash · M2 Creative & Consulting · Hargeisa, Somaliland · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
