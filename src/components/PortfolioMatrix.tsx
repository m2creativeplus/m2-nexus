"use client";
import { motion } from "framer-motion";
import { Layers, Figma, Globe, ExternalLink } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "./ui/GlassCard";
import { GoldButton } from "./ui/GoldButton";

const CASE_STUDIES = [
  {
    id: "figma-1607595136433545833",
    title: "M2 Sovereign Design System",
    type: "figma",
    description: "Official UI/UX case study and brand architecture components embedded directly from Figma.",
    embedUrl: "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fcommunity%2Ffile%2F1607595136433545833",
  },
  {
    id: "smart-school-sms",
    title: "Smart School SMS",
    type: "vercel",
    description: "Full-stack Next.js 15 convex deployment for institutional operations.",
    url: "https://smart-school-sms-m2creativeplus-projects.vercel.app", // Note: The EXACT url should be swapped later if different.
  },
  {
    id: "snpa-vista-hub",
    title: "SNPA Vista Hub",
    type: "vercel",
    description: "Strategic knowledge portal and ISO modernization engine built on React/Vite.",
    url: "https://snpa-vista-hub.vercel.app",
  }
];

export function PortfolioMatrix() {
  const [activeStudy, setActiveStudy] = useState(CASE_STUDIES[0]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6 min-h-[600px] flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Layers className="w-5 h-5" style={{ color: "var(--m2-gold)" }} />
        <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: "var(--m2-text-secondary)" }}>Portfolio Matrix & Case Studies</h2>
        <span className="ml-auto text-[10px] font-mono px-2 py-1 rounded border border-yellow-500/30" style={{ background: "rgba(212,175,55,0.1)", color: "var(--m2-gold)" }}>LIVE EMBED</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        
        {/* Sidebar Selector */}
        <div className="lg:col-span-1 space-y-3 overflow-y-auto pr-2 max-h-[500px] scrollbar-thin scrollbar-thumb-white/10">
          {CASE_STUDIES.map((study) => (
            <GlassCard 
              key={study.id} 
              hoverEffect 
              className={`p-4 cursor-pointer transition-all ${activeStudy.id === study.id ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'border-white/5 opacity-60 hover:opacity-100'}`}
              onClick={() => setActiveStudy(study)}
            >
              <div className="flex items-center gap-2 mb-2">
                {study.type === 'figma' ? <Figma className="w-4 h-4 text-purple-400 shrink-0" /> : <Globe className="w-4 h-4 text-blue-400 shrink-0" />}
                <h3 className="text-sm font-semibold text-white truncate">{study.title}</h3>
              </div>
              <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">{study.description}</p>
            </GlassCard>
          ))}
        </div>

        {/* Viewer Pane */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden relative flex flex-col" style={{ background: "var(--m2-void)", border: "1px solid var(--m2-border)" }}>
          {activeStudy.type === 'figma' && activeStudy.embedUrl && (
            <iframe 
              className="w-full h-full min-h-[500px] flex-1 border-0"
              src={activeStudy.embedUrl} 
              allowFullScreen
            />
          )}

          {activeStudy.type === 'vercel' && (
             <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center bg-black/40">
               <Globe className="w-16 h-16 text-blue-500/40 mb-6" />
               <h2 className="text-2xl font-bold text-white mb-3">{activeStudy.title}</h2>
               <p className="text-sm text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">{activeStudy.description}</p>
               <GoldButton variant="outline" onClick={() => window.open(activeStudy.url, "_blank")}>
                 Open Live Deployment <ExternalLink className="w-4 h-4 ml-2" />
               </GoldButton>
             </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
