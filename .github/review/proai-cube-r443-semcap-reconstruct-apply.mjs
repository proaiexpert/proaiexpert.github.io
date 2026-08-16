import fs from 'node:fs';

const file=process.argv[2];
if(!file)throw new Error('usage: node proai-cube-r443-semcap-reconstruct-apply.mjs <material-polish-r443-closed-phrase-architecture.mjs>');
let source=fs.readFileSync(file,'utf8');

for(const token of [
  "const MASTER_WORD=Object.freeze([",
  'const BASE_PHRASE_LENGTHS=Object.freeze([6,5,3,4,3,6,4,4,3,4,6,6,6]);',
  "firstSemanticDelayMs:3200",
  "architecture:'CURATED_VISUAL_SAFE_STATE_RING'",
  "function semanticR443ChooseNormalPhrase(){",
  "const boundarySafe=candidates.filter(p=>!semanticR443ExactInverse(last,p.moves[0]));",
])if(!source.includes(token))throw new Error('starting R4.4.3 product mismatch: '+token);

const start=source.indexOf("const MASTER_WORD=Object.freeze([");
const endToken='const VALIDATION=validateClosedPhraseLibrary();';
const end=source.indexOf(endToken,start);
if(start<0||end<0)throw new Error(`architecture replacement range ${start}/${end}`);

const authored=String.raw`function gestureMeta(id,moves){
  const axisSequence=moves.map(m=>m.axis).join('');
  const axisCounts=Object.fromEntries(AXES.map(axis=>[axis,moves.filter(m=>m.axis===axis).length]));
  const dominantCount=Math.max(...Object.values(axisCounts));
  const dominantAxes=AXES.filter(axis=>axisCounts[axis]===dominantCount);
  const dominantAxis=dominantAxes.length===1?dominantAxes[0]:'MIXED';
  const centerUsage=moves.filter(m=>m.layer===0).length;
  const outerPattern=moves.map(m=>m.layer===0?'C':(m.layer<0?'N':'P')).join('');
  const directionPattern=moves.map(m=>m.direction>0?'+':'-').join('');
  return Object.freeze({gestureClass:\`${'${axisSequence}:${outerPattern}'}\`,axisSequence,dominantAxis,centerUsage,outerPattern,directionPattern,staggerPairs:Object.freeze([])});
}
const phrase=(id,sourceState,destinationState,moves)=>Object.freeze({id,sourceState,destinationState,moves:Object.freeze(moves),...gestureMeta(id,moves)});

// R4.4.3 Owner-authored semantic-capable choreography.
// These are explicit state transitions, not slices of a repeated master word.
const CORE_ARCHETYPES=Object.freeze([
  phrase('AUTH_A01','S00','A01',[
    move('X',1,1),move('Y',-1,1),move('Y',-1,1),move('X',0,1),move('Y',-1,-1),move('Y',-1,-1),move('X',0,-1),
  ]),
  phrase('AUTH_A02','A01','A02',[
    move('Y',0,1),move('X',-1,-1),move('Y',0,-1),move('X',1,-1),move('Y',-1,1),move('X',0,1),move('Y',-1,-1),
  ]),
  phrase('AUTH_A03','A02','A03',[
    move('X',-1,1),move('X',0,-1),
  ]),
  phrase('AUTH_A04','A03','A04',[
    move('Y',0,-1),move('X',0,-1),move('Y',0,-1),move('Z',0,-1),
  ]),
  phrase('AUTH_A05','A04','A05',[
    move('Y',0,-1),move('X',0,1),move('Y',0,-1),move('Z',0,1),move('X',0,1),
  ]),
  phrase('AUTH_A06','A05','A06',[
    move('X',-1,-1),move('Y',-1,1),
  ]),
  phrase('AUTH_A07','A06','A07',[
    move('X',0,-1),move('Y',-1,-1),move('X',1,1),move('Y',0,1),move('X',-1,1),move('Y',0,-1),move('X',0,1),
  ]),
  phrase('AUTH_A08','A07','S00',[
    move('Y',-1,1),move('Y',-1,1),move('X',0,-1),move('Y',-1,-1),move('Y',-1,-1),move('X',1,-1),
  ]),

  phrase('AUTH_B01','S00','B01',[
    move('Y',1,1),move('Z',0,1),move('Y',-1,-1),move('X',0,-1),move('Y',1,-1),move('X',0,1),move('Y',-1,1),
  ]),
  phrase('AUTH_B02','B01','B02',[
    move('X',-1,-1),move('X',-1,-1),move('Z',0,-1),move('X',-1,1),move('X',-1,1),
  ]),
  phrase('AUTH_B03','B02','B03',[
    move('Z',-1,1),move('Z',0,-1),
  ]),
  phrase('AUTH_B04','B03','B04',[
    move('X',0,-1),move('Y',0,-1),move('Z',0,-1),move('Y',0,-1),
  ]),
  phrase('AUTH_B05','B04','B05',[
    move('X',0,1),move('Y',0,-1),move('Z',0,1),move('Y',0,-1),move('Z',0,1),
  ]),
  phrase('AUTH_B06','B05','B06',[
    move('Z',-1,-1),move('X',-1,-1),move('X',-1,-1),move('Z',0,1),move('X',-1,1),move('X',-1,1),move('Y',-1,-1),
  ]),
  phrase('AUTH_B07','B06','S00',[
    move('X',0,-1),move('Y',1,1),move('X',0,1),move('Y',-1,1),move('Z',0,-1),move('Y',1,-1),
  ]),
]);
const AUTHORED_CYCLES=Object.freeze([
  Object.freeze(['AUTH_A01','AUTH_A02','AUTH_A03','AUTH_A04','AUTH_A05','AUTH_A06','AUTH_A07','AUTH_A08']),
  Object.freeze(['AUTH_B01','AUTH_B02','AUTH_B03','AUTH_B04','AUTH_B05','AUTH_B06','AUTH_B07']),
]);
const ALL_AUTHORED_MOVES=Object.freeze(CORE_ARCHETYPES.flatMap(p=>p.moves));

function identityMatrix(){return [1,0,0,0,1,0,0,0,1]}
function matMul(a,b){const r=new Array(9).fill(0);for(let y=0;y<3;y++)for(let x=0;x<3;x++)for(let k=0;k<3;k++)r[y*3+x]+=a[y*3+k]*b[k*3+x];return r}
function matVec(m,v){return [m[0]*v[0]+m[1]*v[1]+m[2]*v[2],m[3]*v[0]+m[4]*v[1]+m[5]*v[2],m[6]*v[0]+m[7]*v[1]+m[8]*v[2]]}
function quarterMatrix(axis,d){if(axis==='X')return [1,0,0,0,0,-d,0,d,0];if(axis==='Y')return [0,0,d,0,1,0,-d,0,0];return [0,-d,0,d,0,0,0,0,1]}
function coordKey(v){return v.join(',')}
function cubeHome(){const cubies=[];for(const x of LAYERS)for(const y of LAYERS)for(const z of LAYERS)cubies.push({origin:[x,y,z],pos:[x,y,z],ori:identityMatrix()});return cubies}
function cloneState(state){return state.map(c=>({origin:[...c.origin],pos:[...c.pos],ori:[...c.ori]}))}
function applyAbstractMove(state,m){const idx=m.axis==='X'?0:m.axis==='Y'?1:2,R=quarterMatrix(m.axis,m.direction);for(const c of state){if(c.pos[idx]!==m.layer)continue;c.pos=matVec(R,c.pos);c.ori=matMul(R,c.ori)}return state}
function applyAbstractWord(state,word){for(const m of word)applyAbstractMove(state,m);return state}
function stateSignature(state){return state.map(c=>\`${'${coordKey(c.origin)}>${coordKey(c.pos)}:${c.ori.join(\'\')}'}\`).join('|')}
function abstractFaceAssembled(state,face){const [axis,sign]=FACE_AXIS[face],idx=axis==='X'?0:axis==='Y'?1:2,normal=[0,0,0];normal[idx]=sign;for(const c of state){if(c.origin[idx]!==sign)continue;if(coordKey(c.origin)!==coordKey(c.pos))return false;const n=matVec(c.ori,normal);if(coordKey(n)!==coordKey(normal))return false}return true}
function wordHasImmediateInverse(word){for(let i=1;i<word.length;i++)if(exactInverse(word[i-1],word[i]))return true;return false}
function maxSameAxis(word){let max=0,run=0,last=null;for(const m of word){run=m.axis===last?run+1:1;last=m.axis;max=Math.max(max,run)}return max}
function maxDeadRunForCycle(ids,stateInfo){let max=0,run=0;for(const id of ids){const p=CORE_ARCHETYPES.find(x=>x.id===id),capable=stateInfo.get(p.destinationState).assembledFaces.length>0;run=capable?0:run+1;max=Math.max(max,run)}return max}
function maxDistanceToSemantic(outgoing,stateInfo){let global=0;for(const id of stateInfo.keys()){
  if(stateInfo.get(id).assembledFaces.length)continue;
  const seen=new Set([id]),queue=[[id,0]];let found=null;
  while(queue.length&&found===null){const [cur,d]=queue.shift();for(const pid of outgoing[cur]||[]){const p=CORE_ARCHETYPES.find(x=>x.id===pid),next=p.destinationState;if(seen.has(next))continue;if(stateInfo.get(next).assembledFaces.length){found=d+1;break}seen.add(next);queue.push([next,d+1])}}
  if(found===null)throw new Error('semantic-dead state cannot reach semantic-capable state '+id);global=Math.max(global,found)
}return global}
function validateClosedPhraseLibrary(){
  if(CORE_ARCHETYPES.length!==15)throw new Error(\`authored phrase archetype count ${'${CORE_ARCHETYPES.length}'}\`);
  const home=cubeHome(),homeSig=stateSignature(home);
  const stateCubes=new Map([['S00',cloneState(home)]]),stateInfo=new Map([['S00',{id:'S00',signature:homeSig,assembledFaces:[...ELIGIBLE_FACES]}]]),signatureOwner=new Map([[homeSig,'S00']]);
  const phraseById=new Map(CORE_ARCHETYPES.map(p=>[p.id,p]));
  const outgoing={},incoming={};
  for(const p of CORE_ARCHETYPES){(outgoing[p.sourceState]??=[]).push(p.id);(incoming[p.destinationState]??=[]).push(p.id)}
  for(const ids of AUTHORED_CYCLES){
    let expected='S00';
    for(const pid of ids){const p=phraseById.get(pid);if(!p||p.sourceState!==expected)throw new Error(\`authored cycle discontinuity ${'${pid}'} ${'${expected}'}\`);const src=stateCubes.get(p.sourceState);if(!src)throw new Error('unknown authored source '+p.sourceState);const afterCube=applyAbstractWord(cloneState(src),p.moves),sig=stateSignature(afterCube);if(stateCubes.has(p.destinationState)){if(stateInfo.get(p.destinationState).signature!==sig)throw new Error(\`${'${pid}'} invalid authored transition ${'${p.sourceState}'}->${'${p.destinationState}'}\`)}else{const owner=signatureOwner.get(sig);if(owner)throw new Error(\`duplicate physical safe state ${'${p.destinationState}'}/${'${owner}'}\`);signatureOwner.set(sig,p.destinationState);stateCubes.set(p.destinationState,cloneState(afterCube));stateInfo.set(p.destinationState,{id:p.destinationState,signature:sig,assembledFaces:ELIGIBLE_FACES.filter(face=>abstractFaceAssembled(afterCube,face))})}expected=p.destinationState}
    if(expected!=='S00')throw new Error('authored cycle does not close HOME');
  }
  if(stateInfo.size!==14)throw new Error(\`semantic-capable safe-state count mismatch ${'${stateInfo.size}'}\`);
  for(const phrase of CORE_ARCHETYPES){
    if(phrase.moves.length<2||phrase.moves.length>7)throw new Error(\`${'${phrase.id}'} phrase length ${'${phrase.moves.length}'}\`);
    if(wordHasImmediateInverse(phrase.moves))throw new Error(\`${'${phrase.id}'} contains immediate inverse\`);
    if(maxSameAxis(phrase.moves)>2)throw new Error(\`${'${phrase.id}'} same-axis streak >2\`);
    const src=stateCubes.get(phrase.sourceState),dst=stateInfo.get(phrase.destinationState);if(!src||!dst)throw new Error(\`${'${phrase.id}'} unknown transition state\`);if(stateSignature(applyAbstractWord(cloneState(src),phrase.moves))!==dst.signature)throw new Error(\`${'${phrase.id}'} transition recheck failed\`)
  }
  const axes=new Set(ALL_AUTHORED_MOVES.map(m=>m.axis)),layers=new Set(ALL_AUTHORED_MOVES.map(m=>m.layer));if(axes.size!==3||layers.size!==3)throw new Error('authored graph lacks X/Y/Z or -1/0/+1 coverage');
  if(maxSameAxis(ALL_AUTHORED_MOVES)>2)throw new Error('authored traversal concatenation same-axis streak >2');
  // Runtime boundary selector may reject an unsafe HOME self-family restart, but every incoming state must retain a safe authored outgoing edge.
  for(const [stateId,incomingIds] of Object.entries(incoming))for(const inId of incomingIds){const last=phraseById.get(inId).moves.at(-1),safe=(outgoing[stateId]||[]).filter(outId=>!exactInverse(last,phraseById.get(outId).moves[0]));if(!safe.length)throw new Error(\`immediate-inverse boundary dead end ${'${inId}'}->${'${stateId}'}\`)}
  const semanticCapable=[...stateInfo.values()].filter(s=>s.assembledFaces.length>0);
  const faceCoverage=Object.fromEntries(ELIGIBLE_FACES.map(face=>[face,semanticCapable.filter(s=>s.assembledFaces.includes(face)).length]));
  const maxDead=Math.max(...AUTHORED_CYCLES.map(ids=>maxDeadRunForCycle(ids,stateInfo)));
  const maxDistance=maxDistanceToSemantic(outgoing,stateInfo);
  if(semanticCapable.length*2<stateInfo.size)throw new Error(\`semantic-capable state density ${'${semanticCapable.length}'}/${'${stateInfo.size}'}\`);
  if(maxDead>2)throw new Error('semantic-dead boundary run '+maxDead);
  if(maxDistance>2)throw new Error('semantic-capable distance '+maxDistance);
  for(const face of ELIGIBLE_FACES)if(faceCoverage[face]<2)throw new Error('insufficient semantic face coverage '+face+':'+faceCoverage[face]);
  const moveBoundaryCapabilities=[];for(const p of CORE_ARCHETYPES){let st=cloneState(stateCubes.get(p.sourceState));for(let i=0;i<p.moves.length;i++){applyAbstractMove(st,p.moves[i]);const assembledFaces=ELIGIBLE_FACES.filter(face=>abstractFaceAssembled(st,face));if(assembledFaces.length)moveBoundaryCapabilities.push({phraseId:p.id,moveIndex:i+1,assembledFaces})}}
  return Object.freeze({
    coreArchetypeCount:CORE_ARCHETYPES.length,generatedValidatedPhraseVariants:CORE_ARCHETYPES.length,normalGeneratedVariants:CORE_ARCHETYPES.length,safetyGeneratedVariants:0,
    macroStateCount:stateInfo.size,phraseHistoryDepth:3,architecture:'SEMANTIC_CAPABLE_AUTHORED_SAFE_STATE_GRAPH',authoredMoveCount:ALL_AUTHORED_MOVES.length,maxAuthoredSameAxisStreak:maxSameAxis(ALL_AUTHORED_MOVES),
    semanticCapableStateCount:semanticCapable.length,maxSemanticDeadConsecutiveBoundaries:maxDead,maxDistanceToSemanticCapableState:maxDistance,faceCoverage,semanticMoveBoundaryOpportunityCount:moveBoundaryCapabilities.length,
    safeStates:[...stateInfo.values()].map(({signature,...rest})=>rest),outgoing,moveBoundaryCapabilities,
  });
}

`;

source=source.slice(0,start)+authored+source.slice(end);
const replaceUnique=(find,replacement,label)=>{const at=source.indexOf(find),next=at>=0?source.indexOf(find,at+find.length):-1;if(at<0||next>=0)throw new Error(`${label}: ${at}/${next}`);source=source.slice(0,at)+replacement+source.slice(at+find.length)};
replaceUnique('firstSemanticDelayMs:3200','firstSemanticDelayMs:1600','startup hidden-stage eligibility');
replaceUnique("r443ClosedPhrase:{architecture:'CURATED_VISUAL_SAFE_STATE_RING'","r443ClosedPhrase:{architecture:'SEMANTIC_CAPABLE_AUTHORED_SAFE_STATE_GRAPH'",'runtime architecture diagnostic');
replaceUnique("console.log('R4.4.3 curated visual safe-state architecture applied',VALIDATION);","console.log('R4.4.3 semantic-capable authored safe-state graph applied',VALIDATION);",'product build log');

for(const forbidden of ['const MASTER_WORD=','const MASTER_STREAM=','const BASE_PHRASE_LENGTHS=','const BASE_ARCHETYPES=','VISUAL_SKIP_'])if(source.includes(forbidden))throw new Error('rejected periodic architecture remains: '+forbidden);
for(const required of [
  "architecture:'SEMANTIC_CAPABLE_AUTHORED_SAFE_STATE_GRAPH'",
  'firstSemanticDelayMs:1600',
  'stageScoreMin:.12','stageScoreMax:.59','stageViewMin:.36','stageAreaMin:.20','stageBrdfMin:0','stageAbortScore:0','stageTimeoutMs:3800',
  'candidateApproachScore:.58','candidateApproachView:.46','enterScore:.64','enterView:.52','enterArea:.26','enterBrdf:.18','maxReadableHoldMs:1600',
  "const boundarySafe=candidates.filter(p=>!semanticR443ExactInverse(last,p.moves[0]));",
])if(!source.includes(required))throw new Error('final semantic-capable product missing invariant: '+required);

fs.writeFileSync(file,source);
console.log('R4.4.3 semantic-capable authored graph applicator complete');
