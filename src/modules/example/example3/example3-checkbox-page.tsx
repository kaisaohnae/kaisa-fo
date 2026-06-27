import {UiCheckbox} from '@/ui-components';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

export default function Example3CheckboxPage() {
  return (
    <Example3ShowcaseShell title="Checkbox" description="단일 · 그룹 · description · disabled · indeterminate">
      <Example3ShowcaseSection title="기본 · Description">
        <div className="ex3-state-grid">
          <Example3StateCard label="Inline group">
            <div className="ex3-preview__row">
              <UiCheckbox name="ex3-agree" label="이용약관 동의" defaultChecked />
              <UiCheckbox name="ex3-marketing" label="마케팅 수신" />
            </div>
          </Example3StateCard>
          <Example3StateCard label="With description">
            <UiCheckbox
              name="ex3-privacy"
              label="개인정보 처리방침"
              description="필수 · 서비스 이용을 위해 동의가 필요합니다"
              defaultChecked
            />
            <UiCheckbox
              name="ex3-newsletter"
              label="뉴스레터"
              description="선택 · 신규 기능 및 업데이트 안내"
            />
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="State">
        <div className="ex3-state-grid">
          <Example3StateCard label="Checked">
            <UiCheckbox name="ex3-checked" label="선택됨" defaultChecked />
          </Example3StateCard>
          <Example3StateCard label="Unchecked">
            <UiCheckbox name="ex3-unchecked" label="선택 안 됨" />
          </Example3StateCard>
          <Example3StateCard label="Disabled">
            <UiCheckbox name="ex3-disabled-on" label="비활성 (선택)" disabled defaultChecked />
            <UiCheckbox name="ex3-disabled-off" label="비활성 (미선택)" disabled />
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
