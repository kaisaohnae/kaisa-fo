import {Ex3Radio, Ex3RadioGroup} from './kit';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

export default function Example3RadioPage() {
  return (
    <Example3ShowcaseShell title="Radio" description="vertical · horizontal · description · disabled · invalid">
      <Example3ShowcaseSection title="Layout" description="세로 · 가로 배치">
        <div className="ex3-state-grid">
          <Example3StateCard label="Vertical">
            <Ex3RadioGroup aria-label="플랜 선택">
              <Ex3Radio name="ex3-plan-v" value="design" label="Design" defaultChecked />
              <Ex3Radio name="ex3-plan-v" value="develop" label="Develop" />
              <Ex3Radio name="ex3-plan-v" value="plan" label="Plan" />
            </Ex3RadioGroup>
          </Example3StateCard>
          <Example3StateCard label="Horizontal">
            <Ex3RadioGroup row aria-label="크기 선택">
              <Ex3Radio name="ex3-size" value="sm" label="S" />
              <Ex3Radio name="ex3-size" value="md" label="M" defaultChecked />
              <Ex3Radio name="ex3-size" value="lg" label="L" />
            </Ex3RadioGroup>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Description · State">
        <div className="ex3-state-grid">
          <Example3StateCard label="With description">
            <Ex3RadioGroup aria-label="결제 수단">
              <Ex3Radio
                name="ex3-pay"
                value="card"
                label="신용카드"
                description="즉시 결제 · 영수증 자동 발행"
                defaultChecked
              />
              <Ex3Radio name="ex3-pay" value="bank" label="계좌이체" description="1~2 영업일 소요" />
            </Ex3RadioGroup>
          </Example3StateCard>
          <Example3StateCard label="Disabled">
            <Ex3RadioGroup aria-label="배포 환경">
              <Ex3Radio name="ex3-env" value="prod" label="Production" disabled defaultChecked />
              <Ex3Radio name="ex3-env" value="staging" label="Staging" disabled />
            </Ex3RadioGroup>
          </Example3StateCard>
          <Example3StateCard label="Invalid group">
            <Ex3RadioGroup invalid aria-label="약관 동의">
              <Ex3Radio name="ex3-agree-radio" value="yes" label="동의함" />
              <Ex3Radio name="ex3-agree-radio" value="no" label="동의하지 않음" />
            </Ex3RadioGroup>
            <p className="ex3k-field__error">필수 항목을 선택해 주세요</p>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
