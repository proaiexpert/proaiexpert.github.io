import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const stage = document.querySelector('[data-r5-stage]');
if (!stage) throw new Error('R5.1 stage missing');

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = matchMedia('(pointer: coarse)').matches;
const lang = document.documentElement.lang?.toLowerCase().startsWith('ru') ? 'ru' : 'en';
const statusEl = document.querySelector('.r5-status');
const prototypeLabel = document.querySelector('.r5-prototype-bar b');
if (prototypeLabel) prototypeLabel.textContent = 'R5.1 PROTOTYPE';

const LABELS = {
  en: [
    { key:'models', index:'01', family:'MODELS', vendors:['OPENAI','CLAUDE','GEMINI'] },
    { key:'automation', index:'02', family:'AUTOMATION', vendors:['N8N','MAKE','ZAPIER'] },
    { key:'communication', index:'03', family:'COMMUNICATION', vendors:['TWILIO','GMAIL'] },
    { key:'build', index:'04', family:'BUILD / DELIVERY', vendors:['VERCEL','GITHUB'] }
  ],
  ru: [
    { key:'models', index:'01', family:'МОДЕЛИ', vendors:['OPENAI','CLAUDE','GEMINI'] },
    { key:'automation', index:'02', family:'АВТОМАТИЗАЦИЯ', vendors:['N8N','MAKE','ZAPIER'] },
    { key:'communication', index:'03', family:'КОММУНИКАЦИЯ', vendors:['TWILIO','GMAIL'] },
    { key:'build', index:'04', family:'СБОРКА / ДОСТАВКА', vendors:['VERCEL','GITHUB'] }
  ]
}[lang];

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'high-performance' });
} catch (error) {
  document.documentElement.classList.add('r5-no-webgl');
  console.error(error);
  throw error;
}
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarsePointer ? 1.6 : 1.9));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x000000,0);
stage.prepend(renderer.domElement);
renderer.domElement.setAttribute('aria-hidden','true');

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
const environment = new RoomEnvironment();
scene.environment = pmrem.fromScene(environment,0.035).texture;
environment.dispose();
pmrem.dispose();

const camera = new THREE.PerspectiveCamera(30,1,0.1,40);
scene.add(camera);

const rig = new THREE.Group();
const root = new THREE.Group();
rig.add(root);
scene.add(rig);

const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color:0x22272c,
  roughness:.245,
  metalness:.84,
  clearcoat:.34,
  clearcoatRoughness:.23,
  envMapIntensity:1.22,
  transparent:true,
  opacity:1
});
const titaniumMaterial = new THREE.MeshPhysicalMaterial({
  color:0xb7bec2,
  roughness:.19,
  metalness:.98,
  clearcoat:.18,
  clearcoatRoughness:.22,
  envMapIntensity:1.35
});
const insetMaterial = new THREE.MeshPhysicalMaterial({
  color:0x101315,
  roughness:.32,
  metalness:.68,
  clearcoat:.12,
  clearcoatRoughness:.34,
  envMapIntensity:.85
});

const BODY = { width:2.92, height:2.58, depth:2.64, radius:.19 };

function roundedRectShape(width,height,radius){
  const x=-width/2;
  const y=-height/2;
  const s=new THREE.Shape();
  s.moveTo(x+radius,y);
  s.lineTo(x+width-radius,y);
  s.quadraticCurveTo(x+width,y,x+width,y+radius);
  s.lineTo(x+width,y+height-radius);
  s.quadraticCurveTo(x+width,y+height,x+width-radius,y+height);
  s.lineTo(x+radius,y+height);
  s.quadraticCurveTo(x,y+height,x,y+height-radius);
  s.lineTo(x,y+radius);
  s.quadraticCurveTo(x,y,x+radius,y);
  s.closePath();
  return s;
}

function nearCubeGeometry(){
  const g=new THREE.ExtrudeGeometry(roundedRectShape(BODY.width,BODY.height,BODY.radius),{
    depth:BODY.depth,
    steps:1,
    bevelEnabled:true,
    bevelSegments:8,
    bevelSize:.075,
    bevelThickness:.095,
    curveSegments:6
  });
  g.translate(0,0,-BODY.depth/2);
  g.computeVertexNormals();
  return g;
}

const body = new THREE.Mesh(nearCubeGeometry(),bodyMaterial);
body.castShadow=true;
body.receiveShadow=true;
root.add(body);

function addSignatureLine(size,pos,rot=[0,0,0]){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size),titaniumMaterial);
  mesh.position.set(...pos);
  mesh.rotation.set(...rot);
  mesh.castShadow=true;
  root.add(mesh);
  return mesh;
}
addSignatureLine([.92,.016,.018],[-.80,-1.165,1.405]);
addSignatureLine([.58,.016,.018],[.96,1.165,1.405]);
addSignatureLine([.018,.016,.70],[1.545,-1.165,.70]);

const datum = new THREE.Mesh(new THREE.BoxGeometry(1.06,.022,.035),insetMaterial);
datum.position.set(.62,-1.18,1.392);
root.add(datum);

function canvasTexture(draw){
  const canvas=document.createElement('canvas');
  canvas.width=2048;
  canvas.height=1280;
  const ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  draw(ctx,canvas);
  const tex=new THREE.CanvasTexture(canvas);
  tex.colorSpace=THREE.SRGBColorSpace;
  tex.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);
  tex.needsUpdate=true;
  return tex;
}

function fitText(ctx,text,maxWidth,startSize,minSize,weight='600'){
  let size=startSize;
  while(size>minSize){
    ctx.font=`${weight} ${size}px Inter, Arial, sans-serif`;
    if(ctx.measureText(text).width<=maxWidth) break;
    size-=4;
  }
  return size;
}

function faceTexture(data){
  return canvasTexture((ctx,canvas)=>{
    const left=154;
    const right=canvas.width-154;
    const usable=right-left;
    ctx.textBaseline='alphabetic';

    ctx.fillStyle='rgba(203,208,209,.58)';
    ctx.font='600 34px Inter, Arial, sans-serif';
    ctx.fillText(data.index,left,186);

    ctx.fillStyle='rgba(213,217,216,.20)';
    ctx.fillRect(left,232,usable,2);

    const familySize=fitText(ctx,data.family,usable,142,94,lang==='ru'?'600':'650');
    ctx.fillStyle='rgba(244,244,239,.98)';
    ctx.font=`${lang==='ru'?'600':'650'} ${familySize}px Inter, Arial, sans-serif`;
    ctx.fillText(data.family,left,590);

    const vendorY=835;
    const vendorGap=46;
    const vendorMax=(usable-vendorGap*(data.vendors.length-1))/data.vendors.length;
    let vendorSize=72;
    for(const vendor of data.vendors){
      vendorSize=Math.min(vendorSize,fitText(ctx,vendor,vendorMax,72,48,'560'));
    }
    ctx.font=`560 ${vendorSize}px Inter, Arial, sans-serif`;
    let x=left;
    data.vendors.forEach((vendor,i)=>{
      ctx.fillStyle=i===0?'rgba(232,234,231,.96)':'rgba(205,210,210,.92)';
      ctx.fillText(vendor,x,vendorY);
      x+=ctx.measureText(vendor).width;
      if(i<data.vendors.length-1){
        ctx.fillStyle='rgba(164,170,172,.50)';
        ctx.fillRect(x+18,vendorY-vendorSize*.52,10,2);
        x+=vendorGap;
      }
    });

    ctx.fillStyle='rgba(212,216,215,.17)';
    ctx.fillRect(left,934,usable*.78,2);
    ctx.fillStyle='rgba(173,179,181,.50)';
    ctx.font='500 28px Inter, Arial, sans-serif';
    ctx.fillText('SYSTEM → TOOLS',left,1036);
  });
}

const surfaces=[];
function addSurface(data,cfg){
  const texture=faceTexture(data);
  const material=new THREE.MeshStandardMaterial({
    map:texture,
    color:0xffffff,
    roughness:.27,
    metalness:.78,
    transparent:true,
    opacity:0,
    depthWrite:false,
    side:THREE.DoubleSide,
    envMapIntensity:.72
  });
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(cfg.width,cfg.height),material);
  mesh.position.set(...cfg.position);
  mesh.rotation.set(...cfg.rotation);
  mesh.renderOrder=5;
  root.add(mesh);

  const hitMat=new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide});
  const hit=new THREE.Mesh(new THREE.PlaneGeometry(cfg.width*.98,cfg.height*.94),hitMat);
  hit.position.set(...cfg.position);
  hit.rotation.set(...cfg.rotation);
  const n=new THREE.Vector3(0,0,.012).applyEuler(hit.rotation);
  hit.position.add(n);
  hit.userData.surfaceKey=data.key;
  hit.renderOrder=8;
  root.add(hit);

  surfaces.push({data,mesh,hit,cfg});
}

addSurface(LABELS[0],{width:2.58,height:1.82,position:[0,.02,1.418],rotation:[0,0,0]});
addSurface(LABELS[1],{width:2.34,height:1.80,position:[1.568,.02,0],rotation:[0,Math.PI/2,0]});
addSurface(LABELS[2],{width:2.50,height:1.94,position:[0,1.398,-.01],rotation:[-Math.PI/2,0,0]});
addSurface(LABELS[3],{width:2.34,height:1.80,position:[-1.568,.02,0],rotation:[0,-Math.PI/2,0]});

const ground=new THREE.Mesh(
  new THREE.PlaneGeometry(12,9),
  new THREE.ShadowMaterial({color:0x000000,opacity:.46,transparent:true})
);
ground.rotation.x=-Math.PI/2;
ground.position.y=-1.46;
ground.receiveShadow=true;
scene.add(ground);

const key=new THREE.SpotLight(0xf6f2e8,760,18,Math.PI*.20,.60,1.32);
key.position.set(-3.8,6.0,5.6);
key.target.position.set(.1,.05,0);
key.castShadow=true;
key.shadow.mapSize.set(coarsePointer?1024:1536,coarsePointer?1024:1536);
key.shadow.bias=-.00028;
scene.add(key,key.target);

const topSoft=new THREE.SpotLight(0xdde2e3,360,15,Math.PI*.28,.78,1.5);
topSoft.position.set(1.2,5.4,1.0);
topSoft.target.position.set(0,0,0);
scene.add(topSoft,topSoft.target);

const rim=new THREE.SpotLight(0xb9c6ce,520,17,Math.PI*.23,.67,1.4);
rim.position.set(5.3,2.4,-3.7);
rim.target.position.set(0,.05,0);
scene.add(rim,rim.target);

const fill=new THREE.PointLight(0xaeb7be,42,12,2);
fill.position.set(-3.4,.1,4.4);
scene.add(fill);

const warm=new THREE.PointLight(0xe5d8ca,34,11,2);
warm.position.set(3.2,2.8,3.7);
scene.add(warm);

const POSES={
  final:{x:-.31,y:-.58,z:.018},
  models:{x:-.08,y:-.08,z:0},
  automation:{x:-.10,y:-1.48,z:.012},
  communication:{x:.96,y:-.48,z:0},
  build:{x:-.10,y:1.48,z:-.012}
};
let activePose='final';
let tweenSerial=0;
let idleRaf=0;
let idleStarted=performance.now();

const clamp01=v=>Math.max(0,Math.min(1,v));
const easeOutCubic=t=>1-Math.pow(1-t,3);
const easeInOutCubic=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function windowFade(t,a,b){return easeOutCubic(clamp01((t-a)/(b-a)))}
function setStatus(text){if(statusEl) statusEl.textContent=text}

function render(){renderer.render(scene,camera)}

function applyLayout(){
  const w=stage.clientWidth||800;
  const h=stage.clientHeight||650;
  renderer.setSize(w,h,false);
  camera.aspect=w/h;

  const mobile=w<560;
  const landscape=h<500&&w>h;
  if(landscape){
    camera.fov=31;
    camera.position.set(.12,.88,7.15);
    rig.position.set(.18,-.03,0);
    rig.scale.setScalar(.91);
  }else if(mobile){
    camera.fov=33;
    camera.position.set(.16,.98,7.55);
    rig.position.set(.02,-.14,0);
    rig.scale.setScalar(.96);
  }else{
    camera.fov=30;
    camera.position.set(.12,1.06,7.05);
    rig.position.set(.12,-.03,0);
    rig.scale.setScalar(1.02);
  }
  camera.lookAt(0,-.05,0);
  camera.updateProjectionMatrix();
  render();
}

function stopIdle(){
  if(idleRaf) cancelAnimationFrame(idleRaf);
  idleRaf=0;
}

function startIdle(){
  stopIdle();
  if(reducedMotion||activePose!=='final') return;
  idleStarted=performance.now();
  const frame=now=>{
    if(activePose!=='final'||document.documentElement.dataset.r5State!=='rest'){idleRaf=0;return}
    const t=(now-idleStarted)/1000;
    root.rotation.x=POSES.final.x+Math.sin(t*.42)*.008;
    root.rotation.y=POSES.final.y+Math.sin(t*.31)*.018;
    root.rotation.z=POSES.final.z+Math.sin(t*.22)*.003;
    render();
    idleRaf=requestAnimationFrame(frame);
  };
  idleRaf=requestAnimationFrame(frame);
}

function syncButtons(name){
  const normalized=name==='final'?'models':name;
  document.querySelectorAll('[data-r5-face]').forEach(b=>{
    b.setAttribute('aria-pressed',String(b.dataset.r5Face===normalized));
  });
}

function animatePose(name,duration=760){
  stopIdle();
  const target=POSES[name]||POSES.final;
  const from={x:root.rotation.x,y:root.rotation.y,z:root.rotation.z};
  const serial=++tweenSerial;
  const start=performance.now();
  activePose=name;
  syncButtons(name);
  setStatus(name==='final'?'OBJECT / REST':`SURFACE / ${(name||'').toUpperCase()}`);
  function frame(now){
    if(serial!==tweenSerial)return;
    const p=clamp01(duration?((now-start)/duration):1);
    const e=easeInOutCubic(p);
    root.rotation.x=THREE.MathUtils.lerp(from.x,target.x,e);
    root.rotation.y=THREE.MathUtils.lerp(from.y,target.y,e);
    root.rotation.z=THREE.MathUtils.lerp(from.z,target.z,e);
    render();
    if(p<1){
      requestAnimationFrame(frame);
    }else if(name==='final'){
      startIdle();
    }
  }
  requestAnimationFrame(frame);
}

function finishStill(){
  bodyMaterial.opacity=1;
  bodyMaterial.transparent=false;
  root.scale.setScalar(1);
  root.position.set(0,0,0);
  root.rotation.set(POSES.final.x,POSES.final.y,POSES.final.z);
  surfaces.forEach(s=>{s.mesh.material.opacity=.98});
  activePose='final';
  syncButtons('final');
  document.documentElement.dataset.r5State='rest';
  document.documentElement.dataset.r51Ready='true';
  setStatus('OBJECT / REST');
  render();
  stage.dispatchEvent(new CustomEvent('r5:rest'));
  startIdle();
}

function intro(){
  if(reducedMotion){finishStill();return}
  stopIdle();
  document.documentElement.dataset.r5State='intro';
  setStatus('OBJECT / ROTATION');
  bodyMaterial.opacity=0;
  root.scale.setScalar(.90);
  root.position.set(.08,-.10,0);
  root.rotation.set(.10,-1.52,-.035);
  surfaces.forEach(s=>{s.mesh.material.opacity=0});

  const start=performance.now();
  const duration=3200;
  function frame(now){
    const t=clamp01((now-start)/duration);
    const orient=easeInOutCubic(windowFade(t,.08,.78));
    const target=POSES.final;
    bodyMaterial.opacity=windowFade(t,0,.18);
    const scale=THREE.MathUtils.lerp(.90,1,easeOutCubic(windowFade(t,.02,.48)));
    root.scale.setScalar(scale);
    root.position.y=THREE.MathUtils.lerp(-.10,0,easeOutCubic(windowFade(t,.04,.46)));
    root.position.x=THREE.MathUtils.lerp(.08,0,easeOutCubic(windowFade(t,.04,.54)));
    root.rotation.x=THREE.MathUtils.lerp(.10,target.x,orient);
    root.rotation.y=THREE.MathUtils.lerp(-1.52,target.y,orient);
    root.rotation.z=THREE.MathUtils.lerp(-.035,target.z,easeInOutCubic(windowFade(t,.38,.92)));

    surfaces.forEach((s,i)=>{
      const stagger=i*.032;
      s.mesh.material.opacity=.98*windowFade(t,.30+stagger,.60+stagger);
    });
    render();
    if(t<1)requestAnimationFrame(frame);else finishStill();
  }
  requestAnimationFrame(frame);
}

const raycaster=new THREE.Raycaster();
const pointer=new THREE.Vector2();
function raySurface(ev){
  const r=renderer.domElement.getBoundingClientRect();
  pointer.x=((ev.clientX-r.left)/r.width)*2-1;
  pointer.y=-((ev.clientY-r.top)/r.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  return raycaster.intersectObjects(surfaces.map(s=>s.hit),false)[0]?.object?.userData?.surfaceKey||null;
}

let hoverKey=null;
renderer.domElement.addEventListener('pointermove',ev=>{
  if(coarsePointer||document.documentElement.dataset.r5State!=='rest')return;
  const key=raySurface(ev);
  if(key===hoverKey)return;
  hoverKey=key;
  renderer.domElement.style.cursor=key?'pointer':'default';
  if(key){
    const target=POSES[key]||POSES.final;
    POSES.__hover={
      x:THREE.MathUtils.lerp(POSES.final.x,target.x,.34),
      y:THREE.MathUtils.lerp(POSES.final.y,target.y,.34),
      z:THREE.MathUtils.lerp(POSES.final.z,target.z,.34)
    };
    animatePose('__hover',480);
  }else{
    animatePose('final',620);
  }
},{passive:true});

renderer.domElement.addEventListener('pointerleave',()=>{
  if(coarsePointer||!hoverKey)return;
  hoverKey=null;
  renderer.domElement.style.cursor='default';
  animatePose('final',620);
},{passive:true});

renderer.domElement.addEventListener('pointerup',ev=>{
  if(!coarsePointer||document.documentElement.dataset.r5State!=='rest')return;
  const key=raySurface(ev);
  if(key)animatePose(key,720);
},{passive:true});

document.querySelectorAll('[data-r5-face]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const face=btn.dataset.r5Face;
    if(activePose===face) animatePose('final',620);
    else animatePose(face,coarsePointer?680:760);
  });
});

const resizeObserver=new ResizeObserver(applyLayout);
resizeObserver.observe(stage);

async function boot(){
  try{await document.fonts.ready}catch{}
  applyLayout();
  intro();
}
boot();

window.__PROAI_R5__={
  version:'R5.1-near-cube',
  get state(){return document.documentElement.dataset.r5State||'boot'},
  pose:name=>animatePose(name,0),
  render,
  labels:LABELS.map(x=>({...x,vendors:[...x.vendors]}))
};