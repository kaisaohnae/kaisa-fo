import Link from 'next/link';
import Example5ShowcaseShell from './example5-showcase-shell';
import {NAV_ITEMS} from './nav';

export default function Example5OverviewPage() {
  const items = NAV_ITEMS.filter((item) => item.id !== 'overview');

  return (
    <Example5ShowcaseShell
      title="Overview"
      description="Independent kit - floating labels, card radios, chip checks, press states"
    >
      <section className="ex5-panel">
        <div className="ex5-panel__head">
          <h2>Components</h2>
          <p>
            Same IA as example3, but controls live in <code>example5/kit</code>. The shell is
            plain; the interaction is not.
          </p>
        </div>
        <div className="ex5-panel__body">
          <div className="ex5-showcase-grid">
            {items.map((item) => (
              <Link key={item.id} href={item.href} className="ex5-showcase-card">
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <p className="ex5-note">
        Default kit: <code>src/ui-components</code>. Interaction kit:{' '}
        <code>src/modules/example/example5/kit</code>.
      </p>
    </Example5ShowcaseShell>
  );
}
