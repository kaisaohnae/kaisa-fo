'use client';

import {useState} from 'react';
import {KaisaButton} from './kit';
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
        <div className="kaisa-demo-actions">
          <KaisaButton variant="primary">Primary</KaisaButton>
          <KaisaButton variant="secondary">Secondary</KaisaButton>
          <KaisaButton variant="ghost">Ghost</KaisaButton>
          <KaisaButton variant="danger">Danger</KaisaButton>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Size">
        <div className="kaisa-demo-actions">
          <KaisaButton uiSize="sm">Small</KaisaButton>
          <KaisaButton uiSize="md">Medium</KaisaButton>
          <KaisaButton uiSize="lg">Large</KaisaButton>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="State · Loading">
        <div className="kaisa-state-grid">
          <Example3StateCard label="Loading">
            <KaisaButton loading>Saving...</KaisaButton>
            <KaisaButton variant="secondary" loading>
              Processing
            </KaisaButton>
          </Example3StateCard>
          <Example3StateCard label="Interactive">
            <KaisaButton loading={saving} onClick={runSaveDemo}>
              {saving ? '저장 중' : '저장하기'}
            </KaisaButton>
            <p className="kaisa-code-hint">loading prop · 1.8s demo</p>
          </Example3StateCard>
          <Example3StateCard label="Disabled">
            <KaisaButton disabled>Disabled Primary</KaisaButton>
            <KaisaButton variant="ghost" disabled>
              Disabled Ghost
            </KaisaButton>
          </Example3StateCard>
          <Example3StateCard label="Full width">
            <KaisaButton fullWidth>전체 너비 버튼</KaisaButton>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
