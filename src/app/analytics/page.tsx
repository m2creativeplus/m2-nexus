"use client";
import { PieChart, TrendingUp, Users, DollarSign, BarChart3, Activity } from "lucide-react";

export default function AnalyticsPage() {
  const metrics = [
    { label: "Total Pageviews", value: "142.8K", change: "+12.4%", icon: BarChart3, color: "text-[#D4AF37]" },
    { label: "Unique Visitors", value: "23.1K", change: "+8.7%", icon: Users, color: "text-emerald-400" },
    { label: "Revenue Pipeline", value: "$56.5K", change: "+0%", icon: DollarSign, color: "text-red-400" },
    { label: "Active Sessions", value: "1,842", change: "+34.2%", icon: Activity, color: "text-blue-400" },
  ];

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-8">
        <div className="flex flex-col gap-2 mb-2">
          <h1 className="text-3xl font-bold tracking-tighter gold-text uppercase">ANALYTICS</h1>
          <p className="text-sm text-zinc-400">Deep intelligence reporting and predictive performance metrics.</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="glass-card p-6 border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">{m.label}</p>
                <m.icon className={`w-5 h-5 ${m.color} opacity-80`} />
              </div>
              <p className={`text-3xl font-light ${m.color}`}>{m.value}</p>
              <p className={`text-xs mt-2 font-mono ${m.change.startsWith('+') && m.change !== '+0%' ? 'text-emerald-500' : 'text-zinc-500'}`}>
                {m.change} vs last month
              </p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 h-72 bg-gradient-to-br from-white/5 to-transparent flex flex-col">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#D4AF37]" /> Growth Projection
            </h3>
            <div className="flex-1 flex items-end gap-1">
              {[35, 42, 38, 55, 48, 62, 58, 72, 68, 80, 75, 88].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-[#D4AF37]/60 to-[#D4AF37]/20 transition-all hover:from-[#D4AF37] hover:to-[#D4AF37]/40"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[8px] text-zinc-600 font-mono">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-6 h-72 bg-gradient-to-br from-white/5 to-transparent flex flex-col">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" /> Client Engagement
            </h3>
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#27272a" strokeWidth="2" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#D4AF37" strokeWidth="2" strokeDasharray="65 35" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="20 80" strokeDashoffset="-65" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">85%</span>
                  <span className="text-[9px] text-zinc-500 uppercase">Retention</span>
                </div>
              </div>
              <div className="ml-6 space-y-2">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#D4AF37]" /><span className="text-xs text-zinc-400">Active (65%)</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-xs text-zinc-400">Returning (20%)</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-zinc-700" /><span className="text-xs text-zinc-400">Churned (15%)</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
