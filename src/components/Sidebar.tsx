"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Zap, 
  BarChart3, 
  Truck, 
  PieChart, 
  FileText, 
  Settings,
  CircleDot,
  Cpu,
  Brain,
  FolderOpen,
  Shield,
  Network,
  Globe,
  Search
} from "lucide-react";
import M2Logo from "./M2Logo";

const coreItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Project Registry", href: "/projects", icon: FolderOpen },
  { label: "n8n Workflows", href: "/automations", icon: Zap, badge: "4,343" },
  { label: "Analytics", href: "/analytics", icon: PieChart },
];

const intelligenceItems = [
  { label: "Narrative Monitor", href: "/narrative-monitor", icon: Shield, badge: "AI" },
  { label: "GeoMind Intelligence", href: "/geomind", icon: Globe, badge: "NEW" },
  { label: "SNPA Intelligence", href: "/snpa-intelligence", icon: Brain },
  { label: "Campaign Intelligence", href: "/campaign-intelligence", icon: BarChart3 },
];

const labItems = [
  { label: "Local AI", href: "/lm-studio", icon: Cpu, badge: "LOCAL" },
  { label: "AI Agents", href: "/agents", icon: Users },
  { label: "Moving Ads", href: "/moving-ads", icon: Truck },
  { label: "Brand Showcase", href: "/brand-showcase", icon: CircleDot },
  { label: "Component Library", href: "/library", icon: Network },
];

const systemItems = [
  { label: "SEO Audit", href: "/seo-audit", icon: Search },
  { label: "System Logs", href: "/system-logs", icon: FileText },
  { label: "Settings", href: "/settings", icon: Settings },
];

const adminItems = [
  { label: "Super Admin", href: "/admin", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const renderNavSection = (title: string, items: typeof coreItems, admin = false) => (
    <div className="mb-6 last:mb-0">
      <p className={`text-[9px] uppercase tracking-[0.2em] font-bold px-4 pb-2 ${admin ? "text-amber-500/60" : "text-zinc-600"}`}>
        {title}
      </p>
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const activeClass = admin 
            ? "bg-amber-500/15 text-amber-400 border-l-2 border-amber-500 shadow-[inset_0_0_20px_rgba(245,158,11,0.08)]"
            : "bg-yellow-500/10 text-yellow-500 border-l-2 border-yellow-500 shadow-[inset_0_0_20px_rgba(234,179,8,0.05)]";
          
          const inactiveClass = admin
            ? "text-zinc-600 hover:bg-white/5 hover:text-amber-400"
            : "text-zinc-500 hover:bg-white/5 hover:text-white";

          const iconClass = isActive 
            ? (admin ? "text-amber-400" : "text-yellow-500") 
            : (admin ? "text-zinc-600 group-hover:text-amber-400" : "text-zinc-500 group-hover:text-white");

          return (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-medium transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
                isActive ? activeClass : inactiveClass
              }`}
            >
              <item.icon className={`w-3.5 h-3.5 transition-colors ${iconClass}`} />
              <span className="truncate">{item.label}</span>
              {(item as any).badge && !isActive && (
                <span className="ml-auto text-[8px] font-mono px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500/60 border border-yellow-500/20">
                  {(item as any).badge}
                </span>
              )}
              {isActive && (
                <div className="ml-auto">
                  <CircleDot className={`w-2 h-2 animate-pulse ${admin ? "text-amber-400" : "text-yellow-500"}`} />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[70] w-10 h-10 rounded-xl bg-zinc-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-yellow-500"
      >
        <LayoutDashboard className="w-5 h-5" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`w-[260px] h-screen fixed left-0 top-0 glass-card rounded-none border-y-0 border-l-0 border-r border-white/10 flex flex-col z-[60] transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full invisible lg:visible"}`}>
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <M2Logo className="w-8 h-8 fill-[var(--m2-gold)]" fill="#D4AF37" />
          <div>
            <h1 className="text-lg font-bold tracking-tighter gold-text leading-none">M2 NEXUS</h1>
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-1">Sovereign OS</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto scrollbar-hide">
          {renderNavSection("Core Operations", coreItems)}
          {renderNavSection("Intelligence", intelligenceItems)}
          {renderNavSection("Innovation Labs", labItems)}
          {renderNavSection("Governance", systemItems)}
          {renderNavSection("Administration", adminItems, true)}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-[10px] font-bold text-yellow-500">
              MA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-white truncate">Mohamoud Awaleh</p>
              <p className="text-[9px] text-zinc-500 uppercase tracking-tighter">Strategic Lead</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
