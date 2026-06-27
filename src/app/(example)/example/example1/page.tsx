import type {Metadata} from 'next';
import Example1Dashboard from '@/modules/example/example1/example1-dashboard';

export const metadata: Metadata = {
  title: 'example1 — Admin Dashboard',
  description: 'Admin dashboard sample module',
};

export default function Example1Page() {
  return <Example1Dashboard />;
}
