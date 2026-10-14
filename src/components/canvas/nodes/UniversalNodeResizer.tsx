'use client';

import React from 'react';
import { NodeResizer, useReactFlow } from '@xyflow/react';

export interface UniversalNodeResizerProps {
  id?: string;
  isVisible?: boolean;
  minWidth?: number;
  minHeight?: number;
  keepAspectRatio?: boolean;
  color?: string;
  onResizeStart?: (event: any, params: any) => void;
  onResizeEnd?: (event: any, params: { width: number; height: number; x: number; y: number }) => void;
}

/**
 * UniversalNodeResizer: Komponen 8 titik pengubah ukuran (Resize Handles)
 * Sesuai referensi gambar: 4 titik sudut + 4 titik sisi dengan garis seleksi putus-putus.
 * Memungkinkan user memperbesar/memperkecil objek langsung di kanvas tanpa perlu menu ribet.
 */
export const UniversalNodeResizer = ({
  id,
  isVisible = false,
  minWidth = 50,
  minHeight = 30,
  keepAspectRatio = false,
  color = '#0284c7', // Biru cerah presisi sesuai referensi gambar user
  onResizeStart,
  onResizeEnd,
}: UniversalNodeResizerProps) => {
  const { setNodes } = useReactFlow();

  const handleResizeStart = (event: any, params: any) => {
    if (onResizeStart) {
      onResizeStart(event, params);
    }
  };

  const handleResizeEnd = (event: any, params: any) => {
    if (onResizeEnd) {
      onResizeEnd(event, params);
    } else if (id) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id
            ? {
                ...n,
                data: {
                  ...n.data,
                  width: Math.round(params.width),
                  height: Math.round(params.height),
                },
              }
            : n
        )
      );
    }
  };

  return (
    <NodeResizer
      isVisible={isVisible}
      minWidth={minWidth}
      minHeight={minHeight}
      keepAspectRatio={keepAspectRatio}
      onResizeStart={handleResizeStart}
      onResizeEnd={handleResizeEnd}
      color={color}
      lineStyle={{
        borderColor: color,
        borderStyle: 'dashed',
        borderWidth: 1.5,
      }}
      handleStyle={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: color,
        border: '2px solid #ffffff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        zIndex: 40,
      }}
    />
  );
};

export default UniversalNodeResizer;
