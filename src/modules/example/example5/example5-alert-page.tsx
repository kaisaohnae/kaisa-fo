'use client';

import {useState} from 'react';
import {Ex5Alert, Ex5Button} from './kit';
import Example5ShowcaseSection from './example5-showcase-section';
import Example5ShowcaseShell from './example5-showcase-shell';
import Example5StateCard from './example5-state-card';

type AlertDemo = 'single' | 'confirm' | 'long' | null;

const COPY: Record<Exclude<AlertDemo, null>, {message: string; cancelText?: string; confirmText: string}> = {
  single: {message: 'Saved.', confirmText: 'OK'},
  confirm: {message: 'Delete this item?', cancelText: 'Cancel', confirmText: 'Delete'},
  long: {
    message: 'Changes were saved.\nSome items need admin approval.\nYou will get a notification.',
    confirmText: 'OK',
  },
};

export default function Example5AlertPage() {
  const [demo, setDemo] = useState<AlertDemo>(null);

  return (
    <Example5ShowcaseShell title="Alert" description="local overlay · slide-up dialog · not the global store">
      <Example5ShowcaseSection title="Message type">
        <div className="ex5-state-grid">
          <Example5StateCard label="Single confirm">
            <Ex5Button onClick={() => setDemo('single')}>Open alert</Ex5Button>
          </Example5StateCard>
          <Example5StateCard label="Confirm / Cancel">
            <Ex5Button variant="secondary" onClick={() => setDemo('confirm')}>
              2-button alert
            </Ex5Button>
          </Example5StateCard>
          <Example5StateCard label="Long message">
            <Ex5Button variant="ghost" onClick={() => setDemo('long')}>
              Multi-line alert
            </Ex5Button>
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>

      <Ex5Alert
        open={demo !== null}
        message={demo ? COPY[demo].message : ''}
        confirmText={demo ? COPY[demo].confirmText : 'OK'}
        cancelText={demo ? COPY[demo].cancelText : undefined}
        onConfirm={() => setDemo(null)}
        onCancel={() => setDemo(null)}
      />
    </Example5ShowcaseShell>
  );
}
