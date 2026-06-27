'use client';

import {useMemo} from 'react';
import type {ReactNode} from 'react';

type Example1PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export default function Example1PageHeader({title, description, actions}: Example1PageHeaderProps) {
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }).format(new Date()),
    [],
  );

  const pageTitle = title.replace(/\s*Example1\s*$/i, '').trim();

  return (
    <header className="ex1-topbar">
      <div className="ex1-topbar__body">
        <p className="ex1-topbar__label">{today}</p>
        <h1 className="ex1-topbar__title">
          {pageTitle}
          <span className="ex1-topbar__example"> Example1</span>
        </h1>
        <p className="ex1-topbar__desc">{description ?? ''}</p>
      </div>
      <div className="ex1-topbar__actions">{actions ?? null}</div>
    </header>
  );
}
