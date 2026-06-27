'use client';

import IconLogo from '@/components/icons/common/icon-logo';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import type {ReactNode} from 'react';
import Example3NavIcon from './example3-nav-icon';
import {isNavActive, NAV_ITEMS} from './nav';

export default function Example3Layout({children}: {children: ReactNode}) {
  const pathname = usePathname();

  return (
    <div className="ex3 ui-root">
      <aside className="ex3-sidebar">
        <div className="ex3-sidebar__brand">
          <div className="ex3-sidebar__logo">
            <IconLogo width={92} height={39} />
          </div>
        </div>

        <nav className="ex3-sidebar__nav" aria-label="UI 컴포넌트 쇼케이스 메뉴">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={
                isNavActive(item.href, pathname)
                  ? 'ex3-sidebar__link ex3-sidebar__link--active'
                  : 'ex3-sidebar__link'
              }
            >
              <Example3NavIcon name={item.id} className="ex3-sidebar__icon" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="ex3-main">{children}</div>
    </div>
  );
}
