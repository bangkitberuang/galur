'use client';

import React, { memo, useState } from 'react';
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
  ChevronRight,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  CheckCircle2,
  Activity,
  Plus
} from 'lucide-react';
import { getNodeTextStyles, getNodeShapeStyles } from '@/lib/nodeStyles';
import UniversalNodeResizer from './UniversalNodeResizer';

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
    {/* 1. Kanan - Tengah (Primary Right) */}
    <Handle
      type="target"
      position={Position.Right}
      id="r-in"
      title="Titik Masuk Kanan"
      className="!bg-[#059669] hover:!bg-[#f59e0b] !w-2.5 !h-2.5 transition-all"
      style={{ top: '50%', zIndex: 1 }}
    />
    <Handle
      type="source"
      position={Position.Right}
      id="r-out"
      title="Titik Hubung Kanan"
      className="!bg-[#059669] hover:!bg-[#f59e0b] !w-2.5 !h-2.5 transition-all cursor-crosshair"
      style={{ top: '50%', zIndex: 10 }}
    />

    {/* 2. Kiri - Tengah (Primary Left) */}
    <Handle
      type="target"
      position={Position.Left}
      id="l-in"
      title="Titik Masuk Kiri"
      className="!bg-[#059669] hover:!bg-[#f59e0b] !w-2.5 !h-2.5 transition-all"
      style={{ top: '50%', zIndex: 1 }}
    />
    <Handle
      type="source"
      position={Position.Left}
      id="l-out"
      title="Titik Hubung Kiri"
      className="!bg-[#059669] hover:!bg-[#f59e0b] !w-2.5 !h-2.5 transition-all cursor-crosshair"
      style={{ top: '50%', zIndex: 10 }}
    />

    {/* 3. Atas - Tengah (Primary Top) */}
    <Handle
      type="target"
      position={Position.Top}
      id="t-in"
      title="Titik Masuk Atas"
      className="!bg-[#059669] hover:!bg-[#f59e0b] !w-2.5 !h-2.5 transition-all"
      style={{ left: '50%', zIndex: 1 }}
    />
    <Handle
      type="source"
      position={Position.Top}
      id="t-out"
      title="Titik Hubung Atas"
      className="!bg-[#059669] hover:!bg-[#f59e0b] !w-2.5 !h-2.5 transition-all cursor-crosshair"
      style={{ left: '50%', zIndex: 10 }}
    />

    {/* 4. Bawah - Tengah (Primary Bottom) */}
    <Handle
      type="target"
      position={Position.Bottom}
      id="b-in"
      title="Titik Masuk Bawah"
      className="!bg-[#059669] hover:!bg-[#f59e0b] !w-2.5 !h-2.5 transition-all"
      style={{ left: '50%', zIndex: 1 }}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="b-out"
      title="Titik Hubung Bawah"
      className="!bg-[#059669] hover:!bg-[#f59e0b] !w-2.5 !h-2.5 transition-all cursor-crosshair"
      style={{ left: '50%', zIndex: 10 }}
    />

    {/* 5. Sudut-Sudut (Corners) */}
    <Handle
      type="source"
      position={Position.Top}
      id="top-left"
      title="Titik Hubung Atas Kiri"
      className="!bg-[#059669] hover:!bg-[#f59e0b] !w-2.5 !h-2.5 cursor-crosshair"
      style={{ left: '18%', zIndex: 10 }}
    />
    <Handle
      type="source"
      position={Position.Top}
      id="top-right"
      title="Titik Hubung Atas Kanan"
      className="!bg-[#059669] hover:!bg-[#f59e0b] !w-2.5 !h-2.5 cursor-crosshair"
      style={{ left: '82%', zIndex: 10 }}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="bottom-left"
      title="Titik Hubung Bawah Kiri"
      className="!bg-[#059669] hover:!bg-[#f59e0b] !w-2.5 !h-2.5 cursor-crosshair"
      style={{ left: '18%', zIndex: 10 }}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="bottom-right"
      title="Titik Hubung Bawah Kanan"
      className="!bg-[#059669] hover:!bg-[#f59e0b] !w-2.5 !h-2.5 cursor-crosshair"
      style={{ left: '82%', zIndex: 10 }}
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

  const baseFontSize = typeof data.fontSize === 'number'
    ? data.fontSize
    : (data.fontSize ? parseInt(data.fontSize, 10) || 12 : 12);
  const textStyles = getNodeTextStyles(data, baseFontSize);
  const shapeStyles = getNodeShapeStyles(data, '#ffffff', borderColor);

  return (
    <div
      className={`bg-white rounded-xl shadow-md border overflow-hidden min-w-[200px] transition-all w-full h-full ${
        selected ? 'ring-2 ring-blue-500 shadow-xl' : ''
      }`}
      style={{
        ...shapeStyles,
        borderColor,
        fontFamily: textStyles.fontFamily || 'monospace',
      }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={160} minHeight={100} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />

      {/* Header */}
      <div className="p-2.5 text-center text-white font-bold" style={{ backgroundColor: headerBg }}>
        <div
          className="opacity-80 uppercase tracking-widest leading-tight"
          style={{ fontSize: `${Math.max(9, Math.round(baseFontSize * 0.8))}px` }}
        >
          {stereotype}
        </div>
        <div
          className="font-sans font-extrabold leading-tight mt-0.5"
          style={{
            fontSize: `${Math.max(12, Math.round(baseFontSize * 1.15))}px`,
            fontWeight: textStyles.fontWeight || 800,
            fontStyle: textStyles.fontStyle,
            textDecoration: textStyles.textDecoration,
          }}
        >
          {className}
        </div>
      </div>

      {/* Atribut */}
      <div
        className="p-2 border-b border-slate-200 bg-slate-50/50 space-y-0.5 text-slate-700"
        style={{
          fontSize: `${baseFontSize}px`,
          color: data.textColor || undefined,
          fontStyle: textStyles.fontStyle,
        }}
      >
        {attributes.map((attr, idx) => (
          <div key={idx} className="truncate">{attr}</div>
        ))}
      </div>

      {/* Metode */}
      <div
        className="p-2 bg-white space-y-0.5 text-slate-800"
        style={{
          fontSize: `${baseFontSize}px`,
          color: data.textColor || undefined,
          fontStyle: textStyles.fontStyle,
        }}
      >
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

  const baseFontSize = typeof data.fontSize === 'number'
    ? data.fontSize
    : (data.fontSize ? parseInt(data.fontSize, 10) || 12 : 12);
  const textStyles = getNodeTextStyles(data, baseFontSize);
  const shapeStyles = getNodeShapeStyles(data, '#ffffff', '#cbd5e1');

  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden min-w-[200px] transition-all ${
        selected ? 'ring-2 ring-emerald-500 shadow-lg' : ''
      }`}
      style={{
        ...shapeStyles,
        fontFamily: textStyles.fontFamily || 'monospace',
        width: props.width || data.width ? `${props.width || data.width}px` : undefined,
        height: props.height || data.height ? `${props.height || data.height}px` : undefined,
      }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={180} minHeight={100} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />

      {/* Table Header */}
      <div className="p-2.5 text-white flex items-center justify-between font-sans font-bold" style={{ backgroundColor: headerBg }}>
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-amber-300" />
          <span
            className="font-extrabold"
            style={{
              fontSize: `${Math.max(12, Math.round(baseFontSize * 1.15))}px`,
              fontWeight: textStyles.fontWeight || 800,
              fontStyle: textStyles.fontStyle,
              textDecoration: textStyles.textDecoration,
            }}
          >
            {tableName}
          </span>
        </div>
        <span
          className="font-normal px-1.5 py-0.2 rounded bg-white/20 text-white"
          style={{ fontSize: `${Math.max(9, Math.round(baseFontSize * 0.8))}px` }}
        >
          Entity
        </span>
      </div>

      {/* Field Rows */}
      <div className="divide-y divide-slate-100">
        {fields.map((f: any, idx: number) => (
          <div
            key={idx}
            className="px-3 py-1.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
            style={{ fontSize: `${baseFontSize}px` }}
          >
            <div
              className="flex items-center gap-1.5 font-medium text-slate-800 truncate"
              style={{
                fontFamily: textStyles.fontFamily,
                fontWeight: textStyles.fontWeight,
                fontStyle: textStyles.fontStyle,
                color: data.textColor || undefined,
              }}
            >
              {f.isPK && (
                <span
                  className="font-bold px-1 rounded bg-amber-100 text-amber-800 border border-amber-300"
                  style={{ fontSize: `${Math.max(9, Math.round(baseFontSize * 0.75))}px` }}
                >
                  PK
                </span>
              )}
              {f.isFK && (
                <span
                  className="font-bold px-1 rounded bg-blue-100 text-blue-800 border border-blue-300"
                  style={{ fontSize: `${Math.max(9, Math.round(baseFontSize * 0.75))}px` }}
                >
                  FK
                </span>
              )}
              <span>{f.name}</span>
            </div>
            <span
              className="text-slate-400 uppercase font-mono ml-3"
              style={{ fontSize: `${Math.max(9, Math.round(baseFontSize * 0.85))}px` }}
            >
              {f.type}
            </span>
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
  const { setNodes } = useReactFlow();

  const name = data.name ?? data.label ?? 'Nama Pejabat';
  const role = data.role ?? data.sublabel ?? 'Jabatan / Posisi';
  const dept = data.dept ?? 'Departemen';
  const avatarBg = data.avatarBg || '#0b4632';
  const badgeColor = data.badgeColor || '#059669';

  const [editingField, setEditingField] = useState<'name' | 'role' | 'dept' | null>(null);
  const [tempValue, setTempValue] = useState('');

  const baseFontSize = typeof data.fontSize === 'number'
    ? data.fontSize
    : (data.fontSize ? parseInt(data.fontSize, 10) || 12 : 12);
  const shapeStyles = getNodeShapeStyles(data, '#ffffff', '#e2e8f0');
  const textStyles = getNodeTextStyles(data, baseFontSize, data.textColor || '#0f172a');

  const initials = String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s: string) => s[0] || '')
    .join('')
    .toUpperCase();

  const handleStartEdit = (field: 'name' | 'role' | 'dept', currentVal: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingField(field);
    setTempValue(currentVal);
  };

  const handleSaveEdit = (field: 'name' | 'role' | 'dept') => {
    const val = tempValue.trim();
    if (val.length > 0) {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === id) {
            const updates: any = {};
            if (field === 'name') {
              updates.name = val;
              updates.label = val;
            } else if (field === 'role') {
              updates.role = val;
              updates.sublabel = val;
            } else if (field === 'dept') {
              updates.dept = val;
            }
            return {
              ...n,
              data: {
                ...n.data,
                ...updates,
              },
            };
          }
          return n;
        })
      );
    }
    setEditingField(null);
  };

  return (
    <div
      className={`rounded-2xl shadow-md border p-3 min-w-[190px] text-left transition-all ${
        selected ? 'ring-2 ring-emerald-500 shadow-xl' : ''
      }`}
      style={{
        ...shapeStyles,
        fontFamily: textStyles.fontFamily,
        width: props.width || data.width ? `${props.width || data.width}px` : undefined,
        height: props.height || data.height ? `${props.height || data.height}px` : undefined,
      }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={180} minHeight={70} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />

      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0 select-none"
          style={{ backgroundColor: avatarBg }}
        >
          {initials || <User className="w-4 h-4" />}
        </div>
        <div className="min-w-0 flex-1">
          {editingField === 'name' ? (
            <input
              autoFocus
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={() => handleSaveEdit('name')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit('name');
                if (e.key === 'Escape') setEditingField(null);
              }}
              className="w-full px-1.5 py-0.5 border border-emerald-500 rounded bg-white font-bold text-slate-900 focus:outline-hidden"
              style={{ fontSize: `${Math.max(12, Math.round(baseFontSize * 1.15))}px`, fontFamily: textStyles.fontFamily }}
            />
          ) : (
            <h4
              onDoubleClick={(e) => handleStartEdit('name', name, e)}
              title="Klik ganda untuk mengedit nama"
              className="font-bold truncate cursor-text hover:bg-slate-100/80 px-1 py-0.5 -mx-1 rounded transition-colors"
              style={{
                fontSize: `${Math.max(12, Math.round(baseFontSize * 1.15))}px`,
                fontFamily: textStyles.fontFamily,
                fontWeight: textStyles.fontWeight || 700,
                fontStyle: textStyles.fontStyle,
                textDecoration: textStyles.textDecoration,
                color: textStyles.color,
                textAlign: textStyles.textAlign,
                textTransform: textStyles.textTransform,
              }}
            >
              {name}
            </h4>
          )}

          {editingField === 'role' ? (
            <input
              autoFocus
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={() => handleSaveEdit('role')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit('role');
                if (e.key === 'Escape') setEditingField(null);
              }}
              className="w-full px-1.5 py-0.5 border border-emerald-500 rounded bg-white font-semibold text-slate-700 focus:outline-hidden mt-0.5"
              style={{ fontSize: `${baseFontSize}px`, fontFamily: textStyles.fontFamily }}
            />
          ) : (
            <p
              onDoubleClick={(e) => handleStartEdit('role', role, e)}
              title="Klik ganda untuk mengedit jabatan"
              className="font-semibold text-slate-600 truncate cursor-text hover:bg-slate-100/80 px-1 py-0.5 -mx-1 rounded transition-colors"
              style={{
                fontSize: `${baseFontSize}px`,
                fontFamily: textStyles.fontFamily,
                fontStyle: textStyles.fontStyle,
                textAlign: textStyles.textAlign,
                color: data.textColor ? `${data.textColor}cc` : undefined,
              }}
            >
              {role}
            </p>
          )}
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
        {editingField === 'dept' ? (
          <input
            autoFocus
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={() => handleSaveEdit('dept')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveEdit('dept');
              if (e.key === 'Escape') setEditingField(null);
            }}
            className="w-full px-1.5 py-0.5 border border-emerald-500 rounded bg-white font-bold text-slate-800 focus:outline-hidden"
            style={{ fontSize: `${Math.max(9, Math.round(baseFontSize * 0.85))}px`, fontFamily: textStyles.fontFamily }}
          />
        ) : (
          <span
            onDoubleClick={(e) => handleStartEdit('dept', dept, e)}
            title="Klik ganda untuk mengedit departemen"
            className="font-bold px-2 py-0.5 rounded-full text-white truncate max-w-[200px] cursor-text hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: badgeColor,
              fontSize: `${Math.max(9, Math.round(baseFontSize * 0.85))}px`,
              fontFamily: textStyles.fontFamily,
            }}
          >
            {dept}
          </span>
        )}
      </div>
    </div>
  );
});
OrgNode.displayName = 'OrgNode';

// 4. SWOT QUADRANT CARD NODE (Matriks 4 Kuadran dengan Watermark Huruf S / W / O / T)
export const SWOTCardNode = memo((props: any) => {
  const { id, data, selected } = props;
  const { setNodes } = useReactFlow();
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

  const baseFontSize = typeof data.fontSize === 'number'
    ? data.fontSize
    : (data.fontSize ? parseInt(data.fontSize, 10) || 12 : 12);
  const titleFontSize = Math.max(14, Math.round(baseFontSize * 1.35));

  const textStyles = getNodeTextStyles(data, baseFontSize, text);
  const shapeStyles = getNodeShapeStyles(data, bg, border);

  const [editingTitle, setEditingTitle] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempText, setTempText] = useState('');

  const handleStartEditTitle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingIndex(null);
    setEditingTitle(true);
    setTempText(title);
  };

  const handleSaveTitle = () => {
    const val = tempText.trim();
    if (val.length > 0) {
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, title: val, label: val } } : n))
      );
    }
    setEditingTitle(false);
  };

  const handleStartEditItem = (idx: number, currentVal: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTitle(false);
    setEditingIndex(idx);
    setTempText(currentVal);
  };

  const handleSaveItem = (idx: number) => {
    const val = tempText.trim();
    if (val.length > 0) {
      const newItems = [...items];
      newItems[idx] = val;
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, items: newItems } } : n))
      );
    }
    setEditingIndex(null);
  };

  return (
    <div
      className={`relative rounded-xl shadow-md border p-5 min-w-[240px] min-h-[240px] flex flex-col justify-start transition-all overflow-hidden select-none ${
        selected ? 'ring-3 ring-emerald-700 shadow-xl scale-101' : ''
      }`}
      style={{
        ...shapeStyles,
        backgroundColor: bg,
        borderColor: border,
        fontFamily: textStyles.fontFamily,
        width: props.width || data.width ? `${props.width || data.width}px` : undefined,
        height: props.height || data.height ? `${props.height || data.height}px` : undefined,
      }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={220} minHeight={200} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />

      {/* Giant Background Watermark Letter (S / W / O / T) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none font-black font-sans leading-none z-0"
        style={{ fontSize: '210px', color: watermark }}
        aria-hidden="true"
      >
        {swotType}
      </div>

      {/* Judul Kuadran (Tengah) */}
      <div className="relative z-10 text-center mb-3">
        {editingTitle ? (
          <input
            autoFocus
            type="text"
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveTitle();
              if (e.key === 'Escape') setEditingTitle(false);
            }}
            className="w-full px-2 py-0.5 border border-emerald-500 rounded bg-white font-bold text-center text-slate-900 focus:outline-hidden"
            style={{ fontSize: `${titleFontSize}px`, fontFamily: textStyles.fontFamily }}
          />
        ) : (
          <h3
            onDoubleClick={handleStartEditTitle}
            title="Klik ganda untuk mengedit judul"
            className="font-bold lowercase tracking-tight drop-shadow-2xs cursor-text hover:bg-black/5 px-1 py-0.5 rounded transition-colors inline-block"
            style={{
              fontSize: `${titleFontSize}px`,
              fontFamily: textStyles.fontFamily,
              fontWeight: textStyles.fontWeight || 800,
              fontStyle: textStyles.fontStyle,
              textDecoration: textStyles.textDecoration,
              textAlign: textStyles.textAlign || 'center',
              color: textStyles.color,
              textTransform: textStyles.textTransform,
            }}
          >
            {title}
          </h3>
        )}
      </div>

      {/* Daftar Poin Analisis (Bullet Points) */}
      <ul className="relative z-10 space-y-2 leading-relaxed" style={{ color: textStyles.color }}>
        {items.map((item, idx) => {
          const isItemEditing = editingIndex === idx;
          return isItemEditing ? (
            <textarea
              key={idx}
              autoFocus
              rows={2}
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              onBlur={() => handleSaveItem(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveItem(idx);
                }
                if (e.key === 'Escape') setEditingIndex(null);
              }}
              className="w-full p-1.5 rounded-lg border border-emerald-500 bg-white text-slate-800 focus:outline-hidden shadow-xs leading-snug"
              style={{ fontSize: `${baseFontSize}px`, fontFamily: textStyles.fontFamily }}
            />
          ) : (
            <li
              key={idx}
              onDoubleClick={(e) => handleStartEditItem(idx, item, e)}
              title="Klik ganda untuk mengedit poin analisis"
              className="flex items-start gap-2 cursor-text hover:bg-black/5 rounded px-1 py-0.5 transition-colors"
              style={{
                fontSize: `${baseFontSize}px`,
                fontFamily: textStyles.fontFamily,
                fontWeight: textStyles.fontWeight,
                fontStyle: textStyles.fontStyle,
                textDecoration: textStyles.textDecoration,
                textAlign: textStyles.textAlign,
                color: textStyles.color,
                lineHeight: textStyles.lineHeight,
              }}
            >
              <span
                className="font-black leading-none mt-0.5 shrink-0"
                style={{ fontSize: `${Math.max(12, baseFontSize)}px` }}
              >
                •
              </span>
              <span className="leading-snug flex-1 break-words">{item}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
SWOTCardNode.displayName = 'SWOTCardNode';

// 5. FISHBONE HEAD NODE (Kepala Ikan - Akibat / Masalah Utama Ishikawa)
export const FishboneHeadNode = memo((props: any) => {
  const { id, data, selected } = props;
  const { setNodes } = useReactFlow();
  const problem = data.label || data.problem || 'Akibat / Masalah Utama';
  const subtitle = data.subtitle || data.metric || 'Definisikan masalah yang ingin dipecahkan';
  const color = data.color || '#fff1f2';
  const borderColor = data.borderColor || '#e11d48';
  const headerColor = data.headerColor || '#be123c';

  const baseFontSize = typeof data.fontSize === 'number'
    ? data.fontSize
    : (data.fontSize ? parseInt(data.fontSize, 10) || 13 : 13);
  const textStyles = getNodeTextStyles(data, baseFontSize, data.textColor || '#0f172a');
  const shapeStyles = getNodeShapeStyles(data, color, borderColor);

  const [editingProblem, setEditingProblem] = useState(false);
  const [editingSubtitle, setEditingSubtitle] = useState(false);
  const [tempVal, setTempVal] = useState('');

  const handleStartEdit = (field: 'problem' | 'subtitle', current: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (field === 'problem') {
      setEditingProblem(true);
      setEditingSubtitle(false);
    } else {
      setEditingSubtitle(true);
      setEditingProblem(false);
    }
    setTempVal(current);
  };

  const handleSave = (field: 'problem' | 'subtitle') => {
    const trimmed = tempVal.trim();
    if (trimmed.length > 0) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id
            ? {
                ...n,
                data: {
                  ...n.data,
                  ...(field === 'problem' ? { problem: trimmed, label: trimmed } : { subtitle: trimmed, metric: trimmed }),
                },
              }
            : n
        )
      );
    }
    setEditingProblem(false);
    setEditingSubtitle(false);
  };

  return (
    <div
      className={`relative min-w-[250px] max-w-[290px] p-4 rounded-2xl border-2 shadow-lg transition-all select-none ${
        selected ? 'ring-3 ring-rose-500 shadow-xl scale-102' : ''
      }`}
      style={{
        ...shapeStyles,
        backgroundColor: color,
        borderColor: borderColor,
        fontFamily: textStyles.fontFamily,
      }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={200} minHeight={100} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />

      {/* Fish Head Badge */}
      <div className="flex items-center gap-1.5 mb-2">
        <span 
          className="px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider text-white flex items-center gap-1 shadow-xs"
          style={{
            backgroundColor: headerColor,
            fontSize: `${Math.max(9, Math.round(baseFontSize * 0.8))}px`,
            fontFamily: textStyles.fontFamily,
          }}
        >
          <AlertTriangle className="w-3 h-3" />
          <span>Masalah Utama</span>
        </span>
        <span
          className="font-bold text-rose-700"
          style={{ fontSize: `${Math.max(9, Math.round(baseFontSize * 0.8))}px` }}
        >
          Akibat (Effect)
        </span>
      </div>

      {/* Problem Statement */}
      {editingProblem ? (
        <textarea
          autoFocus
          rows={2}
          value={tempVal}
          onChange={(e) => setTempVal(e.target.value)}
          onBlur={() => handleSave('problem')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSave('problem');
            }
            if (e.key === 'Escape') setEditingProblem(false);
          }}
          className="w-full p-1.5 border border-rose-500 rounded bg-white text-slate-900 font-extrabold focus:outline-hidden"
          style={{ fontSize: `${Math.max(12, Math.round(baseFontSize * 1.15))}px`, fontFamily: textStyles.fontFamily }}
        />
      ) : (
        <div
          onDoubleClick={(e) => handleStartEdit('problem', problem, e)}
          title="Klik ganda untuk mengedit masalah utama"
          className="font-extrabold leading-snug cursor-text hover:bg-black/5 px-1 py-0.5 -mx-1 rounded transition-colors break-words"
          style={{
            fontSize: `${Math.max(12, Math.round(baseFontSize * 1.15))}px`,
            fontFamily: textStyles.fontFamily,
            fontWeight: textStyles.fontWeight || 800,
            fontStyle: textStyles.fontStyle,
            textAlign: textStyles.textAlign,
            color: textStyles.color,
            textTransform: textStyles.textTransform,
          }}
        >
          {problem}
        </div>
      )}

      {/* Subtitle / KPI Metric */}
      {editingSubtitle ? (
        <input
          autoFocus
          type="text"
          value={tempVal}
          onChange={(e) => setTempVal(e.target.value)}
          onBlur={() => handleSave('subtitle')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave('subtitle');
            if (e.key === 'Escape') setEditingSubtitle(false);
          }}
          className="w-full mt-2 px-1.5 py-0.5 border border-rose-500 rounded bg-white text-rose-800 font-semibold focus:outline-hidden"
          style={{ fontSize: `${Math.max(10, Math.round(baseFontSize * 0.85))}px`, fontFamily: textStyles.fontFamily }}
        />
      ) : (
        subtitle && (
          <div
            onDoubleClick={(e) => handleStartEdit('subtitle', subtitle, e)}
            title="Klik ganda untuk mengedit metrik/subjudul"
            className="mt-2.5 pt-2 border-t border-rose-200/80 font-semibold text-rose-800 leading-tight flex items-center gap-1.5 cursor-text hover:bg-black/5 px-1 py-0.5 rounded transition-colors"
            style={{
              fontSize: `${Math.max(10, Math.round(baseFontSize * 0.85))}px`,
              fontFamily: textStyles.fontFamily,
              fontStyle: textStyles.fontStyle,
              textAlign: textStyles.textAlign,
            }}
          >
            <Activity className="w-3.5 h-3.5 shrink-0 text-rose-600" />
            <span className="truncate">{subtitle}</span>
          </div>
        )
      )}
    </div>
  );
});
FishboneHeadNode.displayName = 'FishboneHeadNode';

// 6. FISHBONE CATEGORY NODE (Tulang Cabang 6M: Man, Machine, Method, Material, Measurement, Milieu)
export const FishboneCategoryNode = memo((props: any) => {
  const { id, data, selected } = props;
  const { setNodes } = useReactFlow();
  const category = data.category || data.label || 'KATEGORI (6M)';
  const title = data.title || '';
  const items: string[] = Array.isArray(data.items) && data.items.length > 0
    ? data.items
    : ['Penyebab spesifik 1', 'Penyebab spesifik 2'];
  const color = data.color || '#f8fafc';
  const borderColor = data.borderColor || '#3b82f6';
  const headerColor = data.headerColor || '#2563eb';

  const baseFontSize = typeof data.fontSize === 'number'
    ? data.fontSize
    : (data.fontSize ? parseInt(data.fontSize, 10) || 11 : 11);
  const textStyles = getNodeTextStyles(data, baseFontSize, data.textColor || '#334155');
  const shapeStyles = getNodeShapeStyles(data, color, borderColor);

  const [editingItemIdx, setEditingItemIdx] = useState<number | null>(null);
  const [tempText, setTempText] = useState('');

  const handleStartEditItem = (idx: number, current: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItemIdx(idx);
    setTempText(current);
  };

  const handleSaveItem = (idx: number) => {
    const trimmed = tempText.trim();
    if (trimmed.length > 0) {
      const newItems = [...items];
      newItems[idx] = trimmed;
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, items: newItems } } : n))
      );
    }
    setEditingItemIdx(null);
  };

  return (
    <div
      className={`relative min-w-[220px] max-w-[260px] p-3 rounded-xl border-2 shadow-md transition-all select-none ${
        selected ? 'ring-3 ring-blue-500 shadow-xl scale-102' : ''
      }`}
      style={{
        ...shapeStyles,
        backgroundColor: color,
        borderColor: borderColor,
        fontFamily: textStyles.fontFamily,
      }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={180} minHeight={80} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />

      {/* Header Badge */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <span
          className="px-2.5 py-0.5 rounded-lg font-black uppercase tracking-wider text-white shadow-2xs"
          style={{
            backgroundColor: headerColor,
            fontSize: `${Math.max(9, Math.round(baseFontSize * 0.85))}px`,
            fontFamily: textStyles.fontFamily,
          }}
        >
          {category}
        </span>
        {title && (
          <span
            className="font-bold text-slate-700 truncate"
            style={{ fontSize: `${baseFontSize}px`, fontFamily: textStyles.fontFamily }}
          >
            {title}
          </span>
        )}
      </div>

      {/* Sub-causes List */}
      <ul className="space-y-1.5 leading-relaxed" style={{ color: textStyles.color }}>
        {items.map((item, idx) => {
          const isItemEditing = editingItemIdx === idx;
          return isItemEditing ? (
            <input
              key={idx}
              autoFocus
              type="text"
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              onBlur={() => handleSaveItem(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveItem(idx);
                if (e.key === 'Escape') setEditingItemIdx(null);
              }}
              className="w-full px-1.5 py-0.5 border border-blue-500 rounded bg-white text-slate-800 text-xs focus:outline-hidden"
              style={{ fontSize: `${baseFontSize}px`, fontFamily: textStyles.fontFamily }}
            />
          ) : (
            <li
              key={idx}
              onDoubleClick={(e) => handleStartEditItem(idx, item, e)}
              title="Klik ganda untuk mengedit penyebab"
              className="flex items-start gap-1.5 cursor-text hover:bg-black/5 rounded px-1 py-0.5 transition-colors"
              style={{
                fontSize: `${baseFontSize}px`,
                fontFamily: textStyles.fontFamily,
                fontWeight: textStyles.fontWeight,
                fontStyle: textStyles.fontStyle,
                textAlign: textStyles.textAlign,
                color: textStyles.color,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                style={{ backgroundColor: borderColor }}
              />
              <span className="font-medium leading-tight flex-1 break-words">{item}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
FishboneCategoryNode.displayName = 'FishboneCategoryNode';

// 7. CANVAS BLOCK NODE (Blok Universal untuk Lean Canvas, Business Model Canvas, Value Proposition Canvas)
export const CanvasBlockNode = memo((props: any) => {
  const { id, data, selected } = props;
  const { setNodes } = useReactFlow();
  const badgeNumber = data.badgeNumber || data.number || '';
  const title = data.label || data.title || 'Blok Kanvas';
  const subtitle = data.subtitle || data.prompt || '';
  const items: string[] = Array.isArray(data.items) && data.items.length > 0
    ? data.items
    : ['Poin analisis 1', 'Poin analisis 2'];
  const color = data.color || '#ffffff';
  const borderColor = data.borderColor || '#cbd5e1';
  const headerColor = data.headerColor || '#0b4632';

  const nodeWidth = props.width || data.width;
  const nodeHeight = props.height || data.height;

  // Base font size
  const baseFontSize = typeof data.fontSize === 'number'
    ? data.fontSize
    : (data.fontSize ? parseInt(data.fontSize, 10) || 12 : 12);

  // Proportional font sizing
  const titleFontSize = Math.max(12, Math.round(baseFontSize * 1.15));
  const subtitleFontSize = Math.max(10, Math.round(baseFontSize * 0.85));
  const badgeSize = Math.max(20, Math.round(baseFontSize * 1.5));
  const badgeFontSize = Math.max(10, Math.round(baseFontSize * 0.8));

  const textStyles = getNodeTextStyles(data, baseFontSize, data.textColor || '#1e293b');
  const shapeStyles = getNodeShapeStyles(data, color, borderColor);

  // Inline editing state
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingItemIdx, setEditingItemIdx] = useState<number | null>(null);
  const [tempValue, setTempValue] = useState('');

  const handleStartEditTitle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItemIdx(null);
    setEditingTitle(true);
    setTempValue(title);
  };

  const handleSaveTitle = () => {
    const val = tempValue.trim();
    if (val.length > 0) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id
            ? { ...n, data: { ...n.data, label: val, title: val } }
            : n
        )
      );
    }
    setEditingTitle(false);
  };

  const handleStartEditItem = (idx: number, currentVal: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTitle(false);
    setEditingItemIdx(idx);
    setTempValue(currentVal);
  };

  const handleSaveItem = (idx: number) => {
    const val = tempValue.trim();
    if (val.length > 0) {
      const newItems = [...items];
      newItems[idx] = val;
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id
            ? { ...n, data: { ...n.data, items: newItems } }
            : n
        )
      );
    }
    setEditingItemIdx(null);
  };

  return (
    <div
      className={`relative min-w-[180px] p-3.5 rounded-2xl border-2 shadow-sm transition-all select-none flex flex-col justify-start ${
        selected ? 'ring-3 ring-emerald-600 shadow-xl scale-101' : ''
      }`}
      style={{
        ...shapeStyles,
        backgroundColor: color,
        borderColor: borderColor,
        fontFamily: textStyles.fontFamily,
        width: nodeWidth ? `${nodeWidth}px` : undefined,
        height: nodeHeight ? `${nodeHeight}px` : undefined,
      }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={160} minHeight={100} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />

      {/* Block Header */}
      <div className="flex items-center gap-2 mb-1">
        {badgeNumber && (
          <span 
            className="rounded-md font-black text-white flex items-center justify-center shrink-0 shadow-2xs"
            style={{
              backgroundColor: headerColor,
              width: `${badgeSize}px`,
              height: `${badgeSize}px`,
              fontSize: `${badgeFontSize}px`,
            }}
          >
            {badgeNumber}
          </span>
        )}
        {editingTitle ? (
          <input
            autoFocus
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveTitle();
              if (e.key === 'Escape') setEditingTitle(false);
            }}
            className="w-full px-1.5 py-0.5 border border-emerald-500 rounded bg-white text-slate-900 focus:outline-hidden font-bold"
            style={{ fontSize: `${titleFontSize}px`, fontFamily: textStyles.fontFamily }}
          />
        ) : (
          <h4
            onDoubleClick={handleStartEditTitle}
            title="Klik ganda untuk mengedit judul blok"
            className="tracking-tight leading-tight cursor-text hover:bg-black/5 px-1 py-0.5 -mx-1 rounded transition-colors truncate"
            style={{
              fontSize: `${titleFontSize}px`,
              fontFamily: textStyles.fontFamily,
              fontWeight: data?.bold !== undefined ? (data.bold ? 800 : 400) : 800,
              fontStyle: textStyles.fontStyle,
              textDecoration: textStyles.textDecoration,
              textAlign: textStyles.textAlign,
              color: data.textColor || '#0f172a',
              textTransform: textStyles.textTransform,
              letterSpacing: textStyles.letterSpacing,
            }}
          >
            {title}
          </h4>
        )}
      </div>

      {/* Subtitle / Guiding Question */}
      {subtitle && (
        <p
          className="font-medium mb-2 leading-tight"
          style={{
            fontSize: `${subtitleFontSize}px`,
            fontFamily: textStyles.fontFamily,
            fontStyle: textStyles.fontStyle,
            textAlign: textStyles.textAlign,
            color: data.textColor ? `${data.textColor}99` : '#64748b',
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Bullet / Sticky Items */}
      <div className="space-y-1.5 mt-1 flex-1">
        {items.map((item, idx) => {
          const isItemEditing = editingItemIdx === idx;
          return isItemEditing ? (
            <textarea
              key={idx}
              autoFocus
              rows={2}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={() => handleSaveItem(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveItem(idx);
                }
                if (e.key === 'Escape') setEditingItemIdx(null);
              }}
              className="w-full p-1.5 rounded-lg border border-emerald-500 bg-white text-slate-800 focus:outline-hidden shadow-xs leading-snug"
              style={{ fontSize: `${baseFontSize}px`, fontFamily: textStyles.fontFamily }}
            />
          ) : (
            <div
              key={idx}
              onDoubleClick={(e) => handleStartEditItem(idx, item, e)}
              title="Klik ganda untuk mengedit poin analisis"
              className="p-1.5 rounded-lg bg-slate-50/80 border border-slate-200/70 leading-snug flex items-start gap-1.5 shadow-3xs cursor-text hover:bg-slate-100/90 transition-colors"
              style={{
                fontSize: `${baseFontSize}px`,
                fontFamily: textStyles.fontFamily,
                fontWeight: textStyles.fontWeight,
                fontStyle: textStyles.fontStyle,
                textDecoration: textStyles.textDecoration,
                textAlign: textStyles.textAlign,
                color: data.textColor || '#334155',
                lineHeight: textStyles.lineHeight,
                letterSpacing: textStyles.letterSpacing,
                textTransform: textStyles.textTransform,
              }}
            >
              <span
                className="font-bold shrink-0 mt-0.5 leading-none"
                style={{ fontSize: `${baseFontSize}px`, color: headerColor }}
              >
                •
              </span>
              <span className="flex-1 break-words">{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
CanvasBlockNode.displayName = 'CanvasBlockNode';

// 8. 5-WHYS STEP NODE (Rantai Analisis Kausalitas Bertingkat Toyota TPS)
export const WhyStepNode = memo((props: any) => {
  const { id, data, selected } = props;
  const { setNodes } = useReactFlow();
  const stepNumber = data.stepNumber || data.step || 1;
  const question = data.question || `Mengapa #${stepNumber}?`;
  const answer = data.label || data.answer || 'Uraian penyebab pada level ini...';
  const isRootCause = Boolean(data.isRootCause || stepNumber === 5);
  const solution = data.solution || '';
  const color = data.color || (isRootCause ? '#ecfdf5' : '#ffffff');
  const borderColor = data.borderColor || (isRootCause ? '#059669' : '#e2e8f0');

  const baseFontSize = typeof data.fontSize === 'number'
    ? data.fontSize
    : (data.fontSize ? parseInt(data.fontSize, 10) || 12 : 12);
  const textStyles = getNodeTextStyles(data, baseFontSize, data.textColor || '#1e293b');
  const shapeStyles = getNodeShapeStyles(data, color, borderColor);

  const nodeWidth = props.width || data.width;
  const nodeHeight = props.height || data.height;

  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState('');

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setTempText(answer);
  };

  const handleSave = () => {
    const val = tempText.trim();
    if (val.length > 0) {
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, answer: val, label: val } } : n))
      );
    }
    setIsEditing(false);
  };

  return (
    <div
      className={`relative min-w-[220px] p-4 rounded-2xl border-2 shadow-md transition-all select-none ${
        selected ? 'ring-3 ring-emerald-600 shadow-xl scale-102' : ''
      }`}
      style={{
        ...shapeStyles,
        backgroundColor: color,
        borderColor: borderColor,
        fontFamily: textStyles.fontFamily,
        width: nodeWidth ? `${nodeWidth}px` : undefined,
        height: nodeHeight ? `${nodeHeight}px` : undefined,
      }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={180} minHeight={120} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />

      {/* Step Header */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <span
          className={`px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
            isRootCause ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-200 text-slate-800'
          }`}
          style={{
            fontSize: `${Math.max(9, Math.round(baseFontSize * 0.85))}px`,
            fontFamily: textStyles.fontFamily,
            fontWeight: 800,
          }}
        >
          {isRootCause ? <CheckCircle2 className="w-3 h-3" /> : <HelpCircle className="w-3 h-3 text-slate-600" />}
          <span>{isRootCause ? 'Akar Masalah (Root Cause)' : `Mengapa #${stepNumber}`}</span>
        </span>
      </div>

      {/* Question */}
      <div
        className="mb-1 leading-snug"
        style={{
          fontSize: `${baseFontSize}px`,
          fontFamily: textStyles.fontFamily,
          fontWeight: 700,
          fontStyle: textStyles.fontStyle,
          color: data.textColor || '#1e293b',
        }}
      >
        {question}
      </div>

      {/* Answer / Finding */}
      {isEditing ? (
        <textarea
          autoFocus
          rows={3}
          value={tempText}
          onChange={(e) => setTempText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsEditing(false);
          }}
          className="w-full p-2 rounded-xl bg-white border border-emerald-500 text-slate-800 focus:outline-hidden leading-snug shadow-3xs"
          style={{ fontSize: `${baseFontSize}px`, fontFamily: textStyles.fontFamily }}
        />
      ) : (
        <div
          onDoubleClick={handleStartEdit}
          title="Klik ganda untuk mengedit uraian jawaban"
          className="p-2 rounded-xl bg-white/90 border border-slate-200 leading-snug shadow-3xs cursor-text hover:bg-slate-50 transition-colors"
          style={{
            fontSize: `${baseFontSize}px`,
            fontFamily: textStyles.fontFamily,
            fontWeight: textStyles.fontWeight,
            fontStyle: textStyles.fontStyle,
            textDecoration: textStyles.textDecoration,
            textAlign: textStyles.textAlign,
            color: data.textColor || '#334155',
          }}
        >
          {answer}
        </div>
      )}

      {/* Countermeasure / Solusi jika Root Cause */}
      {isRootCause && solution && (
        <div className="mt-2.5 pt-2 border-t border-emerald-200 text-emerald-900 bg-emerald-100/60 p-2 rounded-xl">
          <div
            className="flex items-center gap-1 uppercase tracking-wider font-black text-emerald-800 mb-0.5"
            style={{ fontSize: `${Math.max(9, Math.round(baseFontSize * 0.8))}px` }}
          >
            <Lightbulb className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>Tindakan Solutif (Kaizen)</span>
          </div>
          <p
            className="leading-snug font-semibold"
            style={{ fontSize: `${Math.max(10, Math.round(baseFontSize * 0.9))}px`, fontFamily: textStyles.fontFamily }}
          >
            {solution}
          </p>
        </div>
      )}
    </div>
  );
});
WhyStepNode.displayName = 'WhyStepNode';

// 9. PRIORITY MATRIX CARD NODE (Kuadran Matriks Eisenhower & Dampak vs Usaha)
export const PriorityCardNode = memo((props: any) => {
  const { id, data, selected } = props;
  const { setNodes } = useReactFlow();
  const quadrant = (data.quadrant || 'Q1').toUpperCase();
  const title = data.label || data.title || 'Kuadran Prioritas';
  const subtitle = data.subtitle || '';
  const items: string[] = Array.isArray(data.items) && data.items.length > 0
    ? data.items
    : ['Tugas / Inisiatif 1', 'Tugas / Inisiatif 2'];
  const color = data.color || '#ffffff';
  const borderColor = data.borderColor || '#cbd5e1';
  const badgeColor = data.badgeColor || '#0b4632';

  const nodeWidth = props.width || data.width;
  const nodeHeight = props.height || data.height;

  const baseFontSize = typeof data.fontSize === 'number'
    ? data.fontSize
    : (data.fontSize ? parseInt(data.fontSize, 10) || 12 : 12);
  const titleFontSize = Math.max(13, Math.round(baseFontSize * 1.15));
  const subtitleFontSize = Math.max(10, Math.round(baseFontSize * 0.85));

  const textStyles = getNodeTextStyles(data, baseFontSize, data.textColor || '#0f172a');
  const shapeStyles = getNodeShapeStyles(data, color, borderColor);

  const [editingTitle, setEditingTitle] = useState(false);
  const [editingItemIdx, setEditingItemIdx] = useState<number | null>(null);
  const [tempValue, setTempValue] = useState('');

  const handleStartEditTitle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItemIdx(null);
    setEditingTitle(true);
    setTempValue(title);
  };

  const handleSaveTitle = () => {
    const val = tempValue.trim();
    if (val.length > 0) {
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: val, title: val } } : n))
      );
    }
    setEditingTitle(false);
  };

  const handleStartEditItem = (idx: number, currentVal: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTitle(false);
    setEditingItemIdx(idx);
    setTempValue(currentVal);
  };

  const handleSaveItem = (idx: number) => {
    const val = tempValue.trim();
    if (val.length > 0) {
      const newItems = [...items];
      newItems[idx] = val;
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, items: newItems } } : n))
      );
    }
    setEditingItemIdx(null);
  };

  return (
    <div
      className={`relative min-w-[220px] p-4 rounded-2xl border-2 shadow-md transition-all select-none ${
        selected ? 'ring-3 ring-emerald-600 shadow-xl scale-102' : ''
      }`}
      style={{
        ...shapeStyles,
        backgroundColor: color,
        borderColor: borderColor,
        fontFamily: textStyles.fontFamily,
        width: nodeWidth ? `${nodeWidth}px` : undefined,
        height: nodeHeight ? `${nodeHeight}px` : undefined,
      }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={180} minHeight={120} />
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />

      {/* Quadrant Badge */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <span 
          className="px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider text-white shadow-xs"
          style={{
            backgroundColor: badgeColor,
            fontSize: `${Math.max(9, Math.round(baseFontSize * 0.85))}px`,
            fontFamily: textStyles.fontFamily,
          }}
        >
          {quadrant}
        </span>
        {subtitle && (
          <span
            className="font-bold text-slate-500 truncate"
            style={{ fontSize: `${subtitleFontSize}px`, fontFamily: textStyles.fontFamily }}
          >
            {subtitle}
          </span>
        )}
      </div>

      {editingTitle ? (
        <input
          autoFocus
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSaveTitle}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveTitle();
            if (e.key === 'Escape') setEditingTitle(false);
          }}
          className="w-full px-1.5 py-0.5 border border-emerald-500 rounded bg-white text-slate-900 focus:outline-hidden font-bold mb-2"
          style={{ fontSize: `${titleFontSize}px`, fontFamily: textStyles.fontFamily }}
        />
      ) : (
        <h4
          onDoubleClick={handleStartEditTitle}
          title="Klik ganda untuk mengedit judul kuadran"
          className="tracking-tight leading-tight mb-2 cursor-text hover:bg-black/5 px-1 py-0.5 -mx-1 rounded transition-colors truncate"
          style={{
            fontSize: `${titleFontSize}px`,
            fontFamily: textStyles.fontFamily,
            fontWeight: textStyles.fontWeight || 800,
            fontStyle: textStyles.fontStyle,
            textDecoration: textStyles.textDecoration,
            textAlign: textStyles.textAlign,
            color: data.textColor || '#0f172a',
            textTransform: textStyles.textTransform,
            letterSpacing: textStyles.letterSpacing,
          }}
        >
          {title}
        </h4>
      )}

      {/* Action Items */}
      <div className="space-y-1.5">
        {items.map((item, idx) => {
          const isItemEditing = editingItemIdx === idx;
          return isItemEditing ? (
            <textarea
              key={idx}
              autoFocus
              rows={2}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={() => handleSaveItem(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveItem(idx);
                }
                if (e.key === 'Escape') setEditingItemIdx(null);
              }}
              className="w-full p-1.5 rounded-lg border border-emerald-500 bg-white text-slate-800 focus:outline-hidden shadow-xs leading-snug"
              style={{ fontSize: `${baseFontSize}px`, fontFamily: textStyles.fontFamily }}
            />
          ) : (
            <div
              key={idx}
              onDoubleClick={(e) => handleStartEditItem(idx, item, e)}
              title="Klik ganda untuk mengedit tugas"
              className="p-1.5 rounded-lg bg-slate-50/80 border border-slate-200/80 leading-snug flex items-start gap-1.5 cursor-text hover:bg-slate-100/90 transition-colors"
              style={{
                fontSize: `${baseFontSize}px`,
                fontFamily: textStyles.fontFamily,
                fontWeight: textStyles.fontWeight,
                fontStyle: textStyles.fontStyle,
                textDecoration: textStyles.textDecoration,
                textAlign: textStyles.textAlign,
                color: data.textColor || '#334155',
                lineHeight: textStyles.lineHeight,
                letterSpacing: textStyles.letterSpacing,
                textTransform: textStyles.textTransform,
              }}
            >
              <span
                className="font-bold shrink-0 mt-0.5 leading-none"
                style={{ fontSize: `${baseFontSize}px`, color: badgeColor }}
              >
                •
              </span>
              <span className="flex-1 break-words">{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
PriorityCardNode.displayName = 'PriorityCardNode';

// ========================================================
// 10. Swimlane Group Node (Wadah Jalur Kolam Antar-Fungsi)
// ========================================================
export interface SwimlaneLane {
  id: string;
  name: string;
  color: string;
  height?: number;
  textColor?: string;
  dividerLabel?: string;
}

export const SwimlaneGroupNode = memo((props: any) => {
  const { id, data, selected } = props;
  const { setNodes } = useReactFlow();

  const defaultLanes: SwimlaneLane[] = [
    { id: 'customer', name: 'Customer', color: '#0284c7', height: 160 },
    { id: 'sales', name: 'Sales', color: '#0d9488', height: 160 },
    { id: 'management', name: 'Management', color: '#4f46e5', height: 160 },
    { id: 'credit', name: 'Credit department', color: '#db2777', height: 160 },
  ];

  const lanes: SwimlaneLane[] = Array.isArray(data.lanes) && data.lanes.length > 0 
    ? data.lanes 
    : defaultLanes;

  const totalWidth = data.width ? Number(data.width) : 1120;
  const headerWidth = data.headerWidth ? Number(data.headerWidth) : (data.isServiceBlueprint ? 120 : 60);
  const headerOrientation = data.headerOrientation || (headerWidth >= 90 ? 'horizontal' : 'vertical');
  const showTitle = data.showTitle !== false;
  const titleText = data.label || data.title || 'ALUR PROSES LINTAS FUNGSI (SWIMLANE)';

  const [editingLaneId, setEditingLaneId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleStartRename = (lane: SwimlaneLane, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLaneId(lane.id);
    setEditingName(lane.name);
  };

  const handleSaveRename = (laneId: string) => {
    const trimmed = editingName.trim();
    if (trimmed.length > 0) {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === id) {
            const updated = lanes.map((l) =>
              l.id === laneId ? { ...l, name: trimmed } : l
            );
            return { ...n, data: { ...n.data, lanes: updated } };
          }
          return n;
        })
      );
    }
    setEditingLaneId(null);
  };

  const handleAddLane = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLane: SwimlaneLane = {
      id: `lane-${Date.now()}`,
      name: `Jalur Baru ${lanes.length + 1}`,
      color: '#64748b',
      height: 160,
    };
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          return {
            ...n,
            data: {
              ...n.data,
              lanes: [...lanes, newLane],
            },
          };
        }
        return n;
      })
    );
  };

  const isGridLayout = data.gridLayout !== false;
  const showGridSlots = data.showGridSlots !== false;
  const gridColumns = data.gridColumns ? Math.max(3, Math.min(16, Number(data.gridColumns))) : 7;
  const spacingX = data.spacingX !== undefined ? Number(data.spacingX) : 16;
  const spacingY = data.spacingY !== undefined ? Number(data.spacingY) : 16;
  const paddingX = data.paddingX !== undefined ? Number(data.paddingX) : 24;
  const paddingY = data.paddingY !== undefined ? Number(data.paddingY) : 16;
  const gridAlignH = data.gridAlignH || 'center';

  return (
    <div
      className={`relative rounded-2xl border-2 border-slate-300 bg-white/70 backdrop-blur-2xs shadow-sm overflow-visible transition-all ${
        selected ? 'shadow-md border-blue-400' : ''
      }`}
      style={{ width: totalWidth, zIndex: -1 }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={400} minHeight={200} />
      <NodeQuickActions id={id} selected={selected} />

      {/* Header Judul Container Swimlane */}
      {showTitle && (
        <div className="h-8 bg-slate-100/90 border-b border-slate-200 px-4 rounded-t-2xl flex items-center justify-between text-xs font-bold text-slate-700 tracking-wider uppercase">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>{titleText}</span>
            {isGridLayout && (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 normal-case tracking-normal flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                Grid ({gridColumns} col)
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddLane}
            className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-white hover:bg-blue-50 px-2 py-0.5 rounded border border-blue-200 transition-colors shadow-2xs cursor-pointer"
            title="Tambah Jalur Fungsi Baru"
          >
            <Plus className="w-3 h-3" />
            <span>Tambah Jalur</span>
          </button>
        </div>
      )}

      {/* Baris Jalur-Jalur Horizontal */}
      <div className="flex flex-col divide-y divide-slate-200">
        {lanes.map((lane, idx) => {
          const laneHeight = lane.height || 160;
          const isEditing = editingLaneId === lane.id;
          const isFirst = idx === 0;
          const isLast = idx === lanes.length - 1;
          const defaultTextColor = headerOrientation === 'horizontal' ? '#0f172a' : '#ffffff';
          const textColor = lane.textColor || defaultTextColor;

          return (
            <div
              key={lane.id || idx}
              className="flex w-full relative"
              style={{ height: laneHeight }}
            >
              {/* Kolom Header Jalur (Kiri) */}
              <div
                className={`shrink-0 flex items-center justify-center relative cursor-pointer group select-none transition-all hover:brightness-105 ${
                  isFirst && !showTitle ? 'rounded-tl-2xl' : ''
                } ${isLast ? 'rounded-bl-2xl' : ''}`}
                style={{ 
                  backgroundColor: lane.color,
                  width: headerWidth,
                  color: textColor,
                }}
                title="Klik ganda untuk mengubah nama jalur"
                onDoubleClick={(e) => handleStartRename(lane, e)}
              >
                {isEditing ? (
                  <div
                    className="p-1.5 bg-white rounded-md shadow-lg border border-slate-300 z-30 flex flex-col items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      autoFocus
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => handleSaveRename(lane.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename(lane.id);
                        if (e.key === 'Escape') setEditingLaneId(null);
                      }}
                      className="px-1.5 py-1 text-xs font-bold text-slate-800 border border-blue-500 rounded focus:outline-hidden w-28 text-center"
                    />
                    <span className="text-[9px] text-slate-400 mt-0.5">Tekan Enter</span>
                  </div>
                ) : headerOrientation === 'horizontal' ? (
                  <div className="flex items-center justify-center h-full w-full px-2">
                    <span 
                      className="font-black text-xs sm:text-[13px] tracking-tight text-center leading-snug drop-shadow-2xs break-words"
                      style={{ color: textColor }}
                    >
                      {lane.name}
                    </span>
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center h-full w-full px-1"
                    style={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                    }}
                  >
                    <span 
                      className="font-bold text-xs tracking-wider uppercase text-center drop-shadow-xs truncate max-h-[140px]"
                      style={{ color: textColor }}
                    >
                      {lane.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Label Pembatas Jalur (Khusus Service Blueprint: Line of interaction, Line of visibility, Line of internal interaction) */}
              {lane.dividerLabel && !isLast && (
                <div 
                  className="absolute -bottom-3 left-0 -translate-x-full pr-2 z-40 pointer-events-auto flex items-center select-none"
                  title={lane.dividerLabel}
                >
                  <div className="px-2.5 py-1 rounded-xl bg-white border border-slate-400/80 shadow-xs text-[10px] font-bold text-slate-800 whitespace-nowrap hover:border-blue-500 transition-colors">
                    {lane.dividerLabel}
                  </div>
                  <div className="w-2.5 h-[1.5px] bg-slate-400" />
                </div>
              )}

              {/* Area Badan Jalur (Transparan & pointer-events-none agar objek di dalamnya leluasa diklik & digeser) */}
              <div
                className={`flex-1 h-full relative pointer-events-none ${
                  isLast ? 'rounded-br-2xl' : ''
                } ${
                  idx % 2 === 0 ? 'bg-white/40' : 'bg-slate-50/50'
                }`}
              >
                {/* Garis tengah panduan halus */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b border-dashed border-slate-200/60 pointer-events-none" />

                {/* Grid Layout Petak Slot (Persis seperti tampilan Grid Layout di referensi screenshot) */}
                {isGridLayout && showGridSlots && (
                  <div
                    className="absolute inset-0 flex items-center pointer-events-none"
                    style={{
                      paddingLeft: `${paddingX}px`,
                      paddingRight: `${paddingX}px`,
                      paddingTop: `${paddingY}px`,
                      paddingBottom: `${paddingY}px`,
                      gap: `${spacingX}px`,
                      justifyContent:
                        gridAlignH === 'left'
                          ? 'flex-start'
                          : gridAlignH === 'right'
                          ? 'flex-end'
                          : 'space-between',
                    }}
                  >
                    {Array.from({ length: gridColumns }).map((_, colIdx) => (
                      <div
                        key={colIdx}
                        className="flex-1 h-[68px] max-w-[130px] rounded-xl bg-slate-200/40 border border-dashed border-slate-300/60 flex items-center justify-center transition-all shadow-2xs"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
SwimlaneGroupNode.displayName = 'SwimlaneGroupNode';

// ========================================================
// 11. Process Legend Node (Legenda Bentuk & Warna Alur)
// ========================================================
export const ProcessLegendNode = memo((props: any) => {
  const { id, data, selected } = props;

  const defaultItems = [
    { label: 'Customer', color: '#0284c7' },
    { label: 'Sales', color: '#0d9488' },
    { label: 'Management', color: '#4f46e5' },
    { label: 'Credit department', color: '#db2777' },
  ];

  const items = Array.isArray(data.items) && data.items.length > 0 ? data.items : defaultItems;
  const title = data.title || data.label || 'Process flow shapes';

  const baseFontSize = typeof data.fontSize === 'number'
    ? data.fontSize
    : (data.fontSize ? parseInt(data.fontSize, 10) || 12 : 12);
  const textStyles = getNodeTextStyles(data, baseFontSize, data.textColor || '#0f172a');
  const shapeStyles = getNodeShapeStyles(data, '#ffffff', '#e2e8f0');

  return (
    <div
      className={`relative px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-xs border border-slate-200 shadow-md min-w-[200px] transition-all select-none ${
        selected ? 'ring-2 ring-blue-500 shadow-lg border-blue-400' : ''
      }`}
      style={{
        ...shapeStyles,
        fontFamily: textStyles.fontFamily,
      }}
    >
      <NodeQuickActions id={id} selected={selected} />
      <StandardHandles />

      {/* Header Legenda */}
      <div
        className="font-bold uppercase tracking-wider mb-2.5 pb-1.5 border-b border-slate-100 flex items-center gap-1.5"
        style={{
          fontSize: `${baseFontSize}px`,
          fontFamily: textStyles.fontFamily,
          color: textStyles.color,
        }}
      >
        <Activity className="w-3.5 h-3.5 text-blue-600" />
        <span>{title}</span>
      </div>

      {/* Daftar Indikator Peran / Bentuk */}
      <div className="space-y-1.5">
        {items.map((item: any, idx: number) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 font-semibold text-slate-700"
            style={{
              fontSize: `${baseFontSize}px`,
              fontFamily: textStyles.fontFamily,
              color: textStyles.color,
            }}
          >
            <span
              className="w-3 h-3 rounded-full shrink-0 shadow-2xs border border-black/10"
              style={{ backgroundColor: item.color || '#3b82f6' }}
            />
            <span className="truncate">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
ProcessLegendNode.displayName = 'ProcessLegendNode';

export const specialistNodeTypes = {
  uml_class: UMLClassNode,
  erd_entity: ERDEntityNode,
  org_node: OrgNode,
  swot_card: SWOTCardNode,
  fishbone_head: FishboneHeadNode,
  fishbone_category: FishboneCategoryNode,
  canvas_block: CanvasBlockNode,
  why_step: WhyStepNode,
  priority_card: PriorityCardNode,
  swimlane_group: SwimlaneGroupNode,
  process_legend: ProcessLegendNode,
};


