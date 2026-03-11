"use client";
import { Header } from "@/components/Header";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tighter gold-text uppercase">ANALYTICS</h1>
          <p className="text-sm text-zinc-400">Deep intelligence reporting and predictive performance metrics.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="glass-card p-6 h-64 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center">
             <p className="text-xs uppercase tracking-widest text-zinc-600">Growth Projection Visualization</p>
           </div>
           <div className="glass-card p-6 h-64 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center">
             <p className="text-xs uppercase tracking-widest text-zinc-600">Client Engagement Metrics</p>
           </div>
        </div>
      </main>
      <footer className="px-8 py-4 text-center text-[10px]" style={{ borderTop: "1px solid var(--m2-border)", color: "var(--m2-text-muted)" }}>
        M2 NEXUS v2.0 — Powered by Gemini 2.0 Flash · M2 Creative & Consulting · Hargeisa, Somaliland · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
