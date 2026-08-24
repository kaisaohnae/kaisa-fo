import {dirname} from 'path';
import {fileURLToPath} from 'url';
import {FlatCompat} from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['**/*.ts', '**/*.tsx'], // TypeScript 파일 규칙 추가
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // no-explicit-any 규칙 비활성화
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'warn', // no-unused-vars 경고로 설정
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'], // JavaScript 파일 규칙 추가
    rules: {
      'no-unused-vars': 'warn' // no-unused-vars 경고로 설정
    }
  }
];

export default eslintConfig;
