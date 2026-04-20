'use client';

// AvatarControlPanel.tsx
// ========================================================
// Control dashboard to interface with the D-ID API.
// Allows users to type custom payloads, select personas, 
// and generate video responses on the fly.
// ========================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, RefreshCw } from 'lucide-react';
import { generateAvatarVideo, checkAvatarStatus } from '@/app/actions/did';

interface AvatarControlPanelProps {
  onStatusChange: (status: 'idle' | 'generating' | 'ready') => void;
  onVideoUrlReceived: (url: string) => void;
  onCaptionChange: (caption: string) => void;
  onPersonaSelect: (persona: 'mahmoud' | 'm2-creative') => void;
  currentPersona: 'mahmoud' | 'm2-creative';
}

export function AvatarControlPanel({
  onStatusChange,
  onVideoUrlReceived,
  onCaptionChange,
  onPersonaSelect,
  currentPersona
}: AvatarControlPanelProps) {
  const [script, setScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [talkId, setTalkId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Polling Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const pollStatus = async () => {
      if (!talkId) return;

      const res = await checkAvatarStatus(talkId);
      
      if (!res.success) {
        setError(res.error || "Failed to check status.");
        setIsGenerating(false);
        onStatusChange('idle');
        setTalkId(null);
        return;
      }

      if (res.status === 'done' && res.result_url) {
        onVideoUrlReceived(res.result_url);
        onStatusChange('ready');
        setIsGenerating(false);
        setTalkId(null);
      } else if (res.status === 'error') {
        setError("D-ID generation encountered an internal error.");
        setIsGenerating(false);
        onStatusChange('idle');
        setTalkId(null);
      }
      // if 'created' or 'started', it will continue polling
    };

    if (talkId && isGenerating) {
      interval = setInterval(pollStatus, 3000); // Poll every 3 seconds
    }

    return () => clearInterval(interval);
  }, [talkId, isGenerating, onStatusChange, onVideoUrlReceived]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!script.trim()) return;

    setError(null);
    setIsGenerating(true);
    onStatusChange('generating');
    onCaptionChange(script);

    const res = await generateAvatarVideo(script, currentPersona);

    if (res.success && res.id) {
      setTalkId(res.id); // Triggers the polling effect
    } else {
      setError(res.error || "Failed to initiate generation.");
      setIsGenerating(false);
      onStatusChange('idle');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/80 font-medium text-sm">Briefing Configuration</h3>
        
        {/* Persona Selector */}
        <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
          <button
            type="button"
            onClick={() => onPersonaSelect('mahmoud')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${currentPersona === 'mahmoud' ? 'bg-[#38bdf8] text-neutral-900 shadow-md' : 'text-white/50 hover:text-white'}`}
          >
            Sovereign
          </button>
          <button
            type="button"
            onClick={() => onPersonaSelect('m2-creative')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${currentPersona === 'm2-creative' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/50 hover:text-white'}`}
          >
            Institutional
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            disabled={isGenerating}
            placeholder="Type the intelligence briefing or system protocol here..."
            className="w-full h-24 bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 resize-none transition-all disabled:opacity-50"
          />
        </div>

        {error && (
          <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isGenerating || !script.trim()}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg
              ${isGenerating 
                ? 'bg-white/10 text-white/50 cursor-not-allowed border border-white/5' 
                : currentPersona === 'm2-creative' 
                  ? 'bg-[#D4AF37] text-black hover:bg-[#AA8B2E] shadow-[#D4AF37]/20 border border-transparent' 
                  : 'bg-[#38bdf8] text-neutral-900 hover:bg-[#0284c7] shadow-[#38bdf8]/20 border border-transparent'}
            `}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing Uplink...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Transmit Briefing
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
