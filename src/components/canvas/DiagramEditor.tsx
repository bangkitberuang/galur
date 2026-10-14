'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import { 
  Save, 
  Download, 
  FilePlus,
  Trash2,
  Cloud, 
  HardDrive, 
  Check, 
  Sparkles,
  ChevronDown,
  RefreshCw,
  GitFork,
  Network
} from 'lucide-react';
import Link from 'next/link';

import { nodeTypes } from './nodes/CustomNodes';
import { edgeTypes } from './edges/RemovableEdge';
import Sidebar from './Sidebar';
import PropertyPanel from './PropertyPanel';
import ExportModal from './ExportModal';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Template Awal Bawaan Flowchart
const flowchartTemplate: { nodes: Node[]; edges: Edge[] } = {
  nodes: [
    {
      id: 'node-1',
      type: 'terminal',
      position: { x: 280, y: 80 },
      data: { label: 'Mulai Alur', color: '#ecfdf5', borderColor: '#10b981', textColor: '#065f46' },
    },
    {
      id: 'node-2',
      type: 'process',
      position: { x: 260, y: 190 },
      data: { label: 'Input Data & Ide', sublabel: 'GALUR Studio', color: '#ffffff', borderColor: '#3b82f6', textColor: '#0f172a' },
    },
    {
      id: 'node-3',
      type: 'decision',
      position: { x: 275, y: 310 },
      data: { label: 'Valid?', color: '#eff6ff', borderColor: '#2563eb', textColor: '#1e3a8a' },
    },
    {
      id: 'node-4',
      type: 'mindmap',
      position: { x: 520, y: 220 },
      data: { label: 'Topik Mind Map (Klik +)', isRoot: false, color: '#f0fdf4', borderColor: '#22c55e', textColor: '#14532d' },
    },
    {
      id: 'node-5',
      type: 'terminal',
      position: { x: 280, y: 480 },
      data: { label: 'Selesai & Ekspor', color: '#fef2f2', borderColor: '#ef4444', textColor: '#991b1b' },
    },
  ],
  edges: [
    {
      id: 'edge-1-2',
      source: 'node-1',
      target: 'node-2',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
      style: { stroke: '#3b82f6', strokeWidth: 2 },
    },
    {
      id: 'edge-2-3',
      source: 'node-2',
      target: 'node-3',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
      style: { stroke: '#3b82f6', strokeWidth: 2 },
    },
    {
      id: 'edge-2-4',
      source: 'node-2',
      target: 'node-4',
      type: 'default',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
      style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '4 4' },
      label: 'ide baru',
    },
    {
      id: 'edge-3-5',
      source: 'node-3',
      target: 'node-5',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
      style: { stroke: '#ef4444', strokeWidth: 2 },
      label: 'Ya',
    },
  ],
};

const mindmapTemplate: { nodes: Node[]; edges: Edge[] } = {
  nodes: [
    {
      id: 'root-mindmap',
      type: 'mindmap',
      position: { x: 350, y: 250 },
      data: { label: 'Gagasan Utama', isRoot: true, color: '#1e293b', borderColor: '#0f172a', textColor: '#ffffff' },
    },
    {
      id: 'child-1',
      type: 'mindmap',
      position: { x: 600, y: 160 },
      data: { label: 'Cabang Strategi', color: '#eff6ff', borderColor: '#3b82f6', textColor: '#1e3a8a' },
    },
    {
      id: 'child-2',
      type: 'mindmap',
      position: { x: 600, y: 320 },
      data: { label: 'Cabang Eksekusi', color: '#ecfdf5', borderColor: '#10b981', textColor: '#065f46' },
    },
  ],
  edges: [
    {
      id: 'edge-root-1',
      source: 'root-mindmap',
      target: 'child-1',
      type: 'default',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
      style: { stroke: '#3b82f6', strokeWidth: 2 },
    },
    {
      id: 'edge-root-2',
      source: 'root-mindmap',
      target: 'child-2',
      type: 'default',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
      style: { stroke: '#10b981', strokeWidth: 2 },
    },
  ],
};

interface DiagramEditorInnerProps {
  diagramId?: string;
  initialTitle?: string;
}

function DiagramEditorInner({ diagramId, initialTitle = 'Diagram Tanpa Judul' }: DiagramEditorInnerProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, fitView } = useReactFlow();

  const [title, setTitle] = useState(initialTitle);
  const [nodes, setNodes, onNodesChange] = useNodesState(flowchartTemplate.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowchartTemplate.edges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [edgeType, setEdgeType] = useState<string>('step'); // 'step' | 'default' | 'straight'
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved');
  const [storageType, setStorageType] = useState<'cloud' | 'local'>('local');

  // Muat data dari localStorage atau Supabase saat pertama kali dibuka
  useEffect(() => {
    const storageKey = `galur_diagram_${diagramId || 'default'}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.nodes && parsed.nodes.length > 0) setNodes(parsed.nodes);
        if (parsed.edges) setEdges(parsed.edges);
        if (parsed.title) setTitle(parsed.title);
      } catch (e) {
        console.error('Gagal membaca diagram dari cache lokal', e);
      }
    }
  }, [diagramId, setNodes, setEdges]);

  // Callback saat garis dihubungkan antar bentuk
  const onConnect = useCallback(
    (params: Connection) => {
      const edgeStyleType = edgeType === 'step' ? 'smoothstep' : edgeType;
      const newEdge: Edge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: edgeStyleType,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        style: { stroke: '#3b82f6', strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      setSaveStatus('idle');
    },
    [edgeType, setEdges]
  );

  // Tambah bentuk manual dari sidebar (klik)
  const handleAddNode = useCallback(
    (type: string, label: string) => {
      const id = `node-${Date.now()}`;
      const position = {
        x: 350 + (Math.random() * 60 - 30),
        y: 200 + (Math.random() * 60 - 30),
      };

      const newNode: Node = {
        id,
        type,
        position,
        data: {
          label,
          color: type === 'terminal' ? '#ecfdf5' : '#ffffff',
          borderColor: type === 'terminal' ? '#10b981' : '#3b82f6',
          textColor: '#0f172a',
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setSaveStatus('idle');
    },
    [setNodes]
  );

  // Drag over & Drop dari sidebar langsung ke koordinat kursor kanvas
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const rawData = event.dataTransfer.getData('application/reactflow');
      if (!rawData) return;

      const { type, label } = JSON.parse(rawData);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `node-${Date.now()}`,
        type,
        position,
        data: {
          label,
          color: type === 'terminal' ? '#ecfdf5' : '#ffffff',
          borderColor: type === 'terminal' ? '#10b981' : '#3b82f6',
          textColor: '#0f172a',
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setSaveStatus('idle');
    },
    [screenToFlowPosition, setNodes]
  );

  // Seleksi Node
  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  // Seleksi Edge / Garis
  const onEdgeClick = useCallback((_: any, edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
    setIsNewMenuOpen(false);
  }, []);

  // Update Data Node dari PropertyPanel
  const handleUpdateNode = useCallback(
    (nodeId: string, updatedData: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            const newN = {
              ...node,
              data: {
                ...node.data,
                ...updatedData,
              },
            };
            setSelectedNode(newN);
            return newN;
          }
          return node;
        })
      );
      setSaveStatus('idle');
    },
    [setNodes]
  );

  // Update Data Edge dari PropertyPanel
  const handleUpdateEdge = useCallback(
    (edgeId: string, updates: any) => {
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === edgeId) {
            const newE = {
              ...edge,
              ...updates,
              style: {
                ...edge.style,
                ...(updates.style || {}),
              },
            };
            setSelectedEdge(newE);
            return newE;
          }
          return edge;
        })
      );
      setSaveStatus('idle');
    },
    [setEdges]
  );

  // Hapus Node
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      setSelectedNode(null);
      setSaveStatus('idle');
    },
    [setNodes, setEdges]
  );

  // Hapus Edge
  const handleDeleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
      setSelectedEdge(null);
      setSaveStatus('idle');
    },
    [setEdges]
  );

  // Handler Hapus saat tombol Delete / Backspace ditekan
  const onNodesDelete = useCallback(() => {
    setSelectedNode(null);
    setSaveStatus('idle');
  }, []);

  const onEdgesDelete = useCallback(() => {
    setSaveStatus('idle');
  }, []);

  // Global Keyboard Delete Handler (Menjamin tombol Delete & Backspace selalu bekerja menghapus node atau edge yang terpilih)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const activeTag = (document.activeElement?.tagName || '').toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea') {
          return;
        }

        setNodes((nds) => nds.filter((node) => !node.selected));
        setEdges((eds) => eds.filter((edge) => !edge.selected));
        setSelectedNode(null);
        setSaveStatus('idle');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setNodes, setEdges]);

  // Handler Buat Diagram Baru
  const handleCreateNew = (type: 'blank' | 'flowchart' | 'mindmap') => {
    setIsNewMenuOpen(false);
    if (nodes.length > 0 && !confirm('Buat diagram baru? Seluruh perubahan saat ini akan digantikan.')) {
      return;
    }

    if (type === 'blank') {
      setNodes([]);
      setEdges([]);
      setTitle('Kanvas Kosong Baru');
    } else if (type === 'flowchart') {
      setNodes(flowchartTemplate.nodes);
      setEdges(flowchartTemplate.edges);
      setTitle('Diagram Alir Baru');
    } else if (type === 'mindmap') {
      setNodes(mindmapTemplate.nodes);
      setEdges(mindmapTemplate.edges);
      setTitle('Pohon Mind Map Baru');
    }

    setSelectedNode(null);
    setSaveStatus('idle');
    setTimeout(() => fitView({ padding: 0.2 }), 100);
  };

  // Bersihkan Kanvas Kosong
  const handleClearAll = () => {
    if (confirm('Bersihkan seluruh kanvas? Semua bentuk dan garis akan dihapus.')) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
      setSaveStatus('idle');
    }
  };

  // Simpan Diagram (Supabase & LocalStorage Fallback)
  const handleSave = async () => {
    setSaveStatus('saving');
    const storageKey = `galur_diagram_${diagramId || 'default'}`;
    const payload = {
      title,
      nodes,
      edges,
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(storageKey, JSON.stringify(payload));

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          await supabase.from('diagrams').upsert({
            id: diagramId || undefined,
            user_id: userData.user.id,
            title,
            data: { nodes, edges },
          });
          setStorageType('cloud');
        }
      } catch (err) {
        console.warn('Gagal menyimpan ke Supabase cloud, data tetap tersimpan di lokal browser:', err);
      }
    }

    setTimeout(() => {
      setSaveStatus('saved');
    }, 350);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30 no-print">
        {/* Left: Brand, Back, & Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
            title="Kembali ke Beranda GALUR"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
              G
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5 font-black text-sm tracking-tight text-slate-800">
                GALUR
                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-blue-50 text-blue-600 border border-blue-200">
                  Studio
                </span>
              </div>
            </div>
          </Link>

          <div className="h-5 w-[1px] bg-slate-200 mx-1" />

          {/* Menu Buat Diagram Baru */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              title="Buat Diagram Baru"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>Diagram Baru</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {/* Dropdown Menu Buat Baru */}
            {isNewMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1">
                  Pilihan Diagram Baru
                </div>

                <button
                  onClick={() => handleCreateNew('blank')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <FilePlus className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold">Kanvas Kosong</div>
                    <div className="text-[10px] text-slate-400">Mulai dari lembar putih bersih</div>
                  </div>
                </button>

                <button
                  onClick={() => handleCreateNew('flowchart')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-blue-50 text-xs font-medium text-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    <GitFork className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900">Template Flowchart</div>
                    <div className="text-[10px] text-slate-400">Alur keputusan standar Visio</div>
                  </div>
                </button>

                <button
                  onClick={() => handleCreateNew('mindmap')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-emerald-50 text-xs font-medium text-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Network className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-900">Template Mind Map</div>
                    <div className="text-[10px] text-slate-400">Pohon ide & brainstorming</div>
                  </div>
                </button>

                <div className="h-[1px] bg-slate-100 my-1.5" />

                <button
                  onClick={handleClearAll}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-red-50 text-xs font-medium text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Bersihkan Semua Objek</span>
                </button>
              </div>
            )}
          </div>

          <div className="h-5 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

          {/* Title Editor */}
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSaveStatus('idle');
            }}
            placeholder="Judul Diagram..."
            className="text-xs sm:text-sm font-semibold text-slate-700 px-2.5 py-1 rounded-lg hover:bg-slate-100 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 border border-transparent hover:border-slate-200 transition-all max-w-[180px] sm:max-w-[240px]"
          />
        </div>

        {/* Center: Save status & Quick Shortcut Info */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
          <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200">
            💡 Tips: Tekan <strong>Delete</strong> atau <strong>Backspace</strong> untuk menghapus objek
          </span>
          <span>•</span>
          {storageType === 'cloud' ? (
            <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
              <Cloud className="w-3.5 h-3.5" /> Cloud
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-500 text-xs">
              <HardDrive className="w-3.5 h-3.5" /> Lokal
            </span>
          )}
          <span>•</span>
          {saveStatus === 'saving' && <span className="text-amber-500 font-medium">Menyimpan...</span>}
          {saveStatus === 'saved' && (
            <span className="text-emerald-600 flex items-center gap-0.5 font-medium">
              <Check className="w-3.5 h-3.5" /> Tersimpan
            </span>
          )}
          {saveStatus === 'idle' && <span className="text-slate-400">Ada perubahan</span>}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Tombol Simpan */}
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
          >
            <Save className="w-3.5 h-3.5 text-blue-600" />
            <span>Simpan</span>
          </button>

          {/* Tombol Ekspor & Cetak */}
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor & Cetak</span>
          </button>
        </div>
      </header>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Stencil */}
        <Sidebar
          onAddNode={handleAddNode}
          edgeType={edgeType}
          setEdgeType={setEdgeType}
        />

        {/* Canvas Area */}
        <div
          ref={reactFlowWrapper}
          className="flex-1 h-full w-full relative print-area bg-slate-50"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            onNodesDelete={onNodesDelete}
            onEdgesDelete={onEdgesDelete}
            deleteKeyCode={['Backspace', 'Delete']}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            attributionPosition="bottom-right"
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#cbd5e1" />
            <Controls className="!bg-white !border-slate-200 !shadow-sm !rounded-xl overflow-hidden no-print" />
            <MiniMap
              className="!bg-white !border-slate-200 !shadow-md !rounded-xl overflow-hidden no-print"
              nodeStrokeColor="#3b82f6"
              nodeColor="#eff6ff"
              maskColor="rgba(240, 244, 248, 0.7)"
            />
          </ReactFlow>
        </div>

        {/* Property Inspector Panel (Bentuk & Garis) */}
        <PropertyPanel
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
          onUpdateEdge={handleUpdateEdge}
          onDeleteEdge={handleDeleteEdge}
        />
      </div>

      {/* Modal Ekspor & Cetak PDF / JPG */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        diagramTitle={title}
      />
    </div>
  );
}

export default function DiagramEditor(props: DiagramEditorInnerProps) {
  return (
    <ReactFlowProvider>
      <DiagramEditorInner {...props} />
    </ReactFlowProvider>
  );
}
