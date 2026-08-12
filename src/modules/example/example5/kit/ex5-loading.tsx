'use client';

import {createPortal} from 'react-dom';
import {Ex5Spinner, type Ex5SpinnerVariant} from './ex5-spinner';

export type Ex5LoadingTone = 'light' | 'dark' | 'blur';

export type Ex5LoadingProps = {
  open: boolean;
  variant?: Ex5SpinnerVariant;
  message?: string;
  overlay?: Ex5LoadingTone;
};

export function Ex5Loading({
  open,
  variant = 'ring',
  message,
  overlay = 'blur',
}: Ex5LoadingProps) {
  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className={`ex5k-loading ex5k-loading--${overlay}`} role="status" aria-live="polite">
      <div className="ex5k-loading__card">
        <Ex5Spinner variant={variant} uiSize="lg" />
        {message ? <p>{message}</p> : null}
      </div>
    </div>,
    document.body,
  );
}
