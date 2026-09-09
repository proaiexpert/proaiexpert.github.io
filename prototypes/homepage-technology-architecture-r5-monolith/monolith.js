import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const stage = document.querySelector('[data-r5-stage]');
if (!stage) throw new Error('R5.2 stage missing');

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = matchMedia('(pointer: coarse)').matches;
const lang = document.documentElement.lang?.toLowerCase().startsWith('ru') ? 'ru' : 'en';
const statusEl = document.querySelector('.r5-status');
const prototypeLabel = document.querySelector('.r5-prototype-bar b');
if (prototypeLabel) prototypeLabel.textContent = 'R5.2 PROTOTYPE';

const FACES = {
  models:{family:lang==='ru'?'МОДЕЛИ':'MODELS',brands:[['OpenAI','openai-mark.svg'],['Claude','claude-mark.svg'],['Gemini','gemini-mark.svg']]},
  automation:{family:lang==='ru'?'АВТОМАТИЗАЦИЯ':'AUTOMATION',brands:[['n8n','n8n-mark.svg'],['Make','make-mark.svg'],['Zapier','zapier-mark.svg']]},
  communication:{family:lang==='ru'?'КОММУНИКАЦИЯ':'COMMUNICATION',brands:[['Twilio','twilio-mark.svg'],['Gmail','gmail-mark.svg']]},
  build:{family:lang==='ru'?'СБОРКА / ДОСТАВКА':'BUILD / DELIVERY',brands:[['Vercel','vercel-mark.svg'],['GitHub','github-mark.svg']]}
};
const BRAND_BASE='/assets/brand/platforms/';

let renderer;
try{
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
}catch(error){
  document.documentElement.classList.add('r5-no-webgl');
  console.error(error);
  throw error;
}
renderer.setPixelRatio(Math.min(devicePixelRatio||1,coarsePointer?1.65:1.95));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.08;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.setClearColor(0x000000,0);
stage.prepend(renderer.domElement);
renderer.domElement.setAttribute('aria-hidden','true');

const scene=new THREE.Scene();
const pmrem=new THREE.PMREMGenerator(renderer);
const env=new RoomEnvironment();
scene.environment=pmrem.fromScene(env,.025).texture;
env.dispose();
pmrem.dispose();

const camera=new THREE.PerspectiveCamera(29,1,.1,40);
scene.add(camera);
const rig=new THREE.Group();
const root=new THREE.Group();
rig.add(root);
scene.add(rig);

const BODY=2.62;
const bodyMaterial=new THREE.MeshPhysicalMaterial({
  color:0x171b1f,
  roughness:.20,
  metalness:.91,
  clearcoat:.38,
  clearcoatRoughness:.18,
  envMapIntensity:1.42,
  transparent:true,
  opacity:1
});
const body=new THREE.Mesh(new RoundedBoxGeometry(BODY,BODY,BODY,8,.16),bodyMaterial);
body.castShadow=true;
body.receiveShadow=true;
root.add(body);

const edgeGlow=new THREE.MeshBasicMaterial({color:0xd7dde0,transparent:true,opacity:.055,depthWrite:false,side:THREE.BackSide});
const halo=new THREE.Mesh(new RoundedBoxGeometry(BODY+0.025,BODY+0.025,BODY+0.025,8,.17),edgeGlow);
root.add(halo);

function loadImage(src){
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.decoding='async';
    img.onload=()=>resolve(img);
    img.onerror=reject;
    img.src=src;
  });
}

function drawMonoMark(ctx,img,x,y,w,h,color='rgba(236,239,238,.96)'){
  const box=document.createElement('canvas');
  box.width=Math.max(1,Math.round(w));
  box.height=Math.max(1,Math.round(h));
  const b=box.getContext('2d');
  const ratio=Math.min(box.width/img.naturalWidth,box.height/img.naturalHeight);
  const dw=img.naturalWidth*ratio;
  const dh=img.naturalHeight*ratio;
  b.drawImage(img,(box.width-dw)/2,(box.height-dh)/2,dw,dh);
  b.globalCompositeOperation='source-in';
  b.fillStyle=color;
  b.fillRect(0,0,box.width,box.height);
  ctx.drawImage(box,x,y,w,h);
}

function fitFont(ctx,text,maxWidth,start,min,weight='650'){
  let size=start;
  while(size>min){
    ctx.font=`${weight} ${size}px Inter, Arial, sans-serif`;
    if(ctx.measureText(text).width<=maxWidth) break;
    size-=4;
  }
  return size;
}

async function makeFaceTexture(face){
  const images=await Promise.all(face.brands.map(([,asset])=>loadImage(BRAND_BASE+asset)));
  const canvas=document.createElement('canvas');
  canvas.width=1800;
  canvas.height=1800;
  const ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.textBaseline='middle';

  const left=150;
  const right=1650;
  const max=right-left;
  const familySize=fitFont(ctx,face.family,max,154,94,lang==='ru'?'650':'700');
  ctx.fillStyle='rgba(246,246,242,.98)';
  ctx.font=`${lang==='ru'?'650':'700'} ${familySize}px Inter, Arial, sans-serif`;
  ctx.fillText(face.family,left,300);
  ctx.fillStyle='rgba(229,232,230,.23)';
  ctx.fillRect(left,420,max,3);

  const rowCount=face.brands.length;
  const rowTop=525;
  const rowHeight=rowCount===3?340:455;
  face.brands.forEach(([name],i)=>{
    const cy=rowTop+rowHeight*i+rowHeight/2;
    const markSize=rowCount===3?146:178;
    drawMonoMark(ctx,images[i],left,cy-markSize/2,markSize,markSize);
    const nameX=left+markSize+72;
    const nameMax=right-nameX;
    const nameSize=fitFont(ctx,name,nameMax,rowCount===3?116:132,82,'600');
    ctx.fillStyle='rgba(229,233,232,.96)';
    ctx.font=`600 ${nameSize}px Inter, Arial, sans-serif`;
    ctx.fillText(name,nameX,cy);
    if(i<rowCount-1){
      ctx.fillStyle='rgba(221,225,224,.12)';
      ctx.fillRect(nameX,cy+rowHeight/2-18,nameMax,2);
    }
  });

  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);
  texture.needsUpdate=true;
  return texture;
}

function makeBackTexture(){
  const canvas=document.createElement('canvas');
  canvas.width=1800;
  canvas.height=1800;
  const ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,1800,1800);
  ctx.textBaseline='middle';
  ctx.fillStyle='rgba(238,240,237,.94)';
  ctx.font='700 150px Inter, Arial, sans-serif';
  ctx.fillText(lang==='ru'?'СИСТЕМА':'SYSTEM',150,650);
  ctx.fillStyle='rgba(194,201,202,.66)';
  ctx.font='500 88px Inter, Arial, sans-serif';
  ctx.fillText(lang==='ru'?'ОПРЕДЕЛЯЕТ ИНСТРУМЕНТЫ':'DETERMINES THE TOOLS',150,835);
  ctx.fillStyle='rgba(229,232,230,.20)';
  ctx.fillRect(150,1010,1100,3);
  const t=new THREE.CanvasTexture(canvas);
  t.colorSpace=THREE.SRGBColorSpace;
  return t;
}

const faceMeshes=[];
function addFace(texture,position,rotation,key){
  const material=new THREE.MeshStandardMaterial({
    map:texture,
    transparent:true,
    opacity:0,
    roughness:.31,
    metalness:.66,
    depthWrite:false,
    side:THREE.DoubleSide,
    envMapIntensity:.65
  });
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(2.30,2.30),material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.renderOrder=5;
  mesh.userData.surfaceKey=key;
  root.add(mesh);
  faceMeshes.push(mesh);
  return mesh;
}

const faceTextures={};

const ground=new THREE.Mesh(new THREE.PlaneGeometry(12,9),new THREE.ShadowMaterial({color:0x000000,opacity:.46,transparent:true}));
ground.rotation.x=-Math.PI/2;
ground.position.y=-1.49;
ground.receiveShadow=true;
scene.add(ground);

const keyLight=new THREE.SpotLight(0xf7f3eb,760,18,Math.PI*.19,.58,1.25);
keyLight.position.set(-4.0,6.2,5.8);
keyLight.target.position.set(.15,.05,0);
keyLight.castShadow=true;
keyLight.shadow.mapSize.set(coarsePointer?1024:1536,coarsePointer?1024:1536);
keyLight.shadow.bias=-.00025;
scene.add(keyLight,keyLight.target);
const rim=new THREE.SpotLight(0xc7d2d8,520,17,Math.PI*.23,.68,1.4);
rim.position.set(5.0,2.6,-3.7);
rim.target.position.set(0,.05,0);
scene.add(rim,rim.target);
const topLight=new THREE.PointLight(0xd9e0e2,92,10,2);
topLight.position.set(0,4.0,1.4);
scene.add(topLight);
const fill=new THREE.PointLight(0x9aa6ad,46,12,2);
fill.position.set(-3.4,.3,4.0);
scene.add(fill);

const POSES={
  models:{x:-.07,y:-.10,z:0},
  automation:{x:-.08,y:-.63,z:.008},
  communication:{x:.47,y:-.28,z:.008},
  build:{x:.17,y:.28,z:-.008},
  final:{x:.31,y:-.52,z:.014}
};
let activePose='final';
let tweenSerial=0;
let idleRaf=0;
const clamp01=v=>Math.max(0,Math.min(1,v));
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const setStatus=text=>{if(statusEl)statusEl.textContent=text};
const render=()=>renderer.render(scene,camera);

function applyLayout(){
  const w=stage.clientWidth||800;
  const h=stage.clientHeight||650;
  renderer.setSize(w,h,false);
  camera.aspect=w/h;
  const mobile=w<560;
  const landscape=h<500&&w>h;
  if(landscape){
    camera.fov=31;
    camera.position.set(.12,.84,8.55);
    rig.position.set(.18,-.04,0);
    rig.scale.setScalar(.90);
  }else if(mobile){
    camera.fov=34;
    camera.position.set(.08,.92,9.05);
    rig.position.set(.01,-.12,0);
    rig.scale.setScalar(.92);
  }else{
    camera.fov=29;
    camera.position.set(.10,1.03,8.25);
    rig.position.set(.12,-.03,0);
    rig.scale.setScalar(.98);
  }
  camera.lookAt(0,-.05,0);
  camera.updateProjectionMatrix();
  render();
}

function stopIdle(){if(idleRaf)cancelAnimationFrame(idleRaf);idleRaf=0}
function startIdle(){
  stopIdle();
  if(reducedMotion||activePose!=='final')return;
  const start=performance.now();
  const frame=now=>{
    if(activePose!=='final'||document.documentElement.dataset.r5State!=='rest'){idleRaf=0;return}
    const t=(now-start)/1000;
    root.rotation.x=POSES.final.x+Math.sin(t*.34)*.006;
    root.rotation.y=POSES.final.y+Math.sin(t*.28)*.012;
    root.rotation.z=POSES.final.z+Math.sin(t*.21)*.002;
    render();
    idleRaf=requestAnimationFrame(frame);
  };
  idleRaf=requestAnimationFrame(frame);
}

function syncButtons(name){
  const normalized=name==='final'?'models':name;
  document.querySelectorAll('[data-r5-face]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.r5Face===normalized)));
}

function animatePose(name,duration=920){
  stopIdle();
  const target=POSES[name]||POSES.final;
  const from={x:root.rotation.x,y:root.rotation.y,z:root.rotation.z};
  const serial=++tweenSerial;
  const start=performance.now();
  activePose=name;
  syncButtons(name);
  const frame=now=>{
    if(serial!==tweenSerial)return;
    const p=clamp01((now-start)/Math.max(1,duration));
    const e=ease(p);
    root.rotation.x=THREE.MathUtils.lerp(from.x,target.x,e);
    root.rotation.y=THREE.MathUtils.lerp(from.y,target.y,e);
    root.rotation.z=THREE.MathUtils.lerp(from.z,target.z,e);
    render();
    if(p<1)requestAnimationFrame(frame);
    else if(name==='final')startIdle();
  };
  requestAnimationFrame(frame);
}

function finishStill(){
  bodyMaterial.opacity=1;
  halo.material.opacity=.055;
  root.scale.setScalar(1);
  root.position.set(0,0,0);
  root.rotation.set(POSES.final.x,POSES.final.y,POSES.final.z);
  faceMeshes.forEach(m=>m.material.opacity=.97);
  activePose='final';
  syncButtons('final');
  setStatus('OBJECT / REST');
  document.documentElement.dataset.r5State='rest';
  render();
  startIdle();
}

function tweenSegment(from,to,start,end,now){
  const p=clamp01((now-start)/(end-start));
  const e=ease(p);
  root.rotation.x=THREE.MathUtils.lerp(from.x,to.x,e);
  root.rotation.y=THREE.MathUtils.lerp(from.y,to.y,e);
  root.rotation.z=THREE.MathUtils.lerp(from.z,to.z,e);
}

function intro(){
  if(reducedMotion){finishStill();return}
  stopIdle();
  document.documentElement.dataset.r5State='intro';
  bodyMaterial.opacity=0;
  halo.material.opacity=0;
  faceMeshes.forEach(m=>m.material.opacity=0);
  root.scale.setScalar(.76);
  root.position.set(0,-.10,0);
  root.rotation.set(-.18,-.12,0);
  const start=performance.now();
  const duration=9800;
  const frame=now=>{
    const elapsed=now-start;
    const t=clamp01(elapsed/duration);
    bodyMaterial.opacity=Math.min(1,t*5.2);
    halo.material.opacity=.055*Math.min(1,t*4.5);
    const materialize=clamp01(elapsed/1250);
    root.scale.setScalar(THREE.MathUtils.lerp(.76,1,ease(materialize)));
    root.position.y=THREE.MathUtils.lerp(-.10,0,ease(materialize));
    const faceOpacity=clamp01((elapsed-520)/980);
    faceMeshes.forEach(m=>m.material.opacity=.97*faceOpacity);

    if(elapsed<1500){
      tweenSegment({x:-.18,y:-.12,z:0},POSES.models,0,1500,elapsed);
      setStatus('MODELS');
    }else if(elapsed<3400){
      tweenSegment(POSES.models,POSES.automation,1500,3400,elapsed);
      setStatus(elapsed<2450?'MODELS':'AUTOMATION');
    }else if(elapsed<5400){
      tweenSegment(POSES.automation,POSES.communication,3400,5400,elapsed);
      setStatus(elapsed<4400?'AUTOMATION':'COMMUNICATION');
    }else if(elapsed<7400){
      tweenSegment(POSES.communication,POSES.build,5400,7400,elapsed);
      setStatus(elapsed<6400?'COMMUNICATION':'BUILD / DELIVERY');
    }else{
      tweenSegment(POSES.build,POSES.final,7400,9800,elapsed);
      setStatus(elapsed<8600?'BUILD / DELIVERY':'OBJECT / REST');
    }
    render();
    if(t<1)requestAnimationFrame(frame);else finishStill();
  };
  requestAnimationFrame(frame);
}

document.querySelectorAll('[data-r5-face]').forEach(btn=>{
  btn.addEventListener('click',()=>animatePose(btn.dataset.r5Face,coarsePointer?780:920));
});

const resizeObserver=new ResizeObserver(applyLayout);
resizeObserver.observe(stage);

async function boot(){
  try{await document.fonts.ready}catch{}
  try{
    const [models,automation,communication,build]=await Promise.all([
      makeFaceTexture(FACES.models),makeFaceTexture(FACES.automation),makeFaceTexture(FACES.communication),makeFaceTexture(FACES.build)
    ]);
    faceTextures.models=models;
    faceTextures.automation=automation;
    faceTextures.communication=communication;
    faceTextures.build=build;
    addFace(models,[0,0,BODY/2+.012],[0,0,0],'models');
    addFace(automation,[BODY/2+.012,0,0],[0,Math.PI/2,0],'automation');
    addFace(communication,[0,BODY/2+.012,0],[-Math.PI/2,0,0],'communication');
    addFace(build,[-BODY/2-.012,0,0],[0,-Math.PI/2,0],'build');
    addFace(makeBackTexture(),[0,0,-BODY/2-.012],[0,Math.PI,0],'system');
    applyLayout();
    intro();
  }catch(error){
    console.error('R5.2 brand texture boot failed',error);
    document.documentElement.classList.add('r5-no-webgl');
    setStatus('RUNTIME FALLBACK');
  }
}
boot();

window.__PROAI_R5__={
  version:'R5.2-face-authority',
  get state(){return document.documentElement.dataset.r5State||'boot'},
  pose:name=>animatePose(name,0),
  render,
  brands:Object.fromEntries(Object.entries(FACES).map(([k,v])=>[k,v.brands.map(([name])=>name)]))
};
