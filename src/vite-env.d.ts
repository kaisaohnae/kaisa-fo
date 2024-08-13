/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_HOST: string;
  // 다른 환경 변수 타입 정의
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
