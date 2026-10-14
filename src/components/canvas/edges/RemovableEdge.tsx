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

// Helper perhitungan rounded corner SVG untuk orthogonal step custom
function getPointDistance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

function roundedCornerPath(
  pPrev: { x: number; y: number },
  pCurr: { x: number; y: number },
  pNext: { x: number; y: number },
  radius: number
) {
  const r = Math.min(getPointDistance(pPrev, pCurr) / 2, getPointDistance(pCurr, pNext) / 2, radius);
  const { x, y } = pCurr;
  if ((pPrev.x === x && x === pNext.x) || (pPrev.y === y && y === pNext.y)) {
    return `L${x} ${y}`;
  }
  // Masuk horizontal, belok vertikal
  if (pPrev.y === y) {
    const dirX = pPrev.x < x ? -1 : 1;
    const dirY = pCurr.y < pNext.y ? 1 : -1;
    return `L ${x + r * dirX},${y} Q ${x},${y} ${x},${y + r * dirY}`;
  }
  // Masuk vertikal, belok horizontal
  const dirY = pPrev.y < y ? -1 : 1;
  const dirX = pCurr.x < pNext.x ? 1 : -1;
  return `L ${x},${y + r * dirY} Q ${x},${y} ${x + r * dirX},${y}`;
}

function pointsToSvgPath(points: { x: number; y: number }[], borderRadius = 8) {
  if (points.length < 2) return '';
  const clean: { x: number; y: number }[] = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const prev = clean[clean.length - 1];
    if (Math.abs(prev.x - points[i].x) > 1 || Math.abs(prev.y - points[i].y) > 1) {
      clean.push(points[i]);
    }
  }
  if (clean.length < 2) return '';
  let path = `M${clean[0].x} ${clean[0].y}`;
  for (let i = 1; i < clean.length - 1; i++) {
    path += ' ' + roundedCornerPath(clean[i - 1], clean[i], clean[i + 1], borderRadius);
  }
  path += ` L${clean[clean.length - 1].x} ${clean[clean.length - 1].y}`;
  return path;
}

// 1. Edge Siku-Siku Patah (SmoothStep / Step - Visio Standard) dengan Kontrol Geser Posisi Siku, Reset & Tombol Hapus (×)
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

  // Deteksi orientasi koneksi garis
  const isHorizontalFlow =
    (sourcePosition === 'right' || sourcePosition === 'left') &&
    (targetPosition === 'left' || targetPosition === 'right');

  const isVerticalFlow =
    (sourcePosition === 'top' || sourcePosition === 'bottom') &&
    (targetPosition === 'bottom' || targetPosition === 'top');

  const isLoopTop = sourcePosition === 'top' && targetPosition === 'top';
  const isLoopBottom = sourcePosition === 'bottom' && targetPosition === 'bottom';
  const isLoopLeft = sourcePosition === 'left' && targetPosition === 'left';
  const isLoopRight = sourcePosition === 'right' && targetPosition === 'right';

  const isCornerHV =
    (sourcePosition === 'right' || sourcePosition === 'left') &&
    (targetPosition === 'top' || targetPosition === 'bottom');

  const isCornerVH =
    (sourcePosition === 'top' || sourcePosition === 'bottom') &&
    (targetPosition === 'right' || targetPosition === 'left');

  // Sesuaikan offset dinamis untuk koneksi loop satu sisi
  let effectiveOffset = currentOffset;
  if (isLoopTop) {
    effectiveOffset = Math.max(10, Math.min(350, currentOffset - shiftY));
  } else if (isLoopBottom) {
    effectiveOffset = Math.max(10, Math.min(350, currentOffset + shiftY));
  } else if (isLoopLeft) {
    effectiveOffset = Math.max(10, Math.min(350, currentOffset - shiftX));
  } else if (isLoopRight) {
    effectiveOffset = Math.max(10, Math.min(350, currentOffset + shiftX));
  }

  // Hitung jalur SVG dan posisi titik kontrol handle yang tepat
  let edgePath = '';
  let mainDotX = defaultCenterX;
  let mainDotY = defaultCenterY;
  let dragCursor = 'cursor-grab active:cursor-grabbing';
  let dotTooltip = 'Titik Kontrol Garis: Klik & tahan untuk menggeser posisi garis';

  if (isHorizontalFlow) {
    const effectiveCenterX = defaultCenterX + shiftX;
    mainDotX = effectiveCenterX;
    mainDotY = (sourceY + targetY) / 2;
    dragCursor = 'cursor-ew-resize';
    dotTooltip = 'Geser siku garis ke kiri atau kanan (↔)';

    const [stdPath] = getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      borderRadius: 8,
      offset: effectiveOffset,
      centerX: effectiveCenterX,
    });
    edgePath = stdPath;
  } else if (isVerticalFlow) {
    const effectiveCenterY = defaultCenterY + shiftY;
    mainDotX = (sourceX + targetX) / 2;
    mainDotY = effectiveCenterY;
    dragCursor = 'cursor-ns-resize';
    dotTooltip = 'Geser siku garis ke atas atau bawah (↕)';

    const [stdPath] = getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      borderRadius: 8,
      offset: effectiveOffset,
      centerY: effectiveCenterY,
    });
    edgePath = stdPath;
  } else if (isCornerHV) {
    const cornerX = targetX + shiftX;
    mainDotX = cornerX;
    mainDotY = (sourceY + targetY) / 2;
    dragCursor = 'cursor-ew-resize';
    dotTooltip = 'Geser siku vertikal ke kiri atau kanan (↔)';

    if (shiftX !== 0) {
      const stubY = targetY - (targetPosition === 'top' ? 20 : -20);
      edgePath = pointsToSvgPath([
        { x: sourceX, y: sourceY },
        { x: cornerX, y: sourceY },
        { x: cornerX, y: stubY },
        { x: targetX, y: stubY },
        { x: targetX, y: targetY },
      ], 8);
    } else {
      const [stdPath, lx, ly] = getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        borderRadius: 8,
        offset: effectiveOffset,
      });
      edgePath = stdPath;
      mainDotX = typeof lx === 'number' && !isNaN(lx) ? lx : cornerX;
      mainDotY = typeof ly === 'number' && !isNaN(ly) ? ly : (sourceY + targetY) / 2;
    }
  } else if (isCornerVH) {
    const cornerY = targetY + shiftY;
    mainDotX = (sourceX + targetX) / 2;
    mainDotY = cornerY;
    dragCursor = 'cursor-ns-resize';
    dotTooltip = 'Geser siku horisontal ke atas atau bawah (↕)';

    if (shiftY !== 0) {
      const stubX = targetX - (targetPosition === 'left' ? 20 : -20);
      edgePath = pointsToSvgPath([
        { x: sourceX, y: sourceY },
        { x: sourceX, y: cornerY },
        { x: stubX, y: cornerY },
        { x: stubX, y: targetY },
        { x: targetX, y: targetY },
      ], 8);
    } else {
      const [stdPath, lx, ly] = getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        borderRadius: 8,
        offset: effectiveOffset,
      });
      edgePath = stdPath;
      mainDotX = typeof lx === 'number' && !isNaN(lx) ? lx : (sourceX + targetX) / 2;
      mainDotY = typeof ly === 'number' && !isNaN(ly) ? ly : cornerY;
    }
  } else {
    // Loop (satu sisi) atau fallback umum
    const [stdPath, lx, ly] = getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      borderRadius: 8,
      offset: effectiveOffset,
      centerX: shiftX !== 0 ? defaultCenterX + shiftX : undefined,
      centerY: shiftY !== 0 ? defaultCenterY + shiftY : undefined,
    });
    edgePath = stdPath;

    if (isLoopTop) {
      dragCursor = 'cursor-ns-resize';
      dotTooltip = 'Geser jarak loop atas (↕)';
      mainDotX = (sourceX + targetX) / 2 + shiftX;
      mainDotY = Math.min(sourceY, targetY) - effectiveOffset;
    } else if (isLoopBottom) {
      dragCursor = 'cursor-ns-resize';
      dotTooltip = 'Geser jarak loop bawah (↕)';
      mainDotX = (sourceX + targetX) / 2 + shiftX;
      mainDotY = Math.max(sourceY, targetY) + effectiveOffset;
    } else if (isLoopLeft) {
      dragCursor = 'cursor-ew-resize';
      dotTooltip = 'Geser jarak loop kiri (↔)';
      mainDotX = Math.min(sourceX, targetX) - effectiveOffset;
      mainDotY = (sourceY + targetY) / 2 + shiftY;
    } else if (isLoopRight) {
      dragCursor = 'cursor-ew-resize';
      dotTooltip = 'Geser jarak loop kanan (↔)';
      mainDotX = Math.max(sourceX, targetX) + effectiveOffset;
      mainDotY = (sourceY + targetY) / 2 + shiftY;
    } else {
      mainDotX = typeof lx === 'number' && !isNaN(lx) ? lx : defaultCenterX + shiftX;
      mainDotY = typeof ly === 'number' && !isNaN(ly) ? ly : defaultCenterY + shiftY;
    }
  }

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

  // Drag langsung titik kontrol di tengah garis (menggerakkan segmen siku yang relevan)
  const handleMainDotPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();

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

      let nextOffset = initialOffset;
      if (isLoopTop) {
        nextOffset = Math.max(10, Math.min(350, Math.round(initialOffset - deltaY)));
      } else if (isLoopBottom) {
        nextOffset = Math.max(10, Math.min(350, Math.round(initialOffset + deltaY)));
      } else if (isLoopLeft) {
        nextOffset = Math.max(10, Math.min(350, Math.round(initialOffset - deltaX)));
      } else if (isLoopRight) {
        nextOffset = Math.max(10, Math.min(350, Math.round(initialOffset + deltaX)));
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

            {/* Grup Geser Kiri / Kanan (Tampil jika garis memiliki segmen siku vertikal) */}
            {(!isVerticalFlow && !isLoopTop && !isLoopBottom) && (
              <div className="flex items-center bg-slate-50 rounded-full border border-slate-200/80 p-0.5" title="Geser siku garis ke Kiri atau Kanan (↔)">
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
            )}

            {/* Grup Geser Atas / Bawah (Tampil jika garis memiliki segmen siku horisontal/offset) */}
            {(!isHorizontalFlow && !isLoopLeft && !isLoopRight && !isCornerHV) && (
              <div className="flex items-center bg-slate-50 rounded-full border border-slate-200/80 p-0.5" title="Geser siku garis ke Atas atau Bawah (↕)">
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
            )}

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

          {/* Titik Geser Utama di Siku Garis (Sleek 30% Smaller Handle Dot, Aktif Menggeser Siku) */}
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
            title={dotTooltip}
            className={`group/dot relative p-1 flex items-center justify-center ${dragCursor} select-none pointer-events-auto transition-all`}
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
