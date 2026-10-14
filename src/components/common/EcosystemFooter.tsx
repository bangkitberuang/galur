'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
      className={`w-full py-6 px-4 select-none transition-colors ${
        isDark
          ? 'bg-[#072419] text-emerald-100/70 border-t border-emerald-900/50'
          : variant === 'transparent'
          ? 'bg-transparent text-slate-500'
          : 'bg-white border-t border-slate-200/80 text-slate-500'
      } ${className}`}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-3 text-center">
        {/* Official BANGKIT Beruang Ecosystem Badge */}
        <div className="footer-brand-container flex items-center justify-center">
          <div
            className={`ecosystem-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-2xs transition-all duration-200 hover:scale-105 hover:shadow-md cursor-default ${
              isDark
                ? 'bg-emerald-950/70 border-emerald-800/80 hover:border-emerald-600 hover:bg-emerald-900/60'
                : 'bg-slate-50/90 border-slate-300/80 hover:border-emerald-300 hover:bg-white'
            }`}
          >
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
            <span
              className={`ecosystem-name text-xs font-bold tracking-tight ${
                isDark ? 'text-emerald-100' : 'text-slate-700'
              }`}
            >
              Beruang Ecosystem
            </span>
          </div>
        </div>

        {/* Links Navigation */}
        {showLinks && (
          <div
            className={`flex items-center justify-center flex-wrap gap-x-4 gap-y-1 text-xs font-semibold pt-1 ${
              isDark ? 'text-emerald-200/80' : 'text-slate-600'
            }`}
          >
            <Link
              href="/dashboard"
              className="hover:text-emerald-700 hover:underline transition-colors"
            >
              Dashboard Studio
            </Link>
            <span className="opacity-40">•</span>
            <Link
              href="/dashboard?tab=about"
              className="hover:text-emerald-700 hover:underline transition-colors"
            >
              Filosofi & Tentang GALUR
            </Link>
            <span className="opacity-40">•</span>
            <Link
              href="/editor"
              className="hover:text-emerald-700 hover:underline transition-colors"
            >
              Editor Diagram
            </Link>
          </div>
        )}

        {/* Tagline & Copyright */}
        <p
          className={`text-[11px] max-w-lg leading-relaxed ${
            isDark ? 'text-emerald-200/50' : 'text-slate-400'
          }`}
        >
          GALUR — Garis Alur, Ngajentrekeun Struktur • Parabot visualisasi diagram cerdas bagian dari ekosistem digital{' '}
          <strong className={isDark ? 'text-amber-300 font-bold' : 'text-slate-700 font-semibold'}>
            BANGKIT BERUANG
          </strong>
          .
        </p>
      </div>
    </footer>
  );
}
