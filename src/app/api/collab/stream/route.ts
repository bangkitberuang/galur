import { NextRequest } from 'next/server';
import { 
  registerClient, 
  unregisterClient, 
  getRoomActiveUsers, 
  getRoomSnapshot, 
  CollabUser 
} from '@/lib/collabServerStore';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get('room') || 'default-room';
  const userId = searchParams.get('userId') || `user_${Math.random().toString(36).substring(2, 9)}`;
  const name = searchParams.get('name') || 'Kolaborator Galur';
  const color = searchParams.get('color') || '#0284c7';

  const user: CollabUser = {
    id: userId,
    name,
    color,
    lastSeen: Date.now(),
  };

  let keepAliveTimer: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    start(controller) {
      // Daftarkan client ke room
      registerClient(roomId, user, controller);

      const encoder = new TextEncoder();

      // Kirim pesan selamat datang beserta daftar user yang sudah ada dan snapshot terkini
      const existingUsers = getRoomActiveUsers(roomId);
      const snapshot = getRoomSnapshot(roomId);

      const welcomePayload = `data: ${JSON.stringify({
        type: 'welcome',
        user,
        allUsers: existingUsers,
        snapshot: snapshot || null,
      })}\n\n`;

      controller.enqueue(encoder.encode(welcomePayload));

      // Kirim heartbeat / ping setiap 20 detik agar koneksi SSE tidak diputus oleh reverse proxy / browser
      keepAliveTimer = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': ping\n\n'));
        } catch {
          if (keepAliveTimer) clearInterval(keepAliveTimer);
        }
      }, 20000);
    },
    cancel() {
      if (keepAliveTimer) clearInterval(keepAliveTimer);
      unregisterClient(roomId, userId);
    },
  });

  // Listener jika request dibatalkan / tab ditutup
  req.signal.addEventListener('abort', () => {
    if (keepAliveTimer) clearInterval(keepAliveTimer);
    unregisterClient(roomId, userId);
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
