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
    <header className="flex items-center justify-between px-8 py-5 border-b sticky top-0 z-50 transition-colors" style={{ borderColor: "var(--m2-border)", background: "rgba(15,23,42,0.8)", backdropFilter: "blur(20px)" }}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center">
          <M2Logo className="w-10 h-10 fill-[var(--m2-gold)]" fill="#D4AF37" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight gold-text" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>M2 NEXUS</h1>
          <p className="text-xs" style={{ color: "var(--m2-text-muted)" }}>Sovereign AI Dashboard · Gemini 2.0 Powered</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Link aria-label="Launch M2 Orbit AI Console" href="/orbit" className="px-4 py-1.5 rounded-full text-xs font-bold font-mono border border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
          [ LAUNCH M2 ORBIT ]
        </Link>
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--m2-text-secondary)" }}>
          <span className="w-2 h-2 rounded-full pulse-live" style={{ background: "var(--m2-green)" }} />
          System Online
        </div>
        <div className="text-sm font-mono flex items-center gap-4" style={{ color: "var(--m2-gold-dim)" }}>
          <span><Clock className="w-3.5 h-3.5 inline mr-1.5" />{time}</span>
          <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-full border border-[var(--m2-gold)] shadow-[0_0_10px_rgba(234,179,8,0.2)]" } }} />
        </div>
      </div>
    </header>
  );
}
