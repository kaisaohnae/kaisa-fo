# kaisa-fo

## build 
```
yarn build
cd out
touch .nojekyll
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

