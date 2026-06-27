'use client';

import {useEffect, useState} from 'react';
import HeroSection from '@/components/home/hero-section';
import ExpertiseSection from '@/components/home/expertise-section';
import WorksSection from '@/components/home/works-section';
import IllustrationSection from '@/components/home/illustration-section';
import {scrollToSection, type PortfolioSection} from '@/etc/scroll-to-section';

type Props = {
  initialSection?: PortfolioSection;
};

export default function PortfolioPage({initialSection = 'home'}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.classList.add('page-home');
    return () => document.body.classList.remove('page-home');
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (initialSection === 'home') {
      window.scrollTo({top: 0, behavior: 'auto'});
      return;
    }

    const timer = window.setTimeout(() => {
      scrollToSection(initialSection, 'auto');
    }, 50);

    return () => window.clearTimeout(timer);
  }, [mounted, initialSection]);

  if (!mounted) return null;

  return (
    <div className="portfolio">
      <HeroSection />
      <ExpertiseSection />
      <WorksSection />
      <IllustrationSection />
    </div>
  );
}
