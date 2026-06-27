'use client';

import {useState} from 'react';
import {UiButton} from '@/ui-components';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

export default function Example3ButtonPage() {
  const [saving, setSaving] = useState(false);

  const runSaveDemo = () => {
    setSaving(true);
    window.setTimeout(() => setSaving(false), 1800);
  };

  return (
    <Example3ShowcaseShell title="Button" description="variant · size · loading · fullWidth · disabled">
      <Example3ShowcaseSection title="Variant">
        <div className="ex3-demo-actions">
          <UiButton variant="primary">Primary</UiButton>
          <UiButton variant="secondary">Secondary</UiButton>
          <UiButton variant="ghost">Ghost</UiButton>
          <UiButton variant="danger">Danger</UiButton>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Size">
        <div className="ex3-demo-actions">
          <UiButton uiSize="sm">Small</UiButton>
          <UiButton uiSize="md">Medium</UiButton>
          <UiButton uiSize="lg">Large</UiButton>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="State · Loading">
        <div className="ex3-state-grid">
          <Example3StateCard label="Loading">
            <UiButton loading>Saving...</UiButton>
            <UiButton variant="secondary" loading>
              Processing
            </UiButton>
          </Example3StateCard>
          <Example3StateCard label="Interactive">
            <UiButton loading={saving} onClick={runSaveDemo}>
              {saving ? '저장 중' : '저장하기'}
            </UiButton>
            <p className="ex3-code-hint">loading prop · 1.8s demo</p>
          </Example3StateCard>
          <Example3StateCard label="Disabled">
            <UiButton disabled>Disabled Primary</UiButton>
            <UiButton variant="ghost" disabled>
              Disabled Ghost
            </UiButton>
          </Example3StateCard>
          <Example3StateCard label="Full width">
            <UiButton fullWidth>전체 너비 버튼</UiButton>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
