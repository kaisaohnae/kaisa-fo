import type {Metadata} from 'next';
import Example1SeasonPage from '@/modules/example/example1/example1-season-page';

export const metadata: Metadata = {
  title: 'example1 — 시즌 설정',
  description: 'Kaisa 펜션 시즌·요금 설정 샘플',
};

export default function Example1SeasonRoute() {
  return <Example1SeasonPage />;
}
