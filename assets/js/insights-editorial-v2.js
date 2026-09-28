/* ProAI Expert — Insights Editorial V2 R1
   Small semantic runtime: one-shot entry, chapter state, progress. */
(function(){
  'use strict';
  var root=document.documentElement;
  root.classList.add('insights-v2-js');
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-insights-v2-entry]').forEach(function(el){
    if(reduce){el.classList.add('is-resolved');return;}
    requestAnimationFrame(function(){el.classList.add('is-resolved');});
  });
  var article=document.querySelector('[data-insight-v2-article]');
  if(!article)return;
  var railLinks=[].slice.call(document.querySelectorAll('.insight-v2-rail a[href^="#"]'));
  var sections=railLinks.map(function(a){return document.querySelector(a.getAttribute('href'));}).filter(Boolean);
  if(!sections.length)return;
  var setActive=function(id){
    railLinks.forEach(function(a){a.classList.toggle('is-active',a.getAttribute('href')==='#'+id);});
  };
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      var visible=entries.filter(function(e){return e.isIntersecting;}).sort(function(a,b){return a.boundingClientRect.top-b.boundingClientRect.top;});
      if(visible[0])setActive(visible[0].target.id);
    },{rootMargin:'-18% 0px -68% 0px',threshold:[0,.1,.5]});
    sections.forEach(function(s){io.observe(s);});
  }
  railLinks.forEach(function(a){a.addEventListener('click',function(){setActive(a.getAttribute('href').slice(1));});});
})();