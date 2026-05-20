"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import M2Logo from "./M2Logo";

export function Header() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 md:px-8 py-5 border-b sticky top-0 z-50 transition-colors bg-[#050505]/80 backdrop-blur-3xl border-white/10">
      <div className="flex items-center gap-4">
        {/* Mobile Spacer (for floating menu button) */}
        <div className="w-12 md:hidden shrink-0" />
        
        <div className="hidden sm:flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center">
            <M2Logo className="w-10 h-10 fill-[#D4AF37]" fill="#D4AF37" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white font-outfit">M2 NEXUS</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Sovereign Intelligence OS</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <Link 
          aria-label="Launch M2 Orbit AI Console" 
          href="/orbit" 
          className="hidden xs:block px-4 py-1.5 rounded-full text-[10px] font-bold font-mono border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.1)]"
        >
          [ LAUNCH M2 ORBIT ]
        </Link>
        <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          System Online
        </div>
        <div className="text-xs font-mono flex items-center gap-4 text-[#D4AF37]/70">
          <span className="hidden sm:inline"><Clock className="w-3.5 h-3.5 inline mr-1.5" />{time}</span>
          <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-full border border-[#D4AF37]/40" } }} />
        </div>
      </div>
    </header>
  );
}
