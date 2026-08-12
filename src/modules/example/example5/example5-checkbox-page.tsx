import {Ex5Checkbox} from './kit';
import Example5ShowcaseSection from './example5-showcase-section';
import Example5ShowcaseShell from './example5-showcase-shell';
import Example5StateCard from './example5-state-card';

export default function Example5CheckboxPage() {
  return (
    <Example5ShowcaseShell title="Checkbox" description="단일 · 그룹 · description · disabled · indeterminate">
      <Example5ShowcaseSection title="기본 · Description">
        <div className="ex5-state-grid">
          <Example5StateCard label="Inline group">
            <div className="ex5-preview__row">
              <Ex5Checkbox name="ex5-agree" label="이용약관 동의" defaultChecked />
              <Ex5Checkbox name="ex5-marketing" label="마케팅 수신" />
            </div>
          </Example5StateCard>
          <Example5StateCard label="With description">
            <Ex5Checkbox
              name="ex5-privacy"
              label="개인정보 처리방침"
              description="필수 · 서비스 이용을 위해 동의가 필요합니다"
              defaultChecked
            />
            <Ex5Checkbox
              name="ex5-newsletter"
              label="뉴스레터"
              description="선택 · 신규 기능 및 업데이트 안내"
            />
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="State">
        <div className="ex5-state-grid">
          <Example5StateCard label="Checked">
            <Ex5Checkbox name="ex5-checked" label="선택됨" defaultChecked />
          </Example5StateCard>
          <Example5StateCard label="Unchecked">
            <Ex5Checkbox name="ex5-unchecked" label="선택 안 됨" />
          </Example5StateCard>
          <Example5StateCard label="Disabled">
            <Ex5Checkbox name="ex5-disabled-on" label="비활성 (선택)" disabled defaultChecked />
            <Ex5Checkbox name="ex5-disabled-off" label="비활성 (미선택)" disabled />
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>
    </Example5ShowcaseShell>
  );
}
