'use client';

import {useRef, useState} from 'react';
import {Ex5Button, Ex5Loading, Ex5Spinner, type Ex5LoadingTone, type Ex5SpinnerVariant} from './kit';
import Example5ShowcaseSection from './example5-showcase-section';
import Example5ShowcaseShell from './example5-showcase-shell';
import Example5StateCard from './example5-state-card';

const SPINNER_VARIANTS = [
  {id: 'ring', label: 'Dual ring'},
  {id: 'dots', label: 'Fade dots'},
  {id: 'bars', label: 'Bars'},
  {id: 'pulse', label: 'Halo'},
  {id: 'orbit', label: 'Orbit'},
  {id: 'dash', label: 'Dash'},
  {id: 'wave', label: 'Wave'},
  {id: 'diamond', label: 'Diamond'},
] as const;

const OVERLAY_OPTIONS: Array<{id: Ex5LoadingTone; label: string}> = [
  {id: 'light', label: 'Light'},
  {id: 'dark', label: 'Dark'},
  {id: 'blur', label: 'Blur'},
];

export default function Example5LoadingPage() {
  const [loading, setLoading] = useState<{
    variant: Ex5SpinnerVariant;
    overlay: Ex5LoadingTone;
    message: string;
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = (variant: Ex5SpinnerVariant, overlay: Ex5LoadingTone, message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLoading({variant, overlay, message});
    timerRef.current = setTimeout(() => {
      setLoading(null);
      timerRef.current = null;
    }, 1800);
  };

  return (
    <Example5ShowcaseShell title="Loading" description="8 spinner types · local overlay">
      <Example5ShowcaseSection title="Inline Spinner" description="shapes that are not the default kit">
        <div className="ex5-inline-spinners">
          {SPINNER_VARIANTS.map((item) => (
            <div key={item.id} className="ex5-spinner-item">
              <Ex5Spinner variant={item.id} uiSize="md" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <p className="ex5-code-hint">{'<Ex5Spinner variant="dots" uiSize="md" />'}</p>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="Spinner Size">
        <div className="ex5-inline-spinners">
          <div className="ex5-spinner-item">
            <Ex5Spinner uiSize="sm" />
            <span>Small</span>
          </div>
          <div className="ex5-spinner-item">
            <Ex5Spinner uiSize="md" />
            <span>Medium</span>
          </div>
          <div className="ex5-spinner-item">
            <Ex5Spinner uiSize="lg" />
            <span>Large</span>
          </div>
        </div>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="Local Overlay">
        <div className="ex5-state-grid">
          {SPINNER_VARIANTS.map((item) => (
            <Example5StateCard key={item.id} label={item.label}>
              <Ex5Button onClick={() => run(item.id, 'blur', `${item.label} loading...`)}>
                Run {item.label}
              </Ex5Button>
            </Example5StateCard>
          ))}
        </div>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="Overlay tone">
        <div className="ex5-state-grid">
          {OVERLAY_OPTIONS.map((item) => (
            <Example5StateCard key={item.id} label={item.label}>
              <Ex5Button variant="secondary" onClick={() => run('ring', item.id, `${item.label} overlay`)}>
                {item.label} overlay
              </Ex5Button>
            </Example5StateCard>
          ))}
          <Example5StateCard label="No message">
            <Ex5Button variant="ghost" onClick={() => run('dots', 'dark', '')}>
              Spinner only
            </Ex5Button>
          </Example5StateCard>
        </div>
        <p className="ex5-note">status: {loading ? 'on' : 'off'}</p>
      </Example5ShowcaseSection>

      <Ex5Loading
        open={loading !== null}
        variant={loading?.variant}
        overlay={loading?.overlay}
        message={loading?.message}
      />
    </Example5ShowcaseShell>
  );
}
