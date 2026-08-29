'use client';

import {useEffect, useRef, type ReactNode} from 'react';

const IconDesign = () => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <path
      d="M12 44V20l20-8 20 8v24l-20 8-20-8Z"
      stroke="currentColor"
      strokeWidth="2.75"
      strokeLinejoin="round"
    />
    <path d="M32 12v40M12 20l20 8 20-8M32 52l20-8" stroke="currentColor" strokeWidth="2.75" />
  </svg>
);

const IconDevelop = () => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <path
      d="M22 42 10 32l12-10M42 42l12-10-12-10M36 8 28 56"
      stroke="currentColor"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconPlan = () => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <rect x="10" y="14" width="44" height="36" rx="4" stroke="currentColor" strokeWidth="2.75" />
    <path d="M18 26h28M18 34h20M18 42h24" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" />
    <circle cx="46" cy="34" r="3.5" fill="currentColor" />
  </svg>
);

const EXPERTISE: {
  num: string;
  title: string;
  titleKo: string;
  desc: string;
  tags: string[];
  icon: ReactNode;
}[] = [
  {
    num: '01',
    title: 'Design',
    titleKo: '디자인',
    desc: '사용자 경험을 중심으로 UI/UX, 스타일 가이드, 비주얼 디렉션까지. 보기 좋은 것을 넘어, 쓰기 좋은 인터페이스를 만듭니다.',
    tags: ['UI / UX', 'Style Guide', 'Visual Direction', 'Responsive'],
    icon: <IconDesign />,
  },
  {
    num: '02',
    title: 'Develop',
    titleKo: '개발',
    desc: '프론트엔드, 백엔드, 인프라, 모바일, HMI. Spring, React, Android, IOS, React Native, Vue, C#, Next.js, OCPP, WebSocket — 서비스를 직접 구현합니다.',
    tags: ['Frontend', 'Backend', 'Mobile', 'DevOps', 'OCPP', 'WebSocket', 'HMI · C#'],
    icon: <IconDevelop />,
  },
  {
    num: '03',
    title: 'Plan',
    titleKo: '기획',
    desc: '요구사항 분석부터 아키텍처 설계, 프로젝트 리딩까지. 기술과 비즈니스 사이를 연결하는 프로덕트 플래너입니다.',
    tags: ['Product Strategy', 'PM', 'Architecture', 'Tech Lead'],
    icon: <IconPlan />,
  },
];

export default function ExpertiseSection() {
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
      {threshold: 0.15}
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="expertise" className="expertise">
      <div className="site-shell">
        <div className="section-header site-shell__inner">
          <span className="section-header__label">What I Do</span>
          <h2 className="section-header__title">
            기획 · 디자인 · 개발
            <br />
            <em>하나의 흐름으로</em>
          </h2>
          <p className="section-header__desc">
            처음부터 끝까지 한 사람의 시선으로 프로덕트를 완성합니다.
          </p>
        </div>

        <div className="expertise__grid site-shell__inner">
        {EXPERTISE.map((item, idx) => (
          <article
            key={item.num}
            className={`expertise__card reveal reveal--${idx + 1}`}
          >
            <div className="expertise__icon">{item.icon}</div>
            <span className="expertise__num">{item.num}</span>
            <div className="expertise__head">
              <h3 className="expertise__title">{item.title}</h3>
              <span className="expertise__title-ko">{item.titleKo}</span>
            </div>
            <p className="expertise__desc">{item.desc}</p>
            <ul className="expertise__tags">
              {item.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}
