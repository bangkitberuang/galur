import React from 'react';

/**
 * Utilitas untuk menyelesaikan gaya teks (Font, Ukuran, Bold, Italic, Underline, Align)
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
  }

  return {
    fontWeight: isBold ? 700 : 400,
    fontStyle: isItalic ? 'italic' : 'normal',
    textDecoration,
    fontSize: sizeStr,
    fontFamily,
    textAlign: data?.textAlign || undefined,
    color: data?.textColor || defaultColor || undefined,
  };
}

/**
 * Utilitas untuk menyelesaikan gaya bentuk luar (Warna latar, border, kelengkungan)
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

  return {
    backgroundColor: bg,
    borderColor: border,
    borderWidth,
    borderStyle,
    borderRadius,
  };
}
