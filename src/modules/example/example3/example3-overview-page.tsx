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
          <p>
            Same IA as example3, but controls live in <code>Example3/kit</code>. The shell is
            plain; the interaction is not.
          </p>
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

      <p className="kaisa-note">
        Default kit: <code>src/ui-components</code>. Interaction kit:{' '}
        <code>src/modules/example/example3/kit</code>.
      </p>
    </Example3ShowcaseShell>
  );
}
