'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import usePortfolioNav from '@/hooks/use-portfolio-nav';
import type {PortfolioSection} from '@/etc/scroll-to-section';

const MENU_ITEMS: {section: PortfolioSection; label: string; href: string}[] = [
  {section: 'home', label: 'Home', href: '/'},
  {section: 'works', label: 'Works', href: '/works/'},
  {section: 'illustrator', label: 'Illustration', href: '/illustrator/'},
];

export default function Menu() {
  const [mounted, setMounted] = useState(false);
  const [isFixed, setFixed] = useState(false);
  const {isPortfolio, activeSection, navigateToSection} = usePortfolioNav();

  useEffect(() => {
    setMounted(true);
    const handleFixed = () => {
      setFixed(window.scrollY >= 80);
    };
    window.addEventListener('scroll', handleFixed, {passive: true});
    handleFixed();
    return () => window.removeEventListener('scroll', handleFixed);
  }, []);

  if (!mounted) return null;

  return (
    <nav id="menu" className={isFixed ? 'menu--fixed' : ''} aria-label="Main navigation">
      <ul className="menu__list">
        {MENU_ITEMS.map((item) => {
          const isActive = isPortfolio && activeSection === item.section;

          return (
            <li
              key={item.section}
              className={isActive ? 'menu__item menu__item--active' : 'menu__item'}
            >
              {isPortfolio ? (
                <button
                  type="button"
                  className="menu__link"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => navigateToSection(item.section)}
                >
                  {item.label}
                </button>
              ) : (
                <Link href={item.href} className="menu__link">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
