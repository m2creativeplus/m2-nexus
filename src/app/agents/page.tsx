"use client";
import { AgentCenter } from "@/components/AgentCenter";

export default function AgentsPage() {
  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6">
        <div className="flex flex-col gap-2 mb-2">
          <h1 className="text-3xl font-bold tracking-tighter gold-text uppercase">AI AGENTS</h1>
          <p className="text-sm text-zinc-400">
            Sovereign intelligence units — Architect · Security Auditor · UI Vibe · Strategy · Git Guardian · Deploy Agent
          </p>
        </div>
        <AgentCenter />
      </main>
    </div>
  );
}
