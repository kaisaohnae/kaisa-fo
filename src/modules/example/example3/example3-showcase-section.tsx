import type {ReactNode} from 'react';

type Example3ShowcaseSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function Example3ShowcaseSection({
  title,
  description,
  children,
}: Example3ShowcaseSectionProps) {
  return (
    <section className="kaisa-panel">
      <div className="kaisa-panel__head">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="kaisa-panel__body">{children}</div>
    </section>
  );
}
