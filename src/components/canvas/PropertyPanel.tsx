'use client';

import React from 'react';
import { 
  Trash2, 
  Palette, 
  Type, 
  Sliders, 
  Waypoints, 
  Minus, 
  ArrowRight, 
  ArrowLeftRight,
  Spline,
  MoveHorizontal
} from 'lucide-react';
import { MarkerType } from '@xyflow/react';

interface PropertyPanelProps {
  selectedNode: any | null;
  selectedEdge: any | null;
  onUpdateNode: (nodeId: string, data: any) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateEdge: (edgeId: string, updates: any) => void;
  onDeleteEdge: (edgeId: string) => void;
}

export default function PropertyPanel({
  selectedNode,
  selectedEdge,
  onUpdateNode,
  onDeleteNode,
  onUpdateEdge,
  onDeleteEdge,
}: PropertyPanelProps) {
  // JIKA TIDAK ADA YANG DIPILIH
  if (!selectedNode && !selectedEdge) {
    return (
      <aside className="w-64 bg-white border-l border-slate-200 p-4 flex flex-col justify-center items-center text-center text-slate-400 no-print">
        <Sliders className="w-8 h-8 mb-2 opacity-30" />
        <p className="text-xs font-semibold text-slate-600">Panel Properti</p>
        <p className="text-[11px] mt-1 max-w-[190px] leading-relaxed">
          Klik salah satu <strong>bentuk</strong> atau <strong>garis konektor</strong> di kanvas untuk mengatur warnanya, label, dan gayanya.
        </p>
      </aside>
    );
  }

  // 1. PROPERTI GARIS KONEKTOR (EDGE)
  if (selectedEdge) {
    const edgeId = selectedEdge.id;
    const currentLabel = selectedEdge.label || '';
    const currentStroke = selectedEdge.style?.stroke || '#3b82f6';
    const currentWidth = selectedEdge.style?.strokeWidth || 2;
    const isDashed = Boolean(selectedEdge.style?.strokeDasharray);
    const hasMarker = Boolean(selectedEdge.markerEnd);
    const edgeStyleType = selectedEdge.type || 'smoothstep';

    const edgeColors = [
      { color: '#3b82f6', name: 'Biru' },
      { color: '#10b981', name: 'Hijau' },
      { color: '#ef4444', name: 'Merah' },
      { color: '#8b5cf6', name: 'Ungu' },
      { color: '#f59e0b', name: 'Kuning' },
      { color: '#475569', name: 'Abu-abu' },
      { color: '#0f172a', name: 'Hitam' },
    ];

    return (
      <aside className="w-64 bg-white border-l border-slate-200 flex flex-col h-full shadow-xs no-print select-none">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Waypoints className="w-4 h-4 text-blue-600" />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Properti Garis
              </h2>
              <span className="text-[10px] text-slate-400 font-mono truncate block max-w-[120px]">
                {edgeId}
              </span>
            </div>
          </div>
          <button
            onClick={() => onDeleteEdge(edgeId)}
            title="Hapus Garis Konektor Ini"
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Label Teks pada Garis */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Type className="w-3.5 h-3.5" />
              <span>Label Teks Garis</span>
            </label>
            <input
              type="text"
              value={currentLabel}
              onChange={(e) => onUpdateEdge(edgeId, { label: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Contoh: Ya, Tidak, Sukses..."
            />
          </div>

          {/* Warna Garis */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5" />
              <span>Warna Garis</span>
            </label>
            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {edgeColors.map((item) => (
                <button
                  key={item.color}
                  type="button"
                  onClick={() =>
                    onUpdateEdge(edgeId, {
                      style: { ...selectedEdge.style, stroke: item.color },
                      markerEnd: selectedEdge.markerEnd
                        ? { ...selectedEdge.markerEnd, color: item.color }
                        : undefined,
                    })
                  }
                  title={item.name}
                  className={`w-6 h-6 rounded-md shadow-2xs hover:scale-110 transition-transform ${
                    currentStroke === item.color ? 'ring-2 ring-blue-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: item.color }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <span>Warna Custom:</span>
              <input
                type="color"
                value={currentStroke}
                onChange={(e) =>
                  onUpdateEdge(edgeId, {
                    style: { ...selectedEdge.style, stroke: e.target.value },
                    markerEnd: selectedEdge.markerEnd
                      ? { ...selectedEdge.markerEnd, color: e.target.value }
                      : undefined,
                  })
                }
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
              />
            </div>
          </div>

          {/* Bentuk Rute Garis */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Rute Garis
            </label>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => onUpdateEdge(edgeId, { type: 'smoothstep' })}
                className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium transition-all ${
                  edgeStyleType === 'smoothstep' || edgeStyleType === 'step'
                    ? 'bg-blue-600 border-blue-600 text-white font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Siku
              </button>
              <button
                type="button"
                onClick={() => onUpdateEdge(edgeId, { type: 'default' })}
                className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium transition-all ${
                  edgeStyleType === 'default'
                    ? 'bg-blue-600 border-blue-600 text-white font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Lengkung
              </button>
              <button
                type="button"
                onClick={() => onUpdateEdge(edgeId, { type: 'straight' })}
                className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium transition-all ${
                  edgeStyleType === 'straight'
                    ? 'bg-blue-600 border-blue-600 text-white font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Lurus
              </button>
            </div>
          </div>

          {/* Ketebalan Garis */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Ketebalan Garis
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[1.5, 2.5, 4].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() =>
                    onUpdateEdge(edgeId, {
                      style: { ...selectedEdge.style, strokeWidth: w },
                    })
                  }
                  className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium text-center transition-all ${
                    currentWidth === w
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {w === 1.5 ? 'Halus' : w === 2.5 ? 'Standar' : 'Tebal'}
                </button>
              ))}
            </div>
          </div>

          {/* Pola Garis (Solid vs Putus-putus) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Pola Garis
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() =>
                  onUpdateEdge(edgeId, {
                    style: { ...selectedEdge.style, strokeDasharray: undefined },
                  })
                }
                className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium text-center transition-all ${
                  !isDashed
                    ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Garis Utuh
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateEdge(edgeId, {
                    style: { ...selectedEdge.style, strokeDasharray: '5,5' },
                  })
                }
                className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium text-center transition-all ${
                  isDashed
                    ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Putus-Putus
              </button>
            </div>
          </div>

          {/* Ujung Panah (Arrowhead) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Ujung Panah
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() =>
                  onUpdateEdge(edgeId, {
                    markerEnd: {
                      type: MarkerType.ArrowClosed,
                      color: currentStroke,
                    },
                  })
                }
                className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium text-center transition-all flex items-center justify-center gap-1 ${
                  hasMarker
                    ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Dengan Panah</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onUpdateEdge(edgeId, {
                    markerEnd: undefined,
                  })
                }
                className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium text-center transition-all flex items-center justify-center gap-1 ${
                  !hasMarker
                    ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Garis Polos</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // 2. PROPERTI BENTUK / NODE (JIKA NODE TERPILIH)
  const { data, id } = selectedNode;
  const currentLabel = data.label || '';
  const currentSublabel = data.sublabel || '';
  const currentColor = data.color || '#ffffff';
  const currentBorder = data.borderColor || '#3b82f6';
  const currentText = data.textColor || '#0f172a';

  const colorPresets = [
    { bg: '#ffffff', border: '#cbd5e1', text: '#0f172a', name: 'Putih' },
    { bg: '#eff6ff', border: '#3b82f6', text: '#1e3a8a', name: 'Biru' },
    { bg: '#ecfdf5', border: '#10b981', text: '#065f46', name: 'Hijau' },
    { bg: '#faf5ff', border: '#a855f7', text: '#581c87', name: 'Ungu' },
    { bg: '#fef3c7', border: '#f59e0b', text: '#78350f', name: 'Kuning' },
    { bg: '#fee2e2', border: '#ef4444', text: '#7f1d1d', name: 'Merah' },
    { bg: '#1e293b', border: '#0f172a', text: '#ffffff', name: 'Gelap' },
  ];

  return (
    <aside className="w-64 bg-white border-l border-slate-200 flex flex-col h-full shadow-xs no-print select-none">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Properti Bentuk
          </h2>
          <span className="text-[10px] text-slate-400 font-mono truncate block max-w-[120px]">
            {id}
          </span>
        </div>
        <button
          onClick={() => onDeleteNode(id)}
          title="Hapus Bentuk Ini"
          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Label Teks */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Type className="w-3.5 h-3.5" />
            <span>Teks / Label Utama</span>
          </label>
          <input
            type="text"
            value={currentLabel}
            onChange={(e) => onUpdateNode(id, { label: e.target.value })}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Tulis judul langkah..."
          />
        </div>

        {/* Sublabel (Opsional) */}
        {selectedNode.type !== 'decision' && selectedNode.type !== 'text' && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Keterangan Tambahan
            </label>
            <input
              type="text"
              value={currentSublabel}
              onChange={(e) => onUpdateNode(id, { sublabel: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Deskripsi singkat..."
            />
          </div>
        )}

        {/* Palet Warna Preset */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5" />
            <span>Tema Warna Cepat</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() =>
                  onUpdateNode(id, {
                    color: preset.bg,
                    borderColor: preset.border,
                    textColor: preset.text,
                  })
                }
                title={preset.name}
                className="h-7 rounded-md border-2 shadow-2xs hover:scale-105 transition-transform"
                style={{
                  backgroundColor: preset.bg,
                  borderColor: preset.border,
                }}
              />
            ))}
          </div>
        </div>

        {/* Custom Color Pickers */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Warna Latar:</span>
            <input
              type="color"
              value={currentColor}
              onChange={(e) => onUpdateNode(id, { color: e.target.value })}
              className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Warna Garis Tepi:</span>
            <input
              type="color"
              value={currentBorder}
              onChange={(e) => onUpdateNode(id, { borderColor: e.target.value })}
              className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Warna Teks:</span>
            <input
              type="color"
              value={currentText}
              onChange={(e) => onUpdateNode(id, { textColor: e.target.value })}
              className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
