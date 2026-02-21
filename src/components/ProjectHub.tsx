"use client";
import { motion } from "framer-motion";
import { Database, Loader2, Shield, Terminal, Landmark, Globe, Activity, FileText, Car, ChevronRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Badge } from "./Badge";

export function ProjectHub() {
  const dynamicProjects = useQuery(api.nexus.getProjects);
  const _projects = dynamicProjects || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 min-h-[300px]">
      <div className="flex items-center gap-2 mb-5">
        <Database className="w-4 h-4" style={{ color: "var(--m2-gold)" }} />
        <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: "var(--m2-text-secondary)" }}>Unified Project Hub</h2>
        <span className="ml-auto flex items-center gap-2 text-xs" style={{ color: "var(--m2-text-muted)" }}>
          {dynamicProjects === undefined && <Loader2 className="w-3 h-3 animate-spin" />}
          {_projects.length} Projects
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {_projects.map((p: any) => {
          let IconComp = Shield; // Default
          if (p.icon === "Terminal") IconComp = Terminal;
          if (p.icon === "Landmark") IconComp = Landmark;
          if (p.icon === "Globe") IconComp = Globe;
          if (p.icon === "Activity") IconComp = Activity;
          if (p.icon === "FileText") IconComp = FileText;
          if (p.icon === "Car") IconComp = Car;

          return (
            <motion.div key={p.name} whileHover={{ scale: 1.02, y: -2 }} className="rounded-xl p-4 cursor-pointer transition-all group"
              style={{ background: "var(--m2-surface)", borderLeft: `3px solid ${p.color}` }}
              onClick={() => p.url && window.open(p.url, "_blank")}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${p.color}15` }}>
                    <IconComp className="w-4 h-4" style={{ color: p.color }} />
                  </div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--m2-text-primary)" }}>{p.name}</h3>
                </div>
                <Badge status={p.status} label={p.statusLabel} color={p.color} />
              </div>
              <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--m2-text-muted)" }}>{p.description}</p>
              {p.url && (
                <div className="flex items-center gap-1 mt-3 text-[10px]" style={{ color: `${p.color}80` }}>
                  <Globe className="w-2.5 h-2.5" /> Live on Vercel <ChevronRight className="w-2.5 h-2.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
