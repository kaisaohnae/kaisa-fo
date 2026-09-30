import StaticTextPage from '@/components/blog/static-text-page';
import {buildPageMetadata} from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: '개인정보처리방침',
  description: 'Kaisa(kaisa.co.kr)의 개인정보 수집·이용, 쿠키, 광고(Google AdSense) 및 분석 도구 사용에 대한 안내입니다.',
  path: '/privacy/',
});

const MARKDOWN = `
Kaisa(이하 "사이트", kaisa.co.kr)는 이용자의 개인정보를 중요하게 생각하며, 관련 법령을 지키기 위해 다음과 같이 개인정보처리방침을 공개합니다.

## 1. 수집하는 정보

- **회원가입 시**: 이메일, 닉네임, 비밀번호(암호화 저장)
- **댓글·게시판·도구 요청 작성 시**: 작성한 내용과 작성 시각
- **자동으로 수집되는 정보**: 접속 기록, 브라우저·기기 정보, 쿠키(아래 3항)

회원가입 없이도 포스트 열람과 도구 사용은 모두 가능합니다.

## 2. 이용 목적

- 회원 식별, 로그인, 비밀번호 찾기 등 계정 관리
- 댓글·게시판·도구 요청 기능 제공
- 서비스 이용 통계 분석과 품질 개선
- 광고 게재(아래 4항)

## 3. 쿠키 사용

사이트는 다음 목적의 쿠키와 브라우저 저장소(localStorage)를 사용합니다.

- 화면 테마(라이트/다크), 언어, 메뉴 상태 기억
- 로그인 상태 유지
- 방문 통계(Google Analytics)와 광고(Google AdSense)

브라우저 설정에서 쿠키 저장을 거부하거나 삭제할 수 있습니다. 다만 이 경우 일부 기능(로그인 유지 등)이 제한될 수 있습니다.

## 4. 광고 및 분석 도구

- 사이트는 **Google AdSense**를 통해 광고를 게재합니다. Google을 비롯한 제3자 광고 공급업체는 쿠키를 사용하여 이용자가 이 사이트나 다른 웹사이트를 방문한 기록을 바탕으로 광고를 게재할 수 있습니다.
- Google의 광고 쿠키 사용으로 Google과 파트너는 이 사이트 및 인터넷의 다른 사이트 방문 정보를 바탕으로 광고를 게재할 수 있습니다.
- 이용자는 [Google 광고 설정](https://adssettings.google.com/)에서 맞춤 광고를 해제할 수 있으며, [www.aboutads.info](https://www.aboutads.info/)에서 제3자 공급업체의 맞춤 광고 쿠키를 해제할 수 있습니다.
- Google이 데이터를 사용하는 방식은 [Google 파트너 사이트 데이터 사용 안내](https://policies.google.com/technologies/partner-sites)에서 확인할 수 있습니다.
- 방문 통계에는 **Google Analytics**를 사용합니다.

## 5. 도구에서 처리하는 파일

이미지·PDF·텍스트 도구에 넣은 파일과 내용은 **이용자의 브라우저 안에서만 처리**되며 사이트 서버로 전송·저장되지 않습니다. (도구 요청 게시판에 직접 작성한 글은 제외)

## 6. 보관 및 파기

회원 정보는 회원 탈퇴 시 지체 없이 삭제합니다. 법령에 따라 보관이 필요한 경우에는 해당 기간 동안만 보관합니다.

## 7. 제3자 제공

사이트는 법령에 근거가 있거나 이용자가 동의한 경우를 제외하고 개인정보를 제3자에게 제공하지 않습니다.

## 8. 이용자의 권리

이용자는 언제든지 자신의 개인정보 열람·수정·삭제를 요청할 수 있으며, 회원 설정에서 직접 탈퇴할 수 있습니다.

## 9. 문의처

개인정보 관련 문의: [7083620@hanmail.net](mailto:7083620@hanmail.net)

이 방침은 2026년 9월 30일부터 적용됩니다.
`;

export default function Page() {
  return <StaticTextPage title="개인정보처리방침" updated="시행일 2026-09-30" markdown={MARKDOWN} />;
}
