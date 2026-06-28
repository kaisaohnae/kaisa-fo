'use client';

import type {ReactNode} from 'react';
import {useTodayLabel} from '../shared/use-today-label';

type Example2PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export default function Example2PageHeader({title, description, actions}: Example2PageHeaderProps) {
  const today = useTodayLabel();

  const pageTitle = title.replace(/\s*Example2\s*$/i, '').trim();

  return (
    <header className="ex2-topbar">
      <div className="ex2-topbar__body">
        <p className="ex2-topbar__label">{today}</p>
        <h1 className="ex2-topbar__title">
          {pageTitle}
          <span className="ex2-topbar__example"> Example2</span>
        </h1>
        <p className="ex2-topbar__desc">{description ?? ''}</p>
      </div>
      <div className="ex2-topbar__actions">{actions ?? null}</div>
    </header>
  );
}
