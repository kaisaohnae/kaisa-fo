import {Ex3Field, Ex3Textarea} from './kit';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

export default function Example3TextareaPage() {
  return (
    <Example3ShowcaseShell title="Textarea" description="rows · resize · disabled · readOnly · invalid">
      <Example3ShowcaseSection title="기본">
        <div className="ex3-state-grid">
          <Example3StateCard label="Default">
            <Ex3Field label="메모" htmlFor="ex3-textarea-default" hint="최대 500자">
              <Ex3Textarea id="ex3-textarea-default" placeholder="내용을 입력하세요" rows={4} />
            </Ex3Field>
          </Example3StateCard>
          <Example3StateCard label="Fixed rows">
            <Ex3Field label="피드백" htmlFor="ex3-textarea-rows">
              <Ex3Textarea
                id="ex3-textarea-rows"
                rows={6}
                defaultValue={'서비스 UI가 깔끔합니다.\n추가로 다크모드 토글 위치를 검토해 주세요.'}
              />
            </Ex3Field>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="State">
        <div className="ex3-state-grid">
          <Example3StateCard label="Read only">
            <Ex3Field label="감사 로그" htmlFor="ex3-textarea-readonly" hint="수정 불가">
              <Ex3Textarea
                id="ex3-textarea-readonly"
                readOnly
                rows={4}
                defaultValue="2026-06-27 14:32 · 관리자가 설정을 변경했습니다."
              />
            </Ex3Field>
          </Example3StateCard>
          <Example3StateCard label="Disabled">
            <Ex3Field label="비공개 메모" htmlFor="ex3-textarea-disabled" disabled>
              <Ex3Textarea id="ex3-textarea-disabled" disabled rows={4} defaultValue="권한이 없습니다." />
            </Ex3Field>
          </Example3StateCard>
          <Example3StateCard label="Invalid">
            <Ex3Field label="신고 사유" htmlFor="ex3-textarea-invalid" error="10자 이상 입력해 주세요">
              <Ex3Textarea id="ex3-textarea-invalid" invalid rows={4} defaultValue="짧음" />
            </Ex3Field>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
