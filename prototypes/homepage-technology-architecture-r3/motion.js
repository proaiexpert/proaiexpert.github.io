(function(){
  'use strict';

  var sections=Array.prototype.slice.call(document.querySelectorAll('[data-tas3]'));
  if(!sections.length)return;

  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)');
  var fine=window.matchMedia&&window.matchMedia('(hover:hover) and (pointer:fine)');

  function controlsOf(object){
    return Array.prototype.slice.call(object.querySelectorAll('[data-family]'));
  }

  function clearActive(object){
    object.removeAttribute('data-active');
    controlsOf(object).forEach(function(control){
      control.setAttribute('aria-pressed','false');
    });
  }

  function setActive(object,family){
    object.setAttribute('data-active',family);
    controlsOf(object).forEach(function(control){
      control.setAttribute('aria-pressed',control.getAttribute('data-family')===family?'true':'false');
    });
  }

  function installInteraction(section){
    var object=section.querySelector('[data-tas3-object]');
    if(!object)return;

    controlsOf(object).forEach(function(control){
      var family=control.getAttribute('data-family');

      control.addEventListener('pointerenter',function(){
        if(fine&&fine.matches)setActive(object,family);
      },{passive:true});

      control.addEventListener('pointerleave',function(){
        if(fine&&fine.matches&&!control.matches(':focus-visible'))clearActive(object);
      },{passive:true});

      control.addEventListener('focus',function(){
        if((fine&&fine.matches)||control.matches(':focus-visible'))setActive(object,family);
      });

      control.addEventListener('blur',function(){
        if(fine&&fine.matches)clearActive(object);
      });

      control.addEventListener('click',function(){
        if(fine&&fine.matches)return;
        var selected=control.getAttribute('aria-pressed')==='true';
        if(selected)clearActive(object);
        else setActive(object,family);
      });
    });
  }

  function resolve(section){
    if(section.dataset.tas3Resolved==='true')return;
    section.dataset.tas3Resolved='true';

    if(reduced&&reduced.matches)return;

    section.classList.add('is-resolving');
    window.setTimeout(function(){
      section.classList.remove('is-resolving');
    },2550);
  }

  sections.forEach(installInteraction);

  if(reduced&&reduced.matches){
    sections.forEach(function(section){
      section.dataset.tas3Resolved='true';
    });
    return;
  }

  if(!('IntersectionObserver' in window)){
    sections.forEach(resolve);
    return;
  }

  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting&&entry.intersectionRatio>=0.52){
        var section=entry.target.closest('[data-tas3]');
        if(section)resolve(section);
        observer.unobserve(entry.target);
      }
    });
  },{threshold:[0.38,0.52,0.68]});

  sections.forEach(function(section){
    var object=section.querySelector('[data-tas3-object]');
    if(object)observer.observe(object);
  });
})();