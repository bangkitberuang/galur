'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  HelpCircle, 
  Edit3, 
  Boxes, 
  Waypoints, 
  Spline, 
  Minus,
  Sparkles
} from 'lucide-react';
import { 
  SHAPE_CATEGORIES, 
  ShapeCategory, 
  ShapeDefinition,
  getSavedActiveCategories, 
  saveActiveCategories 
} from '@/lib/shapeLibraries';
import MoreShapesModal from './MoreShapesModal';

interface SidebarProps {
  onAddNode: (type: string, label: string, customData?: Record<string, any>) => void;
  edgeType: string;
  setEdgeType: (type: string) => void;
}

export default function Sidebar({ onAddNode, edgeType, setEdgeType }: SidebarProps) {
  const [activeCategoryIds, setActiveCategoryIds] = useState<string[]>([]);
  const [openCategoryIds, setOpenCategoryIds] = useState<Record<string, boolean>>({
    papan_coret: false,
    umum: true,
    dasar: true,
    panah: false,
    diagram_alir: true,
    relasi_entitas: false,
    uml: false,
    problem_solving: true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isMoreShapesModalOpen, setIsMoreShapesModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load saved active categories on mount
  useEffect(() => {
    const saved = getSavedActiveCategories();
    setActiveCategoryIds(saved);
  }, []);

  // Global keyboard shortcut: Pressing '/' anywhere focuses the search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isMoreShapesModalOpen) {
        const activeEl = document.activeElement;
        const isInput =
          activeEl instanceof HTMLInputElement ||
          activeEl instanceof HTMLTextAreaElement ||
          activeEl?.getAttribute('contenteditable') === 'true';

        if (!isInput) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMoreShapesModalOpen]);

  const toggleCategory = (id: string) => {
    setOpenCategoryIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleApplyCategories = (newIds: string[]) => {
    setActiveCategoryIds(newIds);
    saveActiveCategories(newIds);
  };

  const onDragStart = (
    event: React.DragEvent,
    nodeType: string,
    defaultLabel: string,
    customData?: Record<string, any>
  ) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ type: nodeType, label: defaultLabel, customData })
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  // Filter categories and shapes based on search query
  const displayedCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const active = SHAPE_CATEGORIES.filter((cat) => activeCategoryIds.includes(cat.id));

    if (!query) {
      return active;
    }

    return active
      .map((cat) => {
        const matchingShapes = cat.shapes.filter(
          (shape) =>
            shape.label.toLowerCase().includes(query) ||
            shape.title.toLowerCase().includes(query) ||
            shape.tags.some((tag) => tag.toLowerCase().includes(query))
        );
        return {
          ...cat,
          shapes: matchingShapes,
        };
      })
      .filter((cat) => cat.shapes.length > 0);
  }, [activeCategoryIds, searchQuery]);

  const totalMatchingShapes = useMemo(() => {
    return displayedCategories.reduce((acc, cat) => acc + cat.shapes.length, 0);
  }, [displayedCategories]);

  return (
    <aside className="w-64 bg-[#1e232a] text-slate-200 border-r border-slate-800/80 flex flex-col h-full shadow-lg select-none no-print">
      {/* 1. Search Bar: "Ketik / untuk mencari" */}
      <div className="p-2.5 border-b border-slate-800/90 bg-[#191d24]">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ketik / untuk mencari"
            className="w-full bg-[#14181d] text-slate-200 placeholder-slate-400 text-xs rounded-lg pl-8 pr-7 py-1.5 border border-slate-700/80 focus:border-blue-500 focus:outline-hidden transition-colors"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="absolute right-2 text-[10px] font-mono text-slate-400 bg-slate-800 px-1 py-0.2 rounded border border-slate-700 pointer-events-none">
              /
            </span>
          )}
        </div>

        {searchQuery.trim() && (
          <div className="text-[10px] text-blue-400 pt-1.5 px-0.5 flex items-center justify-between">
            <span>Ditemukan {totalMatchingShapes} bentuk</span>
            <button
              onClick={() => setSearchQuery('')}
              className="hover:underline text-slate-400 cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* 2. Shape Categories Accordion */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 custom-scrollbar">
        {displayedCategories.map((category) => {
          const isOpen = searchQuery.trim() ? true : !!openCategoryIds[category.id];

          return (
            <div key={category.id} className="group/cat">
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span className="text-xs font-semibold text-slate-300 truncate group-hover/cat:text-white transition-colors">
                    {category.name}
                  </span>
                </div>

                {/* Aksesoris Header untuk Papan Coret */}
                {category.id === 'papan_coret' && (
                  <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                    <span 
                      title="Area coretan dan catatan cepat" 
                      className="hover:text-blue-400"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                    <span 
                      title="Tambah Catatan Ide Baru"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddNode('stickynote', 'Catatan Baru');
                      }}
                      className="hover:text-amber-400 hover:scale-110 cursor-pointer transition-transform"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                  </div>
                )}
              </button>

              {/* Accordion Content Grid */}
              {isOpen && (
                <div className="px-2.5 pb-2.5 pt-1 bg-[#181c22]/50">
                  <div className="grid grid-cols-3 gap-1.5">
                    {category.shapes.map((shape) => {
                      const Icon = shape.icon;
                      return (
                        <div
                          key={shape.id}
                          draggable
                          onDragStart={(e) =>
                            onDragStart(e, shape.type, shape.label, shape.defaultData)
                          }
                          onClick={() =>
                            onAddNode(shape.type, shape.label, shape.defaultData)
                          }
                          title={shape.title}
                          className="h-14 p-1 rounded-xl border border-slate-700/60 hover:border-blue-500 hover:bg-blue-900/20 bg-[#1e232a] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-all group/item shadow-2xs hover:shadow-xs"
                        >
                          <Icon className="w-4 h-4 text-slate-300 group-hover/item:text-blue-400 group-hover/item:scale-110 transition-transform mb-1" />
                          <span className="text-[9px] font-medium text-slate-400 group-hover/item:text-slate-200 text-center leading-tight truncate w-full px-0.5">
                            {shape.label || shape.title.split(' ')[0]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {displayedCategories.length === 0 && (
          <div className="p-6 text-center text-xs text-slate-400">
            <p>Tidak ada bentuk yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => setIsMoreShapesModalOpen(true)}
              className="mt-3 text-xs text-blue-400 hover:underline font-bold"
            >
              Lihat di Koleksi Lainnya
            </button>
          </div>
        )}
      </div>

      {/* 3. Bottom Action: "+ Bentuk Lainnya" */}
      <div className="p-2.5 border-t border-slate-800 bg-[#191d24] space-y-2.5">
        <button
          type="button"
          onClick={() => setIsMoreShapesModalOpen(true)}
          className="w-full py-2 px-3 rounded-xl bg-[#004a75] hover:bg-[#005f96] active:bg-[#003e63] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Bentuk Lainnya</span>
        </button>

        {/* Gaya Garis Konektor */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Waypoints className="w-3 h-3 text-emerald-400" />
              <span>Gaya Garis</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => setEdgeType('step')}
              className={`py-1 rounded-lg border text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                edgeType === 'step'
                  ? 'bg-emerald-600 border-emerald-500 text-white font-bold shadow-2xs'
                  : 'bg-[#14181d] border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600'
              }`}
              title="Garis Siku Patah (Visio Standard)"
            >
              <span>Siku</span>
            </button>

            <button
              type="button"
              onClick={() => setEdgeType('default')}
              className={`py-1 rounded-lg border text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                edgeType === 'default'
                  ? 'bg-emerald-600 border-emerald-500 text-white font-bold shadow-2xs'
                  : 'bg-[#14181d] border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600'
              }`}
              title="Garis Melengkung Halus (Bezier)"
            >
              <Spline className="w-3 h-3" />
              <span>Lengkung</span>
            </button>

            <button
              type="button"
              onClick={() => setEdgeType('straight')}
              className={`py-1 rounded-lg border text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                edgeType === 'straight'
                  ? 'bg-emerald-600 border-emerald-500 text-white font-bold shadow-2xs'
                  : 'bg-[#14181d] border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600'
              }`}
              title="Garis Lurus"
            >
              <Minus className="w-3 h-3" />
              <span>Lurus</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Modal "Bentuk Lainnya" (Pilih Koleksi Bentuk / Shape Libraries) */}
      <MoreShapesModal
        isOpen={isMoreShapesModalOpen}
        onClose={() => setIsMoreShapesModalOpen(false)}
        activeCategories={activeCategoryIds}
        onApplyCategories={handleApplyCategories}
      />
    </aside>
  );
}
