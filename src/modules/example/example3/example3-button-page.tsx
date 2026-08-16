'use client';

import {useState} from 'react';
import {Ex3Button} from './kit';
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
          <Ex3Button variant="primary">Primary</Ex3Button>
          <Ex3Button variant="secondary">Secondary</Ex3Button>
          <Ex3Button variant="ghost">Ghost</Ex3Button>
          <Ex3Button variant="danger">Danger</Ex3Button>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Size">
        <div className="ex3-demo-actions">
          <Ex3Button uiSize="sm">Small</Ex3Button>
          <Ex3Button uiSize="md">Medium</Ex3Button>
          <Ex3Button uiSize="lg">Large</Ex3Button>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="State · Loading">
        <div className="ex3-state-grid">
          <Example3StateCard label="Loading">
            <Ex3Button loading>Saving...</Ex3Button>
            <Ex3Button variant="secondary" loading>
              Processing
            </Ex3Button>
          </Example3StateCard>
          <Example3StateCard label="Interactive">
            <Ex3Button loading={saving} onClick={runSaveDemo}>
              {saving ? '저장 중' : '저장하기'}
            </Ex3Button>
            <p className="ex3-code-hint">loading prop · 1.8s demo</p>
          </Example3StateCard>
          <Example3StateCard label="Disabled">
            <Ex3Button disabled>Disabled Primary</Ex3Button>
            <Ex3Button variant="ghost" disabled>
              Disabled Ghost
            </Ex3Button>
          </Example3StateCard>
          <Example3StateCard label="Full width">
            <Ex3Button fullWidth>전체 너비 버튼</Ex3Button>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
