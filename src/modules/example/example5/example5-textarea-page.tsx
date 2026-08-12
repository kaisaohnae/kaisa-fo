import {Ex5Field, Ex5Textarea} from './kit';
import Example5ShowcaseSection from './example5-showcase-section';
import Example5ShowcaseShell from './example5-showcase-shell';
import Example5StateCard from './example5-state-card';

export default function Example5TextareaPage() {
  return (
    <Example5ShowcaseShell title="Textarea" description="rows · resize · disabled · readOnly · invalid">
      <Example5ShowcaseSection title="기본">
        <div className="ex5-state-grid">
          <Example5StateCard label="Default">
            <Ex5Field label="메모" htmlFor="ex5-textarea-default" hint="최대 500자">
              <Ex5Textarea id="ex5-textarea-default" placeholder="내용을 입력하세요" rows={4} />
            </Ex5Field>
          </Example5StateCard>
          <Example5StateCard label="Fixed rows">
            <Ex5Field label="피드백" htmlFor="ex5-textarea-rows">
              <Ex5Textarea
                id="ex5-textarea-rows"
                rows={6}
                defaultValue={'서비스 UI가 깔끔합니다.\n추가로 다크모드 토글 위치를 검토해 주세요.'}
              />
            </Ex5Field>
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="State">
        <div className="ex5-state-grid">
          <Example5StateCard label="Read only">
            <Ex5Field label="감사 로그" htmlFor="ex5-textarea-readonly" hint="수정 불가">
              <Ex5Textarea
                id="ex5-textarea-readonly"
                readOnly
                rows={4}
                defaultValue="2026-06-27 14:32 · 관리자가 설정을 변경했습니다."
              />
            </Ex5Field>
          </Example5StateCard>
          <Example5StateCard label="Disabled">
            <Ex5Field label="비공개 메모" htmlFor="ex5-textarea-disabled" disabled>
              <Ex5Textarea id="ex5-textarea-disabled" disabled rows={4} defaultValue="권한이 없습니다." />
            </Ex5Field>
          </Example5StateCard>
          <Example5StateCard label="Invalid">
            <Ex5Field label="신고 사유" htmlFor="ex5-textarea-invalid" error="10자 이상 입력해 주세요">
              <Ex5Textarea id="ex5-textarea-invalid" invalid rows={4} defaultValue="짧음" />
            </Ex5Field>
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>
    </Example5ShowcaseShell>
  );
}
