/* Technology R1.6.1 release gate over actual compiled Jekyll homepage.
 * Timeline and 20-viewport Chromium motion QA remain immutable in Builder
 * workflow run 38075477480; this gate checks EN/RU integration and seams. */
import fs from 'node:fs';
const root='_site',errors=[],cases=[];
const required=[
 'assets/css/home-technology-fold-flow-r1-6-1.css',
 'assets/js/home-technology-fold-flow-r1-6-1.js',
 'assets/css/home-technology-fold-flow-r1-5-1.css',
 'assets/js/home-technology-fold-flow-r1-5-1.js',
 'assets/brand/proai-logo-r341/proai-logo-r341-static-cube-320.png'
];
for(const f of required)if(!fs.existsSync(root+'/'+f))errors.push({type:'missing-asset',asset:f});
for(const [lang,file] of [['en','index.html'],['ru','ru/index.html']]){
 const html=fs.readFileSync(root+'/'+file,'utf8');
 const count=s=>html.split(s).length-1;
 const css='/assets/css/home-technology-fold-flow-r1-6-1.css';
 const js='/assets/js/home-technology-fold-flow-r1-6-1.js';
 const before=html.indexOf('data-tw-r5');
 const tech=html.indexOf('class="home-tech-ff home-tech-r161"');
 const after=html.indexOf('home-fs-showcase-r14');
 const checks={
  section:count('data-home-tech-fold-flow')===1,
  css:count(css)===1,
  js:count(js)===1,
  r151NotLoaded:!html.includes('/assets/css/home-technology-fold-flow-r1-5-1.css')&&!html.includes('/assets/js/home-technology-fold-flow-r1-5-1.js'),
  ordered:before>=0&&tech>before&&after>tech,
  panelUnderstand:count('data-ff-panel="understand"')===1,
  panelOrchestrate:count('data-ff-panel="orchestrate"')===1,
  panelCommunicate:count('data-ff-panel="communicate"')===1,
  panelDeliver:count('data-ff-panel="deliver"')===1,
  panelResolved:count('data-ff-panel="resolved"')===1,
  payload:html.includes(lang==='en'?'BUSINESS REQUEST':'БИЗНЕС-ЗАПРОС'),
  final:html.includes(lang==='en'?'ONE WORKING SYSTEM.':'ЕДИНАЯ РАБОТАЮЩАЯ СИСТЕМА.'),
  handoff:html.includes(lang==='en'?'REAL IMPLEMENTATION':'РЕАЛЬНОЕ ВНЕДРЕНИЕ'),
  logo:html.includes('/assets/brand/proai-logo-r341/proai-logo-r341-static-cube-320.png'),
  noUnprocessedLiquid:!html.includes('{% include home-technology-fold-flow'),
 };
 for(const [name,ok] of Object.entries(checks))if(!ok)errors.push({lang,type:name});
 cases.push({lang,checks,htmlBytes:Buffer.byteLength(html)});
}
fs.mkdirSync('r161-production-integration-evidence',{recursive:true});
fs.writeFileSync('r161-production-integration-evidence/results.json',JSON.stringify({pass:errors.length===0,cases,errors},null,2));
console.log('TECH_R161_COMPILED_HOMEPAGE '+JSON.stringify({pass:errors.length===0,languages:cases.length,assertions:cases.length*Object.keys(cases[0]?.checks||{}).length+required.length,errors}));
if(errors.length)process.exitCode=1;
