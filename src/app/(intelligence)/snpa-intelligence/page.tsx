"use client";

import React from "react";
import { Heading1, GlassCard, ButtonPrimary } from "@/components/ui/M2BrandUI";
import { M2BannerGolden } from "@/components/M2Banners";
import { ResearchVault, NegotiationCommand, ROIMatrix } from "@/components/snpa";

export default function SNPAIntelligenceHub() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--m2-void)] p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-12">
      <M2BannerGolden 
        title="SNPA STRATEGIC INTELLIGENCE" 
        subtitle="National Printing Agency Modernization & Negotiation Pipeline" 
      />

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <NegotiationCommand />
        <ROIMatrix />
      </section>

      <section className="w-full">
        <ResearchVault />
      </section>

      <footer className="pt-12 text-center">
        <p className="text-[10px] tracking-widest uppercase text-[var(--m2-text-muted)]">
          Sovereign Intelligence Hub — M2 Creative Deployment
        </p>
      </footer>
    </div>
  );
}
