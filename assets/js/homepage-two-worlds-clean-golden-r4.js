/* ProAI Expert — Two Worlds Clean Production Synthesis R4
   One mobile motion authority. No scrollTo. No continuous locked-state RAF.
   Production desktop behavior is re-established from main without binding
   to the legacy [data-tw-r2] / [data-tw-r3] runtimes. */
(function () {
  'use strict';

  var sections=Array.prototype.slice.call(document.querySelectorAll('[data-tw-r4]'));
  if(!sections.length)return;

  var finePointer=window.matchMedia('(hover:hover) and (pointer:fine)');
  var mobileQuery=window.matchMedia('(max-width:980px), ((hover:none) and (pointer:coarse))');
  var landscapeQuery=window.matchMedia('(orientation:landscape) and (max-height:540px) and (max-width:980px)');
  var reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  var states=new WeakMap();
  var meters=new Map();

  var TURN_MS=640;
  var IGNORE_DELTA=2;
  var WIDTH_RECOMPOSE_DELTA=40;

  function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
  function smoothstep(v){v=clamp(v,0,1);return v*v*(3-(2*v));}
  function smootherstep(v){v=clamp(v,0,1);return v*v*v*(v*(v*6-15)+10);}
  function mix(a,b,t){return a+((b-a)*t);}

  function stageWidthNow(){
    if(window.visualViewport&&window.visualViewport.width>0)return Math.max(1,Math.round(window.visualViewport.width));
    return Math.max(1,Math.round(document.documentElement.clientWidth||window.innerWidth||1));
  }
  function stageHeightNow(){
    if(window.visualViewport&&window.visualViewport.height>0)return Math.max(1,Math.round(window.visualViewport.height));
    return Math.max(1,Math.round(document.documentElement.clientHeight||window.innerHeight||1));
  }
  function orientationFor(w,h){return w>h?'landscape':'portrait';}

  function stateFor(section){
    var s=states.get(section);
    if(s)return s;
    s={
      logical:'AI_LOCKED',
      t:0,
      direction:0,
      raf:0,
      lastFrame:0,
      intent:0,
      reverseIntent:0,
      lastScrollY:Math.max(0,window.scrollY||0),
      viewportWidth:0,
      viewportHeight:0,
      orientation:'',
      mobile:false,
      moonlit:false,
      targetLightX:0,
      targetLightY:0,
      currentLightX:0,
      currentLightY:0,
      lightRaf:0,
      leaveTimer:0,
      fitTimer:0,
      fitTimer2:0
    };
    states.set(section,s);
    return s;
  }

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

  function setBothAccessible(section){
    var ai=section.querySelector('[data-tw-world="ai"]');
    var web=section.querySelector('[data-tw-world="web"]');
    var aiLink=ai&&ai.querySelector('a');
    var webLink=web&&web.querySelector('a');
    if(ai)ai.removeAttribute('aria-hidden');
    if(web)web.removeAttribute('aria-hidden');
    if(aiLink)aiLink.removeAttribute('tabindex');
    if(webLink)webLink.removeAttribute('tabindex');
  }

  function writeLocked(section,state){
    var s=stateFor(section);
    if(s.raf){window.cancelAnimationFrame(s.raf);s.raf=0;}
    s.logical=state;
    s.direction=0;
    s.intent=0;
    s.reverseIntent=0;
    s.lastFrame=0;
    if(state==='AI_LOCKED'){
      s.t=0;
      setVar(section,'--tw-r4-ai-x','0%');
      setVar(section,'--tw-r4-web-x','104%');
      setVar(section,'--tw-r4-ai-ry','-3deg');
      setVar(section,'--tw-r4-web-ry','72deg');
      setVar(section,'--tw-r4-ai-z','0px');
      setVar(section,'--tw-r4-web-z','0px');
      setVar(section,'--tw-r4-fold-x','110%');
      setVar(section,'--tw-r4-fold-ry','-8deg');
      setVar(section,'--tw-r4-ai-light-opacity','.48');
      setVar(section,'--tw-r4-web-light-opacity','.08');
      setVar(section,'--tw-r4-fold-response','.88');
      setVar(section,'--tw-r4-ai-content-opacity','1');
      setVar(section,'--tw-r4-web-content-opacity','0');
      setVar(section,'--tw-r4-ai-inscription-opacity','.92');
      setVar(section,'--tw-r4-web-inscription-opacity','0');
      section.setAttribute('data-focus','ai');
    }else{
      s.t=1;
      setVar(section,'--tw-r4-ai-x','-104%');
      setVar(section,'--tw-r4-web-x','0%');
      setVar(section,'--tw-r4-ai-ry','-72deg');
      setVar(section,'--tw-r4-web-ry','3deg');
      setVar(section,'--tw-r4-ai-z','0px');
      setVar(section,'--tw-r4-web-z','0px');
      setVar(section,'--tw-r4-fold-x','-10%');
      setVar(section,'--tw-r4-fold-ry','8deg');
      setVar(section,'--tw-r4-ai-light-opacity','.07');
      setVar(section,'--tw-r4-web-light-opacity','.46');
      setVar(section,'--tw-r4-fold-response','.88');
      setVar(section,'--tw-r4-ai-content-opacity','0');
      setVar(section,'--tw-r4-web-content-opacity','1');
      setVar(section,'--tw-r4-ai-inscription-opacity','0');
      setVar(section,'--tw-r4-web-inscription-opacity','.92');
      section.setAttribute('data-focus','web');
    }
    section.setAttribute('data-r4-state',state);
    section.removeAttribute('data-r4-direction');
    setAccessibility(section,state);
  }

  function renderTransition(section,t){
    var s=stateFor(section);
    t=clamp(t,0,1);
    s.t=t;
    var p=smootherstep(t);
    var sharedZ=-96*Math.sin(Math.PI*p);
    var aiContent=1-smoothstep((t-.18)/.24);
    var webContent=smoothstep((t-.58)/.24);
    var aiInscription=.92*(1-smoothstep((t-.24)/.22));
    var webInscription=.92*smoothstep((t-.54)/.22);
    var aiLight=mix(.48,.07,p);
    var webLight=mix(.08,.46,p);
    var foldResponse=.88+(.12*Math.sin(Math.PI*p));

    setVar(section,'--tw-r4-ai-x',(-104*p).toFixed(3)+'%');
    setVar(section,'--tw-r4-web-x',(104*(1-p)).toFixed(3)+'%');
    setVar(section,'--tw-r4-ai-ry',mix(-3,-72,p).toFixed(3)+'deg');
    setVar(section,'--tw-r4-web-ry',mix(72,3,p).toFixed(3)+'deg');
    setVar(section,'--tw-r4-ai-z',sharedZ.toFixed(2)+'px');
    setVar(section,'--tw-r4-web-z',sharedZ.toFixed(2)+'px');
    setVar(section,'--tw-r4-fold-x',mix(110,-10,p).toFixed(3)+'%');
    setVar(section,'--tw-r4-fold-ry',mix(-8,8,p).toFixed(3)+'deg');
    setVar(section,'--tw-r4-ai-content-opacity',aiContent.toFixed(3));
    setVar(section,'--tw-r4-web-content-opacity',webContent.toFixed(3));
    setVar(section,'--tw-r4-ai-inscription-opacity',aiInscription.toFixed(3));
    setVar(section,'--tw-r4-web-inscription-opacity',webInscription.toFixed(3));
    setVar(section,'--tw-r4-ai-light-opacity',aiLight.toFixed(3));
    setVar(section,'--tw-r4-web-light-opacity',webLight.toFixed(3));
    setVar(section,'--tw-r4-fold-response',foldResponse.toFixed(3));
  }

  function tick(section,now){
    var s=stateFor(section);
    if(s.logical!=='TRANSITIONING'){s.raf=0;return;}
    if(!s.lastFrame)s.lastFrame=now;
    var dt=Math.min(34,Math.max(0,now-s.lastFrame));
    s.lastFrame=now;
    s.t=clamp(s.t+(s.direction*(dt/TURN_MS)),0,1);
    renderTransition(section,s.t);
    if(s.direction<0&&s.t<=0){writeLocked(section,'AI_LOCKED');return;}
    if(s.direction>0&&s.t>=1){writeLocked(section,'WEB_LOCKED');return;}
    s.raf=window.requestAnimationFrame(function(ts){tick(section,ts);});
  }

  function beginTransition(section,direction){
    var s=stateFor(section);
    if(reducedMotion.matches||!mobileQuery.matches)return;
    if(s.logical==='TRANSITIONING'){
      s.direction=direction;
      section.setAttribute('data-r4-direction',direction>0?'forward':'reverse');
      return;
    }
    s.logical='TRANSITIONING';
    s.direction=direction;
    s.intent=0;
    s.reverseIntent=0;
    s.lastFrame=0;
    section.setAttribute('data-r4-state','TRANSITIONING');
    section.setAttribute('data-r4-direction',direction>0?'forward':'reverse');
    section.setAttribute('data-focus','turn');
    setAccessibility(section,'TRANSITIONING');
    renderTransition(section,s.t);
    if(!s.raf)s.raf=window.requestAnimationFrame(function(ts){tick(section,ts);});
  }

  function reverseThreshold(){return landscapeQuery.matches?38:46;}
  function forwardThreshold(){return landscapeQuery.matches?30:38;}

  function sectionEngaged(section){
    var experience=section.querySelector('[data-tw-experience]');
    if(!experience)return false;
    var s=stateFor(section);
    var vh=Math.max(1,s.viewportHeight||stageHeightNow());
    var rect=experience.getBoundingClientRect();
    return rect.top<=2&&rect.bottom>=vh-2;
  }

  function initialMobileState(section){
    var experience=section.querySelector('[data-tw-experience]');
    if(!experience)return 'AI_LOCKED';
    var s=stateFor(section);
    var vh=Math.max(1,s.viewportHeight||stageHeightNow());
    var travel=Math.max(1,experience.offsetHeight-vh);
    var rect=experience.getBoundingClientRect();
    var raw=clamp(-rect.top/travel,0,1);
    return raw>.56?'WEB_LOCKED':'AI_LOCKED';
  }

  function handleScrollFor(section){
    var s=stateFor(section);
    var y=Math.max(0,window.scrollY||0);
    var delta=y-s.lastScrollY;
    s.lastScrollY=y;

    if(!mobileQuery.matches||reducedMotion.matches)return;
    if(!sectionEngaged(section)){
      s.intent=0;
      s.reverseIntent=0;
      return;
    }
    if(Math.abs(delta)<=IGNORE_DELTA)return;

    if(s.logical==='TRANSITIONING'){
      var opposite=(s.direction>0&&delta<0)||(s.direction<0&&delta>0);
      if(opposite){
        s.reverseIntent+=Math.abs(delta);
        if(s.reverseIntent>=reverseThreshold()){
          s.direction*=-1;
          s.reverseIntent=0;
          section.setAttribute('data-r4-direction',s.direction>0?'forward':'reverse');
        }
      }else{
        s.reverseIntent=Math.max(0,s.reverseIntent-(Math.abs(delta)*.75));
      }
      return;
    }

    if(s.logical==='AI_LOCKED'){
      if(delta>0){
        s.intent+=delta;
        if(s.intent>=forwardThreshold())beginTransition(section,1);
      }else{
        s.intent=Math.max(0,s.intent-(Math.abs(delta)*1.35));
      }
      return;
    }

    if(s.logical==='WEB_LOCKED'){
      if(delta<0){
        s.intent+=Math.abs(delta);
        if(s.intent>=reverseThreshold())beginTransition(section,-1);
      }else{
        s.intent=Math.max(0,s.intent-(Math.abs(delta)*1.35));
      }
    }
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

  function fitDesktopInscription(section,world){
    if(mobileQuery.matches)return;
    var viewport=section.querySelector('[data-tw-viewport]');
    var face=section.querySelector('[data-tw-world="'+world+'"]');
    var inscription=section.querySelector('.tw-r2__inscription--'+world);
    if(!viewport||!face||!inscription||!face.offsetWidth)return;
    var vr=viewport.getBoundingClientRect();
    if(!vr.width)return;
    var focus=section.getAttribute('data-focus')||'neutral';
    var territory=desktopTerritory(focus,world);
    var target=window.innerWidth<=1200?Math.min(.79,territory.target+.06):territory.target;
    var targetCenter=vr.left+vr.width*((territory.start+territory.end)/2);
    var targetWidth=vr.width*(territory.end-territory.start)*target;
    var measured=meterWidth(inscription);
    var visualScale=clamp(face.getBoundingClientRect().width/face.offsetWidth,.58,1.18);
    var size=clamp((100*targetWidth/measured)/visualScale,48,220);
    var localCenter=(targetCenter-vr.left)-face.offsetLeft;
    inscription.style.setProperty('--tw-g-inscription-center',localCenter.toFixed(2)+'px');
    inscription.style.setProperty('--tw-g-inscription-size',size.toFixed(2)+'px');
  }

  function fitDesktop(section){
    fitDesktopInscription(section,'ai');
    fitDesktopInscription(section,'web');
  }

  function scheduleDesktopFit(section){
    var s=stateFor(section);
    window.clearTimeout(s.fitTimer);
    window.clearTimeout(s.fitTimer2);
    s.fitTimer=window.setTimeout(function(){fitDesktop(section);},0);
    s.fitTimer2=window.setTimeout(function(){fitDesktop(section);},720);
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

  function bindDesktop(section){
    var viewport=section.querySelector('[data-tw-viewport]');
    var ai=section.querySelector('[data-tw-world="ai"]');
    var web=section.querySelector('[data-tw-world="web"]');
    if(!viewport||!ai||!web)return;

    viewport.addEventListener('pointermove',function(event){
      if(mobileQuery.matches||!finePointer.matches)return;
      var rect=viewport.getBoundingClientRect();
      if(!rect.width||!rect.height)return;
      var x=clamp(event.clientX-rect.left,0,rect.width);
      var y=clamp(event.clientY-rect.top,0,rect.height);
      var pct=x/rect.width*100;
      var next=pct<47?'ai':(pct>53?'web':'neutral');
      var s=stateFor(section);
      window.clearTimeout(s.leaveTimer);
      if(section.getAttribute('data-focus')!==next){
        section.setAttribute('data-focus',next);
        scheduleDesktopFit(section);
      }
      section.style.setProperty('--tw-pointer-x',(x/rect.width*100).toFixed(2)+'%');
      section.style.setProperty('--tw-pointer-y',(y/rect.height*100).toFixed(2)+'%');
      if(next==='ai'||next==='web'){
        s.targetLightX=clamp(((x/rect.width)-.5)*2,-1,1)*4.5;
        s.targetLightY=clamp(((y/rect.height)-.5)*2,-1,1)*2.6;
        scheduleLight(section);
      }else neutralLight(section);
    },{passive:true});

    viewport.addEventListener('pointerleave',function(){
      if(mobileQuery.matches||!finePointer.matches)return;
      var s=stateFor(section);
      window.clearTimeout(s.leaveTimer);
      neutralLight(section);
      s.leaveTimer=window.setTimeout(function(){
        section.setAttribute('data-focus','neutral');
        scheduleDesktopFit(section);
      },170);
    },{passive:true});

    section.addEventListener('focusin',function(event){
      if(mobileQuery.matches)return;
      if(ai.contains(event.target))section.setAttribute('data-focus','ai');
      if(web.contains(event.target))section.setAttribute('data-focus','web');
      scheduleDesktopFit(section);
    });
    section.addEventListener('focusout',function(){
      if(mobileQuery.matches)return;
      window.requestAnimationFrame(function(){
        if(!section.contains(document.activeElement)){
          section.setAttribute('data-focus','neutral');
          scheduleDesktopFit(section);
        }
      });
    });
  }

  function updateHeaderGuard(section){
    var viewport=section.querySelector('[data-tw-viewport]');
    if(!viewport)return;
    if(mobileQuery.matches&&landscapeQuery.matches&&!reducedMotion.matches){
      viewport.setAttribute('data-header-autohide-guard','two-worlds-r4');
    }else{
      viewport.removeAttribute('data-header-autohide-guard');
    }
  }

  function compose(section,force){
    var s=stateFor(section);
    var w=stageWidthNow();
    var h=stageHeightNow();
    var mobile=mobileQuery.matches;
    var orientation=orientationFor(w,h);

    if(!force&&mobile&&s.viewportWidth&&s.mobile===mobile&&s.orientation===orientation&&Math.abs(w-s.viewportWidth)<WIDTH_RECOMPOSE_DELTA){
      return;
    }

    s.viewportWidth=w;
    s.viewportHeight=h;
    s.orientation=orientation;
    s.mobile=mobile;
    updateHeaderGuard(section);

    if(reducedMotion.matches){
      if(s.raf){window.cancelAnimationFrame(s.raf);s.raf=0;}
      section.setAttribute('data-r4-state','REDUCED');
      section.setAttribute('data-focus','neutral');
      setBothAccessible(section);
      return;
    }

    if(mobile){
      var multiplier=orientation==='landscape'?2.30:2.20;
      setVar(section,'--tw-r4-stage-height',h+'px');
      setVar(section,'--tw-r4-travel-height',Math.round(h*multiplier)+'px');
      if(s.logical==='TRANSITIONING'){
        renderTransition(section,s.t);
      }else if(s.logical==='WEB_LOCKED'){
        writeLocked(section,'WEB_LOCKED');
      }else{
        writeLocked(section,'AI_LOCKED');
      }
    }else{
      if(s.raf){window.cancelAnimationFrame(s.raf);s.raf=0;}
      s.logical='DESKTOP';
      s.t=0;
      section.setAttribute('data-r4-state','DESKTOP');
      section.setAttribute('data-focus','neutral');
      section.removeAttribute('data-r4-direction');
      setBothAccessible(section);
      neutralLight(section);
      scheduleDesktopFit(section);
    }
  }

  function armMoonlight(section){
    var s=stateFor(section);
    if(s.moonlit||reducedMotion.matches)return;
    s.moonlit=true;
    section.setAttribute('data-entry-lit','run');
  }

  function setupMoonlight(section){
    var viewport=section.querySelector('[data-tw-viewport]');
    if(!viewport)return;
    if('IntersectionObserver'in window){
      var observer=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting&&entry.intersectionRatio>=.86){
            armMoonlight(section);
            observer.disconnect();
          }
        });
      },{threshold:[.86]});
      observer.observe(viewport);
    }else{
      var rect=viewport.getBoundingClientRect();
      if(rect.top<window.innerHeight*.7)armMoonlight(section);
    }
  }

  sections.forEach(function(section){
    var s=stateFor(section);
    bindDesktop(section);
    setupMoonlight(section);

    var w=stageWidthNow();
    var h=stageHeightNow();
    s.viewportWidth=w;
    s.viewportHeight=h;
    s.orientation=orientationFor(w,h);
    s.mobile=mobileQuery.matches;
    updateHeaderGuard(section);

    if(reducedMotion.matches){
      compose(section,true);
    }else if(mobileQuery.matches){
      setVar(section,'--tw-r4-stage-height',h+'px');
      setVar(section,'--tw-r4-travel-height',Math.round(h*(s.orientation==='landscape'?2.30:2.20))+'px');
      writeLocked(section,initialMobileState(section));
    }else{
      s.logical='DESKTOP';
      section.setAttribute('data-r4-state','DESKTOP');
      section.setAttribute('data-focus','neutral');
      setBothAccessible(section);
      scheduleDesktopFit(section);
    }
  });

  window.addEventListener('scroll',function(){
    sections.forEach(handleScrollFor);
  },{passive:true});

  function maybeRecompose(){
    sections.forEach(function(section){compose(section,false);});
  }

  window.addEventListener('resize',maybeRecompose,{passive:true});
  window.addEventListener('orientationchange',function(){
    window.setTimeout(function(){
      sections.forEach(function(section){compose(section,true);});
    },80);
  },{passive:true});
  if(window.visualViewport)window.visualViewport.addEventListener('resize',maybeRecompose,{passive:true});

  [mobileQuery,landscapeQuery,reducedMotion].forEach(function(query){
    var handler=function(){sections.forEach(function(section){compose(section,true);});};
    if(typeof query.addEventListener==='function')query.addEventListener('change',handler);
    else if(typeof query.addListener==='function')query.addListener(handler);
  });

  if(document.fonts&&document.fonts.ready){
    document.fonts.ready.then(function(){
      sections.forEach(function(section){
        if(!mobileQuery.matches)scheduleDesktopFit(section);
      });
    });
  }
}());
