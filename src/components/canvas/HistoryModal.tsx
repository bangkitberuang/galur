'use client';

import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  ExternalLink, 
  Clock, 
  X, 
  Layers, 
  FilePlus, 
  Check, 
  FolderOpen,
  Calendar
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface SavedDiagramMeta {
  id: string;
  title: string;
  updatedAt: string;
  nodeCount: number;
  edgeCount: number;
}

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
  const [diagrams, setDiagrams] = useState<SavedDiagramMeta[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Muat seluruh daftar riwayat diagram
  const loadHistory = async () => {
    setLoading(true);
    const list: SavedDiagramMeta[] = [];

    // 1. Baca dari Supabase jika terhubung
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase
          .from('diagrams')
          .select('id, title, updated_at, data')
          .order('updated_at', { ascending: false });

        if (data && data.length > 0) {
          data.forEach((item: any) => {
            list.push({
              id: item.id,
              title: item.title || 'Diagram Tanpa Judul',
              updatedAt: item.updated_at || new Date().toISOString(),
              nodeCount: item.data?.nodes?.length || 0,
              edgeCount: item.data?.edges?.length || 0,
            });
          });
        }
      } catch (e) {
        console.warn('Gagal memuat dari Supabase:', e);
      }
    }

    // 2. Baca dari LocalStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('galur_diagram_') && !key.includes('index')) {
        const id = key.replace('galur_diagram_', '');
        // Cegah duplikasi jika sudah dimuat dari Supabase
        if (!list.some((item) => item.id === id)) {
          try {
            const raw = localStorage.getItem(key);
            if (raw) {
              const parsed = JSON.parse(raw);
              list.push({
                id,
                title: parsed.title || 'Diagram Tanpa Judul',
                updatedAt: parsed.updated_at || new Date().toISOString(),
                nodeCount: parsed.nodes?.length || 0,
                edgeCount: parsed.edges?.length || 0,
              });
            }
          } catch (err) {}
        }
      }
    }

    // Urutkan dari yang paling baru diubah
    list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    setDiagrams(list);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Hapus diagram ini dari riwayat penyimpanan?')) return;

    localStorage.removeItem(`galur_diagram_${id}`);
    if (isSupabaseConfigured && supabase) {
      supabase.from('diagrams').delete().eq('id', id).then(() => {});
    }

    setDiagrams((prev) => prev.filter((item) => item.id !== id));
  };

  if (!isOpen) return null;

  const filtered = diagrams.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs no-print">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Riwayat & Arsip Diagram
              </h2>
              <p className="text-xs text-slate-500">
                Seluruh diagram yang pernah Anda simpan ({diagrams.length} diagram tersimpan)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNewDiagram();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>Diagram Baru</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
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
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        {/* List Riwayat */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">
              Memuat riwayat diagram...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <FolderOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-600">
                Belum ada riwayat diagram yang tersimpan
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Setiap kali Anda menekan tombol <strong>Simpan</strong>, diagram akan otomatis tercatat dan dapat dibuka kembali kapan saja di sini.
              </p>
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
                      ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50/70 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'
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
                          <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-600 text-white">
                            Sedang Dibuka
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
                      title="Hapus dari Riwayat"
                      className="p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
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
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
          <span>Pilih salah satu berkas di atas untuk memuatnya ke kanvas.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
