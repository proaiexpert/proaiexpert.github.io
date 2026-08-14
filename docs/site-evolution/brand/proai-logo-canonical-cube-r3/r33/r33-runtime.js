import '../assets/index-vldOIrE-.js';

const SOURCE=Object.freeze({
  branch:'agent/proai-cube-semantic-brand-face-r4',
  physicalSourceSha:'d4902a151b5f4cc98032c956e3d9e1d0fca94827',
  glb:'docs/site-evolution/brand/proai-logo-canonical-cube-r3/assets/rubik_39_s_cube_animation-DvywXmYB.glb',
  glbBytes:279412,
  glbSha256:'dbb7fc4156f8c9ed2481dd76443dffb9a45ecb5493463f99bffb34dd3b59c79b',
  compiledRuntimeBlob:'614b2ad663b6a50fb8df6dd15e3ead6b4bb69750'
});

const HOME=Object.freeze({
  timeSec:49.6,
  cameraFovDeg:31,
  selection:'front-dominant product portrait with explicit depth plane and restrained top-plane confirmation'
});

const LIVING=Object.freeze({
  primaryAmplitudeSec:0.56,
  secondaryAmplitudeSec:0.16,
  primaryRateRadPerSec:0.22,
  secondaryRateRadPerSec:0.13,
  sliceChoreography:false,
  semanticFace:false,
  wordmarkAnimated:false,
  visibleLoopRestart:false,
  character:'bounded quasi-periodic signature drift around the canonical home portrait'
});

function waitForApi(timeoutMs=45000){
  const started=performance.now();
  return new Promise((resolve,reject)=>{function poll(){const api=window.__PROAI_CUBE_R1_2;if(api?.ready)return resolve(api);if(performance.now()-started>timeoutMs)return reject(new Error('Canonical ProAI Cube runtime did not become ready'));requestAnimationFrame(poll)}poll()})
}

function neutralize(api){api.stopSliceScheduler?.();api.clearSemanticReviewState?.()}

function applyLookdev(api){
  const applied=api.setLookDevPreset?.('premiumHybrid')??false;
  return Object.freeze({
    preset:'premiumHybrid',
    applied,
    cssBrightnessFilter:false,
    smallScale:'same physical render; 30px optical frame and tighter camera crop only'
  });
}

function resolveHome(api){
  const sample=api.getReviewPresentationSample(HOME.timeSec);
  const pose=api.getSemanticPoseAt(HOME.timeSec);
  if(!sample||!pose)throw new Error('R3.3 canonical home portrait unavailable');
  return Object.freeze({sample,pose});
}

function publish(mode,home,optical){
  window.__PROAI_LOGO_R33=Object.freeze({
    ready:true,
    mode,
    source:SOURCE,
    home:HOME,
    homeRuntime:home,
    living:LIVING,
    opticalTreatment:optical,
    wordmark:'ProAI Expert',
    typography:Object.freeze({family:'Instrument Sans Variable',weight:680,proAITrackingEm:-0.016,expertTrackingEm:-0.010,wordGapEm:.285,aiJoin:Object.freeze({oToAEm:-0.012,aToIEm:-0.026})}),
    composition:'CANONICAL CUBE LEFT + ProAI Expert RIGHT + ONE HORIZONTAL ROW',
    geometryModified:false,
    newSymbol:false,
    production:false
  });
  window.__PROAI_LOGO_R33_LIVE={frames:0,elapsedSec:0,presentationTimeSec:HOME.timeSec,homeCrossings:1};
  document.documentElement.dataset.proaiLogoR33Ready='true';
}

async function init(){
  const mode=document.body.dataset.r33Mode||'static';
  const api=await waitForApi();
  neutralize(api);
  const optical=applyLookdev(api);
  const home=resolveHome(api);
  api.setReviewPresentation(HOME.timeSec,1,false);
  api.clearSemanticReviewState?.();
  api.renderReviewFrame();
  publish(mode,home,optical);
  if(mode!=='living')return;
  const started=performance.now();
  let lastOffset=0;
  const tick=(now)=>{
    neutralize(api);
    const e=(now-started)/1000;
    const offset=LIVING.primaryAmplitudeSec*Math.sin(e*LIVING.primaryRateRadPerSec)+LIVING.secondaryAmplitudeSec*Math.sin(e*LIVING.secondaryRateRadPerSec);
    const t=HOME.timeSec+offset;
    api.setReviewPresentation(t,1,true);
    const live=window.__PROAI_LOGO_R33_LIVE;
    live.frames+=1;live.elapsedSec=e;live.presentationTimeSec=t;
    if((offset>=0&&lastOffset<0)||(offset<=0&&lastOffset>0))live.homeCrossings+=1;
    lastOffset=offset;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

init().catch(error=>{console.error(error);document.documentElement.dataset.proaiLogoR33Ready='error';const s=document.getElementById('runtime-status');if(s)s.textContent=`R3.3 review error: ${error.message}`});
