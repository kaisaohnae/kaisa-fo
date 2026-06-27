import Link from 'next/link';
import Example3ShowcaseShell from './example3-showcase-shell';
import {NAV_ITEMS} from './nav';

export default function Example3OverviewPage() {
  const items = NAV_ITEMS.filter((item) => item.id !== 'overview');

  return (
    <Example3ShowcaseShell
      title="개요"
      description="src/ui-components 공통 UI · 상태·옵션·로딩 variant 쇼케이스"
    >
      <section className="ex3-panel">
        <div className="ex3-panel__head">
          <h2>컴포넌트 목록</h2>
          <p>
            disabled · readOnly · invalid · loading 등 상태별 미리보기와 Alert · Popup · Loading
            variant 데모를 제공합니다.
          </p>
        </div>
        <div className="ex3-panel__body">
          <div className="ex3-showcase-grid">
            {items.map((item) => (
              <Link key={item.id} href={item.href} className="ex3-showcase-card">
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <p className="ex3-note">
        CSS와 React 컴포넌트는 <code>src/ui-components</code>에 두고, example3는 쇼케이스
        전용입니다.
      </p>
    </Example3ShowcaseShell>
  );
}
