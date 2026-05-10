"use client";
import React, { useState, useMemo } from 'react';
import { Search, Filter, Globe, MapPin, Users, Calendar, ArrowUpDown, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const SECTOR_COLORS: Record<string, string> = {
  DIPLOMACY: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  ECONOMY: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  SECURITY: 'text-red-400 bg-red-500/10 border-red-500/20',
  TECHNOLOGY: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  CULTURE: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  GOVERNANCE: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};
const REGIONS = ['All Regions', 'Somaliland', 'Horn of Africa', 'Africa', 'Middle East', 'Global'];
const EVENTS = [
  { id:1, title:'Africa Investment Forum', sector:'ECONOMY', location:'Abidjan', country:'Côte d\'Ivoire', region:'Africa', date:'2026-11-04', delegates:2500, organizer:'AfDB', website:'https://aif-forum.org', score:92 },
  { id:2, title:'UN General Assembly 81st', sector:'DIPLOMACY', location:'New York', country:'USA', region:'Global', date:'2026-09-15', delegates:15000, organizer:'United Nations', website:'https://un.org/ga', score:98 },
  { id:3, title:'GITEX Africa', sector:'TECHNOLOGY', location:'Marrakech', country:'Morocco', region:'Africa', date:'2026-05-14', delegates:45000, organizer:'DWTC', website:'https://gitexafrica.com', score:88 },
  { id:4, title:'Hargeisa Book Fair', sector:'CULTURE', location:'Hargeisa', country:'Somaliland', region:'Somaliland', date:'2026-07-20', delegates:8000, organizer:'Redsea Foundation', website:'https://hfrarts.org', score:85 },
  { id:5, title:'AU Summit 44th', sector:'GOVERNANCE', location:'Addis Ababa', country:'Ethiopia', region:'Horn of Africa', date:'2026-02-08', delegates:5000, organizer:'African Union', website:'https://au.int', score:95 },
  { id:6, title:'Djibouti Maritime Summit', sector:'ECONOMY', location:'Djibouti City', country:'Djibouti', region:'Horn of Africa', date:'2026-03-18', delegates:1200, organizer:'Djibouti Port Authority', website:'#', score:78 },
  { id:7, title:'Future Investment Initiative', sector:'ECONOMY', location:'Riyadh', country:'Saudi Arabia', region:'Middle East', date:'2026-10-28', delegates:8000, organizer:'PIF', website:'https://fii-institute.org', score:94 },
  { id:8, title:'Somaliland Democracy Conf', sector:'GOVERNANCE', location:'Hargeisa', country:'Somaliland', region:'Somaliland', date:'2026-05-18', delegates:600, organizer:'MoI', website:'#', score:82 },
  { id:9, title:'Africa Cyber Security Conf', sector:'SECURITY', location:'Kigali', country:'Rwanda', region:'Africa', date:'2026-06-10', delegates:3000, organizer:'Smart Africa', website:'#', score:79 },
  { id:10, title:'Berbera Port Investment Forum', sector:'ECONOMY', location:'Berbera', country:'Somaliland', region:'Somaliland', date:'2026-08-05', delegates:450, organizer:'DP World / MoFD', website:'#', score:91 },
  { id:11, title:'Web Summit Africa', sector:'TECHNOLOGY', location:'Doha', country:'Qatar', region:'Middle East', date:'2026-02-10', delegates:15000, organizer:'Web Summit', website:'https://websummit.com', score:87 },
  { id:12, title:'Horn of Africa Renewable Energy', sector:'ECONOMY', location:'Addis Ababa', country:'Ethiopia', region:'Horn of Africa', date:'2026-04-22', delegates:900, organizer:'IGAD', website:'#', score:83 },
];
const PER_PAGE = 8;

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All');
  const [region, setRegion] = useState('All Regions');
  const [sortField, setSortField] = useState<'date'|'score'>('score');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const d = EVENTS.filter(e => {
      const s = search === '' || e.title.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase());
      const sec = sector === 'All' || e.sector === sector;
      const reg = region === 'All Regions' || e.region === region;
      return s && sec && reg;
    });
    d.sort((a,b) => {
      const vA = sortField === 'date' ? new Date(a.date).getTime() : a.score;
      const vB = sortField === 'date' ? new Date(b.date).getTime() : b.score;
      return sortDir === 'asc' ? vA - vB : vB - vA;
    });
    return d;
  }, [search, sector, region, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const toggleSort = (f: 'date'|'score') => { if(sortField===f) setSortDir(d=>d==='asc'?'desc':'asc'); else { setSortField(f); setSortDir('desc'); }};

  const kpis = [
    { label:'Total Events', value:EVENTS.length, icon:Globe },
    { label:'Somaliland', value:EVENTS.filter(e=>e.region==='Somaliland').length, icon:MapPin },
    { label:'Total Delegates', value:EVENTS.reduce((s,e)=>s+e.delegates,0).toLocaleString(), icon:Users },
    { label:'Avg Score', value:Math.round(EVENTS.reduce((s,e)=>s+e.score,0)/EVENTS.length), icon:Calendar },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#D4AF37] selection:text-black">
      <header className="mb-8 border-b border-zinc-800/50 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3"><Globe className="w-8 h-8 text-[#D4AF37]"/>Global Events Database</h1>
        <p className="text-zinc-400 mt-2 font-mono text-sm">M2 Sovereign Event Intelligence OS // Browse · Filter · Discover</p>
      </header>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(k=>(<div key={k.label} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 backdrop-blur-xl"><div className="flex items-center gap-2 text-zinc-400 text-xs font-mono uppercase tracking-widest mb-2"><k.icon className="w-4 h-4 text-[#D4AF37]"/>{k.label}</div><div className="text-3xl font-bold text-white">{k.value}</div></div>))}
      </div>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"/><input type="text" placeholder="Search events..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#D4AF37]/50"/></div>
        <div className="flex gap-3">
          <div className="relative"><Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"/><select value={sector} onChange={e=>{setSector(e.target.value);setPage(1);}} className="bg-black border border-zinc-800 rounded-lg pl-10 pr-8 py-2.5 text-sm font-mono text-white appearance-none focus:outline-none focus:border-[#D4AF37]/50 cursor-pointer"><option value="All">All Sectors</option>{Object.keys(SECTOR_COLORS).map(s=><option key={s} value={s}>{s}</option>)}</select></div>
          <select value={region} onChange={e=>{setRegion(e.target.value);setPage(1);}} className="bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-mono text-white appearance-none focus:outline-none focus:border-[#D4AF37]/50 cursor-pointer">{REGIONS.map(r=><option key={r} value={r}>{r}</option>)}</select>
        </div>
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/50 text-zinc-400 text-xs font-mono border-b border-zinc-800"><tr>
              <th className="p-4 font-normal">EVENT</th><th className="p-4 font-normal">SECTOR</th><th className="p-4 font-normal">LOCATION</th>
              <th className="p-4 font-normal cursor-pointer select-none" onClick={()=>toggleSort('date')}><span className="flex items-center gap-1">DATE<ArrowUpDown className="w-3 h-3"/></span></th>
              <th className="p-4 font-normal">DELEGATES</th>
              <th className="p-4 font-normal cursor-pointer select-none" onClick={()=>toggleSort('score')}><span className="flex items-center gap-1">SCORE<ArrowUpDown className="w-3 h-3"/></span></th>
              <th className="p-4 font-normal">LINK</th>
            </tr></thead>
            <tbody className="divide-y divide-zinc-800/50">{paged.map(ev=>(<tr key={ev.id} className="hover:bg-zinc-800/20 transition-colors">
              <td className="p-4"><div className="font-medium text-white">{ev.title}</div><div className="text-xs text-zinc-500 mt-1 font-mono">{ev.organizer}</div></td>
              <td className="p-4"><span className={`inline-flex px-2 py-1 rounded text-[10px] font-mono font-medium border uppercase tracking-wider ${SECTOR_COLORS[ev.sector]||''}`}>{ev.sector}</span></td>
              <td className="p-4 text-zinc-300 text-xs">{ev.location}, {ev.country}</td>
              <td className="p-4 text-zinc-400 font-mono text-xs">{ev.date}</td>
              <td className="p-4 text-zinc-300 font-mono text-xs">{ev.delegates.toLocaleString()}</td>
              <td className="p-4"><div className="flex items-center gap-2"><div className="w-16 bg-zinc-950 h-1.5 rounded-full overflow-hidden"><div className="bg-[#D4AF37] h-full rounded-full" style={{width:`${ev.score}%`}}/></div><span className="text-[#D4AF37] font-mono text-xs font-bold">{ev.score}</span></div></td>
              <td className="p-4">{ev.website!=='#'&&<a href={ev.website} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#D4AF37] transition-colors"><ExternalLink className="w-4 h-4"/></a>}</td>
            </tr>))}</tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-4 border-t border-zinc-800">
          <span className="text-xs text-zinc-500 font-mono">{filtered.length} events · Page {page}/{totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"><ChevronLeft className="w-4 h-4"/></button>
            <button disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)} className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"><ChevronRight className="w-4 h-4"/></button>
          </div>
        </div>
      </div>
    </div>
  );
}
