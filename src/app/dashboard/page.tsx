'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Layers, 
  GitFork, 
  Network, 
  Clock, 
  Trash2, 
  ExternalLink, 
  LogIn, 
  LogOut, 
  Cloud,
  HardDrive,
  Sparkles
} from 'lucide-react';
import { supabase, isSupabaseConfigured, DiagramRecord } from '@/lib/supabase';
import { getAllDiagramsMeta, deleteDiagramFromStorage } from '@/lib/diagramStorage';

export default function DashboardPage() {
  const [diagrams, setDiagrams] = useState<DiagramRecord[]>([]);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Periksa status login pengguna
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user);
        loadDiagrams(data.user?.id);
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
        loadDiagrams(session?.user?.id);
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    } else {
      loadDiagrams();
    }
  }, []);

  const loadDiagrams = async (userId?: string) => {
    setLoading(true);

    if (userId && isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('diagrams')
          .select('*')
          .order('updated_at', { ascending: false });

        if (data && !error) {
          setDiagrams(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Gagal memuat dari Supabase, beralih ke cache lokal', err);
      }
    }

    // Muat dari penyimpanan terpusat diagramStorage
    const metaList = getAllDiagramsMeta();
    const localDiagrams: DiagramRecord[] = metaList.map((m) => ({
      id: m.id,
      title: m.title,
      type: m.type,
      data: { nodes: [], edges: [] },
      updated_at: m.updatedAt,
    }));

    setDiagrams(localDiagrams);
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured || !supabase) {
      alert('Supabase belum dikonfigurasi di file .env.local. Anda saat ini menggunakan mode penyimpanan lokal browser.');
      return;
    }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setUser(null);
      loadDiagrams();
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Apakah Anda yakin ingin menghapus diagram ini?')) return;

    if (user && isSupabaseConfigured && supabase) {
      await supabase.from('diagrams').delete().eq('id', id);
    }
    deleteDiagramFromStorage(id);
    setDiagrams((prev) => prev.filter((d) => d.id !== id));
  };

  const filteredDiagrams = diagrams.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Header Bar */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
              G
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-slate-900">GALUR</span>
              <span className="hidden sm:inline-block text-xs text-slate-400 ml-2 font-normal">
                Dashboard Studio
              </span>
            </div>
          </Link>
        </div>

        {/* User Status / Login */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-slate-800">{user.email}</div>
                <div className="text-[10px] text-emerald-600 flex items-center justify-end gap-1">
                  <Cloud className="w-3 h-3" /> Akun Terhubung
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login dengan Google</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Banner Slogan */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-100 text-xs font-medium border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diagram & Flowchart Builder</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Garis Alur, Ngajentrekeun Struktur
            </h1>
            <p className="text-sm text-blue-100/80 leading-relaxed">
              Rancang alur kerja teknis ala Visio, bangun pohon pemikiran Mind Map interaktif, dan cetak dokumen ke format PDF atau JPG berkualitas tinggi.
            </p>
          </div>

          <Link
            href="/editor"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-blue-600 font-bold text-sm shadow-lg hover:shadow-xl hover:scale-102 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Mulai Kanvas Baru</span>
          </Link>
        </div>

        {/* Template Cepat */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Pilih Template Siap Pakai
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/editor"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <GitFork className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-800">Flowchart & Alur Keputusan</h3>
              <p className="text-xs text-slate-500 mt-1">
                Gaya standar Visio dengan bentuk proses, diamond IF, dan konektor siku-siku.
              </p>
            </Link>

            <Link
              href="/editor"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-800">Mind Map & Brainstorming</h3>
              <p className="text-xs text-slate-500 mt-1">
                Pohon ide dinamis dengan tombol tambah cabang otomatis dan garis lengkung.
              </p>
            </Link>

            <Link
              href="/editor"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-500 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-800">Arsitektur Cloud & Database</h3>
              <p className="text-xs text-slate-500 mt-1">
                Visualisasi sistem layanan server, cloud API, dan relasi basis data.
              </p>
            </Link>
          </div>
        </section>

        {/* Koleksi Diagram Pengguna */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Diagram Anda</h2>
              <p className="text-xs text-slate-500">
                {user ? 'Tersimpan aman di database Supabase Anda' : 'Tersimpan di browser lokal Anda (Login Google untuk simpan di cloud)'}
              </p>
            </div>

            {/* Pencarian */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul diagram..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Memuat diagram...</div>
          ) : filteredDiagrams.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-2">
              <Layers className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-600">Belum ada diagram yang cocok</p>
              <p className="text-xs text-slate-400">Mulai buat karya pertama Anda dengan menekan tombol Kanvas Baru.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDiagrams.map((item) => (
                <Link
                  key={item.id}
                  href={`/editor?id=${item.id}`}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all p-5 flex flex-col justify-between group h-44"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.type || 'Flowchart'}
                      </span>
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        title="Hapus Diagram"
                        className="p-1 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.updated_at ? new Date(item.updated_at).toLocaleDateString('id-ID') : 'Baru saja'}
                    </span>
                    <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Buka <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
