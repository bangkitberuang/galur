'use client';

import React from 'react';
import { 
  ArrowRight, 
  ArrowLeftRight, 
  Minus, 
  Spline, 
  Waypoints,
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  ArrowUpToLine, 
  ArrowDownToLine, 
  Layers,
  ChevronDown,
  Plus,
  MoveVertical,
  MoveHorizontal,
  Sliders,
  MousePointer,
  Hand
} from 'lucide-react';
import { Node, Edge, MarkerType } from '@xyflow/react';

interface CanvasToolbarProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  edgeType: string;
  setEdgeType: (type: string) => void;
  takeSnapshot: () => void;
  onAddNode: (type: string, label: string) => void;
  isDiagramSettingsOpen?: boolean;
  onToggleDiagramSettings?: () => void;
  pageSize?: string;
  interactionMode?: 'select' | 'pan';
  onInteractionModeChange?: (mode: 'select' | 'pan') => void;
}

export default function CanvasToolbar({
  nodes,
  edges,
  setNodes,
  setEdges,
  selectedNode,
  selectedEdge,
  edgeType,
  setEdgeType,
  takeSnapshot,
  onAddNode,
  isDiagramSettingsOpen = false,
  onToggleDiagramSettings,
  pageSize = 'A4',
  interactionMode = 'select',
  onInteractionModeChange,
}: CanvasToolbarProps) {
  const activeSelectedNodes = nodes.filter(
    (n) => n.selected || (selectedNode && n.id === selectedNode.id)
  );
  const hasSelectedNodes = activeSelectedNodes.length > 0;
  const hasMultiNodes = activeSelectedNodes.length >= 2;

  // 1. PENGATURAN Z-INDEX / TUMPUKAN LAYER (LAYERING)
  const handleBringToFront = () => {
    if (!hasSelectedNodes) return;
    takeSnapshot();
    const maxZ = Math.max(...nodes.map((n) => n.zIndex || 0), 0);
    const selectedIds = new Set(activeSelectedNodes.map((n) => n.id));
    setNodes((nds) => {
      const nonSelected = nds.filter((n) => !selectedIds.has(n.id));
      const targetSelected = nds
        .filter((n) => selectedIds.has(n.id))
        .map((n) => ({ ...n, zIndex: maxZ + 10 }));
      return [...nonSelected, ...targetSelected];
    });
  };

  const handleSendToBack = () => {
    if (!hasSelectedNodes) return;
    takeSnapshot();
    const minZ = Math.min(...nodes.map((n) => n.zIndex || 0), 0);
    const selectedIds = new Set(activeSelectedNodes.map((n) => n.id));
    setNodes((nds) => {
      const nonSelected = nds.filter((n) => !selectedIds.has(n.id));
      const targetSelected = nds
        .filter((n) => selectedIds.has(n.id))
        .map((n) => ({ ...n, zIndex: Math.min(minZ - 10, -1) }));
      return [...targetSelected, ...nonSelected];
    });
  };

  const handleBringForward = () => {
    if (!hasSelectedNodes) return;
    takeSnapshot();
    const selectedIds = new Set(activeSelectedNodes.map((n) => n.id));
    setNodes((nds) => {
      const newNodes = [...nds];
      for (let i = newNodes.length - 2; i >= 0; i--) {
        if (selectedIds.has(newNodes[i].id) && !selectedIds.has(newNodes[i + 1].id)) {
          const temp = newNodes[i];
          newNodes[i] = newNodes[i + 1];
          newNodes[i + 1] = temp;
        }
      }
      return newNodes.map((n) =>
        selectedIds.has(n.id) ? { ...n, zIndex: (n.zIndex || 0) + 1 } : n
      );
    });
  };

  const handleSendBackward = () => {
    if (!hasSelectedNodes) return;
    takeSnapshot();
    const selectedIds = new Set(activeSelectedNodes.map((n) => n.id));
    setNodes((nds) => {
      const newNodes = [...nds];
      for (let i = 1; i < newNodes.length; i++) {
        if (selectedIds.has(newNodes[i].id) && !selectedIds.has(newNodes[i - 1].id)) {
          const temp = newNodes[i];
          newNodes[i] = newNodes[i - 1];
          newNodes[i - 1] = temp;
        }
      }
      return newNodes.map((n) =>
        selectedIds.has(n.id) ? { ...n, zIndex: (n.zIndex || 0) - 1 } : n
      );
    });
  };

  // 2. ALAT PERATAAN POSISI (ALIGNMENT TOOLS)
  const handleAlign = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (!hasSelectedNodes) return;
    takeSnapshot();
    const selectedIds = new Set(activeSelectedNodes.map((n) => n.id));

    if (hasMultiNodes) {
      // Ratakan relatif terhadap batas luar objek-objek terpilih
      const xs = activeSelectedNodes.map((n) => n.position.x);
      const ys = activeSelectedNodes.map((n) => n.position.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;

      setNodes((nds) =>
        nds.map((n) => {
          if (!selectedIds.has(n.id)) return n;
          let newX = n.position.x;
          let newY = n.position.y;

          if (alignment === 'left') newX = minX;
          if (alignment === 'center') newX = midX;
          if (alignment === 'right') newX = maxX;
          if (alignment === 'top') newY = minY;
          if (alignment === 'middle') newY = midY;
          if (alignment === 'bottom') newY = maxY;

          return { ...n, position: { x: newX, y: newY } };
        })
      );
    } else if (selectedNode || activeSelectedNodes.length === 1) {
      // Jika hanya 1 objek terpilih, geser ke grid terdekat
      const target = selectedNode || activeSelectedNodes[0];
      const snapX = Math.round(target.position.x / 30) * 30;
      const snapY = Math.round(target.position.y / 30) * 30;
      setNodes((nds) =>
        nds.map((n) => (n.id === target.id ? { ...n, position: { x: snapX, y: snapY } } : n))
      );
    }
  };

  // 3. BAGI RATA JARAK (DISTRIBUTE EVENLY)
  const handleDistribute = (direction: 'horizontal' | 'vertical') => {
    if (activeSelectedNodes.length < 3) return;
    takeSnapshot();

    if (direction === 'horizontal') {
      const sorted = [...activeSelectedNodes].sort((a, b) => a.position.x - b.position.x);
      const firstX = sorted[0].position.x;
      const lastX = sorted[sorted.length - 1].position.x;
      const step = (lastX - firstX) / (sorted.length - 1);

      const positionsMap = new Map();
      sorted.forEach((n, idx) => {
        positionsMap.set(n.id, firstX + idx * step);
      });

      setNodes((nds) =>
        nds.map((n) => {
          if (positionsMap.has(n.id)) {
            return { ...n, position: { ...n.position, x: positionsMap.get(n.id) } };
          }
          return n;
        })
      );
    } else {
      const sorted = [...activeSelectedNodes].sort((a, b) => a.position.y - b.position.y);
      const firstY = sorted[0].position.y;
      const lastY = sorted[sorted.length - 1].position.y;
      const step = (lastY - firstY) / (sorted.length - 1);

      const positionsMap = new Map();
      sorted.forEach((n, idx) => {
        positionsMap.set(n.id, firstY + idx * step);
      });

      setNodes((nds) =>
        nds.map((n) => {
          if (positionsMap.has(n.id)) {
            return { ...n, position: { ...n.position, y: positionsMap.get(n.id) } };
          }
          return n;
        })
      );
    }
  };

  // 4. GAYA UJUNG PANAH (ARROWHEADS DARI GAMBAR 2)
  const handleArrowheadChange = (mode: 'one-way' | 'two-way' | 'none') => {
    takeSnapshot();
    if (selectedEdge) {
      setEdges((eds) =>
        eds.map((e) => {
          if (e.id === selectedEdge.id) {
            const strokeColor = e.style?.stroke || '#3b82f6';
            if (mode === 'one-way') {
              return {
                ...e,
                markerStart: undefined,
                markerEnd: { type: MarkerType.ArrowClosed, color: strokeColor },
              };
            } else if (mode === 'two-way') {
              return {
                ...e,
                markerStart: { type: MarkerType.ArrowClosed, color: strokeColor },
                markerEnd: { type: MarkerType.ArrowClosed, color: strokeColor },
              };
            } else {
              return {
                ...e,
                markerStart: undefined,
                markerEnd: undefined,
              };
            }
          }
          return e;
        })
      );
    }
  };

  const currentSelectedEdge = selectedEdge || edges.find((e) => e.selected);
  const activeRouteType = currentSelectedEdge
    ? currentSelectedEdge.type === 'straight'
      ? 'straight'
      : currentSelectedEdge.type === 'default' || currentSelectedEdge.type === 'bezier'
      ? 'default'
      : 'step'
    : edgeType;

  return (
    <div className="h-10 bg-white border-b border-slate-200 px-3 flex items-center justify-between text-xs text-slate-700 z-20 no-print select-none shadow-2xs overflow-x-auto no-scrollbar">
      {/* SEKSI KIRI: ALAT SELEKSI & GAYA GARIS */}
      <div className="flex items-center gap-1.5">
        {/* Mode Interaksi (Pilih / Blok Objek vs Geser Kanvas) */}
        {onInteractionModeChange && (
          <>
            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => onInteractionModeChange('select')}
                title="Mode Pilih & Blok Objek (V) - Klik & geser mouse di area kanvas untuk blok banyak objek"
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-all ${
                  interactionMode === 'select'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <MousePointer className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Pilih (V)</span>
              </button>
              <button
                type="button"
                onClick={() => onInteractionModeChange('pan')}
                title="Mode Geser Kanvas (H) - Klik & geser kanvas (atau tahan tombol Spasi)"
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-all ${
                  interactionMode === 'pan'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Hand className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Geser (H)</span>
              </button>
            </div>
            <div className="w-[1px] h-4 bg-slate-200 mx-0.5 hidden sm:block" />
          </>
        )}

        <div className="w-[1px] h-4 bg-slate-200 mx-1 hidden sm:block" />

        {/* Pemilih Ujung Panah (->, <->, ---) */}
        <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => handleArrowheadChange('one-way')}
            title="Panah 1 Arah (→)"
            className="p-1 rounded-md text-slate-700 hover:bg-white hover:text-emerald-700 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleArrowheadChange('two-way')}
            title="Panah 2 Arah (↔)"
            className="p-1 rounded-md text-slate-700 hover:bg-white hover:text-emerald-700 transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleArrowheadChange('none')}
            title="Garis Polos Tanpa Panah (-)"
            className="p-1 rounded-md text-slate-700 hover:bg-white hover:text-emerald-700 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pemilih Bentuk Rute Garis (Siku, Lengkung, Lurus) */}
        <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setEdgeType('step');
              const target = selectedEdge || edges.find((e) => e.selected);
              if (target) {
                takeSnapshot();
                setEdges((eds) => eds.map((e) => (e.id === target.id ? { ...e, type: 'smoothstep', selected: true } : e)));
              }
            }}
            title="Gaya Garis Siku-siku Patah (Visio Standard)"
            className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
              activeRouteType === 'step' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Siku
          </button>
          <button
            type="button"
            onClick={() => {
              setEdgeType('default');
              const target = selectedEdge || edges.find((e) => e.selected);
              if (target) {
                takeSnapshot();
                setEdges((eds) => eds.map((e) => (e.id === target.id ? { ...e, type: 'default', selected: true } : e)));
              }
            }}
            title="Gaya Garis Melengkung (Bezier)"
            className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
              activeRouteType === 'default' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Lengkung
          </button>
          <button
            type="button"
            onClick={() => {
              setEdgeType('straight');
              const target = selectedEdge || edges.find((e) => e.selected);
              if (target) {
                takeSnapshot();
                setEdges((eds) => eds.map((e) => (e.id === target.id ? { ...e, type: 'straight', selected: true } : e)));
              }
            }}
            title="Gaya Garis Lurus"
            className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
              activeRouteType === 'straight' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Lurus
          </button>
        </div>

        <div className="h-4 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

        {/* SEKSI TENGAH: TUMPUKAN LAYER / Z-INDEX */}
        <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={handleBringToFront}
            disabled={!hasSelectedNodes}
            title="Bawa ke Paling Depan (Bring to Front)"
            className="p-1 rounded-md text-slate-700 hover:bg-white hover:text-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowUpToLine className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleBringForward}
            disabled={!hasSelectedNodes}
            title="Majukan Selangkah (Bring Forward)"
            className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-slate-700 hover:bg-white hover:text-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            +1
          </button>
          <button
            type="button"
            onClick={handleSendBackward}
            disabled={!hasSelectedNodes}
            title="Mundurkan Selangkah (Send Backward)"
            className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-slate-700 hover:bg-white hover:text-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            -1
          </button>
          <button
            type="button"
            onClick={handleSendToBack}
            disabled={!hasSelectedNodes}
            title="Kirim ke Paling Belakang (Send to Back)"
            className="p-1 rounded-md text-slate-700 hover:bg-white hover:text-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SEKSI KANAN: ALAT PERATAAN & DISTRIBUSI */}
      <div className="flex items-center gap-1.5">

        {/* Align Tools */}
        <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => handleAlign('left')}
            disabled={!hasSelectedNodes}
            title="Rata Kiri (Align Left)"
            className="p-1 rounded-md text-slate-700 hover:bg-white hover:text-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleAlign('center')}
            disabled={!hasSelectedNodes}
            title="Rata Tengah Horizontal (Align Center)"
            className="p-1 rounded-md text-slate-700 hover:bg-white hover:text-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleAlign('right')}
            disabled={!hasSelectedNodes}
            title="Rata Kanan (Align Right)"
            className="p-1 rounded-md text-slate-700 hover:bg-white hover:text-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-3 bg-slate-300 mx-0.5" />

          <button
            type="button"
            onClick={() => handleAlign('top')}
            disabled={!hasSelectedNodes}
            title="Rata Atas (Align Top)"
            className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-slate-700 hover:bg-white hover:text-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            Atas
          </button>
          <button
            type="button"
            onClick={() => handleAlign('middle')}
            disabled={!hasSelectedNodes}
            title="Rata Tengah Vertikal (Align Middle)"
            className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-slate-700 hover:bg-white hover:text-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            Tengah
          </button>
          <button
            type="button"
            onClick={() => handleAlign('bottom')}
            disabled={!hasSelectedNodes}
            title="Rata Bawah (Align Bottom)"
            className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-slate-700 hover:bg-white hover:text-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            Bawah
          </button>
        </div>

        {/* Distribute Tools */}
        <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200 hidden sm:flex">
          <button
            type="button"
            onClick={() => handleDistribute('horizontal')}
            disabled={activeSelectedNodes.length < 3}
            title="Bagi Rata Jarak Horizontal (Pilih 3+ Objek)"
            className="p-1 rounded-md text-slate-700 hover:bg-white hover:text-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
          >
            <MoveHorizontal className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleDistribute('vertical')}
            disabled={activeSelectedNodes.length < 3}
            title="Bagi Rata Jarak Vertikal (Pilih 3+ Objek)"
            className="p-1 rounded-md text-slate-700 hover:bg-white hover:text-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
          >
            <MoveVertical className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tombol Panggil Pengaturan Kanvas & Diagram */}
        {onToggleDiagramSettings && (
          <>
            <div className="w-[1px] h-4 bg-slate-200 mx-1 hidden sm:block" />
            <button
              type="button"
              onClick={onToggleDiagramSettings}
              title={isDiagramSettingsOpen ? "Tutup Pengaturan Diagram" : "Buka Pengaturan Diagram (Kanvas, Ukuran Kertas & Grid)"}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isDiagramSettingsOpen
                  ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-blue-600 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Pengaturan Kanvas</span>
              <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                {pageSize}
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
