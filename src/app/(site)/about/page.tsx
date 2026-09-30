import StaticTextPage from '@/components/blog/static-text-page';
import {getAllBlogPostSummaries, getBlogCategories} from '@/data/blog-posts';
import {buildPageMetadata} from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: '소개',
  description: 'Kaisa는 2005년부터 웹·앱 개발을 해 온 개발자가 운영하는 기술 블로그이자 브라우저 도구 모음입니다.',
  path: '/about/',
});

export default function Page() {
  const posts = getAllBlogPostSummaries();
  const categories = getBlogCategories()
    .map(cat => `- [${cat.label}](/posts/?category=${encodeURIComponent(cat.id)}) — ${cat.count}편`)
    .join('\n');

  const markdown = `
Kaisa(kaisa.co.kr)는 2005년부터 웹·앱 서비스를 만들어 온 개발자가 직접 운영하는 사이트입니다.
실무에서 쓰는 기술을 정리한 **기술 포스트**, 설치 없이 브라우저에서 바로 쓰는 **도구**, 그리고 지금까지 참여한 **프로젝트 기록**을 제공합니다.

## 기술 포스트

프레임워크를 처음 시작할 때부터 운영·배포 체크리스트까지 순서대로 따라갈 수 있도록 시리즈로 작성합니다.
현재 ${posts.length}편의 글이 있으며, 새 버전이 나오거나 내용이 바뀌면 기존 글도 계속 고칩니다.

${categories}

## 브라우저 도구

이미지 압축·리사이즈·변환, PDF 합치기·분할·압축, JSON·SQL 포맷, QR 코드, 텍스트 비교, 비밀번호·UUID 생성 등 개발과 문서 작업에 자주 필요한 도구를 제공합니다.
모든 파일은 **사용자의 브라우저 안에서만 처리**되며 서버로 업로드되지 않습니다. [도구 바로가기](/image/compress/)

## 작업

2005년부터 참여한 웹·앱 프로젝트와 일러스트 작업은 [작업](/works/) 페이지에서 볼 수 있습니다.

## 문의

글의 오류 제보, 도구 기능 요청, 협업 문의는 [7083620@hanmail.net](mailto:7083620@hanmail.net)로 보내 주세요. 각 도구 페이지 아래의 요청 게시판을 이용하셔도 됩니다.

개인정보 처리 방식은 [개인정보처리방침](/privacy/)을 참고해 주세요.
`;

  return <StaticTextPage title="Kaisa 소개" markdown={markdown} />;
}
