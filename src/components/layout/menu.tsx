'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

export default function Menu() {
  let pathname = usePathname();
  if (pathname && pathname.match('/blog')) {
    pathname = '/blog';
  }
  const [mounted, setMounted] = useState<boolean>(false);
  const [isFixed, setFixed] = useState(false);
  useEffect(() => {
    setMounted(true);
    const handleFixed = () => {
      if (window.scrollY >= 109) {
        setFixed(true);
      } else {
        setFixed(false);
      }
    };
    window.addEventListener('scroll', handleFixed, true);
    return window.removeEventListener('scroll', handleFixed);
  }, []);
  return (
    mounted &&
    <div id="menu" className={isFixed ? 'fixed' : ''}>
      <ul>
        <li className={pathname === '/works/' ? 'on' : ''}><Link href="/works/">Works</Link></li>
        <li className={pathname === '/illustrator/' ? 'on' : ''}><Link href="/illustrator/">Illustrator</Link></li>
        {/*<li className={pathname === '/blog/' ? 'on' : ''}><Link href="/blog/">Blog</Link></li>*/}
      </ul>
    </div>
  );
}
