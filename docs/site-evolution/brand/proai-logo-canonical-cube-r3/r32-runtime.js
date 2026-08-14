import './assets/index-vldOIrE-.js';

const SOURCE=Object.freeze({
  branch:'agent/proai-cube-semantic-brand-face-r4',
  productSha:'d4902a151b5f4cc98032c956e3d9e1d0fca94827',
  glbPath:'docs/site-evolution/brand/proai-logo-canonical-cube-r3/assets/rubik_39_s_cube_animation-DvywXmYB.glb',
  glbBytes:279412,
  glbSha256:'dbb7fc4156f8c9ed2481dd76443dffb9a45ecb5493463f99bffb34dd3b59c79b',
  compiledRuntimeBlob:'614b2ad663b6a50fb8df6dd15e3ead6b4bb69750'
});

const HOME=Object.freeze({
  timeSec:50.0,
  face:'+X',
  visibilityDot:0.750127399923412,
  integratedYawDeg:279.12268807870436,
  normalizedYawDeg:279.12268807870436,
  pitchDeg:1.431618722282266,
  rollDeg:-1.2596148649424428,
  cameraFovDeg:31,
  character:'front-dominant premium 3/4 product portrait; side explicit; top restrained silver catch'
});

const LIVING=Object.freeze({
  mode:'bounded recognizable presentation envelope',
  centerTimeSec:50.0,
  primaryAmplitudeSec:0.60,
  secondaryAmplitudeSec:0.16,
  primaryAngularRateRadPerSec:0.25,
  secondaryAngularRateRadPerSec:0.14,
  approximateHomeYawSpeedDegPerSec:4.2,
  sliceChoreography:false,
  semanticFace:false,
  wordmarkAnimated:false,
  visibleLoopRestart:false
});

function waitForApi(timeoutMs=45000){
  const started=performance.now();
  return new Promise((resolve,reject)=>{function poll(){const api=window.__PROAI_CUBE_R1_2;if(api?.ready)return resolve(api);if(performance.now()-started>timeoutMs)return reject(new Error('Canonical ProAI Cube runtime did not become ready'));requestAnimationFrame(poll)}poll()})
}

function neutralize(api){api.stopSliceScheduler?.();api.clearSemanticReviewState?.()}

function verifyHome(api){
  const sample=api.getReviewPresentationSample(HOME.timeSec);
  const semantic=api.getSemanticPoseAt(HOME.timeSec);
  if(!sample||!semantic)throw new Error('R3.2 home pose unavailable');
  if(semantic.face!==HOME.face||Math.abs(semantic.dot-HOME.visibilityDot)>.01)throw new Error(`R3.2 home pose mismatch: ${semantic.face}/${semantic.dot}`);
  return {sample,semantic};
}

function applyLookdev(api){
  const applied=api.setLookDevPreset?.('premiumHybrid')??false;
  return {preset:'premiumHybrid',applied,smallScalePresentation:document.querySelector('.r32-lockup')?.dataset.scale==='header'?'same canonical render; small-scale exposure/contrast presentation tuning only':'none'};
}

function publish(mode,home,optical){
  window.__PROAI_LOGO_R32=Object.freeze({
    ready:true,
    mode,
    source:SOURCE,
    home:HOME,
    homeRuntime:home,
    living:LIVING,
    opticalTreatment:optical,
    wordmark:'ProAI Expert',
    casing:'P-ro-AI / E-xpert',
    composition:'CANONICAL CUBE LEFT + ProAI Expert RIGHT + ONE HORIZONTAL ROW',
    geometryModified:false,
    production:false
  });
  window.__PROAI_LOGO_R32_LIVE={frames:0,elapsedSec:0,presentationTimeSec:HOME.timeSec,homeCrossings:1};
  document.documentElement.dataset.proaiLogoR32Ready='true';
}

async function init(){
  const mode=document.body.dataset.r32Mode||'static';
  const api=await waitForApi();
  neutralize(api);
  const optical=applyLookdev(api);
  const home=verifyHome(api);

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
    const offset=LIVING.primaryAmplitudeSec*Math.sin(e*LIVING.primaryAngularRateRadPerSec)+LIVING.secondaryAmplitudeSec*Math.sin(e*LIVING.secondaryAngularRateRadPerSec);
    const t=HOME.timeSec+offset;
    api.setReviewPresentation(t,1,true);
    const live=window.__PROAI_LOGO_R32_LIVE;
    live.frames+=1;live.elapsedSec=e;live.presentationTimeSec=t;
    if((offset>=0&&lastOffset<0)||(offset<=0&&lastOffset>0))live.homeCrossings+=1;
    lastOffset=offset;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

init().catch(error=>{console.error(error);document.documentElement.dataset.proaiLogoR32Ready='error';const s=document.getElementById('runtime-status');if(s)s.textContent=`R3.2 review error: ${error.message}`});
