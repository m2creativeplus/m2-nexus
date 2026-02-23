"use client";
import React, { useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { GoldButton } from './ui/GoldButton';
import { Terminal, Send, MessageSquare } from 'lucide-react';

interface AvatarControlProps {
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
}

export function AvatarControl({ onSendMessage, isGenerating }: AvatarControlProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || isGenerating) return;
    onSendMessage(text);
    setText("");
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Terminal className="w-4 h-4 text-yellow-500" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Command Avatar Speech</h2>
      </div>
      
      <div className="relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter intelligence briefing or directive..."
          className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all resize-none scrollbar-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              handleSend();
            }
          }}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-3">
          <span className="text-[10px] text-zinc-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
            CMD + ENTER
          </span>
          <GoldButton 
            size="sm" 
            onClick={handleSend} 
            disabled={!text.trim() || isGenerating}
            className="h-8 w-8 !p-0 rounded-full"
          >
            <Send className="w-4 h-4" />
          </GoldButton>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex -space-x-2">
           <div className="w-6 h-6 rounded-full border border-white/10 bg-zinc-800 flex items-center justify-center">
             <MessageSquare className="w-3 h-3 text-zinc-400" />
           </div>
        </div>
        <p className="text-[10px] text-zinc-500 italic">
          AI will generate a lip-synced video using the D-ID Neural engine.
        </p>
      </div>
    </GlassCard>
  );
}
