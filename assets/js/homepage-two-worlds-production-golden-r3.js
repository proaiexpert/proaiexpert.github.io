/* ProAI Expert — Two Worlds Production Golden R3
   Production Golden R1 is the motion/visual donor.
   R2/R2.1 contributes only viewport/orientation preservation + one-shot light.
   No R2 mobile geometry is imported. */
(function () {
  'use strict';

  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-tw-r3]'));
  if (!sections.length) return;

  var finePointer = window.matchMedia('(hover:hover) and (pointer:fine)');
  var mobileQuery = window.matchMedia('(max-width:980px), ((hover:none) and (pointer:coarse))');
  var landscapeQuery = window.matchMedia('(orientation:landscape) and (max-height:540px) and (max-width:980px) and (hover:none) and (pointer:coarse)');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var states = new WeakMap();
  var meters = new Map();
  var scrollRaf = 0;
  var resizeTimer = 0;
  var HOLD_START = 0.18;
  var HOLD_END = 0.82;

  function clamp(v,min,max) { return Math.max(min,Math.min(max,v)); }
  function smoothstep(v) { v=clamp(v,0,1); return v*v*(3-(2*v)); }
  function smootherstep(v) { v=clamp(v,0,1); return v*v*v*(v*(v*6-15)+10); }
  function mix(a,b,t) { return a+((b-a)*t); }

  function stateFor(section) {
    var s=states.get(section);
    if (s) return s;
    s={
      raw:0,
      progress:0,
      suspendScroll:false,
      viewportWidth:0,
      viewportHeight:0,
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

  function mobileMode() {
    return !reducedMotion.matches && mobileQuery.matches;
  }

  function sectionEngaged(section) {
    var experience=section.querySelector('[data-tw-experience]');
    var viewport=section.querySelector('[data-tw-viewport]');
    if (!experience || !viewport) return false;
    var vr=viewport.getBoundingClientRect();
    var vh=Math.max(1,vr.height||viewport.offsetHeight||window.innerHeight);
    var er=experience.getBoundingClientRect();
    return er.top<=2 && er.bottom>=vh-2;
  }

  function scrollRaw(section) {
    var experience=section.querySelector('[data-tw-experience]');
    var viewport=section.querySelector('[data-tw-viewport]');
    if (!experience || !viewport) return stateFor(section).raw;
    var vh=Math.max(1,viewport.getBoundingClientRect().height||viewport.offsetHeight||window.innerHeight);
    var travel=Math.max(1,experience.offsetHeight-vh);
    var rect=experience.getBoundingClientRect();
    var absoluteTop=rect.top+window.scrollY;
    return clamp((window.scrollY-absoluteTop)/travel,0,1);
  }

  function alignScrollToRaw(section,raw) {
    var experience=section.querySelector('[data-tw-experience]');
    var viewport=section.querySelector('[data-tw-viewport]');
    if (!experience || !viewport) return;
    var vh=Math.max(1,viewport.getBoundingClientRect().height||viewport.offsetHeight||window.innerHeight);
    var travel=Math.max(1,experience.offsetHeight-vh);
    var rect=experience.getBoundingClientRect();
    var absoluteTop=rect.top+window.scrollY;
    window.scrollTo(0,absoluteTop+(travel*clamp(raw,0,1)));
  }

  function turnProgress(raw) {
    if (raw<=HOLD_START) return 0;
    if (raw>=HOLD_END) return 1;
    return smootherstep((raw-HOLD_START)/(HOLD_END-HOLD_START));
  }

  function fadeOut(p,start,end) {
    return 1-smoothstep((p-start)/(end-start));
  }

  function fadeIn(p,start,end) {
    return smoothstep((p-start)/(end-start));
  }

  function setMobileState(section,raw) {
    var s=stateFor(section);
    raw=clamp(raw,0,1);
    var p=turnProgress(raw);
    s.raw=raw;
    s.progress=p;

    /* Shared hinge projection. Both faces use the same moving edge:
       face width 104%, origin starts at viewport x=102%, ends at x=-2%. */
    var boundary=102-(104*p);
    var sharedZ=-96*Math.sin(Math.PI*p);
    var foldOpacity=Math.pow(Math.sin(Math.PI*p),.62);
    var foldRy=mix(-3,3,p);

    section.style.setProperty('--tw-r3-ai-x',(-100*p).toFixed(3)+'%');
    section.style.setProperty('--tw-r3-web-x',(100*(1-p)).toFixed(3)+'%');
    section.style.setProperty('--tw-r3-ai-ry',(-3-(69*p)).toFixed(3)+'deg');
    section.style.setProperty('--tw-r3-web-ry',(72-(69*p)).toFixed(3)+'deg');
    section.style.setProperty('--tw-r3-shared-z',sharedZ.toFixed(2)+'px');
    section.style.setProperty('--tw-r3-fold-x',boundary.toFixed(3)+'%');
    section.style.setProperty('--tw-r3-fold-ry',foldRy.toFixed(3)+'deg');
    section.style.setProperty('--tw-r3-fold-opacity',clamp(foldOpacity,0,1).toFixed(3));

    var aiContent=fadeOut(p,.18,.56);
    var webContent=fadeIn(p,.44,.82);
    var aiWord=fadeOut(p,.22,.54)*.92;
    var webWord=fadeIn(p,.46,.78)*.92;
    var intro=1-(.66*smoothstep((p-.52)/.36));

    section.style.setProperty('--tw-r3-ai-content-opacity',clamp(aiContent,0,1).toFixed(3));
    section.style.setProperty('--tw-r3-web-content-opacity',clamp(webContent,0,1).toFixed(3));
    section.style.setProperty('--tw-r3-ai-word-opacity',clamp(aiWord,0,.92).toFixed(3));
    section.style.setProperty('--tw-r3-web-word-opacity',clamp(webWord,0,.92).toFixed(3));
    section.style.setProperty('--tw-r3-intro-opacity',clamp(intro,.34,1).toFixed(3));

    section.setAttribute('data-r3-raw',raw.toFixed(4));
    section.setAttribute('data-r3-progress',p.toFixed(4));

    var next=raw<=HOLD_START ? 'ai' : (raw>=HOLD_END ? 'web' : 'turn');
    if (section.getAttribute('data-focus')!==next) {
      section.setAttribute('data-focus',next);
      scheduleFit(section);
    }
  }

  function updateMobile(section) {
    var s=stateFor(section);
    if (!mobileMode() || s.suspendScroll) return;
    setMobileState(section,scrollRaw(section));
  }

  function meterWidth(inscription) {
    var style=window.getComputedStyle(inscription);
    var key=inscription.textContent+'|'+style.fontFamily+'|'+style.fontWeight+'|'+style.letterSpacing;
    if (meters.has(key)) return meters.get(key);
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

  function desktopTerritory(focus,world) {
    if (focus==='ai') return world==='ai' ? {start:0,end:.72,target:.73} : {start:.692,end:1,target:.72};
    if (focus==='web') return world==='web' ? {start:.28,end:1,target:.73} : {start:0,end:.308,target:.72};
    return world==='ai' ? {start:0,end:.515,target:.73} : {start:.485,end:1,target:.73};
  }

  function fitInscription(section,world) {
    var viewport=section.querySelector('[data-tw-viewport]');
    var face=section.querySelector('[data-tw-world="'+world+'"]');
    var inscription=section.querySelector('.tw-r2__inscription--'+world);
    if (!viewport || !face || !inscription || !face.offsetWidth) return;
    var vr=viewport.getBoundingClientRect();
    if (!vr.width) return;

    var focus=section.getAttribute('data-focus')||'neutral';
    var targetCenter,targetWidth,limits;

    if (mobileQuery.matches) {
      if (focus!==world) return;
      var ratio=landscapeQuery.matches ? .75 : .72;
      targetCenter=vr.left+(vr.width/2);
      targetWidth=vr.width*ratio;
      limits=[32,132];
    } else {
      var territory=desktopTerritory(focus,world);
      var territoryTarget=window.innerWidth<=1200 ? Math.min(.79,territory.target+.06) : territory.target;
      targetCenter=vr.left+(vr.width*((territory.start+territory.end)/2));
      targetWidth=vr.width*(territory.end-territory.start)*territoryTarget;
      limits=[48,220];
    }

    var measured=meterWidth(inscription);
    var visualScale=clamp(face.getBoundingClientRect().width/face.offsetWidth,.58,1.18);
    var size=clamp((100*targetWidth/measured)/visualScale,limits[0],limits[1]);
    var localCenter=(targetCenter-vr.left)-face.offsetLeft;

    inscription.style.setProperty('--tw-g-inscription-center',localCenter.toFixed(2)+'px');
    inscription.style.setProperty('--tw-g-inscription-size',size.toFixed(2)+'px');

    var ir=inscription.getBoundingClientRect();
    if (ir.width>1) {
      size=clamp(size*targetWidth/ir.width,limits[0],limits[1]);
      inscription.style.setProperty('--tw-g-inscription-size',size.toFixed(2)+'px');
      ir=inscription.getBoundingClientRect();
    }
    if (ir.width>1) {
      visualScale=clamp(face.getBoundingClientRect().width/face.offsetWidth,.58,1.18);
      localCenter+=clamp((targetCenter-(ir.left+(ir.width/2)))/visualScale,-28,28);
      inscription.style.setProperty('--tw-g-inscription-center',localCenter.toFixed(2)+'px');
      ir=inscription.getBoundingClientRect();
    }
    inscription.setAttribute('data-golden-rendered-width',Math.round(ir.width)+'px');
    inscription.setAttribute('data-golden-center-error',((ir.left+(ir.width/2))-targetCenter).toFixed(2)+'px');
  }

  function fitSection(section) {
    fitInscription(section,'ai');
    fitInscription(section,'web');
  }

  function scheduleFit(section) {
    var s=stateFor(section);
    if (s.fitRaf) return;
    s.fitRaf=window.requestAnimationFrame(function () {
      s.fitRaf=0;
      window.requestAnimationFrame(function () { fitSection(section); });
    });
  }

  function setLight(section,x,y) {
    section.style.setProperty('--tw-g-light-x',x.toFixed(3)+'%');
    section.style.setProperty('--tw-g-light-y',y.toFixed(3)+'%');
  }

  function runLight(section) {
    var s=stateFor(section);
    s.lightRaf=0;
    if (reducedMotion.matches || mobileQuery.matches || !finePointer.matches) {
      s.currentLightX=s.currentLightY=s.targetLightX=s.targetLightY=0;
      setLight(section,0,0);
      return;
    }
    s.currentLightX+=(s.targetLightX-s.currentLightX)*.075;
    s.currentLightY+=(s.targetLightY-s.currentLightY)*.075;
    if (Math.abs(s.targetLightX-s.currentLightX)<.006) s.currentLightX=s.targetLightX;
    if (Math.abs(s.targetLightY-s.currentLightY)<.006) s.currentLightY=s.targetLightY;
    setLight(section,s.currentLightX,s.currentLightY);
    if (s.currentLightX!==s.targetLightX || s.currentLightY!==s.targetLightY) {
      s.lightRaf=window.requestAnimationFrame(function () { runLight(section); });
    }
  }

  function scheduleLight(section) {
    var s=stateFor(section);
    if (!s.lightRaf) s.lightRaf=window.requestAnimationFrame(function () { runLight(section); });
  }

  function neutralLight(section) {
    var s=stateFor(section);
    s.targetLightX=0;
    s.targetLightY=0;
    scheduleLight(section);
  }

  function updateHeaderGuard(section) {
    var viewport=section.querySelector('[data-tw-viewport]');
    if (!viewport) return;
    if (landscapeQuery.matches && !reducedMotion.matches) {
      viewport.setAttribute('data-header-autohide-guard','two-worlds-r3');
    } else {
      viewport.removeAttribute('data-header-autohide-guard');
    }
  }

  function triggerEntryLight(section) {
    var s=stateFor(section);
    if (s.entered || reducedMotion.matches) return;
    s.entered=true;
    section.setAttribute('data-entry-lit','run');
    window.setTimeout(function () {
      section.setAttribute('data-entry-lit','done');
    },1550);
  }

  function syncGeometry(section,preserve) {
    var s=stateFor(section);
    var viewport=section.querySelector('[data-tw-viewport]');
    if (!viewport) return;
    var vr=viewport.getBoundingClientRect();
    var oldH=s.viewportHeight;
    s.viewportWidth=Math.max(1,vr.width||viewport.offsetWidth||window.innerWidth);
    s.viewportHeight=Math.max(1,vr.height||viewport.offsetHeight||window.innerHeight);
    updateHeaderGuard(section);

    if (reducedMotion.matches) {
      section.setAttribute('data-focus','neutral');
      section.style.removeProperty('--tw-r3-intro-opacity');
      scheduleFit(section);
      return;
    }

    if (mobileQuery.matches) {
      var keep=preserve && sectionEngaged(section);
      var raw=keep ? s.raw : scrollRaw(section);
      if (keep) {
        s.suspendScroll=true;
        setMobileState(section,raw);
        window.requestAnimationFrame(function () {
          alignScrollToRaw(section,raw);
          window.requestAnimationFrame(function () {
            s.suspendScroll=false;
            setMobileState(section,raw);
          });
        });
      } else {
        setMobileState(section,raw);
      }
      neutralLight(section);
    } else {
      section.setAttribute('data-focus','neutral');
      section.removeAttribute('data-r3-raw');
      section.removeAttribute('data-r3-progress');
      section.style.setProperty('--tw-r3-intro-opacity','1');
      neutralLight(section);
    }

    if (!oldH || Math.abs(oldH-s.viewportHeight)>4) scheduleFit(section);
    else scheduleFit(section);
  }

  function bindSection(section) {
    var viewport=section.querySelector('[data-tw-viewport]');
    var aiWorld=section.querySelector('[data-tw-world="ai"]');
    var webWorld=section.querySelector('[data-tw-world="web"]');
    if (!viewport || !aiWorld || !webWorld) return;
    stateFor(section);

    viewport.addEventListener('pointermove',function (event) {
      if (!finePointer.matches || mobileQuery.matches || reducedMotion.matches) return;
      var rect=viewport.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var x=clamp(event.clientX-rect.left,0,rect.width);
      var y=clamp(event.clientY-rect.top,0,rect.height);
      var percent=x/rect.width*100;
      var next=percent<47 ? 'ai' : (percent>53 ? 'web' : 'neutral');
      window.clearTimeout(stateFor(section).leaveTimer);
      if (section.getAttribute('data-focus')!==next) {
        section.setAttribute('data-focus',next);
        scheduleFit(section);
      }
      section.style.setProperty('--tw-pointer-x',(x/rect.width*100).toFixed(2)+'%');
      section.style.setProperty('--tw-pointer-y',(y/rect.height*100).toFixed(2)+'%');

      if (next==='ai' || next==='web') {
        var s=stateFor(section);
        s.targetLightX=clamp(((x/rect.width)-.5)*2,-1,1)*4.5;
        s.targetLightY=clamp(((y/rect.height)-.5)*2,-1,1)*2.6;
        scheduleLight(section);
      } else neutralLight(section);
    },{passive:true});

    viewport.addEventListener('pointerleave',function () {
      if (!finePointer.matches || mobileQuery.matches || reducedMotion.matches) return;
      var s=stateFor(section);
      window.clearTimeout(s.leaveTimer);
      neutralLight(section);
      s.leaveTimer=window.setTimeout(function () {
        section.setAttribute('data-focus','neutral');
        scheduleFit(section);
      },170);
    },{passive:true});

    section.addEventListener('focusin',function (event) {
      if (mobileQuery.matches || reducedMotion.matches) return;
      if (aiWorld.contains(event.target)) section.setAttribute('data-focus','ai');
      if (webWorld.contains(event.target)) section.setAttribute('data-focus','web');
      scheduleFit(section);
    });

    section.addEventListener('focusout',function () {
      if (mobileQuery.matches || reducedMotion.matches) return;
      window.requestAnimationFrame(function () {
        if (!section.contains(document.activeElement)) {
          section.setAttribute('data-focus','neutral');
          scheduleFit(section);
        }
      });
    });

    if ('IntersectionObserver' in window) {
      var io=new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio>.30) {
            triggerEntryLight(section);
            io.unobserve(section);
          }
        });
      },{threshold:[.30,.5]});
      io.observe(section);
    } else {
      triggerEntryLight(section);
    }

    syncGeometry(section,false);
  }

  sections.forEach(bindSection);

  function runScroll() {
    scrollRaf=0;
    sections.forEach(updateMobile);
  }
  function scheduleScroll() {
    if (!scrollRaf) scrollRaf=window.requestAnimationFrame(runScroll);
  }

  function scheduleGeometryPreserve() {
    window.clearTimeout(resizeTimer);
    resizeTimer=window.setTimeout(function () {
      sections.forEach(function (section) { syncGeometry(section,true); });
      scheduleScroll();
    },90);
  }

  window.addEventListener('scroll',scheduleScroll,{passive:true});
  window.addEventListener('resize',scheduleGeometryPreserve,{passive:true});
  window.addEventListener('orientationchange',function () {
    window.setTimeout(scheduleGeometryPreserve,120);
  },{passive:true});
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize',scheduleGeometryPreserve,{passive:true});
  }

  [finePointer,mobileQuery,landscapeQuery,reducedMotion].forEach(function (query) {
    var handler=function () {
      sections.forEach(function (section) { syncGeometry(section,true); });
      scheduleScroll();
    };
    if (typeof query.addEventListener==='function') query.addEventListener('change',handler);
    else if (typeof query.addListener==='function') query.addListener(handler);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      sections.forEach(function (section) { scheduleFit(section); });
    });
  }

  window.addEventListener('pageshow',function () {
    sections.forEach(function (section) { syncGeometry(section,true); });
    scheduleScroll();
  },{passive:true});
}());
