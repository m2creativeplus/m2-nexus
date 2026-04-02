"use client";
import { useState } from "react";
import { Landmark, Activity } from "lucide-react";
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

export default function Dashboard() {
  const [avatarStatus, setAvatarStatus] = useState<'idle' | 'generating' | 'ready'>('ready');
  const [avatarVideo, setAvatarVideo] = useState('/avatars/latest_briefing.mp4');
  const [avatarPoster, setAvatarPoster] = useState('/branding/mahmoud_awaleh.jpg');
  const [avatarCaption, setAvatarCaption] = useState('Nexus system initialized. Monitoring Guurti and SNPA deployment pipelines.');

  const handleAvatarCommand = async (text: string) => {
    setAvatarStatus('generating');
    setAvatarCaption(text);
    
    try {
      const res = await fetch('/api/did/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, persona: 'mahmoud' })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      const poll = async () => {
        const pollRes = await fetch(`/api/did/poll/${data.id}`);
        const pollData = await pollRes.json();
        
        if (pollData.status === 'done') {
          setAvatarVideo(pollData.result_url);
          setAvatarStatus('ready');
        } else if (pollData.status === 'error') {
          throw new Error("D-ID generation failed");
        } else {
          setTimeout(poll, 2000);
        }
      };
      poll();
    } catch (err) {
      console.error(err);
      setAvatarStatus('ready');
      setAvatarCaption("Error generating intelligence briefing.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--m2-void)]">
      <main id="main-content" className="flex-1 p-6 md:p-12 xl:p-16 max-w-[1440px] mx-auto w-full space-y-[5rem] focus:outline-none" tabIndex={-1}>
        
        <M2BannerGolden title="M2 NEXUS INTELLIGENCE" subtitle="Strategic Command & Autonomous Operations" />
        
        {/* BRAND HERO / POSTER SECTION */}
        <section className="relative overflow-hidden rounded-3xl">
          <GoldMotionPoster />
           <div className="absolute top-12 left-12 z-20">
             <Heading1>PLATFORM CORE</Heading1>
             <p className="text-[var(--m2-gold)] font-mono tracking-widest uppercase mt-2">Sovereign Architecture</p>
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AvatarSpeaker 
            title="M2 Sovereign Intelligence" 
            caption={avatarCaption}
            persona="mahmoud"
            status={avatarStatus}
            videoUrl={avatarVideo}
            poster={avatarPoster}
          />
          <AvatarControl 
            onSendMessage={handleAvatarCommand}
            isGenerating={avatarStatus === 'generating'}
          />
        </div>
        
        <QuickStats />
        
        {/* INTERACTIVE DATA MATRIX */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-outfit text-white">System Intelligence Grid</h2>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--m2-green)] animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-[var(--m2-text-muted)]">Live Flux</span>
            </div>
          </div>
          <DataGridMatrix />
        </section>

        <SystemMonitor />
        
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3"><ProjectHub /></div>
          <div className="xl:col-span-2"><AgentCenter /></div>
        </div>
        
        <PortfolioMatrix />

        {/* ACTIVE MISSION: SNPA INTELLIGENCE HUB */}
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--m2-gold)] to-amber-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <GlassCard className="relative bg-[var(--m2-surface)] border-[var(--m2-gold)]/30 overflow-hidden flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-[var(--m2-gold)]/30 flex items-center justify-center bg-black">
                  <img src="/branding/somaliland_coat_of_arms.png" alt="Somaliland Coat of Arms" className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold font-outfit text-white">SNPA Strategic Intelligence</h2>
                  <p className="text-[var(--m2-gold)] text-xs tracking-[0.2em] font-mono uppercase">Republic of Somaliland — Priority One</p>
                </div>
              </div>
              <p className="text-[var(--m2-text-secondary)] text-lg leading-relaxed max-w-2xl">
                Integrated Strategic Hub for the Somaliland National Printing Agency. Deploying institutional modernization, OEE scaling, and sovereign negotiation frameworks for Chairman Abdirahman Abees.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <a 
                  href="/snpa-intelligence" 
                  className="px-8 py-3 rounded-md font-bold text-black transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                  style={{ background: "linear-gradient(135deg, var(--m2-gold), #f59e0b)" }}
                >
                  <Activity className="w-4 h-4" /> Engage Mission Hub
                </a>
                <button 
                  className="px-6 py-3 rounded-md border border-[var(--m2-gold)] text-[var(--m2-gold)] text-sm font-bold uppercase tracking-widest hover:bg-[var(--m2-gold)]/10 transition-colors"
                >
                  View $56.5K Unpaid Document
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/3 aspect-video bg-black/50 rounded-2xl border border-[var(--m2-gold)]/20 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--m2-gold)_0%,_transparent_70%)] opacity-10 animate-pulse"></div>
               <M2Logo className="w-32 h-32 opacity-20" fill="#D4AF37" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold font-mono text-white tracking-widest">FLUX</p>
                    <p className="text-[10px] text-[var(--m2-gold)] uppercase tracking-widest mt-1">Intelligence Syncing</p>
                  </div>
               </div>
            </div>
          </GlassCard>
        </section>

        <ContentMatrix />
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
