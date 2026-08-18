(function(){
'use strict';
var sections=Array.prototype.slice.call(document.querySelectorAll('[data-tw-r2]'));
if(!sections.length)return;
var fine=window.matchMedia('(hover: hover) and (pointer: fine)');
var mobile=window.matchMedia('(max-width: 980px), ((hover: none) and (pointer: coarse))');
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
var states=new WeakMap();
var scrollRaf=0;
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function smooth01(t){t=clamp(t,0,1);return t*t*(3-2*t);}
function fadeOut(p,a,b){return 1-smooth01((p-a)/(b-a));}
function fadeIn(p,a,b){return smooth01((p-a)/(b-a));}
function isLandscape(){return innerWidth>innerHeight&&innerHeight<=540;}
function stateFor(section){var s=states.get(section);if(s)return s;s={progress:0,focus:'neutral',lightX:0,lightY:0,targetX:0,targetY:0,lightRaf:0,fitRaf:0};states.set(section,s);return s;}
function textWidth(node){var cs=getComputedStyle(node),m=document.createElement('span');m.textContent=node.textContent.trim();m.style.cssText='position:fixed;left:-10000px;top:-10000px;visibility:hidden;white-space:nowrap;font-family:'+cs.fontFamily+';font-weight:'+cs.fontWeight+';font-size:100px;letter-spacing:'+cs.letterSpacing+';line-height:1';document.body.appendChild(m);var w=Math.max(1,m.getBoundingClientRect().width);m.remove();return w;}
function fitInscriptions(section){var vp=section.querySelector('[data-tw-viewport]');if(!vp)return;var vw=vp.clientWidth;if(!vw)return;var focus=section.getAttribute('data-focus')||'neutral';['ai','web'].forEach(function(world){var n=section.querySelector('.tw-r2__inscription--'+world);if(!n)return;var ratio;if(mobile.matches){ratio=isLandscape()?.60:.66;}else{var active=focus===world;ratio=active?.73:.73;var territory=focus==='neutral'?.515:(active?.72:.308);ratio*=territory;}var target=vw*ratio;var measured=textWidth(n);var limit=mobile.matches?(isLandscape()?[30,132]:[32,132]):[56,190];var size=clamp(100*target/measured,limit[0],limit[1]);n.style.setProperty('--tw-r25-inscription-size',size.toFixed(2)+'px');n.style.setProperty('--tw-r25-inscription-center','50%');});}
function scheduleFit(section){var s=stateFor(section);if(s.fitRaf)return;s.fitRaf=requestAnimationFrame(function(){s.fitRaf=0;fitInscriptions(section);});}
function setFocus(section,next){var s=stateFor(section);if(s.focus===next)return;s.focus=next;section.setAttribute('data-focus',next);scheduleFit(section);}
function setLight(section,x,y){section.style.setProperty('--tw-r25-light-x',x.toFixed(3)+'%');section.style.setProperty('--tw-r25-light-y',y.toFixed(3)+'%');}
function runLight(section){var s=stateFor(section);s.lightRaf=0;if(reduced.matches||mobile.matches||!fine.matches){s.lightX=s.lightY=s.targetX=s.targetY=0;setLight(section,0,0);return;}s.lightX+=(s.targetX-s.lightX)*.075;s.lightY+=(s.targetY-s.lightY)*.075;if(Math.abs(s.targetX-s.lightX)<.006)s.lightX=s.targetX;if(Math.abs(s.targetY-s.lightY)<.006)s.lightY=s.targetY;setLight(section,s.lightX,s.lightY);if(s.lightX!==s.targetX||s.lightY!==s.targetY)s.lightRaf=requestAnimationFrame(function(){runLight(section);});}
function scheduleLight(section){var s=stateFor(section);if(!s.lightRaf)s.lightRaf=requestAnimationFrame(function(){runLight(section);});}
function applyMobile(section,p){var s=stateFor(section);p=clamp(p,0,1);s.progress=p;
  var aiX=-82*p,aiRy=-3-69*p,aiZ=-110*p,webX=82*(1-p),webRy=72-69*p,webZ=-110*(1-p),foldX=105-110*p;
  section.style.setProperty('--tw-mobile-ai-x',aiX.toFixed(2)+'%');section.style.setProperty('--tw-mobile-ai-ry',aiRy.toFixed(2)+'deg');section.style.setProperty('--tw-mobile-ai-z',aiZ.toFixed(2)+'px');
  section.style.setProperty('--tw-mobile-web-x',webX.toFixed(2)+'%');section.style.setProperty('--tw-mobile-web-ry',webRy.toFixed(2)+'deg');section.style.setProperty('--tw-mobile-web-z',webZ.toFixed(2)+'px');section.style.setProperty('--tw-mobile-fold-x',foldX.toFixed(2)+'%');section.style.setProperty('--tw-mobile-progress',p.toFixed(4));
  var aiContent=p<=.12?1:(p>=.24?0:fadeOut(p,.12,.24));
  var webContent=p<=.76?0:(p>=.90?1:fadeIn(p,.76,.90));
  var aiEngrave=p<=.10?1:(p>=.22?0:fadeOut(p,.10,.22));
  var webEngrave=p<=.78?0:(p>=.92?1:fadeIn(p,.78,.92));
  section.style.setProperty('--tw-r25-ai-content',aiContent.toFixed(4));section.style.setProperty('--tw-r25-web-content',webContent.toFixed(4));
  section.style.setProperty('--tw-r25-ai-engrave',aiEngrave.toFixed(4));section.style.setProperty('--tw-r25-web-engrave',webEngrave.toFixed(4));
  section.style.setProperty('--tw-r25-ai-y',((1-aiContent)*-7).toFixed(2)+'px');section.style.setProperty('--tw-r25-web-y',((1-webContent)*7).toFixed(2)+'px');
  var center=1-Math.min(1,Math.abs(p-.5)/.5);var turn=smooth01(clamp((center-.25)/.75,0,1));
  var aiAlloy=.34+.14*(1-p)+.14*turn,webAlloy=.28+.18*p+.16*turn;
  section.style.setProperty('--tw-r25-ai-alloy',clamp(aiAlloy,.28,.54).toFixed(3));section.style.setProperty('--tw-r25-web-alloy',clamp(webAlloy,.24,.54).toFixed(3));section.style.setProperty('--tw-r25-fold-alloy',(.88+.12*turn).toFixed(3));
  var next=p<.30?'ai':(p>.70?'web':'turn');setFocus(section,next);
}
function updateMobile(section){if(!mobile.matches||reduced.matches)return;var exp=section.querySelector('[data-tw-experience]');if(!exp)return;var r=exp.getBoundingClientRect(),top=r.top+scrollY,travel=Math.max(1,exp.offsetHeight-innerHeight),delta=scrollY-top,p=clamp(delta/travel,0,1);section.setAttribute('data-r25-pin',delta<0?'before':(delta>travel?'after':'active'));applyMobile(section,p);}
function scrollFrame(){scrollRaf=0;sections.forEach(updateMobile);}
function scheduleScroll(){if(!scrollRaf)scrollRaf=requestAnimationFrame(scrollFrame);}
sections.forEach(function(section){var vp=section.querySelector('[data-tw-viewport]'),ai=section.querySelector('[data-tw-world="ai"]'),web=section.querySelector('[data-tw-world="web"]');if(!vp||!ai||!web)return;var leaveTimer=0;stateFor(section);
  vp.addEventListener('pointermove',function(e){if(!fine.matches||mobile.matches)return;var r=vp.getBoundingClientRect(),x=clamp(e.clientX-r.left,0,r.width),y=clamp(e.clientY-r.top,0,r.height),pct=x/r.width*100;clearTimeout(leaveTimer);setFocus(section,pct<47?'ai':(pct>53?'web':'neutral'));var s=stateFor(section),nx=clamp((x/r.width-.5)*2,-1,1),ny=clamp((y/r.height-.5)*2,-1,1);if(s.focus==='ai'||s.focus==='web'){s.targetX=nx*4.5;s.targetY=ny*2.6;}else{s.targetX=s.targetY=0;}scheduleLight(section);},{passive:true});
  vp.addEventListener('pointerleave',function(){if(!fine.matches||mobile.matches)return;clearTimeout(leaveTimer);leaveTimer=setTimeout(function(){setFocus(section,'neutral');var s=stateFor(section);s.targetX=s.targetY=0;scheduleLight(section);},170);},{passive:true});
  section.addEventListener('focusin',function(e){if(mobile.matches)return;if(ai.contains(e.target))setFocus(section,'ai');else if(web.contains(e.target))setFocus(section,'web');});
  section.addEventListener('focusout',function(){if(mobile.matches)return;requestAnimationFrame(function(){if(!section.contains(document.activeElement))setFocus(section,'neutral');});});
  if('ResizeObserver'in window){new ResizeObserver(function(){scheduleFit(section);}).observe(vp);}scheduleFit(section);
});
function syncMode(){sections.forEach(function(section){if(mobile.matches){if(reduced.matches){setFocus(section,'neutral');section.removeAttribute('data-r25-pin');section.style.removeProperty('--tw-mobile-progress');}else updateMobile(section);}else{setFocus(section,'neutral');section.removeAttribute('data-r25-pin');section.style.removeProperty('--tw-mobile-progress');var s=stateFor(section);s.targetX=s.targetY=0;scheduleLight(section);}scheduleFit(section);});}
window.addEventListener('scroll',scheduleScroll,{passive:true});window.addEventListener('resize',function(){scheduleScroll();sections.forEach(scheduleFit);},{passive:true});
[mobile,fine,reduced].forEach(function(q){if(q.addEventListener)q.addEventListener('change',syncMode);else if(q.addListener)q.addListener(syncMode);});if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){sections.forEach(scheduleFit);});syncMode();
}());
