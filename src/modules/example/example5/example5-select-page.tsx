import {Ex5Field, Ex5Select} from './kit';
import Example5ShowcaseSection from './example5-showcase-section';
import Example5ShowcaseShell from './example5-showcase-shell';
import Example5StateCard from './example5-state-card';

export default function Example5SelectPage() {
  return (
    <Example5ShowcaseShell title="Select" description="placeholder · option group · size · state">
      <Example5ShowcaseSection title="기본" description="카테고리 · 역할 선택">
        <div className="ex5-state-grid">
          <Example5StateCard label="Placeholder">
            <Ex5Field label="카테고리" htmlFor="ex5-select-category">
              <Ex5Select id="ex5-select-category" defaultValue="">
                <option value="" disabled>
                  선택하세요
                </option>
                <option value="design">Design</option>
                <option value="develop">Develop</option>
                <option value="plan">Plan</option>
              </Ex5Select>
            </Ex5Field>
          </Example5StateCard>
          <Example5StateCard label="Option group">
            <Ex5Field label="역할" htmlFor="ex5-select-role">
              <Ex5Select id="ex5-select-role" defaultValue="editor">
                <optgroup label="운영">
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                </optgroup>
                <optgroup label="일반">
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </optgroup>
              </Ex5Select>
            </Ex5Field>
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="Size · State">
        <div className="ex5-state-grid">
          <Example5StateCard label="Small">
            <Ex5Select uiSize="sm" defaultValue="md">
              <option value="sm">Small</option>
              <option value="md">Medium</option>
            </Ex5Select>
          </Example5StateCard>
          <Example5StateCard label="Large">
            <Ex5Select uiSize="lg" defaultValue="lg">
              <option value="lg">Large</option>
            </Ex5Select>
          </Example5StateCard>
          <Example5StateCard label="Disabled">
            <Ex5Field label="구독 플랜" htmlFor="ex5-select-disabled" disabled>
              <Ex5Select id="ex5-select-disabled" disabled defaultValue="pro">
                <option value="pro">Pro Plan</option>
              </Ex5Select>
            </Ex5Field>
          </Example5StateCard>
          <Example5StateCard label="Invalid">
            <Ex5Field label="지역" htmlFor="ex5-select-invalid" error="필수 선택 항목입니다">
              <Ex5Select id="ex5-select-invalid" invalid defaultValue="">
                <option value="">미선택</option>
                <option value="kr">Korea</option>
              </Ex5Select>
            </Ex5Field>
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>
    </Example5ShowcaseShell>
  );
}
