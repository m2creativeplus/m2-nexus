"use client";
import { Truck, MapPin, Route, Clock, TrendingUp } from "lucide-react";

export default function MovingAdsPage() {
  const fleet = [
    { id: "MA-001", route: "Hargeisa → Berbera", status: "en-route", eta: "2h 15m", impressions: "12.4K" },
    { id: "MA-002", route: "Hargeisa → Borama", status: "loading", eta: "—", impressions: "8.2K" },
    { id: "MA-003", route: "Hargeisa → Burao", status: "en-route", eta: "4h 30m", impressions: "15.1K" },
    { id: "MA-004", route: "Berbera → Hargeisa", status: "returning", eta: "1h 45m", impressions: "9.7K" },
  ];

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-8">
        <div className="flex flex-col gap-2 mb-2">
          <h1 className="text-3xl font-bold tracking-tighter gold-text uppercase flex items-center gap-3">
            <Truck className="w-8 h-8" /> MOVING ADS
          </h1>
          <p className="text-sm text-zinc-400">Real-time route optimization and fleet intelligence.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Vehicles", value: "4", icon: Truck, color: "text-emerald-400" },
            { label: "Daily Impressions", value: "45.4K", icon: TrendingUp, color: "text-[#D4AF37]" },
            { label: "Routes Active", value: "3", icon: Route, color: "text-blue-400" },
            { label: "Avg. ETA", value: "2h 50m", icon: Clock, color: "text-purple-400" },
          ].map((s, i) => (
            <div key={i} className="glass-card p-5 border border-white/5">
              <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="glass-card aspect-[21/9] w-full relative overflow-hidden border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/80 via-zinc-950 to-black flex items-center justify-center">
            <div className="text-center space-y-3">
              <MapPin className="w-12 h-12 text-[#D4AF37]/40 mx-auto animate-bounce" />
              <p className="text-sm text-zinc-500 font-mono uppercase tracking-widest">Fleet GPS Overlay</p>
            </div>
          </div>
        </div>
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-zinc-500">
                <th className="text-left p-4 font-bold">Vehicle</th>
                <th className="text-left p-4 font-bold">Route</th>
                <th className="text-left p-4 font-bold">ETA</th>
                <th className="text-left p-4 font-bold">Impressions</th>
                <th className="text-left p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {fleet.map((v) => (
                <tr key={v.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-[#D4AF37] font-bold">{v.id}</td>
                  <td className="p-4 text-white">{v.route}</td>
                  <td className="p-4 text-zinc-400 font-mono">{v.eta}</td>
                  <td className="p-4 text-zinc-300 font-mono">{v.impressions}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${
                      v.status === 'en-route' ? 'bg-emerald-500/20 text-emerald-400' :
                      v.status === 'loading' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>{v.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
