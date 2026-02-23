// AvatarSpeaker.tsx
// ========================================================
// M2 NEXUS — Digital Avatar Presenter Component
// Displays a D-ID generated video of Mahmoud Awaleh or the
// M2 Creative institutional avatar and plays it automatically.
//
// Persona "mahmoud" = personal brand (blue accent)
// Persona "m2-creative" = company brand (gold accent)
// ========================================================
'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Loader2, Bot, Zap } from 'lucide-react';

type AvatarStatus = 'idle' | 'generating' | 'ready';
type AvatarPersona = 'mahmoud' | 'm2-creative';

interface AvatarSpeakerProps {
  /** Persona config */
  persona?: AvatarPersona;
  /** Card header title */
  title?: string;
  /** Trigger to start generation from parent */
  onGenerate?: (text: string) => void;
  /** Current state provided or managed internally */
  videoUrl?: string;
  status?: AvatarStatus;
  caption?: string;
}

const PERSONA_CONFIG: Record<AvatarPersona, { accent: string; label: string; borderColor: string }> = {
  'mahmoud':    { accent: '#38bdf8', borderColor: 'border-sky-500/40',  label: 'Mahmoud Awaleh — Governance Architect' },
  'm2-creative':{ accent: '#D4AF37', borderColor: 'border-amber-500/40', label: 'M2 Creative & Consulting — Institutional System' },
};

export function AvatarSpeaker({
  persona     = 'mahmoud',
  title       = 'Avatar Intelligence Briefing',
  videoUrl: externalVideoUrl,
  status: externalStatus,
  caption: externalCaption,
}: AvatarSpeakerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted,   setMuted]   = useState(false);
  
  // Local state for internal management if not provided by parent
  const [internalStatus, setInternalStatus] = useState<AvatarStatus>('ready');
  const [internalVideoUrl, setInternalVideoUrl] = useState('/avatars/latest_briefing.mp4');
  const [internalCaption, setInternalCaption] = useState('M2 Avatar System Initialized. Standing by for Nexus Intelligence updates.');

  const status = externalStatus || internalStatus;
  const videoUrl = externalVideoUrl || internalVideoUrl;
  const caption = externalCaption || internalCaption;

  const cfg = PERSONA_CONFIG[persona];

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    playing ? v.pause() : v.play();
  };

  return (
    <div
      className={`
        relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden
        bg-black/50 backdrop-blur-xl shadow-2xl border ${cfg.borderColor}
      `}
    >
      {/* ── TOP BAR ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: `${cfg.accent}22`, border: `1px solid ${cfg.accent}55` }}
          >
            <Bot className="w-4 h-4" style={{ color: cfg.accent }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white/90 leading-none">{title}</p>
            <p className="text-xs text-white/40 mt-0.5">{cfg.label}</p>
          </div>
        </div>

        {/* Status pill */}
        <AnimatePresence mode="wait">
          {status === 'generating' ? (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 text-xs text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20"
            >
              <Loader2 className="w-3 h-3 animate-spin" />
              Generating via D-ID…
            </motion.div>
          ) : status === 'ready' ? (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-xs px-3 py-1 rounded-full border"
              style={{ color: cfg.accent, borderColor: `${cfg.accent}44`, background: `${cfg.accent}11` }}
            >
              <Zap className="w-3 h-3" />
              Live
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* ── VIDEO AREA ──────────────────────────────────────── */}
      <div className="relative aspect-video bg-neutral-950">
        {status === 'generating' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-14 h-14 rounded-full border-2 border-t-transparent"
              style={{ borderColor: `${cfg.accent}55`, borderTopColor: cfg.accent }}
            />
            <p className="text-white/40 text-sm animate-pulse">Rendering your avatar via D-ID API…</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            muted={muted}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            playsInline
          />
        )}

        {/* Caption overlay */}
        {caption && status === 'ready' && (
          <div className="absolute bottom-14 inset-x-0 flex justify-center px-6 pointer-events-none">
            <div className="max-w-lg bg-black/75 backdrop-blur-md border border-white/10 rounded-lg px-5 py-2.5 text-center">
              <p className="text-white/90 text-sm leading-relaxed">{caption}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── CONTROLS BAR ────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-5 py-3 bg-white/5 border-t border-white/10">
        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          disabled={status !== 'ready'}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-colors text-white"
        >
          {playing
            ? <Pause className="w-4 h-4" />
            : <Play  className="w-4 h-4 translate-x-[1px]" />}
        </button>

        {/* Progress bar */}
        <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: cfg.accent }}
            initial={{ width: '0%' }}
            animate={{ width: playing ? '100%' : '0%' }}
            transition={{ duration: 30, ease: 'linear' }}
          />
        </div>

        {/* Mute */}
        <button
          onClick={() => setMuted(m => !m)}
          className="text-white/50 hover:text-white transition-colors p-2"
        >
          {muted
            ? <VolumeX className="w-4 h-4" />
            : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
