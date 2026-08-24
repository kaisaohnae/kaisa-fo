import type {ReactNode} from 'react';

type Example4PageHeaderProps = {
  title: string;
  description: string;
  library: string;
  period?: string;
  asideLabel?: string;
  extra?: ReactNode;
};

export default function Example4PageHeader({
  title,
  description,
  library,
  period = '2026년 8월 2주',
  asideLabel = '\uCC28\uD2B8',
  extra,
}: Example4PageHeaderProps) {
  return (
    <header className="ex4-topbar">
      <div className="ex4-topbar__body">
        <p className="ex4-topbar__kicker">{period}</p>
        <h1 className="ex4-topbar__title">{title}</h1>
        <p className="ex4-topbar__desc">{description}</p>
      </div>
      <div className="ex4-topbar__aside">
        {extra}
        <p className="ex4-topbar__lib">
          <span>{asideLabel}</span>
          {library}
        </p>
      </div>
    </header>
  );
}
