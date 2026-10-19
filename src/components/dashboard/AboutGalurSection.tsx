'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  GitFork, 
  Layers, 
  Copy, 
  Check, 
  ArrowRight,
  ShieldCheck, 
  History,
  Download,
  Share2,
  FileCode2,
  ExternalLink
} from 'lucide-react';
import { 
  APP_VERSION, 
  APP_VERSION_CODENAME, 
  APP_RELEASE_DATE, 
  APP_CHANGELOG, 
  APP_LOGO_URL 
} from '@/lib/version';

export default function AboutGalurSection() {
  const [copied, setCopied] = useState(false);

  const conciseSummary = `GALUR: Garis Alur, Ngajentrekeun Struktur.
Aplikasi pembuat diagram presisi karya ekosistem Bangkit Beruang untuk merangkai gagasan, memperjelas alur proses kerja, dan membangun pemahaman visual yang terstruktur.`;

  const handleCopySummary = () => {
    navigator.clipboard.writeText(conciseSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* 1. HERO HEADER: Ramping, Elegan & Profesional */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#072419] via-[#0b4632] to-[#0d5940] p-6 sm:p-8 text-white shadow-xl border border-emerald-800/40 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          {/* Mascot Logo Card */}
          <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-inner">
            <Image
              src={APP_LOGO_URL}
              alt="GALUR Logo - Macan Tutul Jawa"
              width={112}
              height={112}
              className="w-full h-full object-contain filter drop-shadow-md"
              priority
            />
          </div>

          {/* Core Info */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full shadow-2xs">
                BANGKIT BERUANG
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                Edisi {APP_VERSION_CODENAME} ({APP_VERSION})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              GALUR: <span className="text-amber-300">Garis Alur, Ngajentrekeun Struktur</span>
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl font-normal">
              Aplikasi visualisasi alur dan diagram profesional untuk merangkai gagasan, memetakan proses teknis, dan menyederhanakan kerumitan sistem menjadi struktur yang gamblang.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <Link
                href="/editor"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs shadow-md transition-all hover:scale-102"
              >
                <span>Buka Studio Diagram</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-900" />
              </Link>

              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                <span>{copied ? 'Tersalin!' : 'Salin Ringkasan'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TIGA PILAR UTAMA: Grid 3 Kolom Singkat & Padat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pilar 1 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-emerald-300 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#0b4632] flex items-center justify-center font-black text-xs">
            01
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm">
            Filosofi Tatar Sunda
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mengusung semboyan <em>&ldquo;Ngajentrekeun Struktur&rdquo;</em> (menjelaskan secara gamblang dan tertata). Menjadikan ide rumit mudah dipahami oleh siapa pun.
          </p>
        </div>

        {/* Pilar 2 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-amber-300 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs">
            02
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm">
            Parabot Visualisasi Presisi
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mendukung flowchart teknis ala Microsoft Visio, matriks SWOT & Lean Canvas, UML/ERD basis data, hingga eksplorasi mind mapping interaktif.
          </p>
        </div>

        {/* Pilar 3 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-emerald-300 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#0b4632] flex items-center justify-center font-black text-xs">
            03
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm">
            Maskot & Kepedulian
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Maskot Macan Tutul Jawa (<em>Panthera pardus melas</em>), fauna identitas Jawa Barat, melambangkan ketajaman analisis, kelincahan, dan kepedulian alam.
          </p>
        </div>
      </div>

      {/* 3. SPESIFIKASI & KAPABILITAS SISTEM (4 Kolom Ringkas) */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-700" />
          <span>Spesifikasi & Kapabilitas Sistem</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Format Ekspor</span>
            <span className="font-bold text-slate-800 mt-0.5 block">PDF, PNG, JPEG, SVG, Visio VDX, JSON, CSV</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Layout Otomatis</span>
            <span className="font-bold text-slate-800 mt-0.5 block">Grid Layout, Smart Auto-Routing, Slot Magnet</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Arsitektur</span>
            <span className="font-bold text-slate-800 mt-0.5 block">Next.js 15, React Flow, Supabase RLS</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Ekosistem Resmi</span>
            <span className="font-bold text-[#0b4632] mt-0.5 block">Bangkit Beruang Ecosystem</span>
          </div>
        </div>
      </div>

      {/* 4. RIWAYAT VERSI / CHANGELOG: Rapi & Ringkas */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <History className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Riwayat Rilis & Pembaruan</h3>
              <p className="text-[11px] text-slate-500">Versi aktif: {APP_VERSION} ({APP_RELEASE_DATE})</p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {APP_VERSION}
          </span>
        </div>

        <div className="space-y-3">
          {APP_CHANGELOG.map((log) => (
            <div
              key={log.version}
              className={`p-3.5 rounded-xl border text-xs ${
                log.version === APP_VERSION
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-slate-50/50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                    {log.version}
                  </span>
                  <span className="font-bold text-slate-800">{log.title}</span>
                  {log.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-600 text-white">
                      {log.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400">{log.date}</span>
              </div>
              <ul className="grid sm:grid-cols-2 gap-1 text-[11px] text-slate-600">
                {log.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
