'use client';

import React, { useState, useRef } from 'react';
import {
  Paintbrush, Plus, Trash2, Download, Upload, Edit3,
  MapPin, Route, Square, Eye, EyeOff, ChevronRight,
  Save, X, Image, Palette, Move, Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types ────────────────────────────────────────────────────────────────
export interface GeoFeature {
  id: string;
  type: 'Feature';
  properties: {
    name: string;
    description: string;
    type: string;
    importance: string;
    category: string;
    color: string;
    icon?: string;
    visible?: boolean;
  };
  geometry: {
    type: 'Point' | 'LineString' | 'Polygon';
    coordinates: unknown;
  };
}

export interface SvgOverlay {
  id: string;
  name: string;
  url: string;
  bounds: { north: number; south: number; east: number; west: number };
  opacity: number;
  visible: boolean;
}

interface MapEditorProps {
  geoData: GeoFeature[];
  onGeoDataChange: (data: GeoFeature[]) => void;
  svgOverlays: SvgOverlay[];
  onSvgOverlaysChange: (overlays: SvgOverlay[]) => void;
  onAddPointMode: () => void;
  isAddingPoint: boolean;
  onClose: () => void;
}

// ── Preset Color Palettes ────────────────────────────────────────────────
const COLOR_PRESETS = [
  { name: 'Sovereign Gold', color: '#D4AF37' },
  { name: 'Forest Green', color: '#0F5132' },
  { name: 'Dark Green', color: '#1A3D16' },
  { name: 'Mid Green', color: '#2D5A27' },
  { name: 'Light Green', color: '#3d7a35' },
  { name: 'Sage', color: '#5a9e50' },
  { name: 'Amber', color: '#b37d14' },
  { name: 'Earth', color: '#8a5e0a' },
  { name: 'Crimson', color: '#8B0000' },
  { name: 'Navy', color: '#0A1628' },
  { name: 'Teal', color: '#0D7377' },
  { name: 'Coral', color: '#E07A5F' },
  { name: 'Slate', color: '#334155' },
  { name: 'White', color: '#FFFFFF' },
];

const CATEGORY_OPTIONS = ['infrastructure', 'administrative', 'trade', 'economic', 'sovereignty', 'education', 'custom'];
const IMPORTANCE_OPTIONS = ['critical', 'high', 'medium', 'low'];
const FEATURE_TYPE_OPTIONS = ['hub', 'capital', 'city', 'entry', 'route', 'zone', 'coastline', 'custom'];

export default function MapEditor({
  geoData,
  onGeoDataChange,
  svgOverlays,
  onSvgOverlaysChange,
  onAddPointMode,
  isAddingPoint,
  onClose,
}: MapEditorProps) {
  const [activeTab, setActiveTab] = useState<'features' | 'style' | 'overlays'>('features');
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const svgInputRef = useRef<HTMLInputElement>(null);

  // ── Feature CRUD ───────────────────────────────────────────────────────
  const updateFeature = (id: string, updates: Partial<GeoFeature['properties']>) => {
    onGeoDataChange(
      geoData.map(f => f.id === id ? { ...f, properties: { ...f.properties, ...updates } } : f)
    );
  };

  const deleteFeature = (id: string) => {
    onGeoDataChange(geoData.filter(f => f.id !== id));
  };

  const toggleFeatureVisibility = (id: string) => {
    onGeoDataChange(
      geoData.map(f => f.id === id ? { ...f, properties: { ...f.properties, visible: f.properties.visible === false ? true : false } } : f)
    );
  };

  const duplicateFeature = (id: string) => {
    const original = geoData.find(f => f.id === id);
    if (!original) return;
    const newFeature: GeoFeature = {
      ...original,
      id: `${original.id}-copy-${Date.now()}`,
      properties: {
        ...original.properties,
        name: `${original.properties.name} (Copy)`,
      },
    };
    onGeoDataChange([...geoData, newFeature]);
  };

  // ── Export GeoJSON ─────────────────────────────────────────────────────
  const exportGeoJSON = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: geoData.map(({ id, ...rest }) => rest),
    };
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `somaliland-geomind-${new Date().toISOString().slice(0, 10)}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Import GeoJSON ─────────────────────────────────────────────────────
  const importGeoJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.type === 'FeatureCollection' && Array.isArray(json.features)) {
          const imported: GeoFeature[] = json.features.map((f: unknown, i: number) => ({
            ...f,
            id: f.id || `imported-${Date.now()}-${i}`,
            properties: {
              name: f.properties?.name || `Feature ${i + 1}`,
              description: f.properties?.description || '',
              type: f.properties?.type || 'custom',
              importance: f.properties?.importance || 'medium',
              category: f.properties?.category || 'custom',
              color: f.properties?.color || '#D4AF37',
              visible: true,
              ...f.properties,
            },
          }));
          onGeoDataChange([...geoData, ...imported]);
        }
      } catch (err) {
        console.error('Invalid GeoJSON:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ── Import SVG Overlay ─────────────────────────────────────────────────
  const importSvg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      const newOverlay: SvgOverlay = {
        id: `svg-${Date.now()}`,
        name: file.name.replace('.svg', ''),
        url,
        bounds: { north: 11.5, south: 8.0, east: 49.5, west: 42.5 },
        opacity: 0.7,
        visible: true,
      };
      onSvgOverlaysChange([...svgOverlays, newOverlay]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const updateOverlay = (id: string, updates: Partial<SvgOverlay>) => {
    onSvgOverlaysChange(svgOverlays.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const deleteOverlay = (id: string) => {
    onSvgOverlaysChange(svgOverlays.filter(o => o.id !== id));
  };

  // ── Geometry type helper ───────────────────────────────────────────────
  const getGeomIcon = (type: string) => {
    switch (type) {
      case 'Point': return <MapPin className="w-3 h-3" />;
      case 'LineString': return <Route className="w-3 h-3" />;
      case 'Polygon': return <Square className="w-3 h-3" />;
      default: return <MapPin className="w-3 h-3" />;
    }
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute top-0 right-0 z-20 w-[380px] h-full bg-black/95 backdrop-blur-2xl border-l border-[#D4AF37]/15 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-[#D4AF37]/15 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/20">
            <Paintbrush className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100">Map Editor</h3>
            <p className="text-[9px] text-zinc-500 font-mono tracking-wider">{geoData.length} FEATURES · {svgOverlays.length} OVERLAYS</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors">
          <X className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800/50 shrink-0">
        {(['features', 'style', 'overlays'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-[11px] font-medium uppercase tracking-wider transition-all ${
              activeTab === tab
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] bg-[#D4AF37]/5'
                : 'text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">

        {/* ═══ FEATURES TAB ═══ */}
        {activeTab === 'features' && (
          <div className="p-3 space-y-2">
            {/* Action Bar */}
            <div className="flex gap-1.5 mb-3">
              <button
                onClick={onAddPointMode}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-medium transition-all ${
                  isAddingPoint
                    ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-[#D4AF37]/30 hover:text-[#D4AF37]'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                {isAddingPoint ? 'Click Map...' : 'Add Point'}
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-all"
              >
                <Upload className="w-3.5 h-3.5" /> Import
              </button>
              <button
                onClick={exportGeoJSON}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept=".geojson,.json" onChange={importGeoJSON} className="hidden" />

            {/* Feature List */}
            {geoData.map(feature => (
              <div key={feature.id} className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden">
                {/* Feature Header */}
                <button
                  onClick={() => setExpandedFeature(expandedFeature === feature.id ? null : feature.id)}
                  className="w-full flex items-center gap-2.5 p-3 hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="w-4 h-4 rounded-full border-2 shrink-0" style={{ borderColor: feature.properties.color, backgroundColor: feature.properties.color + '30' }} />
                  <span className="text-zinc-400">{getGeomIcon(feature.geometry.type)}</span>
                  <span className="flex-1 text-left text-[12px] font-medium text-zinc-200 truncate">{feature.properties.name}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFeatureVisibility(feature.id); }}
                    className="p-1 hover:bg-zinc-700 rounded transition-colors"
                  >
                    {feature.properties.visible !== false
                      ? <Eye className="w-3 h-3 text-zinc-500" />
                      : <EyeOff className="w-3 h-3 text-zinc-600" />
                    }
                  </button>
                  <ChevronRight className={`w-3 h-3 text-zinc-600 transition-transform ${expandedFeature === feature.id ? 'rotate-90' : ''}`} />
                </button>

                {/* Expanded Editor */}
                <AnimatePresence>
                  {expandedFeature === feature.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-zinc-800/50 overflow-hidden"
                    >
                      <div className="p-3 space-y-3">
                        {/* Name */}
                        <div>
                          <label className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Name</label>
                          <input
                            type="text"
                            value={feature.properties.name}
                            onChange={e => updateFeature(feature.id, { name: e.target.value })}
                            className="w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-[12px] text-zinc-200 focus:outline-none focus:border-[#D4AF37]/40"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Description</label>
                          <textarea
                            value={feature.properties.description}
                            onChange={e => updateFeature(feature.id, { description: e.target.value })}
                            rows={2}
                            className="w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-[12px] text-zinc-200 focus:outline-none focus:border-[#D4AF37]/40 resize-none"
                          />
                        </div>

                        {/* Color Picker */}
                        <div>
                          <label className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Color</label>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="color"
                              value={feature.properties.color}
                              onChange={e => updateFeature(feature.id, { color: e.target.value })}
                              className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-700 bg-transparent"
                            />
                            <input
                              type="text"
                              value={feature.properties.color}
                              onChange={e => updateFeature(feature.id, { color: e.target.value })}
                              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-300 font-mono focus:outline-none focus:border-[#D4AF37]/40"
                            />
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {COLOR_PRESETS.map(preset => (
                              <button
                                key={preset.color}
                                title={preset.name}
                                onClick={() => updateFeature(feature.id, { color: preset.color })}
                                className="w-5 h-5 rounded-full border border-zinc-700 hover:border-[#D4AF37] hover:scale-110 transition-all"
                                style={{ backgroundColor: preset.color }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Category & Importance */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Category</label>
                            <select
                              value={feature.properties.category}
                              onChange={e => updateFeature(feature.id, { category: e.target.value })}
                              className="w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-[11px] text-zinc-300 focus:outline-none focus:border-[#D4AF37]/40"
                            >
                              {CATEGORY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Importance</label>
                            <select
                              value={feature.properties.importance}
                              onChange={e => updateFeature(feature.id, { importance: e.target.value })}
                              className="w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-[11px] text-zinc-300 focus:outline-none focus:border-[#D4AF37]/40"
                            >
                              {IMPORTANCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* Type */}
                        <div>
                          <label className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Feature Type</label>
                          <select
                            value={feature.properties.type}
                            onChange={e => updateFeature(feature.id, { type: e.target.value })}
                            className="w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-[11px] text-zinc-300 focus:outline-none focus:border-[#D4AF37]/40"
                          >
                            {FEATURE_TYPE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>

                        {/* Coordinates (read-only) */}
                        <div>
                          <label className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Coordinates</label>
                          <p className="text-[10px] text-zinc-500 font-mono mt-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 break-all">
                            {JSON.stringify(feature.geometry.coordinates)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => duplicateFeature(feature.id)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-medium bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-lg hover:text-zinc-200 transition-colors"
                          >
                            <Plus className="w-3 h-3" /> Duplicate
                          </button>
                          <button
                            onClick={() => deleteFeature(feature.id)}
                            className="flex items-center justify-center gap-1 px-3 py-1.5 text-[10px] font-medium bg-red-950/30 border border-red-900/30 text-red-400 rounded-lg hover:bg-red-950/50 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}

        {/* ═══ STYLE TAB ═══ */}
        {activeTab === 'style' && (
          <div className="p-3 space-y-4">
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-2">Global Layer Styling</p>

            {/* Batch Color Change */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-3 space-y-3">
              <p className="text-[11px] font-medium text-zinc-300 flex items-center gap-2">
                <Palette className="w-3.5 h-3.5 text-[#D4AF37]" /> Batch Color by Category
              </p>
              {CATEGORY_OPTIONS.filter(c => geoData.some(f => f.properties.category === c)).map(cat => {
                const catFeatures = geoData.filter(f => f.properties.category === cat);
                const currentColor = catFeatures[0]?.properties.color || '#D4AF37';
                return (
                  <div key={cat} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentColor}
                      onChange={e => {
                        onGeoDataChange(geoData.map(f =>
                          f.properties.category === cat ? { ...f, properties: { ...f.properties, color: e.target.value } } : f
                        ));
                      }}
                      className="w-6 h-6 rounded cursor-pointer border border-zinc-700 bg-transparent"
                    />
                    <span className="text-[11px] text-zinc-400 capitalize flex-1">{cat}</span>
                    <span className="text-[9px] text-zinc-600 font-mono">{catFeatures.length} items</span>
                  </div>
                );
              })}
            </div>

            {/* Quick Presets */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-3 space-y-3">
              <p className="text-[11px] font-medium text-zinc-300 flex items-center gap-2">
                <Paintbrush className="w-3.5 h-3.5 text-[#D4AF37]" /> Theme Presets
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onGeoDataChange(geoData.map(f => ({
                      ...f, properties: { ...f.properties, color: f.properties.importance === 'critical' ? '#D4AF37' : f.properties.importance === 'high' ? '#b37d14' : '#5a9e50' }
                    })));
                  }}
                  className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-all text-center"
                >
                  🏛️ Sovereign Gold
                </button>
                <button
                  onClick={() => {
                    onGeoDataChange(geoData.map(f => ({
                      ...f, properties: { ...f.properties, color: f.properties.importance === 'critical' ? '#0D7377' : f.properties.importance === 'high' ? '#14b8a6' : '#5eead4' }
                    })));
                  }}
                  className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 hover:border-teal-500/30 hover:text-teal-400 transition-all text-center"
                >
                  🌊 Ocean Teal
                </button>
                <button
                  onClick={() => {
                    onGeoDataChange(geoData.map(f => ({
                      ...f, properties: { ...f.properties, color: f.properties.importance === 'critical' ? '#dc2626' : f.properties.importance === 'high' ? '#f97316' : '#fbbf24' }
                    })));
                  }}
                  className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 hover:border-red-500/30 hover:text-red-400 transition-all text-center"
                >
                  🔥 Heat Map
                </button>
                <button
                  onClick={() => {
                    onGeoDataChange(geoData.map(f => ({
                      ...f, properties: { ...f.properties, color: f.properties.importance === 'critical' ? '#FFFFFF' : f.properties.importance === 'high' ? '#a1a1aa' : '#52525b' }
                    })));
                  }}
                  className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 hover:border-zinc-500/30 hover:text-zinc-300 transition-all text-center"
                >
                  ⚪ Monochrome
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ OVERLAYS TAB ═══ */}
        {activeTab === 'overlays' && (
          <div className="p-3 space-y-3">
            <button
              onClick={() => svgInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[12px] font-medium bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/15 transition-all"
            >
              <Image className="w-4 h-4" /> Upload SVG Overlay
            </button>
            <input ref={svgInputRef} type="file" accept=".svg,image/svg+xml" onChange={importSvg} className="hidden" />

            <p className="text-[9px] text-zinc-600 font-mono">SVG files are overlaid on the map as image layers. Adjust bounds and opacity below.</p>

            {svgOverlays.length === 0 && (
              <div className="text-center py-8 text-zinc-600">
                <Image className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-[11px]">No overlays yet</p>
                <p className="text-[10px] text-zinc-700 mt-1">Upload SVG files to overlay on the map</p>
              </div>
            )}

            {svgOverlays.map(overlay => (
              <div key={overlay.id} className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-3 space-y-3">
                <div className="flex items-center gap-2">
                  <Image className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <input
                    type="text"
                    value={overlay.name}
                    onChange={e => updateOverlay(overlay.id, { name: e.target.value })}
                    className="flex-1 bg-transparent text-[12px] text-zinc-200 font-medium focus:outline-none"
                  />
                  <button onClick={() => updateOverlay(overlay.id, { visible: !overlay.visible })} className="p-1 hover:bg-zinc-800 rounded">
                    {overlay.visible ? <Eye className="w-3 h-3 text-zinc-500" /> : <EyeOff className="w-3 h-3 text-zinc-600" />}
                  </button>
                  <button onClick={() => deleteOverlay(overlay.id)} className="p-1 hover:bg-red-950/50 rounded">
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                </div>

                {/* Opacity */}
                <div>
                  <label className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Opacity: {Math.round(overlay.opacity * 100)}%</label>
                  <input
                    type="range"
                    min="0" max="1" step="0.05"
                    value={overlay.opacity}
                    onChange={e => updateOverlay(overlay.id, { opacity: parseFloat(e.target.value) })}
                    className="w-full mt-1 accent-[#D4AF37]"
                  />
                </div>

                {/* Bounds */}
                <div className="grid grid-cols-2 gap-2">
                  {(['north', 'south', 'east', 'west'] as const).map(dir => (
                    <div key={dir}>
                      <label className="text-[9px] text-zinc-500 font-mono uppercase">{dir}</label>
                      <input
                        type="number"
                        step="0.1"
                        value={overlay.bounds[dir]}
                        onChange={e => updateOverlay(overlay.id, { bounds: { ...overlay.bounds, [dir]: parseFloat(e.target.value) } })}
                        className="w-full mt-0.5 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-300 font-mono focus:outline-none focus:border-[#D4AF37]/40"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-800/50 shrink-0 flex gap-2">
        <button
          onClick={exportGeoJSON}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-medium bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all"
        >
          <Save className="w-3.5 h-3.5" /> Save & Export GeoJSON
        </button>
      </div>
    </motion.div>
  );
}
