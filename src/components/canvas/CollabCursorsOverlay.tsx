'use client';

import React from 'react';
import { CollabUser } from '@/lib/collaboration';

interface CollabCursorsOverlayProps {
  users: CollabUser[];
  activePageId?: string;
}

export const CollabCursorsOverlay: React.FC<CollabCursorsOverlayProps> = ({ users, activePageId }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden no-print">
      {users.map((user) => {
        if (!user.cursor) return null;
        if (activePageId && user.pageId && user.pageId !== activePageId) return null;

        return (
          <div
            key={user.id}
            className="absolute top-0 left-0 transition-transform duration-75 ease-out pointer-events-none"
            style={{
              transform: `translate3d(${user.cursor.x}px, ${user.cursor.y}px, 0)`,
              willChange: 'transform',
            }}
          >
            {/* SVG Mouse Pointer Icon */}
            <svg
              className="w-4 h-4 drop-shadow-md"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: user.color }}
            >
              <path
                d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
                fill="currentColor"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>

            {/* Nama Pengguna Kolaborator */}
            <div
              className="absolute left-3.5 top-2.5 px-2 py-0.5 rounded-full text-[11px] font-bold text-white shadow-md flex items-center gap-1 whitespace-nowrap animate-in fade-in zoom-in-90 duration-150"
              style={{ backgroundColor: user.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse" />
              <span>{user.name}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CollabCursorsOverlay;
