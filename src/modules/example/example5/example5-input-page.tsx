import {Ex5Field, Ex5Input} from './kit';
import Example5ShowcaseSection from './example5-showcase-section';
import Example5ShowcaseShell from './example5-showcase-shell';
import Example5StateCard from './example5-state-card';

export default function Example5InputPage() {
  return (
    <Example5ShowcaseShell
      title="Input"
      description="size · type · 상태(disabled / readOnly / invalid)"
    >
      <Example5ShowcaseSection title="Size" description="sm · md · lg">
        <div className="ex5-state-grid">
          <Example5StateCard label="Small">
            <Ex5Input uiSize="sm" placeholder="Small input" />
          </Example5StateCard>
          <Example5StateCard label="Medium">
            <Ex5Input uiSize="md" placeholder="Medium input" defaultValue="기본값" />
          </Example5StateCard>
          <Example5StateCard label="Large">
            <Ex5Input uiSize="lg" placeholder="Large input" />
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="Type" description="text · email · password · number · search">
        <div className="ex5-state-grid">
          <Example5StateCard label="Email">
            <Ex5Field label="이메일" htmlFor="ex5-input-email">
              <Ex5Input id="ex5-input-email" type="email" placeholder="name@company.com" />
            </Ex5Field>
          </Example5StateCard>
          <Example5StateCard label="Password">
            <Ex5Field label="비밀번호" htmlFor="ex5-input-password" required>
              <Ex5Input id="ex5-input-password" type="password" defaultValue="password123" />
            </Ex5Field>
          </Example5StateCard>
          <Example5StateCard label="Number">
            <Ex5Field label="수량" htmlFor="ex5-input-number" hint="1~99">
              <Ex5Input id="ex5-input-number" type="number" min={1} max={99} defaultValue={10} />
            </Ex5Field>
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="State" description="disabled · readOnly · invalid · hint / error">
        <div className="ex5-state-grid">
          <Example5StateCard label="Default">
            <Ex5Field label="프로젝트명" htmlFor="ex5-input-default" hint="2~30자">
              <Ex5Input id="ex5-input-default" placeholder="Kaisa UI Kit" />
            </Ex5Field>
          </Example5StateCard>
          <Example5StateCard label="Disabled">
            <Ex5Field label="승인 상태" htmlFor="ex5-input-disabled" disabled hint="관리자만 변경">
              <Ex5Input id="ex5-input-disabled" defaultValue="승인 완료" disabled />
            </Ex5Field>
          </Example5StateCard>
          <Example5StateCard label="Read only">
            <Ex5Field label="회원 ID" htmlFor="ex5-input-readonly" hint="수정 불가">
              <Ex5Input id="ex5-input-readonly" readOnly defaultValue="USR-20260627-001" />
            </Ex5Field>
          </Example5StateCard>
          <Example5StateCard label="Invalid">
            <Ex5Field label="전화번호" htmlFor="ex5-input-invalid" error="올바른 형식이 아닙니다">
              <Ex5Input id="ex5-input-invalid" invalid defaultValue="010-abc" />
            </Ex5Field>
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>
    </Example5ShowcaseShell>
  );
}
