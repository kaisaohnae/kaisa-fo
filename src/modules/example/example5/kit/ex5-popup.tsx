'use client';

import {useEffect} from 'react';
import {createPortal} from 'react-dom';
import {Ex5Button} from './ex5-button';

export type Ex5PopupProps = {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  hideOnBackdrop?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export function Ex5Popup({
  open,
  title,
  message,
  confirmText = 'OK',
  cancelText,
  hideOnBackdrop = true,
  onConfirm,
  onCancel,
}: Ex5PopupProps) {
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
    <div
      className="ex5k-overlay"
      role="presentation"
      onClick={() => {
        if (hideOnBackdrop) onCancel?.();
      }}
    >
      <div
        className="ex5k-dialog ex5k-dialog--popup"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        {title ? <h3 className="ex5k-dialog__title">{title}</h3> : null}
        <p className="ex5k-dialog__message">{message}</p>
        <div className="ex5k-dialog__actions">
          {cancelText ? (
            <Ex5Button variant="ghost" onClick={onCancel}>
              {cancelText}
            </Ex5Button>
          ) : null}
          <Ex5Button onClick={onConfirm ?? onCancel}>{confirmText}</Ex5Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
