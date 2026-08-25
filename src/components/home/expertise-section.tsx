'use client';

import {useEffect, useRef, type ReactNode} from 'react';
import {useLocale, useT} from '@/i18n/locale-context';

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
  subtitleKey: string;
  descKey: string;
  tags: string[];
  icon: ReactNode;
}[] = [
  {
    num: '01',
    title: 'Design',
    subtitleKey: 'Design subtitle',
    descKey:
      'Centered on user experience — UI/UX, style guides, and visual direction. Beyond looking good, I build interfaces that feel good to use.',
    tags: ['UI / UX', 'Style Guide', 'Visual Direction', 'Responsive'],
    icon: <IconDesign />
  },
  {
    num: '02',
    title: 'Develop',
    subtitleKey: 'Develop subtitle',
    descKey:
      'Frontend, backend, infra, mobile, HMI. Spring, React, Android, iOS, React Native, Vue, C#, Next.js, OCPP, WebSocket — I build the service myself.',
    tags: ['Frontend', 'Backend', 'Mobile', 'DevOps', 'OCPP', 'WebSocket', 'HMI · C#'],
    icon: <IconDevelop />
  },
  {
    num: '03',
    title: 'Plan',
    subtitleKey: 'Plan subtitle',
    descKey:
      'From requirements to architecture and project leadership — a product planner connecting tech and business.',
    tags: ['Product Strategy', 'PM', 'Architecture', 'Tech Lead'],
    icon: <IconPlan />
  }
];

export default function ExpertiseSection() {
  const t = useT();
  const locale = useLocale();
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
          <span className="section-header__label">{t('What I Do')}</span>
          <h2 className="section-header__title">
            {t('Plan · Design · Develop')}
            <br />
            <em>{t('In one flow')}</em>
          </h2>
          <p className="section-header__desc">{t('I finish products end to end through one person’s lens.')}</p>
        </div>

        <div className="expertise__grid site-shell__inner">
          {EXPERTISE.map((item, idx) => (
            <article key={item.num} className={`expertise__card reveal reveal--${idx + 1}`}>
              <div className="expertise__icon">{item.icon}</div>
              <span className="expertise__num">{item.num}</span>
              <div className="expertise__head">
                <h3 className="expertise__title">{item.title}</h3>
                {locale !== 'en' ? <span className="expertise__title-ko">{t(item.subtitleKey)}</span> : null}
              </div>
              <p className="expertise__desc">{t(item.descKey)}</p>
              <ul className="expertise__tags">
                {item.tags.map(tag => (
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
