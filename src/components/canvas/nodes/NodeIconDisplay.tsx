'use client';

import React from 'react';
import {
  Database,
  Server,
  Cloud,
  Cpu,
  HardDrive,
  Network,
  Wifi,
  Globe,
  Terminal,
  Shield,
  ShieldCheck,
  Key,
  Lock,
  Code2,
  Bot,
  Sparkles,
  CheckCircle2,
  Check,
  AlertTriangle,
  AlertCircle,
  PlayCircle,
  Clock,
  Zap,
  Flag,
  Target,
  Award,
  DollarSign,
  Briefcase,
  Users,
  User,
  MessageSquare,
  Mail,
  FileText,
  Folder,
  Image as ImageIcon,
  Link,
  Phone,
  Share2,
  Compass,
  Layers,
  Heart,
  Star,
  ThumbsUp,
  Lightbulb,
  Rocket,
  Flame,
  HelpCircle,
  Info,
  Box,
  Truck,
  ShoppingCart,
  Settings,
  Search,
  Smartphone,
  Laptop,
  Monitor,
  Workflow,
  Smile,
} from 'lucide-react';

export const LUCIDE_ICON_MAP: Record<string, React.ComponentType<any>> = {
  database: Database,
  server: Server,
  cloud: Cloud,
  cpu: Cpu,
  harddrive: HardDrive,
  network: Network,
  wifi: Wifi,
  globe: Globe,
  terminal: Terminal,
  shield: Shield,
  shieldcheck: ShieldCheck,
  key: Key,
  lock: Lock,
  code: Code2,
  bot: Bot,
  sparkles: Sparkles,
  checkcircle: CheckCircle2,
  alerttriangle: AlertTriangle,
  alertcircle: AlertCircle,
  playcircle: PlayCircle,
  clock: Clock,
  zap: Zap,
  flag: Flag,
  target: Target,
  award: Award,
  dollarsign: DollarSign,
  briefcase: Briefcase,
  users: Users,
  user: User,
  messagesquare: MessageSquare,
  mail: Mail,
  filetext: FileText,
  folder: Folder,
  image: ImageIcon,
  link: Link,
  phone: Phone,
  share: Share2,
  compass: Compass,
  layers: Layers,
  heart: Heart,
  star: Star,
  thumbsup: ThumbsUp,
  lightbulb: Lightbulb,
  rocket: Rocket,
  flame: Flame,
  helpcircle: HelpCircle,
  info: Info,
  box: Box,
  truck: Truck,
  shoppingcart: ShoppingCart,
  settings: Settings,
  search: Search,
  smartphone: Smartphone,
  laptop: Laptop,
  monitor: Monitor,
  workflow: Workflow,
};

// Daftar Ikon Lucide Pilihan dengan Kategori & Label Indonesia
export const ICON_CATEGORIES = [
  {
    name: 'Teknologi & Server',
    icons: [
      { id: 'database', label: 'Database', icon: Database },
      { id: 'server', label: 'Server', icon: Server },
      { id: 'cloud', label: 'Cloud', icon: Cloud },
      { id: 'cpu', label: 'CPU/Proses', icon: Cpu },
      { id: 'harddrive', label: 'Storage', icon: HardDrive },
      { id: 'network', label: 'Network', icon: Network },
      { id: 'globe', label: 'Web/API', icon: Globe },
      { id: 'terminal', label: 'Terminal', icon: Terminal },
      { id: 'code', label: 'Code', icon: Code2 },
      { id: 'bot', label: 'Bot/AI', icon: Bot },
      { id: 'shield', label: 'Security', icon: Shield },
      { id: 'lock', label: 'Auth/Lock', icon: Lock },
      { id: 'key', label: 'API Key', icon: Key },
      { id: 'wifi', label: 'Wifi/IoT', icon: Wifi },
      { id: 'laptop', label: 'Client PC', icon: Laptop },
      { id: 'smartphone', label: 'Mobile App', icon: Smartphone },
    ],
  },
  {
    name: 'Alur & Bisnis',
    icons: [
      { id: 'playcircle', label: 'Mulai', icon: PlayCircle },
      { id: 'checkcircle', label: 'Selesai/Sukses', icon: CheckCircle2 },
      { id: 'alerttriangle', label: 'Peringatan', icon: AlertTriangle },
      { id: 'alertcircle', label: 'Error', icon: AlertCircle },
      { id: 'clock', label: 'Waktu/Delay', icon: Clock },
      { id: 'zap', label: 'Trigger/Event', icon: Zap },
      { id: 'flag', label: 'Milestone', icon: Flag },
      { id: 'target', label: 'Target KPI', icon: Target },
      { id: 'award', label: 'Pencapaian', icon: Award },
      { id: 'users', label: 'Tim/Pengguna', icon: Users },
      { id: 'user', label: 'Aktor/User', icon: User },
      { id: 'briefcase', label: 'Bisnis/Project', icon: Briefcase },
      { id: 'dollarsign', label: 'Finance/Biaya', icon: DollarSign },
      { id: 'shoppingcart', label: 'E-Commerce', icon: ShoppingCart },
      { id: 'truck', label: 'Logistik', icon: Truck },
      { id: 'workflow', label: 'Workflow', icon: Workflow },
    ],
  },
  {
    name: 'Media & Simbol',
    icons: [
      { id: 'filetext', label: 'Dokumen', icon: FileText },
      { id: 'folder', label: 'Folder', icon: Folder },
      { id: 'messagesquare', label: 'Chat/Pesan', icon: MessageSquare },
      { id: 'mail', label: 'Email Notif', icon: Mail },
      { id: 'rocket', label: 'Launch/Deploy', icon: Rocket },
      { id: 'lightbulb', label: 'Ide/Solusi', icon: Lightbulb },
      { id: 'sparkles', label: 'Inovasi', icon: Sparkles },
      { id: 'star', label: 'Prioritas/Star', icon: Star },
      { id: 'heart', label: 'Favorit', icon: Heart },
      { id: 'flame', label: 'Urgent/Hot', icon: Flame },
      { id: 'box', label: 'Paket/Modul', icon: Box },
      { id: 'layers', label: 'Layer/Arsitektur', icon: Layers },
      { id: 'settings', label: 'Konfigurasi', icon: Settings },
      { id: 'search', label: 'Pencarian', icon: Search },
    ],
  },
];

// Preset Logo Teknologi & Cloud
export const POPULAR_LOGO_PRESETS = [
  {
    name: 'PostgreSQL',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    category: 'Database',
  },
  {
    name: 'MySQL',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    category: 'Database',
  },
  {
    name: 'Redis',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
    category: 'Database',
  },
  {
    name: 'MongoDB',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    category: 'Database',
  },
  {
    name: 'Node.js',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    category: 'Backend',
  },
  {
    name: 'Python',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    category: 'Backend',
  },
  {
    name: 'Go',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
    category: 'Backend',
  },
  {
    name: 'React',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    category: 'Frontend',
  },
  {
    name: 'Docker',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    category: 'DevOps',
  },
  {
    name: 'Kubernetes',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
    category: 'DevOps',
  },
  {
    name: 'AWS',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
    category: 'Cloud',
  },
  {
    name: 'Nginx',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg',
    category: 'Server',
  },
  {
    name: 'Linux',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
    category: 'OS',
  },
  {
    name: 'Git',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    category: 'Tools',
  },
  {
    name: 'Macan Galur',
    iconUrl: '/logo.png',
    category: 'Galur',
  },
];

// Preset Emoji Populer untuk Diagram
export const POPULAR_EMOJI_PRESETS = [
  { group: 'Basis Data & Sistem', emojis: ['🗄️', '🐘', '💾', '💻', '🖥️', '📱', '☁️', '⚡', '🔒', '🛡️', '🌐', '📡', '🤖', '⚙️', '🛠️'] },
  { group: 'Status & Tindakan', emojis: ['✅', '❌', '⚠️', '⏳', '🚀', '🎯', '💡', '⭐', '🔥', '🏆', '🚩', '📌', '🔔', '🔍', '✨'] },
  { group: 'Bisnis & Tim', emojis: ['👤', '👥', '🏢', '📊', '📈', '💼', '💰', '📝', '📄', '📁', '✉️', '💬', '🤝', '👑', '📦'] },
  { group: 'Simbol & Alam', emojis: ['🐅', '🍃', '❤️', '👍', '☕', '🧠', '🧩', '🔑', '🏷️', '🔗', '🚦', '🛑', '🏁'] },
];

export interface NodeIconDisplayProps {
  icon?: string;
  emoji?: string;
  iconUrl?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  defaultIcon?: string;
  defaultColor?: string;
  className?: string;
}

export const NodeIconDisplay: React.FC<NodeIconDisplayProps> = ({
  icon,
  emoji,
  iconUrl,
  color,
  size = 'md',
  defaultIcon,
  defaultColor,
  className = '',
}) => {
  // Jika secara eksplisit dimatikan / 'none'
  if (icon === 'none') return null;

  // 1. Gambar Logo / URL Kustom
  if (iconUrl) {
    const pxSize =
      typeof size === 'number'
        ? size
        : size === 'sm'
        ? 16
        : size === 'lg'
        ? 28
        : size === 'xl'
        ? 36
        : 22;

    return (
      <div className={`flex items-center justify-center shrink-0 ${className}`}>
        <img
          src={iconUrl}
          alt="Icon Logo"
          style={{ width: `${pxSize}px`, height: `${pxSize}px` }}
          className="object-contain pointer-events-none select-none rounded-xs drop-shadow-2xs"
          onError={(e) => {
            // Sembunyikan jika URL gambar gagal dimuat
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // 2. Emoji / Emoticon Teks
  if (emoji && emoji.trim().length > 0) {
    const fontSize =
      typeof size === 'number'
        ? `${size}px`
        : size === 'sm'
        ? '14px'
        : size === 'lg'
        ? '24px'
        : size === 'xl'
        ? '32px'
        : '18px';

    return (
      <span
        style={{ fontSize }}
        className={`leading-none select-none shrink-0 drop-shadow-2xs ${className}`}
      >
        {emoji}
      </span>
    );
  }

  // 3. Ikon Vektor Lucide
  const activeIconKey = (icon || defaultIcon || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const IconComponent = LUCIDE_ICON_MAP[activeIconKey];

  if (!IconComponent) return null;

  const iconPx =
    typeof size === 'number'
      ? size
      : size === 'sm'
      ? 14
      : size === 'lg'
      ? 22
      : size === 'xl'
      ? 28
      : 18;

  const activeColor = color || defaultColor || 'currentColor';

  return (
    <div className={`flex items-center justify-center shrink-0 ${className}`}>
      <IconComponent
        style={{ width: `${iconPx}px`, height: `${iconPx}px`, color: activeColor }}
        className="shrink-0 transition-transform pointer-events-none"
      />
    </div>
  );
};
