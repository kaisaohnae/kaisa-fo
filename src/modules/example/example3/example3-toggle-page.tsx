import {UiToggle} from '@/ui-components';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

export default function Example3TogglePage() {
  return (
    <Example3ShowcaseShell title="Toggle" description="on / off · description · disabled">
      <Example3ShowcaseSection title="기본">
        <div className="ex3-state-grid">
          <Example3StateCard label="Settings row">
            <UiToggle name="ex3-notify" label="알림 받기" description="푸시 · 이메일 알림" defaultChecked />
            <UiToggle name="ex3-dark" label="다크 모드" description="시스템 설정과 동기화" />
          </Example3StateCard>
          <Example3StateCard label="Inline">
            <div className="ex3-preview__row">
              <UiToggle name="ex3-auto-save" label="자동 저장" defaultChecked />
              <UiToggle name="ex3-beta" label="Beta 기능" />
            </div>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="State">
        <div className="ex3-state-grid">
          <Example3StateCard label="On">
            <UiToggle name="ex3-on" label="활성" defaultChecked />
          </Example3StateCard>
          <Example3StateCard label="Off">
            <UiToggle name="ex3-off" label="비활성" />
          </Example3StateCard>
          <Example3StateCard label="Disabled">
            <UiToggle name="ex3-disabled-on" label="비활성 (ON)" disabled defaultChecked />
            <UiToggle name="ex3-disabled-off" label="비활성 (OFF)" disabled />
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
