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
  SelectionMode,
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
  Sparkles,
  Settings,
  Fish,
  Target,
  HelpCircle,
  Layers,
  Workflow,
  LayoutGrid,
  Globe,
  Sliders,
  Share2,
  Users
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
import ShareModal from './ShareModal';
import CollabCursorsOverlay from './CollabCursorsOverlay';
import CanvasToolbar from './CanvasToolbar';
import CanvasBottomBar from './CanvasBottomBar';
import { CanvasPageFrame, CanvasPageConfig, DEFAULT_PAGE_CONFIG } from './CanvasPageFrame';
import CanvasSettingsModal from './CanvasSettingsModal';
import { collabManager, CollabUser, getLocalCollabUser } from '@/lib/collaboration';
import { 
  saveDiagramToStorage, 
  getDiagramById, 
  getAllDiagramsMeta, 
  initDefaultDiagramsIfEmpty,
  DiagramPage
} from '@/lib/diagramStorage';
import { getTemplateByCategory, CategoryTemplate, SPECIALIST_CATEGORIES } from '@/lib/specialistTemplates';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { APP_VERSION, APP_LOGO_URL } from '@/lib/version';

const INITIAL_COLLAB_USER: CollabUser = {
  id: 'usr_init',
  name: 'Kolaborator',
  color: '#0284c7',
  lastSeen: 0,
};

interface DiagramEditorInnerProps {
  diagramId?: string;
  initialTitle?: string;
}

function DiagramEditorInner({ diagramId, initialTitle = 'Diagram Tanpa Judul' }: DiagramEditorInnerProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, fitView, getNode } = useReactFlow();

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
  const [pageConfig, setPageConfig] = useState<CanvasPageConfig>(DEFAULT_PAGE_CONFIG);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDiagramSettingsOpen, setIsDiagramSettingsOpen] = useState(false);
  const [interactionMode, setInteractionMode] = useState<'select' | 'pan'>('select');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState<string>('galur-main-room');
  const [collabUsers, setCollabUsers] = useState<CollabUser[]>([]);
  const [currentUser, setCurrentUser] = useState<CollabUser>(INITIAL_COLLAB_USER);
  const [isMounted, setIsMounted] = useState(false);
  const isRemoteUpdating = useRef(false);

  useEffect(() => {
    setIsMounted(true);
    setCurrentUser(getLocalCollabUser());
  }, []);

  // Multi-Page Diagram State (Halaman 1, 2, 3...)
  const [pages, setPages] = useState<DiagramPage[]>([
    { id: 'page-1', name: 'Page 1', nodes: [], edges: [] },
  ]);
  const [activePageId, setActivePageId] = useState<string>('page-1');

  // Undo & Redo History Stack
  const [past, setPast] = useState<Array<{ nodes: Node[]; edges: Edge[] }>>([]);
  const [future, setFuture] = useState<Array<{ nodes: Node[]; edges: Edge[] }>>([]);

  const takeSnapshot = useCallback(() => {
    try {
      const clonedNodes = JSON.parse(JSON.stringify(nodes));
      const clonedEdges = JSON.parse(JSON.stringify(edges));
      setPast((prev) => [...prev.slice(-30), { nodes: clonedNodes, edges: clonedEdges }]);
      setFuture([]);
    } catch {
      setPast((prev) => [...prev.slice(-30), { nodes: [...nodes], edges: [...edges] }]);
      setFuture([]);
    }
  }, [nodes, edges]);

  const handleUndo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    try {
      const currentNodes = JSON.parse(JSON.stringify(nodes));
      const currentEdges = JSON.parse(JSON.stringify(edges));
      setFuture((prev) => [{ nodes: currentNodes, edges: currentEdges }, ...prev]);
    } catch {
      setFuture((prev) => [{ nodes: [...nodes], edges: [...edges] }, ...prev]);
    }

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

    try {
      const currentNodes = JSON.parse(JSON.stringify(nodes));
      const currentEdges = JSON.parse(JSON.stringify(edges));
      setPast((prev) => [...prev, { nodes: currentNodes, edges: currentEdges }]);
    } catch {
      setPast((prev) => [...prev, { nodes: [...nodes], edges: [...edges] }]);
    }

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
      const urlRoom = urlParams.get('room');
      if (urlRoom) {
        setActiveRoomId(urlRoom);
      }

      const urlShare = urlParams.get('share');
      if (urlShare) {
        try {
          const decoded = decodeURIComponent(escape(atob(urlShare)));
          const parsed = JSON.parse(decoded);
          if (parsed.nodes && Array.isArray(parsed.nodes)) {
            const newId = `shared_${Date.now()}`;
            setCurrentId(newId);
            setTitle(parsed.title || 'Diagram Dibagikan');
            setNodes(parsed.nodes || []);
            setEdges(parsed.edges || []);
            if (parsed.pageConfig) setPageConfig(parsed.pageConfig);
            setPages([{ id: 'page-1', name: 'Page 1', nodes: parsed.nodes || [], edges: parsed.edges || [] }]);
            setActivePageId('page-1');
            return;
          }
        } catch (err) {
          console.error('Gagal membaca parameter share link:', err);
        }
      }

      const urlTemplate = urlParams.get('template');
      if (urlTemplate) {
        const found = getTemplateByCategory(urlTemplate);
        if (found) {
          const newId = `diag_${found.id}_${Date.now()}`;
          setCurrentId(newId);
          setTitle(`Template ${found.name}`);
          setNodes(found.nodes || []);
          setEdges(found.edges || []);
          setPages([{ id: 'page-1', name: 'Page 1', nodes: found.nodes || [], edges: found.edges || [] }]);
          setActivePageId('page-1');
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
      if (loaded.pages && loaded.pages.length > 0) {
        setPages(loaded.pages);
        const activeP = loaded.pages.find((p) => p.id === loaded.activePageId) || loaded.pages[0];
        setActivePageId(activeP.id);
        setNodes(activeP.nodes || []);
        setEdges(activeP.edges || []);
      } else {
        const p: DiagramPage = {
          id: 'page-1',
          name: 'Page 1',
          nodes: loaded.nodes || [],
          edges: loaded.edges || [],
        };
        setPages([p]);
        setActivePageId('page-1');
        setNodes(loaded.nodes || []);
        setEdges(loaded.edges || []);
      }
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `/editor?id=${loaded.id}`);
      }
    }
  }, [diagramId, setNodes, setEdges]);

  // Real-Time Collaboration: Hubungkan ke room aktif (Multiplayer Live Sync)
  useEffect(() => {
    if (!activeRoomId) return;

    collabManager.joinRoom(activeRoomId, {
      onUsersChange: (users) => {
        setCollabUsers(users);
      },
      onRemoteCursor: (userId, cursor) => {
        setCollabUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, cursor, lastSeen: Date.now() } : u))
        );
      },
      onRemoteDiagramSync: (data) => {
        isRemoteUpdating.current = true;
        if (data.title) setTitle(data.title);
        if (data.nodes) setNodes(data.nodes);
        if (data.edges) setEdges(data.edges);
        if (data.pageConfig) setPageConfig(data.pageConfig);
        setTimeout(() => {
          isRemoteUpdating.current = false;
        }, 150);
      },
      onRemoteNodesChange: (remoteNodes) => {
        isRemoteUpdating.current = true;
        setNodes(remoteNodes);
        setTimeout(() => {
          isRemoteUpdating.current = false;
        }, 150);
      },
      onRemoteEdgesChange: (remoteEdges) => {
        isRemoteUpdating.current = true;
        setEdges(remoteEdges);
        setTimeout(() => {
          isRemoteUpdating.current = false;
        }, 150);
      },
    });

    return () => {
      collabManager.leaveRoom();
    };
  }, [activeRoomId, setNodes, setEdges]);

  // Pelacak pergerakan pointer mouse untuk kolaborasi real-time
  const handleCanvasPointerMove = useCallback((e: React.PointerEvent) => {
    if (!reactFlowWrapper.current) return;
    const rect = reactFlowWrapper.current.getBoundingClientRect();
    const relX = Math.round(e.clientX - rect.left);
    const relY = Math.round(e.clientY - rect.top);
    collabManager.sendCursor(relX, relY);
  }, []);

  // Handler impor file proyek (.galur / .json)
  const handleImportDiagram = useCallback(
    (imported: {
      title: string;
      nodes: Node[];
      edges: Edge[];
      pageConfig?: CanvasPageConfig;
    }) => {
      takeSnapshot();
      setTitle(imported.title);
      setNodes(imported.nodes);
      setEdges(imported.edges);
      if (imported.pageConfig) setPageConfig(imported.pageConfig);
      setPages([
        { id: 'page-1', name: 'Page 1', nodes: imported.nodes, edges: imported.edges },
      ]);
      setActivePageId('page-1');
      setSaveStatus('idle');
      collabManager.broadcastDiagramSync(imported.nodes, imported.edges, imported.title, imported.pageConfig);
    },
    [takeSnapshot, setNodes, setEdges]
  );

  // AUTO-SAVE: Otomatis menyimpan setiap kali ada perubahan
  useEffect(() => {
    if (!currentId || nodes.length === 0) return;

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      const currentPages = pages.map((p) =>
        p.id === activePageId ? { ...p, nodes, edges } : p
      );

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
        pages: currentPages,
        activePageId,
      });

      const updatedMeta = getAllDiagramsMeta();
      setHistoryCount(updatedMeta.length);
      setSaveStatus('saved');

      // Sebarkan sinkronisasi diagram ke rekan kolaborator di room
      if (!isRemoteUpdating.current) {
        collabManager.broadcastDiagramSync(nodes, edges, title, pageConfig);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [nodes, edges, title, currentId, pages, activePageId, pageConfig]);

  // Melacak node asal saat koneksi mulai ditarik pengguna
  const connectStartRef = useRef<{ nodeId: string | null; handleId: string | null; handleType: string | null } | null>(null);

  const onConnectStart = useCallback((_: MouseEvent | TouchEvent, params: { nodeId: string | null; handleId: string | null; handleType: any }) => {
    connectStartRef.current = params;
  }, []);

  const onConnectEnd = useCallback(() => {
    setTimeout(() => {
      connectStartRef.current = null;
    }, 150);
  }, []);

  // Callback saat garis dihubungkan antar bentuk
  const onConnect = useCallback(
    (params: Connection) => {
      takeSnapshot();

      let source = params.source;
      let target = params.target;
      let sHandle = params.sourceHandle;
      let tHandle = params.targetHandle;

      // KOREKSI ARAH PANAH (Arrow Inversion Prevention):
      // Jika user mulai menarik garis dari node asal (A), namun React Flow menetapkan params.target = A
      // (terjadi bila handle yang diklik bertipe 'target'), maka balikkan source dan target.
      // Hal ini menjamin titik asal selalu menjadi SOURCE dan titik tujuan selalu TARGET dengan markerEnd mengarah ke sana!
      if (
        connectStartRef.current?.nodeId &&
        params.target === connectStartRef.current.nodeId &&
        params.source !== connectStartRef.current.nodeId
      ) {
        source = params.target;
        target = params.source;
        sHandle = params.targetHandle;
        tHandle = params.sourceHandle;
      }

      // Normalisasi nama handle jika tertukar
      if (sHandle && sHandle.endsWith('-in')) {
        sHandle = sHandle.replace('-in', '-out');
      }
      if (tHandle && tHandle.endsWith('-out')) {
        tHandle = tHandle.replace('-out', '-in');
      }

      // Jika belum ada titik spesifik, otomatis sesuaikan ke sisi yang saling berhadapan
      if (!sHandle || !tHandle) {
        const srcNode = getNode(source);
        const tgtNode = getNode(target);
        if (srcNode && tgtNode) {
          const dx = tgtNode.position.x - srcNode.position.x;
          const dy = tgtNode.position.y - srcNode.position.y;
          if (Math.abs(dx) >= Math.abs(dy)) {
            if (!sHandle) sHandle = dx >= 0 ? 'r-out' : 'l-out';
            if (!tHandle) tHandle = dx >= 0 ? 'l-in' : 'r-in';
          } else {
            if (!sHandle) sHandle = dy >= 0 ? 'b-out' : 't-out';
            if (!tHandle) tHandle = dy >= 0 ? 't-in' : 'b-in';
          }
        }
      }

      const edgeStyleType = edgeType === 'step' ? 'smoothstep' : edgeType;
      const newEdge: Edge = {
        ...params,
        source,
        target,
        sourceHandle: sHandle || 'r-out',
        targetHandle: tHandle || 'l-in',
        id: `edge-${Date.now()}`,
        type: edgeStyleType,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        reconnectable: true,
      };
      setEdges((eds) => addEdge(newEdge, eds));
      setSaveStatus('idle');
    },
    [edgeType, setEdges, takeSnapshot, getNode]
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
    (type: string, label: string, customData?: Record<string, any>) => {
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
          ...(customData || {}),
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
      const parsed = JSON.parse(rawData);
      const { type, label, customData } = parsed;
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
          ...(customData || {}),
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setSaveStatus('idle');
    },
    [screenToFlowPosition, setNodes, takeSnapshot]
  );

  // MAGNETIZE: Memindahkan seluruh elemen di dalam kontainer saat kontainer digeser
  const dragContainerRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    children: { id: string; startX: number; startY: number }[];
  } | null>(null);

  const handleNodeDragStart = useCallback((_: any, node: Node) => {
    takeSnapshot();
    if (node.type === 'swimlane_group' && node.data?.magnetize !== false) {
      const containerX = node.position.x;
      const containerY = node.position.y;
      const containerW = Number(node.data?.width) || 1160;
      const lanes = (node.data?.lanes as any[]) || [];
      const titleHeight = node.data?.showTitle !== false ? 32 : 0;
      const containerH = titleHeight + lanes.reduce((acc: number, l: any) => acc + (l.height || 160), 0);

      const insideNodes = nodes.filter((n) => {
        if (n.id === node.id) return false;
        const nw = Number(n.data?.width) || n.measured?.width || 120;
        const nh = Number(n.data?.height) || n.measured?.height || 50;
        return (
          n.position.x >= containerX - 30 &&
          n.position.x + nw <= containerX + containerW + 50 &&
          n.position.y >= containerY - 30 &&
          n.position.y + nh <= containerY + containerH + 50
        );
      });

      dragContainerRef.current = {
        id: node.id,
        startX: node.position.x,
        startY: node.position.y,
        children: insideNodes.map((n) => ({
          id: n.id,
          startX: n.position.x,
          startY: n.position.y,
        })),
      };
    } else {
      dragContainerRef.current = null;
    }
  }, [nodes, takeSnapshot]);

  const handleNodeDrag = useCallback((_: any, node: Node) => {
    if (dragContainerRef.current && dragContainerRef.current.id === node.id) {
      const dx = node.position.x - dragContainerRef.current.startX;
      const dy = node.position.y - dragContainerRef.current.startY;
      const childMap = new Map(dragContainerRef.current.children.map((c) => [c.id, { x: c.startX + dx, y: c.startY + dy }]));

      setNodes((nds) =>
        nds.map((n) => {
          const targetPos = childMap.get(n.id);
          if (targetPos) {
            return {
              ...n,
              position: { x: targetPos.x, y: targetPos.y },
            };
          }
          return n;
        })
      );
    }
  }, [setNodes]);

  const handleNodeDragStop = useCallback(() => {
    dragContainerRef.current = null;
    setSaveStatus('idle');
    if (!isRemoteUpdating.current) {
      collabManager.broadcastNodesChange(nodes);
    }
  }, [nodes]);

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
    setEdges((eds) => (eds.some((e) => e.selected) ? eds.map((e) => (e.selected ? { ...e, selected: false } : e)) : eds));
  }, [setEdges]);

  // Sinkronisasi selectedEdge dengan status selected pada array edges
  useEffect(() => {
    const activeSelectedEdge = edges.find((e) => e.selected);
    if (activeSelectedEdge) {
      setSelectedEdge(activeSelectedEdge);
    }
  }, [edges]);

  // Update Data Node dari PropertyPanel
  const handleUpdateNode = useCallback(
    (nodeId: string, updatedData: any) => {
      takeSnapshot();
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
    [setNodes, takeSnapshot]
  );

  // Update Data Edge dari PropertyPanel
  const handleUpdateEdge = useCallback(
    (edgeId: string, updates: any) => {
      takeSnapshot();
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === edgeId) {
            const newE = {
              ...edge,
              ...updates,
              data: {
                ...(edge.data || {}),
                ...(updates.data || {}),
              },
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
    [setEdges, takeSnapshot]
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

      if (!event.ctrlKey && !event.metaKey && !event.altKey) {
        if (event.key.toLowerCase() === 'v') {
          setInteractionMode('select');
        } else if (event.key.toLowerCase() === 'h') {
          setInteractionMode('pan');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setNodes, setEdges, handleUndo, handleRedo, takeSnapshot, setInteractionMode]);

  // Multi-Page Handlers
  const handleSwitchPage = useCallback(
    (targetPageId: string) => {
      if (targetPageId === activePageId) return;

      const updatedPages = pages.map((p) =>
        p.id === activePageId ? { ...p, nodes, edges } : p
      );
      setPages(updatedPages);

      const targetPage = updatedPages.find((p) => p.id === targetPageId);
      if (targetPage) {
        setActivePageId(targetPageId);
        setNodes(targetPage.nodes || []);
        setEdges(targetPage.edges || []);
        setSelectedNode(null);
        setSelectedEdge(null);
        setPast([]);
        setFuture([]);
        setTimeout(() => fitView({ duration: 250, padding: 0.2 }), 50);
      }
    },
    [activePageId, pages, nodes, edges, setNodes, setEdges, fitView]
  );

  const handleAddPage = useCallback(() => {
    takeSnapshot();
    const newPageId = `page-${Date.now()}`;
    const newPageName = `Page ${pages.length + 1}`;

    const updatedPages = pages.map((p) =>
      p.id === activePageId ? { ...p, nodes, edges } : p
    );

    const newPage: DiagramPage = {
      id: newPageId,
      name: newPageName,
      nodes: [],
      edges: [],
    };

    setPages([...updatedPages, newPage]);
    setActivePageId(newPageId);
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setSelectedEdge(null);
    setPast([]);
    setFuture([]);
  }, [pages, activePageId, nodes, edges, setNodes, setEdges, takeSnapshot]);

  const handleRenamePage = useCallback((pageId: string, newName: string) => {
    setPages((prev) => prev.map((p) => (p.id === pageId ? { ...p, name: newName } : p)));
  }, []);

  const handleDuplicatePage = useCallback(
    (pageId: string) => {
      takeSnapshot();
      const target = pages.find((p) => p.id === pageId);
      if (!target) return;

      const sourceNodes = pageId === activePageId ? nodes : target.nodes;
      const sourceEdges = pageId === activePageId ? edges : target.edges;

      const clonedNodes = sourceNodes.map((n) => ({
        ...n,
        id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        position: { x: n.position.x + 20, y: n.position.y + 20 },
      }));

      const clonedEdges = sourceEdges.map((e) => ({
        ...e,
        id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      }));

      const newPageId = `page-${Date.now()}`;
      const newPage: DiagramPage = {
        id: newPageId,
        name: `${target.name} (Salinan)`,
        nodes: clonedNodes,
        edges: clonedEdges,
      };

      setPages((prev) => [...prev, newPage]);
    },
    [pages, activePageId, nodes, edges, takeSnapshot]
  );

  const handleDeletePage = useCallback(
    (pageId: string) => {
      if (pages.length <= 1) return;
      takeSnapshot();

      if (pageId === activePageId) {
        const nextActive = pages.find((p) => p.id !== pageId);
        if (nextActive) {
          setActivePageId(nextActive.id);
          setNodes(nextActive.nodes || []);
          setEdges(nextActive.edges || []);
          setSelectedNode(null);
          setSelectedEdge(null);
        }
      }

      setPages((prev) => prev.filter((p) => p.id !== pageId));
    },
    [pages, activePageId, setNodes, setEdges, takeSnapshot]
  );

  // Muat Diagram dari Riwayat
  const handleLoadFromHistory = (id: string) => {
    setIsHistoryModalOpen(false);
    const loaded = getDiagramById(id);
    if (loaded) {
      takeSnapshot();
      setCurrentId(loaded.id);
      setTitle(loaded.title);
      if (loaded.pages && loaded.pages.length > 0) {
        setPages(loaded.pages);
        const activeP = loaded.pages.find((p) => p.id === loaded.activePageId) || loaded.pages[0];
        setActivePageId(activeP.id);
        setNodes(activeP.nodes || []);
        setEdges(activeP.edges || []);
      } else {
        const p: DiagramPage = {
          id: 'page-1',
          name: 'Page 1',
          nodes: loaded.nodes || [],
          edges: loaded.edges || [],
        };
        setPages([p]);
        setActivePageId('page-1');
        setNodes(loaded.nodes || []);
        setEdges(loaded.edges || []);
      }
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

    let newNodes: Node[] = [];
    let newEdges: Edge[] = [];

    if (type === 'blank') {
      newNodes = [];
      newEdges = [];
      setTitle('Kanvas Kosong Baru');
    } else if (type === 'flowchart') {
      const demo = getDiagramById('flowchart-demo-1');
      newNodes = demo?.nodes || [];
      newEdges = demo?.edges || [];
      setTitle('Diagram Alir Baru');
    } else if (type === 'mindmap') {
      const demo = getDiagramById('mindmap-demo-2');
      newNodes = demo?.nodes || [];
      newEdges = demo?.edges || [];
      setTitle('Pohon Mind Map Baru');
    }

    setNodes(newNodes);
    setEdges(newEdges);
    setPages([{ id: 'page-1', name: 'Page 1', nodes: newNodes, edges: newEdges }]);
    setActivePageId('page-1');
    setSelectedNode(null);
    setSelectedEdge(null);
    setSaveStatus('idle');
    setTimeout(() => fitView({ padding: 0.2 }), 100);
  };

  // Muat Format / Template dari Modal Pustaka
  const handleSelectSpecialistTemplate = (template: CategoryTemplate) => {
    takeSnapshot();
    const newId = `diag_${template.id}_${Date.now()}`;
    setCurrentId(newId);
    let templateNodes: Node[] = [];
    let templateEdges: Edge[] = [];

    if (template.id === 'blank') {
      setTitle('Kanvas Kosong Baru');
      templateNodes = [];
      templateEdges = [];
    } else {
      setTitle(`Template ${template.name}`);
      templateNodes = template.nodes || [];
      templateEdges = template.edges || [];
    }

    setNodes(templateNodes);
    setEdges(templateEdges);
    setPages([{ id: 'page-1', name: 'Page 1', nodes: templateNodes, edges: templateEdges }]);
    setActivePageId('page-1');
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
    const currentPages = pages.map((p) =>
      p.id === activePageId ? { ...p, nodes, edges } : p
    );

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
      pages: currentPages,
      activePageId,
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
                src={APP_LOGO_URL}
                alt="GALUR Logo - Macan Tutul Jawa"
                width={56}
                height={56}
                className="w-full h-full object-contain filter drop-shadow-sm"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5 font-black text-base tracking-tight text-[#0b4632]">
                GALUR
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Studio
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                  {APP_VERSION}
                </span>
              </div>
              <div className="text-[9px] text-slate-400 font-medium tracking-tight -mt-0.5 hidden lg:block">
                Garis Alur, Ngajentrekeun Struktur
              </div>
            </div>
          </Link>

          <div className="h-5 w-[1px] bg-slate-200 mx-0.5" />

          {/* Menu Buat Diagram Baru Terpadu */}
          <div className="relative flex items-center">
            {/* Tombol Utama: Langsung Buka Dialog Pilih Format Diagram Baru */}
            <button
              type="button"
              onClick={() => setIsTemplateModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-l-lg bg-[#0b4632] hover:bg-[#073022] text-amber-300 text-xs font-bold shadow-xs transition-all cursor-pointer border-r border-emerald-900/60"
              title="Buat Diagram Baru (Buka Pilihan Format & Template Lengkap)"
            >
              <FilePlus className="w-3.5 h-3.5 text-amber-300" />
              <span>Diagram Baru</span>
            </button>

            {/* Tombol Panah: Menu Pilihan Cepat */}
            <button
              type="button"
              onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
              className="px-1.5 py-1.5 rounded-r-lg bg-[#0b4632] hover:bg-[#073022] text-amber-300 text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="Menu Cepat Diagram Baru"
            >
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {isNewMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1">
                  Pilihan Diagram Cepat
                </div>

                {/* 1. Kanvas Kosong */}
                <button
                  onClick={() => {
                    handleCreateNew('blank');
                    setIsNewMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <FilePlus className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Kanvas Kosong</div>
                    <div className="text-[10px] text-slate-400">Mulai dari lembar putih bersih</div>
                  </div>
                </button>

                {/* 2. Fishbone Diagram */}
                <button
                  onClick={() => {
                    const t = getTemplateByCategory('fishbone');
                    if (t) handleSelectSpecialistTemplate(t);
                    setIsNewMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-rose-50 text-xs font-medium text-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
                    <Fish className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-rose-950">Diagram Tulang Ikan (Fishbone)</div>
                    <div className="text-[10px] text-rose-700">Analisis akar masalah 6M</div>
                  </div>
                </button>

                {/* 3. SWOT Matrix */}
                <button
                  onClick={() => {
                    const t = getTemplateByCategory('swot');
                    if (t) handleSelectSpecialistTemplate(t);
                    setIsNewMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-amber-50 text-xs font-medium text-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-[#ea9932]">
                    <Target className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-amber-950">Analisis SWOT 4 Kuadran</div>
                    <div className="text-[10px] text-amber-700">Evaluasi strategis S / W / O / T</div>
                  </div>
                </button>

                {/* 4. Lean Canvas */}
                <button
                  onClick={() => {
                    const t = getTemplateByCategory('lean_canvas');
                    if (t) handleSelectSpecialistTemplate(t);
                    setIsNewMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-emerald-50 text-xs font-medium text-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <LayoutTemplate className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-950">Lean Canvas Inovasi</div>
                    <div className="text-[10px] text-emerald-700">9 blok solusi & model bisnis</div>
                  </div>
                </button>

                
                {/* 4b. Business Model Canvas (Strategic • AI) */}
                <button
                  onClick={() => {
                    const t = getTemplateByCategory('bmc');
                    if (t) handleSelectSpecialistTemplate(t);
                    setIsNewMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-sky-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700">
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sky-950 flex items-center gap-1">
                      <span>Business Model Canvas</span>
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 border border-purple-200">AI</span>
                    </div>
                    <div className="text-[10px] text-sky-700">9 blok arsitektur bisnis Alexander Osterwalder</div>
                  </div>
                </button>

                {/* 5. Flowchart */}
                <button
                  onClick={() => {
                    handleCreateNew('flowchart');
                    setIsNewMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-blue-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                    <GitFork className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900">Template Flowchart</div>
                    <div className="text-[10px] text-slate-400">Alur keputusan Visio</div>
                  </div>
                </button>

                {/* 5b. Swimlane (Alur Lintas Fungsi) */}
                <button
                  onClick={() => {
                    const t = getTemplateByCategory('swimlane');
                    if (t) handleSelectSpecialistTemplate(t);
                    setIsNewMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-sky-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sky-950">Swimlane (Alur Antar Fungsi)</div>
                    <div className="text-[10px] text-sky-700">Alur departemen, peran & SOP</div>
                  </div>
                </button>

                
                {/* 5c. Service Blueprint (Cetak Biru Layanan) */}
                <button
                  onClick={() => {
                    const t = getTemplateByCategory('service_blueprint');
                    if (t) handleSelectSpecialistTemplate(t);
                    setIsNewMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-orange-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                    <Workflow className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-orange-950">Service Blueprint</div>
                    <div className="text-[10px] text-orange-700">Cetak biru layanan & garis interaksi</div>
                  </div>
                </button>

                {/* 6. Mind Map */}
                <button
                  onClick={() => {
                    handleCreateNew('mindmap');
                    setIsNewMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-emerald-50 text-xs font-medium text-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Network className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-900">Template Mind Map</div>
                    <div className="text-[10px] text-slate-400">Pohon ide & brainstorming</div>
                  </div>
                </button>

                <div className="my-1 border-t border-slate-100" />

                {/* Buka Dialog Pemilih Format Lengkap */}
                <button
                  onClick={() => {
                    setIsNewMenuOpen(false);
                    setIsTemplateModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-left hover:bg-amber-100/70 text-xs font-bold text-amber-950 transition-colors bg-amber-50/70 border border-amber-200/80 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#0b4632] text-amber-300 flex items-center justify-center shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div>Pustaka Format Lengkap...</div>
                    <div className="text-[10px] font-normal text-amber-800">Pilih dari {SPECIALIST_CATEGORIES.length} format & diagram</div>
                  </div>
                </button>
              </div>
            )}
          </div>

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

        {/* Center: Save status (Single clean indicator) */}
        <div className="hidden lg:flex items-center text-xs">
          {saveStatus === 'saving' ? (
            <span className="flex items-center gap-1.5 text-amber-600 font-medium">
              <HardDrive className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Menyimpan...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
              <span>Otomatis tersimpan</span>
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Active Collaborators Presence Badge */}
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            title="Klik untuk membuka Ruang Kolaborasi & Tautan Berbagi"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
              collabUsers.length > 0
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-800 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${collabUsers.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <div className="flex items-center -space-x-1.5" suppressHydrationWarning>
              <div
                suppressHydrationWarning
                className="w-5 h-5 rounded-full text-white font-bold text-[9px] flex items-center justify-center ring-1 ring-white"
                style={{ backgroundColor: isMounted ? currentUser.color : '#0284c7' }}
                title={`Anda: ${isMounted ? currentUser.name : 'Kolaborator'}`}
              >
                {(isMounted ? currentUser.name : 'K').charAt(0).toUpperCase()}
              </div>
              {collabUsers.slice(0, 3).map((u) => (
                <div
                  key={u.id}
                  className="w-5 h-5 rounded-full text-white font-bold text-[9px] flex items-center justify-center ring-1 ring-white"
                  style={{ backgroundColor: u.color }}
                  title={`Rekan: ${u.name}`}
                >
                  {u.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
            <span className="text-[11px] font-bold hidden sm:inline">
              {collabUsers.length > 0 ? `${collabUsers.length + 1} Aktif` : 'Kolaborasi'}
            </span>
          </button>

          {/* Tombol Bagikan */}
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 hover:border-blue-300 hover:bg-blue-50/70 text-blue-700 text-xs font-bold transition-colors shadow-2xs cursor-pointer"
            title="Bagikan Diagram atau Undang Rekan Kolaborasi"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Bagikan</span>
          </button>

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
        isDiagramSettingsOpen={isDiagramSettingsOpen}
        onToggleDiagramSettings={() => setIsDiagramSettingsOpen((prev) => !prev)}
        pageSize={pageConfig.pageSize}
        interactionMode={interactionMode}
        onInteractionModeChange={setInteractionMode}
      />

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          onAddNode={handleAddNode}
          edgeType={edgeType}
          setEdgeType={setEdgeType}
        />

        <div className="flex-1 flex flex-col h-full min-w-0 relative">
          <div
            ref={reactFlowWrapper}
            onPointerMove={handleCanvasPointerMove}
            className={`flex-1 w-full relative print-area transition-colors ${
              interactionMode === 'pan' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
            } ${
              pageConfig.canvasTheme === 'dark'
                ? 'bg-slate-950'
                : pageConfig.canvasTheme === 'emerald'
                ? 'bg-[#edf5f0]'
                : 'bg-slate-200/70'
            }`}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            {/* Live Multi-User Collaboration Cursors Overlay */}
            <CollabCursorsOverlay users={collabUsers} />

            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onConnectStart={onConnectStart}
              onConnectEnd={onConnectEnd}
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
              onNodeDragStart={handleNodeDragStart}
              onNodeDrag={handleNodeDrag}
              onNodeDragStop={handleNodeDragStop}
              onSelectionDragStop={() => {
                setSaveStatus('idle');
                if (!isRemoteUpdating.current) {
                  collabManager.broadcastNodesChange(nodes);
                }
              }}
              deleteKeyCode={['Backspace', 'Delete']}
              fitView
              snapToGrid={pageConfig.snapToGrid}
              snapGrid={[15, 15]}
              selectionOnDrag={interactionMode === 'select'}
              selectionMode={SelectionMode.Partial}
              panOnDrag={interactionMode === 'pan' ? true : [1, 2]}
              panActivationKeyCode="Space"
              proOptions={{ hideAttribution: true }}
            >
              {/* Lembar Halaman A4 Presisi dengan Fitur Auto-Expand Sesuai Perkembangan Diagram */}
              <CanvasPageFrame config={pageConfig} nodes={nodes} />

              {pageConfig.showGrid && (
                <Background
                  variant={pageConfig.gridVariant === 'lines' ? BackgroundVariant.Lines : BackgroundVariant.Dots}
                  gap={pageConfig.gridSize}
                  size={1}
                  color={pageConfig.canvasTheme === 'dark' ? '#334155' : '#cbd5e1'}
                />
              )}
              <MiniMap
                className="!bg-white !border-slate-200 !shadow-md !rounded-xl overflow-hidden no-print"
                nodeStrokeColor="#3b82f6"
                nodeColor="#eff6ff"
                maskColor="rgba(240, 244, 248, 0.7)"
              />
            </ReactFlow>

            {/* BANGKIT BERUANG ECOSYSTEM Official Canvas Watermark */}
            <div className="absolute bottom-2 right-2 z-10 pointer-events-none select-none no-print">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-2xs border border-slate-200/60 shadow-2xs text-[9px] font-extrabold text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span className="uppercase tracking-wider">BANGKIT BERUANG</span>
                <span className="text-emerald-700 font-bold lowercase">ecosystem</span>
              </div>
            </div>
          </div>

          {/* DOCK BAR MULTI-HALAMAN & KONTROL (Sesuai Referensi Gambar) */}
          <CanvasBottomBar
            pages={pages}
            activePageId={activePageId}
            onSwitchPage={handleSwitchPage}
            onAddPage={handleAddPage}
            onRenamePage={handleRenamePage}
            onDuplicatePage={handleDuplicatePage}
            onDeletePage={handleDeletePage}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={past.length > 0}
            canRedo={future.length > 0}
            onOpenShortcutsHelp={() => setIsSettingsModalOpen(true)}
          />
        </div>

        <PropertyPanel
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
          onUpdateEdge={handleUpdateEdge}
          onDeleteEdge={handleDeleteEdge}
          pageConfig={pageConfig}
          onUpdatePageConfig={(updates) => setPageConfig((prev) => ({ ...prev, ...updates }))}
          nodeCount={nodes.length}
          edgeCount={edges.length}
          isDiagramSettingsOpen={isDiagramSettingsOpen}
          onCloseDiagramSettings={() => setIsDiagramSettingsOpen(false)}
        />
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        diagramTitle={title}
        nodes={nodes}
        edges={edges}
        pages={pages.map((p) => (p.id === activePageId ? { ...p, nodes, edges } : p))}
        pageConfig={pageConfig}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        currentDiagramId={currentId}
        onLoadDiagram={handleLoadFromHistory}
        onNewDiagram={() => handleCreateNew('blank')}
      />

      <CanvasSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        config={pageConfig}
        onChangeConfig={(updates) => setPageConfig((prev) => ({ ...prev, ...updates }))}
        nodeCount={nodes.length}
        edgeCount={edges.length}
      />

      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectSpecialistTemplate}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        diagramTitle={title}
        diagramId={currentId}
        nodes={nodes}
        edges={edges}
        pageConfig={pageConfig}
        activeRoomId={activeRoomId}
        onJoinRoom={(newRoom) => setActiveRoomId(newRoom)}
        collabUsers={collabUsers}
        currentUser={currentUser}
        onUpdateUserProfile={(name, color) => {
          collabManager.updateProfile(name, color);
          setCurrentUser(collabManager.getCurrentUser());
        }}
        onImportDiagram={handleImportDiagram}
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
