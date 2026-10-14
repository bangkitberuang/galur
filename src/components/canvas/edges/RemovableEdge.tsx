'use client';

import React, { memo, useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  useReactFlow,
} from '@xyflow/react';
import { 
  X, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  MoveVertical, 
  MoveHorizontal, 
  RotateCcw,
  Minus,
  Plus
} from 'lucide-react';

interface CustomEdgeData {
  label?: string;
  offset?: number;
  shiftX?: number;
  shiftY?: number;
  curvature?: number;
  [key: string]: any;
}

// 1. Edge Siku-Siku Patah (SmoothStep / Step - Visio Standard) dengan Kontrol Geser Posisi 3 Siku (Kiri/Kanan & Atas/Bawah), Reset & Tombol Hapus (×)
export const RemovableStepEdge = memo((props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    selected,
    label,
    data = {},
  } = props;

  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);

  const edgeData = (data as CustomEdgeData) || {};
  const currentOffset = typeof edgeData.offset === 'number' ? edgeData.offset : 25;
  const shiftX = typeof edgeData.shiftX === 'number' ? edgeData.shiftX : 0;
  const shiftY = typeof edgeData.shiftY === 'number' ? edgeData.shiftY : 0;

  const defaultCenterX = (sourceX + targetX) / 2;
  const defaultCenterY = (sourceY + targetY) / 2;

  // Sesuaikan offset dinamis untuk koneksi satu sisi (looping top-top, bottom-bottom, dll.)
  let effectiveOffset = currentOffset;
  if (sourcePosition === 'top' && targetPosition === 'top') {
    effectiveOffset = Math.max(10, Math.min(350, currentOffset - shiftY));
  } else if (sourcePosition === 'bottom' && targetPosition === 'bottom') {
    effectiveOffset = Math.max(10, Math.min(350, currentOffset + shiftY));
  } else if (sourcePosition === 'left' && targetPosition === 'left') {
    effectiveOffset = Math.max(10, Math.min(350, currentOffset - shiftX));
  } else if (sourcePosition === 'right' && targetPosition === 'right') {
    effectiveOffset = Math.max(10, Math.min(350, currentOffset + shiftX));
  }

  const effectiveCenterX = defaultCenterX + shiftX;
  const effectiveCenterY = defaultCenterY + shiftY;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8,
    offset: effectiveOffset,
    centerX: shiftX !== 0 ? effectiveCenterX : undefined,
    centerY: shiftY !== 0 ? effectiveCenterY : undefined,
  });

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  const handleChangeType = (newType: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === id ? { ...edge, type: newType, selected: true } : edge
      )
    );
  };

  // Nudge posisi horizontal (Kiri / Kanan)
  const handleNudgeX = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextShiftX = Math.max(-400, Math.min(400, shiftX + delta));
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === id
          ? {
              ...edge,
              data: {
                ...(edge.data || {}),
                shiftX: nextShiftX,
              },
            }
          : edge
      )
    );
  };

  // Nudge posisi vertikal (Atas / Bawah)
  const handleNudgeY = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextShiftY = Math.max(-400, Math.min(400, shiftY + delta));
    const nextOffset = Math.max(10, Math.min(350, currentOffset + delta));
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === id
          ? {
              ...edge,
              data: {
                ...(edge.data || {}),
                shiftY: nextShiftY,
                offset: nextOffset,
              },
            }
          : edge
      )
    );
  };

  // Reset siku ke posisi tengah / default
  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === id
          ? {
              ...edge,
              data: {
                ...(edge.data || {}),
                shiftX: 0,
                shiftY: 0,
                offset: 25,
              },
            }
          : edge
      )
    );
  };

  // Drag langsung dengan pointer untuk menggeser siku vertikal kiri-kanan
  const handlePointerDownX = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const initialShiftX = shiftX;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const nextShiftX = Math.max(-400, Math.min(400, Math.round(initialShiftX + deltaX)));
      setEdges((edges) =>
        edges.map((edge) =>
          edge.id === id
            ? {
                ...edge,
                data: {
                  ...(edge.data || {}),
                  shiftX: nextShiftX,
                },
              }
            : edge
        )
      );
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Drag langsung dengan pointer untuk menggeser siku horisontal atas-bawah
  const handlePointerDownY = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const startY = e.clientY;
    const initialShiftY = shiftY;
    const initialOffset = currentOffset;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const nextShiftY = Math.max(-400, Math.min(400, Math.round(initialShiftY + deltaY)));
      const nextOffset = Math.max(10, Math.min(350, Math.round(initialOffset + deltaY)));
      setEdges((edges) =>
        edges.map((edge) =>
          edge.id === id
            ? {
                ...edge,
                data: {
                  ...(edge.data || {}),
                  shiftY: nextShiftY,
                  offset: nextOffset,
                },
              }
            : edge
        )
      );
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Drag langsung titik kontrol di tengah garis (2D: bebas geser X & Y sekaligus)
  const handleMainDotPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Otomatis tandai garis ini terpilih (selected)
    setEdges((edges) =>
      edges.map((edge) => ({
        ...edge,
        selected: edge.id === id,
      }))
    );
    setIsHovered(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialShiftX = shiftX;
    const initialShiftY = shiftY;
    const initialOffset = currentOffset;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const nextShiftX = Math.max(-400, Math.min(400, Math.round(initialShiftX + deltaX)));
      const nextShiftY = Math.max(-400, Math.min(400, Math.round(initialShiftY + deltaY)));

      // Untuk koneksi loop satu sisi (top-top atau bottom-bottom), drag Y menyesuaikan jarak clearance offset
      let nextOffset = initialOffset;
      if (sourcePosition === 'top' && targetPosition === 'top') {
        // Tarik ke atas (deltaY negatif) -> offset menjauh (nilai membesar)
        nextOffset = Math.max(10, Math.min(350, Math.round(initialOffset - deltaY)));
      } else if (sourcePosition === 'bottom' && targetPosition === 'bottom') {
        // Tarik ke bawah (deltaY positif) -> offset menjauh (nilai membesar)
        nextOffset = Math.max(10, Math.min(350, Math.round(initialOffset + deltaY)));
      } else if (sourcePosition === 'left' && targetPosition === 'left') {
        // Tarik ke kiri (deltaX negatif) -> offset menjauh (nilai membesar)
        nextOffset = Math.max(10, Math.min(350, Math.round(initialOffset - deltaX)));
      } else if (sourcePosition === 'right' && targetPosition === 'right') {
        // Tarik ke kanan (deltaX positif) -> offset menjauh (nilai membesar)
        nextOffset = Math.max(10, Math.min(350, Math.round(initialOffset + deltaX)));
      } else {
        nextOffset = Math.max(10, Math.min(350, Math.round(initialOffset + deltaY)));
      }

      setEdges((edges) =>
        edges.map((edge) =>
          edge.id === id
            ? {
                ...edge,
                data: {
                  ...(edge.data || {}),
                  shiftX: nextShiftX,
                  shiftY: nextShiftY,
                  offset: nextOffset,
                },
              }
            : edge
        )
      );
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Hitung posisi titik kontrol utama yang MENEMPEL PRESISI pada segmen fisik garis
  let mainDotX = defaultCenterX + shiftX;
  let mainDotY = defaultCenterY + shiftY;

  if (sourcePosition === 'top' && targetPosition === 'top') {
    // Jalur loop atas: segmen horizontal berada di y = topY
    const topY = Math.min(sourceY, targetY) - effectiveOffset;
    mainDotX = (sourceX + targetX) / 2 + shiftX;
    mainDotY = topY;
  } else if (sourcePosition === 'bottom' && targetPosition === 'bottom') {
    // Jalur loop bawah: segmen horizontal berada di y = btmY
    const btmY = Math.max(sourceY, targetY) + effectiveOffset;
    mainDotX = (sourceX + targetX) / 2 + shiftX;
    mainDotY = btmY;
  } else if (sourcePosition === 'left' && targetPosition === 'left') {
    // Jalur loop kiri: segmen vertikal berada di x = leftX
    const leftX = Math.min(sourceX, targetX) - effectiveOffset;
    mainDotX = leftX;
    mainDotY = (sourceY + targetY) / 2 + shiftY;
  } else if (sourcePosition === 'right' && targetPosition === 'right') {
    // Jalur loop kanan: segmen vertikal berada di x = rightX
    const rightX = Math.max(sourceX, targetX) + effectiveOffset;
    mainDotX = rightX;
    mainDotY = (sourceY + targetY) / 2 + shiftY;
  } else if (
    (sourcePosition === 'bottom' && targetPosition === 'top') ||
    (sourcePosition === 'top' && targetPosition === 'bottom')
  ) {
    // Aliran vertikal normal: segmen horizontal berada di tengah vertikal
    mainDotX = (sourceX + targetX) / 2 + shiftX;
    mainDotY = effectiveCenterY;
  } else if (
    (sourcePosition === 'right' && targetPosition === 'left') ||
    (sourcePosition === 'left' && targetPosition === 'right')
  ) {
    // Aliran horizontal normal: segmen vertikal berada di tengah horizontal
    mainDotX = effectiveCenterX;
    mainDotY = (sourceY + targetY) / 2 + shiftY;
  } else {
    // Kombinasi siku lainnya atau fallback ke posisi kalkulasi path
    mainDotX = typeof labelX === 'number' && !isNaN(labelX) ? labelX : effectiveCenterX;
    mainDotY = typeof labelY === 'number' && !isNaN(labelY) ? labelY : effectiveCenterY;
  }

  // Titik tengah segmen sekunder (untuk jalur multi-siku 3 arah)
  let hDotX = defaultCenterX;
  let hDotY = defaultCenterY;

  if (sourcePosition === 'top' && targetPosition === 'bottom') {
    hDotX = (sourceX + effectiveCenterX) / 2;
    hDotY = sourceY - effectiveOffset;
  } else if (sourcePosition === 'bottom' && targetPosition === 'top') {
    hDotX = (sourceX + targetX) / 2;
    hDotY = effectiveCenterY;
  } else if (sourcePosition === 'right' && targetPosition === 'left') {
    hDotX = (sourceX + effectiveCenterX) / 2;
    hDotY = sourceY;
  } else if (sourcePosition === 'left' && targetPosition === 'right') {
    hDotX = (sourceX + effectiveCenterX) / 2;
    hDotY = sourceY;
  }

  const showControls = selected || isHovered;

  return (
    <>
      {/* Path interaktif transparan dengan hit-area lebar (26px) agar mudah diklik dan di-hover */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={26}
        className="cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          setEdges((edges) =>
            edges.map((edge) => ({
              ...edge,
              selected: edge.id === id,
            }))
          );
        }}
      />

      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        interactionWidth={26}
        style={{
          ...style,
          stroke: selected ? '#ef4444' : isHovered ? '#2563eb' : (style.stroke || '#3b82f6'),
          strokeWidth: selected ? 3.5 : isHovered ? 3 : (style.strokeWidth || 2),
          transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
        }}
      />

      <EdgeLabelRenderer>
        {/* Titik Geser Sekunder (pada segmen siku terpisah jika jarak cukup jauh) */}
        {(Math.abs(hDotX - mainDotX) > 40 || Math.abs(hDotY - mainDotY) > 40) && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${hDotX}px,${hDotY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan no-print z-40 select-none group/hdot"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              onPointerDown={handlePointerDownY}
              title="Titik Siku Horisontal: Klik & tahan lalu geser atas-bawah untuk mengatur posisi garis"
              className={`w-3.5 h-3.5 rounded-full border-2 transition-transform cursor-ns-resize shadow-xs flex items-center justify-center ${
                showControls
                  ? 'bg-emerald-600 border-white ring-2 ring-emerald-400/80 scale-110'
                  : 'bg-white border-emerald-600 hover:scale-125 hover:bg-emerald-50'
              }`}
            >
              <div className={`w-1 h-1 rounded-full ${showControls ? 'bg-white' : 'bg-emerald-600'}`} />
            </div>
            <div className="absolute top-full mt-1.5 px-2 py-0.5 rounded bg-slate-900/95 text-white text-[9px] font-semibold whitespace-nowrap opacity-0 group-hover/hdot:opacity-100 transition-opacity pointer-events-none shadow-md z-50">
              Titik Siku Horisontal (↕)
            </div>
          </div>
        )}

        {/* Titik Geser Utama & Floating Action Capsule */}
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${mainDotX}px,${mainDotY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan no-print flex flex-col items-center gap-1 z-50 select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {label && (
            <div className="px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs text-[10px] font-semibold text-slate-700 mb-0.5 pointer-events-none">
              {label}
            </div>
          )}

          {/* Floating Action Capsule (Tampil saat hover atau garis sedang aktif terseleksi) - Skala 70% (-30%) */}
          <div
            className={`flex items-center gap-1 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-full shadow-lg py-0.5 px-1.5 transition-all duration-150 mb-1 origin-bottom ${
              showControls ? 'opacity-100 scale-[0.70] pointer-events-auto' : 'opacity-0 pointer-events-none scale-[0.55]'
            }`}
          >
            {/* Pemilih Bentuk Cepat: Lengkung / Lurus / Siku (Aktif) */}
            <div className="flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-200/80">
              <button
                type="button"
                onClick={(e) => handleChangeType('default', e)}
                title="Ubah ke Garis Melengkung (Bezier)"
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-600 hover:text-blue-700 hover:bg-white/80 transition-colors cursor-pointer"
              >
                <span>Lengkung</span>
              </button>
              <button
                type="button"
                onClick={(e) => handleChangeType('straight', e)}
                title="Ubah ke Garis Lurus (Straight)"
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-600 hover:text-blue-700 hover:bg-white/80 transition-colors cursor-pointer"
              >
                <span>Lurus</span>
              </button>
              <button
                type="button"
                title="Bentuk Saat Ini: Garis Siku-Siku (Step/Ortogonal)"
                className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-blue-700 shadow-2xs cursor-default flex items-center gap-1"
              >
                <span>Siku</span>
              </button>
            </div>

            <div className="w-[1px] h-3.5 bg-slate-200 mx-0.5" />

            {/* Grup Geser Kiri / Kanan (Siku Vertikal) */}
            <div className="flex items-center bg-slate-50 rounded-full border border-slate-200/80 p-0.5" title="Geser siku garis ke Kiri atau Kanan">
              <button
                type="button"
                onClick={(e) => handleNudgeX(-20, e)}
                title="Geser siku garis ke kiri (-20px)"
                className="p-1 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div
                onPointerDown={handlePointerDownX}
                title="Klik & tahan lalu geser mouse ke kiri/kanan untuk menggeser posisi garis vertikal"
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-full hover:bg-blue-100 text-slate-700 hover:text-blue-700 transition-colors cursor-ew-resize select-none"
              >
                <MoveHorizontal className="w-3 h-3 text-slate-500 hover:text-blue-600" />
                <span className="text-[10px] font-mono font-bold leading-none">
                  {shiftX === 0 ? '↔ Tengah' : `↔ ${shiftX > 0 ? '+' : ''}${shiftX}px`}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => handleNudgeX(20, e)}
                title="Geser siku garis ke kanan (+20px)"
                className="p-1 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Grup Geser Atas / Bawah (Siku Horisontal / Offset) */}
            <div className="flex items-center bg-slate-50 rounded-full border border-slate-200/80 p-0.5" title="Geser siku garis ke Atas atau Bawah">
              <button
                type="button"
                onClick={(e) => handleNudgeY(-15, e)}
                title="Geser siku garis ke atas (-15px)"
                className="p-1 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <div
                onPointerDown={handlePointerDownY}
                title="Klik & tahan lalu geser mouse ke atas/bawah untuk menggeser posisi garis horisontal"
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-full hover:bg-blue-100 text-slate-700 hover:text-blue-700 transition-colors cursor-ns-resize select-none"
              >
                <MoveVertical className="w-3 h-3 text-slate-500 hover:text-blue-600" />
                <span className="text-[10px] font-mono font-bold leading-none">
                  {shiftY !== 0 ? `↕ ${shiftY > 0 ? '+' : ''}${shiftY}px` : `↕ ${currentOffset}px`}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => handleNudgeY(15, e)}
                title="Geser siku garis ke bawah (+15px)"
                className="p-1 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-[1px] h-3.5 bg-slate-200 mx-0.5" />

            {/* Tombol Reset Siku */}
            <button
              type="button"
              onClick={handleReset}
              title="Kembalikan posisi siku ke tengah & standar"
              className="p-1 rounded-full text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Tombol Hapus Cepat (×) */}
            <button
              type="button"
              onClick={handleDelete}
              title="Hapus garis konektor ini"
              className="p-1 rounded-full text-red-500 hover:text-white hover:bg-red-500 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Titik Geser Utama di Tengah Garis (Sleek 30% Smaller Handle Dot) */}
          <div
            onPointerDown={handleMainDotPointerDown}
            onClick={(e) => {
              e.stopPropagation();
              setEdges((edges) =>
                edges.map((edge) => ({
                  ...edge,
                  selected: edge.id === id,
                }))
              );
            }}
            title="Titik Kontrol Garis: Klik & tahan titik ini lalu geser mouse untuk memindahkan posisi garis"
            className="group/dot relative p-1 flex items-center justify-center cursor-grab active:cursor-grabbing select-none pointer-events-auto transition-all"
          >
            {showControls ? (
              // Saat Hover atau Garis Terpilih: 14px (ringkas, sleek & presisi)
              <div className="w-3.5 h-3.5 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 border-[1.5px] border-white ring-1 ring-blue-500/80 shadow-md flex items-center justify-center text-white transition-all transform hover:scale-125">
                <div className="w-1 h-1 rounded-full bg-white shadow-2xs" />
              </div>
            ) : (
              // Saat Idle/Biasa: 10px (halus dan tidak menghalangi diagram)
              <div className="w-2.5 h-2.5 rounded-full bg-white hover:bg-blue-600 border-[1.5px] border-blue-600 shadow-xs flex items-center justify-center transition-all transform hover:scale-125">
                <div className="w-1 h-1 rounded-full bg-blue-600 group-hover/dot:bg-white transition-colors" />
              </div>
            )}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
});
RemovableStepEdge.displayName = 'RemovableStepEdge';

// 2. Edge Melengkung Halus (Bezier) dengan Tombol Switcher, Pengatur Kelengkungan Kustom, & Titik Geser
export const RemovableBezierEdge = memo((props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    selected,
    label,
    data = {},
  } = props;

  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);

  const edgeData = (data as CustomEdgeData) || {};
  const currentCurvature = typeof edgeData.curvature === 'number' ? edgeData.curvature : 0.25;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    curvature: currentCurvature,
  });

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  const handleChangeType = (newType: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === id ? { ...edge, type: newType, selected: true } : edge
      )
    );
  };

  const handleAdjustCurvature = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextCurvature = Math.max(0, Math.min(1.0, parseFloat((currentCurvature + delta).toFixed(2))));
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === id
          ? {
              ...edge,
              data: {
                ...(edge.data || {}),
                curvature: nextCurvature,
              },
            }
          : edge
      )
    );
  };

  // Drag langsung titik tengah untuk mengatur kelengkungan kustom secara interaktif
  const handleCurvaturePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setEdges((edges) => edges.map((edge) => ({ ...edge, selected: edge.id === id })));
    setIsHovered(true);

    const startY = e.clientY;
    const startX = e.clientX;
    const initialCurvature = currentCurvature;

    const onPointerMove = (moveEvent: PointerEvent) => {
      // Perubahan jarak vertikal & horizontal memengaruhi kelengkungan kurva
      const dy = Math.abs(moveEvent.clientY - startY);
      const dx = Math.abs(moveEvent.clientX - startX);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const sign = (moveEvent.clientY < startY || moveEvent.clientX > startX) ? 1 : -1;
      const nextCurvature = Math.max(0, Math.min(1.0, parseFloat((initialCurvature + sign * (dist / 150)).toFixed(2))));
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === id
            ? {
                ...edge,
                data: {
                  ...(edge.data || {}),
                  curvature: nextCurvature,
                },
              }
            : edge
        )
      );
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const showButton = selected || isHovered;

  return (
    <>
      {/* Path transparan interaktif untuk hover & klik garis */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={26}
        className="cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          setEdges((edges) =>
            edges.map((edge) => ({
              ...edge,
              selected: edge.id === id,
            }))
          );
        }}
      />

      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        interactionWidth={26}
        style={{
          ...style,
          stroke: selected ? '#ef4444' : isHovered ? '#2563eb' : (style.stroke || '#3b82f6'),
          strokeWidth: selected ? 3.5 : isHovered ? 3 : (style.strokeWidth || 2),
          transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
        }}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan flex flex-col items-center gap-1.5 z-50 select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {label && (
            <div className="px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs text-[10px] font-semibold text-slate-700 select-none mb-0.5 pointer-events-none">
              {label}
            </div>
          )}

          {/* Quick Action Capsule (Muncul saat hover atau saat garis merah terpilih) - Skala 70% (-30%) */}
          <div
            className={`flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-full shadow-xl py-1 px-2 transition-all duration-150 mb-1 origin-bottom ${
              showButton ? 'opacity-100 scale-[0.70] pointer-events-auto' : 'opacity-0 pointer-events-none scale-[0.55]'
            }`}
          >
            {/* Pemilih Bentuk Cepat: Lengkung (Aktif) / Lurus / Siku */}
            <div className="flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-200/80">
              <button
                type="button"
                title="Bentuk Saat Ini: Melengkung (Bezier)"
                className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-blue-700 shadow-2xs cursor-default flex items-center gap-1"
              >
                <span>Lengkung</span>
              </button>
              <button
                type="button"
                onClick={(e) => handleChangeType('straight', e)}
                title="Ubah ke Garis Lurus (Straight)"
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-600 hover:text-blue-700 hover:bg-white/80 transition-colors cursor-pointer"
              >
                <span>Lurus</span>
              </button>
              <button
                type="button"
                onClick={(e) => handleChangeType('smoothstep', e)}
                title="Ubah ke Garis Siku-Siku (Step/Ortogonal)"
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-600 hover:text-blue-700 hover:bg-white/80 transition-colors cursor-pointer"
              >
                <span>Siku</span>
              </button>
            </div>

            <div className="w-[1px] h-3.5 bg-slate-200" />

            {/* Stepper Kelengkungan Kustom */}
            <div className="flex items-center bg-slate-50 rounded-full border border-slate-200/80 p-0.5" title="Atur tingkat kelengkungan garis kustom">
              <button
                type="button"
                onClick={(e) => handleAdjustCurvature(-0.15, e)}
                title="Lebih Lurus (Kurangi kelengkungan)"
                className="p-1 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-[10px] font-mono font-bold text-slate-700 px-1 select-none">
                {Math.round(currentCurvature * 100)}%
              </span>
              <button
                type="button"
                onClick={(e) => handleAdjustCurvature(0.15, e)}
                title="Lebih Lengkung (Tambah kelengkungan)"
                className="p-1 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <div className="w-[1px] h-3.5 bg-slate-200" />

            {/* Tombol Hapus Garis (×) */}
            <button
              type="button"
              onClick={handleDelete}
              title="Hapus garis ini"
              className="p-1 rounded-full text-red-500 hover:text-white hover:bg-red-500 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Titik Kontrol Lengkung di Tengah Garis (Sleek 30% Smaller Handle Dot) */}
          <div
            onPointerDown={handleCurvaturePointerDown}
            onClick={(e) => {
              e.stopPropagation();
              setEdges((edges) =>
                edges.map((edge) => ({
                  ...edge,
                  selected: edge.id === id,
                }))
              );
            }}
            title="Titik Kontrol: Klik untuk memilih garis, atau klik & tahan lalu tarik untuk mengatur kelengkungan kustom"
            className="group/dot relative p-1 flex items-center justify-center cursor-ns-resize select-none pointer-events-auto transition-all"
          >
            {showButton ? (
              // Saat Hover atau Garis Terpilih: 14px (ringkas, sleek & presisi)
              <div className="w-3.5 h-3.5 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 border-[1.5px] border-white ring-1 ring-blue-500/80 shadow-md flex items-center justify-center text-white transition-all transform hover:scale-125">
                <div className="w-1 h-1 rounded-full bg-white shadow-2xs" />
              </div>
            ) : (
              // Saat Idle/Biasa: 10px (halus dan tidak menghalangi diagram)
              <div className="w-2.5 h-2.5 rounded-full bg-white hover:bg-blue-600 border-[1.5px] border-blue-600 shadow-xs flex items-center justify-center transition-all transform hover:scale-125">
                <div className="w-1 h-1 rounded-full bg-blue-600 group-hover/dot:bg-white transition-colors" />
              </div>
            )}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
});
RemovableBezierEdge.displayName = 'RemovableBezierEdge';


// 3. Edge Lurus (Straight) dengan Tombol Switcher Bentuk & Hapus (×)
export const RemovableStraightEdge = memo((props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    style = {},
    markerEnd,
    selected,
    label,
  } = props;

  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  const handleChangeType = (newType: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === id ? { ...edge, type: newType, selected: true } : edge
      )
    );
  };

  const showButton = selected || isHovered;

  return (
    <>
      {/* Path transparan interaktif untuk hover & klik garis */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={26}
        className="cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          setEdges((edges) =>
            edges.map((edge) => ({
              ...edge,
              selected: edge.id === id,
            }))
          );
        }}
      />

      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        interactionWidth={26}
        style={{
          ...style,
          stroke: selected ? '#ef4444' : isHovered ? '#2563eb' : (style.stroke || '#3b82f6'),
          strokeWidth: selected ? 3.5 : isHovered ? 3 : (style.strokeWidth || 2),
          transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
        }}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan flex flex-col items-center gap-1.5 z-50 select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {label && (
            <div className="px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs text-[10px] font-semibold text-slate-700 select-none mb-0.5 pointer-events-none">
              {label}
            </div>
          )}

          {/* Quick Action Capsule - Skala 70% (-30%) */}
          <div
            className={`flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-full shadow-xl py-1 px-2 transition-all duration-150 mb-1 origin-bottom ${
              showButton ? 'opacity-100 scale-[0.70] pointer-events-auto' : 'opacity-0 pointer-events-none scale-[0.55]'
            }`}
          >
            {/* Pemilih Bentuk Cepat: Lengkung / Lurus (Aktif) / Siku */}
            <div className="flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-200/80">
              <button
                type="button"
                onClick={(e) => handleChangeType('default', e)}
                title="Ubah ke Garis Melengkung (Bezier)"
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-600 hover:text-blue-700 hover:bg-white/80 transition-colors cursor-pointer"
              >
                <span>Lengkung</span>
              </button>
              <button
                type="button"
                title="Bentuk Saat Ini: Garis Lurus (Straight)"
                className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-blue-700 shadow-2xs cursor-default flex items-center gap-1"
              >
                <span>Lurus</span>
              </button>
              <button
                type="button"
                onClick={(e) => handleChangeType('smoothstep', e)}
                title="Ubah ke Garis Siku-Siku (Step/Ortogonal)"
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-600 hover:text-blue-700 hover:bg-white/80 transition-colors cursor-pointer"
              >
                <span>Siku</span>
              </button>
            </div>

            <div className="w-[1px] h-3.5 bg-slate-200" />

            {/* Tombol Hapus Garis (×) */}
            <button
              type="button"
              onClick={handleDelete}
              title="Hapus garis lurus ini"
              className="p-1 rounded-full text-red-500 hover:text-white hover:bg-red-500 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Titik Garis Lurus (Sleek 30% Smaller Handle Dot) */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setEdges((edges) =>
                edges.map((edge) => ({
                  ...edge,
                  selected: edge.id === id,
                }))
              );
            }}
            title="Titik Garis Lurus (Klik untuk memilih garis)"
            className="group/dot relative p-1 flex items-center justify-center cursor-pointer select-none pointer-events-auto transition-all"
          >
            {showButton ? (
              // Saat Hover atau Garis Terpilih: 14px (ringkas, sleek & presisi)
              <div className="w-3.5 h-3.5 rounded-full bg-blue-600 hover:bg-blue-700 border-[1.5px] border-white ring-1 ring-blue-500/80 shadow-md flex items-center justify-center text-white transition-all transform hover:scale-125">
                <div className="w-1 h-1 rounded-full bg-white shadow-2xs" />
              </div>
            ) : (
              // Saat Idle/Biasa: 10px (halus dan tidak menghalangi diagram)
              <div className="w-2.5 h-2.5 rounded-full bg-white hover:bg-blue-600 border-[1.5px] border-blue-600 shadow-xs flex items-center justify-center transition-all transform hover:scale-125">
                <div className="w-1 h-1 rounded-full bg-blue-600 group-hover/dot:bg-white transition-colors" />
              </div>
            )}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
});
RemovableStraightEdge.displayName = 'RemovableStraightEdge';


// Register seluruh custom edge types
export const edgeTypes: any = {
  smoothstep: RemovableStepEdge,
  step: RemovableStepEdge,
  default: RemovableBezierEdge,
  bezier: RemovableBezierEdge,
  straight: RemovableStraightEdge,
};
