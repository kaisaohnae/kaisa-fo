'use client';

import {useEffect, useRef} from 'react';
import illustratorList from '@/data/illustratorList';

export default function IllustratorSection() {
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
    <section id="illustrator" ref={sectionRef} className="illustrator-section">
      <div className="site-shell">
        <header className="page-hero site-shell__inner">
          <span className="page-hero__label">Gallery</span>
          <h2 className="page-hero__title">Illustration</h2>
        </header>

        <ul className="illustrator-grid site-shell__inner">
          {illustratorList.map((item, idx) => (
            <li key={idx}>
              <img src={item.url} alt="" loading="lazy" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
