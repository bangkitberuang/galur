'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  useReactFlow, 
  useViewport 
} from '@xyflow/react';
import { 
  ListFilter, 
  Plus, 
  Layers, 
  Maximize2, 
  Undo2, 
  Redo2, 
  Minus, 
  Maximize, 
  Minimize, 
  HelpCircle, 
  MoreVertical, 
  Edit2, 
  Copy, 
  Trash2, 
  Check, 
  X,
  FileText,
  ChevronDown
} from 'lucide-react';
import { DiagramPage } from '@/lib/diagramStorage';

interface CanvasBottomBarProps {
  pages: DiagramPage[];
  activePageId: string;
  onSwitchPage: (pageId: string) => void;
  onAddPage: () => void;
  onRenamePage: (pageId: string, newName: string) => void;
  onDuplicatePage: (pageId: string) => void;
  onDeletePage: (pageId: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onOpenShortcutsHelp?: () => void;
}

export default function CanvasBottomBar({
  pages,
  activePageId,
  onSwitchPage,
  onAddPage,
  onRenamePage,
  onDuplicatePage,
  onDeletePage,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onOpenShortcutsHelp,
}: CanvasBottomBarProps) {
  const { zoomIn, zoomOut, zoomTo, fitView } = useReactFlow();
  const { zoom } = useViewport();

  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [activeMenuPageId, setActiveMenuPageId] = useState<string | null>(null);
  const [isZoomMenuOpen, setIsZoomMenuOpen] = useState(false);
  const [isPagesDrawerOpen, setIsPagesDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const editInputRef = useRef<HTMLInputElement>(null);

  // Monitor fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (editingPageId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingPageId]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const startRename = (page: DiagramPage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveMenuPageId(null);
    setEditingPageId(page.id);
    setEditingName(page.name);
  };

  const saveRename = () => {
    if (editingPageId && editingName.trim()) {
      onRenamePage(editingPageId, editingName.trim());
    }
    setEditingPageId(null);
  };

  const zoomPercent = Math.round((zoom || 1) * 100);

  const zoomPresets = [50, 75, 100, 125, 150, 200];

  return (
    <div className="w-full h-10 bg-white border-t border-slate-200 flex items-center justify-between px-2 text-xs select-none shadow-xs z-30 shrink-0 relative no-print">
      {/* ========================================================= */}
      {/* SISI KIRI: Tombol Drawer Halaman, Tab Halaman & Quick Tools */}
      {/* ========================================================= */}
      <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar flex-1 min-w-0 pr-3">
        {/* Tombol Ringkasan Halaman (Drawer Icon) */}
        <button
          type="button"
          onClick={() => setIsPagesDrawerOpen(!isPagesDrawerOpen)}
          title="Daftar & Kelola Seluruh Halaman (Drawer)"
          className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
            isPagesDrawerOpen
              ? 'bg-blue-100 text-blue-700 font-bold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <ListFilter className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-200 mx-0.5 shrink-0" />

        {/* Tab Daftar Halaman */}
        <div className="flex items-center gap-1 flex-nowrap">
          {pages.map((page) => {
            const isActive = page.id === activePageId;
            const isEditing = editingPageId === page.id;

            return (
              <div
                key={page.id}
                onClick={() => !isEditing && onSwitchPage(page.id)}
                onDoubleClick={(e) => startRename(page, e)}
                className={`relative group flex items-center h-8 px-2.5 rounded-t-lg transition-all cursor-pointer shrink-0 border-b-2 ${
                  isActive
                    ? 'bg-slate-100/90 text-slate-900 font-bold border-indigo-600 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-transparent font-medium'
                }`}
                title={`Klik untuk membuka "${page.name}" (Klik ganda untuk ganti nama)`}
              >
                {/* Prefix Badge & Name */}
                {isEditing ? (
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={saveRename}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveRename();
                        if (e.key === 'Escape') setEditingPageId(null);
                      }}
                      className="w-24 px-1.5 py-0.5 text-xs bg-white border border-blue-500 rounded text-slate-800 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={saveRename}
                      className="p-0.5 text-emerald-600 hover:text-emerald-700"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    {/* Badge [M] atau Ikon Halaman sesuai referensi */}
                    <span
                      className={`text-[9px] font-black font-mono px-1 py-0.2 rounded leading-none ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 text-slate-600 group-hover:bg-slate-300'
                      }`}
                    >
                      M
                    </span>
                    <span className="truncate max-w-[110px] text-xs">
                      {page.name}
                    </span>

                    {/* Menu Halaman (Rename, Duplicate, Delete) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuPageId(activeMenuPageId === page.id ? null : page.id);
                      }}
                      className="p-0.5 rounded text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5"
                      title="Opsi Halaman"
                    >
                      <MoreVertical className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Dropdown Menu Opsi Halaman */}
                {activeMenuPageId === page.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-9 left-0 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 font-normal text-slate-700"
                  >
                    <button
                      type="button"
                      onClick={(e) => startRename(page, e)}
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Ganti Nama</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMenuPageId(null);
                        onDuplicatePage(page.id);
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Duplikat</span>
                    </button>
                    {pages.length > 1 && (
                      <>
                        <div className="h-[1px] bg-slate-100 my-1" />
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuPageId(null);
                            onDeletePage(page.id);
                          }}
                          className="w-full px-3 py-1.5 text-left text-xs hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus Halaman</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Tombol Tambah Halaman Baru (+) */}
          <button
            type="button"
            onClick={onAddPage}
            title="Tambah Halaman Baru (+)"
            className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer shrink-0 ml-1"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <div className="h-4 w-[1px] bg-slate-200 mx-1 shrink-0" />

        {/* Quick Tools samping Tabs: Layers & Fit View */}
        <button
          type="button"
          onClick={() => fitView({ duration: 300, padding: 0.2 })}
          title="Pusatkan Seluruh Objek (Fit View)"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ========================================================= */}
      {/* SISI KANAN: Undo, Redo, Zoom Controls, Fullscreen & Help */}
      {/* ========================================================= */}
      <div className="flex items-center gap-1 shrink-0 pl-2">
        {/* BANGKIT BERUANG ECOSYSTEM BRAND PILL (Sesuai Permintaan User) */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 text-[10px] font-extrabold uppercase tracking-wider transition-all select-none mr-1 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span>BANGKIT BERUANG</span>
          <span className="text-emerald-700 font-bold lowercase tracking-normal">ecosystem</span>
        </div>

        <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

        {/* Undo */}
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          title="Urungkan Perubahan (Ctrl+Z)"
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          title="Ulangi Perubahan (Ctrl+Y)"
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-slate-200 mx-1" />

        {/* Zoom Out (-) */}
        <button
          type="button"
          onClick={() => zoomOut({ duration: 150 })}
          title="Perkecil Kanvas (Zoom Out)"
          className="p-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        {/* Zoom Percentage Indicator & Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsZoomMenuOpen(!isZoomMenuOpen)}
            className="px-2 py-0.5 rounded-md hover:bg-slate-100 font-mono font-bold text-slate-700 text-xs transition-colors cursor-pointer flex items-center gap-0.5"
            title="Klik untuk memilih skala zoom"
          >
            <span>{zoomPercent}%</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isZoomMenuOpen && (
            <div
              onClick={() => setIsZoomMenuOpen(false)}
              className="absolute bottom-9 right-0 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 font-sans"
            >
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                Skala Kanvas
              </div>
              {zoomPresets.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => zoomTo(level / 100, { duration: 200 })}
                  className={`w-full px-3 py-1 text-left text-xs hover:bg-slate-50 flex items-center justify-between cursor-pointer ${
                    Math.abs(zoomPercent - level) < 3 ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{level}%</span>
                  {Math.abs(zoomPercent - level) < 3 && <Check className="w-3 h-3 text-blue-600 stroke-[3]" />}
                </button>
              ))}
              <div className="h-[1px] bg-slate-100 my-1" />
              <button
                type="button"
                onClick={() => fitView({ duration: 300, padding: 0.2 })}
                className="w-full px-3 py-1 text-left text-xs hover:bg-slate-50 text-slate-700 flex items-center justify-between cursor-pointer font-medium"
              >
                <span>Fokus Seluruh (Fit)</span>
              </button>
              <button
                type="button"
                onClick={() => zoomTo(1, { duration: 200 })}
                className="w-full px-3 py-1 text-left text-xs hover:bg-slate-50 text-slate-700 flex items-center justify-between cursor-pointer font-medium"
              >
                <span>Reset 100%</span>
              </button>
            </div>
          )}
        </div>

        {/* Zoom In (+) */}
        <button
          type="button"
          onClick={() => zoomIn({ duration: 150 })}
          title="Perbesar Kanvas (Zoom In)"
          className="p-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-slate-200 mx-1" />

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Keluar Layar Penuh (Esc)' : 'Tampilan Layar Penuh'}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
        </button>

        {/* Help / Shortcuts */}
        <button
          type="button"
          onClick={() => {
            if (onOpenShortcutsHelp) onOpenShortcutsHelp();
            else setIsShortcutsOpen(!isShortcutsOpen);
          }}
          title="Bantuan & Pintasan Keyboard (?)"
          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ========================================================= */}
      {/* DRAWER POPUP: Daftar Semua Halaman (Bila Tombol Drawer Aktif) */}
      {/* ========================================================= */}
      {isPagesDrawerOpen && (
        <div
          onClick={() => setIsPagesDrawerOpen(false)}
          className="absolute bottom-11 left-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-xs text-slate-800">
                Semua Halaman ({pages.length})
              </span>
            </div>
            <button
              type="button"
              onClick={onAddPage}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
              <span>Halaman Baru</span>
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto p-1.5 divide-y divide-slate-50">
            {pages.map((p, idx) => (
              <div
                key={p.id}
                onClick={() => {
                  onSwitchPage(p.id);
                  setIsPagesDrawerOpen(false);
                }}
                className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                  p.id === activePageId
                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold'
                    : 'hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-md bg-slate-200/80 text-slate-600 text-[10px] font-mono flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span className="truncate text-xs">{p.name}</span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {p.nodes?.length || 0} node
                  </span>
                  {p.id === activePageId && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 ml-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL / POPOVER SHORTCUTS BANTUAN */}
      {/* ========================================================= */}
      {isShortcutsOpen && (
        <div
          onClick={() => setIsShortcutsOpen(false)}
          className="absolute bottom-11 right-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Pintasan Keyboard GALUR</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsShortcutsOpen(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center justify-between py-1">
              <span>Cari Koleksi Bentuk</span>
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold text-slate-800">/</kbd>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>Urungkan (Undo)</span>
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold text-slate-800">Ctrl + Z</kbd>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>Ulangi (Redo)</span>
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold text-slate-800">Ctrl + Y</kbd>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>Hapus Bentuk / Garis</span>
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold text-slate-800">Delete / Backspace</kbd>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>Geser Kanvas (Pan)</span>
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold text-slate-800">Space + Drag</kbd>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>Pratinjau Cetak (Print)</span>
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold text-slate-800">Ctrl + P</kbd>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>Ekspor & Unduh Berkas</span>
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold text-slate-800">Ctrl + E</kbd>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>Edit Teks Langsung</span>
              <span className="text-[11px] text-slate-400">Klik Ganda pada Bentuk</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>Ganti Nama Halaman</span>
              <span className="text-[11px] text-slate-400">Klik Ganda pada Tab Halaman</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
