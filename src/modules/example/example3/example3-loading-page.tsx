'use client';

import {useCallback, useRef} from 'react';
import type {LoadingOverlay, LoadingVariant} from '@/store/use-loading-store';
import useLoadingStore from '@/store/use-loading-store';
import {UiSpinner} from '@/ui-components';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

const SPINNER_VARIANTS = [
  {id: 'ring', label: 'Ring'},
  {id: 'dots', label: 'Dots'},
  {id: 'bars', label: 'Bars'},
  {id: 'pulse', label: 'Pulse'},
] as const;

const OVERLAY_OPTIONS: Array<{id: LoadingOverlay; label: string}> = [
  {id: 'light', label: 'Light'},
  {id: 'dark', label: 'Dark'},
  {id: 'blur', label: 'Blur'},
];

export default function Example3LoadingPage() {
  const loading = useLoadingStore(useCallback((state) => state.loading, []));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runGlobalLoading = (options: {
    variant?: LoadingVariant;
    message?: string;
    overlay?: LoadingOverlay;
    durationMs?: number;
  }) => {
    const {startLoading, stopLoading} = useLoadingStore.getState();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    startLoading({
      variant: options.variant,
      message: options.message,
      overlay: options.overlay,
    });
    timerRef.current = setTimeout(() => {
      stopLoading();
      timerRef.current = null;
    }, options.durationMs ?? 2000);
  };

  return (
    <Example3ShowcaseShell
      title="Loading"
      description="UiSpinner · 전역 overlay · variant · message · overlay tone"
    >
      <Example3ShowcaseSection title="Inline Spinner" description="컴포넌트 단독 사용 · 버튼/카드 내부">
        <div className="ex3-inline-spinners">
          {SPINNER_VARIANTS.map((item) => (
            <div key={item.id} className="ex3-spinner-item">
              <UiSpinner variant={item.id} uiSize="md" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <p className="ex3-code-hint">{'<UiSpinner variant="dots" uiSize="md" />'}</p>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Spinner Size">
        <div className="ex3-inline-spinners">
          <div className="ex3-spinner-item">
            <UiSpinner uiSize="sm" />
            <span>Small</span>
          </div>
          <div className="ex3-spinner-item">
            <UiSpinner uiSize="md" />
            <span>Medium</span>
          </div>
          <div className="ex3-spinner-item">
            <UiSpinner uiSize="lg" />
            <span>Large</span>
          </div>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Global Overlay" description="useLoadingStore · startLoading(options)">
        <div className="ex3-state-grid">
          {SPINNER_VARIANTS.map((item) => (
            <Example3StateCard key={item.id} label={item.label}>
              <button
                type="button"
                className="ex3-btn ex3-btn--primary"
                onClick={() =>
                  runGlobalLoading({
                    variant: item.id,
                    message: `${item.label} loading...`,
                    overlay: 'light',
                  })
                }
              >
                {item.label} 실행
              </button>
            </Example3StateCard>
          ))}
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Overlay tone · Message">
        <div className="ex3-state-grid">
          {OVERLAY_OPTIONS.map((item) => (
            <Example3StateCard key={item.id} label={item.label}>
              <button
                type="button"
                className="ex3-btn"
                onClick={() =>
                  runGlobalLoading({
                    variant: 'ring',
                    overlay: item.id,
                    message: `${item.label} overlay`,
                  })
                }
              >
                {item.label} overlay
              </button>
            </Example3StateCard>
          ))}
          <Example3StateCard label="No message">
            <button
              type="button"
              className="ex3-btn"
              onClick={() => runGlobalLoading({variant: 'dots', overlay: 'blur', message: ''})}
            >
              메시지 없이
            </button>
          </Example3StateCard>
        </div>
        <p className="ex3-note">현재 상태: {loading ? '표시 중' : '숨김'}</p>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
