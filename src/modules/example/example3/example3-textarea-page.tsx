import {KaisaField, KaisaTextarea} from './kit';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

export default function Example3TextareaPage() {
  return (
    <Example3ShowcaseShell title="Textarea" description="rows · resize · disabled · readOnly · invalid">
      <Example3ShowcaseSection title="기본">
        <div className="kaisa-state-grid">
          <Example3StateCard label="Default">
            <KaisaField label="메모" htmlFor="kaisa-textarea-default" hint="최대 500자">
              <KaisaTextarea id="kaisa-textarea-default" placeholder="내용을 입력하세요" rows={4} />
            </KaisaField>
          </Example3StateCard>
          <Example3StateCard label="Fixed rows">
            <KaisaField label="피드백" htmlFor="kaisa-textarea-rows">
              <KaisaTextarea
                id="kaisa-textarea-rows"
                rows={6}
                defaultValue={'서비스 UI가 깔끔합니다.\n추가로 다크모드 토글 위치를 검토해 주세요.'}
              />
            </KaisaField>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="State">
        <div className="kaisa-state-grid">
          <Example3StateCard label="Read only">
            <KaisaField label="감사 로그" htmlFor="kaisa-textarea-readonly" hint="수정 불가">
              <KaisaTextarea
                id="kaisa-textarea-readonly"
                readOnly
                rows={4}
                defaultValue="2026-06-27 14:32 · 관리자가 설정을 변경했습니다."
              />
            </KaisaField>
          </Example3StateCard>
          <Example3StateCard label="Disabled">
            <KaisaField label="비공개 메모" htmlFor="kaisa-textarea-disabled" disabled>
              <KaisaTextarea id="kaisa-textarea-disabled" disabled rows={4} defaultValue="권한이 없습니다." />
            </KaisaField>
          </Example3StateCard>
          <Example3StateCard label="Invalid">
            <KaisaField label="신고 사유" htmlFor="kaisa-textarea-invalid" error="10자 이상 입력해 주세요">
              <KaisaTextarea id="kaisa-textarea-invalid" invalid rows={4} defaultValue="짧음" />
            </KaisaField>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
