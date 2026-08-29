'use client';

import {useRef, useState} from 'react';
import {KaisaButton, KaisaLoading, KaisaSpinner, type KaisaLoadingTone, type KaisaSpinnerVariant} from './kit';
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

const OVERLAY_OPTIONS: Array<{id: KaisaLoadingTone; label: string}> = [
  {id: 'light', label: 'Light'},
  {id: 'dark', label: 'Dark'},
  {id: 'blur', label: 'Blur'},
];

export default function Example3LoadingPage() {
  const [loading, setLoading] = useState<{
    variant: KaisaSpinnerVariant;
    overlay: KaisaLoadingTone;
    message: string;
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = (variant: KaisaSpinnerVariant, overlay: KaisaLoadingTone, message: string) => {
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
        <div className="kaisa-inline-spinners">
          {SPINNER_VARIANTS.map((item) => (
            <div key={item.id} className="kaisa-spinner-item">
              <KaisaSpinner variant={item.id} uiSize="md" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <p className="kaisa-code-hint">{'<KaisaSpinner variant="dots" uiSize="md" />'}</p>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Spinner Size">
        <div className="kaisa-inline-spinners">
          <div className="kaisa-spinner-item">
            <KaisaSpinner uiSize="sm" />
            <span>Small</span>
          </div>
          <div className="kaisa-spinner-item">
            <KaisaSpinner uiSize="md" />
            <span>Medium</span>
          </div>
          <div className="kaisa-spinner-item">
            <KaisaSpinner uiSize="lg" />
            <span>Large</span>
          </div>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Local Overlay">
        <div className="kaisa-state-grid">
          {SPINNER_VARIANTS.map((item) => (
            <Example3StateCard key={item.id} label={item.label}>
              <KaisaButton onClick={() => run(item.id, 'blur', `${item.label} loading...`)}>
                Run {item.label}
              </KaisaButton>
            </Example3StateCard>
          ))}
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Overlay tone">
        <div className="kaisa-state-grid">
          {OVERLAY_OPTIONS.map((item) => (
            <Example3StateCard key={item.id} label={item.label}>
              <KaisaButton variant="secondary" onClick={() => run('ring', item.id, `${item.label} overlay`)}>
                {item.label} overlay
              </KaisaButton>
            </Example3StateCard>
          ))}
          <Example3StateCard label="No message">
            <KaisaButton variant="ghost" onClick={() => run('dots', 'dark', '')}>
              Spinner only
            </KaisaButton>
          </Example3StateCard>
        </div>
        <p className="kaisa-note">status: {loading ? 'on' : 'off'}</p>
      </Example3ShowcaseSection>

      <KaisaLoading
        open={loading !== null}
        variant={loading?.variant}
        overlay={loading?.overlay}
        message={loading?.message}
      />
    </Example3ShowcaseShell>
  );
}
