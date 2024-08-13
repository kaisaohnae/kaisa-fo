#!/usr/bin/env sh (kaisaohnae가 아니면 403)
# 깃헙에 정적페이지로 배포할경우...
npm run build
cd dist
echo 'kaisa.co.kr' > CNAME
git init
git checkout -b main
git add -A
git commit -m 'deploy'
git remote add origin "https://github.com/kaisaohnae/kaisa-fo.git"
git push -u --force origin main
Remove-Item -Recurse -Force .git
cd ..
