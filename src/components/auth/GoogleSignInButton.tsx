'use client';

import React, { useEffect, useRef, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  shape?: 'rectangular' | 'pill';
  width?: string | number;
  className?: string;
}

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '305966230281-pf9nqadcmq4008g2lbfa9l0ne3mrmbco.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleSignInButton({
  onSuccess,
  text = 'continue_with',
  theme = 'outline',
  shape = 'pill',
  width = 260,
  className = '',
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const setupGoogle = () => {
      if (typeof window === 'undefined' || !window.google?.accounts?.id || !containerRef.current) {
        return false;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          cancel_on_tap_outside: true,
          callback: async (response: any) => {
            if (!response?.credential) return;

            setLoading(true);
            try {
              if (!supabase) throw new Error('Supabase tidak tersedia');

              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
              });

              if (error) {
                console.error('Error saat signInWithIdToken:', error);
                alert(`Gagal login Google: ${error.message}`);
                setLoading(false);
                return;
              }

              if (onSuccess) {
                onSuccess();
              } else {
                window.location.reload();
              }
            } catch (err: any) {
              console.error('Autentikasi gagal:', err);
              alert(`Terjadi kesalahan login: ${err?.message || 'Gagal login'}`);
              setLoading(false);
            }
          },
        });

        // Bersihkan render sebelumnya jika ada
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(containerRef.current, {
            type: 'standard',
            theme,
            size: 'large',
            text,
            shape,
            logo_alignment: 'left',
            width: typeof width === 'number' ? width : 260,
          });
          setIsRendered(true);
        }

        // Tampilkan juga prompt Google One-Tap di pojok kanan atas
        window.google.accounts.id.prompt((notification: any) => {
          if (notification?.isNotDisplayed() || notification?.isSkippedMoment()) {
            // One Tap opsional, jika dilewati tidak masalah karena tombol utama sudah dirender
          }
        });

        return true;
      } catch (err) {
        console.warn('Gagal inisialisasi Google Identity Services:', err);
        return false;
      }
    };

    if (!setupGoogle()) {
      interval = setInterval(() => {
        if (setupGoogle() && interval) {
          clearInterval(interval);
        }
      }, 300);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [theme, text, shape, width, onSuccess]);

  // Fallback klik manual jika Google Identity script diblokir oleh browser / adblocker
  const handleFallbackClick = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.href : '/dashboard',
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline',
          },
        },
      });
    } catch (err: any) {
      alert(`Gagal login Google: ${err?.message || 'Terjadi kesalahan'}`);
      setLoading(false);
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Container tombol resmi Google GIS */}
      <div
        ref={containerRef}
        className={`transition-opacity duration-200 ${isRendered ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}
      />

      {/* Tombol Fallback (ditampilkan sementara saat script Google sedang dimuat atau jika diblokir) */}
      {!isRendered && (
        <button
          type="button"
          onClick={handleFallbackClick}
          disabled={loading}
          className="flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-all hover:shadow-sm cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
          <span>{loading ? 'Menghubungkan...' : 'Lanjutkan dengan Google'}</span>
        </button>
      )}
    </div>
  );
}
