import {UiField, UiTextarea} from '@/ui-components';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

export default function Example3TextareaPage() {
  return (
    <Example3ShowcaseShell title="Textarea" description="rows · resize · disabled · readOnly · invalid">
      <Example3ShowcaseSection title="기본">
        <div className="ex3-state-grid">
          <Example3StateCard label="Default">
            <UiField label="메모" htmlFor="ex3-textarea-default" hint="최대 500자">
              <UiTextarea id="ex3-textarea-default" placeholder="내용을 입력하세요" rows={4} />
            </UiField>
          </Example3StateCard>
          <Example3StateCard label="Fixed rows">
            <UiField label="피드백" htmlFor="ex3-textarea-rows">
              <UiTextarea
                id="ex3-textarea-rows"
                rows={6}
                defaultValue={'서비스 UI가 깔끔합니다.\n추가로 다크모드 토글 위치를 검토해 주세요.'}
              />
            </UiField>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="State">
        <div className="ex3-state-grid">
          <Example3StateCard label="Read only">
            <UiField label="감사 로그" htmlFor="ex3-textarea-readonly" hint="수정 불가">
              <UiTextarea
                id="ex3-textarea-readonly"
                readOnly
                rows={4}
                defaultValue="2026-06-27 14:32 · 관리자가 설정을 변경했습니다."
              />
            </UiField>
          </Example3StateCard>
          <Example3StateCard label="Disabled">
            <UiField label="비공개 메모" htmlFor="ex3-textarea-disabled" disabled>
              <UiTextarea id="ex3-textarea-disabled" disabled rows={4} defaultValue="권한이 없습니다." />
            </UiField>
          </Example3StateCard>
          <Example3StateCard label="Invalid">
            <UiField label="신고 사유" htmlFor="ex3-textarea-invalid" error="10자 이상 입력해 주세요">
              <UiTextarea id="ex3-textarea-invalid" invalid rows={4} defaultValue="짧음" />
            </UiField>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
