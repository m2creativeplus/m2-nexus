"use client";
import { ProjectHub } from "@/components/ProjectHub";
import { QuickStats } from "@/components/QuickStats";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6">
        <div className="flex flex-col gap-2 mb-2">
          <h1 className="text-3xl font-bold tracking-tighter gold-text uppercase">PROJECT REGISTRY</h1>
          <p className="text-sm text-zinc-400">
            Unified command view across all M2 Creative deployments — live Vercel status, git health, and commit tracking.
          </p>
        </div>
        <QuickStats />
        <ProjectHub />
      </main>
    </div>
  );
}
