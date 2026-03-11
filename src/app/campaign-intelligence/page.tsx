"use client";
"use client";

export default function CampaignIntelligencePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tighter gold-text uppercase">CAMPAIGN INTELLIGENCE</h1>
          <p className="text-sm text-zinc-400">Strategic market analysis, sentiment tracking, and ROI projections.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 border-l-2 border-yellow-500">
             <h3 className="text-xs uppercase text-zinc-500 mb-2">Market Sentiment</h3>
             <p className="text-2xl font-bold text-white">POSITIVE</p>
          </div>
          <div className="glass-card p-6 border-l-2 border-green-500">
             <h3 className="text-xs uppercase text-zinc-500 mb-2">Active Tenders</h3>
             <p className="text-2xl font-bold text-white">12</p>
          </div>
          <div className="glass-card p-6 border-l-2 border-purple-500">
             <h3 className="text-xs uppercase text-zinc-500 mb-2">Success Rate</h3>
             <p className="text-2xl font-bold text-white">84%</p>
          </div>
        </div>
      </main>
      <footer className="px-8 py-4 text-center text-[10px]" style={{ borderTop: "1px solid var(--m2-border)", color: "var(--m2-text-muted)" }}>
        M2 NEXUS v2.0 — Powered by Gemini 2.0 Flash · M2 Creative & Consulting · Hargeisa, Somaliland · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
