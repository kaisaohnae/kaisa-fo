'use client';

import {useState} from 'react';
import {KaisaButton, KaisaPopup} from './kit';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

type PopupDemo = 'title' | 'message' | 'confirm' | 'lock' | null;

export default function Example3PopupPage() {
  const [demo, setDemo] = useState<PopupDemo>(null);

  return (
    <Example3ShowcaseShell title="Popup" description="glass overlay · local dialog · backdrop lock">
      <Example3ShowcaseSection title="Layout">
        <div className="kaisa-state-grid">
          <Example3StateCard label="Title + message">
            <KaisaButton onClick={() => setDemo('title')}>Open popup</KaisaButton>
          </Example3StateCard>
          <Example3StateCard label="Message only">
            <KaisaButton variant="secondary" onClick={() => setDemo('message')}>
              Body only
            </KaisaButton>
          </Example3StateCard>
          <Example3StateCard label="Confirm / Cancel">
            <KaisaButton variant="ghost" onClick={() => setDemo('confirm')}>
              2-button popup
            </KaisaButton>
          </Example3StateCard>
          <Example3StateCard label="Sticky backdrop">
            <KaisaButton variant="danger" onClick={() => setDemo('lock')}>
              Backdrop lock
            </KaisaButton>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <KaisaPopup
        open={demo === 'title'}
        title="Notice"
        message="Your changes were saved."
        onConfirm={() => setDemo(null)}
        onCancel={() => setDemo(null)}
      />
      <KaisaPopup
        open={demo === 'message'}
        message="Session expired. Please sign in again."
        onConfirm={() => setDemo(null)}
        onCancel={() => setDemo(null)}
      />
      <KaisaPopup
        open={demo === 'confirm'}
        title="Delete"
        message="This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => setDemo(null)}
        onCancel={() => setDemo(null)}
      />
      <KaisaPopup
        open={demo === 'lock'}
        title="Important"
        message="Backdrop click will not close this dialog."
        hideOnBackdrop={false}
        onConfirm={() => setDemo(null)}
        onCancel={() => setDemo(null)}
      />
    </Example3ShowcaseShell>
  );
}
