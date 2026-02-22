import React from "react";
import M2Logo from "../M2Logo";

// ==========================================
// 1. BUTTONS
// ==========================================

export function ButtonPrimary({ children, onClick, disabled }: any) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className="px-6 py-2 rounded-md font-semibold text-zinc-950 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
      style={{ background: "linear-gradient(135deg, var(--m2-gold), #f59e0b)" }}
    >
      {children}
    </button>
  );
}

export function ButtonSecondary({ children, onClick, disabled }: any) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className="px-6 py-2 rounded-md font-semibold transition-all hover:bg-[var(--m2-gold)] hover:text-zinc-950 hover:border-transparent active:scale-95 disabled:opacity-50"
      style={{ border: "1px solid var(--m2-gold)", color: "var(--m2-gold)" }}
    >
      {children}
    </button>
  );
}

// ==========================================
// 2. CARDS & CONTAINERS
// ==========================================

export function GlassCard({ children, className = "" }: any) {
  return (
    <div className={`rounded-xl p-6 ${className}`}
         style={{ 
           background: "rgba(24, 24, 27, 0.4)", 
           backdropFilter: "blur(12px)", 
           border: "1px solid rgba(255, 255, 255, 0.05)",
           boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)"
         }}>
      {children}
    </div>
  );
}

export function FeatureCard({ title, description, icon: Icon }: any) {
  return (
    <GlassCard className="flex flex-col gap-4 hover:border-[var(--m2-gold)] transition-colors group">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[rgba(212,175,55,0.1)] group-hover:bg-[rgba(212,175,55,0.2)] transition-colors">
        <Icon className="w-6 h-6 outline-none" style={{ color: "var(--m2-gold)" }} />
      </div>
      <div>
        <h3 className="font-bold text-lg text-white font-outfit">{title}</h3>
        <p className="text-sm mt-1" style={{ color: "var(--m2-text-muted)" }}>{description}</p>
      </div>
    </GlassCard>
  );
}

// ==========================================
// 3. TYPOGRAPHY & HEADINGS
// ==========================================

export function Heading1({ children }: any) {
  return (
    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter" style={{ fontFamily: "var(--font-outfit), sans-serif", color: "white" }}>
      {children}
    </h1>
  );
}

export function Subheading({ children }: any) {
  return (
    <p className="text-lg md:text-xl font-medium" style={{ color: "var(--m2-text-secondary)" }}>
      {children}
    </p>
  );
}

// ==========================================
// 4. FORMS & INPUTS
// ==========================================

export function InputField({ label, type = "text", placeholder }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-[var(--m2-text-muted)]">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder} 
        className="px-4 py-2 rounded-md bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-white focus:outline-none focus:border-[var(--m2-gold)] transition-colors"
      />
    </div>
  );
}

// ==========================================
// 5. SECTIONS / VIEWS
// ==========================================

export function HeroSection({ title, subtitle, ctaText }: any) {
  return (
    <section className="flex flex-col items-center justify-center text-center py-32 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--m2-gold)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
      <M2Logo className="w-24 h-24 mb-8 z-10" fill="#D4AF37" />
      <div className="z-10 max-w-3xl space-y-6">
        <Heading1>{title}</Heading1>
        <Subheading>{subtitle}</Subheading>
        <div className="pt-4 flex items-center justify-center gap-4">
          <ButtonPrimary>{ctaText}</ButtonPrimary>
          <ButtonSecondary>System Audit</ButtonSecondary>
        </div>
      </div>
    </section>
  );
}

export function PricingTable() {
  const plans = [
    { name: "TACTICAL", price: "Waitlist", features: ["1 AI Agent", "Basic Dashboard", "Standard Support"] },
    { name: "STRATEGIC (M2 COMMAND)", price: "Invite Only", features: ["Unlimited Agents", "Convex Memory", "24/7 Priority Ops", "Custom Vector DB"], gold: true }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto py-12">
      {plans.map(p => (
        <div key={p.name} className={`relative p-8 rounded-2xl ${p.gold ? 'border-[var(--m2-gold)] shadow-[0_0_30px_rgba(212,175,55,0.1)]' : 'border-[rgba(255,255,255,0.1)]'}`} style={{ borderStyle: "solid", borderWidth: "1px", background: "rgba(24, 24, 27, 0.6)", backdropFilter: "blur(20px)" }}>
          {p.gold && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--m2-gold)] text-black text-xs font-bold rounded-full uppercase tracking-wider">Sovereign Tier</div>}
          <h3 className="text-xl font-bold font-outfit mt-4">{p.name}</h3>
          <div className="text-3xl font-bold mt-2" style={{ color: p.gold ? "var(--m2-gold)" : "white" }}>{p.price}</div>
          <ul className="mt-8 space-y-4">
            {p.features.map(f => (
              <li key={f} className="flex items-center gap-3 text-sm" style={{ color: "var(--m2-text-secondary)" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--m2-gold)" }} /> {f}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            {p.gold ? <ButtonPrimary>Request Access</ButtonPrimary> : <ButtonSecondary>Join Waitlist</ButtonSecondary>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function OnboardingLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--m2-void)]">
      <GlassCard className="max-w-md w-full p-8 border-[var(--m2-gold)]/20">
        <div className="flex flex-col items-center mb-8 text-center">
          <M2Logo className="w-16 h-16 mb-4" fill="#D4AF37" />
          <h2 className="text-2xl font-bold font-outfit" style={{ color: "var(--m2-gold)" }}>M2 NEXUS ID</h2>
          <p className="text-sm mt-2" style={{ color: "var(--m2-text-muted)" }}>Authenticate to access the Sovereign Dashboard.</p>
        </div>
        <div className="space-y-4">
          <InputField label="Operator Clearance Level ID" placeholder="e.g. MAHMOUD-AUTH-01" />
          <InputField label="Biometric Passkey" type="password" placeholder="••••••••" />
          <div className="pt-4">
            <ButtonPrimary>Engage Systems</ButtonPrimary>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

// ==========================================
// 6. BRAND ASSET COMPONENTS (POSTERS, DASHBOARDS, BANNERS)
// ==========================================

export function MobileBrandHeader() {
  return (
    <div className="w-full md:hidden flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(15,23,42,0.9)] backdrop-blur-xl">
      <M2Logo className="h-8 w-auto fill-[var(--m2-gold)]" fill="#D4AF37" />
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded bg-[rgba(255,255,255,0.05)] border border-[rgba(212,175,55,0.2)] flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-[var(--m2-gold)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function GoldMotionPoster() {
  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border border-[var(--m2-gold)]/20 group">
      <div className="absolute inset-0 bg-[var(--m2-void)] z-0 flex items-center justify-center">
        {/* CSS Particle background */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at center, var(--m2-gold) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="z-10 transition-transform duration-1000 group-hover:scale-110 drop-shadow-[0_0_80px_rgba(212,175,55,0.5)]">
           <M2Logo className="w-96 h-96 fill-[var(--m2-gold)]" fill="#D4AF37" />
        </div>
      </div>
      <div className="absolute bottom-0 w-full p-8 bg-gradient-to-t from-[var(--m2-void)] to-transparent z-20">
        <h3 className="text-3xl font-outfit font-bold text-white tracking-widest">M2 STRATEGIC</h3>
        <p className="text-[var(--m2-gold)] text-sm tracking-widest uppercase mt-2">Global Executive Command</p>
      </div>
    </div>
  );
}

export function SettingsSidebarUI() {
  return (
    <div className="w-64 border border-[rgba(255,255,255,0.05)] bg-[rgba(24,24,27,0.3)] h-[600px] p-6 flex flex-col gap-6 rounded-xl">
      <div className="mb-4"><M2Logo className="h-10 w-auto fill-white" fill="#FFFFFF" /></div>
      <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Preferences</div>
      <div className="flex flex-col gap-2">
         {['General', 'Security', 'LLM Models', 'Billing'].map(item => (
           <div key={item} className="px-4 py-2 hover:bg-[var(--m2-gold)]/10 hover:text-[var(--m2-gold)] rounded transition-colors text-sm cursor-pointer">{item}</div>
         ))}
      </div>
    </div>
  );
}

export function DataGridMatrix() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
       {[1,2,3,4,5,6,7,8].map(i => (
         <div key={i} className="aspect-square bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl flex flex-col items-center justify-center hover:border-[var(--m2-gold)] hover:bg-[rgba(212,175,55,0.05)] transition-all cursor-crosshair group relative overflow-hidden shadow-lg shadow-black/50">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--m2-gold)]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="text-3xl font-bold font-mono text-[var(--m2-text-muted)] group-hover:text-[var(--m2-gold)] z-10">0{i}</span>
         </div>
       ))}
    </div>
  )
}
