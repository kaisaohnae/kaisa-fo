import {Ex5Radio, Ex5RadioGroup} from './kit';
import Example5ShowcaseSection from './example5-showcase-section';
import Example5ShowcaseShell from './example5-showcase-shell';
import Example5StateCard from './example5-state-card';

export default function Example5RadioPage() {
  return (
    <Example5ShowcaseShell title="Radio" description="vertical · horizontal · description · disabled · invalid">
      <Example5ShowcaseSection title="Layout" description="세로 · 가로 배치">
        <div className="ex5-state-grid">
          <Example5StateCard label="Vertical">
            <Ex5RadioGroup aria-label="플랜 선택">
              <Ex5Radio name="ex5-plan-v" value="design" label="Design" defaultChecked />
              <Ex5Radio name="ex5-plan-v" value="develop" label="Develop" />
              <Ex5Radio name="ex5-plan-v" value="plan" label="Plan" />
            </Ex5RadioGroup>
          </Example5StateCard>
          <Example5StateCard label="Horizontal">
            <Ex5RadioGroup row aria-label="크기 선택">
              <Ex5Radio name="ex5-size" value="sm" label="S" />
              <Ex5Radio name="ex5-size" value="md" label="M" defaultChecked />
              <Ex5Radio name="ex5-size" value="lg" label="L" />
            </Ex5RadioGroup>
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="Description · State">
        <div className="ex5-state-grid">
          <Example5StateCard label="With description">
            <Ex5RadioGroup aria-label="결제 수단">
              <Ex5Radio
                name="ex5-pay"
                value="card"
                label="신용카드"
                description="즉시 결제 · 영수증 자동 발행"
                defaultChecked
              />
              <Ex5Radio name="ex5-pay" value="bank" label="계좌이체" description="1~2 영업일 소요" />
            </Ex5RadioGroup>
          </Example5StateCard>
          <Example5StateCard label="Disabled">
            <Ex5RadioGroup aria-label="배포 환경">
              <Ex5Radio name="ex5-env" value="prod" label="Production" disabled defaultChecked />
              <Ex5Radio name="ex5-env" value="staging" label="Staging" disabled />
            </Ex5RadioGroup>
          </Example5StateCard>
          <Example5StateCard label="Invalid group">
            <Ex5RadioGroup invalid aria-label="약관 동의">
              <Ex5Radio name="ex5-agree-radio" value="yes" label="동의함" />
              <Ex5Radio name="ex5-agree-radio" value="no" label="동의하지 않음" />
            </Ex5RadioGroup>
            <p className="ex5k-field__error">필수 항목을 선택해 주세요</p>
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>
    </Example5ShowcaseShell>
  );
}
