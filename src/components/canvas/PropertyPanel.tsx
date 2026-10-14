'use client';

import React from 'react';
import { 
  Trash2, 
  Palette, 
  Type, 
  Sliders, 
  Waypoints, 
  Minus, 
  Plus,
  ArrowRight, 
  ArrowLeftRight,
  Spline,
  MoveHorizontal,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUp,
  ArrowDown
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
    const currentOffset = typeof selectedEdge.data?.offset === 'number' ? selectedEdge.data.offset : 25;

    const handleUpdateOffset = (val: number) => {
      const clamped = Math.max(10, Math.min(350, Math.round(val)));
      onUpdateEdge(edgeId, {
        data: {
          ...(selectedEdge.data || {}),
          offset: clamped,
        },
      });
    };

    const edgeColors = [
      { color: '#0b4632', name: 'Galur Hijau' },
      { color: '#059669', name: 'Emerald' },
      { color: '#f59e0b', name: 'Galur Gold' },
      { color: '#3b82f6', name: 'Biru' },
      { color: '#ef4444', name: 'Merah' },
      { color: '#8b5cf6', name: 'Ungu' },
      { color: '#475569', name: 'Abu-abu' },
      { color: '#0f172a', name: 'Hitam' },
    ];

    return (
      <aside className="w-64 bg-white border-l border-slate-200 flex flex-col h-full shadow-xs no-print select-none">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Waypoints className="w-4 h-4 text-emerald-700" />
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

          {/* Posisi & Jarak Lekukan Garis (Offset) */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Posisi / Jarak Garis (Offset)
              </label>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                {currentOffset}px
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Geser nilai ini untuk memindahkan jalur garis agar tidak bertumpuk dengan garis lain.
            </p>

            {/* Tombol Geser Cepat Naik / Turun */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleUpdateOffset(currentOffset - 15)}
                className="py-1.5 px-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-xs font-semibold text-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                <span>Geser Naik (-15px)</span>
              </button>
              <button
                type="button"
                onClick={() => handleUpdateOffset(currentOffset + 15)}
                className="py-1.5 px-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-xs font-semibold text-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                <span>Geser Turun (+15px)</span>
              </button>
            </div>

            {/* Preset Jarak Cepat */}
            <div className="grid grid-cols-4 gap-1">
              {[25, 50, 75, 110].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleUpdateOffset(val)}
                  className={`py-1 rounded-md text-[11px] font-medium border transition-all cursor-pointer ${
                    currentOffset === val
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-2xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {val}px
                </button>
              ))}
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min={10}
              max={250}
              step={5}
              value={currentOffset}
              onChange={(e) => handleUpdateOffset(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none mt-1"
            />
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

  // State Tipografi
  const isBold = Boolean(
    data.bold ??
      (data.fontWeight === 'bold' ||
        data.fontWeight === '800' ||
        data.fontWeight === '900' ||
        data.fontWeight === 700)
  );
  const isItalic = Boolean(data.italic ?? (data.fontStyle === 'italic'));
  const isUnderline = Boolean(
    data.underline ??
      (data.textDecoration === 'underline' || Boolean(data.textDecoration?.includes('underline')))
  );
  const isStrike = Boolean(
    data.strike ??
      (data.textDecoration === 'line-through' || Boolean(data.textDecoration?.includes('line-through')))
  );
  const currentFontFamily = data.fontFamily || 'sans';
  const currentTextAlign = data.textAlign || 'center';
  const currentFontSize =
    typeof data.fontSize === 'number'
      ? data.fontSize
      : parseInt(data.fontSize, 10) || 13;

  // State Garis Tepi & Sudut
  const currentBorderWidth = data.borderWidth !== undefined ? Number(data.borderWidth) : 2;
  const currentBorderStyle = data.borderStyle || 'solid';
  const currentBorderRadius = data.borderRadius !== undefined ? String(data.borderRadius) : '8px';

  const colorPresets = [
    { bg: '#e8f5ed', border: '#0b4632', text: '#0b4632', name: 'Galur Hijau' },
    { bg: '#fffbeb', border: '#f59e0b', text: '#78350f', name: 'Galur Gold' },
    { bg: '#ffffff', border: '#cbd5e1', text: '#0f172a', name: 'Putih' },
    { bg: '#eff6ff', border: '#3b82f6', text: '#1e3a8a', name: 'Biru' },
    { bg: '#ecfdf5', border: '#10b981', text: '#065f46', name: 'Hijau' },
    { bg: '#faf5ff', border: '#a855f7', text: '#581c87', name: 'Ungu' },
    { bg: '#fee2e2', border: '#ef4444', text: '#7f1d1d', name: 'Merah' },
    { bg: '#1e293b', border: '#0f172a', text: '#ffffff', name: 'Gelap' },
  ];

  return (
    <aside className="w-68 bg-white border-l border-slate-200 flex flex-col h-full shadow-xs no-print select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-700" />
            <span>Properti Bentuk</span>
          </h2>
          <span className="text-[10px] text-slate-400 font-mono truncate block max-w-[130px]">
            {id} ({selectedNode.type})
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

      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* Khusus Org Chart Node: Edit Nama, Jabatan, dan Departemen */}
        {selectedNode.type === 'org_node' ? (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-emerald-700" />
                <span>Nama Lengkap / Pejabat</span>
              </label>
              <input
                type="text"
                value={data.name || data.label || ''}
                onChange={(e) =>
                  onUpdateNode(id, {
                    name: e.target.value,
                    label: e.target.value,
                  })
                }
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-semibold"
                placeholder="Contoh: Fajar Nugraha"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Jabatan / Posisi
              </label>
              <input
                type="text"
                value={data.role || data.sublabel || ''}
                onChange={(e) =>
                  onUpdateNode(id, {
                    role: e.target.value,
                    sublabel: e.target.value,
                  })
                }
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                placeholder="Contoh: Lead Full-Stack Eng."
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Departemen / Unit Kerja
              </label>
              <input
                type="text"
                value={data.dept || ''}
                onChange={(e) => onUpdateNode(id, { dept: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                placeholder="Contoh: Tim Rekayasa Perangkat Lunak"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">Warna Avatar</label>
                <input
                  type="color"
                  value={data.avatarBg || '#0b4632'}
                  onChange={(e) => onUpdateNode(id, { avatarBg: e.target.value })}
                  className="w-full h-7 rounded border border-slate-200 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">Warna Badge</label>
                <input
                  type="color"
                  value={data.badgeColor || '#059669'}
                  onChange={(e) => onUpdateNode(id, { badgeColor: e.target.value })}
                  className="w-full h-7 rounded border border-slate-200 cursor-pointer"
                />
              </div>
            </div>
          </div>
        ) : selectedNode.type === 'uml_class' ? (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Kelas UML
              </label>
              <input
                type="text"
                value={data.className || data.label || ''}
                onChange={(e) => onUpdateNode(id, { className: e.target.value, label: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 font-bold"
                placeholder="Contoh: Pengguna"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Stereotype (Opsional)
              </label>
              <input
                type="text"
                value={data.stereotype || ''}
                onChange={(e) => onUpdateNode(id, { stereotype: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 font-mono text-[11px]"
                placeholder="Contoh: <<Entity>>"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Atribut (1 baris per atribut)
              </label>
              <textarea
                rows={3}
                value={Array.isArray(data.attributes) ? data.attributes.join('\n') : ''}
                onChange={(e) =>
                  onUpdateNode(id, {
                    attributes: e.target.value.split('\n').filter((l: string) => l.trim().length > 0),
                  })
                }
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono text-[11px]"
                placeholder="- id: UUID"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Metode / Fungsi (1 baris per fungsi)
              </label>
              <textarea
                rows={3}
                value={Array.isArray(data.methods) ? data.methods.join('\n') : ''}
                onChange={(e) =>
                  onUpdateNode(id, {
                    methods: e.target.value.split('\n').filter((l: string) => l.trim().length > 0),
                  })
                }
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono text-[11px]"
                placeholder="+ login(): boolean"
              />
            </div>
          </div>
        ) : selectedNode.type === 'erd_entity' ? (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Tabel / Entitas
              </label>
              <input
                type="text"
                value={data.tableName || data.label || ''}
                onChange={(e) => onUpdateNode(id, { tableName: e.target.value, label: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 font-bold"
                placeholder="Contoh: users"
              />
            </div>
          </div>
        ) : (
          <>
            {/* 1. Label Teks Utama Standar */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-blue-600" />
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
            {selectedNode.type !== 'decision' && selectedNode.type !== 'text' && selectedNode.type !== 'swot_card' && (
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
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
          </>
        )}

        {/* Khusus SWOT Card: Edit Poin Analisis (1 Baris per Poin) */}
        {selectedNode.type === 'swot_card' && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Poin Analisis (1 baris per poin)
            </label>
            <textarea
              rows={5}
              value={Array.isArray(data.items) ? data.items.join('\n') : ''}
              onChange={(e) =>
                onUpdateNode(id, {
                  items: e.target.value.split('\n').filter((line: string) => line.trim().length > 0),
                })
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed"
              placeholder="Tulis poin analisis di sini..."
            />
          </div>
        )}

        {/* --- 2. FORMAT TIPOGRAFI & GAYA TEKS (FONT, SIZE, B, I, U, S, ALIGN) --- */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Format Font & Teks</span>
            <span className="text-[10px] font-mono text-slate-400 font-normal">{currentFontSize}px</span>
          </label>

          {/* Jenis Font (Font Family) */}
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'sans', label: 'Sans', fontClass: 'font-sans' },
              { id: 'serif', label: 'Serif', fontClass: 'font-serif' },
              { id: 'mono', label: 'Mono', fontClass: 'font-mono' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onUpdateNode(id, { fontFamily: f.id })}
                className={`py-1 px-2 rounded-md border text-xs transition-all ${
                  currentFontFamily === f.id
                    ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                } ${f.fontClass}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Ukuran Font (Font Size): Stepper & Quick Pills */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onUpdateNode(id, { fontSize: Math.max(9, currentFontSize - 2) })}
              className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
              title="Perkecil Font (-2px)"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            
            <div className="flex-1 grid grid-cols-4 gap-1">
              {[
                { size: 11, label: '11' },
                { size: 13, label: '13' },
                { size: 16, label: '16' },
                { size: 20, label: '20' },
              ].map((s) => (
                <button
                  key={s.size}
                  type="button"
                  onClick={() => onUpdateNode(id, { fontSize: s.size })}
                  className={`py-1 text-[11px] rounded-md border transition-all cursor-pointer ${
                    currentFontSize === s.size
                      ? 'bg-blue-600 border-blue-600 text-white font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onUpdateNode(id, { fontSize: Math.min(36, currentFontSize + 2) })}
              className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
              title="Perbesar Font (+2px)"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Gaya Format Teks: Bold, Italic, Underline, Strike */}
          <div className="grid grid-cols-4 gap-1">
            <button
              type="button"
              onClick={() => onUpdateNode(id, { bold: !isBold, fontWeight: !isBold ? 'bold' : 'normal' })}
              className={`h-7 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                isBold
                  ? 'bg-blue-600 border-blue-600 text-white font-black shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Tebal (Bold)"
            >
              <span className="font-extrabold text-xs">B</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateNode(id, { italic: !isItalic, fontStyle: !isItalic ? 'italic' : 'normal' })}
              className={`h-7 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                isItalic
                  ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Miring (Italic)"
            >
              <span className="italic font-serif font-bold text-xs">I</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateNode(id, { underline: !isUnderline })}
              className={`h-7 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                isUnderline
                  ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Garis Bawah (Underline)"
            >
              <span className="underline font-bold text-xs">U</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateNode(id, { strike: !isStrike })}
              className={`h-7 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                isStrike
                  ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Coret (Strikethrough)"
            >
              <span className="line-through font-bold text-xs">S</span>
            </button>
          </div>

          {/* Perataan Teks (Alignment) */}
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => onUpdateNode(id, { textAlign: 'left' })}
              className={`h-7 rounded-md border flex items-center justify-center gap-1 text-[11px] transition-all cursor-pointer ${
                currentTextAlign === 'left'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Rata Kiri"
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>Kiri</span>
            </button>
            <button
              type="button"
              onClick={() => onUpdateNode(id, { textAlign: 'center' })}
              className={`h-7 rounded-md border flex items-center justify-center gap-1 text-[11px] transition-all cursor-pointer ${
                currentTextAlign === 'center'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Rata Tengah"
            >
              <AlignCenter className="w-3.5 h-3.5" />
              <span>Tengah</span>
            </button>
            <button
              type="button"
              onClick={() => onUpdateNode(id, { textAlign: 'right' })}
              className={`h-7 rounded-md border flex items-center justify-center gap-1 text-[11px] transition-all cursor-pointer ${
                currentTextAlign === 'right'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Rata Kanan"
            >
              <AlignRight className="w-3.5 h-3.5" />
              <span>Kanan</span>
            </button>
          </div>
        </div>

        {/* --- 3. FORMAT GARIS TEPI & BENTUK (BORDER & CORNER) --- */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Batas & Garis Tepi</span>
            <span className="text-[10px] font-mono text-slate-400 font-normal">{currentBorderWidth}px</span>
          </label>

          {/* Ketebalan Garis Tepi */}
          <div className="grid grid-cols-4 gap-1">
            {[
              { w: 0, label: 'Tanpa' },
              { w: 1, label: '1px' },
              { w: 2, label: '2px' },
              { w: 4, label: '4px' },
            ].map((bw) => (
              <button
                key={bw.w}
                type="button"
                onClick={() => onUpdateNode(id, { borderWidth: bw.w })}
                className={`py-1 text-[11px] rounded-md border transition-all cursor-pointer ${
                  currentBorderWidth === bw.w
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {bw.label}
              </button>
            ))}
          </div>

          {/* Pola Garis Tepi (Solid vs Dashed) */}
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => onUpdateNode(id, { borderStyle: 'solid' })}
              className={`py-1 text-[11px] rounded-md border transition-all cursor-pointer ${
                currentBorderStyle === 'solid'
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Garis Utuh
            </button>
            <button
              type="button"
              onClick={() => onUpdateNode(id, { borderStyle: 'dashed' })}
              className={`py-1 text-[11px] rounded-md border transition-all cursor-pointer ${
                currentBorderStyle === 'dashed'
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Putus-Putus
            </button>
          </div>

          {/* Kelengkungan Sudut (Corner Radius) */}
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Sudut Bentuk</span>
            <div className="grid grid-cols-3 gap-1">
              {[
                { r: '0px', label: 'Persegi' },
                { r: '8px', label: 'Halus' },
                { r: '9999px', label: 'Bulat' },
              ].map((rad) => (
                <button
                  key={rad.r}
                  type="button"
                  onClick={() => onUpdateNode(id, { borderRadius: rad.r })}
                  className={`py-1 text-[11px] rounded-md border transition-all cursor-pointer ${
                    currentBorderRadius === rad.r
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {rad.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- 4. TEMA WARNA & COLOR PICKERS --- */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-amber-600" />
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
                className="h-7 rounded-md border-2 shadow-2xs hover:scale-105 transition-transform cursor-pointer"
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
            <span>Warna Teks:</span>
            <input
              type="color"
              value={currentText}
              onChange={(e) => onUpdateNode(id, { textColor: e.target.value })}
              className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
            />
          </div>

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
        </div>
      </div>
    </aside>
  );
}
