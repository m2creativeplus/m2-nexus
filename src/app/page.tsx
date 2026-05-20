"use client";
import { useState } from "react";
import { Activity, Code2, Zap, ExternalLink } from "lucide-react";
import Link from "next/link";
import { QuickStats } from "@/components/QuickStats";
import { SystemMonitor } from "@/components/SystemMonitor";
import { ProjectHub } from "@/components/ProjectHub";
import { AgentCenter } from "@/components/AgentCenter";
import { ContentMatrix } from "@/components/ContentMatrix";
import { AvatarSpeaker } from "@/components/AvatarSpeaker";
import { PortfolioMatrix } from "@/components/PortfolioMatrix";
import { AvatarControl } from "@/components/AvatarControl";
import M2Logo from "@/components/M2Logo";
import { GoldMotionPoster, DataGridMatrix, Heading1, GlassCard } from "@/components/ui/M2BrandUI";
import { M2BannerGolden } from "@/components/M2Banners";
import { SovereignMonitor } from "@/components/SovereignMonitor";
import { InternalAuditMonitor } from "@/components/InternalAuditMonitor";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--m2-void)]">
      <main id="main-content" className="flex-1 p-6 md:p-12 xl:p-16 max-w-[1440px] mx-auto w-full space-y-12 focus:outline-none" tabIndex={-1}>
        
        <M2BannerGolden title="M2 NEXUS" subtitle="Sovereign AI Operating System — Strategic Command" />
        
        {/* BRAND HERO / POSTER SECTION */}
        <section className="relative overflow-hidden rounded-3xl h-[400px]">
          <GoldMotionPoster />
           <div className="absolute top-12 left-12 z-20">
             <Heading1>STRATEGIC<br />COMMAND</Heading1>
             <p className="text-[var(--m2-gold)] font-mono tracking-widest uppercase mt-2">Active Sovereign Session</p>
           </div>
        </section>

        <QuickStats />

        {/* INTERACTIVE DATA MATRIX & SOVEREIGN MONITOR */}
        <section className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-outfit text-white">System Intelligence Grid</h2>
              <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--m2-green)] animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-[var(--m2-text-muted)]">Live Flux</span>
              </div>
            </div>
            <DataGridMatrix />
          </div>
          <div className="xl:col-span-1">
            <SovereignMonitor />
          </div>
          <div className="xl:col-span-1">
            <InternalAuditMonitor />
          </div>
        </section>

        <SystemMonitor />
        
        {/* ACTIVE MISSION: SNPA INTELLIGENCE HUB */}
        <section className="relative group pt-12 border-t border-white/5">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold font-outfit text-white">Priority Missions</h2>
            <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-bold tracking-widest uppercase border border-yellow-500/20">Active Deployments</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SNPA MISSION */}
            <div className="relative group/card">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--m2-gold)] to-amber-600 rounded-3xl blur opacity-10 group-hover/card:opacity-20 transition duration-1000"></div>
              <GlassCard className="relative bg-[var(--m2-surface)] border-[var(--m2-gold)]/30 overflow-hidden flex flex-col items-start gap-6 p-8 h-full">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-[var(--m2-gold)]/30 flex items-center justify-center bg-black">
                    <img src="/branding/somaliland_coat_of_arms.png" alt="Somaliland Coat of Arms" className="w-8 h-8 object-contain" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-outfit text-white">SNPA Strategic</h3>
                    <p className="text-[var(--m2-gold)] text-[10px] tracking-widest font-mono uppercase">Republic of Somaliland</p>
                  </div>
                </div>
                <p className="text-[var(--m2-text-secondary)] text-sm leading-relaxed">
                  Integrated Strategic Hub for the Somaliland National Printing Agency. Institutional modernization and sovereign frameworks.
                </p>
                <div className="flex gap-4 mt-auto w-full">
                  <Link 
                    href="/snpa-intelligence" 
                    className="flex-1 px-4 py-2 rounded-md font-bold text-black text-xs text-center transition-all hover:scale-105 active:scale-95"
                    style={{ background: "linear-gradient(135deg, var(--m2-gold), #f59e0b)" }}
                  >
                    Engage Mission
                  </Link>
                </div>
              </GlassCard>
            </div>

            {/* MORA MISSION */}
            <div className="relative group/card">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-[var(--m2-gold)] rounded-3xl blur opacity-10 group-hover/card:opacity-20 transition duration-1000"></div>
              <GlassCard className="relative bg-[var(--m2-surface)] border-emerald-500/30 overflow-hidden flex flex-col items-start gap-6 p-8 h-full">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-emerald-500/30 flex items-center justify-center bg-black">
                    <img src="/branding/mora_logo_placeholder.png" alt="MORA Logo" className="w-8 h-8 object-contain" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-outfit text-white">MORA Intelligence</h3>
                    <p className="text-emerald-500 text-[10px] tracking-widest font-mono uppercase">Ministry of Religious Affairs</p>
                  </div>
                </div>
                <p className="text-[var(--m2-text-secondary)] text-sm leading-relaxed">
                  Sovereign Faith Infrastructure: Digital Waqf Registry, Kaltirsi Hijri Integration, and National e-Deen Portal.
                </p>
                <div className="flex gap-4 mt-auto w-full">
                  <Link 
                    href="/mora-intelligence" 
                    className="flex-1 px-4 py-2 rounded-md font-bold text-white text-xs text-center transition-all hover:scale-105 active:scale-95 border border-emerald-500/50 bg-emerald-500/10"
                  >
                    Deploy Portal
                  </Link>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

      </main>
      
      <footer className="px-8 py-12 flex flex-col items-center gap-6 border-t border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.2)]">
        <M2Logo className="w-16 h-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-700" fill="#D4AF37" />
        <div className="text-center space-y-2">
          <p className="text-[10px] tracking-widest uppercase" style={{ color: "var(--m2-text-muted)" }}>
            M2 NEXUS v2.0 — Sovereign AI Operating System
          </p>
          <p className="text-[8px] tracking-widest uppercase opacity-30">
            Powered by Gemini 2.0 Flash · M2 Creative & Consulting · Hargeisa, Republic of Somaliland · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
