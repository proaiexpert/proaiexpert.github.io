(() => {
  'use strict';

  const section=document.querySelector('[data-connected-system]');
  if(!section)return;

  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const compactLayout=window.matchMedia('(max-width: 760px), (max-height: 520px) and (max-width: 1000px)');
  const stages=[...section.querySelectorAll('[data-system-stage]')];
  const rail=section.querySelector('.cs-spine');
  const focusWindow=section.querySelector('.cs-spine-catch');
  const ambientCatch=section.querySelector('.cs-ambient-catch');
  const replay=document.querySelector('[data-replay-system]');

  const timers=new Set();
  let ambientTimer=0;
  let visibilityObserver=null;
  let entryObserver=null;
  let mode=null;
  let sequenceToken=0;
  let sequenceRunning=false;
  let sequencePlayed=false;
  let sectionVisible=false;
  let activeMobileIndex=-1;
  let lastFocusIndex=0;
  let scrollTick=false;
  let focusAnimation=null;
  let ambientAnimation=null;
  let pointerLeaveTimer=0;

  const later=(fn,ms)=>{
    const id=window.setTimeout(()=>{timers.delete(id);fn();},ms);
    timers.add(id);
    return id;
  };

  const clearTimers=()=>{
    timers.forEach(id=>window.clearTimeout(id));
    timers.clear();
    if(ambientTimer){window.clearTimeout(ambientTimer);ambientTimer=0;}
    if(pointerLeaveTimer){window.clearTimeout(pointerLeaveTimer);pointerLeaveTimer=0;}
  };

  const cancelAnimations=()=>{
    focusAnimation?.cancel();focusAnimation=null;
    ambientAnimation?.cancel();ambientAnimation=null;
    focusWindow?.getAnimations().forEach(a=>a.cancel());
    ambientCatch?.getAnimations().forEach(a=>a.cancel());
  };

  const cleanStageClasses=(stage)=>{
    stage.classList.remove('is-future','is-active','is-settled','is-balanced','is-arriving','is-ambient-active');
  };

  const setState=(index,state)=>{
    const stage=stages[index];
    if(!stage)return;
    cleanStageClasses(stage);
    stage.classList.add(`is-${state}`);
  };

  const setAll=(state)=>stages.forEach((_,i)=>setState(i,state));

  const clearTransient=()=>{
    stages.forEach(s=>s.classList.remove('is-arriving','is-ambient-active'));
    if(focusWindow)focusWindow.style.opacity='0';
    if(ambientCatch)ambientCatch.style.opacity='0';
  };

  const railPosition=(index)=>{
    const stage=stages[index];
    if(!stage||!rail)return 0;
    if(mode==='mobile'){
      const stageRect=stage.getBoundingClientRect();
      const railRect=rail.getBoundingClientRect();
      const jointY=stageRect.top-railRect.top+8;
      return Math.max(-8,jointY-66);
    }
    const field=rail.parentElement;
    const stageRect=stage.getBoundingClientRect();
    const fieldRect=field.getBoundingClientRect();
    const windowWidth=focusWindow?.getBoundingClientRect().width||250;
    const jointX=stageRect.left-fieldRect.left+9;
    return jointX-windowWidth*.45;
  };

  const placeFocus=(index,opacity=.44)=>{
    if(!focusWindow||index<0)return;
    const axis=railPosition(index);
    focusWindow.style.transform=mode==='mobile'
      ?`translate3d(0,${axis}px,0)`
      :`translate3d(${axis}px,0,0)`;
    focusWindow.style.opacity=String(opacity);
    lastFocusIndex=index;
  };

  const animateFocus=(fromIndex,toIndex,duration=540,hold=.5)=>{
    if(!focusWindow||reduceMotion.matches)return;
    focusAnimation?.cancel();
    const from=railPosition(Math.max(0,fromIndex));
    const to=railPosition(Math.max(0,toIndex));
    const fromTransform=mode==='mobile'?`translate3d(0,${from}px,0)`:`translate3d(${from}px,0,0)`;
    const toTransform=mode==='mobile'?`translate3d(0,${to}px,0)`:`translate3d(${to}px,0,0)`;
    focusAnimation=focusWindow.animate([
      {transform:fromTransform,opacity:.18,offset:0},
      {transform:mode==='mobile'
        ?`translate3d(0,${from+(to-from)*.72}px,0)`
        :`translate3d(${from+(to-from)*.72}px,0,0)`,opacity:.9,offset:.68},
      {transform:toTransform,opacity:hold,offset:1}
    ],{duration,easing:'cubic-bezier(.2,.72,.18,1)',fill:'forwards'});
    focusAnimation.onfinish=()=>{
      focusWindow.style.transform=toTransform;
      focusWindow.style.opacity=String(hold);
      focusAnimation=null;
    };
    lastFocusIndex=toIndex;
  };

  const animateAmbientRail=(index)=>{
    if(!ambientCatch||mode==='mobile'||reduceMotion.matches)return;
    ambientAnimation?.cancel();
    const stage=stages[index];
    const field=rail.parentElement;
    const s=stage.getBoundingClientRect(),f=field.getBoundingClientRect();
    const x=Math.max(0,s.left-f.left-18);
    const direction=Math.random()<.16?-1:1;
    const distance=(70+Math.random()*55)*direction;
    const duration=1300+Math.random()*650;
    ambientAnimation=ambientCatch.animate([
      {transform:`translate3d(${x}px,0,0)`,opacity:0},
      {transform:`translate3d(${x+distance*.28}px,0,0)`,opacity:.34,offset:.34},
      {transform:`translate3d(${x+distance}px,0,0)`,opacity:0}
    ],{duration,easing:'cubic-bezier(.2,.72,.18,1)'});
    ambientAnimation.onfinish=()=>{ambientAnimation=null;};
  };

  const applyBalanced=()=>{
    setAll('balanced');
    stages.forEach(s=>s.classList.remove('is-arriving'));
  };

  const scheduleAmbient=()=>{
    if(mode!=='desktop'||reduceMotion.matches||!sectionVisible||sequenceRunning)return;
    if(ambientTimer)window.clearTimeout(ambientTimer);
    const delay=7000+Math.random()*5000;
    ambientTimer=window.setTimeout(()=>{
      ambientTimer=0;
      if(!sequenceRunning&&sectionVisible){
        const index=Math.floor(Math.random()*stages.length);
        const stage=stages[index];
        stage.classList.add('is-ambient-active');
        stage.style.setProperty('--ambient-joint-duration',`${Math.round(1050+Math.random()*550)}ms`);
        animateAmbientRail(index);
        later(()=>stage.classList.remove('is-ambient-active'),1650);
      }
      scheduleAmbient();
    },delay);
  };

  const runDesktopSequence=(force=false)=>{
    if(reduceMotion.matches||mode!=='desktop'){applyBalanced();return;}
    if(sequencePlayed&&!force)return;

    sequenceToken+=1;
    const token=sequenceToken;
    clearTimers();cancelAnimations();clearTransient();
    sequenceRunning=true;
    sequencePlayed=true;
    section.classList.add('cs-motion-ready');
    section.classList.remove('is-established');
    setAll('future');
    if(focusWindow)focusWindow.style.opacity='0';

    later(()=>{if(token!==sequenceToken)return;section.classList.add('is-established');},30);

    const firstActive=650;
    const stageOffset=520;
    const transferLead=250;
    const settleLead=115;
    const arrivalLead=90;

    stages.forEach((stage,index)=>{
      const activeAt=firstActive+index*stageOffset;

      if(index===0){
        later(()=>{
          if(token!==sequenceToken)return;
          stage.classList.add('is-arriving');
          placeFocus(0,.36);
        },activeAt-arrivalLead);
      }else{
        later(()=>{
          if(token!==sequenceToken)return;
          animateFocus(index-1,index,520,.5);
        },activeAt-transferLead);
        later(()=>{
          if(token!==sequenceToken)return;
          setState(index-1,'settled');
        },activeAt-settleLead);
        later(()=>{
          if(token!==sequenceToken)return;
          stage.classList.add('is-arriving');
        },activeAt-arrivalLead);
      }

      later(()=>{
        if(token!==sequenceToken)return;
        stage.classList.remove('is-arriving');
        setState(index,'active');
        if(index===0)placeFocus(0,.5);
      },activeAt);
    });

    const finalSettle=firstActive+(stages.length-1)*stageOffset+540;
    later(()=>{
      if(token!==sequenceToken)return;
      setState(stages.length-1,'settled');
    },finalSettle);

    later(()=>{
      if(token!==sequenceToken)return;
      applyBalanced();
      if(focusWindow)focusWindow.style.opacity='.16';
      sequenceRunning=false;
      scheduleAmbient();
    },finalSettle+330);
  };

  const inspectStage=(index)=>{
    if(mode!=='desktop'||reduceMotion.matches||sequenceRunning)return;
    clearTimers();
    if(ambientTimer){window.clearTimeout(ambientTimer);ambientTimer=0;}
    stages.forEach((_,i)=>setState(i,i===index?'active':'settled'));
    animateFocus(lastFocusIndex,index,360,.48);
  };

  const restoreAfterInspect=()=>{
    if(mode!=='desktop'||reduceMotion.matches||sequenceRunning)return;
    applyBalanced();
    if(focusWindow)focusWindow.style.opacity='.16';
    scheduleAmbient();
  };

  const mobileStateFor=(index,activeIndex)=>{
    if(index<activeIndex)return 'settled';
    if(index===activeIndex)return 'active';
    return 'future';
  };

  const applyMobileStates=(activeIndex,animate=true)=>{
    if(activeIndex<0||activeIndex>=stages.length)return;
    const previous=activeMobileIndex;
    if(previous===activeIndex&&animate)return;

    if(previous>=0&&previous!==activeIndex){
      setState(previous,previous<activeIndex?'settled':'future');
    }
    stages.forEach((_,i)=>{
      if(i!==activeIndex&&i!==previous)setState(i,mobileStateFor(i,activeIndex));
    });

    const stage=stages[activeIndex];
    stage.classList.add('is-arriving');

    if(animate&&previous>=0&&previous!==activeIndex){
      animateFocus(previous,activeIndex,580,.58);
    }else{
      placeFocus(activeIndex,.58);
    }

    later(()=>{
      if(mode!=='mobile'||reduceMotion.matches)return;
      stage.classList.remove('is-arriving');
      setState(activeIndex,'active');
    },animate?105:0);

    activeMobileIndex=activeIndex;
  };

  const chooseMobileStage=()=>{
    if(mode!=='mobile'||reduceMotion.matches)return -1;
    const vh=window.innerHeight||document.documentElement.clientHeight;
    const bandTop=vh*.45,bandBottom=vh*.68,target=vh*.565;
    let best=-1,bestDistance=Infinity;
    stages.forEach((stage,index)=>{
      const r=stage.getBoundingClientRect();
      if(r.bottom<bandTop||r.top>bandBottom)return;
      const center=(r.top+r.bottom)/2;
      const distance=Math.abs(center-target);
      if(distance<bestDistance){bestDistance=distance;best=index;}
    });
    return best;
  };

  const updateMobileFocus=()=>{
    scrollTick=false;
    if(mode!=='mobile'||reduceMotion.matches)return;
    const next=chooseMobileStage();
    if(next>=0&&next!==activeMobileIndex)applyMobileStates(next,true);
  };

  const scheduleMobileFocus=()=>{
    if(scrollTick)return;
    scrollTick=true;
    window.requestAnimationFrame(updateMobileFocus);
  };

  const replayMobile=()=>{
    if(reduceMotion.matches||mode!=='mobile')return;
    clearTimers();cancelAnimations();
    let index=activeMobileIndex;
    if(index<0)index=chooseMobileStage();
    if(index<0)index=0;
    const stage=stages[index];
    stages.forEach((_,i)=>setState(i,mobileStateFor(i,index)));
    setState(index,'future');
    const target=railPosition(index);
    const start=target-34;
    if(focusWindow){
      focusAnimation=focusWindow.animate([
        {transform:`translate3d(0,${start}px,0)`,opacity:.12},
        {transform:`translate3d(0,${target}px,0)`,opacity:.7}
      ],{duration:560,easing:'cubic-bezier(.2,.72,.18,1)',fill:'forwards'});
    }
    later(()=>stage.classList.add('is-arriving'),180);
    later(()=>{
      stage.classList.remove('is-arriving');
      setState(index,'active');
      placeFocus(index,.58);
      activeMobileIndex=index;
    },300);
  };

  const setupEntryObserver=()=>{
    entryObserver?.disconnect();
    if(mode!=='desktop'||reduceMotion.matches)return;
    entryObserver=new IntersectionObserver(entries=>{
      const entry=entries[0];
      if(!entry?.isIntersecting)return;
      runDesktopSequence(false);
      entryObserver.disconnect();
    },{threshold:.18,rootMargin:'0px 0px -4% 0px'});
    entryObserver.observe(section);
  };

  const setMode=(nextMode)=>{
    if(mode===nextMode)return;
    mode=nextMode;
    sequenceToken+=1;
    clearTimers();cancelAnimations();clearTransient();
    entryObserver?.disconnect();
    sequenceRunning=false;
    section.classList.remove('is-established');
    activeMobileIndex=-1;

    if(reduceMotion.matches){
      section.classList.remove('cs-motion-ready');
      applyBalanced();
      if(focusWindow)focusWindow.style.opacity='0';
      return;
    }

    section.classList.add('cs-motion-ready','is-established');

    if(mode==='mobile'){
      setAll('future');
      if(focusWindow)focusWindow.style.opacity='0';
      later(scheduleMobileFocus,80);
    }else{
      setAll(sequencePlayed?'balanced':'future');
      if(sequencePlayed){
        if(focusWindow)focusWindow.style.opacity='.16';
        scheduleAmbient();
      }else{
        section.classList.remove('is-established');
        setupEntryObserver();
      }
    }
  };

  const initVisibility=()=>{
    visibilityObserver?.disconnect();
    visibilityObserver=new IntersectionObserver(entries=>{
      sectionVisible=!!entries[0]?.isIntersecting;
      if(!sectionVisible&&ambientTimer){window.clearTimeout(ambientTimer);ambientTimer=0;}
      if(sectionVisible&&mode==='desktop'&&sequencePlayed&&!sequenceRunning)scheduleAmbient();
    },{threshold:.04});
    visibilityObserver.observe(section);
  };

  stages.forEach((stage,index)=>{
    stage.addEventListener('pointerenter',()=>{
      if(pointerLeaveTimer){window.clearTimeout(pointerLeaveTimer);pointerLeaveTimer=0;}
      inspectStage(index);
    });
    stage.addEventListener('pointerleave',()=>{
      if(mode!=='desktop'||sequenceRunning)return;
      pointerLeaveTimer=window.setTimeout(()=>{pointerLeaveTimer=0;restoreAfterInspect();},90);
    });
    stage.addEventListener('focus',()=>inspectStage(index));
    stage.addEventListener('blur',()=>restoreAfterInspect());
  });

  replay?.addEventListener('click',()=>{
    if(reduceMotion.matches)return;
    if(mode==='mobile')replayMobile();
    else runDesktopSequence(true);
  });

  window.addEventListener('scroll',scheduleMobileFocus,{passive:true});
  window.addEventListener('resize',()=>{
    const next=compactLayout.matches?'mobile':'desktop';
    if(next!==mode)setMode(next);
    else if(mode==='mobile')scheduleMobileFocus();
    else if(focusWindow&&sequencePlayed)focusWindow.style.opacity='.16';
  },{passive:true});

  compactLayout.addEventListener?.('change',()=>setMode(compactLayout.matches?'mobile':'desktop'));
  reduceMotion.addEventListener?.('change',()=>{
    sequenceToken+=1;
    clearTimers();cancelAnimations();
    setMode(compactLayout.matches?'mobile':'desktop');
  });

  initVisibility();
  setMode(compactLayout.matches?'mobile':'desktop');
})();
