(() => {
  'use strict';
  const section = document.querySelector('[data-hse-r2]');
  if (!section) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let started = false;
  let pendingVisible = false;
  let startedMode = null;
  const stateClasses = ['phase-capture','phase-enrich','phase-assist','phase-review','phase-resolve'];
  const modes = [...section.querySelectorAll('[data-hse-mode]')];
  const isVisibleMode = el => getComputedStyle(el).display !== 'none';
  const activeMode = () => modes.find(isVisibleMode) || modes[0];
  const stateRoot = mode => mode.querySelector('.hse-state') || mode.querySelector('.scene') || mode;
  const all = (root, s) => [...root.querySelectorAll(s)];
  const one = (root, s) => root.querySelector(s);
  const setPhase = (root, name) => { stateClasses.forEach(c => root.classList.remove(c)); if (name) root.classList.add('phase-' + name); };
  const clearTimers = root => { (root.__hseTimers || []).forEach(clearTimeout); root.__hseTimers = []; };
  const at = (root, ms, fn) => { root.__hseTimers ||= []; root.__hseTimers.push(setTimeout(fn, ms)); };
  const reveal = (root, line, start, span=230) => {
    if (!line) return start;
    const toks = all(line, '.tok');
    const gap = toks.length > 1 ? span/(toks.length-1) : 0;
    toks.forEach((t,i) => at(root, start + Math.round(i*gap), () => {
      t.classList.add('on','fresh');
      at(root, 120, () => t.classList.remove('fresh'));
    }));
    at(root, start, () => line.classList.add('live'));
    at(root, start+span, () => { line.classList.remove('live'); line.classList.add('done'); });
    return start+span;
  };
  const block = (mode, name) => all(mode, `.line[data-block="${name}"]`);
  const finalState = mode => {
    const root = stateRoot(mode); clearTimers(root);
    all(mode,'.tok').forEach(t=>t.classList.add('on'));
    all(mode,'.line[data-block]').forEach(l=>l.classList.add('done'));
    all(mode,'.field').forEach(f=>f.classList.add('on'));
    all(mode,'.ai-items span').forEach(x=>x.classList.add('on'));
    root.classList.add('request-on','context-on','ai-on','review-on','approved-on','ready-on','final','phase-resolve');
  };
  const runDesktop = mode => {
    const root=stateRoot(mode), q=s=>one(mode,s), qa=s=>all(mode,s);
    const capture=block(mode,'capture'), enrich=block(mode,'enrich'), assist=block(mode,'assist'), review=block(mode,'review'), resolve=block(mode,'resolve');
    const captureCommit=reveal(root,capture[0],500,280); at(root,captureCommit+140,()=>{root.classList.add('request-on');setPhase(root,'capture')});
    const enrichOpen=reveal(root,enrich[0],1050,230); at(root,enrichOpen+140,()=>{root.classList.add('context-on');setPhase(root,'enrich')});
    const sourceCommit=reveal(root,enrich[1],1330,210); at(root,sourceCommit+140,()=>q('.field[data-field="source"]')?.classList.add('on'));
    const intentCommit=reveal(root,enrich[2],1590,210); at(root,intentCommit+140,()=>q('.field[data-field="intent"]')?.classList.add('on'));
    const enrichCommit=reveal(root,enrich[3],1850,170); at(root,enrichCommit+140,()=>q('.field[data-field="automation"]')?.classList.add('on')); at(root,enrichCommit+250,()=>q('.field[data-field="priority"]')?.classList.add('on'));
    reveal(root,assist[0],2380,220); reveal(root,assist[1],2640,180); reveal(root,assist[2],2860,180); const assistCommit=reveal(root,assist[3],3080,160); at(root,assistCommit+140,()=>{root.classList.add('ai-on');setPhase(root,'assist')}); qa('.ai-items span').forEach((el,i)=>at(root,3500+i*150,()=>el.classList.add('on')));
    reveal(root,review[0],3920,220); reveal(root,review[1],4180,270); const reviewCommit=reveal(root,review[2],4490,160); at(root,reviewCommit+140,()=>{root.classList.add('review-on');setPhase(root,'review')});
    at(root,5960,()=>root.classList.add('approved-on'));
    const resolveCommit=reveal(root,resolve[0],6440,280); at(root,resolveCommit+140,()=>{root.classList.add('ready-on');setPhase(root,'resolve')});
    at(root,7580,()=>{qa('.line.live').forEach(l=>l.classList.remove('live'));root.classList.add('final')});
    section.dataset.motionDuration='7580';
  };
  const runCompact = (mode, landscape=false) => {
    const root=stateRoot(mode), q=s=>one(mode,s), qa=s=>all(mode,s), b=n=>block(mode,n);
    const T = landscape ? {cap:[360,280,130], enr:[1020,260,130], source:[1390,220,125], intent:[1740,220,125], close:[2010,150], assist:[2380,280,140,3060,120], rev1:[3680,210], rev2:[3950,260,140], approved:5260, resolve:[5620,280,140], dur:6800} : {cap:[450,300,140], enr:[1160,290,140], source:[1600,250,130], intent:[1990,250,130], close:[2290,170], assist:[2740,310,150,3500,145], rev1:[4160,250], rev2:[4490,290,150], approved:5750, resolve:[6150,300,140], dur:7100};
    let c=reveal(root,b('capture')[0],T.cap[0],T.cap[1]); at(root,c+T.cap[2],()=>{root.classList.add('request-on');setPhase(root,'capture')});
    let e=reveal(root,b('enrich')[0],T.enr[0],T.enr[1]); at(root,e+T.enr[2],()=>{root.classList.add('context-on');setPhase(root,'enrich')});
    let s=reveal(root,b('source')[0],T.source[0],T.source[1]); at(root,s+T.source[2],()=>{q('.field[data-field="source"]')?.classList.add('on');q('.field[data-field="business"]')?.classList.add('on')});
    let i=reveal(root,b('intent')[0],T.intent[0],T.intent[1]); at(root,i+T.intent[2],()=>{q('.field[data-field="intent"]')?.classList.add('on');q('.field[data-field="priority"]')?.classList.add('on')});
    reveal(root,b('enrich-close')[0],T.close[0],T.close[1]);
    let a=reveal(root,b('assist')[0],T.assist[0],T.assist[1]); at(root,a+T.assist[2],()=>{root.classList.add('ai-on');setPhase(root,'assist')}); qa('.ai-items span').forEach((x,idx)=>at(root,T.assist[3]+idx*T.assist[4],()=>x.classList.add('on')));
    const rv=b('review'); reveal(root,rv[0],T.rev1[0],T.rev1[1]); let rc=reveal(root,rv[1],T.rev2[0],T.rev2[1]); at(root,rc+T.rev2[2],()=>{root.classList.add('review-on');setPhase(root,'review')});
    at(root,T.approved,()=>root.classList.add('approved-on'));
    let r=reveal(root,b('resolve')[0],T.resolve[0],T.resolve[1]); at(root,r+T.resolve[2],()=>{root.classList.add('ready-on');setPhase(root,'resolve')});
    at(root,T.dur,()=>root.classList.add('final')); section.dataset.motionDuration=String(T.dur);
  };
  const start = () => {
    if (started) return;
    if (document.hidden) { pendingVisible=true; return; }
    started=true; pendingVisible=false;
    const mode=activeMode();
    startedMode=mode;
    if (reduce.matches) { finalState(mode); section.dataset.motionDuration='0'; return; }
    const kind=mode.dataset.hseMode;
    if (kind==='desktop') runDesktop(mode); else runCompact(mode, kind==='landscape');
  };
  const revealReducedOnChange = () => { if (reduce.matches && started) finalState(activeMode()); };
  reduce.addEventListener?.('change', revealReducedOnChange);
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.target===section && entry.isIntersecting && entry.intersectionRatio>=0.48) { start(); observer.disconnect(); break; }
    }
  }, {threshold:[0,.25,.48,.6], rootMargin:'0px 0px -4% 0px'});
  observer.observe(section);
  document.addEventListener('visibilitychange',()=>{ if (!document.hidden && pendingVisible) start(); },{passive:true});
  let resizeTimer=0;
  window.addEventListener('resize',()=>{
    if (!started) return;
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{
      const next=activeMode();
      if (next && next!==startedMode) { startedMode=next; finalState(next); }
    },160);
  },{passive:true});
})();
