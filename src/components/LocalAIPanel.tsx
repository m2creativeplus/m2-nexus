"use client";
import { useState, useEffect, useRef } from "react";
import { Bot, Cpu, Send, Zap, ChevronDown, Loader2, Circle } from "lucide-react";

interface LMSModel { id: string; name: string; provider: string; type: string; active: boolean }
interface Message { role: "user" | "assistant"; content: string }

const SYSTEM_PROMPT = `You are M2 NEXUS Intelligence — sovereign AI for Mahmoud Awaleh / M2 Creative & Consulting, Hargeisa, Republic of Somaliland. Be strategic, concise, and institutional.`;

export function LocalAIPanel() {
  const [online, setOnline] = useState(false);
  const [models, setModels] = useState<LMSModel[]>([]);
  const [selectedModel, setSelectedModel] = useState("microsoft/phi-4-mini-reasoning");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Poll LM Studio every 10s
  useEffect(() => {
    async function check() {
      try {
        const r = await fetch("/api/lm-studio/models");
        const d = await r.json();
        setOnline(d.online);
        setModels(d.models?.filter((m: LMSModel) => m.type === "chat") || []);
      } catch { setOnline(false); }
    }
    check();
    const iv = setInterval(check, 10_000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim() || streaming) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setStreaming(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      const res = await fetch("/api/lm-studio/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          stream: true,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
            userMsg,
          ],
        }),
      });

      if (!res.body) throw new Error("No stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") break;
          try {
            const chunk = JSON.parse(raw);
            const delta = chunk.choices?.[0]?.delta?.content || "";
            if (delta) {
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: updated[updated.length - 1].content + delta,
                };
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "⚠️ Connection error — ensure LM Studio is running." };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  }

  const chatModels = models.filter(m => m.type === "chat");

  return (
    <div className="flex flex-col h-full bg-[var(--m2-surface)] rounded-2xl border border-[var(--m2-border)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--m2-border)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--m2-gold)]/10 border border-[var(--m2-gold)]/20 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-[var(--m2-gold)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Local AI — LM Studio</h3>
            <p className="text-[10px] font-mono text-zinc-500">Port 1234 · {chatModels.length} model{chatModels.length !== 1 ? "s" : ""} loaded</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Circle className={`w-2 h-2 fill-current ${online ? "text-green-400" : "text-red-500"}`} />
          <span className={`text-[10px] font-mono uppercase tracking-widest ${online ? "text-green-400" : "text-red-500"}`}>
            {online ? "ONLINE" : "OFFLINE"}
          </span>
        </div>
      </div>

      {/* Model Selector */}
      <div className="px-5 py-3 border-b border-[var(--m2-border)] relative">
        <button
          onClick={() => setShowModelPicker(s => !s)}
          className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-black/30 border border-[var(--m2-border)] text-xs text-white hover:border-[var(--m2-gold)]/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Bot className="w-3 h-3 text-[var(--m2-gold)]" />
            <span className="font-mono">{selectedModel.split("/").pop()}</span>
          </div>
          <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${showModelPicker ? "rotate-180" : ""}`} />
        </button>
        {showModelPicker && chatModels.length > 0 && (
          <div className="absolute left-5 right-5 top-[calc(100%-4px)] z-20 bg-[#0f0f0f] border border-[var(--m2-border)] rounded-xl overflow-hidden shadow-2xl">
            {chatModels.map(m => (
              <button
                key={m.id}
                onClick={() => { setSelectedModel(m.id); setShowModelPicker(false); }}
                className={`w-full text-left px-4 py-3 text-xs font-mono hover:bg-[var(--m2-gold)]/10 transition-colors flex items-center gap-2 ${m.id === selectedModel ? "text-[var(--m2-gold)]" : "text-zinc-300"}`}
              >
                <Zap className={`w-3 h-3 ${m.id === selectedModel ? "text-[var(--m2-gold)]" : "text-zinc-600"}`} />
                {m.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 opacity-40">
            <Cpu className="w-10 h-10 text-[var(--m2-gold)]" />
            <p className="text-xs text-zinc-500 font-mono">{online ? "Local AI ready. Ask anything." : "LM Studio offline — start server."}</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-[var(--m2-gold)] text-black font-medium"
                : "bg-[rgba(255,255,255,0.04)] border border-[var(--m2-border)] text-zinc-200"
            }`}>
              {m.content || (streaming && i === messages.length - 1 ? <Loader2 className="w-4 h-4 animate-spin" /> : "")}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t border-[var(--m2-border)]">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={online ? "Ask local AI… (Enter to send)" : "LM Studio offline"}
            disabled={!online || streaming}
            rows={2}
            className="flex-1 bg-black/30 border border-[var(--m2-border)] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--m2-gold)]/40 resize-none disabled:opacity-40 transition-colors"
          />
          <button
            onClick={send}
            disabled={!online || streaming || !input.trim()}
            className="px-4 rounded-xl bg-[var(--m2-gold)] text-black font-bold disabled:opacity-30 hover:brightness-110 transition-all flex items-center gap-2"
          >
            {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
