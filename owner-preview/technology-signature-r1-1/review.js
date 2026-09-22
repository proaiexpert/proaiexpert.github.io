(function(){
  'use strict';
  var langButtons=[].slice.call(document.querySelectorAll('[data-review-lang]'));
  var stateButtons=[].slice.call(document.querySelectorAll('[data-review-state]'));
  var panes=[].slice.call(document.querySelectorAll('[data-preview-pane]'));

  function activePane(){return document.querySelector('[data-preview-pane]:not([hidden])');}
  function activeSection(){var pane=activePane();return pane?pane.querySelector('[data-home-tech-signature-r1-1]'):null;}
  function api(){return window.__PROAI_TECH_SIGNATURE_R1_1__;}
  function syncState(){
    var section=activeSection();
    var state=section?section.getAttribute('data-active')||'rest':'rest';
    stateButtons.forEach(function(button){button.setAttribute('aria-pressed',String(button.getAttribute('data-review-state')===state));});
  }
  function setLang(lang){
    panes.forEach(function(pane){pane.hidden=pane.getAttribute('data-preview-pane')!==lang;});
    langButtons.forEach(function(button){button.setAttribute('aria-pressed',String(button.getAttribute('data-review-lang')===lang));});
    document.documentElement.lang=lang;
    var section=activeSection();
    if(api()&&section)api().settle(section);
    syncState();
  }
  function setState(state){
    var section=activeSection();
    if(!section||!api())return;
    if(state==='rest')api().rest(section);
    else api().select(state,section);
    syncState();
  }
  langButtons.forEach(function(button){button.addEventListener('click',function(){setLang(button.getAttribute('data-review-lang'));});});
  stateButtons.forEach(function(button){button.addEventListener('click',function(){setState(button.getAttribute('data-review-state'));});});
  setLang('en');
}());