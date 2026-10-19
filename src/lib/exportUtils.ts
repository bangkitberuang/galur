/**
 * GALUR Diagram Export Utilities
 * Mendukung format:
 * 1. Gambar & Vektor: PNG, JPEG, SVG
 * 2. Dokumen: PDF
 * 3. Microsoft Visio: VDX (Visio XML Drawing yang dapat dibuka langsung oleh Visio 2003-365)
 * 4. Data & Cadangan: JSON (Full GALUR Project) & CSV (Data Tabel untuk Excel / Spreadsheet)
 */

import { Node, Edge } from '@xyflow/react';
import { toJpeg, toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { CanvasPageConfig } from '@/components/canvas/CanvasPageFrame';

export interface DiagramPageData {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
}

/**
 * Filter elemen UI internal ReactFlow agar tidak ikut terekspor ke gambar/vektor
 */
export const defaultExportFilter = (node: HTMLElement): boolean => {
  if (node.classList) {
    if (node.classList.contains('react-flow__handle')) return false;
    if (node.classList.contains('react-flow__edgeupdater')) return false;
    if (node.classList.contains('react-flow__edgeupdater-source')) return false;
    if (node.classList.contains('react-flow__edgeupdater-target')) return false;
    if (node.classList.contains('no-print')) return false;
    if (node.classList.contains('react-flow__resize-control')) return false;
    if (node.classList.contains('react-flow__resizer')) return false;
    if (node.classList.contains('collab-cursor-overlay')) return false;
  }
  return true;
};

/**
 * Helper untuk mengunduh berkas teks / blob ke browser pengguna
 */
export function triggerFileDownload(content: string | Blob, fileName: string, mimeType: string): void {
  const blob = typeof content === 'string' ? new Blob([content], { type: mimeType }) : content;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * 1. EKSPOR KE SVG (Scalable Vector Graphics)
 */
export async function exportToSvgImage(
  element: HTMLElement,
  fileName: string,
  transparentBackground = false
): Promise<void> {
  const dataUrl = await toSvg(element, {
    backgroundColor: transparentBackground ? undefined : '#ffffff',
    filter: defaultExportFilter as any,
  });

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${fileName}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 2. EKSPOR KE PNG (Resolusi HD / Ultra HD)
 */
export async function exportToPngImage(
  element: HTMLElement,
  fileName: string,
  pixelRatio = 2,
  transparentBackground = false
): Promise<void> {
  const dataUrl = await toPng(element, {
    backgroundColor: transparentBackground ? undefined : '#ffffff',
    pixelRatio,
    filter: defaultExportFilter as any,
  });

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${fileName}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 3. EKSPOR KE JPEG
 */
export async function exportToJpegImage(
  element: HTMLElement,
  fileName: string,
  pixelRatio = 2
): Promise<void> {
  const dataUrl = await toJpeg(element, {
    backgroundColor: '#ffffff',
    pixelRatio,
    quality: 0.95,
    filter: defaultExportFilter as any,
  });

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${fileName}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 4. EKSPOR KE PDF (A4 / A3, Potret / Lanskap)
 */
export async function exportToPdfDocument(
  element: HTMLElement,
  fileName: string,
  orientation: 'landscape' | 'portrait' = 'landscape',
  pageSize: 'a4' | 'a3' = 'a4',
  pixelRatio = 2
): Promise<void> {
  const dataUrl = await toPng(element, {
    backgroundColor: '#ffffff',
    pixelRatio,
    filter: defaultExportFilter as any,
  });

  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: pageSize,
  });

  const img = new Image();
  img.src = dataUrl;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const availableWidth = pageWidth - margin * 2;
  const availableHeight = pageHeight - margin * 2;

  const imgRatio = img.width / img.height;
  let printWidth = availableWidth;
  let printHeight = availableWidth / imgRatio;

  if (printHeight > availableHeight) {
    printHeight = availableHeight;
    printWidth = availableHeight * imgRatio;
  }

  const x = (pageWidth - printWidth) / 2;
  const y = (pageHeight - printHeight) / 2;

  pdf.addImage(dataUrl, 'PNG', x, y, printWidth, printHeight);
  pdf.save(`${fileName}.pdf`);
}

/**
 * 5. EKSPOR KE JSON (Proyek Cadangan Penuh GALUR)
 */
export function exportToJsonProject(
  title: string,
  nodes: Node[],
  edges: Edge[],
  pages?: DiagramPageData[],
  pageConfig?: CanvasPageConfig,
  fileName?: string
): void {
  const exportPayload = {
    appName: 'GALUR Studio',
    tagline: 'Garis Alur, Ngajentrekeun Struktur',
    version: '1.3.0',
    exportedAt: new Date().toISOString(),
    diagram: {
      title,
      nodeCount: nodes.length,
      edgeCount: edges.length,
      pageConfig: pageConfig || null,
      pages: pages && pages.length > 0 ? pages : [{ id: 'page-1', name: 'Page 1', nodes, edges }],
      nodes,
      edges,
    },
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const outName = `${(fileName || title).toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
  triggerFileDownload(jsonString, outName, 'application/json;charset=utf-8');
}

/**
 * 6. EKSPOR KE CSV (Format Tabel Data Kompatibel Microsoft Excel & Google Sheets)
 */
export function exportToCsvSpreadsheet(
  title: string,
  nodes: Node[],
  edges: Edge[],
  fileName?: string
): void {
  const escapeCsv = (val: any): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const nodeMap = new Map<string, string>();
  nodes.forEach((n) => {
    const d = (n.data || {}) as Record<string, any>;
    const lbl = d.label || d.title || n.id;
    nodeMap.set(n.id, String(lbl));
  });

  const lines: string[] = [];

  // Header Ringkasan
  lines.push(`"# =========================================="`);
  lines.push(`"# GALUR DIAGRAM DATA EXPORT (EXCEL/CSV)"`);
  lines.push(`"# Judul: ${title}"`);
  lines.push(`"# Tanggal Ekspor: ${new Date().toLocaleString('id-ID')}"`);
  lines.push(`"# Total Bentuk (Nodes): ${nodes.length}"`);
  lines.push(`"# Total Hubungan (Edges): ${edges.length}"`);
  lines.push(`"# =========================================="`);
  lines.push('');

  // Tabel 1: Daftar Bentuk / Objek
  lines.push(`"# DAFTAR BENTUK / ELEMEN DIAGRAM (NODES)"`);
  lines.push(
    [
      'ID',
      'Tipe Bentuk',
      'Label Utama',
      'Sublabel / Keterangan',
      'Kategori',
      'Posisi X (px)',
      'Posisi Y (px)',
      'Lebar (px)',
      'Tinggi (px)',
      'Warna Latar',
      'Warna Garis',
      'Warna Teks',
    ].map(escapeCsv).join(',')
  );

  nodes.forEach((n) => {
    const d = (n.data || {}) as Record<string, any>;
    const row = [
      n.id,
      n.type || 'default',
      d.label || d.title || '',
      d.sublabel || (Array.isArray(d.items) ? d.items.join('; ') : ''),
      d.category || '',
      Math.round(n.position.x),
      Math.round(n.position.y),
      typeof d.width === 'number' ? d.width : (n.measured?.width || 160),
      typeof d.height === 'number' ? d.height : (n.measured?.height || 80),
      d.color || '',
      d.borderColor || '',
      d.textColor || '',
    ];
    lines.push(row.map(escapeCsv).join(','));
  });

  lines.push('');
  lines.push('');

  // Tabel 2: Daftar Garis Alur / Koneksi
  lines.push(`"# DAFTAR KONEKTOR / HUBUNGAN ALUR (EDGES)"`);
  lines.push(
    [
      'ID Konektor',
      'Dari ID (Source)',
      'Nama Sumber',
      'Ke ID (Target)',
      'Nama Tujuan',
      'Label Alur',
      'Gaya Garis',
      'Arah Panah',
    ].map(escapeCsv).join(',')
  );

  edges.forEach((e) => {
    const sourceLabel = nodeMap.get(e.source) || e.source;
    const targetLabel = nodeMap.get(e.target) || e.target;
    const arrowhead = e.markerEnd && e.markerStart ? 'Dua Arah (↔)' : e.markerEnd ? 'Satu Arah (→)' : 'Garis Polos (-)';
    const row = [
      e.id,
      e.source,
      sourceLabel,
      e.target,
      targetLabel,
      e.label || (e.data?.label as string) || '',
      e.type || 'smoothstep',
      arrowhead,
    ];
    lines.push(row.map(escapeCsv).join(','));
  });

  // Tambahkan UTF-8 BOM (\uFEFF) agar Microsoft Excel langsung membaca aksen & karakter secara sempurna
  const csvContent = '\uFEFF' + lines.join('\r\n');
  const outName = `${(fileName || title).toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.csv`;
  triggerFileDownload(csvContent, outName, 'text/csv;charset=utf-8;');
}

/**
 * 7. EKSPOR KE MICROSOFT VISIO (VDX / Visio XML Drawing)
 * Format standar XML Microsoft Visio (kompatibel penuh dengan Microsoft Visio 2003, 2007, 2010, 2013, 2016, 2019, 2021, dan Visio Plan 2 / Microsoft 365)
 */
export function exportToVisioVdx(
  title: string,
  nodes: Node[],
  edges: Edge[],
  pageConfig?: CanvasPageConfig,
  fileName?: string
): void {
  const escapeXml = (str: any): string => {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  // Tentukan ukuran lembar Visio (A4 standar: 8.267 x 11.692 inci)
  const isLandscape = pageConfig?.orientation === 'landscape';
  const pageWidthInches = isLandscape ? 11.692 : 8.267;
  const pageHeightInches = isLandscape ? 8.267 : 11.692;

  // Skala konversi pixel kanvas (96 DPI) ke inci Visio
  const DPI = 96;
  const scale = 1 / DPI;

  // Cari batas kanvas agar diagram terpusat di lembar Visio
  const xs = nodes.map((n) => n.position.x);
  const ys = nodes.map((n) => n.position.y);
  const minX = xs.length > 0 ? Math.min(...xs) : 0;
  const minY = ys.length > 0 ? Math.min(...ys) : 0;
  const maxX = xs.length > 0 ? Math.max(...xs) : 800;
  const maxY = ys.length > 0 ? Math.max(...ys) : 600;
  const diagramWidth = Math.max(maxX - minX + 200, 400);
  const diagramHeight = Math.max(maxY - minY + 200, 300);

  // XML Header & Document Properties
  let xml = `<?xml version="1.0" encoding="utf-8"?>\n`;
  xml += `<VisioDocument xmlns="http://schemas.microsoft.com/visio/2003/core" xmlns:vx="http://schemas.microsoft.com/visio/2003/core" xml:space="preserve">\n`;
  xml += `  <DocumentProperties>\n`;
  xml += `    <Title>${escapeXml(title)}</Title>\n`;
  xml += `    <Subject>Diagram dibuat dengan GALUR Studio</Subject>\n`;
  xml += `    <Creator>GALUR Diagram Builder (Bangkit Beruang Ecosystem)</Creator>\n`;
  xml += `    <Company>GALUR Studio</Company>\n`;
  xml += `    <TimeCreated>${new Date().toISOString()}</TimeCreated>\n`;
  xml += `  </DocumentProperties>\n`;

  // Colors Table
  xml += `  <Colors>\n`;
  xml += `    <ColorEntry IX="0" RGB="#000000" />\n`;
  xml += `    <ColorEntry IX="1" RGB="#FFFFFF" />\n`;
  xml += `    <ColorEntry IX="2" RGB="#0B4632" />\n`;
  xml += `    <ColorEntry IX="3" RGB="#2563EB" />\n`;
  xml += `    <ColorEntry IX="4" RGB="#10B981" />\n`;
  xml += `    <ColorEntry IX="5" RGB="#EF4444" />\n`;
  xml += `  </Colors>\n`;

  // Pages
  xml += `  <Pages>\n`;
  xml += `    <Page ID="0" Name="Page-1" ViewScale="1" ViewCenteringX="0" ViewCenteringY="0">\n`;
  xml += `      <PageSheet>\n`;
  xml += `        <PageProps>\n`;
  xml += `          <PageWidth Unit="IN">${pageWidthInches.toFixed(3)}</PageWidth>\n`;
  xml += `          <PageHeight Unit="IN">${pageHeightInches.toFixed(3)}</PageHeight>\n`;
  xml += `          <ShdType>0</ShdType>\n`;
  xml += `          <PageScale Unit="IN">1</PageScale>\n`;
  xml += `          <DrawingScale Unit="IN">1</DrawingScale>\n`;
  xml += `        </PageProps>\n`;
  xml += `      </PageSheet>\n`;
  xml += `      <Shapes>\n`;

  // Render Setiap Node sebagai Visio Shape
  nodes.forEach((n, idx) => {
    const shapeId = idx + 1;
    const d = (n.data || {}) as Record<string, any>;
    const widthPx: number = typeof d.width === 'number' ? d.width : (n.measured?.width || 160);
    const heightPx: number = typeof d.height === 'number' ? d.height : (n.measured?.height || 80);

    // Normalisasi posisi (titik tengah shape PinX, PinY dalam inci Visio)
    // Sumbu Y Visio bergerak dari bawah ke atas
    const pinXPx = n.position.x - minX + 50 + widthPx / 2;
    const pinYPx = diagramHeight - (n.position.y - minY + 50 + heightPx / 2);

    const pinXIn = (pinXPx * scale).toFixed(3);
    const pinYIn = (pinYPx * scale).toFixed(3);
    const widthIn = (widthPx * scale).toFixed(3);
    const heightIn = (heightPx * scale).toFixed(3);

    const labelText = escapeXml(d.label || d.title || `Bentuk ${shapeId}`);
    const sublabelText = d.sublabel ? escapeXml(`\n${d.sublabel}`) : '';
    const fullText = `${labelText}${sublabelText}`;

    const fillColor = (d.color as string) || '#F8FAFC';
    const borderColor = (d.borderColor as string) || '#2563EB';

    xml += `        <Shape ID="${shapeId}" Type="Shape" Name="${escapeXml(n.id)}">\n`;
    xml += `          <XForm>\n`;
    xml += `            <PinX Unit="IN">${pinXIn}</PinX>\n`;
    xml += `            <PinY Unit="IN">${pinYIn}</PinY>\n`;
    xml += `            <Width Unit="IN">${widthIn}</Width>\n`;
    xml += `            <Height Unit="IN">${heightIn}</Height>\n`;
    xml += `            <LocPinX Formula="Width*0.5" Unit="IN">${(widthPx * scale * 0.5).toFixed(3)}</LocPinX>\n`;
    xml += `            <LocPinY Formula="Height*0.5" Unit="IN">${(heightPx * scale * 0.5).toFixed(3)}</LocPinY>\n`;
    xml += `          </XForm>\n`;
    xml += `          <Line>\n`;
    xml += `            <LineWeight Unit="PT">1.5</LineWeight>\n`;
    xml += `            <LineColor>${borderColor}</LineColor>\n`;
    xml += `            <LinePattern>1</LinePattern>\n`;
    xml += `          </Line>\n`;
    xml += `          <Fill>\n`;
    xml += `            <FillForegnd>${fillColor}</FillForegnd>\n`;
    xml += `            <FillPattern>1</FillPattern>\n`;
    xml += `          </Fill>\n`;
    xml += `          <Char IX="0">\n`;
    xml += `            <Font>Arial</Font>\n`;
    xml += `            <Size Unit="PT">10</Size>\n`;
    xml += `            <Color>${(d.textColor as string) || '#0F172A'}</Color>\n`;
    xml += `          </Char>\n`;
    xml += `          <Para IX="0">\n`;
    xml += `            <HorzAlign>1</HorzAlign>\n`;
    xml += `          </Para>\n`;
    xml += `          <Text>${fullText}</Text>\n`;
    xml += `        </Shape>\n`;
  });

  // Render Setiap Edge sebagai Visio Dynamic Connector Shape
  const nodePositionMap = new Map<string, { x: number; y: number; w: number; h: number }>();
  nodes.forEach((n) => {
    const d = (n.data || {}) as Record<string, any>;
    const w: number = typeof d.width === 'number' ? d.width : (n.measured?.width || 160);
    const h: number = typeof d.height === 'number' ? d.height : (n.measured?.height || 80);
    nodePositionMap.set(n.id, {
      x: n.position.x - minX + 50,
      y: n.position.y - minY + 50,
      w,
      h,
    });
  });

  edges.forEach((e, edgeIdx) => {
    const connectorId = nodes.length + edgeIdx + 1;
    const src = nodePositionMap.get(e.source);
    const tgt = nodePositionMap.get(e.target);

    if (src && tgt) {
      const srcCenterX = src.x + src.w / 2;
      const srcCenterY = diagramHeight - (src.y + src.h / 2);
      const tgtCenterX = tgt.x + tgt.w / 2;
      const tgtCenterY = diagramHeight - (tgt.y + tgt.h / 2);

      const midX = ((srcCenterX + tgtCenterX) / 2 * scale).toFixed(3);
      const midY = ((srcCenterY + tgtCenterY) / 2 * scale).toFixed(3);
      const dx = ((tgtCenterX - srcCenterX) * scale).toFixed(3);
      const dy = ((tgtCenterY - srcCenterY) * scale).toFixed(3);

      const strokeColor = (e.style?.stroke as string) || '#2563EB';
      const edgeLabel = escapeXml(e.label || (e.data?.label as string) || '');

      xml += `        <Shape ID="${connectorId}" Type="Shape" Name="Dynamic connector ${connectorId}">\n`;
      xml += `          <XForm>\n`;
      xml += `            <PinX Unit="IN">${midX}</PinX>\n`;
      xml += `            <PinY Unit="IN">${midY}</PinY>\n`;
      xml += `            <Width Unit="IN">${Math.abs(parseFloat(dx)).toFixed(3)}</Width>\n`;
      xml += `            <Height Unit="IN">${Math.abs(parseFloat(dy)).toFixed(3)}</Height>\n`;
      xml += `          </XForm>\n`;
      xml += `          <Line>\n`;
      xml += `            <LineWeight Unit="PT">1.5</LineWeight>\n`;
      xml += `            <LineColor>${strokeColor}</LineColor>\n`;
      xml += `            <EndArrow>4</EndArrow>\n`; // Panah standar Visio
      xml += `          </Line>\n`;
      if (edgeLabel) {
        xml += `          <Text>${edgeLabel}</Text>\n`;
      }
      xml += `        </Shape>\n`;
    }
  });

  xml += `      </Shapes>\n`;
  xml += `    </Page>\n`;
  xml += `  </Pages>\n`;
  xml += `</VisioDocument>\n`;

  const outName = `${(fileName || title).toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.vdx`;
  triggerFileDownload(xml, outName, 'application/vnd.visio;charset=utf-8');
}

/**
 * 8. HELPER PRATINJAU: Ambil Snapshot Gambar Kanvas untuk Download & Print Preview
 */
export async function captureDiagramSnapshot(
  transparent = false,
  pixelRatio = 1.5
): Promise<string | null> {
  if (typeof document === 'undefined') return null;
  const element = document.querySelector('.react-flow__viewport') as HTMLElement;
  if (!element) return null;

  try {
    const dataUrl = await toPng(element, {
      backgroundColor: transparent ? undefined : '#ffffff',
      pixelRatio,
      filter: defaultExportFilter as any,
    });
    return dataUrl;
  } catch (err) {
    console.error('Gagal mengambil cuplikan pratinjau diagram:', err);
    return null;
  }
}

/**
 * 9. HELPER PRATINJAU: Hitung Dimensi Alami Kotak Diagram (Bounding Box)
 */
export function getDiagramDimensions(nodes: Node[]): {
  width: number;
  height: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} {
  if (!nodes || nodes.length === 0) {
    return { width: 1200, height: 800, minX: 0, minY: 0, maxX: 1200, maxY: 800 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach((n) => {
    const x = n.position.x;
    const y = n.position.y;
    const w = (n.measured?.width || (n as any).width || 160);
    const h = (n.measured?.height || (n as any).height || 80);
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x + w > maxX) maxX = x + w;
    if (y + h > maxY) maxY = y + h;
  });

  const width = Math.max(Math.round(maxX - minX + 120), 600);
  const height = Math.max(Math.round(maxY - minY + 120), 400);

  return { width, height, minX, minY, maxX, maxY };
}

/**
 * 10. HELPER PRATINJAU: Format Cuplikan Kode JSON untuk Preview
 */
export function generatePreviewJsonSnippet(
  title: string,
  nodes: Node[],
  edges: Edge[]
): string {
  const previewPayload = {
    appName: 'GALUR Studio',
    version: '1.3.0',
    title,
    summary: {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      exportedAt: new Date().toISOString(),
    },
    sampleNodes: nodes.slice(0, 3).map((n) => ({
      id: n.id,
      type: n.type,
      label: n.data?.label || '',
      position: n.position,
    })),
    sampleEdges: edges.slice(0, 3).map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label || '',
    })),
  };
  return JSON.stringify(previewPayload, null, 2);
}

/**
 * 11. HELPER PRATINJAU: Baris Contoh CSV untuk Preview
 */
export function generatePreviewCsvRows(
  nodes: Node[],
  edges: Edge[]
): Array<Record<string, string>> {
  return nodes.slice(0, 8).map((n) => {
    const d = (n.data || {}) as Record<string, any>;
    return {
      id: n.id,
      type: n.type || 'standard',
      label: d.label || d.title || n.id,
      sublabel: d.sublabel || '-',
      position: `X: ${Math.round(n.position.x)}, Y: ${Math.round(n.position.y)}`,
      category: d.category || 'umum',
    };
  });
}

