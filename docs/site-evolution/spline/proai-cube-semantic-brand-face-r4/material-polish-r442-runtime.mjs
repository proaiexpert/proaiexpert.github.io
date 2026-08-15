import fs from 'node:fs';

const file = new URL('./main.generated.js', import.meta.url);
let source = fs.readFileSync(file, 'utf8');

const replaceUnique = (find,replacement,label)=>{const at=source.indexOf(find),next=at>=0?source.indexOf(find,at+find.length):-1;if(at<0||next>=0)throw new Error(`R4.4.2 runtime ${label}: ${at}/${next}`);source=source.slice(0,at)+replacement+source.slice(at+find.length)};

const anchor='function semanticR442FaceTileCoords(face,logical){';
const anchorAt=source.indexOf(anchor);
if(anchorAt<0||source.indexOf(anchor,anchorAt+anchor.length)>=0)throw new Error(`R4.4.2 runtime helper anchor invalid: ${anchorAt}`);

const helpers=`function createSemanticR442PlanarFaceGeometry(mesh,sourceGeometry,face='+Z'){const geometry=sourceGeometry.clone(),position=geometry.getAttribute('position');if(!position)throw new Error('R4.4.2 engraved face missing positions');sceneOne.updateMatrixWorld(true);mesh.updateMatrixWorld(true);const xy=new Float32Array(position.count*2),p=new THREE.Vector3();let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;for(let i=0;i<position.count;i++){p.fromBufferAttribute(position,i);mesh.localToWorld(p);sceneOne.worldToLocal(p);let u=p.x,v=p.y;if(face==='+X'){u=-p.z;v=p.y}else if(face==='-X'){u=p.z;v=p.y}xy[i*2]=u;xy[i*2+1]=v;minX=Math.min(minX,u);maxX=Math.max(maxX,u);minY=Math.min(minY,v);maxY=Math.max(maxY,v)}const spanX=Math.max(1e-6,maxX-minX),spanY=Math.max(1e-6,maxY-minY),uv=new Float32Array(position.count*2);for(let i=0;i<position.count;i++){uv[i*2]=THREE.MathUtils.clamp((xy[i*2]-minX)/spanX,0,1);uv[i*2+1]=THREE.MathUtils.clamp((xy[i*2+1]-minY)/spanY,0,1)}geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));geometry.userData.semanticR442PlanarUv={face,projection:face==='+Z'?'sceneOne XY':face==='+X'?'sceneOne -ZY':'sceneOne ZY',spanX,spanY};return geometry}\nfunction createSemanticR442BevelTile(maskTexture){const src=maskTexture.image,size=src.width,canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d',{alpha:false});ctx.fillStyle='#000000';ctx.fillRect(0,0,size,size);ctx.save();ctx.filter='blur(5px)';ctx.globalAlpha=.74;ctx.drawImage(src,0,0);ctx.restore();ctx.globalAlpha=.26;ctx.drawImage(src,0,0);ctx.globalAlpha=1;const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.NoColorSpace;t.minFilter=THREE.LinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.needsUpdate=true;t.userData.semanticR44BeveledBump=true;t.userData.semanticR442BeveledBump=true;return t}\nfunction createSemanticR442ToneTile(maskTexture){const src=maskTexture.image,size=src.width,canvas=document.createElement('canvas'),ink=document.createElement('canvas');canvas.width=size;canvas.height=size;ink.width=size;ink.height=size;const ctx=canvas.getContext('2d',{alpha:false}),ic=ink.getContext('2d',{alpha:true});ctx.fillStyle='#ffffff';ctx.fillRect(0,0,size,size);ic.clearRect(0,0,size,size);ic.drawImage(src,0,0);ic.globalCompositeOperation='source-in';const v=Math.round(255*SEMANTIC_R4_3_ENGRAVING.tonalInk);ic.fillStyle='rgb('+v+','+v+','+v+')';ic.fillRect(0,0,size,size);ctx.drawImage(ink,0,0);const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.minFilter=THREE.LinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.needsUpdate=true;t.userData.semanticR442Tone=true;return t}\n`;
source=source.slice(0,anchorAt)+helpers+source.slice(anchorAt);

replaceUnique('createSemanticR44PlanarFaceGeometry(mesh,mesh.geometry,face)','createSemanticR442PlanarFaceGeometry(mesh,mesh.geometry,face)','planar call');
replaceUnique('createSemanticR44BevelTile(maskTexture)','createSemanticR442BevelTile(maskTexture)','bevel call');
replaceUnique('createSemanticR44ToneTile(maskTexture)','createSemanticR442ToneTile(maskTexture)','tone call');

// R4.4.2 timing is relative to the inherited 16s presentation phase offset.
// First discovery therefore arms 3.4s after load, not at absolute sim-time 2.6s.
replaceUnique("approachScore:.50,enterScore:.76,exitScore:.61,minView:.58,exitView:.50","approachScore:.58,enterScore:.76,exitScore:.54,minView:.58,exitView:.50",'optical hysteresis calibration');
replaceUnique('reselectCooldownMs:520,recentFaceWindowMs:13000','reselectCooldownMs:900,recentFaceWindowMs:13000,rearmScore:.50','re-arm and anti-thrash calibration');
replaceUnique('nextEligiblePresentationMs:R44_INITIAL_PRESENTATION_PHASE_MS+2200','nextEligiblePresentationMs:R44_INITIAL_PRESENTATION_PHASE_MS+3400','first discovery relative to inherited phase');
replaceUnique('lastReleasedFace:null,lastReleasedAtMs:-Infinity,releaseCount:0','lastReleasedFace:null,lastReleasedAtMs:-Infinity,faceRearmBlocked:{\'+Z\':false,\'+X\':false,\'-X\':false},releaseCount:0','per-face optical re-arm state');

// A released face cannot immediately retrigger while the same optical passage is still visible.
const oldRelease="semanticR442State.releaseCount++;return true}";
const newRelease="if(face)semanticR442State.faceRearmBlocked[face]=true;semanticR442State.releaseCount++;semanticR442SetActiveMaterialFace(null);semanticR442State.activeMaterialFace=null;return true}";
replaceUnique(oldRelease,newRelease,'release material dormancy + rearm latch');

const oldBest="function semanticR442BestFace(){const list=SEMANTIC_R442_ELIGIBLE_FACES.map(f=>semanticR442EvaluateFace(f,true)).filter(Boolean).sort((a,b)=>b.selectionScore-a.selectionScore);semanticR442State.candidateScores=list.map(x=>({...x}));return list[0]||null}";
const newBest="function semanticR442BestFace(){const all=SEMANTIC_R442_ELIGIBLE_FACES.map(f=>semanticR442EvaluateFace(f,true)).filter(Boolean);for(const q of all){if(semanticR442State.faceRearmBlocked[q.face]&&q.rawQuality<=SEMANTIC_R442_QUALITY.rearmScore)semanticR442State.faceRearmBlocked[q.face]=false}semanticR442State.candidateScores=all.map(x=>({...x,rearmBlocked:semanticR442State.faceRearmBlocked[x.face]===true}));const list=all.filter(x=>semanticR442State.faceRearmBlocked[x.face]!==true).sort((a,b)=>b.selectionScore-a.selectionScore);return list[0]||null}";
replaceUnique(oldBest,newBest,'best-face optical re-arm filter');

// Outside a protected envelope every eligible face is visually dormant.
const oldApproach="if(best.rawQuality>=SEMANTIC_R442_QUALITY.approachScore&&best.viewAlignment>=SEMANTIC_R442_QUALITY.exitView&&best.assembled){if(semanticR442ActiveMaterialFace!==best.face)semanticR442SetActiveMaterialFace(best.face);semanticR442State.activeMaterialFace=best.face}else if(semanticR442ActiveMaterialFace&&best.rawQuality<SEMANTIC_R442_QUALITY.materialDormantScore){semanticR442SetActiveMaterialFace(null);semanticR442State.activeMaterialFace=null}if(now<semanticR442State.nextEligiblePresentationMs)return;";
replaceUnique(oldApproach,"if(!semanticR442State.protected&&semanticR442ActiveMaterialFace!==null){semanticR442SetActiveMaterialFace(null);semanticR442State.activeMaterialFace=null}if(now<semanticR442State.nextEligiblePresentationMs)return;",'pre-protection dormancy');

const oldEnter="best.assembled&&best.rawQuality>=SEMANTIC_R442_QUALITY.enterScore&&best.viewAlignment>=SEMANTIC_R442_QUALITY.minView&&best.projectedAreaQuality>=SEMANTIC_R442_QUALITY.minAreaQuality&&best.brdfQuality>=SEMANTIC_R442_QUALITY.minBrdf";
const newEnter="best.assembled&&best.rawQuality>=SEMANTIC_R442_QUALITY.approachScore&&best.viewAlignment>=SEMANTIC_R442_QUALITY.exitView&&best.projectedAreaQuality>=.28&&best.brdfQuality>=.18";
replaceUnique(oldEnter,newEnter,'approach protection entry');

// Weighted axis debt strongly favors the least-used axis without imposing a visible sequence.
const oldRecentAxis="const recentAxes=new Set(recent.slice(-4).map(r=>r.axis));if(!recentAxes.has(move.axis))w*=1.72;const recentLayers=new Set(recent.slice(-4).map(r=>r.layer));";
const newRecentAxis="const recentAxes=new Set(recent.slice(-4).map(r=>r.axis));if(!recentAxes.has(move.axis))w*=2.10;const axisValues=Object.values(semanticR442MoveState.axisCounts),axisMin=Math.min(...axisValues);if((semanticR442MoveState.axisCounts[move.axis]||0)===axisMin)w*=1.85;const recentLayers=new Set(recent.slice(-4).map(r=>r.layer));";
replaceUnique(oldRecentAxis,newRecentAxis,'weighted axis debt');

for(const required of[
 'function createSemanticR442PlanarFaceGeometry(','function createSemanticR442BevelTile(','function createSemanticR442ToneTile(',
 'createSemanticR442PlanarFaceGeometry(mesh,mesh.geometry,face)','createSemanticR442BevelTile(maskTexture)','createSemanticR442ToneTile(maskTexture)',
 "SEMANTIC_R442_ELIGIBLE_FACES=Object.freeze(['+Z','+X','-X'])",
 'approachScore:.58,enterScore:.76,exitScore:.54,minView:.58,exitView:.50','nextEligiblePresentationMs:R44_INITIAL_PRESENTATION_PHASE_MS+3400','rearmScore:.50',
 'faceRearmBlocked','rearmBlocked:semanticR442State.faceRearmBlocked','w*=2.10','w*=1.85',
 'best.rawQuality>=SEMANTIC_R442_QUALITY.approachScore','semanticR442SetActiveMaterialFace(null);semanticR442State.activeMaterialFace=null;return true',
 'semanticVelocityMultiplier: 1.0','const deltaMs=wallDeltaMs','overlayTextRendered:false','alphaDominantReveal:false','semanticMotionCoupled:false','semanticOrientationForcing:false'
])if(!source.includes(required))throw new Error(`R4.4.2 runtime hotfix missing invariant: ${required}`);
for(const forbidden of['createSemanticR44PlanarFaceGeometry(mesh,mesh.geometry,face)','createSemanticR44BevelTile(maskTexture)','createSemanticR44ToneTile(maskTexture)','nextEligiblePresentationMs:2600','unsafeReturnGuardMs:3000'])if(source.includes(forbidden))throw new Error(`R4.4.2 unresolved legacy dependency: ${forbidden}`);

fs.writeFileSync(file,source);
console.log('R4.4.2 optical re-arm + axis-debt multi-axis correction applied');
