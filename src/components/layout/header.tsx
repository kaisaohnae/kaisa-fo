'use client';

import React, {useEffect} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import Menu from './menu';
import ThemeToggle from './theme-toggle';
import IconLogo from '@/components/icons/common/icon-logo';
import usePortfolioNav from '@/hooks/use-portfolio-nav';

export default function Header() {
  const pathname = usePathname();
  const {isPortfolio, navigateToSection} = usePortfolioNav();

  useEffect(() => {
    if (!isPortfolio) return;

    const onScroll = () => {
      document.body.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isPortfolio]);

  return (
    <header id="header" className={isPortfolio ? 'header--home' : 'header--sub'}>
      <div className="site-shell site-shell--header">
        <div className="header__inner site-shell__inner">
        <h1 className="header__logo">
          {isPortfolio ? (
            <button
              type="button"
              className="header__logo-btn"
              aria-label="Kaisa Home"
              onClick={() => navigateToSection('home')}
            >
              <IconLogo width={100} height={42} />
            </button>
          ) : (
            <Link href="/" aria-label="Kaisa Home">
              <IconLogo width={100} height={42} />
            </Link>
          )}
        </h1>
          <div className="header__actions">
            <Menu />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
