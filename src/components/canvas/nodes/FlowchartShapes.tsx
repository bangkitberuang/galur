'use client';

import React, { memo, useState } from 'react';
import { Handle, Position, NodeToolbar, useReactFlow } from '@xyflow/react';
import { Trash2, Copy, Smile } from 'lucide-react';
import { getNodeTextStyles, getNodeShapeStyles, getSvgStrokeProps } from '@/lib/nodeStyles';
import { NodeIconDisplay } from './NodeIconDisplay';

// Floating Quick Action Toolbar (Hapus & Duplikat Cepat)
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
        className="p-1 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
        title="Duplikat Bentuk Ini"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          const el = document.getElementById('property-icon-section');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }}
        className="p-1 rounded-md text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
        title="Atur Ikon, Emoticon & Logo di Panel Properti"
      >
        <Smile className="w-3.5 h-3.5" />
      </button>
      <div className="w-[1px] h-3.5 bg-slate-200 mx-0.5" />
      <button
        type="button"
        onClick={handleDelete}
        className="p-1 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
        title="Hapus Bentuk Ini (atau tekan Delete / Backspace di keyboard)"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </NodeToolbar>
  );
};

// 8 Handles Standard Helper (8 Titik Hubung Mengelilingi Objek: 4 Sisi Utama + 4 Sudut)
const StandardHandles = () => (
  <>
    {/* 1. Kanan - Tengah (Right-Center) */}
    <Handle
      type="target"
      position={Position.Right}
      id="r-in"
      title="Titik Hubung Kanan (Target)"
      className="!opacity-0 !w-4 !h-4 pointer-events-auto"
      style={{ top: '50%', zIndex: 1 }}
    />
    <Handle
      type="source"
      position={Position.Right}
      id="r-out"
      title="Titik Hubung Kanan"
      className="!bg-blue-500 hover:!bg-amber-500 !w-3 !h-3 hover:scale-125 transition-transform cursor-crosshair"
      style={{ top: '50%', zIndex: 10 }}
    />

    {/* 2. Kiri - Tengah (Left-Center) */}
    <Handle
      type="target"
      position={Position.Left}
      id="l-in"
      title="Titik Hubung Kiri (Target)"
      className="!opacity-0 !w-4 !h-4 pointer-events-auto"
      style={{ top: '50%', zIndex: 1 }}
    />
    <Handle
      type="source"
      position={Position.Left}
      id="l-out"
      title="Titik Hubung Kiri"
      className="!bg-blue-500 hover:!bg-amber-500 !w-3 !h-3 hover:scale-125 transition-transform cursor-crosshair"
      style={{ top: '50%', zIndex: 10 }}
    />

    {/* 3. Atas - Tengah (Top-Center) */}
    <Handle
      type="target"
      position={Position.Top}
      id="t-in"
      title="Titik Hubung Atas (Target)"
      className="!opacity-0 !w-4 !h-4 pointer-events-auto"
      style={{ left: '50%', zIndex: 1 }}
    />
    <Handle
      type="source"
      position={Position.Top}
      id="t-out"
      title="Titik Hubung Atas"
      className="!bg-blue-500 hover:!bg-amber-500 !w-3 !h-3 hover:scale-125 transition-transform cursor-crosshair"
      style={{ left: '50%', zIndex: 10 }}
    />

    {/* 4. Bawah - Tengah (Bottom-Center) */}
    <Handle
      type="target"
      position={Position.Bottom}
      id="b-in"
      title="Titik Hubung Bawah (Target)"
      className="!opacity-0 !w-4 !h-4 pointer-events-auto"
      style={{ left: '50%', zIndex: 1 }}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="b-out"
      title="Titik Hubung Bawah"
      className="!bg-blue-500 hover:!bg-amber-500 !w-3 !h-3 hover:scale-125 transition-transform cursor-crosshair"
      style={{ left: '50%', zIndex: 10 }}
    />

    {/* Sudut Tambahan: Top-Left, Top-Right, Bottom-Right, Bottom-Left */}
    <Handle
      type="source"
      position={Position.Top}
      id="top-left"
      title="Titik Hubung Atas Kiri"
      className="!bg-blue-500/80 hover:!bg-amber-500 !w-2.5 !h-2.5 cursor-crosshair"
      style={{ left: '18%', zIndex: 10 }}
    />
    <Handle
      type="source"
      position={Position.Top}
      id="top-right"
      title="Titik Hubung Atas Kanan"
      className="!bg-blue-500/80 hover:!bg-amber-500 !w-2.5 !h-2.5 cursor-crosshair"
      style={{ left: '82%', zIndex: 10 }}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="bottom-right"
      title="Titik Hubung Bawah Kanan"
      className="!bg-blue-500/80 hover:!bg-amber-500 !w-2.5 !h-2.5 cursor-crosshair"
      style={{ left: '82%', zIndex: 10 }}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="bottom-left"
      title="Titik Hubung Bawah Kiri"
      className="!bg-blue-500/80 hover:!bg-amber-500 !w-2.5 !h-2.5 cursor-crosshair"
      style={{ left: '18%', zIndex: 10 }}
    />
  </>
);

// Wrapper Umum untuk Bentuk SVG Presisi (Mendukung Dimensi, Rotasi, Bayangan, Opacity, dan Edit Double-Click)
const SvgShapeWrapper = ({
  id,
  selected,
  width = 140,
  height = 70,
  children,
  label,
  sublabel,
  textColor = '#0f172a',
  data,
}: {
  id: string;
  selected?: boolean;
  width?: number;
  height?: number;
  children: React.ReactNode;
  label: string;
  sublabel?: string;
  textColor?: string;
  data?: any;
}) => {
  const { setNodes } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [tempLabel, setTempLabel] = useState(label || '');

  const effectiveWidth = data?.width ? Number(data.width) : width;
  const effectiveHeight = data?.height ? Number(data.height) : height;

  const textStyles = data ? getNodeTextStyles(data, 12, textColor) : { color: textColor };
  const shapeStyles = data ? getNodeShapeStyles(data) : {};

  const handleSave = () => {
    const trimmed = tempLabel.trim();
    if (trimmed.length > 0) {
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: trimmed } } : n))
      );
    }
    setIsEditing(false);
  };

  return (
    <div
      className={`relative flex items-center justify-center transition-all ${
        selected ? 'drop-shadow-md ring-2 ring-blue-500 rounded-lg' : ''
      }`}
      style={{
        ...shapeStyles,
        width: effectiveWidth,
        height: effectiveHeight,
      }}
    >
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      {/* Lencana Status Alur (✓ Disetujui / ✕ Ditolak) */}
      {data?.statusBadge === 'success' && (
        <div 
          className="absolute -top-2.5 -right-2.5 z-30 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-md border-2 border-white ring-1 ring-emerald-600 pointer-events-none select-none"
          title="Status: Disetujui / Sukses (✓)"
        >
          ✓
        </div>
      )}
      {data?.statusBadge === 'error' && (
        <div 
          className="absolute -top-2.5 -right-2.5 z-30 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center font-black text-xs shadow-md border-2 border-white ring-1 ring-rose-600 pointer-events-none select-none"
          title="Status: Ditolak / Gagal (✕)"
        >
          ✕
        </div>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        preserveAspectRatio="none"
      >
        {children}
      </svg>
      <div
        className="relative z-10 px-3 max-w-[88%] break-words leading-tight text-center flex flex-col items-center justify-center"
        style={textStyles}
      >
        {(data?.icon || data?.emoji || data?.iconUrl) && (
          <NodeIconDisplay
            icon={data?.icon}
            emoji={data?.emoji}
            iconUrl={data?.iconUrl}
            color={data?.iconColor}
            size={data?.iconSize || 'sm'}
            defaultColor={textColor}
            className="mb-0.5"
          />
        )}
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={tempLabel}
            onChange={(e) => setTempLabel(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            className="w-full px-1.5 py-0.5 border border-blue-500 bg-white/95 rounded text-xs text-slate-900 focus:outline-hidden font-medium text-center shadow-xs"
          />
        ) : (
          <div
            onDoubleClick={(e) => {
              e.stopPropagation();
              setTempLabel(label || '');
              setIsEditing(true);
            }}
            title="Klik ganda untuk mengedit teks langsung"
            className="cursor-text hover:bg-black/5 rounded px-1.5 py-0.5 transition-colors select-none"
          >
            <div>{label}</div>
            {sublabel && <div className="text-[10px] opacity-75 mt-0.5">{sublabel}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

// 1. Process / Kotak Persegi Panjang
export const ProcessSvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#ffffff';
  const border = data.borderColor || '#3b82f6';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const rx = data?.borderRadius !== undefined ? parseInt(data.borderRadius, 10) : 4;
  const text = data.textColor || '#0f172a';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} label={data.label || 'Proses'} sublabel={data.sublabel} textColor={text}>
      <rect x="2" y="2" width="136" height="66" rx={rx} fill={bg} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </SvgShapeWrapper>
  );
});
ProcessSvgNode.displayName = 'ProcessSvgNode';

// 2. Decision / Belah Ketupat (Diamond)
export const DecisionSvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#eff6ff';
  const border = data.borderColor || '#2563eb';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const text = data.textColor || '#1e3a8a';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} width={120} height={90} label={data.label || 'Keputusan?'} textColor={text}>
      <polygon points="60,2 118,45 60,88 2,45" fill={bg} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </SvgShapeWrapper>
  );
});
DecisionSvgNode.displayName = 'DecisionSvgNode';

// 3. Document / Dokumen dengan Gelombang Bawah
export const DocumentSvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#ffffff';
  const border = data.borderColor || '#0284c7';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const text = data.textColor || '#0369a1';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} width={140} height={75} label={data.label || 'Dokumen'} textColor={text}>
      <path
        d="M 2 2 L 138 2 L 138 60 Q 105 45 70 60 Q 35 75 2 60 Z"
        fill={bg}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
      />
    </SvgShapeWrapper>
  );
});
DocumentSvgNode.displayName = 'DocumentSvgNode';

// 4. Oval / Ellipse
export const OvalSvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#f8fafc';
  const border = data.borderColor || '#475569';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const text = data.textColor || '#0f172a';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} width={130} height={70} label={data.label || 'Oval'} textColor={text}>
      <ellipse cx="65" cy="35" rx="63" ry="33" fill={bg} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </SvgShapeWrapper>
  );
});
OvalSvgNode.displayName = 'OvalSvgNode';

// 5. Terminal / Stadium Capsule (Mulai / Selesai)
export const TerminalSvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#ecfdf5';
  const border = data.borderColor || '#10b981';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const text = data.textColor || '#065f46';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} width={140} height={60} label={data.label || 'Mulai / Selesai'} textColor={text}>
      <rect x="2" y="2" width="136" height="56" rx="28" fill={bg} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </SvgShapeWrapper>
  );
});
TerminalSvgNode.displayName = 'TerminalSvgNode';

// 6. Hexagon / Persiapan (Preparation)
export const HexagonSvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#fdf2f8';
  const border = data.borderColor || '#db2777';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const text = data.textColor || '#831843';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} width={140} height={65} label={data.label || 'Persiapan / Loop'} textColor={text}>
      <polygon points="25,2 115,2 138,32.5 115,63 25,63 2,32.5" fill={bg} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </SvgShapeWrapper>
  );
});
HexagonSvgNode.displayName = 'HexagonSvgNode';

// 7. Parallelogram / Data Input-Output
export const ParallelogramSvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#fefce8';
  const border = data.borderColor || '#ca8a04';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const text = data.textColor || '#713f12';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} width={140} height={65} label={data.label || 'Input / Output Data'} textColor={text}>
      <polygon points="25,2 138,2 115,63 2,63" fill={bg} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </SvgShapeWrapper>
  );
});
ParallelogramSvgNode.displayName = 'ParallelogramSvgNode';

// 8. Cylinder / Database
export const DatabaseSvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#faf5ff';
  const border = data.borderColor || '#9333ea';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const text = data.textColor || '#581c87';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} width={120} height={80} label={data.label || 'Basis Data'} textColor={text}>
      <path
        d="M 2 15 C 2 5, 118 5, 118 15 L 118 65 C 118 75, 2 75, 2 65 Z"
        fill={bg}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
      />
      <ellipse cx="60" cy="15" rx="58" ry="10" fill={bg} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </SvgShapeWrapper>
  );
});
DatabaseSvgNode.displayName = 'DatabaseSvgNode';

// 9. Predefined Process / Sub-proses Garis Ganda
export const PredefinedSvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#ffffff';
  const border = data.borderColor || '#475569';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const text = data.textColor || '#0f172a';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} width={140} height={65} label={data.label || 'Sub-Proses'} textColor={text}>
      <rect x="2" y="2" width="136" height="61" rx="2" fill={bg} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
      <line x1="20" y1="2" x2="20" y2="63" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
      <line x1="120" y1="2" x2="120" y2="63" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </SvgShapeWrapper>
  );
});
PredefinedSvgNode.displayName = 'PredefinedSvgNode';

// 10. Delay / D-Shape
export const DelaySvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#f1f5f9';
  const border = data.borderColor || '#64748b';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const text = data.textColor || '#334155';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} width={130} height={65} label={data.label || 'Penundaan (Delay)'} textColor={text}>
      <path d="M 2 2 L 80 2 A 30 30 0 0 1 80 63 L 2 63 Z" fill={bg} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </SvgShapeWrapper>
  );
});
DelaySvgNode.displayName = 'DelaySvgNode';

// 11. Summing Junction (Lingkaran dengan Tanda Silang X)
export const SummingSvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#ffffff';
  const border = data.borderColor || '#0284c7';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const text = data.textColor || '#0369a1';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} width={65} height={65} label={data.label || ''} textColor={text}>
      <circle cx="32.5" cy="32.5" r="30" fill={bg} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
      <line x1="12" y1="12" x2="53" y2="53" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
      <line x1="12" y1="53" x2="53" y2="12" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </SvgShapeWrapper>
  );
});
SummingSvgNode.displayName = 'SummingSvgNode';

// 12. Or Junction (Lingkaran dengan Tanda Plus +)
export const OrSvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#ffffff';
  const border = data.borderColor || '#0284c7';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const text = data.textColor || '#0369a1';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} width={65} height={65} label={data.label || ''} textColor={text}>
      <circle cx="32.5" cy="32.5" r="30" fill={bg} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
      <line x1="32.5" y1="3" x2="32.5" y2="62" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
      <line x1="3" y1="32.5" x2="62" y2="32.5" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </SvgShapeWrapper>
  );
});
OrSvgNode.displayName = 'OrSvgNode';

// 13. On-Page Connector / Lingkaran Kecil
export const ConnectorSvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#ffffff';
  const border = data.borderColor || '#2563eb';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const text = data.textColor || '#1d4ed8';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} width={50} height={50} label={data.label || 'A'} textColor={text}>
      <circle cx="25" cy="25" r="23" fill={bg} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </SvgShapeWrapper>
  );
});
ConnectorSvgNode.displayName = 'ConnectorSvgNode';

// 14. Off-Page Connector / Pentagon Runcing Bawah
export const OffpageSvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#ffffff';
  const border = data.borderColor || '#2563eb';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const text = data.textColor || '#1d4ed8';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} width={70} height={70} label={data.label || 'Hal 2'} textColor={text}>
      <polygon points="2,2 68,2 68,45 35,68 2,45" fill={bg} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </SvgShapeWrapper>
  );
});
OffpageSvgNode.displayName = 'OffpageSvgNode';

// 15. Manual Input / Trapesium Miring Atas
export const ManualInputSvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#fffbeb';
  const border = data.borderColor || '#d97706';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const text = data.textColor || '#78350f';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} width={130} height={65} label={data.label || 'Input Manual'} textColor={text}>
      <polygon points="2,22 128,2 128,63 2,63" fill={bg} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </SvgShapeWrapper>
  );
});
ManualInputSvgNode.displayName = 'ManualInputSvgNode';

// 16. Manual Operation / Trapesium Terbalik
export const ManualOpSvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#fffbeb';
  const border = data.borderColor || '#d97706';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const text = data.textColor || '#78350f';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} width={130} height={65} label={data.label || 'Operasi Manual'} textColor={text}>
      <polygon points="2,2 128,2 105,63 25,63" fill={bg} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </SvgShapeWrapper>
  );
});
ManualOpSvgNode.displayName = 'ManualOpSvgNode';

// 17. Merge / Segitiga Terbalik
export const MergeSvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#eff6ff';
  const border = data.borderColor || '#3b82f6';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const text = data.textColor || '#1e3a8a';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} width={100} height={75} label={data.label || 'Gabung'} textColor={text}>
      <polygon points="2,2 98,2 50,73" fill={bg} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </SvgShapeWrapper>
  );
});
MergeSvgNode.displayName = 'MergeSvgNode';

// 18. Extract / Segitiga Tegak
export const ExtractSvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#eff6ff';
  const border = data.borderColor || '#3b82f6';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const text = data.textColor || '#1e3a8a';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} width={100} height={75} label={data.label || 'Ekstrak'} textColor={text}>
      <polygon points="50,2 98,73 2,73" fill={bg} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </SvgShapeWrapper>
  );
});
ExtractSvgNode.displayName = 'ExtractSvgNode';

// 19. Collate / Jam Pasir (Hourglass)
export const CollateSvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#f8fafc';
  const border = data.borderColor || '#64748b';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const text = data.textColor || '#334155';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} width={80} height={80} label={data.label || 'Sortir'} textColor={text}>
      <polygon points="2,2 78,2 2,78 78,78" fill={bg} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </SvgShapeWrapper>
  );
});
CollateSvgNode.displayName = 'CollateSvgNode';

// 20. Display / Layar
export const DisplaySvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#ecfdf5';
  const border = data.borderColor || '#059669';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const text = data.textColor || '#065f46';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} width={130} height={65} label={data.label || 'Tampilan Layar'} textColor={text}>
      <path d="M 20 2 L 105 2 Q 130 32.5 105 63 L 20 63 L 2 32.5 Z" fill={bg} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </SvgShapeWrapper>
  );
});
DisplaySvgNode.displayName = 'DisplaySvgNode';

// 21. Block Arrow / Panah Blok Tebal
export const BlockArrowSvgNode = memo((props: any) => {
  const { id, data, selected } = props;
  const bg = data.color || '#f0fdf4';
  const border = data.borderColor || '#16a34a';
  const { stroke, strokeWidth, strokeDasharray } = getSvgStrokeProps(data, 2, border);
  const text = data.textColor || '#14532d';

  return (
    <SvgShapeWrapper id={id} selected={selected} data={data} width={140} height={65} label={data.label || 'Arah Alur'} textColor={text}>
      <polygon points="2,18 90,18 90,2 138,32.5 90,63 90,47 2,47" fill={bg} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </SvgShapeWrapper>
  );
});
BlockArrowSvgNode.displayName = 'BlockArrowSvgNode';

// Export daftar node type lengkap
export const flowchartNodeTypes: any = {
  process: ProcessSvgNode,
  decision: DecisionSvgNode,
  document: DocumentSvgNode,
  oval: OvalSvgNode,
  terminal: TerminalSvgNode,
  hexagon: HexagonSvgNode,
  parallelogram: ParallelogramSvgNode,
  database: DatabaseSvgNode,
  predefined: PredefinedSvgNode,
  delay: DelaySvgNode,
  summing: SummingSvgNode,
  or_junction: OrSvgNode,
  connector: ConnectorSvgNode,
  offpage: OffpageSvgNode,
  manual_input: ManualInputSvgNode,
  manual_op: ManualOpSvgNode,
  merge: MergeSvgNode,
  extract: ExtractSvgNode,
  collate: CollateSvgNode,
  display: DisplaySvgNode,
  block_arrow: BlockArrowSvgNode,
};
