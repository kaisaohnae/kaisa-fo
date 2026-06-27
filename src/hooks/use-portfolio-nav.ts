'use client';

import {useCallback, useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';
import {
  isPortfolioPath,
  scrollToSection,
  type PortfolioSection,
} from '@/etc/scroll-to-section';

const SECTION_PATH: Record<PortfolioSection, string> = {
  home: '/',
  works: '/works/',
  illustrator: '/illustrator/',
};

function detectActiveSection(): PortfolioSection {
  if (window.scrollY < 80) return 'home';

  const offset = 120;
  const illustrator = document.getElementById('illustrator');
  const works = document.getElementById('works');

  if (illustrator && illustrator.getBoundingClientRect().top <= offset) {
    return 'illustrator';
  }
  if (works && works.getBoundingClientRect().top <= offset) {
    return 'works';
  }
  return 'home';
}

export default function usePortfolioNav() {
  const pathname = usePathname();
  const isPortfolio = isPortfolioPath(pathname);
  const [activeSection, setActiveSection] = useState<PortfolioSection>('home');

  useEffect(() => {
    if (!isPortfolio) return;

    const onScroll = () => {
      setActiveSection(detectActiveSection());
    };

    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, [isPortfolio]);

  const navigateToSection = useCallback(
    (section: PortfolioSection) => {
      if (!isPortfolio) return;

      if (section === 'home') {
        if (activeSection === 'home' && window.scrollY < 80) return;
        window.scrollTo({top: 0, behavior: 'smooth'});
      } else {
        if (activeSection === section) return;
        scrollToSection(section, 'smooth');
      }

      const path = SECTION_PATH[section];
      if (window.location.pathname !== path) {
        window.history.replaceState(null, '', path);
      }
    },
    [activeSection, isPortfolio]
  );

  return {
    isPortfolio,
    activeSection,
    navigateToSection,
  };
}
