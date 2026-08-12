'use client';

import {useEffect} from 'react';
import {createPortal} from 'react-dom';
import {Ex5Button} from './ex5-button';

export type Ex5AlertProps = {
  open: boolean;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export function Ex5Alert({
  open,
  message,
  confirmText = 'OK',
  cancelText,
  onConfirm,
  onCancel,
}: Ex5AlertProps) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="ex5k-overlay" role="presentation">
      <div className="ex5k-dialog ex5k-dialog--alert" role="alertdialog" aria-live="assertive">
        <p className="ex5k-dialog__message">{message}</p>
        <div className="ex5k-dialog__actions">
          {cancelText ? (
            <Ex5Button variant="ghost" onClick={onCancel}>
              {cancelText}
            </Ex5Button>
          ) : null}
          <Ex5Button variant={cancelText ? 'danger' : 'primary'} onClick={onConfirm ?? onCancel}>
            {confirmText}
          </Ex5Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
