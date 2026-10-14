'use client';

import React, { Suspense } from 'react';
import DiagramEditor from '@/components/canvas/DiagramEditor';

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-slate-50 text-slate-500 text-sm">Memuat Studio GALUR...</div>}>
      <DiagramEditor />
    </Suspense>
  );
}
