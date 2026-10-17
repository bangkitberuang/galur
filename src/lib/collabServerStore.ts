/**
 * In-memory state store for Real-time Collaboration rooms in Node.js / Next.js
 */

export interface CollabUser {
  id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number } | null;
  lastSeen: number;
}

export interface CollabSnapshot {
  title?: string;
  nodes: any[];
  edges: any[];
  pageConfig?: any;
  pages?: any[];
  activePageId?: string;
  updatedAt: number;
}

interface RoomState {
  clients: Map<string, {
    user: CollabUser;
    controller: ReadableStreamDefaultController<any>;
  }>;
  snapshot?: CollabSnapshot;
}

// Global singleton map to survive hot-reload in development
const globalForCollab = globalThis as unknown as {
  collabRooms: Map<string, RoomState>;
};

if (!globalForCollab.collabRooms) {
  globalForCollab.collabRooms = new Map();
}

const rooms = globalForCollab.collabRooms;

export function getOrCreateRoom(roomId: string): RoomState {
  let room = rooms.get(roomId);
  if (!room) {
    room = {
      clients: new Map(),
    };
    rooms.set(roomId, room);
  }
  return room;
}

export function registerClient(
  roomId: string,
  user: CollabUser,
  controller: ReadableStreamDefaultController<any>
) {
  const room = getOrCreateRoom(roomId);
  room.clients.set(user.id, { user, controller });

  // Broadcast user_joined to everyone else in room
  broadcastToRoom(roomId, {
    type: 'user_joined',
    user,
    allUsers: Array.from(room.clients.values()).map((c) => c.user),
  }, user.id);
}

export function unregisterClient(roomId: string, userId: string) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.clients.delete(userId);

  // Broadcast user_left to remaining clients
  broadcastToRoom(roomId, {
    type: 'user_left',
    userId,
    allUsers: Array.from(room.clients.values()).map((c) => c.user),
  });

  if (room.clients.size === 0) {
    // Keep snapshot for 30 minutes, clean up empty rooms
  }
}

export function broadcastToRoom(roomId: string, message: any, excludeUserId?: string) {
  const room = rooms.get(roomId);
  if (!room) return 0;

  const encoder = new TextEncoder();
  const payload = `data: ${JSON.stringify(message)}\n\n`;
  const bytes = encoder.encode(payload);

  let sentCount = 0;
  for (const [userId, client] of room.clients.entries()) {
    if (excludeUserId && userId === excludeUserId) continue;

    try {
      client.controller.enqueue(bytes);
      sentCount++;
    } catch {
      // Client disconnected, cleanup
      room.clients.delete(userId);
    }
  }

  return sentCount;
}

export function setRoomSnapshot(roomId: string, snapshot: CollabSnapshot) {
  const room = getOrCreateRoom(roomId);
  room.snapshot = snapshot;
}

export function getRoomSnapshot(roomId: string): CollabSnapshot | undefined {
  const room = rooms.get(roomId);
  return room?.snapshot;
}

export function getRoomActiveUsers(roomId: string): CollabUser[] {
  const room = rooms.get(roomId);
  if (!room) return [];
  return Array.from(room.clients.values()).map((c) => c.user);
}
