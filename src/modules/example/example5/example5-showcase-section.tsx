import type {ReactNode} from 'react';

type Example5ShowcaseSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function Example5ShowcaseSection({
  title,
  description,
  children,
}: Example5ShowcaseSectionProps) {
  return (
    <section className="ex5-panel">
      <div className="ex5-panel__head">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="ex5-panel__body">{children}</div>
    </section>
  );
}
