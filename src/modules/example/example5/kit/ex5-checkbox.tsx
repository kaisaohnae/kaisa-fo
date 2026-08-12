import type {InputHTMLAttributes, ReactNode} from 'react';
import {joinClasses} from './lib';

export type Ex5CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: ReactNode;
  description?: ReactNode;
};

export function Ex5Checkbox({label, description, className, disabled, ...props}: Ex5CheckboxProps) {
  return (
    <label className={joinClasses('ex5k-check', disabled && 'is-disabled', description ? 'ex5k-check--desc' : undefined, className)}>
      <input type="checkbox" className="ex5k-check__input" disabled={disabled} {...props} />
      <span className="ex5k-check__chip">
        <span className="ex5k-check__mark" aria-hidden="true" />
        <span className="ex5k-check__copy">
          <span className="ex5k-check__label">{label}</span>
          {description ? <span className="ex5k-check__desc">{description}</span> : null}
        </span>
      </span>
    </label>
  );
}
