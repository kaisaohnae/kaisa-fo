import {KaisaField, KaisaSelect} from './kit';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

export default function Example3SelectPage() {
  return (
    <Example3ShowcaseShell title="Select" description="placeholder · option group · size · state">
      <Example3ShowcaseSection title="기본" description="카테고리 · 역할 선택">
        <div className="kaisa-state-grid">
          <Example3StateCard label="Placeholder">
            <KaisaField label="카테고리" htmlFor="kaisa-select-category">
              <KaisaSelect id="kaisa-select-category" defaultValue="">
                <option value="" disabled>
                  선택하세요
                </option>
                <option value="design">Design</option>
                <option value="develop">Develop</option>
                <option value="plan">Plan</option>
              </KaisaSelect>
            </KaisaField>
          </Example3StateCard>
          <Example3StateCard label="Option group">
            <KaisaField label="역할" htmlFor="kaisa-select-role">
              <KaisaSelect id="kaisa-select-role" defaultValue="editor">
                <optgroup label="운영">
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                </optgroup>
                <optgroup label="일반">
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </optgroup>
              </KaisaSelect>
            </KaisaField>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Size · State">
        <div className="kaisa-state-grid">
          <Example3StateCard label="Small">
            <KaisaSelect uiSize="sm" defaultValue="md">
              <option value="sm">Small</option>
              <option value="md">Medium</option>
            </KaisaSelect>
          </Example3StateCard>
          <Example3StateCard label="Large">
            <KaisaSelect uiSize="lg" defaultValue="lg">
              <option value="lg">Large</option>
            </KaisaSelect>
          </Example3StateCard>
          <Example3StateCard label="Disabled">
            <KaisaField label="구독 플랜" htmlFor="kaisa-select-disabled" disabled>
              <KaisaSelect id="kaisa-select-disabled" disabled defaultValue="pro">
                <option value="pro">Pro Plan</option>
              </KaisaSelect>
            </KaisaField>
          </Example3StateCard>
          <Example3StateCard label="Invalid">
            <KaisaField label="지역" htmlFor="kaisa-select-invalid" error="필수 선택 항목입니다">
              <KaisaSelect id="kaisa-select-invalid" invalid defaultValue="">
                <option value="">미선택</option>
                <option value="kr">Korea</option>
              </KaisaSelect>
            </KaisaField>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
