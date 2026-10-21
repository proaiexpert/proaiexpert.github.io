/* Article 11 only; progressive enhancement. No network, tracking or storage. */
(function(){'use strict';document.querySelectorAll('[data-tco]').forEach(function(root){
 var lang=root.getAttribute('data-lang'),keys=['base','extra','setup','host','support','monthly','renew','hours','change','exit','tax'],scenario=['future','usage','migration'];
 var proposals=root.querySelectorAll('[data-proposal]');
 var H=function(){return Number(root.querySelector('[data-horizon]:checked').value);};
 var money=function(value){return new Intl.NumberFormat(lang==='ru'?'ru-RU':'en-US',{style:'currency',currency:root.querySelector('[data-currency]').value,maximumFractionDigits:2}).format(value);};
 function val(field,whole,max){
   if(!field||field.value.trim()===''){if(field)field.removeAttribute('aria-invalid');return null;}
   var n=Number(field.value),ok=Number.isFinite(n)&&n>=0&&n<=1000000000000&&(!whole||Number.isInteger(n))&&(max===undefined||n<=max);
   field.setAttribute('aria-invalid',ok?'false':'true');return ok?n:null;
 }
 function calc(card){
   var missing=0,total=0,res=0,resMissing=0;
   keys.forEach(function(k){
     var n=val(card.querySelector('[data-cost="'+k+'"]'));
     if(k==='hours'){var rate=val(card.querySelector('[data-rate="hours"]'));if(n===null||(n!==0&&rate===null)){missing++;return;}total+=n*(n===0?0:rate);}
     else if(k==='host'||k==='support'||k==='monthly'){
       var field=card.querySelector('[data-months="'+k+'"]');field.max=H();var paid=val(field,true,H());
       if(n===null||(n!==0&&paid===null)){missing++;return;}total+=n*(n===0?0:paid);
     }else if(n===null)missing++;else total+=n;
   });
   scenario.forEach(function(k){var n=val(card.querySelector('[data-cost="'+k+'"]'));if(n===null)resMissing++;else res+=n;});
   var totalEl=card.querySelector('[data-result="committed"]'),reserveEl=card.querySelector('[data-result="reserve"]'),combinedEl=card.querySelector('[data-result="combined"]');
   totalEl.textContent=missing?'—':money(total);reserveEl.textContent=resMissing?'—':money(res);combinedEl.textContent=missing||resMissing?'—':money(total+res);
   totalEl.setAttribute('data-raw',missing?'':total.toFixed(2));reserveEl.setAttribute('data-raw',resMissing?'':res.toFixed(2));combinedEl.setAttribute('data-raw',missing||resMissing?'':(total+res).toFixed(2));
   card.querySelector('[data-status]').textContent=missing?(lang==='ru'?'Неизвестных обязательных строк: ':'Unknown committed lines: ')+missing:(lang==='ru'?'Обязательные расходы рассчитаны':'Committed costs calculated');
 }
 function update(){proposals.forEach(calc);}
 function select(which){root.setAttribute('data-active',which);root.querySelectorAll('[data-view]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-view')===which?'true':'false');});}
 root.addEventListener('input',function(e){if(e.target.matches('[data-cost],[data-months],[data-rate]'))update();});
 root.addEventListener('change',function(e){if(e.target.matches('[data-horizon],[data-currency]'))update();});
 root.querySelectorAll('[data-view]').forEach(function(b){b.addEventListener('click',function(){select(b.getAttribute('data-view'));});});
 root.querySelectorAll('[data-reset]').forEach(function(b){b.addEventListener('click',function(){root.querySelector('[data-proposal="'+b.getAttribute('data-reset')+'"]').querySelectorAll('input,textarea').forEach(function(f){f.value='';f.removeAttribute('aria-invalid');});update();});});
 root.classList.add('is-ready');select('a');update();
});})();
