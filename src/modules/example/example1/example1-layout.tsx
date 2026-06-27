'use client';

import IconLogo from '@/components/icons/common/icon-logo';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import type {ReactNode} from 'react';
import Example1NavIcon from './example1-nav-icon';
import {isNavActive, NAV_ITEMS} from './nav';

export default function Example1Layout({children}: {children: ReactNode}) {
  const pathname = usePathname();

  return (
    <div className="ex1">
      <aside className="ex1-sidebar">
        <div className="ex1-sidebar__brand">
          <div className="ex1-sidebar__logo">
            <IconLogo width={92} height={39} />
          </div>
        </div>

        <nav className="ex1-sidebar__nav" aria-label="관리 메뉴">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={
                isNavActive(item.href, pathname)
                  ? 'ex1-sidebar__link ex1-sidebar__link--active'
                  : 'ex1-sidebar__link'
              }
            >
              <Example1NavIcon name={item.id} className="ex1-sidebar__icon" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="ex1-main">{children}</div>
    </div>
  );
}
