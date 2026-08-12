import {joinClasses} from './lib';

export type Ex5SpinnerVariant =
  | 'ring'
  | 'dots'
  | 'bars'
  | 'pulse'
  | 'orbit'
  | 'dash'
  | 'wave'
  | 'diamond';
export type Ex5SpinnerSize = 'sm' | 'md' | 'lg';

export type Ex5SpinnerProps = {
  variant?: Ex5SpinnerVariant;
  uiSize?: Ex5SpinnerSize;
  label?: string;
  className?: string;
};

export function Ex5Spinner({
  variant = 'ring',
  uiSize = 'md',
  label = 'Loading',
  className,
}: Ex5SpinnerProps) {
  const rootClass = joinClasses('ex5k-spinner', `ex5k-spinner--${variant}`, `ex5k-spinner--${uiSize}`, className);

  if (variant === 'dots') {
    return (
      <span className={rootClass} role="status" aria-label={label}>
        <i />
        <i />
        <i />
      </span>
    );
  }

  if (variant === 'bars') {
    return (
      <span className={rootClass} role="status" aria-label={label}>
        <i />
        <i />
        <i />
        <i />
      </span>
    );
  }

  if (variant === 'wave') {
    return (
      <span className={rootClass} role="status" aria-label={label}>
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
    );
  }

  if (variant === 'orbit') {
    return (
      <span className={rootClass} role="status" aria-label={label}>
        <span className="ex5k-spinner__core" />
        <span className="ex5k-spinner__sat" />
      </span>
    );
  }

  if (variant === 'pulse' || variant === 'diamond') {
    return <span className={rootClass} role="status" aria-label={label} />;
  }

  return (
    <span className={rootClass} role="status" aria-label={label}>
      <span className="ex5k-spinner__orbit" />
      {variant === 'ring' ? <span className="ex5k-spinner__orbit ex5k-spinner__orbit--alt" /> : null}
    </span>
  );
}
