'use client';

import React from 'react';
import { 
  Trash2, 
  Palette, 
  Type, 
  Sliders, 
  Waypoints,
  Spline,
  Minus, 
  Plus,
  ArrowRight, 
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  MoveHorizontal,
  MoveVertical,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Maximize2,
  Minimize2,
  RotateCw,
  Sun,
  Database,
  Layers,
  Sparkles,
  RotateCcw,
  FileText,
  Grid,
  LayoutGrid,
  Lock,
  Wand2,
  ChevronUp,
  ChevronDown,
  AlignStartVertical,
  AlignVerticalSpaceAround,
  AlignEndVertical,
  Eye,
  Moon,
  Leaf,
  GitFork,
  Check,
  Smile,
  Upload,
  Search,
  Image as ImageIcon,
  X,
  ListTodo,
  Activity,
  Clock,
  Calendar,
  Star,
  Copy
} from 'lucide-react';
import { MarkerType, useReactFlow } from '@xyflow/react';
import { CanvasPageConfig, DEFAULT_PAGE_CONFIG } from './CanvasPageFrame';
import { 
  NodeIconDisplay, 
  ICON_CATEGORIES, 
  POPULAR_LOGO_PRESETS, 
  POPULAR_EMOJI_PRESETS 
} from './nodes/NodeIconDisplay';

interface PropertyPanelProps {
  selectedNode: any | null;
  selectedEdge: any | null;
  onUpdateNode: (nodeId: string, data: any) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateEdge: (edgeId: string, updates: any) => void;
  onDeleteEdge: (edgeId: string) => void;
  pageConfig?: CanvasPageConfig;
  onUpdatePageConfig?: (updates: Partial<CanvasPageConfig>) => void;
  nodeCount?: number;
  edgeCount?: number;
  isDiagramSettingsOpen?: boolean;
  onCloseDiagramSettings?: () => void;
}

export default function PropertyPanel({
  selectedNode,
  selectedEdge,
  onUpdateNode,
  onDeleteNode,
  onUpdateEdge,
  onDeleteEdge,
  pageConfig,
  onUpdatePageConfig,
  nodeCount = 0,
  edgeCount = 0,
  isDiagramSettingsOpen = false,
  onCloseDiagramSettings,
}: PropertyPanelProps) {
  // State Pengaturan Ikon, Emoticon & Logo
  const [iconTab, setIconTab] = React.useState<'icon' | 'emoji' | 'logo'>('icon');
  const [iconCategoryIndex, setIconCategoryIndex] = React.useState(0);
  const [iconSearch, setIconSearch] = React.useState('');
  const [customEmojiInput, setCustomEmojiInput] = React.useState('');
  const [customLogoUrl, setCustomLogoUrl] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { getNode, getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const [gridExpanded, setGridExpanded] = React.useState(true);
  const [behaviorExpanded, setBehaviorExpanded] = React.useState(true);
  const [advancedExpanded, setAdvancedExpanded] = React.useState(false);
  const [lockSpacing, setLockSpacing] = React.useState(true);
  const [lockPadding, setLockPadding] = React.useState(true);
  const [selectedGanttTaskId, setSelectedGanttTaskId] = React.useState<string | null>(null);

  // 0. JIKA TIDAK ADA YANG DIPILIH: TAMPILKAN PENGATURAN DIAGRAM HANYA JIKA DIBUKA (AUTO-HIDE BIAR RINGKAS)
  if (!selectedNode && !selectedEdge) {
    if (!isDiagramSettingsOpen) {
      return null;
    }

    const activeConfig = pageConfig || DEFAULT_PAGE_CONFIG;

    return (
      <aside className="w-72 bg-white border-l border-slate-200 flex flex-col h-full shadow-xs no-print select-none">
        {/* Header Diagram Settings */}
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Pengaturan Diagram
              </h2>
              <span className="text-[10px] text-slate-400 font-medium">
                Lembar Kanvas & Kisi
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {activeConfig.pageSize}
            </span>
            {onCloseDiagramSettings && (
              <button
                type="button"
                onClick={onCloseDiagramSettings}
                title="Sembunyikan Pengaturan (Tutup Panel)"
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
          {/* OPSI LIHAT (CHECKBOX SEPERTI DRAW.IO) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Lihat (Tampilan)</span>
            </label>
            <div className="space-y-1 bg-slate-50/70 p-2 rounded-xl border border-slate-200/80">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer py-1 px-1 rounded hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={activeConfig.showPageFrame}
                  onChange={(e) => onUpdatePageConfig?.({ showPageFrame: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Tampilan Halaman (Batas A4)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer py-1 px-1 rounded hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={activeConfig.showGrid}
                  onChange={(e) => onUpdatePageConfig?.({ showGrid: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Kisi-Kisi (Grid)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer py-1 px-1 rounded hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={activeConfig.showMarginGuides}
                  onChange={(e) => onUpdatePageConfig?.({ showMarginGuides: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Panduan Margin Cetak</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer py-1 px-1 rounded hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={activeConfig.snapToGrid}
                  onChange={(e) => onUpdatePageConfig?.({ snapToGrid: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Kunci Titik Kisi (Snap to Grid)</span>
              </label>
            </div>
          </div>

          {/* UKURAN KERTAS (PAPER SIZE) */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Ukuran Kertas</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'A4', label: 'A4 (Standar)', desc: '210×297 mm' },
                { id: 'A3', label: 'A3 (Besar)', desc: '297×420 mm' },
                { id: 'Letter', label: 'Letter', desc: '8.5×11 in' },
                { id: 'infinite', label: 'Tak Terbatas', desc: 'Kanvas Bebas' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => onUpdatePageConfig?.({ pageSize: fmt.id as any })}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    activeConfig.pageSize === fmt.id
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs">{fmt.label}</div>
                  <div className="text-[9px] text-slate-400 font-normal">{fmt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ORIENTASI & AUTO-EXPAND */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Orientasi Kertas
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onUpdatePageConfig?.({ orientation: 'portrait' })}
                className={`py-1.5 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeConfig.orientation === 'portrait'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="w-2.5 h-3.5 border border-current rounded-2xs" />
                <span>Potret</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdatePageConfig?.({ orientation: 'landscape' })}
                className={`py-1.5 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeConfig.orientation === 'landscape'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="w-3.5 h-2.5 border border-current rounded-2xs" />
                <span>Lanskap</span>
              </button>
            </div>

            {/* Mode Auto-Expand */}
            <div
              onClick={() => onUpdatePageConfig?.({ autoExpand: !activeConfig.autoExpand })}
              className={`p-2.5 rounded-xl border flex items-start gap-2 cursor-pointer transition-all mt-2 ${
                activeConfig.autoExpand
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <input
                type="checkbox"
                checked={activeConfig.autoExpand}
                onChange={() => {}}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <div>
                <div className="font-bold text-xs">Membesar Otomatis (Auto-Expand)</div>
                <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                  Menambah lembar A4 otomatis saat diagram meluas
                </div>
              </div>
            </div>
          </div>

          {/* TEMA VISUAL KANVAS */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tema Kanvas</span>
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'light', label: 'Putih', icon: Sun },
                { id: 'dark', label: 'Gelap', icon: Moon },
                { id: 'emerald', label: 'Sunda', icon: Leaf },
              ].map((t) => {
                const IconComponent = t.icon;
                const isTSelected = activeConfig.canvasTheme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onUpdatePageConfig?.({ canvasTheme: t.id as any })}
                    className={`py-1.5 px-2 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isTSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-2xs font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <IconComponent className="w-3 h-3" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STATISTIK RINGKAS */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center justify-between">
              <span>Jumlah Objek Bentuk:</span>
              <strong className="text-slate-900 font-mono">{nodeCount}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Jumlah Garis Konektor:</span>
              <strong className="text-slate-900 font-mono">{edgeCount}</strong>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // 1. PROPERTI GARIS KONEKTOR (EDGE)
  if (selectedEdge) {
    const edgeId = selectedEdge.id;
    const currentLabel = selectedEdge.label || '';
    const currentStroke = selectedEdge.style?.stroke || '#3b82f6';
    const currentWidth = selectedEdge.style?.strokeWidth || 2;
    const isDashed = Boolean(selectedEdge.style?.strokeDasharray);
    const hasMarker = Boolean(selectedEdge.markerEnd);
    const edgeStyleType = selectedEdge.type || 'smoothstep';
    const currentOffset = typeof selectedEdge.data?.offset === 'number' ? selectedEdge.data.offset : 25;
    const currentShiftX = typeof selectedEdge.data?.shiftX === 'number' ? selectedEdge.data.shiftX : 0;
    const currentShiftY = typeof selectedEdge.data?.shiftY === 'number' ? selectedEdge.data.shiftY : 0;

    const handleUpdateOffset = (val: number) => {
      const clamped = Math.max(10, Math.min(350, Math.round(val)));
      onUpdateEdge(edgeId, {
        data: {
          ...(selectedEdge.data || {}),
          offset: clamped,
        },
      });
    };

    const handleUpdateShiftX = (val: number) => {
      const clamped = Math.max(-400, Math.min(400, Math.round(val)));
      onUpdateEdge(edgeId, {
        data: {
          ...(selectedEdge.data || {}),
          shiftX: clamped,
        },
      });
    };

    const handleUpdateShiftY = (val: number) => {
      const clamped = Math.max(-400, Math.min(400, Math.round(val)));
      onUpdateEdge(edgeId, {
        data: {
          ...(selectedEdge.data || {}),
          shiftY: clamped,
        },
      });
    };

    const handleAutoRouteHandles = () => {
      const srcNode = getNode(selectedEdge.source);
      const tgtNode = getNode(selectedEdge.target);
      if (!srcNode || !tgtNode) return;

      const dx = tgtNode.position.x - srcNode.position.x;
      const dy = tgtNode.position.y - srcNode.position.y;

      let srcH = 'r-out';
      let tgtH = 'l-out';

      if (Math.abs(dx) >= Math.abs(dy)) {
        if (dx >= 0) {
          srcH = 'r-out';
          tgtH = 'l-out';
        } else {
          srcH = 'l-out';
          tgtH = 'r-out';
        }
      } else {
        if (dy >= 0) {
          srcH = 'b-out';
          tgtH = 't-out';
        } else {
          srcH = 't-out';
          tgtH = 'b-out';
        }
      }

      onUpdateEdge(edgeId, {
        sourceHandle: srcH,
        targetHandle: tgtH,
      });
    };

    const handleResetSiku = () => {
      onUpdateEdge(edgeId, {
        data: {
          ...(selectedEdge.data || {}),
          shiftX: 0,
          shiftY: 0,
          offset: 25,
        },
      });
    };

    const edgeColors = [
      { color: '#0b4632', name: 'Galur Hijau' },
      { color: '#059669', name: 'Emerald' },
      { color: '#f59e0b', name: 'Galur Gold' },
      { color: '#3b82f6', name: 'Biru' },
      { color: '#ef4444', name: 'Merah' },
      { color: '#8b5cf6', name: 'Ungu' },
      { color: '#475569', name: 'Abu-abu' },
      { color: '#0f172a', name: 'Hitam' },
    ];

    return (
      <aside className="w-72 bg-white border-l border-slate-200 flex flex-col h-full shadow-xs no-print select-none">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Waypoints className="w-4 h-4 text-emerald-700" />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Properti Garis
              </h2>
              <span className="text-[10px] text-slate-400 font-mono truncate block max-w-[140px]">
                {edgeId}
              </span>
            </div>
          </div>
          <button
            onClick={() => onDeleteEdge(edgeId)}
            title="Hapus Garis Konektor Ini"
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
          {/* Label Teks pada Garis */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-blue-600" />
              <span>Label Teks Garis</span>
            </label>
            <input
              type="text"
              value={currentLabel}
              onChange={(e) => onUpdateEdge(edgeId, { label: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
              placeholder="Contoh: Ya, Tidak, Sukses..."
            />
          </div>

          {/* Warna Garis */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-amber-600" />
              <span>Warna Garis</span>
            </label>
            <div className="grid grid-cols-8 gap-1 mb-2">
              {edgeColors.map((item) => (
                <button
                  key={item.color}
                  type="button"
                  onClick={() =>
                    onUpdateEdge(edgeId, {
                      style: { ...selectedEdge.style, stroke: item.color },
                      markerEnd: selectedEdge.markerEnd
                        ? { ...selectedEdge.markerEnd, color: item.color }
                        : undefined,
                    })
                  }
                  title={item.name}
                  className={`w-6 h-6 rounded-md shadow-2xs hover:scale-110 transition-transform ${
                    currentStroke === item.color ? 'ring-2 ring-blue-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: item.color }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentStroke}
                onChange={(e) =>
                  onUpdateEdge(edgeId, {
                    style: { ...selectedEdge.style, stroke: e.target.value },
                    markerEnd: selectedEdge.markerEnd
                      ? { ...selectedEdge.markerEnd, color: e.target.value }
                      : undefined,
                  })
                }
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
              />
              <span className="text-[11px] font-mono text-slate-500">{currentStroke}</span>
            </div>
          </div>

          {/* Bentuk Jalur Garis (Lengkung, Lurus, Siku) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Bentuk Jalur Garis</span>
              <span className="text-[10px] text-blue-600 font-bold lowercase">
                {edgeStyleType === 'default' || edgeStyleType === 'bezier' ? 'kurva lengkung' : edgeStyleType === 'straight' ? 'garis lurus' : 'siku-siku'}
              </span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'default', label: 'Lengkung', desc: 'Kurva Bezier' },
                { id: 'straight', label: 'Lurus', desc: 'Garis Lurus' },
                { id: 'smoothstep', label: 'Siku-Siku', desc: 'Siku Ortogonal' },
              ].map((st) => {
                const isActive = 
                  (st.id === 'default' && (edgeStyleType === 'default' || edgeStyleType === 'bezier')) ||
                  (st.id === 'straight' && edgeStyleType === 'straight') ||
                  (st.id === 'smoothstep' && (edgeStyleType === 'smoothstep' || edgeStyleType === 'step'));

                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => onUpdateEdge(edgeId, { type: st.id, selected: true })}
                    className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="text-xs font-bold leading-tight">{st.label}</div>
                    <div className={`text-[9px] mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                      {st.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kelengkungan Kustom (Aktif bila tipe Lengkung / Bezier) */}
          {(edgeStyleType === 'default' || edgeStyleType === 'bezier') && (
            <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/80 space-y-2.5 animate-in fade-in duration-100">
              <div className="flex items-center justify-between text-[11px] font-bold text-blue-900">
                <span className="flex items-center gap-1.5">
                  <Spline className="w-3.5 h-3.5 text-blue-600" />
                  <span>Kelengkungan Kustom</span>
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                  {Math.round((typeof selectedEdge.data?.curvature === 'number' ? selectedEdge.data.curvature : 0.25) * 100)}%
                </span>
              </div>

              {/* Slider Kelengkungan */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={typeof selectedEdge.data?.curvature === 'number' ? selectedEdge.data.curvature : 0.25}
                onChange={(e) =>
                  onUpdateEdge(edgeId, {
                    data: {
                      ...(selectedEdge.data || {}),
                      curvature: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full h-1.5 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              {/* Preset Tombol Cepat */}
              <div className="grid grid-cols-4 gap-1 text-[10px] font-semibold">
                {[
                  { val: 0, label: 'Lurus (0%)' },
                  { val: 0.25, label: 'Alami (25%)' },
                  { val: 0.5, label: 'Lengkung (50%)' },
                  { val: 0.8, label: 'Ekstrem (80%)' },
                ].map((p) => {
                  const currentCurv = typeof selectedEdge.data?.curvature === 'number' ? selectedEdge.data.curvature : 0.25;
                  const isCurrent = Math.abs(currentCurv - p.val) < 0.05;

                  return (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() =>
                        onUpdateEdge(edgeId, {
                          data: {
                            ...(selectedEdge.data || {}),
                            curvature: p.val,
                          },
                        })
                      }
                      className={`py-1 rounded-lg border text-center transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-600 border-blue-600 text-white font-bold'
                          : 'bg-white hover:bg-blue-100/70 border-blue-200 text-blue-900'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ketebalan Garis */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Ketebalan Garis
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[1.5, 2.5, 4].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() =>
                    onUpdateEdge(edgeId, {
                      style: { ...selectedEdge.style, strokeWidth: w },
                    })
                  }
                  className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium text-center transition-all ${
                    currentWidth === w
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {w === 1.5 ? 'Halus' : w === 2.5 ? 'Standar' : 'Tebal'}
                </button>
              ))}
            </div>
          </div>

          {/* Pola Garis & Ujung Panah */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Pola Garis
              </label>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateEdge(edgeId, {
                      style: { ...selectedEdge.style, strokeDasharray: undefined },
                    })
                  }
                  className={`w-full py-1 rounded text-[11px] border text-center transition-all ${
                    !isDashed ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Utuh
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateEdge(edgeId, {
                      style: { ...selectedEdge.style, strokeDasharray: '5,5' },
                    })
                  }
                  className={`w-full py-1 rounded text-[11px] border text-center transition-all ${
                    isDashed ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Putus-Putus
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Ujung Panah
              </label>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateEdge(edgeId, {
                      markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: currentStroke,
                      },
                    })
                  }
                  className={`w-full py-1 rounded text-[11px] border text-center transition-all ${
                    hasMarker ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Dengan Panah
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateEdge(edgeId, {
                      markerEnd: undefined,
                    })
                  }
                  className={`w-full py-1 rounded text-[11px] border text-center transition-all ${
                    !hasMarker ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Garis Polos
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* PENGATURAN TITIK SAMBUNGAN GARIS (ASAL & TUJUAN)         */}
          {/* ======================================================== */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5 text-blue-600" />
                <span>Titik Sambungan Garis</span>
              </label>
              <button
                type="button"
                onClick={handleAutoRouteHandles}
                title="Sesuaikan titik sambungan secara otomatis berdasarkan posisi kedua bentuk"
                className="text-[10px] font-semibold text-blue-700 hover:bg-blue-50 px-2 py-0.5 rounded border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                <span>Otomatis</span>
              </button>
            </div>

            {/* 1. Titik Awal (Asal Garis) */}
            <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Titik Asal / Awal Garis</span>
                <span className="text-blue-600 font-mono text-[10px] lowercase">
                  {selectedEdge.sourceHandle || 'r-out'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { id: 't-out', label: '⬆ Atas', title: 'Keluar dari sisi Atas' },
                  { id: 'r-out', label: '➡ Kanan', title: 'Keluar dari sisi Kanan' },
                  { id: 'b-out', label: '⬇ Bawah', title: 'Keluar dari sisi Bawah' },
                  { id: 'l-out', label: '⬅ Kiri', title: 'Keluar dari sisi Kiri' },
                ].map((h) => {
                  const isActive = (selectedEdge.sourceHandle || 'r-out').startsWith(h.id.charAt(0));
                  return (
                    <button
                      key={h.id}
                      type="button"
                      title={h.title}
                      onClick={() => onUpdateEdge(edgeId, { sourceHandle: h.id })}
                      className={`py-1.5 px-1 rounded-md text-[10px] font-semibold text-center transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs font-bold'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300'
                      }`}
                    >
                      {h.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Titik Tujuan (Akhir Garis) */}
            <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Titik Target / Akhir Garis</span>
                <span className="text-blue-600 font-mono text-[10px] lowercase">
                  {selectedEdge.targetHandle || 'l-out'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { id: 't-out', label: '⬆ Atas', title: 'Masuk ke sisi Atas' },
                  { id: 'r-out', label: '➡ Kanan', title: 'Masuk ke sisi Kanan' },
                  { id: 'b-out', label: '⬇ Bawah', title: 'Masuk ke sisi Bawah' },
                  { id: 'l-out', label: '⬅ Kiri', title: 'Masuk ke sisi Kiri' },
                ].map((h) => {
                  const isActive = (selectedEdge.targetHandle || 'l-out').startsWith(h.id.charAt(0));
                  return (
                    <button
                      key={h.id}
                      type="button"
                      title={h.title}
                      onClick={() => onUpdateEdge(edgeId, { targetHandle: h.id })}
                      className={`py-1.5 px-1 rounded-md text-[10px] font-semibold text-center transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs font-bold'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300'
                      }`}
                    >
                      {h.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* PENGATURAN POSISI 3 SIKU GARIS (KIRI/KANAN & ATAS/BAWAH)  */}
          {/* ======================================================== */}
          <div className="pt-2 border-t border-slate-100 space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Waypoints className="w-3.5 h-3.5 text-blue-600" />
                <span>Posisi 3 Siku Garis</span>
              </label>
              <button
                type="button"
                onClick={handleResetSiku}
                title="Kembalikan posisi siku ke tengah & default (25px)"
                className="text-[10px] font-semibold text-slate-500 hover:text-amber-700 hover:bg-amber-50 px-2 py-0.5 rounded border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* 1. Siku Vertikal: Geser Kiri / Kanan */}
            <div className="space-y-1.5 bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/70">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                  <MoveHorizontal className="w-3 h-3 text-blue-600" />
                  <span>Siku Vertikal (↔ Kiri / Kanan)</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {currentShiftX === 0 ? '0px (Tengah)' : `${currentShiftX > 0 ? '+' : ''}${currentShiftX}px`}
                </span>
              </div>

              {/* Stepper Kiri / Kanan */}
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleUpdateShiftX(currentShiftX - 20)}
                  className="py-1 px-2 rounded-md border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-[11px] font-semibold text-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3 text-blue-600" />
                  <span>Kiri (-20px)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateShiftX(currentShiftX + 20)}
                  className="py-1 px-2 rounded-md border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-[11px] font-semibold text-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Kanan (+20px)</span>
                  <ArrowRight className="w-3 h-3 text-blue-600" />
                </button>
              </div>

              {/* Presets Kiri / Kanan */}
              <div className="grid grid-cols-4 gap-1 pt-0.5">
                {[
                  { val: -80, label: '-80px' },
                  { val: -40, label: '-40px' },
                  { val: 0, label: 'Tengah' },
                  { val: 40, label: '+40px' },
                ].map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => handleUpdateShiftX(p.val)}
                    className={`py-0.5 text-[10px] font-mono rounded border transition-all cursor-pointer ${
                      currentShiftX === p.val
                        ? 'bg-blue-600 text-white border-blue-600 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Range Slider ShiftX */}
              <input
                type="range"
                min={-250}
                max={250}
                step={5}
                value={currentShiftX}
                onChange={(e) => handleUpdateShiftX(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none mt-1"
              />
            </div>

            {/* 2. Siku Horisontal: Geser Atas / Bawah */}
            <div className="space-y-1.5 bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/70">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                  <MoveVertical className="w-3 h-3 text-blue-600" />
                  <span>Siku Horisontal (↕ Atas / Bawah)</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {currentShiftY === 0 ? '0px (Tengah)' : `${currentShiftY > 0 ? '+' : ''}${currentShiftY}px`}
                </span>
              </div>

              {/* Stepper Atas / Bawah */}
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleUpdateShiftY(currentShiftY - 15)}
                  className="py-1 px-2 rounded-md border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-[11px] font-semibold text-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowUp className="w-3 h-3 text-blue-600" />
                  <span>Naik (-15px)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateShiftY(currentShiftY + 15)}
                  className="py-1 px-2 rounded-md border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-[11px] font-semibold text-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowDown className="w-3 h-3 text-blue-600" />
                  <span>Turun (+15px)</span>
                </button>
              </div>

              {/* Presets Atas / Bawah */}
              <div className="grid grid-cols-4 gap-1 pt-0.5">
                {[
                  { val: -60, label: '-60px' },
                  { val: -30, label: '-30px' },
                  { val: 0, label: 'Tengah' },
                  { val: 30, label: '+30px' },
                ].map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => handleUpdateShiftY(p.val)}
                    className={`py-0.5 text-[10px] font-mono rounded border transition-all cursor-pointer ${
                      currentShiftY === p.val
                        ? 'bg-blue-600 text-white border-blue-600 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Range Slider ShiftY */}
              <input
                type="range"
                min={-250}
                max={250}
                step={5}
                value={currentShiftY}
                onChange={(e) => handleUpdateShiftY(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none mt-1"
              />
            </div>

            {/* 3. Jarak Siku Handle (Offset Garis) */}
            <div className="space-y-1.5 bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/70">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700">
                  Jarak Siku Handle (Offset)
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {currentOffset}px
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleUpdateOffset(currentOffset - 10)}
                  className="py-1 px-2 rounded-md border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-[11px] font-semibold text-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Minus className="w-3 h-3 text-blue-600" />
                  <span>Rapatkan (-10px)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateOffset(currentOffset + 10)}
                  className="py-1 px-2 rounded-md border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-[11px] font-semibold text-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-blue-600" />
                  <span>Jauhkan (+10px)</span>
                </button>
              </div>

              {/* Presets Offset */}
              <div className="grid grid-cols-4 gap-1 pt-0.5">
                {[15, 25, 45, 75].map((off) => (
                  <button
                    key={off}
                    type="button"
                    onClick={() => handleUpdateOffset(off)}
                    className={`py-0.5 text-[10px] font-mono rounded border transition-all cursor-pointer ${
                      currentOffset === off
                        ? 'bg-blue-600 text-white border-blue-600 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {off}px
                  </button>
                ))}
              </div>

              {/* Range Slider Offset */}
              <input
                type="range"
                min={10}
                max={250}
                step={5}
                value={currentOffset}
                onChange={(e) => handleUpdateOffset(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none mt-1"
              />
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // 2. PROPERTI BENTUK / NODE (JIKA NODE TERPILIH)
  const { data, id, type } = selectedNode;
  const currentLabel = data.label || '';
  const currentSublabel = data.sublabel || '';
  const currentColor = data.color || '#ffffff';
  const currentBorder = data.borderColor || '#3b82f6';
  const currentText = data.textColor || '#0f172a';

  // Perhitungan Ikon Aktif & Filter
  const effectiveIcon =
    data.icon ||
    (type === 'database'
      ? 'database'
      : type === 'cloud'
      ? 'cloud'
      : type === 'terminal'
      ? 'playcircle'
      : type === 'document'
      ? 'filetext'
      : undefined);

  const hasActiveIcon =
    (data.icon && data.icon !== 'none') ||
    (!data.icon &&
      ['database', 'cloud', 'terminal', 'document'].includes(type) &&
      data.icon !== 'none') ||
    Boolean(data.emoji) ||
    Boolean(data.iconUrl);

  const activeIconCategory = ICON_CATEGORIES[iconCategoryIndex] || ICON_CATEGORIES[0];
  const allIcons = ICON_CATEGORIES.flatMap((c) => c.icons);
  const filteredIcons = iconSearch.trim()
    ? allIcons.filter(
        (i) =>
          i.label.toLowerCase().includes(iconSearch.toLowerCase()) ||
          i.id.toLowerCase().includes(iconSearch.toLowerCase())
      )
    : activeIconCategory.icons;

  // Dimensi Bentuk (Lebar x Tinggi)
  const defaultWidthByType: Record<string, number> = {
    decision: 120,
    swot_card: 310,
    uml_class: 220,
    erd_entity: 240,
    org_node: 230,
    stickynote: 150,
    text: 110,
    connector: 50,
    summing: 65,
    or_junction: 65,
    fishbone_head: 270,
    fishbone_category: 240,
    canvas_block: 240,
    why_step: 260,
    priority_card: 260,
  };
  const defaultHeightByType: Record<string, number> = {
    decision: 90,
    swot_card: 320,
    uml_class: 180,
    erd_entity: 190,
    org_node: 120,
    stickynote: 100,
    text: 40,
    connector: 50,
    summing: 65,
    or_junction: 65,
    fishbone_head: 120,
    fishbone_category: 140,
    canvas_block: 180,
    why_step: 130,
    priority_card: 180,
  };

  const currentWidth = data.width !== undefined
    ? Number(data.width)
    : (defaultWidthByType[type] || 140);
  const currentHeight = data.height !== undefined
    ? Number(data.height)
    : (defaultHeightByType[type] || 70);

  // Tipografi & Teks
  const isBold = Boolean(
    data.bold ??
      (data.fontWeight === 'bold' ||
        data.fontWeight === '800' ||
        data.fontWeight === '900' ||
        data.fontWeight === 700)
  );
  const isItalic = Boolean(data.italic ?? (data.fontStyle === 'italic'));
  const isUnderline = Boolean(
    data.underline ??
      (data.textDecoration === 'underline' || Boolean(data.textDecoration?.includes('underline')))
  );
  const isStrike = Boolean(
    data.strike ??
      (data.textDecoration === 'line-through' || Boolean(data.textDecoration?.includes('line-through')))
  );
  const currentFontFamily = data.fontFamily || 'sans';
  const currentTextAlign = data.textAlign || 'center';
  const currentTextTransform = data.textTransform || 'none';
  const currentFontSize =
    typeof data.fontSize === 'number'
      ? data.fontSize
      : parseInt(data.fontSize, 10) || 13;

  // Garis Tepi & Sudut
  const currentBorderWidth = data.borderWidth !== undefined ? Number(data.borderWidth) : 2;
  const currentBorderStyle = data.borderStyle || 'solid';
  const currentBorderRadius = data.borderRadius !== undefined ? String(data.borderRadius) : '8px';

  // Efek Visual
  const currentShadow = data.shadow || 'none';
  const currentOpacity = data.opacity !== undefined
    ? Number(data.opacity) > 1
      ? Number(data.opacity)
      : Math.round(Number(data.opacity) * 100)
    : 100;
  const currentRotation = data.rotation !== undefined ? Number(data.rotation) : 0;

  // Tema Warna Lengkap
  const colorPresets = [
    { bg: '#e8f5ed', border: '#0b4632', text: '#0b4632', name: 'Galur Hijau' },
    { bg: '#fffbeb', border: '#f59e0b', text: '#78350f', name: 'Galur Gold' },
    { bg: '#ffffff', border: '#cbd5e1', text: '#0f172a', name: 'Putih Bersih' },
    { bg: '#eff6ff', border: '#3b82f6', text: '#1e3a8a', name: 'Biru Sistem' },
    { bg: '#ecfdf5', border: '#10b981', text: '#065f46', name: 'Emerald' },
    { bg: '#faf5ff', border: '#a855f7', text: '#581c87', name: 'Ungu' },
    { bg: '#fee2e2', border: '#ef4444', text: '#7f1d1d', name: 'Merah' },
    { bg: '#1e293b', border: '#0f172a', text: '#ffffff', name: 'Gelap Slate' },
  ];

  return (
    <aside className="w-72 bg-white border-l border-slate-200 flex flex-col h-full shadow-xs no-print select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-700" />
            <span>Properti Bentuk</span>
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono text-[10px] font-bold">
              {type}
            </span>
            <span className="text-[10px] text-slate-400 font-mono truncate block max-w-[120px]">
              {id}
            </span>
          </div>
        </div>
        <button
          onClick={() => onDeleteNode(id)}
          title="Hapus Bentuk Ini"
          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* ======================================================== */}
        {/* 1. KONTEN & DATA SPESIFIK                                 */}
        {/* ======================================================== */}
        <div className="space-y-3">
          {type === 'timebox_card' ? (
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/80 mb-1">
                <span className="text-[11px] font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ListTodo className="w-3.5 h-3.5 text-blue-600" />
                  <span>Kartu Time Boxing Fokus</span>
                </span>
                <p className="text-[10px] text-blue-700/80 mt-0.5">Atur blok fokus kerja harian & daftar tugas terencana.</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Hari Sesi
                  </label>
                  <input
                    type="text"
                    value={data.day || ''}
                    onChange={(e) => onUpdateNode(id, { day: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-black uppercase focus:ring-2 focus:ring-blue-500"
                    placeholder="SENIN"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Rentang Waktu (Jam)
                  </label>
                  <input
                    type="text"
                    value={data.hours || ''}
                    onChange={(e) => onUpdateNode(id, { hours: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-semibold focus:ring-2 focus:ring-blue-500"
                    placeholder="08:30 - 11:30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Daftar Tugas Time-Box (1 baris per tugas)
                </label>
                <textarea
                  rows={4}
                  value={Array.isArray(data.tasks) ? data.tasks.join('\n') : (typeof data.tasks === 'string' ? data.tasks : '')}
                  onChange={(e) => onUpdateNode(id, { tasks: e.target.value.split('\n') })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed font-medium"
                  placeholder="Riset Topologi & Mindmap&#10;Review Jadwal Tim"
                />
              </div>
            </div>
          ) : type === 'timeline_step' ? (
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200/80 mb-1">
                <span className="text-[11px] font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Titik Garis Waktu (Roadmap)</span>
                </span>
                <p className="text-[10px] text-indigo-700/80 mt-0.5">Atur tanggal fase capaian dan rincian langkah kerja.</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Tanggal
                  </label>
                  <input
                    type="text"
                    value={data.date || ''}
                    onChange={(e) => onUpdateNode(id, { date: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 font-bold text-center focus:ring-2 focus:ring-indigo-500"
                    placeholder="10 Oktober"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Judul Tahap Proyek
                  </label>
                  <input
                    type="text"
                    value={data.title || data.label || ''}
                    onChange={(e) => onUpdateNode(id, { title: e.target.value, label: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-indigo-500"
                    placeholder="Tahap 1: Analisis Kebutuhan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Uraian Detail Langkah
                </label>
                <textarea
                  rows={3}
                  value={data.description || ''}
                  onChange={(e) => onUpdateNode(id, { description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 leading-relaxed font-normal"
                  placeholder="Tuliskan kendala, sasaran kerja, dan pemangku kepentingan..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Warna Aksen Penanda
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={data.accentColor || '#3b82f6'}
                    onChange={(e) => onUpdateNode(id, { accentColor: e.target.value })}
                    className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={data.accentColor || '#3b82f6'}
                    onChange={(e) => onUpdateNode(id, { accentColor: e.target.value })}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono text-xs uppercase"
                  />
                </div>
              </div>
            </div>
          ) : type === 'gantt_bar' ? (
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/80 mb-1">
                <span className="text-[11px] font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Bilah Tugas Jadwal (Gantt)</span>
                </span>
                <p className="text-[10px] text-blue-700/80 mt-0.5">Atur durasi, status kritis, PIC, dan progres penyelesaian.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Nama Tugas / Aktivitas
                </label>
                <input
                  type="text"
                  value={data.label || ''}
                  onChange={(e) => onUpdateNode(id, { label: e.target.value, title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-blue-500"
                  placeholder="Perencanaan & Riset Konsep"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Durasi / Waktu
                  </label>
                  <input
                    type="text"
                    value={data.duration || ''}
                    onChange={(e) => onUpdateNode(id, { duration: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500"
                    placeholder="W1 (Sen - Kam)"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Penanggung Jawab (PIC)
                  </label>
                  <input
                    type="text"
                    value={data.assignee || ''}
                    onChange={(e) => onUpdateNode(id, { assignee: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500"
                    placeholder="Tim IKP"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Status Tugas
                </label>
                <select
                  value={data.status || 'on_track'}
                  onChange={(e) => onUpdateNode(id, { status: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-bold bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="on_track">🟢 Tepat Waktu (On Track)</option>
                  <option value="critical">🔴 Jalur Kritis (Critical Path)</option>
                  <option value="completed">🟣 Selesai Penuh (Completed)</option>
                  <option value="delayed">🟡 Tertunda / Penyesuaian (Delayed)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Persentase Capaian (Progres)
                  </label>
                  <span className="text-xs font-black text-blue-600 font-mono">
                    {data.progress !== undefined ? data.progress : 50}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={data.progress !== undefined ? Number(data.progress) : 50}
                  onChange={(e) => onUpdateNode(id, { progress: Number(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          ) : type === 'gantt_header' ? (
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 mb-1">
                <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-700" />
                  <span>Header Skala Waktu (Gantt)</span>
                </span>
                <p className="text-[10px] text-slate-600 mt-0.5">Atur kolom minggu, nama periode, dan penanda Hari Ini.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Judul Garis Waktu
                </label>
                <input
                  type="text"
                  value={data.title || data.label || ''}
                  onChange={(e) => onUpdateNode(id, { title: e.target.value, label: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-blue-500"
                  placeholder="JADWAL KERJA & TIME BOXING MINGGUAN"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Daftar Minggu (Pisahkan Koma)
                </label>
                <input
                  type="text"
                  value={Array.isArray(data.weeks) ? data.weeks.join(', ') : 'WEEK 1, WEEK 2, WEEK 3, WEEK 4, WEEK 5, WEEK 6'}
                  onChange={(e) =>
                    onUpdateNode(id, {
                      weeks: e.target.value.split(',').map((w: string) => w.trim()).filter((w: string) => w.length > 0),
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-blue-500"
                  placeholder="WEEK 1, WEEK 2, WEEK 3..."
                />
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={data.showDays !== false}
                    onChange={(e) => onUpdateNode(id, { showDays: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Tampilkan Baris Hari (S M T W T F S)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={data.showToday !== false}
                    onChange={(e) => onUpdateNode(id, { showToday: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Tampilkan Garis Penanda "HARI INI"</span>
                </label>

                {data.showToday !== false && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Posisi Penanda Hari Ini</span>
                      <span className="text-xs font-bold text-amber-600 font-mono">
                        {data.todayPercent !== undefined ? data.todayPercent : 42}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={data.todayPercent !== undefined ? Number(data.todayPercent) : 42}
                      onChange={(e) => onUpdateNode(id, { todayPercent: Number(e.target.value) })}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : type === 'milestone_node' ? (
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 mb-1">
                <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>Milestone Target Capaian</span>
                </span>
                <p className="text-[10px] text-amber-700/80 mt-0.5">Penanda tonggak penting keberhasilan suatu fase proyek.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Nama Milestone
                </label>
                <input
                  type="text"
                  value={data.label || ''}
                  onChange={(e) => onUpdateNode(id, { label: e.target.value, title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-amber-500"
                  placeholder="Target Go-Live Siaran"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Tenggat / Waktu Sasaran
                </label>
                <input
                  type="text"
                  value={data.date || ''}
                  onChange={(e) => onUpdateNode(id, { date: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-semibold focus:ring-2 focus:ring-amber-500"
                  placeholder="Akhir Minggu 4"
                />
              </div>
            </div>
          ) : type === 'multiphase_gantt' ? (
            <div className="space-y-3.5">
              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Master Jadwal Multi-Fase 20-Minggu</span>
                </span>
              </div>

              {/* Judul & Catatan Proyek */}
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Judul Proyek
                </label>
                <input
                  type="text"
                  value={data.title || data.label || ''}
                  onChange={(e) => onUpdateNode(id, { title: e.target.value, label: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-blue-500"
                  placeholder="MASTER JADWAL PROYEK"
                />
              </div>

              {/* KELOLA TUGAS (TASKS) */}
              <div className="border border-slate-200 rounded-2xl bg-white p-3 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <ListTodo className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-extrabold text-slate-800">
                      Kelola Tugas ({(data.tasks || []).length})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const curTasks = data.tasks || [];
                      const curPhases = data.phases || [];
                      const targetPhase = curPhases[0]?.id || 'p1';
                      const lastTask = curTasks[curTasks.length - 1];
                      const newStart = lastTask ? Math.min(20, lastTask.startWeek + 1) : 1;
                      const newTask = {
                        id: `task-${Date.now()}`,
                        phaseId: targetPhase,
                        name: `Tugas Baru ${curTasks.length + 1}`,
                        startWeek: newStart,
                        endWeek: Math.min(20, newStart + 2),
                        color: curPhases[0]?.color || '#1e293b',
                        textColor: '#ffffff',
                        notes: 'Catatan',
                      };
                      onUpdateNode(id, { tasks: [...curTasks, newTask] });
                      setSelectedGanttTaskId(newTask.id);
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                    <span>Tambah Tugas</span>
                  </button>
                </div>

                {/* Dropdown Pemilih Tugas */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Pilih Tugas untuk Diedit
                  </label>
                  <select
                    value={selectedGanttTaskId || (data.tasks?.[0]?.id || '')}
                    onChange={(e) => setSelectedGanttTaskId(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    {(data.tasks || []).map((t: any) => {
                      const phase = (data.phases || []).find((p: any) => p.id === t.phaseId);
                      return (
                        <option key={t.id} value={t.id}>
                          [{phase?.name || 'Fase'}] {t.name} (W{t.startWeek}-W{t.endWeek})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Form Detail Tugas Terpilih */}
                {(() => {
                  const tasks = data.tasks || [];
                  const activeTask = tasks.find((t: any) => t.id === (selectedGanttTaskId || tasks[0]?.id));
                  if (!activeTask) return null;

                  const updateActiveTask = (updates: any) => {
                    const updated = tasks.map((t: any) => (t.id === activeTask.id ? { ...t, ...updates } : t));
                    onUpdateNode(id, { tasks: updated });
                  };

                  return (
                    <div className="space-y-2.5 pt-1">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                          Nama Tugas
                        </label>
                        <input
                          type="text"
                          value={activeTask.name || ''}
                          onChange={(e) => updateActiveTask({ name: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-blue-500"
                          placeholder="Nama aktivitas..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                            Fase
                          </label>
                          <select
                            value={activeTask.phaseId}
                            onChange={(e) => {
                              const p = (data.phases || []).find((ph: any) => ph.id === e.target.value);
                              updateActiveTask({ phaseId: e.target.value, color: p?.color || activeTask.color });
                            }}
                            className="w-full px-2 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                          >
                            {(data.phases || []).map((p: any) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                            Warna Bilah
                          </label>
                          <div className="flex items-center gap-1 pt-0.5">
                            {['#1e293b', '#e11d48', '#f59e0b', '#059669', '#2563eb', '#7c3aed'].map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => updateActiveTask({ color: c })}
                                className={`w-4 h-4 rounded-full border transition-transform cursor-pointer ${
                                  activeTask.color === c ? 'scale-125 ring-2 ring-blue-500 border-white' : 'border-slate-300 hover:scale-110'
                                }`}
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Minggu Mulai & Selesai Sliders */}
                      <div className="space-y-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mb-0.5">
                            <span>Minggu Mulai</span>
                            <span className="font-mono text-blue-600 font-extrabold">Minggu ke-{activeTask.startWeek}</span>
                          </div>
                          <input
                            type="range"
                            min={1}
                            max={activeTask.endWeek}
                            value={activeTask.startWeek}
                            onChange={(e) => updateActiveTask({ startWeek: Number(e.target.value) })}
                            className="w-full accent-blue-600 cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mb-0.5">
                            <span>Minggu Selesai</span>
                            <span className="font-mono text-blue-600 font-extrabold">Minggu ke-{activeTask.endWeek}</span>
                          </div>
                          <input
                            type="range"
                            min={activeTask.startWeek}
                            max={20}
                            value={activeTask.endWeek}
                            onChange={(e) => updateActiveTask({ endWeek: Number(e.target.value) })}
                            className="w-full accent-blue-600 cursor-pointer"
                          />
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium text-center bg-white py-0.5 rounded border border-slate-200">
                          Total Durasi: <strong className="text-slate-800">{activeTask.endWeek - activeTask.startWeek + 1} Minggu</strong>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                          Catatan (Kolom Notes)
                        </label>
                        <input
                          type="text"
                          value={activeTask.notes || ''}
                          onChange={(e) => updateActiveTask({ notes: e.target.value })}
                          className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200"
                          placeholder="Catatan tugas..."
                        />
                      </div>

                      {/* Tombol Aksi Tugas */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const newTask = {
                              ...activeTask,
                              id: `task-${Date.now()}`,
                              name: `${activeTask.name} (Salinan)`,
                              startWeek: Math.min(20, activeTask.startWeek + 1),
                              endWeek: Math.min(20, activeTask.endWeek + 1),
                            };
                            onUpdateNode(id, { tasks: [...tasks, newTask] });
                            setSelectedGanttTaskId(newTask.id);
                          }}
                          className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Duplikat</span>
                        </button>

                        {tasks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const remaining = tasks.filter((t: any) => t.id !== activeTask.id);
                              onUpdateNode(id, { tasks: remaining });
                              setSelectedGanttTaskId(remaining[0]?.id || null);
                            }}
                            className="py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* KELOLA FASE (PHASES) */}
              <div className="border border-slate-200 rounded-2xl bg-white p-3 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fase Proyek ({(data.phases || []).length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const curPhases = data.phases || [];
                      const nextNum = curPhases.length + 1;
                      const colors = ['#dc2626', '#ffe4e6', '#f59e0b', '#059669', '#2563eb', '#7c3aed'];
                      const chosenColor = colors[(nextNum - 1) % colors.length];
                      const newPhase = {
                        id: `p${Date.now()}`,
                        name: `Phase ${nextNum}`,
                        color: chosenColor,
                        textColor: chosenColor === '#ffe4e6' ? '#9f1239' : '#ffffff',
                      };
                      onUpdateNode(id, { phases: [...curPhases, newPhase] });
                    }}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded cursor-pointer"
                  >
                    + Fase Baru
                  </button>
                </div>

                <div className="space-y-2">
                  {(data.phases || []).map((ph: any) => (
                    <div key={ph.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                      <input
                        type="color"
                        value={ph.color.startsWith('#') && ph.color.length === 7 ? ph.color : '#dc2626'}
                        onChange={(e) => {
                          const updated = (data.phases || []).map((p: any) =>
                            p.id === ph.id ? { ...p, color: e.target.value } : p
                          );
                          onUpdateNode(id, { phases: updated });
                        }}
                        className="w-6 h-6 rounded cursor-pointer border border-slate-300"
                        title="Ubah warna fase"
                      />
                      <input
                        type="text"
                        value={ph.name}
                        onChange={(e) => {
                          const updated = (data.phases || []).map((p: any) =>
                            p.id === ph.id ? { ...p, name: e.target.value } : p
                          );
                          onUpdateNode(id, { phases: updated });
                        }}
                        className="flex-1 px-2 py-1 text-xs font-bold rounded border border-slate-200 bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : type === 'org_node' ? (
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Type className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Nama Lengkap / Pejabat</span>
                </label>
                <input
                  type="text"
                  value={data.name || data.label || ''}
                  onChange={(e) =>
                    onUpdateNode(id, {
                      name: e.target.value,
                      label: e.target.value,
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-semibold"
                  placeholder="Contoh: Fajar Nugraha"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Jabatan / Posisi
                </label>
                <input
                  type="text"
                  value={data.role || data.sublabel || ''}
                  onChange={(e) =>
                    onUpdateNode(id, {
                      role: e.target.value,
                      sublabel: e.target.value,
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                  placeholder="Contoh: Lead Full-Stack Eng."
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Departemen / Unit Kerja
                </label>
                <input
                  type="text"
                  value={data.dept || ''}
                  onChange={(e) => onUpdateNode(id, { dept: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  placeholder="Contoh: Tim Rekayasa Perangkat Lunak"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">Warna Avatar</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={data.avatarBg || '#0b4632'}
                      onChange={(e) => onUpdateNode(id, { avatarBg: e.target.value })}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-slate-500">{data.avatarBg || '#0b4632'}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">Warna Badge</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={data.badgeColor || '#059669'}
                      onChange={(e) => onUpdateNode(id, { badgeColor: e.target.value })}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-slate-500">{data.badgeColor || '#059669'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : type === 'uml_class' ? (
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Kelas UML
                </label>
                <input
                  type="text"
                  value={data.className || data.label || ''}
                  onChange={(e) => onUpdateNode(id, { className: e.target.value, label: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 font-bold"
                  placeholder="Contoh: Pengguna"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Stereotype
                  </label>
                  <input
                    type="text"
                    value={data.stereotype || ''}
                    onChange={(e) => onUpdateNode(id, { stereotype: e.target.value })}
                    className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 font-mono text-[11px]"
                    placeholder="<<Class>>"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Warna Header
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={data.headerColor || '#1d4ed8'}
                      onChange={(e) => onUpdateNode(id, { headerColor: e.target.value })}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-slate-500">{data.headerColor || '#1d4ed8'}</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Atribut (1 baris per atribut)
                </label>
                <textarea
                  rows={3}
                  value={Array.isArray(data.attributes) ? data.attributes.join('\n') : ''}
                  onChange={(e) =>
                    onUpdateNode(id, {
                      attributes: e.target.value.split('\n').filter((l: string) => l.trim().length > 0),
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono text-[11px] leading-relaxed"
                  placeholder="- id: UUID&#10;- nama: String"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Metode (1 baris per fungsi)
                </label>
                <textarea
                  rows={3}
                  value={Array.isArray(data.methods) ? data.methods.join('\n') : ''}
                  onChange={(e) =>
                    onUpdateNode(id, {
                      methods: e.target.value.split('\n').filter((l: string) => l.trim().length > 0),
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono text-[11px] leading-relaxed"
                  placeholder="+ login(): boolean&#10;+ logout(): void"
                />
              </div>
            </div>
          ) : type === 'erd_entity' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Tabel / Entitas
                </label>
                <input
                  type="text"
                  value={data.tableName || data.label || ''}
                  onChange={(e) => onUpdateNode(id, { tableName: e.target.value, label: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold"
                  placeholder="Contoh: users"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Warna Header Tabel
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={data.headerBg || '#0b4632'}
                    onChange={(e) => onUpdateNode(id, { headerBg: e.target.value })}
                    className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-600">{data.headerBg || '#0b4632'}</span>
                </div>
              </div>

              {/* Editor Daftar Kolom Field Database */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Kolom ({Array.isArray(data.fields) ? data.fields.length : 0})</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = Array.isArray(data.fields) ? [...data.fields] : [];
                      onUpdateNode(id, {
                        fields: [...cur, { name: `kolom_${cur.length + 1}`, type: 'VARCHAR(100)' }],
                      });
                    }}
                    className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {(Array.isArray(data.fields) ? data.fields : []).map((f: any, idx: number) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={f.name || ''}
                          onChange={(e) => {
                            const newFields = [...data.fields];
                            newFields[idx] = { ...newFields[idx], name: e.target.value };
                            onUpdateNode(id, { fields: newFields });
                          }}
                          placeholder="nama_kolom"
                          className="flex-1 px-2 py-1 text-xs rounded border border-slate-200 font-mono bg-white font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newFields = data.fields.filter((_: any, i: number) => i !== idx);
                            onUpdateNode(id, { fields: newFields });
                          }}
                          title="Hapus Kolom"
                          className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={f.type || ''}
                          onChange={(e) => {
                            const newFields = [...data.fields];
                            newFields[idx] = { ...newFields[idx], type: e.target.value };
                            onUpdateNode(id, { fields: newFields });
                          }}
                          placeholder="Tipe data..."
                          className="flex-1 px-2 py-0.5 text-[11px] rounded border border-slate-200 font-mono text-slate-600 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newFields = [...data.fields];
                            newFields[idx] = { ...newFields[idx], isPK: !newFields[idx].isPK };
                            onUpdateNode(id, { fields: newFields });
                          }}
                          title="Primary Key"
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                            f.isPK
                              ? 'bg-amber-100 text-amber-900 border-amber-300 font-black'
                              : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          PK
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newFields = [...data.fields];
                            newFields[idx] = { ...newFields[idx], isFK: !newFields[idx].isFK };
                            onUpdateNode(id, { fields: newFields });
                          }}
                          title="Foreign Key"
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                            f.isFK
                              ? 'bg-blue-100 text-blue-900 border-blue-300 font-black'
                              : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          FK
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : type === 'swot_card' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kuadran SWOT
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {(['S', 'W', 'O', 'T'] as const).map((q) => {
                    const qLabels = { S: 'strengths', W: 'weaknesses', O: 'opportunities', T: 'threats' };
                    const currentQ = (data.type || 'S').toUpperCase();
                    return (
                      <button
                        key={q}
                        type="button"
                        onClick={() => onUpdateNode(id, { type: q, title: qLabels[q] })}
                        className={`py-1.5 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer ${
                          currentQ === q
                            ? 'bg-emerald-600 border-emerald-600 text-white font-black'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {q}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Judul Kuadran
                </label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => onUpdateNode(id, { title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-emerald-500"
                  placeholder="strengths"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Poin Analisis (1 baris per poin)
                </label>
                <textarea
                  rows={5}
                  value={Array.isArray(data.items) ? data.items.join('\n') : ''}
                  onChange={(e) =>
                    onUpdateNode(id, {
                      items: e.target.value.split('\n').filter((line: string) => line.trim().length > 0),
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                  placeholder="Tulis poin analisis di sini..."
                />
              </div>
            </div>
          ) : type === 'fishbone_head' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Masalah Utama / Akibat (Problem)
                </label>
                <textarea
                  rows={2}
                  value={data.problem || data.label || ''}
                  onChange={(e) => onUpdateNode(id, { problem: e.target.value, label: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-rose-500"
                  placeholder="Misal: Keterlambatan Pengiriman Layanan..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Dampak / Metrik KPI
                </label>
                <input
                  type="text"
                  value={data.subtitle || data.metric || ''}
                  onChange={(e) => onUpdateNode(id, { subtitle: e.target.value, metric: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500"
                  placeholder="Dampak: CSAT Turun 28%..."
                />
              </div>
            </div>
          ) : type === 'fishbone_category' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kategori 6M (Ishikawa)
                </label>
                <input
                  type="text"
                  value={data.category || data.label || ''}
                  onChange={(e) => onUpdateNode(id, { category: e.target.value, label: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-blue-500"
                  placeholder="1. MAN / MANUSIA"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Sub-Judul Aspek
                </label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => onUpdateNode(id, { title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
                  placeholder="Keahlian & Beban Kerja"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Daftar Penyebab (1 baris per poin)
                </label>
                <textarea
                  rows={4}
                  value={Array.isArray(data.items) ? data.items.join('\n') : ''}
                  onChange={(e) =>
                    onUpdateNode(id, {
                      items: e.target.value.split('\n').filter((line: string) => line.trim().length > 0),
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed"
                  placeholder="Tulis penyebab di sini..."
                />
              </div>
            </div>
          ) : type === 'canvas_block' ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    No. / Kode
                  </label>
                  <input
                    type="text"
                    value={data.badgeNumber || data.number || ''}
                    onChange={(e) => onUpdateNode(id, { badgeNumber: e.target.value, number: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 font-bold text-center focus:ring-2 focus:ring-emerald-500"
                    placeholder="1"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Judul Blok
                  </label>
                  <input
                    type="text"
                    value={data.title || data.label || ''}
                    onChange={(e) => onUpdateNode(id, { title: e.target.value, label: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-emerald-500"
                    placeholder="Problem"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Pertanyaan Panduan / Subtitle
                </label>
                <input
                  type="text"
                  value={data.subtitle || data.prompt || ''}
                  onChange={(e) => onUpdateNode(id, { subtitle: e.target.value, prompt: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  placeholder="3 masalah terbesar pelanggan..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Poin Analisis Kanvas (1 baris per poin)
                </label>
                <textarea
                  rows={5}
                  value={Array.isArray(data.items) ? data.items.join('\n') : (typeof data.items === 'string' ? data.items : '')}
                  onChange={(e) =>
                    onUpdateNode(id, {
                      items: e.target.value.split('\n'),
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 leading-relaxed font-medium"
                  placeholder="Tulis poin di sini..."
                />
              </div>
            </div>
          ) : type === 'why_step' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Nomor Langkah Mengapa
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={data.stepNumber || 1}
                  onChange={(e) => onUpdateNode(id, { stepNumber: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pertanyaan Mengapa
                </label>
                <textarea
                  rows={2}
                  value={data.question || ''}
                  onChange={(e) => onUpdateNode(id, { question: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-teal-500"
                  placeholder="Mengapa aplikasi down...?"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Jawaban / Temuan
                </label>
                <textarea
                  rows={2}
                  value={data.answer || data.label || ''}
                  onChange={(e) => onUpdateNode(id, { answer: e.target.value, label: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500"
                  placeholder="Uraian temuan..."
                />
              </div>

              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(data.isRootCause)}
                    onChange={(e) => onUpdateNode(id, { isRootCause: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="font-bold text-xs text-slate-800">Tandai sebagai Akar Masalah Utama</span>
                </label>

                {data.isRootCause && (
                  <div>
                    <label className="block text-[10px] font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                      Solusi Permanen (Countermeasure)
                    </label>
                    <textarea
                      rows={2}
                      value={data.solution || ''}
                      onChange={(e) => onUpdateNode(id, { solution: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-emerald-300 bg-emerald-50/40 font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-500"
                      placeholder="Langkah perbaikan permanen..."
                    />
                  </div>
                )}
              </div>
            </div>
          ) : type === 'priority_card' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Kuadran / Label
                </label>
                <input
                  type="text"
                  value={data.quadrant || ''}
                  onChange={(e) => onUpdateNode(id, { quadrant: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-amber-500"
                  placeholder="Q1: LAKUKAN SEGERA"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Judul Kuadran
                </label>
                <input
                  type="text"
                  value={data.title || data.label || ''}
                  onChange={(e) => onUpdateNode(id, { title: e.target.value, label: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-amber-500"
                  placeholder="Mendesak & Sangat Penting"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Subtitle / Keterangan
                </label>
                <input
                  type="text"
                  value={data.subtitle || ''}
                  onChange={(e) => onUpdateNode(id, { subtitle: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500"
                  placeholder="Krisis operasional..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Daftar Tugas / Inisiatif (1 baris per poin)
                </label>
                <textarea
                  rows={4}
                  value={Array.isArray(data.items) ? data.items.join('\n') : ''}
                  onChange={(e) =>
                    onUpdateNode(id, {
                      items: e.target.value.split('\n').filter((line: string) => line.trim().length > 0),
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 leading-relaxed"
                  placeholder="Tulis inisiatif di sini..."
                />
              </div>
            </div>
          ) : type === 'swimlane_group' ? (
            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Judul Swimlane
                </label>
                <input
                  type="text"
                  value={data.title || data.label || ''}
                  onChange={(e) => onUpdateNode(id, { title: e.target.value, label: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-blue-500"
                  placeholder="ALUR PROSES LINTAS FUNGSI"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={data.showTitle !== false}
                    onChange={(e) => onUpdateNode(id, { showTitle: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Tampilkan Bar Judul Atas</span>
                </label>
              </div>

              {/* KELOLA JALUR SWIMLANE & SERVICE BLUEPRINT (LANES) */}
              <div className="border border-slate-200 rounded-2xl bg-white p-3 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-extrabold text-slate-800">
                      Kelola Jalur ({(data.lanes || []).length})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const curLanes = data.lanes || [];
                      const hasDivider = curLanes.some((l: any) => l.dividerLabel);
                      const newLane = {
                        id: `lane-${Date.now()}`,
                        name: `Jalur Baru ${curLanes.length + 1}`,
                        color: '#64748b',
                        height: 140,
                        dividerLabel: hasDivider ? `Garis Pembatas ${curLanes.length}` : undefined,
                      };
                      onUpdateNode(id, { lanes: [...curLanes, newLane] });
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                    <span>Tambah Jalur</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {(data.lanes || []).map((lane: any, lIdx: number) => (
                    <div key={lane.id || lIdx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 mr-2">
                          <input
                            type="color"
                            value={lane.color?.startsWith('#') && lane.color.length === 7 ? lane.color : '#3b82f6'}
                            onChange={(e) => {
                              const updated = (data.lanes || []).map((l: any) =>
                                l.id === lane.id ? { ...l, color: e.target.value } : l
                              );
                              onUpdateNode(id, { lanes: updated });
                            }}
                            className="w-5 h-5 rounded cursor-pointer border border-slate-300 shrink-0"
                            title="Ubah warna header jalur"
                          />
                          <input
                            type="text"
                            value={lane.name || ''}
                            onChange={(e) => {
                              const updated = (data.lanes || []).map((l: any) =>
                                l.id === lane.id ? { ...l, name: e.target.value } : l
                              );
                              onUpdateNode(id, { lanes: updated });
                            }}
                            className="flex-1 px-2 py-1 text-xs font-bold rounded border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500"
                            placeholder="Nama jalur..."
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Reorder Up */}
                          <button
                            type="button"
                            disabled={lIdx === 0}
                            onClick={() => {
                              const lanes = [...(data.lanes || [])];
                              const temp = lanes[lIdx];
                              lanes[lIdx] = lanes[lIdx - 1];
                              lanes[lIdx - 1] = temp;
                              onUpdateNode(id, { lanes });
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                            title="Geser Naik"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          {/* Reorder Down */}
                          <button
                            type="button"
                            disabled={lIdx === (data.lanes || []).length - 1}
                            onClick={() => {
                              const lanes = [...(data.lanes || [])];
                              const temp = lanes[lIdx];
                              lanes[lIdx] = lanes[lIdx + 1];
                              lanes[lIdx + 1] = temp;
                              onUpdateNode(id, { lanes });
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                            title="Geser Turun"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          {/* Delete Lane */}
                          {(data.lanes || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const remaining = (data.lanes || []).filter((l: any) => l.id !== lane.id);
                                onUpdateNode(id, { lanes: remaining });
                              }}
                              className="p-1 text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                              title="Hapus Jalur"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Divider Label (Khusus Service Blueprint: Line of interaction, Line of visibility, dll) */}
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">
                          Label Garis Pembatas (Service Blueprint)
                        </label>
                        <input
                          type="text"
                          value={lane.dividerLabel || ''}
                          onChange={(e) => {
                            const updated = (data.lanes || []).map((l: any) =>
                              l.id === lane.id ? { ...l, dividerLabel: e.target.value } : l
                            );
                            onUpdateNode(id, { lanes: updated });
                          }}
                          className="w-full px-2 py-1 text-xs rounded border border-slate-200 bg-white text-slate-700 focus:ring-1 focus:ring-blue-500"
                          placeholder="Misal: Line of interaction / visibility"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ======================================================== */}
              {/* GRID LAYOUT SECTION (PERSIS SEPERTI GAMBAR REFERENSI USER) */}
              {/* ======================================================== */}
              <div className="border border-slate-200 rounded-2xl bg-white shadow-2xs overflow-hidden">
                <div className="p-3 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-extrabold text-slate-800 tracking-tight">Grid layout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Toggle Switch On/Off */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.gridLayout !== false}
                        onChange={(e) => onUpdateNode(id, { gridLayout: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <button
                      type="button"
                      onClick={() => setGridExpanded(!gridExpanded)}
                      className="p-1 rounded hover:bg-slate-200 text-slate-500 cursor-pointer"
                      title={gridExpanded ? 'Tutup Panel Grid' : 'Buka Panel Grid'}
                    >
                      {gridExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {gridExpanded && (
                  <div className="p-3 space-y-3.5">
                    {/* 1. Spacing */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Spacing</span>
                        <button
                          type="button"
                          onClick={() => setLockSpacing(!lockSpacing)}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            lockSpacing ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600'
                          }`}
                          title={lockSpacing ? 'Tautan Terkunci (Sama)' : 'Tautan Bebas'}
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Spacing Y */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70">
                          <MoveVertical className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={2}
                            value={data.spacingY !== undefined ? Number(data.spacingY) : 16}
                            onChange={(e) => {
                              const val = Math.max(0, Number(e.target.value));
                              onUpdateNode(id, lockSpacing ? { spacingY: val, spacingX: val } : { spacingY: val });
                            }}
                            className="w-full text-xs font-bold font-mono bg-transparent outline-hidden text-slate-800"
                          />
                          <span className="text-[10px] text-slate-400 font-mono">px</span>
                        </div>
                        {/* Spacing X */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70">
                          <MoveHorizontal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={2}
                            value={data.spacingX !== undefined ? Number(data.spacingX) : 16}
                            onChange={(e) => {
                              const val = Math.max(0, Number(e.target.value));
                              onUpdateNode(id, lockSpacing ? { spacingX: val, spacingY: val } : { spacingX: val });
                            }}
                            className="w-full text-xs font-bold font-mono bg-transparent outline-hidden text-slate-800"
                          />
                          <span className="text-[10px] text-slate-400 font-mono">px</span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Padding */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Padding</span>
                        <button
                          type="button"
                          onClick={() => setLockPadding(!lockPadding)}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            lockPadding ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600'
                          }`}
                          title={lockPadding ? 'Tautan Terkunci (Sama)' : 'Tautan Bebas'}
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Padding Y */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70">
                          <span className="text-xs text-slate-500 font-mono font-bold">🟰</span>
                          <input
                            type="number"
                            min={0}
                            max={120}
                            step={4}
                            value={data.paddingY !== undefined ? Number(data.paddingY) : 16}
                            onChange={(e) => {
                              const val = Math.max(0, Number(e.target.value));
                              onUpdateNode(id, lockPadding ? { paddingY: val, paddingX: val } : { paddingY: val });
                            }}
                            className="w-full text-xs font-bold font-mono bg-transparent outline-hidden text-slate-800"
                          />
                          <span className="text-[10px] text-slate-400 font-mono">px</span>
                        </div>
                        {/* Padding X */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70">
                          <span className="text-xs text-slate-500 font-mono font-bold">⏸</span>
                          <input
                            type="number"
                            min={0}
                            max={120}
                            step={4}
                            value={data.paddingX !== undefined ? Number(data.paddingX) : 24}
                            onChange={(e) => {
                              const val = Math.max(0, Number(e.target.value));
                              onUpdateNode(id, lockPadding ? { paddingX: val, paddingY: val } : { paddingX: val });
                            }}
                            className="w-full text-xs font-bold font-mono bg-transparent outline-hidden text-slate-800"
                          />
                          <span className="text-[10px] text-slate-400 font-mono">px</span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Sizing (Fit | Manual) */}
                    <div className="space-y-1.5">
                      <span className="block text-xs font-bold text-slate-700">Sizing</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!selectedNode) return;
                            const allNodes = getNodes();
                            const containerX = selectedNode.position.x;
                            const containerY = selectedNode.position.y;
                            const lanes = (data.lanes as any[]) || [];
                            const padX = data.paddingX !== undefined ? Number(data.paddingX) : 24;
                            const titleH = data.showTitle !== false ? 32 : 0;
                            const containerH = titleH + lanes.reduce((acc: number, l: any) => acc + (l.height || 160), 0);

                            const inside = allNodes.filter((n) => {
                              if (n.id === selectedNode.id) return false;
                              return (
                                n.position.x >= containerX - 40 &&
                                n.position.x <= containerX + (Number(data.width) || 1160) + 200 &&
                                n.position.y >= containerY - 20 &&
                                n.position.y <= containerY + containerH + 50
                              );
                            });

                            if (inside.length > 0) {
                              const maxRight = Math.max(...inside.map((n) => n.position.x + (Number(n.data?.width) || n.measured?.width || 140)));
                              const neededWidth = Math.max(900, Math.round(maxRight - containerX + padX + 60));
                              onUpdateNode(id, { width: neededWidth, gridSizing: 'fit' });
                            }
                          }}
                          className="px-3 py-2 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/60 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                          title="Paskan ukuran kontainer ke semua elemen di dalamnya"
                        >
                          <Minimize2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Fit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateNode(id, { gridSizing: 'manual' })}
                          className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
                            data.gridSizing !== 'fit'
                              ? 'border-blue-500 bg-blue-50 text-blue-800'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                          title="Ukuran manual leluasa diubah via handle drag"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Manual</span>
                        </button>
                      </div>
                    </div>

                    {/* 4. Lines (Auto line routing) */}
                    <div className="space-y-1.5">
                      <span className="block text-xs font-bold text-slate-700">Lines</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (!selectedNode) return;
                          const allNodes = getNodes();
                          const allEdges = getEdges();
                          const containerX = selectedNode.position.x;
                          const containerY = selectedNode.position.y;
                          const containerW = Number(data.width) || 1160;
                          const lanes = (data.lanes as any[]) || [];
                          const titleH = data.showTitle !== false ? 32 : 0;
                          const containerH = titleH + lanes.reduce((acc: number, l: any) => acc + (l.height || 160), 0);

                          const insideNodeIds = new Set(
                            allNodes
                              .filter((n) => {
                                if (n.id === selectedNode.id) return false;
                                return (
                                  n.position.x >= containerX - 40 &&
                                  n.position.x <= containerX + containerW + 40 &&
                                  n.position.y >= containerY - 20 &&
                                  n.position.y <= containerY + containerH + 40
                                );
                              })
                              .map((n) => n.id)
                          );

                          const updatedEdges = allEdges.map((e) => {
                            if (insideNodeIds.has(e.source) && insideNodeIds.has(e.target)) {
                              const srcNode = allNodes.find((n) => n.id === e.source);
                              const tgtNode = allNodes.find((n) => n.id === e.target);
                              if (srcNode && tgtNode) {
                                const dx = tgtNode.position.x - srcNode.position.x;
                                const dy = tgtNode.position.y - srcNode.position.y;
                                let sHandle = 'r-out';
                                let tHandle = 'l-in';
                                if (Math.abs(dx) >= Math.abs(dy)) {
                                  sHandle = dx >= 0 ? 'r-out' : 'l-out';
                                  tHandle = dx >= 0 ? 'l-in' : 'r-in';
                                } else {
                                  sHandle = dy >= 0 ? 'b-out' : 't-out';
                                  tHandle = dy >= 0 ? 't-in' : 'b-in';
                                }
                                return {
                                  ...e,
                                  type: 'smoothstep',
                                  sourceHandle: sHandle,
                                  targetHandle: tHandle,
                                  markerEnd: e.markerEnd || { type: MarkerType.ArrowClosed, color: '#3b82f6' },
                                  style: { ...(e.style || {}), strokeWidth: 2 },
                                };
                              }
                            }
                            return e;
                          });

                          setEdges(updatedEdges);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl border border-slate-300 hover:border-blue-500 bg-slate-100 hover:bg-blue-50/80 text-xs font-bold text-slate-800 flex items-center justify-between transition-all cursor-pointer shadow-2xs"
                        title="Otomatis merapikan garis alur tegak lurus melewati sela petak grid"
                      >
                        <span>Auto line routing</span>
                        <Wand2 className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>

                    {/* 5. Alignment Toolbar */}
                    <div className="space-y-1.5">
                      <span className="block text-xs font-bold text-slate-700">Alignment</span>
                      <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200">
                        {/* Horizontal Alignments */}
                        <button
                          type="button"
                          onClick={() => {
                            if (!selectedNode) return;
                            const allNodes = getNodes();
                            const containerX = selectedNode.position.x;
                            const containerW = Number(data.width) || 1160;
                            const headerWidth = data.headerWidth ? Number(data.headerWidth) : (data.isServiceBlueprint ? 120 : 60);
                            const padX = data.paddingX !== undefined ? Number(data.paddingX) : 24;

                            setNodes((nds) =>
                              nds.map((n) => {
                                if (n.id === selectedNode.id) return n;
                                const nw = Number(n.data?.width) || n.measured?.width || 140;
                                if (n.position.x >= containerX - 40 && n.position.x <= containerX + containerW + 40) {
                                  return { ...n, position: { ...n.position, x: Math.round(containerX + headerWidth + padX) } };
                                }
                                return n;
                              })
                            );
                          }}
                          className="flex-1 py-1.5 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Rata Kiri"
                        >
                          <AlignLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!selectedNode) return;
                            const allNodes = getNodes();
                            const containerX = selectedNode.position.x;
                            const containerW = Number(data.width) || 1160;
                            const headerWidth = data.headerWidth ? Number(data.headerWidth) : (data.isServiceBlueprint ? 120 : 60);

                            setNodes((nds) =>
                              nds.map((n) => {
                                if (n.id === selectedNode.id) return n;
                                const nw = Number(n.data?.width) || n.measured?.width || 140;
                                if (n.position.x >= containerX - 40 && n.position.x <= containerX + containerW + 40) {
                                  return { ...n, position: { ...n.position, x: Math.round(containerX + headerWidth + (containerW - headerWidth - nw) / 2) } };
                                }
                                return n;
                              })
                            );
                          }}
                          className="flex-1 py-1.5 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Rata Tengah Horizontal"
                        >
                          <AlignCenter className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!selectedNode) return;
                            const allNodes = getNodes();
                            const containerX = selectedNode.position.x;
                            const containerW = Number(data.width) || 1160;
                            const padX = data.paddingX !== undefined ? Number(data.paddingX) : 24;

                            setNodes((nds) =>
                              nds.map((n) => {
                                if (n.id === selectedNode.id) return n;
                                const nw = Number(n.data?.width) || n.measured?.width || 140;
                                if (n.position.x >= containerX - 40 && n.position.x <= containerX + containerW + 40) {
                                  return { ...n, position: { ...n.position, x: Math.round(containerX + containerW - padX - nw) } };
                                }
                                return n;
                              })
                            );
                          }}
                          className="flex-1 py-1.5 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Rata Kanan"
                        >
                          <AlignRight className="w-4 h-4" />
                        </button>

                        <div className="w-[1px] h-4 bg-slate-300 mx-0.5" />

                        {/* Vertical Alignments */}
                        <button
                          type="button"
                          onClick={() => {
                            if (!selectedNode) return;
                            const allNodes = getNodes();
                            const containerX = selectedNode.position.x;
                            const containerY = selectedNode.position.y;
                            const containerW = Number(data.width) || 1160;
                            const lanes = (data.lanes as any[]) || [];
                            const titleH = data.showTitle !== false ? 32 : 0;
                            const padY = data.paddingY !== undefined ? Number(data.paddingY) : 16;

                            let curY = containerY + titleH;
                            const laneBounds = lanes.map((l: any) => {
                              const h = l.height || 160;
                              const bound = { top: curY, bottom: curY + h, height: h };
                              curY += h;
                              return bound;
                            });

                            setNodes((nds) =>
                              nds.map((n) => {
                                if (n.id === selectedNode.id) return n;
                                const nh = Number(n.data?.height) || n.measured?.height || 60;
                                const cy = n.position.y + nh / 2;
                                const b = laneBounds.find((lb) => cy >= lb.top && cy <= lb.bottom);
                                if (b && n.position.x >= containerX - 40 && n.position.x <= containerX + containerW + 40) {
                                  return { ...n, position: { ...n.position, y: Math.round(b.top + padY) } };
                                }
                                return n;
                              })
                            );
                          }}
                          className="flex-1 py-1.5 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Rata Atas Jalur"
                        >
                          <AlignStartVertical className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!selectedNode) return;
                            const allNodes = getNodes();
                            const containerX = selectedNode.position.x;
                            const containerY = selectedNode.position.y;
                            const containerW = Number(data.width) || 1160;
                            const lanes = (data.lanes as any[]) || [];
                            const titleH = data.showTitle !== false ? 32 : 0;

                            let curY = containerY + titleH;
                            const laneBounds = lanes.map((l: any) => {
                              const h = l.height || 160;
                              const bound = { top: curY, bottom: curY + h, height: h };
                              curY += h;
                              return bound;
                            });

                            setNodes((nds) =>
                              nds.map((n) => {
                                if (n.id === selectedNode.id) return n;
                                const nh = Number(n.data?.height) || n.measured?.height || 60;
                                const cy = n.position.y + nh / 2;
                                const b = laneBounds.find((lb) => cy >= lb.top && cy <= lb.bottom);
                                if (b && n.position.x >= containerX - 40 && n.position.x <= containerX + containerW + 40) {
                                  return { ...n, position: { ...n.position, y: Math.round(b.top + (b.height - nh) / 2) } };
                                }
                                return n;
                              })
                            );
                          }}
                          className="flex-1 py-1.5 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Rata Tengah Vertikal Jalur"
                        >
                          <AlignVerticalSpaceAround className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!selectedNode) return;
                            const allNodes = getNodes();
                            const containerX = selectedNode.position.x;
                            const containerY = selectedNode.position.y;
                            const containerW = Number(data.width) || 1160;
                            const lanes = (data.lanes as any[]) || [];
                            const titleH = data.showTitle !== false ? 32 : 0;
                            const padY = data.paddingY !== undefined ? Number(data.paddingY) : 16;

                            let curY = containerY + titleH;
                            const laneBounds = lanes.map((l: any) => {
                              const h = l.height || 160;
                              const bound = { top: curY, bottom: curY + h, height: h };
                              curY += h;
                              return bound;
                            });

                            setNodes((nds) =>
                              nds.map((n) => {
                                if (n.id === selectedNode.id) return n;
                                const nh = Number(n.data?.height) || n.measured?.height || 60;
                                const cy = n.position.y + nh / 2;
                                const b = laneBounds.find((lb) => cy >= lb.top && cy <= lb.bottom);
                                if (b && n.position.x >= containerX - 40 && n.position.x <= containerX + containerW + 40) {
                                  return { ...n, position: { ...n.position, y: Math.round(b.bottom - padY - nh) } };
                                }
                                return n;
                              })
                            );
                          }}
                          className="flex-1 py-1.5 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Rata Bawah Jalur"
                        >
                          <AlignEndVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* 6. Container behavior */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span>Container behavior</span>
                        <button
                          type="button"
                          onClick={() => setBehaviorExpanded(!behaviorExpanded)}
                          className="p-1 rounded hover:bg-slate-200 text-slate-500 cursor-pointer"
                        >
                          {behaviorExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {behaviorExpanded && (
                        <div className="space-y-3 pl-1">
                          {/* Magnetize */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-xs font-bold text-slate-800">Magnetize</div>
                              <div className="text-[10px] text-slate-500">Move content and container together</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                              <input
                                type="checkbox"
                                checked={data.magnetize !== false}
                                onChange={(e) => onUpdateNode(id, { magnetize: e.target.checked })}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          {/* Nudging */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-xs font-bold text-slate-800">Nudging</div>
                              <div className="text-[10px] text-slate-500">Move nearby shapes when resizing</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                              <input
                                type="checkbox"
                                checked={Boolean(data.nudging)}
                                onChange={(e) => onUpdateNode(id, { nudging: e.target.checked })}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 7. Advanced options */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setAdvancedExpanded(!advancedExpanded)}
                        className="w-full flex items-center justify-between text-xs font-bold text-slate-800 py-1 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <span>Advanced options</span>
                        {advancedExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {advancedExpanded && (
                        <div className="space-y-2.5 p-2.5 bg-slate-50/80 rounded-xl border border-slate-200">
                          {/* Jumlah Kolom Grid */}
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700">Jumlah Kolom Grid:</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  const curr = data.gridColumns ? Number(data.gridColumns) : 7;
                                  if (curr > 3) onUpdateNode(id, { gridColumns: curr - 1 });
                                }}
                                className="w-6 h-6 rounded bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-6 text-center font-mono font-bold text-slate-800">
                                {data.gridColumns ? Number(data.gridColumns) : 7}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const curr = data.gridColumns ? Number(data.gridColumns) : 7;
                                  if (curr < 16) onUpdateNode(id, { gridColumns: curr + 1 });
                                }}
                                className="w-6 h-6 rounded bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Checkbox Petak Slot Abu-abu */}
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                            <input
                              type="checkbox"
                              checked={data.showGridSlots !== false}
                              onChange={(e) => onUpdateNode(id, { showGridSlots: e.target.checked })}
                              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                            />
                            <span>Tampilkan Slot Petak Abu-Abu</span>
                          </label>

                          {/* Tombol Ratakan ke Slot Grid */}
                          <button
                            type="button"
                            onClick={() => {
                              if (!selectedNode) return;
                              const allNodes = getNodes();
                              const containerX = selectedNode.position.x;
                              const containerY = selectedNode.position.y;
                              const containerW = Number(data.width) || 1160;
                              const lanes = (data.lanes as any[]) || [];
                              const headerWidth = data.headerWidth ? Number(data.headerWidth) : (data.isServiceBlueprint ? 120 : 60);
                              const titleH = data.showTitle !== false ? 32 : 0;
                              const gridCols = data.gridColumns ? Math.max(3, Math.min(16, Number(data.gridColumns))) : 7;
                              const padX = data.paddingX !== undefined ? Number(data.paddingX) : 24;
                              const spcX = data.spacingX !== undefined ? Number(data.spacingX) : 16;

                              const laneUsableW = containerW - headerWidth - padX * 2;
                              const totalGaps = spcX * (gridCols - 1);
                              const slotW = Math.max(60, (laneUsableW - totalGaps) / gridCols);

                              const slotCentersX: number[] = [];
                              for (let c = 0; c < gridCols; c++) {
                                const slotLeft = containerX + headerWidth + padX + c * (slotW + spcX);
                                slotCentersX.push(slotLeft + slotW / 2);
                              }

                              let curY = containerY + titleH;
                              const laneBounds = lanes.map((l: any) => {
                                const h = l.height || 160;
                                const bound = { top: curY, bottom: curY + h, height: h, centerY: curY + h / 2 };
                                curY += h;
                                return bound;
                              });

                              setNodes((nds) =>
                                nds.map((n) => {
                                  if (n.id === selectedNode.id) return n;
                                  const nw = Number(n.data?.width) || n.measured?.width || 140;
                                  const nh = Number(n.data?.height) || n.measured?.height || 60;
                                  const nodeCenterX = n.position.x + nw / 2;
                                  const nodeCenterY = n.position.y + nh / 2;

                                  const targetLane = laneBounds.find((lb) => nodeCenterY >= lb.top && nodeCenterY <= lb.bottom);
                                  if (targetLane && nodeCenterX >= containerX && nodeCenterX <= containerX + containerW) {
                                    let closestCol = 0;
                                    let minDiff = Infinity;
                                    slotCentersX.forEach((sc, colIdx) => {
                                      const diff = Math.abs(nodeCenterX - sc);
                                      if (diff < minDiff) {
                                        minDiff = diff;
                                        closestCol = colIdx;
                                      }
                                    });

                                    const targetX = Math.round(slotCentersX[closestCol] - nw / 2);
                                    const targetY = Math.round(targetLane.centerY - nh / 2);

                                    return {
                                      ...n,
                                      position: { x: targetX, y: targetY },
                                    };
                                  }
                                  return n;
                                })
                              );
                            }}
                            className="w-full py-2 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Ratakan Bentuk ke Petak Grid</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Daftar Jalur Fungsi */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Daftar Jalur Fungsi ({(data.lanes || []).length || 4})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const currentLanes = data.lanes || [
                        { id: 'customer', name: 'Customer', color: '#0284c7', height: 160 },
                        { id: 'sales', name: 'Sales', color: '#0d9488', height: 160 },
                        { id: 'management', name: 'Management', color: '#4f46e5', height: 160 },
                        { id: 'credit', name: 'Credit department', color: '#db2777', height: 160 },
                      ];
                      const newLane = {
                        id: `lane-${Date.now()}`,
                        name: `Jalur ${currentLanes.length + 1}`,
                        color: '#64748b',
                        height: 160,
                      };
                      onUpdateNode(id, { lanes: [...currentLanes, newLane] });
                    }}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    + Tambah Jalur
                  </button>
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {(data.lanes || [
                    { id: 'customer', name: 'Customer', color: '#0284c7', height: 160 },
                    { id: 'sales', name: 'Sales', color: '#0d9488', height: 160 },
                    { id: 'management', name: 'Management', color: '#4f46e5', height: 160 },
                    { id: 'credit', name: 'Credit department', color: '#db2777', height: 160 },
                  ]).map((lane: any, idx: number, arr: any[]) => (
                    <div key={lane.id || idx} className="p-2 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={lane.color || '#3b82f6'}
                          onChange={(e) => {
                            const updated = arr.map((l, i) => i === idx ? { ...l, color: e.target.value } : l);
                            onUpdateNode(id, { lanes: updated });
                          }}
                          className="w-6 h-6 rounded border border-slate-300 cursor-pointer shrink-0"
                          title="Warna Header Jalur"
                        />
                        <input
                          type="text"
                          value={lane.name}
                          onChange={(e) => {
                            const updated = arr.map((l, i) => i === idx ? { ...l, name: e.target.value } : l);
                            onUpdateNode(id, { lanes: updated });
                          }}
                          className="flex-1 px-2 py-1 text-xs rounded border border-slate-200 font-bold bg-white"
                          placeholder="Nama Jalur..."
                        />
                        {arr.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = arr.filter((_, i) => i !== idx);
                              onUpdateNode(id, { lanes: updated });
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Hapus Jalur Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : type === 'process_legend' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Judul Legenda
                </label>
                <input
                  type="text"
                  value={data.title || data.label || ''}
                  onChange={(e) => onUpdateNode(id, { title: e.target.value, label: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-blue-500"
                  placeholder="Process flow shapes"
                />
              </div>

              {/* Daftar Item Legenda */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Item Peran / Warna
                </label>
                <div className="space-y-1.5">
                  {(data.items || [
                    { label: 'Customer', color: '#0284c7' },
                    { label: 'Sales', color: '#0d9488' },
                    { label: 'Management', color: '#4f46e5' },
                    { label: 'Credit department', color: '#db2777' },
                  ]).map((item: any, idx: number, arr: any[]) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={item.color || '#3b82f6'}
                        onChange={(e) => {
                          const updated = arr.map((it, i) => i === idx ? { ...it, color: e.target.value } : it);
                          onUpdateNode(id, { items: updated });
                        }}
                        className="w-6 h-6 rounded border border-slate-300 cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const updated = arr.map((it, i) => i === idx ? { ...it, label: e.target.value } : it);
                          onUpdateNode(id, { items: updated });
                        }}
                        className="flex-1 px-2 py-1 text-xs rounded border border-slate-200 font-semibold bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Teks Label Standar */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Type className="w-3.5 h-3.5 text-blue-600" />
                  <span>Teks / Label Utama</span>
                </label>
                {type === 'stickynote' ? (
                  <textarea
                    rows={3}
                    value={currentLabel}
                    onChange={(e) => onUpdateNode(id, { label: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed"
                    placeholder="Tulis catatan..."
                  />
                ) : (
                  <input
                    type="text"
                    value={currentLabel}
                    onChange={(e) => onUpdateNode(id, { label: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="Tulis judul langkah..."
                  />
                )}
              </div>

              {/* Sublabel (Opsional) */}
              {type !== 'decision' && type !== 'text' && type !== 'stickynote' && (
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Keterangan Tambahan
                  </label>
                  <input
                    type="text"
                    value={currentSublabel}
                    onChange={(e) => onUpdateNode(id, { sublabel: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    placeholder="Deskripsi singkat..."
                  />
                </div>
              )}

              {/* Lencana Status Alur (✓ Disetujui / ✕ Ditolak) */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Lencana Status (Status Badge)
                </label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => onUpdateNode(id, { statusBadge: undefined })}
                    className={`py-1 px-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      !data.statusBadge
                        ? 'bg-slate-100 border-slate-300 text-slate-800 font-bold'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Tanpa
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateNode(id, { statusBadge: 'success' })}
                    className={`py-1 px-1.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      data.statusBadge === 'success'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-emerald-700 hover:bg-emerald-50/50'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>Setuju</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateNode(id, { statusBadge: 'error' })}
                    className={`py-1 px-1.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      data.statusBadge === 'error'
                        ? 'bg-rose-50 border-rose-500 text-rose-800 font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-rose-700 hover:bg-rose-50/50'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold">✕</span>
                    <span>Ditolak</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* SEKSI: IKON, EMOTICON & LOGO                              */}
          {/* ======================================================== */}
          <div id="property-icon-section" className="pt-2.5 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-amber-500" />
                <span>Ikon, Emoticon & Logo</span>
              </label>
              {hasActiveIcon && (
                <button
                  type="button"
                  onClick={() => onUpdateNode(id, { icon: 'none', emoji: undefined, iconUrl: undefined })}
                  className="text-[10px] text-red-500 hover:text-red-700 hover:underline font-medium cursor-pointer"
                  title="Hapus / Sembunyikan ikon dari bentuk ini"
                >
                  Hapus Ikon
                </button>
              )}
            </div>

            {/* Active Icon Preview Badge */}
            {hasActiveIcon ? (
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/70 border border-amber-200/80">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-white border border-amber-200 flex items-center justify-center shadow-2xs shrink-0">
                    <NodeIconDisplay
                      icon={data.icon}
                      emoji={data.emoji}
                      iconUrl={data.iconUrl}
                      color={data.iconColor}
                      defaultIcon={type === 'database' ? 'database' : type === 'cloud' ? 'cloud' : undefined}
                      defaultColor={type === 'database' ? '#9333ea' : '#16a34a'}
                      size="md"
                    />
                  </div>
                  <div className="truncate">
                    <div className="text-[11px] font-bold text-slate-800 truncate">
                      {data.emoji ? `Emoji: ${data.emoji}` : data.iconUrl ? 'Logo Kustom / Gambar' : `Ikon: ${data.icon || effectiveIcon}`}
                    </div>
                    <div className="text-[10px] text-slate-500">Aktif pada bentuk</div>
                  </div>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold shrink-0">
                  Terpasang
                </span>
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center text-[11px] text-slate-500">
                Bentuk ini belum memiliki ikon atau logo.
              </div>
            )}

            {/* Tab Pemilihan: Ikon Vektor | Emoji / Emoticon | Logo & URL */}
            <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setIconTab('icon')}
                className={`py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  iconTab === 'icon' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ikon Vektor
              </button>
              <button
                type="button"
                onClick={() => setIconTab('emoji')}
                className={`py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  iconTab === 'emoji' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Emoji/Emoticon
              </button>
              <button
                type="button"
                onClick={() => setIconTab('logo')}
                className={`py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  iconTab === 'logo' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Logo & URL
              </button>
            </div>

            {/* TAB 1: IKON VEKTOR LUCIDE */}
            {iconTab === 'icon' && (
              <div className="space-y-2">
                {/* Search Ikon */}
                <div className="relative">
                  <input
                    type="text"
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    placeholder="Cari ikon (db, server, cloud, code)..."
                    className="w-full pl-7 pr-2 py-1 text-[11px] rounded-md border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
                </div>

                {/* Kategori Tab Mini */}
                {!iconSearch && (
                  <div className="flex gap-1 overflow-x-auto pb-1 custom-scrollbar">
                    {ICON_CATEGORIES.map((cat, idx) => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => setIconCategoryIndex(idx)}
                        className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap cursor-pointer transition-colors ${
                          iconCategoryIndex === idx
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Grid Ikon */}
                <div className="grid grid-cols-4 gap-1 max-h-36 overflow-y-auto p-1 bg-slate-50/70 border border-slate-200/80 rounded-lg custom-scrollbar">
                  {filteredIcons.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = (data.icon || effectiveIcon) === item.id && !data.emoji && !data.iconUrl;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onUpdateNode(id, {
                            icon: item.id,
                            emoji: undefined,
                            iconUrl: undefined,
                            iconColor: data.iconColor || (item.id === 'database' ? '#9333ea' : item.id === 'cloud' ? '#16a34a' : undefined),
                          });
                        }}
                        className={`p-1.5 rounded-md flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500 font-bold'
                            : 'bg-white hover:bg-blue-50/60 text-slate-700 border border-slate-200/60'
                        }`}
                        title={item.label}
                      >
                        <IconComp className="w-4 h-4" />
                        <span className="text-[9px] truncate w-full text-center leading-tight">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: EMOJI & EMOTICON */}
            {iconTab === 'emoji' && (
              <div className="space-y-2">
                {/* Input Langsung Emoji / Emoticon */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                    Ketik / Tempel Emoji Bebas:
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={customEmojiInput || data.emoji || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomEmojiInput(val);
                        if (val.trim()) {
                          onUpdateNode(id, { emoji: val.trim(), icon: undefined, iconUrl: undefined });
                        }
                      }}
                      placeholder="Contoh: 🐘, 🗄️, 🚀, ^_^"
                      className="flex-1 px-2 py-1 text-xs rounded-md border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customEmojiInput.trim()) {
                          onUpdateNode(id, { emoji: customEmojiInput.trim(), icon: undefined, iconUrl: undefined });
                        }
                      }}
                      className="px-2 py-1 text-[10px] font-bold bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors cursor-pointer"
                    >
                      Terapkan
                    </button>
                  </div>
                </div>

                {/* Preset Kategori Emoji Populer */}
                <div className="space-y-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50/70 border border-slate-200/80 rounded-lg custom-scrollbar">
                  {POPULAR_EMOJI_PRESETS.map((group) => (
                    <div key={group.group}>
                      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5 px-0.5">
                        {group.group}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {group.emojis.map((em) => (
                          <button
                            key={em}
                            type="button"
                            onClick={() => {
                              setCustomEmojiInput(em);
                              onUpdateNode(id, { emoji: em, icon: undefined, iconUrl: undefined });
                            }}
                            className={`w-7 h-7 text-sm rounded-md flex items-center justify-center transition-all cursor-pointer ${
                              data.emoji === em
                                ? 'bg-amber-100 ring-2 ring-amber-500 scale-110 shadow-2xs'
                                : 'bg-white hover:bg-amber-50 border border-slate-200/60'
                            }`}
                            title={em}
                          >
                            {em}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: LOGO & GAMBAR KUSTOM */}
            {iconTab === 'logo' && (
              <div className="space-y-2">
                {/* Upload File Gambar dari Komputer */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          onUpdateNode(id, {
                            iconUrl: reader.result as string,
                            icon: undefined,
                            emoji: undefined,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-1.5 px-2 rounded-lg border border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-blue-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Unggah Logo dari Komputer (PNG/SVG)</span>
                  </button>
                </div>

                {/* Input URL Gambar */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                    Atau Masukkan URL Logo / Gambar:
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={customLogoUrl || data.iconUrl || ''}
                      onChange={(e) => setCustomLogoUrl(e.target.value)}
                      placeholder="https://... /logo.png"
                      className="flex-1 px-2 py-1 text-[11px] rounded-md border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customLogoUrl.trim()) {
                          onUpdateNode(id, {
                            iconUrl: customLogoUrl.trim(),
                            icon: undefined,
                            emoji: undefined,
                          });
                        }
                      }}
                      className="px-2 py-1 text-[10px] font-bold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Pasang
                    </button>
                  </div>
                </div>

                {/* Preset Logo Populer (PostgreSQL, MySQL, Redis, AWS, Docker, dll) */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                    Pilihan Cepat Logo Teknologi Populer:
                  </label>
                  <div className="grid grid-cols-3 gap-1 max-h-32 overflow-y-auto p-1 bg-slate-50/70 border border-slate-200/80 rounded-lg custom-scrollbar">
                    {POPULAR_LOGO_PRESETS.map((logo) => {
                      const isSelected = data.iconUrl === logo.iconUrl;
                      return (
                        <button
                          key={logo.name}
                          type="button"
                          onClick={() => {
                            setCustomLogoUrl(logo.iconUrl);
                            onUpdateNode(id, {
                              iconUrl: logo.iconUrl,
                              icon: undefined,
                              emoji: undefined,
                            });
                          }}
                          className={`p-1.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-100 ring-2 ring-blue-500 font-bold text-blue-900'
                              : 'bg-white hover:bg-blue-50/50 border border-slate-200/60 text-slate-700'
                          }`}
                          title={logo.name}
                        >
                          <img
                            src={logo.iconUrl}
                            alt={logo.name}
                            className="w-4 h-4 object-contain shrink-0"
                          />
                          <span className="text-[10px] truncate">{logo.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* OPSI WARNA & UKURAN IKON (Jika Ikon Aktif) */}
            {hasActiveIcon && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                {/* Warna Ikon (khusus Ikon Vektor) */}
                {!data.emoji && !data.iconUrl && (
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                      Warna Ikon
                    </label>
                    <div className="flex items-center gap-1 flex-wrap">
                      {[
                        { color: '#9333ea', label: 'Ungu Database' },
                        { color: '#2563eb', label: 'Biru Sistem' },
                        { color: '#059669', label: 'Emerald' },
                        { color: '#d97706', label: 'Amber/Gold' },
                        { color: '#dc2626', label: 'Merah' },
                        { color: '#475569', label: 'Slate' },
                        { color: '#0f172a', label: 'Hitam' },
                      ].map((c) => (
                        <button
                          key={c.color}
                          type="button"
                          onClick={() => onUpdateNode(id, { iconColor: c.color })}
                          style={{ backgroundColor: c.color }}
                          className={`w-5 h-5 rounded-full cursor-pointer transition-transform hover:scale-110 shadow-2xs ${
                            data.iconColor === c.color ? 'ring-2 ring-offset-1 ring-blue-500 scale-110' : ''
                          }`}
                          title={c.label}
                        />
                      ))}
                      <input
                        type="color"
                        value={data.iconColor || '#9333ea'}
                        onChange={(e) => onUpdateNode(id, { iconColor: e.target.value })}
                        className="w-5 h-5 rounded-full cursor-pointer border-0 p-0 bg-transparent"
                        title="Pilih Warna Ikon Kustom"
                      />
                    </div>
                  </div>
                )}

                {/* Ukuran Ikon */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                    Ukuran Ikon
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { id: 'sm', label: 'Kecil' },
                      { id: 'md', label: 'Sedang' },
                      { id: 'lg', label: 'Besar' },
                      { id: 'xl', label: 'Ekstra' },
                    ].map((sz) => (
                      <button
                        key={sz.id}
                        type="button"
                        onClick={() => onUpdateNode(id, { iconSize: sz.id })}
                        className={`py-0.5 text-[10px] rounded-md border transition-all cursor-pointer ${
                          (data.iconSize || 'md') === sz.id
                            ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {sz.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. UKURAN & DIMENSI BENTUK (WIDTH & HEIGHT)               */}
        {/* ======================================================== */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Ukuran Bentuk (Dimensi)</span>
            </label>
            {(data.width || data.height) && (
              <button
                type="button"
                onClick={() => onUpdateNode(id, { width: undefined, height: undefined })}
                className="text-[10px] text-slate-400 hover:text-blue-600 font-medium underline cursor-pointer"
                title="Kembalikan ukuran ke default bentuk"
              >
                Reset Default
              </button>
            )}
          </div>

          {/* Lebar (Width) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-600">Lebar (Width)</span>
              <span className="font-mono font-bold text-blue-700 px-1.5 py-0.2 rounded bg-blue-50 border border-blue-200">
                {currentWidth}px
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onUpdateNode(id, { width: Math.max(40, currentWidth - 10) })}
                className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                title="Kurangi Lebar (-10px)"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <div className="flex-1 grid grid-cols-4 gap-1">
                {[
                  { w: 100, label: 'Kecil' },
                  { w: 140, label: 'Standar' },
                  { w: 190, label: 'Lebar' },
                  { w: 240, label: 'Ekstra' },
                ].map((pw) => (
                  <button
                    key={pw.w}
                    type="button"
                    onClick={() => onUpdateNode(id, { width: pw.w })}
                    className={`py-1 text-[10px] rounded-md border transition-all cursor-pointer ${
                      currentWidth === pw.w
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pw.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onUpdateNode(id, { width: Math.min(800, currentWidth + 10) })}
                className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                title="Tambah Lebar (+10px)"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="range"
              min={40}
              max={400}
              step={5}
              value={currentWidth}
              onChange={(e) => onUpdateNode(id, { width: Number(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
            />
          </div>

          {/* Tinggi (Height) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-600">Tinggi (Height)</span>
              <span className="font-mono font-bold text-blue-700 px-1.5 py-0.2 rounded bg-blue-50 border border-blue-200">
                {currentHeight}px
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onUpdateNode(id, { height: Math.max(30, currentHeight - 10) })}
                className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                title="Kurangi Tinggi (-10px)"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <div className="flex-1 grid grid-cols-4 gap-1">
                {[
                  { h: 45, label: 'Kompak' },
                  { h: 70, label: 'Standar' },
                  { h: 100, label: 'Tinggi' },
                  { h: 140, label: 'Ekstra' },
                ].map((ph) => (
                  <button
                    key={ph.h}
                    type="button"
                    onClick={() => onUpdateNode(id, { height: ph.h })}
                    className={`py-1 text-[10px] rounded-md border transition-all cursor-pointer ${
                      currentHeight === ph.h
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {ph.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onUpdateNode(id, { height: Math.min(600, currentHeight + 10) })}
                className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                title="Tambah Tinggi (+10px)"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="range"
              min={30}
              max={300}
              step={5}
              value={currentHeight}
              onChange={(e) => onUpdateNode(id, { height: Number(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. FORMAT TIPOGRAFI & GAYA TEKS                           */}
        {/* ======================================================== */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-blue-600" />
              <span>Format Font & Teks</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-normal">{currentFontSize}px</span>
          </label>

          {/* Jenis Font (Font Family) */}
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'sans', label: 'Sans', fontClass: 'font-sans' },
              { id: 'serif', label: 'Serif', fontClass: 'font-serif' },
              { id: 'mono', label: 'Mono', fontClass: 'font-mono' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onUpdateNode(id, { fontFamily: f.id })}
                className={`py-1 px-2 rounded-md border text-xs transition-all cursor-pointer ${
                  currentFontFamily === f.id
                    ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                } ${f.fontClass}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Ukuran Font Stepper & Presets */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onUpdateNode(id, { fontSize: Math.max(9, currentFontSize - 2) })}
              className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
              title="Perkecil Font (-2px)"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            
            <div className="flex-1 grid grid-cols-5 gap-1">
              {[11, 13, 16, 20, 24].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onUpdateNode(id, { fontSize: s })}
                  className={`py-1 text-[11px] rounded-md border transition-all cursor-pointer ${
                    currentFontSize === s
                      ? 'bg-blue-600 border-blue-600 text-white font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onUpdateNode(id, { fontSize: Math.min(48, currentFontSize + 2) })}
              className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
              title="Perbesar Font (+2px)"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Gaya Format Teks: Bold, Italic, Underline, Strike */}
          <div className="grid grid-cols-4 gap-1">
            <button
              type="button"
              onClick={() => onUpdateNode(id, { bold: !isBold, fontWeight: !isBold ? 'bold' : 'normal' })}
              className={`h-7 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                isBold
                  ? 'bg-blue-600 border-blue-600 text-white font-black shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Tebal (Bold)"
            >
              <span className="font-extrabold text-xs">B</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateNode(id, { italic: !isItalic, fontStyle: !isItalic ? 'italic' : 'normal' })}
              className={`h-7 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                isItalic
                  ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Miring (Italic)"
            >
              <span className="italic font-serif font-bold text-xs">I</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateNode(id, { underline: !isUnderline })}
              className={`h-7 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                isUnderline
                  ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Garis Bawah (Underline)"
            >
              <span className="underline font-bold text-xs">U</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateNode(id, { strike: !isStrike })}
              className={`h-7 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                isStrike
                  ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Coret (Strikethrough)"
            >
              <span className="line-through font-bold text-xs">S</span>
            </button>
          </div>

          {/* Transformasi Huruf (Case) */}
          <div className="grid grid-cols-4 gap-1">
            {[
              { id: 'none', label: 'Normal', preview: 'Aa' },
              { id: 'uppercase', label: 'Kapital', preview: 'AA' },
              { id: 'lowercase', label: 'Kecil', preview: 'aa' },
              { id: 'capitalize', label: 'Awal', preview: 'Ab' },
            ].map((tt) => (
              <button
                key={tt.id}
                type="button"
                onClick={() => onUpdateNode(id, { textTransform: tt.id })}
                title={tt.label}
                className={`py-1 text-[11px] rounded-md border transition-all cursor-pointer font-bold ${
                  currentTextTransform === tt.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tt.preview}
              </button>
            ))}
          </div>

          {/* Perataan Teks (Alignment) */}
          <div className="grid grid-cols-4 gap-1">
            <button
              type="button"
              onClick={() => onUpdateNode(id, { textAlign: 'left' })}
              className={`h-7 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                currentTextAlign === 'left'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Rata Kiri"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onUpdateNode(id, { textAlign: 'center' })}
              className={`h-7 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                currentTextAlign === 'center'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Rata Tengah"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onUpdateNode(id, { textAlign: 'right' })}
              className={`h-7 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                currentTextAlign === 'right'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Rata Kanan"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onUpdateNode(id, { textAlign: 'justify' })}
              className={`h-7 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                currentTextAlign === 'justify'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Rata Sisi (Justify)"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Warna Teks */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <span className="font-semibold">Warna Teks:</span>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={currentText}
                onChange={(e) => onUpdateNode(id, { textColor: e.target.value })}
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={currentText}
                onChange={(e) => onUpdateNode(id, { textColor: e.target.value })}
                className="w-18 px-1.5 py-0.5 text-[11px] font-mono border border-slate-200 rounded text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. GARIS TEPI & SUDUT (BORDER & CORNER)                   */}
        {/* ======================================================== */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Batas & Garis Tepi</span>
            <span className="text-[10px] font-mono text-slate-400 font-normal">{currentBorderWidth}px</span>
          </label>

          {/* Ketebalan Garis Tepi */}
          <div className="grid grid-cols-5 gap-1">
            {[
              { w: 0, label: 'Tanpa' },
              { w: 1, label: '1px' },
              { w: 2, label: '2px' },
              { w: 3, label: '3px' },
              { w: 4, label: '4px' },
            ].map((bw) => (
              <button
                key={bw.w}
                type="button"
                onClick={() => onUpdateNode(id, { borderWidth: bw.w })}
                className={`py-1 text-[11px] rounded-md border transition-all cursor-pointer ${
                  currentBorderWidth === bw.w
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {bw.label}
              </button>
            ))}
          </div>

          {/* Pola Garis Tepi (Solid, Dashed, Dotted) */}
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'solid', label: 'Garis Utuh' },
              { id: 'dashed', label: 'Putus-Putus' },
              { id: 'dotted', label: 'Titik-Titik' },
            ].map((bs) => (
              <button
                key={bs.id}
                type="button"
                onClick={() => onUpdateNode(id, { borderStyle: bs.id })}
                className={`py-1 text-[10px] rounded-md border transition-all cursor-pointer ${
                  currentBorderStyle === bs.id
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {bs.label}
              </button>
            ))}
          </div>

          {/* Kelengkungan Sudut (Corner Radius) */}
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Sudut Bentuk</span>
            <div className="grid grid-cols-5 gap-1">
              {[
                { r: '0px', label: 'Persegi' },
                { r: '6px', label: 'Kecil' },
                { r: '12px', label: 'Halus' },
                { r: '20px', label: 'Bulat' },
                { r: '9999px', label: 'Kapsul' },
              ].map((rad) => (
                <button
                  key={rad.r}
                  type="button"
                  onClick={() => onUpdateNode(id, { borderRadius: rad.r })}
                  className={`py-1 text-[10px] rounded-md border transition-all cursor-pointer ${
                    currentBorderRadius === rad.r
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {rad.label}
                </button>
              ))}
            </div>
          </div>

          {/* Warna Garis Tepi */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <span className="font-semibold">Warna Garis:</span>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={currentBorder}
                onChange={(e) => onUpdateNode(id, { borderColor: e.target.value })}
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={currentBorder}
                onChange={(e) => onUpdateNode(id, { borderColor: e.target.value })}
                className="w-18 px-1.5 py-0.5 text-[11px] font-mono border border-slate-200 rounded text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5. TEMA WARNA, LATAR & EFEK VISUAL                       */}
        {/* ======================================================== */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-amber-600" />
            <span>Tema Warna Cepat</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() =>
                  onUpdateNode(id, {
                    color: preset.bg,
                    borderColor: preset.border,
                    textColor: preset.text,
                  })
                }
                title={preset.name}
                className="h-7 rounded-md border-2 shadow-2xs hover:scale-105 transition-transform cursor-pointer"
                style={{
                  backgroundColor: preset.bg,
                  borderColor: preset.border,
                }}
              />
            ))}
          </div>

          {/* Warna Latar */}
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold">Warna Latar:</span>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={currentColor}
                onChange={(e) => onUpdateNode(id, { color: e.target.value })}
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={currentColor}
                onChange={(e) => onUpdateNode(id, { color: e.target.value })}
                className="w-18 px-1.5 py-0.5 text-[11px] font-mono border border-slate-200 rounded text-slate-700"
              />
            </div>
          </div>

          {/* Efek Bayangan (Shadow) */}
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Efek Bayangan</span>
            <div className="grid grid-cols-4 gap-1">
              {[
                { id: 'none', label: 'Tanpa' },
                { id: 'sm', label: 'Halus' },
                { id: 'md', label: 'Sedang' },
                { id: 'lg', label: 'Kuat' },
              ].map((sh) => (
                <button
                  key={sh.id}
                  type="button"
                  onClick={() => onUpdateNode(id, { shadow: sh.id })}
                  className={`py-1 text-[10px] rounded-md border transition-all cursor-pointer ${
                    currentShadow === sh.id
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {sh.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transparansi / Opasitas (Opacity) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-600">Transparansi</span>
              <span className="font-mono font-bold text-slate-700">{currentOpacity}%</span>
            </div>
            <input
              type="range"
              min={15}
              max={100}
              step={5}
              value={currentOpacity}
              onChange={(e) => onUpdateNode(id, { opacity: Number(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
            />
          </div>

          {/* Rotasi Bentuk */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-600 flex items-center gap-1">
                <RotateCw className="w-3 h-3 text-slate-500" />
                <span>Rotasi Bentuk</span>
              </span>
              <span className="font-mono font-bold text-slate-700">{currentRotation}°</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[0, 90, 180, 270].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => onUpdateNode(id, { rotation: deg })}
                  className={`py-1 text-[10px] rounded-md border transition-all cursor-pointer ${
                    currentRotation === deg
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
            <input
              type="range"
              min={0}
              max={360}
              step={5}
              value={currentRotation}
              onChange={(e) => onUpdateNode(id, { rotation: Number(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none mt-1"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
