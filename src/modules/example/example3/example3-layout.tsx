'use client';

import IconLogo from '@/components/icons/common/icon-logo';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import type {ReactNode} from 'react';
import {ExampleSidebarToggle} from '../shared/example-mobile-nav';
import {useExampleMobileNav} from '../shared/use-example-mobile-nav';
import Example3NavIcon from './example3-nav-icon';
import {isNavActive, NAV_ITEMS} from './nav';

export default function Example3Layout({children}: {children: ReactNode}) {
  const pathname = usePathname();
  const {open, toggle, close} = useExampleMobileNav();

  return (
    <div className="ex3 kaisa-kit">
      <aside className={open ? 'kaisa-sidebar kaisa-sidebar--open' : 'kaisa-sidebar'}>
        <div className="kaisa-sidebar__brand">
          <div className="kaisa-sidebar__logo">
            <Link href="/" aria-label="메인으로 이동">
              <IconLogo width={92} height={39} />
            </Link>
          </div>
          <ExampleSidebarToggle shell="kaisa" open={open} onToggle={toggle} />
        </div>

        <nav id="kaisa-sidebar-nav" className="kaisa-sidebar__nav" aria-label="UI kit menu">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={
                isNavActive(item.href, pathname)
                  ? 'kaisa-sidebar__link kaisa-sidebar__link--active'
                  : 'kaisa-sidebar__link'
              }
              onClick={close}
            >
              <Example3NavIcon name={item.id} className="kaisa-sidebar__icon" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="kaisa-main">{children}</div>
    </div>
  );
}
