import {type Dispatch, type MutableRefObject, type RefObject, type SetStateAction, useCallback, useRef} from 'react';
import {
  clearSelectionArea,
  cloneCanvas,
  copySelectionArea,
  createLayerCanvas,
  drawTransformedImage,
  getOpaqueBounds,
  getTextLayerBounds,
  shapeFromTransformBox,
  shapeToTransformBox,
  textFromTransformBox,
  textToTransformBox,
  type PhotoLayer,
  type PhotoSelection,
  type PhotoTool,
  type ShapeLayerData,
  type TextBounds,
  type TextLayerData,
  type TransformBox,
  type TransformState
} from '@/modules/photo';

// Free-transform lifecycle for the active layer, Photoshop-style: Ctrl+T picks up whatever the
// layer holds, the box can be scaled/rotated, Enter applies and Esc restores.
//
// A raster layer is cut into a floating source canvas that gets drawn back transformed, because
// its content only exists as pixels. A shape or text layer instead has its own data rewritten
// live from the box on every drag, so the result stays vector - crisp, re-editable, and undone
// by simply putting the original data back.
export function usePhotoTransformTool({
  hasDoc,
  activeLayer,
  selection,
  width,
  height,
  transform,
  transformSourceRef,
  selectionMaskRef,
  buffersRef,
  pushHistory,
  setTransform,
  setLayers,
  setTool,
  setSelection,
  setStatus
}: {
  hasDoc: boolean;
  activeLayer: PhotoLayer | null;
  selection: PhotoSelection | null;
  width: number;
  height: number;
  transform: TransformState | null;
  transformSourceRef: MutableRefObject<HTMLCanvasElement | null>;
  selectionMaskRef: MutableRefObject<HTMLCanvasElement | null>;
  buffersRef: RefObject<Map<string, HTMLCanvasElement>>;
  pushHistory: (label: string) => void;
  setTransform: Dispatch<SetStateAction<TransformState | null>>;
  setLayers: Dispatch<SetStateAction<PhotoLayer[]>>;
  setTool: (tool: PhotoTool) => void;
  setSelection: Dispatch<SetStateAction<PhotoSelection | null>>;
  setStatus: (status: string) => void;
}) {
  const originalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseShapeRef = useRef<{layerId: string; shape: ShapeLayerData} | null>(null);
  const baseTextRef = useRef<{layerId: string; text: TextLayerData; bounds: TextBounds} | null>(null);

  const startSession = useCallback((box: TransformBox, layerId: string, kind: TransformState['kind']) => {
    setTransform({...box, layerId, kind});
    setTool('transform');
    setSelection(null);
    selectionMaskRef.current = null;
    setStatus('Free Transform · drag to scale · Shift ratio · Alt from centre · outside corner rotates · Enter apply · Esc cancel');
  }, [selectionMaskRef, setSelection, setStatus, setTool, setTransform]);

  const beginTransform = useCallback(() => {
    if (transform) return;
    // A leftover floating source with no live transform means an abandoned session; drop it
    // rather than refusing every later Ctrl+T.
    if (transformSourceRef.current) transformSourceRef.current = null;
    if (!hasDoc) {
      setStatus('Open an image before transforming');
      return;
    }
    if (!activeLayer) {
      setStatus('Select a layer to transform');
      return;
    }
    if (activeLayer.locked) {
      setStatus('Unlock the layer before transforming');
      return;
    }
    if (activeLayer.kind === 'adjustment') {
      setStatus('An adjustment layer has nothing to transform');
      return;
    }
    // Start clean: a session abandoned by switching documents must not leave a base behind that
    // the next transform would write into.
    baseShapeRef.current = null;
    baseTextRef.current = null;
    originalCanvasRef.current = null;

    if (activeLayer.kind === 'shape' && activeLayer.shape) {
      pushHistory('Free Transform');
      baseShapeRef.current = {layerId: activeLayer.id, shape: {...activeLayer.shape}};
      startSession(shapeToTransformBox(activeLayer.shape), activeLayer.id, 'shape');
      return;
    }

    if (activeLayer.kind === 'text' && activeLayer.text) {
      pushHistory('Free Transform');
      const bounds = getTextLayerBounds(activeLayer.text);
      baseTextRef.current = {layerId: activeLayer.id, text: {...activeLayer.text}, bounds};
      startSession(textToTransformBox(activeLayer.text, bounds), activeLayer.id, 'text');
      return;
    }

    const canvas = buffersRef.current?.get(activeLayer.id);
    if (!canvas) return;
    originalCanvasRef.current = cloneCanvas(canvas);
    pushHistory('Free Transform');
    let box = selection;
    let source: HTMLCanvasElement;
    if (box && box.w > 0 && box.h > 0) {
      source = copySelectionArea(canvas, box, selectionMaskRef.current);
      clearSelectionArea(canvas, box, selectionMaskRef.current);
    } else {
      const bounds = getOpaqueBounds(canvas) ?? {x: 0, y: 0, w: width, h: height};
      box = {shape: 'rect', ...bounds};
      source = createLayerCanvas(bounds.w, bounds.h);
      const ctx = source.getContext('2d');
      if (ctx) ctx.drawImage(canvas, bounds.x, bounds.y, bounds.w, bounds.h, 0, 0, bounds.w, bounds.h);
      clearSelectionArea(canvas, {shape: 'rect', ...bounds});
    }
    transformSourceRef.current = source;
    startSession({x: box.x, y: box.y, w: box.w, h: box.h, rotation: 0}, activeLayer.id, 'raster');
  }, [hasDoc, activeLayer, selection, width, height, pushHistory, transform, transformSourceRef, selectionMaskRef, buffersRef, startSession, setStatus]);

  // The single entry point for changing the box mid-drag: it keeps the vector layer's own data
  // in step with the box, so what is on screen during the drag is already the real result.
  const setTransformBox = useCallback((box: TransformBox) => {
    setTransform(current => (current ? {...current, ...box} : current));
    const shapeBase = baseShapeRef.current;
    if (shapeBase) {
      setLayers(prev => prev.map(layer =>
        layer.id === shapeBase.layerId && layer.kind === 'shape'
          ? {...layer, shape: shapeFromTransformBox(shapeBase.shape, box)}
          : layer
      ));
      return;
    }
    const textBase = baseTextRef.current;
    if (textBase) {
      setLayers(prev => prev.map(layer =>
        layer.id === textBase.layerId && layer.kind === 'text'
          ? {...layer, text: textFromTransformBox(textBase.text, textBase.bounds, box)}
          : layer
      ));
    }
  }, [setLayers, setTransform]);

  const endSession = useCallback((status: string) => {
    setTransform(null);
    transformSourceRef.current = null;
    originalCanvasRef.current = null;
    baseShapeRef.current = null;
    baseTextRef.current = null;
    setTool('move');
    setStatus(status);
  }, [setStatus, setTool, setTransform, transformSourceRef]);

  const applyTransform = useCallback(() => {
    if (!transform) return;
    if (transform.kind === 'raster') {
      if (!transformSourceRef.current) return;
      const canvas = buffersRef.current?.get(transform.layerId);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawTransformedImage(
          ctx,
          transformSourceRef.current,
          transform.x,
          transform.y,
          transform.w,
          transform.h,
          transform.rotation
        );
      }
      endSession('Transform applied');
      pushHistory('Transform');
      return;
    }
    // Vector layers already hold the transformed data; there is nothing to bake in.
    endSession('Transform applied');
    pushHistory('Transform');
  }, [transform, transformSourceRef, buffersRef, pushHistory, endSession]);

  const cancelTransform = useCallback(() => {
    if (!transform) {
      setTransform(null);
      return;
    }
    const shapeBase = baseShapeRef.current;
    const textBase = baseTextRef.current;
    if (shapeBase) {
      setLayers(prev => prev.map(layer =>
        layer.id === shapeBase.layerId && layer.kind === 'shape' ? {...layer, shape: shapeBase.shape} : layer
      ));
    } else if (textBase) {
      setLayers(prev => prev.map(layer =>
        layer.id === textBase.layerId && layer.kind === 'text' ? {...layer, text: textBase.text} : layer
      ));
    } else if (originalCanvasRef.current) {
      buffersRef.current?.set(transform.layerId, originalCanvasRef.current);
    }
    endSession('Transform cancelled');
  }, [transform, buffersRef, setLayers, setTransform, endSession]);

  return {beginTransform, applyTransform, cancelTransform, setTransformBox};
}
