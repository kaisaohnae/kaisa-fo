import {KaisaField, KaisaInput} from './kit';
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
        <div className="kaisa-state-grid">
          <Example3StateCard label="Small">
            <KaisaInput uiSize="sm" placeholder="Small input" />
          </Example3StateCard>
          <Example3StateCard label="Medium">
            <KaisaInput uiSize="md" placeholder="Medium input" defaultValue="기본값" />
          </Example3StateCard>
          <Example3StateCard label="Large">
            <KaisaInput uiSize="lg" placeholder="Large input" />
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Type" description="text · email · password · number · search">
        <div className="kaisa-state-grid">
          <Example3StateCard label="Email">
            <KaisaField label="이메일" htmlFor="kaisa-input-email">
              <KaisaInput id="kaisa-input-email" type="email" placeholder="name@company.com" />
            </KaisaField>
          </Example3StateCard>
          <Example3StateCard label="Password">
            <KaisaField label="비밀번호" htmlFor="kaisa-input-password" required>
              <KaisaInput id="kaisa-input-password" type="password" defaultValue="password123" />
            </KaisaField>
          </Example3StateCard>
          <Example3StateCard label="Number">
            <KaisaField label="수량" htmlFor="kaisa-input-number" hint="1~99">
              <KaisaInput id="kaisa-input-number" type="number" min={1} max={99} defaultValue={10} />
            </KaisaField>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="State" description="disabled · readOnly · invalid · hint / error">
        <div className="kaisa-state-grid">
          <Example3StateCard label="Default">
            <KaisaField label="프로젝트명" htmlFor="kaisa-input-default" hint="2~30자">
              <KaisaInput id="kaisa-input-default" placeholder="Kaisa UI Kit" />
            </KaisaField>
          </Example3StateCard>
          <Example3StateCard label="Disabled">
            <KaisaField label="승인 상태" htmlFor="kaisa-input-disabled" disabled hint="관리자만 변경">
              <KaisaInput id="kaisa-input-disabled" defaultValue="승인 완료" disabled />
            </KaisaField>
          </Example3StateCard>
          <Example3StateCard label="Read only">
            <KaisaField label="회원 ID" htmlFor="kaisa-input-readonly" hint="수정 불가">
              <KaisaInput id="kaisa-input-readonly" readOnly defaultValue="USR-20260627-001" />
            </KaisaField>
          </Example3StateCard>
          <Example3StateCard label="Invalid">
            <KaisaField label="전화번호" htmlFor="kaisa-input-invalid" error="올바른 형식이 아닙니다">
              <KaisaInput id="kaisa-input-invalid" invalid defaultValue="010-abc" />
            </KaisaField>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
