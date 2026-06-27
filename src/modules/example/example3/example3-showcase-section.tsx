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
    <section className="ex3-panel">
      <div className="ex3-panel__head">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="ex3-panel__body">{children}</div>
    </section>
  );
}
