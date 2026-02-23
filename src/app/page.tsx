import { Header } from "@/components/Header";
import { QuickStats } from "@/components/QuickStats";
import { SystemMonitor } from "@/components/SystemMonitor";
import { ProjectHub } from "@/components/ProjectHub";
import { AgentCenter } from "@/components/AgentCenter";
import { ContentMatrix } from "@/components/ContentMatrix";
import { AvatarSpeaker } from "@/components/AvatarSpeaker";
import { PortfolioMatrix } from "@/components/PortfolioMatrix";

/**
 * M2 NEXUS Dashboard
 * ==================
 * Refactored to maximum DRY architecture. All logic and layout nodes 
 * are deferred to the localized component library.
 */
export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6">
        <div className="mb-6">
          <AvatarSpeaker 
            title="M2 Sovereign Intelligence" 
            caption="Nexus system initialized. Monitoring Guurti and SNPA deployment pipelines."
            persona="m2-creative"
            status="ready"
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
