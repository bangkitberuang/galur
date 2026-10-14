'use client';

import { Node, Edge, MarkerType } from '@xyflow/react';
import { getTemplateByCategory } from './specialistTemplates';

export interface DiagramMetadata {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  nodeCount: number;
  edgeCount: number;
  type: 'flowchart' | 'mindmap' | 'custom';
  pageCount?: number;
}

export interface DiagramPage {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
}

export interface DiagramContent extends DiagramMetadata {
  nodes: Node[];
  edges: Edge[];
  pages?: DiagramPage[];
  activePageId?: string;
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

// Template Bawaan Matriks Analisis SWOT 4 Kuadran (Sesuai Contoh Gambar)
const defaultSwotNodes: Node[] = [
  {
    id: 'swot-axis-internal',
    type: 'text',
    position: { x: 410, y: 30 },
    data: {
      label: 'INTERNAL',
      fontSize: '18px',
      fontWeight: '900',
      letterSpacing: '0.15em',
      textColor: '#0f172a',
      isUppercase: true,
    },
  },
  {
    id: 'swot-axis-external',
    type: 'text',
    position: { x: 410, y: 800 },
    data: {
      label: 'EXTERNAL',
      fontSize: '18px',
      fontWeight: '900',
      letterSpacing: '0.15em',
      textColor: '#0f172a',
      isUppercase: true,
    },
  },
  {
    id: 'swot-axis-positive',
    type: 'text',
    position: { x: 45, y: 415 },
    data: {
      label: 'POSITIVE',
      rotation: -90,
      fontSize: '18px',
      fontWeight: '900',
      letterSpacing: '0.15em',
      textColor: '#0f172a',
      isUppercase: true,
    },
  },
  {
    id: 'swot-axis-negative',
    type: 'text',
    position: { x: 810, y: 415 },
    data: {
      label: 'NEGATIVE',
      rotation: 90,
      fontSize: '18px',
      fontWeight: '900',
      letterSpacing: '0.15em',
      textColor: '#0f172a',
      isUppercase: true,
    },
  },
  {
    id: 'swot-s',
    type: 'swot_card',
    position: { x: 130, y: 80 },
    data: {
      type: 'S',
      title: 'strengths',
      color: '#8ed95a',
      borderColor: '#78c644',
      textColor: '#0f172a',
      items: [
        'Low labor cost',
        'Strong specialization in electric services',
        'Well recognized, national brand name',
        'Good relationship with major investors',
      ],
    },
  },
  {
    id: 'swot-w',
    type: 'swot_card',
    position: { x: 470, y: 80 },
    data: {
      type: 'W',
      title: 'weaknesses',
      color: '#72aae0',
      borderColor: '#5b98d2',
      textColor: '#0f172a',
      items: [
        'Lack expertise in renewable energy',
        'Lack capital',
        'Lack of industrial partners',
        'Lack interaction with major stakeholders and policy makers',
        'Low R&D capability',
      ],
    },
  },
  {
    id: 'swot-o',
    type: 'swot_card',
    position: { x: 130, y: 440 },
    data: {
      type: 'O',
      title: 'opportunities',
      color: '#ffd966',
      borderColor: '#f0c742',
      textColor: '#0f172a',
      items: [
        '2-year government subsidies',
        'Fast growing sector',
        'High social acceptance',
        'High oil and coal cost',
        'Well established legal framework for storage, manufacturing and transportation',
      ],
    },
  },
  {
    id: 'swot-t',
    type: 'swot_card',
    position: { x: 470, y: 440 },
    data: {
      type: 'T',
      title: 'threats',
      color: '#f07d7d',
      borderColor: '#df6666',
      textColor: '#0f172a',
      items: [
        'Potentially high R&D expenses',
        'High waste management fee',
        'The "Not in my backyard" philosophy makes waste management difficult',
        'Large competitors get majority of market share',
      ],
    },
  },
];

const SEEDED_KEY = 'galur_diagrams_seeded_v1';
const DELETED_IDS_KEY = 'galur_deleted_diagram_ids';

// Periksa apakah sebuah diagram telah dihapus permanen oleh pengguna
export function isDiagramDeleted(id: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(DELETED_IDS_KEY);
    if (!raw) return false;
    const list: string[] = JSON.parse(raw);
    return Array.isArray(list) && list.includes(id);
  } catch {
    return false;
  }
}

// Catat ID diagram ke daftar hitam penghapusan (tombstone) agar tidak dibangkitkan kembali
export function markDiagramDeleted(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(DELETED_IDS_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(list));
    }
  } catch {}
}

// Inisialisasi awal jika riwayat masih kosong (Hanya berjalan SEKALI pada kunjungan pertama)
export function initDefaultDiagramsIfEmpty(): DiagramMetadata[] {
  if (typeof window === 'undefined') return [];

  const rawIndex = localStorage.getItem(META_INDEX_KEY);
  const isAlreadySeeded = localStorage.getItem(SEEDED_KEY) === 'true';

  // Jika sudah pernah di-seed sebelumnya, JANGAN PERNAH membuat ulang diagram yang telah dihapus user!
  if (isAlreadySeeded) {
    if (rawIndex) {
      try {
        const parsed: DiagramMetadata[] = JSON.parse(rawIndex);
        if (Array.isArray(parsed)) {
          // Bersihkan jika ada ID yang berada di blacklist penghapusan
          const validList = parsed.filter((d) => !isDiagramDeleted(d.id));
          if (validList.length !== parsed.length) {
            localStorage.setItem(META_INDEX_KEY, JSON.stringify(validList));
          }
          return validList;
        }
      } catch (e) {}
    }
    // Jika semua diagram telah dihapus oleh pengguna, biarkan riwayat tetap kosong
    return [];
  }

  // Tandai bahwa inisialisasi awal telah dilakukan
  localStorage.setItem(SEEDED_KEY, 'true');

  const fishboneTemplate = getTemplateByCategory('fishbone');

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
    {
      id: 'swot-demo-3',
      title: 'Matriks Analisis SWOT 4 Kuadran (Sesuai Contoh Gambar)',
      updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      nodeCount: defaultSwotNodes.length,
      edgeCount: 0,
      type: 'custom',
      nodes: defaultSwotNodes,
      edges: [],
    },
    {
      id: 'fishbone-demo-4',
      title: 'Diagram Tulang Ikan (Fishbone 6M Sebab-Akibat)',
      updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      nodeCount: fishboneTemplate ? fishboneTemplate.nodes.length : 8,
      edgeCount: fishboneTemplate ? fishboneTemplate.edges.length : 7,
      type: 'custom',
      nodes: fishboneTemplate ? fishboneTemplate.nodes : [],
      edges: fishboneTemplate ? fishboneTemplate.edges : [],
    },
  ];

  // Simpan diagram awal
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
  return list
    .filter((d) => !isDiagramDeleted(d.id))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

// Ambil isi diagram lengkap berdasarkan ID
export function getDiagramById(id: string): DiagramContent | null {
  if (typeof window === 'undefined') return null;
  if (!id || isDiagramDeleted(id)) return null;

  // Coba ambil dari key spesifik
  const raw = localStorage.getItem(`galur_diagram_${id}`);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error parsing diagram:', e);
    }
  }

  return null;
}

// Simpan atau perbarui diagram ke riwayat (Auto-Save)
export function saveDiagramToStorage(diagram: DiagramContent): void {
  if (typeof window === 'undefined') return;
  if (!diagram || !diagram.id) return;

  // Jangan pernah menyimpan jika diagram ini sudah dihapus oleh pengguna
  if (isDiagramDeleted(diagram.id)) {
    console.warn(`[galur] Mencegah auto-save pada diagram yang telah dihapus: ${diagram.id}`);
    return;
  }

  const now = new Date().toISOString();
  const updatedDiagram: DiagramContent = {
    ...diagram,
    updatedAt: now,
    nodeCount: diagram.nodes?.length || 0,
    edgeCount: diagram.edges?.length || 0,
    pageCount: diagram.pages?.length || 1,
  };

  // 1. Simpan konten lengkap
  localStorage.setItem(`galur_diagram_${diagram.id}`, JSON.stringify(updatedDiagram));

  // 2. Perbarui index metadata riwayat
  const rawIndex = localStorage.getItem(META_INDEX_KEY);
  let existingMeta: DiagramMetadata[] = [];
  if (rawIndex) {
    try {
      const parsed = JSON.parse(rawIndex);
      if (Array.isArray(parsed)) {
        existingMeta = parsed.filter((item) => !isDiagramDeleted(item.id));
      }
    } catch {}
  }

  const index = existingMeta.findIndex((item) => item.id === diagram.id);

  const metaItem: DiagramMetadata = {
    id: diagram.id,
    title: diagram.title || 'Diagram Tanpa Judul',
    updatedAt: now,
    createdAt: diagram.createdAt || now,
    nodeCount: diagram.nodes?.length || 0,
    edgeCount: diagram.edges?.length || 0,
    type: diagram.type || 'custom',
    pageCount: diagram.pages?.length || 1,
  };

  if (index >= 0) {
    existingMeta[index] = metaItem;
  } else {
    existingMeta.unshift(metaItem);
  }

  localStorage.setItem(META_INDEX_KEY, JSON.stringify(existingMeta));
}

// Hapus diagram secara permanen dari riwayat
export function deleteDiagramFromStorage(id: string): void {
  if (typeof window === 'undefined' || !id) return;

  // 1. Tandai ID sebagai telah dihapus secara permanen
  markDiagramDeleted(id);

  // 2. Hapus berkas diagram dari localStorage
  localStorage.removeItem(`galur_diagram_${id}`);

  // 3. Hapus langsung dari index metadata riwayat tanpa memicu inisialisasi ulang
  const rawIndex = localStorage.getItem(META_INDEX_KEY);
  if (rawIndex) {
    try {
      const existingMeta: DiagramMetadata[] = JSON.parse(rawIndex);
      if (Array.isArray(existingMeta)) {
        const filtered = existingMeta.filter((item) => item.id !== id && !isDiagramDeleted(item.id));
        localStorage.setItem(META_INDEX_KEY, JSON.stringify(filtered));
      }
    } catch (e) {}
  }
}
