import {KaisaToggle} from './kit';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

export default function Example3TogglePage() {
  return (
    <Example3ShowcaseShell title="Toggle" description="on / off · description · disabled">
      <Example3ShowcaseSection title="기본">
        <div className="kaisa-state-grid">
          <Example3StateCard label="Settings row">
            <KaisaToggle name="kaisa-notify" label="알림 받기" description="푸시 · 이메일 알림" defaultChecked />
            <KaisaToggle name="kaisa-dark" label="다크 모드" description="시스템 설정과 동기화" />
          </Example3StateCard>
          <Example3StateCard label="Inline">
            <div className="kaisa-preview__row">
              <KaisaToggle name="kaisa-auto-save" label="자동 저장" defaultChecked />
              <KaisaToggle name="kaisa-beta" label="Beta 기능" />
            </div>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="State">
        <div className="kaisa-state-grid">
          <Example3StateCard label="On">
            <KaisaToggle name="kaisa-on" label="활성" defaultChecked />
          </Example3StateCard>
          <Example3StateCard label="Off">
            <KaisaToggle name="kaisa-off" label="비활성" />
          </Example3StateCard>
          <Example3StateCard label="Disabled">
            <KaisaToggle name="kaisa-disabled-on" label="비활성 (ON)" disabled defaultChecked />
            <KaisaToggle name="kaisa-disabled-off" label="비활성 (OFF)" disabled />
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
