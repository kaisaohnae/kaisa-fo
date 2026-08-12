import type {ReactNode} from 'react';

type Example5StateCardProps = {
  label: string;
  children: ReactNode;
};

export default function Example5StateCard({label, children}: Example5StateCardProps) {
  return (
    <div className="ex5-state-card">
      <span className="ex5-state-card__label">{label}</span>
      <div className="ex5-state-card__body">{children}</div>
    </div>
  );
}
