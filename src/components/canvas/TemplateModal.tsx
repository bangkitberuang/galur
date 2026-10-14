'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Database, 
  Users, 
  GitFork, 
  LayoutGrid, 
  Network, 
  Server, 
  Zap, 
  Gauge, 
  Target, 
  Boxes,
  Code2,
  Check
} from 'lucide-react';
import { SPECIALIST_CATEGORIES, CategoryTemplate } from '@/lib/specialistTemplates';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: CategoryTemplate) => void;
}

export default function TemplateModal({
  isOpen,
  onClose,
  onSelectTemplate,
}: TemplateModalProps) {
  // Default to SWOT Analysis (highlighted in Gambar 3)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('swot');

  if (!isOpen) return null;

  const currentTemplate = SPECIALIST_CATEGORIES.find((c) => c.id === selectedCategoryId) || SPECIALIST_CATEGORIES[0];

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'uml': return <Code2 className="w-4 h-4" />;
      case 'erd': return <Database className="w-4 h-4" />;
      case 'org': return <Users className="w-4 h-4" />;
      case 'flowchart': return <GitFork className="w-4 h-4" />;
      case 'floorplan': return <LayoutGrid className="w-4 h-4" />;
      case 'network': return <Network className="w-4 h-4" />;
      case 'rack': return <Server className="w-4 h-4" />;
      case 'circuit': return <Zap className="w-4 h-4" />;
      case 'pid': return <Gauge className="w-4 h-4" />;
      case 'swot': return <Target className="w-4 h-4" />;
      case 'block': return <Boxes className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs no-print p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0b4632] text-amber-300 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">
                  Pustaka Kategori & Template Spesialis
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  11 Kategori Lengkap
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pilih format diagram siap pakai dari daftar Gambar 3 untuk langsung bekerja
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 2 Kolom (Kiri: List 11 Kategori persis Gambar 3, Kanan: Preview & Detail) */}
        <div className="flex-1 overflow-hidden flex flex-col sm:flex-row">
          {/* Kolom Kiri: Menu 11 Kategori dari Gambar 3 */}
          <div className="w-full sm:w-60 border-r border-slate-200 bg-slate-50/50 p-3 overflow-y-auto space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
              Daftar Kategori (Gambar 3)
            </div>
            {SPECIALIST_CATEGORIES.map((cat) => {
              const isSelected = cat.id === selectedCategoryId;
              // Khusus Analisis SWOT: berikan aksen oranye emas jika terpilih
              const isSwot = cat.id === 'swot';

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                    isSelected
                      ? isSwot
                        ? 'bg-[#ea9932] text-white shadow-md font-bold'
                        : 'bg-[#0b4632] text-amber-300 shadow-md font-bold'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <span className={`shrink-0 ${isSelected ? (isSwot ? 'text-white' : 'text-amber-300') : 'text-slate-500'}`}>
                    {getCategoryIcon(cat.id)}
                  </span>
                  <span className="flex-1 truncate">{cat.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Kolom Kanan: Preview Template & Tombol Terapkan */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between space-y-6 bg-white">
            <div className="space-y-4">
              {/* Badge & Title */}
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: currentTemplate.accentColor }}
                >
                  {currentTemplate.badge}
                </span>
                <span className="text-xs text-slate-400">
                  {currentTemplate.nodes.length} Objek • {currentTemplate.edges.length} Konektor
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {currentTemplate.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {currentTemplate.description}
                </p>
              </div>

              {/* Box Preview Struktur Objek */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Komponen Utama yang Akan Dimuat:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentTemplate.nodes.map((n, idx) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2 text-xs"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 truncate">
                          {String(n.data.label || n.data.className || n.data.tableName || n.data.name || n.data.title || 'Objek')}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          Tipe: {n.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectTemplate(currentTemplate);
                  onClose();
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0b4632] hover:bg-[#073022] text-amber-300 font-bold text-xs shadow-md shadow-emerald-950/20 hover:scale-102 transition-all cursor-pointer"
              >
                <span>Muat Template {currentTemplate.name} ke Kanvas</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
