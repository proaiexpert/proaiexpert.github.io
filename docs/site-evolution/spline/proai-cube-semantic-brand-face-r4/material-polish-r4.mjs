import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const R441_SHA = '65adaa0bb3fb356bdc031646fd9eef6ddfb737fc';
const PRODUCT_PATH = 'docs/site-evolution/spline/proai-cube-semantic-brand-face-r4/material-polish-r4.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../../..');
const baselineTemp = path.join(here, '.material-polish-r441-base.tmp.mjs');
const generatedFile = path.join(here, 'main.generated.js');

let baseline;
try {
  baseline = execFileSync('git', ['show', `${R441_SHA}:${PRODUCT_PATH}`], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });
} catch (error) {
  throw new Error(`R4.4.2 requires reachable frozen R4.4.1 ${R441_SHA}: ${error.message}`);
}

fs.writeFileSync(baselineTemp, baseline);
try {
  execFileSync(process.execPath, [baselineTemp], { cwd: here, stdio: 'inherit' });
} finally {
  fs.rmSync(baselineTemp, { force: true });
}

let source = fs.readFileSync(generatedFile, 'utf8');

const replaceOne = (find, replacement, label) => {
  const first = source.indexOf(find);
  const second = first >= 0 ? source.indexOf(find, first + find.length) : -1;
  if (first < 0 || second >= 0) throw new Error(`R4.4.2 anchor ${label}: first=${first} second=${second}`);
  source = source.slice(0, first) + replacement + source.slice(first + find.length);
};
const replaceRegex = (pattern, replacement, label) => {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  const matches = [...source.matchAll(new RegExp(pattern.source, flags))];
  if (matches.length !== 1) throw new Error(`R4.4.2 regex ${label}: expected 1, got ${matches.length}`);
  source = source.replace(pattern, replacement);
};

for (const required of [
  'R4_4_1_PHYSICAL_MICRO_ENGRAVED_',
  'r441HorizontalReductionPct:12.5',
  'r441VerticalReductionPct:10',
  'edgeRoughnessInk:.095',
  'semanticVelocityMultiplier: 1.0',
  'const deltaMs=wallDeltaMs',
  'overlayTextRendered:false',
  'alphaDominantReveal:false',
  'semanticMotionCoupled:false',
  'semanticOrientationForcing:false',
  'await schedulerDelay(680)',
  'unsafeReturnGuardMs:3000',
]) if (!source.includes(required)) throw new Error(`R4.4.2 missing frozen R4.4.1 invariant: ${required}`);

const planar = String.raw`function createSemanticR44PlanarFaceGeometry(mesh,sourceGeometry,face='+Z'){const geometry=sourceGeometry.clone(),position=geometry.getAttribute('position');if(!position)throw new Error('R4.4.2 engraved face missing positions');sceneOne.updateMatrixWorld(true);mesh.updateMatrixWorld(true);const xy=new Float32Array(position.count*2),p=new THREE.Vector3();let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;for(let i=0;i<position.count;i++){p.fromBufferAttribute(position,i);mesh.localToWorld(p);sceneOne.worldToLocal(p);let u=p.x,v=p.y;if(face==='+X'){u=-p.z;v=p.y}else if(face==='-X'){u=p.z;v=p.y}xy[i*2]=u;xy[i*2+1]=v;minX=Math.min(minX,u);maxX=Math.max(maxX,u);minY=Math.min(minY,v);maxY=Math.max(maxY,v)}const spanX=Math.max(1e-6,maxX-minX),spanY=Math.max(1e-6,maxY-minY),uv=new Float32Array(position.count*2);for(let i=0;i<position.count;i++){uv[i*2]=THREE.MathUtils.clamp((xy[i*2]-minX)/spanX,0,1);uv[i*2+1]=THREE.MathUtils.clamp((xy[i*2+1]-minY)/spanY,0,1)}geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));geometry.userData.semanticR442PlanarUv={face,projection:face==='+Z'?'sceneOne XY':face==='+X'?'sceneOne -ZY':'sceneOne ZY',spanX,spanY};return geometry}`;
replaceRegex(/function createSemanticR44PlanarFaceGeometry\(mesh,sourceGeometry\)\{[\s\S]*?return geometry\}/, planar, 'multi-face planar UV');

const meshCollectorAndMaterial = String.raw`function semanticR442FaceTileCoords(face,logical){if(face==='+Z')return{u:logical.x,v:logical.y};if(face==='+X')return{u:-logical.z,v:logical.y};if(face==='-X')return{u:logical.z,v:logical.y};throw new Error('R4.4.2 unsupported semantic face '+face)}
function createSemanticR442TileMask(globalTexture,face,logical){const c=semanticR442FaceTileCoords(face,logical),src=globalTexture.image,size=768,canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d',{alpha:true}),cell=src.width/3,col=c.u+1,row=1-c.v;ctx.clearRect(0,0,size,size);ctx.drawImage(src,col*cell,row*cell,cell,cell,0,0,size,size);const t=makeSemanticDataTexture(canvas);t.userData.semanticR442Tile={face,u:c.u,v:c.v};return t}
function collectSemanticPhysicalMeshes(cubie,face='+Z'){const found=[],target=semanticFaceNormal(face);sceneOne.updateMatrixWorld(true);for(const member of cubie.members){member.object.traverse(object=>{if(!object.isMesh||object.name==='Plane'||!object.material?.isMeshPhysicalMaterial||!isSemanticFaceGeometry(object))return;const normal=semanticSceneLocalNormal(object);if(normal.dot(target)>.86)found.push(object)})}return[...new Set(found)]}
function createPhysicalEngravedMaterial(mesh,baseMaterial,maskTexture,roughnessTexture,face='+Z'){mesh.geometry=createSemanticR44PlanarFaceGeometry(mesh,mesh.geometry,face);const bevelTexture=createSemanticR44BevelTile(maskTexture),toneTexture=createSemanticR44ToneTile(maskTexture),m=baseMaterial.clone();m.name='R4_4_2_PHYSICAL_MICRO_ENGRAVED_'+face+'_'+(baseMaterial.name||'FACE');m.bumpMap=bevelTexture;m.bumpScale=-.012;m.roughnessMap=null;if('clearcoatRoughnessMap' in m)m.clearcoatRoughnessMap=null;m.map=baseMaterial.map||null;m.userData.semanticMaterial='SEMANTIC_R4_4_2_DYNAMIC_PHYSICAL_MICRO_ENGRAVING';m.userData.semanticFace=face;m.userData.semanticTileMask=maskTexture;m.userData.semanticBeveledBump=bevelTexture;m.userData.semanticRoughnessMap=roughnessTexture;m.userData.semanticToneMap=toneTexture;m.userData.semanticBaseMap=baseMaterial.map||null;m.userData.semanticPlanarUv=true;m.userData.semanticR44BeveledBump=true;m.userData.semanticR44SceneProjectedUv=true;m.userData.semanticR441PearlEdgeRoughness=roughnessTexture.userData.semanticR441PearlEdgeRoughness||null;m.userData.semanticR442Dormant=true;m.needsUpdate=true;return m}`;
replaceRegex(/function collectSemanticPhysicalMeshes\(cubie\)\{[\s\S]*?function createPhysicalEngravedMaterial\(mesh,baseMaterial,maskTexture,roughnessTexture\)\{[\s\S]*?return m\}/, meshCollectorAndMaterial, 'multi-face mesh collector + physical material');

const registryInstall = String.raw`const SEMANTIC_R442_ELIGIBLE_FACES=Object.freeze(['+Z','+X','-X']);
const semanticR442FaceRegistry=new Map();
let semanticR442ActiveMaterialFace=null;
function semanticR442FaceDefinition(face){if(face==='+Z')return{face,axis:'Z',layer:1,normal:[0,0,1]};if(face==='+X')return{face,axis:'X',layer:1,normal:[1,0,0]};if(face==='-X')return{face,axis:'X',layer:-1,normal:[-1,0,0]};return null}
function semanticR442SetActiveMaterialFace(face){if(face!==null&&!SEMANTIC_R442_ELIGIBLE_FACES.includes(face))return false;semanticR442ActiveMaterialFace=face;for(const entry of semanticEngravedTiles){const active=entry.face===face,m=entry.material;m.bumpScale=active?SEMANTIC_R4_3_ENGRAVING.bumpScale:-.012;m.roughnessMap=active?entry.rough:null;if('clearcoatRoughnessMap' in m)m.clearcoatRoughnessMap=active?entry.rough:null;m.map=active?(m.userData.semanticToneMap||m.userData.semanticBaseMap||null):(m.userData.semanticBaseMap||null);m.userData.semanticR442Dormant=!active;m.needsUpdate=true}return true}
function installPhysicalSemanticEngraving(globalTexture){semanticEngravedTiles=[];semanticR442FaceRegistry.clear();let faceTileCount=0;for(const face of SEMANTIC_R442_ELIGIBLE_FACES){const def=semanticR442FaceDefinition(face),cubies=physicalCubies.filter(c=>axisComponent(c.logical,def.axis)===def.layer),ids=new Set(),tiles=[];if(cubies.length!==9)throw new Error('R4.4.2 expected 9 cubies on '+face+', got '+cubies.length);for(const cubie of cubies){const coords=semanticR442FaceTileCoords(face,cubie.logical),mask=createSemanticR442TileMask(globalTexture,face,cubie.logical),rough=createSemanticR441PearlRoughnessTile(mask),meshes=collectSemanticPhysicalMeshes(cubie,face);if(!meshes.length)throw new Error('R4.4.2 missing outward '+face+' face mesh for cubie '+cubie.id);for(const mesh of meshes){const material=createPhysicalEngravedMaterial(mesh,mesh.material,mask,rough,face);mesh.material=material;mesh.userData.semanticEngravedTile={face,logical:{...cubie.logical},u:coords.u,v:coords.v,physical:true};const tile={face,cubieId:cubie.id,mesh,material,mask,rough,u:coords.u,v:coords.v,origin:{...cubie.logical}};tiles.push(tile);semanticEngravedTiles.push(tile)}ids.add(cubie.id);faceTileCount++}semanticR442FaceRegistry.set(face,{...def,ids,tiles,lastUsedPresentationMs:-Infinity})}semanticEngravedLogicalTileCount=faceTileCount;if(faceTileCount!==27)throw new Error('R4.4.2 physical semantic face-tile coverage expected 27, got '+faceTileCount);semanticR442SetActiveMaterialFace(null);return semanticEngravedTiles.length}`;
replaceRegex(/function installPhysicalSemanticEngraving\(globalTexture\)\{[\s\S]*?return semanticEngravedTiles.length\}/, registryInstall, 'three eligible physical face registries');

const optics = String.raw`function updateSemanticPhysicalOptics(mesh,logical){if(!mesh?.userData?.semanticEngravedTile)return;const face=mesh.userData.semanticEngravedTile.face;if(face!==semanticR442ActiveMaterialFace)return;const q=semanticR442EvaluateFace(face,false);if(q){semanticR43OpticalDiagnostics={alignment:q.brdfQuality,faceView:q.viewAlignment,halfDot:q.halfDot,signedFaceView:q.signedFaceView,signedHalfDot:q.signedHalfDot,frontFacing:q.signedFaceView>0,fieldCenter:[.5,.5],fieldAxis:[1,0],opportunity:q.rawQuality,persistent:true,microNormal:true,alphaDominant:false,engravedFace:face,physicalCubieMaterial:true,visualDriverTimeline:false,naturalOpportunityCount:semanticR43OpportunityCount}}}`;
replaceRegex(/function updateSemanticPhysicalOptics\(mesh,logical\)\{[\s\S]*?\}\nfunction createSemanticTextMaterial/, `${optics}\nfunction createSemanticTextMaterial`, 'dynamic face optical observation');

const stateBlock = String.raw`const SEMANTIC_R442_CADENCE=Object.freeze({currentCopy:'ProAI Expert only',futureFiveSemanticCompatible:true,targetFullLoopSec:[20,35],occasionalExtensionSec:40,hardMaxNormalSec:40,firstDiscoveryTargetSec:[3,6],clearReadableTargetSec:[1.2,2.2],protectedEnvelopeTargetSec:[1.8,3.2],metronomic:false,topFaceEligible:false});
const SEMANTIC_R442_QUALITY=Object.freeze({approachScore:.50,enterScore:.76,exitScore:.61,minView:.58,exitView:.50,minAreaQuality:.34,minBrdf:.26,releaseDebounceMs:180,maxProtectedMs:3200,materialDormantScore:.38,reselectCooldownMs:520,recentFaceWindowMs:13000});
const semanticR442State={protected:false,protectedFace:null,protectedSinceMs:null,belowExitSinceMs:null,nextEligiblePresentationMs:R44_INITIAL_PRESENTATION_PHASE_MS+2200,activeMaterialFace:null,activeFaceApproachSinceMs:null,lastReleasedFace:null,lastReleasedAtMs:-Infinity,releaseCount:0,protectionCount:0,assemblyViolations:0,unsafeProtectedStarts:0,faceSelections:[],protectedIntervals:[],candidateScores:[],postReleaseParticipationCount:0,lastPostReleaseParticipation:null};
const semanticR442MoveState={recentMoves:[],moveLog:[],axisCounts:{X:0,Y:0,Z:0},layerCounts:{'-1':0,'0':0,'1':0},selectionCount:0,replacements:0,skipped:0};`;
replaceRegex(/const SEMANTIC_R441_CADENCE=Object\.freeze\([\s\S]*?const semanticR441Safety=\{[\s\S]*?\};\n/, stateBlock+'\n', 'R4.4.2 cadence + dynamic protection state');

const dynamicSafetyHelpers = String.raw`function semanticR442FaceAssembled(face){const reg=semanticR442FaceRegistry.get(face);if(!reg||reg.ids.size!==9)return false;const identity=[1,0,0,0,1,0,0,0,1];for(const cubie of physicalCubies){if(!reg.ids.has(cubie.id))continue;const origin=cubie.id.split('|').map(Number);if(cubie.logical.x!==origin[0]||cubie.logical.y!==origin[1]||cubie.logical.z!==origin[2]||cubie.orientation.some((v,i)=>v!==identity[i]))return false}return true}
function semanticR442ProjectedAreaQuality(face){const reg=semanticR442FaceRegistry.get(face);if(!reg)return 0;let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,count=0;const used=new Set();for(const tile of reg.tiles){if(used.has(tile.cubieId))continue;used.add(tile.cubieId);const p=tile.mesh.getWorldPosition(new THREE.Vector3()).project(camera);if(!Number.isFinite(p.x)||!Number.isFinite(p.y))continue;minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y);count++}if(count<4)return 0;const area=Math.max(0,(maxX-minX)*(maxY-minY));return THREE.MathUtils.clamp(area/.42,0,1)}
function semanticR442RecentFacePenalty(face){const reg=semanticR442FaceRegistry.get(face);if(!reg)return 0;const age=presentationSimTimeMs-reg.lastUsedPresentationMs;if(age>=SEMANTIC_R442_QUALITY.recentFaceWindowMs)return 1;return THREE.MathUtils.lerp(.72,1,THREE.MathUtils.clamp(age/SEMANTIC_R442_QUALITY.recentFaceWindowMs,0,1))}
function semanticR442EvaluateFace(face,applyRecent=true){const reg=semanticR442FaceRegistry.get(face);if(!reg)return null;const assembled=semanticR442FaceAssembled(face);if(!assembled)return{face,assembled:false,rawQuality:0,selectionScore:0,viewAlignment:0,projectedAreaQuality:0,distortionPenalty:0,brdfQuality:0,recentFacePenalty:semanticR442RecentFacePenalty(face)};sceneOne.updateMatrixWorld(true);camera.updateMatrixWorld(true);key.updateMatrixWorld(true);const center=sceneOne.localToWorld(cubeCenterLocal.clone()),worldQ=sceneOne.getWorldQuaternion(new THREE.Quaternion()),normal=semanticFaceNormal(face).applyQuaternion(worldQ).normalize(),cameraWorld=camera.getWorldPosition(new THREE.Vector3()),view=cameraWorld.clone().sub(center).normalize(),signedFaceView=normal.dot(view),viewAlignment=THREE.MathUtils.clamp(signedFaceView,0,1),area=semanticR442ProjectedAreaQuality(face),distortion=THREE.MathUtils.smoothstep(viewAlignment,.50,.86),lightWorld=key.getWorldPosition(new THREE.Vector3()),lightDir=lightWorld.clone().sub(center).normalize(),half=view.clone().add(lightDir).normalize(),signedHalfDot=normal.dot(half),halfDot=THREE.MathUtils.clamp(signedHalfDot,0,1),brdf=THREE.MathUtils.smoothstep(halfDot,.54,.90),viewQ=THREE.MathUtils.smoothstep(viewAlignment,.50,.88),areaQ=THREE.MathUtils.smoothstep(area,.20,.78),raw=assembled?THREE.MathUtils.clamp(.46*viewQ+.18*areaQ+.24*brdf+.12*distortion,0,1):0,recent=semanticR442RecentFacePenalty(face),selection=raw*(applyRecent?recent:1);return{face,assembled,rawQuality:raw,selectionScore:selection,viewAlignment,projectedAreaQuality:area,distortionPenalty:distortion,brdfQuality:brdf,halfDot,signedHalfDot,signedFaceView,recentFacePenalty:recent}}
function semanticR442BestFace(){const list=SEMANTIC_R442_ELIGIBLE_FACES.map(f=>semanticR442EvaluateFace(f,true)).filter(Boolean).sort((a,b)=>b.selectionScore-a.selectionScore);semanticR442State.candidateScores=list.map(x=>({...x}));return list[0]||null}
function semanticR442ReleaseProtection(reason='optical-exit'){if(!semanticR442State.protected)return false;const now=presentationSimTimeMs,start=semanticR442State.protectedSinceMs??now,face=semanticR442State.protectedFace;semanticR442State.protectedIntervals.push({face,startMs:start,endMs:now,durationSec:Math.max(0,now-start)/1000,reason});if(semanticR442State.protectedIntervals.length>24)semanticR442State.protectedIntervals.shift();semanticR442State.protected=false;semanticR442State.protectedFace=null;semanticR442State.protectedSinceMs=null;semanticR442State.belowExitSinceMs=null;semanticR442State.lastReleasedFace=face;semanticR442State.lastReleasedAtMs=now;semanticR442State.nextEligiblePresentationMs=now+SEMANTIC_R442_QUALITY.reselectCooldownMs;semanticR442State.releaseCount++;return true}
function semanticR442UpdateProtectionState(){const now=presentationSimTimeMs;if(semanticR442State.protected){const q=semanticR442EvaluateFace(semanticR442State.protectedFace,false),elapsed=now-(semanticR442State.protectedSinceMs??now);if(!q?.assembled){semanticR442State.assemblyViolations++;semanticR442ReleaseProtection('assembly-lost');return}const readable=q.rawQuality>=SEMANTIC_R442_QUALITY.exitScore&&q.viewAlignment>=SEMANTIC_R442_QUALITY.exitView;if(readable)semanticR442State.belowExitSinceMs=null;else if(semanticR442State.belowExitSinceMs===null)semanticR442State.belowExitSinceMs=now;if(elapsed>=SEMANTIC_R442_QUALITY.maxProtectedMs){semanticR442ReleaseProtection('max-cap');return}if(semanticR442State.belowExitSinceMs!==null&&now-semanticR442State.belowExitSinceMs>=SEMANTIC_R442_QUALITY.releaseDebounceMs){semanticR442ReleaseProtection('stable-optical-exit');return}semanticR43OpticalDiagnostics={...semanticR43OpticalDiagnostics,alignment:q.brdfQuality,faceView:q.viewAlignment,halfDot:q.halfDot,signedFaceView:q.signedFaceView,signedHalfDot:q.signedHalfDot,frontFacing:q.signedFaceView>0,opportunity:q.rawQuality,engravedFace:q.face};return}if(activeTurns.size>0)return;const best=semanticR442BestFace();if(!best)return;if(best.rawQuality>=SEMANTIC_R442_QUALITY.approachScore&&best.viewAlignment>=SEMANTIC_R442_QUALITY.exitView&&best.assembled){if(semanticR442ActiveMaterialFace!==best.face)semanticR442SetActiveMaterialFace(best.face);semanticR442State.activeMaterialFace=best.face}else if(semanticR442ActiveMaterialFace&&best.rawQuality<SEMANTIC_R442_QUALITY.materialDormantScore){semanticR442SetActiveMaterialFace(null);semanticR442State.activeMaterialFace=null}if(now<semanticR442State.nextEligiblePresentationMs)return;if(best.assembled&&best.rawQuality>=SEMANTIC_R442_QUALITY.enterScore&&best.viewAlignment>=SEMANTIC_R442_QUALITY.minView&&best.projectedAreaQuality>=SEMANTIC_R442_QUALITY.minAreaQuality&&best.brdfQuality>=SEMANTIC_R442_QUALITY.minBrdf){semanticR442SetActiveMaterialFace(best.face);semanticR442State.activeMaterialFace=best.face;semanticR442State.protected=true;semanticR442State.protectedFace=best.face;semanticR442State.protectedSinceMs=now;semanticR442State.belowExitSinceMs=null;semanticR442State.protectionCount++;const reg=semanticR442FaceRegistry.get(best.face);if(reg)reg.lastUsedPresentationMs=now;semanticR442State.faceSelections.push({face:best.face,presentationMs:now,quality:best.rawQuality,view:best.viewAlignment,area:best.projectedAreaQuality,brdf:best.brdfQuality});if(semanticR442State.faceSelections.length>20)semanticR442State.faceSelections.shift()}}
function semanticR442MoveIntersection(move,face=semanticR442State.protectedFace){const reg=face?semanticR442FaceRegistry.get(face):null;if(!reg)return{count:0,ids:[]};const selected=selectLayer(move.axis,move.layer),ids=selected.filter(c=>reg.ids.has(c.id)).map(c=>c.id);return{count:ids.length,ids}}
function semanticR442RecentWeight(move){let w=1;const recent=semanticR442MoveState.recentMoves;for(let i=0;i<recent.length;i++){const age=recent.length-1-i,r=recent[i],decay=age===0?1:age===1?.72:age===2?.48:.28;if(r.axis===move.axis&&r.layer===move.layer&&r.direction===move.direction)w*=1-.88*decay;else{if(r.axis===move.axis)w*=1-.42*decay;if(r.layer===move.layer)w*=1-.24*decay;if(r.direction===move.direction)w*=1-.08*decay}}const recentAxes=new Set(recent.slice(-4).map(r=>r.axis));if(!recentAxes.has(move.axis))w*=1.72;const recentLayers=new Set(recent.slice(-4).map(r=>r.layer));if(!recentLayers.has(move.layer))w*=1.22;const released=semanticR442State.lastReleasedFace;if(!semanticR442State.protected&&released&&presentationSimTimeMs-semanticR442State.lastReleasedAtMs<8500&&semanticR442MoveIntersection(move,released).count>0)w*=1.48;return Math.max(.015,w)}
function semanticR442AllMoveCandidates(){const list=[];for(const axis of AXES)for(const layer of LAYERS)for(const direction of[-1,1])list.push({axis,layer,direction,durationMs:Math.round(seededRange(...SLICE_R1_2.turnDurationRangeMs))});return list}
function semanticR442SelectMove(){let candidates=semanticR442AllMoveCandidates();if(semanticR442State.protected)candidates=candidates.filter(m=>semanticR442MoveIntersection(m).count===0);if(!candidates.length){semanticR442MoveState.skipped++;return null}const weighted=candidates.map(move=>({move,weight:semanticR442RecentWeight(move)})),total=weighted.reduce((s,x)=>s+x.weight,0);let pick=seededUnit()*total;for(const item of weighted){pick-=item.weight;if(pick<=0)return item.move}return weighted.at(-1).move}
function semanticR442RecordMove(move,phase='forward'){const intersection=semanticR442State.protected?semanticR442MoveIntersection(move):{count:0,ids:[]};if(semanticR442State.protected&&intersection.count>0)semanticR442State.unsafeProtectedStarts++;if(phase==='forward'){semanticR442MoveState.recentMoves.push({axis:move.axis,layer:move.layer,direction:move.direction,presentationMs:presentationSimTimeMs});if(semanticR442MoveState.recentMoves.length>5)semanticR442MoveState.recentMoves.shift();semanticR442MoveState.axisCounts[move.axis]=(semanticR442MoveState.axisCounts[move.axis]||0)+1;semanticR442MoveState.layerCounts[String(move.layer)]=(semanticR442MoveState.layerCounts[String(move.layer)]||0)+1;semanticR442MoveState.selectionCount++;const released=semanticR442State.lastReleasedFace;if(released&&presentationSimTimeMs-semanticR442State.lastReleasedAtMs<10000&&semanticR442MoveIntersection(move,released).count>0){semanticR442State.postReleaseParticipationCount++;semanticR442State.lastPostReleaseParticipation={face:released,presentationMs:presentationSimTimeMs,move:{axis:move.axis,layer:move.layer,direction:move.direction}}}}semanticR442MoveState.moveLog.push({presentationMs:presentationSimTimeMs,phase,axis:move.axis,layer:move.layer,direction:move.direction,protected:semanticR442State.protected,protectedFace:semanticR442State.protectedFace,semanticIntersection:intersection.count});if(semanticR442MoveState.moveLog.length>120)semanticR442MoveState.moveLog.shift();return intersection}`;
replaceRegex(/function semanticR441ReadabilityScore\(\)\{[\s\S]*?function semanticR441RecordMoveStart\(move,phase\)\{[\s\S]*?return intersection\}\n/, dynamicSafetyHelpers+'\n', 'dynamic best-face protection + weighted scheduler helpers');

replaceOne(
  '  updateSemanticR441ProtectionState();',
  '  semanticR442UpdateProtectionState();',
  'per-frame dynamic best-face protection',
);

const scheduler = String.raw`async function sliceSchedulerLoop(){if(sliceSchedulerRunning)return;sliceSchedulerRunning=true;await schedulerDelay(420);while(sliceSchedulerEnabled){if(!await waitForSliceAutonomy())break;const r=seededUnit(),requestedLength=r<.34?1:r<.82?2:3,executed=[];for(let i=0;i<requestedLength&&sliceSchedulerEnabled;i++){if(!await waitForSliceAutonomy())break;const move=semanticR442SelectMove();if(!move)break;semanticR442RecordMove(move,'forward');const result=await turnSlice(move);if(!result)break;executed.push(move);if(i<requestedLength-1)await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)))}if(!executed.length){await schedulerDelay(110);continue}await schedulerDelay(Math.round(seededRange(240,410)));for(let i=executed.length-1;i>=0;i--){if(!await waitForSliceAutonomy())break;const move=executed[i],inverse={...move,direction:-move.direction,durationMs:move.durationMs};semanticR442RecordMove(inverse,'resolve');await turnSlice(inverse);if(i>0)await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)))}sliceEventSerial+=executed.length;eventsUntilBreath-=1;if(!sliceSchedulerEnabled)break;if(eventsUntilBreath<=0){await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.breathingGapRangeMs)));eventsUntilBreath=seededInt(3,4)}else await schedulerDelay(Math.round(seededRange(520,980)))}sliceSchedulerRunning=false}`;
replaceRegex(/async function sliceSchedulerLoop\(\) \{[\s\S]*?sliceSchedulerRunning = false;\n\}/, scheduler, 'full multi-axis weighted self-resolving scheduler');

const diagnostics = String.raw`r442TypographyScale:semanticMaskTexture?.userData?.semanticR441TypographyScale||null,
    r442Material:{bumpScale:-.130,dormantBumpScale:-.012,roughnessMapInk:.550,tonalInk:.820,pearlEdgeRoughnessInk:.095,uniformSilverFill:false,topReflectorIntensity:.92,topReflectorAnimated:false,activeMaterialFace:semanticR442ActiveMaterialFace,physicalFaceCandidates:[...SEMANTIC_R442_ELIGIBLE_FACES],topFaceEligible:false},
    r442DynamicFace:{eligibleFaces:[...SEMANTIC_R442_ELIGIBLE_FACES],selectedMaterialFace:semanticR442ActiveMaterialFace,candidates:semanticR442State.candidateScores.map(x=>({...x})),faceSelections:[...semanticR442State.faceSelections],protected:semanticR442State.protected,protectedFace:semanticR442State.protectedFace,protectionCount:semanticR442State.protectionCount,releaseCount:semanticR442State.releaseCount,protectedIntervals:[...semanticR442State.protectedIntervals],lastReleasedFace:semanticR442State.lastReleasedFace,lastReleasedAtMs:semanticR442State.lastReleasedAtMs,postReleaseParticipationCount:semanticR442State.postReleaseParticipationCount,lastPostReleaseParticipation:semanticR442State.lastPostReleaseParticipation,assemblyViolations:semanticR442State.assemblyViolations,unsafeProtectedStarts:semanticR442State.unsafeProtectedStarts,qualityThresholds:SEMANTIC_R442_QUALITY},
    r442MoveDiversity:{recentMoves:[...semanticR442MoveState.recentMoves],moveLog:[...semanticR442MoveState.moveLog],axisCounts:{...semanticR442MoveState.axisCounts},layerCounts:{...semanticR442MoveState.layerCounts},selectionCount:semanticR442MoveState.selectionCount,skipped:semanticR442MoveState.skipped},
    r442Cadence:SEMANTIC_R442_CADENCE,`;
replaceRegex(/r441TypographyScale:[\s\S]*?r441Cadence:SEMANTIC_R441_CADENCE,/, diagnostics, 'R4.4.2 diagnostics');

for (const forbidden of [
  'unsafeReturnGuardMs:3000',
  'semanticR441UnsafePhraseWindowOpen',
  'semanticR441SelectScheduledMove',
  'totalLoopSec:19.0',
  'await schedulerDelay(680)',
]) if (source.includes(forbidden)) throw new Error('R4.4.2 retained restrictive R4.4.1 mechanism: '+forbidden);

for (const required of [
  'semanticVelocityMultiplier: 1.0',
  'const deltaMs=wallDeltaMs',
  'overlayTextRendered:false',
  'alphaDominantReveal:false',
  'semanticMotionCoupled:false',
  'semanticOrientationForcing:false',
  'R4_4_2_PHYSICAL_MICRO_ENGRAVED_',
  'SEMANTIC_R442_ELIGIBLE_FACES',
  "['+Z','+X','-X']",
  'topFaceEligible:false',
  'semanticR442EvaluateFace',
  'semanticR442ProjectedAreaQuality',
  'semanticR442RecentFacePenalty',
  'semanticR442UpdateProtectionState',
  'releaseDebounceMs:180',
  'maxProtectedMs:3200',
  'semanticR442SelectMove',
  'semanticR442RecentWeight',
  'postReleaseParticipationCount',
  'axisCounts:{X:0,Y:0,Z:0}',
  'targetFullLoopSec:[20,35]',
  'hardMaxNormalSec:40',
  'clearReadableTargetSec:[1.2,2.2]',
  'protectedEnvelopeTargetSec:[1.8,3.2]',
  'R44_INITIAL_PRESENTATION_PHASE_MS = 16000',
  'R44_INITIAL_PRESENTATION_YAW_DEG = 342.55902777777777',
]) if (!source.includes(required)) throw new Error('R4.4.2 missing invariant: '+required);

fs.writeFileSync(generatedFile, source);
console.log('R4.4.2 dynamic best-face / full multi-axis choreography applied');
console.log('R4.4.1 base:', R441_SHA);
console.log('eligible semantic faces: +Z / +X / -X; top excluded');
console.log('protection: optical hysteresis, 180ms stable-exit debounce, 3.2s safety cap');
console.log('scheduler: full X/Y/Z weighted diversity outside brief protection; recent 5 move suppression; post-release face rejoin weighting');
console.log('material: physical bump/roughness/tone only; dormant non-selected faces, no alpha/emissive/overlay');
