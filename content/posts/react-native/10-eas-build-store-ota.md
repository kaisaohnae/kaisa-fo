---
slug: react-native-10
order: 10
category: react-native
categoryLabel: React Native
title: "EAS 빌드·스토어 배포·OTA"
summary: "EAS로 스토어 빌드와 OTA 업데이트를 나누고, 출시 전에 볼 점검 목록을 정리한다."
publishedAt: 2026-08-19
tags: ["react-native"]
---

# EAS 빌드·스토어 배포·OTA

> 요약: EAS로 스토어 빌드와 OTA 업데이트를 나누고, 출시 전에 볼 점검 목록을 정리한다.

---

## 1. 왜 EAS인가

로컬 Xcode/Gradle만으로도 IPA/AAB는 나온다. 다만 인증서, 시뮬레이터, CI 머신을 팀마다 맞추기 어렵다.

**EAS**(Expo Application Services)는 Expo의 클라우드 빌드·스토어 제출·JS 업데이트 서비스다. 실무 기본은 **EAS Build로 바이너리를 만들고**, 카피·버그 수정은 가능하면 스토어 없이 내린다.

**OTA**(Over-The-Air)는 스토어 심사 없이 JavaScript와 에셋을 기기에 보내는 방식이다. Expo에서는 **EAS Update**가 담당한다. 네이티브 모듈·권한·SDK를 바꾸면 OTA로 안 된다. 새 스토어 빌드가 필요하다.

---

## 2. 핵심 개념

| 방식 | 왜 쓰는가 |
|------|-----------|
| Expo Go | 프로토타입. 커스텀 네이티브가 없으면 가장 빠르다 |
| Development Build | 팀 네이티브 모듈을 실기기에 넣고 JS는 Metro로 돌린다 |
| EAS Build | CI와 같은 환경에서 IPA/AAB를 만든다 |
| 로컬 prebuild | `ios/`/`android/`를 열어 네이티브를 직접 볼 때 |

프로파일로 환경을 나눈다. development는 내부 개발 클라이언트, preview는 테스터 APK, production은 스토어다.

`version`은 사용자가 본다. 스토어 빌드 번호는 `autoIncrement`가 안전하다. 번들 ID / applicationId는 나중에 바꾸기 어렵다.

OTA는 `runtimeVersion`이 맞는 바이너리에만 들어간다. 너무 오래된 앱에는 강제 업데이트 UI가 필요하다.

---

## 3. 예제

```bash
npm i -g eas-cli
eas login
eas build:configure
```

```bash
npx expo install expo-dev-client
eas build --profile development --platform android
```

```json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

`EXPO_PUBLIC_API_URL`은 프로파일별 시크릿/환경으로 나눈다. `eas secret:create` 또는 EAS env.

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
eas submit --platform ios
eas submit --platform android
```

```json
{
  "expo": {
    "ios": { "bundleIdentifier": "com.example.myapp" },
    "android": { "package": "com.example.myapp", "versionCode": 1 },
    "version": "1.0.0",
    "runtimeVersion": { "policy": "appVersion" },
    "updates": { "url": "https://u.expo.dev/..." }
  }
}
```

```bash
npx expo install expo-updates
eas update --branch production --message "Fix checkout crash"
```

CI 스케치: PR은 lint·typecheck·test. `main`은 preview. 태그는 production build + submit. 핫픽스는 `eas update`. 시크릿은 `EXPO_TOKEN`과 스토어 키.

딥링크: `myapp://` 스킴 + HTTPS App Links / Universal Links. 알림·매직링크가 심사에서 자주 막힌다.

Play는 AAB. 불필요 권한은 심사 리스크다. iOS Privacy Manifest, 계정 삭제, 암호화 질문도 체크한다.

---

## 4. 흔한 실수

| 실수 | 왜 문제인가 |
|------|-------------|
| 네이티브 변경을 OTA로 배포 | 모듈·권한이 없는 옛 바이너리에서는 크래시한다 |
| runtimeVersion 없이 업데이트 | 호환 안 되는 JS가 깔려 기동이 실패한다 |
| 번들 ID를 출시 직전 변경 | 스토어 앱이 새 앱이 되어 리뷰·구매가 끊긴다 |
| 모든 테스터에게 production 서명 | 내부 배포와 스토어 트랙이 섞여 롤백이 어렵다 |
| 롤백 절차 없음 | 잘못된 OTA를 이전 업데이트로 되돌릴 수 있어야 한다 |

---

## 5. 정리 — 프로덕션 체크리스트

각 항목은 **한 줄 이유**다. 통과/미통과로 표시한다.

### 제품

- [ ] 빈·로딩·에러·오프라인 UI — 네트워크가 기본인 앱에서 흰 화면은 이탈이다
- [ ] 인증 만료·토큰 갱신 — 재설치 없이 세션이 죽으면 리뷰가 쌓인다
- [ ] 딥링크·푸시 진입점 — 알림을 열었는데 홈만 뜨면 캠페인이 무의미하다
- [ ] 주요 CTA 접근성 라벨 — 심사와 스크린 리더가 버튼을 못 찾는다

### 기술

- [ ] API 환경 분리 — prod 앱이 staging을 치면 데이터가 섞인다
- [ ] 토큰은 SecureStore — 백업·로그에 access token이 남으면 탈취 경로다
- [ ] Sentry + 소스맵 — 스토어 크래시를 파일·줄로 못 보면 고칠 수 없다
- [ ] 프로덕션 로그에 시크릿 없음 — 토큰이 관측 도구에 쌓인다
- [ ] Hermes / New Architecture 확인 — 끄고 빌드하면 성능·호환이 문서와 달라진다
- [ ] 권한 문구가 `app.json`에 있음 — usage description 없으면 iOS 제출이 거절된다

### 배포

- [ ] EAS production 빌드 성공 — 로컬에서만 되는 빌드는 CI에서 깨진다
- [ ] 내부 테스트 트랙 — 스토어 공개 전에 테스터 바이너리로 회귀를 본다
- [ ] OTA 브랜치 전략 문서 — production 핫픽스와 preview 실험이 섞이면 사고다
- [ ] 롤백 방법 — 이전 `eas update` 또는 스토어 이전 빌드로 되돌린다
- [ ] version + 빌드 번호 autoIncrement — 같은 번호 재업로드는 스토어가 거절한다
- [ ] 아이콘·스플래시·개인정보 고지 — 메타 누락은 바이너리보다 심사를 오래 끈다
- [ ] Play AAB / 불필요 권한 제거 — APK 직접 업로드·과잉 권한은 정책 위반이다
- [ ] 계정 삭제(해당 시) — 로그인 앱은 스토어가 삭제 경로를 요구한다

기본 조합은 **Expo + TypeScript + Expo Router + React Query + EAS**다.

- UI: Flex와 명확한 컴포넌트
- 서버 상태: Query. 클라이언트 전역: 최소
- 토큰: SecureStore. 권한: 필요 시점
- 애니메이션: UI 스레드
- 출시: EAS 빌드. 핫픽스: OTA. 네이티브 변경: 스토어

## 연습

1. EAS 프로젝트를 연결하고 preview 내부 배포를 만든다.
2. production 프로파일에서 빌드 번호가 증가하는지 확인한다.
3. 카피 수정만 `eas update`로 배포한다.
4. 위 체크리스트를 통과/미통과로 표시한다.
5. (선택) PR에 typecheck + test를 건다.
