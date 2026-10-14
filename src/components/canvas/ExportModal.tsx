'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { 
  Download, 
  Printer, 
  FileText, 
  Image as ImageIcon, 
  X, 
  Check, 
  Loader2, 
  Code2, 
  Table, 
  Layers, 
  Sparkles,
  Info,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Copy,
  Eye
} from 'lucide-react';
import { 
  exportToJpegImage, 
  exportToPngImage, 
  exportToSvgImage, 
  exportToPdfDocument, 
  exportToJsonProject, 
  exportToCsvSpreadsheet, 
  exportToVisioVdx,
  captureDiagramSnapshot,
  getDiagramDimensions,
  generatePreviewJsonSnippet,
  generatePreviewCsvRows,
  DiagramPageData
} from '@/lib/exportUtils';
import { CanvasPageConfig } from './CanvasPageFrame';

export type ExportFormatType = 'pdf' | 'png' | 'jpg' | 'svg' | 'visio' | 'json' | 'csv';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagramTitle: string;
  nodes?: Node[];
  edges?: Edge[];
  pages?: DiagramPageData[];
  pageConfig?: CanvasPageConfig;
  onOpenPrintPreview?: () => void;
}

export default function ExportModal({ 
  isOpen, 
  onClose, 
  diagramTitle,
  nodes = [],
  edges = [],
  pages = [],
  pageConfig,
  onOpenPrintPreview
}: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormatType>('png');
  const [pdfOrientation, setPdfOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [pdfPageSize, setPdfPageSize] = useState<'a4' | 'a3'>('a4');
  const [quality, setQuality] = useState<number>(2); // 2x HD, 3x Ultra
  const [transparentBg, setTransparentBg] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // State Pratinjau Unduh (Download Preview)
  const [previewSnapshot, setPreviewSnapshot] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(true);
  const [previewZoom, setPreviewZoom] = useState<number>(1);
  const [isCopiedJson, setIsCopiedJson] = useState<boolean>(false);

  // Ambil cuplikan diagram untuk pratinjau live
  const loadPreview = useCallback(async () => {
    setIsLoadingPreview(true);
    try {
      const isTransparent = transparentBg && (format === 'png' || format === 'svg');
      const url = await captureDiagramSnapshot(isTransparent, 1.8);
      setPreviewSnapshot(url);
    } catch (err) {
      console.error('Gagal memuat pratinjau unduh:', err);
    } finally {
      setIsLoadingPreview(false);
    }
  }, [transparentBg, format]);

  useEffect(() => {
    if (isOpen) {
      loadPreview();
    }
  }, [isOpen, loadPreview]);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const fileName = `${diagramTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      const element = document.querySelector('.react-flow__viewport') as HTMLElement;

      // 1. Ekspor Visio (VDX)
      if (format === 'visio') {
        exportToVisioVdx(diagramTitle, nodes, edges, pageConfig, fileName);
      }
      // 2. Ekspor JSON (Cadangan Proyek Penuh)
      else if (format === 'json') {
        exportToJsonProject(diagramTitle, nodes, edges, pages, pageConfig, fileName);
      }
      // 3. Ekspor CSV (Tabel Data Excel / Google Sheets)
      else if (format === 'csv') {
        exportToCsvSpreadsheet(diagramTitle, nodes, edges, fileName);
      }
      // 4. Ekspor SVG
      else if (format === 'svg') {
        if (!element) throw new Error('Kanvas diagram tidak ditemukan');
        await exportToSvgImage(element, fileName, transparentBg);
      }
      // 5. Ekspor PNG
      else if (format === 'png') {
        if (!element) throw new Error('Kanvas diagram tidak ditemukan');
        await exportToPngImage(element, fileName, quality, transparentBg);
      }
      // 6. Ekspor JPG
      else if (format === 'jpg') {
        if (!element) throw new Error('Kanvas diagram tidak ditemukan');
        await exportToJpegImage(element, fileName, quality);
      }
      // 7. Ekspor PDF
      else if (format === 'pdf') {
        if (!element) throw new Error('Kanvas diagram tidak ditemukan');
        await exportToPdfDocument(element, fileName, pdfOrientation, pdfPageSize, quality);
      }

      setExportSuccess(true);
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 1200);
    } catch (error) {
      console.error('Gagal mengekspor diagram:', error);
      alert('Terjadi kesalahan saat memproses ekspor berkas.');
      setIsExporting(false);
    }
  };

  const handleCopyJson = () => {
    const jsonStr = generatePreviewJsonSnippet(diagramTitle, nodes, edges);
    navigator.clipboard.writeText(jsonStr);
    setIsCopiedJson(true);
    setTimeout(() => setIsCopiedJson(false), 2000);
  };

  const dim = getDiagramDimensions(nodes);
  const estimatedWidthPx = Math.round(dim.width * quality);
  const estimatedHeightPx = Math.round(dim.height * quality);

  const previewJsonSnippet = generatePreviewJsonSnippet(diagramTitle, nodes, edges);
  const previewCsvRows = generatePreviewCsvRows(nodes, edges);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs no-print p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden flex flex-col h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================= */}
        {/* HEADER DIALOG */}
        {/* ========================================================= */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0b4632] text-amber-300 flex items-center justify-center shadow-md">
              <Download className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Ekspor & Unduh Diagram
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Pratinjau Live
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Pilih format sesuai kebutuhan presentasi, dokumentasi, arsip IKP, atau interoperabilitas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenPrintPreview && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPrintPreview();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                title="Buka Lembar Pratinjau Cetak Fisik (A4/A3)"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pratinjau Cetak</span>
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
        {/* BODY: SPLIT VIEW (PILIHAN FORMAT KIRI & PRATINJAU UNDUH KANAN) */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* KOLOM KIRI: PILIHAN FORMAT & OPSI */}
          <div className="w-full md:w-[380px] lg:w-[420px] bg-slate-50/70 border-r border-slate-200 overflow-y-auto p-4 sm:p-5 space-y-4 shrink-0">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Pilih Format Berkas
              </label>

              {/* Kategori 1: Gambar & Vektor */}
              <div className="space-y-1.5 mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Gambar & Vektor
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {/* PNG */}
                  <button
                    type="button"
                    onClick={() => setFormat('png')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-18 ${
                      format === 'png'
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-extrabold text-xs text-slate-900">PNG</span>
                      <span className="text-[9px] font-bold px-1 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                        Top
                      </span>
                    </div>
                    <span className="text-[9.5px] text-slate-500 leading-tight">
                      HD jernih, transparan
                    </span>
                  </button>

                  {/* JPEG */}
                  <button
                    type="button"
                    onClick={() => setFormat('jpg')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-18 ${
                      format === 'jpg'
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-extrabold text-xs text-slate-900">JPEG</span>
                      <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <span className="text-[9.5px] text-slate-500 leading-tight">
                      Kompresi ringan
                    </span>
                  </button>

                  {/* SVG */}
                  <button
                    type="button"
                    onClick={() => setFormat('svg')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-18 ${
                      format === 'svg'
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-extrabold text-xs text-slate-900">SVG</span>
                      <span className="text-[9px] font-bold px-1 py-0.2 rounded-full bg-blue-100 text-blue-800">
                        Vektor
                      </span>
                    </div>
                    <span className="text-[9.5px] text-slate-500 leading-tight">
                      Vektor tajam Figma
                    </span>
                  </button>
                </div>
              </div>

              {/* Kategori 2: Dokumen Cetak & Visio */}
              <div className="space-y-1.5 mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Dokumen Cetak & Microsoft Visio
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {/* PDF */}
                  <button
                    type="button"
                    onClick={() => setFormat('pdf')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-18 ${
                      format === 'pdf'
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-red-500" />
                        <span className="font-extrabold text-xs text-slate-900">PDF Document</span>
                      </div>
                      <span className="text-[9px] font-bold px-1 py-0.2 rounded-full bg-slate-100 text-slate-700">
                        A4/A3
                      </span>
                    </div>
                    <span className="text-[9.5px] text-slate-500 leading-tight">
                      Format resmi arsip & print
                    </span>
                  </button>

                  {/* VISIO VDX / VSDX */}
                  <button
                    type="button"
                    onClick={() => setFormat('visio')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-18 ${
                      format === 'visio'
                        ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-extrabold text-xs text-blue-950">Visio (VDX)</span>
                      </div>
                      <span className="text-[9px] font-bold px-1 py-0.2 rounded-full bg-blue-100 text-blue-800">
                        Visio
                      </span>
                    </div>
                    <span className="text-[9.5px] text-slate-500 leading-tight">
                      Kompatibel MS Visio
                    </span>
                  </button>
                </div>
              </div>

              {/* Kategori 3: Data & Cadangan */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Data & Cadangan Proyek
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {/* JSON */}
                  <button
                    type="button"
                    onClick={() => setFormat('json')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-18 ${
                      format === 'json'
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-amber-600" />
                        <span className="font-extrabold text-xs text-slate-900">JSON Project</span>
                      </div>
                      <span className="text-[9px] font-bold px-1 py-0.2 rounded-full bg-amber-100 text-amber-800">
                        Full
                      </span>
                    </div>
                    <span className="text-[9.5px] text-slate-500 leading-tight">
                      Cadangan proyek lengkap
                    </span>
                  </button>

                  {/* CSV */}
                  <button
                    type="button"
                    onClick={() => setFormat('csv')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-18 ${
                      format === 'csv'
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5">
                        <Table className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-extrabold text-xs text-slate-900">Tabel CSV</span>
                      </div>
                      <span className="text-[9px] font-bold px-1 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                        Excel
                      </span>
                    </div>
                    <span className="text-[9.5px] text-slate-500 leading-tight">
                      Daftar data elemen & alur
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* OPSI SPESIFIK FORMAT */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-3">
              {/* OPSI PDF */}
              {format === 'pdf' && (
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Orientasi Halaman
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPdfOrientation('landscape')}
                        className={`py-1.5 px-2 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                          pdfOrientation === 'landscape'
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Landscape
                      </button>
                      <button
                        type="button"
                        onClick={() => setPdfOrientation('portrait')}
                        className={`py-1.5 px-2 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                          pdfOrientation === 'portrait'
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Portrait
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Ukuran Kertas PDF
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPdfPageSize('a4')}
                        className={`py-1.5 px-2 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                          pdfPageSize === 'a4'
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        A4 (Standar)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPdfPageSize('a3')}
                        className={`py-1.5 px-2 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                          pdfPageSize === 'a3'
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        A3 (Besar)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* OPSI GAMBAR (PNG / JPG / SVG) */}
              {(format === 'png' || format === 'jpg' || format === 'svg') && (
                <div className="space-y-2.5">
                  {format !== 'svg' && (
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Resolusi & Skala
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setQuality(2)}
                          className={`py-1.5 px-2 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                            quality === 2
                              ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          Standar HD (2x)
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuality(3)}
                          className={`py-1.5 px-2 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                            quality === 3
                              ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          Ultra HD (3x)
                        </button>
                      </div>
                    </div>
                  )}

                  {(format === 'png' || format === 'svg') && (
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer pt-0.5">
                      <input
                        type="checkbox"
                        checked={transparentBg}
                        onChange={(e) => setTransparentBg(e.target.checked)}
                        className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                      />
                      <span>Latar belakang transparan</span>
                    </label>
                  )}
                </div>
              )}

              {/* OPSI VISIO */}
              {format === 'visio' && (
                <div className="flex items-start gap-2 text-xs text-blue-900 bg-blue-50/80 p-2.5 rounded-xl border border-blue-200/80">
                  <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-[11px] text-blue-800 leading-relaxed">
                    <p className="font-bold">Skema Standar Visio XML (.vdx)</p>
                    <p>Dapat diedit di Microsoft Visio 2003-365 & disimpan ke .vsdx.</p>
                  </div>
                </div>
              )}

              {/* OPSI JSON */}
              {format === 'json' && (
                <div className="flex items-start gap-2 text-xs text-amber-900 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80">
                  <Code2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-[11px] text-amber-800 leading-relaxed">
                    <p className="font-bold">Cadangan Proyek Lossless</p>
                    <p>Menyimpan {nodes.length} bentuk, styling, dan koneksi alur lengkap.</p>
                  </div>
                </div>
              )}

              {/* OPSI CSV */}
              {format === 'csv' && (
                <div className="flex items-start gap-2 text-xs text-emerald-950 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/80">
                  <Table className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-[11px] text-emerald-800 leading-relaxed">
                    <p className="font-bold">Format Excel / Spreadsheet</p>
                    <p>Tabel elemen, koordinat, dimensi, dan relasi alur berformat UTF-8 BOM.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* KOLOM KANAN: PRATINJAU UNDUH (DOWNLOAD PREVIEW) */}
          <div className="flex-1 bg-slate-900 flex flex-col min-h-0 select-none overflow-hidden">
            {/* Top Bar Preview */}
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-bold text-slate-200 truncate">
                  Pratinjau Unduh: {format.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                  {estimatedWidthPx} × {estimatedHeightPx} px
                </span>
              </div>

              {/* Kontrol Zoom Pratinjau */}
              <div className="flex items-center gap-1.5 bg-slate-800/90 px-2 py-0.5 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => setPreviewZoom((z) => Math.max(0.5, Number((z - 0.2).toFixed(2))))}
                  className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Perkecil Pratinjau"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono font-bold text-slate-300 min-w-[32px] text-center">
                  {Math.round(previewZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewZoom((z) => Math.min(2.0, Number((z + 0.2).toFixed(2))))}
                  className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Perbesar Pratinjau"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <div className="w-[1px] h-3 bg-slate-700 mx-0.5" />
                <button
                  type="button"
                  onClick={() => setPreviewZoom(1)}
                  className="text-[10px] font-semibold text-slate-300 hover:text-emerald-400 px-1 py-0.5"
                  title="Atur Ulang Zoom"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={loadPreview}
                  className="p-1 text-slate-400 hover:text-emerald-400 transition-colors ml-1 cursor-pointer"
                  title="Perbarui Cuplikan"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingPreview ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Area Pratinjau Live */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center">
              {isLoadingPreview ? (
                <div className="flex flex-col items-center justify-center gap-2.5 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                  <span className="text-xs font-medium">Menyiapkan pratinjau berkas unduhan...</span>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {/* PREVIEW GAMBAR & PDF (PNG, JPG, SVG, PDF) */}
                  {(format === 'png' || format === 'jpg' || format === 'svg' || format === 'pdf') && (
                    <div
                      style={{
                        transform: `scale(${previewZoom})`,
                        transformOrigin: 'center center',
                        transition: 'transform 0.15s ease-out',
                      }}
                      className={`max-w-full max-h-full rounded-xl shadow-2xl p-2 transition-all ${
                        transparentBg && (format === 'png' || format === 'svg')
                          ? 'bg-checkered border border-slate-700'
                          : 'bg-white border border-slate-200'
                      }`}
                    >
                      {previewSnapshot ? (
                        <img
                          src={previewSnapshot}
                          alt="Pratinjau Unduh"
                          className="max-h-[60vh] max-w-full object-contain rounded-md drop-shadow-sm select-none pointer-events-none"
                        />
                      ) : (
                        <div className="p-8 text-xs text-slate-400">Cuplikan tidak tersedia</div>
                      )}
                    </div>
                  )}

                  {/* PREVIEW VISIO (VDX) */}
                  {format === 'visio' && (
                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-blue-200 p-5 space-y-4 text-slate-800">
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs">
                          <Layers className="w-5 h-5 text-blue-700" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">
                            Berkas Microsoft Visio XML (.vdx)
                          </h4>
                          <p className="text-xs text-slate-500">
                            Kompatibilitas Standar Microsoft Visio Drawing
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                          <span className="text-[10px] font-bold text-blue-600 uppercase block">Total Bentuk (Shapes)</span>
                          <span className="text-lg font-black text-blue-950">{nodes.length}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                          <span className="text-[10px] font-bold text-blue-600 uppercase block">Total Konektor Alur</span>
                          <span className="text-lg font-black text-blue-950">{edges.length}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                        <div className="font-bold text-slate-800">Dukungan Versi Visio:</div>
                        <p>✓ Microsoft Visio 2003, 2007, 2010, 2013, 2016, 2019, 2021</p>
                        <p>✓ Microsoft 365 / Visio Plan 2 (dapat langsung disimpan ke .vsdx)</p>
                      </div>

                      {previewSnapshot && (
                        <div className="pt-2">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                            Cuplikan Visual Objek:
                          </div>
                          <div className="bg-slate-100 rounded-lg p-2 border border-slate-200 max-h-36 overflow-hidden flex items-center justify-center">
                            <img src={previewSnapshot} alt="Visio Thumbnail" className="max-h-32 object-contain" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* PREVIEW JSON */}
                  {format === 'json' && (
                    <div className="w-full max-w-xl bg-slate-950 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[65vh]">
                      <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {diagramTitle.toLowerCase().replace(/\s+/g, '-')}.json
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyJson}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          {isCopiedJson ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 text-[10px]">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-300" />
                              <span className="text-[10px]">Salin JSON</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-4 font-mono text-[11px] text-emerald-400 overflow-auto flex-1 leading-relaxed selection:bg-emerald-900">
                        {previewJsonSnippet}
                      </pre>
                    </div>
                  )}

                  {/* PREVIEW CSV */}
                  {format === 'csv' && (
                    <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[65vh]">
                      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                          Pratinjau Data Spreadsheet ({previewCsvRows.length} dari {nodes.length} baris)
                        </span>
                        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                          UTF-8 Excel
                        </span>
                      </div>
                      <div className="overflow-auto flex-1 text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-100/80 border-b border-slate-200 text-[10.5px] font-bold text-slate-700 uppercase">
                              <th className="p-2 border-r border-slate-200">ID</th>
                              <th className="p-2 border-r border-slate-200">Label</th>
                              <th className="p-2 border-r border-slate-200">Tipe</th>
                              <th className="p-2">Posisi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {previewCsvRows.map((r, i) => (
                              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 text-[11px] font-mono">
                                <td className="p-2 border-r border-slate-100 text-slate-500">{r.id}</td>
                                <td className="p-2 border-r border-slate-100 font-sans font-semibold text-slate-800">{r.label}</td>
                                <td className="p-2 border-r border-slate-100 text-blue-600">{r.type}</td>
                                <td className="p-2 text-slate-500">{r.position}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* FOOTER ACTIONS */}
        {/* ========================================================= */}
        <div className="px-5 py-3.5 border-t border-slate-200 flex items-center justify-between gap-3 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-2">
            {onOpenPrintPreview && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPrintPreview();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:border-emerald-600 hover:bg-emerald-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                title="Buka Lembar Pratinjau Cetak Lengkap"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-700" />
                <span>Buka Pratinjau Cetak (Print)</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0b4632] hover:bg-[#073022] active:bg-[#052218] text-amber-300 text-xs font-bold shadow-md shadow-emerald-950/20 transition-all disabled:opacity-50 cursor-pointer min-w-[170px]"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                <span>Memproses Ekspor...</span>
              </>
            ) : exportSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                <span>Berhasil Diunduh!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-amber-300" />
                <span>Unduh {format.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
