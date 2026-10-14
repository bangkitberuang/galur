'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sparkles, 
  BookOpen, 
  GitFork, 
  Compass, 
  Layers, 
  Heart, 
  ShieldAlert, 
  Palette, 
  Quote, 
  Copy, 
  Check, 
  ArrowRight,
  Leaf,
  Users,
  Target,
  Trees,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export default function AboutGalurSection() {
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'deskripsi' | 'filosofi' | 'maskot' | 'konservasi' | 'visual' | 'narasi'>('all');

  const officialNarrative = `GALUR — Garis Alur, Ngajentrekeun Struktur

Garis Alur, Ngajentrekeun Struktur — sebuah aplikasi yang membantu mengubah ide, informasi, dan proses yang rumit menjadi diagram yang jelas, terstruktur, dan mudah dipahami.

GALUR bukan sekadar alat untuk menggambar diagram. Aplikasi ini dirancang sebagai parabot digital untuk menata cara berpikir, menjelaskan gagasan, dan menyederhanakan kerumitan melalui visualisasi.

Ruang kerja diagram serbaguna ini memungkinkan pembuatan flowchart, bagan organisasi, alur proses kerja, mind map, hingga diagram konsep. Seluruh ide dan informasi dapat disusun menjadi representasi visual yang lebih sistematis.

Dirancang untuk membantu ASN, pengembang aplikasi, pendidik, analis, mahasiswa, maupun masyarakat umum dalam merancang proses, menjelaskan konsep, memetakan hubungan antarbagian, dan mendokumentasikan alur kerja.

Tujuan utamanya sederhana: membuat sesuatu yang rumit menjadi lebih mudah dilihat, dipahami, dan dijelaskan.

Kekuatan identitas GALUR terletak pada perpaduan tiga hal: nama yang berakar pada nuansa bahasa Sunda, fungsi yang jelas sebagai alat visualisasi, dan maskot beruang madu yang memberi karakter sekaligus pesan kepedulian. Itu membuat GALUR lebih dari sekadar aplikasi diagram—ia menjadi bagian dari cerita besar BANGKIT BERUANG tentang berkarya melalui teknologi yang bermanfaat.`;

  const handleCopyNarrative = () => {
    navigator.clipboard.writeText(officialNarrative);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 py-2">
      {/* Hero Header Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#072419] via-[#0b4632] to-[#0d5940] p-6 sm:p-10 text-white shadow-2xl border border-emerald-800/40 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Mascot Logo Card */}
          <div className="shrink-0 flex flex-col items-center gap-3">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#083525] p-2 shadow-2xl border-2 border-amber-400/40 flex items-center justify-center hover:scale-105 transition-transform duration-200">
              <Image
                src="/logo.png"
                alt="Maskot Beruang Madu Galur"
                width={128}
                height={128}
                className="w-full h-full object-contain rounded-2xl"
                priority
              />
            </div>
            <div className="text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300 bg-black/30 px-3 py-1 rounded-full border border-amber-300/30">
                BANGKIT BERUANG
              </span>
            </div>
          </div>

          {/* Core Manifesto Text */}
          <div className="space-y-3.5 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Manifesto & Filosofi Resmi</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              GALUR — <span className="text-amber-300">Garis Alur, Ngajentrekeun Struktur</span>
            </h2>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-3xl">
              Sebuah aplikasi yang membantu mengubah ide, informasi, dan proses yang rumit menjadi diagram yang jelas, terstruktur, dan mudah dipahami.
            </p>

            <div className="p-4 rounded-2xl bg-black/20 border border-emerald-700/50 text-xs sm:text-sm text-emerald-100/80 italic leading-relaxed">
              &ldquo;GALUR bukan sekadar alat untuk menggambar diagram. Aplikasi ini dirancang sebagai <strong className="text-amber-200 not-italic font-bold">parabot digital</strong> untuk menata cara berpikir, menjelaskan gagasan, dan menyederhanakan kerumitan melalui visualisasi.&rdquo;
            </div>
          </div>
        </div>
      </div>

      {/* Tiga Pilar Kekuatan Identitas Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Sintesis Identitas Merek</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Tiga Pilar Kekuatan Identitas GALUR
            </h3>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 self-start sm:self-auto">
            Ekosistem Bangkit Beruang
          </span>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pilar 1 */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-white border border-emerald-200 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#0b4632] text-amber-300 flex items-center justify-center font-black text-base shadow-xs">
              1
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              Akar Nuansa Bahasa Sunda
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nama <strong>GALUR</strong> dan semboyan <em>&ldquo;Ngajentrekeun Struktur&rdquo;</em> menghadirkan kearifan lokal yang membumi: menjelaskan gagasan secara gamblang, sistematis, dan mudah dipahami oleh siapa saja.
            </p>
          </div>

          {/* Pilar 2 */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-white border border-amber-200 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-base shadow-xs">
              2
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              Fungsi Jelas Alat Visualisasi
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bukan sekadar menggambar kotak dan garis, melainkan <strong>parabot digital</strong> presisi untuk merancang alur teknis ala Visio, bagan organisasi, mind map interaktif, hingga diagram konsep bisnis yang utuh.
            </p>
          </div>

          {/* Pilar 3 */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-white border border-emerald-200 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#083525] p-1 flex items-center justify-center border border-emerald-700 shadow-xs">
              <Image
                src="/icon.png"
                alt="Maskot Beruang"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              Karakter & Pesan Kepedulian
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Maskot beruang madu menyuntikkan kehangatan ramah, ketekunan proses, sekaligus kesadaran moral bahwa teknologi harus selalu selaras dengan kepedulian lingkungan dan pelestarian alam.
            </p>
          </div>
        </div>

        {/* Closing Thesis Callout */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0b4632] via-[#0d5940] to-[#072419] text-white shadow-md border border-emerald-800/40 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
              <Quote className="w-6 h-6 text-amber-300 fill-amber-300" />
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-emerald-100 font-medium">
              &ldquo;Kekuatan identitas GALUR terletak pada perpaduan tiga hal: <strong className="text-amber-300 font-bold">nama yang berakar pada nuansa bahasa Sunda</strong>, <strong className="text-white font-bold">fungsi yang jelas sebagai alat visualisasi</strong>, dan <strong className="text-amber-300 font-bold">maskot beruang madu yang memberi karakter sekaligus pesan kepedulian</strong>. Itu membuat GALUR lebih dari sekadar aplikasi diagram—ia menjadi bagian dari cerita besar <strong className="text-white underline decoration-amber-400 font-black">BANGKIT BERUANG</strong> tentang berkarya melalui teknologi yang bermanfaat.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Pills to Filter or Jump */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'Semua Bagian (1-6)' },
          { id: 'deskripsi', label: '1. Deskripsi Aplikasi' },
          { id: 'filosofi', label: '2. Makna Filosofis Nama' },
          { id: 'maskot', label: '3. Mengapa Beruang Madu?' },
          { id: 'konservasi', label: '4. Konservasi & Nilai Simbolis' },
          { id: 'visual', label: '5. Identitas Visual' },
          { id: 'narasi', label: '6. Narasi Resmi' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-[#0b4632] text-amber-300 shadow-md ring-2 ring-emerald-700/30'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bagian 1: Deskripsi Aplikasi GALUR */}
      {(activeSubTab === 'all' || activeSubTab === 'deskripsi') && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0b4632] flex items-center justify-center font-black text-lg border border-emerald-200">
              1
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Deskripsi Aplikasi GALUR
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Parabot digital serbaguna untuk kebutuhan struktural dan konseptual
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <Layers className="w-4 h-4 text-emerald-600" />
                <h4>Ruang Kerja Diagram Serbaguna</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                GALUR merupakan aplikasi untuk membuat dan menggambar berbagai jenis diagram, mulai dari <strong>flowchart</strong>, <strong>bagan organisasi</strong>, <strong>alur proses kerja</strong>, <strong>mind map</strong>, hingga <strong>diagram konsep</strong>. Seluruh ide dan informasi dapat disusun menjadi representasi visual yang lebih sistematis.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <Users className="w-4 h-4 text-emerald-600" />
                <h4>Satu Parabot untuk Banyak Kebutuhan</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                GALUR dirancang untuk membantu <strong>ASN, pengembang aplikasi, pendidik, analis, mahasiswa, maupun masyarakat umum</strong> dalam merancang proses, menjelaskan konsep, memetakan hubungan antarbagian, dan mendokumentasikan alur kerja.
              </p>
            </div>
          </div>

          {/* Tujuan Utama Highlight */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0b4632] uppercase tracking-wide">
                <Target className="w-3.5 h-3.5 text-emerald-700" />
                <span>Tujuan Utama GALUR</span>
              </div>
              <p className="text-sm font-extrabold text-slate-900">
                Membuat sesuatu yang rumit menjadi lebih mudah dilihat, dipahami, dan dijelaskan.
              </p>
            </div>
            <div className="shrink-0">
              <span className="inline-block px-3.5 py-1.5 rounded-xl bg-[#0b4632] text-amber-300 font-black text-xs tracking-tight shadow-xs">
                Tagline: Garis Alur, Ngajentrekeun Struktur
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Bagian 2: Makna Filosofis Nama GALUR */}
      {(activeSubTab === 'all' || activeSubTab === 'filosofi') && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-lg border border-amber-200">
              2
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Makna Filosofis Nama GALUR
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Nuansa kata &ldquo;galur&rdquo; (alur, jalur, rangkaian penghubung) dalam tiga pilar utama
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Kata <strong className="text-slate-900">galur</strong> memiliki nuansa makna alur, jalur, atau rangkaian yang menghubungkan satu bagian dengan bagian lainnya. Dalam identitas aplikasi ini, GALUR mengandung tiga filosofi fundamental:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Garis */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-50/60 to-white border border-emerald-200 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0b4632] text-amber-300 flex items-center justify-center font-black text-xs">
                  G
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">Garis — Merangkai Gagasan</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap garis mewakili hubungan antaride, tahapan pekerjaan, atau komponen dalam sebuah sistem. Tidak ada bagian yang berdiri sendiri tanpa konteks.
              </p>
            </div>

            {/* Alur */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-50/60 to-white border border-amber-200 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black text-xs">
                  A
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">Alur — Menunjukkan Arah</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sebuah proses membutuhkan urutan dan tujuan. GALUR membantu pengguna melihat dari mana sesuatu dimulai, bagaimana proses berjalan, serta ke mana hasilnya bermuara.
              </p>
            </div>

            {/* Struktur */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-sky-50/60 to-white border border-sky-200 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-700 text-white flex items-center justify-center font-black text-xs">
                  S
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">Struktur — Memberikan Kejelasan</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gagasan yang tersusun dengan baik akan lebih mudah dikomunikasikan, dievaluasi, dan dikembangkan menjadi tindakan nyata.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs sm:text-sm leading-relaxed border border-slate-800">
            <span className="font-bold text-amber-300">Pesan Filosofis:</span> Dengan demikian, GALUR bukan hanya tentang menggambar garis dan kotak. Filosofinya adalah bahwa <span className="underline decoration-amber-400 font-semibold">setiap gagasan membutuhkan alur</span>, <span className="underline decoration-amber-400 font-semibold">setiap alur membutuhkan struktur</span>, dan <span className="underline decoration-amber-400 font-semibold">setiap struktur yang jelas memudahkan lahirnya solusi</span>.
          </div>
        </section>
      )}

      {/* Bagian 3: Mengapa Menggunakan Beruang Madu sebagai Maskot? */}
      {(activeSubTab === 'all' || activeSubTab === 'maskot') && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-lg border border-amber-200">
              3
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Mengapa Menggunakan Beruang Madu sebagai Maskot?
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Simbol kecerdikan, ketekunan, kepedulian, dan identitas keluarga BANGKIT BERUANG
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#0b4632] p-2 border-2 border-amber-400/30 flex items-center justify-center shadow-md">
              <Image
                src="/logo.png"
                alt="Maskot Beruang Madu"
                width={100}
                height={100}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div className="space-y-2 flex-1">
              <h4 className="font-extrabold text-base text-slate-900">
                Beruang Madu — Simbol Kecerdikan, Ketekunan, dan Kepedulian
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Maskot beruang madu memberi GALUR identitas visual yang ramah dan mudah dikenali. Karakter ini juga menyatukan GALUR dengan semangat ekosistem <strong>BANGKIT BERUANG</strong>, sehingga produk-produk digitalnya terasa berasal dari satu keluarga.
              </p>
            </div>
          </div>

          {/* 4 Nilai Simbolis Maskot */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Empat Nilai Simbolis Beruang Madu:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-emerald-100 text-[#0b4632] flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  1
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900">Cerdas dan Adaptif</h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Mewakili kemampuan menemukan cara yang tepat untuk menyelesaikan masalah.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  2
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900">Tekun</h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Melambangkan proses menyusun diagram langkah demi langkah sampai menjadi jelas.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  3
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900">Terhubung dengan Alam</h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Mengingatkan bahwa teknologi dan inovasi tetap perlu berjalan bersama kepedulian terhadap lingkungan.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  4
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900">Identitas yang Konsisten</h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Menjadikan maskot sebagai ciri khas visual berbagai aplikasi dalam ekosistem BANGKIT BERUANG.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bagian 4: Mengapa Beruang Madu yang Terancam Punah? */}
      {(activeSubTab === 'all' || activeSubTab === 'konservasi') && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-black text-lg border border-rose-200">
              4
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Mengapa Beruang Madu yang Terancam Punah?
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Konteks konservasi ilmiah, pelurusan sejarah geografis, dan pesan moral teknologi
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-slate-800 space-y-3">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>Tanggung Jawab Moral terhadap Alam & Status IUCN</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Ada alasan filosofis yang lebih dalam di sini: teknologi tidak hanya seharusnya mempermudah kehidupan manusia, tetapi juga dapat membawa pesan tentang tanggung jawab terhadap alam.
            </p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Beruang madu (<em>Helarctos malayanus</em>) merupakan satwa liar yang menghadapi ancaman serius akibat kehilangan dan kerusakan habitat, perburuan, serta perdagangan ilegal. Dalam penilaian global IUCN yang dipublikasikan pada 2017, spesies ini berstatus <strong>Vulnerable (Rentan)</strong>, dengan tren populasi menurun. Status tersebut tidak sama dengan kategori Endangered (Genting).
            </p>
          </div>

          {/* Klarifikasi Ilmiah & Geografis */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Klarifikasi Akurasi Filosofi Merek (Bukan Endemik Jawa)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Ada satu hal penting yang perlu diluruskan agar filosofi mereknya tetap akurat: <strong>beruang madu bukan spesies endemik Jawa</strong>. Catatan ilmiah menunjukkan keberadaannya di Pulau Jawa pada masa Pleistosen, tetapi tidak ada bukti keberadaan beruang madu di Jawa pada masa sejarah. Populasi Indonesia saat ini dikenal terutama dari <strong>Sumatra dan Kalimantan</strong>.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Jadi, jika beruang madu dipilih sebagai maskot GALUR yang dikembangkan dalam ekosistem Jawa Barat, alasannya sebaiknya bukan karena satwa tersebut merupakan fauna asli Jawa, melainkan karena <strong className="text-emerald-800 font-bold">nilai simbolisnya</strong>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <span className="font-extrabold text-xs text-emerald-800 block">Ketahanan</span>
                <span className="text-[11px] text-slate-500">Tetap berjuang menghadapi tantangan.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <span className="font-extrabold text-xs text-amber-800 block">Kesadaran</span>
                <span className="text-[11px] text-slate-500">Mengingatkan bahwa sesuatu yang berharga bisa terancam jika tidak dijaga.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <span className="font-extrabold text-xs text-blue-800 block">Keberlanjutan</span>
                <span className="text-[11px] text-slate-500">Inovasi perlu mempertimbangkan dampak jangka panjang.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <span className="font-extrabold text-xs text-purple-800 block">Kepedulian</span>
                <span className="text-[11px] text-slate-500">Kemajuan teknologi idealnya berjalan seiring kepedulian sosial & lingkungan.</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950 text-emerald-100 text-xs sm:text-sm italic text-center font-medium">
            &ldquo;Maskot ini dapat menjadi pengingat bahwa kemajuan bukan hanya tentang membuat sesuatu lebih cepat, tetapi juga tentang membuat sesuatu yang lebih bermakna.&rdquo;
          </div>
        </section>
      )}

      {/* Bagian 5: Filosofi Identitas Visual GALUR */}
      {(activeSubTab === 'all' || activeSubTab === 'visual') && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-lg border border-emerald-200">
              5
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Filosofi Identitas Visual GALUR
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Komposisi warna, bentuk geometri, dan karakter visual yang berpadu harmonis
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Hijau Tua */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0b4632] shadow-inner shrink-0 border border-emerald-900" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Hijau Tua (#0b4632)</h4>
                  <p className="text-[11px] font-semibold text-emerald-800">Keteguhan dan Pertumbuhan</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menggambarkan kestabilan, pemikiran yang terstruktur, dan semangat membangun sesuatu yang berkelanjutan.
              </p>
            </div>

            {/* Emas */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f59e0b] shadow-inner shrink-0 border border-amber-600" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Emas (#f59e0b)</h4>
                  <p className="text-[11px] font-semibold text-amber-700">Ide dan Pencerahan</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menjadi aksen yang melambangkan momen ketika persoalan yang rumit mulai menemukan jalan keluar.
              </p>
            </div>

            {/* Garis dan Simpul Diagram */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-300">
                  <GitFork className="w-5 h-5 text-slate-800" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Garis & Simpul Diagram</h4>
                  <p className="text-[11px] font-semibold text-slate-700">Keterhubungan</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Melambangkan hubungan antara ide, proses, orang, dan keputusan yang membentuk sebuah sistem.
              </p>
            </div>

            {/* Maskot Beruang Madu */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0b4632] p-1 flex items-center justify-center shrink-0 border border-emerald-900">
                  <Image
                    src="/icon.png"
                    alt="Maskot"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Maskot Beruang Madu</h4>
                  <p className="text-[11px] font-semibold text-amber-700">Karakter dan Kepedulian</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Memberikan sentuhan manusiawi pada teknologi sekaligus membawa pesan tentang ketekunan dan pelestarian alam.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Bagian 6: Narasi Resmi untuk Halaman "Tentang GALUR" */}
      {(activeSubTab === 'all' || activeSubTab === 'narasi') && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-lg border border-amber-200">
                6
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Narasi Resmi untuk Halaman &ldquo;Tentang GALUR&rdquo;
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Teks naskah resmi terstandarisasi untuk presentasi, dokumentasi, dan media
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyNarrative}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:text-emerald-800 text-xs font-bold text-slate-600 transition-all bg-white shadow-2xs cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Naskah</span>
                </>
              )}
            </button>
          </div>

          <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#fcfdfb] to-[#f4f7f4] border border-emerald-900/15 shadow-inner space-y-4 font-serif text-slate-800">
            <div className="flex items-center gap-2 font-sans not-italic text-xs font-bold text-[#0b4632] uppercase tracking-wider">
              <Quote className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Naskah Narasi Lengkap</span>
            </div>

            <div className="text-sm sm:text-base leading-relaxed space-y-4">
              <p className="font-sans font-black text-lg sm:text-xl text-[#0b4632]">
                GALUR — Garis Alur, Ngajentrekeun Struktur
              </p>

              <p>
                <strong>Garis Alur, Ngajentrekeun Struktur</strong> — sebuah aplikasi yang membantu mengubah ide, informasi, dan proses yang rumit menjadi diagram yang jelas, terstruktur, dan mudah dipahami.
              </p>

              <p>
                GALUR bukan sekadar alat untuk menggambar diagram. Aplikasi ini dirancang sebagai <strong>parabot digital</strong> untuk menata cara berpikir, menjelaskan gagasan, dan menyederhanakan kerumitan melalui visualisasi.
              </p>

              <p>
                Ruang kerja diagram serbaguna ini memungkinkan pembuatan flowchart, bagan organisasi, alur proses kerja, mind map, hingga diagram konsep. Seluruh ide dan informasi dapat disusun menjadi representasi visual yang lebih sistematis.
              </p>

              <p>
                Dirancang untuk membantu ASN, pengembang aplikasi, pendidik, analis, mahasiswa, maupun masyarakat umum dalam merancang proses, menjelaskan konsep, memetakan hubungan antarbagian, dan mendokumentasikan alur kerja.
              </p>

              <div className="pt-2 font-sans not-italic border-t border-slate-200 text-xs sm:text-sm text-emerald-900 font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Tujuan utamanya sederhana: membuat sesuatu yang rumit menjadi lebih mudah dilihat, dipahami, dan dijelaskan.</span>
              </div>

              <div className="mt-3 p-4 rounded-xl bg-amber-50/80 border border-amber-200 font-sans not-italic text-xs sm:text-sm text-amber-950 leading-relaxed">
                <p>
                  &ldquo;Kekuatan identitas GALUR terletak pada perpaduan tiga hal: <strong>nama yang berakar pada nuansa bahasa Sunda</strong>, <strong>fungsi yang jelas sebagai alat visualisasi</strong>, dan <strong>maskot beruang madu yang memberi karakter sekaligus pesan kepedulian</strong>. Itu membuat GALUR lebih dari sekadar aplikasi diagram—ia menjadi bagian dari cerita besar <strong className="text-emerald-900 font-extrabold">BANGKIT BERUANG</strong> tentang berkarya melalui teknologi yang bermanfaat.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Footer inside About Section */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-base text-white">Siap Mulai Menggambar dengan GALUR?</h4>
          <p className="text-xs text-slate-400">Gunakan kanvas kosong atau pilih dari 11 template spesialis yang tersedia.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/editor"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0b4632] hover:bg-[#073022] text-amber-300 font-black text-xs shadow-md transition-all hover:scale-102"
          >
            <span>Buka Studio Kanvas</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}
