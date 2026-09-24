/* ProAI Expert — Two Worlds Production Premium Stabilization R3.1
   R3 remains the visual donor. R3.1 adds explicit locked states, one motion
   authority, stable mobile viewport geometry and state-based inscriptions. */
(function () {
  'use strict';

  var sections=Array.prototype.slice.call(document.querySelectorAll('[data-tw-r3]'));
  if (!sections.length) return;

  var finePointer=window.matchMedia('(hover:hover) and (pointer:fine)');
  var mobileQuery=window.matchMedia('(max-width:980px), ((hover:none) and (pointer:coarse))');
  var landscapeQuery=window.matchMedia('(orientation:landscape) and (max-height:540px) and (max-width:980px) and (hover:none) and (pointer:coarse)');
  var reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  var states=new WeakMap();
  var meters=new Map();
  var scrollRaf=0;
  var resizeTimer=0;
  var HOLD_START=.20;
  var HOLD_END=.80;
  var TRAVEL_MULTIPLIER=2.50;

  function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
  function smoothstep(v){v=clamp(v,0,1);return v*v*(3-(2*v));}
  function smootherstep(v){v=clamp(v,0,1);return v*v*v*(v*(v*6-15)+10);}
  function mix(a,b,t){return a+((b-a)*t);}

  function stateFor(section){
    var s=states.get(section);
    if(s)return s;
    s={
      raw:0,
      progress:0,
      visualState:'',
      lastRenderedP:-1,
      viewportWidth:0,
      viewportHeight:0,
      suspendScroll:false,
      targetLightX:0,
      targetLightY:0,
      currentLightX:0,
      currentLightY:0,
      lightRaf:0,
      fitRaf:0,
      leaveTimer:0,
      entered:false
    };
    states.set(section,s);
    return s;
  }

  function mobileMode(){return !reducedMotion.matches&&mobileQuery.matches;}

  function stageHeightNow(){
    if(window.visualViewport&&window.visualViewport.height>0)return Math.max(1,Math.round(window.visualViewport.height));
    return Math.max(1,Math.round(document.documentElement.clientHeight||window.innerHeight||1));
  }

  function stageWidthNow(){
    if(window.visualViewport&&window.visualViewport.width>0)return Math.max(1,Math.round(window.visualViewport.width));
    return Math.max(1,Math.round(document.documentElement.clientWidth||window.innerWidth||1));
  }

  function sectionEngaged(section){
    var experience=section.querySelector('[data-tw-experience]');
    var viewport=section.querySelector('[data-tw-viewport]');
    if(!experience||!viewport)return false;
    var vr=viewport.getBoundingClientRect();
    var vh=Math.max(1,vr.height||stateFor(section).viewportHeight||stageHeightNow());
    var er=experience.getBoundingClientRect();
    return er.top<=2&&er.bottom>=vh-2;
  }

  function scrollRaw(section){
    var experience=section.querySelector('[data-tw-experience]');
    var s=stateFor(section);
    if(!experience)return s.raw;
    var vh=Math.max(1,s.viewportHeight||stageHeightNow());
    var travel=Math.max(1,experience.offsetHeight-vh);
    var rect=experience.getBoundingClientRect();
    var absoluteTop=rect.top+window.scrollY;
    return clamp((window.scrollY-absoluteTop)/travel,0,1);
  }

  function alignScrollToRaw(section,raw){
    var experience=section.querySelector('[data-tw-experience]');
    var s=stateFor(section);
    if(!experience)return;
    var vh=Math.max(1,s.viewportHeight||stageHeightNow());
    var travel=Math.max(1,experience.offsetHeight-vh);
    var rect=experience.getBoundingClientRect();
    var absoluteTop=rect.top+window.scrollY;
    window.scrollTo(0,absoluteTop+(travel*clamp(raw,0,1)));
  }

  function classify(raw){
    if(raw<=HOLD_START)return 'AI_LOCKED';
    if(raw>=HOLD_END)return 'WEB_LOCKED';
    return 'TURNING';
  }

  function turnProgress(raw){
    if(raw<=HOLD_START)return 0;
    if(raw>=HOLD_END)return 1;
    return smootherstep((raw-HOLD_START)/(HOLD_END-HOLD_START));
  }

  function fadeOut(p,start,end){return 1-smoothstep((p-start)/(end-start));}
  function fadeIn(p,start,end){return smoothstep((p-start)/(end-start));}
  function setVar(section,name,value){section.style.setProperty(name,value);}

  function setAccessibility(section,state){
    var ai=section.querySelector('[data-tw-world="ai"]');
    var web=section.querySelector('[data-tw-world="web"]');
    var aiLink=ai&&ai.querySelector('a');
    var webLink=web&&web.querySelector('a');
    if(state==='AI_LOCKED'){
      if(ai)ai.removeAttribute('aria-hidden');
      if(web)web.setAttribute('aria-hidden','true');
      if(aiLink)aiLink.removeAttribute('tabindex');
      if(webLink)webLink.setAttribute('tabindex','-1');
    }else if(state==='WEB_LOCKED'){
      if(ai)ai.setAttribute('aria-hidden','true');
      if(web)web.removeAttribute('aria-hidden');
      if(aiLink)aiLink.setAttribute('tabindex','-1');
      if(webLink)webLink.removeAttribute('tabindex');
    }else{
      if(ai)ai.removeAttribute('aria-hidden');
      if(web)web.removeAttribute('aria-hidden');
      if(aiLink)aiLink.setAttribute('tabindex','-1');
      if(webLink)webLink.setAttribute('tabindex','-1');
    }
  }

  function writeLocked(section,state){
    var s=stateFor(section);
    if(state==='AI_LOCKED'){
      setVar(section,'--tw-r31-ai-x','0%');
      setVar(section,'--tw-r31-web-x','100%');
      setVar(section,'--tw-r31-ai-ry','-3deg');
      setVar(section,'--tw-r31-web-ry','72deg');
      setVar(section,'--tw-r31-shared-z','0px');
      setVar(section,'--tw-r31-fold-x','102%');
      setVar(section,'--tw-r31-fold-ry','-3deg');
      setVar(section,'--tw-r31-fold-opacity','0');
      setVar(section,'--tw-r31-ai-content-opacity','1');
      setVar(section,'--tw-r31-web-content-opacity','0');
      setVar(section,'--tw-r31-ai-word-opacity','1');
      setVar(section,'--tw-r31-web-word-opacity','0');
      section.setAttribute('data-focus','ai');
      section.setAttribute('data-r31-progress','0');
      s.progress=0;
      s.lastRenderedP=0;
    }else{
      setVar(section,'--tw-r31-ai-x','-100%');
      setVar(section,'--tw-r31-web-x','0%');
      setVar(section,'--tw-r31-ai-ry','-72deg');
      setVar(section,'--tw-r31-web-ry','3deg');
      setVar(section,'--tw-r31-shared-z','0px');
      setVar(section,'--tw-r31-fold-x','-2%');
      setVar(section,'--tw-r31-fold-ry','3deg');
      setVar(section,'--tw-r31-fold-opacity','0');
      setVar(section,'--tw-r31-ai-content-opacity','0');
      setVar(section,'--tw-r31-web-content-opacity','1');
      setVar(section,'--tw-r31-ai-word-opacity','0');
      setVar(section,'--tw-r31-web-word-opacity','1');
      section.setAttribute('data-focus','web');
      section.setAttribute('data-r31-progress','1');
      s.progress=1;
      s.lastRenderedP=1;
    }
    setAccessibility(section,state);
  }

  function writeTurning(section,p){
    var s=stateFor(section);
    if(Math.abs(p-s.lastRenderedP)<.00012)return;
    s.lastRenderedP=p;
    s.progress=p;

    var boundary=102-(104*p);
    var sharedZ=-96*Math.sin(Math.PI*p);
    var foldOpacity=Math.pow(Math.sin(Math.PI*p),.62);
    var foldRy=mix(-3,3,p);
    var aiContent=fadeOut(p,.24,.70);
    var webContent=fadeIn(p,.30,.76);
    var aiWord=fadeOut(p,.30,.75);
    var webWord=fadeIn(p,.25,.70);

    setVar(section,'--tw-r31-ai-x',(-100*p).toFixed(4)+'%');
    setVar(section,'--tw-r31-web-x',(100*(1-p)).toFixed(4)+'%');
    setVar(section,'--tw-r31-ai-ry',(-3-(69*p)).toFixed(4)+'deg');
    setVar(section,'--tw-r31-web-ry',(72-(69*p)).toFixed(4)+'deg');
    setVar(section,'--tw-r31-shared-z',sharedZ.toFixed(2)+'px');
    setVar(section,'--tw-r31-fold-x',boundary.toFixed(4)+'%');
    setVar(section,'--tw-r31-fold-ry',foldRy.toFixed(4)+'deg');
    setVar(section,'--tw-r31-fold-opacity',clamp(foldOpacity,0,1).toFixed(4));
    setVar(section,'--tw-r31-ai-content-opacity',clamp(aiContent,0,1).toFixed(4));
    setVar(section,'--tw-r31-web-content-opacity',clamp(webContent,0,1).toFixed(4));
    setVar(section,'--tw-r31-ai-word-opacity',clamp(aiWord,0,1).toFixed(4));
    setVar(section,'--tw-r31-web-word-opacity',clamp(webWord,0,1).toFixed(4));
    section.setAttribute('data-r31-progress',p.toFixed(4));
  }

  function applyMobileRaw(section,raw,force){
    var s=stateFor(section);
    raw=clamp(raw,0,1);
    s.raw=raw;
    var next=classify(raw);

    if(next!==s.visualState||force){
      s.visualState=next;
      section.setAttribute('data-r31-state',next);
      if(next==='AI_LOCKED'||next==='WEB_LOCKED'){
        writeLocked(section,next);
      }else{
        section.setAttribute('data-focus','turn');
        setAccessibility(section,next);
        s.lastRenderedP=-1;
        writeTurning(section,turnProgress(raw));
      }
      return;
    }

    if(next==='TURNING')writeTurning(section,turnProgress(raw));
  }

  function updateMobile(section){
    var s=stateFor(section);
    if(!mobileMode()||s.suspendScroll)return;
    applyMobileRaw(section,scrollRaw(section),false);
  }

  function meterWidth(inscription){
    var style=window.getComputedStyle(inscription);
    var key=inscription.textContent+'|'+style.fontFamily+'|'+style.fontWeight+'|'+style.letterSpacing;
    if(meters.has(key))return meters.get(key);
    var meter=document.createElement('span');
    meter.textContent=inscription.textContent;
    meter.setAttribute('aria-hidden','true');
    meter.style.cssText=[
      'position:fixed','left:-10000px','top:-10000px','visibility:hidden','white-space:nowrap',
      'font-family:'+style.fontFamily,'font-weight:'+style.fontWeight,'font-style:'+style.fontStyle,
      'font-size:100px','letter-spacing:'+style.letterSpacing,'line-height:1'
    ].join(';');
    document.body.appendChild(meter);
    var width=Math.max(1,meter.getBoundingClientRect().width);
    meter.remove();
    meters.set(key,width);
    return width;
  }

  function desktopTerritory(focus,world){
    if(focus==='ai')return world==='ai'?{start:0,end:.72,target:.73}:{start:.692,end:1,target:.72};
    if(focus==='web')return world==='web'?{start:.28,end:1,target:.73}:{start:0,end:.308,target:.72};
    return world==='ai'?{start:0,end:.515,target:.73}:{start:.485,end:1,target:.73};
  }

  function fitMobileInscription(section,world){
    var viewport=section.querySelector('[data-tw-viewport]');
    var inscription=section.querySelector('.tw-r2__inscription--'+world);
    if(!viewport||!inscription)return;
    var width=Math.max(1,stateFor(section).viewportWidth||viewport.getBoundingClientRect().width||stageWidthNow());
    var ratio=landscapeQuery.matches?.72:.74;
    var limits=landscapeQuery.matches?[28,118]:[32,132];
    var measured=meterWidth(inscription);
    var size=clamp((100*(width*ratio))/measured,limits[0],limits[1]);
    inscription.style.setProperty('--tw-g-inscription-center','50%');
    inscription.style.setProperty('--tw-g-inscription-size',size.toFixed(2)+'px');
    inscription.setAttribute('data-golden-rendered-width',Math.round(measured*size/100)+'px');
    inscription.setAttribute('data-golden-center-error','0.00px');
  }

  function fitDesktopInscription(section,world){
    var viewport=section.querySelector('[data-tw-viewport]');
    var face=section.querySelector('[data-tw-world="'+world+'"]');
    var inscription=section.querySelector('.tw-r2__inscription--'+world);
    if(!viewport||!face||!inscription||!face.offsetWidth)return;
    var vr=viewport.getBoundingClientRect();
    if(!vr.width)return;
    var focus=section.getAttribute('data-focus')||'neutral';
    var territory=desktopTerritory(focus,world);
    var target=window.innerWidth<=1200?Math.min(.79,territory.target+.06):territory.target;
    var targetCenter=vr.left+(vr.width*((territory.start+territory.end)/2));
    var targetWidth=vr.width*(territory.end-territory.start)*target;
    var measured=meterWidth(inscription);
    var visualScale=clamp(face.getBoundingClientRect().width/face.offsetWidth,.58,1.18);
    var size=clamp((100*targetWidth/measured)/visualScale,48,220);
    var localCenter=(targetCenter-vr.left)-face.offsetLeft;
    inscription.style.setProperty('--tw-g-inscription-center',localCenter.toFixed(2)+'px');
    inscription.style.setProperty('--tw-g-inscription-size',size.toFixed(2)+'px');
  }

  function fitSection(section){
    if(mobileQuery.matches){
      fitMobileInscription(section,'ai');
      fitMobileInscription(section,'web');
    }else{
      fitDesktopInscription(section,'ai');
      fitDesktopInscription(section,'web');
    }
  }

  function scheduleFit(section){
    var s=stateFor(section);
    if(s.fitRaf)return;
    s.fitRaf=window.requestAnimationFrame(function(){
      s.fitRaf=0;
      fitSection(section);
    });
  }

  function setLight(section,x,y){
    section.style.setProperty('--tw-g-light-x',x.toFixed(3)+'%');
    section.style.setProperty('--tw-g-light-y',y.toFixed(3)+'%');
  }

  function runLight(section){
    var s=stateFor(section);
    s.lightRaf=0;
    if(reducedMotion.matches||mobileQuery.matches||!finePointer.matches){
      s.currentLightX=s.currentLightY=s.targetLightX=s.targetLightY=0;
      setLight(section,0,0);
      return;
    }
    s.currentLightX+=(s.targetLightX-s.currentLightX)*.075;
    s.currentLightY+=(s.targetLightY-s.currentLightY)*.075;
    if(Math.abs(s.targetLightX-s.currentLightX)<.006)s.currentLightX=s.targetLightX;
    if(Math.abs(s.targetLightY-s.currentLightY)<.006)s.currentLightY=s.targetLightY;
    setLight(section,s.currentLightX,s.currentLightY);
    if(s.currentLightX!==s.targetLightX||s.currentLightY!==s.targetLightY){
      s.lightRaf=window.requestAnimationFrame(function(){runLight(section);});
    }
  }

  function scheduleLight(section){
    var s=stateFor(section);
    if(!s.lightRaf)s.lightRaf=window.requestAnimationFrame(function(){runLight(section);});
  }

  function neutralLight(section){
    var s=stateFor(section);
    s.targetLightX=0;s.targetLightY=0;
    scheduleLight(section);
  }

  function updateHeaderGuard(section){
    var viewport=section.querySelector('[data-tw-viewport]');
    if(!viewport)return;
    if(landscapeQuery.matches&&!reducedMotion.matches){
      viewport.setAttribute('data-header-autohide-guard','two-worlds-r3-1');
    }else{
      viewport.removeAttribute('data-header-autohide-guard');
    }
  }

  function triggerEntryLight(section){
    var s=stateFor(section);
    if(s.entered||reducedMotion.matches)return;
    s.entered=true;
    section.setAttribute('data-entry-lit','run');
    window.setTimeout(function(){section.setAttribute('data-entry-lit','done');},1500);
  }

  function applyStableMobileGeometry(section,preserve){
    var s=stateFor(section);
    var raw=s.raw;
    var engaged=sectionEngaged(section);
    var width=stageWidthNow();
    var height=stageHeightNow();

    s.viewportWidth=width;
    s.viewportHeight=height;
    section.style.setProperty('--tw-r31-stage-height',height+'px');
    section.style.setProperty('--tw-r31-travel-height',Math.round(height*TRAVEL_MULTIPLIER)+'px');
    updateHeaderGuard(section);
    fitSection(section);

    window.requestAnimationFrame(function(){
      if(preserve&&engaged){
        s.suspendScroll=true;
        applyMobileRaw(section,raw,true);
        alignScrollToRaw(section,raw);
        window.requestAnimationFrame(function(){
          s.suspendScroll=false;
          applyMobileRaw(section,raw,true);
        });
      }else{
        applyMobileRaw(section,scrollRaw(section),true);
      }
    });
  }

  function syncGeometry(section,preserve,forceMobile){
    var s=stateFor(section);
    var viewport=section.querySelector('[data-tw-viewport]');
    if(!viewport)return;

    if(reducedMotion.matches){
      section.setAttribute('data-focus','neutral');
      section.removeAttribute('data-r31-state');
      section.removeAttribute('data-r31-progress');
      updateHeaderGuard(section);
      scheduleFit(section);
      return;
    }

    if(mobileQuery.matches){
      var nextWidth=stageWidthNow();
      var engaged=sectionEngaged(section);
      var widthChanged=!s.viewportWidth||Math.abs(nextWidth-s.viewportWidth)>18;
      if(forceMobile||widthChanged||!engaged){
        applyStableMobileGeometry(section,preserve);
      }else{
        updateHeaderGuard(section);
      }
      neutralLight(section);
    }else{
      s.viewportWidth=Math.max(1,viewport.getBoundingClientRect().width||window.innerWidth);
      s.viewportHeight=Math.max(1,viewport.getBoundingClientRect().height||window.innerHeight);
      section.setAttribute('data-focus','neutral');
      section.removeAttribute('data-r31-state');
      section.removeAttribute('data-r31-progress');
      section.style.removeProperty('--tw-r31-stage-height');
      section.style.removeProperty('--tw-r31-travel-height');
      updateHeaderGuard(section);
      scheduleFit(section);
      neutralLight(section);
    }
  }

  function bindSection(section){
    var viewport=section.querySelector('[data-tw-viewport]');
    var aiWorld=section.querySelector('[data-tw-world="ai"]');
    var webWorld=section.querySelector('[data-tw-world="web"]');
    if(!viewport||!aiWorld||!webWorld)return;
    stateFor(section);

    viewport.addEventListener('pointermove',function(event){
      if(!finePointer.matches||mobileQuery.matches||reducedMotion.matches)return;
      var rect=viewport.getBoundingClientRect();
      if(!rect.width||!rect.height)return;
      var x=clamp(event.clientX-rect.left,0,rect.width);
      var y=clamp(event.clientY-rect.top,0,rect.height);
      var percent=x/rect.width*100;
      var next=percent<47?'ai':(percent>53?'web':'neutral');
      window.clearTimeout(stateFor(section).leaveTimer);
      if(section.getAttribute('data-focus')!==next){
        section.setAttribute('data-focus',next);
        scheduleFit(section);
      }
      section.style.setProperty('--tw-pointer-x',(x/rect.width*100).toFixed(2)+'%');
      section.style.setProperty('--tw-pointer-y',(y/rect.height*100).toFixed(2)+'%');
      if(next==='ai'||next==='web'){
        var s=stateFor(section);
        s.targetLightX=clamp(((x/rect.width)-.5)*2,-1,1)*4.5;
        s.targetLightY=clamp(((y/rect.height)-.5)*2,-1,1)*2.6;
        scheduleLight(section);
      }else neutralLight(section);
    },{passive:true});

    viewport.addEventListener('pointerleave',function(){
      if(!finePointer.matches||mobileQuery.matches||reducedMotion.matches)return;
      var s=stateFor(section);
      window.clearTimeout(s.leaveTimer);
      neutralLight(section);
      s.leaveTimer=window.setTimeout(function(){
        section.setAttribute('data-focus','neutral');
        scheduleFit(section);
      },170);
    },{passive:true});

    section.addEventListener('focusin',function(event){
      if(mobileQuery.matches||reducedMotion.matches)return;
      if(aiWorld.contains(event.target))section.setAttribute('data-focus','ai');
      if(webWorld.contains(event.target))section.setAttribute('data-focus','web');
      scheduleFit(section);
    });

    section.addEventListener('focusout',function(){
      if(mobileQuery.matches||reducedMotion.matches)return;
      window.requestAnimationFrame(function(){
        if(!section.contains(document.activeElement)){
          section.setAttribute('data-focus','neutral');
          scheduleFit(section);
        }
      });
    });

    if('IntersectionObserver'in window){
      var io=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting&&entry.intersectionRatio>.55){
            triggerEntryLight(section);
            io.unobserve(viewport);
          }
        });
      },{threshold:[.35,.55,.75]});
      io.observe(viewport);
    }else triggerEntryLight(section);

    syncGeometry(section,false,true);
  }

  sections.forEach(bindSection);

  function runScroll(){
    scrollRaf=0;
    sections.forEach(updateMobile);
  }
  function scheduleScroll(){
    if(!scrollRaf)scrollRaf=window.requestAnimationFrame(runScroll);
  }

  function scheduleResize(){
    window.clearTimeout(resizeTimer);
    resizeTimer=window.setTimeout(function(){
      sections.forEach(function(section){syncGeometry(section,true,false);});
      scheduleScroll();
    },110);
  }

  window.addEventListener('scroll',scheduleScroll,{passive:true});
  window.addEventListener('resize',scheduleResize,{passive:true});
  window.addEventListener('orientationchange',function(){
    window.setTimeout(function(){
      sections.forEach(function(section){syncGeometry(section,true,true);});
      scheduleScroll();
    },160);
  },{passive:true});

  if(window.visualViewport){
    window.visualViewport.addEventListener('resize',function(){
      sections.forEach(function(section){syncGeometry(section,true,false);});
    },{passive:true});
  }

  [finePointer,mobileQuery,landscapeQuery,reducedMotion].forEach(function(query){
    var handler=function(){
      sections.forEach(function(section){syncGeometry(section,true,true);});
      scheduleScroll();
    };
    if(typeof query.addEventListener==='function')query.addEventListener('change',handler);
    else if(typeof query.addListener==='function')query.addListener(handler);
  });

  if(document.fonts&&document.fonts.ready){
    document.fonts.ready.then(function(){
      meters.clear();
      sections.forEach(function(section){scheduleFit(section);});
    });
  }

  window.addEventListener('pageshow',function(){
    sections.forEach(function(section){syncGeometry(section,true,true);});
    scheduleScroll();
  },{passive:true});
}());
