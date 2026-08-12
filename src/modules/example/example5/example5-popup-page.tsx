'use client';

import {useState} from 'react';
import {Ex5Button, Ex5Popup} from './kit';
import Example5ShowcaseSection from './example5-showcase-section';
import Example5ShowcaseShell from './example5-showcase-shell';
import Example5StateCard from './example5-state-card';

type PopupDemo = 'title' | 'message' | 'confirm' | 'lock' | null;

export default function Example5PopupPage() {
  const [demo, setDemo] = useState<PopupDemo>(null);

  return (
    <Example5ShowcaseShell title="Popup" description="glass overlay · local dialog · backdrop lock">
      <Example5ShowcaseSection title="Layout">
        <div className="ex5-state-grid">
          <Example5StateCard label="Title + message">
            <Ex5Button onClick={() => setDemo('title')}>Open popup</Ex5Button>
          </Example5StateCard>
          <Example5StateCard label="Message only">
            <Ex5Button variant="secondary" onClick={() => setDemo('message')}>
              Body only
            </Ex5Button>
          </Example5StateCard>
          <Example5StateCard label="Confirm / Cancel">
            <Ex5Button variant="ghost" onClick={() => setDemo('confirm')}>
              2-button popup
            </Ex5Button>
          </Example5StateCard>
          <Example5StateCard label="Sticky backdrop">
            <Ex5Button variant="danger" onClick={() => setDemo('lock')}>
              Backdrop lock
            </Ex5Button>
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>

      <Ex5Popup
        open={demo === 'title'}
        title="Notice"
        message="Your changes were saved."
        onConfirm={() => setDemo(null)}
        onCancel={() => setDemo(null)}
      />
      <Ex5Popup
        open={demo === 'message'}
        message="Session expired. Please sign in again."
        onConfirm={() => setDemo(null)}
        onCancel={() => setDemo(null)}
      />
      <Ex5Popup
        open={demo === 'confirm'}
        title="Delete"
        message="This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => setDemo(null)}
        onCancel={() => setDemo(null)}
      />
      <Ex5Popup
        open={demo === 'lock'}
        title="Important"
        message="Backdrop click will not close this dialog."
        hideOnBackdrop={false}
        onConfirm={() => setDemo(null)}
        onCancel={() => setDemo(null)}
      />
    </Example5ShowcaseShell>
  );
}
