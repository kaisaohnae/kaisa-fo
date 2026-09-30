import type {TextLayerData} from './types';

export type TextBounds = {x: number; y: number; w: number; h: number};

function textFont(text: TextLayerData) {
  return `${text.fontStyle} ${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;
}

function trackedWidth(ctx: CanvasRenderingContext2D, line: string, tracking: number) {
  if (!line) return 0;
  return [...line].reduce((sum, character) => sum + ctx.measureText(character).width, 0)
    + Math.max(0, [...line].length - 1) * tracking;
}

export function getTextLayerBounds(
  text: TextLayerData,
  context?: CanvasRenderingContext2D
): TextBounds {
  const canvas = !context && typeof document !== 'undefined' ? document.createElement('canvas') : null;
  const ctx = context ?? canvas?.getContext('2d');
  const lines = text.content.split('\n');
  const fallbackWidth = Math.max(1, ...lines.map(line => line.length * text.fontSize * 0.6));
  let width = fallbackWidth;
  if (ctx) {
    ctx.save();
    ctx.font = textFont(text);
    width = Math.max(1, ...lines.map(line => trackedWidth(ctx, line || ' ', text.tracking ?? 0)));
    ctx.restore();
  }
  const scaleX = text.scaleX ?? 1;
  const scaleY = text.scaleY ?? 1;
  const anchorOffset = (text.align === 'center' ? width / 2 : text.align === 'right' ? width : 0) * scaleX;
  const height = Math.max(text.fontSize, lines.length * text.fontSize * text.lineHeight) * scaleY;
  // Unrotated bounds around the anchor - rotation is carried separately by the transform box.
  return {x: text.x - anchorOffset, y: text.y, w: Math.max(1, width * scaleX), h: height};
}

function drawTextLines(ctx: CanvasRenderingContext2D, text: TextLayerData) {
  ctx.save();
  ctx.font = textFont(text);
  ctx.fillStyle = text.color;
  ctx.strokeStyle = text.strokeColor ?? '#000000';
  ctx.lineWidth = Math.max(0, text.strokeWidth ?? 0) * 2;
  ctx.lineJoin = 'round';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const step = text.fontSize * text.lineHeight;
  text.content.split('\n').forEach((line, index) => {
    const width = trackedWidth(ctx, line, text.tracking ?? 0);
    let x = text.align === 'center' ? text.x - width / 2 : text.align === 'right' ? text.x - width : text.x;
    const y = text.y + index * step;
    for (const character of [...line]) {
      if ((text.strokeWidth ?? 0) > 0) ctx.strokeText(character, x, y);
      ctx.fillText(character, x, y);
      x += ctx.measureText(character).width + (text.tracking ?? 0);
    }
    if (text.underline && width > 0) {
      ctx.beginPath();
      ctx.lineWidth = Math.max(1, text.fontSize / 16);
      ctx.strokeStyle = text.color;
      ctx.moveTo(text.align === 'center' ? text.x - width / 2 : text.align === 'right' ? text.x - width : text.x, y + text.fontSize * 1.04);
      ctx.lineTo(text.align === 'center' ? text.x + width / 2 : text.align === 'right' ? text.x : text.x + width, y + text.fontSize * 1.04);
      ctx.stroke();
    }
  });
  ctx.restore();
}

// A free-transformed text layer keeps its glyphs as text: the scale and rotation are applied to
// the canvas around the anchor at draw time, so it stays crisp and re-editable.
export function drawTextLayer(ctx: CanvasRenderingContext2D, text: TextLayerData) {
  const scaleX = text.scaleX ?? 1;
  const scaleY = text.scaleY ?? 1;
  const rotation = text.rotation ?? 0;
  if (!rotation && scaleX === 1 && scaleY === 1) {
    drawTextLines(ctx, text);
    return;
  }
  ctx.save();
  ctx.translate(text.x, text.y);
  if (rotation) ctx.rotate(rotation * Math.PI / 180);
  ctx.scale(scaleX, scaleY);
  drawTextLines(ctx, {...text, x: 0, y: 0});
  ctx.restore();
}

export function renderTextLayer(canvas: HTMLCanvasElement, text: TextLayerData) {
  const ctx = canvas.getContext('2d');
  if (ctx) drawTextLayer(ctx, text);
  return canvas;
}
