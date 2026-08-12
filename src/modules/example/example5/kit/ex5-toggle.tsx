import type {InputHTMLAttributes, ReactNode} from 'react';
import {joinClasses} from './lib';

export type Ex5ToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: ReactNode;
  description?: ReactNode;
};

export function Ex5Toggle({label, description, className, disabled, ...props}: Ex5ToggleProps) {
  return (
    <label className={joinClasses('ex5k-toggle', disabled && 'is-disabled', className)}>
      <input type="checkbox" className="ex5k-toggle__input" disabled={disabled} {...props} />
      <span className="ex5k-toggle__track" aria-hidden="true">
        <span className="ex5k-toggle__thumb" />
      </span>
      <span className="ex5k-toggle__copy">
        <span className="ex5k-toggle__label">{label}</span>
        {description ? <span className="ex5k-toggle__desc">{description}</span> : null}
      </span>
    </label>
  );
}
