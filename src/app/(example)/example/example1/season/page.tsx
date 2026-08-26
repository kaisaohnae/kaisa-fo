import Example1SeasonPage from '@/modules/example/example1/example1-season-page';
import {buildPageMetadata} from '@/lib/seo';

export const metadata = buildPageMetadata({ title: 'example1 — 시즌 설정', description: 'Kaisa 펜션 시즌·요금 설정 샘플', path: '/example/example1/season/' });

export default function Example1SeasonRoute() {
  return <Example1SeasonPage />;
}
