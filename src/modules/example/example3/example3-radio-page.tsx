import {KaisaRadio, KaisaRadioGroup} from './kit';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

export default function Example3RadioPage() {
  return (
    <Example3ShowcaseShell title="Radio" description="vertical · horizontal · description · disabled · invalid">
      <Example3ShowcaseSection title="Layout" description="세로 · 가로 배치">
        <div className="kaisa-state-grid">
          <Example3StateCard label="Vertical">
            <KaisaRadioGroup aria-label="플랜 선택">
              <KaisaRadio name="kaisa-plan-v" value="design" label="Design" defaultChecked />
              <KaisaRadio name="kaisa-plan-v" value="develop" label="Develop" />
              <KaisaRadio name="kaisa-plan-v" value="plan" label="Plan" />
            </KaisaRadioGroup>
          </Example3StateCard>
          <Example3StateCard label="Horizontal">
            <KaisaRadioGroup row aria-label="크기 선택">
              <KaisaRadio name="kaisa-size" value="sm" label="S" />
              <KaisaRadio name="kaisa-size" value="md" label="M" defaultChecked />
              <KaisaRadio name="kaisa-size" value="lg" label="L" />
            </KaisaRadioGroup>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Description · State">
        <div className="kaisa-state-grid">
          <Example3StateCard label="With description">
            <KaisaRadioGroup aria-label="결제 수단">
              <KaisaRadio
                name="kaisa-pay"
                value="card"
                label="신용카드"
                description="즉시 결제 · 영수증 자동 발행"
                defaultChecked
              />
              <KaisaRadio name="kaisa-pay" value="bank" label="계좌이체" description="1~2 영업일 소요" />
            </KaisaRadioGroup>
          </Example3StateCard>
          <Example3StateCard label="Disabled">
            <KaisaRadioGroup aria-label="배포 환경">
              <KaisaRadio name="kaisa-env" value="prod" label="Production" disabled defaultChecked />
              <KaisaRadio name="kaisa-env" value="staging" label="Staging" disabled />
            </KaisaRadioGroup>
          </Example3StateCard>
          <Example3StateCard label="Invalid group">
            <KaisaRadioGroup invalid aria-label="약관 동의">
              <KaisaRadio name="kaisa-agree-radio" value="yes" label="동의함" />
              <KaisaRadio name="kaisa-agree-radio" value="no" label="동의하지 않음" />
            </KaisaRadioGroup>
            <p className="kaisa-field__error">필수 항목을 선택해 주세요</p>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
