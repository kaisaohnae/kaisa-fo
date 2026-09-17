const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const ts=require('typescript');
const projectRoot=path.resolve(__dirname,'..'),workspace=path.dirname(projectRoot);
function session(values={}) {
 const entries=new Map(Object.entries(values));
 return {getItem:key=>entries.get(key)||null,setItem:(key,value)=>entries.set(key,value),removeItem:key=>entries.delete(key)};
}
function environment(root,jar,language='ko-KR',stored={},hostname='tool.kaisa.co.kr',offline=false) {
 const document={documentElement:{lang:'ko'}};
 Object.defineProperty(document,'cookie',{get:()=>[...jar].map(([key,value])=>key+'='+value).join('; '),set:value=>{
   const first=value.split(';')[0],index=first.indexOf('=');
   jar.set(first.slice(0,index),first.slice(index+1));document.lastCookie=value;
 }});
 const storage=session(stored),cache={};
 const browser={document,navigator:{language,languages:[language]},location:{hostname},window:{location:{hostname}},sessionStorage:storage,AbortSignal:{timeout:()=>null},fetch:async()=>{
  if(offline)throw Error('offline');
  return {ok:true,json:async()=>({country:'KR',ip:'127.0.0.1'})};
 }};
 function load(relative) {
   const filename=path.resolve(root,relative)+'.ts';
   if(cache[filename])return cache[filename];
   const result={};
   cache[filename]=result;
   const code=ts.transpile(fs.readFileSync(filename,'utf8'),{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020});
   vm.runInNewContext(code,{...browser,exports:result,require:target=>load(path.relative(root,path.resolve(path.dirname(filename),target)))});
   return result;
 }
 return {...browser,load};
}
(async()=>{
 for(const name of ['kaisa-fo','kaisa-blog','kaisa-tool','kaisa-game']){
   const root=path.join(workspace,name);if(!fs.existsSync(root))continue;
   let jar=new Map(),env=environment(root,jar,'en-US');
   let cookie=env.load('src/i18n/locale-cookie');
   vm.runInNewContext(cookie.LOCALE_BOOTSTRAP_SCRIPT,env);
   assert.equal(jar.get('kaisa-shared-locale'),'en');
   assert.equal(env.document.documentElement.lang,'en');
   assert(env.document.lastCookie.includes('domain=kaisa.co.kr'));
   assert(env.document.lastCookie.includes('max-age=2592000'));
   let detect=env.load('src/i18n/detect');
   detect.persistLocale('hi','IN');
   const other=environment(root,jar,'ko-KR',{'kaisa-locale':'ko'});
   assert.equal(other.load('src/i18n/detect').peekStoredLocale(),'hi');
   assert.equal((await other.load('src/i18n/detect').resolveLocale()).locale,'hi');

   jar=new Map([['kaisa-shared-locale','zh']]);
   env=environment(root,jar,'en-US',{'kaisa-locale':'ko'});
   vm.runInNewContext(env.load('src/i18n/locale-cookie').LOCALE_BOOTSTRAP_SCRIPT,env);
   assert.equal(env.document.documentElement.lang,'zh');
   assert.equal(jar.get('kaisa-shared-locale'),'zh');

   jar=new Map();env=environment(root,jar,'en-US',{},'localhost',true);
   detect=env.load('src/i18n/detect');
   assert.equal((await detect.resolveLocale()).locale,'en');
   assert(!env.document.lastCookie.includes('domain='));

   jar=new Map();env=environment(root,jar,'en-US');
   detect=env.load('src/i18n/detect');
   const pending=detect.resolveLocale();
   detect.persistLocale('zh','CN');
   assert.equal((await pending).locale,'zh');
   assert.equal(jar.get('kaisa-shared-locale'),'zh');

   jar=new Map([['kaisa-shared-locale','invalid']]);env=environment(root,jar,'ko-KR');
   env.sessionStorage={getItem:()=>{throw Error('blocked');}};
   vm.runInNewContext(env.load('src/i18n/locale-cookie').LOCALE_BOOTSTRAP_SCRIPT,env);
   assert.equal(jar.get('kaisa-shared-locale'),'ko');
   console.log('PASS '+name+': first entry, domain, lifetime, cross-site priority, offline/localhost, choice race, blocked storage');
 }
})().catch(error=>{console.error(error);process.exit(1)});
