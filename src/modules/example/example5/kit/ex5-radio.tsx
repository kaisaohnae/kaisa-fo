import type {InputHTMLAttributes, ReactNode} from 'react';
import {joinClasses} from './lib';

export type Ex5RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: ReactNode;
  description?: ReactNode;
};

export function Ex5Radio({label, description, className, disabled, ...props}: Ex5RadioProps) {
  return (
    <label className={joinClasses('ex5k-radio', disabled && 'is-disabled', className)}>
      <input type="radio" className="ex5k-radio__input" disabled={disabled} {...props} />
      <span className="ex5k-radio__card">
        <span className="ex5k-radio__mark" aria-hidden="true" />
        <span className="ex5k-radio__copy">
          <span className="ex5k-radio__label">{label}</span>
          {description ? <span className="ex5k-radio__desc">{description}</span> : null}
        </span>
      </span>
    </label>
  );
}

export type Ex5RadioGroupProps = {
  children: ReactNode;
  row?: boolean;
  className?: string;
  invalid?: boolean;
  'aria-label'?: string;
};

export function Ex5RadioGroup({
  children,
  row,
  className,
  invalid,
  'aria-label': ariaLabel,
}: Ex5RadioGroupProps) {
  return (
    <div
      className={joinClasses(
        'ex5k-radio-group',
        row && 'ex5k-radio-group--row',
        invalid && 'ex5k-radio-group--invalid',
        className,
      )}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
    >
      {children}
    </div>
  );
}
