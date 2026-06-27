'use client';

import usePopupStore from '@/store/use-popup-store';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

export default function Example3PopupPage() {
  const showPopup = usePopupStore((state) => state.showPopup);

  return (
    <Example3ShowcaseShell title="Popup" description="title · message · confirm · confirm/cancel · backdrop">
      <Example3ShowcaseSection title="Layout">
        <div className="ex3-state-grid">
          <Example3StateCard label="Title + message">
            <button
              type="button"
              className="ex3-btn ex3-btn--primary"
              onClick={() =>
                showPopup({
                  title: '안내',
                  message: '변경 사항이 저장되었습니다.',
                })
              }
            >
              기본 Popup
            </button>
          </Example3StateCard>
          <Example3StateCard label="Message only">
            <button
              type="button"
              className="ex3-btn"
              onClick={() => showPopup({message: '세션이 만료되었습니다. 다시 로그인해 주세요.'})}
            >
              본문만
            </button>
          </Example3StateCard>
          <Example3StateCard label="Confirm / Cancel">
            <button
              type="button"
              className="ex3-btn"
              onClick={() =>
                showPopup({
                  title: '삭제 확인',
                  message: '선택한 항목을 삭제할까요? 이 작업은 되돌릴 수 없습니다.',
                  confirmText: '삭제',
                  cancelText: '취소',
                })
              }
            >
              2버튼 Popup
            </button>
          </Example3StateCard>
          <Example3StateCard label="Sticky backdrop">
            <button
              type="button"
              className="ex3-btn"
              onClick={() =>
                showPopup({
                  title: '중요 안내',
                  message: '배경 클릭으로 닫히지 않습니다. 확인 버튼을 눌러 주세요.',
                  hideOnBackdrop: false,
                })
              }
            >
              Backdrop lock
            </button>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
