import {getTextLayerBounds, type TextBounds} from './text';
import type {ShapeLayerData, TextLayerData} from './types';

// Free-transform geometry. A transform box is the axis-aligned rect (x, y, w, h) rotated by
// `rotation` degrees around its own centre - the same model Photoshop uses, and the model the
// canvas renderer, the shape layers and the text layers all agree on.

export type TransformBox = {x: number; y: number; w: number; h: number; rotation: number};
export type TransformHandle = 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se' | 'move' | 'rotate';
export type ResizeHandle = Exclude<TransformHandle, 'move' | 'rotate'>;

type Point = {x: number; y: number};

// Which corner/edge each handle pulls, as a direction from the centre.
const HANDLE_SIGNS: Record<ResizeHandle, {x: -1 | 0 | 1; y: -1 | 0 | 1}> = {
  nw: {x: -1, y: -1}, n: {x: 0, y: -1}, ne: {x: 1, y: -1},
  w: {x: -1, y: 0}, e: {x: 1, y: 0},
  sw: {x: -1, y: 1}, s: {x: 0, y: 1}, se: {x: 1, y: 1}
};

export const RESIZE_HANDLES = Object.keys(HANDLE_SIGNS) as ResizeHandle[];

export function boxCenter(box: {x: number; y: number; w: number; h: number}): Point {
  return {x: box.x + box.w / 2, y: box.y + box.h / 2};
}

export function rotatePoint(point: Point, center: Point, degrees: number): Point {
  const radians = degrees * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {x: center.x + dx * cos - dy * sin, y: center.y + dx * sin + dy * cos};
}

// Folds a rotation back into (-180, 180] so the readout never drifts to 720 degrees.
export function normalizeRotation(degrees: number) {
  const wrapped = ((degrees + 180) % 360 + 360) % 360 - 180;
  return wrapped === -180 ? 180 : wrapped;
}

// Where a handle sits in document space, following the box's rotation.
export function handlePoint(box: TransformBox, handle: ResizeHandle): Point {
  const sign = HANDLE_SIGNS[handle];
  const center = boxCenter(box);
  return rotatePoint(
    {x: center.x + sign.x * box.w / 2, y: center.y + sign.y * box.h / 2},
    center,
    box.rotation
  );
}

export function transformBoxCorners(box: TransformBox): Point[] {
  return (['nw', 'ne', 'se', 'sw'] as ResizeHandle[]).map(handle => handlePoint(box, handle));
}

// Hit test in the box's own unrotated frame: handles first, then inside (move), then the ring
// just outside the box, which rotates - the way Photoshop picks up rotation past a corner.
export function hitTransformTarget(
  point: Point, box: TransformBox, tolerance: number, rotateBand = tolerance * 3
): TransformHandle | null {
  const center = boxCenter(box);
  const local = rotatePoint(point, center, -box.rotation);
  for (const handle of RESIZE_HANDLES) {
    const sign = HANDLE_SIGNS[handle];
    const hx = center.x + sign.x * box.w / 2;
    const hy = center.y + sign.y * box.h / 2;
    if (Math.hypot(local.x - hx, local.y - hy) <= tolerance) return handle;
  }
  const left = center.x - box.w / 2;
  const top = center.y - box.h / 2;
  if (local.x >= left && local.x <= left + box.w && local.y >= top && local.y <= top + box.h) return 'move';
  if (
    local.x >= left - rotateBand && local.x <= left + box.w + rotateBand
    && local.y >= top - rotateBand && local.y <= top + box.h + rotateBand
  ) return 'rotate';
  return null;
}

// Resizes `start` by a pointer delta given in document space. The delta is taken into the box's
// own frame first, so a rotated box resizes along its own axes, and the handle opposite the one
// being dragged stays pinned (or the centre stays pinned with `fromCenter`, Alt in Photoshop).
// `aspect` (Shift) keeps the original proportions.
export function resizeTransformBox(
  start: TransformBox,
  handle: ResizeHandle,
  delta: Point,
  options: {aspect?: boolean; fromCenter?: boolean} = {}
): TransformBox {
  const sign = HANDLE_SIGNS[handle];
  const local = rotatePoint(delta, {x: 0, y: 0}, -start.rotation);
  const pull = options.fromCenter ? 2 : 1;
  let w = sign.x === 0 ? start.w : Math.max(1, start.w + sign.x * local.x * pull);
  let h = sign.y === 0 ? start.h : Math.max(1, start.h + sign.y * local.y * pull);

  if (options.aspect) {
    const ratioX = sign.x === 0 ? null : w / start.w;
    const ratioY = sign.y === 0 ? null : h / start.h;
    const ratio = ratioX === null ? ratioY! : ratioY === null ? ratioX : Math.max(ratioX, ratioY);
    w = Math.max(1, start.w * ratio);
    h = Math.max(1, start.h * ratio);
  }

  if (options.fromCenter) {
    const center = boxCenter(start);
    return {x: center.x - w / 2, y: center.y - h / 2, w, h, rotation: start.rotation};
  }

  // Keep the opposite handle fixed in document space.
  const startCenter = boxCenter(start);
  const anchorLocal = {x: -sign.x * start.w / 2, y: -sign.y * start.h / 2};
  const anchor = rotatePoint(
    {x: startCenter.x + anchorLocal.x, y: startCenter.y + anchorLocal.y},
    startCenter,
    start.rotation
  );
  const nextAnchorLocal = {x: -sign.x * w / 2, y: -sign.y * h / 2};
  const spun = rotatePoint(nextAnchorLocal, {x: 0, y: 0}, start.rotation);
  const center = {x: anchor.x - spun.x, y: anchor.y - spun.y};
  return {x: center.x - w / 2, y: center.y - h / 2, w, h, rotation: start.rotation};
}

// Rotation follows the angle the pointer sweeps around the box centre; Shift snaps to 15 degrees.
export function rotateTransformBox(
  start: TransformBox, startPoint: Point, point: Point, snap = false
): TransformBox {
  const center = boxCenter(start);
  const from = Math.atan2(startPoint.y - center.y, startPoint.x - center.x);
  const to = Math.atan2(point.y - center.y, point.x - center.x);
  const degrees = start.rotation + (to - from) * 180 / Math.PI;
  return {...start, rotation: normalizeRotation(snap ? Math.round(degrees / 15) * 15 : degrees)};
}

export function moveTransformBox(start: TransformBox, delta: Point): TransformBox {
  return {...start, x: start.x + delta.x, y: start.y + delta.y};
}

// --- vector layers ---------------------------------------------------------------------------
// Shape layers rotate around their own centre, so a shape box maps to shape data one to one.

export function shapeToTransformBox(shape: ShapeLayerData): TransformBox {
  return {x: shape.x, y: shape.y, w: shape.w, h: shape.h, rotation: shape.rotation ?? 0};
}

export function shapeFromTransformBox(base: ShapeLayerData, box: TransformBox): ShapeLayerData {
  return {...base, x: box.x, y: box.y, w: box.w, h: box.h, rotation: normalizeRotation(box.rotation)};
}

// Text is drawn around its anchor (text.x/text.y), not around the centre of its bounds, so the
// two representations are converted through the anchor's offset inside the bounds.

export function textToTransformBox(text: TextLayerData, bounds: TextBounds): TransformBox {
  const rotation = text.rotation ?? 0;
  const unrotatedCenter = {x: bounds.x + bounds.w / 2, y: bounds.y + bounds.h / 2};
  const center = rotatePoint(unrotatedCenter, {x: text.x, y: text.y}, rotation);
  return {x: center.x - bounds.w / 2, y: center.y - bounds.h / 2, w: bounds.w, h: bounds.h, rotation};
}

export function textFromTransformBox(
  base: TextLayerData, baseBounds: TextBounds, box: TransformBox
): TextLayerData {
  const ratioX = baseBounds.w > 0 ? box.w / baseBounds.w : 1;
  const ratioY = baseBounds.h > 0 ? box.h / baseBounds.h : 1;
  const anchorOffsetX = (base.x - baseBounds.x) * ratioX;
  const anchorOffsetY = (base.y - baseBounds.y) * ratioY;
  const anchor = rotatePoint(
    {x: box.x + anchorOffsetX, y: box.y + anchorOffsetY},
    boxCenter(box),
    box.rotation
  );
  return {
    ...base,
    x: anchor.x,
    y: anchor.y,
    scaleX: (base.scaleX ?? 1) * ratioX,
    scaleY: (base.scaleY ?? 1) * ratioY,
    rotation: normalizeRotation(box.rotation)
  };
}

export function textLayerTransformBox(text: TextLayerData, context?: CanvasRenderingContext2D) {
  return textToTransformBox(text, getTextLayerBounds(text, context));
}
