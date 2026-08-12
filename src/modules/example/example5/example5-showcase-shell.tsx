import type {ReactNode} from 'react';
import Example5PageHeader from './example5-page-header';

type Example5ShowcaseShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function Example5ShowcaseShell({
  title,
  description,
  children,
}: Example5ShowcaseShellProps) {
  return (
    <>
      <Example5PageHeader title={title} description={description} />
      <div className="ex5-content">{children}</div>
    </>
  );
}
