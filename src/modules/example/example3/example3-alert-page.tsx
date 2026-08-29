'use client';

import {useState} from 'react';
import {KaisaAlert, KaisaButton} from './kit';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

type AlertDemo = 'single' | 'confirm' | 'long' | null;

const COPY: Record<Exclude<AlertDemo, null>, {message: string; cancelText?: string; confirmText: string}> = {
  single: {message: 'Saved.', confirmText: 'OK'},
  confirm: {message: 'Delete this item?', cancelText: 'Cancel', confirmText: 'Delete'},
  long: {
    message: 'Changes were saved.\nSome items need admin approval.\nYou will get a notification.',
    confirmText: 'OK',
  },
};

export default function Example3AlertPage() {
  const [demo, setDemo] = useState<AlertDemo>(null);

  return (
    <Example3ShowcaseShell title="Alert" description="local overlay · slide-up dialog · not the global store">
      <Example3ShowcaseSection title="Message type">
        <div className="kaisa-state-grid">
          <Example3StateCard label="Single confirm">
            <KaisaButton onClick={() => setDemo('single')}>Open alert</KaisaButton>
          </Example3StateCard>
          <Example3StateCard label="Confirm / Cancel">
            <KaisaButton variant="secondary" onClick={() => setDemo('confirm')}>
              2-button alert
            </KaisaButton>
          </Example3StateCard>
          <Example3StateCard label="Long message">
            <KaisaButton variant="ghost" onClick={() => setDemo('long')}>
              Multi-line alert
            </KaisaButton>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <KaisaAlert
        open={demo !== null}
        message={demo ? COPY[demo].message : ''}
        confirmText={demo ? COPY[demo].confirmText : 'OK'}
        cancelText={demo ? COPY[demo].cancelText : undefined}
        onConfirm={() => setDemo(null)}
        onCancel={() => setDemo(null)}
      />
    </Example3ShowcaseShell>
  );
}
