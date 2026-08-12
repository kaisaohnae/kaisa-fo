import {Ex5Toggle} from './kit';
import Example5ShowcaseSection from './example5-showcase-section';
import Example5ShowcaseShell from './example5-showcase-shell';
import Example5StateCard from './example5-state-card';

export default function Example5TogglePage() {
  return (
    <Example5ShowcaseShell title="Toggle" description="on / off · description · disabled">
      <Example5ShowcaseSection title="기본">
        <div className="ex5-state-grid">
          <Example5StateCard label="Settings row">
            <Ex5Toggle name="ex5-notify" label="알림 받기" description="푸시 · 이메일 알림" defaultChecked />
            <Ex5Toggle name="ex5-dark" label="다크 모드" description="시스템 설정과 동기화" />
          </Example5StateCard>
          <Example5StateCard label="Inline">
            <div className="ex5-preview__row">
              <Ex5Toggle name="ex5-auto-save" label="자동 저장" defaultChecked />
              <Ex5Toggle name="ex5-beta" label="Beta 기능" />
            </div>
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="State">
        <div className="ex5-state-grid">
          <Example5StateCard label="On">
            <Ex5Toggle name="ex5-on" label="활성" defaultChecked />
          </Example5StateCard>
          <Example5StateCard label="Off">
            <Ex5Toggle name="ex5-off" label="비활성" />
          </Example5StateCard>
          <Example5StateCard label="Disabled">
            <Ex5Toggle name="ex5-disabled-on" label="비활성 (ON)" disabled defaultChecked />
            <Ex5Toggle name="ex5-disabled-off" label="비활성 (OFF)" disabled />
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>
    </Example5ShowcaseShell>
  );
}
