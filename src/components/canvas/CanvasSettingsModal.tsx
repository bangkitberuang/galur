'use client';

import React from 'react';
import { 
  X, 
  Settings, 
  FileText, 
  Maximize2, 
  Grid, 
  Eye, 
  Sparkles, 
  Check, 
  Moon, 
  Sun, 
  Leaf, 
  Sliders, 
  Layers,
  ArrowUpDown,
  Move
} from 'lucide-react';
import { CanvasPageConfig } from './CanvasPageFrame';

interface CanvasSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CanvasPageConfig;
  onChangeConfig: (updates: Partial<CanvasPageConfig>) => void;
  nodeCount: number;
  edgeCount: number;
}

export default function CanvasSettingsModal({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  nodeCount,
  edgeCount,
}: CanvasSettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs">
              <Sliders className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
                Pengaturan Lembar & Kanvas
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Atur ukuran halaman A4, auto-expand, kisi-kisi, dan tema kanvas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Tutup Pengaturan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
          {/* 1. UKURAN KERTAS (CANVAS PAGE FORMAT) */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Format Ukuran Kertas</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'A4', label: 'A4', desc: '210 × 297 mm', badge: 'Standar' },
                { id: 'A3', label: 'A3', desc: '297 × 420 mm', badge: 'Besar' },
                { id: 'Letter', label: 'Letter', desc: '8.5 × 11 in', badge: 'US' },
                { id: 'infinite', label: 'Tak Terbatas', desc: 'Kanvas Bebas', badge: 'Bebas' },
              ].map((item) => {
                const isSelected = config.pageSize === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onChangeConfig({ pageSize: item.id as any })}
                    className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/30 text-blue-900 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm">{item.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-blue-600 stroke-[3]" />}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                    <span className="mt-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 self-start">
                      {item.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. ORIENTASI & AUTO-EXPAND */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Orientasi */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
                <span>Orientasi Lembar</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onChangeConfig({ orientation: 'portrait' })}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    config.orientation === 'portrait'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-3.5 h-5 border-2 border-current rounded-xs" />
                  <span>Potret</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeConfig({ orientation: 'landscape' })}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    config.orientation === 'landscape'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-5 h-3.5 border-2 border-current rounded-xs" />
                  <span>Lanskap</span>
                </button>
              </div>
            </div>

            {/* Mode Auto-Expand (Membesar Sesuai Perkembangan) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Auto-Expand</span>
              </label>
              <div
                onClick={() => onChangeConfig({ autoExpand: !config.autoExpand })}
                className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                  config.autoExpand
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={config.autoExpand}
                  onChange={() => {}}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-xs">Membesar Otomatis</div>
                  <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                    Halaman bertambah otomatis saat diagram meluas melebihi batas A4
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. TAMPILAN LEMBAR & KISI (CHECKBOX OPTIONS SEPERTI DRAW.IO) */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Opsi Tampilan (Lihat)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Tampilkan Lembar Halaman A4 */}
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={config.showPageFrame}
                  onChange={(e) => onChangeConfig({ showPageFrame: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-xs text-slate-800">Tampilan Lembar Kertas</span>
                  <p className="text-[10px] text-slate-500">Tampilkan frame halaman A4 dengan bayangan</p>
                </div>
              </label>

              {/* Tampilkan Margin Cetak */}
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={config.showMarginGuides}
                  onChange={(e) => onChangeConfig({ showMarginGuides: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-xs text-slate-800">Garis Panduan Margin Cetak</span>
                  <p className="text-[10px] text-slate-500">Garis putus-putus aman margin cetak 15mm</p>
                </div>
              </label>

              {/* Kisi-Kisi Grid */}
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={config.showGrid}
                  onChange={(e) => onChangeConfig({ showGrid: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-xs text-slate-800">Kisi-Kisi (Grid)</span>
                  <p className="text-[10px] text-slate-500">Titik-titik panduan perataan di kanvas</p>
                </div>
              </label>

              {/* Snap to Grid */}
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={config.snapToGrid}
                  onChange={(e) => onChangeConfig({ snapToGrid: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-xs text-slate-800">Kunci ke Kisi (Snap to Grid)</span>
                  <p className="text-[10px] text-slate-500">Otomatis menempel rapi pada koordinat kisi 15px</p>
                </div>
              </label>
            </div>
          </div>

          {/* 4. TEMA KANVAS (PUTIH KERTAS / DARK MODE SEPERTI GAMBAR USER / EMERALD) */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Tema Visual Kanvas</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onChangeConfig({ canvasTheme: 'light' })}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  config.canvasTheme === 'light'
                    ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-400/30'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-xs">Putih Kertas</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Standar draw.io</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeConfig({ canvasTheme: 'dark' })}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  config.canvasTheme === 'dark'
                    ? 'bg-slate-900 border-slate-700 text-white ring-2 ring-slate-500/50'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-xs">Mode Gelap</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1">Sesuai referensi</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeConfig({ canvasTheme: 'emerald' })}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  config.canvasTheme === 'emerald'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400/30'
                    : 'bg-white border-emerald-200 hover:bg-emerald-50/50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-xs">Tatar Sunda</span>
                </div>
                <span className="text-[10px] text-emerald-700 mt-1">Galur hijau lembut</span>
              </button>
            </div>
          </div>

          {/* Info Status Diagram */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-600">
            <div className="flex items-center gap-3">
              <span className="font-semibold">Bentuk: <strong className="text-slate-900">{nodeCount}</strong></span>
              <span>•</span>
              <span className="font-semibold">Garis Konektor: <strong className="text-slate-900">{edgeCount}</strong></span>
            </div>
            <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-bold">
              {config.pageSize} {config.orientation === 'portrait' ? 'Potret' : 'Lanskap'}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-102 cursor-pointer"
          >
            Terapkan & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
