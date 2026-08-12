'use client';

import type {ReactNode} from 'react';
import {useTodayLabel} from '../shared/use-today-label';

type Example5PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export default function Example5PageHeader({title, description, actions}: Example5PageHeaderProps) {
  const today = useTodayLabel();

  const pageTitle = title.replace(/\s*Example5\s*$/i, '').trim();

  return (
    <header className="ex5-topbar">
      <div className="ex5-topbar__body">
        <p className="ex5-topbar__label">{today}</p>
        <h1 className="ex5-topbar__title">
          {pageTitle}
          <span className="ex5-topbar__example"> Example5</span>
        </h1>
        {description ? <p className="ex5-topbar__desc">{description}</p> : null}
      </div>
      <div className="ex5-topbar__actions">{actions ?? null}</div>
    </header>
  );
}
