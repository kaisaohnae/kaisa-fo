'use client';

import {useEffect} from 'react';
import HeroSection from '@/components/home/hero-section';
import ExpertiseSection from '@/components/home/expertise-section';
import WorksSection from '@/components/home/works-section';
import IllustrationSection from '@/components/home/illustration-section';

export default function PortfolioPage() {
  useEffect(() => {
    document.body.classList.add('page-home');
    window.scrollTo({top: 0, behavior: 'auto'});
    return () => document.body.classList.remove('page-home');
  }, []);

  return (
    <div className="portfolio">
      <HeroSection />
      <ExpertiseSection />
      <WorksSection />
      <IllustrationSection />
    </div>
  );
}
