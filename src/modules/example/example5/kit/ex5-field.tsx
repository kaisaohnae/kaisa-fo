import type {ReactNode} from 'react';
import {joinClasses} from './lib';

export type Ex5FieldProps = {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
};

export function Ex5Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  disabled,
  children,
  className,
}: Ex5FieldProps) {
  return (
    <div
      className={joinClasses(
        'ex5k-field',
        error && 'ex5k-field--invalid',
        disabled && 'ex5k-field--disabled',
        className,
      )}
    >
      <div className="ex5k-field__control">
        {label ? (
          <label
            htmlFor={htmlFor}
            className={joinClasses('ex5k-field__label', required && 'ex5k-field__label--required')}
          >
            {label}
          </label>
        ) : null}
        {children}
      </div>
      {error ? <span className="ex5k-field__error">{error}</span> : null}
      {!error && hint ? <span className="ex5k-field__hint">{hint}</span> : null}
    </div>
  );
}
