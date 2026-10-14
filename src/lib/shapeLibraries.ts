import { 
  Square, 
  GitFork, 
  PlayCircle, 
  FlipHorizontal, 
  FileText, 
  Table, 
  Hexagon, 
  CircleDot, 
  Database, 
  Cloud, 
  Network, 
  StickyNote, 
  Type, 
  Clock, 
  XCircle, 
  PlusCircle, 
  Tv, 
  ArrowRight, 
  ArrowLeft,
  ArrowUpDown,
  MoveRight,
  CornerDownRight,
  Shuffle, 
  Triangle, 
  Layers, 
  Code2, 
  Users, 
  Target, 
  Sparkles, 
  Fish, 
  LayoutTemplate, 
  HelpCircle, 
  Grid, 
  AlertTriangle,
  Laptop,
  Server,
  Shield,
  ShieldCheck,
  Smartphone,
  HardDrive,
  Cpu,
  Globe,
  Lock,
  Mail,
  FolderGit2,
  Boxes,
  CheckCircle2,
  Workflow
} from 'lucide-react';

export interface ShapeDefinition {
  id: string;
  type: string;
  label: string;
  title: string;
  icon: any;
  category: string;
  tags: string[];
  defaultData?: Record<string, any>;
}

export interface ShapeCategory {
  id: string;
  name: string;
  group: 'STANDAR' | 'PERANGKAT LUNAK' | 'BISNIS & INOVASI';
  description: string;
  defaultActive: boolean;
  shapes: ShapeDefinition[];
}

export const SHAPE_CATEGORIES: ShapeCategory[] = [
  // ==========================================
  // GRUP 1: STANDAR
  // ==========================================
  {
    id: 'papan_coret',
    name: 'Papan coret',
    group: 'STANDAR',
    description: 'Catatan tempel cepat, topik mind map, dan coretan ide.',
    defaultActive: true,
    shapes: [
      {
        id: 'scratch-sticky',
        type: 'stickynote',
        label: 'Catatan Ide',
        title: 'Catatan Tempel Kuning',
        icon: StickyNote,
        category: 'papan_coret',
        tags: ['sticky', 'note', 'memo', 'catatan', 'kuning'],
        defaultData: { label: 'Catatan Ide', color: '#fef08a', borderColor: '#eab308' },
      },
      {
        id: 'scratch-mindmap',
        type: 'mindmap',
        label: 'Topik Utama',
        title: 'Node Mind Map Interaktif (+ Cabang)',
        icon: Network,
        category: 'papan_coret',
        tags: ['mindmap', 'ide', 'cabang', 'brainstorm'],
        defaultData: { label: 'Topik Utama', color: '#ecfdf5', borderColor: '#10b981' },
      },
      {
        id: 'scratch-text',
        type: 'text',
        label: 'Label Teks',
        title: 'Teks Melayang Bebas',
        icon: Type,
        category: 'papan_coret',
        tags: ['text', 'teks', 'label', 'tulisan'],
        defaultData: { label: 'Label Teks' },
      },
    ],
  },
  {
    id: 'umum',
    name: 'Umum',
    group: 'STANDAR',
    description: 'Bentuk umum serbaguna untuk berbagai kebutuhan bagan dan diagram.',
    defaultActive: true,
    shapes: [
      {
        id: 'umum-process',
        type: 'process',
        label: 'Persegi',
        title: 'Persegi Panjang Standar',
        icon: Square,
        category: 'umum',
        tags: ['persegi', 'kotak', 'rectangle', 'box'],
      },
      {
        id: 'umum-oval',
        type: 'oval',
        label: 'Elips',
        title: 'Bentuk Elips / Bulat',
        icon: CircleDot,
        category: 'umum',
        tags: ['elips', 'bulat', 'circle', 'oval'],
      },
      {
        id: 'umum-diamond',
        type: 'decision',
        label: 'Belah Ketupat',
        title: 'Belah Ketupat / Keputusan',
        icon: GitFork,
        category: 'umum',
        tags: ['diamond', 'belah ketupat', 'decision'],
      },
      {
        id: 'umum-text',
        type: 'text',
        label: 'Teks Bebas',
        title: 'Teks Tanpa Border',
        icon: Type,
        category: 'umum',
        tags: ['teks', 'label', 'text', 'font'],
      },
      {
        id: 'umum-cloud',
        type: 'cloud',
        label: 'Awan',
        title: 'Bentuk Awan (Cloud)',
        icon: Cloud,
        category: 'umum',
        tags: ['cloud', 'awan', 'internet'],
      },
      {
        id: 'umum-sticky',
        type: 'stickynote',
        label: 'Catatan',
        title: 'Catatan Tempel',
        icon: StickyNote,
        category: 'umum',
        tags: ['catatan', 'sticky', 'note'],
      },
    ],
  },
  {
    id: 'dasar',
    name: 'Dasar',
    group: 'STANDAR',
    description: 'Bentuk geometris dasar yang presisi untuk arsitektur visual.',
    defaultActive: true,
    shapes: [
      {
        id: 'dasar-rect',
        type: 'process',
        label: 'Persegi',
        title: 'Persegi Panjang Dasar',
        icon: Square,
        category: 'dasar',
        tags: ['persegi', 'rectangle', 'dasar'],
      },
      {
        id: 'dasar-circle',
        type: 'oval',
        label: 'Lingkaran',
        title: 'Lingkaran / Oval',
        icon: CircleDot,
        category: 'dasar',
        tags: ['lingkaran', 'circle', 'bulat'],
      },
      {
        id: 'dasar-triangle',
        type: 'merge',
        label: 'Segitiga Bawah',
        title: 'Segitiga Terbalik (Merge)',
        icon: Triangle,
        category: 'dasar',
        tags: ['segitiga', 'triangle', 'bawah'],
      },
      {
        id: 'dasar-triangle-up',
        type: 'extract',
        label: 'Segitiga Atas',
        title: 'Segitiga Tegak (Extract)',
        icon: Triangle,
        category: 'dasar',
        tags: ['segitiga', 'triangle', 'atas'],
      },
      {
        id: 'dasar-hexagon',
        type: 'hexagon',
        label: 'Hexagon',
        title: 'Segi Enam (Hexagon)',
        icon: Hexagon,
        category: 'dasar',
        tags: ['hexagon', 'segi enam'],
      },
      {
        id: 'dasar-cylinder',
        type: 'database',
        label: 'Silinder',
        title: 'Tabung Silinder (Basis Data)',
        icon: Database,
        category: 'dasar',
        tags: ['silinder', 'cylinder', 'tabung', 'database'],
      },
      {
        id: 'dasar-terminal',
        type: 'terminal',
        label: 'Kapsul',
        title: 'Kapsul / Stadium',
        icon: PlayCircle,
        category: 'dasar',
        tags: ['kapsul', 'stadium', 'pill'],
      },
      {
        id: 'dasar-parallelogram',
        type: 'parallelogram',
        label: 'Jajar Genjang',
        title: 'Jajaran Genjang (Data I/O)',
        icon: FlipHorizontal,
        category: 'dasar',
        tags: ['jajar genjang', 'parallelogram'],
      },
    ],
  },
  {
    id: 'panah',
    name: 'Panah',
    group: 'STANDAR',
    description: 'Koleksi bentuk panah blok dan penunjuk arah alur.',
    defaultActive: true,
    shapes: [
      {
        id: 'panah-right',
        type: 'block_arrow',
        label: 'Panah Kanan',
        title: 'Panah Blok Arah Kanan',
        icon: ArrowRight,
        category: 'panah',
        tags: ['panah', 'arrow', 'kanan', 'right'],
        defaultData: { label: 'Alur Kanan', arrowDir: 'right' },
      },
      {
        id: 'panah-left',
        type: 'block_arrow',
        label: 'Panah Kiri',
        title: 'Panah Blok Arah Kiri',
        icon: ArrowLeft,
        category: 'panah',
        tags: ['panah', 'arrow', 'kiri', 'left'],
        defaultData: { label: 'Alur Kiri', arrowDir: 'left', rotation: 180 },
      },
      {
        id: 'panah-updown',
        type: 'block_arrow',
        label: 'Dua Arah',
        title: 'Panah Dua Arah',
        icon: ArrowUpDown,
        category: 'panah',
        tags: ['panah', 'arrow', 'dua arah', 'vertical'],
        defaultData: { label: 'Bolak Balik' },
      },
      {
        id: 'panah-corner',
        type: 'block_arrow',
        label: 'Panah Belok',
        title: 'Panah Sudut Belok',
        icon: CornerDownRight,
        category: 'panah',
        tags: ['panah', 'belok', 'corner', 'siku'],
      },
    ],
  },
  {
    id: 'diagram_alir',
    name: 'Diagram Alir',
    group: 'STANDAR',
    description: '21 Simbol flowchart lengkap standar ISO & ANSI untuk proses kerja.',
    defaultActive: true,
    shapes: [
      { type: 'process', id: 'fc-process', label: 'Proses', title: 'Proses (Rectangle)', icon: Square, category: 'diagram_alir', tags: ['proses', 'rectangle', 'langkah'] },
      { type: 'decision', id: 'fc-decision', label: 'Keputusan?', title: 'Keputusan (Diamond)', icon: GitFork, category: 'diagram_alir', tags: ['keputusan', 'decision', 'diamond', 'kondisi'] },
      { type: 'document', id: 'fc-document', label: 'Dokumen', title: 'Dokumen (Document)', icon: FileText, category: 'diagram_alir', tags: ['dokumen', 'laporan', 'file'] },
      { type: 'terminal', id: 'fc-terminal', label: 'Mulai / Selesai', title: 'Terminator (Stadium)', icon: PlayCircle, category: 'diagram_alir', tags: ['start', 'mulai', 'selesai', 'end', 'terminator'] },
      { type: 'parallelogram', id: 'fc-io', label: 'Data I/O', title: 'Data Input/Output (Parallelogram)', icon: FlipHorizontal, category: 'diagram_alir', tags: ['input', 'output', 'data', 'jajar genjang'] },
      { type: 'database', id: 'fc-db', label: 'Basis Data', title: 'Penyimpanan Data (Cylinder)', icon: Database, category: 'diagram_alir', tags: ['basis data', 'database', 'storage'] },
      { type: 'predefined', id: 'fc-subproc', label: 'Sub-Proses', title: 'Sub-Proses Terdefinisi (Garis Ganda)', icon: Table, category: 'diagram_alir', tags: ['subproses', 'fungsi', 'modul'] },
      { type: 'hexagon', id: 'fc-prep', label: 'Persiapan', title: 'Persiapan / Loop (Hexagon)', icon: Hexagon, category: 'diagram_alir', tags: ['persiapan', 'loop', 'inisialisasi'] },
      { type: 'delay', id: 'fc-delay', label: 'Delay', title: 'Penundaan (D-Shape)', icon: Clock, category: 'diagram_alir', tags: ['delay', 'tunda', 'antrian'] },
      { type: 'summing', id: 'fc-sum', label: '', title: 'Summing Junction (Lingkaran Silang X)', icon: XCircle, category: 'diagram_alir', tags: ['summing', 'junction', 'silang'] },
      { type: 'or_junction', id: 'fc-or', label: '', title: 'Or Junction (Lingkaran Plus +)', icon: PlusCircle, category: 'diagram_alir', tags: ['or', 'junction', 'plus'] },
      { type: 'connector', id: 'fc-conn', label: 'A', title: 'Konektor Bulat (On-Page)', icon: CircleDot, category: 'diagram_alir', tags: ['konektor', 'sambungan', 'halaman'] },
      { type: 'offpage', id: 'fc-offpage', label: 'Hal 2', title: 'Konektor Luar Halaman (Off-Page)', icon: Layers, category: 'diagram_alir', tags: ['offpage', 'luar halaman', 'pindah'] },
      { type: 'manual_input', id: 'fc-manual-in', label: 'Input Manual', title: 'Input Manual (Trapesium)', icon: FlipHorizontal, category: 'diagram_alir', tags: ['manual input', 'keyboard'] },
      { type: 'manual_op', id: 'fc-manual-op', label: 'Operasi Manual', title: 'Operasi Manual (Trapesium Terbalik)', icon: FlipHorizontal, category: 'diagram_alir', tags: ['manual operation', 'tangan'] },
      { type: 'merge', id: 'fc-merge', label: 'Gabung', title: 'Penggabungan / Merge (Segitiga Bawah)', icon: Triangle, category: 'diagram_alir', tags: ['merge', 'gabung'] },
      { type: 'extract', id: 'fc-extract', label: 'Ekstrak', title: 'Pemisahan / Extract (Segitiga Atas)', icon: Triangle, category: 'diagram_alir', tags: ['extract', 'pisah', 'cabang'] },
      { type: 'collate', id: 'fc-collate', label: 'Sortir', title: 'Sortir / Collate (Jam Pasir)', icon: Shuffle, category: 'diagram_alir', tags: ['collate', 'sortir'] },
      { type: 'display', id: 'fc-display', label: 'Layar', title: 'Tampilan Layar (Display)', icon: Tv, category: 'diagram_alir', tags: ['display', 'layar', 'monitor'] },
      { type: 'block_arrow', id: 'fc-arrow', label: 'Arah Alur', title: 'Panah Blok (Block Arrow)', icon: ArrowRight, category: 'diagram_alir', tags: ['panah', 'alur', 'flow'] },
      { 
        type: 'swimlane_group', 
        id: 'fc-swimlane', 
        label: 'Swimlane', 
        title: 'Wadah Swimlane (Alur Lintas Fungsi)', 
        icon: Layers, 
        category: 'diagram_alir', 
        tags: ['swimlane', 'kolam', 'lintas fungsi', 'departemen', 'sop', 'peran'],
        defaultData: {
          title: 'ALUR PROSES LINTAS FUNGSI',
          width: 1050,
          lanes: [
            { id: 'lane-1', name: 'Pelanggan', color: '#0284c7', height: 160 },
            { id: 'lane-2', name: 'Operasional', color: '#0d9488', height: 160 },
            { id: 'lane-3', name: 'Manajemen', color: '#4f46e5', height: 160 },
          ],
        }
      },
      { 
        type: 'process_legend', 
        id: 'fc-legend', 
        label: 'Legenda Alur', 
        title: 'Kartu Legenda Alur Proses', 
        icon: Workflow, 
        category: 'diagram_alir', 
        tags: ['legenda', 'legend', 'keterangan', 'warna', 'peran'],
        defaultData: {
          title: 'Process flow shapes',
          items: [
            { label: 'Pelanggan', color: '#0284c7' },
            { label: 'Operasional', color: '#0d9488' },
            { label: 'Manajemen', color: '#4f46e5' },
          ],
        }
      },
    ],
  },
  {
    id: 'clipart',
    name: 'Clipart',
    group: 'STANDAR',
    description: 'Ikon visual perangkat keras, infrastruktur IT, dan simbol status teknis.',
    defaultActive: false,
    shapes: [
      {
        id: 'clip-server',
        type: 'database',
        label: 'Server Pusat',
        title: 'Server Basis Data Utama',
        icon: Server,
        category: 'clipart',
        tags: ['server', 'rack', 'infrastruktur', 'host'],
        defaultData: { label: 'Server Pusat', color: '#f1f5f9', borderColor: '#475569' },
      },
      {
        id: 'clip-laptop',
        type: 'process',
        label: 'Klien Laptop',
        title: 'Perangkat Pengguna (Laptop)',
        icon: Laptop,
        category: 'clipart',
        tags: ['laptop', 'klien', 'client', 'pc', 'komputer'],
        defaultData: { label: 'Klien Laptop', color: '#f0f9ff', borderColor: '#0284c7' },
      },
      {
        id: 'clip-phone',
        type: 'process',
        label: 'Aplikasi Ponsel',
        title: 'Aplikasi Mobile / Smartphone',
        icon: Smartphone,
        category: 'clipart',
        tags: ['hp', 'mobile', 'android', 'ios', 'smartphone'],
        defaultData: { label: 'Aplikasi Ponsel', color: '#ecfdf5', borderColor: '#059669' },
      },
      {
        id: 'clip-firewall',
        type: 'process',
        label: 'Firewall Keamanan',
        title: 'Firewall & Proteksi Jaringan',
        icon: ShieldCheck,
        category: 'clipart',
        tags: ['firewall', 'security', 'keamanan', 'shield'],
        defaultData: { label: 'Firewall', color: '#fef2f2', borderColor: '#ef4444' },
      },
      {
        id: 'clip-cloud-gw',
        type: 'cloud',
        label: 'Cloud Gateway',
        title: 'Gerbang API & Layanan Cloud',
        icon: Cloud,
        category: 'clipart',
        tags: ['cloud', 'gateway', 'api', 'internet'],
        defaultData: { label: 'Cloud Gateway', color: '#f0fdf4', borderColor: '#22c55e' },
      },
      {
        id: 'clip-user',
        type: 'org_node',
        label: 'Pengguna / Operator',
        title: 'Aktor Pengguna Sistem',
        icon: Users,
        category: 'clipart',
        tags: ['user', 'pengguna', 'aktor', 'operator', 'admin'],
        defaultData: { name: 'Operator Sistem', role: 'Pengguna Akhir' },
      },
    ],
  },

  // ==========================================
  // GRUP 2: PERANGKAT LUNAK & REKAYASA
  // ==========================================
  {
    id: 'relasi_entitas',
    name: 'Relasi Entitas',
    group: 'PERANGKAT LUNAK',
    description: 'Entitas database relasional (ERD) lengkap dengan editor atribut PK, FK, & tipe data.',
    defaultActive: true,
    shapes: [
      {
        id: 'erd-table',
        type: 'erd_entity',
        label: 'tabel_data',
        title: 'Tabel Entitas ERD Multi-Kolom',
        icon: Database,
        category: 'relasi_entitas',
        tags: ['erd', 'tabel', 'entity', 'database', 'relasi', 'pk', 'fk'],
        defaultData: {
          tableName: 'tabel_data',
          fields: [
            { name: 'id', type: 'BIGINT', isPK: true },
            { name: 'kode_unik', type: 'VARCHAR(50)' },
            { name: 'keterangan', type: 'TEXT' },
          ],
        },
      },
      {
        id: 'erd-users',
        type: 'erd_entity',
        label: 'tabel_pengguna',
        title: 'Tabel Master Akun Pengguna',
        icon: Users,
        category: 'relasi_entitas',
        tags: ['user', 'akun', 'tabel', 'erd'],
        defaultData: {
          tableName: 'pengguna',
          headerBg: '#0f766e',
          fields: [
            { name: 'id_user', type: 'UUID', isPK: true },
            { name: 'email', type: 'VARCHAR(255)' },
            { name: 'peran', type: 'VARCHAR(50)' },
          ],
        },
      },
      {
        id: 'erd-transaction',
        type: 'erd_entity',
        label: 'tabel_transaksi',
        title: 'Tabel Transaksi dengan Relasi FK',
        icon: Table,
        category: 'relasi_entitas',
        tags: ['transaksi', 'fk', 'erd', 'relasi'],
        defaultData: {
          tableName: 'transaksi',
          headerBg: '#1e3a8a',
          fields: [
            { name: 'id_transaksi', type: 'BIGINT', isPK: true },
            { name: 'user_id', type: 'UUID', isFK: true },
            { name: 'total_biaya', type: 'DECIMAL(12,2)' },
          ],
        },
      },
    ],
  },
  {
    id: 'uml',
    name: 'UML',
    group: 'PERANGKAT LUNAK',
    description: 'Kelas berorientasi objek (OOP), atribut, metode, antarmuka, dan paket.',
    defaultActive: true,
    shapes: [
      {
        id: 'uml-class',
        type: 'uml_class',
        label: 'KelasUML',
        title: 'UML Class Diagram (Atribut & Metode)',
        icon: Code2,
        category: 'uml',
        tags: ['uml', 'class', 'oop', 'metode', 'atribut'],
        defaultData: {
          className: 'ManajerSistem',
          attributes: ['- id: string', '- status: boolean'],
          methods: ['+ inisialisasi(): void', '+ prosesData(): boolean'],
        },
      },
      {
        id: 'uml-service',
        type: 'uml_class',
        label: 'LayananAPI',
        title: 'UML Service / Controller',
        icon: Workflow,
        category: 'uml',
        tags: ['uml', 'service', 'controller', 'api'],
        defaultData: {
          className: 'LayananData',
          attributes: ['- dbClient: Database', '- logger: Logger'],
          methods: ['+ ambilSemua(): Data[]', '+ simpan(d: Data): void'],
        },
      },
      {
        id: 'uml-org',
        type: 'org_node',
        label: 'Aktor / Peran',
        title: 'Aktor Sistem atau Bagan Organisasi',
        icon: Users,
        category: 'uml',
        tags: ['aktor', 'peran', 'org', 'bagan'],
        defaultData: {
          name: 'Arsitek Sistem',
          role: 'Perancang Solusi Teknis',
          dept: 'Teknologi Informasi',
        },
      },
    ],
  },
  {
    id: 'cloud_network',
    name: 'Jaringan & Cloud',
    group: 'PERANGKAT LUNAK',
    description: 'Arsitektur jaringan, topologi server, microservices, dan infrastruktur cloud.',
    defaultActive: false,
    shapes: [
      {
        id: 'cn-server',
        type: 'database',
        label: 'Server Aplikasi',
        title: 'Server Compute Node',
        icon: Cpu,
        category: 'cloud_network',
        tags: ['server', 'compute', 'vm', 'vps'],
        defaultData: { label: 'Node Server', color: '#f8fafc', borderColor: '#334155' },
      },
      {
        id: 'cn-cloud',
        type: 'cloud',
        label: 'VPC Cloud',
        title: 'Virtual Private Cloud',
        icon: Cloud,
        category: 'cloud_network',
        tags: ['vpc', 'cloud', 'aws', 'gcp', 'azure'],
        defaultData: { label: 'VPC Jaringan', color: '#eff6ff', borderColor: '#3b82f6' },
      },
      {
        id: 'cn-db',
        type: 'database',
        label: 'Cluster DB',
        title: 'Klaster Database Terdistribusi',
        icon: HardDrive,
        category: 'cloud_network',
        tags: ['cluster', 'database', 'sql', 'nosql'],
        defaultData: { label: 'Klaster DB', color: '#f0fdf4', borderColor: '#16a34a' },
      },
      {
        id: 'cn-security',
        type: 'process',
        label: 'API Gateway',
        title: 'API Gateway & Reverse Proxy',
        icon: Lock,
        category: 'cloud_network',
        tags: ['gateway', 'proxy', 'auth', 'keamanan'],
        defaultData: { label: 'API Gateway', color: '#fff7ed', borderColor: '#ea580c' },
      },
    ],
  },

  // ==========================================
  // GRUP 3: BISNIS & INOVASI
  // ==========================================
  {
    id: 'problem_solving',
    name: 'Problem Solving & Inovasi',
    group: 'BISNIS & INOVASI',
    description: 'Kerangka analisis masalah Fishbone Ishikawa 6M, 5-Whys, dan Kanvas Inovasi.',
    defaultActive: true,
    shapes: [
      {
        id: 'ps-fishbone-head',
        type: 'fishbone_head',
        label: 'Masalah Utama',
        title: 'Kepala Fishbone (Akibat / Efek Utama 6M)',
        icon: Fish,
        category: 'problem_solving',
        tags: ['fishbone', 'ishikawa', 'masalah', 'kepala', 'akibat', '6m'],
        defaultData: { label: 'Masalah Utama', sublabel: 'Akibat yang dianalisis' },
      },
      {
        id: 'ps-fishbone-cat',
        type: 'fishbone_category',
        label: 'Kategori 6M',
        title: 'Cabang Tulang Fishbone (Man, Mesin, Metode, Material, Lingkungan, Pengukuran)',
        icon: GitFork,
        category: 'problem_solving',
        tags: ['fishbone', 'cabang', 'tulang', 'kategori', '6m'],
        defaultData: { label: 'Man (Manusia)', sublabel: 'Penyebab Faktor Manusia' },
      },
      {
        id: 'ps-why-step',
        type: 'why_step',
        label: 'Langkah Mengapa?',
        title: 'Langkah Rantai Kausalitas 5-Whys',
        icon: HelpCircle,
        category: 'problem_solving',
        tags: ['5 whys', 'mengapa', 'akar masalah', 'root cause'],
        defaultData: { stepNumber: 1, whyQuestion: 'Mengapa masalah ini terjadi?', answer: 'Jawaban analisis penyebab' },
      },
      {
        id: 'ps-canvas-block',
        type: 'canvas_block',
        label: 'Blok Kanvas Inovasi',
        title: 'Blok Modular Kanvas BMC / Lean / VPC',
        icon: LayoutTemplate,
        category: 'problem_solving',
        tags: ['kanvas', 'lean', 'bmc', 'vpc', 'blok', 'bisnis'],
        defaultData: {
          title: 'Problem / Masalah',
          badge: 'Tantangan Utama',
          bulletPoints: ['Masalah 1', 'Masalah 2'],
          accentColor: '#be123c',
        },
      },
      {
        id: 'ps-priority-card',
        type: 'priority_card',
        label: 'Kuadran Prioritas',
        title: 'Kartu Matriks Eisenhower & Dampak-Usaha',
        icon: Grid,
        category: 'problem_solving',
        tags: ['prioritas', 'eisenhower', 'impact', 'effort', 'dampak', 'usaha'],
        defaultData: {
          quadrantTitle: 'Lakukan Sekarang',
          quadrantTag: 'Mendesak & Penting',
          items: ['Tugas 1', 'Tugas 2'],
          accentColor: '#10b981',
        },
      },
      {
        id: 'ps-swot-card',
        type: 'swot_card',
        label: 'Kartu Analisis SWOT',
        title: 'Kuadran Analisis SWOT (Strengths / Weaknesses / Opportunities / Threats)',
        icon: Target,
        category: 'problem_solving',
        tags: ['swot', 'kekuatan', 'kelemahan', 'peluang', 'ancaman'],
        defaultData: {
          category: 'strengths',
          title: 'Strengths (Kekuatan)',
          items: ['Kelebihan utama tim', 'Keunggulan sistem'],
        },
      },
    ],
  },
];

export const DEFAULT_ACTIVE_CATEGORY_IDS = [
  'papan_coret',
  'umum',
  'dasar',
  'panah',
  'diagram_alir',
  'relasi_entitas',
  'uml',
  'problem_solving',
];

const LOCAL_STORAGE_ACTIVE_LIBRARIES_KEY = 'galur_active_shape_libraries';

export function getSavedActiveCategories(): string[] {
  if (typeof window === 'undefined') return DEFAULT_ACTIVE_CATEGORY_IDS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ACTIVE_LIBRARIES_KEY);
    if (!raw) return DEFAULT_ACTIVE_CATEGORY_IDS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (err) {
    console.error('Failed to read active shape libraries from localStorage:', err);
  }
  return DEFAULT_ACTIVE_CATEGORY_IDS;
}

export function saveActiveCategories(categoryIds: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_ACTIVE_LIBRARIES_KEY, JSON.stringify(categoryIds));
  } catch (err) {
    console.error('Failed to save active shape libraries to localStorage:', err);
  }
}
