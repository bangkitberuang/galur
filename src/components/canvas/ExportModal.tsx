'use client';

import React, { useState } from 'react';
import { toJpeg, toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Download, Printer, FileText, Image, X, Check, Loader2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagramTitle: string;
}

export default function ExportModal({ isOpen, onClose, diagramTitle }: ExportModalProps) {
  const [format, setFormat] = useState<'jpg' | 'png' | 'pdf'>('jpg');
  const [pdfOrientation, setPdfOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [quality, setQuality] = useState<number>(2); // 2x for sharp print
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const element = document.querySelector('.react-flow__viewport') as HTMLElement;
      if (!element) {
        throw new Error('Canvas tidak ditemukan');
      }

      const fileName = `${diagramTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

      if (format === 'jpg') {
        const dataUrl = await toJpeg(element, {
          backgroundColor: '#ffffff',
          pixelRatio: quality,
          quality: 0.95,
        });
        const link = document.createElement('a');
        link.download = `${fileName}.jpg`;
        link.href = dataUrl;
        link.click();
      } else if (format === 'png') {
        const dataUrl = await toPng(element, {
          backgroundColor: '#ffffff',
          pixelRatio: quality,
        });
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = dataUrl;
        link.click();
      } else if (format === 'pdf') {
        const dataUrl = await toPng(element, {
          backgroundColor: '#ffffff',
          pixelRatio: quality,
        });

        const pdf = new jsPDF({
          orientation: pdfOrientation,
          unit: 'mm',
          format: 'a4',
        });

        const img = new (window as any).Image();
        img.src = dataUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const availableWidth = pageWidth - margin * 2;
        const availableHeight = pageHeight - margin * 2;

        const imgRatio = img.width / img.height;
        let printWidth = availableWidth;
        let printHeight = availableWidth / imgRatio;

        if (printHeight > availableHeight) {
          printHeight = availableHeight;
          printWidth = availableHeight * imgRatio;
        }

        const x = (pageWidth - printWidth) / 2;
        const y = (pageHeight - printHeight) / 2;

        pdf.addImage(dataUrl, 'PNG', x, y, printWidth, printHeight);
        pdf.save(`${fileName}.pdf`);
      }

      setExportSuccess(true);
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Gagal mengekspor diagram:', error);
      alert('Terjadi kesalahan saat mengekspor diagram.');
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Cetak & Ekspor Diagram</h3>
            <p className="text-xs text-slate-500">GALUR - Garis Alur, Ngajentrekeun Struktur</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-5">
          {/* Format Pilihan */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Pilih Format Berkas
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormat('jpg')}
                className={`py-3 px-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                  format === 'jpg'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Image className="w-5 h-5" />
                <span>Gambar JPG</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`py-3 px-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                  format === 'pdf'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Dokumen PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('png')}
                className={`py-3 px-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                  format === 'png'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Download className="w-5 h-5" />
                <span>Gambar PNG</span>
              </button>
            </div>
          </div>

          {/* Pengaturan Tambahan PDF */}
          {format === 'pdf' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Orientasi Halaman PDF (A4)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPdfOrientation('landscape')}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-all ${
                    pdfOrientation === 'landscape'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Landscape (Mendatar)
                </button>
                <button
                  type="button"
                  onClick={() => setPdfOrientation('portrait')}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-all ${
                    pdfOrientation === 'portrait'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Portrait (Tegak)
                </button>
              </div>
            </div>
          )}

          {/* Opsi Kualitas Gambar */}
          {(format === 'jpg' || format === 'png') && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Kualitas Resolusi Gambar
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setQuality(2)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-all ${
                    quality === 2
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Standar HD (2x)
                </button>
                <button
                  type="button"
                  onClick={() => setQuality(3)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-all ${
                    quality === 3
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Ultra High (3x - Cetak)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Kertas Langsung</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : exportSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Berhasil Diunduh!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unduh {format.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
