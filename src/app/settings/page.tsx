"use client";
import { Settings, Shield, Cloud, Bell, Database, Key, Monitor, Palette } from "lucide-react";
import { useState } from "react";

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${on ? 'bg-[#D4AF37]' : 'bg-zinc-700'}`}>
      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [sovereign, setSovereign] = useState(true);
  const [cloud, setCloud] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const sections = [
    {
      title: "System",
      icon: Monitor,
      items: [
        { label: "Sovereign Mode", desc: "Enforce M2 Zero-Trust Workflow Protocol across all nodes.", on: sovereign, toggle: () => setSovereign(!sovereign), icon: Shield },
        { label: "Dark Interface", desc: "Void & Gold aesthetic — the M2 standard.", on: darkMode, toggle: () => setDarkMode(!darkMode), icon: Palette },
      ],
    },
    {
      title: "Data & Sync",
      icon: Database,
      items: [
        { label: "Cloud Mirroring", desc: "Real-time synchronization with Google Drive backup.", on: cloud, toggle: () => setCloud(!cloud), icon: Cloud },
        { label: "Push Notifications", desc: "Get alerts for audit failures, deployment issues, and agent errors.", on: notifications, toggle: () => setNotifications(!notifications), icon: Bell },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-8">
        <div className="flex flex-col gap-2 mb-2">
          <h1 className="text-3xl font-bold tracking-tighter gold-text uppercase flex items-center gap-3">
            <Settings className="w-8 h-8" /> SETTINGS
          </h1>
          <p className="text-sm text-zinc-400">Global configuration for the M2 Nexus Sovereign OS environment.</p>
        </div>

        <div className="max-w-2xl space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-4 flex items-center gap-2">
                <section.icon className="w-3.5 h-3.5" /> {section.title}
              </h2>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.label} className="glass-card p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{item.label}</h4>
                        <p className="text-xs text-zinc-500">{item.desc}</p>
                      </div>
                    </div>
                    <Toggle on={item.on} onToggle={item.toggle} />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* API Keys Section */}
          <div>
            <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-4 flex items-center gap-2">
              <Key className="w-3.5 h-3.5" /> API Keys
            </h2>
            <div className="glass-card p-5 space-y-4">
              {[
                { name: "GEMINI_API_KEY", status: "configured" },
                { name: "CLERK_SECRET_KEY", status: "configured" },
                { name: "CONVEX_DEPLOYMENT", status: "configured" },
                { name: "D_ID_API_KEY", status: "missing" },
              ].map((key) => (
                <div key={key.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-xs font-mono text-zinc-400">{key.name}</span>
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded ${
                    key.status === 'configured' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {key.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
