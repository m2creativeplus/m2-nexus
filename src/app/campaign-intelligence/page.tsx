"use client";
import { BarChart3, Target, TrendingUp, Globe, Newspaper, Users } from "lucide-react";

export default function CampaignIntelligencePage() {
  const campaigns = [
    { name: "Somaliland Independence Day 2026", status: "active", reach: "2.4M", engagement: "18.2%", platform: "Multi-Channel" },
    { name: "SNPA ISO Modernization Launch", status: "active", reach: "450K", engagement: "12.8%", platform: "LinkedIn + X" },
    { name: "M2 Creative Brand Awareness", status: "paused", reach: "120K", engagement: "8.4%", platform: "Instagram" },
    { name: "Guurti EPD Committee Comms", status: "draft", reach: "—", engagement: "—", platform: "Institutional" },
  ];

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-8">
        <div className="flex flex-col gap-2 mb-2">
          <h1 className="text-3xl font-bold tracking-tighter gold-text uppercase flex items-center gap-3">
            <BarChart3 className="w-8 h-8" /> CAMPAIGN INTELLIGENCE
          </h1>
          <p className="text-sm text-zinc-400">Strategic market analysis, sentiment tracking, and ROI projections.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-6 border-l-2 border-[#D4AF37]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs uppercase text-zinc-500 font-bold">Market Sentiment</h3>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400">POSITIVE</p>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono">Horn of Africa tech sector trending up</p>
          </div>
          <div className="glass-card p-6 border-l-2 border-emerald-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs uppercase text-zinc-500 font-bold">Active Tenders</h3>
              <Newspaper className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <p className="text-2xl font-bold text-white">12</p>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono">Government & institutional RFPs</p>
          </div>
          <div className="glass-card p-6 border-l-2 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs uppercase text-zinc-500 font-bold">Win Rate</h3>
              <Target className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">84%</p>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono">Proposals accepted / submitted</p>
          </div>
        </div>

        {/* Campaign Table */}
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Active Campaigns</h2>
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-zinc-500">
                  <th className="text-left p-4 font-bold">Campaign</th>
                  <th className="text-left p-4 font-bold">Platform</th>
                  <th className="text-left p-4 font-bold">Reach</th>
                  <th className="text-left p-4 font-bold">Engagement</th>
                  <th className="text-left p-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium text-white">{c.name}</td>
                    <td className="p-4 text-zinc-400 font-mono text-xs">{c.platform}</td>
                    <td className="p-4 text-zinc-300 font-mono">{c.reach}</td>
                    <td className="p-4 text-zinc-300 font-mono">{c.engagement}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] uppercase tracking-widest font-bold rounded ${
                        c.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                        c.status === 'paused' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-zinc-800 text-zinc-500'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
