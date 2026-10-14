'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  GitFork, 
  Network, 
  FileText, 
  Download, 
  Printer, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Palette,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fcfdfb] text-slate-800 flex flex-col selection:bg-emerald-700 selection:text-white">
      {/* Top Navbar */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 md:px-12 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 transition-transform hover:scale-105 duration-200">
            <Image
              src="/logo.png"
              alt="GALUR Logo"
              width={64}
              height={64}
              className="w-full h-full object-contain filter drop-shadow-md"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tight text-[#0b4632]">GALUR</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium tracking-wide">
              Diagram & Flowchart Builder
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard?tab=about"
            className="text-xs font-semibold text-slate-600 hover:text-emerald-800 px-3 py-2 transition-colors flex items-center gap-1.5"
          >
            <span>Tentang & Filosofi</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-slate-600 hover:text-emerald-800 px-3 py-2 transition-colors hidden sm:block"
          >
            Dashboard
          </Link>
          <Link
            href="/editor"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0b4632] hover:bg-[#073022] text-amber-300 text-xs font-bold shadow-md shadow-emerald-950/20 transition-all hover:scale-102"
          >
            <span>Buka Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 px-6 md:px-12 max-w-6xl mx-auto text-center space-y-6">
        {/* Mascot & Badge Tagline */}
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-64 md:h-64 transition-transform hover:scale-105 duration-300">
            <Image
              src="/logo.png"
              alt="Maskot Macan Tutul Jawa Galur"
              width={256}
              height={256}
              className="w-full h-full object-contain filter drop-shadow-2xl"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-[#0b4632] text-xs sm:text-sm font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Garis Alur, Ngajentrekeun Struktur</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
          Visualisasi Alur & Pemikiran dengan{' '}
          <span className="bg-gradient-to-r from-[#0b4632] via-emerald-700 to-amber-600 bg-clip-text text-transparent">
            Presisi & Estetika
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Aplikasi pembuat diagram untuk merangkai gagasan, memperjelas alur, dan membangun pemahaman. Dari flowchart dan alur proses kerja teknis ala <strong>Microsoft Visio</strong> hingga eksplorasi <strong>Mind Map</strong> interaktif, hadir sebagai parabot digital yang menyederhanakan kerumitan.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/editor"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[#0b4632] hover:bg-[#073022] text-amber-300 font-bold text-sm shadow-xl shadow-emerald-950/25 hover:scale-102 transition-all"
          >
            <span>Mulai Buat Diagram</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-800 text-slate-700 font-semibold text-sm shadow-xs transition-all hover:bg-emerald-50/30"
          >
            <span>Masuk ke Dashboard</span>
          </Link>
        </div>

        {/* Preview Mockup Card */}
        <div className="pt-8">
          <div className="relative mx-auto rounded-3xl p-3 bg-gradient-to-b from-slate-200 to-slate-100 shadow-2xl border border-slate-200/80 max-w-4xl">
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-inner p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
              {/* Flowchart Mock Node */}
              <div className="space-y-4 w-full md:w-auto text-left">
                <div className="px-4 py-2 rounded-full border-2 border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold text-xs inline-block shadow-xs">
                  ● Mulai Proses
                </div>
                <div className="w-0.5 h-6 bg-blue-500 mx-6" />
                <div className="px-5 py-3 rounded-xl border-2 border-blue-500 bg-white text-slate-800 font-semibold text-xs shadow-sm max-w-[200px]">
                  Validasi Struktur Data (Visio Mode)
                </div>
                <div className="w-0.5 h-6 bg-blue-500 mx-6" />
                <div className="px-4 py-2.5 rounded-xl border-2 border-purple-500 bg-purple-50 text-purple-900 font-semibold text-xs shadow-xs inline-block">
                  Database & Cloud Supabase
                </div>
              </div>

              {/* Mind Map Mock Node */}
              <div className="border-l-2 border-dashed border-slate-200 pl-8 space-y-3 w-full md:w-auto text-left">
                <div className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md">
                  Pohon Pemikiran (Mind Map)
                </div>
                <div className="pl-4 space-y-2 border-l-2 border-blue-400">
                  <div className="px-3.5 py-1.5 rounded-lg border border-blue-300 bg-blue-50 text-blue-900 text-[11px] font-medium">
                    → Cabang Ide 1: Fleksibel
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 text-[11px] font-medium">
                    → Cabang Ide 2: Ekspor PDF / JPG
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg border border-purple-300 bg-purple-50 text-purple-900 text-[11px] font-medium">
                    → Cabang Ide 3: Multi-User Login
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Identity Pillars Banner */}
      <section className="py-8 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-[#0b4632] via-[#0d5940] to-[#072419] p-6 sm:p-8 text-white shadow-xl border border-emerald-800/40 flex flex-col md:flex-row items-center gap-6">
          <div className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center transition-transform hover:scale-105 duration-200">
            <Image
              src="/logo.png"
              alt="GALUR Mascot"
              width={144}
              height={144}
              className="w-full h-full object-contain filter drop-shadow-2xl"
            />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Kekuatan Identitas GALUR</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-medium">
              &ldquo;Kekuatan identitas GALUR terletak pada perpaduan tiga hal: <strong className="text-amber-300 font-bold">nama yang berakar pada nuansa bahasa Sunda</strong>, <strong className="text-white font-bold">fungsi yang jelas sebagai alat visualisasi</strong>, dan <strong className="text-amber-300 font-bold">maskot Macan Tutul Jawa yang memberi karakter ketajaman analisis sekaligus pesan kepedulian</strong>. Itu membuat GALUR lebih dari sekadar aplikasi diagram—ia menjadi bagian dari cerita besar <strong className="text-white underline decoration-amber-400 font-black">BANGKIT BERUANG</strong> tentang berkarya melalui teknologi yang bermanfaat untuk Jawa Barat.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 px-6 md:px-12 bg-white border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Mengapa Memilih GALUR?
            </h2>
            <p className="text-sm text-slate-500">
              Dirancang untuk mengatasi keterbatasan tool konvensional yang kaku dan membosankan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <GitFork className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Ketepatan Ala Visio</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dilengkapi bentuk geometri standar seperti kotak proses, diamond logika keputusan (IF), silinder basis data, dan garis siku-siku patah magnetik.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Mind Mapping Cepat</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kembangkan ide dengan cabang dinamis. Klik ikon tambah cabang pada node dan kanvas akan menghubungkannya secara otomatis.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-400 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Printer className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Cetak & Ekspor Fleksibel</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unduh hasil diagram Anda menjadi dokumen <strong>PDF (A4 Landscape / Portrait)</strong>, gambar tajam <strong>JPG / PNG</strong>, atau cetak langsung ke kertas fisik.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Multi-User & Akun Google</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Teman dan kolega Anda dapat login secara mandiri menggunakan akun Google. Setiap pengguna memiliki ruang kerja pribadinya sendiri.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-400 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Database Supabase RLS</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Didukung oleh PostgreSQL Supabase dengan Row Level Security. Diagram Anda terkunci rapat dan aman dari akses pengguna lain.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-rose-400 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Kustomisasi Penuh</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ubah warna tema, ketebalan garis tepi, gaya garis konektor (lengkung, siku, lurus), dan teks deskripsi dengan panel properti interaktif.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#072419] text-emerald-100/70 py-10 px-6 md:px-12 border-t border-emerald-900/50 text-center space-y-3">
        <div className="flex items-center justify-center gap-3 text-white font-extrabold text-base">
          <div className="w-14 h-14 shrink-0 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="GALUR Logo"
              width={56}
              height={56}
              className="w-full h-full object-contain filter drop-shadow-lg"
            />
          </div>
          <span className="text-white tracking-wide font-black text-xl">GALUR</span>
        </div>
        <p className="text-xs text-amber-300 font-semibold italic">
          &ldquo;GALUR — merangkai gagasan, memperjelas alur, membangun pemahaman.&rdquo;
        </p>
        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-emerald-200/80 pt-1">
          <Link href="/dashboard" className="hover:text-amber-300 transition-colors">
            Dashboard Studio
          </Link>
          <span>•</span>
          <Link href="/dashboard?tab=about" className="hover:text-amber-300 transition-colors">
            Filosofi & Tentang GALUR
          </Link>
          <span>•</span>
          <Link href="/editor" className="hover:text-amber-300 transition-colors">
            Editor Diagram
          </Link>
        </div>
        {/* Official BANGKIT Beruang Ecosystem Badge */}
        <div className="footer-brand-container flex items-center justify-center pt-2">
          <div className="ecosystem-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-800/80 bg-emerald-950/70 hover:border-emerald-600 hover:bg-emerald-900/60 shadow-2xs transition-all duration-200 hover:scale-105 hover:shadow-md cursor-default">
            <div className="w-4.5 h-4.5 shrink-0 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Beruang Icon"
                width={18}
                height={18}
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>
            <span className="ecosystem-tag text-[10px] font-black uppercase tracking-wider text-white bg-[#059669] px-2 py-0.5 rounded-full leading-none shadow-xs">
              BANGKIT
            </span>
            <span className="ecosystem-name text-xs font-bold tracking-tight text-emerald-100">
              Beruang Ecosystem
            </span>
          </div>
        </div>

        <p className="text-[11px] text-emerald-200/70 max-w-lg mx-auto pt-1 leading-relaxed">
          Dirancang untuk kemudahan pembuatan diagram teknikal dan pemikiran terstruktur, dari{' '}
          <strong className="text-amber-300 font-bold">Bangkit Beruang</strong> untuk{' '}
          <strong className="text-white font-bold">Jawa Barat</strong>.
        </p>
      </footer>
    </div>
  );
}
