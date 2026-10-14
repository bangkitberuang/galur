'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { APP_VERSION, APP_LOGO_URL } from '@/lib/version';

interface EcosystemFooterProps {
  variant?: 'light' | 'dark' | 'transparent';
  className?: string;
  showLinks?: boolean;
}

export default function EcosystemFooter({
  variant = 'light',
  className = '',
  showLinks = true,
}: EcosystemFooterProps) {
  const isDark = variant === 'dark';

  return (
    <footer
      className={`w-full py-3.5 px-4 sm:px-8 md:px-12 select-none transition-colors ${
        isDark
          ? 'bg-[#072419] text-emerald-100/70 border-t border-emerald-900/60'
          : variant === 'transparent'
          ? 'bg-transparent text-slate-500'
          : 'bg-white border-t border-slate-200/80 text-slate-500'
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
        {/* Sisi Kiri: Identitas Brand & Versi */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 shrink-0 flex items-center justify-center">
            <Image
              src={APP_LOGO_URL}
              alt="GALUR Logo - Macan Tutul Jawa"
              width={24}
              height={24}
              className="w-full h-full object-contain filter drop-shadow-xs"
            />
          </div>
          <span className={`font-black text-sm tracking-wide ${isDark ? 'text-white' : 'text-slate-800'}`}>
            GALUR
          </span>
          <span
            className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${
              isDark
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {APP_VERSION}
          </span>
        </div>

        {/* Sisi Tengah: Tautan Cepat */}
        {showLinks && (
          <div
            className={`flex items-center sm:whitespace-nowrap flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-semibold ${
              isDark ? 'text-emerald-200/80' : 'text-slate-600'
            }`}
          >
            <Link
              href="/dashboard"
              className={isDark ? 'hover:text-amber-300 transition-colors' : 'hover:text-emerald-700 transition-colors'}
            >
              Dashboard Studio
            </Link>
            <span className="opacity-40">•</span>
            <Link
              href="/dashboard?tab=about"
              className={isDark ? 'hover:text-amber-300 transition-colors' : 'hover:text-emerald-700 transition-colors'}
            >
              Filosofi & Tentang GALUR
            </Link>
            <span className="opacity-40">•</span>
            <Link
              href="/editor"
              className={isDark ? 'hover:text-amber-300 transition-colors' : 'hover:text-emerald-700 transition-colors'}
            >
              Editor Diagram
            </Link>
          </div>
        )}

        {/* Sisi Kanan: Ecosystem Badge & Attribution */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`ecosystem-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-2xs transition-all duration-200 hover:scale-105 hover:shadow-md cursor-default ${
              isDark
                ? 'bg-emerald-950/70 border-emerald-800/80 hover:border-emerald-600 hover:bg-emerald-900/60'
                : 'bg-slate-50/90 border-slate-300/80 hover:border-emerald-300 hover:bg-white'
            }`}
          >
            <div className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
              <Image
                src={APP_LOGO_URL}
                alt="Beruang Icon"
                width={14}
                height={14}
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>
            <span className="ecosystem-tag text-[9px] font-black uppercase tracking-wider text-white bg-[#059669] px-1.5 py-0.2 rounded-full leading-none shadow-xs">
              BANGKIT
            </span>
            <span
              className={`ecosystem-name text-[11px] font-bold tracking-tight ${
                isDark ? 'text-emerald-100' : 'text-slate-700'
              }`}
            >
              Beruang Ecosystem
            </span>
          </div>

          <p
            className={`text-[11px] hidden sm:inline leading-none ${
              isDark ? 'text-emerald-200/60' : 'text-slate-400'
            }`}
          >
            Bangkit Beruang untuk{' '}
            <strong className={isDark ? 'text-white font-bold' : 'text-emerald-800 font-semibold'}>
              Jawa Barat
            </strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
