(function(){
  'use strict';
  var sections=Array.prototype.slice.call(document.querySelectorAll('[data-taa]'));
  if(!sections.length)return;
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)');
  var fine=window.matchMedia&&window.matchMedia('(hover:hover) and (pointer:fine)');

  function clearActive(object){
    object.removeAttribute('data-active');
    Array.prototype.forEach.call(object.querySelectorAll('[data-family]'),function(control){control.setAttribute('aria-pressed','false');});
  }
  function setActive(object,family){
    object.setAttribute('data-active',family);
    Array.prototype.forEach.call(object.querySelectorAll('[data-family]'),function(control){control.setAttribute('aria-pressed',control.getAttribute('data-family')===family?'true':'false');});
  }
  function install(section){
    var object=section.querySelector('[data-taa-object]');
    if(!object)return;
    Array.prototype.forEach.call(object.querySelectorAll('[data-family]'),function(control){
      var family=control.getAttribute('data-family');
      control.addEventListener('pointerenter',function(){if(fine&&fine.matches)setActive(object,family);},{passive:true});
      control.addEventListener('pointerleave',function(){if(fine&&fine.matches&&!control.matches(':focus-visible'))clearActive(object);},{passive:true});
      control.addEventListener('focus',function(){if((fine&&fine.matches)||control.matches(':focus-visible'))setActive(object,family);});
      control.addEventListener('blur',function(){if(fine&&fine.matches)clearActive(object);});
      control.addEventListener('click',function(){
        if(fine&&fine.matches)return;
        var active=control.getAttribute('aria-pressed')==='true';
        if(active)clearActive(object);else setActive(object,family);
      });
    });
  }
  function compose(section){
    if(section.dataset.taaComposed==='true')return;
    section.dataset.taaComposed='true';
    if(reduced&&reduced.matches)return;
    section.classList.add('is-composing');
    window.setTimeout(function(){section.classList.remove('is-composing');},2580);
  }
  sections.forEach(install);
  if(reduced&&reduced.matches){sections.forEach(function(section){section.dataset.taaComposed='true';});return;}
  if(!('IntersectionObserver'in window)){sections.forEach(compose);return;}
  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting&&entry.intersectionRatio>=0.58){
        var section=entry.target.closest('[data-taa]');
        if(section)compose(section);
        observer.unobserve(entry.target);
      }
    });
  },{threshold:[0.45,0.58,0.72]});
  sections.forEach(function(section){
    var object=section.querySelector('[data-taa-object]');
    if(object)observer.observe(object);
  });
})();
