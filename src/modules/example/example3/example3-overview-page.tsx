import Link from 'next/link';
import Example3ShowcaseShell from './example3-showcase-shell';
import {NAV_ITEMS} from './nav';

export default function Example3OverviewPage() {
  const items = NAV_ITEMS.filter((item) => item.id !== 'overview');

  return (
    <Example3ShowcaseShell
      title="Overview"
      description="Independent kit - floating labels, card radios, chip checks, press states"
    >
      <section className="kaisa-panel">
        <div className="kaisa-panel__head">
          <h2>Components</h2>
        </div>
        <div className="kaisa-panel__body">
          <div className="kaisa-showcase-grid">
            {items.map((item) => (
              <Link key={item.id} href={item.href} className="kaisa-showcase-card">
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Example3ShowcaseShell>
  );
}
