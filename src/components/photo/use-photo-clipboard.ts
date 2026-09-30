import {useEffect, type Dispatch, type SetStateAction, type RefObject} from 'react';
import {canvasFromImageFile, createPlacedLayerCanvas, createRasterLayer, type PhotoLayer, type PhotoTool, type PhotoSelection} from '@/modules/photo';
type Props = {
  hasDoc: boolean; width: number; height: number;
  activeDocIdRef: RefObject<string>;
  buffersRef: RefObject<Map<string, HTMLCanvasElement>>;
  clipboardRef: RefObject<HTMLCanvasElement | null>;
  selectionMaskRef: RefObject<HTMLCanvasElement | null>;
  createDocument: (w: number, h: number, fill: 'white' | 'transparent' | 'bg', name?: string, seed?: HTMLCanvasElement) => void;
  pushHistory: (label: string) => void; pasteClipboard: () => void;
  setLayers: Dispatch<SetStateAction<PhotoLayer[]>>;
  setActiveLayerId: (id: string) => void;
  setSelection: (value: PhotoSelection | null) => void;
  setEditTarget: (value: 'layer' | 'mask') => void;
  setTool: (value: PhotoTool) => void; setStatus: (value: string) => void;
};
export function usePhotoClipboard({hasDoc, width, height, activeDocIdRef, buffersRef, clipboardRef, selectionMaskRef, createDocument, pushHistory, pasteClipboard, setLayers, setActiveLayerId, setSelection, setEditTarget, setTool, setStatus}: Props) {
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const files = Array.from(event.clipboardData?.items ?? [])
        .filter(item => item.type.startsWith('image/'))
        .map(item => item.getAsFile()).filter((file): file is File => file !== null);
      if (!files.length) {
        if (clipboardRef.current && hasDoc) {
          event.preventDefault();
          pasteClipboard();
        }
        return;
      }
      event.preventDefault();
      void (async () => {
        try {
          const documentId = activeDocIdRef.current;
          const images = await Promise.all(files.map(canvasFromImageFile));
          if (activeDocIdRef.current !== documentId) return;
          if (!hasDoc) {
            createDocument(images[0].width, images[0].height, 'transparent', 'Clipboard', images[0]);
            return;
          }
          pushHistory('Paste Image');
          const additions = images.map(image => {
            const layer = createRasterLayer('Pasted Image');
            // Keep the whole image: an image larger than the canvas grows its layer buffer
            // instead of being cropped to the document.
            const {canvas} = createPlacedLayerCanvas(width, height, image);
            buffersRef.current.set(layer.id, canvas);
            return layer;
          });
          setLayers(prev => [...prev, ...additions]);
          setActiveLayerId(additions[additions.length - 1].id);
          setSelection(null);
          selectionMaskRef.current = null;
          setEditTarget('layer');
          setTool('move');
          setStatus('Image pasted');
        } catch (error) {
          setStatus(error instanceof Error ? error.message : 'Paste failed');
        }
      })();
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [hasDoc, width, height, activeDocIdRef, buffersRef, clipboardRef, selectionMaskRef, createDocument, pushHistory, pasteClipboard, setLayers, setActiveLayerId, setSelection, setEditTarget, setTool, setStatus]);

}
