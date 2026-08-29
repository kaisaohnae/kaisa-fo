'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

const MENU_ITEMS = [
  {label: 'Posts', href: '/posts/', match: (path: string) => path === '/' || path.startsWith('/posts')},
  {label: 'Works', href: '/works/', match: (path: string) => path.startsWith('/works')},
];

export default function Menu() {
  const pathname = usePathname() || '/';

  return (
    <nav id="menu" aria-label="Main navigation">
      <ul className="menu__list">
        {MENU_ITEMS.map((item) => {
          const isActive = item.match(pathname);

          return (
            <li
              key={item.href}
              className={isActive ? 'menu__item menu__item--active' : 'menu__item'}
            >
              <Link href={item.href} className="menu__link" aria-current={isActive ? 'page' : undefined}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
