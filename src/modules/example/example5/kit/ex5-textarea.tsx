import type {TextareaHTMLAttributes} from 'react';
import {joinClasses} from './lib';

export type Ex5TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export function Ex5Textarea({
  invalid,
  className,
  disabled,
  readOnly,
  placeholder = ' ',
  ...props
}: Ex5TextareaProps) {
  return (
    <textarea
      className={joinClasses(
        'ex5k-textarea',
        invalid && 'ex5k-textarea--invalid',
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
