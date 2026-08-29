'use client';

import {createPortal} from 'react-dom';
import {KaisaSpinner, type KaisaSpinnerVariant} from './kaisa-spinner';

export type KaisaLoadingTone = 'light' | 'dark' | 'blur';

export type KaisaLoadingProps = {
  open: boolean;
  variant?: KaisaSpinnerVariant;
  message?: string;
  overlay?: KaisaLoadingTone;
};

export function KaisaLoading({
  open,
  variant = 'ring',
  message,
  overlay = 'blur',
}: KaisaLoadingProps) {
  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className={`kaisa-loading kaisa-loading--${overlay}`} role="status" aria-live="polite">
      <div className="kaisa-loading__card">
        <KaisaSpinner variant={variant} uiSize="lg" />
        {message ? <p>{message}</p> : null}
      </div>
    </div>,
    document.body,
  );
}
