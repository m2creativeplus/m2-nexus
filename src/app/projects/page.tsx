"use client";
import { Header } from "@/components/Header";
import { ProjectHub } from "@/components/ProjectHub";
import { QuickStats } from "@/components/QuickStats";
import { SystemStatusBar } from "@/components/SystemStatusBar";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6">
        <div className="flex flex-col gap-2 mb-2">
          <h1 className="text-3xl font-bold tracking-tighter gold-text uppercase">PROJECT REGISTRY</h1>
          <p className="text-sm text-zinc-400">
            Unified command view across all M2 Creative deployments — live Vercel status, git health, and commit tracking.
          </p>
        </div>
        <SystemStatusBar />
        <QuickStats />
        <ProjectHub />
      </main>
      <footer className="px-8 py-4 text-center text-[10px]" style={{ borderTop: "1px solid var(--m2-border)", color: "var(--m2-text-muted)" }}>
        M2 NEXUS v2.0 — Project Registry · Powered by Convex · M2 Creative &amp; Consulting · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
