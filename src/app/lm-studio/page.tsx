"use client";
import { LocalAIPanel } from "@/components/LocalAIPanel";
import { Cpu, Brain, Database, Code2, Zap } from "lucide-react";

export default function LMStudioPage() {
  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--m2-gold)]/10 border border-[var(--m2-gold)]/20 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[var(--m2-gold)]" />
            </div>
            <h1 className="text-3xl font-bold font-outfit text-white tracking-tight">Local AI Cockpit</h1>
          </div>
          <p className="text-sm text-zinc-400 max-w-xl">
            Sovereign inference via LM Studio · Port 1234 · Phi-4 · Nemotron · Qwen3 · DeepSeek R1 · Nomic Embeddings
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-mono text-green-400 uppercase tracking-widest">Local First</span>
        </div>
      </div>

      {/* Model Capability Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { id: "microsoft/phi-4-mini-reasoning", label: "Phi-4 Mini", cap: "Reasoning", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
          { id: "nvidia/nemotron-3-nano-4b", label: "Nemotron 3", cap: "Fast Inference", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
          { id: "qwen/qwen3-vl-8b", label: "Qwen3 VL", cap: "Vision + Text", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
          { id: "deepseek/deepseek-r1-0528-qwen3-8b", label: "DeepSeek R1", cap: "Deep Reasoning", color: "text-[var(--m2-gold)]", bg: "bg-[var(--m2-gold)]/10 border-[var(--m2-gold)]/20" },
        ].map(m => (
          <div key={m.id} className={`p-4 rounded-xl border ${m.bg} flex flex-col gap-2`}>
            <Zap className={`w-4 h-4 ${m.color}`} />
            <p className={`text-sm font-bold ${m.color}`}>{m.label}</p>
            <p className="text-[11px] text-zinc-500">{m.cap}</p>
          </div>
        ))}
      </div>

      {/* Main Layout: Chat + RAG */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chat takes 2/3 */}
        <div className="xl:col-span-2 h-[620px]">
          <LocalAIPanel />
        </div>

        {/* RAG Query Panel */}
        <div className="xl:col-span-1">
          <RAGQueryPanel />
        </div>
      </div>

      {/* Plugins Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PluginCard
          icon={Brain}
          name="rag-v1"
          description="Prompt preprocessor that injects retrieved context from your Sovereign Data Lake into every LM Studio inference."
          path="/Volumes/MAC DATA/Antigraphity/rag-v1"
          command="cd '/Volumes/MAC DATA/Antigraphity/rag-v1' && lms dev"
          color="text-blue-400"
        />
        <PluginCard
          icon={Code2}
          name="js-code-sandbox"
          description="Secure JavaScript execution environment. Allows LM Studio models to run and test code inside an isolated sandbox."
          path="/Volumes/MAC DATA/Antigraphity/js-code-sandbox"
          command="cd '/Volumes/MAC DATA/Antigraphity/js-code-sandbox' && lms dev"
          color="text-green-400"
        />
      </div>
    </div>
  );
}

function PluginCard({ icon: Icon, name, description, path, command, color }: {
  icon: React.ElementType; name: string; description: string; path: string; command: string; color: string;
}) {
  return (
    <div className="p-5 rounded-2xl border border-[var(--m2-border)] bg-[var(--m2-surface)] space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <div>
          <p className="text-sm font-bold text-white font-mono">{name}</p>
          <p className="text-[10px] text-zinc-500">LM Studio Plugin</p>
        </div>
        <div className="ml-auto px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
          <span className="text-[10px] font-mono text-green-400">READY</span>
        </div>
      </div>
      <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
      <div className="p-3 rounded-lg bg-black/40 border border-white/5">
        <p className="text-[10px] font-mono text-zinc-500 mb-1">Run in dev mode:</p>
        <p className="text-[11px] font-mono text-[var(--m2-gold)] break-all">{command}</p>
      </div>
    </div>
  );
}

function RAGQueryPanel() {
  return <RAGPanel />;
}

// RAG Panel uses imports from the top of this file
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

function RAGPanel() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ answer: string; sources: { source: string; score: string; text: string }[] } | null>(null);
  const [loading, setLoading] = useState(false);

  async function runQuery() {
    if (!query.trim() || loading) return;
    setLoading(true);
    try {
      const r = await fetch("/api/lm-studio/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), top_k: 3 }),
      });
      const d = await r.json();
      setResult(d);
    } catch {
      setResult({ answer: "RAG query failed. Ensure LM Studio + Data Lake are accessible.", sources: [] });
    }
    setLoading(false);
  }

  return (
    <div className="h-full flex flex-col bg-[var(--m2-surface)] rounded-2xl border border-[var(--m2-border)] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--m2-border)]">
        <Database className="w-4 h-4 text-[var(--m2-gold)]" />
        <div>
          <h3 className="text-sm font-bold text-white">Sovereign RAG</h3>
          <p className="text-[10px] text-zinc-500 font-mono">Data Lake · nomic-embed · Local LLM</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {result && (
          <>
            <div className="p-4 rounded-xl bg-[var(--m2-gold)]/5 border border-[var(--m2-gold)]/20">
              <p className="text-xs font-bold text-[var(--m2-gold)] mb-2 uppercase tracking-widest">Answer</p>
              <p className="text-sm text-white leading-relaxed">{result.answer}</p>
            </div>
            {result.sources.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Sources</p>
                {result.sources.map((s, i) => (
                  <div key={i} className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-400">{s.source}</span>
                      <span className="text-[10px] font-mono text-green-400">score: {s.score}</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">{s.text}…</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {!result && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 opacity-40">
            <Database className="w-10 h-10 text-[var(--m2-gold)]" />
            <p className="text-xs text-zinc-500 font-mono">Query your Sovereign Data Lake</p>
          </div>
        )}
      </div>

      <div className="px-5 py-4 border-t border-[var(--m2-border)]">
        <div className="flex gap-3">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && runQuery()}
            placeholder="Ask data lake…"
            className="flex-1 bg-black/30 border border-[var(--m2-border)] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--m2-gold)]/40"
          />
          <button
            onClick={runQuery}
            disabled={loading || !query.trim()}
            className="px-4 rounded-xl bg-[var(--m2-gold)] text-black font-bold disabled:opacity-30 hover:brightness-110 transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
