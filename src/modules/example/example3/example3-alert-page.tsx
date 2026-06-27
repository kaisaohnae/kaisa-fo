'use client';

import useAlertStore from '@/store/use-alert-store';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

export default function Example3AlertPage() {
  const showAlert = useAlertStore((state) => state.showAlert);

  return (
    <Example3ShowcaseShell title="Alert" description="message · single · confirm/cancel · long text">
      <Example3ShowcaseSection title="Message type">
        <div className="ex3-state-grid">
          <Example3StateCard label="Single confirm">
            <button
              type="button"
              className="ex3-btn ex3-btn--primary"
              onClick={() => showAlert({message: '저장되었습니다.'})}
            >
              기본 Alert
            </button>
          </Example3StateCard>
          <Example3StateCard label="Confirm / Cancel">
            <button
              type="button"
              className="ex3-btn"
              onClick={() =>
                showAlert({
                  message: '정말 삭제하시겠습니까?',
                  button: [
                    {type: 'off', text: '취소', rate: 1, callback: () => useAlertStore.getState().hideAlert()},
                    {type: 'on', text: '삭제', rate: 1, callback: () => useAlertStore.getState().hideAlert()},
                  ],
                })
              }
            >
              2버튼 Alert
            </button>
          </Example3StateCard>
          <Example3StateCard label="Long message">
            <button
              type="button"
              className="ex3-btn"
              onClick={() =>
                showAlert({
                  message:
                    '변경 사항이 저장되었습니다.\n일부 항목은 관리자 승인 후 반영됩니다.\n승인 상태는 알림에서 확인할 수 있습니다.',
                })
              }
            >
              여러 줄 Alert
            </button>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
