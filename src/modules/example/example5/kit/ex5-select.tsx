import type {SelectHTMLAttributes} from 'react';
import {joinClasses} from './lib';

export type Ex5SelectSize = 'sm' | 'md' | 'lg';

export type Ex5SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  uiSize?: Ex5SelectSize;
  invalid?: boolean;
};

export function Ex5Select({
  uiSize = 'md',
  invalid,
  className,
  disabled,
  children,
  ...props
}: Ex5SelectProps) {
  return (
    <span className={joinClasses('ex5k-select-wrap', `ex5k-select-wrap--${uiSize}`, disabled && 'is-disabled')}>
      <select
        className={joinClasses(
          'ex5k-select',
          `ex5k-select--${uiSize}`,
          invalid && 'ex5k-select--invalid',
          disabled && 'ex5k-is-disabled',
          className,
        )}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        {...props}
      >
        {children}
      </select>
    </span>
  );
}
