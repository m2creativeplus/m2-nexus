"use client";
import { useState } from "react";
import { Header } from "@/components/Header";
import { QuickStats } from "@/components/QuickStats";
import { SystemMonitor } from "@/components/SystemMonitor";
import { ProjectHub } from "@/components/ProjectHub";
import { AgentCenter } from "@/components/AgentCenter";
import { ContentMatrix } from "@/components/ContentMatrix";
import { AvatarSpeaker } from "@/components/AvatarSpeaker";
import { PortfolioMatrix } from "@/components/PortfolioMatrix";
import { AvatarControl } from "@/components/AvatarControl";

export default function Dashboard() {
  const [avatarStatus, setAvatarStatus] = useState<'idle' | 'generating' | 'ready'>('ready');
  const [avatarVideo, setAvatarVideo] = useState('/avatars/latest_briefing.mp4');
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AvatarSpeaker 
            title="M2 Sovereign Intelligence" 
            caption={avatarCaption}
            persona="mahmoud"
            status={avatarStatus}
            videoUrl={avatarVideo}
          />
          <AvatarControl 
            onSendMessage={handleAvatarCommand}
            isGenerating={avatarStatus === 'generating'}
          />
        </div>
        
        <QuickStats />
        <SystemMonitor />
        
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3"><ProjectHub /></div>
          <div className="xl:col-span-2"><AgentCenter /></div>
        </div>
        
        <PortfolioMatrix />
        <ContentMatrix />
      </main>
      
      <footer className="px-8 py-4 text-center text-[10px]" style={{ borderTop: "1px solid var(--m2-border)", color: "var(--m2-text-muted)" }}>
        M2 NEXUS v2.0 — Powered by Gemini 2.0 Flash · M2 Creative & Consulting · Hargeisa, Somaliland · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
