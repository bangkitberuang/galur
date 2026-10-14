'use client';

export interface CollabUser {
  id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number } | null;
  lastSeen: number;
}

export const COLLAB_COLORS = [
  '#0284c7', // Sky Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#6366f1', // Indigo
];

const USER_ID_STORAGE_KEY = 'galur_collab_user_id';
const USER_NAME_STORAGE_KEY = 'galur_collab_user_name';
const USER_COLOR_STORAGE_KEY = 'galur_collab_user_color';

export function getLocalCollabUser(): CollabUser {
  if (typeof window === 'undefined') {
    return { id: 'user_server', name: 'Kolaborator', color: '#0284c7', lastSeen: Date.now() };
  }

  // Setiap sesi tab mendapatkan userId unik agar antar-tab pada laptop yang sama dapat berkolaborasi
  let userId = sessionStorage.getItem(USER_ID_STORAGE_KEY);
  if (!userId) {
    userId = `usr_${Math.random().toString(36).substring(2, 8)}`;
    sessionStorage.setItem(USER_ID_STORAGE_KEY, userId);
  }

  // Nama pengguna disimpan di localStorage agar diingat
  let name = localStorage.getItem(USER_NAME_STORAGE_KEY);
  if (!name) {
    const randomNum = Math.floor(100 + Math.random() * 900);
    name = `Kolaborator #${randomNum}`;
    localStorage.setItem(USER_NAME_STORAGE_KEY, name);
  }

  // Warna pengguna
  let color = localStorage.getItem(USER_COLOR_STORAGE_KEY);
  if (!color) {
    color = COLLAB_COLORS[Math.floor(Math.random() * COLLAB_COLORS.length)];
    localStorage.setItem(USER_COLOR_STORAGE_KEY, color);
  }

  return {
    id: userId,
    name,
    color,
    lastSeen: Date.now(),
  };
}

export function saveLocalCollabProfile(name: string, color: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_NAME_STORAGE_KEY, name);
  localStorage.setItem(USER_COLOR_STORAGE_KEY, color);
}

export interface CollabListeners {
  onUsersChange?: (users: CollabUser[]) => void;
  onRemoteCursor?: (userId: string, cursor: { x: number; y: number } | null) => void;
  onRemoteDiagramSync?: (data: { nodes: any[]; edges: any[]; title?: string; pageConfig?: any }) => void;
  onRemoteNodesChange?: (nodes: any[]) => void;
  onRemoteEdgesChange?: (edges: any[]) => void;
  onConnectionStatusChange?: (status: 'disconnected' | 'connecting' | 'connected') => void;
}

export class CollabManager {
  private roomId: string | null = null;
  private currentUser: CollabUser;
  private listeners: CollabListeners = {};
  private users: Map<string, CollabUser> = new Map();
  private broadcastChannel: BroadcastChannel | null = null;
  private eventSource: EventSource | null = null;
  private status: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
  private lastCursorSent = 0;
  private heartbeatTimer: any = null;

  constructor() {
    this.currentUser = getLocalCollabUser();
  }

  public getCurrentUser(): CollabUser {
    return this.currentUser;
  }

  public updateProfile(name: string, color: string) {
    this.currentUser.name = name;
    this.currentUser.color = color;
    saveLocalCollabProfile(name, color);

    this.broadcast({
      type: 'profile_updated',
      user: this.currentUser,
    });

    this.notifyUsersChange();
  }

  public joinRoom(roomId: string, listeners: CollabListeners) {
    if (this.roomId === roomId && this.status === 'connected') {
      this.listeners = listeners;
      return;
    }

    this.leaveRoom();

    this.roomId = roomId;
    this.listeners = listeners;
    this.setStatus('connecting');

    // 1. Inisialisasi Native BroadcastChannel (Multi-tab seketika pada mesin yang sama)
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel(`galur_collab_${roomId}`);
        this.broadcastChannel.onmessage = (event) => {
          this.handleIncomingMessage(event.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel tidak didukung:', err);
      }
    }

    // 2. Inisialisasi Network SSE Stream (Lintas komputer / LAN / Web)
    if (typeof window !== 'undefined' && 'EventSource' in window) {
      const url = `/api/collab/stream?room=${encodeURIComponent(roomId)}&userId=${encodeURIComponent(
        this.currentUser.id
      )}&name=${encodeURIComponent(this.currentUser.name)}&color=${encodeURIComponent(
        this.currentUser.color
      )}`;

      try {
        this.eventSource = new EventSource(url);

        this.eventSource.onopen = () => {
          this.setStatus('connected');
        };

        this.eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleIncomingMessage(data);
          } catch {}
        };

        this.eventSource.onerror = () => {
          // Jika SSE putus, status tetap fallback ke broadcast channel
          if (this.broadcastChannel) {
            this.setStatus('connected');
          }
        };
      } catch (err) {
        console.warn('Gagal menghubungkan ke SSE Collab:', err);
      }
    }

    // Broadcast kehadiran ke rekan kolaborasi
    this.broadcast({
      type: 'user_joined',
      user: this.currentUser,
    });

    // Minta rekonsiliasi data diagram dari partisipan yang sudah aktif di room
    this.broadcast({
      type: 'request_sync',
      senderId: this.currentUser.id,
    });

    // Heartbeat untuk membersihkan kursor / user yang sudah tidak aktif
    this.heartbeatTimer = setInterval(() => {
      const now = Date.now();
      let changed = false;
      for (const [id, user] of this.users.entries()) {
        if (now - user.lastSeen > 35000) {
          this.users.delete(id);
          changed = true;
          this.listeners.onRemoteCursor?.(id, null);
        }
      }
      if (changed) {
        this.notifyUsersChange();
      }
    }, 10000);
  }

  public leaveRoom() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (this.roomId) {
      this.broadcast({
        type: 'user_left',
        userId: this.currentUser.id,
      });
    }

    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    this.users.clear();
    this.roomId = null;
    this.setStatus('disconnected');
    this.notifyUsersChange();
  }

  public sendCursor(x: number, y: number) {
    if (!this.roomId) return;
    const now = Date.now();
    // Throttling 40ms (~25fps) agar performa tetap super halus dan hemat bandwidth
    if (now - this.lastCursorSent < 40) return;
    this.lastCursorSent = now;

    this.broadcast({
      type: 'cursor_move',
      userId: this.currentUser.id,
      cursor: { x, y },
    });
  }

  public broadcastDiagramSync(nodes: any[], edges: any[], title?: string, pageConfig?: any) {
    if (!this.roomId) return;
    this.broadcast({
      type: 'sync_diagram',
      senderId: this.currentUser.id,
      nodes,
      edges,
      title,
      pageConfig,
    });
  }

  public broadcastNodesChange(nodes: any[]) {
    if (!this.roomId) return;
    this.broadcast({
      type: 'nodes_change',
      senderId: this.currentUser.id,
      nodes,
    });
  }

  public broadcastEdgesChange(edges: any[]) {
    if (!this.roomId) return;
    this.broadcast({
      type: 'edges_change',
      senderId: this.currentUser.id,
      edges,
    });
  }

  private broadcast(message: any) {
    if (!this.roomId) return;

    // 1. Kirim via BroadcastChannel lokal (Instant 0ms multi-tab)
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(message);
      } catch {}
    }

    // 2. Kirim via API network server (untuk kolaborator pada browser / komputer berbeda)
    fetch('/api/collab/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room: this.roomId,
        senderId: this.currentUser.id,
        message,
      }),
    }).catch(() => {});
  }

  private handleIncomingMessage(msg: any) {
    if (!msg || typeof msg !== 'object') return;
    // Jangan proses pesan yang berasal dari diri sendiri
    if (msg.senderId === this.currentUser.id || msg.user?.id === this.currentUser.id) {
      return;
    }

    switch (msg.type) {
      case 'welcome': {
        if (Array.isArray(msg.allUsers)) {
          msg.allUsers.forEach((u: CollabUser) => {
            if (u.id !== this.currentUser.id) {
              this.users.set(u.id, { ...u, lastSeen: Date.now() });
            }
          });
          this.notifyUsersChange();
        }
        if (msg.snapshot && (msg.snapshot.nodes || msg.snapshot.edges)) {
          this.listeners.onRemoteDiagramSync?.(msg.snapshot);
        }
        break;
      }

      case 'user_joined': {
        if (msg.user && msg.user.id !== this.currentUser.id) {
          this.users.set(msg.user.id, { ...msg.user, lastSeen: Date.now() });
          this.notifyUsersChange();
        }
        break;
      }

      case 'user_left': {
        if (msg.userId) {
          this.users.delete(msg.userId);
          this.listeners.onRemoteCursor?.(msg.userId, null);
          this.notifyUsersChange();
        }
        break;
      }

      case 'profile_updated': {
        if (msg.user && msg.user.id !== this.currentUser.id) {
          this.users.set(msg.user.id, { ...msg.user, lastSeen: Date.now() });
          this.notifyUsersChange();
        }
        break;
      }

      case 'cursor_move': {
        if (msg.userId && msg.cursor) {
          const existing = this.users.get(msg.userId);
          if (existing) {
            existing.cursor = msg.cursor;
            existing.lastSeen = Date.now();
          }
          this.listeners.onRemoteCursor?.(msg.userId, msg.cursor);
        }
        break;
      }

      case 'sync_diagram': {
        if (msg.nodes || msg.edges) {
          this.listeners.onRemoteDiagramSync?.({
            nodes: msg.nodes || [],
            edges: msg.edges || [],
            title: msg.title,
            pageConfig: msg.pageConfig,
          });
        }
        break;
      }

      case 'nodes_change': {
        if (msg.nodes) {
          this.listeners.onRemoteNodesChange?.(msg.nodes);
        }
        break;
      }

      case 'edges_change': {
        if (msg.edges) {
          this.listeners.onRemoteEdgesChange?.(msg.edges);
        }
        break;
      }
    }
  }

  private setStatus(status: 'disconnected' | 'connecting' | 'connected') {
    this.status = status;
    this.listeners.onConnectionStatusChange?.(status);
  }

  private notifyUsersChange() {
    const list = Array.from(this.users.values());
    this.listeners.onUsersChange?.(list);
  }

  public getActiveUsers(): CollabUser[] {
    return Array.from(this.users.values());
  }

  public getStatus() {
    return this.status;
  }
}

// Singleton CollabManager
export const collabManager = new CollabManager();
