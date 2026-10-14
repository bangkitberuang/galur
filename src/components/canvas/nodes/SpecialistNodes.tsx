'use client';

import React, { memo } from 'react';
import { Handle, Position, useReactFlow, NodeToolbar } from '@xyflow/react';
import { 
  Database, 
  Key, 
  Copy, 
  Trash2, 
  User, 
  Target, 
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { getNodeTextStyles, getNodeShapeStyles } from '@/lib/nodeStyles';

// Floating Quick Action Toolbar
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
        type="button"
        onClick={handleDuplicate}
        className="p-1 rounded-md text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
        title="Duplikat Bentuk Ini"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>
      <div className="w-[1px] h-3.5 bg-slate-200 mx-0.5" />
      <button
        type="button"
        onClick={handleDelete}
        className="p-1 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
        title="Hapus Bentuk Ini"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </NodeToolbar>
  );
};

// 8 Handles Standard Helper (8 Titik Hubung Mengelilingi Objek: 4 Sisi Utama + 4 Sudut)
const StandardHandles = () => (
  <>
    {/* 1. Atas - Kiri (Top-Left) */}
    <Handle
      type="source"
      position={Position.Top}
      id="top-left"
      title="Titik Hubung Atas Kiri"
      className="!bg-[#059669] hover:!bg-[#f59e0b] !w-2.5 !h-2.5"
      style={{ left: '18%' }}
    />

    {/* 2. Atas - Tengah (Top-Center) */}
    <Handle
      type="source"
      position={Position.Top}
      id="t-out"
      title="Titik Hubung Atas"
      className="!bg-[#059669] hover:!bg-[#f59e0b] !w-2.5 !h-2.5"
      style={{ left: '50%' }}
    />
    <Handle
      type="target"
      position={Position.Top}
      id="t-in"
      style={{ left: '50%', pointerEvents: 'none', opacity: 0 }}
    />

    {/* 3. Atas - Kanan (Top-Right) */}
    <Handle
      type="source"
      position={Position.Top}
      id="top-right"
      title="Titik Hubung Atas Kanan"
      className="!bg-[#059669] hover:!bg-[#f59e0b] !w-2.5 !h-2.5"
      style={{ left: '82%' }}
    />

    {/* 4. Kanan - Tengah (Right-Center) */}
    <Handle
      type="source"
      position={Position.Right}
      id="r-out"
      title="Titik Hubung Kanan"
      className="!bg-[#059669] hover:!bg-[#f59e0b] !w-2.5 !h-2.5"
      style={{ top: '50%' }}
    />
    <Handle
      type="target"
      position={Position.Right}
      id="r-in"
      style={{ top: '50%', pointerEvents: 'none', opacity: 0 }}
    />

    {/* 5. Bawah - Kanan (Bottom-Right) */}
    <Handle
      type="source"
      position={Position.Bottom}
      id="bottom-right"
      title="Titik Hubung Bawah Kanan"
      className="!bg-[#059669] hover:!bg-[#f59e0b] !w-2.5 !h-2.5"
      style={{ left: '82%' }}
    />

    {/* 6. Bawah - Tengah (Bottom-Center) */}
    <Handle
      type="source"
      position={Position.Bottom}
      id="b-out"
      title="Titik Hubung Bawah"
      className="!bg-[#059669] hover:!bg-[#f59e0b] !w-2.5 !h-2.5"
      style={{ left: '50%' }}
    />
    <Handle
      type="target"
      position={Position.Bottom}
      id="b-in"
      style={{ left: '50%', pointerEvents: 'none', opacity: 0 }}
    />

    {/* 7. Bawah - Kiri (Bottom-Left) */}
    <Handle
      type="source"
      position={Position.Bottom}
      id="bottom-left"
      title="Titik Hubung Bawah Kiri"
      className="!bg-[#059669] hover:!bg-[#f59e0b] !w-2.5 !h-2.5"
      style={{ left: '18%' }}
    />

    {/* 8. Kiri - Tengah (Left-Center) */}
    <Handle
      type="source"
      position={Position.Left}
      id="l-out"
      title="Titik Hubung Kiri"
      className="!bg-[#059669] hover:!bg-[#f59e0b] !w-2.5 !h-2.5"
      style={{ top: '50%' }}
    />
    <Handle
      type="target"
      position={Position.Left}
      id="l-in"
      style={{ top: '50%', pointerEvents: 'none', opacity: 0 }}
    />
  </>
);

// 1. UML CLASS NODE
export const UMLClassNode = memo((props: any) => {
  const { id, data, selected } = props;
  const className = data.className || data.label || 'NamaKelas';
  const stereotype = data.stereotype || '<<Class>>';
  const attributes: string[] = Array.isArray(data.attributes) ? data.attributes : ['- properti: Tipe'];
  const methods: string[] = Array.isArray(data.methods) ? data.methods : ['+ fungsi(): Tipe'];
  const borderColor = data.borderColor || '#2563eb';
  const headerBg = data.headerColor || '#1d4ed8';

  return (
    <div
      className={`bg-white rounded-xl shadow-md border overflow-hidden min-w-[200px] text-xs font-mono transition-all ${
        selected ? 'ring-2 ring-emerald-500 shadow-lg' : ''
      }`}
      style={{ borderColor }}
    >
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />

      {/* Header */}
      <div className="p-2.5 text-center text-white font-bold" style={{ backgroundColor: headerBg }}>
        <div className="text-[10px] opacity-80 uppercase tracking-widest">{stereotype}</div>
        <div className="text-sm font-sans font-extrabold">{className}</div>
      </div>

      {/* Atribut */}
      <div className="p-2 border-b border-slate-200 bg-slate-50/50 space-y-0.5 text-[11px] text-slate-700">
        {attributes.map((attr, idx) => (
          <div key={idx} className="truncate">{attr}</div>
        ))}
      </div>

      {/* Metode */}
      <div className="p-2 bg-white space-y-0.5 text-[11px] text-slate-800">
        {methods.map((method, idx) => (
          <div key={idx} className="truncate">{method}</div>
        ))}
      </div>
    </div>
  );
});
UMLClassNode.displayName = 'UMLClassNode';

// 2. ERD ENTITY NODE (Database Table)
export const ERDEntityNode = memo((props: any) => {
  const { id, data, selected } = props;
  const tableName = data.tableName || data.label || 'tabel_data';
  const fields = Array.isArray(data.fields)
    ? data.fields
    : [
        { name: 'id', type: 'BIGINT', isPK: true },
        { name: 'nama', type: 'VARCHAR(100)' },
      ];
  const headerBg = data.headerBg || '#0b4632';

  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden min-w-[220px] text-xs font-mono transition-all ${
        selected ? 'ring-2 ring-emerald-500 shadow-lg' : ''
      }`}
    >
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />

      {/* Table Header */}
      <div className="p-2.5 text-white flex items-center justify-between font-sans font-bold" style={{ backgroundColor: headerBg }}>
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-amber-300" />
          <span className="font-extrabold">{tableName}</span>
        </div>
        <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-white/20 text-white">Entity</span>
      </div>

      {/* Field Rows */}
      <div className="divide-y divide-slate-100">
        {fields.map((f: any, idx: number) => (
          <div key={idx} className="px-3 py-1.5 flex items-center justify-between text-[11px] hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-1.5 font-medium text-slate-800 truncate">
              {f.isPK && (
                <span className="text-[9px] font-bold px-1 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  PK
                </span>
              )}
              {f.isFK && (
                <span className="text-[9px] font-bold px-1 rounded bg-blue-100 text-blue-800 border border-blue-300">
                  FK
                </span>
              )}
              <span>{f.name}</span>
            </div>
            <span className="text-slate-400 text-[10px] uppercase font-mono ml-3">{f.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
ERDEntityNode.displayName = 'ERDEntityNode';

// 3. ORGANIZATIONAL CHART NODE
export const OrgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const name = data.name || data.label || 'Nama Pejabat';
  const role = data.role || data.sublabel || 'Jabatan / Posisi';
  const dept = data.dept || 'Departemen';
  const avatarBg = data.avatarBg || '#0b4632';
  const badgeColor = data.badgeColor || '#059669';

  const shapeStyles = getNodeShapeStyles(data, '#ffffff', '#e2e8f0');
  const textStyles = getNodeTextStyles(data, 12, '#0f172a');

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((s: string) => s[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={`rounded-2xl shadow-md border p-3 min-w-[200px] max-w-[240px] text-left transition-all ${
        selected ? 'ring-2 ring-emerald-500 shadow-xl' : ''
      }`}
      style={{ ...shapeStyles, ...textStyles }}
    >
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />

      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0"
          style={{ backgroundColor: avatarBg }}
        >
          {initials || <User className="w-4 h-4" />}
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-xs truncate" style={{ color: textStyles.color }}>{name}</h4>
          <p className="text-[11px] font-semibold text-slate-600 truncate">{role}</p>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white truncate max-w-[170px]"
          style={{ backgroundColor: badgeColor }}
        >
          {dept}
        </span>
      </div>
    </div>
  );
});
OrgNode.displayName = 'OrgNode';

// 4. SWOT QUADRANT CARD NODE (Matriks 4 Kuadran dengan Watermark Huruf S / W / O / T)
export const SWOTCardNode = memo((props: any) => {
  const { id, data, selected } = props;
  const swotType = (data.type || 'S').toUpperCase() as 'S' | 'W' | 'O' | 'T';

  const defaultTitles: Record<'S' | 'W' | 'O' | 'T', string> = {
    S: 'strengths',
    W: 'weaknesses',
    O: 'opportunities',
    T: 'threats',
  };

  const defaultPresets: Record<'S' | 'W' | 'O' | 'T', { bg: string; border: string; text: string; watermark: string }> = {
    S: { bg: '#8ed95a', border: '#78c644', text: '#0f172a', watermark: 'rgba(0, 0, 0, 0.15)' },
    W: { bg: '#72aae0', border: '#5b98d2', text: '#0f172a', watermark: 'rgba(0, 0, 0, 0.15)' },
    O: { bg: '#ffd966', border: '#f0c742', text: '#0f172a', watermark: 'rgba(0, 0, 0, 0.15)' },
    T: { bg: '#f07d7d', border: '#df6666', text: '#0f172a', watermark: 'rgba(0, 0, 0, 0.15)' },
  };

  const preset = defaultPresets[swotType] || defaultPresets.S;
  const title = data.title || defaultTitles[swotType] || 'strengths';
  const bg = data.color || preset.bg;
  const border = data.borderColor || preset.border;
  const text = data.textColor || preset.text;
  const watermark = preset.watermark;

  const defaultSampleItems: Record<'S' | 'W' | 'O' | 'T', string[]> = {
    S: [
      'Low labor cost',
      'Strong specialization in electric services',
      'Well recognized, national brand name',
      'Good relationship with major investors',
    ],
    W: [
      'Lack expertise in renewable energy',
      'Lack capital',
      'Lack of industrial partners',
      'Lack interaction with major stakeholders and policy makers',
      'Low R&D capability',
    ],
    O: [
      '2-year government subsidies',
      'Fast growing sector',
      'High social acceptance',
      'High oil and coal cost',
      'Well established legal framework for storage, manufacturing and transportation',
    ],
    T: [
      'Potentially high R&D expenses',
      'High waste management fee',
      'The "Not in my backyard" philosophy makes waste management difficult',
      'Large competitors get majority of market share',
    ],
  };

  const items: string[] = Array.isArray(data.items) && data.items.length > 0 
    ? data.items 
    : (defaultSampleItems[swotType] || defaultSampleItems.S);

  return (
    <div
      className={`relative rounded-xl shadow-md border p-5 min-w-[300px] max-w-[330px] min-h-[320px] flex flex-col justify-start transition-all overflow-hidden select-none ${
        selected ? 'ring-3 ring-emerald-700 shadow-xl scale-101' : ''
      }`}
      style={{ backgroundColor: bg, borderColor: border }}
    >
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />

      {/* Giant Background Watermark Letter (S / W / O / T) persis seperti pada Gambar Contoh */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none font-black font-sans leading-none z-0"
        style={{ fontSize: '210px', color: watermark }}
        aria-hidden="true"
      >
        {swotType}
      </div>

      {/* Judul Kuadran (Tengah) */}
      <div className="relative z-10 text-center mb-3">
        <h3 className="font-bold text-lg lowercase tracking-tight text-slate-900 drop-shadow-2xs">
          {title}
        </h3>
      </div>

      {/* Daftar Poin Analisis (Bullet Points) */}
      <ul className="relative z-10 space-y-2 text-xs font-medium leading-relaxed" style={{ color: text }}>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="font-black text-sm leading-none mt-0.5">•</span>
            <span className="leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});
SWOTCardNode.displayName = 'SWOTCardNode';

export const specialistNodeTypes = {
  uml_class: UMLClassNode,
  erd_entity: ERDEntityNode,
  org_node: OrgNode,
  swot_card: SWOTCardNode,
};
