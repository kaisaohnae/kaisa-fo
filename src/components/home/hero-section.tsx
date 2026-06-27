'use client';

import {useEffect, useRef} from 'react';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

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
          <p className="hero__eyebrow reveal reveal--1">
            Full-Stack Creative Developer
          </p>

          <h1 className="hero__title reveal reveal--2">
            <span className="hero__title-line">Design</span>
            <span className="hero__title-line hero__title-line--accent">Develop</span>
            <span className="hero__title-line">Plan</span>
          </h1>

          <p className="hero__desc reveal reveal--3">
            20년간 아이디어를 설계하고, 디자인하고, 코드로 완성해온
            {/*<br className="hero__br" />*/}
            풀스택 프로덕트 메이커입니다.
          </p>
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
