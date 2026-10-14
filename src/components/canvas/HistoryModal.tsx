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
  CheckCircle2
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

  const refreshList = () => {
    const list = getAllDiagramsMeta();
    setDiagrams(list);
  };

  useEffect(() => {
    if (isOpen) {
      refreshList();
    }
  }, [isOpen]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Apakah Anda yakin ingin menghapus diagram ini dari riwayat?')) return;

    deleteDiagramFromStorage(id);
    if (isSupabaseConfigured && supabase) {
      supabase.from('diagrams').delete().eq('id', id).then(() => {});
    }
    refreshList();
  };

  if (!isOpen) return null;

  const filtered = diagrams.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs no-print p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0b4632] text-amber-300 flex items-center justify-center shadow-md">
              <History className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Riwayat Diagram Anda
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  {diagrams.length} Berkas
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pilih diagram yang pernah Anda buat untuk membukanya kembali
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
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pencarian */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul diagram di riwayat..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
            />
          </div>
        </div>

        {/* List Riwayat */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs">
              Tidak ada diagram yang cocok dengan kata kunci pencarian.
            </div>
          ) : (
            filtered.map((item) => {
              const isCurrent = item.id === currentDiagramId;
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
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group ${
                    isCurrent
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-600'
                      : 'border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/20 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? 'bg-[#0b4632] text-amber-300'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-800 truncate">
                          {item.title}
                        </h4>
                        {isCurrent && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#0b4632] text-amber-300 flex items-center gap-1">
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

                  <div className="flex items-center gap-1.5 shrink-0 ml-3">
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      title="Hapus Diagram dari Riwayat"
                      className="p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="px-3 py-1 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-600 text-xs font-semibold transition-colors flex items-center gap-1">
                      <span>Buka</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
          <span>Semua diagram otomatis tersimpan ke riwayat browser dan akun Anda.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
