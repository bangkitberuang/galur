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
import { X, Trash2, ChevronUp, ChevronDown, MoveVertical } from 'lucide-react';

interface CustomEdgeData {
  label?: string;
  offset?: number;
  curvature?: number;
  [key: string]: any;
}

// 1. Edge Siku-Siku Patah (SmoothStep / Step - Visio Standard) dengan Kontrol Geser Posisi & Tombol Hapus (×)
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

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8,
    offset: currentOffset,
  });

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  // Nudge offset dengan tombol + / - (15px)
  const handleNudge = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextOffset = Math.max(10, Math.min(350, currentOffset + delta));
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === id
          ? {
              ...edge,
              data: {
                ...(edge.data || {}),
                offset: nextOffset,
              },
            }
          : edge
      )
    );
  };

  // Drag langsung dengan pointer untuk menggeser garis atas/bawah
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const startY = e.clientY;
    const startX = e.clientX;
    const initialOffset = currentOffset;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const deltaX = moveEvent.clientX - startX;

      let delta = deltaY;
      if (sourcePosition === 'bottom' && targetPosition === 'bottom') {
        delta = deltaY;
      } else if (sourcePosition === 'top' && targetPosition === 'top') {
        delta = -deltaY;
      } else if (sourcePosition === 'left' && targetPosition === 'left') {
        delta = -deltaX;
      } else if (sourcePosition === 'right' && targetPosition === 'right') {
        delta = deltaX;
      } else {
        delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
      }

      const nextOffset = Math.max(10, Math.min(350, Math.round(initialOffset + delta)));
      setEdges((edges) =>
        edges.map((edge) =>
          edge.id === id
            ? {
                ...edge,
                data: {
                  ...(edge.data || {}),
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
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        interactionWidth={26} // Area klik lebar agar sangat mudah diklik
        style={{
          ...style,
          stroke: selected ? '#ef4444' : (style.stroke || '#3b82f6'),
          strokeWidth: selected ? 3.5 : (style.strokeWidth || 2),
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
          className="nodrag nopan no-print flex flex-col items-center gap-1 z-50 select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {label && (
            <div className="px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs text-[10px] font-semibold text-slate-700">
              {label}
            </div>
          )}

          {/* Floating Action Capsule (Geser Posisi Garis & Hapus) */}
          <div
            className={`flex items-center gap-0.5 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-full shadow-md py-0.5 px-1 transition-all duration-150 ${
              showControls ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none scale-90'
            }`}
          >
            {/* Tombol Geser Naik / Mendekat */}
            <button
              type="button"
              onClick={(e) => handleNudge(-15, e)}
              title="Geser posisi garis ke atas / mendekat (-15px)"
              className="p-1 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>

            {/* Handle Drag Geser Langsung */}
            <div
              onPointerDown={handlePointerDown}
              title="Klik & tahan lalu geser atas-bawah untuk memindahkan posisi garis"
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 transition-colors cursor-ns-resize"
            >
              <MoveVertical className="w-3 h-3 text-slate-500 hover:text-blue-600" />
              <span className="text-[10px] font-mono font-bold leading-none">{currentOffset}px</span>
            </div>

            {/* Tombol Geser Turun / Menjauh */}
            <button
              type="button"
              onClick={(e) => handleNudge(15, e)}
              title="Geser posisi garis ke bawah / menjauh (+15px)"
              className="p-1 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <div className="w-[1px] h-3.5 bg-slate-200 mx-0.5" />

            {/* Tombol Hapus Cepat (×) */}
            <button
              type="button"
              onClick={handleDelete}
              title="Klik untuk menghapus garis konektor ini"
              className="p-1 rounded-full text-red-500 hover:text-white hover:bg-red-500 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
});
RemovableStepEdge.displayName = 'RemovableStepEdge';

// 2. Edge Melengkung Halus (Bezier) dengan Tombol Hapus (×)
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
  } = props;

  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  const showButton = selected || isHovered;

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        interactionWidth={26}
        style={{
          ...style,
          stroke: selected ? '#ef4444' : (style.stroke || '#3b82f6'),
          strokeWidth: selected ? 3.5 : (style.strokeWidth || 2),
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
          className="nodrag nopan flex flex-col items-center gap-1 z-50"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {label && (
            <div className="px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs text-[10px] font-semibold text-slate-700 select-none">
              {label}
            </div>
          )}

          <button
            type="button"
            onClick={handleDelete}
            title="Klik untuk menghapus garis konektor ini"
            className={`flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all cursor-pointer ${
              showButton
                ? 'w-6 h-6 opacity-100 scale-100 hover:scale-110'
                : 'w-4 h-4 opacity-0 hover:opacity-100 scale-75'
            }`}
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
});
RemovableBezierEdge.displayName = 'RemovableBezierEdge';

// 3. Edge Lurus (Straight) dengan Tombol Hapus (×)
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

  const showButton = selected || isHovered;

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        interactionWidth={26}
        style={{
          ...style,
          stroke: selected ? '#ef4444' : (style.stroke || '#3b82f6'),
          strokeWidth: selected ? 3.5 : (style.strokeWidth || 2),
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
          className="nodrag nopan flex flex-col items-center gap-1 z-50"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {label && (
            <div className="px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs text-[10px] font-semibold text-slate-700 select-none">
              {label}
            </div>
          )}

          <button
            type="button"
            onClick={handleDelete}
            title="Klik untuk menghapus garis konektor ini"
            className={`flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all cursor-pointer ${
              showButton
                ? 'w-6 h-6 opacity-100 scale-100 hover:scale-110'
                : 'w-4 h-4 opacity-0 hover:opacity-100 scale-75'
            }`}
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
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
  straight: RemovableStraightEdge,
};
