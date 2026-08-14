(() => {
  'use strict';
  const section=document.querySelector('[data-connected-system]');
  if(!section)return;

  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const compactLayout=window.matchMedia('(max-width: 760px), (max-height: 520px) and (max-width: 1000px)');
  const stages=[...section.querySelectorAll('[data-system-stage]')];
  const rail=section.querySelector('.cs-spine');
  const ambientCatch=section.querySelector('.cs-ambient-catch');
  const replay=document.querySelector('[data-replay-system]');
  const stagePlayed=new WeakSet();
  const timers=new Set();
  let established=false;
  let sectionVisible=false;
  let ambientTimer=0;
  let sequenceToken=0;

  const later=(fn,ms)=>{const id=window.setTimeout(()=>{timers.delete(id);fn();},ms);timers.add(id);return id;};
  const cancelTimers=()=>{timers.forEach(id=>window.clearTimeout(id));timers.clear();if(ambientTimer){window.clearTimeout(ambientTimer);ambientTimer=0;}};
  const clearTransient=()=>{section.classList.remove('is-sequence-running');ambientCatch?.classList.remove('is-running');stages.forEach(s=>s.classList.remove('is-transfer-active','is-ambient-active','is-inspected','is-handoff-neighbor','is-local-active'));};

  const railTravel=()=>Math.max(600,rail?.getBoundingClientRect().width||1264);
  const scheduleAmbient=()=>{
    if(reduceMotion.matches||!sectionVisible)return;
    if(ambientTimer)window.clearTimeout(ambientTimer);
    const mobile=compactLayout.matches;
    const delay=mobile?(12000+Math.random()*6000):(8500+Math.random()*5000);
    ambientTimer=window.setTimeout(()=>{ambientTimer=0;runAmbientEvent();scheduleAmbient();},delay);
  };

  const runAmbientEvent=()=>{
    if(reduceMotion.matches||!sectionVisible||section.classList.contains('is-sequence-running'))return;
    const mobile=compactLayout.matches;
    const candidates=mobile?stages.filter(s=>stagePlayed.has(s)):stages;
    const stage=candidates[Math.floor(Math.random()*Math.max(1,candidates.length))];
    if(!stage)return;
    stage.classList.add('is-ambient-active');
    const jointDuration=Math.round(1200+Math.random()*650);
    stage.style.setProperty('--ambient-joint-duration',`${jointDuration}ms`);
    later(()=>stage.classList.remove('is-ambient-active'),jointDuration+80);
    if(!mobile&&ambientCatch){
      const index=Math.max(0,stages.indexOf(stage));
      const direction=Math.random()<.18?-1:1;
      const left=Math.min(78,Math.max(4,index*25+(direction<0?10:0)+Math.random()*7));
      const width=Math.round(108+Math.random()*56);
      const distance=Math.round((52+Math.random()*54)*direction);
      const duration=Math.round(1250+Math.random()*850);
      const opacity=(.18+Math.random()*.12).toFixed(2);
      ambientCatch.style.setProperty('--ambient-left',`${left}%`);
      ambientCatch.style.setProperty('--ambient-width',`${width}px`);
      ambientCatch.style.setProperty('--ambient-distance',`${distance}px`);
      ambientCatch.style.setProperty('--ambient-duration',`${duration}ms`);
      ambientCatch.style.setProperty('--ambient-opacity',opacity);
      ambientCatch.classList.remove('is-running');void ambientCatch.offsetWidth;ambientCatch.classList.add('is-running');
      later(()=>ambientCatch.classList.remove('is-running'),duration+80);
    }
  };

  const playEntry=(force=false)=>{
    if(reduceMotion.matches){section.classList.add('is-established');return;}
    if(established&&!force)return;
    sequenceToken+=1;const token=sequenceToken;
    cancelTimers();clearTransient();
    rail?.style.setProperty('--cs-rail-travel',`${railTravel()}px`);
    section.classList.add('cs-motion-ready');
    later(()=>{if(token!==sequenceToken)return;section.classList.add('is-established','is-sequence-running');},20);
    stages.forEach((stage,index)=>{
      const on=390+index*315;
      later(()=>{if(token!==sequenceToken)return;stage.classList.add('is-transfer-active');},on);
      later(()=>{if(token!==sequenceToken)return;stage.classList.remove('is-transfer-active');},on+430);
    });
    later(()=>{if(token!==sequenceToken)return;section.classList.remove('is-sequence-running');established=true;scheduleAmbient();},2440);
  };

  const replaySequence=()=>{
    if(reduceMotion.matches)return;
    sequenceToken+=1;cancelTimers();clearTransient();
    section.classList.remove('is-established');
    later(()=>playEntry(true),320);
  };

  const setupVisibility=()=>{
    const observer=new IntersectionObserver(entries=>{
      const e=entries[0];sectionVisible=!!(e&&e.isIntersecting);
      if(!sectionVisible&&ambientTimer){window.clearTimeout(ambientTimer);ambientTimer=0;}
      if(sectionVisible&&established&&!ambientTimer)scheduleAmbient();
    },{threshold:.05});observer.observe(section);
  };

  const setupDesktop=()=>{
    section.classList.add('cs-motion-ready');
    if(reduceMotion.matches){section.classList.add('is-established');return;}
    const observer=new IntersectionObserver(entries=>{const e=entries[0];if(!e||!e.isIntersecting)return;playEntry();observer.disconnect();},{threshold:.24,rootMargin:'0px 0px -6% 0px'});observer.observe(section);
    stages.forEach((stage,index)=>{
      const enter=()=>{if(section.classList.contains('is-sequence-running'))return;stage.classList.add('is-inspected');stages[index+1]?.classList.add('is-handoff-neighbor');};
      const leave=()=>{stage.classList.remove('is-inspected');stages[index+1]?.classList.remove('is-handoff-neighbor');};
      stage.addEventListener('pointerenter',enter);stage.addEventListener('pointerleave',leave);stage.addEventListener('focus',enter);stage.addEventListener('blur',leave);
    });
  };

  const setupMobile=()=>{
    section.classList.add('is-established');established=true;
    if(reduceMotion.matches)return;
    stages.forEach(stage=>{
      const observer=new IntersectionObserver(entries=>{const e=entries[0];if(!e||!e.isIntersecting||stagePlayed.has(stage))return;const r=e.boundingClientRect,vh=innerHeight||document.documentElement.clientHeight;if(r.top>vh*.68||r.bottom<vh*.42)return;stagePlayed.add(stage);stage.classList.add('is-local-active');later(()=>stage.classList.remove('is-local-active'),820);observer.disconnect();},{threshold:.22,rootMargin:'-20% 0px -24% 0px'});observer.observe(stage);
    });
    scheduleAmbient();
  };

  setupVisibility();
  compactLayout.matches?setupMobile():setupDesktop();
  replay?.addEventListener('click',replaySequence);
  reduceMotion.addEventListener?.('change',()=>location.reload());
})();
