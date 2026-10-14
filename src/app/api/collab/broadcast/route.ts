import { NextRequest, NextResponse } from 'next/server';
import { broadcastToRoom, setRoomSnapshot } from '@/lib/collabServerStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { room, message, senderId } = body;

    if (!room || !message) {
      return NextResponse.json({ error: 'Missing room or message' }, { status: 400 });
    }

    // Jika pesan adalah sync_diagram atau diagram_snapshot, simpan snapshot terkini untuk client yang baru bergabung
    if (message.type === 'sync_diagram' || message.type === 'snapshot') {
      if (message.nodes || message.edges) {
        setRoomSnapshot(room, {
          title: message.title,
          nodes: message.nodes || [],
          edges: message.edges || [],
          pageConfig: message.pageConfig,
          updatedAt: Date.now(),
        });
      }
    }

    // Sebarkan ke seluruh client lain dalam room
    const sentCount = broadcastToRoom(room, message, senderId);

    return NextResponse.json({
      success: true,
      deliveredTo: sentCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
