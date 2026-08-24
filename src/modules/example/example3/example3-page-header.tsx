'use client';

import type {ReactNode} from 'react';
import {useTodayLabel} from '../shared/use-today-label';

type Example3PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export default function Example3PageHeader({title, description, actions}: Example3PageHeaderProps) {
  const today = useTodayLabel();

  const pageTitle = title.replace(/\s*Example3\s*$/i, '').trim();

  return (
    <header className="ex3-topbar">
      <div className="ex3-topbar__body">
        <p className="ex3-topbar__label">{today}</p>
        <h1 className="ex3-topbar__title">
          {pageTitle}
          <span className="ex3-topbar__example"> Example3</span>
        </h1>
        {description ? <p className="ex3-topbar__desc">{description}</p> : null}
      </div>
      <div className="ex3-topbar__actions">{actions ?? null}</div>
    </header>
  );
}
