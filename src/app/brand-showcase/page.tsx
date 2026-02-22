"use client";

import { motion } from "framer-motion";
import M2Logo from "@/components/M2Logo";
import { HeroSection, PricingTable, OnboardingLogin, FeatureCard, Subheading, Heading1, MobileBrandHeader, GoldMotionPoster, SettingsSidebarUI, DataGridMatrix } from "@/components/ui/M2BrandUI";
import { Server, Activity, ArrowRight, Shield, Zap } from "lucide-react";

export default function BrandShowcase() {
  return (
    <div className="min-h-screen bg-[var(--m2-void)] text-white overflow-x-hidden pb-32">
      
      {/* 3D LOGO ANIMATION HERO */}
      <section className="relative h-screen flex flex-col items-center justify-center p-8 border-b border-[rgba(255,255,255,0.05)]">
        <motion.div
          animate={{ rotateY: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="relative z-10 perspective-[1000px]"
        >
          <M2Logo className="w-64 h-64 drop-shadow-[0_0_50px_rgba(212,175,55,0.4)]" fill="#D4AF37" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-20 text-center"
        >
          <Heading1>The M2 Standard.</Heading1>
          <Subheading>Live Design System & 3D Motion Protocol.</Subheading>
        </motion.div>
      </section>

      {/* MOBILE BRAND COMPONENT */}
      <section className="max-w-md mx-auto py-24">
         <div className="text-center mb-12"><h2 className="text-2xl font-bold font-outfit text-white">Mobile Header Component</h2></div>
         <div className="border border-[var(--m2-gold)]/20 rounded-3xl overflow-hidden h-[600px] bg-black shadow-2xl relative">
             <MobileBrandHeader />
             <div className="p-8 mt-12 opacity-50"><Subheading>Mobile Content Area</Subheading></div>
         </div>
      </section>

      {/* DASHBOARD GRID MATRIX */}
      <section className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-outfit text-[var(--m2-gold)]">INTELLIGENCE GRID (WEB DASHBOARD)</h2>
        </div>
        <div className="flex gap-8 w-full">
           <div className="hidden lg:block"><SettingsSidebarUI /></div>
           <DataGridMatrix />
        </div>
      </section>

      {/* MOTION GRAPHIC POSTERS */}
      <section className="max-w-7xl mx-auto px-4 py-24">
         <div className="text-center mb-16"><h2 className="text-3xl font-bold font-outfit text-white">CSS Motion Poster / Banners</h2></div>
         <GoldMotionPoster />
      </section>

      {/* ONBOARDING & LOGIN */}
      <section className="py-24 border-y border-[rgba(255,255,255,0.05)] bg-gradient-to-b from-[var(--m2-void)] to-[#0c0c0e]">
       <OnboardingLogin />
      </section>

      {/* PRICING & TIERS */}
      <section className="max-w-7xl mx-auto px-4 py-32">
        <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold font-outfit">PLATFORM ACCESS</h2>
            <Subheading>Strategic Tiers for Operators.</Subheading>
        </div>
        <PricingTable />
      </section>

      {/* FOOTER CTA */}
      <section className="relative overflow-hidden py-32 px-4 mt-24">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
           <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
             <M2Logo className="w-[800px] h-[800px]" fill="#D4AF37" />
           </motion.div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center border-t border-[rgba(255,255,255,0.05)] pt-12">
          <M2Logo className="w-16 h-16 mx-auto mb-6" fill="#D4AF37" />
          <Heading1>Initialize Autonomy.</Heading1>
          <button className="mt-12 px-8 py-4 rounded-full font-bold text-black uppercase tracking-widest text-sm hover:scale-105 transition-transform flex items-center gap-3 mx-auto shadow-[0_0_40px_rgba(212,175,55,0.3)]" style={{ background: "linear-gradient(135deg, var(--m2-gold), #eab308)" }}>
            Launch System <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
