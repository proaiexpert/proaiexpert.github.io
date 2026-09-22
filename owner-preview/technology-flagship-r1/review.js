(function(){
  'use strict';
  var langButtons=[].slice.call(document.querySelectorAll('[data-review-lang]'));
  var stateButtons=[].slice.call(document.querySelectorAll('[data-review-state]'));
  var panes=[].slice.call(document.querySelectorAll('[data-preview-pane]'));

  function activePane(){return document.querySelector('[data-preview-pane]:not([hidden])');}
  function activeSection(){var p=activePane();return p?p.querySelector('[data-home-tech-flagship-r1]'):null;}
  function syncState(){
    var section=activeSection();
    var state=section?section.getAttribute('data-active')||'rest':'rest';
    stateButtons.forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-review-state')===state));});
  }
  function setLang(lang){
    panes.forEach(function(p){p.hidden=p.getAttribute('data-preview-pane')!==lang;});
    langButtons.forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-review-lang')===lang));});
    document.documentElement.lang=lang;
    var section=activeSection();
    var api=window.__PROAI_TECH_FLAGSHIP_R1__;
    if(api&&section)api.settle(section);
    syncState();
  }
  function setState(state){
    var section=activeSection();
    var api=window.__PROAI_TECH_FLAGSHIP_R1__;
    if(!section||!api)return;
    if(state==='rest')api.rest(section);
    else if(section.getAttribute('data-active')!==state)api.select(state,section);
    syncState();
  }
  langButtons.forEach(function(b){b.addEventListener('click',function(){setLang(b.getAttribute('data-review-lang'));});});
  stateButtons.forEach(function(b){b.addEventListener('click',function(){setState(b.getAttribute('data-review-state'));});});
  setLang('en');
}());