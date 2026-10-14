/**
 * GALUR Application Version & Changelog Information
 * Single source of truth untuk informasi versi aplikasi GALUR.
 */

export const APP_VERSION = 'v1.3.0';
export const APP_VERSION_NUMBER = '1.3.0';
export const APP_VERSION_CODENAME = 'Macan Tutul Jawa';
export const APP_RELEASE_DATE = '14 Oktober 2026';
export const APP_LOGO_URL = '/logo-v2.png';

export interface VersionLog {
  version: string;
  date: string;
  title: string;
  badge?: string;
  highlights: string[];
}

export const APP_CHANGELOG: VersionLog[] = [
  {
    version: 'v1.3.0',
    date: '14 Oktober 2026',
    title: 'Template Pemecahan Masalah, Kanvas A4 & Presisi Arah Garis Alur',
    badge: 'Terbaru',
    highlights: [
      'Presisi arah panah konektor cerdas: panah selalu mengarah presisi ke node tujuan saat ditarik dari titik awal.',
      'Template pemecahan masalah & inovasi: Fishbone Ishikawa 6M, Lean Canvas, Value Proposition, 5-Whys, Eisenhower & Impact-Effort Matrix di menu Diagram Baru.',
      'Kanvas A4 dengan ekspansi dinamis dan menu pengaturan presisi.',
      'Footer memanjang responsif yang rapi dan ramping dengan logo terkini.',
    ],
  },
  {
    version: 'v1.2.0',
    date: '14 Oktober 2026',
    title: 'Kustomisasi 3 Siku Garis & Inspektor Properti Bentuk Lengkap',
    highlights: [
      'Kustomisasi posisi 3 siku garis bebas: geser horizontal (↔ X) dan vertikal (↕ Y) dengan drag langsung & stepper kapsul.',
      'Inspektor Properti Bentuk detail: Tipografi (Font, Ukuran, Bold, Italic, Underline, Rata Teks), Ukuran Bentuk (W x H), Border, Radius, Bayangan, Opasitas, dan Rotasi.',
      'Double-click inline text editing langsung pada objek bentuk di kanvas.',
      'Integrasi identitas maskot Macan Tutul Jawa (Panthera pardus melas) - Bangkit Beruang.',
    ],
  },
  {
    version: 'v1.1.0',
    date: 'Oktober 2026',
    title: 'Dukungan Diagram Spesialis & Mode Cetak Bersih',
    highlights: [
      'Bentuk spesialis terintegrasi: Kelas UML, Entitas ERD (editor atribut multi-kolom), Bagan Organisasi, dan SWOT Analysis.',
      'Pembersihan cetak & ekspor dokumen (bebas tombol kontrol yang mengganggu).',
      'Penyimpanan riwayat lokal otomatis & integrasi template.',
    ],
  },
  {
    version: 'v1.0.0',
    date: 'Oktober 2026',
    title: 'Peluncuran Perdana GALUR Diagram Studio',
    highlights: [
      'Kanvas flowchart interaktif berbasis React Flow berkinerja tinggi.',
      'Koleksi bentuk flowchart standar (Proses, Keputusan, Data, Terminal, Dokumen, dll.).',
      'Konektor ortogonal cerdas (Smoothstep / Step) dengan tombol hapus cepat.',
      'Ekspor diagram ke format PNG dan SVG beresolusi tinggi.',
    ],
  },
];
