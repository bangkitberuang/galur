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
import { X, Trash2 } from 'lucide-react';

interface CustomEdgeData {
  label?: string;
  [key: string]: any;
}

// 1. Edge Siku-Siku Patah (SmoothStep / Step - Visio Standard) dengan Tombol Hapus (×)
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
  } = props;

  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8,
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
          className="nodrag nopan flex flex-col items-center gap-1 z-50"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {label && (
            <div className="px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs text-[10px] font-semibold text-slate-700 select-none">
              {label}
            </div>
          )}

          {/* Tombol Hapus Cepat (×) */}
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
