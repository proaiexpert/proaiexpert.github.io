(() => {
  const root = document.getElementById('hst2');
  const packet = root.querySelector('[data-packet]');
  const shutter = root.querySelector('[data-shutter]');
  const layers = [...root.querySelectorAll('[data-layer]')];
  const code = [...root.querySelectorAll('[data-code-step]')];
  const order = ['capture','context','intelligence','human','action'];
  const positions = {
    capture:{top:'24px',left:'55%'},
    context:{top:'98px',left:'49%'},
    intelligence:{top:'176px',left:'58%'},
    human:{top:'254px',left:'50%'},
    action:{top:'338px',left:'61%'}
  };
  const mobilePositions = {
    capture:{top:'12px',left:'58%'},
    context:{top:'72px',left:'48%'},
    intelligence:{top:'137px',left:'59%'},
    human:{top:'210px',left:'49%'},
    action:{top:'286px',left:'61%'}
  };
  const landscapePositions = {
    capture:{top:'4px',left:'56%'},context:{top:'45px',left:'48%'},intelligence:{top:'90px',left:'58%'},human:{top:'144px',left:'50%'},action:{top:'202px',left:'61%'}
  };
  function posFor(step){
    const landscape = matchMedia('(min-width:700px) and (max-height:480px) and (orientation:landscape)').matches;
    const mobile = matchMedia('(max-width:760px)').matches;
    return (landscape?landscapePositions:mobile?mobilePositions:positions)[step];
  }
  function resetClasses(){
    root.classList.remove('is-action','is-settled');
    layers.forEach(l=>l.classList.remove('is-active'));
    code.forEach(l=>l.classList.remove('is-active','is-done'));
    packet.className='packet';
    shutter.classList.remove('is-open');
  }
  function setStep(step, opts={}){
    const idx = order.indexOf(step);
    root.dataset.step = step;
    layers.forEach(l=>l.classList.toggle('is-active',l.dataset.layer===step));
    code.forEach(line=>{
      const li=order.indexOf(line.dataset.codeStep);
      line.classList.toggle('is-active',line.dataset.codeStep===step);
      line.classList.toggle('is-done',li>=0 && li<idx);
    });
    const p=posFor(step);
    packet.style.top=p.top;packet.style.left=p.left;
    packet.className='packet is-visible is-'+step;
    if(step==='human' && !opts.approved) shutter.classList.remove('is-open');
    if(opts.approved) shutter.classList.add('is-open');
    if(step==='action'){root.classList.add('is-action');shutter.classList.add('is-open');}
  }
  function settled(){
    setStep('action',{approved:true});
    root.classList.add('is-settled','is-action');
    layers.forEach(l=>l.classList.remove('is-active'));
    code.forEach(l=>l.classList.add('is-done'));
    packet.innerHTML='<strong>CONTEXT / PRESERVED</strong><span>route: resolved · review: approved</span>';
  }
  const state = new URLSearchParams(location.search).get('state');
  if(state){
    resetClasses();
    if(state==='gating'){setStep('human');}
    else if(state==='approved'){setStep('human',{approved:true});}
    else if(state==='action'){setStep('action',{approved:true});}
    else settled();
    return;
  }
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){settled();return;}
  const seq=[
    [180,()=>setStep('capture')],
    [650,()=>setStep('context')],
    [1100,()=>setStep('intelligence')],
    [1520,()=>setStep('human')],
    [2130,()=>setStep('human',{approved:true})],
    [2470,()=>setStep('action',{approved:true})],
    [2920,settled]
  ];
  let played=false;
  const run=()=>{if(played)return;played=true;seq.forEach(([t,fn])=>setTimeout(fn,t));};
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting&&e.intersectionRatio>=.18){run();io.disconnect();break;}}},{threshold:[.18,.3],rootMargin:'0px 0px -8% 0px'});io.observe(root);
  } else setTimeout(run,80);
})();
