"use client";
import React, { useState, useMemo } from 'react';
import { Trophy, ArrowUpDown, TrendingUp, Globe, MapPin } from 'lucide-react';

const EVENTS = [
  { rank:1, title:'UN General Assembly 81st', globalRank:1, africaRank:'-', score:98, impact:'HIGH', sector:'DIPLOMACY' },
  { rank:2, title:'AU Summit 44th', globalRank:5, africaRank:1, score:95, impact:'HIGH', sector:'GOVERNANCE' },
  { rank:3, title:'Future Investment Initiative', globalRank:3, africaRank:'-', score:94, impact:'HIGH', sector:'ECONOMY' },
  { rank:4, title:'Africa Investment Forum', globalRank:8, africaRank:2, score:92, impact:'HIGH', sector:'ECONOMY' },
  { rank:5, title:'Berbera Port Investment Forum', globalRank:12, africaRank:5, score:91, impact:'HIGH', sector:'ECONOMY' },
  { rank:6, title:'GITEX Africa', globalRank:10, africaRank:3, score:88, impact:'HIGH', sector:'TECHNOLOGY' },
  { rank:7, title:'Web Summit Africa', globalRank:14, africaRank:'-', score:87, impact:'MEDIUM', sector:'TECHNOLOGY' },
  { rank:8, title:'Hargeisa Book Fair', globalRank:22, africaRank:8, score:85, impact:'MEDIUM', sector:'CULTURE' },
  { rank:9, title:'Horn of Africa Renewable Energy', globalRank:30, africaRank:12, score:83, impact:'MEDIUM', sector:'ECONOMY' },
  { rank:10, title:'Somaliland Democracy Conf', globalRank:35, africaRank:15, score:82, impact:'MEDIUM', sector:'GOVERNANCE' },
  { rank:11, title:'Africa Cyber Security Conf', globalRank:40, africaRank:18, score:79, impact:'LOW', sector:'SECURITY' },
  { rank:12, title:'Djibouti Maritime Summit', globalRank:50, africaRank:25, score:78, impact:'LOW', sector:'ECONOMY' },
];

const impactColor = (i:string) => i==='HIGH'?'text-emerald-400 bg-emerald-500/10 border-emerald-500/20':i==='MEDIUM'?'text-amber-400 bg-amber-500/10 border-amber-500/20':'text-zinc-400 bg-zinc-800 border-zinc-700';

export default function RankingsPage() {
  const [sortField, setSortField] = useState<'score'|'globalRank'>('score');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');
  const sorted = useMemo(()=>{
    const d=[...EVENTS];
    d.sort((a,b)=>{
      const vA=sortField==='score'?a.score:typeof a.globalRank==='number'?a.globalRank:999;
      const vB=sortField==='score'?b.score:typeof b.globalRank==='number'?b.globalRank:999;
      return sortDir==='asc'?vA-vB:vB-vA;
    });
    return d;
  },[sortField,sortDir]);

  const toggle=(f:'score'|'globalRank')=>{if(sortField===f)setSortDir(d=>d==='asc'?'desc':'asc');else{setSortField(f);setSortDir('desc');}};
  const top5=EVENTS.slice(0,5);
  const maxScore=100;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#D4AF37] selection:text-black">
      <header className="mb-8 border-b border-zinc-800/50 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3"><Trophy className="w-8 h-8 text-[#D4AF37]"/>Sovereign Benchmarking</h1>
        <p className="text-zinc-400 mt-2 font-mono text-sm">Event Ranking Engine // 30% Econ · 25% Diplo · 20% Investment · 15% Media · 10% Tourism</p>
      </header>

      {/* Top 5 Bar Chart */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-xl mb-8">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-[#D4AF37]"/>Top 5 Events by Sovereign Index</h3>
        <div className="space-y-4">
          {top5.map((ev,i)=>(<div key={i} className="flex items-center gap-4">
            <span className="text-[#D4AF37] font-mono text-sm w-6 text-right font-bold">#{ev.rank}</span>
            <div className="flex-1"><div className="flex justify-between mb-1"><span className="text-sm text-white">{ev.title}</span><span className="text-[#D4AF37] font-mono text-sm font-bold">{ev.score}</span></div>
            <div className="w-full bg-zinc-950 h-3 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style={{width:`${(ev.score/maxScore)*100}%`,background:i===0?'#D4AF37':i===1?'#b8972e':i===2?'#917524':'#6b561b'}}/></div></div>
          </div>))}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 backdrop-blur-xl"><div className="text-zinc-400 text-xs font-mono uppercase tracking-widest mb-2 flex items-center gap-2"><Globe className="w-4 h-4 text-[#D4AF37]"/>Avg Global Rank</div><div className="text-3xl font-bold text-white">{Math.round(EVENTS.reduce((s,e)=>s+(typeof e.globalRank==='number'?e.globalRank:0),0)/EVENTS.filter(e=>typeof e.globalRank==='number').length)}</div></div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 backdrop-blur-xl"><div className="text-zinc-400 text-xs font-mono uppercase tracking-widest mb-2 flex items-center gap-2"><MapPin className="w-4 h-4 text-[#D4AF37]"/>High Impact</div><div className="text-3xl font-bold text-emerald-400">{EVENTS.filter(e=>e.impact==='HIGH').length}</div></div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 backdrop-blur-xl"><div className="text-zinc-400 text-xs font-mono uppercase tracking-widest mb-2 flex items-center gap-2"><Trophy className="w-4 h-4 text-[#D4AF37]"/>Top Score</div><div className="text-3xl font-bold text-[#D4AF37]">{EVENTS[0].score}</div></div>
      </div>

      {/* Full Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto"><table className="w-full text-left text-sm">
          <thead className="bg-black/50 text-zinc-400 text-xs font-mono border-b border-zinc-800"><tr>
            <th className="p-4 font-normal">RANK</th><th className="p-4 font-normal">EVENT</th><th className="p-4 font-normal">SECTOR</th>
            <th className="p-4 font-normal cursor-pointer select-none" onClick={()=>toggle('globalRank')}><span className="flex items-center gap-1">GLOBAL RANK<ArrowUpDown className="w-3 h-3"/></span></th>
            <th className="p-4 font-normal">AFRICA RANK</th>
            <th className="p-4 font-normal cursor-pointer select-none" onClick={()=>toggle('score')}><span className="flex items-center gap-1">SCORE<ArrowUpDown className="w-3 h-3"/></span></th>
            <th className="p-4 font-normal">IMPACT</th>
          </tr></thead>
          <tbody className="divide-y divide-zinc-800/50">{sorted.map(ev=>(<tr key={ev.rank} className="hover:bg-zinc-800/20 transition-colors">
            <td className="p-4 text-[#D4AF37] font-mono font-bold">#{ev.rank}</td>
            <td className="p-4 font-medium text-white">{ev.title}</td>
            <td className="p-4 text-zinc-400 font-mono text-xs uppercase">{ev.sector}</td>
            <td className="p-4 text-zinc-300 font-mono text-xs">{ev.globalRank}</td>
            <td className="p-4 text-zinc-300 font-mono text-xs">{ev.africaRank}</td>
            <td className="p-4"><div className="flex items-center gap-2"><div className="w-16 bg-zinc-950 h-1.5 rounded-full overflow-hidden"><div className="bg-[#D4AF37] h-full rounded-full" style={{width:`${ev.score}%`}}/></div><span className="text-[#D4AF37] font-mono text-xs font-bold">{ev.score}</span></div></td>
            <td className="p-4"><span className={`inline-flex px-2 py-1 rounded text-[10px] font-mono font-medium border uppercase tracking-wider ${impactColor(ev.impact)}`}>{ev.impact}</span></td>
          </tr>))}</tbody>
        </table></div>
      </div>
    </div>
  );
}
