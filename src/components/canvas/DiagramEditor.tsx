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
  ConnectionMode,
  reconnectEdge,
} from '@xyflow/react';
import { 
  Save, 
  Download, 
  FilePlus, 
  Trash2, 
  Cloud, 
  HardDrive, 
  Check, 
  ChevronDown, 
  GitFork, 
  Network, 
  History, 
  Undo2, 
  Redo2, 
  FolderOpen,
  LayoutTemplate,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { nodeTypes } from './nodes/CustomNodes';
import { edgeTypes } from './edges/RemovableEdge';
import Sidebar from './Sidebar';
import PropertyPanel from './PropertyPanel';
import ExportModal from './ExportModal';
import HistoryModal from './HistoryModal';
import TemplateModal from './TemplateModal';
import CanvasToolbar from './CanvasToolbar';
import { 
  saveDiagramToStorage, 
  getDiagramById, 
  getAllDiagramsMeta, 
  initDefaultDiagramsIfEmpty 
} from '@/lib/diagramStorage';
import { getTemplateByCategory, CategoryTemplate } from '@/lib/specialistTemplates';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface DiagramEditorInnerProps {
  diagramId?: string;
  initialTitle?: string;
}

function DiagramEditorInner({ diagramId, initialTitle = 'Diagram Tanpa Judul' }: DiagramEditorInnerProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, fitView } = useReactFlow();

  const [currentId, setCurrentId] = useState<string>('flowchart-demo-1');
  const [title, setTitle] = useState(initialTitle);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [edgeType, setEdgeType] = useState<string>('step'); // 'step' | 'default' | 'straight'
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved');
  const [storageType, setStorageType] = useState<'cloud' | 'local'>('local');
  const [historyCount, setHistoryCount] = useState<number>(0);

  // Undo & Redo History Stack
  const [past, setPast] = useState<Array<{ nodes: Node[]; edges: Edge[] }>>([]);
  const [future, setFuture] = useState<Array<{ nodes: Node[]; edges: Edge[] }>>([]);

  const takeSnapshot = useCallback(() => {
    setPast((prev) => [...prev.slice(-25), { nodes, edges }]);
    setFuture([]);
  }, [nodes, edges]);

  const handleUndo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setFuture((prev) => [{ nodes, edges }, ...prev]);
    setPast(newPast);
    setNodes(previous.nodes);
    setEdges(previous.edges);
    setSelectedNode(null);
    setSelectedEdge(null);
    setSaveStatus('idle');
  }, [past, nodes, edges, setNodes, setEdges]);

  const handleRedo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);

    setPast((prev) => [...prev, { nodes, edges }]);
    setFuture(newFuture);
    setNodes(next.nodes);
    setEdges(next.edges);
    setSelectedNode(null);
    setSelectedEdge(null);
    setSaveStatus('idle');
  }, [future, nodes, edges, setNodes, setEdges]);

  // Inisialisasi awal: Muat diagram dari riwayat atau parameter template
  useEffect(() => {
    initDefaultDiagramsIfEmpty();
    const metaList = getAllDiagramsMeta();
    setHistoryCount(metaList.length);

    let targetId = 'flowchart-demo-1';
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTemplate = urlParams.get('template');
      if (urlTemplate) {
        const found = getTemplateByCategory(urlTemplate);
        if (found) {
          const newId = `diag_${found.id}_${Date.now()}`;
          setCurrentId(newId);
          setTitle(`Template ${found.name}`);
          setNodes(found.nodes || []);
          setEdges(found.edges || []);
          window.history.replaceState(null, '', `/editor?id=${newId}`);
          return;
        }
      }

      const urlId = urlParams.get('id') || diagramId;
      if (urlId) {
        targetId = urlId;
      } else if (metaList.length > 0) {
        targetId = metaList[0].id;
      }
    }

    const loaded = getDiagramById(targetId);
    if (loaded) {
      setCurrentId(loaded.id);
      setTitle(loaded.title);
      setNodes(loaded.nodes || []);
      setEdges(loaded.edges || []);
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `/editor?id=${loaded.id}`);
      }
    }
  }, [diagramId, setNodes, setEdges]);

  // AUTO-SAVE: Otomatis menyimpan setiap kali ada perubahan
  useEffect(() => {
    if (!currentId || nodes.length === 0) return;

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      saveDiagramToStorage({
        id: currentId,
        title,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        type: 'custom',
        nodes,
        edges,
      });

      const updatedMeta = getAllDiagramsMeta();
      setHistoryCount(updatedMeta.length);
      setSaveStatus('saved');
    }, 600);

    return () => clearTimeout(timer);
  }, [nodes, edges, title, currentId]);

  // Callback saat garis dihubungkan antar bentuk
  const onConnect = useCallback(
    (params: Connection) => {
      takeSnapshot();
      const edgeStyleType = edgeType === 'step' ? 'smoothstep' : edgeType;
      const newEdge: Edge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: edgeStyleType,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        reconnectable: true,
      };
      setEdges((eds) => addEdge(newEdge, eds));
      setSaveStatus('idle');
    },
    [edgeType, setEdges, takeSnapshot]
  );

  // Callback memindahkan titik tuju atau titik asal garis (Edge Reconnection)
  const edgeReconnectSuccessful = useRef(true);

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      edgeReconnectSuccessful.current = true;
      takeSnapshot();
      setEdges((els) => {
        const reconnected = reconnectEdge(oldEdge, newConnection, els);
        return reconnected.map((e) => (e.id === oldEdge.id ? { ...e, reconnectable: true } : e));
      });
      setSaveStatus('idle');
    },
    [setEdges, takeSnapshot]
  );

  const onReconnectEnd = useCallback((_: MouseEvent | TouchEvent, edge: Edge) => {
    if (!edgeReconnectSuccessful.current) {
      // Pertahankan garis jika tidak sengaja lepas di kanvas kosong
    }
    edgeReconnectSuccessful.current = true;
  }, []);

  // Tambah bentuk manual dari sidebar (klik)
  const handleAddNode = useCallback(
    (type: string, label: string) => {
      takeSnapshot();
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
    [setNodes, takeSnapshot]
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

      takeSnapshot();
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
    [screenToFlowPosition, setNodes, takeSnapshot]
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
      takeSnapshot();
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      setSelectedNode(null);
      setSaveStatus('idle');
    },
    [setNodes, setEdges, takeSnapshot]
  );

  // Hapus Edge
  const handleDeleteEdge = useCallback(
    (edgeId: string) => {
      takeSnapshot();
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
      setSelectedEdge(null);
      setSaveStatus('idle');
    },
    [setEdges, takeSnapshot]
  );

  const onNodesDelete = useCallback(() => {
    takeSnapshot();
    setSelectedNode(null);
    setSaveStatus('idle');
  }, [takeSnapshot]);

  const onEdgesDelete = useCallback(() => {
    takeSnapshot();
    setSelectedEdge(null);
    setSaveStatus('idle');
  }, [takeSnapshot]);

  // Global Keyboard Shortcuts (Delete, Backspace, Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') {
        return;
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        takeSnapshot();
        setNodes((nds) => nds.filter((node) => !node.selected));
        setEdges((eds) => eds.filter((edge) => !edge.selected));
        setSelectedNode(null);
        setSelectedEdge(null);
        setSaveStatus('idle');
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setNodes, setEdges, handleUndo, handleRedo, takeSnapshot]);

  // Buka Diagram dari Riwayat
  const handleLoadFromHistory = (id: string) => {
    const loaded = getDiagramById(id);
    if (loaded) {
      takeSnapshot();
      setCurrentId(loaded.id);
      setTitle(loaded.title);
      setNodes(loaded.nodes || []);
      setEdges(loaded.edges || []);
      setSelectedNode(null);
      setSelectedEdge(null);
      setSaveStatus('saved');

      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `/editor?id=${loaded.id}`);
      }
      setTimeout(() => fitView({ padding: 0.2 }), 100);
    }
  };

  // Buat Diagram Baru
  const handleCreateNew = (type: 'blank' | 'flowchart' | 'mindmap') => {
    setIsNewMenuOpen(false);
    takeSnapshot();
    const newId = `diag_${Date.now()}`;
    setCurrentId(newId);

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `/editor?id=${newId}`);
    }

    if (type === 'blank') {
      setNodes([]);
      setEdges([]);
      setTitle('Kanvas Kosong Baru');
    } else if (type === 'flowchart') {
      const demo = getDiagramById('flowchart-demo-1');
      setNodes(demo?.nodes || []);
      setEdges(demo?.edges || []);
      setTitle('Diagram Alir Baru');
    } else if (type === 'mindmap') {
      const demo = getDiagramById('mindmap-demo-2');
      setNodes(demo?.nodes || []);
      setEdges(demo?.edges || []);
      setTitle('Pohon Mind Map Baru');
    }

    setSelectedNode(null);
    setSelectedEdge(null);
    setSaveStatus('idle');
    setTimeout(() => fitView({ padding: 0.2 }), 100);
  };

  // Muat Template Spesialis dari Modal Pustaka
  const handleSelectSpecialistTemplate = (template: CategoryTemplate) => {
    takeSnapshot();
    const newId = `diag_${template.id}_${Date.now()}`;
    setCurrentId(newId);
    setTitle(`Template ${template.name}`);
    setNodes(template.nodes || []);
    setEdges(template.edges || []);
    setSelectedNode(null);
    setSelectedEdge(null);
    setSaveStatus('idle');

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `/editor?id=${newId}`);
    }

    setTimeout(() => fitView({ padding: 0.2 }), 100);
  };

  // Simpan Manual
  const handleManualSave = async () => {
    setSaveStatus('saving');
    saveDiagramToStorage({
      id: currentId,
      title,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      nodeCount: nodes.length,
      edgeCount: edges.length,
      type: 'custom',
      nodes,
      edges,
    });

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          await supabase.from('diagrams').upsert({
            id: currentId.startsWith('diag_') ? undefined : currentId,
            user_id: userData.user.id,
            title,
            data: { nodes, edges },
          });
          setStorageType('cloud');
        }
      } catch (err) {
        console.warn('Gagal menyimpan ke Supabase cloud:', err);
      }
    }

    const updatedMeta = getAllDiagramsMeta();
    setHistoryCount(updatedMeta.length);
    setTimeout(() => setSaveStatus('saved'), 300);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30 no-print shadow-2xs">
        {/* Left: Brand, Back, & Title */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-slate-800 hover:text-emerald-800 transition-colors group"
            title="Kembali ke Beranda GALUR"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
              <Image
                src="/logo.png"
                alt="GALUR Logo"
                width={56}
                height={56}
                className="w-full h-full object-contain filter drop-shadow-sm"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5 font-black text-base tracking-tight text-[#0b4632]">
                GALUR
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Studio
                </span>
              </div>
              <div className="text-[9px] text-slate-400 font-medium tracking-tight -mt-0.5 hidden lg:block">
                Garis Alur, Ngajentrekeun Struktur
              </div>
            </div>
          </Link>

          <div className="h-5 w-[1px] bg-slate-200 mx-0.5" />

          {/* Menu Buat Diagram Baru */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b4632] hover:bg-[#073022] text-amber-300 text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="Buat Diagram Baru"
            >
              <FilePlus className="w-3.5 h-3.5 text-amber-300" />
              <span>Diagram Baru</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

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
                    <div className="text-[10px] text-slate-400">Lembar putih bersih</div>
                  </div>
                </button>

                <button
                  onClick={() => handleCreateNew('flowchart')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-emerald-50 text-xs font-medium text-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <GitFork className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-900">Template Flowchart</div>
                    <div className="text-[10px] text-slate-400">Alur keputusan Visio</div>
                  </div>
                </button>

                <button
                  onClick={() => handleCreateNew('mindmap')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-amber-50 text-xs font-medium text-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                    <Network className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-amber-900">Template Mind Map</div>
                    <div className="text-[10px] text-slate-400">Pohon ide brainstorming</div>
                  </div>
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  onClick={() => {
                    setIsNewMenuOpen(false);
                    setIsTemplateModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-amber-50/80 text-xs font-medium text-slate-800 transition-colors bg-amber-50/40 border border-amber-200/50"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#ea9932] text-white flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-amber-100 fill-amber-100" />
                  </div>
                  <div>
                    <div className="font-bold text-amber-950">Template Spesialis (11)</div>
                    <div className="text-[10px] text-amber-700">UML, ERD, SWOT, Org, dll.</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Tombol Pustaka Template Spesialis */}
          <button
            type="button"
            onClick={() => setIsTemplateModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-amber-500 hover:bg-amber-50/60 text-slate-700 hover:text-amber-800 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
            title="Pustaka Template Spesialis (UML, ERD, SWOT, dll. dari Gambar 3)"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-amber-600" />
            <span>Template Spesialis</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              11
            </span>
          </button>

          {/* Tombol Riwayat Diagram dengan Jumlah Berkas */}
          <button
            type="button"
            onClick={() => setIsHistoryModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-800 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
            title="Buka Riwayat Diagram yang Pernah Dibuat"
          >
            <FolderOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>Riwayat Diagram</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {historyCount}
            </span>
          </button>

          <div className="h-5 w-[1px] bg-slate-200 mx-0.5 hidden sm:block" />

          {/* Tombol Undo & Redo */}
          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={handleUndo}
              disabled={past.length === 0}
              title="Urungkan Perubahan (Ctrl+Z)"
              className="p-1 rounded-md text-slate-600 hover:text-emerald-700 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={future.length === 0}
              title="Ulangi Perubahan (Ctrl+Y)"
              className="p-1 rounded-md text-slate-600 hover:text-emerald-700 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-5 w-[1px] bg-slate-200 mx-0.5 hidden sm:block" />

          {/* Title Editor */}
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSaveStatus('idle');
            }}
            placeholder="Judul Diagram..."
            className="text-xs sm:text-sm font-semibold text-slate-700 px-2 py-1 rounded-lg hover:bg-slate-100 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-600 border border-transparent hover:border-slate-200 transition-all max-w-[140px] sm:max-w-[190px]"
          />
        </div>

        {/* Center: Save status */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1 text-slate-600 text-xs">
            <HardDrive className="w-3.5 h-3.5 text-emerald-600" /> Auto-Save Aktif
          </span>
          <span>•</span>
          {saveStatus === 'saving' && <span className="text-amber-600 font-medium">Menyimpan...</span>}
          {saveStatus === 'saved' && (
            <span className="text-emerald-700 flex items-center gap-0.5 font-medium">
              <Check className="w-3.5 h-3.5" /> Tersimpan ke Riwayat
            </span>
          )}
          {saveStatus === 'idle' && <span className="text-slate-400">Ada perubahan</span>}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleManualSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-emerald-700" />
            <span>Simpan</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs shadow-emerald-700/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor & Cetak</span>
          </button>
        </div>
      </header>

      {/* Secondary Canvas Toolbar (Operasi Objek dari Gambar 2: Panah, Align, Z-Index) */}
      <CanvasToolbar
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
        selectedNode={selectedNode}
        selectedEdge={selectedEdge}
        edgeType={edgeType}
        setEdgeType={setEdgeType}
        takeSnapshot={takeSnapshot}
        onAddNode={handleAddNode}
      />

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          onAddNode={handleAddNode}
          edgeType={edgeType}
          setEdgeType={setEdgeType}
        />

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
            onReconnect={onReconnect}
            onReconnectStart={onReconnectStart}
            onReconnectEnd={onReconnectEnd}
            edgesReconnectable={true}
            reconnectRadius={25}
            connectionMode={ConnectionMode.Loose}
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

        <PropertyPanel
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
          onUpdateEdge={handleUpdateEdge}
          onDeleteEdge={handleDeleteEdge}
        />
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        diagramTitle={title}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        currentDiagramId={currentId}
        onLoadDiagram={handleLoadFromHistory}
        onNewDiagram={() => handleCreateNew('blank')}
      />

      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectSpecialistTemplate}
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
