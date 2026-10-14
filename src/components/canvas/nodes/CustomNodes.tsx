'use client';

import React, { memo } from 'react';
import { Handle, Position, useReactFlow, MarkerType, NodeToolbar } from '@xyflow/react';
import { 
  Plus, 
  Database, 
  Cloud, 
  StickyNote, 
  GitFork, 
  PlayCircle, 
  Square,
  Trash2,
  Copy,
  FileText,
  Layers,
  CircleDot
} from 'lucide-react';

export interface CustomNodeData {
  label: string;
  sublabel?: string;
  color?: string;
  borderColor?: string;
  textColor?: string;
  icon?: string;
  isRoot?: boolean;
  [key: string]: any;
}

// Floating Quick Action Toolbar saat node diklik / terpilih
const NodeQuickActions = ({ id, selected }: { id: string; selected?: boolean }) => {
  const { setNodes, setEdges, getNode } = useReactFlow();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const node = getNode(id);
    if (!node) return;
    const newId = `node-${Date.now()}`;
    const clone = {
      ...node,
      id: newId,
      position: { x: node.position.x + 40, y: node.position.y + 40 },
      selected: true,
    };
    setNodes((nds) => [...nds.map((n) => ({ ...n, selected: false })), clone]);
  };

  return (
    <NodeToolbar
      isVisible={selected}
      position={Position.Top}
      className="flex items-center gap-1 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-xl shadow-xl border border-slate-200 no-print animate-in fade-in zoom-in-95 duration-100 z-50 -top-2"
    >
      <button
        onClick={handleDuplicate}
        className="p-1 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        title="Duplikat Bentuk Ini"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>
      <div className="w-[1px] h-3.5 bg-slate-200 mx-0.5" />
      <button
        onClick={handleDelete}
        className="p-1 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
        title="Hapus Bentuk Ini (atau tekan Delete / Backspace di keyboard)"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </NodeToolbar>
  );
};

// 4 Handles Standard Helper (Atas, Bawah, Kiri, Kanan)
const StandardHandles = () => (
  <>
    <Handle type="target" position={Position.Top} id="t-in" className="!bg-blue-500 hover:!bg-blue-700 !w-2.5 !h-2.5" />
    <Handle type="source" position={Position.Top} id="t-out" className="!bg-blue-500 hover:!bg-blue-700 !w-2.5 !h-2.5" />
    
    <Handle type="target" position={Position.Bottom} id="b-in" className="!bg-blue-500 hover:!bg-blue-700 !w-2.5 !h-2.5" />
    <Handle type="source" position={Position.Bottom} id="b-out" className="!bg-blue-500 hover:!bg-blue-700 !w-2.5 !h-2.5" />
    
    <Handle type="target" position={Position.Left} id="l-in" className="!bg-blue-500 hover:!bg-blue-700 !w-2.5 !h-2.5" />
    <Handle type="source" position={Position.Left} id="l-out" className="!bg-blue-500 hover:!bg-blue-700 !w-2.5 !h-2.5" />
    
    <Handle type="target" position={Position.Right} id="r-in" className="!bg-blue-500 hover:!bg-blue-700 !w-2.5 !h-2.5" />
    <Handle type="source" position={Position.Right} id="r-out" className="!bg-blue-500 hover:!bg-blue-700 !w-2.5 !h-2.5" />
  </>
);

// 1. Process Node (Kotak Proses Standar Visio)
export const ProcessNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#ffffff';
  const border = data.borderColor || '#3b82f6';
  const text = data.textColor || '#0f172a';

  return (
    <div
      className={`relative px-4 py-3 rounded-lg shadow-sm border-2 min-w-[140px] text-center transition-all ${
        selected ? 'ring-2 ring-blue-500 shadow-md scale-102' : ''
      }`}
      style={{ backgroundColor: bg, borderColor: border, color: text }}
    >
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <div className="font-semibold text-sm">{data.label || 'Proses'}</div>
      {data.sublabel && <div className="text-xs opacity-75 mt-0.5">{data.sublabel}</div>}
    </div>
  );
});
ProcessNode.displayName = 'ProcessNode';

// 2. Decision Node (Belah Ketupat / Diamond Keputusan Visio)
export const DecisionNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#eff6ff';
  const border = data.borderColor || '#2563eb';
  const text = data.textColor || '#1e3a8a';

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <div
        className={`absolute inset-0 rotate-45 rounded-md border-2 shadow-sm transition-all ${
          selected ? 'ring-2 ring-blue-500 shadow-md' : ''
        }`}
        style={{ backgroundColor: bg, borderColor: border }}
      />
      <div
        className="relative z-10 px-2 text-center text-xs font-semibold select-none max-w-[80px] break-words"
        style={{ color: text }}
      >
        {data.label || 'Keputusan?'}
      </div>
    </div>
  );
});
DecisionNode.displayName = 'DecisionNode';

// 3. Terminal Node (Mulai / Selesai - Kapsul Bulat Visio)
export const TerminalNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#ecfdf5';
  const border = data.borderColor || '#10b981';
  const text = data.textColor || '#065f46';

  return (
    <div
      className={`relative px-6 py-2.5 rounded-full shadow-sm border-2 min-w-[120px] text-center transition-all flex items-center justify-center gap-1.5 ${
        selected ? 'ring-2 ring-emerald-500 shadow-md' : ''
      }`}
      style={{ backgroundColor: bg, borderColor: border, color: text }}
    >
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <PlayCircle className="w-3.5 h-3.5 opacity-80" />
      <span className="font-semibold text-sm">{data.label || 'Mulai / Selesai'}</span>
    </div>
  );
});
TerminalNode.displayName = 'TerminalNode';

// 4. Parallelogram Node (Data / Input-Output Jajar Genjang)
export const ParallelogramNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#fefce8';
  const border = data.borderColor || '#ca8a04';
  const text = data.textColor || '#713f12';

  return (
    <div className="relative min-w-[140px] h-12 flex items-center justify-center">
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <div
        className={`absolute inset-0 -skew-x-12 rounded-md border-2 shadow-sm transition-all ${
          selected ? 'ring-2 ring-amber-500 shadow-md' : ''
        }`}
        style={{ backgroundColor: bg, borderColor: border }}
      />
      <div className="relative z-10 px-4 text-center text-xs font-semibold select-none" style={{ color: text }}>
        {data.label || 'Input / Output'}
      </div>
    </div>
  );
});
ParallelogramNode.displayName = 'ParallelogramNode';

// 5. Document Node (Dokumen dengan lekukan bawah bergelombang)
export const DocumentNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#ffffff';
  const border = data.borderColor || '#0284c7';
  const text = data.textColor || '#0369a1';

  return (
    <div
      className={`relative px-4 pt-3 pb-4 rounded-t-lg rounded-b-[18px] shadow-sm border-2 min-w-[140px] text-center transition-all border-b-4 ${
        selected ? 'ring-2 ring-sky-500 shadow-md' : ''
      }`}
      style={{ backgroundColor: bg, borderColor: border, color: text }}
    >
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <div className="flex items-center justify-center gap-1 mb-0.5 opacity-70">
        <FileText className="w-3.5 h-3.5" />
      </div>
      <div className="font-semibold text-xs">{data.label || 'Dokumen Laporan'}</div>
    </div>
  );
});
DocumentNode.displayName = 'DocumentNode';

// 6. Predefined Process Node (Sub-proses dengan garis ganda kiri kanan)
export const PredefinedNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#ffffff';
  const border = data.borderColor || '#475569';
  const text = data.textColor || '#0f172a';

  return (
    <div
      className={`relative px-6 py-3 rounded-md shadow-sm border-2 min-w-[150px] text-center transition-all ${
        selected ? 'ring-2 ring-slate-500 shadow-md' : ''
      }`}
      style={{ backgroundColor: bg, borderColor: border, color: text }}
    >
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      {/* Garis Ganda Kiri & Kanan */}
      <div className="absolute left-2.5 top-0 bottom-0 w-[1.5px]" style={{ backgroundColor: border }} />
      <div className="absolute right-2.5 top-0 bottom-0 w-[1.5px]" style={{ backgroundColor: border }} />
      <div className="font-semibold text-xs">{data.label || 'Sub-Proses Khusus'}</div>
    </div>
  );
});
PredefinedNode.displayName = 'PredefinedNode';

// 7. Hexagon Node (Persiapan / Preparation Segi Enam)
export const HexagonNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#fdf2f8';
  const border = data.borderColor || '#db2777';
  const text = data.textColor || '#831843';

  return (
    <div
      className={`relative px-5 py-2.5 rounded-lg shadow-sm border-2 min-w-[130px] text-center transition-all ${
        selected ? 'ring-2 ring-pink-500 shadow-md' : ''
      }`}
      style={{ backgroundColor: bg, borderColor: border, color: text }}
    >
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <div className="font-semibold text-xs">{data.label || 'Persiapan / Loop'}</div>
    </div>
  );
});
HexagonNode.displayName = 'HexagonNode';

// 8. Connector Circle Node (Konektor Lingkaran On-Page)
export const ConnectorNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#ffffff';
  const border = data.borderColor || '#3b82f6';
  const text = data.textColor || '#1d4ed8';

  return (
    <div
      className={`relative w-10 h-10 rounded-full shadow-sm border-2 flex items-center justify-center transition-all ${
        selected ? 'ring-2 ring-blue-500 shadow-md' : ''
      }`}
      style={{ backgroundColor: bg, borderColor: border, color: text }}
    >
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <span className="font-bold text-xs">{data.label || 'A'}</span>
    </div>
  );
});
ConnectorNode.displayName = 'ConnectorNode';

// 9. Database Node (Silinder Basis Data Visio)
export const DatabaseNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#faf5ff';
  const border = data.borderColor || '#9333ea';
  const text = data.textColor || '#581c87';

  return (
    <div
      className={`relative px-4 py-3 rounded-lg shadow-sm border-2 min-w-[130px] text-center transition-all flex flex-col items-center ${
        selected ? 'ring-2 ring-purple-500 shadow-md' : ''
      }`}
      style={{ backgroundColor: bg, borderColor: border, color: text }}
    >
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <Database className="w-4 h-4 mb-1 text-purple-600" />
      <div className="font-semibold text-sm">{data.label || 'Database'}</div>
      {data.sublabel && <div className="text-xs opacity-75">{data.sublabel}</div>}
    </div>
  );
});
DatabaseNode.displayName = 'DatabaseNode';

// 10. Cloud / Network Node (Layanan Cloud Visio)
export const CloudNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#f0fdf4';
  const border = data.borderColor || '#22c55e';
  const text = data.textColor || '#14532d';

  return (
    <div
      className={`relative px-5 py-3 rounded-2xl shadow-sm border-2 min-w-[140px] text-center transition-all flex flex-col items-center ${
        selected ? 'ring-2 ring-green-500 shadow-md' : ''
      }`}
      style={{ backgroundColor: bg, borderColor: border, color: text }}
    >
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <Cloud className="w-4 h-4 mb-1 text-green-600" />
      <div className="font-semibold text-sm">{data.label || 'Cloud / Service'}</div>
    </div>
  );
});
CloudNode.displayName = 'CloudNode';

// 11. Mind Map Node (Modern Branching Node dengan useReactFlow hook langsung)
export const MindMapNode = memo((props: any) => {
  const { id, data, selected } = props;
  const { getNode, getEdges, setNodes, setEdges } = useReactFlow();

  const isRoot = data.isRoot;
  const bg = data.color || (isRoot ? '#1e293b' : '#ffffff');
  const border = data.borderColor || (isRoot ? '#0f172a' : '#3b82f6');
  const text = data.textColor || (isRoot ? '#ffffff' : '#0f172a');

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    const parent = getNode(id);
    if (!parent) return;

    const edges = getEdges();
    const childCount = edges.filter((edge) => edge.source === id).length;
    const newId = `mindmap-${Date.now()}`;
    const offsetX = 220;
    const offsetY = (childCount - 1) * 75;

    const newNode = {
      id: newId,
      type: 'mindmap',
      position: {
        x: parent.position.x + offsetX,
        y: parent.position.y + offsetY,
      },
      data: {
        label: `Cabang Ide ${childCount + 1}`,
        color: '#ffffff',
        borderColor: '#3b82f6',
        textColor: '#0f172a',
      },
    };

    const newEdge = {
      id: `edge-${id}-${newId}`,
      source: id,
      target: newId,
      type: 'default',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
      style: { stroke: '#3b82f6', strokeWidth: 2 },
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
  };

  return (
    <div className="group relative">
      <NodeQuickActions id={id} selected={selected} />
      <div
        className={`px-4 py-2.5 rounded-xl shadow-sm border-2 min-w-[130px] max-w-[240px] text-center transition-all ${
          selected ? 'ring-2 ring-blue-500 shadow-md' : ''
        } ${isRoot ? 'font-bold text-base shadow-md' : 'text-sm font-medium'}`}
        style={{ backgroundColor: bg, borderColor: border, color: text }}
      >
        <StandardHandles />
        <div>{data.label || (isRoot ? 'Topik Utama' : 'Sub Ide')}</div>
      </div>

      <button
        onClick={handleAddChild}
        title="Tambah Cabang Ide Baru"
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
});
MindMapNode.displayName = 'MindMapNode';

// 12. Sticky Note (Catatan Tempel)
export const StickyNoteNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#fef08a';
  const border = data.borderColor || '#facc15';
  const text = data.textColor || '#713f12';

  return (
    <div
      className={`relative p-3 rounded-md shadow-md border min-w-[120px] max-w-[180px] min-h-[90px] font-sans text-xs transition-all ${
        selected ? 'ring-2 ring-amber-500' : ''
      }`}
      style={{ backgroundColor: bg, borderColor: border, color: text }}
    >
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <div className="flex items-center gap-1 mb-1 font-semibold opacity-70">
        <StickyNote className="w-3 h-3" />
        <span>Catatan</span>
      </div>
      <div className="whitespace-pre-wrap">{data.label || 'Tulis catatan ide di sini...'}</div>
    </div>
  );
});
StickyNoteNode.displayName = 'StickyNoteNode';

// 13. Text Node (Teks Melayang Bebas)
export const TextNode = memo((props: any) => {
  const { id, data, selected } = props;
  return (
    <div
      className={`relative px-2 py-1 rounded min-w-[60px] text-center transition-all ${
        selected ? 'ring-1 ring-blue-400 bg-blue-50/50' : ''
      }`}
      style={{ color: data.textColor || '#1e293b' }}
    >
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <span className="font-medium text-sm">{data.label || 'Teks'}</span>
    </div>
  );
});
TextNode.displayName = 'TextNode';

import { flowchartNodeTypes } from './FlowchartShapes';

export const nodeTypes: any = {
  ...flowchartNodeTypes,
  process: ProcessNode,
  decision: DecisionNode,
  terminal: TerminalNode,
  parallelogram: ParallelogramNode,
  document: DocumentNode,
  predefined: PredefinedNode,
  hexagon: HexagonNode,
  connector: ConnectorNode,
  database: DatabaseNode,
  cloud: CloudNode,
  mindmap: MindMapNode,
  stickynote: StickyNoteNode,
  text: TextNode,
};
