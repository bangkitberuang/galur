'use client';

import React, { useState } from 'react';
import { 
  Square, 
  GitFork, 
  PlayCircle, 
  FlipHorizontal, 
  FileText, 
  Table, 
  Hexagon, 
  CircleDot, 
  Database, 
  Cloud, 
  Network, 
  StickyNote, 
  Type, 
  Waypoints, 
  Spline, 
  Minus,
  ChevronDown,
  ChevronRight,
  Clock,
  XCircle,
  PlusCircle,
  Tv,
  ArrowRight,
  Shuffle,
  Triangle,
  Layers
} from 'lucide-react';

interface SidebarProps {
  onAddNode: (type: string, label: string) => void;
  edgeType: string;
  setEdgeType: (type: string) => void;
}

export default function Sidebar({ onAddNode, edgeType, setEdgeType }: SidebarProps) {
  const [isFlowchartOpen, setIsFlowchartOpen] = useState(true);
  const [isOtherOpen, setIsOtherOpen] = useState(true);

  const onDragStart = (event: React.DragEvent, nodeType: string, defaultLabel: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, label: defaultLabel }));
    event.dataTransfer.effectAllowed = 'move';
  };

  // 21 Bentuk Flowchart Lengkap (Sesuai Gambar 1)
  const flowchartShapes = [
    { type: 'process', label: 'Proses', title: 'Proses (Rectangle)', icon: Square },
    { type: 'decision', label: 'Keputusan?', title: 'Keputusan (Diamond)', icon: GitFork },
    { type: 'document', label: 'Dokumen', title: 'Dokumen (Document)', icon: FileText },
    { type: 'oval', label: 'Oval', title: 'Oval / Elips', icon: CircleDot },
    { type: 'terminal', label: 'Mulai / Selesai', title: 'Terminator (Stadium)', icon: PlayCircle },
    { type: 'hexagon', label: 'Persiapan', title: 'Persiapan / Loop (Hexagon)', icon: Hexagon },

    { type: 'delay', label: 'Delay', title: 'Penundaan (D-Shape)', icon: Clock },
    { type: 'summing', label: '', title: 'Summing Junction (Lingkaran Silang X)', icon: XCircle },
    { type: 'or_junction', label: '', title: 'Or Junction (Lingkaran Plus +)', icon: PlusCircle },
    { type: 'parallelogram', label: 'Data I/O', title: 'Data Input/Output (Parallelogram)', icon: FlipHorizontal },
    { type: 'database', label: 'Basis Data', title: 'Penyimpanan Data (Cylinder)', icon: Database },
    { type: 'predefined', label: 'Sub-Proses', title: 'Sub-Proses Terdefinisi (Garis Ganda)', icon: Table },

    { type: 'connector', label: 'A', title: 'Konektor Bulat (On-Page)', icon: CircleDot },
    { type: 'offpage', label: 'Hal 2', title: 'Konektor Luar Halaman (Off-Page)', icon: Layers },
    { type: 'manual_input', label: 'Input Manual', title: 'Input Manual (Trapesium)', icon: FlipHorizontal },
    { type: 'manual_op', label: 'Operasi Manual', title: 'Operasi Manual (Trapesium Terbalik)', icon: FlipHorizontal },
    { type: 'merge', label: 'Gabung', title: 'Penggabungan / Merge (Segitiga Bawah)', icon: Triangle },
    { type: 'extract', label: 'Ekstrak', title: 'Pemisahan / Extract (Segitiga Atas)', icon: Triangle },

    { type: 'collate', label: 'Sortir', title: 'Sortir / Collate (Jam Pasir)', icon: Shuffle },
    { type: 'display', label: 'Layar', title: 'Tampilan Layar (Display)', icon: Tv },
    { type: 'block_arrow', label: 'Arah Alur', title: 'Panah Blok (Block Arrow)', icon: ArrowRight },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-xs select-none no-print">
      {/* Header Info */}
      <div className="p-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Koleksi Bentuk (Stencil)
          </h2>
          <p className="text-[10px] text-slate-400">
            Klik atau geser bentuk ke kanvas
          </p>
        </div>
      </div>

      {/* Shapes Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* 1. SEKSI FLOWCHART (Grid 4-Kolom Sesuai Gambar 1) */}
        <div className="space-y-1.5">
          <button
            onClick={() => setIsFlowchartOpen(!isFlowchartOpen)}
            className="w-full flex items-center justify-between text-[11px] font-bold text-slate-700 hover:text-blue-600 uppercase tracking-wider px-1 py-1 rounded transition-colors"
          >
            <span className="flex items-center gap-1">
              {isFlowchartOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              Flowchart Lengkap ({flowchartShapes.length})
            </span>
          </button>

          {isFlowchartOpen && (
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {flowchartShapes.map((shape) => {
                const Icon = shape.icon;
                return (
                  <div
                    key={shape.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, shape.type, shape.label)}
                    onClick={() => onAddNode(shape.type, shape.label)}
                    title={shape.title}
                    className="h-14 p-1.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-all group bg-white shadow-2xs hover:shadow-xs"
                  >
                    <Icon className="w-4 h-4 text-slate-600 group-hover:text-blue-600 group-hover:scale-110 transition-all mb-1" />
                    <span className="text-[9px] font-medium text-slate-600 group-hover:text-blue-700 text-center leading-tight truncate w-full px-0.5">
                      {shape.label || shape.title.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. SEKSI MIND MAP & LAINNYA */}
        <div className="space-y-1.5 border-t border-slate-100 pt-3">
          <button
            onClick={() => setIsOtherOpen(!isOtherOpen)}
            className="w-full flex items-center justify-between text-[11px] font-bold text-slate-700 hover:text-blue-600 uppercase tracking-wider px-1 py-1 rounded transition-colors"
          >
            <span className="flex items-center gap-1">
              {isOtherOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              Mind Map & Catatan
            </span>
          </button>

          {isOtherOpen && (
            <div className="space-y-1 pt-1">
              {/* Mind Map Item */}
              <div
                draggable
                onDragStart={(e) => onDragStart(e, 'mindmap', 'Topik Mind Map')}
                onClick={() => onAddNode('mindmap', 'Topik Mind Map')}
                className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-100 hover:border-emerald-400 hover:bg-emerald-50/40 cursor-grab active:cursor-grabbing transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-600 transition-colors">
                  <Network className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-700">Topik Mind Map</div>
                  <div className="text-[10px] text-slate-400">Node cabang ide otomatis (+)</div>
                </div>
              </div>

              {/* Sticky Note */}
              <div
                draggable
                onDragStart={(e) => onDragStart(e, 'stickynote', 'Catatan Ide')}
                onClick={() => onAddNode('stickynote', 'Catatan Ide')}
                className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-100 hover:border-amber-400 hover:bg-amber-50/40 cursor-grab active:cursor-grabbing transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 group-hover:bg-amber-100 flex items-center justify-center text-amber-600 transition-colors">
                  <StickyNote className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-700">Catatan Tempel</div>
                  <div className="text-[10px] text-slate-400">Memo warna kuning</div>
                </div>
              </div>

              {/* Teks Bebas */}
              <div
                draggable
                onDragStart={(e) => onDragStart(e, 'text', 'Label Teks')}
                onClick={() => onAddNode('text', 'Label Teks')}
                className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-100 hover:border-blue-400 hover:bg-blue-50/40 cursor-grab active:cursor-grabbing transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 group-hover:bg-blue-100 flex items-center justify-center text-slate-600 transition-colors">
                  <Type className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-700">Teks Melayang</div>
                  <div className="text-[10px] text-slate-400">Label keterangan bebas</div>
                </div>
              </div>

              {/* Cloud Service */}
              <div
                draggable
                onDragStart={(e) => onDragStart(e, 'cloud', 'Layanan Cloud')}
                onClick={() => onAddNode('cloud', 'Layanan Cloud')}
                className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-100 hover:border-sky-400 hover:bg-sky-50/40 cursor-grab active:cursor-grabbing transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 group-hover:bg-sky-100 flex items-center justify-center text-sky-600 transition-colors">
                  <Cloud className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-700">Layanan Cloud</div>
                  <div className="text-[10px] text-slate-400">Server atau API luar</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Connector Style Switcher */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/70">
        <div className="text-[11px] font-semibold text-slate-600 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Waypoints className="w-3.5 h-3.5 text-emerald-700" />
            <span>Gaya Garis Konektor</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => setEdgeType('step')}
            className={`py-1.5 px-2 rounded-lg border text-[11px] flex items-center justify-center gap-1 transition-all ${
              edgeType === 'step'
                ? 'bg-[#0b4632] border-[#0b4632] text-amber-300 shadow-2xs font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
            }`}
            title="Garis Siku Patah (Visio Standard)"
          >
            <span>Siku</span>
          </button>

          <button
            type="button"
            onClick={() => setEdgeType('default')}
            className={`py-1.5 px-2 rounded-lg border text-[11px] flex items-center justify-center gap-1 transition-all ${
              edgeType === 'default'
                ? 'bg-[#0b4632] border-[#0b4632] text-amber-300 shadow-2xs font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
            }`}
            title="Garis Melengkung Halus (Bezier)"
          >
            <Spline className="w-3 h-3" />
            <span>Lengkung</span>
          </button>

          <button
            type="button"
            onClick={() => setEdgeType('straight')}
            className={`py-1.5 px-2 rounded-lg border text-[11px] flex items-center justify-center gap-1 transition-all ${
              edgeType === 'straight'
                ? 'bg-[#0b4632] border-[#0b4632] text-amber-300 shadow-2xs font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
            }`}
            title="Garis Lurus"
          >
            <Minus className="w-3 h-3" />
            <span>Lurus</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
