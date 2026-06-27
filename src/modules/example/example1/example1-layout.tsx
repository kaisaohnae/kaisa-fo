'use client';

import IconLogo from '@/components/icons/common/icon-logo';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import type {ReactNode} from 'react';
import {ExampleSidebarToggle} from '../shared/example-mobile-nav';
import {useExampleMobileNav} from '../shared/use-example-mobile-nav';
import Example1NavIcon from './example1-nav-icon';
import {isNavActive, NAV_ITEMS} from './nav';

export default function Example1Layout({children}: {children: ReactNode}) {
  const pathname = usePathname();
  const {open, toggle, close} = useExampleMobileNav();

  return (
    <div className="ex1">
      <aside className={open ? 'ex1-sidebar ex1-sidebar--open' : 'ex1-sidebar'}>
        <div className="ex1-sidebar__brand">
          <div className="ex1-sidebar__logo">
            <IconLogo width={92} height={39} />
          </div>
          <ExampleSidebarToggle shell="ex1" open={open} onToggle={toggle} />
        </div>

        <nav id="ex1-sidebar-nav" className="ex1-sidebar__nav" aria-label="관리 메뉴">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={
                isNavActive(item.href, pathname)
                  ? 'ex1-sidebar__link ex1-sidebar__link--active'
                  : 'ex1-sidebar__link'
              }
              onClick={close}
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
