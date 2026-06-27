'use client';

import {useEffect, useRef} from 'react';
import WorkGrid from '@/components/works/work-grid';
import worksList from '@/data/worksList';

export default function WorksSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.disconnect();
        }
      },
      {threshold: 0.1}
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="works" ref={sectionRef} className="works-section">
      <div className="site-shell">
        <header className="page-hero site-shell__inner">
          <span className="page-hero__label">Portfolio</span>
          <h2 className="page-hero__title">Works</h2>
          <p className="page-hero__desc">
            2005년부터 현재까지, 국내외 브랜드와 스타트업에서
            <br className="hero__br" />
            기획 · 디자인 · 개발을 함께해온 프로젝트 기록입니다.
          </p>
        </header>

        <WorkGrid items={worksList} className="site-shell__inner" />
      </div>
    </section>
  );
}
