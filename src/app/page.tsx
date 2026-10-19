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
  Layers, 
  ShieldCheck, 
  Palette,
  CheckCircle2,
  Calendar,
  Clock,
  ChevronRight,
  Globe
} from 'lucide-react';
import { APP_VERSION, APP_VERSION_CODENAME, APP_LOGO_URL } from '@/lib/version';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dfe9e2] via-[#eff4f0] to-[#e6ece6] text-slate-800 flex flex-col selection:bg-emerald-700 selection:text-white relative overflow-x-hidden">
      {/* ======================================================== */}
      {/* LATAR BELAKANG GEDUNG SATE & GRADASI HIJAU TATAR SUNDA    */}
      {/* ======================================================== */}
      <div className="absolute top-0 inset-x-0 h-[860px] pointer-events-none -z-10 overflow-hidden select-none">
        {/* Gambar Panorama Gedung Sate Jawa Barat (+5% kegelapan / opacity) */}
        <div className="absolute inset-0 opacity-[0.30] sm:opacity-[0.35] mix-blend-multiply">
          <Image
            src="/gedung-sate-hero.jpg"
            alt="Panorama Gedung Sate Jawa Barat"
            fill
            priority
            className="object-cover object-bottom"
          />
        </div>

        {/* Lapisan Gradasi Hijau Tatar Sunda (5% lebih gelap & kontras elegan) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#dfe9e2]/85 via-emerald-100/30 to-[#eff4f0]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#dfe9e2]/85 via-transparent to-[#dfe9e2]/85" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#eff4f0] to-transparent" />

        {/* Grid Titik Halus Arsitektural */}
        <div className="absolute inset-0 bg-[radial-gradient(#0b4632_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-15" />
      </div>

      {/* Top Navbar */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 md:px-12 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 transition-transform hover:scale-105 duration-200">
            <Image
              src={APP_LOGO_URL}
              alt="GALUR Logo - Macan Tutul Jawa"
              width={64}
              height={64}
              className="w-full h-full object-contain filter drop-shadow-md"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tight text-[#0b4632]">GALUR</span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{APP_VERSION}</span>
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
              src={APP_LOGO_URL}
              alt="Maskot Macan Tutul Jawa Galur"
              width={256}
              height={256}
              className="w-full h-full object-contain filter drop-shadow-2xl"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 backdrop-blur-xs border border-emerald-300/80 text-[#0b4632] text-xs sm:text-sm font-bold shadow-xs">
            <Layers className="w-4 h-4 text-[#0b4632]" />
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
          <div className="relative mx-auto rounded-3xl p-2.5 sm:p-3 bg-gradient-to-b from-slate-200 to-slate-100 shadow-2xl border border-slate-300/80 max-w-5xl">
            {/* Window Frame Bar */}
            <div className="bg-slate-900 rounded-t-2xl px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/90" />
                <div className="w-3 h-3 rounded-full bg-amber-500/90" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/90" />
                <span className="ml-2 text-[11px] font-mono text-slate-400 hidden sm:inline">
                  galur-studio : Proyek_Siaran_IKP_2026.galur
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  3 Tahap: Diagram &rarr; Mindmap &rarr; Timebox
                </span>
              </div>
            </div>

            {/* Canvas Mockup Content */}
            <div className="bg-slate-50/90 rounded-b-2xl overflow-hidden border-x border-b border-slate-200 shadow-inner p-5 sm:p-7 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
                {/* 1. DIAGRAM ALIR & VISIO MODE */}
                <div className="bg-white/95 rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between relative group hover:border-emerald-500 transition-colors">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          1
                        </div>
                        <span className="text-xs font-bold text-slate-800">Diagram Alir (Visio)</span>
                      </div>
                      <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Proses Kerja
                      </span>
                    </div>

                    <div className="space-y-2 text-left">
                      <div className="px-3 py-1.5 rounded-lg border-2 border-emerald-500 bg-emerald-50/80 text-emerald-900 font-semibold text-[11px] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Mulai: Usulan Disposisi
                      </div>
                      <div className="flex justify-center text-slate-400 text-xs py-0.5">&darr;</div>
                      <div className="px-3 py-2 rounded-xl border-2 border-blue-500 bg-white text-slate-800 font-medium text-[11px] shadow-xs">
                        Validasi SOTK & Kelengkapan SOP
                      </div>
                      <div className="flex justify-center text-slate-400 text-xs py-0.5">&darr;</div>
                      <div className="px-3 py-1.5 rounded-lg border-2 border-purple-500 bg-purple-50/80 text-purple-900 font-semibold text-[11px]">
                        Surat Perintah Tugas (SPT)
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span>180+ Simbol Geometri</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-0.5">
                      Lanjut ke Ide <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* 2. MIND MAP & BRAINSTORMING */}
                <div className="bg-white/95 rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between relative group hover:border-blue-500 transition-colors">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          2
                        </div>
                        <span className="text-xs font-bold text-slate-800">Mind Map Interaktif</span>
                      </div>
                      <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        Eksplorasi Ide
                      </span>
                    </div>

                    <div className="space-y-2 text-left">
                      <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-[11px] shadow-xs text-center">
                        Siaran Live Streaming Terpadu
                      </div>
                      <div className="pl-3 space-y-1.5 border-l-2 border-blue-400 text-[10px]">
                        <div className="px-2.5 py-1 rounded-md border border-sky-300 bg-sky-50 text-sky-900 font-medium">
                          &bull; Multi-Kamera & Switcher (OBS/vMix)
                        </div>
                        <div className="px-2.5 py-1 rounded-md border border-emerald-300 bg-emerald-50 text-emerald-900 font-medium">
                          &bull; Audio Mixer & Mic Wireless
                        </div>
                        <div className="px-2.5 py-1 rounded-md border border-amber-300 bg-amber-50 text-amber-900 font-medium">
                          &bull; Backup Failover Router 4G/5G
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Cabang Otomatis Tab/Enter</span>
                    <span className="font-semibold text-blue-600 flex items-center gap-0.5">
                      Lanjut Jadwal <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* 3. TIME BOXING & GANTT TIME SCHEDULE */}
                <div className="bg-white/95 rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between relative group hover:border-amber-500 transition-colors">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                          3
                        </div>
                        <span className="text-xs font-bold text-slate-800">Jadwal & Time Boxing</span>
                      </div>
                      <span className="text-[10px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Eksekusi Nyata
                      </span>
                    </div>

                    <div className="space-y-2 text-left">
                      {/* Skala Waktu Mini Header */}
                      <div className="grid grid-cols-4 gap-1 text-[9px] font-mono text-center text-slate-500 pb-1 border-b border-slate-200">
                        <span className="bg-slate-100 rounded py-0.5">W1</span>
                        <span className="bg-slate-100 rounded py-0.5">W2</span>
                        <span className="bg-emerald-100 text-emerald-800 font-bold rounded py-0.5">W3 (Now)</span>
                        <span className="bg-slate-100 rounded py-0.5">W4</span>
                      </div>

                      {/* Bilah Gantt Task */}
                      <div className="p-2 rounded-xl bg-blue-50 border border-blue-200">
                        <div className="flex items-center justify-between text-[10px] font-bold text-blue-900 mb-1">
                          <span>Setup Studio & Gladibersih</span>
                          <span className="text-blue-700">80%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: '80%' }} />
                        </div>
                      </div>

                      {/* Kartu Timebox Harian Mini */}
                      <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200 text-[10px]">
                        <div className="flex items-center justify-between font-bold text-amber-900">
                          <span>SENIN: 08:30 - 11:30</span>
                          <span className="text-[9px] bg-amber-200/70 text-amber-900 px-1.5 rounded">Deep Work</span>
                        </div>
                        <p className="text-slate-600 text-[10px] mt-0.5 truncate">&bull; Uji Coba Jaringan & Audio Multi-Mic</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Gantt, Milestone & Timeline</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Target Selesai</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Identity Pillars Banner */}
      <section className="py-8 px-6 md:px-12 max-w-5xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-r from-[#0b4632] via-[#0d5940] to-[#072419] p-6 sm:p-8 text-white shadow-xl border border-emerald-800/40 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center transition-transform hover:scale-105 duration-200">
            <Image
              src="/logo.png"
              alt="GALUR Mascot"
              width={112}
              height={112}
              className="w-full h-full object-contain filter drop-shadow-2xl"
            />
          </div>
          <div className="space-y-3 text-left flex-1 w-full">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/10">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Pilar Identitas & Nilai GALUR</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-200/90 bg-emerald-950/50 px-3 py-0.5 rounded-full border border-emerald-500/30">
                Karya Bangkit Beruang
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
                <h4 className="text-amber-300 font-bold text-xs flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Filosofi Sunda</span>
                </h4>
                <p className="text-[11px] text-emerald-100/90 leading-relaxed mt-1">
                  <em>Galur</em> bermakna alur yang tertata rapi, runut, dan jelas untuk menyederhanakan gagasan rumit.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
                <h4 className="text-amber-300 font-bold text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Macan Tutul Jawa</span>
                </h4>
                <p className="text-[11px] text-emerald-100/90 leading-relaxed mt-1">
                  Karakter ketajaman analisis, fokus presisi, serta pesan kepedulian fauna endemik Jawa Barat.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
                <h4 className="text-amber-300 font-bold text-xs flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Produktivitas Kerja</span>
                </h4>
                <p className="text-[11px] text-emerald-100/90 leading-relaxed mt-1">
                  Alur lengkap pekerja: Diagram Alir, Mind Map, hingga Jadwal & Time Boxing Mingguan.
                </p>
              </div>
            </div>
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
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Jadwal & Time Boxing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lanjutkan pemikiran ke aksi nyata. Rancang skala waktu mingguan (W1 - W6), bilah progres Gantt jalur kritis, milestone target, dan kartu fokus time-boxing harian.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-400 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Printer className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Cetak & Ekspor Fleksibel</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unduh hasil diagram Anda menjadi dokumen <strong>PDF (A4 Landscape / Portrait)</strong>, gambar tajam <strong>JPG / PNG</strong>, atau cetak langsung ke kertas fisik.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Multi-User & Akun Google</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Teman dan kolega Anda dapat login secara mandiri menggunakan akun Google. Setiap pengguna memiliki ruang kerja pribadinya sendiri.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Database Supabase RLS</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Didukung oleh PostgreSQL Supabase dengan Row Level Security. Diagram Anda terkunci rapat dan aman dari akses pengguna lain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Memanjang & Ramping (Sleek Horizontal Bar) */}
      <footer className="mt-auto bg-[#072419] text-emerald-100/70 py-3.5 sm:py-4 px-4 sm:px-8 md:px-12 border-t border-emerald-900/60 select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
          {/* Sisi Kiri: Identitas Brand & Versi */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 shrink-0 flex items-center justify-center">
              <Image
                src={APP_LOGO_URL}
                alt="GALUR Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain filter drop-shadow-md"
              />
            </div>
            <span className="text-white tracking-wide font-black text-base">GALUR</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-amber-300 border border-emerald-400/30 leading-none">
              {APP_VERSION}
            </span>
          </div>

          {/* Sisi Tengah: Navigasi Tautan Cepat & Domain */}
          <div className="flex flex-wrap items-center whitespace-nowrap justify-center gap-x-4 gap-y-1 text-xs font-semibold text-emerald-200/80">
            <a 
              href="https://galur.kitt.lt" 
              className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-amber-300 font-mono font-bold"
              title="Domain Resmi"
            >
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>https://galur.kitt.lt/</span>
            </a>
            <span className="opacity-40">•</span>
            <Link href="/dashboard" className="hover:text-amber-300 transition-colors">
              Dashboard Studio
            </Link>
            <span className="opacity-40">•</span>
            <Link href="/dashboard?tab=about" className="hover:text-amber-300 transition-colors">
              Filosofi & Tentang GALUR
            </Link>
            <span className="opacity-40">•</span>
            <Link href="/editor" className="hover:text-amber-300 transition-colors">
              Editor Diagram
            </Link>
          </div>

          {/* Sisi Kanan: Official Ecosystem Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="ecosystem-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-800/80 bg-emerald-950/70 hover:border-emerald-600 hover:bg-emerald-900/60 transition-all cursor-default text-xs">
              <div className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
                <Image
                  src={APP_LOGO_URL}
                  alt="Beruang Icon"
                  width={14}
                  height={14}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider text-white bg-[#059669] px-1.5 py-0.2 rounded-full leading-none">
                BANGKIT
              </span>
              <span className="text-[11px] font-bold tracking-tight text-emerald-100">
                Beruang Ecosystem
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
