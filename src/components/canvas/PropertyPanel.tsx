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
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ArrowUp,
  ArrowDown,
  Maximize2,
  RotateCw,
  Sun,
  Database,
  Layers,
  Sparkles,
  RotateCcw
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
  // 0. JIKA TIDAK ADA YANG DIPILIH
  if (!selectedNode && !selectedEdge) {
    return (
      <aside className="w-72 bg-white border-l border-slate-200 p-6 flex flex-col justify-center items-center text-center text-slate-400 no-print">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
          <Sliders className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-xs font-bold text-slate-700">Panel Properti Bentuk</p>
        <p className="text-[11px] mt-1.5 text-slate-500 leading-relaxed max-w-[210px]">
          Klik salah satu <strong>objek bentuk</strong> atau <strong>garis konektor</strong> di kanvas untuk mengatur ukuran, warna, teks, garis, dan gayanya secara detail.
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
      <aside className="w-72 bg-white border-l border-slate-200 flex flex-col h-full shadow-xs no-print select-none">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Waypoints className="w-4 h-4 text-emerald-700" />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Properti Garis
              </h2>
              <span className="text-[10px] text-slate-400 font-mono truncate block max-w-[140px]">
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

        <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
          {/* Label Teks pada Garis */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-blue-600" />
              <span>Label Teks Garis</span>
            </label>
            <input
              type="text"
              value={currentLabel}
              onChange={(e) => onUpdateEdge(edgeId, { label: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
              placeholder="Contoh: Ya, Tidak, Sukses..."
            />
          </div>

          {/* Warna Garis */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-amber-600" />
              <span>Warna Garis</span>
            </label>
            <div className="grid grid-cols-8 gap-1 mb-2">
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
            <div className="flex items-center gap-2">
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
              <span className="text-[11px] font-mono text-slate-500">{currentStroke}</span>
            </div>
          </div>

          {/* Gaya Jalur Garis */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Bentuk Jalur Garis
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'smoothstep', label: 'Lengkung' },
                { id: 'step', label: 'Siku-Siku' },
                { id: 'straight', label: 'Lurus' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onUpdateEdge(edgeId, { type: st.id })}
                  className={`py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                    edgeStyleType === st.id
                      ? 'bg-blue-600 border-blue-600 text-white font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {st.label}
                </button>
              ))}
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

          {/* Pola Garis & Ujung Panah */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Pola Garis
              </label>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateEdge(edgeId, {
                      style: { ...selectedEdge.style, strokeDasharray: undefined },
                    })
                  }
                  className={`w-full py-1 rounded text-[11px] border text-center transition-all ${
                    !isDashed ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Utuh
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateEdge(edgeId, {
                      style: { ...selectedEdge.style, strokeDasharray: '5,5' },
                    })
                  }
                  className={`w-full py-1 rounded text-[11px] border text-center transition-all ${
                    isDashed ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Putus-Putus
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Ujung Panah
              </label>
              <div className="space-y-1">
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
                  className={`w-full py-1 rounded text-[11px] border text-center transition-all ${
                    hasMarker ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Dengan Panah
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateEdge(edgeId, {
                      markerEnd: undefined,
                    })
                  }
                  className={`w-full py-1 rounded text-[11px] border text-center transition-all ${
                    !hasMarker ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Garis Polos
                </button>
              </div>
            </div>
          </div>

          {/* Posisi & Jarak Lekukan Garis (Offset) */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Posisi Jalur (Offset)
              </label>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                {currentOffset}px
              </span>
            </div>

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
  const { data, id, type } = selectedNode;
  const currentLabel = data.label || '';
  const currentSublabel = data.sublabel || '';
  const currentColor = data.color || '#ffffff';
  const currentBorder = data.borderColor || '#3b82f6';
  const currentText = data.textColor || '#0f172a';

  // Dimensi Bentuk (Lebar x Tinggi)
  const defaultWidthByType: Record<string, number> = {
    decision: 120,
    swot_card: 310,
    uml_class: 220,
    erd_entity: 240,
    org_node: 230,
    stickynote: 150,
    text: 110,
    connector: 50,
    summing: 65,
    or_junction: 65,
  };
  const defaultHeightByType: Record<string, number> = {
    decision: 90,
    swot_card: 320,
    uml_class: 180,
    erd_entity: 190,
    org_node: 120,
    stickynote: 100,
    text: 40,
    connector: 50,
    summing: 65,
    or_junction: 65,
  };

  const currentWidth = data.width !== undefined
    ? Number(data.width)
    : (defaultWidthByType[type] || 140);
  const currentHeight = data.height !== undefined
    ? Number(data.height)
    : (defaultHeightByType[type] || 70);

  // Tipografi & Teks
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
  const currentTextTransform = data.textTransform || 'none';
  const currentFontSize =
    typeof data.fontSize === 'number'
      ? data.fontSize
      : parseInt(data.fontSize, 10) || 13;

  // Garis Tepi & Sudut
  const currentBorderWidth = data.borderWidth !== undefined ? Number(data.borderWidth) : 2;
  const currentBorderStyle = data.borderStyle || 'solid';
  const currentBorderRadius = data.borderRadius !== undefined ? String(data.borderRadius) : '8px';

  // Efek Visual
  const currentShadow = data.shadow || 'none';
  const currentOpacity = data.opacity !== undefined
    ? Number(data.opacity) > 1
      ? Number(data.opacity)
      : Math.round(Number(data.opacity) * 100)
    : 100;
  const currentRotation = data.rotation !== undefined ? Number(data.rotation) : 0;

  // Tema Warna Lengkap
  const colorPresets = [
    { bg: '#e8f5ed', border: '#0b4632', text: '#0b4632', name: 'Galur Hijau' },
    { bg: '#fffbeb', border: '#f59e0b', text: '#78350f', name: 'Galur Gold' },
    { bg: '#ffffff', border: '#cbd5e1', text: '#0f172a', name: 'Putih Bersih' },
    { bg: '#eff6ff', border: '#3b82f6', text: '#1e3a8a', name: 'Biru Sistem' },
    { bg: '#ecfdf5', border: '#10b981', text: '#065f46', name: 'Emerald' },
    { bg: '#faf5ff', border: '#a855f7', text: '#581c87', name: 'Ungu' },
    { bg: '#fee2e2', border: '#ef4444', text: '#7f1d1d', name: 'Merah' },
    { bg: '#1e293b', border: '#0f172a', text: '#ffffff', name: 'Gelap Slate' },
  ];

  return (
    <aside className="w-72 bg-white border-l border-slate-200 flex flex-col h-full shadow-xs no-print select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-700" />
            <span>Properti Bentuk</span>
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono text-[10px] font-bold">
              {type}
            </span>
            <span className="text-[10px] text-slate-400 font-mono truncate block max-w-[120px]">
              {id}
            </span>
          </div>
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
        {/* ======================================================== */}
        {/* 1. KONTEN & DATA SPESIFIK                                 */}
        {/* ======================================================== */}
        <div className="space-y-3">
          {type === 'org_node' ? (
            <div className="space-y-2.5">
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
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={data.avatarBg || '#0b4632'}
                      onChange={(e) => onUpdateNode(id, { avatarBg: e.target.value })}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-slate-500">{data.avatarBg || '#0b4632'}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">Warna Badge</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={data.badgeColor || '#059669'}
                      onChange={(e) => onUpdateNode(id, { badgeColor: e.target.value })}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-slate-500">{data.badgeColor || '#059669'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : type === 'uml_class' ? (
            <div className="space-y-2.5">
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
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Stereotype
                  </label>
                  <input
                    type="text"
                    value={data.stereotype || ''}
                    onChange={(e) => onUpdateNode(id, { stereotype: e.target.value })}
                    className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 font-mono text-[11px]"
                    placeholder="<<Class>>"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Warna Header
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={data.headerColor || '#1d4ed8'}
                      onChange={(e) => onUpdateNode(id, { headerColor: e.target.value })}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-slate-500">{data.headerColor || '#1d4ed8'}</span>
                  </div>
                </div>
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
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono text-[11px] leading-relaxed"
                  placeholder="- id: UUID&#10;- nama: String"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Metode (1 baris per fungsi)
                </label>
                <textarea
                  rows={3}
                  value={Array.isArray(data.methods) ? data.methods.join('\n') : ''}
                  onChange={(e) =>
                    onUpdateNode(id, {
                      methods: e.target.value.split('\n').filter((l: string) => l.trim().length > 0),
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono text-[11px] leading-relaxed"
                  placeholder="+ login(): boolean&#10;+ logout(): void"
                />
              </div>
            </div>
          ) : type === 'erd_entity' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Tabel / Entitas
                </label>
                <input
                  type="text"
                  value={data.tableName || data.label || ''}
                  onChange={(e) => onUpdateNode(id, { tableName: e.target.value, label: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold"
                  placeholder="Contoh: users"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Warna Header Tabel
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={data.headerBg || '#0b4632'}
                    onChange={(e) => onUpdateNode(id, { headerBg: e.target.value })}
                    className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-600">{data.headerBg || '#0b4632'}</span>
                </div>
              </div>

              {/* Editor Daftar Kolom Field Database */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Kolom ({Array.isArray(data.fields) ? data.fields.length : 0})</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = Array.isArray(data.fields) ? [...data.fields] : [];
                      onUpdateNode(id, {
                        fields: [...cur, { name: `kolom_${cur.length + 1}`, type: 'VARCHAR(100)' }],
                      });
                    }}
                    className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {(Array.isArray(data.fields) ? data.fields : []).map((f: any, idx: number) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={f.name || ''}
                          onChange={(e) => {
                            const newFields = [...data.fields];
                            newFields[idx] = { ...newFields[idx], name: e.target.value };
                            onUpdateNode(id, { fields: newFields });
                          }}
                          placeholder="nama_kolom"
                          className="flex-1 px-2 py-1 text-xs rounded border border-slate-200 font-mono bg-white font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newFields = data.fields.filter((_: any, i: number) => i !== idx);
                            onUpdateNode(id, { fields: newFields });
                          }}
                          title="Hapus Kolom"
                          className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={f.type || ''}
                          onChange={(e) => {
                            const newFields = [...data.fields];
                            newFields[idx] = { ...newFields[idx], type: e.target.value };
                            onUpdateNode(id, { fields: newFields });
                          }}
                          placeholder="Tipe data..."
                          className="flex-1 px-2 py-0.5 text-[11px] rounded border border-slate-200 font-mono text-slate-600 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newFields = [...data.fields];
                            newFields[idx] = { ...newFields[idx], isPK: !newFields[idx].isPK };
                            onUpdateNode(id, { fields: newFields });
                          }}
                          title="Primary Key"
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                            f.isPK
                              ? 'bg-amber-100 text-amber-900 border-amber-300 font-black'
                              : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          PK
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newFields = [...data.fields];
                            newFields[idx] = { ...newFields[idx], isFK: !newFields[idx].isFK };
                            onUpdateNode(id, { fields: newFields });
                          }}
                          title="Foreign Key"
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                            f.isFK
                              ? 'bg-blue-100 text-blue-900 border-blue-300 font-black'
                              : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          FK
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : type === 'swot_card' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kuadran SWOT
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {(['S', 'W', 'O', 'T'] as const).map((q) => {
                    const qLabels = { S: 'strengths', W: 'weaknesses', O: 'opportunities', T: 'threats' };
                    const currentQ = (data.type || 'S').toUpperCase();
                    return (
                      <button
                        key={q}
                        type="button"
                        onClick={() => onUpdateNode(id, { type: q, title: qLabels[q] })}
                        className={`py-1.5 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer ${
                          currentQ === q
                            ? 'bg-emerald-600 border-emerald-600 text-white font-black'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {q}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Judul Kuadran
                </label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => onUpdateNode(id, { title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-emerald-500"
                  placeholder="strengths"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
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
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                  placeholder="Tulis poin analisis di sini..."
                />
              </div>
            </div>
          ) : (
            <>
              {/* Teks Label Standar */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Type className="w-3.5 h-3.5 text-blue-600" />
                  <span>Teks / Label Utama</span>
                </label>
                {type === 'stickynote' ? (
                  <textarea
                    rows={3}
                    value={currentLabel}
                    onChange={(e) => onUpdateNode(id, { label: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed"
                    placeholder="Tulis catatan..."
                  />
                ) : (
                  <input
                    type="text"
                    value={currentLabel}
                    onChange={(e) => onUpdateNode(id, { label: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="Tulis judul langkah..."
                  />
                )}
              </div>

              {/* Sublabel (Opsional) */}
              {type !== 'decision' && type !== 'text' && type !== 'stickynote' && (
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Keterangan Tambahan
                  </label>
                  <input
                    type="text"
                    value={currentSublabel}
                    onChange={(e) => onUpdateNode(id, { sublabel: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    placeholder="Deskripsi singkat..."
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* ======================================================== */}
        {/* 2. UKURAN & DIMENSI BENTUK (WIDTH & HEIGHT)               */}
        {/* ======================================================== */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Ukuran Bentuk (Dimensi)</span>
            </label>
            {(data.width || data.height) && (
              <button
                type="button"
                onClick={() => onUpdateNode(id, { width: undefined, height: undefined })}
                className="text-[10px] text-slate-400 hover:text-blue-600 font-medium underline cursor-pointer"
                title="Kembalikan ukuran ke default bentuk"
              >
                Reset Default
              </button>
            )}
          </div>

          {/* Lebar (Width) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-600">Lebar (Width)</span>
              <span className="font-mono font-bold text-blue-700 px-1.5 py-0.2 rounded bg-blue-50 border border-blue-200">
                {currentWidth}px
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onUpdateNode(id, { width: Math.max(40, currentWidth - 10) })}
                className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                title="Kurangi Lebar (-10px)"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <div className="flex-1 grid grid-cols-4 gap-1">
                {[
                  { w: 100, label: 'Kecil' },
                  { w: 140, label: 'Standar' },
                  { w: 190, label: 'Lebar' },
                  { w: 240, label: 'Ekstra' },
                ].map((pw) => (
                  <button
                    key={pw.w}
                    type="button"
                    onClick={() => onUpdateNode(id, { width: pw.w })}
                    className={`py-1 text-[10px] rounded-md border transition-all cursor-pointer ${
                      currentWidth === pw.w
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pw.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onUpdateNode(id, { width: Math.min(800, currentWidth + 10) })}
                className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                title="Tambah Lebar (+10px)"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="range"
              min={40}
              max={400}
              step={5}
              value={currentWidth}
              onChange={(e) => onUpdateNode(id, { width: Number(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
            />
          </div>

          {/* Tinggi (Height) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-600">Tinggi (Height)</span>
              <span className="font-mono font-bold text-blue-700 px-1.5 py-0.2 rounded bg-blue-50 border border-blue-200">
                {currentHeight}px
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onUpdateNode(id, { height: Math.max(30, currentHeight - 10) })}
                className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                title="Kurangi Tinggi (-10px)"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <div className="flex-1 grid grid-cols-4 gap-1">
                {[
                  { h: 45, label: 'Kompak' },
                  { h: 70, label: 'Standar' },
                  { h: 100, label: 'Tinggi' },
                  { h: 140, label: 'Ekstra' },
                ].map((ph) => (
                  <button
                    key={ph.h}
                    type="button"
                    onClick={() => onUpdateNode(id, { height: ph.h })}
                    className={`py-1 text-[10px] rounded-md border transition-all cursor-pointer ${
                      currentHeight === ph.h
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {ph.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onUpdateNode(id, { height: Math.min(600, currentHeight + 10) })}
                className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                title="Tambah Tinggi (+10px)"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="range"
              min={30}
              max={300}
              step={5}
              value={currentHeight}
              onChange={(e) => onUpdateNode(id, { height: Number(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. FORMAT TIPOGRAFI & GAYA TEKS                           */}
        {/* ======================================================== */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-blue-600" />
              <span>Format Font & Teks</span>
            </span>
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
                className={`py-1 px-2 rounded-md border text-xs transition-all cursor-pointer ${
                  currentFontFamily === f.id
                    ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                } ${f.fontClass}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Ukuran Font Stepper & Presets */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onUpdateNode(id, { fontSize: Math.max(9, currentFontSize - 2) })}
              className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
              title="Perkecil Font (-2px)"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            
            <div className="flex-1 grid grid-cols-5 gap-1">
              {[11, 13, 16, 20, 24].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onUpdateNode(id, { fontSize: s })}
                  className={`py-1 text-[11px] rounded-md border transition-all cursor-pointer ${
                    currentFontSize === s
                      ? 'bg-blue-600 border-blue-600 text-white font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onUpdateNode(id, { fontSize: Math.min(48, currentFontSize + 2) })}
              className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
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

          {/* Transformasi Huruf (Case) */}
          <div className="grid grid-cols-4 gap-1">
            {[
              { id: 'none', label: 'Normal', preview: 'Aa' },
              { id: 'uppercase', label: 'Kapital', preview: 'AA' },
              { id: 'lowercase', label: 'Kecil', preview: 'aa' },
              { id: 'capitalize', label: 'Awal', preview: 'Ab' },
            ].map((tt) => (
              <button
                key={tt.id}
                type="button"
                onClick={() => onUpdateNode(id, { textTransform: tt.id })}
                title={tt.label}
                className={`py-1 text-[11px] rounded-md border transition-all cursor-pointer font-bold ${
                  currentTextTransform === tt.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tt.preview}
              </button>
            ))}
          </div>

          {/* Perataan Teks (Alignment) */}
          <div className="grid grid-cols-4 gap-1">
            <button
              type="button"
              onClick={() => onUpdateNode(id, { textAlign: 'left' })}
              className={`h-7 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                currentTextAlign === 'left'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Rata Kiri"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onUpdateNode(id, { textAlign: 'center' })}
              className={`h-7 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                currentTextAlign === 'center'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Rata Tengah"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onUpdateNode(id, { textAlign: 'right' })}
              className={`h-7 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                currentTextAlign === 'right'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Rata Kanan"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onUpdateNode(id, { textAlign: 'justify' })}
              className={`h-7 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                currentTextAlign === 'justify'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Rata Sisi (Justify)"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Warna Teks */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <span className="font-semibold">Warna Teks:</span>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={currentText}
                onChange={(e) => onUpdateNode(id, { textColor: e.target.value })}
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={currentText}
                onChange={(e) => onUpdateNode(id, { textColor: e.target.value })}
                className="w-18 px-1.5 py-0.5 text-[11px] font-mono border border-slate-200 rounded text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. GARIS TEPI & SUDUT (BORDER & CORNER)                   */}
        {/* ======================================================== */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Batas & Garis Tepi</span>
            <span className="text-[10px] font-mono text-slate-400 font-normal">{currentBorderWidth}px</span>
          </label>

          {/* Ketebalan Garis Tepi */}
          <div className="grid grid-cols-5 gap-1">
            {[
              { w: 0, label: 'Tanpa' },
              { w: 1, label: '1px' },
              { w: 2, label: '2px' },
              { w: 3, label: '3px' },
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

          {/* Pola Garis Tepi (Solid, Dashed, Dotted) */}
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'solid', label: 'Garis Utuh' },
              { id: 'dashed', label: 'Putus-Putus' },
              { id: 'dotted', label: 'Titik-Titik' },
            ].map((bs) => (
              <button
                key={bs.id}
                type="button"
                onClick={() => onUpdateNode(id, { borderStyle: bs.id })}
                className={`py-1 text-[10px] rounded-md border transition-all cursor-pointer ${
                  currentBorderStyle === bs.id
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {bs.label}
              </button>
            ))}
          </div>

          {/* Kelengkungan Sudut (Corner Radius) */}
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Sudut Bentuk</span>
            <div className="grid grid-cols-5 gap-1">
              {[
                { r: '0px', label: 'Persegi' },
                { r: '6px', label: 'Kecil' },
                { r: '12px', label: 'Halus' },
                { r: '20px', label: 'Bulat' },
                { r: '9999px', label: 'Kapsul' },
              ].map((rad) => (
                <button
                  key={rad.r}
                  type="button"
                  onClick={() => onUpdateNode(id, { borderRadius: rad.r })}
                  className={`py-1 text-[10px] rounded-md border transition-all cursor-pointer ${
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

          {/* Warna Garis Tepi */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <span className="font-semibold">Warna Garis:</span>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={currentBorder}
                onChange={(e) => onUpdateNode(id, { borderColor: e.target.value })}
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={currentBorder}
                onChange={(e) => onUpdateNode(id, { borderColor: e.target.value })}
                className="w-18 px-1.5 py-0.5 text-[11px] font-mono border border-slate-200 rounded text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5. TEMA WARNA, LATAR & EFEK VISUAL                       */}
        {/* ======================================================== */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
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

          {/* Warna Latar */}
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold">Warna Latar:</span>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={currentColor}
                onChange={(e) => onUpdateNode(id, { color: e.target.value })}
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={currentColor}
                onChange={(e) => onUpdateNode(id, { color: e.target.value })}
                className="w-18 px-1.5 py-0.5 text-[11px] font-mono border border-slate-200 rounded text-slate-700"
              />
            </div>
          </div>

          {/* Efek Bayangan (Shadow) */}
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Efek Bayangan</span>
            <div className="grid grid-cols-4 gap-1">
              {[
                { id: 'none', label: 'Tanpa' },
                { id: 'sm', label: 'Halus' },
                { id: 'md', label: 'Sedang' },
                { id: 'lg', label: 'Kuat' },
              ].map((sh) => (
                <button
                  key={sh.id}
                  type="button"
                  onClick={() => onUpdateNode(id, { shadow: sh.id })}
                  className={`py-1 text-[10px] rounded-md border transition-all cursor-pointer ${
                    currentShadow === sh.id
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {sh.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transparansi / Opasitas (Opacity) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-600">Transparansi</span>
              <span className="font-mono font-bold text-slate-700">{currentOpacity}%</span>
            </div>
            <input
              type="range"
              min={15}
              max={100}
              step={5}
              value={currentOpacity}
              onChange={(e) => onUpdateNode(id, { opacity: Number(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
            />
          </div>

          {/* Rotasi Bentuk */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-600 flex items-center gap-1">
                <RotateCw className="w-3 h-3 text-slate-500" />
                <span>Rotasi Bentuk</span>
              </span>
              <span className="font-mono font-bold text-slate-700">{currentRotation}°</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[0, 90, 180, 270].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => onUpdateNode(id, { rotation: deg })}
                  className={`py-1 text-[10px] rounded-md border transition-all cursor-pointer ${
                    currentRotation === deg
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
            <input
              type="range"
              min={0}
              max={360}
              step={5}
              value={currentRotation}
              onChange={(e) => onUpdateNode(id, { rotation: Number(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none mt-1"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
