# kaisa-fo

kaisa-fo 2.0 홈페이지

#### 버전 정보

- Node.js: 20.x.x
- React: 18.x.x
- Next.js: 14.x.x

```
brew uninstall yarn
yarn upgrade-interactive
yarn install
```

## 프로젝트 구조

```
root
 ├─.next: 빌드에 필요한 파일이 생성되는 경로
 ├─node_modules: node 패키지 로컬 설치 경로
 ├─out: 빌드 결과물이 위치하는 경로
 ├─public: 정적 파일이 위치하는 경로
 ├─src
 │  ├─components: 리액트 컴포넌트 모음
 │  ├─config: 설정 파일
 │  ├─etc: 기타 파일
 │  ├─pages: 바닥 페이지 컴포넌트 모음
 │  ├─styles: CSS 파일
 │  └─type: 타입 선언 파일
 └─__tests__: 테스트 파일
```

- `.next`
- `node_modules`: .
- `out`: 빌드 결과물이 위치하는 경로.
- `public`: 정적 파일이 위치하는 경로.
- `src`: 소스 코드 루트 경로.

### 환경 설정 파일

- `.eslintrc.json`: ESLint 설정
- `.prettierrc.json`: Prettier 설정
- `next.config.ts`: Next.js 설정
- `tsconfig.json`: TypeScript 설정

### 환경 변수 파일

- `.env`: 실행 환경과 상관없이 불러오는 환경 변수 파일
- `.env.local`: 실행 환경과 상관없이 불러오는 환경 변수 파일. **이 파일은 개인 API 키 같은 민감 정보를 설정하며, 버전 관리 대상에서 제외해야 합니다.**
- `.env.development`: 개발 환경(`next dev`)일 때만 불러오는 환경 변수 파일.
- `.env.production`: 프로덕션 환경(`next build`, `next start`)일 때만 불러오는 환경 변수 파일.
- `.env.test`: 테스트 환경(`next test`)일 때만 불러오는 환경 변수 파일.

우선순위는 아래와 같습니다:

- `.env.local`
- `.env.development`, `.env.production`, `.env.test`
- `.env`

## 빌드 환경 설정

### Node.js 설치

특정 버전을 그냥 설치하지 말고 버전 관리를 위해 nvm을 설치합니다: https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating

```bash
# nvm 설치 후 
nvm install 20
```

### Yarn

프로젝트에서 의존하는 NPM 패키지들을 설치합니다.

```bash
# yarn 활성화
corepack enable

# 프로젝트 루트에서
yarn install
```

🚨 npm이나 Bun을 사용해도 됩니다.

Yarn으로 NPM 패키지를 추가하거나 삭제하는 명령어는 다음과 같습니다:

```bash
# 모듈 추가하기
yarn add PACKAGE_NAME

# 모듈 삭제하기
yarn remove PACKAGE_NAME
```

### Next.js

이 프로젝트는 리액트를 기반으로 하는 Next.js 프레임워크를 사용합니다. 아래는 Next.js에서 제공하는 NPM 스크립트입니다:

```bash
# 개발 모드로 로컬 서버 시작
yarn dev
```

## 서버 배포하기

### 빌드

```bash
yarn build 
# 빌드 후 생성되는 `out`의 모든 파일들을 서버에 업로드 해도 되지만 github/workflows/deploy.yml 사용 
# README_BUILD.md 참조 
```

### 초기화 
```
git config --global user.name "kaisa"
git config --global user.email "kaisa@kaisa.co.kr"
rm -rf .git
git init
git add .
git commit -m "init"
git remote add origin "https://github.com/kaisaohnae/kaisa-fo.git"
git branch -m main master
git push -u --force origin master
```
