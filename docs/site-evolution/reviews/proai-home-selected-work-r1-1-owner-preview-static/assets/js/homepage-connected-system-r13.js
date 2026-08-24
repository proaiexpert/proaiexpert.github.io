(() => {
  'use strict';

  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const section=document.querySelector('[data-connected-system]');
  if(!section)return;

  const compactLayout=window.matchMedia('(max-width: 760px), (max-height: 520px) and (max-width: 1000px)');
  const stages=[...section.querySelectorAll('[data-system-stage]')];
  const rail=section.querySelector('.cs-spine');
  const focusWindow=section.querySelector('.cs-spine-catch');
  const lightCarriage=section.querySelector('.cs-light-carriage');
  const ambientCatch=section.querySelector('.cs-ambient-catch');

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
  let carriageAnimation=null;
  let ambientAnimation=null;
  let pointerLeaveTimer=0;
  let mobileTransitionUntil=0;
  let pendingMobileIndex=-1;
  let pendingMobileTimer=0;

  const later=(fn,ms)=>{
    const id=window.setTimeout(()=>{
      timers.delete(id);
      fn();
    },ms);
    timers.add(id);
    return id;
  };

  const clearTimers=()=>{
    timers.forEach(id=>window.clearTimeout(id));
    timers.clear();
    if(ambientTimer){window.clearTimeout(ambientTimer);ambientTimer=0;}
    if(pointerLeaveTimer){window.clearTimeout(pointerLeaveTimer);pointerLeaveTimer=0;}
    if(pendingMobileTimer){window.clearTimeout(pendingMobileTimer);pendingMobileTimer=0;}
    pendingMobileIndex=-1;
  };

  const cancelAnimations=()=>{
    focusAnimation?.cancel();focusAnimation=null;
    carriageAnimation?.cancel();carriageAnimation=null;
    ambientAnimation?.cancel();ambientAnimation=null;
    focusWindow?.getAnimations().forEach(a=>a.cancel());
    lightCarriage?.getAnimations().forEach(a=>a.cancel());
    ambientCatch?.getAnimations().forEach(a=>a.cancel());
  };

  const removeStateClasses=(stage)=>{
    stage.classList.remove('is-future','is-active','is-settled','is-balanced');
  };

  const clearTransientClasses=(stage)=>{
    stage.classList.remove('is-arriving','is-departing','is-ambient-active','is-specular');
  };

  const setState=(index,state)=>{
    const stage=stages[index];
    if(!stage)return;
    removeStateClasses(stage);
    stage.classList.add(`is-${state}`);
  };

  const setAll=(state)=>stages.forEach((_,i)=>setState(i,state));

  const clearTransient=()=>{
    stages.forEach(clearTransientClasses);
    if(focusWindow)focusWindow.style.opacity='0';
    if(lightCarriage)lightCarriage.style.opacity='0';
    if(ambientCatch)ambientCatch.style.opacity='0';
  };

  const railPosition=(index)=>{
    const stage=stages[index];
    if(!stage||!rail)return 0;

    if(mode==='mobile'){
      const stageRect=stage.getBoundingClientRect();
      const railRect=rail.getBoundingClientRect();
      const jointY=stageRect.top-railRect.top+8;
      const windowHeight=focusWindow?.getBoundingClientRect().height||132;
      return Math.max(-8,jointY-windowHeight*.50);
    }

    const field=rail.parentElement;
    const stageRect=stage.getBoundingClientRect();
    const fieldRect=field.getBoundingClientRect();
    const windowWidth=focusWindow?.getBoundingClientRect().width||250;
    const jointX=stageRect.left-fieldRect.left+9;
    return jointX-windowWidth*.45;
  };

  const carriagePosition=(index)=>{
    const stage=stages[index];
    const field=section.querySelector('.cs-system-field');
    if(!stage||!field||!lightCarriage)return{x:0,y:0};

    const stageRect=stage.getBoundingClientRect();
    const fieldRect=field.getBoundingClientRect();
    const carriageRect=lightCarriage.getBoundingClientRect();

    if(mode==='mobile'){
      return{
        x:0,
        y:stageRect.top-fieldRect.top-carriageRect.height*.34
      };
    }

    return{
      x:stageRect.left-fieldRect.left-carriageRect.width*.28,
      y:-carriageRect.height*.13
    };
  };

  const focusTransform=(axis)=>mode==='mobile'
    ?`translate3d(0,${axis}px,0)`
    :`translate3d(${axis}px,0,0)`;

  const carriageTransform=(pos)=>`translate3d(${pos.x}px,${pos.y}px,0)`;

  const placeOptical=(index,focusOpacity=.50,carriageOpacity=.68)=>{
    if(index<0)return;

    if(focusWindow){
      focusWindow.style.transform=focusTransform(railPosition(index));
      focusWindow.style.opacity=String(focusOpacity);
    }

    if(lightCarriage){
      lightCarriage.style.transform=carriageTransform(carriagePosition(index));
      lightCarriage.style.opacity=String(carriageOpacity);
    }

    lastFocusIndex=index;
  };

  const animateOpticalTransfer=(fromIndex,toIndex,duration=560,focusHold=.54,carriageHold=.68)=>{
    if(reduceMotion.matches)return;

    const from=Math.max(0,fromIndex);
    const to=Math.max(0,toIndex);
    focusAnimation?.cancel();
    carriageAnimation?.cancel();

    if(focusWindow){
      const fromAxis=railPosition(from);
      const toAxis=railPosition(to);
      const midAxis=fromAxis+(toAxis-fromAxis)*.72;
      focusAnimation=focusWindow.animate([
        {transform:focusTransform(fromAxis),opacity:.22,offset:0},
        {transform:focusTransform(midAxis),opacity:.92,offset:.68},
        {transform:focusTransform(toAxis),opacity:focusHold,offset:1}
      ],{duration,easing:'cubic-bezier(.2,.72,.18,1)',fill:'forwards'});
      focusAnimation.onfinish=()=>{
        focusWindow.style.transform=focusTransform(toAxis);
        focusWindow.style.opacity=String(focusHold);
        focusAnimation=null;
      };
    }

    if(lightCarriage){
      const fromPos=carriagePosition(from);
      const toPos=carriagePosition(to);
      const midPos={
        x:fromPos.x+(toPos.x-fromPos.x)*.69,
        y:fromPos.y+(toPos.y-fromPos.y)*.69
      };
      carriageAnimation=lightCarriage.animate([
        {transform:carriageTransform(fromPos),opacity:.36,offset:0},
        {transform:carriageTransform(midPos),opacity:.82,offset:.64},
        {transform:carriageTransform(toPos),opacity:carriageHold,offset:1}
      ],{duration,easing:'cubic-bezier(.2,.72,.18,1)',fill:'forwards'});
      carriageAnimation.onfinish=()=>{
        lightCarriage.style.transform=carriageTransform(toPos);
        lightCarriage.style.opacity=String(carriageHold);
        carriageAnimation=null;
      };
    }

    lastFocusIndex=toIndex;
  };

  const triggerSpecular=(index,delay=0)=>{
    if(reduceMotion.matches)return;
    later(()=>{
      const stage=stages[index];
      if(!stage)return;
      stage.classList.remove('is-specular');
      void stage.offsetWidth;
      stage.classList.add('is-specular');
      later(()=>stage.classList.remove('is-specular'),430);
    },delay);
  };

  const beginDeparture=(index,targetState='settled',hold=360)=>{
    const stage=stages[index];
    if(!stage)return;
    stage.classList.remove('is-arriving','is-specular');
    setState(index,targetState);
    stage.classList.add('is-departing');
    later(()=>stage.classList.remove('is-departing'),hold);
  };

  const activateStage=(index)=>{
    const stage=stages[index];
    if(!stage)return;
    stage.classList.remove('is-arriving','is-departing');
    setState(index,'active');
    triggerSpecular(index,22);
  };

  const animateAmbientRail=(index)=>{
    if(!ambientCatch||mode==='mobile'||reduceMotion.matches)return;
    ambientAnimation?.cancel();

    const stage=stages[index];
    const field=rail.parentElement;
    const s=stage.getBoundingClientRect();
    const f=field.getBoundingClientRect();
    const x=Math.max(0,s.left-f.left-18);
    const direction=Math.random()<.16?-1:1;
    const distance=(62+Math.random()*46)*direction;
    const duration=1250+Math.random()*600;

    ambientAnimation=ambientCatch.animate([
      {transform:`translate3d(${x}px,0,0)`,opacity:0},
      {transform:`translate3d(${x+distance*.28}px,0,0)`,opacity:.22,offset:.34},
      {transform:`translate3d(${x+distance}px,0,0)`,opacity:0}
    ],{duration,easing:'cubic-bezier(.2,.72,.18,1)'});
    ambientAnimation.onfinish=()=>{ambientAnimation=null;};
  };

  const applyBalanced=()=>{
    setAll('balanced');
    stages.forEach(stage=>stage.classList.remove('is-arriving','is-departing'));
  };

  const scheduleAmbient=()=>{
    if(mode!=='desktop'||reduceMotion.matches||!sectionVisible||sequenceRunning)return;
    if(ambientTimer)window.clearTimeout(ambientTimer);

    const delay=10000+Math.random()*5000;
    ambientTimer=window.setTimeout(()=>{
      ambientTimer=0;
      if(!sequenceRunning&&sectionVisible){
        const index=Math.floor(Math.random()*stages.length);
        const stage=stages[index];
        stage.classList.add('is-ambient-active');
        stage.style.setProperty('--ambient-joint-duration',`${Math.round(1050+Math.random()*450)}ms`);
        animateAmbientRail(index);
        later(()=>stage.classList.remove('is-ambient-active'),1500);
      }
      scheduleAmbient();
    },delay);
  };

  const consumeDesktopIntro=(balance=false)=>{
    if(mode!=='desktop'||(!sequenceRunning&&sequencePlayed))return false;

    sequenceToken+=1;
    clearTimers();
    cancelAnimations();
    clearTransient();
    entryObserver?.disconnect();
    sequenceRunning=false;
    sequencePlayed=true;
    section.classList.add('cs-motion-ready','is-established');

    if(balance){
      applyBalanced();
      if(focusWindow)focusWindow.style.opacity='.14';
      if(lightCarriage)lightCarriage.style.opacity='.12';
      if(sectionVisible)scheduleAmbient();
    }

    return true;
  };

  const runDesktopSequence=(force=false)=>{
    if(reduceMotion.matches||mode!=='desktop'){
      applyBalanced();
      return;
    }
    if(sequencePlayed&&!force)return;

    sequenceToken+=1;
    const token=sequenceToken;
    clearTimers();
    cancelAnimations();
    clearTransient();

    sequenceRunning=true;
    sequencePlayed=true;
    section.classList.add('cs-motion-ready');
    section.classList.remove('is-established');
    setAll('future');

    later(()=>{
      if(token!==sequenceToken)return;
      section.classList.add('is-established');
    },30);

    const firstActive=760;
    const stageOffset=1900;
    const transferDuration=620;
    const transferLead=610;
    const departureLead=260;
    const arrivalLead=190;

    stages.forEach((stage,index)=>{
      const activeAt=firstActive+index*stageOffset;

      if(index===0){
        later(()=>{
          if(token!==sequenceToken)return;
          stage.classList.add('is-arriving');
          placeOptical(0,.34,.52);
        },activeAt-arrivalLead);
      }else{
        later(()=>{
          if(token!==sequenceToken)return;
          animateOpticalTransfer(index-1,index,transferDuration,.56,.70);
        },activeAt-transferLead);

        later(()=>{
          if(token!==sequenceToken)return;
          beginDeparture(index-1,'settled',360);
        },activeAt-departureLead);

        later(()=>{
          if(token!==sequenceToken)return;
          stage.classList.add('is-arriving');
        },activeAt-arrivalLead);
      }

      later(()=>{
        if(token!==sequenceToken)return;
        activateStage(index);
        if(index===0)placeOptical(0,.56,.70);
      },activeAt);
    });

    const finalActive=firstActive+(stages.length-1)*stageOffset;
    const finalSettle=finalActive+500;

    later(()=>{
      if(token!==sequenceToken)return;
      beginDeparture(stages.length-1,'settled',360);
    },finalSettle);

    later(()=>{
      if(token!==sequenceToken)return;
      applyBalanced();
      if(focusWindow)focusWindow.style.opacity='.14';
      if(lightCarriage)lightCarriage.style.opacity='.12';
      sequenceRunning=false;
      scheduleAmbient();
    },finalSettle+360);
  };

  const inspectStage=(index)=>{
    if(mode!=='desktop'||reduceMotion.matches)return;

    const introConsumed=consumeDesktopIntro(false);
    if(ambientTimer){window.clearTimeout(ambientTimer);ambientTimer=0;}
    ambientAnimation?.cancel();ambientAnimation=null;

    const activeIndex=stages.findIndex(stage=>stage.classList.contains('is-active'));
    const previous=activeIndex>=0?activeIndex:lastFocusIndex;
    stages.forEach((stage,i)=>{
      stage.classList.remove('is-arriving','is-departing','is-ambient-active');
      setState(i,i===index?'settled':'settled');
    });

    if(previous!==index&&stages[previous]){
      beginDeparture(previous,'settled',330);
      animateOpticalTransfer(previous,index,introConsumed?560:460,.54,.68);
      stages[index].classList.add('is-arriving');
      later(()=>{
        if(mode==='desktop')activateStage(index);
      },introConsumed?105:85);
    }else{
      activateStage(index);
      placeOptical(index,.54,.68);
    }
  };

  const restoreAfterInspect=()=>{
    if(mode!=='desktop'||reduceMotion.matches||sequenceRunning)return;
    applyBalanced();
    if(focusWindow)focusWindow.style.opacity='.14';
    if(lightCarriage)lightCarriage.style.opacity='.12';
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

    stages.forEach((stage,i)=>{
      stage.classList.remove('is-arriving','is-ambient-active');
      if(i!==previous)stage.classList.remove('is-departing');
      if(i!==activeIndex&&i!==previous)setState(i,mobileStateFor(i,activeIndex));
    });

    if(previous>=0&&previous!==activeIndex){
      const previousTarget=previous<activeIndex?'settled':'future';
      beginDeparture(previous,previousTarget,380);
    }

    const stage=stages[activeIndex];
    stage.classList.add('is-arriving');

    if(animate&&previous>=0&&previous!==activeIndex){
      animateOpticalTransfer(previous,activeIndex,620,.60,.74);
    }else{
      placeOptical(activeIndex,.60,.74);
    }

    activeMobileIndex=activeIndex;
    mobileTransitionUntil=performance.now()+(animate?170:0);

    later(()=>{
      if(mode!=='mobile'||reduceMotion.matches||activeMobileIndex!==activeIndex)return;
      activateStage(activeIndex);
    },animate?118:40);
  };

  const chooseMobileStage=()=>{
    if(mode!=='mobile'||reduceMotion.matches)return -1;

    const vh=window.innerHeight||document.documentElement.clientHeight;
    const bandTop=vh*.45;
    const bandBottom=vh*.68;
    const target=vh*.565;
    let best=-1;
    let bestDistance=Infinity;

    stages.forEach((stage,index)=>{
      const r=stage.getBoundingClientRect();
      if(r.bottom<bandTop||r.top>bandBottom)return;
      const center=(r.top+r.bottom)/2;
      const distance=Math.abs(center-target);
      if(distance<bestDistance){
        bestDistance=distance;
        best=index;
      }
    });

    return best;
  };

  const flushPendingMobile=()=>{
    pendingMobileTimer=0;
    if(mode!=='mobile'||reduceMotion.matches)return;
    const next=pendingMobileIndex;
    pendingMobileIndex=-1;
    if(next>=0&&next!==activeMobileIndex)applyMobileStates(next,true);
  };

  const updateMobileFocus=()=>{
    scrollTick=false;
    if(mode!=='mobile'||reduceMotion.matches)return;

    const next=chooseMobileStage();
    if(next<0||next===activeMobileIndex)return;

    const now=performance.now();
    if(now<mobileTransitionUntil){
      pendingMobileIndex=next;
      if(!pendingMobileTimer){
        pendingMobileTimer=window.setTimeout(flushPendingMobile,Math.max(32,mobileTransitionUntil-now+14));
      }
      return;
    }

    applyMobileStates(next,true);
  };

  const scheduleMobileFocus=()=>{
    if(scrollTick)return;
    scrollTick=true;
    window.requestAnimationFrame(updateMobileFocus);
  };

  const setupEntryObserver=()=>{
    entryObserver?.disconnect();
    if(mode!=='desktop'||reduceMotion.matches)return;

    entryObserver=new IntersectionObserver(entries=>{
      const entry=entries[0];
      if(!entry?.isIntersecting)return;
      runDesktopSequence(false);
      entryObserver.disconnect();
    },{threshold:.24,rootMargin:'0px 0px -6% 0px'});

    entryObserver.observe(section);
  };

  const setMode=(nextMode)=>{
    if(mode===nextMode)return;

    mode=nextMode;
    sequenceToken+=1;
    clearTimers();
    cancelAnimations();
    clearTransient();
    entryObserver?.disconnect();
    sequenceRunning=false;
    section.classList.remove('is-established');
    activeMobileIndex=-1;
    mobileTransitionUntil=0;

    if(reduceMotion.matches){
      section.classList.remove('cs-motion-ready');
      applyBalanced();
      return;
    }

    section.classList.add('cs-motion-ready','is-established');

    if(mode==='mobile'){
      setAll('future');
      later(scheduleMobileFocus,80);
    }else{
      setAll(sequencePlayed?'balanced':'future');
      if(sequencePlayed){
        placeOptical(lastFocusIndex,.14,.12);
        scheduleAmbient();
      }else{
        section.classList.remove('is-established');
        setupEntryObserver();
      }
    }
  };

  const repositionOptical=()=>{
    if(reduceMotion.matches)return;
    if(mode==='mobile'&&activeMobileIndex>=0){
      placeOptical(activeMobileIndex,.60,.74);
    }else if(mode==='desktop'&&sequencePlayed&&!sequenceRunning){
      placeOptical(lastFocusIndex,.14,.12);
    }
  };

  const initVisibility=()=>{
    visibilityObserver?.disconnect();
    visibilityObserver=new IntersectionObserver(entries=>{
      const entry=entries[0];
      sectionVisible=!!entry?.isIntersecting;

      if(mode==='desktop'&&sequenceRunning&&(!entry?.isIntersecting||entry.intersectionRatio<.10)){
        consumeDesktopIntro(true);
        return;
      }

      if(!sectionVisible&&ambientTimer){
        window.clearTimeout(ambientTimer);
        ambientTimer=0;
      }
      if(sectionVisible&&mode==='desktop'&&sequencePlayed&&!sequenceRunning)scheduleAmbient();
    },{threshold:[0,.10,.18]});
    visibilityObserver.observe(section);
  };

  stages.forEach((stage,index)=>{
    stage.addEventListener('pointerenter',()=>{
      if(pointerLeaveTimer){
        window.clearTimeout(pointerLeaveTimer);
        pointerLeaveTimer=0;
      }
      inspectStage(index);
    });

    stage.addEventListener('pointerleave',()=>{
      if(mode!=='desktop'||sequenceRunning)return;
      pointerLeaveTimer=window.setTimeout(()=>{
        pointerLeaveTimer=0;
        restoreAfterInspect();
      },95);
    });

    stage.addEventListener('focus',()=>inspectStage(index));
    stage.addEventListener('blur',()=>restoreAfterInspect());
  });

  window.addEventListener('scroll',scheduleMobileFocus,{passive:true});

  window.addEventListener('resize',()=>{
    const next=compactLayout.matches?'mobile':'desktop';
    if(next!==mode){
      setMode(next);
      later(repositionOptical,100);
    }else{
      if(mode==='mobile')scheduleMobileFocus();
      later(repositionOptical,80);
    }
  },{passive:true});

  window.addEventListener('orientationchange',()=>{
    later(()=>{
      const next=compactLayout.matches?'mobile':'desktop';
      if(next!==mode)setMode(next);
      if(mode==='mobile')scheduleMobileFocus();
      repositionOptical();
    },140);
  });

  compactLayout.addEventListener?.('change',()=>setMode(compactLayout.matches?'mobile':'desktop'));

  reduceMotion.addEventListener?.('change',()=>{
    sequenceToken+=1;
    clearTimers();
    cancelAnimations();
    const next=compactLayout.matches?'mobile':'desktop';
    mode=null;
    setMode(next);
  });

  initVisibility();
  setMode(compactLayout.matches?'mobile':'desktop');
})();
