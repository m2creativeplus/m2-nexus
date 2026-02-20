'use client';
// @ts-nocheck

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ShieldCheck, 
  BarChart3, 
  Globe, 
  Cpu, 
  Terminal,
  ChevronRight,
  Zap,
  Command
} from 'lucide-react';
import clsx from 'clsx';

export default function OrbitConsole() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat() as any;
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-400 font-sans selection:bg-[#EAB308]/30 selection:text-[#FACC15] flex flex-col md:flex-row overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#EAB308] opacity-[0.03] blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#EAB308] opacity-[0.02] blur-[120px] rounded-full"></div>
      </div>

      {/* Sidebar: Navigation & Status */}
      <aside className="w-full md:w-64 border-r border-zinc-800 bg-black/30 backdrop-blur-md z-10 flex flex-col justify-between">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/20 flex items-center justify-center">
              <Globe className="w-6 h-6 text-[#EAB308]" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white">M2 ORBIT™</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Intelligence Console</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { icon: Search, label: 'Orbit Scan', active: true },
              { icon: BarChart3, label: 'Orbit Rank', active: false },
              { icon: ShieldCheck, label: 'Orbit Align', active: false },
              { icon: Zap, label: 'Orbit Advise', active: false },
            ].map((item) => (
              <button 
                key={item.label}
                className={clsx(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  item.active 
                    ? "bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#EAB308] animate-pulse" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-zinc-800">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-2">
            <span>SYSTEM STATUS</span>
            <span className="text-emerald-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ONLINE
            </span>
          </div>
          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full w-[85%] bg-[#EAB308] rounded-full opacity-50"></div>
          </div>
          <div className="mt-2 text-[10px] text-zinc-500 font-mono">
            V2.0 (ORBIT CLASS) :: CONNECTED
          </div>
        </div>
      </aside>

      {/* Main Console Area */}
      <main className="flex-1 flex flex-col relative z-10 h-screen">
        
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 flex items-center px-8 bg-black/80 backdrop-blur-sm sticky top-0">
          <div className="flex items-center space-x-2 text-sm text-zinc-500">
            <Terminal className="w-4 h-4" />
            <span>Console</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-200">Active Session</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
             <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full border border-[#EAB308]/20 bg-[#EAB308]/5">
               <Cpu className="w-3 h-3 text-[#EAB308]" />
               <span className="text-[10px] font-mono font-bold text-[#EAB308]">AI OPTIMIZED</span>
             </div>
          </div>
        </header>

        {/* Content Area / Chat Stream */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-40 scroll-smooth">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto"
              >
                <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8 shadow-2xl relative group">
                  <div className="absolute inset-0 bg-[#EAB308]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full"></div>
                  <Globe className="w-10 h-10 text-[#EAB308] relative z-10" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30 mb-4 tracking-tight">
                  Awaiting Target Coordinates
                </h2>
                <p className="text-zinc-500 text-lg mb-8 leading-relaxed">
                  Enter the name of a Person, Brand, or Institution to initiate the <span className="text-[#EAB308]">Orbit Intelligence Engine</span>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                   {['Run Orbit Scan', 'Analyze Authority', 'Check Alignment', 'Generate Brief'].map((action) => (
                     <div key={action} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-[#EAB308]/30 transition-all cursor-default group">
                       <span className="text-sm font-medium text-zinc-400 group-hover:text-[#EAB308] transition-colors">{action}</span>
                     </div>
                   ))}
                </div>
              </motion.div>
            ) : (
              messages.map((m: any) => (
                <motion.div
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={m.id}
                  className={clsx(
                    "flex flex-col max-w-4xl mx-auto",
                    m.role === 'user' ? "items-end" : "items-start"
                  )}
                >
                  <div className={clsx(
                    "px-6 py-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm max-w-[90%]",
                    m.role === 'user' 
                      ? "bg-[#EAB308] text-black font-medium" 
                      : "bg-zinc-900 border border-zinc-800 text-white border-l-4 border-l-[#EAB308]"
                  )}>
                    {m.role !== 'user' && (
                        <div className="flex items-center space-x-2 mb-3 pb-3 border-b border-zinc-800 opacity-50">
                            <Cpu className="w-3 h-3" />
                            <span className="text-xs font-mono uppercase">M2 Orbit Intelligence</span>
                        </div>
                    )}
                    <div className="whitespace-pre-wrap">
                      {m.content}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            
            {/* Loading Indicator */}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2 text-[#EAB308] max-w-4xl mx-auto pt-4">
                <div className="w-2 h-2 rounded-full bg-[#EAB308] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#EAB308] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#EAB308] animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs font-mono ml-2">ANALYZING SIGNAL...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-8 border-t border-zinc-800 bg-black/80 backdrop-blur-xl absolute bottom-0 w-full z-20">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#EAB308] to-purple-900 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <div className="relative flex items-center bg-zinc-950 rounded-xl border border-zinc-800 shadow-2xl focus-within:ring-1 focus-within:ring-[#EAB308]/50 transition-all overflow-hidden">
                <div className="pl-4 text-zinc-500">
                    <Command className="w-5 h-5 animate-pulse" />
                </div>
                <input
                className="w-full bg-transparent border-none px-4 py-4 focus:outline-none text-white placeholder:text-zinc-600 font-medium"
                value={input}
                placeholder="Enter Target Coordinates (e.g., 'Audit Eng. Mahmoud Awaleh' or 'Scan M2 Creative')"
                onChange={handleInputChange}
                autoFocus
                />
                <button
                type="submit"
                disabled={isLoading || !input?.trim()}
                className="mr-2 p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-[#EAB308] transition-all"
                >
                <ChevronRight className="w-5 h-5" />
                </button>
            </div>
            <div className="text-center mt-3">
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest opacity-60">
                    M2 Orbit™ • Strategic Intelligence System • Authorized Use Only
                </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}