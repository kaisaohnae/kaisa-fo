import {MAX_ZOOM, MIN_ZOOM, ZOOM_LEVELS} from './constants';

export type ViewportRect = Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>;

export function getViewOrigin(viewW: number, viewH: number, pan: {x: number; y: number}, zoom: number, width: number, height: number) {
  return {dx: viewW / 2 + pan.x - width * zoom / 2, dy: viewH / 2 + pan.y - height * zoom / 2, vw: viewW, vh: viewH};
}

export function clientToDoc(clientX: number, clientY: number, rect: ViewportRect, pan: {x: number; y: number}, zoom: number, width: number, height: number) {
  const {dx, dy} = getViewOrigin(rect.width, rect.height, pan, zoom, width, height);
  return {x: (clientX - rect.left - dx) / zoom, y: (clientY - rect.top - dy) / zoom};
}

export function clampZoom(zoom: number) {
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
}

// Steps zoom to the next/previous fixed level in ZOOM_LEVELS (10%, 25%, 50%, 75%, 100%, 125%, ...
// up to 2000%), matching Photoshop's Zoom In/Out increments instead of a smooth multiplier.
export function stepZoomLevel(current: number, direction: 1 | -1) {
  const pct = current * 100;
  if (direction === 1) {
    const next = ZOOM_LEVELS.find(level => level * 100 > pct + 0.01);
    return next ?? MAX_ZOOM;
  }
  let prev = MIN_ZOOM;
  for (const level of ZOOM_LEVELS) {
    if (level * 100 >= pct - 0.01) break;
    prev = level;
  }
  return prev;
}

export function fitZoom(viewW: number, viewH: number, docW: number, docH: number) {
  return clampZoom(Math.min(viewW / docW, viewH / docH) * .92);
}

// The pan that keeps document point `pt` glued under the same screen position (screenX, screenY)
// once the zoom changes to `newZoom` -- i.e. cursor/click-anchored zooming instead of always
// zooming relative to the canvas center. Used by the Zoom tool's click and by wheel-zoom.
export function panForZoomAnchor(
  pt: {x: number; y: number},
  screenX: number,
  screenY: number,
  viewW: number,
  viewH: number,
  newZoom: number,
  width: number,
  height: number
) {
  return {
    x: screenX - viewW / 2 + (width * newZoom) / 2 - pt.x * newZoom,
    y: screenY - viewH / 2 + (height * newZoom) / 2 - pt.y * newZoom
  };
}
