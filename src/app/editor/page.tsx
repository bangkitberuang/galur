'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Cloud, ShieldCheck, LogIn } from 'lucide-react';
import DiagramEditor from '@/components/canvas/DiagramEditor';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { APP_VERSION, APP_LOGO_URL } from '@/lib/version';

function EditorContent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // Periksa sesi aktif Supabase
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.href : '/editor',
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline',
          },
        },
      });
    } catch (err: any) {
      alert(`Gagal login Google: ${err?.message || 'Terjadi kesalahan'}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-slate-600 gap-3 select-none">
        <div className="w-12 h-12 relative animate-pulse">
          <Image
            src={APP_LOGO_URL}
            alt="GALUR Logo"
            width={48}
            height={48}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-xs font-bold tracking-wide text-slate-500">
          Memeriksa Autentikasi Studio GALUR...
        </div>
      </div>
    );
  }

  // Jika Supabase aktif dan pengguna BELUM login serta belum memilih mode tamu
  if (isSupabaseConfigured && !user && !isGuestMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 select-none font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-150">
          {/* Logo & Versi */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 p-2 rounded-3xl bg-[#0b4632]/5 border border-emerald-500/20 shadow-inner flex items-center justify-center">
              <Image
                src={APP_LOGO_URL}
                alt="GALUR Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain filter drop-shadow-sm"
                priority
              />
            </div>
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-[#0b4632] text-amber-300 text-[10px] font-mono font-bold shadow-xs">
              {APP_VERSION}
            </span>
          </div>

          {/* Judul & Deskripsi */}
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Masuk ke Studio GALUR
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
              Untuk mengamankan diagram Anda di cloud database dan menghubungkan dengan akun Anda, silakan masuk menggunakan Google.
            </p>
          </div>

          {/* Keamanan & Keuntungan Cloud */}
          <div className="w-full bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Privat & Aman dengan Supabase RLS</span>
            </div>
            <p className="text-[11px] text-emerald-800/80 leading-normal pl-6">
              Setiap diagram tersimpan secara terisolasi dan hanya dapat diakses oleh akun Google Anda.
            </p>
          </div>

          {/* Tombol Utama: Login Google (Bisa Pilih Akun) */}
          <div className="w-full space-y-3 pt-2">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 rounded-2xl bg-[#0b4632] hover:bg-[#073022] text-white font-bold text-sm shadow-md shadow-emerald-950/20 transition-all flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.02] active:scale-[0.99]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Login dengan Akun Google</span>
            </button>

            {/* Opsi Lanjut Offline / Mode Tamu */}
            <button
              type="button"
              onClick={() => setIsGuestMode(true)}
              className="w-full py-2 px-4 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Atau lanjut dalam Mode Tamu (Penyimpanan Lokal Browser) &rarr;
            </button>
          </div>

          {/* Kembali ke Beranda */}
          <div className="pt-2 border-t border-slate-100 w-full flex items-center justify-center">
            <Link
              href="/"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <DiagramEditor />;
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-slate-50 text-slate-500 text-sm">Memuat Studio GALUR...</div>}>
      <EditorContent />
    </Suspense>
  );
}
