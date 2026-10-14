import { Node, Edge, MarkerType } from '@xyflow/react';

export interface CategoryTemplate {
  id: string;
  name: string; // Sesuai persis dengan Gambar 3
  description: string;
  iconName: string;
  accentColor: string;
  badge: string;
  nodes: Node[];
  edges: Edge[];
}

export const SPECIALIST_CATEGORIES: CategoryTemplate[] = [
  // 1. UML
  {
    id: 'uml',
    name: 'UML',
    description: 'Diagram Kelas (Class Diagram), Use Case, dan Relasi Objek Berorientasi Objek.',
    iconName: 'Code2',
    accentColor: '#3b82f6',
    badge: 'Software Engineering',
    nodes: [
      {
        id: 'uml-1',
        type: 'uml_class',
        position: { x: 100, y: 100 },
        data: {
          className: 'Pengguna',
          stereotype: '<<Entity>>',
          attributes: ['- id: UUID', '- nama: String', '- email: String', '- kataSandiHash: String'],
          methods: ['+ verifikasiLogin(): Boolean', '+ ubahProfil(data): Void', '+ getHakAkses(): Array'],
          color: '#ffffff',
          borderColor: '#2563eb',
          headerColor: '#1d4ed8',
        },
      },
      {
        id: 'uml-2',
        type: 'uml_class',
        position: { x: 440, y: 100 },
        data: {
          className: 'SesiAutentikasi',
          stereotype: '<<Service>>',
          attributes: ['- tokenSesi: String', '- batasKedaluwarsa: Date', '- ipAddress: String'],
          methods: ['+ buatToken(): String', '+ validasiToken(): Boolean', '+ hancurkanSesi(): Void'],
          color: '#ffffff',
          borderColor: '#059669',
          headerColor: '#047857',
        },
      },
      {
        id: 'uml-3',
        type: 'uml_class',
        position: { x: 260, y: 380 },
        data: {
          className: 'LogAktivitas',
          stereotype: '<<Audit>>',
          attributes: ['- logId: BigInt', '- aksi: String', '- waktu: Timestamp'],
          methods: ['+ rekamLog(): Void', '+ eksporLaporan(): File'],
          color: '#ffffff',
          borderColor: '#7c3aed',
          headerColor: '#6d28d9',
        },
      },
    ],
    edges: [
      {
        id: 'edge-uml-1',
        source: 'uml-1',
        target: 'uml-2',
        type: 'smoothstep',
        label: '1 .. * mengelola',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#2563eb' },
        style: { stroke: '#2563eb', strokeWidth: 2 },
      },
      {
        id: 'edge-uml-2',
        source: 'uml-1',
        target: 'uml-3',
        type: 'smoothstep',
        label: 'mencatat ke',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#7c3aed' },
        style: { stroke: '#7c3aed', strokeWidth: 2, strokeDasharray: '4,4' },
      },
    ],
  },

  // 2. Diagram ER
  {
    id: 'erd',
    name: 'Diagram ER',
    description: 'Entity-Relationship Diagram untuk perancangan skema basis data relasional (RDBMS/PostgreSQL).',
    iconName: 'Database',
    accentColor: '#059669',
    badge: 'Database Design',
    nodes: [
      {
        id: 'erd-users',
        type: 'erd_entity',
        position: { x: 100, y: 120 },
        data: {
          tableName: 'users',
          fields: [
            { name: 'id', type: 'UUID', isPK: true },
            { name: 'nama_lengkap', type: 'VARCHAR(100)' },
            { name: 'email', type: 'VARCHAR(255) UNIQUE' },
            { name: 'created_at', type: 'TIMESTAMP' },
          ],
          headerBg: '#0b4632',
        },
      },
      {
        id: 'erd-orders',
        type: 'erd_entity',
        position: { x: 450, y: 120 },
        data: {
          tableName: 'orders',
          fields: [
            { name: 'id', type: 'BIGSERIAL', isPK: true },
            { name: 'user_id', type: 'UUID', isFK: true },
            { name: 'total_harga', type: 'NUMERIC(15,2)' },
            { name: 'status', type: 'VARCHAR(50)' },
            { name: 'tanggal_pesan', type: 'TIMESTAMP' },
          ],
          headerBg: '#1e3a8a',
        },
      },
      {
        id: 'erd-order-items',
        type: 'erd_entity',
        position: { x: 450, y: 390 },
        data: {
          tableName: 'order_items',
          fields: [
            { name: 'id', type: 'BIGSERIAL', isPK: true },
            { name: 'order_id', type: 'BIGINT', isFK: true },
            { name: 'produk_id', type: 'VARCHAR(64)', isFK: true },
            { name: 'jumlah', type: 'INT' },
            { name: 'subtotal', type: 'NUMERIC(15,2)' },
          ],
          headerBg: '#831843',
        },
      },
    ],
    edges: [
      {
        id: 'edge-erd-1',
        source: 'erd-users',
        target: 'erd-orders',
        type: 'smoothstep',
        label: '1 ke Banyak (1:N)',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#059669' },
        style: { stroke: '#059669', strokeWidth: 2 },
      },
      {
        id: 'edge-erd-2',
        source: 'erd-orders',
        target: 'erd-order-items',
        type: 'smoothstep',
        label: '1 ke Banyak (1:N)',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#1e3a8a' },
        style: { stroke: '#1e3a8a', strokeWidth: 2 },
      },
    ],
  },

  // 3. Bagan Organisasi
  {
    id: 'org',
    name: 'Bagan Organisasi',
    description: 'Hierarki kepemimpinan perusahaan, pembagian departemen, dan rantai komando.',
    iconName: 'Users',
    accentColor: '#d97706',
    badge: 'Manajemen & SDM',
    nodes: [
      {
        id: 'org-1',
        type: 'org_node',
        position: { x: 340, y: 60 },
        data: {
          name: 'Raden Arya Permana',
          role: 'Direktur Utama (CEO)',
          dept: 'Dewan Eksekutif',
          avatarBg: '#0b4632',
          badgeColor: '#f59e0b',
        },
      },
      {
        id: 'org-2',
        type: 'org_node',
        position: { x: 120, y: 220 },
        data: {
          name: 'Citra Dewi Lestari',
          role: 'Direktur Teknologi (CTO)',
          dept: 'Teknologi & Produk',
          avatarBg: '#1e3a8a',
          badgeColor: '#3b82f6',
        },
      },
      {
        id: 'org-3',
        type: 'org_node',
        position: { x: 560, y: 220 },
        data: {
          name: 'Dimas Wicaksono',
          role: 'Direktur Operasional (COO)',
          dept: 'Operasional & Bisnis',
          avatarBg: '#065f46',
          badgeColor: '#10b981',
        },
      },
      {
        id: 'org-4',
        type: 'org_node',
        position: { x: 20, y: 390 },
        data: {
          name: 'Fajar Nugraha',
          role: 'Lead Full-Stack Eng.',
          dept: 'Tim Rekayasa Perangkat Lunak',
          avatarBg: '#374151',
          badgeColor: '#6b7280',
        },
      },
      {
        id: 'org-5',
        type: 'org_node',
        position: { x: 230, y: 390 },
        data: {
          name: 'Anisa Safitri',
          role: 'Lead UI/UX Designer',
          dept: 'Desain Produk & Riset',
          avatarBg: '#701a75',
          badgeColor: '#ec4899',
        },
      },
    ],
    edges: [
      {
        id: 'edge-org-1',
        source: 'org-1',
        target: 'org-2',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' },
        style: { stroke: '#475569', strokeWidth: 2 },
      },
      {
        id: 'edge-org-2',
        source: 'org-1',
        target: 'org-3',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' },
        style: { stroke: '#475569', strokeWidth: 2 },
      },
      {
        id: 'edge-org-3',
        source: 'org-2',
        target: 'org-4',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        style: { stroke: '#3b82f6', strokeWidth: 2 },
      },
      {
        id: 'edge-org-4',
        source: 'org-2',
        target: 'org-5',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ec4899' },
        style: { stroke: '#ec4899', strokeWidth: 2 },
      },
    ],
  },

  // 4. Diagram Alir
  {
    id: 'flowchart',
    name: 'Diagram Alir',
    description: 'Alur proses standar Microsoft Visio dengan bentuk geometri lengkap untuk analisis logika & prosedur.',
    iconName: 'GitFork',
    accentColor: '#2563eb',
    badge: 'Prosedur & Algoritma',
    nodes: [
      {
        id: 'flow-start',
        type: 'terminal',
        position: { x: 280, y: 60 },
        data: { label: 'Mulai Pengajuan Cuti', color: '#ecfdf5', borderColor: '#10b981', textColor: '#065f46' },
      },
      {
        id: 'flow-input',
        type: 'parallelogram',
        position: { x: 260, y: 170 },
        data: { label: 'Isi Formulir Cuti', color: '#eff6ff', borderColor: '#3b82f6', textColor: '#1e3a8a' },
      },
      {
        id: 'flow-decision',
        type: 'decision',
        position: { x: 280, y: 280 },
        data: { label: 'Disetujui Manajer?', color: '#fffbeb', borderColor: '#f59e0b', textColor: '#78350f' },
      },
      {
        id: 'flow-process-ok',
        type: 'process',
        position: { x: 490, y: 290 },
        data: { label: 'Catat Kuota Cuti di HRIS', color: '#ecfdf5', borderColor: '#059669', textColor: '#065f46' },
      },
      {
        id: 'flow-finish',
        type: 'terminal',
        position: { x: 280, y: 440 },
        data: { label: 'Proses Selesai', color: '#fef2f2', borderColor: '#ef4444', textColor: '#991b1b' },
      },
    ],
    edges: [
      {
        id: 'e-fl-1',
        source: 'flow-start',
        target: 'flow-input',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        style: { stroke: '#3b82f6', strokeWidth: 2 },
      },
      {
        id: 'e-fl-2',
        source: 'flow-input',
        target: 'flow-decision',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        style: { stroke: '#3b82f6', strokeWidth: 2 },
      },
      {
        id: 'e-fl-3',
        source: 'flow-decision',
        target: 'flow-process-ok',
        type: 'smoothstep',
        label: 'Ya',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#059669' },
        style: { stroke: '#059669', strokeWidth: 2 },
      },
      {
        id: 'e-fl-4',
        source: 'flow-decision',
        target: 'flow-finish',
        type: 'smoothstep',
        label: 'Tidak',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
        style: { stroke: '#ef4444', strokeWidth: 2 },
      },
      {
        id: 'e-fl-5',
        source: 'flow-process-ok',
        target: 'flow-finish',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#059669' },
        style: { stroke: '#059669', strokeWidth: 2 },
      },
    ],
  },

  // 5. Pembuat Denah Lantai
  {
    id: 'floorplan',
    name: 'Pembuat Denah Lantai',
    description: 'Tata letak ruangan, meja kerja kantor, ruang rapat, server room, dan koridor pintu.',
    iconName: 'LayoutGrid',
    accentColor: '#4f46e5',
    badge: 'Arsitektur & Ruangan',
    nodes: [
      {
        id: 'fp-1',
        type: 'process',
        position: { x: 100, y: 100 },
        data: { label: 'Ruang Rapat Utama (10 Orang)', sublabel: 'Proyektor + Whiteboard', color: '#f8fafc', borderColor: '#64748b' },
      },
      {
        id: 'fp-2',
        type: 'process',
        position: { x: 340, y: 100 },
        data: { label: 'Open Workspace Engineering', sublabel: '16 Meja Ergonomis', color: '#f0fdf4', borderColor: '#22c55e' },
      },
      {
        id: 'fp-3',
        type: 'process',
        position: { x: 100, y: 270 },
        data: { label: 'Lobi & Resepsionis', sublabel: 'Pintu Masuk Elektronik', color: '#fffbeb', borderColor: '#f59e0b' },
      },
      {
        id: 'fp-4',
        type: 'process',
        position: { x: 340, y: 270 },
        data: { label: 'Ruang Server & Rak Jaringan', sublabel: 'AC Presisi 18°C + UPS', color: '#eff6ff', borderColor: '#3b82f6' },
      },
    ],
    edges: [
      {
        id: 'e-fp-1',
        source: 'fp-3',
        target: 'fp-1',
        type: 'straight',
        label: 'Akses Koridor',
        style: { stroke: '#94a3b8', strokeWidth: 3, strokeDasharray: '4,4' },
      },
      {
        id: 'e-fp-2',
        source: 'fp-3',
        target: 'fp-2',
        type: 'straight',
        label: 'Akses Pintu',
        style: { stroke: '#94a3b8', strokeWidth: 3, strokeDasharray: '4,4' },
      },
    ],
  },

  // 6. Diagram Jaringan
  {
    id: 'network',
    name: 'Diagram Jaringan',
    description: 'Topologi infrastruktur jaringan, firewall, load balancer, cluster server, dan subnetting.',
    iconName: 'Network',
    accentColor: '#0284c7',
    badge: 'Infrastruktur TI',
    nodes: [
      {
        id: 'net-cloud',
        type: 'cloud',
        position: { x: 80, y: 180 },
        data: { label: 'Internet Publik', sublabel: 'DNS Cloudflare', color: '#f0f9ff', borderColor: '#0284c7' },
      },
      {
        id: 'net-firewall',
        type: 'process',
        position: { x: 270, y: 180 },
        data: { label: 'Hardware Firewall / WAF', sublabel: 'Filtering Serangan DDoS', color: '#fef2f2', borderColor: '#ef4444' },
      },
      {
        id: 'net-lb',
        type: 'process',
        position: { x: 470, y: 180 },
        data: { label: 'Load Balancer (Nginx)', sublabel: 'Round-Robin SSL Offload', color: '#fefce8', borderColor: '#eab308' },
      },
      {
        id: 'net-srv1',
        type: 'process',
        position: { x: 690, y: 100 },
        data: { label: 'Web Server Node 01', sublabel: '192.168.10.11', color: '#ecfdf5', borderColor: '#10b981' },
      },
      {
        id: 'net-srv2',
        type: 'process',
        position: { x: 690, y: 260 },
        data: { label: 'Web Server Node 02', sublabel: '192.168.10.12', color: '#ecfdf5', borderColor: '#10b981' },
      },
      {
        id: 'net-db',
        type: 'database',
        position: { x: 910, y: 180 },
        data: { label: 'PostgreSQL DB Primary', sublabel: 'Cluster Multi-AZ RLS', color: '#eff6ff', borderColor: '#2563eb' },
      },
    ],
    edges: [
      {
        id: 'e-net-1',
        source: 'net-cloud',
        target: 'net-firewall',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#0284c7' },
        style: { stroke: '#0284c7', strokeWidth: 2 },
      },
      {
        id: 'e-net-2',
        source: 'net-firewall',
        target: 'net-lb',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
        style: { stroke: '#ef4444', strokeWidth: 2 },
      },
      {
        id: 'e-net-3',
        source: 'net-lb',
        target: 'net-srv1',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
        style: { stroke: '#10b981', strokeWidth: 2 },
      },
      {
        id: 'e-net-4',
        source: 'net-lb',
        target: 'net-srv2',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
        style: { stroke: '#10b981', strokeWidth: 2 },
      },
      {
        id: 'e-net-5',
        source: 'net-srv1',
        target: 'net-db',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#2563eb' },
        style: { stroke: '#2563eb', strokeWidth: 2 },
      },
      {
        id: 'e-net-6',
        source: 'net-srv2',
        target: 'net-db',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#2563eb' },
        style: { stroke: '#2563eb', strokeWidth: 2 },
      },
    ],
  },

  // 7. Diagram Rak
  {
    id: 'rack',
    name: 'Diagram Rak',
    description: 'Susunan unit server (1U, 2U, 4U), patch panel kabel, dan saklar data center pada rak 42U.',
    iconName: 'Server',
    accentColor: '#334155',
    badge: 'Data Center & Hardware',
    nodes: [
      {
        id: 'rack-cab',
        type: 'process',
        position: { x: 180, y: 60 },
        data: { label: 'Kabinet Rak 42U - Baris A01', sublabel: 'Server Rack Standard 19 Inci', color: '#f8fafc', borderColor: '#0f172a' },
      },
      {
        id: 'rack-sw',
        type: 'process',
        position: { x: 200, y: 160 },
        data: { label: '[40U-41U] Switch Core 48-Port 10GbE', sublabel: 'Cisco Nexus', color: '#eff6ff', borderColor: '#3b82f6' },
      },
      {
        id: 'rack-app1',
        type: 'process',
        position: { x: 200, y: 250 },
        data: { label: '[38U-39U] Server Komputasi 2U Node #1', sublabel: 'Dell PowerEdge 64-Core 256GB', color: '#f0fdf4', borderColor: '#22c55e' },
      },
      {
        id: 'rack-app2',
        type: 'process',
        position: { x: 200, y: 340 },
        data: { label: '[36U-37U] Server Komputasi 2U Node #2', sublabel: 'Dell PowerEdge 64-Core 256GB', color: '#f0fdf4', borderColor: '#22c55e' },
      },
      {
        id: 'rack-ups',
        type: 'process',
        position: { x: 200, y: 430 },
        data: { label: '[01U-04U] Smart UPS Cadangan Daya 6kVA', sublabel: 'Baterai Redundan Online', color: '#fffbeb', borderColor: '#f59e0b' },
      },
    ],
    edges: [
      {
        id: 'e-rk-1',
        source: 'rack-sw',
        target: 'rack-app1',
        type: 'smoothstep',
        label: 'SFP+ 10G',
        style: { stroke: '#3b82f6', strokeWidth: 2 },
      },
      {
        id: 'e-rk-2',
        source: 'rack-sw',
        target: 'rack-app2',
        type: 'smoothstep',
        label: 'SFP+ 10G',
        style: { stroke: '#3b82f6', strokeWidth: 2 },
      },
      {
        id: 'e-rk-3',
        source: 'rack-ups',
        target: 'rack-app2',
        type: 'smoothstep',
        label: 'Kabel Daya C19',
        style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '4,4' },
      },
    ],
  },

  // 8. Diagram Sirkuit
  {
    id: 'circuit',
    name: 'Diagram Sirkuit',
    description: 'Skematik elektronika dasar: sumber tegangan VCC, saklar, resistor, kapasitor, dan beban LED.',
    iconName: 'Zap',
    accentColor: '#eab308',
    badge: 'Elektronika & Listrik',
    nodes: [
      {
        id: 'c-vcc',
        type: 'circle',
        position: { x: 120, y: 160 },
        data: { label: '+9V VCC', sublabel: 'Baterai DC', color: '#fef2f2', borderColor: '#ef4444' },
      },
      {
        id: 'c-sw',
        type: 'process',
        position: { x: 280, y: 160 },
        data: { label: 'Saklar Push (SW1)', sublabel: 'Normally Open', color: '#ffffff', borderColor: '#64748b' },
      },
      {
        id: 'c-r1',
        type: 'process',
        position: { x: 460, y: 160 },
        data: { label: 'Resistor R1 (330 Ω)', sublabel: 'Pembatas Arus', color: '#fffbeb', borderColor: '#d97706' },
      },
      {
        id: 'c-led',
        type: 'triangle',
        position: { x: 640, y: 160 },
        data: { label: 'LED Hijau', sublabel: 'Indikator Nyala', color: '#f0fdf4', borderColor: '#16a34a' },
      },
      {
        id: 'c-gnd',
        type: 'terminal',
        position: { x: 640, y: 300 },
        data: { label: 'GND (0V)', sublabel: 'Ground Bumi', color: '#f1f5f9', borderColor: '#0f172a' },
      },
    ],
    edges: [
      {
        id: 'e-c-1',
        source: 'c-vcc',
        target: 'c-sw',
        type: 'straight',
        style: { stroke: '#ef4444', strokeWidth: 2 },
      },
      {
        id: 'e-c-2',
        source: 'c-sw',
        target: 'c-r1',
        type: 'straight',
        style: { stroke: '#ef4444', strokeWidth: 2 },
      },
      {
        id: 'e-c-3',
        source: 'c-r1',
        target: 'c-led',
        type: 'straight',
        style: { stroke: '#ef4444', strokeWidth: 2 },
      },
      {
        id: 'e-c-4',
        source: 'c-led',
        target: 'c-gnd',
        type: 'straight',
        style: { stroke: '#0f172a', strokeWidth: 2 },
      },
    ],
  },

  // 9. P & ID (Piping & Instrumentation Diagram)
  {
    id: 'pid',
    name: 'P & amp; ID',
    description: 'Piping and Instrumentation Diagram untuk pemrosesan fluida industri, tangki penampung, katup & pompa.',
    iconName: 'Gauge',
    accentColor: '#0d9488',
    badge: 'Proses Industri & Mesin',
    nodes: [
      {
        id: 'pid-tank1',
        type: 'cylinder',
        position: { x: 120, y: 160 },
        data: { label: 'Tangki Pasokan T-101', sublabel: 'Kapasitas 5.000 L', color: '#f0fdfa', borderColor: '#0d9488' },
      },
      {
        id: 'pid-valve1',
        type: 'hexagon',
        position: { x: 320, y: 170 },
        data: { label: 'Katup V-101', sublabel: 'Katup Bola Manual', color: '#ffffff', borderColor: '#475569' },
      },
      {
        id: 'pid-pump',
        type: 'circle',
        position: { x: 480, y: 165 },
        data: { label: 'Pompa P-102', sublabel: 'Sentrifugal 3.5 kW', color: '#eff6ff', borderColor: '#2563eb' },
      },
      {
        id: 'pid-sensor',
        type: 'diamond',
        position: { x: 660, y: 165 },
        data: { label: 'Flow Sensor FT-101', color: '#fffbeb', borderColor: '#d97706' },
      },
      {
        id: 'pid-tank2',
        type: 'cylinder',
        position: { x: 840, y: 160 },
        data: { label: 'Reaktor Penampung R-201', sublabel: 'Dengan Pemanas Steam', color: '#ecfdf5', borderColor: '#059669' },
      },
    ],
    edges: [
      {
        id: 'e-pid-1',
        source: 'pid-tank1',
        target: 'pid-valve1',
        type: 'straight',
        style: { stroke: '#0d9488', strokeWidth: 3 },
      },
      {
        id: 'e-pid-2',
        source: 'pid-valve1',
        target: 'pid-pump',
        type: 'straight',
        style: { stroke: '#0d9488', strokeWidth: 3 },
      },
      {
        id: 'e-pid-3',
        source: 'pid-pump',
        target: 'pid-sensor',
        type: 'straight',
        style: { stroke: '#0d9488', strokeWidth: 3 },
      },
      {
        id: 'e-pid-4',
        source: 'pid-sensor',
        target: 'pid-tank2',
        type: 'straight',
        style: { stroke: '#059669', strokeWidth: 3 },
      },
    ],
  },

  // 10. Analisis SWOT (Highlight Khas Gambar 3)
  {
    id: 'swot',
    name: 'Analisis SWOT',
    description: 'Matriks evaluasi strategis 4 Kuadran: Kekuatan (Strengths), Kelemahan (Weaknesses), Peluang (Opportunities), Ancaman (Threats).',
    iconName: 'Target',
    accentColor: '#ea9932',
    badge: 'Analisis Bisnis & Strategi',
    nodes: [
      {
        id: 'swot-header',
        type: 'process',
        position: { x: 300, y: 40 },
        data: {
          label: 'MATRIKS ANALISIS SWOT STRATEGIS',
          sublabel: 'Rencana Peluncuran Produk & Ekspansi Pasar 2026',
          color: '#0b4632',
          borderColor: '#0b4632',
          textColor: '#fef3c7',
        },
      },
      {
        id: 'swot-s',
        type: 'swot_card',
        position: { x: 80, y: 140 },
        data: {
          type: 'S',
          title: 'Strengths (Kekuatan)',
          items: [
            'Arsitektur teknologi modern & responsif (Next.js 16)',
            'Tim rekayasa berpengalaman di bidang visualisasi',
            'Fitur ekspor dokumen lengkap (PDF A4, JPG, Cetak)',
            'Biaya operasional efisien dengan Supabase RLS',
          ],
          color: '#ecfdf5',
          borderColor: '#059669',
          headerBg: '#0b4632',
          textColor: '#064e3b',
        },
      },
      {
        id: 'swot-w',
        type: 'swot_card',
        position: { x: 500, y: 140 },
        data: {
          type: 'W',
          title: 'Weaknesses (Kelemahan)',
          items: [
            'Brand awareness masih dalam tahap awal pertumbuhan',
            'Komunitas template pengguna pihak ketiga baru dirintis',
            'Belum ada kolaborasi editing kursor multi-user real-time',
            'Dokumentasi API publik masih dalam penyusunan',
          ],
          color: '#fffbeb',
          borderColor: '#f59e0b',
          headerBg: '#b45309',
          textColor: '#78350f',
        },
      },
      {
        id: 'swot-o',
        type: 'swot_card',
        position: { x: 80, y: 390 },
        data: {
          type: 'O',
          title: 'Opportunities (Peluang)',
          items: [
            'Permintaan tinggi terhadap software alternatif Visio yang ringan',
            'Integrasi dengan AI otomatisasi untuk generate diagram',
            'Kemitraan dengan universitas & instansi pelatihan teknis',
            'Ekspansi ke pasar SaaS B2B untuk tim arsitektur cloud',
          ],
          color: '#eff6ff',
          borderColor: '#3b82f6',
          headerBg: '#1e3a8a',
          textColor: '#1e3a8a',
        },
      },
      {
        id: 'swot-t',
        type: 'swot_card',
        position: { x: 500, y: 390 },
        data: {
          type: 'T',
          title: 'Threats (Ancaman)',
          items: [
            'Kompetitor mapan seperti Miro, Lucidchart, dan draw.io',
            'Perubahan cepat regulasi privasi data di cloud',
            'Kenaikan biaya hosting bila traffic melonjak tajam',
            'Ketidakpastian siklus adopsi software enterprise',
          ],
          color: '#fef2f2',
          borderColor: '#ef4444',
          headerBg: '#991b1b',
          textColor: '#7f1d1d',
        },
      },
    ],
    edges: [],
  },

  // 11. Diagram Blok
  {
    id: 'block',
    name: 'Diagram Blok',
    description: 'Visualisasi subsistem fungsional tingkat tinggi, aliran modul logika, dan interkoneksi pemrosesan data.',
    iconName: 'Boxes',
    accentColor: '#6366f1',
    badge: 'Arsitektur Sistem',
    nodes: [
      {
        id: 'blk-in',
        type: 'process',
        position: { x: 80, y: 160 },
        data: { label: 'Modul Masukan (Sensor & API)', sublabel: 'Data Raw Ingestion', color: '#f1f5f9', borderColor: '#475569' },
      },
      {
        id: 'blk-proc',
        type: 'process',
        position: { x: 320, y: 160 },
        data: { label: 'Unit Pemrosesan Pusat (CPU)', sublabel: 'Transformasi & Validasi', color: '#e0e7ff', borderColor: '#4338ca' },
      },
      {
        id: 'blk-filter',
        type: 'process',
        position: { x: 320, y: 310 },
        data: { label: 'Modul Penyaring Kebisingan', sublabel: 'Digital Low-Pass Filter', color: '#fef3c7', borderColor: '#d97706' },
      },
      {
        id: 'blk-out',
        type: 'process',
        position: { x: 580, y: 160 },
        data: { label: 'Modul Keluaran (Display & Log)', sublabel: 'Visualisasi Dasbor', color: '#dcfce7', borderColor: '#15803d' },
      },
    ],
    edges: [
      {
        id: 'e-blk-1',
        source: 'blk-in',
        target: 'blk-proc',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#4338ca' },
        style: { stroke: '#4338ca', strokeWidth: 2 },
      },
      {
        id: 'e-blk-2',
        source: 'blk-proc',
        target: 'blk-filter',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#d97706' },
        style: { stroke: '#d97706', strokeWidth: 2 },
      },
      {
        id: 'e-blk-3',
        source: 'blk-proc',
        target: 'blk-out',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#15803d' },
        style: { stroke: '#15803d', strokeWidth: 2 },
      },
    ],
  },
];

export function getTemplateByCategory(categoryId: string): CategoryTemplate | undefined {
  return SPECIALIST_CATEGORIES.find((c) => c.id === categoryId);
}
