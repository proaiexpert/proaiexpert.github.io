import fs from 'node:fs';

const file = new URL('./main.generated.js', import.meta.url);
let source = fs.readFileSync(file, 'utf8');

const replaceUnique = (find, replacement, label) => {
  const at = source.indexOf(find);
  const next = at >= 0 ? source.indexOf(find, at + find.length) : -1;
  if (at < 0 || next >= 0) throw new Error(`R4.4.3 runtime ${label}: ${at}/${next}`);
  source = source.slice(0, at) + replacement + source.slice(at + find.length);
};

const replaceFunction = (name, nextName, replacement, label, nextPrefix = 'function ') => {
  const start = `function ${name}(`;
  const at = source.indexOf(start);
  const next = source.indexOf(`\n${nextPrefix}${nextName}(`, at + start.length);
  if (at < 0 || next < 0 || source.indexOf(start, at + start.length) >= 0) {
    throw new Error(`R4.4.3 function ${label}: ${at}/${next}`);
  }
  source = source.slice(0, at) + replacement + source.slice(next + 1);
};

for (const required of [
  "SEMANTIC_R442_ELIGIBLE_FACES=Object.freeze(['+Z','+X','-X'])",
  'R4_4_2_PHYSICAL_MICRO_ENGRAVED_',
  'maxProtectedMs:2400',
  'faceRearmBlocked',
  'semanticVelocityMultiplier: 1.0',
  'const deltaMs=wallDeltaMs',
  'overlayTextRendered:false',
  'alphaDominantReveal:false',
  'semanticMotionCoupled:false',
  'semanticOrientationForcing:false',
  'r441HorizontalReductionPct:12.5',
  'r441VerticalReductionPct:10',
  'edgeRoughnessInk:.095',
]) if (!source.includes(required)) throw new Error(`R4.4.3 missing R4.4.2 invariant: ${required}`);

// Root-cause correction: the inherited 68s presentation curve explicitly changed
// yaw sign. Preserve its cadence/range and pitch/roll, but keep yaw direction
// continuous so the living object no longer performs a short-cycle return.
for (const [from, to] of [
  ['{ timeMs: 36000, velocityDegPerSec: -8.0 }', '{ timeMs: 36000, velocityDegPerSec: 8.0 }'],
  ['{ timeMs: 43000, velocityDegPerSec: -11.0 }', '{ timeMs: 43000, velocityDegPerSec: 11.0 }'],
  ['{ timeMs: 49000, velocityDegPerSec: -24.0 }', '{ timeMs: 49000, velocityDegPerSec: 24.0 }'],
  ['{ timeMs: 55000, velocityDegPerSec: -29.0 }', '{ timeMs: 55000, velocityDegPerSec: 29.0 }'],
  ['{ timeMs: 60000, velocityDegPerSec: -14.0 }', '{ timeMs: 60000, velocityDegPerSec: 14.0 }'],
]) replaceUnique(from, to, `continuous yaw ${from}`);

const moveStateAnchor = "const semanticR442MoveState={recentMoves:[],moveLog:[],axisCounts:{X:0,Y:0,Z:0},layerCounts:{'-1':0,'0':0,'1':0},selectionCount:0,replacements:0,skipped:0};";
const moveStateAt = source.indexOf(moveStateAnchor);
if (moveStateAt < 0 || source.indexOf(moveStateAnchor, moveStateAt + moveStateAnchor.length) >= 0) {
  throw new Error(`R4.4.3 state anchor invalid: ${moveStateAt}`);
}

const lifecycle = String.raw`
const SEMANTIC_R443_PHASE=Object.freeze({NORMAL:'NORMAL',CANDIDATE:'CANDIDATE',READABLE_LOCK:'READABLE_LOCK',RELEASE:'RELEASE',DISPERSAL:'DISPERSAL',COOLDOWN:'COOLDOWN'});
const SEMANTIC_R443_SEQUENCE=Object.freeze(['ProAI Expert','TRUST','INQUIRY','RESPONSE','RESULT']);
const SEMANTIC_R443_CONFIG=Object.freeze({candidateApproachScore:.66,candidateApproachView:.52,candidateDwellMs:320,enterScore:.76,enterView:.58,enterArea:.34,enterBrdf:.26,exitScore:.54,exitView:.50,releaseDebounceMs:90,maxReadableMs:2400,rearmScore:.50,cooldownRangeMs:[2600,5600],minAngularTravelDeg:28,minPostReleaseSlices:1,dispersalTargetMs:[350,1250],recentFaceFactors:[.44,.72,.88],layerDebtBoost:1.52,axisDebtBoost:1.82});
const semanticR443State={phase:SEMANTIC_R443_PHASE.NORMAL,candidateFace:null,candidateSinceMs:null,candidateStartScore:0,candidatePeakScore:0,activeMessage:null,activeMessageIndex:null,nextMessageIndex:0,lastReadableStartMs:null,lastReleaseMs:-Infinity,lastReleaseFace:null,releaseCumulativeYawDeg:0,releaseSelectionCount:0,cooldownUntilMs:-Infinity,dispersalDone:true,dispersalLatencyMs:null,dispersalLatenciesMs:[],opportunityIntervalsMs:[],readableDurationsMs:[],faceArmed:{'+Z':true,'+X':true,'-X':true},recentFaces:[],lifecycleLog:[],candidateLog:[],eventLog:[],semanticSeed:0x443c0de,overdueDispersalCount:0,shortReadableCount:0};
function semanticR443Log(type,data={}){semanticR443State.lifecycleLog.push({type,presentationMs:presentationSimTimeMs,phase:semanticR443State.phase,...data});if(semanticR443State.lifecycleLog.length>160)semanticR443State.lifecycleLog.shift()}
function semanticR443Unit(){let x=semanticR443State.semanticSeed>>>0;x^=(x<<13)>>>0;x^=x>>>17;x^=(x<<5)>>>0;semanticR443State.semanticSeed=x>>>0;return semanticR443State.semanticSeed/4294967296}
function semanticR443Range(min,max){return min+(max-min)*semanticR443Unit()}
function semanticR443ResetCandidate(reason='reset'){if(semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE)semanticR443Log('candidate-cancel',{face:semanticR443State.candidateFace,reason});semanticR443State.candidateFace=null;semanticR443State.candidateSinceMs=null;semanticR443State.candidateStartScore=0;semanticR443State.candidatePeakScore=0;if(semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE)semanticR443State.phase=SEMANTIC_R443_PHASE.NORMAL}
function semanticR443FaceSpan(){const spanY=Math.abs(latticeCenters.Y[2]-latticeCenters.Y[0])+GEOMETRY_R1.faceOuterSize,spanZ=Math.abs(latticeCenters.Z[2]-latticeCenters.Z[0])+GEOMETRY_R1.faceOuterSize;return Math.min(spanY,spanZ)*.998}
const semanticR443GlobalMaskCache=new Map();
function semanticR443CreateWordMask(text){const size=2048,raw=document.createElement('canvas');raw.width=size;raw.height=size;const ctx=raw.getContext('2d',{alpha:true});ctx.clearRect(0,0,size,size);ctx.fillStyle='#ffffff';ctx.textAlign='center';ctx.textBaseline='alphabetic';const targetWidth=size*SEMANTIC_R2.targetBlockWidthRatio;let low=120,high=900;for(let i=0;i<20;i++){const mid=(low+high)*.5;ctx.font=SEMANTIC_R2.fontWeight+' '+mid+'px "'+SEMANTIC_R2.fontFamily+'"';if(ctx.measureText(text).width<targetWidth)low=mid;else high=mid}const fontPx=(low+high)*.5;ctx.font=SEMANTIC_R2.fontWeight+' '+fontPx+'px "'+SEMANTIC_R2.fontFamily+'"';const m=ctx.measureText(text),ascent=m.actualBoundingBoxAscent||fontPx*.72,descent=m.actualBoundingBoxDescent||fontPx*.18,baseline=size*.5+(ascent-descent)*.5;ctx.fillText(text,size*.5,baseline);const scaled=document.createElement('canvas');scaled.width=size;scaled.height=size;const sc=scaled.getContext('2d',{alpha:true}),dw=size*.875,dh=size*.900;sc.clearRect(0,0,size,size);sc.drawImage(raw,(size-dw)*.5,(size-dh)*.5,dw,dh);const texture=new THREE.CanvasTexture(scaled);texture.colorSpace=THREE.NoColorSpace;texture.minFilter=THREE.LinearFilter;texture.magFilter=THREE.LinearFilter;texture.generateMipmaps=true;texture.needsUpdate=true;texture.userData.semanticR443TypographyScale={x:.875,y:.900,message:text};return createSeamAwareBrandMaskTexture(texture,semanticR443FaceSpan())}
function semanticR443GlobalMask(index){if(index===0)return semanticMaskTexture;if(semanticR443GlobalMaskCache.has(index))return semanticR443GlobalMaskCache.get(index);const texture=semanticR443CreateWordMask(SEMANTIC_R443_SEQUENCE[index]);semanticR443GlobalMaskCache.set(index,texture);return texture}
function semanticR443DisposeTileResources(tile){const m=tile.material,items=[tile.mask,tile.rough,m.userData.semanticBeveledBump,m.userData.semanticToneMap],seen=new Set();for(const t of items){if(!t||seen.has(t)||t===m.userData.semanticBaseMap)continue;seen.add(t);t.dispose?.()}}
function semanticR443ApplyMessage(face,index){const reg=semanticR442FaceRegistry.get(face);if(!reg)return false;const message=SEMANTIC_R443_SEQUENCE[index],globalMask=semanticR443GlobalMask(index);for(const tile of reg.tiles){const m=tile.material,current=m.userData.semanticR443MessageIndex;if(current===index)continue;if(current===undefined&&index===0){m.userData.semanticR443MessageIndex=0;m.userData.semanticR443Message=message;continue}semanticR443DisposeTileResources(tile);const mask=createSemanticR442TileMask(globalMask,face,tile.origin),rough=createSemanticR441PearlRoughnessTile(mask),bevel=createSemanticR442BevelTile(mask),tone=createSemanticR442ToneTile(mask);tile.mask=mask;tile.rough=rough;m.bumpMap=bevel;m.userData.semanticTileMask=mask;m.userData.semanticBeveledBump=bevel;m.userData.semanticRoughnessMap=rough;m.userData.semanticToneMap=tone;m.userData.semanticR443MessageIndex=index;m.userData.semanticR443Message=message;m.needsUpdate=true}semanticR443State.activeMessage=message;semanticR443State.activeMessageIndex=index;return true}
function semanticR443RefreshArming(){for(const face of SEMANTIC_R442_ELIGIBLE_FACES){const q=semanticR442EvaluateFace(face,false);if(!q||!q.assembled||q.rawQuality<=SEMANTIC_R443_CONFIG.rearmScore||q.viewAlignment<=.42)semanticR443State.faceArmed[face]=true}}
function semanticR443RecentFactor(face){const at=semanticR443State.recentFaces.lastIndexOf(face);if(at<0)return 1;const age=semanticR443State.recentFaces.length-1-at;return SEMANTIC_R443_CONFIG.recentFaceFactors[Math.min(age-1,SEMANTIC_R443_CONFIG.recentFaceFactors.length-1)]||1}
function semanticR443BestEligibleFace(){const list=SEMANTIC_R442_ELIGIBLE_FACES.map(face=>semanticR442EvaluateFace(face,true)).filter(Boolean).map(q=>({...q,r443Armed:semanticR443State.faceArmed[q.face]===true,r443RecentFactor:semanticR443RecentFactor(q.face)}));for(const q of list)q.r443SelectionScore=q.selectionScore*q.r443RecentFactor;semanticR442State.candidateScores=list.map(q=>({...q}));const eligible=list.filter(q=>q.assembled&&q.r443Armed).sort((a,b)=>b.r443SelectionScore-a.r443SelectionScore);return eligible[0]||null}
function semanticR443EvolutionReady(){if(!Number.isFinite(semanticR443State.lastReleaseMs))return true;const angular=presentationCumulativeYawDeg-semanticR443State.releaseCumulativeYawDeg,moves=semanticR442MoveState.selectionCount-semanticR443State.releaseSelectionCount,faceChanged=semanticR443State.faceArmed[semanticR443State.lastReleaseFace]===true;return presentationSimTimeMs>=semanticR443State.cooldownUntilMs&&semanticR443State.dispersalDone&&angular>=SEMANTIC_R443_CONFIG.minAngularTravelDeg&&moves>=SEMANTIC_R443_CONFIG.minPostReleaseSlices&&faceChanged&&activeTurns.size===0}
function semanticR443Lock(q){const now=presentationSimTimeMs,index=semanticR443State.nextMessageIndex,message=SEMANTIC_R443_SEQUENCE[index];semanticR442State.protected=true;semanticR442State.protectedFace=q.face;semanticR442State.protectedSinceMs=now;semanticR442State.belowExitSinceMs=null;semanticR442State.protectionCount++;semanticR443ApplyMessage(q.face,index);semanticR442SetActiveMaterialFace(q.face);semanticR442State.activeMaterialFace=q.face;const reg=semanticR442FaceRegistry.get(q.face);if(reg)reg.lastUsedPresentationMs=now;semanticR442State.faceSelections.push({face:q.face,presentationMs:now,quality:q.rawQuality,view:q.viewAlignment,area:q.projectedAreaQuality,brdf:q.brdfQuality,message,messageIndex:index});if(semanticR442State.faceSelections.length>32)semanticR442State.faceSelections.shift();if(semanticR443State.lastReadableStartMs!==null)semanticR443State.opportunityIntervalsMs.push(now-semanticR443State.lastReadableStartMs);semanticR443State.lastReadableStartMs=now;semanticR443State.phase=SEMANTIC_R443_PHASE.READABLE_LOCK;semanticR443State.candidateFace=null;semanticR443State.candidateSinceMs=null;semanticR443State.recentFaces.push(q.face);if(semanticR443State.recentFaces.length>4)semanticR443State.recentFaces.shift();semanticR443State.eventLog.push({message,messageIndex:index,face:q.face,startMs:now,quality:q.rawQuality});if(semanticR443State.eventLog.length>32)semanticR443State.eventLog.shift();semanticR443Log('readable-start',{face:q.face,message,messageIndex:index,quality:q.rawQuality});return true}
function semanticR443Release(reason='optical-exit'){if(!semanticR442State.protected)return false;const now=presentationSimTimeMs,start=semanticR442State.protectedSinceMs??now,face=semanticR442State.protectedFace,duration=Math.max(0,now-start);semanticR442State.protectedIntervals.push({face,startMs:start,endMs:now,durationSec:duration/1000,reason,message:semanticR443State.activeMessage});if(semanticR442State.protectedIntervals.length>32)semanticR442State.protectedIntervals.shift();semanticR443State.readableDurationsMs.push(duration);if(duration<600)semanticR443State.shortReadableCount++;semanticR442State.protected=false;semanticR442State.protectedFace=null;semanticR442State.protectedSinceMs=null;semanticR442State.belowExitSinceMs=null;semanticR442State.lastReleasedFace=face;semanticR442State.lastReleasedAtMs=now;semanticR442State.releaseCount++;for(const f of SEMANTIC_R442_ELIGIBLE_FACES){semanticR443State.faceArmed[f]=false;semanticR442State.faceRearmBlocked[f]=true}semanticR442SetActiveMaterialFace(null);semanticR442State.activeMaterialFace=null;semanticR443State.lastReleaseMs=now;semanticR443State.lastReleaseFace=face;semanticR443State.releaseCumulativeYawDeg=presentationCumulativeYawDeg;semanticR443State.releaseSelectionCount=semanticR442MoveState.selectionCount;semanticR443State.cooldownUntilMs=now+semanticR443Range(...SEMANTIC_R443_CONFIG.cooldownRangeMs);semanticR443State.dispersalDone=false;semanticR443State.dispersalLatencyMs=null;semanticR443State.phase=SEMANTIC_R443_PHASE.RELEASE;semanticR443Log('release',{face,reason,durationMs:duration,message:semanticR443State.activeMessage});semanticR443State.nextMessageIndex=(semanticR443State.nextMessageIndex+1)%SEMANTIC_R443_SEQUENCE.length;semanticR443State.activeMessage=null;semanticR443State.activeMessageIndex=null;semanticR443State.phase=SEMANTIC_R443_PHASE.DISPERSAL;semanticR443Log('dispersal-enter',{face,targetMs:[...SEMANTIC_R443_CONFIG.dispersalTargetMs]});return true}
`;
source = source.slice(0, moveStateAt + moveStateAnchor.length) + lifecycle + source.slice(moveStateAt + moveStateAnchor.length);

const releaseReplacement = String.raw`function semanticR442ReleaseProtection(reason='optical-exit'){return semanticR443Release(reason)}
`;
replaceFunction('semanticR442ReleaseProtection', 'semanticR442UpdateProtectionState', releaseReplacement, 'release bridge');

const updateReplacement = String.raw`function semanticR442UpdateProtectionState(){const now=presentationSimTimeMs;semanticR443RefreshArming();if(semanticR443State.phase===SEMANTIC_R443_PHASE.READABLE_LOCK){const q=semanticR442EvaluateFace(semanticR442State.protectedFace,false),elapsed=now-(semanticR442State.protectedSinceMs??now);if(!q?.assembled){semanticR442State.assemblyViolations++;semanticR443Release('assembly-lost');return}const readable=q.rawQuality>=SEMANTIC_R443_CONFIG.exitScore&&q.viewAlignment>=SEMANTIC_R443_CONFIG.exitView;if(readable)semanticR442State.belowExitSinceMs=null;else if(semanticR442State.belowExitSinceMs===null)semanticR442State.belowExitSinceMs=now;if(elapsed>=SEMANTIC_R443_CONFIG.maxReadableMs){semanticR443Release('max-readable-envelope');return}if(semanticR442State.belowExitSinceMs!==null&&now-semanticR442State.belowExitSinceMs>=SEMANTIC_R443_CONFIG.releaseDebounceMs){semanticR443Release('stable-optical-exit');return}semanticR43OpticalDiagnostics={...semanticR43OpticalDiagnostics,alignment:q.brdfQuality,faceView:q.viewAlignment,halfDot:q.halfDot,signedFaceView:q.signedFaceView,signedHalfDot:q.signedHalfDot,frontFacing:q.signedFaceView>0,opportunity:q.rawQuality,engravedFace:q.face};return}if(semanticR442ActiveMaterialFace!==null){semanticR442SetActiveMaterialFace(null);semanticR442State.activeMaterialFace=null}if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL){const age=now-semanticR443State.lastReleaseMs;if(age>SEMANTIC_R443_CONFIG.dispersalTargetMs[1]&&!semanticR443State.dispersalDone&&age<SEMANTIC_R443_CONFIG.dispersalTargetMs[1]+90)semanticR443State.overdueDispersalCount++;return}if(semanticR443State.phase===SEMANTIC_R443_PHASE.COOLDOWN){if(semanticR443EvolutionReady()){semanticR443State.phase=SEMANTIC_R443_PHASE.NORMAL;semanticR443Log('cooldown-complete',{angularTravelDeg:presentationCumulativeYawDeg-semanticR443State.releaseCumulativeYawDeg,slices:semanticR442MoveState.selectionCount-semanticR443State.releaseSelectionCount});semanticR443ResetCandidate('cooldown-complete')}else return}if(now<semanticR442State.nextEligiblePresentationMs)return;if(activeTurns.size>0){if(semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE)semanticR443ResetCandidate('active-slice');return}if(semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE){const face=semanticR443State.candidateFace,q=face?semanticR442EvaluateFace(face,true):null;if(!q?.assembled||!semanticR443State.faceArmed[face]||q.rawQuality<SEMANTIC_R443_CONFIG.candidateApproachScore||q.viewAlignment<SEMANTIC_R443_CONFIG.candidateApproachView){semanticR443ResetCandidate('optical-exit');return}semanticR443State.candidatePeakScore=Math.max(semanticR443State.candidatePeakScore,q.rawQuality);const dwell=now-(semanticR443State.candidateSinceMs??now),stableNearPeak=q.rawQuality>=semanticR443State.candidatePeakScore-.035,enter=q.rawQuality>=SEMANTIC_R443_CONFIG.enterScore&&q.viewAlignment>=SEMANTIC_R443_CONFIG.enterView&&q.projectedAreaQuality>=SEMANTIC_R443_CONFIG.enterArea&&q.brdfQuality>=SEMANTIC_R443_CONFIG.enterBrdf;if(dwell>=SEMANTIC_R443_CONFIG.candidateDwellMs&&stableNearPeak&&enter)semanticR443Lock(q);return}const best=semanticR443BestEligibleFace();if(!best)return;if(best.rawQuality>=SEMANTIC_R443_CONFIG.candidateApproachScore&&best.viewAlignment>=SEMANTIC_R443_CONFIG.candidateApproachView&&best.projectedAreaQuality>=.28&&best.brdfQuality>=.18){semanticR443State.phase=SEMANTIC_R443_PHASE.CANDIDATE;semanticR443State.candidateFace=best.face;semanticR443State.candidateSinceMs=now;semanticR443State.candidateStartScore=best.rawQuality;semanticR443State.candidatePeakScore=best.rawQuality;semanticR443State.candidateLog.push({face:best.face,presentationMs:now,quality:best.rawQuality,view:best.viewAlignment});if(semanticR443State.candidateLog.length>64)semanticR443State.candidateLog.shift();semanticR443Log('candidate',{face:best.face,quality:best.rawQuality})}}
`;
replaceFunction('semanticR442UpdateProtectionState', 'semanticR442MoveIntersection', updateReplacement, 'state machine');

const weightReplacement = String.raw`function semanticR442RecentWeight(move){let w=1;const recent=semanticR442MoveState.recentMoves;for(let i=0;i<recent.length;i++){const age=recent.length-1-i,r=recent[i],decay=age===0?1:age===1?.72:age===2?.48:.28;if(r.axis===move.axis&&r.layer===move.layer&&r.direction===move.direction)w*=1-.88*decay;else{if(r.axis===move.axis)w*=1-.42*decay;if(r.layer===move.layer)w*=1-.24*decay;if(r.direction===move.direction)w*=1-.08*decay}}const recentAxes=new Set(recent.slice(-4).map(r=>r.axis));if(!recentAxes.has(move.axis))w*=2.10;const axisValues=Object.values(semanticR442MoveState.axisCounts),axisMin=Math.min(...axisValues),axisMax=Math.max(...axisValues);if((semanticR442MoveState.axisCounts[move.axis]||0)===axisMin)w*=SEMANTIC_R443_CONFIG.axisDebtBoost;if((semanticR442MoveState.axisCounts[move.axis]||0)>=axisMin+3&&axisMax>axisMin)w*=.64;const recentLayers=new Set(recent.slice(-4).map(r=>r.layer));if(!recentLayers.has(move.layer))w*=1.32;const layerValues=Object.values(semanticR442MoveState.layerCounts),layerMin=Math.min(...layerValues),layerMax=Math.max(...layerValues);if((semanticR442MoveState.layerCounts[String(move.layer)]||0)===layerMin)w*=SEMANTIC_R443_CONFIG.layerDebtBoost;if((semanticR442MoveState.layerCounts[String(move.layer)]||0)>=layerMin+3&&layerMax>layerMin)w*=.70;const released=semanticR443State.lastReleaseFace;if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL&&released){const intersects=semanticR442MoveIntersection(move,released).count>0,age=presentationSimTimeMs-semanticR443State.lastReleaseMs;if(intersects){if(age<SEMANTIC_R443_CONFIG.dispersalTargetMs[0])w*=.12;else if(age<=SEMANTIC_R443_CONFIG.dispersalTargetMs[1])w*=7.5;else w*=14}else if(age>=SEMANTIC_R443_CONFIG.dispersalTargetMs[0])w*=.78}return Math.max(.008,w)}
`;
replaceFunction('semanticR442RecentWeight', 'semanticR442AllMoveCandidates', weightReplacement, 'premium weighted choreography');

const recordReplacement = String.raw`function semanticR442RecordMove(move,phase='forward'){const intersection=semanticR442State.protected?semanticR442MoveIntersection(move):{count:0,ids:[]};if(semanticR442State.protected&&intersection.count>0)semanticR442State.unsafeProtectedStarts++;if(phase==='forward'){semanticR442MoveState.recentMoves.push({axis:move.axis,layer:move.layer,direction:move.direction,presentationMs:presentationSimTimeMs});if(semanticR442MoveState.recentMoves.length>5)semanticR442MoveState.recentMoves.shift();semanticR442MoveState.axisCounts[move.axis]=(semanticR442MoveState.axisCounts[move.axis]||0)+1;semanticR442MoveState.layerCounts[String(move.layer)]=(semanticR442MoveState.layerCounts[String(move.layer)]||0)+1;semanticR442MoveState.selectionCount++;const released=semanticR443State.lastReleaseFace,rejoin=released?semanticR442MoveIntersection(move,released):{count:0,ids:[]};if(released&&presentationSimTimeMs-semanticR443State.lastReleaseMs<12000&&rejoin.count>0){semanticR442State.postReleaseParticipationCount++;semanticR442State.lastPostReleaseParticipation={face:released,presentationMs:presentationSimTimeMs,move:{axis:move.axis,layer:move.layer,direction:move.direction}}}if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL&&released&&rejoin.count>0){const latency=Math.max(0,presentationSimTimeMs-semanticR443State.lastReleaseMs);semanticR443State.dispersalDone=true;semanticR443State.dispersalLatencyMs=latency;semanticR443State.dispersalLatenciesMs.push(latency);if(semanticR443State.dispersalLatenciesMs.length>32)semanticR443State.dispersalLatenciesMs.shift();semanticR443State.phase=SEMANTIC_R443_PHASE.COOLDOWN;semanticR443Log('dispersal-slice',{face:released,latencyMs:latency,axis:move.axis,layer:move.layer,direction:move.direction})}}semanticR442MoveState.moveLog.push({presentationMs:presentationSimTimeMs,phase,axis:move.axis,layer:move.layer,direction:move.direction,protected:semanticR442State.protected,protectedFace:semanticR442State.protectedFace,semanticIntersection:intersection.count,r443Phase:semanticR443State.phase});if(semanticR442MoveState.moveLog.length>160)semanticR442MoveState.moveLog.shift();return intersection}
`;
replaceFunction('semanticR442RecordMove', 'sliceSchedulerLoop', recordReplacement, 'dispersal participation', 'async function ');

replaceUnique(
  'r442Cadence:SEMANTIC_R442_CADENCE,',
  `r442Cadence:SEMANTIC_R442_CADENCE,\n    r443Lifecycle:{revision:'PROAI_CUBE_R4.4.3',phase:semanticR443State.phase,sequence:[...SEMANTIC_R443_SEQUENCE],nextMessageIndex:semanticR443State.nextMessageIndex,nextMessage:SEMANTIC_R443_SEQUENCE[semanticR443State.nextMessageIndex],activeMessage:semanticR443State.activeMessage,activeMessageIndex:semanticR443State.activeMessageIndex,candidateFace:semanticR443State.candidateFace,candidateSinceMs:semanticR443State.candidateSinceMs,lastReleaseFace:semanticR443State.lastReleaseFace,lastReleaseMs:semanticR443State.lastReleaseMs,cooldownUntilMs:semanticR443State.cooldownUntilMs,faceArmed:{...semanticR443State.faceArmed},recentFaces:[...semanticR443State.recentFaces],dispersalDone:semanticR443State.dispersalDone,dispersalLatencyMs:semanticR443State.dispersalLatencyMs,dispersalLatenciesMs:[...semanticR443State.dispersalLatenciesMs],opportunityIntervalsMs:[...semanticR443State.opportunityIntervalsMs],readableDurationsMs:[...semanticR443State.readableDurationsMs],candidateLog:[...semanticR443State.candidateLog],eventLog:[...semanticR443State.eventLog],lifecycleLog:[...semanticR443State.lifecycleLog],overdueDispersalCount:semanticR443State.overdueDispersalCount,shortReadableCount:semanticR443State.shortReadableCount,config:SEMANTIC_R443_CONFIG,noSemanticFlashByConstruction:true,sequencePhysicalMaterial:true},\n    r443Motion:{yawDirectionPolicy:'continuous-positive',yawVelocityDegPerSec:presentationYawVelocityDegPerSec,signedYawDeg:presentationSignedYawDeg,cumulativeYawDeg:presentationCumulativeYawDeg,frameAngularDeltaRad:presentationFrameDeltaRad,semanticVelocityMultiplier:1,semanticOrientationForcing:false},`,
  'diagnostics extension',
);

for (const required of [
  "SEMANTIC_R443_PHASE=Object.freeze({NORMAL:'NORMAL',CANDIDATE:'CANDIDATE',READABLE_LOCK:'READABLE_LOCK',RELEASE:'RELEASE',DISPERSAL:'DISPERSAL',COOLDOWN:'COOLDOWN'})",
  "SEMANTIC_R443_SEQUENCE=Object.freeze(['ProAI Expert','TRUST','INQUIRY','RESPONSE','RESULT'])",
  'candidateDwellMs:320',
  'maxReadableMs:2400',
  'dispersalTargetMs:[350,1250]',
  'minAngularTravelDeg:28',
  'semanticR443EvolutionReady',
  'semanticR443ApplyMessage',
  'w*=7.5',
  'w*=14',
  "yawDirectionPolicy:'continuous-positive'",
  'noSemanticFlashByConstruction:true',
  'semanticVelocityMultiplier: 1.0',
  'const deltaMs=wallDeltaMs',
  'overlayTextRendered:false',
  'alphaDominantReveal:false',
  'semanticMotionCoupled:false',
  'semanticOrientationForcing:false',
]) if (!source.includes(required)) throw new Error(`R4.4.3 runtime missing invariant: ${required}`);
for (const forbidden of [
  '{ timeMs: 36000, velocityDegPerSec: -8.0 }',
  '{ timeMs: 43000, velocityDegPerSec: -11.0 }',
  '{ timeMs: 49000, velocityDegPerSec: -24.0 }',
  '{ timeMs: 55000, velocityDegPerSec: -29.0 }',
  '{ timeMs: 60000, velocityDegPerSec: -14.0 }',
  'wallDeltaMs * semanticTimeScale',
  'SEMANTIC_R4_2_TEXT',
  'emissiveIntensity',
]) if (source.includes(forbidden)) throw new Error(`R4.4.3 forbidden regression: ${forbidden}`);

fs.writeFileSync(file, source);
console.log('R4.4.3 semantic lifecycle + dispersal + continuous-yaw choreography applied');
