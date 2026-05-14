"use client";
import { motion } from "framer-motion";
import { Database, Terminal, Landmark, Globe, Activity, FileText, Shield, Code2, Calendar } from "lucide-react";
import { Badge } from "./Badge";

interface Project {
  name: string;
  icon: any;
  status: string;
  statusLabel: string;
  description: string;
  color: string;
  location: string;
}

const M2_ECOSYSTEM_PROJECTS: Project[] = [
  {
    name: "M2 NEXUS Dashboard",
    icon: Activity,
    status: "active",
    statusLabel: "LIVE COMMAND",
    description: "Sovereign Intelligence Dashboard & Control Center",
    color: "#D4AF37",
    location: "m2-nexus/"
  },
  {
    name: "Guurti Portal",
    icon: Landmark,
    status: "in-progress",
    statusLabel: "BUILDING",
    description: "Trilingual Legislative Dashboard for the House of Elders",
    color: "#10b981",
    location: "M2_PROJECTS_HUB/03_KNOWLEDGE_BASE/03_GUURTI_PORTAL/"
  },
  {
    name: "Guurti Foreign Affairs EPD",
    icon: Shield,
    status: "active",
    statusLabel: "OPERATIONAL",
    description: "Diplomatic Structuring & Shadow War Intelligence",
    color: "#D4AF37",
    location: "M2_PROJECTS_HUB/03_KNOWLEDGE_BASE/04_GUURTI_FOREIGN_AFFAIRS_EPD/"
  },
  {
    name: "SNPA Knowledge Base",
    icon: Database,
    status: "in-progress",
    statusLabel: "SCAFFOLDED",
    description: "Research Portal & Sovereign Document Archives",
    color: "#3b82f6",
    location: "snpa-knowledge-base/"
  },
  {
    name: "Smart School SMS",
    icon: Globe,
    status: "active",
    statusLabel: "NEEDS COMPLETION",
    description: "Next.js + Convex School Management System",
    color: "#8b5cf6",
    location: "smart-school-sms/"
  },
  {
    name: "M2 Creative Website",
    icon: Globe,
    status: "in-progress",
    statusLabel: "VERCEL DEPLOYED",
    description: "Official Agency Portfolio (Next.js + Tailwind)",
    color: "#eab308",
    location: "m2creative-website/"
  },
  {
    name: "M2 Dev Library",
    icon: Code2,
    status: "active",
    statusLabel: "65 REGISTRY ITEMS",
    description: "Reusable Component Library for Sovereign Apps",
    color: "#ec4899",
    location: "m2-dev-library/"
  },
  {
    name: "Kaltirsi Calendar",
    icon: Calendar,
    status: "idle",
    statusLabel: "CONCEPT",
    description: "Ecological Intelligence Calendar System",
    color: "#14b8a6",
    location: "M2_EPD_MASTER_HUB/04_PRODUCT_ECOSYSTEM/"
  },
  {
    name: "M2 Creative OS",
    icon: Terminal,
    status: "idle",
    statusLabel: "BLUEPRINT",
    description: "Master SaaS Blueprint & AI Creator Platform",
    color: "#6366f1",
    location: "M2_EPD_MASTER_HUB/04_PRODUCT_ECOSYSTEM/"
  }
];

export function ProjectHub() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 h-full flex flex-col border-[var(--m2-gold)]/20">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-[var(--m2-gold)]" />
          <h2 className="text-sm font-semibold tracking-wide uppercase font-outfit text-white">M2 Sovereign Project Matrix</h2>
        </div>
        <span className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-widest text-[var(--m2-gold)] border border-[var(--m2-gold)]/20 px-2 py-1 rounded-full bg-[var(--m2-gold)]/10">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          {M2_ECOSYSTEM_PROJECTS.length} Active Missions
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
        {M2_ECOSYSTEM_PROJECTS.map((p) => {
          const IconComp = p.icon;
          return (
            <motion.div 
              key={p.name} 
              whileHover={{ scale: 1.02, y: -2 }} 
              className="rounded-xl p-4 transition-all group flex flex-col justify-between border border-white/5"
              style={{ background: "rgba(0,0,0,0.4)", borderLeft: `3px solid ${p.color}` }}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg" style={{ background: `${p.color}20` }}>
                      <IconComp className="w-4 h-4" style={{ color: p.color }} />
                    </div>
                  </div>
                  <Badge status={p.status} label={p.statusLabel} color={p.color} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{p.name}</h3>
                <p className="text-xs leading-relaxed text-zinc-400">{p.description}</p>
              </div>
              
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                <Terminal className="w-3 h-3 text-zinc-500" />
                <span className="text-[9px] font-mono text-zinc-500 truncate" title={p.location}>{p.location}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
