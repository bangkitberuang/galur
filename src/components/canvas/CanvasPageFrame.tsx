'use client';

import React, { memo, useMemo } from 'react';
import { useViewport, Node } from '@xyflow/react';

export interface CanvasPageConfig {
  showPageFrame: boolean;
  pageSize: 'A4' | 'A3' | 'Letter' | 'infinite';
  orientation: 'portrait' | 'landscape';
  autoExpand: boolean;
  showGrid: boolean;
  gridVariant: 'dots' | 'lines' | 'cross';
  gridSize: number;
  snapToGrid: boolean;
  showMarginGuides: boolean;
  canvasTheme: 'light' | 'dark' | 'emerald';
}

export const DEFAULT_PAGE_CONFIG: CanvasPageConfig = {
  showPageFrame: true,
  pageSize: 'A4',
  orientation: 'portrait',
  autoExpand: true,
  showGrid: true,
  gridVariant: 'dots',
  gridSize: 16,
  snapToGrid: true,
  showMarginGuides: true,
  canvasTheme: 'light',
};

// Dimensi standar kertas pada skala 96 DPI (presisi cetak digital)
const PAPER_DIMENSIONS = {
  A4: { width: 800, height: 1130, label: 'A4 (210 × 297 mm)' },
  A3: { width: 1130, height: 1600, label: 'A3 (297 × 420 mm)' },
  Letter: { width: 816, height: 1056, label: 'Letter (8.5 × 11 in)' },
  infinite: { width: 1400, height: 1000, label: 'Tak Terbatas' },
};

interface CanvasPageFrameProps {
  config: CanvasPageConfig;
  nodes: Node[];
}

export const CanvasPageFrame = memo(({ config, nodes }: CanvasPageFrameProps) => {
  const { x, y, zoom } = useViewport();

  // Hitung dimensi dasar lembar kertas sesuai orientasi
  const baseDim = useMemo(() => {
    const raw = PAPER_DIMENSIONS[config.pageSize] || PAPER_DIMENSIONS.A4;
    if (config.pageSize === 'infinite') {
      return { width: 1600, height: 1200, label: 'Tak Terbatas' };
    }
    if (config.orientation === 'landscape') {
      return {
        width: Math.max(raw.width, raw.height),
        height: Math.min(raw.width, raw.height),
        label: `${raw.label} Lanskap`,
      };
    }
    return {
      width: Math.min(raw.width, raw.height),
      height: Math.max(raw.width, raw.height),
      label: `${raw.label} Potret`,
    };
  }, [config.pageSize, config.orientation]);

  // Kalkulasi Auto-Expand: membesar otomatis jika diagram berkembang melebihi 1 halaman
  const layout = useMemo(() => {
    if (!config.showPageFrame) return null;

    const baseW = baseDim.width;
    const baseH = baseDim.height;

    if (!config.autoExpand || config.pageSize === 'infinite' || nodes.length === 0) {
      return {
        cols: 1,
        rows: 1,
        totalWidth: baseW,
        totalHeight: baseH,
        originX: 0,
        originY: 0,
      };
    }

    // Cari batas ekstrem koordinat seluruh bentuk
    let maxX = baseW - 80;
    let maxY = baseH - 80;
    let minX = 40;
    let minY = 40;

    nodes.forEach((n) => {
      const nx = n.position.x;
      const ny = n.position.y;
      const nw = (n.measured?.width as number) || (n.data?.width as number) || 160;
      const nh = (n.measured?.height as number) || (n.data?.height as number) || 80;

      if (nx + nw > maxX) maxX = nx + nw;
      if (ny + nh > maxY) maxY = ny + nh;
      if (nx < minX) minX = nx;
      if (ny < minY) minY = ny;
    });

    // Hitung berapa jumlah halaman A4 yang dibutuhkan (grid kolom x baris)
    const requiredW = Math.max(baseW, maxX + 80);
    const requiredH = Math.max(baseH, maxY + 80);

    const cols = Math.max(1, Math.ceil(requiredW / baseW));
    const rows = Math.max(1, Math.ceil(requiredH / baseH));

    return {
      cols,
      rows,
      totalWidth: cols * baseW,
      totalHeight: rows * baseH,
      originX: 0,
      originY: 0,
    };
  }, [config.showPageFrame, config.autoExpand, config.pageSize, baseDim, nodes]);

  if (!config.showPageFrame || !layout) return null;

  const isDark = config.canvasTheme === 'dark';
  const isEmerald = config.canvasTheme === 'emerald';

  const sheetBg = isDark ? '#181b20' : isEmerald ? '#fcfdfb' : '#ffffff';
  const sheetBorder = isDark ? '#2d333b' : isEmerald ? '#d1fae5' : '#cbd5e1';
  const shadowColor = isDark
    ? 'rgba(0, 0, 0, 0.7)'
    : isEmerald
    ? 'rgba(16, 185, 129, 0.12)'
    : 'rgba(15, 23, 42, 0.12)';
  const dividerColor = isDark ? '#374151' : '#e2e8f0';
  const marginColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';

  // Buat array lembar halaman untuk grid multi-page
  const pages: Array<{ col: number; row: number; pageNumber: number }> = [];
  let pageNum = 1;
  for (let r = 0; r < layout.rows; r++) {
    for (let c = 0; c < layout.cols; c++) {
      pages.push({ col: c, row: r, pageNumber: pageNum++ });
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        transform: `translate(${x}px, ${y}px) scale(${zoom})`,
        transformOrigin: '0 0',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      className="no-print select-none"
    >
      {/* Lembar Halaman Utama (Paper Sheet) */}
      <div
        style={{
          position: 'absolute',
          left: layout.originX,
          top: layout.originY,
          width: layout.totalWidth,
          height: layout.totalHeight,
          backgroundColor: sheetBg,
          border: `1.5px solid ${sheetBorder}`,
          boxShadow: `0 20px 45px -10px ${shadowColor}, 0 0 0 1px ${sheetBorder}`,
          borderRadius: '8px',
          transition: 'width 0.3s ease, height 0.3s ease',
        }}
      >
        {/* Render masing-masing halaman A4 */}
        {pages.map(({ col, row, pageNumber }) => {
          const left = col * baseDim.width;
          const top = row * baseDim.height;
          const isSingle = layout.cols === 1 && layout.rows === 1;

          return (
            <div
              key={`page-${pageNumber}`}
              style={{
                position: 'absolute',
                left,
                top,
                width: baseDim.width,
                height: baseDim.height,
              }}
            >
              {/* Garis batas pemisah antar halaman (jika multi-halaman) */}
              {col > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '1px',
                    borderLeft: `1.5px dashed ${dividerColor}`,
                  }}
                />
              )}
              {row > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    borderTop: `1.5px dashed ${dividerColor}`,
                  }}
                />
              )}

              {/* Panduan Margin Cetak (15mm / 42px inset) */}
              {config.showMarginGuides && (
                <div
                  style={{
                    position: 'absolute',
                    left: 42,
                    top: 42,
                    right: 42,
                    bottom: 42,
                    border: `1px dashed ${marginColor}`,
                    borderRadius: '4px',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Label Info Halaman di Sudut Kanan Atas */}
              <div
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 20,
                  pointerEvents: 'none',
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider ${
                  isDark
                    ? 'bg-slate-800/90 text-slate-300 border border-slate-700'
                    : 'bg-slate-100/90 text-slate-500 border border-slate-200'
                }`}
              >
                <span>{baseDim.label}</span>
                <span>•</span>
                <span>Halaman {pageNumber}</span>
                {!isSingle && (
                  <span className="ml-1 text-[9px] px-1.5 py-0.2 rounded bg-blue-500 text-white font-sans">
                    {layout.cols}×{layout.rows} Lembar
                  </span>
                )}
              </div>

              {/* Badge Auto-Expand di Sudut Kiri Bawah (Hanya di Halaman 1) */}
              {pageNumber === 1 && config.autoExpand && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 14,
                    left: 20,
                    pointerEvents: 'none',
                  }}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-semibold ${
                    isDark
                      ? 'text-slate-400 bg-slate-800/60'
                      : 'text-slate-400 bg-slate-100/80'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Kanvas Otomatis Membesar (Auto-Expand)</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

CanvasPageFrame.displayName = 'CanvasPageFrame';
