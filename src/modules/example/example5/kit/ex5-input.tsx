import type {InputHTMLAttributes} from 'react';
import {joinClasses} from './lib';

export type Ex5InputSize = 'sm' | 'md' | 'lg';

export type Ex5InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  uiSize?: Ex5InputSize;
  invalid?: boolean;
};

export function Ex5Input({
  uiSize = 'md',
  invalid,
  className,
  disabled,
  readOnly,
  placeholder = ' ',
  ...props
}: Ex5InputProps) {
  return (
    <input
      className={joinClasses(
        'ex5k-input',
        `ex5k-input--${uiSize}`,
        invalid && 'ex5k-input--invalid',
        disabled && 'ex5k-is-disabled',
        readOnly && 'ex5k-is-readonly',
        className,
      )}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
