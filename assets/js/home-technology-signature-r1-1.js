(function(){
  'use strict';

  var SELECTOR='[data-home-tech-signature-r1-1]';
  var FAMILY='[data-tech-family]';
  var mediaReduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)');

  function buttons(section){
    return [].slice.call(section.querySelectorAll(FAMILY));
  }

  function setActive(section,family){
    if(!section)return;
    section.setAttribute('data-active',family||'rest');
    buttons(section).forEach(function(button){
      button.setAttribute('aria-pressed',String((family||'rest')===button.getAttribute('data-tech-family')&&section.dataset.locked==='true'));
    });
  }

  function rest(section){
    if(!section)return;
    section.dataset.locked='false';
    setActive(section,'rest');
  }

  function select(family,section,lock){
    if(!section)return;
    if(lock!==false)section.dataset.locked='true';
    setActive(section,family);
  }

  function settle(section){
    if(!section)return;
    section.classList.remove('is-animated');
    section.classList.add('is-ready','is-settled');
  }

  function prepare(section){
    section.dataset.locked='false';

    buttons(section).forEach(function(button){
      var family=button.getAttribute('data-tech-family');

      button.addEventListener('click',function(){
        var isLocked=section.dataset.locked==='true';
        var isSame=section.getAttribute('data-active')===family;
        if(isLocked&&isSame)rest(section);
        else select(family,section,true);
      });

      button.addEventListener('pointerenter',function(event){
        if(event.pointerType==='touch'||section.dataset.locked==='true')return;
        setActive(section,family);
      });

      button.addEventListener('pointerleave',function(){
        if(section.dataset.locked!=='true')setActive(section,'rest');
      });

      button.addEventListener('focus',function(){
        if(section.dataset.locked!=='true')setActive(section,family);
      });

      button.addEventListener('blur',function(){
        if(section.dataset.locked!=='true')setActive(section,'rest');
      });
    });

    section.addEventListener('keydown',function(event){
      if(event.key==='Escape')rest(section);
    });

    if(mediaReduce&&mediaReduce.matches){
      settle(section);
      return;
    }

    section.classList.add('is-animated');

    if(!('IntersectionObserver' in window)){
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){section.classList.add('is-ready');});
      });
      window.setTimeout(function(){section.classList.add('is-settled');},1900);
      return;
    }

    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting)return;
        observer.unobserve(section);
        requestAnimationFrame(function(){
          requestAnimationFrame(function(){section.classList.add('is-ready');});
        });
        window.setTimeout(function(){section.classList.add('is-settled');},1900);
      });
    },{threshold:.24});

    observer.observe(section);
  }

  function init(){
    [].slice.call(document.querySelectorAll(SELECTOR)).forEach(prepare);
  }

  window.__PROAI_TECH_SIGNATURE_R1_1__={
    rest:rest,
    select:function(family,section){select(family,section,true);},
    settle:settle
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
}());
