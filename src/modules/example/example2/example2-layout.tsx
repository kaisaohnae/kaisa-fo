'use client';

import IconLogo from '@/components/icons/common/icon-logo';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import type {ReactNode} from 'react';
import Example2NavIcon from './example2-nav-icon';
import {isNavActive, NAV_ITEMS} from './nav';

export default function Example2Layout({children}: {children: ReactNode}) {
  const pathname = usePathname();

  return (
    <div className="ex2">
      <aside className="ex2-sidebar">
        <div className="ex2-sidebar__brand">
          <div className="ex2-sidebar__logo">
            <IconLogo width={92} height={39} />
          </div>
        </div>

        <nav className="ex2-sidebar__nav" aria-label="충전소 관리 메뉴">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={
                isNavActive(item.href, pathname)
                  ? 'ex2-sidebar__link ex2-sidebar__link--active'
                  : 'ex2-sidebar__link'
              }
            >
              <Example2NavIcon name={item.id} className="ex2-sidebar__icon" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="ex2-main">{children}</div>
    </div>
  );
}
