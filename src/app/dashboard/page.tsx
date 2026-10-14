'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Sparkles,
  ArrowRight,
  Check,
  Code2,
  Database,
  Users,
  LayoutGrid,
  Server,
  Zap,
  Gauge,
  Target,
  Boxes,
  BookOpen
} from 'lucide-react';
import { supabase, isSupabaseConfigured, DiagramRecord } from '@/lib/supabase';
import { getAllDiagramsMeta, deleteDiagramFromStorage } from '@/lib/diagramStorage';
import { SPECIALIST_CATEGORIES } from '@/lib/specialistTemplates';
import AboutGalurSection from '@/components/dashboard/AboutGalurSection';
import EcosystemFooter from '@/components/common/EcosystemFooter';
import { APP_VERSION, APP_LOGO_URL } from '@/lib/version';

export default function DashboardPage() {
  const [diagrams, setDiagrams] = useState<DiagramRecord[]>([]);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('swot');
  const [dashboardTab, setDashboardTab] = useState<'diagrams' | 'about'>('diagrams');

  // Deteksi query param atau hash untuk tab Tentang
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'about' || window.location.hash === '#about') {
        setDashboardTab('about');
      }
    }
  }, []);

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
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
              <Image
                src={APP_LOGO_URL}
                alt="GALUR Logo - Macan Tutul Jawa"
                width={56}
                height={56}
                className="w-full h-full object-contain filter drop-shadow-sm"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-[#0b4632]">GALUR</span>
                <span className="hidden sm:inline-block text-xs text-amber-700 font-bold px-2 py-0.5 bg-amber-50 rounded-full border border-amber-200">
                  Dashboard Studio
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                  {APP_VERSION}
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* User Status / Login */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDashboardTab(dashboardTab === 'about' ? 'diagrams' : 'about')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              dashboardTab === 'about'
                ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs'
                : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100 border border-transparent'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Tentang & Filosofi</span>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-slate-800">{user.email}</div>
                <div className="text-[10px] text-emerald-700 font-semibold flex items-center justify-end gap-1">
                  <Cloud className="w-3 h-3 text-emerald-600" /> Akun Terhubung
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
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0b4632] hover:bg-[#073022] text-amber-300 text-xs font-bold shadow-xs transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-300" />
              <span>Login dengan Google</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-6">
        {/* Dashboard Main View Tab Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setDashboardTab('diagrams')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                dashboardTab === 'diagrams'
                  ? 'bg-[#0b4632] text-amber-300 shadow-md ring-2 ring-emerald-900/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Studio Diagram & Template ({SPECIALIST_CATEGORIES.length})</span>
            </button>

            <button
              onClick={() => setDashboardTab('about')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                dashboardTab === 'about'
                  ? 'bg-[#0b4632] text-amber-300 shadow-md ring-2 ring-emerald-900/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>Tentang GALUR & Filosofi</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold hidden sm:inline">
                6 Bagian Resmi
              </span>
            </button>
          </div>

          <Link
            href="/editor"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0b4632] font-black text-xs shadow-md transition-all hover:scale-102"
          >
            <Plus className="w-3.5 h-3.5 text-[#0b4632] stroke-[3]" />
            <span>Mulai Kanvas Baru</span>
          </Link>
        </div>

        {dashboardTab === 'about' ? (
          <AboutGalurSection />
        ) : (
          <>
            {/* Banner Slogan Studio dengan Maskot Galur (Hanya ditampilkan pada Tab Studio Diagram) */}
            <div className="bg-gradient-to-r from-[#0b4632] via-[#0d5940] to-[#072419] rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-800/40">
              <div className="flex items-center gap-6">
                <div className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 hidden sm:flex items-center justify-center transition-transform hover:scale-105 duration-200">
                  <Image
                    src={APP_LOGO_URL}
                    alt="Maskot Galur"
                    width={144}
                    height={144}
                    className="w-full h-full object-contain filter drop-shadow-2xl"
                    priority
                  />
                </div>
                <div className="space-y-1.5 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/10">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Diagram & Flowchart Builder</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                    Garis Alur, Ngajentrekeun Struktur
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                    Merangkai gagasan, memperjelas alur, dan membangun pemahaman. Parabot digital untuk menyusun flowchart, bagan organisasi, alur kerja teknis, hingga pohon mind map interaktif.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setDashboardTab('about')}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-bold text-xs border border-white/20 bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white backdrop-blur-md transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <span>Baca Filosofi GALUR</span>
                </button>
                <Link
                  href="/editor"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-[#0b4632] font-black text-sm shadow-lg hover:shadow-xl hover:scale-102 transition-all"
                >
                  <Plus className="w-4 h-4 text-[#0b4632] stroke-[3]" />
                  <span>Mulai Kanvas Baru</span>
                </Link>
              </div>
            </div>

            {/* Kategori & Template Spesialis (11 Kategori Sesuai Gambar 3) */}
            <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-800">
                  Kategori & Template Spesialis
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {SPECIALIST_CATEGORIES.length} Format & Template Spesialis
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih format diagram siap pakai sesuai daftar kategori teknis & bisnis
              </p>
            </div>
          </div>

          {/* Tab Pill 11 Kategori dari Gambar 3 */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {SPECIALIST_CATEGORIES.map((cat) => {
              const isSelected = cat.id === activeCategory;
              const isSwot = cat.id === 'swot';

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? isSwot
                        ? 'bg-[#ea9932] text-white shadow-md shadow-amber-500/20 ring-2 ring-[#ea9932]/40'
                        : 'bg-[#0b4632] text-amber-300 shadow-md shadow-emerald-950/20'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-800'
                  }`}
                >
                  <span>{cat.name}</span>
                  {cat.isAI && (
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-700 border border-purple-200/80 shrink-0">
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Featured Selected Template Card */}
          {(() => {
            const currentCat = SPECIALIST_CATEGORIES.find((c) => c.id === activeCategory) || SPECIALIST_CATEGORIES[0];
            return (
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all animate-in fade-in duration-150">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: currentCat.accentColor }}
                    >
                      {currentCat.badge}
                    </span>
                    {currentCat.isAI && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1 shadow-2xs">
                        <Sparkles className="w-3 h-3 text-purple-600 fill-purple-600" />
                        AI Framework
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-medium">
                      {currentCat.nodes.length} Bentuk Pre-configured • {currentCat.edges.length} Relasi Garis
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Template {currentCat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {currentCat.description}
                    </p>
                  </div>

                  {/* List komponen contoh */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentCat.nodes.slice(0, 4).map((n) => (
                      <span
                        key={n.id}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {String(n.data.label || n.data.className || n.data.tableName || n.data.name || n.data.title || 'Objek')}
                      </span>
                    ))}
                    {currentCat.nodes.length > 4 && (
                      <span className="text-[11px] font-medium px-2 py-1 text-slate-400">
                        +{currentCat.nodes.length - 4} lainnya
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/editor?template=${currentCat.id}`}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0b4632] hover:bg-[#073022] text-amber-300 font-bold text-sm shadow-md shadow-emerald-950/20 hover:scale-102 transition-all shrink-0"
                >
                  <span>Buka Template {currentCat.name}</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </Link>
              </div>
            );
          })()}
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
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
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
                  className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all p-5 flex flex-col justify-between group h-44"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
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

                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-emerald-800 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-700" />
                      {item.updated_at ? new Date(item.updated_at).toLocaleDateString('id-ID') : 'Baru saja'}
                    </span>
                    <span className="text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Buka <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
          </>
        )}
      </main>

      {/* Official BANGKIT Beruang Ecosystem Footer */}
      <EcosystemFooter variant="light" className="mt-14" />
    </div>
  );
}
