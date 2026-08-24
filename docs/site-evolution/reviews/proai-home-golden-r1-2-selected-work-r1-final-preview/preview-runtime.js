(()=>{
const PRODUCT='301166f1dd0251143f3dd5dfa468fb33e5a67b08';
const OLD='https://raw.githack.com/proaiexpert/proaiexpert.github.io/a876dfb178fd3f020c8392b336eae62253f89ae7/';
const ROOT='../../../../';
const lang=document.currentScript?.dataset.lang==='ru'?'ru':'en';
const cfg={
 en:{root:'../../../../index.html',think:'home-selected-thinking-r1-en.html',work:'home-selected-work-r1-en.html',eyebrow:'NEXT STEP',title:'Ready to build a stronger system?',summary:'If your business needs less manual work, stronger trust online, and a more deliberate next step, let’s discuss what should be built first.',action:'Discuss your project',actionHref:'/contact/',contact:'CONTACT',caps:'CAPABILITIES',services:[['AI systems and automation','/ai-systems/'],['Websites and branding','/websites-branding/'],['Case studies','/case-studies/']],home:'/',homeLabel:'ProAI Expert homepage',socialLabel:'ProAI Expert professional profiles',localeLabel:'Site language',localeHref:'/ru/',localeText:'RU',localeLang:'ru',copyright:'© 2026 PROAI EXPERT. ALL RIGHTS RESERVED.',tg:'ProAI Expert on Telegram',li:'Ihor Horb on LinkedIn',gh:'ProAI Expert on GitHub',x:'ProAI Expert on X'},
 ru:{root:'../../../../ru/index.html',think:'home-selected-thinking-r1-ru.html',work:'home-selected-work-r1-ru.html',eyebrow:'СЛЕДУЮЩИЙ ШАГ',title:'Готовы построить более сильную систему?',summary:'Если вашему бизнесу нужны более чёткие процессы, меньше ручной нагрузки и больше доверия со стороны клиентов — давайте обсудим, что стоит сделать в первую очередь.',action:'Обсудить проект',actionHref:'/ru/contact/',contact:'СВЯЗАТЬСЯ',caps:'НАПРАВЛЕНИЯ',services:[['AI-системы и автоматизация','/ru/ai-systems/'],['Сайты и брендинг','/ru/websites-branding/'],['Кейсы','/ru/case-studies/']],home:'/ru/',homeLabel:'Главная страница ProAI Expert',socialLabel:'Профессиональные профили ProAI Expert',localeLabel:'Язык сайта',localeHref:'/',localeText:'EN',localeLang:'en',copyright:'© 2026 PROAI EXPERT. ВСЕ ПРАВА ЗАЩИЩЕНЫ.',tg:'ProAI Expert в Telegram',li:'Ihor Horb в LinkedIn',gh:'ProAI Expert на GitHub',x:'ProAI Expert в X'}
}[lang];
const get=async u=>{const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error(`${u} HTTP ${r.status}`);return r.text()};
const once=(s,re,v,label)=>{if(!re.test(s))throw new Error(`Preview marker missing: ${label}`);return s.replace(re,v)};
function renderFooter(t){
 t=t.slice(t.indexOf('<link rel='));
 const val={footer_lang:lang,footer_cta_eyebrow:cfg.eyebrow,footer_cta_title:cfg.title,footer_cta_summary:cfg.summary,footer_cta_label:cfg.action,footer_cta_href:cfg.actionHref,footer_contact_title:cfg.contact,footer_capabilities_title:cfg.caps};
 for(const [k,v] of Object.entries(val))t=t.split(`{{ ${k} }}`).join(v);
 t=t.replace('{% include footer-system/contact-links.html lang=footer_lang %}',`<a href="mailto:hello@proai-expert.com">hello@proai-expert.com</a><a href="https://t.me/proAiexpert" target="_blank" rel="noopener noreferrer" aria-label="${cfg.tg}">Telegram <span aria-hidden="true">↗</span></a>`);
 t=t.replace(/{% for service in footer_copy\.services %}[\s\S]*?{% endfor %}/,cfg.services.map(([label,href])=>`<a href="${href}">${label}</a>`).join(''));
 t=t.replace(/<nav class="home-footer-golden-r3__social-rail"[\s\S]*?<\/nav>/,`<nav class="home-footer-golden-r3__social-rail" aria-label="${cfg.socialLabel}"><a href="https://www.linkedin.com/in/ihorhorb/" target="_blank" rel="noopener noreferrer" aria-label="${cfg.li}">LinkedIn</a><a href="https://github.com/proaiexpert" target="_blank" rel="noopener noreferrer" aria-label="${cfg.gh}">GitHub</a><a href="https://x.com/proaiexpert" target="_blank" rel="noopener noreferrer" aria-label="${cfg.x}">X</a></nav>`);
 const f={'{{ footer_copy.home_href }}':cfg.home,'{{ footer_copy.home_label }}':cfg.homeLabel,'{{ footer_copy.social_label }}':cfg.socialLabel,'{{ footer_copy.locale_label }}':cfg.localeLabel,'{{ footer_copy.locale_lang }}':cfg.localeLang,'{{ footer_copy.locale_text }}':cfg.localeText,'{{ footer_copy.copyright }}':cfg.copyright,"{% if footer_lang == 'ru' %}/{% else %}/ru/{% endif %}":cfg.localeHref};
 for(const [k,v] of Object.entries(f))t=t.split(k).join(v);
 if(/{[{%]/.test(t))throw new Error('Unresolved Footer Liquid');
 return t;
}
Promise.all([
 get(`../proai-home-golden-assembly-r1-2/owner-review-${lang}.html`),
 get(cfg.root),
 get(`../../../../_includes/${cfg.think}`),
 get(`../../../../_includes/${cfg.work}`),
 get('../../../../_includes/home-footer-golden-r3.html')
]).then(([shell,source,thinking,work,footerTemplate])=>{
 let s=shell;
 s=s.replace(/data-product-sha="[0-9a-f]{40}"/g,`data-product-sha="${PRODUCT}"`).replace('OWNER PREVIEW — QA PENDING · ','');
 s=s.replace(/<style id="owner-preview-qa-pending-style">[\s\S]*?<\/style>/,'').replace(/<div id="owner-preview-qa-pending"[\s\S]*?<\/div>/,'');
 const head=source.slice(source.indexOf('<script type="importmap">'),source.indexOf('</head>'));
 if(!head.includes('homepage-two-worlds-golden-r1-landscape-fix.css')||!head.includes('home-selected-work-r1.css'))throw new Error('Exact candidate head authority missing');
 s=once(s,/<script type="importmap">[\s\S]*?(?=<\/head>)/,head,'head');
 s=s.split(OLD).join(ROOT).replace(/data-logo-live-src="[^"]+"/g,'data-logo-live-src="header-live.html"');
 s=s.replace(/href="\/(favicon\.(?:svg|ico)|favicon-(?:32x32|16x16)\.png|apple-touch-icon\.png)"/g,`href="${ROOT}$1"`);
 const downstream=thinking+'\n'+work+'\n';
 s=once(s,/<div class="proai-golden-r12-downstream"[\s\S]*?(?=<\/main>)/,downstream,'downstream');
 let footer=renderFooter(footerTemplate);
 const footerMarker=lang==='ru'?'{% include home-footer-golden-r3.html lang="ru" %}':'{% include home-footer-golden-r3.html lang="en" %}';
 const p=source.indexOf(footerMarker);if(p<0)throw new Error('Footer marker missing from exact candidate source');
 const scripts=source.slice(p+footerMarker.length,source.indexOf('</body>',p));
 s=once(s,/<\/main>[\s\S]*?(?=<\/body>)/,`</main>\n${footer}\n${scripts}\n`,'tail');
 s=s.replace(/(?:href|src)="\/assets\//g,m=>m.replace('"/assets/','"'+ROOT+'assets/'));
 s=s.replace(/"three":"\/assets\//g,`"three":"${ROOT}assets/`).replace(/"three\/addons\/":"\/assets\//g,`"three/addons/":"${ROOT}assets/`);
 const banned=['a876dfb178fd3f020c8392b336eae62253f89ae7','home-footer-watermark-r2','owner-preview-qa-pending','proai-golden-r12-downstream','home-selected-work-golden-r1-2','portfolio-entry-bridge-v1','{%'];
 for(const x of banned)if(s.includes(x))throw new Error('Stale marker: '+x);
 const required=[PRODUCT,'homepage-two-worlds-golden-r1-landscape-fix.css','home-technology-transition-r2-golden-mobile.css','home-selected-thinking-r1-2.css','home-selected-work-r1.css','selected-work-r1','WEBSITE CONCEPT · LIVE DEMO','home-footer-golden-r3-1.css','PROAI EXPERT','Financial Stream','Local Repair Pro'];
 for(const x of required)if(!s.includes(x))throw new Error('Required marker missing: '+x);
 document.open();document.write(s);document.close();
}).catch(e=>{console.error(e);document.body.innerHTML=`<pre style="white-space:pre-wrap;padding:24px;color:#fff;background:#090b0e">OWNER PREVIEW BLOCKED: ${String(e.message||e)}</pre>`});
})();
