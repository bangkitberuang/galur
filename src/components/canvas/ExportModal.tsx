'use client';

import React, { useState } from 'react';
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
  Info
} from 'lucide-react';
import { 
  exportToJpegImage, 
  exportToPngImage, 
  exportToSvgImage, 
  exportToPdfDocument, 
  exportToJsonProject, 
  exportToCsvSpreadsheet, 
  exportToVisioVdx,
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
}

export default function ExportModal({ 
  isOpen, 
  onClose, 
  diagramTitle,
  nodes = [],
  edges = [],
  pages = [],
  pageConfig
}: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormatType>('png');
  const [pdfOrientation, setPdfOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [pdfPageSize, setPdfPageSize] = useState<'a4' | 'a3'>('a4');
  const [quality, setQuality] = useState<number>(2); // 2x HD, 3x Ultra
  const [transparentBg, setTransparentBg] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs no-print p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Dialog */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0b4632] text-amber-300 flex items-center justify-center shadow-md">
              <Download className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Ekspor & Cetak Diagram
              </h3>
              <p className="text-xs text-slate-500">
                Pilih format sesuai kebutuhan presentasi, dokumentasi, atau interoperabilitas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Pilihan Format Lengkap 7 Format */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Pilih Format Berkas
            </label>

            {/* Kategori 1: Gambar & Vektor */}
            <div className="space-y-1.5 mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Gambar & Vektor
              </span>
              <div className="grid grid-cols-3 gap-2">
                {/* PNG */}
                <button
                  type="button"
                  onClick={() => setFormat('png')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                    format === 'png'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">PNG</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Rekomendasi
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    Gambar HD jernih, dukung transparan
                  </span>
                </button>

                {/* JPEG */}
                <button
                  type="button"
                  onClick={() => setFormat('jpg')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                    format === 'jpg'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">JPEG</span>
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    Kompresi ringan untuk dokumen & web
                  </span>
                </button>

                {/* SVG */}
                <button
                  type="button"
                  onClick={() => setFormat('svg')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                    format === 'svg'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">SVG</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      Vektor
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    Grafik vektor tanpa pecah, Adobe/Figma
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
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                    format === 'pdf'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-red-500" />
                      <span className="font-extrabold text-sm text-slate-900">PDF Document</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      A4/A3
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    Format dokumen resmi siap print & arsip laporan
                  </span>
                </button>

                {/* VISIO VDX / VSDX */}
                <button
                  type="button"
                  onClick={() => setFormat('visio')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                    format === 'visio'
                      ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-blue-600" />
                      <span className="font-extrabold text-sm text-blue-950">Visio (VDX / VSDX)</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      MS Visio
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    Dapat dibuka langsung oleh Microsoft Visio 2003-365
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
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                    format === 'json'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-amber-600" />
                      <span className="font-extrabold text-sm text-slate-900">JSON Project</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Cadangan
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    Cadangan proyek penuh (node, koneksi, gaya, multi-halaman)
                  </span>
                </button>

                {/* CSV */}
                <button
                  type="button"
                  onClick={() => setFormat('csv')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                    format === 'csv'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Table className="w-4 h-4 text-emerald-600" />
                      <span className="font-extrabold text-sm text-slate-900">Tabel CSV (Excel)</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Spreadsheet
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    Tabel daftar elemen & relasi untuk Excel & Google Sheets
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Opsi Spesifik Format Terpilih */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-3.5">
            {/* OPSI PDF */}
            {format === 'pdf' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Orientasi Halaman
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPdfOrientation('landscape')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        pdfOrientation === 'landscape'
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Landscape (Mendatar)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPdfOrientation('portrait')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        pdfOrientation === 'portrait'
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Portrait (Tegak)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Ukuran Dokumen PDF
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPdfPageSize('a4')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        pdfPageSize === 'a4'
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      A4 (Standar 210×297 mm)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPdfPageSize('a3')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        pdfPageSize === 'a3'
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      A3 (Besar 297×420 mm)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* OPSI PNG / JPG / SVG */}
            {(format === 'png' || format === 'jpg' || format === 'svg') && (
              <div className="space-y-3">
                {format !== 'svg' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Resolusi Gambar
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setQuality(2)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                          quality === 2
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Standar HD (2x)
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuality(3)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                          quality === 3
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Ultra High (3x - Tajam)
                      </button>
                    </div>
                  </div>
                )}

                {(format === 'png' || format === 'svg') && (
                  <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={transparentBg}
                      onChange={(e) => setTransparentBg(e.target.checked)}
                      className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <span>Latar belakang transparan (tanpa warna putih kanvas)</span>
                  </label>
                )}
              </div>
            )}

            {/* OPSI VISIO */}
            {format === 'visio' && (
              <div className="flex items-start gap-2.5 text-xs text-blue-900 bg-blue-50/90 p-3 rounded-xl border border-blue-200/80">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Format Microsoft Visio XML (.vdx)</p>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    Berkas ini dibuat sesuai skema standar Microsoft Visio XML Drawing. Anda dapat membukanya secara langsung di <strong>Microsoft Visio (versi 2003, 2007, 2010, 2013, 2016, 2019, 2021, hingga Visio Plan / 365)</strong>, dan menyimpannya sebagai format <strong>.vsdx</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* OPSI JSON */}
            {format === 'json' && (
              <div className="flex items-start gap-2.5 text-xs text-amber-900 bg-amber-50/90 p-3 rounded-xl border border-amber-200/80">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Cadangan Proyek Lengkap (JSON)</p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Menyimpan seluruh {nodes.length} bentuk, {edges.length} konektor relasi, ukuran halaman, dan styling kustom secara lossless. Berguna untuk memindahkan berkas antar perangkat atau memulihkan data.
                  </p>
                </div>
              </div>
            )}

            {/* OPSI CSV */}
            {format === 'csv' && (
              <div className="flex items-start gap-2.5 text-xs text-emerald-950 bg-emerald-50/90 p-3 rounded-xl border border-emerald-200/80">
                <Table className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Tabel Spreadsheet (CSV dengan UTF-8 BOM)</p>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Mengekspor 2 lembar data terstruktur: tabel bentuk (ID, koordinat, dimensi, label, kategori) dan tabel relasi alur. Siap dibuka di <strong>Microsoft Excel</strong>, Google Sheets, atau diimpor ke database.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/80">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-600 hover:text-emerald-800 hover:bg-emerald-50/40 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">Print Langsung</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0b4632] hover:bg-[#073022] text-amber-300 text-xs font-bold shadow-md shadow-emerald-950/20 transition-all disabled:opacity-50 cursor-pointer"
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
