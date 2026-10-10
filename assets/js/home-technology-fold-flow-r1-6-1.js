(function(){
'use strict';
var SELECTOR='[data-home-tech-fold-flow]';
var names=['handoff','understand','orchestrate','communicate','deliver','resolved'];
var forward=[.04,.27,.46,.65,.83];
var backward=[.025,.245,.435,.625,.80];
var reduce=matchMedia('(prefers-reduced-motion: reduce)');
var headerGuardMedia=matchMedia('(max-width:1080px) and (orientation:landscape) and (max-height:540px)');
var states=new WeakMap();
var mobileCarrierMedia=matchMedia('(max-width:700px) and (orientation:portrait)');
var R161_MOBILE_PATH='M600 0 C660 36 930 52 1090 83 C1180 103 1165 170 1110 222 C1090 266 1115 304 1110 365 C1090 420 880 459 800 495 C720 540 790 594 600 640';
function setCarrierGeometry(section){
  section.querySelectorAll('.home-tech-ff__carrier path[d]').forEach(function(path){
    if(!path.dataset.r161OriginalD)path.dataset.r161OriginalD=path.getAttribute('d');
    var desired=mobileCarrierMedia.matches?R161_MOBILE_PATH:path.dataset.r161OriginalD;
    if(path.getAttribute('d')!==desired)path.setAttribute('d',desired);
  });
}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function getState(section){var s=states.get(section);if(s)return s;s={progress:0,index:0,raf:0,resizing:0,orientation:innerWidth>innerHeight?'landscape':'portrait'};states.set(section,s);return s}
function setStage(section,index,reason){
  var s=getState(section);index=clamp(index,0,names.length-1);s.index=index;
  var name=names[index];section.setAttribute('data-ff-stage',name);section.setAttribute('data-ff-reason',reason||'scroll');
  section.querySelectorAll('[data-ff-panel]').forEach(function(panel){panel.setAttribute('aria-hidden',String(panel.getAttribute('data-ff-panel')!==name))});
}
function stageFor(section,p){
  var s=getState(section),i=s.index;
  while(i<5&&p>=forward[i])i++;
  while(i>0&&p<backward[i-1])i--;
  return i;
}
function getStickyHeight(section){var sticky=section.querySelector('.home-tech-ff__sticky');var h=sticky?sticky.getBoundingClientRect().height:0;return Math.max(1,h||innerHeight)}
function syncHeaderGuard(section){
  if(headerGuardMedia.matches)section.setAttribute('data-header-autohide-guard','technology-landscape');
  else section.removeAttribute('data-header-autohide-guard');
}
function getFoldEntry(section){var raw=parseFloat(getComputedStyle(section).getPropertyValue('--ff-fold-entry'));return isFinite(raw)&&raw>14?raw:88}
function ease(t){t=clamp(t,0,1);return t*t*(3-2*t)}
/* A single scroll sample drives impulse arrival, surface response and conceptual result.
   No timers, no fake live telemetry. Backscroll reverses this exact phase. */
function heldTravel(section,p,index){
 var points=[0,.04,.27,.46,.65,.83,1],travel=[0,.12,.37,.57,.77,.93,1];
 var k=clamp(index,0,5),a=points[k],b=points[k+1],t=clamp((p-a)/Math.max(.001,b-a),0,1);
 var move=ease(clamp((t-.28)/.42,0,1));
 var val=travel[k]+(travel[k+1]-travel[k])*move;
 var phase=t<.28?'entry':t<.70?'active':t<.76?'settling':'complete';
 var done=k>=1&&k<=4&&t>=.76;
 section.setAttribute('data-ff-motion',t<.28?'hold':t<.70?'transition':k===5?'release':'hold');
 section.setAttribute('data-ff-phase',phase);
 section.setAttribute('data-ff-outcome',done?'established':'pending');
 section.style.setProperty('--r161-illumination',(phase==='active'?Math.sin(Math.PI*move):0).toFixed(3));
 return {travel:clamp(val,0,1),phase,done,t};
}
function updateVisual(section,p){
  var s=getState(section);s.progress=p;
  var index=stageFor(section,p);
  var material=heldTravel(section,p,index);
  var entry=getFoldEntry(section),foldWidth=entry-((entry-14)*clamp(p/.13,0,1));
  section.style.setProperty('--ff-fold-width',foldWidth.toFixed(2)+'px');
  section.style.setProperty('--ff-progress',p.toFixed(4));
  section.setAttribute('data-ff-entry-ready',String(p<forward[0]));
  var path=section.querySelector('[data-ff-path]');
  var trail=section.querySelector('[data-ff-trail]');
  var wake=section.querySelector('[data-ff-wake]');
  var impulse=section.querySelector('[data-ff-impulse]');
  var specular=section.querySelector('[data-r161-specular]');
  if(path&&trail&&impulse){
    var travel=material.travel;
    if(specular){specular.style.strokeDasharray='.038 1';specular.style.strokeDashoffset=(-clamp(travel-.019,0,1)).toFixed(4)}
    trail.style.strokeDasharray=travel.toFixed(4)+' 1';
    if(wake){
      var wakeLen=.075,start=Math.max(0,travel-wakeLen);
      wake.style.strokeDasharray=Math.min(wakeLen,travel).toFixed(4)+' 1';
      wake.style.strokeDashoffset=(-start).toFixed(4);
      wake.style.opacity=travel>0&&p<.97?'.72':'0';
    }
    var total=path.getTotalLength();
    var len=total*(.01+.975*travel);
    var p1=path.getPointAtLength(len);
    var p0=path.getPointAtLength(Math.max(0,len-2));
    var angle=Math.atan2(p1.y-p0.y,p1.x-p0.x)*180/Math.PI;
    impulse.setAttribute('transform','translate('+p1.x.toFixed(2)+' '+p1.y.toFixed(2)+') rotate('+angle.toFixed(2)+')');
    impulse.style.opacity=p>.975?'0':material.phase==='active'?'1':material.phase==='settling'?'.6':'.32';
  }
  setStage(section,index,'scroll');
}
function calcProgress(section){
  var story=section.querySelector('[data-ff-story]');if(!story)return 0;
  var r=story.getBoundingClientRect();
  var travel=Math.max(1,r.height-getStickyHeight(section));
  return clamp(-r.top/travel,0,1);
}
function schedule(section){
  var s=getState(section);if(s.raf)return;
  s.raf=requestAnimationFrame(function(){s.raf=0;if(!reduce.matches&&section.dataset.r161PreviewFreeze!=='true')updateVisual(section,calcProgress(section))});
}
function preserveOnResize(section){
  syncHeaderGuard(section);
  setCarrierGeometry(section);
  var s=getState(section);
  clearTimeout(s.resizing);
  var keep=s.progress;
  s.resizing=setTimeout(function(){
    var story=section.querySelector('[data-ff-story]');if(!story||reduce.matches)return;
    var nextOrientation=innerWidth>innerHeight?'landscape':'portrait';
    var r=story.getBoundingClientRect(),active=keep>.001&&keep<.999;
    s.orientation=nextOrientation;
    if(active){
      var top=scrollY+r.top;
      var travel=Math.max(1,r.height-getStickyHeight(section));
      scrollTo({top:top+travel*keep,behavior:'auto'});
    }
    updateVisual(section,calcProgress(section));
  },90);
}
function init(section){
  var s=getState(section);
  syncHeaderGuard(section);
  setCarrierGeometry(section);
  headerGuardMedia.addEventListener&&headerGuardMedia.addEventListener('change',function(){syncHeaderGuard(section)});
  if(reduce.matches){section.setAttribute('data-ff-stage','all');section.setAttribute('data-ff-reason','reduced');return}
  section.classList.add('is-enhanced');
  updateVisual(section,calcProgress(section));
  addEventListener('scroll',function(){schedule(section)},{passive:true});
  addEventListener('resize',function(){preserveOnResize(section)},{passive:true});
  if(window.visualViewport)visualViewport.addEventListener('resize',function(){preserveOnResize(section)},{passive:true});
  if(section.hasAttribute('data-r161')&&section.closest('[data-r161-preview]')){
    var forced=new URLSearchParams(location.search).get('state');var index=names.indexOf(forced);
    if(index>=0){updateVisual(section,[0,.245,.425,.614,.794,.94][index]);section.dataset.r161PreviewFreeze='true';
      addEventListener('wheel',function(){section.dataset.r161PreviewFreeze='false'},{once:true,passive:true});
      addEventListener('touchstart',function(){section.dataset.r161PreviewFreeze='false'},{once:true,passive:true});
    }
  }
  reduce.addEventListener&&reduce.addEventListener('change',function(){location.reload()});
}
function boot(){document.querySelectorAll(SELECTOR).forEach(init)}
window.__PROAI_FOLD_FLOW_R161__={
  setStage:function(section,name){var i=names.indexOf(name);if(i>=0)setStage(section,i,'debug')},
  setProgress:function(section,p){updateVisual(section,clamp(Number(p)||0,0,1))},
  stages:names.slice()
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
}());