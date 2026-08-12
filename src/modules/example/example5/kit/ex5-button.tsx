import type {ButtonHTMLAttributes, ReactNode} from 'react';
import {joinClasses} from './lib';
import {Ex5Spinner} from './ex5-spinner';

export type Ex5ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type Ex5ButtonSize = 'sm' | 'md' | 'lg';

export type Ex5ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Ex5ButtonVariant;
  uiSize?: Ex5ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
};

export function Ex5Button({
  variant = 'primary',
  uiSize = 'md',
  loading = false,
  fullWidth = false,
  leadingIcon,
  className,
  type = 'button',
  disabled,
  children,
  ...props
}: Ex5ButtonProps) {
  return (
    <button
      type={type}
      className={joinClasses(
        'ex5k-btn',
        `ex5k-btn--${variant}`,
        `ex5k-btn--${uiSize}`,
        fullWidth && 'ex5k-btn--block',
        loading && 'ex5k-btn--loading',
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Ex5Spinner variant="ring" uiSize="sm" className="ex5k-btn__spinner" /> : leadingIcon}
      <span className="ex5k-btn__label">{children}</span>
    </button>
  );
}
