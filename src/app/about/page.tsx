'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react';
import AboutGalurSection from '@/components/dashboard/AboutGalurSection';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-emerald-700 selection:text-white">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 md:px-12 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
              <Image
                src="/logo.png"
                alt="GALUR Logo"
                width={56}
                height={56}
                className="w-full h-full object-contain filter drop-shadow-sm"
                priority
              />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-[#0b4632]">GALUR</span>
              <span className="hidden sm:inline-block text-xs text-amber-700 font-bold ml-2 px-2 py-0.5 bg-amber-50 rounded-full border border-amber-200">
                Tentang & Filosofi
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-emerald-500 hover:text-emerald-800 text-slate-700 font-semibold text-xs transition-all bg-white"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Dashboard Studio</span>
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

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8">
        <div className="mb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard Studio</span>
          </Link>
        </div>

        <AboutGalurSection />
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-[#072419] text-emerald-100/70 py-8 px-6 md:px-12 border-t border-emerald-900/50 text-center space-y-2">
        <div className="flex items-center justify-center gap-2.5 text-white font-extrabold text-sm">
          <div className="w-12 h-12 shrink-0 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="GALUR Logo"
              width={48}
              height={48}
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>
          <span className="text-white tracking-wide font-black">GALUR</span>
        </div>
        <p className="text-xs text-amber-300 font-semibold italic">
          &ldquo;Garis Alur, Ngajentrekeun Struktur&rdquo;
        </p>
        
        {/* Official BANGKIT Beruang Ecosystem Badge */}
        <div className="footer-brand-container flex items-center justify-center pt-1">
          <div className="ecosystem-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-800/80 bg-emerald-950/70 hover:border-emerald-600 hover:bg-emerald-900/60 shadow-2xs transition-all duration-200 hover:scale-105 hover:shadow-md cursor-default">
            <div className="w-4 h-4 shrink-0 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Beruang Icon"
                width={16}
                height={16}
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>
            <span className="ecosystem-tag text-[9px] font-black uppercase tracking-wider text-white bg-[#059669] px-2 py-0.5 rounded-full leading-none shadow-xs">
              BANGKIT
            </span>
            <span className="ecosystem-name text-[11px] font-bold tracking-tight text-emerald-100">
              Beruang Ecosystem
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
