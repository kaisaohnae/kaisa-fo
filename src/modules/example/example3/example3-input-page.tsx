import {Ex3Field, Ex3Input} from './kit';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

export default function Example3InputPage() {
  return (
    <Example3ShowcaseShell
      title="Input"
      description="size · type · 상태(disabled / readOnly / invalid)"
    >
      <Example3ShowcaseSection title="Size" description="sm · md · lg">
        <div className="ex3-state-grid">
          <Example3StateCard label="Small">
            <Ex3Input uiSize="sm" placeholder="Small input" />
          </Example3StateCard>
          <Example3StateCard label="Medium">
            <Ex3Input uiSize="md" placeholder="Medium input" defaultValue="기본값" />
          </Example3StateCard>
          <Example3StateCard label="Large">
            <Ex3Input uiSize="lg" placeholder="Large input" />
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Type" description="text · email · password · number · search">
        <div className="ex3-state-grid">
          <Example3StateCard label="Email">
            <Ex3Field label="이메일" htmlFor="ex3-input-email">
              <Ex3Input id="ex3-input-email" type="email" placeholder="name@company.com" />
            </Ex3Field>
          </Example3StateCard>
          <Example3StateCard label="Password">
            <Ex3Field label="비밀번호" htmlFor="ex3-input-password" required>
              <Ex3Input id="ex3-input-password" type="password" defaultValue="password123" />
            </Ex3Field>
          </Example3StateCard>
          <Example3StateCard label="Number">
            <Ex3Field label="수량" htmlFor="ex3-input-number" hint="1~99">
              <Ex3Input id="ex3-input-number" type="number" min={1} max={99} defaultValue={10} />
            </Ex3Field>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="State" description="disabled · readOnly · invalid · hint / error">
        <div className="ex3-state-grid">
          <Example3StateCard label="Default">
            <Ex3Field label="프로젝트명" htmlFor="ex3-input-default" hint="2~30자">
              <Ex3Input id="ex3-input-default" placeholder="Kaisa UI Kit" />
            </Ex3Field>
          </Example3StateCard>
          <Example3StateCard label="Disabled">
            <Ex3Field label="승인 상태" htmlFor="ex3-input-disabled" disabled hint="관리자만 변경">
              <Ex3Input id="ex3-input-disabled" defaultValue="승인 완료" disabled />
            </Ex3Field>
          </Example3StateCard>
          <Example3StateCard label="Read only">
            <Ex3Field label="회원 ID" htmlFor="ex3-input-readonly" hint="수정 불가">
              <Ex3Input id="ex3-input-readonly" readOnly defaultValue="USR-20260627-001" />
            </Ex3Field>
          </Example3StateCard>
          <Example3StateCard label="Invalid">
            <Ex3Field label="전화번호" htmlFor="ex3-input-invalid" error="올바른 형식이 아닙니다">
              <Ex3Input id="ex3-input-invalid" invalid defaultValue="010-abc" />
            </Ex3Field>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
