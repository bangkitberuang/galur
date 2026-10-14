'use client';

import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Boxes, 
  Eye, 
  CheckSquare, 
  Square as SquareIcon, 
  Sparkles,
  Info
} from 'lucide-react';
import { 
  SHAPE_CATEGORIES, 
  ShapeCategory, 
  saveActiveCategories 
} from '@/lib/shapeLibraries';

interface MoreShapesModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategories: string[];
  onApplyCategories: (selectedIds: string[]) => void;
}

export default function MoreShapesModal({
  isOpen,
  onClose,
  activeCategories,
  onApplyCategories,
}: MoreShapesModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(activeCategories);
  const [rememberSettings, setRememberSettings] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [previewCategoryId, setPreviewCategoryId] = useState<string>(
    activeCategories[0] || 'diagram_alir'
  );

  // Sync state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedIds(activeCategories);
    }
  }, [isOpen, activeCategories]);

  if (!isOpen) return null;

  const toggleCategory = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    if (rememberSettings) {
      saveActiveCategories(selectedIds);
    }
    onApplyCategories(selectedIds);
    onClose();
  };

  const groups: Array<'STANDAR' | 'IKP & MULTIMEDIA' | 'PERANGKAT LUNAK' | 'BISNIS & INOVASI'> = [
    'STANDAR',
    'IKP & MULTIMEDIA',
    'PERANGKAT LUNAK',
    'BISNIS & INOVASI',
  ];

  const currentPreviewCategory =
    SHAPE_CATEGORIES.find((cat) => cat.id === previewCategoryId) || SHAPE_CATEGORIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <div 
        className="w-full max-w-4xl bg-white text-slate-800 rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Dialog */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200 shadow-xs">
              <Boxes className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-wide">
                Koleksi Bentuk (Shape Libraries)
              </h2>
              <p className="text-[11px] text-slate-500">
                Pilih pustaka bentuk yang ingin ditampilkan di panel samping kiri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Tutup dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Split Pane (Kiri: Checklist Kategori, Kanan: Preview Bentuk) */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Kolom Kiri: Daftar Kategori Berkelompok */}
          <div className="w-full md:w-72 bg-slate-50/60 border-r border-slate-200 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {groups.map((group) => {
                const catsInGroup = SHAPE_CATEGORIES.filter((c) => c.group === group);
                if (catsInGroup.length === 0) return null;

                return (
                  <div key={group} className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 py-1">
                      {group}
                    </div>
                    <div className="space-y-0.5">
                      {catsInGroup.map((category) => {
                        const isChecked = selectedIds.includes(category.id);
                        const isPreviewing = previewCategoryId === category.id;

                        return (
                          <div
                            key={category.id}
                            onClick={() => setPreviewCategoryId(category.id)}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-all text-xs ${
                              isPreviewing
                                ? 'bg-emerald-100/70 text-emerald-900 border border-emerald-300 font-bold shadow-2xs'
                                : 'hover:bg-slate-100/80 text-slate-700'
                            }`}
                          >
                            <label 
                              className="flex items-center gap-2.5 cursor-pointer select-none flex-1 min-w-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleCategory(category.id)}
                                className="w-4 h-4 rounded-sm border-slate-300 bg-white text-emerald-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-emerald-600"
                              />
                              <span className="truncate">{category.name}</span>
                            </label>

                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200/80 text-slate-600 shrink-0 ml-1">
                              {category.shapes.length}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Opsi Bawah Kolom Kiri */}
            <div className="p-3 border-t border-slate-200 bg-slate-100/60 space-y-2 text-xs text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="w-3.5 h-3.5 rounded-sm border-slate-300 bg-white text-emerald-600 cursor-pointer accent-emerald-600"
                />
                <span className="text-[11px]">Tampilkan label bentuk</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberSettings}
                  onChange={(e) => setRememberSettings(e.target.checked)}
                  className="w-3.5 h-3.5 rounded-sm border-slate-300 bg-white text-emerald-600 cursor-pointer accent-emerald-600"
                />
                <span className="text-[11px] text-emerald-700 font-semibold">Ingat pengaturan ini</span>
              </label>
            </div>
          </div>

          {/* Kolom Kanan: Preview Koleksi yang Dipilih */}
          <div className="flex-1 flex flex-col min-h-0 bg-white p-4 sm:p-5 overflow-y-auto">
            {/* Header Preview */}
            <div className="border-b border-slate-100 pb-3 mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {currentPreviewCategory.name}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {currentPreviewCategory.group}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {currentPreviewCategory.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleCategory(currentPreviewCategory.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  selectedIds.includes(currentPreviewCategory.id)
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                    : 'bg-[#0b4632] hover:bg-[#073022] text-amber-300 shadow-md'
                }`}
              >
                {selectedIds.includes(currentPreviewCategory.id) ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Aktif di Panel</span>
                  </>
                ) : (
                  <span>+ Aktifkan Koleksi Ini</span>
                )}
              </button>
            </div>

            {/* Grid Preview Bentuk */}
            <div className="flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {currentPreviewCategory.shapes.map((shape) => {
                  const Icon = shape.icon;
                  return (
                    <div
                      key={shape.id}
                      className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center text-center group cursor-default shadow-3xs"
                      title={shape.title}
                    >
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-slate-600 group-hover:text-emerald-700 group-hover:scale-110 transition-transform mb-2 border border-slate-200/80 shadow-3xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      {showLabels && (
                        <span className="text-xs font-medium text-slate-800 truncate w-full px-1">
                          {shape.label || shape.title.split(' ')[0]}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 truncate w-full px-1 mt-0.5">
                        {shape.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Dialog */}
        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="text-xs text-slate-500">
            <strong className="text-slate-800">{selectedIds.length}</strong> dari{' '}
            <strong className="text-slate-800">{SHAPE_CATEGORIES.length}</strong> koleksi aktif di panel
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0b4632] hover:bg-[#073022] text-amber-300 shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Terapkan Pengaturan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
