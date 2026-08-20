'use client';

import {useRef, useState} from 'react';
import {Ex3Button, Ex3Loading, Ex3Spinner, type Ex3LoadingTone, type Ex3SpinnerVariant} from './kit';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

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

const OVERLAY_OPTIONS: Array<{id: Ex3LoadingTone; label: string}> = [
  {id: 'light', label: 'Light'},
  {id: 'dark', label: 'Dark'},
  {id: 'blur', label: 'Blur'},
];

export default function Example3LoadingPage() {
  const [loading, setLoading] = useState<{
    variant: Ex3SpinnerVariant;
    overlay: Ex3LoadingTone;
    message: string;
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = (variant: Ex3SpinnerVariant, overlay: Ex3LoadingTone, message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLoading({variant, overlay, message});
    timerRef.current = setTimeout(() => {
      setLoading(null);
      timerRef.current = null;
    }, 1800);
  };

  return (
    <Example3ShowcaseShell title="Loading" description="8 spinner types · local overlay">
      <Example3ShowcaseSection title="Inline Spinner" description="shapes that are not the default kit">
        <div className="ex3-inline-spinners">
          {SPINNER_VARIANTS.map((item) => (
            <div key={item.id} className="ex3-spinner-item">
              <Ex3Spinner variant={item.id} uiSize="md" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <p className="ex3-code-hint">{'<Ex3Spinner variant="dots" uiSize="md" />'}</p>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Spinner Size">
        <div className="ex3-inline-spinners">
          <div className="ex3-spinner-item">
            <Ex3Spinner uiSize="sm" />
            <span>Small</span>
          </div>
          <div className="ex3-spinner-item">
            <Ex3Spinner uiSize="md" />
            <span>Medium</span>
          </div>
          <div className="ex3-spinner-item">
            <Ex3Spinner uiSize="lg" />
            <span>Large</span>
          </div>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Local Overlay">
        <div className="ex3-state-grid">
          {SPINNER_VARIANTS.map((item) => (
            <Example3StateCard key={item.id} label={item.label}>
              <Ex3Button onClick={() => run(item.id, 'blur', `${item.label} loading...`)}>
                Run {item.label}
              </Ex3Button>
            </Example3StateCard>
          ))}
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Overlay tone">
        <div className="ex3-state-grid">
          {OVERLAY_OPTIONS.map((item) => (
            <Example3StateCard key={item.id} label={item.label}>
              <Ex3Button variant="secondary" onClick={() => run('ring', item.id, `${item.label} overlay`)}>
                {item.label} overlay
              </Ex3Button>
            </Example3StateCard>
          ))}
          <Example3StateCard label="No message">
            <Ex3Button variant="ghost" onClick={() => run('dots', 'dark', '')}>
              Spinner only
            </Ex3Button>
          </Example3StateCard>
        </div>
        <p className="ex3-note">status: {loading ? 'on' : 'off'}</p>
      </Example3ShowcaseSection>

      <Ex3Loading
        open={loading !== null}
        variant={loading?.variant}
        overlay={loading?.overlay}
        message={loading?.message}
      />
    </Example3ShowcaseShell>
  );
}
