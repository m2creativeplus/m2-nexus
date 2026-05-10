"use client";
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

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Local AI", href: "/lm-studio", icon: Cpu, badge: "LOCAL" },
  { label: "AI Agents", href: "/agents", icon: Users },
  { label: "Project Registry", href: "/projects", icon: FolderOpen },
  { label: "n8n Workflows", href: "/automations", icon: Zap, badge: "4,343" },
  { label: "Campaign Intelligence", href: "/campaign-intelligence", icon: BarChart3 },
  { label: "Moving Ads", href: "/moving-ads", icon: Truck },
  { label: "Analytics", href: "/analytics", icon: PieChart },
  { label: "System Logs", href: "/system-logs", icon: FileText },
  { label: "SNPA Intelligence", href: "/snpa-intelligence", icon: Brain },
  { label: "GeoMind Intelligence", href: "/geomind", icon: Globe, badge: "NEW" },
  { label: "Narrative Monitor", href: "/narrative-monitor", icon: Shield, badge: "AI" },
  { label: "Brand Showcase", href: "/brand-showcase", icon: CircleDot },
  { label: "SEO Audit", href: "/seo-audit", icon: Search },
  { label: "Component Library", href: "/library", icon: Network },
  { label: "Settings", href: "/settings", icon: Settings },
];

const adminItems = [
  { label: "Super Admin", href: "/admin", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] h-screen fixed left-0 top-0 glass-card rounded-none border-y-0 border-l-0 border-r border-white/10 flex flex-col z-[60]">
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <M2Logo className="w-8 h-8 fill-[var(--m2-gold)]" fill="#D4AF37" />
        <div>
          <h1 className="text-lg font-bold tracking-tighter gold-text leading-none">M2 NEXUS</h1>
          <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-1">Sovereign OS</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
                isActive 
                ? "bg-yellow-500/10 text-yellow-500 border-l-2 border-yellow-500 shadow-[inset_0_0_20px_rgba(234,179,8,0.05)]" 
                : "text-zinc-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className={`w-4 h-4 transition-colors ${isActive ? "text-yellow-500" : "text-zinc-500 group-hover:text-white"}`} />
              {item.label}
              {(item as unknown).badge && !isActive && (
                <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500/60 border border-yellow-500/20">
                  {(item as unknown).badge}
                </span>
              )}
              {isActive && (
                <div className="ml-auto">
                  <CircleDot className="w-2 h-2 text-yellow-500 animate-pulse" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Admin Section */}
      <div className="px-4 pb-2">
        <div className="border-t border-white/5 pt-3 space-y-1">
          <p className="text-[9px] text-zinc-700 uppercase tracking-widest font-bold px-4 pb-1">Admin</p>
          {adminItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? "bg-amber-500/15 text-amber-400 border-l-2 border-amber-500 shadow-[inset_0_0_20px_rgba(245,158,11,0.08)]"
                    : "text-zinc-600 hover:bg-white/5 hover:text-amber-400"
                }`}
              >
                <item.icon className={`w-4 h-4 transition-colors ${isActive ? "text-amber-400" : "text-zinc-600 group-hover:text-amber-400"}`} />
                {item.label}
                {isActive && <div className="ml-auto"><CircleDot className="w-2 h-2 text-amber-400 animate-pulse" /></div>}
              </Link>
            );
          })}
        </div>
      </div>

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
  );
}
