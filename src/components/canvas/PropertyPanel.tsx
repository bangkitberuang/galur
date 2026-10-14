'use client';

import React from 'react';
import { Trash2, Palette, Type, Sliders } from 'lucide-react';

interface PropertyPanelProps {
  selectedNode: any | null;
  onUpdateNode: (nodeId: string, data: any) => void;
  onDeleteNode: (nodeId: string) => void;
}

export default function PropertyPanel({
  selectedNode,
  onUpdateNode,
  onDeleteNode,
}: PropertyPanelProps) {
  if (!selectedNode) {
    return (
      <aside className="w-64 bg-white border-l border-slate-200 p-4 flex flex-col justify-center items-center text-center text-slate-400 no-print">
        <Sliders className="w-8 h-8 mb-2 opacity-30" />
        <p className="text-xs font-semibold text-slate-500">Panel Properti</p>
        <p className="text-[11px] mt-1 max-w-[180px]">
          Klik salah satu bentuk di kanvas untuk mengedit teks dan warnanya.
        </p>
      </aside>
    );
  }

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
    <aside className="w-64 bg-white border-l border-slate-200 flex flex-col h-full shadow-xs no-print">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Properti Objek
          </h2>
          <span className="text-[10px] text-slate-400 font-mono">ID: {id}</span>
        </div>
        <button
          onClick={() => onDeleteNode(id)}
          title="Hapus Bentuk Ini"
          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
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
