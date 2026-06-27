import {UiField, UiSelect} from '@/ui-components';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

export default function Example3SelectPage() {
  return (
    <Example3ShowcaseShell title="Select" description="placeholder · option group · size · state">
      <Example3ShowcaseSection title="기본" description="카테고리 · 역할 선택">
        <div className="ex3-state-grid">
          <Example3StateCard label="Placeholder">
            <UiField label="카테고리" htmlFor="ex3-select-category">
              <UiSelect id="ex3-select-category" defaultValue="">
                <option value="" disabled>
                  선택하세요
                </option>
                <option value="design">Design</option>
                <option value="develop">Develop</option>
                <option value="plan">Plan</option>
              </UiSelect>
            </UiField>
          </Example3StateCard>
          <Example3StateCard label="Option group">
            <UiField label="역할" htmlFor="ex3-select-role">
              <UiSelect id="ex3-select-role" defaultValue="editor">
                <optgroup label="운영">
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                </optgroup>
                <optgroup label="일반">
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </optgroup>
              </UiSelect>
            </UiField>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Size · State">
        <div className="ex3-state-grid">
          <Example3StateCard label="Small">
            <UiSelect uiSize="sm" defaultValue="md">
              <option value="sm">Small</option>
              <option value="md">Medium</option>
            </UiSelect>
          </Example3StateCard>
          <Example3StateCard label="Large">
            <UiSelect uiSize="lg" defaultValue="lg">
              <option value="lg">Large</option>
            </UiSelect>
          </Example3StateCard>
          <Example3StateCard label="Disabled">
            <UiField label="구독 플랜" htmlFor="ex3-select-disabled" disabled>
              <UiSelect id="ex3-select-disabled" disabled defaultValue="pro">
                <option value="pro">Pro Plan</option>
              </UiSelect>
            </UiField>
          </Example3StateCard>
          <Example3StateCard label="Invalid">
            <UiField label="지역" htmlFor="ex3-select-invalid" error="필수 선택 항목입니다">
              <UiSelect id="ex3-select-invalid" invalid defaultValue="">
                <option value="">미선택</option>
                <option value="kr">Korea</option>
              </UiSelect>
            </UiField>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
