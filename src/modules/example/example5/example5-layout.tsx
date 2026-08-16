'use client';

import IconLogo from '@/components/icons/common/icon-logo';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import type {ReactNode} from 'react';
import {ExampleSidebarToggle} from '../shared/example-mobile-nav';
import {useExampleMobileNav} from '../shared/use-example-mobile-nav';
import Example5NavIcon from './example5-nav-icon';
import {isNavActive, NAV_ITEMS} from './nav';

export default function Example5Layout({children}: {children: ReactNode}) {
  const pathname = usePathname();
  const {open, toggle, close} = useExampleMobileNav();

  return (
    <div className="ex5 ex5-kit">
      <aside className={open ? 'ex5-sidebar ex5-sidebar--open' : 'ex5-sidebar'}>
        <div className="ex5-sidebar__brand">
          <div className="ex5-sidebar__logo">
            <Link href="/" aria-label="메인으로 이동">
              <IconLogo width={92} height={39} />
            </Link>
          </div>
          <ExampleSidebarToggle shell="ex5" open={open} onToggle={toggle} />
        </div>

        <nav id="ex5-sidebar-nav" className="ex5-sidebar__nav" aria-label="UI kit menu">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={
                isNavActive(item.href, pathname)
                  ? 'ex5-sidebar__link ex5-sidebar__link--active'
                  : 'ex5-sidebar__link'
              }
              onClick={close}
            >
              <Example5NavIcon name={item.id} className="ex5-sidebar__icon" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="ex5-main">{children}</div>
    </div>
  );
}
