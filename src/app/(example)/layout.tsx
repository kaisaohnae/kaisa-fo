import type {Metadata} from 'next';
import '@/ui-components/styles/ui-components.css';
import '@/modules/example/example1/example1.css';
import '@/modules/example/example2/example2.css';
import '@/modules/example/example3/example3.css';
import '@/modules/example/example3/kit/kit.css';
import '@/modules/example/example4/example4.css';
import '@/modules/example/shared/example-responsive.css';

export const metadata: Metadata = {
  robots: {index: false, follow: false},
};

export default function ExampleLayout({children}: {children: React.ReactNode}) {
  return children;
}
