'use client';

import React, { memo, useState, useRef } from 'react';
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
  ChevronLeft,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  CheckCircle2,
  Activity,
  Plus,
  Calendar,
  Clock,
  Star,
  Flag,
  ListTodo
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

  // Base font size - proporsional & terbaca jelas untuk pemula
  const baseFontSize = typeof data.fontSize === 'number'
    ? data.fontSize
    : (data.fontSize ? parseInt(data.fontSize, 10) || 13 : 13);

  // Proportional font sizing
  const titleFontSize = Math.max(14, Math.round(baseFontSize * 1.15));
  const subtitleFontSize = Math.max(11, Math.round(baseFontSize * 0.9));
  const badgeSize = Math.max(22, Math.round(baseFontSize * 1.6));
  const badgeFontSize = Math.max(11, Math.round(baseFontSize * 0.85));

  const textStyles = getNodeTextStyles(data, baseFontSize, data.textColor || '#1e293b');
  const shapeStyles = getNodeShapeStyles(data, color, borderColor);

  // Inline editing state
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingSubtitle, setEditingSubtitle] = useState(false);
  const [editingItemIdx, setEditingItemIdx] = useState<number | null>(null);
  const [tempValue, setTempValue] = useState('');

  const handleStartEditTitle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItemIdx(null);
    setEditingSubtitle(false);
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

  const handleStartEditSubtitle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTitle(false);
    setEditingItemIdx(null);
    setEditingSubtitle(true);
    setTempValue(subtitle);
  };

  const handleSaveSubtitle = () => {
    const val = tempValue.trim();
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? { ...n, data: { ...n.data, subtitle: val, prompt: val } }
          : n
      )
    );
    setEditingSubtitle(false);
  };

  const handleStartEditItem = (idx: number, currentVal: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTitle(false);
    setEditingSubtitle(false);
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

  const handleAddItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newItems = [...items, 'Poin baru'];
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? { ...n, data: { ...n.data, items: newItems } }
          : n
      )
    );
    setEditingItemIdx(newItems.length - 1);
    setTempValue('Poin baru');
  };

  return (
    <div
      className={`relative min-w-[200px] p-4 rounded-2xl border-2 shadow-sm transition-all select-none flex flex-col justify-start ${
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
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={180} minHeight={110} />
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
            className="nodrag nopan w-full px-1.5 py-0.5 border border-emerald-500 rounded bg-white text-slate-900 focus:outline-hidden font-bold"
            style={{ fontSize: `${titleFontSize}px`, fontFamily: textStyles.fontFamily }}
          />
        ) : (
          <h4
            onDoubleClick={handleStartEditTitle}
            title="Klik ganda untuk mengedit judul blok"
            className="tracking-tight leading-snug cursor-text hover:bg-black/5 px-1 py-0.5 -mx-1 rounded transition-colors break-words flex-1 font-bold"
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
      {editingSubtitle ? (
        <input
          autoFocus
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSaveSubtitle}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveSubtitle();
            if (e.key === 'Escape') setEditingSubtitle(false);
          }}
          className="nodrag nopan w-full px-1.5 py-0.5 mb-2 border border-emerald-500 rounded bg-white text-slate-800 text-xs focus:outline-hidden"
          style={{ fontSize: `${subtitleFontSize}px` }}
        />
      ) : subtitle ? (
        <p
          onDoubleClick={handleStartEditSubtitle}
          title="Klik ganda untuk mengedit subtitle"
          className="font-medium mb-2 leading-relaxed cursor-text hover:bg-black/5 px-1 py-0.5 -mx-1 rounded transition-colors break-words"
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
      ) : null}

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
              className="nodrag nopan w-full p-2 rounded-lg border border-emerald-500 bg-white text-slate-800 focus:outline-hidden shadow-xs leading-snug"
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

        {selected && (
          <button
            type="button"
            onClick={handleAddItem}
            className="nodrag nopan w-full py-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-dashed border-emerald-300 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 mt-1"
          >
            <span>+ Tambah Poin</span>
          </button>
        )}
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
  const [editingDividerLaneId, setEditingDividerLaneId] = useState<string | null>(null);
  const [editingDividerText, setEditingDividerText] = useState('');

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

  const handleStartDividerEdit = (lane: SwimlaneLane, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDividerLaneId(lane.id);
    setEditingDividerText(lane.dividerLabel || '');
  };

  const handleSaveDividerEdit = (laneId: string) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          const updated = lanes.map((l) =>
            l.id === laneId ? { ...l, dividerLabel: editingDividerText.trim() } : l
          );
          return { ...n, data: { ...n.data, lanes: updated } };
        }
        return n;
      })
    );
    setEditingDividerLaneId(null);
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
                  title="Klik ganda untuk mengubah teks pembatas jalur"
                  onDoubleClick={(e) => handleStartDividerEdit(lane, e)}
                >
                  {editingDividerLaneId === lane.id ? (
                    <div 
                      className="bg-white rounded-xl shadow-lg border-2 border-blue-500 p-1 flex items-center z-50 nodrag nopan"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        autoFocus
                        type="text"
                        value={editingDividerText}
                        onChange={(e) => setEditingDividerText(e.target.value)}
                        onBlur={() => handleSaveDividerEdit(lane.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveDividerEdit(lane.id);
                          if (e.key === 'Escape') setEditingDividerLaneId(null);
                        }}
                        className="nodrag nopan px-2 py-0.5 text-[11px] font-bold text-slate-800 border-none outline-none w-44 text-center bg-slate-50 rounded"
                      />
                    </div>
                  ) : (
                    <div className="px-2.5 py-1 rounded-xl bg-white border border-slate-400/80 shadow-xs text-[10px] font-bold text-slate-800 whitespace-nowrap hover:border-blue-500 hover:text-blue-700 hover:shadow-sm transition-all cursor-pointer">
                      {lane.dividerLabel}
                    </div>
                  )}
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

      {/* Bilah Aksi Bawah: Tambah Jalur Baru & Panduan (Selalu Tampak) */}
      <div className="p-2 bg-slate-50/90 border-t border-slate-200 flex items-center justify-between text-xs select-none">
        <button
          type="button"
          onClick={handleAddLane}
          className="nodrag nopan flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-300 hover:border-blue-500 text-blue-600 hover:text-blue-700 font-bold text-xs shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          title="Tambah jalur proses / swimlane baru"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Tambah Jalur Baru (+ Lane)</span>
        </button>
        <span className="text-[11px] text-slate-400 font-medium">
          Dobel klik nama jalur atau label pembatas untuk edit teks langsung
        </span>
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
// 12. GANTT HEADER NODE (Tabel Header Skala Waktu Mingguan & Harian)
export const GanttHeaderNode = memo((props: any) => {
  const { id, data, selected } = props;
  const { setNodes } = useReactFlow();
  const [editingField, setEditingField] = useState<{ type: 'title' | 'week'; index?: number } | null>(null);
  const [tempValue, setTempValue] = useState('');

  const weeks: string[] = data.weeks || ['WEEK 1', 'WEEK 2', 'WEEK 3', 'WEEK 4', 'WEEK 5', 'WEEK 6'];
  const showDays = data.showDays !== false;
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const width = data.width || Math.max(700, weeks.length * 150);
  const height = data.height || 360;

  const handleStartEdit = (e: React.MouseEvent, type: 'title' | 'week', initial: string, index?: number) => {
    e.stopPropagation();
    setEditingField({ type, index });
    setTempValue(initial);
  };

  const handleSave = () => {
    if (!editingField) return;
    if (editingField.type === 'title') {
      const newTitle = tempValue.trim() || data.title || 'Jadwal Proyek & Time Boxing';
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, title: newTitle, label: newTitle } } : n))
      );
    } else if (editingField.type === 'week' && typeof editingField.index === 'number') {
      const newWeeks = [...weeks];
      newWeeks[editingField.index] = tempValue.trim() || newWeeks[editingField.index];
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, weeks: newWeeks } } : n))
      );
    }
    setEditingField(null);
  };

  return (
    <div
      className={`relative rounded-2xl shadow-md border-2 border-slate-300 bg-white/95 overflow-hidden select-none ${
        selected ? 'ring-2 ring-blue-500 shadow-xl' : ''
      }`}
      style={{ width, height, minWidth: 400, minHeight: 200 }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={400} minHeight={200} />
      <NodeQuickActions id={id} selected={selected} />

      {/* Top Banner Bar */}
      <div className="bg-slate-800 text-white px-5 py-2.5 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2 flex-1 mr-4">
          <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
          {editingField?.type === 'title' ? (
            <input
              autoFocus
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') setEditingField(null);
              }}
              className="nodrag nopan px-2 py-0.5 text-xs font-bold rounded bg-slate-700 text-white border border-amber-400 outline-none w-full max-w-md"
            />
          ) : (
            <h4
              onDoubleClick={(e) => handleStartEdit(e, 'title', data.title || 'Jadwal Proyek & Time Boxing')}
              className="text-xs font-black tracking-wider cursor-pointer hover:text-amber-300 transition-colors uppercase truncate"
              title="Klik ganda untuk mengedit judul jadwal"
            >
              {data.title || 'Jadwal Proyek & Time Boxing'}
            </h4>
          )}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-300 font-semibold shrink-0">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> On Track</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Critical</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Complete</span>
        </div>
      </div>

      {/* Week Header Row */}
      <div className="flex border-b border-slate-300 bg-slate-100/90 text-slate-700 text-xs font-bold divide-x divide-slate-300">
        {weeks.map((week, idx) => (
          <div key={idx} className="flex-1 text-center py-1.5 flex flex-col justify-center px-1">
            {editingField?.type === 'week' && editingField.index === idx ? (
              <input
                autoFocus
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') setEditingField(null);
                }}
                className="nodrag nopan w-full text-center text-[10px] font-bold bg-white text-slate-900 rounded outline-none border border-blue-500 shadow-xs"
              />
            ) : (
              <span
                onDoubleClick={(e) => handleStartEdit(e, 'week', week, idx)}
                className="text-[11px] font-black uppercase tracking-tight text-slate-800 cursor-pointer hover:text-blue-600 transition-colors truncate"
                title="Klik ganda untuk mengedit nama minggu"
              >
                {week}
              </span>
            )}
            {showDays && (
              <div className="grid grid-cols-7 text-[9px] font-semibold text-slate-500 pt-1 border-t border-slate-200 mt-1 divide-x divide-slate-200">
                {days.map((d, dIdx) => (
                  <span key={dIdx} className={d === 'S' ? 'text-amber-600 bg-amber-50/50' : ''}>{d}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Vertical Grid Columns Body */}
      <div className="relative w-full h-[calc(100%-65px)] flex divide-x divide-slate-200/80 bg-[linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:100%_40px] pointer-events-none">
        {weeks.map((_, idx) => (
          <div key={idx} className="flex-1 h-full relative">
            {showDays && (
              <div className="grid grid-cols-7 h-full divide-x divide-slate-100">
                {days.map((_, dIdx) => (
                  <div key={dIdx} className="h-full" />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Marker Garis "Hari Ini / Today" jika ada */}
        {data.showToday && (
          <div
            className="absolute top-0 bottom-0 border-r-2 border-dashed border-amber-500 z-10 pointer-events-none"
            style={{ left: `${data.todayPercent || 42}%` }}
          >
            <span className="absolute -top-3 -translate-x-1/2 px-1.5 py-0.5 rounded bg-amber-500 text-white text-[9px] font-black shadow-xs">
              HARI INI
            </span>
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-slate-400" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-slate-400" />
    </div>
  );
});
GanttHeaderNode.displayName = 'GanttHeaderNode';

// 13. GANTT BAR NODE (Bilah Jadwal Tugas dengan Progress & Dependencies)
export const GanttBarNode = memo((props: any) => {
  const { id, data, selected } = props;
  const { setNodes } = useReactFlow();
  const [editingField, setEditingField] = useState<'label' | 'duration' | 'assignee' | null>(null);
  const [tempVal, setTempVal] = useState('');

  const status = data.status || 'on_track'; // 'on_track' | 'critical' | 'completed' | 'delayed'
  const progress = Math.min(100, Math.max(0, data.progress ?? 50));
  const duration = data.duration || 'W1 - W2';
  const label = data.label || 'Tugas Baru';

  const statusConfig: Record<string, { bg: string; fill: string; border: string; text: string; badge: string }> = {
    on_track: { bg: '#eff6ff', fill: '#3b82f6', border: '#2563eb', text: '#1e3a8a', badge: 'On Track' },
    critical: { bg: '#fef2f2', fill: '#ef4444', border: '#dc2626', text: '#991b1b', badge: 'Critical Path' },
    completed: { bg: '#ecfdf5', fill: '#10b981', border: '#059669', text: '#065f46', badge: 'Selesai 100%' },
    delayed: { bg: '#fffbeb', fill: '#f59e0b', border: '#d97706', text: '#92400e', badge: 'Tertunda' },
  };

  const currentStatus = statusConfig[status] || statusConfig.on_track;
  const barWidth = data.width || 220;
  const barHeight = data.height || 42;

  const handleStartEdit = (e: React.MouseEvent, field: 'label' | 'duration' | 'assignee', initial: string) => {
    e.stopPropagation();
    setEditingField(field);
    setTempVal(initial);
  };

  const handleSave = () => {
    if (!editingField) return;
    const trimmed = tempVal.trim();
    if (editingField === 'label') {
      const newLabel = trimmed || label;
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: newLabel } } : n))
      );
    } else if (editingField === 'duration') {
      const newDuration = trimmed || duration;
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, duration: newDuration } } : n))
      );
    } else if (editingField === 'assignee') {
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, assignee: trimmed } } : n))
      );
    }
    setEditingField(null);
  };

  const handleCycleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    const statuses = ['on_track', 'critical', 'completed', 'delayed'];
    const curIdx = statuses.indexOf(status);
    const nextStatus = statuses[(curIdx + 1) % statuses.length];
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, status: nextStatus } } : n))
    );
  };

  return (
    <div
      className={`relative rounded-xl shadow-md border-2 transition-all select-none overflow-hidden flex items-center justify-between px-3 group ${
        selected ? 'ring-2 ring-blue-500 shadow-xl' : ''
      }`}
      style={{
        width: barWidth,
        height: barHeight,
        minWidth: 100,
        backgroundColor: data.color || currentStatus.bg,
        borderColor: data.borderColor || currentStatus.border,
      }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={100} minHeight={34} />
      <NodeQuickActions id={id} selected={selected} />

      {/* Progress Fill Background */}
      <div
        className="absolute left-0 top-0 bottom-0 opacity-25 transition-all duration-300 pointer-events-none"
        style={{
          width: `${progress}%`,
          backgroundColor: currentStatus.fill,
        }}
      />

      {/* Task Content */}
      <div className="relative z-10 flex items-center gap-2 w-full pr-1">
        <button
          type="button"
          onClick={handleCycleStatus}
          className="nodrag nopan w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs hover:scale-125 transition-transform cursor-pointer"
          style={{ backgroundColor: currentStatus.fill }}
          title={`Status: ${currentStatus.badge}. Klik untuk mengganti status.`}
        />
        <div className="flex-1 min-w-0">
          {editingField === 'label' ? (
            <input
              autoFocus
              type="text"
              value={tempVal}
              onChange={(e) => setTempVal(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') setEditingField(null);
              }}
              className="nodrag nopan w-full text-xs font-bold bg-white text-slate-900 border border-blue-500 rounded px-1 outline-none shadow-xs"
            />
          ) : (
            <p
              onDoubleClick={(e) => handleStartEdit(e, 'label', label)}
              className="text-xs font-black truncate leading-tight cursor-pointer hover:underline"
              style={{ color: data.textColor || currentStatus.text }}
              title="Klik ganda untuk mengedit nama tugas"
            >
              {label}
            </p>
          )}

          <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-semibold leading-none pt-0.5">
            {editingField === 'duration' ? (
              <input
                autoFocus
                type="text"
                value={tempVal}
                onChange={(e) => setTempVal(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') setEditingField(null);
                }}
                className="nodrag nopan w-20 text-[9px] font-bold bg-white text-slate-900 border border-blue-500 rounded px-0.5 outline-none"
              />
            ) : (
              <span
                onDoubleClick={(e) => handleStartEdit(e, 'duration', duration)}
                className="cursor-pointer hover:text-blue-600 transition-colors"
                title="Klik ganda untuk mengedit durasi"
              >
                {duration}
              </span>
            )}
            {progress > 0 && <span>• {progress}%</span>}
            {editingField === 'assignee' ? (
              <input
                autoFocus
                type="text"
                value={tempVal}
                onChange={(e) => setTempVal(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') setEditingField(null);
                }}
                className="nodrag nopan w-24 text-[9px] font-bold bg-white text-slate-900 border border-blue-500 rounded px-0.5 outline-none"
              />
            ) : (
              <span
                onDoubleClick={(e) => handleStartEdit(e, 'assignee', data.assignee || 'Personil')}
                className="text-slate-600 truncate cursor-pointer hover:text-blue-600 transition-colors"
                title="Klik ganda untuk mengedit penanggung jawab"
              >
                • {data.assignee || 'Personil'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        className="!w-2.5 !h-2.5 !bg-slate-600 !border-2 !border-white hover:!bg-blue-600"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        className="!w-2.5 !h-2.5 !bg-slate-600 !border-2 !border-white hover:!bg-blue-600"
      />
      <Handle type="target" position={Position.Top} id="target-top" className="!w-1.5 !h-1.5 !bg-slate-400" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" className="!w-1.5 !h-1.5 !bg-slate-400" />
    </div>
  );
});
GanttBarNode.displayName = 'GanttBarNode';

// 14. MILESTONE NODE (Penanda Target Kunci / Capaian dengan Bintang Emas)
export const MilestoneNode = memo((props: any) => {
  const { id, data, selected } = props;
  const { setNodes } = useReactFlow();
  const [editingField, setEditingField] = useState<'label' | 'date' | null>(null);
  const [tempVal, setTempVal] = useState('');

  const label = data.label || 'Target Capaian';
  const date = data.date || 'Akhir Minggu';
  const color = data.color || '#fffbeb';
  const border = data.borderColor || '#f59e0b';
  const text = data.textColor || '#78350f';

  const handleStartEdit = (e: React.MouseEvent, field: 'label' | 'date', initial: string) => {
    e.stopPropagation();
    setEditingField(field);
    setTempVal(initial);
  };

  const handleSave = () => {
    if (!editingField) return;
    const trimmed = tempVal.trim();
    if (editingField === 'label') {
      const newLabel = trimmed || label;
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: newLabel } } : n))
      );
    } else if (editingField === 'date') {
      const newDate = trimmed || date;
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, date: newDate } } : n))
      );
    }
    setEditingField(null);
  };

  return (
    <div
      className={`relative px-3.5 py-2 rounded-xl shadow-md border-2 transition-all select-none flex items-center gap-2.5 min-w-[130px] group ${
        selected ? 'ring-2 ring-amber-500 shadow-xl' : ''
      }`}
      style={{ backgroundColor: color, borderColor: border, color: text }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={100} minHeight={36} />
      <NodeQuickActions id={id} selected={selected} />

      <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
        <Star className="w-3.5 h-3.5 fill-white" />
      </div>

      <div className="min-w-0 flex-1">
        {editingField === 'label' ? (
          <input
            autoFocus
            type="text"
            value={tempVal}
            onChange={(e) => setTempVal(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setEditingField(null);
            }}
            className="nodrag nopan w-full text-xs font-bold bg-white text-slate-900 border border-amber-500 rounded px-1 outline-none shadow-xs"
          />
        ) : (
          <h5
            onDoubleClick={(e) => handleStartEdit(e, 'label', label)}
            className="text-xs font-black truncate cursor-pointer tracking-tight hover:underline"
            title="Klik ganda untuk mengedit nama milestone"
          >
            {label}
          </h5>
        )}

        {editingField === 'date' ? (
          <input
            autoFocus
            type="text"
            value={tempVal}
            onChange={(e) => setTempVal(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setEditingField(null);
            }}
            className="nodrag nopan w-full text-[10px] font-bold bg-white text-slate-900 border border-amber-500 rounded px-1 outline-none shadow-xs mt-0.5"
          />
        ) : (
          <p
            onDoubleClick={(e) => handleStartEdit(e, 'date', date)}
            className="text-[10px] opacity-80 font-semibold truncate cursor-pointer hover:underline"
            title="Klik ganda untuk mengedit tanggal/tenggat"
          >
            {date}
          </p>
        )}
      </div>

      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-amber-600" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-amber-600" />
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-amber-600" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-amber-600" />
    </div>
  );
});
MilestoneNode.displayName = 'MilestoneNode';

// 15. VERTICAL TIMELINE NODE (Titik Garis Waktu Vertikal dengan Dot & Penjelasan)
export const VerticalTimelineNode = memo((props: any) => {
  const { id, data, selected } = props;
  const { setNodes } = useReactFlow();
  const [editingField, setEditingField] = useState<'date' | 'title' | 'description' | null>(null);
  const [tempVal, setTempVal] = useState('');

  const date = data.date || '10 Oktober';
  const title = data.title || data.label || 'Tahap Proyek';
  const description = data.description || '';
  const accent = data.accentColor || '#3b82f6';
  const width = data.width || 340;

  const handleStartEdit = (e: React.MouseEvent, field: 'date' | 'title' | 'description', current: string) => {
    e.stopPropagation();
    setEditingField(field);
    setTempVal(current);
  };

  const handleSave = () => {
    if (!editingField) return;
    const trimmed = tempVal.trim();
    if (editingField === 'title') {
      const val = trimmed.length > 0 ? trimmed : 'Tahap Proyek';
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, title: val, label: val } } : n))
      );
    } else if (editingField === 'date') {
      const val = trimmed.length > 0 ? trimmed : '10 Oktober';
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, date: val } } : n))
      );
    } else if (editingField === 'description') {
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, description: trimmed } } : n))
      );
    }
    setEditingField(null);
  };

  return (
    <div
      className="relative flex items-start gap-3 select-none group"
      style={{ width, minWidth: 260 }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={240} minHeight={60} />
      <NodeQuickActions id={id} selected={selected} />

      {/* Date / Time Badge di sebelah kiri */}
      <div className="w-24 text-right pt-2 shrink-0">
        {editingField === 'date' ? (
          <input
            autoFocus
            type="text"
            value={tempVal}
            onChange={(e) => setTempVal(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setEditingField(null);
            }}
            className="nodrag nopan w-full text-xs font-black tracking-tight text-right border border-blue-500 rounded px-1 bg-white outline-none"
          />
        ) : (
          <span
            onDoubleClick={(e) => handleStartEdit(e, 'date', date)}
            className="text-xs font-black tracking-tight cursor-pointer hover:underline"
            style={{ color: accent }}
            title="Klik ganda untuk mengedit tanggal/tenggat"
          >
            {date}
          </span>
        )}
      </div>

      {/* Circular Dot dengan Jalur Tengah */}
      <div className="relative flex flex-col items-center shrink-0 pt-2">
        <div
          className="w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center shadow-xs z-10"
          style={{ borderColor: accent }}
        >
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
        </div>
      </div>

      {/* Content Card di sebelah kanan */}
      <div
        className="flex-1 rounded-xl p-3 shadow-sm border transition-all bg-white"
        style={{
          borderLeftWidth: '3px',
          borderLeftColor: accent,
          backgroundColor: data.color || '#ffffff',
          borderColor: data.borderColor || '#e2e8f0',
        }}
      >
        {editingField === 'title' ? (
          <input
            autoFocus
            type="text"
            value={tempVal}
            onChange={(e) => setTempVal(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setEditingField(null);
            }}
            className="nodrag nopan w-full text-xs font-bold border border-blue-500 rounded px-1 outline-none mb-1 bg-white"
          />
        ) : (
          <h4
            onDoubleClick={(e) => handleStartEdit(e, 'title', title)}
            className="text-xs font-black text-slate-800 cursor-text hover:text-blue-600 transition-colors"
            title="Klik ganda untuk mengedit judul tahap"
          >
            {title}
          </h4>
        )}

        {editingField === 'description' ? (
          <textarea
            autoFocus
            rows={2}
            value={tempVal}
            onChange={(e) => setTempVal(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSave();
              }
              if (e.key === 'Escape') setEditingField(null);
            }}
            className="nodrag nopan w-full text-[11px] border border-blue-500 rounded p-1 outline-none bg-white leading-relaxed mt-1"
          />
        ) : (
          <p
            onDoubleClick={(e) => handleStartEdit(e, 'description', description || 'Deskripsi detail langkah atau target...')}
            className="text-[11px] text-slate-600 leading-relaxed font-normal pt-0.5 cursor-text hover:text-slate-900 transition-colors"
            title="Klik ganda untuk mengedit deskripsi tahap"
          >
            {description || 'Deskripsi detail langkah atau target yang harus diselesaikan pada periode ini.'}
          </p>
        )}
      </div>

      {/* Handles untuk menyambungkan garis waktu vertikal */}
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-slate-400" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-slate-400" />
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-slate-400" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-slate-400" />
    </div>
  );
});
VerticalTimelineNode.displayName = 'VerticalTimelineNode';

// 16. TIMEBOX CARD NODE (Kartu Time Boxing Blok Waktu Kerja Harian)
export const TimeboxCardNode = memo((props: any) => {
  const { id, data, selected } = props;
  const { setNodes } = useReactFlow();
  const [editingField, setEditingField] = useState<{ type: 'day' | 'hours' | 'task'; index?: number } | null>(null);
  const [tempVal, setTempVal] = useState('');

  const day = data.day || 'SENIN';
  const hours = data.hours || '08:00 - 12:00';
  const tasks: string[] = Array.isArray(data.tasks) ? data.tasks : ['Riset Ide & Mindmap', 'Sketsa Topologi Awal'];
  const color = data.color || '#eff6ff';
  const border = data.borderColor || '#3b82f6';
  const width = data.width || 220;

  const handleStartEdit = (e: React.MouseEvent, type: 'day' | 'hours' | 'task', initial: string, index?: number) => {
    e.stopPropagation();
    setEditingField({ type, index });
    setTempVal(initial);
  };

  const handleSave = () => {
    if (!editingField) return;
    const trimmed = tempVal.trim();
    if (editingField.type === 'day') {
      const newDay = trimmed || day;
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, day: newDay } } : n))
      );
    } else if (editingField.type === 'hours') {
      const newHours = trimmed || hours;
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, hours: newHours } } : n))
      );
    } else if (editingField.type === 'task' && typeof editingField.index === 'number') {
      const newTasks = [...tasks];
      newTasks[editingField.index] = trimmed || newTasks[editingField.index];
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, tasks: newTasks } } : n))
      );
    }
    setEditingField(null);
  };

  const handleAddTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newTasks = [...tasks, 'Aktivitas Baru'];
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, tasks: newTasks } } : n))
    );
  };

  const handleDeleteTask = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (tasks.length <= 1) return;
    const newTasks = tasks.filter((_, i) => i !== index);
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, tasks: newTasks } } : n))
    );
  };

  return (
    <div
      className={`relative rounded-2xl shadow-md border-2 overflow-hidden select-none ${
        selected ? 'ring-2 ring-blue-500 shadow-xl' : ''
      }`}
      style={{ width, backgroundColor: color, borderColor: border }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={160} minHeight={100} />
      <NodeQuickActions id={id} selected={selected} />

      {/* Header Day & Hours */}
      <div className="px-3.5 py-2 border-b flex items-center justify-between" style={{ borderColor: `${border}40`, backgroundColor: `${border}15` }}>
        {editingField?.type === 'day' ? (
          <input
            autoFocus
            type="text"
            value={tempVal}
            onChange={(e) => setTempVal(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setEditingField(null);
            }}
            className="nodrag nopan text-[11px] font-black uppercase tracking-wider bg-white text-slate-900 rounded px-1 outline-none border border-blue-500 shadow-xs max-w-[100px]"
          />
        ) : (
          <span
            onDoubleClick={(e) => handleStartEdit(e, 'day', day)}
            className="text-[11px] font-black uppercase tracking-wider text-slate-900 cursor-pointer hover:underline"
            title="Klik ganda untuk mengedit hari"
          >
            {day}
          </span>
        )}

        {editingField?.type === 'hours' ? (
          <input
            autoFocus
            type="text"
            value={tempVal}
            onChange={(e) => setTempVal(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setEditingField(null);
            }}
            className="nodrag nopan text-[10px] font-bold bg-white text-slate-900 rounded px-1 outline-none border border-blue-500 shadow-xs max-w-[120px]"
          />
        ) : (
          <span
            onDoubleClick={(e) => handleStartEdit(e, 'hours', hours)}
            className="text-[10px] font-bold text-slate-600 flex items-center gap-1 cursor-pointer hover:underline"
            title="Klik ganda untuk mengedit jam/sesi"
          >
            <Clock className="w-3 h-3 shrink-0" />
            <span className="truncate">{hours}</span>
          </span>
        )}
      </div>

      {/* Tasks List */}
      <div className="p-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Fokus Time-Box:</p>
          <button
            type="button"
            onClick={handleAddTask}
            className="nodrag nopan p-0.5 rounded text-slate-500 hover:text-blue-600 hover:bg-white/80 transition-colors cursor-pointer"
            title="Tambah butir fokus"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {tasks.map((task, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 group/task">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: border }} />
            {editingField?.type === 'task' && editingField.index === i ? (
              <input
                autoFocus
                type="text"
                value={tempVal}
                onChange={(e) => setTempVal(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') setEditingField(null);
                }}
                className="nodrag nopan flex-1 text-xs font-semibold bg-white text-slate-900 rounded px-1 outline-none border border-blue-500 shadow-xs"
              />
            ) : (
              <span
                onDoubleClick={(e) => handleStartEdit(e, 'task', task, i)}
                className="truncate flex-1 cursor-pointer hover:underline"
                title="Klik ganda untuk mengedit aktivitas"
              >
                {task}
              </span>
            )}
            {tasks.length > 1 && (
              <button
                type="button"
                onClick={(e) => handleDeleteTask(e, i)}
                className="nodrag nopan opacity-0 group-hover/task:opacity-100 p-0.5 text-slate-400 hover:text-red-500 transition-opacity cursor-pointer shrink-0"
                title="Hapus butir ini"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-slate-400" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-slate-400" />
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-slate-400" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-slate-400" />
    </div>
  );
});
TimeboxCardNode.displayName = 'TimeboxCardNode';

// 17. MULTI-PHASE GANTT NODE (Master Jadwal Proyek 20-Minggu Multi-Fase & Milestone)
export interface MultiPhaseGanttTask {
  id: string;
  phaseId: string;
  name: string;
  startWeek: number; // 1 to 20
  endWeek: number;   // 1 to 20
  color: string;
  textColor?: string;
  notes?: string;
}

export interface MultiPhaseGanttPhase {
  id: string;
  name: string;
  color: string;
  textColor: string;
}

const DEFAULT_GANTT_WEEKS = Array.from({ length: 20 }, (_, i) => i + 1);

const DEFAULT_GANTT_DATES = [
  'Jan 5', 'Jan 12', 'Jan 19', 'Jan 26', 
  'Feb 2', 'Feb 9', 'Feb 16', 'Feb 23', 
  'Mar 2', 'Mar 9', 'Mar 16', 'Mar 23', 'Mar 30', 
  'Apr 6', 'Apr 13', 'Apr 20', 'Apr 27', 
  'May 4', 'May 11', 'May 18'
];

const DEFAULT_GANTT_PHASES: MultiPhaseGanttPhase[] = [
  { id: 'p1', name: 'Phase One', color: '#dc2626', textColor: '#ffffff' },
  { id: 'p2', name: 'Phase Two', color: '#ffe4e6', textColor: '#9f1239' },
  { id: 'p3', name: 'Phase Three', color: '#dc2626', textColor: '#ffffff' },
];

const DEFAULT_GANTT_TASKS: MultiPhaseGanttTask[] = [
  // Phase One (Navy #1e293b)
  { id: 't1', phaseId: 'p1', name: 'Quality Assurance Plan', startWeek: 1, endWeek: 5, color: '#1e293b', textColor: '#ffffff', notes: 'Text Here' },
  { id: 't2', phaseId: 'p1', name: 'Project Plan', startWeek: 2, endWeek: 4, color: '#1e293b', textColor: '#ffffff', notes: 'Text Here' },
  { id: 't3', phaseId: 'p1', name: 'Review Plan', startWeek: 3, endWeek: 5, color: '#1e293b', textColor: '#ffffff', notes: 'Text Here' },

  // Phase Two (Coral Red #e11d48)
  { id: 't4', phaseId: 'p2', name: 'Drafting Requirements', startWeek: 4, endWeek: 6, color: '#e11d48', textColor: '#ffffff', notes: 'Text Here' },
  { id: 't5', phaseId: 'p2', name: 'Capacity Planning', startWeek: 4, endWeek: 6, color: '#e11d48', textColor: '#ffffff', notes: 'Text Here' },
  { id: 't6', phaseId: 'p2', name: 'Project Test Plan', startWeek: 5, endWeek: 7, color: '#e11d48', textColor: '#ffffff', notes: 'Text Here' },
  { id: 't7', phaseId: 'p2', name: 'Acceptance Test Plan', startWeek: 5, endWeek: 7, color: '#e11d48', textColor: '#ffffff', notes: 'Text Here' },
  { id: 't8', phaseId: 'p2', name: 'Specifying Final Requirements', startWeek: 7, endWeek: 11, color: '#e11d48', textColor: '#ffffff', notes: 'Text Here' },
  { id: 't9', phaseId: 'p2', name: 'Review and Approval', startWeek: 7, endWeek: 10, color: '#e11d48', textColor: '#ffffff', notes: 'Text Here' },

  // Phase Three (Amber #f59e0b)
  { id: 't10', phaseId: 'p3', name: 'Specifying Draft Design', startWeek: 8, endWeek: 11, color: '#f59e0b', textColor: '#ffffff', notes: 'Text Here' },
  { id: 't11', phaseId: 'p3', name: 'Configuration Management Plan', startWeek: 8, endWeek: 12, color: '#f59e0b', textColor: '#ffffff', notes: 'Text Here' },
  { id: 't12', phaseId: 'p3', name: 'Architecture Design Plan', startWeek: 8, endWeek: 11, color: '#f59e0b', textColor: '#ffffff', notes: 'Text Here' },
  { id: 't13', phaseId: 'p3', name: 'Defining Interface Requirements', startWeek: 8, endWeek: 13, color: '#f59e0b', textColor: '#ffffff', notes: 'Text Here' },
  { id: 't14', phaseId: 'p3', name: 'Shared Component Design', startWeek: 11, endWeek: 15, color: '#f59e0b', textColor: '#ffffff', notes: 'Text Here' },
  { id: 't15', phaseId: 'p3', name: 'Text Here', startWeek: 11, endWeek: 13, color: '#f59e0b', textColor: '#ffffff', notes: 'Text Here' },
  { id: 't16', phaseId: 'p3', name: 'Defining Project Guidelines', startWeek: 12, endWeek: 18, color: '#f59e0b', textColor: '#ffffff', notes: 'Text Here' },
  { id: 't17', phaseId: 'p3', name: 'Specifying Final Design', startWeek: 13, endWeek: 17, color: '#f59e0b', textColor: '#ffffff', notes: 'Text Here' },
  { id: 't18', phaseId: 'p3', name: 'Text Here', startWeek: 15, endWeek: 18, color: '#f59e0b', textColor: '#ffffff', notes: 'Text Here' },
];

const GANTT_COLOR_PALETTES = [
  '#1e293b', // Navy
  '#e11d48', // Coral Red
  '#f59e0b', // Amber Orange
  '#059669', // Emerald Green
  '#2563eb', // Royal Blue
  '#7c3aed', // Purple
];

export const MultiPhaseGanttNode = memo((props: any) => {
  const { id, data, selected } = props;
  const { setNodes } = useReactFlow();

  const weeks: number[] = data.weeks || DEFAULT_GANTT_WEEKS;
  const dates: string[] = data.dates || DEFAULT_GANTT_DATES;
  const phases: MultiPhaseGanttPhase[] = data.phases || DEFAULT_GANTT_PHASES;
  const tasks: MultiPhaseGanttTask[] = data.tasks || DEFAULT_GANTT_TASKS;
  const milestoneFunds = data.milestoneFunds || { name: 'Milestone : Additional Funds', week: 7 };
  const milestoneEnd = data.milestoneEnd || { name: 'Project End', week: 20 };
  const notesTitle = data.notesTitle || 'Notes';
  const width = data.width || 1200;
  const height = data.height || 680;

  const [editingField, setEditingField] = useState<{ type: string; id: string; index?: number } | null>(null);
  const [tempVal, setTempVal] = useState('');

  const updateData = (newData: Partial<any>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...newData } } : n))
    );
  };

  const handleStartEdit = (e: React.MouseEvent | undefined, type: string, targetId: string, val: string, index?: number) => {
    e?.stopPropagation();
    setEditingField({ type, id: targetId, index });
    setTempVal(val);
  };

  const handleSaveEdit = () => {
    if (!editingField) return;
    const { type, id: targetId, index } = editingField;

    if (type === 'task') {
      const updated = tasks.map((t) => (t.id === targetId ? { ...t, name: tempVal || t.name } : t));
      updateData({ tasks: updated });
    } else if (type === 'note') {
      const updated = tasks.map((t) => (t.id === targetId ? { ...t, notes: tempVal } : t));
      updateData({ tasks: updated });
    } else if (type === 'phase') {
      const updated = phases.map((p) => (p.id === targetId ? { ...p, name: tempVal || p.name } : p));
      updateData({ phases: updated });
    } else if (type === 'date' && typeof index === 'number') {
      const updated = [...dates];
      updated[index] = tempVal || updated[index];
      updateData({ dates: updated });
    } else if (type === 'milestone-funds') {
      updateData({ milestoneFunds: { ...milestoneFunds, name: tempVal || milestoneFunds.name } });
    } else if (type === 'milestone-end') {
      updateData({ milestoneEnd: { ...milestoneEnd, name: tempVal || milestoneEnd.name } });
    } else if (type === 'notes-title') {
      updateData({ notesTitle: tempVal || notesTitle });
    }

    setEditingField(null);
  };

  const handleShiftTask = (taskId: string, delta: number) => {
    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;
      const nextStart = t.startWeek + delta;
      const nextEnd = t.endWeek + delta;
      if (nextStart < 1 || nextEnd > 20) return t;
      return { ...t, startWeek: nextStart, endWeek: nextEnd };
    });
    updateData({ tasks: updated });
  };

  const handleDurationTask = (taskId: string, delta: number) => {
    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;
      const nextEnd = t.endWeek + delta;
      if (nextEnd < t.startWeek || nextEnd > 20) return t;
      return { ...t, endWeek: nextEnd };
    });
    updateData({ tasks: updated });
  };

  const handleCycleColor = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;
      const curIdx = GANTT_COLOR_PALETTES.indexOf(t.color);
      const nextColor = GANTT_COLOR_PALETTES[(curIdx + 1) % GANTT_COLOR_PALETTES.length];
      return { ...t, color: nextColor };
    });
    updateData({ tasks: updated });
  };

  const handleAddTask = (phaseId: string) => {
    const phaseTasks = tasks.filter((t) => t.phaseId === phaseId);
    const lastTask = phaseTasks[phaseTasks.length - 1];
    const newStart = lastTask ? Math.min(20, lastTask.startWeek + 1) : 1;
    const newEnd = Math.min(20, newStart + 2);
    const newTask: MultiPhaseGanttTask = {
      id: `task-${Date.now()}`,
      phaseId,
      name: 'Tugas Baru',
      startWeek: newStart,
      endWeek: newEnd,
      color: phaseId === 'p1' ? '#1e293b' : phaseId === 'p2' ? '#e11d48' : '#f59e0b',
      textColor: '#ffffff',
      notes: 'Text Here',
    };
    updateData({ tasks: [...tasks, newTask] });
  };

  const gridRef = useRef<HTMLDivElement>(null);

  const handleStartBarDrag = (
    e: React.MouseEvent,
    task: MultiPhaseGanttTask,
    mode: 'move' | 'resize-start' | 'resize-end'
  ) => {
    e.stopPropagation();
    e.preventDefault();
    if (!gridRef.current) return;

    const startX = e.clientX;
    const origStart = task.startWeek;
    const origEnd = task.endWeek;
    const duration = origEnd - origStart;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!gridRef.current) return;
      const rect = gridRef.current.getBoundingClientRect();
      const colWidth = rect.width / 20;
      const deltaX = moveEvent.clientX - startX;
      const deltaWeeks = Math.round(deltaX / colWidth);

      if (mode === 'move') {
        const newStart = Math.max(1, Math.min(20 - duration, origStart + deltaWeeks));
        const newEnd = newStart + duration;
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id !== id) return n;
            const updated = ((n.data as any).tasks || []).map((t: MultiPhaseGanttTask) =>
              t.id === task.id ? { ...t, startWeek: newStart, endWeek: newEnd } : t
            );
            return { ...n, data: { ...n.data, tasks: updated } };
          })
        );
      } else if (mode === 'resize-start') {
        const newStart = Math.max(1, Math.min(origEnd, origStart + deltaWeeks));
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id !== id) return n;
            const updated = ((n.data as any).tasks || []).map((t: MultiPhaseGanttTask) =>
              t.id === task.id ? { ...t, startWeek: newStart } : t
            );
            return { ...n, data: { ...n.data, tasks: updated } };
          })
        );
      } else if (mode === 'resize-end') {
        const newEnd = Math.max(origStart, Math.min(20, origEnd + deltaWeeks));
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id !== id) return n;
            const updated = ((n.data as any).tasks || []).map((t: MultiPhaseGanttTask) =>
              t.id === task.id ? { ...t, endWeek: newEnd } : t
            );
            return { ...n, data: { ...n.data, tasks: updated } };
          })
        );
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleDuplicateTask = (task: MultiPhaseGanttTask) => {
    const newTask: MultiPhaseGanttTask = {
      ...task,
      id: `task-${Date.now()}`,
      name: `${task.name} (Salinan)`,
      startWeek: Math.min(20, task.startWeek + 1),
      endWeek: Math.min(20, task.endWeek + 1),
    };
    updateData({ tasks: [...tasks, newTask] });
  };

  const handleAddPhase = () => {
    const nextIdx = phases.length + 1;
    const colors = ['#dc2626', '#ffe4e6', '#f59e0b', '#059669', '#2563eb', '#7c3aed'];
    const chosenColor = colors[(nextIdx - 1) % colors.length];
    const newPhase: MultiPhaseGanttPhase = {
      id: `p${Date.now()}`,
      name: `Phase ${nextIdx}`,
      color: chosenColor,
      textColor: chosenColor === '#ffe4e6' ? '#9f1239' : '#ffffff',
    };
    const newTask: MultiPhaseGanttTask = {
      id: `task-${Date.now()}`,
      phaseId: newPhase.id,
      name: `Tugas Baru Fase ${nextIdx}`,
      startWeek: 1,
      endWeek: 4,
      color: chosenColor === '#ffe4e6' ? '#e11d48' : chosenColor,
      textColor: '#ffffff',
      notes: 'Text Here',
    };
    updateData({
      phases: [...phases, newPhase],
      tasks: [...tasks, newTask],
    });
  };

  const handleDeleteTask = (taskId: string) => {
    if (tasks.length <= 1) return;
    updateData({ tasks: tasks.filter((t) => t.id !== taskId) });
  };

  // Group tasks by phase
  const p1Tasks = tasks.filter((t) => t.phaseId === 'p1');
  const p2Tasks = tasks.filter((t) => t.phaseId === 'p2');
  const p3Tasks = tasks.filter((t) => t.phaseId === 'p3');
  const totalTasksCount = Math.max(1, tasks.length);
  const fundsTopPercent = ((p1Tasks.length + p2Tasks.length) / totalTasksCount) * 100;

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-xl border-2 border-slate-300 overflow-hidden select-none flex flex-col font-sans transition-all ${
        selected ? 'ring-2 ring-blue-500 shadow-2xl' : ''
      }`}
      style={{ width, height, minWidth: 800, minHeight: 460 }}
    >
      <UniversalNodeResizer id={id} isVisible={selected} minWidth={800} minHeight={460} />
      <NodeQuickActions id={id} selected={selected} />

      {/* TOP HEADER 1: WEEK NUMBERS (Navy) + NOTES (Orange) */}
      <div className="flex bg-[#0f2744] text-white border-b border-slate-700/80 shrink-0">
        <div className="w-[120px] shrink-0 font-black text-xs uppercase tracking-wider text-center py-2 flex items-center justify-center border-r border-slate-700">
          Week
        </div>
        <div className="flex-1 grid grid-cols-20 divide-x divide-slate-700/50 text-center py-2 text-xs font-black">
          {weeks.map((w) => (
            <div key={w} className="flex items-center justify-center truncate">
              {w}
            </div>
          ))}
        </div>
        <div 
          className="w-[130px] shrink-0 bg-[#ea580c] font-black text-xs uppercase tracking-wider text-center py-2 flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors"
          onDoubleClick={(e) => handleStartEdit(e, 'notes-title', 'notes', notesTitle)}
          title="Klik ganda untuk mengubah judul Notes"
        >
          {editingField?.type === 'notes-title' ? (
            <input
              autoFocus
              type="text"
              value={tempVal}
              onChange={(e) => setTempVal(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') setEditingField(null);
              }}
              className="nodrag nopan w-full text-center text-xs font-bold bg-white text-slate-900 rounded px-1 outline-none"
            />
          ) : (
            <span>{notesTitle}</span>
          )}
        </div>
      </div>

      {/* TOP HEADER 2: STARTING DATES (Light Ice Blue) */}
      <div className="flex bg-[#e2e8f0] text-slate-700 border-b border-slate-300 shrink-0">
        <div className="w-[120px] shrink-0 font-extrabold text-[11px] text-center py-1.5 flex items-center justify-center border-r border-slate-300 bg-[#cbd5e1] text-slate-800">
          Starting
        </div>
        <div className="flex-1 grid grid-cols-20 divide-x divide-slate-300 text-center py-1 text-[10px] font-semibold text-slate-700">
          {dates.map((d, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center px-0.5 truncate cursor-pointer hover:bg-sky-100/60 transition-colors"
              onDoubleClick={(e) => handleStartEdit(e, 'date', `date-${idx}`, d, idx)}
              title="Klik ganda untuk mengubah tanggal mulai"
            >
              {editingField?.type === 'date' && editingField.index === idx ? (
                <input
                  autoFocus
                  type="text"
                  value={tempVal}
                  onChange={(e) => setTempVal(e.target.value)}
                  onBlur={handleSaveEdit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') setEditingField(null);
                  }}
                  className="nodrag nopan w-full text-center text-[10px] font-bold bg-white text-slate-900 rounded outline-none shadow-xs"
                />
              ) : (
                <span>{d}</span>
              )}
            </div>
          ))}
        </div>
        <div className="w-[130px] shrink-0 bg-[#f1f5f9] border-l border-slate-300" />
      </div>

      {/* MAIN BODY AREA: PHASES + 20-WEEK GRID + NOTES */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Phase Column */}
        <div className="w-[120px] shrink-0 flex flex-col border-r border-slate-300">
          {phases.map((phase) => {
            const phaseTasks = tasks.filter((t) => t.phaseId === phase.id);
            const flexWeight = Math.max(1, phaseTasks.length);
            return (
              <div
                key={phase.id}
                className="flex items-center justify-center p-2 text-center font-black text-xs uppercase cursor-pointer hover:opacity-90 transition-opacity border-b border-slate-300 relative group"
                style={{
                  flex: flexWeight,
                  backgroundColor: phase.color,
                  color: phase.textColor,
                }}
                onDoubleClick={(e) => handleStartEdit(e, 'phase', phase.id, phase.name)}
                title="Klik ganda untuk mengedit nama fase"
              >
                {editingField?.type === 'phase' && editingField.id === phase.id ? (
                  <input
                    autoFocus
                    type="text"
                    value={tempVal}
                    onChange={(e) => setTempVal(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') setEditingField(null);
                    }}
                    className="nodrag nopan w-full text-center text-xs font-bold bg-white text-slate-900 rounded px-1 py-0.5 outline-none shadow-xs"
                  />
                ) : (
                  <span className="leading-tight drop-shadow-xs">{phase.name}</span>
                )}

                {/* Tombol Tambah Tugas di Fase Ini */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddTask(phase.id);
                  }}
                  className="nodrag nopan absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-slate-900 p-0.5 rounded shadow-xs text-[10px] font-bold no-print cursor-pointer"
                  title="Tambah tugas di fase ini"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Middle 20-Week Grid Area */}
        <div ref={gridRef} className="flex-1 relative flex flex-col bg-white">
          {/* 20 Vertical Grid Guidelines */}
          <div className="absolute inset-0 grid grid-cols-20 divide-x divide-slate-200/70 pointer-events-none">
            {Array.from({ length: 20 }).map((_, cIdx) => (
              <div key={cIdx} className="h-full" />
            ))}
          </div>

          {/* Vertical Milestone: Additional Funds (Column 7 / Week 7, Phase 3 Area) */}
          <div
            className="absolute bg-[#bfdbfe] border-x border-[#93c5fd] z-10 flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors shadow-2xs"
            style={{
              left: `${(7 - 1) * 5}%`,
              width: '5%',
              top: `${fundsTopPercent}%`,
              bottom: 0,
            }}
            title="Klik ganda untuk mengubah teks Milestone"
            onDoubleClick={(e) => handleStartEdit(e, 'milestone-funds', 'funds', milestoneFunds.name)}
          >
            {editingField?.type === 'milestone-funds' ? (
              <input
                autoFocus
                type="text"
                value={tempVal}
                onChange={(e) => setTempVal(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') setEditingField(null);
                }}
                className="nodrag nopan w-full text-center text-[10px] font-bold bg-white text-slate-900 rounded px-1 outline-none"
              />
            ) : (
              <span
                className="text-[10px] font-extrabold text-[#1e3a8a] whitespace-nowrap select-none tracking-wide"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                }}
              >
                {milestoneFunds.name}
              </span>
            )}
          </div>

          {/* Vertical Milestone: Project End (Column 20 / Week 20, Spanning Full Height) */}
          <div
            className="absolute bg-[#3b82f6] border-x border-blue-600 z-10 flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors shadow-2xs"
            style={{
              left: `${(20 - 1) * 5}%`,
              width: '5%',
              top: 0,
              bottom: 0,
            }}
            title="Klik ganda untuk mengubah teks Project End"
            onDoubleClick={(e) => handleStartEdit(e, 'milestone-end', 'end', milestoneEnd.name)}
          >
            {editingField?.type === 'milestone-end' ? (
              <input
                autoFocus
                type="text"
                value={tempVal}
                onChange={(e) => setTempVal(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') setEditingField(null);
                }}
                className="nodrag nopan w-full text-center text-[10px] font-bold bg-white text-slate-900 rounded px-1 outline-none"
              />
            ) : (
              <span
                className="text-[11px] font-extrabold text-white whitespace-nowrap select-none tracking-widest"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                }}
              >
                {milestoneEnd.name}
              </span>
            )}
          </div>

          {/* Task Rows Stack */}
          <div className="relative z-20 flex-1 flex flex-col divide-y divide-slate-200/50">
            {tasks.map((task) => (
              <div key={task.id} className="flex-1 flex items-center relative px-0.5 group">
                {/* Gantt Bar dengan Mouse Drag & Resize Handle Interaktif */}
                <div
                  className="nodrag nopan absolute h-[26px] rounded-xs flex items-center px-2 cursor-grab active:cursor-grabbing shadow-xs hover:shadow-md transition-all group-hover:brightness-105 select-none"
                  style={{
                    left: `${(task.startWeek - 1) * 5}%`,
                    width: `${(task.endWeek - task.startWeek + 1) * 5}%`,
                    backgroundColor: task.color,
                    color: task.textColor || '#ffffff',
                  }}
                  onMouseDown={(e) => handleStartBarDrag(e, task, 'move')}
                  onDoubleClick={(e) => handleStartEdit(e, 'task', task.id, task.name)}
                  title={`${task.name} (Minggu ${task.startWeek} - ${task.endWeek}) • Tarik tengah untuk geser minggu • Tarik tepi untuk ubah durasi • Dobel klik untuk edit`}
                >
                  {/* Handle Resize Kiri (Ubah Minggu Mulai) */}
                  <div
                    className="nodrag nopan absolute left-0 top-0 bottom-0 w-2.5 cursor-ew-resize hover:bg-white/40 rounded-l-xs z-10"
                    onMouseDown={(e) => handleStartBarDrag(e, task, 'resize-start')}
                    title="Tarik untuk mengubah minggu mulai"
                  />

                  {editingField?.type === 'task' && editingField.id === task.id ? (
                    <input
                      autoFocus
                      type="text"
                      value={tempVal}
                      onChange={(e) => setTempVal(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') setEditingField(null);
                      }}
                      className="nodrag nopan w-full text-[11px] font-bold bg-white text-slate-900 rounded px-1 outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-[10px] md:text-[11px] font-bold truncate tracking-tight pointer-events-none drop-shadow-2xs">
                      {task.name}
                    </span>
                  )}

                  {/* Handle Resize Kanan (Ubah Minggu Selesai) */}
                  <div
                    className="nodrag nopan absolute right-0 top-0 bottom-0 w-2.5 cursor-ew-resize hover:bg-white/40 rounded-r-xs z-10"
                    onMouseDown={(e) => handleStartBarDrag(e, task, 'resize-end')}
                    title="Tarik untuk mengubah minggu selesai"
                  />
                </div>

                {/* Quick Task Adjuster Controls on Hover */}
                <div className="nodrag nopan absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded-lg shadow-md border border-slate-200 flex items-center gap-1 z-30 no-print">
                  <button
                    onClick={() => handleShiftTask(task.id, -1)}
                    disabled={task.startWeek <= 1}
                    className="p-0.5 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Geser Kiri 1 Minggu"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleShiftTask(task.id, 1)}
                    disabled={task.endWeek >= 20}
                    className="p-0.5 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Geser Kanan 1 Minggu"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDurationTask(task.id, -1)}
                    disabled={task.endWeek <= task.startWeek}
                    className="px-1 text-[10px] font-bold hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Perpendek 1 Minggu"
                  >
                    -1W
                  </button>
                  <button
                    onClick={() => handleDurationTask(task.id, 1)}
                    disabled={task.endWeek >= 20}
                    className="px-1 text-[10px] font-bold hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Perpanjang 1 Minggu"
                  >
                    +1W
                  </button>
                  <button
                    onClick={() => handleDuplicateTask(task)}
                    className="p-0.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded cursor-pointer transition-colors"
                    title="Duplikat Tugas Ini"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleCycleColor(task.id)}
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: task.color }}
                    title="Ganti Warna Bilah (Navy / Merah / Oranye / Hijau / Biru / Ungu)"
                  />
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-0.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded cursor-pointer transition-colors"
                    title="Hapus Tugas Ini"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Notes Column */}
        <div className="w-[130px] shrink-0 flex flex-col border-l border-slate-300 divide-y divide-slate-200/70 bg-white">
          {tasks.map((task) => (
            <div
              key={`note-${task.id}`}
              className="flex-1 flex items-center px-2.5 text-[11px] font-medium text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors"
              onDoubleClick={(e) => handleStartEdit(e, 'note', task.id, task.notes || 'Text Here')}
              title="Klik ganda untuk mengedit catatan"
            >
              {editingField?.type === 'note' && editingField.id === task.id ? (
                <input
                  autoFocus
                  type="text"
                  value={tempVal}
                  onChange={(e) => setTempVal(e.target.value)}
                  onBlur={handleSaveEdit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') setEditingField(null);
                  }}
                  className="nodrag nopan w-full text-[11px] bg-slate-100 text-slate-900 rounded px-1 outline-none border border-amber-500"
                />
              ) : (
                <span className="truncate">{task.notes || 'Text Here'}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BILAH AKSI BAWAH: TAMBAH TUGAS PER FASE & TAMBAH FASE BARU */}
      <div className="bg-slate-50/95 border-t border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 select-none">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
            + Tugas:
          </span>
          {phases.map((p) => (
            <button
              key={`add-btn-${p.id}`}
              type="button"
              onClick={() => handleAddTask(p.id)}
              className="nodrag nopan flex items-center gap-1 px-2.5 py-1 rounded-lg text-white font-bold text-xs shadow-2xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              style={{ backgroundColor: p.color }}
              title={`Tambah tugas baru di ${p.name}`}
            >
              <Plus className="w-3 h-3 stroke-[3]" />
              <span>{p.name}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={handleAddPhase}
            className="nodrag nopan flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 font-bold text-xs shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer"
            title="Tambah Fase Proyek Baru"
          >
            <Plus className="w-3 h-3 stroke-[2.5]" />
            <span>Fase Baru</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-medium hidden md:flex items-center gap-2">
          <span>Tarik bilah untuk geser minggu • Tarik tepi kiri/kanan untuk ubah durasi • Dobel klik untuk edit teks</span>
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="!w-2.5 !h-2.5 !bg-slate-400" />
      <Handle type="source" position={Position.Bottom} className="!w-2.5 !h-2.5 !bg-slate-400" />
      <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-slate-400" />
      <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-slate-400" />
    </div>
  );
});
MultiPhaseGanttNode.displayName = 'MultiPhaseGanttNode';

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
  gantt_header: GanttHeaderNode,
  gantt_bar: GanttBarNode,
  milestone_node: MilestoneNode,
  timeline_step: VerticalTimelineNode,
  timebox_card: TimeboxCardNode,
  multiphase_gantt: MultiPhaseGanttNode,
};



