(function(){
'use strict';
var SELECTOR='[data-home-tech-fold-flow]';
var names=['handoff','understand','orchestrate','communicate','deliver','resolved'];
var forward=[.04,.27,.46,.65,.83];
var backward=[.025,.245,.435,.625,.80];
var reduce=matchMedia('(prefers-reduced-motion: reduce)');
var states=new WeakMap();
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
function getFoldEntry(section){var raw=parseFloat(getComputedStyle(section).getPropertyValue('--ff-fold-entry'));return isFinite(raw)&&raw>14?raw:88}
function ease(t){t=clamp(t,0,1);return t*t*(3-2*t)}
function heldTravel(section,p){
  var points=[0,.04,.27,.46,.65,.83,1],travel=[0,.12,.37,.57,.77,.93,1];
  var seg=0;while(seg<points.length-2&&p>=points[seg+1])seg++;
  var a=points[seg],b=points[seg+1],t=(p-a)/Math.max(.0001,b-a);
  var start=travel[seg],end=travel[seg+1],phase='hold',v=start;
  if(t>=.56&&t<.86){phase='transition';v=start+(end-start)*ease((t-.56)/.30)}
  else if(t>=.86){phase=seg===points.length-2?'release':'hold';v=end}
  section.setAttribute('data-ff-motion',phase);
  return clamp(v,0,1)
}
function updateVisual(section,p){
  var s=getState(section);s.progress=p;
  var entry=getFoldEntry(section),foldWidth=entry-((entry-14)*clamp(p/.13,0,1));
  section.style.setProperty('--ff-fold-width',foldWidth.toFixed(2)+'px');
  section.style.setProperty('--ff-progress',p.toFixed(4));
  section.setAttribute('data-ff-entry-ready',String(p<forward[0]));
  var path=section.querySelector('[data-ff-path]');
  var trail=section.querySelector('[data-ff-trail]');
  var wake=section.querySelector('[data-ff-wake]');
  var impulse=section.querySelector('[data-ff-impulse]');
  if(path&&trail&&impulse){
    var travel=heldTravel(section,p);
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
    var phase=section.getAttribute('data-ff-motion');
    impulse.style.opacity=(p>.975?'0':phase==='transition'?'1':phase==='release'?'.74':'.62');
  }
  setStage(section,stageFor(section,p),'scroll');
}
function calcProgress(section){
  var story=section.querySelector('[data-ff-story]');if(!story)return 0;
  var r=story.getBoundingClientRect();
  var travel=Math.max(1,r.height-getStickyHeight(section));
  return clamp(-r.top/travel,0,1);
}
function schedule(section){
  var s=getState(section);if(s.raf)return;
  s.raf=requestAnimationFrame(function(){s.raf=0;if(!reduce.matches)updateVisual(section,calcProgress(section))});
}
function preserveOnResize(section){
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
  if(reduce.matches){setStage(section,5,'reduced');section.style.setProperty('--ff-fold-width','14px');return}
  updateVisual(section,calcProgress(section));
  addEventListener('scroll',function(){schedule(section)},{passive:true});
  addEventListener('resize',function(){preserveOnResize(section)},{passive:true});
  if(window.visualViewport)visualViewport.addEventListener('resize',function(){preserveOnResize(section)},{passive:true});
  reduce.addEventListener&&reduce.addEventListener('change',function(){location.reload()});
}
function boot(){document.querySelectorAll(SELECTOR).forEach(init)}
window.__PROAI_FOLD_FLOW_R14__={
  setStage:function(section,name){var i=names.indexOf(name);if(i>=0)setStage(section,i,'debug')},
  setProgress:function(section,p){updateVisual(section,clamp(Number(p)||0,0,1))},
  stages:names.slice()
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
}());