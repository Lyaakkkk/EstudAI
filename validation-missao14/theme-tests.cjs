const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('node:assert/strict');
const source=fs.readFileSync('artifacts/estudai-web/src/lib/theme.ts','utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const bootstrap=fs.readFileSync('artifacts/estudai-web/index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
const results=[],pass=name=>results.push({name,passed:true});
function setup(saved=null,dark=false,blocked=false){
 const store=new Map(saved===null?[]:[['estudai-theme',saved]]),classes=new Set(),mediaListeners=new Set(),windowListeners=new Set();
 const root={classList:{toggle:(name,value)=>value?classes.add(name):classes.delete(name)},style:{},dataset:{}};
 const media={matches:dark,addEventListener:(_name,fn)=>mediaListeners.add(fn),removeEventListener:(_name,fn)=>mediaListeners.delete(fn)};
 const ctx={exports:{},require:()=>({useSyncExternalStore:(_s,get)=>get()}),document:{documentElement:root},
 window:{matchMedia:()=>media,addEventListener:(_n,fn)=>windowListeners.add(fn),removeEventListener:(_n,fn)=>windowListeners.delete(fn)},
 localStorage:{getItem:k=>{if(blocked)throw Error('blocked');return store.get(k)||null},setItem:(k,v)=>{if(blocked)throw Error('blocked');store.set(k,v)}},Set};
 vm.createContext(ctx);vm.runInContext(bootstrap,ctx);const initial={dark:classes.has('dark'),preference:root.dataset.themePreference,colorScheme:root.style.colorScheme};
 vm.runInContext(code,ctx);
 return {api:ctx.exports,store,root,classes,media,initial,mediaListeners,windowListeners,
 system(value){media.matches=value;for(const fn of mediaListeners)fn()},
 storage(value){if(value===null)store.delete('estudai-theme');else store.set('estudai-theme',value);for(const fn of windowListeners)fn({key:'estudai-theme',newValue:value})}};
}
for(const [saved,os,expected] of [[null,true,'dark'],[null,false,'light'],['system',true,'dark'],['dark',false,'dark'],['light',true,'light'],['invalid',true,'dark']]){
 const s=setup(saved,os);assert.equal(s.initial.dark,expected==='dark');assert.equal(s.classes.has('dark'),s.initial.dark);assert.equal(s.root.style.colorScheme,expected);pass('Bootstrap and store agree: preference '+saved+', system dark '+os);
}
const s=setup(null,false);let notifications=0;const stop=s.api.subscribeTheme(()=>notifications++),stop2=s.api.subscribeTheme(()=>{});
assert.equal(s.mediaListeners.size,1);assert.equal(s.windowListeners.size,1);s.system(true);assert.equal(s.api.useTheme().theme,'dark');pass('System follows live OS changes with one listener shared by selectors');
s.api.setThemePreference('light');assert.equal(s.store.get('estudai-theme'),'light');s.system(true);assert.equal(s.api.useTheme().theme,'light');assert.equal(s.api.useTheme().preference,'light');pass('Explicit light persists and overrides OS');
s.api.setThemePreference('dark');assert.equal(s.classes.has('dark'),true);assert.equal(setup(s.store.get('estudai-theme'),false).api.useTheme().theme,'dark');pass('Explicit dark restores on reload');
s.api.setThemePreference('system');assert.equal(s.store.get('estudai-theme'),'system');s.system(false);assert.equal(s.api.useTheme().theme,'light');pass('Choosing System resumes live OS updates and persists preference');
s.storage('dark');assert.equal(s.api.useTheme().preference,'dark');assert.equal(s.api.useTheme().theme,'dark');s.storage(null);assert.equal(s.api.useTheme().preference,'system');assert.equal(s.api.useTheme().theme,'light');pass('Cross-tab changes and removal synchronize');
stop();assert.equal(s.mediaListeners.size,1);stop2();assert.equal(s.mediaListeners.size,0);assert.equal(s.windowListeners.size,0);pass('Subscriptions are cleaned up after last selector');
const blocked=setup(null,true,true);assert.equal(blocked.initial.dark,true);assert.equal(blocked.api.useTheme().theme,'dark');blocked.api.setThemePreference('light');assert.equal(blocked.api.useTheme().theme,'light');assert.equal(blocked.api.useTheme().storageError,true);pass('Blocked storage still follows system at startup and applies manual choice in memory');
fs.writeFileSync('validation-missao14/theme-results.json',JSON.stringify({scope:'Actual bootstrap and theme store executed in VM with simulated DOM, media queries, storage and events. No browser rendering.',results},null,2));
console.log(results.length+' theme scenarios passed.');
