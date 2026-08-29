import type {Metadata} from 'next';
import Example1Dashboard from '@/modules/example/example1/example1-dashboard';

export const metadata: Metadata = {
  title: 'example1 — 펜션 관리 Example1',
  description: 'Kaisa 펜션 관리자 대시보드 샘플',
};

export default function Example1Page() {
  return <Example1Dashboard />;
}
