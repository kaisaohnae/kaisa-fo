'use client';

import {useEffect, useRef} from 'react';
import {getVisibleExampleLinks} from '@/modules/example';
import HeroKoreaMap from '@/components/home/hero-korea-map';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const visibleExampleLinks = getVisibleExampleLinks();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.classList.add('is-visible');
    });
  }, []);

  return (
    <section id="home" ref={sectionRef} className="hero">
      <div className="hero__bg">
        <div className="hero__gradient" />
        <div className="hero__grid" aria-hidden="true" />
      </div>

      <div className="site-shell">
        <div className="hero__inner site-shell__inner">
          <div className="hero__content">
            <p className="hero__eyebrow reveal reveal--1">
              Full-Stack Creative Developer
            </p>

            <h1 className="hero__title reveal reveal--2">
              <span className="hero__title-line">Design</span>
              <span className="hero__title-line hero__title-line--accent">Develop</span>
              <span className="hero__title-line">Plan</span>
            </h1>

            <p className="hero__desc reveal reveal--3">
              아이디어를 설계하고, 디자인하고, 코드로 완성해온
              {/*<br className="hero__br" />*/}
              풀스택 프로덕트 메이커입니다.
            </p>

            {visibleExampleLinks.length > 0 && (
              <div className="hero__examples reveal reveal--4">
                {visibleExampleLinks.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero__example-link"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <HeroKoreaMap />
        </div>
      </div>

      <button
        type="button"
        className="hero__scroll"
        aria-label="아래로 스크롤"
        onClick={() => document.getElementById('expertise')?.scrollIntoView({behavior: 'smooth'})}
      >
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </button>
    </section>
  );
}
