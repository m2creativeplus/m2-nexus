"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Search, RefreshCcw, Database, ShieldAlert, CheckCircle, Activity, Bot, Terminal as TerminalIcon, Globe, Shield, Zap } from 'lucide-react';
import { deepNarrativeAnalysis } from '../actions/narrativeAnalysis';

const defaultSourceData = [
    { sourceName: 'BBC News Africa', sourceType: 'News Media', language: 'English', link: '#', date: '2025-06-15', labelUsed: 'breakaway region', accuracyScore: 'Misleading', comment: 'Frames Somaliland as a rebellious part of Somalia, ignoring the 1960 history.', correction: 'Refer to as "self-declared state" or "Somaliland," and provide context on the 1960 union.', status: 'Flagged' },
    { sourceName: 'Wikipedia (English)', sourceType: 'Encyclopedia', language: 'English', link: '#', date: '2025-05-20', labelUsed: 'de facto state', accuracyScore: 'Incomplete', comment: 'Neutral but lacks crucial context about the pre-union independence and the failed Act of Union.', correction: 'Add a section on the 1960 independence and the 2005 AU mission findings to the main article.', status: 'Needs Edit' },
    { sourceName: 'Al Jazeera', sourceType: 'News Media', language: 'English', link: '#', date: '2025-07-02', labelUsed: 'secessionist region', accuracyScore: 'Misleading', comment: 'Uses "secessionist," which incorrectly implies breaking away from a legally unified nation.', correction: 'Use "Somaliland, which restored its sovereignty in 1991..."', status: 'Flagged' },
    { sourceName: 'Chatham House', sourceType: 'Think Tank', language: 'English', link: '#', date: '2024-11-10', labelUsed: 'self-declared Republic of Somaliland', accuracyScore: 'Accurate', comment: 'Uses precise and neutral language, often referencing the historical context correctly.', correction: 'N/A', status: 'Accurate' },
    { sourceName: 'VOA Somali', sourceType: 'News Media', language: 'Somali', link: '#', date: '2025-06-28', labelUsed: 'maamulka Somaliland', accuracyScore: 'Incomplete', comment: 'Refers to it as "Somaliland administration," diminishing its statehood claims.', correction: 'Use "Jamhuuriyadda Somaliland" (Republic of Somaliland).', status: 'Needs Edit' },
    { sourceName: 'UNOCHA Report', sourceType: 'International Body', language: 'English', link: '#', date: '2025-04-05', labelUsed: 'Somaliland region of Somalia', accuracyScore: 'Misleading', comment: 'Directly frames it as a subordinate region of Somalia, contradicting its de facto status.', correction: 'Should refer to it as "Somaliland" and acknowledge its separate governance.', status: 'Flagged' },
];

const AGENTS = [
  { name: 'Wikipedia Sentinel', role: 'Encyclopedia Monitor', status: 'RUNNING', progress: 85 },
  { name: 'Global News Scraper', role: 'Tier-1 Media Intel', status: 'IDLE', progress: 100 },
  { name: 'Think Tank Analyzer', role: 'Policy & Academic', status: 'RUNNING', progress: 45 },
  { name: 'Social Listening', role: 'Twitter/X Sentiment', status: 'ERROR', progress: 12 },
  { name: 'Diplomatic OSINT', role: 'UN/AU Statements', status: 'RUNNING', progress: 92 },
  { name: 'Synthesis Engine', role: 'Sovereign Alignment', status: 'IDLE', progress: 100 },
];

const TERMINAL_LOGS = [
  "[SYSTEM] Initializing Sovereign Narrative Engine v2.0...",
  "[AGENT] Wikipedia Sentinel: Scanning 45 key articles.",
  "[AGENT] Global News Scraper: Detected 'breakaway' term in BBC broadcast.",
  "[CORE] Calculating Narrative Alignment Score: 48/100 (HIGH RISK)",
  "[AGENT] Think Tank Analyzer: Chatham House report validated (Accurate).",
  "[SYSTEM] Awaiting manual override or counter-narrative deployment."
];

interface IntelItem {
    sourceName: string;
    sourceType: string;
    language: string;
    link: string;
    date: string;
    labelUsed: string;
    accuracyScore: string;
    comment: string;
    correction: string;
    status: string;
}

export default function NarrativeMonitor() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [terminalLines, setTerminalLines] = useState<string[]>([]);
    const [intelData, setIntelData] = useState<IntelItem[]>(defaultSourceData);
    const [aiReport, setAiReport] = useState<string | null>(null);
    
    // Terminal typing effect
    useEffect(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < TERMINAL_LOGS.length) {
          setTerminalLines(prev => [...prev, TERMINAL_LOGS[index]]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 800);
      return () => clearInterval(interval);
    }, []);

    const filteredData = useMemo(() => {
        return intelData.filter(item => 
            searchTerm === '' || 
            item.sourceName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.labelUsed?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, intelData]);

    const triggerAIAnalysis = async () => {
        setIsAnalyzing(true);
        setTerminalLines(prev => [...prev, "[USER] Triggering SAIP Deep Scan...", "[SYSTEM] Connecting to Sovereign AI Bridge..."]);
        
        try {
            const res = await fetch('/api/agents/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agentName: 'SAIP Narrative Intel' })
            });
            const data = await res.json();
            
            if (data.success && data.output) {
                // Parse the JSON string from the AI output
                let newIntel: unknown[] = [];
                try {
                  const cleanedOutput = data.output.replace(/```json/g, '').replace(/```/g, '').trim();
                  newIntel = JSON.parse(cleanedOutput);
                  setIntelData(prev => [...newIntel, ...prev]);
                  setTerminalLines(prev => [...prev, `[SYSTEM] Scan complete. Integrated ${newIntel.length} live anomalies via SAIP.`]);
                } catch (parseError) {
                   console.error("Failed to parse SAIP JSON output:", parseError);
                   setTerminalLines(prev => [...prev, "[ERROR] Malformed intel payload received from SAIP."]);
                }
            } else {
                setTerminalLines(prev => [...prev, `[ERROR] SAIP Connection failed: ${data.error || 'Unknown'}`]);
            }
        } catch (error) {
            setTerminalLines(prev => [...prev, "[ERROR] Network failure connecting to SAIP."]);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#D4AF37] selection:text-black">
            
            {/* Header */}
            <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800/50 pb-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
                      <Shield className="w-8 h-8 text-[#D4AF37]" />
                      Sovereign Narrative Monitor
                    </h1>
                    <p className="text-zinc-400 mt-2 font-mono text-sm">SSIAS v2 Intelligence Dashboard // M2 Nexus Core</p>
                </div>
                <button 
                    onClick={triggerAIAnalysis}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 px-5 py-2.5 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)] disabled:opacity-50"
                >
                    {isAnalyzing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {isAnalyzing ? 'Executing Scan...' : 'Trigger Deep Scan'}
                </button>
            </header>

            {/* Top KPI & Terminal Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Scorecard */}
                <div className="lg:col-span-1 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-zinc-400 font-mono text-xs uppercase tracking-widest mb-1">Global AI Visibility</h3>
                      <h2 className="text-2xl font-semibold text-white">Sovereign Index</h2>
                    </div>
                    
                    <div className="my-6 flex items-end gap-4">
                      <span className="text-7xl font-bold text-[#D4AF37] leading-none">48</span>
                      <span className="text-xl text-zinc-500 font-mono mb-1">/ 100</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Threat Level</span>
                        <span className="text-red-400 font-mono">HIGH RISK</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Total Sources</span>
                        <span className="text-white font-mono">{intelData.length} Indexed</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Misleading Framing</span>
                        <span className="text-red-400 font-mono">65% of volume</span>
                      </div>
                    </div>
                </div>

                {/* Live Terminal */}
                <div className="lg:col-span-2 bg-black border border-zinc-800 rounded-xl p-6 font-mono text-sm relative overflow-hidden flex flex-col">
                    <div className="flex items-center gap-2 text-zinc-500 mb-4 border-b border-zinc-800 pb-2">
                      <TerminalIcon className="w-4 h-4" />
                      <span>LIVE TELEMETRY // SYSTEM.LOG</span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 text-zinc-300">
                      {terminalLines.map((line, i) => (
                        <div key={i} className="flex gap-3">
                          <span className="text-zinc-600 shrink-0">{`>`}</span>
                          <span className={line.includes('HIGH RISK') ? 'text-red-400' : line.includes('USER') ? 'text-[#D4AF37]' : ''}>
                            {line}
                          </span>
                        </div>
                      ))}
                      {isAnalyzing && (
                        <div className="flex gap-3 animate-pulse">
                          <span className="text-zinc-600">{`>`}</span>
                          <span className="text-[#D4AF37]">_</span>
                        </div>
                      )}
                    </div>
                </div>
            </div>

            {/* AI Deep Analysis Report */}
            {aiReport && (
                <div className="bg-zinc-900/50 border border-[#D4AF37]/50 rounded-xl p-6 backdrop-blur-xl mb-8">
                    <h3 className="text-xl font-semibold text-[#D4AF37] mb-4 flex items-center gap-2">
                        <Bot className="w-5 h-5" />
                        Sovereign AI Deep Analysis Report
                    </h3>
                    <div className="text-zinc-300 font-sans whitespace-pre-wrap leading-relaxed text-sm">
                        {aiReport}
                    </div>
                </div>
            )}

            {/* Agents Grid */}
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#D4AF37]" />
              Intelligence Agents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {AGENTS.map((agent, i) => (
                <div key={i} className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-4 backdrop-blur-md hover:border-zinc-700 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-white font-medium">{agent.name}</h4>
                      <p className="text-xs text-zinc-500">{agent.role}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      agent.status === 'RUNNING' ? 'bg-emerald-500 animate-pulse' : 
                      agent.status === 'ERROR' ? 'bg-red-500' : 'bg-zinc-600'
                    }`} />
                  </div>
                  <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#D4AF37] h-full" 
                      style={{ width: `${agent.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Intelligence Matrix (Table) */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-xl">
                <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
                  <h3 className="text-lg font-semibold text-white">Narrative Intelligence Matrix</h3>
                  <div className="relative w-full md:w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input 
                          type="text" 
                          placeholder="Search intelligence cache..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#D4AF37]/50 text-white transition-colors text-sm font-mono"
                      />
                  </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-black/50 text-zinc-400 text-xs font-mono border-b border-zinc-800">
                            <tr>
                                <th className="p-4 font-normal">ENTITY SOURCE</th>
                                <th className="p-4 font-normal">TIMESTAMP</th>
                                <th className="p-4 font-normal">EXTRACTED LABEL</th>
                                <th className="p-4 font-normal">STATUS</th>
                                <th className="p-4 font-normal">AI SYNTHESIS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {filteredData.map((item, i) => (
                                <tr key={i} className="hover:bg-zinc-800/20 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-white">{item.sourceName}</div>
                                        <div className="text-xs text-zinc-500 mt-1 font-mono">{item.sourceType} • {item.language}</div>
                                    </td>
                                    <td className="p-4 text-zinc-400 font-mono text-xs">{item.date}</td>
                                    <td className="p-4 font-medium text-zinc-300">&quot;{item.labelUsed}&quot;</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-mono font-medium border uppercase tracking-wider ${
                                            item.accuracyScore === 'Accurate' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            item.accuracyScore === 'Incomplete' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                            'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                            {item.accuracyScore}
                                        </span>
                                    </td>
                                    <td className="p-4 max-w-md">
                                        <p className="text-zinc-400 mb-2 leading-relaxed text-xs">{item.comment}</p>
                                        <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded p-2 text-xs font-mono">
                                            <span className="text-[#D4AF37] block mb-1">RECOMMENDED_OVERRIDE:</span>
                                            <span className="text-zinc-300">{item.correction}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
