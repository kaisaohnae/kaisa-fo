import type {ReactNode} from 'react';

type Example3StateCardProps = {
  label: string;
  children: ReactNode;
};

export default function Example3StateCard({label, children}: Example3StateCardProps) {
  return (
    <div className="kaisa-state-card">
      <span className="kaisa-state-card__label">{label}</span>
      <div className="kaisa-state-card__body">{children}</div>
    </div>
  );
}
