import fs from 'node:fs';
import {chromium} from 'playwright-core';
const chrome=process.env.CHROME_BIN;if(!chrome)throw new Error('CHROME_BIN missing');
const out=process.env.QA_OUT||'review-evidence/e4c-exact';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:chrome,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=swiftshader']});
const page=await browser.newPage({viewport:{width:720,height:720},deviceScaleFactor:1});
const pageErrors=[];page.on('pageerror',e=>pageErrors.push(String(e)));page.on('console',m=>{if(m.type()==='error')pageErrors.push('console:'+m.text())});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded',timeout:20000});
await page.waitForFunction(()=>window.__R443_E4C_EXACT_QA__?.get,null,{timeout:20000});
let snap=await page.evaluate(()=>window.__R443_E4C_EXACT_QA__.get());
const startWall=snap.startupWallMs,startPresentation=snap.startupPresentationMs;
while(true){
  await page.waitForTimeout(25);
  snap=await page.evaluate(()=>window.__R443_E4C_EXACT_QA__.get());
  const p=snap.currentPresentationMs-startPresentation,w=snap.currentWallMs-startWall;
  if(p>=12000||w>=17000)break;
}
await page.screenshot({path:`${out}/final-12s.png`});
const rel=v=>Number.isFinite(v)?(v-startPresentation)/1000:null;
const wallRel=v=>Number.isFinite(v)?(v-startWall)/1000:null;
const stage=snap.stageEvents.find(e=>e.ok)||null;
const candidate=snap.candidateEvents[0]||null;
const readable=snap.readableEvents[0]||null;
const release=snap.releaseEvents[0]||null;
const firstEligibility=rel(snap.firstEligibilityPresentationMs);
const firstStage=rel(stage?.presentationMs);
const firstCandidate=rel(candidate?.presentationMs);
const firstReadable=rel(readable?.presentationMs);
const firstRelease=rel(release?.endMs);
const readableDuration=Number.isFinite(release?.durationMs)?release.durationMs/1000:null;
const presentationElapsed=(snap.currentPresentationMs-startPresentation)/1000;
const wallElapsed=(snap.currentWallMs-startWall)/1000;
const ratio=wallElapsed>0?presentationElapsed/wallElapsed:null;
const physical=stage?.physical||null;
const physicalPass=!!physical&&physical.registry===true&&physical.tileCount===9&&physical.uniqueCubieCount===9&&physical.active===true&&physical.messageIndexStored===true&&physical.bumpAssigned===true&&physical.roughAssigned===true&&physical.clearcoatRoughAssigned===true&&physical.toneAssigned===true&&physical.allActive===true&&physical.noOpacityReveal===true&&physical.noEmissive===true;
const stageBeforeCandidateBeforeReadable=!!stage&&!!candidate&&!!readable&&stage.wallMs<candidate.wallMs&&candidate.wallMs<readable.wallMs&&stage.presentationMs<=candidate.presentationMs&&candidate.presentationMs<readable.presentationMs;
const firstMessage=readable?.message||stage?.message||null;
const firstFace=readable?.face||stage?.face||null;
const tearing=snap.internal.assemblyViolations??0;
const flash=snap.internal.semanticFlashCount??0;
const closed=snap.internal.closedMetrics||{};
const immediateInverse=closed.inverseDistance?.[1]??closed.inverseDistance?.['1']??null;
const motionRegression=!(immediateInverse===0&&closed.validation?.architecture==='SEMANTIC_CAPABLE_AUTHORED_SAFE_STATE_GRAPH'&&closed.validation?.coreArchetypeCount===15&&closed.validation?.macroStateCount===14&&closed.validation?.semanticCapableStateCount===10&&closed.validation?.maxSemanticDeadConsecutiveBoundaries===1&&closed.validation?.semanticMoveBoundaryOpportunityCount===22&&snap.internal.releasedFaceForcedMoves===0&&snap.internal.unexpectedUnsafeStarts===0);
const openingGate=firstReadable!==null&&firstReadable>=1.8&&firstReadable<=5.5;
const durationPass=readableDuration!==null&&readableDuration>=0.9&&readableDuration<=1.8;
const ratioPass=ratio!==null&&ratio>=0.90&&ratio<=1.05;
const maxSemanticFacesPass=snap.maxActiveMaterialFaces<=1;
const exactPass=ratioPass&&openingGate&&stageBeforeCandidateBeforeReadable&&physicalPass&&firstMessage==='ProAI Expert'&&durationPass&&tearing===0&&flash===0&&maxSemanticFacesPass&&!motionRegression&&pageErrors.length===0;
const result={
  productSha:'e4c032cd2e6e521fe5c18109a2992523c650c059',presentationElapsedSec:presentationElapsed,wallElapsedSec:wallElapsed,clockRatio:ratio,
  firstEligibilitySec:firstEligibility,firstStageSec:firstStage,firstCandidateSec:firstCandidate,firstReadableSec:firstReadable,firstReleaseSec:firstRelease,
  firstMessage,firstFace,readableDurationSec:readableDuration,stageBeforeCandidateBeforeReadable,physicalPass,physical,
  tearing,flash,maxActiveMaterialFaces:snap.maxActiveMaterialFaces,maxProtectedFaces:snap.maxProtectedFaces,
  immediateInverse,motionRegression,openingGate,durationPass,ratioPass,maxSemanticFacesPass,pageErrors,
  motion:{visibleMoves:snap.internal.visibleMoves,phraseHistory:snap.internal.phraseHistory,phraseCount:snap.internal.phraseCount,closedMetrics:closed},
  semantic:{stageEvents:snap.stageEvents,candidateEvents:snap.candidateEvents,readableEvents:snap.readableEvents,releaseEvents:snap.releaseEvents,unstageEvents:snap.unstageEvents,eventLog:snap.internal.eventLog},
  exactPass,
};
fs.writeFileSync(`${out}/metrics.json`,JSON.stringify(result,null,2));
const summary=[
  `PRODUCT_SHA=${result.productSha}`,
  `CLOCK_RATIO=${ratio?.toFixed(4)}`,
  `FIRST_ELIGIBILITY=${firstEligibility?.toFixed(4)??'NONE'}`,
  `FIRST_STAGE=${firstStage?.toFixed(4)??'NONE'}`,
  `FIRST_CANDIDATE=${firstCandidate?.toFixed(4)??'NONE'}`,
  `FIRST_READABLE=${firstReadable?.toFixed(4)??'NONE'}`,
  `FIRST_RELEASE=${firstRelease?.toFixed(4)??'NONE'}`,
  `FIRST_MESSAGE=${firstMessage??'NONE'}`,
  `FIRST_FACE=${firstFace??'NONE'}`,
  `READABLE_DURATION=${readableDuration?.toFixed(4)??'NONE'}`,
  `STAGE_LT_CANDIDATE_LT_READABLE=${stageBeforeCandidateBeforeReadable?'PASS':'FAIL'}`,
  `PHYSICAL_9_CUBIE=${physicalPass?'PASS':'FAIL'}`,
  `TEARING=${tearing}`,
  `FLASH=${flash}`,
  `MAX_SEMANTIC_FACES=${snap.maxActiveMaterialFaces}`,
  `IMMEDIATE_INVERSE=${immediateInverse}`,
  `VISIBLE_MOVES=${snap.internal.visibleMoves.length}`,
  `PHRASES=${snap.internal.phraseCount}`,
  `MOTION_REGRESSION=${motionRegression?'YES':'NO'}`,
  `OWNER_OPENING_GATE=${openingGate?'PASS':'FAIL'}`,
  `PAGE_ERRORS=${pageErrors.length}`,
  `EXACT_PASS=${exactPass?'PASS':'FAIL'}`,
].join('\n')+'\n';
fs.writeFileSync(`${out}/summary.txt`,summary);console.log(summary);
await browser.close();
if(!exactPass)process.exit(42);
