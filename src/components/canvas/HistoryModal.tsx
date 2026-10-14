'use client';

import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  ExternalLink, 
  X, 
  Layers, 
  FilePlus, 
  Calendar,
  CheckCircle2,
  CheckSquare,
  Square,
  AlertTriangle
} from 'lucide-react';
import { 
  getAllDiagramsMeta, 
  deleteDiagramFromStorage, 
  DiagramMetadata 
} from '@/lib/diagramStorage';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDiagramId: string;
  onLoadDiagram: (id: string) => void;
  onNewDiagram: () => void;
}

export default function HistoryModal({
  isOpen,
  onClose,
  currentDiagramId,
  onLoadDiagram,
  onNewDiagram,
}: HistoryModalProps) {
  const [diagrams, setDiagrams] = useState<DiagramMetadata[]>([]);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  const refreshList = () => {
    const list = getAllDiagramsMeta();
    setDiagrams(list);
  };

  useEffect(() => {
    if (isOpen) {
      refreshList();
      setSelectedIds([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = diagrams.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  // Toggle seleksi satu diagram
  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle pilih semua diagram yang tampil
  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length && filtered.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((d) => d.id));
    }
  };

  // Hapus satu diagram
  const handleDeleteSingle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Apakah Anda yakin ingin menghapus diagram ini dari riwayat?')) return;

    deleteDiagramFromStorage(id);
    if (isSupabaseConfigured && supabase) {
      supabase.from('diagrams').delete().eq('id', id).then(() => {});
    }
    setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
    refreshList();
  };

  // Hapus massal diagram terpilih (Batch Delete dengan Ceklist)
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;

    const count = selectedIds.length;
    const confirmMsg =
      count === 1
        ? 'Apakah Anda yakin ingin menghapus 1 diagram yang diceklis?'
        : `Apakah Anda yakin ingin menghapus ${count} diagram yang diceklis dari riwayat?`;

    if (!confirm(confirmMsg)) return;

    setIsDeletingBulk(true);
    try {
      selectedIds.forEach((id) => {
        deleteDiagramFromStorage(id);
        if (isSupabaseConfigured && supabase) {
          supabase.from('diagrams').delete().eq('id', id).then(() => {});
        }
      });
      setSelectedIds([]);
      refreshList();
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const isAllSelected = filtered.length > 0 && selectedIds.length === filtered.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs no-print p-4">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================= */}
        {/* HEADER MODAL */}
        {/* ========================================================= */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0b4632] text-amber-300 flex items-center justify-center shadow-md">
              <History className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Riwayat Diagram Anda
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  {diagrams.length} Berkas
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pilih diagram untuk dibuka kembali, atau gunakan ceklist untuk mengelola berkas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNewDiagram();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0b4632] hover:bg-[#073022] text-amber-300 text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>Diagram Baru</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Tutup dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PENCARIAN & BAR CEKLIST HAPUS MASSAL */}
        {/* ========================================================= */}
        <div className="p-3.5 border-b border-slate-100 bg-white space-y-2.5 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul diagram di riwayat..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-slate-50/50"
            />
          </div>

          {/* Bar Operasi Ceklist (Muncul saat ada diagram) */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between pt-1 px-1 text-xs">
              {/* Tombol Pilih Semua */}
              <button
                type="button"
                onClick={toggleSelectAll}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer select-none"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isAllSelected
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : selectedIds.length > 0
                      ? 'bg-emerald-100 border-emerald-600 text-emerald-800'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isAllSelected ? (
                    <span className="text-[10px] font-black">✓</span>
                  ) : selectedIds.length > 0 ? (
                    <span className="w-2 h-0.5 bg-emerald-700 block" />
                  ) : null}
                </div>
                <span>
                  {isAllSelected ? 'Batalkan Semua' : 'Pilih Semua'} ({filtered.length})
                </span>
              </button>

              {/* Aksi saat ada yang diceklis */}
              {selectedIds.length > 0 ? (
                <div className="flex items-center gap-2 animate-in fade-in duration-100">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {selectedIds.length} dipilih
                  </span>
                  <button
                    type="button"
                    onClick={handleDeleteSelected}
                    disabled={isDeletingBulk}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                    title="Hapus semua diagram yang diceklis"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Terpilih ({selectedIds.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedIds([])}
                    className="px-2 py-1 text-slate-400 hover:text-slate-600 text-xs font-medium cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400">
                  Centang kotak untuk menghapus beberapa berkas sekaligus
                </span>
              )}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* LIST RIWAYAT DENGAN CHECKBOX */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs">
              Tidak ada diagram yang cocok dengan kata kunci pencarian.
            </div>
          ) : (
            filtered.map((item) => {
              const isCurrent = item.id === currentDiagramId;
              const isChecked = selectedIds.includes(item.id);
              const formattedDate = new Date(item.updatedAt).toLocaleString('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short',
              });

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onLoadDiagram(item.id);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group ${
                    isChecked
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500'
                      : isCurrent
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/20 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Checkbox Ceklist Seleksi */}
                    <div
                      onClick={(e) => toggleSelectOne(item.id, e)}
                      title={isChecked ? 'Batal pilih diagram ini' : 'Pilih diagram ini untuk dihapus'}
                      className="p-1.5 -m-1 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white group-hover:border-emerald-500'
                        }`}
                      >
                        {isChecked && <span className="text-[10px] font-black">✓</span>}
                      </div>
                    </div>

                    {/* Ikon Diagram */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? 'bg-[#0b4632] text-amber-300'
                          : isChecked
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                    </div>

                    {/* Info Judul & Meta */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-800 truncate">
                          {item.title}
                        </h4>
                        {isCurrent && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#0b4632] text-amber-300 flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Sedang Aktif
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {formattedDate}
                        </span>
                        <span>•</span>
                        <span>{item.nodeCount} Bentuk</span>
                        <span>•</span>
                        <span>{item.edgeCount} Konektor</span>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Aksi Kanan (Hapus Tunggal & Buka) */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-3">
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSingle(item.id, e)}
                      title="Hapus diagram ini dari riwayat"
                      className="p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="px-3 py-1 rounded-xl bg-slate-100 group-hover:bg-[#0b4632] group-hover:text-amber-300 text-slate-600 text-xs font-semibold transition-colors flex items-center gap-1">
                      <span>Buka</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ========================================================= */}
        {/* FOOTER */}
        {/* ========================================================= */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Semua diagram tersimpan aman di riwayat browser Anda.</span>
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleDeleteSelected}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Hapus {selectedIds.length} Berkas
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
