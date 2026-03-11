"use client";
"use client";

export default function MovingAdsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tighter gold-text uppercase">MOVING ADS</h1>
          <p className="text-sm text-zinc-400">Real-time route optimization and fleet intelligence for M2 Moving Ads.</p>
        </div>
        
        <div className="glass-card aspect-video w-full flex items-center justify-center border-dashed border-2 border-white/5">
          <div className="text-center">
             <p className="text-zinc-500 text-sm mb-4">Abstract Fleet Grid Visualization Initializing...</p>
             <div className="flex gap-2 justify-center">
               <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
               <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-75"></span>
               <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-150"></span>
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
