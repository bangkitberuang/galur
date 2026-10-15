'use client';

import React, { memo, useState } from 'react';
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
  CircleDot,
  Smile
} from 'lucide-react';
import { getNodeTextStyles, getNodeShapeStyles } from '@/lib/nodeStyles';
import { NodeIconDisplay } from './NodeIconDisplay';
import UniversalNodeResizer from './UniversalNodeResizer';

export interface CustomNodeData {
  label: string;
  sublabel?: string;
  color?: string;
  borderColor?: string;
  textColor?: string;
  icon?: string;
  emoji?: string;
  iconUrl?: string;
  iconColor?: string;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
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

// Inline Editable Label Helper untuk Semua Node (Double-Click pada Kanvas)
const InlineEditableLabel = ({
  id,
  label,
  sublabel,
  textStyles,
  isTextarea = false,
  className = '',
}: {
  id: string;
  label: string;
  sublabel?: string;
  textStyles?: React.CSSProperties;
  isTextarea?: boolean;
  className?: string;
}) => {
  const { setNodes } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [tempLabel, setTempLabel] = useState(label || '');

  const handleSave = () => {
    const trimmed = tempLabel.trim();
    if (trimmed.length > 0) {
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: trimmed } } : n))
      );
    }
    setIsEditing(false);
  };

  if (isEditing) {
    if (isTextarea) {
      return (
        <textarea
          autoFocus
          rows={3}
          value={tempLabel}
          onChange={(e) => setTempLabel(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsEditing(false);
          }}
          className="w-full px-1.5 py-1 text-xs border border-blue-500 rounded bg-white text-slate-900 focus:outline-hidden leading-relaxed shadow-xs"
        />
      );
    }
    return (
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
    );
  }

  return (
    <div
      onDoubleClick={(e) => {
        e.stopPropagation();
        setTempLabel(label || '');
        setIsEditing(true);
      }}
      title="Klik ganda untuk mengedit teks langsung"
      className={`cursor-text hover:bg-black/5 rounded px-1 py-0.5 transition-colors select-none ${className}`}
    >
      <div style={textStyles}>{label}</div>
      {sublabel && (
        <div className="text-xs opacity-75 mt-0.5" style={{ fontSize: '11px' }}>
          {sublabel}
        </div>
      )}
    </div>
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

// Helper Lencana Status Alur (✓ Disetujui / ✕ Ditolak)
export const NodeStatusBadge = ({ badge }: { badge?: string }) => {
  if (!badge) return null;
  if (badge === 'success') {
    return (
      <div 
        className="absolute -top-2.5 -right-2.5 z-30 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-md border-2 border-white ring-1 ring-emerald-600 pointer-events-none select-none"
        title="Status: Disetujui / Sukses (✓)"
      >
        ✓
      </div>
    );
  }
  if (badge === 'error' || badge === 'rejected') {
    return (
      <div 
        className="absolute -top-2.5 -right-2.5 z-30 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center font-black text-xs shadow-md border-2 border-white ring-1 ring-rose-600 pointer-events-none select-none"
        title="Status: Ditolak / Gagal (✕)"
      >
        ✕
      </div>
    );
  }
  return null;
};

// 1. Process Node (Kotak Proses Standar)
export const ProcessNode = memo((props: any) => {
  const { id, data, selected } = props;
  const text = data.textColor || '#0f172a';
  const hasIcon = (data.icon && data.icon !== 'none') || Boolean(data.emoji) || Boolean(data.iconUrl);

  return (
    <div
      className="relative px-4 py-3 rounded-lg shadow-sm border-2 min-w-[120px] min-h-[44px] text-center transition-all flex flex-col items-center justify-center w-full h-full"
      style={{ ...getNodeShapeStyles(data, '#ffffff', '#3b82f6'), color: text }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={90} minHeight={40} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <NodeStatusBadge badge={data?.statusBadge} />
      {hasIcon && (
        <NodeIconDisplay
          icon={data.icon}
          emoji={data.emoji}
          iconUrl={data.iconUrl}
          color={data.iconColor}
          size={data.iconSize || 'md'}
          defaultColor={data.borderColor || '#3b82f6'}
          className="mb-1"
        />
      )}
      <InlineEditableLabel
        id={id}
        label={data.label || 'Proses'}
        sublabel={data.sublabel}
        textStyles={getNodeTextStyles(data, 14, text)}
      />
    </div>
  );
});
ProcessNode.displayName = 'ProcessNode';

// 2. Decision Node (Belah Ketupat / Diamond Keputusan)
export const DecisionNode = memo((props: any) => {
  const { id, data, selected } = props;
  const text = data.textColor || '#1e3a8a';
  const hasIcon = (data.icon && data.icon !== 'none') || Boolean(data.emoji) || Boolean(data.iconUrl);
  const width = data?.width ? Number(data.width) : 112;
  const height = data?.height ? Number(data.height) : 112;

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ width, height }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={60} minHeight={60} keepAspectRatio={true} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <NodeStatusBadge badge={data?.statusBadge} />
      <div
        className="absolute inset-0 rotate-45 rounded-md border-2 shadow-sm transition-all"
        style={getNodeShapeStyles(data, '#eff6ff', '#2563eb')}
      />
      <div className="relative z-10 px-2 text-center text-xs font-semibold select-none max-w-[85%] break-words flex flex-col items-center justify-center">
        {hasIcon && (
          <NodeIconDisplay
            icon={data.icon}
            emoji={data.emoji}
            iconUrl={data.iconUrl}
            color={data.iconColor}
            size={data.iconSize || 'sm'}
            defaultColor={text}
            className="mb-0.5"
          />
        )}
        <InlineEditableLabel
          id={id}
          label={data.label || 'Keputusan?'}
          textStyles={{ ...getNodeTextStyles(data, 12), color: text }}
        />
      </div>
    </div>
  );
});
DecisionNode.displayName = 'DecisionNode';

// 3. Terminal Node (Mulai / Selesai - Kapsul Bulat)
export const TerminalNode = memo((props: any) => {
  const { id, data, selected } = props;
  const text = data.textColor || '#065f46';

  return (
    <div
      className="relative px-6 py-2.5 rounded-full shadow-sm border-2 min-w-[100px] min-h-[36px] text-center transition-all flex items-center justify-center gap-1.5 w-full h-full"
      style={{ ...getNodeShapeStyles(data, '#ecfdf5', '#10b981'), color: text }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={80} minHeight={34} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <NodeStatusBadge badge={data?.statusBadge} />
      <NodeIconDisplay
        icon={data.icon}
        emoji={data.emoji}
        iconUrl={data.iconUrl}
        color={data.iconColor}
        size={data.iconSize || 'sm'}
        defaultIcon="playcircle"
        defaultColor={text}
        className="opacity-80 shrink-0"
      />
      <InlineEditableLabel
        id={id}
        label={data.label || 'Mulai / Selesai'}
        textStyles={getNodeTextStyles(data, 13, text)}
      />
    </div>
  );
});
TerminalNode.displayName = 'TerminalNode';

// 4. Parallelogram Node (Data / Input-Output Jajar Genjang)
export const ParallelogramNode = memo((props: any) => {
  const { id, data, selected } = props;
  const text = data.textColor || '#713f12';
  const width = data?.width ? Number(data.width) : 140;
  const height = data?.height ? Number(data.height) : 48;

  return (
    <div className="relative flex items-center justify-center" style={{ width, height }}>
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={80} minHeight={36} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <NodeStatusBadge badge={data?.statusBadge} />
      <div
        className="absolute inset-0 -skew-x-12 rounded-md border-2 shadow-sm transition-all"
        style={getNodeShapeStyles(data, '#fefce8', '#ca8a04')}
      />
      <div className="relative z-10 px-4 text-center text-xs font-semibold select-none flex items-center justify-center gap-1.5">
        {(data.icon || data.emoji || data.iconUrl) && (
          <NodeIconDisplay
            icon={data.icon}
            emoji={data.emoji}
            iconUrl={data.iconUrl}
            color={data.iconColor}
            size={data.iconSize || 'sm'}
            defaultColor={text}
          />
        )}
        <InlineEditableLabel
          id={id}
          label={data.label || 'Input / Output'}
          textStyles={{ ...getNodeTextStyles(data, 12), color: text }}
        />
      </div>
    </div>
  );
});
ParallelogramNode.displayName = 'ParallelogramNode';

// 5. Document Node (Dokumen dengan lekukan bawah bergelombang)
export const DocumentNode = memo((props: any) => {
  const { id, data, selected } = props;
  const text = data.textColor || '#0369a1';

  return (
    <div
      className="relative px-4 pt-3 pb-4 rounded-t-lg rounded-b-[18px] shadow-sm border-2 min-w-[120px] min-h-[50px] text-center transition-all border-b-4 flex flex-col items-center justify-center w-full h-full"
      style={{ ...getNodeShapeStyles(data, '#ffffff', '#0284c7'), color: text }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={80} minHeight={40} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <NodeStatusBadge badge={data?.statusBadge} />
      <NodeIconDisplay
        icon={data.icon}
        emoji={data.emoji}
        iconUrl={data.iconUrl}
        color={data.iconColor}
        size={data.iconSize || 'sm'}
        defaultIcon="filetext"
        defaultColor={text}
        className="opacity-80 shrink-0 mb-0.5"
      />
      <InlineEditableLabel
        id={id}
        label={data.label || 'Dokumen Laporan'}
        textStyles={getNodeTextStyles(data, 12, text)}
      />
    </div>
  );
});
DocumentNode.displayName = 'DocumentNode';

// 6. Predefined Process Node (Sub-proses dengan garis ganda kiri kanan)
export const PredefinedNode = memo((props: any) => {
  const { id, data, selected } = props;
  const border = data.borderColor || '#475569';
  const text = data.textColor || '#0f172a';

  return (
    <div
      className="relative px-6 py-3 rounded-md shadow-sm border-2 min-w-[130px] min-h-[44px] text-center transition-all w-full h-full"
      style={{ ...getNodeShapeStyles(data, '#ffffff', '#475569'), color: text }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={100} minHeight={40} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      {/* Garis Ganda Kiri & Kanan */}
      <div className="absolute left-2.5 top-0 bottom-0 w-[1.5px]" style={{ backgroundColor: border }} />
      <div className="absolute right-2.5 top-0 bottom-0 w-[1.5px]" style={{ backgroundColor: border }} />
      <InlineEditableLabel
        id={id}
        label={data.label || 'Sub-Proses Khusus'}
        textStyles={getNodeTextStyles(data, 12, text)}
      />
    </div>
  );
});
PredefinedNode.displayName = 'PredefinedNode';

// 7. Hexagon Node (Persiapan / Preparation Segi Enam)
export const HexagonNode = memo((props: any) => {
  const { id, data, selected } = props;
  const text = data.textColor || '#831843';

  return (
    <div
      className="relative px-5 py-2.5 rounded-lg shadow-sm border-2 min-w-[110px] min-h-[40px] text-center transition-all w-full h-full"
      style={{ ...getNodeShapeStyles(data, '#fdf2f8', '#db2777'), color: text }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={90} minHeight={36} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <InlineEditableLabel
        id={id}
        label={data.label || 'Persiapan / Loop'}
        textStyles={getNodeTextStyles(data, 12, text)}
      />
    </div>
  );
});
HexagonNode.displayName = 'HexagonNode';

// 8. Connector Circle Node (Konektor Lingkaran On-Page)
export const ConnectorNode = memo((props: any) => {
  const { id, data, selected } = props;
  const text = data.textColor || '#1d4ed8';
  const size = data?.width ? Number(data.width) : (data?.height ? Number(data.height) : 40);

  return (
    <div
      className="relative rounded-full shadow-sm border-2 flex items-center justify-center transition-all"
      style={{ ...getNodeShapeStyles(data, '#ffffff', '#3b82f6'), color: text, width: size, height: size }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={24} minHeight={24} keepAspectRatio={true} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <InlineEditableLabel
        id={id}
        label={data.label || 'A'}
        textStyles={getNodeTextStyles(data, 12, text)}
      />
    </div>
  );
});
ConnectorNode.displayName = 'ConnectorNode';

// 9. Database Node (Silinder Basis Data)
export const DatabaseNode = memo((props: any) => {
  const { id, data, selected } = props;
  const text = data.textColor || '#581c87';

  return (
    <div
      className="relative px-4 py-3 rounded-lg shadow-sm border-2 min-w-[110px] min-h-[60px] text-center transition-all flex flex-col items-center justify-center w-full h-full"
      style={{ ...getNodeShapeStyles(data, '#faf5ff', '#9333ea'), color: text }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={80} minHeight={50} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <NodeIconDisplay
        icon={data.icon}
        emoji={data.emoji}
        iconUrl={data.iconUrl}
        color={data.iconColor}
        size={data.iconSize || 'md'}
        defaultIcon="database"
        defaultColor="#9333ea"
        className="mb-1"
      />
      <InlineEditableLabel
        id={id}
        label={data.label || 'Database'}
        sublabel={data.sublabel}
        textStyles={getNodeTextStyles(data, 14, text)}
      />
    </div>
  );
});
DatabaseNode.displayName = 'DatabaseNode';

// 10. Cloud / Network Node (Layanan Cloud)
export const CloudNode = memo((props: any) => {
  const { id, data, selected } = props;
  const text = data.textColor || '#14532d';

  return (
    <div
      className="relative px-5 py-3 rounded-2xl shadow-sm border-2 min-w-[120px] min-h-[60px] text-center transition-all flex flex-col items-center justify-center w-full h-full"
      style={{ ...getNodeShapeStyles(data, '#f0fdf4', '#22c55e'), color: text }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={90} minHeight={50} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <NodeIconDisplay
        icon={data.icon}
        emoji={data.emoji}
        iconUrl={data.iconUrl}
        color={data.iconColor}
        size={data.iconSize || 'md'}
        defaultIcon="cloud"
        defaultColor="#22c55e"
        className="mb-1"
      />
      <InlineEditableLabel
        id={id}
        label={data.label || 'Cloud / Service'}
        sublabel={data.sublabel}
        textStyles={getNodeTextStyles(data, 14, text)}
      />
    </div>
  );
});
CloudNode.displayName = 'CloudNode';

// 11. Mind Map Node (Modern Branching Node)
export const MindMapNode = memo((props: any) => {
  const { id, data, selected } = props;
  const { getNode, getEdges, setNodes, setEdges } = useReactFlow();

  const isRoot = data.isRoot;
  const defaultBg = isRoot ? '#1e293b' : '#ffffff';
  const defaultBorder = isRoot ? '#0f172a' : '#3b82f6';
  const defaultText = isRoot ? '#ffffff' : '#0f172a';

  const shapeStyles = getNodeShapeStyles(data, defaultBg, defaultBorder);
  const textStyles = getNodeTextStyles(data, isRoot ? 15 : 13, defaultText);

  const handleAddChild = (e: React.MouseEvent, direction: 'right' | 'left' = 'right') => {
    e.stopPropagation();
    const parent = getNode(id);
    if (!parent) return;

    const edges = getEdges();
    const isRight = direction === 'right';
    const childEdges = edges.filter(
      (edge) =>
        edge.source === id &&
        (isRight ? edge.sourceHandle !== 'l-out' : edge.sourceHandle === 'l-out')
    );
    const childCount = childEdges.length;
    const newId = `mindmap-${Date.now()}`;
    const offsetX = isRight ? 240 : -240;
    // Jarak vertikal teratur agar rapi
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
      sourceHandle: isRight ? 'r-out' : 'l-out',
      targetHandle: isRight ? 'l-out' : 'r-out',
      type: 'default',
      reconnectable: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
      style: { stroke: '#3b82f6', strokeWidth: 2 },
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
  };

  return (
    <div className="group relative w-full h-full">
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={100} minHeight={38} />
      <NodeQuickActions id={id} selected={selected} />
      <div
        className={`w-full h-full px-4 py-2.5 rounded-xl shadow-sm border-2 min-w-[120px] text-center transition-all flex flex-col items-center justify-center ${
          isRoot ? 'shadow-md' : ''
        }`}
        style={{ ...shapeStyles, ...textStyles }}
      >
        <StandardHandles />
        {(data.icon || data.emoji || data.iconUrl) && (
          <NodeIconDisplay
            icon={data.icon}
            emoji={data.emoji}
            iconUrl={data.iconUrl}
            color={data.iconColor}
            size={data.iconSize || 'sm'}
            defaultColor={defaultText}
            className="mb-1"
          />
        )}
        <InlineEditableLabel
          id={id}
          label={data.label || (isRoot ? 'Topik Utama' : 'Sub Ide')}
          textStyles={textStyles}
        />
      </div>

      {/* Tombol Tambah Cabang Kanan (+) */}
      <button
        type="button"
        onClick={(e) => handleAddChild(e, 'right')}
        title="Tambah Cabang Ide ke Kanan"
        className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer no-print hover:scale-110"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      {/* Tombol Tambah Cabang Kiri (+) */}
      <button
        type="button"
        onClick={(e) => handleAddChild(e, 'left')}
        title="Tambah Cabang Ide ke Kiri"
        className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer no-print hover:scale-110"
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
  const shapeStyles = getNodeShapeStyles(data, '#fef08a', '#facc15');
  const textStyles = getNodeTextStyles(data, 12, '#713f12');

  return (
    <div
      className="relative p-3 rounded-md shadow-md border min-w-[100px] min-h-[80px] w-full h-full transition-all"
      style={{ ...shapeStyles, ...textStyles }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={90} minHeight={60} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <div className="flex items-center gap-1 mb-1 font-semibold opacity-70">
        <StickyNote className="w-3 h-3" />
        <span>Catatan</span>
      </div>
      <InlineEditableLabel
        id={id}
        isTextarea={true}
        label={data.label || 'Tulis catatan ide di sini...'}
        textStyles={{ ...textStyles, whiteSpace: 'pre-wrap' }}
      />
    </div>
  );
});
StickyNoteNode.displayName = 'StickyNoteNode';

// 13. Text Node (Teks Melayang Bebas)
export const TextNode = memo((props: any) => {
  const { id, data, selected } = props;
  const textStyles = getNodeTextStyles(data, 14, '#0f172a');
  const shapeStyles = getNodeShapeStyles(data, 'transparent', 'transparent');

  return (
    <div
      className="relative px-2 py-1 rounded min-w-[30px] transition-all select-none w-full h-full"
      style={{
        ...shapeStyles,
        ...textStyles,
      }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={40} minHeight={24} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />
      <InlineEditableLabel
        id={id}
        label={data.label || 'Teks'}
        textStyles={textStyles}
      />
    </div>
  );
});
TextNode.displayName = 'TextNode';

import {
  flowchartNodeTypes,
  HexagonSvgNode,
  DatabaseSvgNode,
  ExtractSvgNode,
  MergeSvgNode,
} from './FlowchartShapes';
import { specialistNodeTypes } from './SpecialistNodes';

export const nodeTypes: any = {
  ...flowchartNodeTypes,
  ...specialistNodeTypes,
  process: ProcessNode,
  decision: DecisionNode,
  terminal: TerminalNode,
  parallelogram: ParallelogramNode,
  document: DocumentNode,
  predefined: PredefinedNode,
  hexagon: HexagonSvgNode,
  connector: ConnectorNode,
  database: DatabaseSvgNode,
  cylinder: DatabaseSvgNode,
  merge: MergeSvgNode,
  extract: ExtractSvgNode,
  triangle: ExtractSvgNode,
  triangle_up: ExtractSvgNode,
  triangle_down: MergeSvgNode,
  circle: ConnectorNode,
  diamond: DecisionNode,
  cloud: CloudNode,
  mindmap: MindMapNode,
  stickynote: StickyNoteNode,
  text: TextNode,
};
