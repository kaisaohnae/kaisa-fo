'use client';

import {useEffect, useRef} from 'react';
import WorkGrid from '@/components/works/work-grid';
import worksList from '@/data/works-list';

const WORKS_TAGS = [
  'OCPP 1.6',
  'OCPP 2.1 인증',
  'K6 웹소켓 성능 최적화',
  'PnC KECO 테스트 통과',
  '공공기관',
  '금융기관',
  '상품제휴',
  '커머스 주문',
  'UI/UX 개발',
  '프론트엔드',
  '백엔드',
  '크로스플랫폼',
  'iOS',
  'Android',
  'React Native',
  'React',
  'Vue',
  'Spring Boot',
  'Java',
  'WPF',
] as const;

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
            2005년부터 현재까지, 함께해 온 프로젝트 기록입니다.
          </p>
          <ul className="page-hero__tags" aria-label="주요 기술·영역">
            {WORKS_TAGS.map((tag) => (
              <li key={tag} className="page-hero__tag">
                <span className="page-hero__tag-hash" aria-hidden="true">
                  #
                </span>
                <span className="page-hero__tag-label">{tag}</span>
              </li>
            ))}
          </ul>
        </header>

        <WorkGrid items={worksList} className="site-shell__inner" />
      </div>
    </section>
  );
}
