'use client';

import {useEffect, useRef} from 'react';
import illustrationList from '@/data/illustration-list';

export default function IllustrationSection() {
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
    <section id="illustration" ref={sectionRef} className="illustration-section">
      <div className="site-shell">
        <header className="page-hero site-shell__inner">
          <span className="page-hero__label">Gallery</span>
          <h2 className="page-hero__title">Illustration</h2>
          <p className="page-hero__desc">직접 그린그림입니다</p>
        </header>

        <ul className="illustration-grid site-shell__inner">
          {illustrationList.map((item, idx) => (
            <li key={idx}>
              <img src={item.url} alt="" loading="lazy" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
