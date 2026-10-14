'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Node, Edge } from '@xyflow/react';
import {
  Printer,
  X,
  FileText,
  RotateCw,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Download,
  Check,
  Loader2,
  Sliders,
  Settings,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import {
  captureDiagramSnapshot,
  getDiagramDimensions,
  exportToPdfDocument
} from '@/lib/exportUtils';
import { CanvasPageConfig } from './CanvasPageFrame';

export type PaperSize = 'a4' | 'a3' | 'letter' | 'legal';
export type PageOrientation = 'landscape' | 'portrait';
export type MarginOption = 'standard' | 'narrow' | 'wide' | 'none';
export type ScaleMode = 'fit' | '100' | 'custom';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagramTitle: string;
  nodes?: Node[];
  edges?: Edge[];
  pageConfig?: CanvasPageConfig;
  onOpenExportModal?: () => void;
}

export default function PrintPreviewModal({
  isOpen,
  onClose,
  diagramTitle,
  nodes = [],
  edges = [],
  pageConfig,
  onOpenExportModal,
}: PrintPreviewModalProps) {
  // 1. Konfigurasi Lembar Kertas
  const [paperSize, setPaperSize] = useState<PaperSize>('a4');
  const [orientation, setOrientation] = useState<PageOrientation>('landscape');
  const [margin, setMargin] = useState<MarginOption>('standard');
  const [scaleMode, setScaleMode] = useState<ScaleMode>('fit');
  const [customScale, setCustomScale] = useState<number>(100);

  // 2. Opsi Header & Footer Cetak
  const [showHeader, setShowHeader] = useState<boolean>(true);
  const [showFooter, setShowFooter] = useState<boolean>(true);
  const [showWatermark, setShowWatermark] = useState<boolean>(false);
  const [watermarkText, setWatermarkText] = useState<string>('DRAFT');
  const [isGrayscale, setIsGrayscale] = useState<boolean>(false);

  // 3. State Gambar Cuplikan & Zoom Viewport
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [pdfSuccess, setPdfSuccess] = useState<boolean>(false);

  // Ambil cuplikan kanvas setiap kali dialog dibuka
  const loadSnapshot = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = await captureDiagramSnapshot(false, 2);
      setSnapshotUrl(url);
    } catch (err) {
      console.error('Gagal memuat pratinjau cetak:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadSnapshot();
    }
  }, [isOpen, loadSnapshot]);

  if (!isOpen) return null;

  // Ukuran Margin dalam satuan padding CSS
  const marginPaddingMap: Record<MarginOption, string> = {
    standard: '14mm',
    narrow: '6mm',
    wide: '22mm',
    none: '0mm',
  };

  // Rasio Aspek Kertas (Lebar / Tinggi)
  const getAspectRatio = () => {
    if (paperSize === 'a4' || paperSize === 'a3') {
      return orientation === 'landscape' ? 297 / 210 : 210 / 297;
    }
    if (paperSize === 'letter') {
      return orientation === 'landscape' ? 279.4 / 215.9 : 215.9 / 279.4;
    }
    // legal
    return orientation === 'landscape' ? 355.6 / 215.9 : 215.9 / 355.6;
  };

  // Label Dimensi Fisik Kertas
  const paperLabels: Record<PaperSize, { name: string; dim: string }> = {
    a4: { name: 'A4', dim: '210 × 297 mm (Standar Arsip & Dinas)' },
    a3: { name: 'A3', dim: '297 × 420 mm (Format Lebar / Gambar Kerja)' },
    letter: { name: 'Letter', dim: '8.5 × 11 inci' },
    legal: { name: 'Legal', dim: '8.5 × 14 inci' },
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    setPdfSuccess(false);
    try {
      const element = document.querySelector('.react-flow__viewport') as HTMLElement;
      if (!element) throw new Error('Kanvas tidak ditemukan');
      const fileName = `${diagramTitle.toLowerCase().replace(/\s+/g, '-')}-cetak-${Date.now()}`;
      await exportToPdfDocument(
        element,
        fileName,
        orientation,
        paperSize === 'a3' ? 'a3' : 'a4',
        2
      );
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 2000);
    } catch (err) {
      console.error('Gagal mengunduh PDF Cetak:', err);
      alert('Gagal membuat dokumen PDF.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const diagramDim = getDiagramDimensions(nodes);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs no-print p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl overflow-hidden flex flex-col h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================= */}
        {/* HEADER DIALOG */}
        {/* ========================================================= */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0b4632] text-amber-300 flex items-center justify-center shadow-md">
              <Printer className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Pratinjau Cetak (Print Preview)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Siap Cetak
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Simulasi tata letak dokumen fisik sebelum dikirim ke mesin pencetak atau disimpan ke PDF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenExportModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenExportModal();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                title="Buka Pilihan Unduh Berkas (PNG, JPEG, SVG, Visio, JSON, CSV)"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pratinjau Unduh</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Tutup dialog (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN BODY: SPLIT VIEW (LEMBAR KERTAS & PANEL PENGATURAN) */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* SISI KIRI: SIMULASI KERTAS CETAK (SHEET VIEWER) */}
          <div className="flex-1 bg-slate-900/95 flex flex-col min-h-0 relative select-none overflow-hidden">
            {/* Top Toolbar Viewport Pratinjau */}
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300 shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">
                  {paperLabels[paperSize].name} ({orientation.toUpperCase()})
                </span>
                <span className="text-[10px] text-slate-400">
                  Margin: {margin} • Skala: {scaleMode === 'fit' ? 'Paskan (Fit)' : `${customScale}%`}
                </span>
              </div>

              {/* Kontrol Zoom Kertas */}
              <div className="flex items-center gap-1.5 bg-slate-800/90 px-2 py-0.5 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.5, Number((z - 0.15).toFixed(2))))}
                  className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Perkecil Tampilan Kertas"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono font-bold text-slate-300 min-w-[36px] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2.0, Number((z + 0.15).toFixed(2))))}
                  className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Perbesar Tampilan Kertas"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <div className="w-[1px] h-3 bg-slate-700 mx-0.5" />
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="text-[10px] font-semibold text-slate-300 hover:text-emerald-400 px-1 py-0.5"
                  title="Atur Ulang ke 100%"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={loadSnapshot}
                  className="p-1 text-slate-400 hover:text-emerald-400 transition-colors ml-1 cursor-pointer"
                  title="Perbarui Cuplikan Kanvas Terbaru"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Container Lembar Kertas Nyata */}
            <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                  <Loader2 className="w-7 h-7 animate-spin text-emerald-500" />
                  <span className="text-xs font-medium">Menyiapkan lembar pratinjau cetak...</span>
                </div>
              ) : (
                <div
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.15s ease-out',
                  }}
                  className="flex items-center justify-center shrink-0"
                >
                  {/* ELEMEN LEMBAR CETAK (ID DITARGETKAN OLEH @media print) */}
                  <div
                    id="galur-print-sheet"
                    style={{
                      aspectRatio: `${getAspectRatio()}`,
                      width: orientation === 'landscape' ? '680px' : '480px',
                      padding: marginPaddingMap[margin],
                      filter: isGrayscale ? 'grayscale(100%)' : 'none',
                    }}
                    className="bg-white text-slate-900 rounded-sm shadow-2xl ring-1 ring-black/20 relative flex flex-col justify-between overflow-hidden transition-all"
                  >
                    {/* Watermark Diagonal (Opsional) */}
                    {showWatermark && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 overflow-hidden">
                        <span className="text-6xl sm:text-7xl font-black text-rose-500/15 uppercase tracking-widest rotate-[-28deg] whitespace-nowrap">
                          {watermarkText}
                        </span>
                      </div>
                    )}

                    {/* 1. Header Lembar Cetak */}
                    {showHeader && (
                      <div className="border-b border-slate-200 pb-2 mb-2 flex items-center justify-between text-left shrink-0">
                        <div className="min-w-0 pr-2">
                          <h2 className="font-extrabold text-sm sm:text-base text-slate-900 truncate tracking-tight">
                            {diagramTitle || 'Dokumen Diagram'}
                          </h2>
                          <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>Sistem Informasi GALUR Studio</span>
                            <span>•</span>
                            <span>Bidang IKP Diskominfo</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-500 block">
                            Dicetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 block">
                            {nodes.length} Elemen • {edges.length} Alur
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 2. Area Gambar Diagram (Body Lembar) */}
                    <div className="flex-1 flex items-center justify-center overflow-hidden relative min-h-0">
                      {snapshotUrl ? (
                        <img
                          src={snapshotUrl}
                          alt="Pratinjau Diagram"
                          style={{
                            transform: scaleMode === 'custom' ? `scale(${customScale / 100})` : 'none',
                            maxHeight: scaleMode === 'fit' ? '100%' : undefined,
                            maxWidth: scaleMode === 'fit' ? '100%' : undefined,
                          }}
                          className="object-contain transition-transform"
                        />
                      ) : (
                        <div className="text-xs text-slate-400">Tidak ada gambar diagram</div>
                      )}
                    </div>

                    {/* 3. Footer Lembar Cetak */}
                    {showFooter && (
                      <div className="border-t border-slate-200 pt-1.5 mt-2 flex items-center justify-between text-[9.5px] text-slate-500 shrink-0">
                        <span>
                          Arsip Digital • Dokumen Sah Kedinasan & Penyiaran IKP
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-700">Halaman 1 dari 1</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SISI KANAN: PANEL KONTROL PENGATURAN CETAK */}
          <div className="w-full lg:w-84 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col min-h-0 shrink-0">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/60">
              <Sliders className="w-4 h-4 text-emerald-700" />
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                Pengaturan Lembar Cetak
              </h4>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* 1. Orientasi Kertas */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Orientasi Kertas
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setOrientation('landscape')}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer font-semibold ${
                      orientation === 'landscape'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Landscape (Mendatar)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrientation('portrait')}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer font-semibold ${
                      orientation === 'portrait'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Portrait (Tegak)
                  </button>
                </div>
              </div>

              {/* 2. Ukuran Kertas */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ukuran Kertas
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['a4', 'a3', 'letter', 'legal'] as PaperSize[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setPaperSize(sz)}
                      className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer font-semibold uppercase ${
                        paperSize === sz
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  {paperLabels[paperSize].dim}
                </p>
              </div>

              {/* 3. Skala Diagram */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Skala Diagram
                </label>
                <div className="space-y-1.5">
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setScaleMode('fit')}
                      className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer font-semibold ${
                        scaleMode === 'fit'
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Paskan (Fit)
                    </button>
                    <button
                      type="button"
                      onClick={() => setScaleMode('100')}
                      className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer font-semibold ${
                        scaleMode === '100'
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Ukuran Asli 100%
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setScaleMode('custom')}
                    className={`w-full py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer font-semibold ${
                      scaleMode === 'custom'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Kustom Skala ({customScale}%)
                  </button>

                  {scaleMode === 'custom' && (
                    <div className="pt-1 px-1 flex items-center gap-2">
                      <input
                        type="range"
                        min={40}
                        max={160}
                        step={5}
                        value={customScale}
                        onChange={(e) => setCustomScale(Number(e.target.value))}
                        className="flex-1 accent-emerald-700 cursor-pointer"
                      />
                      <span className="font-mono text-xs font-bold w-10 text-right">
                        {customScale}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Margin Kertas */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Batas Margin Kertas
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMargin('standard')}
                    className={`py-1.5 px-2 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                      margin === 'standard'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Standar (14mm)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMargin('narrow')}
                    className={`py-1.5 px-2 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                      margin === 'narrow'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Sempit (6mm)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMargin('wide')}
                    className={`py-1.5 px-2 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                      margin === 'wide'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Lebar (22mm)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMargin('none')}
                    className={`py-1.5 px-2 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                      margin === 'none'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Tanpa Margin
                  </button>
                </div>
              </div>

              {/* 5. Tampilan Elemen Tambahan */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Elemen Dokumen
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={showHeader}
                    onChange={(e) => setShowHeader(e.target.checked)}
                    className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                  />
                  <span>Tampilkan Header (Judul & Tanggal)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={showFooter}
                    onChange={(e) => setShowFooter(e.target.checked)}
                    className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                  />
                  <span>Tampilkan Footer (Nomor Halaman)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={isGrayscale}
                    onChange={(e) => setIsGrayscale(e.target.checked)}
                    className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                  />
                  <span>Hitam-Putih / Grayscale (Hemat Tinta)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={showWatermark}
                    onChange={(e) => setShowWatermark(e.target.checked)}
                    className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                  />
                  <span>Watermark Dokumen</span>
                </label>

                {showWatermark && (
                  <div className="pl-6 pt-1">
                    <select
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden"
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="RAHASIA">RAHASIA (CONFIDENTIAL)</option>
                      <option value="SALINAN RESMI">SALINAN RESMI</option>
                      <option value="ARSIP IKP">ARSIP IKP DISKOMINFO</option>
                      <option value="INTERNAL">PENGGUNAAN INTERNAL</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Tombol Aksi Panel Kanan */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/80 space-y-2">
              <button
                type="button"
                onClick={handlePrint}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0b4632] hover:bg-[#073022] active:bg-[#052218] text-amber-300 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>Cetak Sekarang (Print)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isDownloadingPdf}
                className="w-full py-2 px-3 rounded-xl border border-slate-300 hover:border-emerald-600 hover:bg-emerald-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isDownloadingPdf ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                    <span>Menyiapkan PDF...</span>
                  </>
                ) : pdfSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                    <span>PDF Berhasil Diunduh!</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5 text-red-600" />
                    <span>Unduh PDF Cetak</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
