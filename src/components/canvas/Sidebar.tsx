'use client';

import React from 'react';
import { 
  Square, 
  PlayCircle, 
  Database, 
  Cloud, 
  GitFork, 
  StickyNote, 
  Type, 
  Waypoints,
  Network,
  Spline,
  Minus
} from 'lucide-react';

interface SidebarProps {
  onAddNode: (type: string, label: string) => void;
  edgeType: string;
  setEdgeType: (type: string) => void;
}

export default function Sidebar({ onAddNode, edgeType, setEdgeType }: SidebarProps) {
  const onDragStart = (event: React.DragEvent, nodeType: string, defaultLabel: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, label: defaultLabel }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const shapes = [
    {
      category: 'Bentuk Flowchart (Visio)',
      items: [
        { type: 'process', label: 'Proses / Langkah', icon: Square, desc: 'Kotak instruksi standar' },
        { type: 'decision', label: 'Keputusan (IF)', icon: GitFork, desc: 'Belah ketupat pilihan' },
        { type: 'terminal', label: 'Mulai / Selesai', icon: PlayCircle, desc: 'Titik awal atau akhir' },
        { type: 'database', label: 'Basis Data', icon: Database, desc: 'Penyimpanan data' },
        { type: 'cloud', label: 'Layanan Cloud', icon: Cloud, desc: 'Server atau API luar' },
      ],
    },
    {
      category: 'Mind Mapping',
      items: [
        { type: 'mindmap', label: 'Ide / Topik Cabang', icon: Network, desc: 'Node brainstorming cepat' },
      ],
    },
    {
      category: 'Catatan & Teks',
      items: [
        { type: 'stickynote', label: 'Catatan Tempel', icon: StickyNote, desc: 'Memo warna kuning' },
        { type: 'text', label: 'Teks Melayang', icon: Type, desc: 'Label keterangan bebas' },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-xs select-none no-print">
      {/* Header Info */}
      <div className="p-4 border-b border-slate-100">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Koleksi Bentuk (Stencil)
        </h2>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Tarik atau klik bentuk untuk menambahkan ke kanvas.
        </p>
      </div>

      {/* Shapes List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {shapes.map((group) => (
          <div key={group.category} className="space-y-1.5">
            <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
              {group.category}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, item.type, item.label)}
                    onClick={() => onAddNode(item.type, item.label)}
                    className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-100 hover:border-blue-300 hover:bg-blue-50/50 cursor-grab active:cursor-grabbing transition-all group"
                  >
                    <div className="w-7 h-7 rounded-md bg-slate-50 border border-slate-200 group-hover:bg-blue-100 group-hover:border-blue-300 flex items-center justify-center text-slate-600 group-hover:text-blue-600 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-700 truncate">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Connector Style Switcher */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1">
          <Waypoints className="w-3.5 h-3.5" />
          <span>Gaya Garis Konektor</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => setEdgeType('step')}
            className={`py-1.5 px-2 rounded-md border text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${
              edgeType === 'step'
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
            title="Garis Siku-Siku Patah (Visio Standard)"
          >
            <span>Siku</span>
          </button>

          <button
            type="button"
            onClick={() => setEdgeType('default')}
            className={`py-1.5 px-2 rounded-md border text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${
              edgeType === 'default'
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
            title="Garis Melengkung Halus (Bezier)"
          >
            <Spline className="w-3 h-3" />
            <span>Lengkung</span>
          </button>

          <button
            type="button"
            onClick={() => setEdgeType('straight')}
            className={`py-1.5 px-2 rounded-md border text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${
              edgeType === 'straight'
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
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
