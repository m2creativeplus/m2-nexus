"use client";

import { useState, useEffect } from "react";
import { Activity } from "lucide-react";

export default function SovereignBuilderPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  // You can change this to the final Vercel URL once successfully deployed
  const SOVEREIGN_URL = "https://m2-sovereign-engine-gujetc8rq-manaalm2cawaale-3121s-projects.vercel.app";
  const EMBED_URL = `${SOVEREIGN_URL}/embed/nexus-global`;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Allow specific instances
      if (event.origin !== SOVEREIGN_URL && !event.origin.startsWith("http://localhost:")) return;
      if (event.data?.type === "READY") {
        setIsLoaded(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [SOVEREIGN_URL]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] p-2 md:p-6 lg:p-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">VIBECODING AGENT</h1>
          <p className="text-[#D4AF37] font-mono tracking-widest uppercase mt-2 text-xs">
            Sovereign Engine Integration
          </p>
        </div>
        <div className="flex gap-2">
          <span className={`w-2 h-2 rounded-full ${isLoaded ? 'bg-green-500 animate-pulse' : 'bg-amber-500 animate-bounce'}`} />
          <span className="text-[10px] uppercase tracking-widest text-slate-500">
            {isLoaded ? "Link Established" : "Connecting..."}
          </span>
        </div>
      </div>

      {/* Main Integration Wrapper */}
      <div className="flex-1 relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10 backdrop-blur-sm">
             <Activity className="w-8 h-8 text-[#D4AF37] animate-spin mb-4" />
             <p className="text-[#D4AF37] font-mono uppercase tracking-widest text-sm">Booting Sovereign Engine...</p>
             <p className="text-slate-500 text-xs mt-2 max-w-sm text-center">Attempting to establish cross-origin connection with {SOVEREIGN_URL}</p>
          </div>
        )}

        <iframe 
          src={EMBED_URL}
          className="w-full h-full border-none bg-slate-950"
          onLoad={() => setIsLoaded(true)}
          title="M2 Sovereign Builder Embed"
          allow="clipboard-write; clipboard-read"
        />
      </div>

    </div>
  );
}
