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
  RotateCcw, 
  Share2, 
  ArrowLeft, 
  Check, 
  Cloud, 
  HardDrive, 
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

import { nodeTypes } from './nodes/CustomNodes';
import Sidebar from './Sidebar';
import PropertyPanel from './PropertyPanel';
import ExportModal from './ExportModal';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Template Awal Bawaan GALUR
const initialNodes: Node[] = [
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
];

const initialEdges: Edge[] = [
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
];

interface DiagramEditorInnerProps {
  diagramId?: string;
  initialTitle?: string;
}

function DiagramEditorInner({ diagramId, initialTitle = 'Diagram Tanpa Judul' }: DiagramEditorInnerProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, fitView } = useReactFlow();

  const [title, setTitle] = useState(initialTitle);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [edgeType, setEdgeType] = useState<string>('step'); // 'step' | 'default' | 'straight'
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved');
  const [storageType, setStorageType] = useState<'cloud' | 'local'>('local');

  // Muat data dari localStorage atau Supabase saat dibuka
  useEffect(() => {
    const storageKey = `galur_diagram_${diagramId || 'default'}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.nodes) setNodes(parsed.nodes);
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

  // Menambah Cabang Ide Otomatis (Mind Map Function)
  const handleAddChildNode = useCallback(
    (parentId: string) => {
      const parent = nodes.find((n) => n.id === parentId);
      if (!parent) return;

      const newId = `mindmap-${Date.now()}`;
      const childCount = edges.filter((e) => e.source === parentId).length;
      const offsetX = 220;
      const offsetY = (childCount - 1) * 80;

      const newNode: Node = {
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
          onAddChild: handleAddChildNode,
        },
      };

      const newEdge: Edge = {
        id: `edge-${parentId}-${newId}`,
        source: parentId,
        target: newId,
        type: 'default',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        style: { stroke: '#3b82f6', strokeWidth: 2 },
      };

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
      setSaveStatus('idle');
    },
    [nodes, edges, setNodes, setEdges]
  );

  // Sematkan fungsi onAddChild ke setiap node mindmap
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'mindmap' && !node.data.onAddChild) {
          return {
            ...node,
            data: {
              ...node.data,
              onAddChild: handleAddChildNode,
            },
          };
        }
        return node;
      })
    );
  }, [handleAddChildNode, setNodes]);

  // Tambah bentuk manual dari sidebar (klik atau drag)
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
          onAddChild: type === 'mindmap' ? handleAddChildNode : undefined,
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setSaveStatus('idle');
    },
    [handleAddChildNode, setNodes]
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
          onAddChild: type === 'mindmap' ? handleAddChildNode : undefined,
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setSaveStatus('idle');
    },
    [screenToFlowPosition, handleAddChildNode, setNodes]
  );

  // Seleksi Node
  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
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

    // 1. Simpan selalu ke LocalStorage browser pengguna
    localStorage.setItem(storageKey, JSON.stringify(payload));

    // 2. Simpan ke Supabase jika terkonfigurasi
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
    }, 400);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-20 no-print">
        {/* Left: Brand & Back */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
            title="Kembali ke Beranda"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
              G
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-base tracking-tight text-slate-800">
                GALUR
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                  Builder
                </span>
              </div>
            </div>
          </Link>

          <div className="h-5 w-[1px] bg-slate-200 mx-1" />

          {/* Title Editor */}
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSaveStatus('idle');
            }}
            placeholder="Judul Diagram..."
            className="text-sm font-semibold text-slate-700 px-2 py-1 rounded-md hover:bg-slate-100 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 border border-transparent hover:border-slate-200 transition-all max-w-[240px]"
          />
        </div>

        {/* Center: Save status */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
          {storageType === 'cloud' ? (
            <span className="flex items-center gap-1 text-emerald-600">
              <Cloud className="w-3.5 h-3.5" />
              <span>Cloud Supabase</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-500">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Lokal Browser</span>
            </span>
          )}
          <span>•</span>
          {saveStatus === 'saving' && <span className="text-amber-500">Menyimpan...</span>}
          {saveStatus === 'saved' && (
            <span className="text-emerald-600 flex items-center gap-0.5">
              <Check className="w-3.5 h-3.5" /> Tersimpan
            </span>
          )}
          {saveStatus === 'idle' && <span className="text-slate-400">Ada perubahan belum disimpan</span>}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Tombol Simpan */}
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
          >
            <Save className="w-3.5 h-3.5 text-blue-600" />
            <span>Simpan</span>
          </button>

          {/* Tombol Ekspor & Cetak */}
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-500/20 transition-all cursor-pointer"
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
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
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

        {/* Property Inspector Panel */}
        <PropertyPanel
          selectedNode={selectedNode}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
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
