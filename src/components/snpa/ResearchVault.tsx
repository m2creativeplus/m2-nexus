"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/M2BrandUI";
import { FileText, Search, ChevronRight } from "lucide-react";

const reports = [
  { id: 1, title: "Printing Efficiency Deep Dive", date: "Feb 14, 2026", icon: FileText, path: "/Users/m2creative/.gemini/antigravity/brain/00142522-0028-4c8c-808a-3d7d588a61f4/printing_efficiency_deep_dive.md" },
  { id: 2, title: "Production Capacity Analysis", date: "Feb 14, 2026", icon: FileText, path: "/Users/m2creative/.gemini/antigravity/brain/00142522-0028-4c8c-808a-3d7d588a61f4/snpa_production_capacity_analysis.md" },
  { id: 3, title: "Unpaid Work Documentation", date: "Feb 14, 2026", icon: FileText, path: "/Users/m2creative/.gemini/antigravity/brain/00142522-0028-4c8c-808a-3d7d588a61f4/unpaid_work_documentation.md" },
  { id: 4, title: "ROI Efficiency Calculator", date: "Feb 14, 2026", icon: FileText, path: "/Users/m2creative/.gemini/antigravity/brain/00142522-0028-4c8c-808a-3d7d588a61f4/snpa_efficiency_calculator.md" },
];

export function ResearchVault() {
  type Report = typeof reports[0];
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  console.log(selectedReport); // Temporary usage to fix unused warning

  return (
    <GlassCard className="border-[var(--m2-gold)]/20 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--m2-gold)]/10 flex items-center justify-center">
             <Search className="w-5 h-5 text-[var(--m2-gold)]" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-outfit text-white">Strategic Research Vault</h3>
            <p className="text-xs text-[var(--m2-text-muted)]">Sovereign Knowledge Infrastructure</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <div 
            key={report.id}
            onClick={() => setSelectedReport(report)}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--m2-gold)]/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <report.icon className="w-5 h-5 text-[var(--m2-gold)]" />
              <div>
                <p className="text-sm font-bold text-white group-hover:text-[var(--m2-gold)] transition-colors">{report.title}</p>
                <p className="text-[10px] text-[var(--m2-text-muted)] uppercase tracking-wider">{report.date}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[var(--m2-gold)] transition-all" />
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
