import type {ReactNode} from 'react';
import Example3PageHeader from './example3-page-header';

type Example3ShowcaseShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function Example3ShowcaseShell({
  title,
  description,
  children,
}: Example3ShowcaseShellProps) {
  return (
    <>
      <Example3PageHeader title={title} description={description} />
      <div className="ex3-content">{children}</div>
    </>
  );
}
