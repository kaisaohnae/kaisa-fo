'use client';

import {useEffect, useRef} from 'react';
import {getVisibleExampleLinks, WINDOWS_APP_DOWNLOADS} from '@/modules/example';
import HeroBrowserIcons from '@/components/home/hero-browser-icons';
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
      <div className="site-shell">
        <div className="hero__inner site-shell__inner">
          <div className="hero__content">
            <p className="hero__eyebrow reveal reveal--1">
              Simple is Great
            </p>

            <h1 className="hero__title reveal reveal--2">
              <span className="hero__title-line">Design</span>
              <span className="hero__title-line hero__title-line--accent">Develop</span>
              <span className="hero__title-line">Plan</span>
            </h1>

            <p className="hero__desc reveal reveal--3">
              아이디어를 설계하고, 디자인하고, 코드로 완성해 온 풀스택 프로덕트 메이커입니다.
            </p>

            {visibleExampleLinks.length > 0 && (
              <div className="hero__examples reveal reveal--4">
                <HeroBrowserIcons />
                <div className="hero__examples-list">
                  {visibleExampleLinks.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      className="hero__example-link"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {WINDOWS_APP_DOWNLOADS.length > 0 && (
              <div className="hero__windows reveal reveal--5">
                <div className="hero__windows-label">
                  <span className="hero__windows-icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M0 2.2 6.7 1.3v6.2H0zm7.5-.9L16 0v7.5H7.5zM0 8.8h6.7v6.2L0 13.9zm7.5 0H16V16l-8.5-1.2z" />
                    </svg>
                  </span>
                  <span>Windows</span>
                </div>
                <div className="hero__windows-list">
                  {WINDOWS_APP_DOWNLOADS.map((app) => (
                    <a
                      key={app.id}
                      href={app.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`hero__windows-link hero__windows-link--${app.tone}`}
                      download
                    >
                      <span className="hero__windows-link-text">{app.label}</span>
                      <span className="hero__windows-link-icon" aria-hidden="true">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 1.5a.75.75 0 0 1 .75.75v6.69l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06l2.22 2.22V2.25A.75.75 0 0 1 8 1.5Z" />
                          <path d="M2.5 12.25a.75.75 0 0 1 .75-.75h9.5a.75.75 0 0 1 0 1.5h-9.5a.75.75 0 0 1-.75-.75Z" />
                        </svg>
                      </span>
                    </a>
                  ))}
                </div>
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
