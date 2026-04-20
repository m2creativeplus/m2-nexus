'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Send, Layers, Globe, Crosshair, Zap, MapPin, BookOpen, Loader2,
  ChevronDown, ChevronUp, Navigation, Paintbrush, Sparkles, Radio,
  Search, Clock, ArrowRight, X, Maximize2, Minimize2, Terminal,
  Compass, Eye, Activity, BrainCircuit, Database, Satellite
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Map, { Source, Layer, Popup, NavigationControl } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import MapEditor from './MapEditor';
import type { GeoFeature, SvgOverlay } from './MapEditor';

// ── Types ────────────────────────────────────────────────────────────────
interface IntelData {
  title: string;
  summary: string;
  facts: string[];
  category: string;
}

interface MapAction {
  lng: number;
  lat: number;
  zoom: number;
  pitch: number;
  bearing: number;
  layer: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  text: string;
  intel?: IntelData | null;
  mapAction?: MapAction | null;
  source?: string;
  timestamp?: string;
}

// ── Quick Command Groups ─────────────────────────────────────────────────
const QUICK_COMMANDS = [
  { label: "Berbera Port", icon: "🏗️", query: "Tell me about Berbera port", category: "infrastructure" },
  { label: "Hargeisa", icon: "🏛️", query: "Show Hargeisa capital", category: "administrative" },
  { label: "Trade Corridor", icon: "🛣️", query: "Berbera corridor trade route", category: "trade" },
  { label: "Burao Livestock", icon: "🐄", query: "Burao livestock market", category: "economic" },
  { label: "Borama", icon: "🎓", query: "Borama university", category: "education" },
  { label: "GIS Systems", icon: "🗺️", query: "How do GIS systems work?", category: "knowledge" },
  { label: "Somaliland", icon: "🌍", query: "Somaliland sovereignty overview", category: "sovereignty" },
  { label: "Wajaale Border", icon: "🛃", query: "Wajaale Ethiopia border", category: "trade" },
];

// ── Category Styling ─────────────────────────────────────────────────────
const CATEGORY_STYLES: Record<string, { border: string; text: string; bg: string; glow: string }> = {
  infrastructure: { border: 'border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/8', glow: 'shadow-amber-500/5' },
  administrative: { border: 'border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-500/8', glow: 'shadow-emerald-500/5' },
  trade: { border: 'border-orange-500/30', text: 'text-orange-400', bg: 'bg-orange-500/8', glow: 'shadow-orange-500/5' },
  economic: { border: 'border-sky-500/30', text: 'text-sky-400', bg: 'bg-sky-500/8', glow: 'shadow-sky-500/5' },
  sovereignty: { border: 'border-red-500/30', text: 'text-red-400', bg: 'bg-red-500/8', glow: 'shadow-red-500/5' },
  education: { border: 'border-violet-500/30', text: 'text-violet-400', bg: 'bg-violet-500/8', glow: 'shadow-violet-500/5' },
  knowledge: { border: 'border-cyan-500/30', text: 'text-cyan-400', bg: 'bg-cyan-500/8', glow: 'shadow-cyan-500/5' },
};

const getCategoryStyle = (cat: string) => CATEGORY_STYLES[cat] || CATEGORY_STYLES.infrastructure;

// ── Time Formatter ───────────────────────────────────────────────────────
const formatTime = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

export default function GeoMindDashboard() {
  const mapRef = useRef<MapRef>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Core State ─────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'system',
      text: "GeoMind v2.0 Sovereign Intelligence Engine initialized. 8 intelligence nodes loaded across infrastructure, trade, and administrative domains. Ask anything about Somaliland's geography, strategic corridors, or GIS technology.",
      timestamp: formatTime(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeLayer, setActiveLayer] = useState("overview");
  const [showIntel, setShowIntel] = useState(false);
  const [currentIntel, setCurrentIntel] = useState<IntelData | null>(null);
  const [popupInfo, setPopupInfo] = useState<{ lng: number; lat: number; name: string; desc: string } | null>(null);
  const [queryCount, setQueryCount] = useState(0);
  const [showQuickCmds, setShowQuickCmds] = useState(true);
  const [chatCollapsed, setChatCollapsed] = useState(false);

  // ── Map Editor State ───────────────────────────────────────────────────
  const [showEditor, setShowEditor] = useState(false);
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [editableGeoData, setEditableGeoData] = useState<GeoFeature[]>([]);
  const [svgOverlays, setSvgOverlays] = useState<SvgOverlay[]>([]);
  const [geoDataLoaded, setGeoDataLoaded] = useState(false);

  // ── View State ─────────────────────────────────────────────────────────
  const [viewState, setViewState] = useState({
    longitude: 46.0,
    latitude: 9.8,
    zoom: 6.5,
    pitch: 30,
    bearing: -5,
  });

  // Load GeoJSON
  useEffect(() => {
    fetch('/data/geo/somaliland-corridors.json')
      .then(r => r.json())
      .then(data => {
        if (data.type === 'FeatureCollection' && Array.isArray(data.features)) {
          const features: GeoFeature[] = data.features.map((f: any, i: number) => ({
            ...f,
            id: f.id || `feature-${i}`,
            properties: { ...f.properties, visible: true },
          }));
          setEditableGeoData(features);
          setGeoDataLoaded(true);
        }
      })
      .catch(err => console.error('Failed to load geo data:', err));
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keyboard shortcut: /  to focus input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowIntel(false);
        setShowEditor(false);
        setIsAddingPoint(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Send Query ─────────────────────────────────────────────────────────
  const sendQuery = useCallback(async (query: string) => {
    if (!query.trim() || isLoading) return;

    setInput('');
    setIsLoading(true);
    setShowQuickCmds(false);
    if (chatCollapsed) setChatCollapsed(false);
    setMessages(prev => [...prev, { role: 'user', text: query, timestamp: formatTime() }]);

    try {
      const res = await fetch('/api/geomind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      const msg: ChatMessage = {
        role: 'assistant',
        text: data.text,
        intel: data.intel,
        mapAction: data.mapAction,
        source: data.source,
        timestamp: formatTime(),
      };
      setMessages(prev => [...prev, msg]);

      if (data.mapAction) {
        const { lng, lat, zoom, pitch, bearing, layer } = data.mapAction;
        mapRef.current?.flyTo({
          center: [lng, lat],
          zoom,
          pitch,
          bearing,
          duration: 3000,
          essential: true,
        });
        setActiveLayer(layer);
      }

      if (data.intel) {
        setCurrentIntel(data.intel);
        setShowIntel(true);
      }

      setQueryCount(prev => prev + 1);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `⚠️ Intelligence error: ${err.message}. Falling back to sovereign knowledge base.`,
        timestamp: formatTime(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, chatCollapsed]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendQuery(input);
    }
  };

  // ── Map Click ──────────────────────────────────────────────────────────
  const onMapClick = useCallback((event: any) => {
    if (isAddingPoint) {
      const newFeature: GeoFeature = {
        id: `custom-${Date.now()}`,
        type: 'Feature',
        properties: {
          name: `Point ${editableGeoData.length + 1}`,
          description: 'New custom marker',
          type: 'custom',
          importance: 'medium',
          category: 'custom',
          color: '#D4AF37',
          icon: 'pin',
          visible: true,
        },
        geometry: {
          type: 'Point',
          coordinates: [event.lngLat.lng, event.lngLat.lat],
        },
      };
      setEditableGeoData(prev => [...prev, newFeature]);
      setIsAddingPoint(false);
      return;
    }

    const features = event.features;
    if (features && features.length > 0) {
      const feature = features[0];
      const props = feature.properties;
      if (props?.name) {
        setPopupInfo({
          lng: event.lngLat.lng,
          lat: event.lngLat.lat,
          name: props.name,
          desc: props.description || '',
        });
        sendQuery(`Tell me about ${props.name}`);
      }
    }
  }, [sendQuery, isAddingPoint, editableGeoData]);

  // ── Stats ──────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    features: editableGeoData.length,
    cities: editableGeoData.filter(f => f.geometry.type === 'Point').length,
    routes: editableGeoData.filter(f => f.geometry.type === 'LineString').length,
    zones: editableGeoData.filter(f => f.geometry.type === 'Polygon').length,
  }), [editableGeoData]);

  // ═══════════════════════════════════════════════════════════════════════
  // ═══ RENDER ════════════════════════════════════════════════════════════
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <div className="flex w-full h-[calc(100vh-64px)] bg-[#030304] overflow-hidden text-zinc-100 relative" role="main" aria-label="GeoMind Spatial Intelligence Dashboard">

      {/* ═══ LEFT PANE: Intelligence Console ═══ */}
      <motion.div
        animate={{ width: chatCollapsed ? '56px' : '440px' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="flex flex-col border-r border-zinc-800/40 bg-gradient-to-b from-[#08080a] via-[#0a0a0e] to-[#06060a] shrink-0 z-10 overflow-hidden relative"
      >
        {/* Subtle gradient edge */}
        <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-[#D4AF37]/20 via-transparent to-[#D4AF37]/10" />

        {/* ── Collapsed Mode ── */}
        {chatCollapsed ? (
          <div className="flex flex-col items-center py-4 gap-3">
            <button onClick={() => setChatCollapsed(false)} className="p-2.5 bg-[#D4AF37]/8 rounded-xl border border-[#D4AF37]/15 hover:bg-[#D4AF37]/15 transition-all group" aria-label="Expand intelligence panel">
              <BrainCircuit className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            </button>
            <div className="w-6 h-px bg-zinc-800" />
            <button onClick={() => setChatCollapsed(false)} className="p-2 rounded-lg hover:bg-zinc-800/50 transition-colors" aria-label="Expand">
              <Maximize2 className="w-4 h-4 text-zinc-600" />
            </button>
            {queryCount > 0 && (
              <div className="w-6 h-6 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
                <span className="text-[9px] text-[#D4AF37] font-black">{queryCount}</span>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div className="p-4 pb-3 border-b border-zinc-800/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="p-2 bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 rounded-xl border border-[#D4AF37]/20 shadow-lg shadow-[#D4AF37]/5">
                    <BrainCircuit className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#08080a]">
                    <div className="w-full h-full bg-emerald-500 rounded-full animate-ping opacity-50" />
                  </div>
                </div>
                <div>
                  <h2 className="font-bold text-zinc-100 tracking-tight text-[15px] leading-tight">GeoMind</h2>
                  <p className="text-[9px] text-[#D4AF37]/70 font-mono tracking-[0.2em] leading-tight">SOVEREIGN INTELLIGENCE</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-zinc-900/50 px-2.5 py-1.5 rounded-lg border border-zinc-800/40" aria-label={`${queryCount} queries processed`}>
                  <Activity className="w-3 h-3 text-[#D4AF37]/70" />
                  <span className="text-[10px] font-mono text-zinc-500">{queryCount}</span>
                </div>
                <button onClick={() => setChatCollapsed(true)} className="p-1.5 rounded-lg hover:bg-zinc-800/50 transition-colors" aria-label="Collapse panel">
                  <Minimize2 className="w-3.5 h-3.5 text-zinc-600" />
                </button>
              </div>
            </div>

            {/* ── Stats Bar ── */}
            <div className="px-4 py-2.5 flex items-center gap-3 border-b border-zinc-800/20 bg-zinc-950/30 shrink-0">
              <div className="flex items-center gap-1.5">
                <Database className="w-3 h-3 text-zinc-600" />
                <span className="text-[9px] font-mono text-zinc-500">{stats.features} features</span>
              </div>
              <div className="w-px h-3 bg-zinc-800" />
              <div className="flex items-center gap-4 text-[9px] font-mono text-zinc-600">
                <span>{stats.cities} <span className="text-zinc-700">cities</span></span>
                <span>{stats.routes} <span className="text-zinc-700">routes</span></span>
                <span>{stats.zones} <span className="text-zinc-700">zones</span></span>
              </div>
            </div>

            {/* ── Chat Messages ── */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scroll-smooth" role="log" aria-label="Intelligence conversation" aria-live="polite">
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    key={idx}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    role="article"
                    aria-label={`${msg.role} message`}
                  >
                    {/* Role + Time */}
                    <div className={`flex items-center gap-2 mb-1.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${
                        msg.role === 'user' ? 'bg-emerald-500/15 border border-emerald-500/25' :
                        msg.role === 'system' ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/20' :
                        'bg-zinc-800/80 border border-zinc-700/50'
                      }`}>
                        {msg.role === 'user' ? <Terminal className="w-2.5 h-2.5 text-emerald-400" /> :
                         msg.role === 'system' ? <Radio className="w-2.5 h-2.5 text-[#D4AF37]" /> :
                         <Sparkles className="w-2.5 h-2.5 text-zinc-400" />}
                      </div>
                      <span className="text-[9px] font-mono text-zinc-600 tracking-wider uppercase">
                        {msg.role === 'system' ? 'System' : msg.role === 'user' ? 'You' : 'GeoMind'}
                      </span>
                      {msg.timestamp && <span className="text-[8px] font-mono text-zinc-700">{msg.timestamp}</span>}
                    </div>

                    {/* Message Bubble */}
                    <div className={`max-w-[92%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-[1.65] transition-colors ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-emerald-500/12 to-emerald-600/5 border border-emerald-500/20 text-emerald-50 rounded-br-md'
                        : msg.role === 'system'
                        ? 'bg-gradient-to-br from-[#D4AF37]/6 to-[#D4AF37]/2 border border-[#D4AF37]/12 text-zinc-400 italic rounded-bl-md'
                        : 'bg-gradient-to-br from-zinc-800/40 to-zinc-900/40 border border-zinc-700/30 text-zinc-200 rounded-bl-md'
                    }`}>
                      {msg.text}
                    </div>

                    {/* Source Badge */}
                    {msg.source && (
                      <motion.span
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1.5 text-[8px] px-2 py-0.5 rounded-full bg-zinc-900/60 border border-zinc-800/60 text-zinc-600 font-mono tracking-wide flex items-center gap-1"
                      >
                        <Eye className="w-2.5 h-2.5" /> {msg.source}
                      </motion.span>
                    )}

                    {/* Inline Intel Facts */}
                    {msg.intel?.facts && msg.role === 'assistant' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                        className="mt-2.5 max-w-[92%] bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/10 rounded-xl p-3.5 space-y-1.5"
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <Crosshair className="w-3 h-3 text-[#D4AF37]" />
                          <p className="text-[9px] font-mono text-[#D4AF37]/80 tracking-[0.15em] uppercase">Key Intelligence</p>
                        </div>
                        {msg.intel.facts.map((fact, fi) => (
                          <div key={fi} className="flex items-start gap-2 text-[11.5px] leading-[1.5] group">
                            <div className="w-1 h-1 rounded-full bg-[#D4AF37]/50 mt-2 shrink-0 group-hover:bg-[#D4AF37] transition-colors" />
                            <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">{fact}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading State */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 py-2"
                  >
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"
                          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.1, 0.8] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-zinc-600 tracking-wide">Querying sovereign intelligence base...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={chatEndRef} />
            </div>

            {/* ── Quick Commands ── */}
            <AnimatePresence>
              {showQuickCmds && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="border-t border-zinc-800/30 overflow-hidden shrink-0"
                >
                  <div className="p-3 pb-2">
                    <div className="flex items-center gap-2 mb-2.5">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]/50" />
                      <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.15em]">Quick Intelligence</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_COMMANDS.map((cmd, i) => {
                        const style = getCategoryStyle(cmd.category);
                        return (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.03, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => sendQuery(cmd.query)}
                            className={`group text-[11px] px-3 py-1.5 rounded-lg ${style.bg} border ${style.border} ${style.text} hover:shadow-lg ${style.glow} transition-all duration-200 flex items-center gap-1.5`}
                            aria-label={`Query: ${cmd.label}`}
                          >
                            <span className="text-[12px]">{cmd.icon}</span>
                            <span className="opacity-80 group-hover:opacity-100">{cmd.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Input Area ── */}
            <div className="p-3 border-t border-zinc-800/30 bg-gradient-to-t from-black/80 to-transparent shrink-0">
              <div className="relative flex items-center group">
                <div className="absolute left-3 flex items-center pointer-events-none">
                  <Search className="w-3.5 h-3.5 text-zinc-600 group-focus-within:text-[#D4AF37]/60 transition-colors" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about Somaliland intelligence..."
                  disabled={isLoading}
                  className="w-full bg-zinc-900/30 border border-zinc-800/40 rounded-xl pl-9 pr-12 py-3 text-[13px] focus:outline-none focus:border-[#D4AF37]/30 focus:ring-2 focus:ring-[#D4AF37]/5 focus:bg-zinc-900/50 text-zinc-200 placeholder-zinc-600 disabled:opacity-40 transition-all duration-300"
                  aria-label="Intelligence query input"
                />
                <button
                  onClick={() => sendQuery(input)}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1.5 p-2 bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 hover:from-[#D4AF37]/30 hover:to-[#D4AF37]/20 rounded-lg transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed group/btn"
                  aria-label="Send query"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" /> : <Send className="w-4 h-4 text-[#D4AF37] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />}
                </button>
              </div>
              <div className="flex items-center justify-between mt-2 px-1">
                <button
                  onClick={() => setShowQuickCmds(!showQuickCmds)}
                  className="text-[9px] text-zinc-600 hover:text-zinc-400 font-mono flex items-center gap-1 transition-colors"
                  aria-label={showQuickCmds ? 'Hide quick queries' : 'Show quick queries'}
                >
                  {showQuickCmds ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                  {showQuickCmds ? 'Hide' : 'Show'} quick queries
                </button>
                <span className="text-[8px] text-zinc-700 font-mono flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-zinc-800/60 border border-zinc-700/40 text-[7px]">/</kbd> focus
                  <span className="mx-1 text-zinc-800">·</span>
                  <kbd className="px-1 py-0.5 rounded bg-zinc-800/60 border border-zinc-700/40 text-[7px]">↵</kbd> send
                </span>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* ═══ RIGHT PANE: Interactive Map Canvas ═══ */}
      <div className="flex-1 relative bg-zinc-950 overflow-hidden" role="region" aria-label="Interactive map">

        {/* ── Top Bar: Map Controls ── */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          {/* Layer Indicator */}
          <div className="bg-black/85 backdrop-blur-xl border border-zinc-700/40 text-[11px] px-3.5 py-2 rounded-xl flex items-center gap-2.5 text-zinc-300 shadow-2xl shadow-black/50">
            <div className="relative">
              <Satellite className="w-3.5 h-3.5 text-[#D4AF37]" />
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            </div>
            <span className="text-zinc-500">Layer</span>
            <span className="text-[#D4AF37] capitalize font-semibold">{activeLayer}</span>
          </div>

          {/* Reset */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              mapRef.current?.flyTo({ center: [46.0, 9.8], zoom: 6.5, pitch: 30, bearing: -5, duration: 2500 });
              setActiveLayer("overview");
            }}
            className="bg-black/85 backdrop-blur-xl border border-zinc-700/40 text-[11px] px-3.5 py-2 rounded-xl flex items-center gap-2 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600/60 transition-all shadow-2xl shadow-black/50"
            aria-label="Reset map view"
          >
            <Compass className="w-3.5 h-3.5" />
            Reset
          </motion.button>

          {/* Edit Map */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowEditor(!showEditor)}
            className={`bg-black/85 backdrop-blur-xl border text-[11px] px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all shadow-2xl shadow-black/50 ${
              showEditor
                ? 'border-[#D4AF37]/40 text-[#D4AF37] bg-[#D4AF37]/8'
                : 'border-zinc-700/40 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600/60'
            }`}
            aria-label={showEditor ? 'Close map editor' : 'Open map editor'}
          >
            <Paintbrush className="w-3.5 h-3.5" />
            {showEditor ? 'Close Editor' : 'Edit Map'}
          </motion.button>
        </div>

        {/* Add Point Indicator */}
        <AnimatePresence>
          {isAddingPoint && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-emerald-500/15 backdrop-blur-xl border border-emerald-500/30 text-[11px] px-4 py-2.5 rounded-xl flex items-center gap-2.5 text-emerald-400 shadow-2xl shadow-emerald-500/10"
            >
              <MapPin className="w-3.5 h-3.5 animate-bounce" />
              Click anywhere on the map to place a point
              <button onClick={() => setIsAddingPoint(false)} className="ml-2 p-0.5 hover:bg-emerald-500/20 rounded" aria-label="Cancel adding point">
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Intel Panel (redesigned) ── */}
        <AnimatePresence>
          {showIntel && currentIntel && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 250 }}
              className="absolute top-4 right-4 z-10 w-[340px] bg-black/92 backdrop-blur-2xl border border-zinc-700/30 rounded-2xl overflow-hidden shadow-2xl shadow-black/60"
              role="complementary"
              aria-label="Intelligence briefing panel"
            >
              {/* Intel Header */}
              <div className="p-4 pb-3 border-b border-zinc-800/30 flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-xl ${getCategoryStyle(currentIntel.category).bg} border ${getCategoryStyle(currentIntel.category).border} shrink-0`}>
                    <BookOpen className={`w-4 h-4 ${getCategoryStyle(currentIntel.category).text}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-zinc-100 text-sm leading-tight truncate">{currentIntel.title}</h3>
                    <span className={`text-[8px] font-mono uppercase tracking-[0.15em] ${getCategoryStyle(currentIntel.category).text}`}>
                      {currentIntel.category} intelligence
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowIntel(false)}
                  className="p-1.5 hover:bg-zinc-800/60 rounded-lg transition-colors shrink-0 mt-0.5"
                  aria-label="Close intel panel"
                >
                  <X className="w-3.5 h-3.5 text-zinc-500" />
                </button>
              </div>

              {/* Intel Content */}
              <div className="p-4 space-y-3.5">
                <p className="text-[12.5px] text-zinc-400 leading-[1.7]">{currentIntel.summary}</p>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-800/50 to-transparent" />

                <div className="space-y-2">
                  {currentIntel.facts.map((fact, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className="flex items-start gap-2.5 text-[11.5px] group"
                    >
                      <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${getCategoryStyle(currentIntel.category).text} opacity-60 group-hover:opacity-100 transition-opacity`} style={{ backgroundColor: 'currentColor' }} />
                      <span className="text-zinc-300 leading-[1.55] group-hover:text-zinc-100 transition-colors">{fact}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MapLibre Canvas ── */}
        <Map
          ref={mapRef}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          onClick={onMapClick}
          interactiveLayerIds={['hubs', 'hub-labels']}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          style={{ width: '100%', height: '100%', cursor: isAddingPoint ? 'crosshair' : 'grab' }}
          attributionControl={false}
        >
          <NavigationControl position="bottom-right" showCompass showZoom />

          {/* Editable GeoJSON */}
          {geoDataLoaded && (
            <Source
              id="geo-data"
              type="geojson"
              data={{
                type: 'FeatureCollection',
                features: editableGeoData.filter(f => f.properties.visible !== false),
              }}
            >
              {/* Economic Zones */}
              <Layer id="zones" type="fill" filter={['==', ['geometry-type'], 'Polygon']}
                paint={{ 'fill-color': ['get', 'color'], 'fill-opacity': 0.1 }} />
              <Layer id="zone-borders" type="line" filter={['==', ['geometry-type'], 'Polygon']}
                paint={{ 'line-color': ['get', 'color'], 'line-width': 1.5, 'line-dasharray': [3, 2], 'line-opacity': 0.45 }} />

              {/* Trade Routes */}
              <Layer id="trade-routes" type="line"
                filter={['all', ['==', ['geometry-type'], 'LineString'], ['==', ['get', 'type'], 'route']]}
                paint={{ 'line-color': ['get', 'color'], 'line-width': activeLayer === 'corridor' ? 5 : 3, 'line-opacity': 0.7 }} />
              <Layer id="trade-routes-dash" type="line"
                filter={['all', ['==', ['geometry-type'], 'LineString'], ['==', ['get', 'type'], 'route']]}
                paint={{ 'line-color': '#ffffff', 'line-width': 1, 'line-dasharray': [2, 4], 'line-opacity': 0.15 }} />

              {/* Coastline */}
              <Layer id="coastline" type="line" filter={['==', ['get', 'type'], 'coastline']}
                paint={{ 'line-color': '#1a3d16', 'line-width': 2, 'line-opacity': 0.35 }} />

              {/* Hub Glow */}
              <Layer id="hub-glow" type="circle" filter={['==', ['geometry-type'], 'Point']}
                paint={{
                  'circle-radius': ['case', ['==', ['get', 'importance'], 'critical'], 22, ['==', ['get', 'importance'], 'high'], 18, 13],
                  'circle-color': ['get', 'color'], 'circle-opacity': 0.06,
                }} />

              {/* Hub Points */}
              <Layer id="hubs" type="circle" filter={['==', ['geometry-type'], 'Point']}
                paint={{
                  'circle-radius': ['case', ['==', ['get', 'importance'], 'critical'], 8, ['==', ['get', 'importance'], 'high'], 6.5, 5],
                  'circle-color': ['get', 'color'], 'circle-stroke-width': 2.5, 'circle-stroke-color': 'rgba(0,0,0,0.7)',
                }} />

              {/* City Labels */}
              <Layer id="hub-labels" type="symbol" filter={['==', ['geometry-type'], 'Point']}
                layout={{ 'text-field': ['get', 'name'], 'text-size': 11.5, 'text-offset': [0, 2], 'text-anchor': 'top', 'text-font': ['Open Sans Bold'] }}
                paint={{ 'text-color': '#d4d4d8', 'text-halo-color': 'rgba(0,0,0,0.9)', 'text-halo-width': 2 }} />
            </Source>
          )}

          {/* SVG Overlays */}
          {svgOverlays.filter(o => o.visible).map(overlay => (
            <Source key={overlay.id} id={`svg-${overlay.id}`} type="image" url={overlay.url}
              coordinates={[
                [overlay.bounds.west, overlay.bounds.north], [overlay.bounds.east, overlay.bounds.north],
                [overlay.bounds.east, overlay.bounds.south], [overlay.bounds.west, overlay.bounds.south],
              ]}>
              <Layer id={`svg-layer-${overlay.id}`} type="raster" paint={{ 'raster-opacity': overlay.opacity }} />
            </Source>
          ))}

          {/* Popup */}
          {popupInfo && (
            <Popup longitude={popupInfo.lng} latitude={popupInfo.lat} anchor="bottom" onClose={() => setPopupInfo(null)} closeButton={true} className="geomind-popup">
              <div className="text-xs text-zinc-900 max-w-[200px]">
                <strong className="text-zinc-800">{popupInfo.name}</strong>
                {popupInfo.desc && <p className="text-zinc-500 mt-0.5 leading-snug">{popupInfo.desc}</p>}
              </div>
            </Popup>
          )}
        </Map>

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(3,3,4,0.5) 90%, rgba(3,3,4,0.85) 100%)',
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none bg-gradient-to-t from-[#030304]/90 to-transparent" />

        {/* Map Editor Panel */}
        <AnimatePresence>
          {showEditor && (
            <MapEditor
              geoData={editableGeoData}
              onGeoDataChange={setEditableGeoData}
              svgOverlays={svgOverlays}
              onSvgOverlaysChange={setSvgOverlays}
              onAddPointMode={() => setIsAddingPoint(!isAddingPoint)}
              isAddingPoint={isAddingPoint}
              onClose={() => { setShowEditor(false); setIsAddingPoint(false); }}
            />
          )}
        </AnimatePresence>

        {/* ── Bottom HUD ── */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between pointer-events-none">
          {/* Coordinates */}
          <div className="pointer-events-auto bg-black/80 backdrop-blur-xl border border-zinc-800/40 rounded-xl px-4 py-2 font-mono text-[10px] text-zinc-500 flex items-center gap-4 shadow-xl shadow-black/30">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
              <span className="text-zinc-600">LAT</span>
              <span className="text-zinc-300">{viewState.latitude.toFixed(4)}</span>
            </div>
            <div className="w-px h-3 bg-zinc-800" />
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-600">LNG</span>
              <span className="text-zinc-300">{viewState.longitude.toFixed(4)}</span>
            </div>
            <div className="w-px h-3 bg-zinc-800" />
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-600">Z</span>
              <span className="text-zinc-300">{viewState.zoom.toFixed(1)}</span>
            </div>
            <div className="w-px h-3 bg-zinc-800" />
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-600">P</span>
              <span className="text-zinc-300">{viewState.pitch.toFixed(0)}°</span>
            </div>
          </div>

          {/* Keyboard Hint */}
          <div className="pointer-events-none text-[8px] font-mono text-zinc-700 flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-900/60 border border-zinc-800/40 text-zinc-600">ESC</kbd>
            <span>close panels</span>
          </div>
        </div>
      </div>
    </div>
  );
}
