"use client";
import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";

// n8n Workflow Library API (local FastAPI server on port 8001, falls back to mock)
const N8N_API = process.env.NEXT_PUBLIC_N8N_API_URL || "http://localhost:8001";

const CATEGORIES = [
  "All", "Openai", "Slack", "Github", "Googlesheets", "Gmail", "Notion",
  "Telegram", "Webhook", "Supabase", "Discord", "Airtable", "Stripe",
  "Hubspot", "Googledrive", "Schedule", "Http"
];

const COMPLEXITY = ["All", "Low", "Medium", "High"];

// Rich mock dataset reflecting the real 4,343 workflows
const MOCK_WORKFLOWS = [
  { id: 1, name: "AI Agent: Auto-Reply Email with GPT-4", category: "Gmail", complexity: "Medium", nodes: 8, trigger: "Webhook", description: "Monitors inbox, drafts AI replies, awaits approval before sending." },
  { id: 2, name: "GitHub → Slack: PR Review Notifier", category: "Github", complexity: "Low", nodes: 4, trigger: "Webhook", description: "Posts PR details to Slack channel when a pull request is opened." },
  { id: 3, name: "Supabase CRM: Lead Enrichment Pipeline", category: "Supabase", complexity: "High", nodes: 14, trigger: "Schedule", description: "Pulls new contacts, enriches with Hunter.io, updates Supabase CRM." },
  { id: 4, name: "OpenAI: Content Calendar Generator", category: "Openai", complexity: "Medium", nodes: 6, trigger: "Manual", description: "Generates 30-day content calendar from brand brief using GPT-4." },
  { id: 5, name: "Telegram Bot: Project Status Updates", category: "Telegram", complexity: "Low", nodes: 5, trigger: "Webhook", description: "Sends daily project health summaries to a Telegram group." },
  { id: 6, name: "Notion → Google Sheets: Task Sync", category: "Notion", complexity: "Medium", nodes: 9, trigger: "Schedule", description: "Bidirectional sync of Notion tasks to Google Sheets every hour." },
  { id: 7, name: "Stripe: Failed Payment Recovery Flow", category: "Stripe", complexity: "High", nodes: 12, trigger: "Webhook", description: "Detects failed charges, sends retry emails, escalates after 3 attempts." },
  { id: 8, name: "Discord: AI Moderation Bot", category: "Discord", complexity: "High", nodes: 11, trigger: "Webhook", description: "Auto-moderates messages using GPT-4 toxicity detection." },
  { id: 9, name: "Airtable: Invoice Auto-Generator", category: "Airtable", complexity: "Medium", nodes: 7, trigger: "Webhook", description: "Triggers on new Airtable record, generates PDF invoice via API." },
  { id: 10, name: "HubSpot: Deal Pipeline Automation", category: "Hubspot", complexity: "High", nodes: 15, trigger: "Webhook", description: "Moves deals through stages based on email engagement signals." },
  { id: 11, name: "Vercel Deploy → Slack Alert", category: "Http", complexity: "Low", nodes: 3, trigger: "Webhook", description: "Posts deployment status (success/fail) to #deployments channel." },
  { id: 12, name: "Google Drive: AI Document Summarizer", category: "Googledrive", complexity: "Medium", nodes: 8, trigger: "Schedule", description: "Scans new Drive documents and generates AI summaries via Gemini." },
  { id: 13, name: "GitHub: Auto-Code Review with Claude", category: "Github", complexity: "High", nodes: 10, trigger: "Webhook", description: "On PR open, sends diff to Claude API, posts review as PR comment." },
  { id: 14, name: "OpenAI: SEO Blog Post Pipeline", category: "Openai", complexity: "Medium", nodes: 9, trigger: "Manual", description: "Research → outline → draft → SEO optimize → publish to CMS." },
  { id: 15, name: "Slack: Daily Standup Bot", category: "Slack", complexity: "Low", nodes: 4, trigger: "Schedule", description: "Asks team standup questions at 9am, compiles answers to manager." },
  { id: 16, name: "Supabase: Real-Time Alert System", category: "Supabase", complexity: "Medium", nodes: 6, trigger: "Webhook", description: "Triggers n8n on Supabase row changes, routes alerts by severity." },
];

type Workflow = typeof MOCK_WORKFLOWS[0];

const complexityColor: Record<string, string> = {
  Low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  High: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function AutomationsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(MOCK_WORKFLOWS);
  const [filtered, setFiltered] = useState<Workflow[]>(MOCK_WORKFLOWS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [complexity, setComplexity] = useState("All");
  const [selected, setSelected] = useState<Workflow | null>(null);
  const [apiStatus, setApiStatus] = useState<"checking" | "live" | "offline">("checking");
  const [stats, setStats] = useState({ total: 4343, categories: 188, integrations: 365 });

  useEffect(() => {
    fetch(`${N8N_API}/api/stats`)
      .then(r => r.json())
      .then(d => { setApiStatus("live"); setStats(d); })
      .catch(() => setApiStatus("offline"));
  }, []);

  const filterWorkflows = useCallback(() => {
    let result = workflows;
    if (search) result = result.filter(w =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.description.toLowerCase().includes(search.toLowerCase())
    );
    if (category !== "All") result = result.filter(w => w.category === category);
    if (complexity !== "All") result = result.filter(w => w.complexity === complexity);
    setFiltered(result);
  }, [search, category, complexity, workflows]);

  useEffect(() => { filterWorkflows(); }, [filterWorkflows]);

  const importWorkflow = (w: Workflow) => {
    const json = JSON.stringify({ name: w.name, nodes: [], connections: {}, meta: { category: w.category } }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${w.name.replace(/\s+/g, "_")}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 md:p-8 max-w-[1600px] mx-auto w-full space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter gold-text uppercase">AUTOMATIONS</h1>
            <p className="text-sm text-zinc-400 mt-1">n8n Workflow Intelligence Library — {stats.total.toLocaleString()} Production-Ready Pipelines</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-mono ${
              apiStatus === "live" ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" :
              apiStatus === "offline" ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" :
              "text-zinc-500 border-zinc-700 bg-zinc-900"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${apiStatus === "live" ? "bg-emerald-400 animate-pulse" : "bg-yellow-400"}`} />
              {apiStatus === "live" ? "API LIVE" : apiStatus === "offline" ? "DEMO MODE" : "CONNECTING..."}
            </span>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Workflows", value: stats.total.toLocaleString(), icon: "⚡" },
            { label: "Integrations", value: stats.integrations + "+", icon: "🔗" },
            { label: "Categories", value: stats.categories, icon: "📂" },
          ].map(s => (
            <div key={s.label} className="glass-card p-4 flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-xl font-bold gold-text">{s.value}</p>
                <p className="text-xs text-zinc-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="glass-card p-4 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search workflows, integrations, triggers..."
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/40"
          />
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-yellow-500/40 min-w-[140px]">
            {CATEGORIES.map(c => <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>)}
          </select>
          <select value={complexity} onChange={e => setComplexity(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-yellow-500/40 min-w-[140px]">
            {COMPLEXITY.map(c => <option key={c} value={c}>{c === "All" ? "All Complexity" : c}</option>)}
          </select>
          <div className="text-xs text-zinc-500 flex items-center px-2">{filtered.length} results</div>
        </div>

        <div className="flex gap-6">
          {/* Workflow Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(w => (
              <div
                key={w.id}
                onClick={() => setSelected(w)}
                className={`glass-card p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-yellow-500/30 group ${selected?.id === w.id ? "border-yellow-500/40 shadow-[0_0_20px_rgba(212,175,55,0.08)]" : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${complexityColor[w.complexity]}`}>{w.complexity}</span>
                  <span className="text-[10px] text-zinc-600 font-mono">{w.nodes} NODES</span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-2 leading-snug group-hover:text-yellow-400/90 transition-colors">{w.name}</h3>
                <p className="text-[11px] text-zinc-500 mb-3 leading-relaxed">{w.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-yellow-500/60 bg-yellow-500/5 px-2 py-0.5 rounded border border-yellow-500/10">{w.category}</span>
                  <span className="text-[10px] text-zinc-600">{w.trigger}</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 glass-card p-12 text-center text-zinc-600">
                <p className="text-lg mb-2">No workflows match your filter</p>
                <button onClick={() => { setSearch(""); setCategory("All"); setComplexity("All"); }} className="text-sm text-yellow-500/60 hover:text-yellow-500">Clear filters</button>
              </div>
            )}
          </div>

          {/* Detail Panel */}
          {selected && (
            <div className="w-80 shrink-0 glass-card p-6 space-y-4 self-start sticky top-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-yellow-500/60 font-mono uppercase">Workflow Detail</span>
                <button onClick={() => setSelected(null)} className="text-zinc-600 hover:text-zinc-300 text-lg leading-none">×</button>
              </div>
              <h2 className="text-sm font-bold text-white leading-snug">{selected.name}</h2>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{selected.description}</p>
              <div className="space-y-2 text-xs font-mono">
                {[
                  { label: "Category", value: selected.category },
                  { label: "Trigger", value: selected.trigger },
                  { label: "Complexity", value: selected.complexity },
                  { label: "Nodes", value: selected.nodes },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-zinc-500">
                    <span>{r.label}</span>
                    <span className="text-zinc-300">{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => importWorkflow(selected)}
                  className="w-full py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-mono rounded-lg hover:bg-yellow-500/20 transition-colors"
                >
                  ↓ EXPORT JSON
                </button>
                <button className="w-full py-2 bg-white/5 border border-white/10 text-zinc-400 text-xs font-mono rounded-lg hover:bg-white/10 transition-colors">
                  ⚡ DEPLOY TO n8n
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="px-8 py-4 text-center text-[10px]" style={{ borderTop: "1px solid var(--m2-border)", color: "var(--m2-text-muted)" }}>
        M2 NEXUS v2.0 — n8n Workflow Intelligence · {stats.total.toLocaleString()} Workflows · {stats.integrations}+ Integrations · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
