import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const label = process.env.QA_LABEL;
const lang = process.env.QA_LANG;
const url = process.env.QA_URL;
const width = Number(process.env.QA_WIDTH);
const height = Number(process.env.QA_HEIGHT);
if (!label || !lang || !url || !width || !height) throw new Error('Missing QA case env');

const out = process.env.GITHUB_WORKSPACE + '/qa-evidence-matrix';
fs.mkdirSync(out,{recursive:true});
const expected = {
  en:{imp:'8.36K',test:'7 / 7 reference tests passing'},
  ru:{imp:'8,36K',test:'7 / 7 reference-тестов проходят'}
};
const groups = [
  ['Header CTA','.site-header__cta','a'],
  ['Header locale','.site-header__locale','a'],
  ['Hero primary','.ai-r3-hero .ai-r3-btn--primary','a'],
  ['Hero secondary','.ai-r3-hero .ai-r3-btn:not(.ai-r3-btn--primary)','a'],
  ['Section 08 CTA','.ai-r3-cta .ai-r3-btn--primary','a'],
  ['Footer CTA','.home-footer-golden-r3__action','a'],
  ['Footer email','.home-footer-golden-r3__contact a[href^="mailto:"]','a'],
  ['Footer navigation','.home-footer-golden-r3__capabilities a','a'],
  ['Footer social','.home-footer-golden-r3__social-rail a','a'],
  ['Footer locale','.home-footer-golden-r3__locale a','a'],
  ['Mobile menu','.site-header__menu-toggle','button']
];
const n=v=>Number.parseFloat(v)||0;
const rgb=v=>{const m=(v||'').match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);return m?[+m[1],+m[2],+m[3],m[4]===undefined?1:+m[4]]:null};
const lum=c=>!c?null:(0.2126*c[0]+0.7152*c[1]+0.0722*c[2])/255;
async function visibleIndices(page, sel) {
  return await page.$$eval(sel, els => {
    const out=[];
    els.forEach((e,i)=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);if(r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden')out.push(i)});
    return out;
  });
}

const browser = await puppeteer.launch({executablePath:process.env.CHROME,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
const page=await browser.newPage();
await page.setViewport({width,height,deviceScaleFactor:1});
const consoleErrors=[],pageErrors=[],requestFailures=[],resourceFailures=[];
page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
page.on('pageerror',e=>pageErrors.push(String(e)));
page.on('requestfailed',r=>requestFailures.push({url:r.url(),error:r.failure()?.errorText||'unknown'}));
page.on('response',r=>{const t=r.request().resourceType();if(['stylesheet','script'].includes(t)&&r.status()>=400)resourceFailures.push({type:t,url:r.url(),status:r.status()})});
let http=0,navError='';
try { const nav=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000}); http=nav?.status()||0; } catch(e){ navError=String(e); }
try { await page.waitForFunction(()=>document.querySelector('.home-footer-golden-r3')&&document.querySelector('.ai-r3-cta .ai-r3-btn--primary'),{timeout:25000}); } catch(e){ navError += ' '+String(e); }
await new Promise(r=>setTimeout(r,1200));

const core=await page.evaluate(()=>{
  const q=s=>document.querySelector(s),html=document.documentElement.outerHTML;
  const fsCard=[...document.querySelectorAll('.ai-r3-evidence-card')].find(e=>(e.innerText||'').includes('Financial Stream'));
  const style=e=>{if(!e)return null;const s=getComputedStyle(e),r=e.getBoundingClientRect();return{color:s.color,background:s.backgroundColor,backgroundImage:s.backgroundImage,border:s.borderTopWidth+' '+s.borderTopStyle+' '+s.borderTopColor,borderRadius:s.borderRadius,opacity:s.opacity,textDecoration:s.textDecorationLine,outline:s.outline,width:r.width,height:r.height,overflowX:s.overflowX,overflowY:s.overflowY,pointerEvents:s.pointerEvents,cursor:s.cursor,clientWidth:e.clientWidth,scrollWidth:e.scrollWidth,clientHeight:e.clientHeight,scrollHeight:e.scrollHeight}};
  return {
    rawLiquid:html.includes('{%')||html.includes('{{'),
    fs:(fsCard?.innerText||'').replace(/\s+/g,' ').trim(),
    test:(q('.ai-r3-test-result')?.innerText||'').replace(/\s+/g,' ').trim(),
    overflow:document.documentElement.scrollWidth-window.innerWidth,
    hp:style(q('.ai-r3-hero .ai-r3-btn--primary')),
    hs:style(q('.ai-r3-hero .ai-r3-btn:not(.ai-r3-btn--primary)')),
    s8:style(q('.ai-r3-cta .ai-r3-btn--primary')),
    header:!!q('.site-header'), footer:!!q('.home-footer-golden-r3'),
    pills:[...document.querySelectorAll('.ai-r3-btn')].filter(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'&&(parseFloat(s.borderRadius)||0)>=100}).map(e=>e.textContent.trim())
  };
});

const f=[];
const ck=(ok,msg)=>{if(!ok)f.push(msg)};
ck(http===200,`HTTP ${http}`);
ck(!navError,`NAV ${navError}`);
ck(!core.rawLiquid,'RAW LIQUID');
ck(core.overflow===0,`OVERFLOW ${core.overflow}`);
ck(core.header,'HEADER MISSING'); ck(core.footer,'FOOTER MISSING');
ck(core.fs.includes('EN + RU')&&core.fs.includes(expected[lang].imp)&&/\b52\b/.test(core.fs),`FINANCIAL ${core.fs}`);
ck(core.test===expected[lang].test,`7/7 ${core.test}`);
ck(core.pills.length===0,`999PX PILLS ${core.pills.join('|')}`);
ck(n(core.hp?.borderRadius)===9&&core.hp?.height>=49.5&&core.hp?.backgroundImage!=='none',`HERO PRIMARY ${JSON.stringify(core.hp)}`);
ck(n(core.hs?.borderRadius)===0&&n((core.hs?.border||'').split(' ')[0])===0&&core.hs?.backgroundImage==='none',`HERO SECONDARY ${JSON.stringify(core.hs)}`);
if(width===390) ck(core.hs?.width < width*0.8,`MOBILE SECONDARY WIDTH ${core.hs?.width}`);
ck(n(core.s8?.borderRadius)===9&&core.s8?.height>=49.5&&core.s8?.backgroundImage!=='none',`SECTION08 ${JSON.stringify(core.s8)}`);
ck(resourceFailures.length===0,`ASSET ${JSON.stringify(resourceFailures)}`);
ck(consoleErrors.length===0,`CONSOLE ${JSON.stringify(consoleErrors)}`);
ck(pageErrors.length===0,`PAGEERROR ${JSON.stringify(pageErrors)}`);
ck(requestFailures.length===0,`REQUEST ${JSON.stringify(requestFailures)}`);

const cdp=await page.createCDPSession();
await cdp.send('DOM.enable');
await cdp.send('CSS.enable');
const {root}=await cdp.send('DOM.getDocument',{depth:-1,pierce:true});
const stateRows=[];
for (const [groupName,selector,type] of groups) {
  const indices=await visibleIndices(page,selector);
  for (const idx of indices) {
    const qaId=`qa-${label.replace(/[^a-z0-9]/gi,'-')}-${groupName.replace(/[^a-z0-9]/gi,'-')}-${idx}`;
    await page.$$eval(selector,(els,{idx,qaId})=>els[idx]?.setAttribute('data-qa-matrix',qaId),{idx,qaId});
    const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:`[data-qa-matrix="${qaId}"]`});
    const states=type==='a'?['default','hover','focus-visible','active','visited']:['default','hover','focus-visible','active'];
    for (const state of states) {
      const pseudo=state==='default'?[]:state==='hover'?['hover']:state==='focus-visible'?['focus','focus-visible']:state==='active'?['active']:['visited'];
      await cdp.send('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:pseudo});
      await new Promise(r=>setTimeout(r,240));
      const s=await page.$eval(`[data-qa-matrix="${qaId}"]`,e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();return{color:c.color,background:c.backgroundColor,backgroundImage:c.backgroundImage,border:c.borderTopWidth+' '+c.borderTopStyle+' '+c.borderTopColor,borderRadius:c.borderRadius,opacity:c.opacity,textDecoration:c.textDecorationLine,outline:c.outline,width:r.width,height:r.height,overflowX:c.overflowX,overflowY:c.overflowY,pointerEvents:c.pointerEvents,cursor:c.cursor,clientWidth:e.clientWidth,scrollWidth:e.scrollWidth,clientHeight:e.clientHeight,scrollHeight:e.scrollHeight}});
      stateRows.push({group:groupName,index:idx,state,...s});
      ck(Number(s.opacity)>=0.5,`${groupName}[${idx}] ${state} opacity=${s.opacity}`);
      ck(s.pointerEvents!=='none',`${groupName}[${idx}] ${state} pointer-events=none`);
      ck(s.width>0&&s.height>0,`${groupName}[${idx}] ${state} zero-size`);
      ck(s.scrollWidth<=Math.ceil(s.clientWidth)+3,`${groupName}[${idx}] ${state} x-clipping`);
      if(state==='focus-visible') ck(!/none 0px|0px none/.test(s.outline),`${groupName}[${idx}] focus outline=${s.outline}`);
      const tc=rgb(s.color),bc=rgb(s.background);
      if(tc&&bc&&bc[3]>.85&&s.backgroundImage==='none') ck(Math.abs(lum(tc)-lum(bc))>=0.18,`${groupName}[${idx}] ${state} low contrast ${s.color}/${s.background}`);
      if(groupName==='Hero primary'||groupName==='Section 08 CTA'){
        ck(n(s.borderRadius)===9,`${groupName} ${state} radius=${s.borderRadius}`);
        ck(s.backgroundImage!=='none',`${groupName} ${state} bg-image=none`);
        const l=lum(rgb(s.color)); ck(l!==null&&l>0.6,`${groupName} ${state} text=${s.color}`);
      }
      if(groupName==='Hero secondary'){
        ck(n(s.borderRadius)===0,`Hero secondary ${state} radius=${s.borderRadius}`);
        ck(n((s.border||'').split(' ')[0])===0,`Hero secondary ${state} border=${s.border}`);
        ck(s.backgroundImage==='none',`Hero secondary ${state} boxed`);
      }
    }
    await cdp.send('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:[]});
  }
}
await cdp.detach();

const summary={label,pass:f.length===0,http,overflow:core.overflow,missingCss:resourceFailures.filter(x=>x.type==='stylesheet').length,missingJs:resourceFailures.filter(x=>x.type==='script').length,consoleErrors:consoleErrors.length,pageErrors:pageErrors.length,requestFailures:requestFailures.length,pills:core.pills.length,stateCount:stateRows.length,header:core.header,footer:core.footer,financial:core.fs,test:core.test,heroPrimary:core.hp,heroSecondary:core.hs,section08:core.s8,failures:f};
const slug=label.replace(/[^a-z0-9]/gi,'_');
fs.writeFileSync(`${out}/${slug}.states.json`,JSON.stringify(stateRows,null,2));
fs.writeFileSync(`${out}/${slug}.summary.json`,JSON.stringify(summary,null,2));
await page.screenshot({path:`${out}/${slug}.png`,fullPage:false});
await browser.close();
console.log(`CASE ${label} ${f.length?'FAIL':'PASS'} HTTP=${http} OVERFLOW=${core.overflow} MISSING_CSS=${summary.missingCss} MISSING_JS=${summary.missingJs} CONSOLE=${summary.consoleErrors} REQUEST=${summary.requestFailures} PILLS=${summary.pills} STATES=${summary.stateCount}`);
f.forEach(x=>console.log(`FAIL ${label}: ${x}`));
if(f.length) process.exit(1);
