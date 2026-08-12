'use client';

import IconLogo from '@/components/icons/common/icon-logo';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import type {ReactNode} from 'react';
import {ExampleSidebarToggle} from '../shared/example-mobile-nav';
import {useExampleMobileNav} from '../shared/use-example-mobile-nav';
import Example4NavIcon from './example4-nav-icon';
import {COMPANY, SITE_LABEL} from './data';
import {isNavActive, NAV_ITEMS} from './nav';

export default function Example4Layout({children}: {children: ReactNode}) {
  const pathname = usePathname();
  const {open, toggle, close} = useExampleMobileNav();

  return (
    <div className="ex4">
      <aside className={open ? 'ex4-sidebar ex4-sidebar--open' : 'ex4-sidebar'}>
        <div className="ex4-sidebar__brand">
          <div className="ex4-sidebar__logo">
            <IconLogo width={88} height={37} />
          </div>
          <ExampleSidebarToggle shell="ex4" open={open} onToggle={toggle} />
        </div>

        <div className="ex4-sidebar__meta">
          <strong>{COMPANY}</strong>
          <span>{SITE_LABEL} · example4</span>
        </div>

        <nav id="ex4-sidebar-nav" className="ex4-sidebar__nav" aria-label="대시보드 메뉴">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={
                isNavActive(item.href, pathname)
                  ? 'ex4-sidebar__link ex4-sidebar__link--active'
                  : 'ex4-sidebar__link'
              }
              onClick={close}
            >
              <Example4NavIcon name={item.id} className="ex4-sidebar__icon" />
              <span className="ex4-sidebar__label">{item.label}</span>
              <span className="ex4-sidebar__lib">{item.library}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="ex4-main">{children}</div>
    </div>
  );
}
