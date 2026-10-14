import React from 'react';

/**
 * Utilitas untuk menyelesaikan gaya teks (Font, Ukuran, Bold, Italic, Underline, Strike, Align, Transform)
 * untuk seluruh objek diagram di GALUR.
 */
export function getNodeTextStyles(data: any, defaultSize = 13, defaultColor?: string): React.CSSProperties {
  const isBold =
    data?.bold ??
    (data?.fontWeight === 'bold' ||
      data?.fontWeight === '800' ||
      data?.fontWeight === '900' ||
      data?.fontWeight === 700);

  const isItalic = data?.italic ?? (data?.fontStyle === 'italic');
  const isUnderline =
    data?.underline ??
    (data?.textDecoration === 'underline' || Boolean(data?.textDecoration?.includes('underline')));
  const isStrike =
    data?.strike ??
    (data?.textDecoration === 'line-through' || Boolean(data?.textDecoration?.includes('line-through')));

  let textDecoration = 'none';
  if (isUnderline && isStrike) textDecoration = 'underline line-through';
  else if (isUnderline) textDecoration = 'underline';
  else if (isStrike) textDecoration = 'line-through';

  let sizeStr = `${defaultSize}px`;
  if (typeof data?.fontSize === 'number') {
    sizeStr = `${data.fontSize}px`;
  } else if (typeof data?.fontSize === 'string' && data.fontSize.trim().length > 0) {
    sizeStr = data.fontSize.endsWith('px') || data.fontSize.endsWith('rem') ? data.fontSize : `${data.fontSize}px`;
  }

  let fontFamily: string | undefined = undefined;
  if (data?.fontFamily === 'serif') {
    fontFamily = 'Georgia, Cambria, "Times New Roman", Times, serif';
  } else if (data?.fontFamily === 'mono') {
    fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
  } else if (data?.fontFamily === 'sans') {
    fontFamily = 'var(--font-geist-sans), system-ui, -apple-system, sans-serif';
  } else if (data?.fontFamily) {
    fontFamily = data.fontFamily;
  }

  const textTransform = data?.textTransform || undefined;
  const letterSpacing = typeof data?.letterSpacing === 'number' ? `${data.letterSpacing}px` : data?.letterSpacing;

  return {
    fontWeight: isBold ? 700 : 400,
    fontStyle: isItalic ? 'italic' : 'normal',
    textDecoration,
    fontSize: sizeStr,
    fontFamily,
    textAlign: data?.textAlign || undefined,
    color: data?.textColor || defaultColor || undefined,
    textTransform,
    letterSpacing,
    lineHeight: data?.lineHeight || 1.35,
  };
}

/**
 * Utilitas untuk menyelesaikan gaya bentuk luar (Warna latar, border, kelengkungan, ukuran, bayangan, transparansi, rotasi)
 */
export function getNodeShapeStyles(
  data: any,
  defaultBg = '#ffffff',
  defaultBorder = '#3b82f6'
): React.CSSProperties {
  const bg = data?.color || defaultBg;
  const border = data?.borderColor || defaultBorder;
  const borderWidth = data?.borderWidth !== undefined ? `${data.borderWidth}px` : undefined;
  const borderStyle = data?.borderStyle || undefined;
  const borderRadius =
    data?.borderRadius !== undefined
      ? typeof data.borderRadius === 'number'
        ? `${data.borderRadius}px`
        : data.borderRadius
      : undefined;

  // Ukuran / Dimensi
  const width = data?.width !== undefined
    ? typeof data.width === 'number' ? `${data.width}px` : data.width
    : undefined;
  const height = data?.height !== undefined
    ? typeof data.height === 'number' ? `${data.height}px` : data.height
    : undefined;

  // Opasitas / Transparansi (dukung nilai 0-100 atau 0-1)
  let opacity: number | undefined = undefined;
  if (data?.opacity !== undefined && data?.opacity !== null) {
    const num = Number(data.opacity);
    opacity = num > 1 ? num / 100 : num;
  }

  // Efek Bayangan (Box Shadow)
  let boxShadow: string | undefined = undefined;
  if (data?.shadow) {
    switch (data.shadow) {
      case 'none':
        boxShadow = 'none';
        break;
      case 'sm':
        boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)';
        break;
      case 'md':
        boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        break;
      case 'lg':
        boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        break;
      case 'xl':
        boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.08)';
        break;
      default:
        boxShadow = data.shadow;
    }
  }

  // Rotasi Bentuk
  const transform = data?.rotation ? `rotate(${data.rotation}deg)` : undefined;

  return {
    backgroundColor: bg,
    borderColor: border,
    borderWidth,
    borderStyle,
    borderRadius,
    width,
    height,
    opacity,
    boxShadow,
    transform,
  };
}

/**
 * Utilitas untuk SVG Shapes (stroke, strokeWidth, strokeDasharray, fill)
 */
export function getSvgStrokeProps(data: any, defaultWidth = 2, defaultBorder = '#3b82f6') {
  const stroke = data?.borderColor || defaultBorder;
  const strokeWidth = data?.borderWidth !== undefined ? Number(data.borderWidth) : defaultWidth;
  let strokeDasharray: string | undefined = undefined;
  if (data?.borderStyle === 'dashed') {
    strokeDasharray = '5,5';
  } else if (data?.borderStyle === 'dotted') {
    strokeDasharray = '2,3';
  }
  return { stroke, strokeWidth, strokeDasharray };
}
