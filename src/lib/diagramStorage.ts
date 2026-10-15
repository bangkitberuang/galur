'use client';

import { Node, Edge } from '@xyflow/react';

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
const SEEDED_KEY = 'galur_diagrams_seeded_v2';
const DELETED_IDS_KEY = 'galur_deleted_diagram_ids';
export const DEMO_IDS = ['flowchart-demo-1', 'mindmap-demo-2', 'swot-demo-3', 'fishbone-demo-4'];

// Periksa apakah sebuah diagram telah dihapus permanen oleh pengguna
export function isDiagramDeleted(id: string): boolean {
  if (typeof window === 'undefined') return false;
  if (DEMO_IDS.includes(id)) return true;
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

// Inisialisasi awal: Membersihkan data dummy/mock lama sehingga riwayat pengguna selalu bersih
export function initDefaultDiagramsIfEmpty(): DiagramMetadata[] {
  if (typeof window === 'undefined') return [];

  // Hapus sisa-sisa demo diagram lama jika masih tersimpan di browser
  try {
    DEMO_IDS.forEach((id) => {
      localStorage.removeItem(`galur_diagram_${id}`);
    });
  } catch {}

  const rawIndex = localStorage.getItem(META_INDEX_KEY);
  if (rawIndex) {
    try {
      const parsed: DiagramMetadata[] = JSON.parse(rawIndex);
      if (Array.isArray(parsed)) {
        // Bersihkan jika ada ID demo atau yang berada di blacklist penghapusan
        const validList = parsed.filter((d) => !DEMO_IDS.includes(d.id) && !isDiagramDeleted(d.id));
        if (validList.length !== parsed.length) {
          localStorage.setItem(META_INDEX_KEY, JSON.stringify(validList));
        }
        return validList;
      }
    } catch (e) {}
  }

  // Tandai versi baru sudah diterapkan
  localStorage.setItem(SEEDED_KEY, 'true');
  return [];
}

// Ambil seluruh daftar ringkasan riwayat diagram milik pengguna
export function getAllDiagramsMeta(): DiagramMetadata[] {
  if (typeof window === 'undefined') return [];
  const list = initDefaultDiagramsIfEmpty();
  return list
    .filter((d) => !DEMO_IDS.includes(d.id) && !isDiagramDeleted(d.id))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

// Ambil isi diagram lengkap berdasarkan ID
export function getDiagramById(id: string): DiagramContent | null {
  if (typeof window === 'undefined') return null;
  if (!id || DEMO_IDS.includes(id) || isDiagramDeleted(id)) return null;

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
