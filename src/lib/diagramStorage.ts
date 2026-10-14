'use client';

import { Node, Edge, MarkerType } from '@xyflow/react';

export interface DiagramMetadata {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  nodeCount: number;
  edgeCount: number;
  type: 'flowchart' | 'mindmap' | 'custom';
}

export interface DiagramContent extends DiagramMetadata {
  nodes: Node[];
  edges: Edge[];
}

const META_INDEX_KEY = 'galur_diagrams_index';

// Template Bawaan Flowchart
const defaultFlowchartNodes: Node[] = [
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
    type: 'terminal',
    position: { x: 280, y: 460 },
    data: { label: 'Selesai & Ekspor', color: '#fef2f2', borderColor: '#ef4444', textColor: '#991b1b' },
  },
];

const defaultFlowchartEdges: Edge[] = [
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
    id: 'edge-3-4',
    source: 'node-3',
    target: 'node-4',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
    style: { stroke: '#ef4444', strokeWidth: 2 },
    label: 'Ya',
  },
];

// Template Bawaan Mind Map
const defaultMindmapNodes: Node[] = [
  {
    id: 'root-mindmap',
    type: 'mindmap',
    position: { x: 320, y: 220 },
    data: { label: 'Gagasan Utama', isRoot: true, color: '#1e293b', borderColor: '#0f172a', textColor: '#ffffff' },
  },
  {
    id: 'child-1',
    type: 'mindmap',
    position: { x: 570, y: 140 },
    data: { label: 'Cabang Strategi', color: '#eff6ff', borderColor: '#3b82f6', textColor: '#1e3a8a' },
  },
  {
    id: 'child-2',
    type: 'mindmap',
    position: { x: 570, y: 300 },
    data: { label: 'Cabang Eksekusi', color: '#ecfdf5', borderColor: '#10b981', textColor: '#065f46' },
  },
];

const defaultMindmapEdges: Edge[] = [
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
];

// Inisialisasi awal jika riwayat masih kosong
export function initDefaultDiagramsIfEmpty(): DiagramMetadata[] {
  if (typeof window === 'undefined') return [];

  const rawIndex = localStorage.getItem(META_INDEX_KEY);
  if (rawIndex) {
    try {
      const parsed = JSON.parse(rawIndex);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {}
  }

  // Buat 2 diagram awal agar riwayat langsung terisi rapi
  const initialList: DiagramContent[] = [
    {
      id: 'flowchart-demo-1',
      title: 'Diagram Alur Keputusan Standar (Flowchart)',
      updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      nodeCount: defaultFlowchartNodes.length,
      edgeCount: defaultFlowchartEdges.length,
      type: 'flowchart',
      nodes: defaultFlowchartNodes,
      edges: defaultFlowchartEdges,
    },
    {
      id: 'mindmap-demo-2',
      title: 'Pohon Pemikiran & Brainstorming (Mind Map)',
      updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      nodeCount: defaultMindmapNodes.length,
      edgeCount: defaultMindmapEdges.length,
      type: 'mindmap',
      nodes: defaultMindmapNodes,
      edges: defaultMindmapEdges,
    },
  ];

  initialList.forEach((diagram) => {
    localStorage.setItem(`galur_diagram_${diagram.id}`, JSON.stringify(diagram));
  });

  const metaList: DiagramMetadata[] = initialList.map(({ nodes, edges, ...meta }) => meta);
  localStorage.setItem(META_INDEX_KEY, JSON.stringify(metaList));
  return metaList;
}

// Ambil seluruh daftar ringkasan riwayat diagram
export function getAllDiagramsMeta(): DiagramMetadata[] {
  if (typeof window === 'undefined') return [];
  const list = initDefaultDiagramsIfEmpty();
  return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

// Ambil isi diagram lengkap berdasarkan ID
export function getDiagramById(id: string): DiagramContent | null {
  if (typeof window === 'undefined') return null;

  // Coba ambil dari key spesifik
  const raw = localStorage.getItem(`galur_diagram_${id}`);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error parsing diagram:', e);
    }
  }

  // Jika tidak ditemukan, inisialisasi default
  initDefaultDiagramsIfEmpty();
  const rawFallback = localStorage.getItem(`galur_diagram_${id}`);
  if (rawFallback) {
    try {
      return JSON.parse(rawFallback);
    } catch (e) {}
  }

  return null;
}

// Simpan atau perbarui diagram ke riwayat (Auto-Save)
export function saveDiagramToStorage(diagram: DiagramContent): void {
  if (typeof window === 'undefined') return;

  const now = new Date().toISOString();
  const updatedDiagram: DiagramContent = {
    ...diagram,
    updatedAt: now,
    nodeCount: diagram.nodes?.length || 0,
    edgeCount: diagram.edges?.length || 0,
  };

  // 1. Simpan konten lengkap
  localStorage.setItem(`galur_diagram_${diagram.id}`, JSON.stringify(updatedDiagram));

  // 2. Perbarui index metadata riwayat
  const existingMeta = getAllDiagramsMeta();
  const index = existingMeta.findIndex((item) => item.id === diagram.id);

  const metaItem: DiagramMetadata = {
    id: diagram.id,
    title: diagram.title || 'Diagram Tanpa Judul',
    updatedAt: now,
    createdAt: diagram.createdAt || now,
    nodeCount: diagram.nodes?.length || 0,
    edgeCount: diagram.edges?.length || 0,
    type: diagram.type || 'custom',
  };

  if (index >= 0) {
    existingMeta[index] = metaItem;
  } else {
    existingMeta.unshift(metaItem);
  }

  localStorage.setItem(META_INDEX_KEY, JSON.stringify(existingMeta));
}

// Hapus diagram dari riwayat
export function deleteDiagramFromStorage(id: string): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(`galur_diagram_${id}`);
  const existingMeta = getAllDiagramsMeta();
  const filtered = existingMeta.filter((item) => item.id !== id);
  localStorage.setItem(META_INDEX_KEY, JSON.stringify(filtered));
}
