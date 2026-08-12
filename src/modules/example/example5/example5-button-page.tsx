'use client';

import {useState} from 'react';
import {Ex5Button} from './kit';
import Example5ShowcaseSection from './example5-showcase-section';
import Example5ShowcaseShell from './example5-showcase-shell';
import Example5StateCard from './example5-state-card';

export default function Example5ButtonPage() {
  const [saving, setSaving] = useState(false);

  const runSaveDemo = () => {
    setSaving(true);
    window.setTimeout(() => setSaving(false), 1800);
  };

  return (
    <Example5ShowcaseShell title="Button" description="variant · size · loading · fullWidth · disabled">
      <Example5ShowcaseSection title="Variant">
        <div className="ex5-demo-actions">
          <Ex5Button variant="primary">Primary</Ex5Button>
          <Ex5Button variant="secondary">Secondary</Ex5Button>
          <Ex5Button variant="ghost">Ghost</Ex5Button>
          <Ex5Button variant="danger">Danger</Ex5Button>
        </div>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="Size">
        <div className="ex5-demo-actions">
          <Ex5Button uiSize="sm">Small</Ex5Button>
          <Ex5Button uiSize="md">Medium</Ex5Button>
          <Ex5Button uiSize="lg">Large</Ex5Button>
        </div>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="State · Loading">
        <div className="ex5-state-grid">
          <Example5StateCard label="Loading">
            <Ex5Button loading>Saving...</Ex5Button>
            <Ex5Button variant="secondary" loading>
              Processing
            </Ex5Button>
          </Example5StateCard>
          <Example5StateCard label="Interactive">
            <Ex5Button loading={saving} onClick={runSaveDemo}>
              {saving ? '저장 중' : '저장하기'}
            </Ex5Button>
            <p className="ex5-code-hint">loading prop · 1.8s demo</p>
          </Example5StateCard>
          <Example5StateCard label="Disabled">
            <Ex5Button disabled>Disabled Primary</Ex5Button>
            <Ex5Button variant="ghost" disabled>
              Disabled Ghost
            </Ex5Button>
          </Example5StateCard>
          <Example5StateCard label="Full width">
            <Ex5Button fullWidth>전체 너비 버튼</Ex5Button>
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>
    </Example5ShowcaseShell>
  );
}
