# node version

nvm 설치
nvm install 18.15.0
nvm use 18

$ node -v
v18.15.0

https://kaisaohnae.github.io/kaisa-fo
https://kaisa.co.kr

poweshell
Remove-Item -Recurse -Force .git

```
git config --global user.name "kaisa"
git config --global user.email "kaisa@a-na.me"
rm -rf .git
git init
git add .
git commit -m "init"
git remote add origin "https://github.com/kaisaohnae/kaisa-fo.git"
git push -u --force origin master
```
## vscode 
- hide node_modules
```
npm create vite@latest
```

## env
.env.환경 에 따라 prefix 에 VATE_ 를 붙여야만 되며 import.meta.env 로 쉽게 사용할수 있습니다. 



## 깃헙에 정적페이지로 배포할경우...
```
yarn build
cd dist
echo 'kaisa.co.kr' > CNAME
git init
git checkout -b main
git add -A
git commit -m 'deploy'
git remote add origin "https://github.com/kaisaohnae/kaisa-fo.git"
git push -u --force origin main
rm -rf .git
cd ..

```
```
history: createWebHashHistory(), 해시# 방법은 정적일때만...
vue3-cookies 쿠키 사용시 set 을 잘 넣어야함...githug 정적 페이지가 안될수 있음...
```
# 배포
```
npm run test 로 미리 정적웹페이지보기 npm run build 이며 정적 웹페이지로 
(backend 와 완전분리)
백오피스이기 때문에 SEO 와 상관 없다 
Fo는 서버사이드 렌더링으로 하자 
```

## ERD
```
1. 용어사전 정리 
2. ERD 논리/물리명 및 관계 설계 
3. DB 도메인설계
4. 포워딩 후 Java 로 Java/Vue 소스 생성
5. 코드는 규칙적으로 DB 주석 달고 코드 생성
```

## DB조회 후 초기 소스 Java로 생성하기
(Vue만 아니라 Controller,Service,ServiceImpl,Dto,Vo,Mapper 등등 1800개정도 파일 자동생성하자)
```java
OutputStream outputComment = null;
try {
    outputComment = new FileOutputStream(pathFile + ".vue");
    StringBuilder sb = new StringBuilder();
    sb.append("<template>\n");
    sb.append("\t<form class=\"search\" @submit.prevent=\"getList\" @keyup.enter=\"getList\">\n");
    이하 생략
```

###
``` 
npm install --save @toast-ui/editor
npm install --save @toast-ui/editor-plugin-code-syntax-highlight
npm install --save-dev @types/prismjs

- 유틸페이지에 추가
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import Prism from 'prismjs';
...
plugins: [[codeSyntaxHighlight, { highlighter: Prism }]],

- 상세페이지에 추가
import 'prismjs/themes/prism.css';
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-python";
import "prismjs/components/prism-html";
import "prismjs/components/prism-css";
```

### Powershell node_modules 삭제 
```
Remove-Item -Recurse -Force node_modules
```

.env 에 싱글쿼터 쓰지말자...

#### 엑셀다운로드
```
npm install -save vue3-xlsx

import { XlsxRead, XlsxJson } from 'vue3-xlsx'

```
