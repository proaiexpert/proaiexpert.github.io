import fs from 'node:fs';

const file = new URL('./main.generated.js', import.meta.url);
let source = fs.readFileSync(file, 'utf8');

const one = (find, replacement, label) => {
  const at = source.indexOf(find);
  if (at < 0 || source.indexOf(find, at + find.length) >= 0) throw new Error(`R4.3 material anchor ${label}`);
  source = source.slice(0, at) + replacement + source.slice(at + find.length);
};
const rx = (pattern, replacement, label) => {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  const matches = [...source.matchAll(new RegExp(pattern.source, flags))];
  if (matches.length !== 1) throw new Error(`R4.3 material regex ${label}: ${matches.length}`);
  source = source.replace(pattern, replacement);
};

one('  surfaceMaxOpacity: 0.065,', '  surfaceMaxOpacity: 0.000,', 'remove semantic slab');
one('  decelerationMs: 350,', '  decelerationMs: 0,', 'remove semantic deceleration');
one('  accelerationMs: 400,', '  accelerationMs: 0,', 'remove semantic acceleration');
one('  semanticVelocityMultiplier: 0.70,', '  semanticVelocityMultiplier: 1.0,', 'neutral semantic motion multiplier');

const physicalEngraving = `const SEMANTIC_R4_MATERIAL_PALETTE=Object.freeze({shadowMetal:'#242A31',midSilver:'#687077',pearlSilver:'#B8BBB8',peakReflection:'#D7D8D4'});
const SEMANTIC_R4_3_ENGRAVED_FACE='+Z';
const SEMANTIC_R4_3_ENGRAVING=Object.freeze({bumpScale:-0.060,roughnessMapInk:0.855,metalnessDelta:0.0,driver:'actual outward +Z cubie MeshPhysicalMaterial BRDF + persistent bump micro-normal + static roughness/clearcoat-roughness micro-treatment; diagnostics observe face normal + camera view + stable key RectAreaLight half-vector only'});
let semanticEngravedTiles=[];
let semanticEngravedLogicalTileCount=0;
let semanticR43OpticalDiagnostics={alignment:0,faceView:0,halfDot:0,fieldCenter:[.5,.5],fieldAxis:[1,0],opportunity:0,persistent:true,microNormal:true,alphaDominant:false,engravedFace:SEMANTIC_R4_3_ENGRAVED_FACE,physicalCubieMaterial:true,visualDriverTimeline:false};
let semanticR43OpportunityCount=0,semanticR43OpportunityArmed=true;
const semanticMotionTrace=[];
const semanticOpticalScratch={q:new THREE.Quaternion(),sceneQ:new THREE.Quaternion(),center:new THREE.Vector3(),camera:new THREE.Vector3(),light:new THREE.Vector3(),normal:new THREE.Vector3(),tx:new THREE.Vector3(),ty:new THREE.Vector3(),view:new THREE.Vector3(),lightDir:new THREE.Vector3(),half:new THREE.Vector3(),axis:new THREE.Vector2(),fieldCenter:new THREE.Vector2()};
function recordSemanticMotionSample(wallDeltaMs,effectiveDeltaMs){const wall=performance.now(),scale=wallDeltaMs>0?effectiveDeltaMs/wallDeltaMs:1;semanticMotionTrace.push({wallMs:wall,presentationMs:presentationSimTimeMs,semanticActive,semanticComplete,scale,yawVelocityDegPerSec:presentationYawVelocityDegPerSec,frameAngularDeltaRad:presentationFrameDeltaRad});if(semanticMotionTrace.length>960)semanticMotionTrace.splice(0,semanticMotionTrace.length-960)}
function cutSemanticSeam(ctx,size,c,h,f,vertical){const a=c-h-f,b=c+h+f,g=vertical?ctx.createLinearGradient(a,0,b,0):ctx.createLinearGradient(0,a,0,b),t=f/Math.max(1,b-a);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(Math.min(.49,t),'rgba(0,0,0,1)');g.addColorStop(Math.max(.51,1-t),'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;vertical?ctx.fillRect(a,0,b-a,size):ctx.fillRect(0,a,size,b-a)}
function createSeamAwareBrandMaskTexture(texture,faceSpan){const canvas=texture.image,ctx=canvas.getContext('2d',{alpha:true}),size=canvas.width,stepY=Math.abs(latticeCenters.Y[1]-latticeCenters.Y[0]),stepZ=Math.abs(latticeCenters.Z[1]-latticeCenters.Z[0]),gapY=Math.max(0,stepY-GEOMETRY_R1.faceOuterSize),gapZ=Math.max(0,stepZ-GEOMETRY_R1.faceOuterSize),feather=Math.max(.65,Math.min(1.50,Math.max(gapY,gapZ)*.44));ctx.save();ctx.globalCompositeOperation='destination-out';for(const p of [(latticeCenters.Y[0]+latticeCenters.Y[1])*.5,(latticeCenters.Y[1]+latticeCenters.Y[2])*.5])cutSemanticSeam(ctx,size,(.5+p/faceSpan)*size,gapY*.5/faceSpan*size,feather/faceSpan*size,true);for(const p of [(latticeCenters.Z[0]+latticeCenters.Z[1])*.5,(latticeCenters.Z[1]+latticeCenters.Z[2])*.5])cutSemanticSeam(ctx,size,(.5-p/faceSpan)*size,gapZ*.5/faceSpan*size,feather/faceSpan*size,false);ctx.restore();texture.needsUpdate=true;texture.userData.semanticSeamMask={gapY,gapZ,feather,source:'latticeCenters + GEOMETRY_R1.faceOuterSize'};return texture}
function makeSemanticDataTexture(canvas){const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.NoColorSpace;t.minFilter=THREE.LinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.needsUpdate=true;return t}
function createSemanticTileMask(globalTexture,logicalX,logicalY){const src=globalTexture.image,size=768,canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d',{alpha:true}),cell=src.width/3,col=logicalX+1,row=1-logicalY;ctx.clearRect(0,0,size,size);ctx.drawImage(src,col*cell,row*cell,cell,cell,0,0,size,size);return makeSemanticDataTexture(canvas)}
function createSemanticRoughnessTile(maskTexture){const src=maskTexture.image,size=src.width,canvas=document.createElement('canvas'),ink=document.createElement('canvas');canvas.width=size;canvas.height=size;ink.width=size;ink.height=size;const ctx=canvas.getContext('2d',{alpha:false}),ic=ink.getContext('2d',{alpha:true});ctx.fillStyle='#ffffff';ctx.fillRect(0,0,size,size);ic.clearRect(0,0,size,size);ic.drawImage(src,0,0);ic.globalCompositeOperation='source-in';const v=Math.round(255*SEMANTIC_R4_3_ENGRAVING.roughnessMapInk);ic.fillStyle=\`rgb(\${v},\${v},\${v})\`;ic.fillRect(0,0,size,size);ctx.drawImage(ink,0,0);return makeSemanticDataTexture(canvas)}
function isSemanticFaceGeometry(object){if(!object.geometry)return false;const m=sourceGeometryMetrics(object.geometry),dims=[Math.abs(m.size.x),Math.abs(m.size.y),Math.abs(m.size.z)].sort((a,b)=>a-b);return dims[0]<dims[2]*.12}
function semanticSceneLocalNormal(object){const s=semanticOpticalScratch,worldQ=object.getWorldQuaternion(s.q),sceneInv=sceneOne.getWorldQuaternion(s.sceneQ).invert();return s.normal.set(0,0,1).applyQuaternion(worldQ).applyQuaternion(sceneInv).normalize()}
function collectSemanticPhysicalMeshes(cubie){const found=[];sceneOne.updateMatrixWorld(true);for(const member of cubie.members){member.object.traverse(object=>{if(!object.isMesh||object.name==='Plane'||!object.material?.isMeshPhysicalMaterial||!isSemanticFaceGeometry(object))return;const normal=semanticSceneLocalNormal(object);if(normal.z>.86)found.push(object)})}return [...new Set(found)]}
function createPhysicalEngravedMaterial(baseMaterial,maskTexture,roughnessTexture){const m=baseMaterial.clone();m.name=\`R4_3_PHYSICAL_MICRO_ENGRAVED_\${baseMaterial.name||'FACE'}\`;m.bumpMap=maskTexture;m.bumpScale=SEMANTIC_R4_3_ENGRAVING.bumpScale;m.roughnessMap=roughnessTexture;if('clearcoatRoughnessMap' in m)m.clearcoatRoughnessMap=roughnessTexture;m.userData.semanticMaterial='SEMANTIC_R4_3_PERSISTENT_PHYSICAL_MICRO_ENGRAVING';m.userData.semanticTileMask=maskTexture;m.userData.semanticRoughnessMap=roughnessTexture;m.needsUpdate=true;return m}
function installPhysicalSemanticEngraving(globalTexture){semanticEngravedTiles=[];const front=physicalCubies.filter(c=>c.logical.z===1),covered=new Set();if(front.length!==9)throw new Error(\`R4.3 expected 9 +Z cubies, got \${front.length}\`);for(const cubie of front){const mask=createSemanticTileMask(globalTexture,cubie.logical.x,cubie.logical.y),rough=createSemanticRoughnessTile(mask),meshes=collectSemanticPhysicalMeshes(cubie);if(!meshes.length)throw new Error(\`R4.3 missing outward +Z face mesh for cubie \${cubie.id}\`);for(const mesh of meshes){const material=createPhysicalEngravedMaterial(mesh.material,mask,rough);mesh.material=material;mesh.userData.semanticEngravedTile={logical:{...cubie.logical},physical:true};mesh.onBeforeRender=()=>updateSemanticPhysicalOptics(mesh,cubie.logical);semanticEngravedTiles.push({mesh,material,mask,rough,logical:{...cubie.logical}})}covered.add(cubie.id)}semanticEngravedLogicalTileCount=covered.size;if(semanticEngravedLogicalTileCount!==9)throw new Error(\`R4.3 physical engraving coverage expected 9 logical tiles, got \${semanticEngravedLogicalTileCount}\`);return semanticEngravedTiles.length}
function updateSemanticPhysicalOptics(mesh,logical){const s=semanticOpticalScratch,q=mesh.getWorldQuaternion(s.q),center=mesh.getWorldPosition(s.center),cameraWorld=camera.getWorldPosition(s.camera),lightWorld=key.getWorldPosition(s.light),normal=s.normal.set(0,0,1).applyQuaternion(q).normalize(),tx=s.tx.set(1,0,0).applyQuaternion(q).normalize(),ty=s.ty.set(0,1,0).applyQuaternion(q).normalize(),view=s.view.copy(cameraWorld).sub(center).normalize(),lightDir=s.lightDir.copy(lightWorld).sub(center).normalize(),half=s.half.copy(view).add(lightDir).normalize();const faceView=THREE.MathUtils.clamp(Math.abs(normal.dot(view)),0,1),halfDot=THREE.MathUtils.clamp(Math.abs(normal.dot(half)),0,1),spec=smootherstep(THREE.MathUtils.clamp((halfDot-.57)/.36,0,1)),viewSupport=.34+.66*smootherstep(THREE.MathUtils.clamp((faceView-.30)/.58,0,1)),alignment=THREE.MathUtils.clamp(spec*viewSupport,0,1);let ax=lightDir.dot(tx),ay=lightDir.dot(ty),alen=Math.hypot(ax,ay);if(alen<.08){ax=.82;ay=.57;alen=Math.hypot(ax,ay)}s.axis.set(ax/alen,ay/alen);const hx=THREE.MathUtils.clamp(half.dot(tx),-.62,.62),hy=THREE.MathUtils.clamp(half.dot(ty),-.62,.62);s.fieldCenter.set(.5+hx*.14,.5+hy*.12);if(logical.x===0&&logical.y===0){if(alignment>=.72&&semanticR43OpportunityArmed){semanticR43OpportunityCount++;semanticR43OpportunityArmed=false}else if(alignment<=.56)semanticR43OpportunityArmed=true;semanticR43OpticalDiagnostics={alignment,faceView,halfDot,fieldCenter:s.fieldCenter.toArray(),fieldAxis:s.axis.toArray(),opportunity:alignment,persistent:true,microNormal:true,alphaDominant:false,engravedFace:SEMANTIC_R4_3_ENGRAVED_FACE,physicalCubieMaterial:true,visualDriverTimeline:false,naturalOpportunityCount:semanticR43OpportunityCount}}}
function createSemanticTextMaterial(){const m=new THREE.MeshBasicMaterial({visible:false,transparent:true,opacity:0});m.userData.semanticMaterial='R4_3_DISABLED_OVERLAY_TEXT';return m}`;

rx(/function createSemanticTextMaterial\(maskTexture\) \{[\s\S]*?\n\}\n\nfunction setupSemanticSurface/, `${physicalEngraving}\n\nfunction setupSemanticSurface`, 'physical cubie engraving');
one('  semanticMaskTexture = createBrandMaskTexture();', '  semanticMaskTexture = createSeamAwareBrandMaskTexture(createBrandMaskTexture(), faceSpan);', 'seam-aware global mask');
one('  semanticTextMeshes = [softText, sharpText];\n  semanticText = sharpText;', `  semanticTextMeshes = [softText, sharpText];
  softText.visible=false;sharpText.visible=false;semanticSurface.visible=false;
  installPhysicalSemanticEngraving(semanticMaskTexture);
  semanticText=sharpText;`, 'install actual cubie engraving');
one('  orientSemanticGroup(SEMANTIC_R4.selectedFallbackFace);', `  semanticFace=SEMANTIC_R4_3_ENGRAVED_FACE;
  orientSemanticGroup(SEMANTIC_R4_3_ENGRAVED_FACE);`, 'fixed physical engraved face diagnostic');

const visual=`function setSemanticVisualState(){if(!semanticReady)return false;semanticSurfaceProgress=0;semanticTextFormation=1;semanticTextLuminance=1;semanticSweep=.50;semanticSurface.visible=false;semanticTextMeshes.forEach(mesh=>mesh.visible=false);semanticGroup.visible=false;return true;}`;
rx(/function setSemanticVisualState\([\s\S]*?\n\}\n\nfunction setSemanticReviewState/,`${visual}\n\nfunction setSemanticReviewState`,'no overlay visual lifecycle');
const clear=`function clearSemanticReviewState(){if(!semanticReady)return false;semanticSurfaceProgress=0;semanticTextFormation=1;semanticTextLuminance=1;semanticSweep=.50;semanticSurface.visible=false;semanticTextMeshes.forEach(mesh=>mesh.visible=false);semanticGroup.visible=false;return true;}`;
rx(/function clearSemanticReviewState\(\) \{[\s\S]*?\n\}\n\nfunction semanticTimelineState/,`${clear}\n\nfunction semanticTimelineState`,'persistent physical clear state');
const timeline=`function semanticTimelineState(elapsedMs){const total=SEMANTIC_R4.revealMs+SEMANTIC_R4.readableHoldMs+SEMANTIC_R4.exitMs;const envelopeIn=smootherstep(THREE.MathUtils.clamp(elapsedMs/720,0,1)),envelopeOut=1-smootherstep(THREE.MathUtils.clamp((elapsedMs-1450)/920,0,1));return{timeScale:1,surface:0,formation:1,luminance:envelopeIn*envelopeOut,sweep:.50,exit:0,holdEnd:SEMANTIC_R4.revealMs+SEMANTIC_R4.readableHoldMs,blockRelease:0,total,opportunityEnvelope:envelopeIn*envelopeOut}}`;
rx(/function semanticTimelineState\(elapsedMs\) \{[\s\S]*?\n\}\n\nfunction beginSemanticRuntime/,`${timeline}\n\nfunction beginSemanticRuntime`,'neutral opportunity bookkeeping');
const runtime=`function beginSemanticRuntime(now){semanticFace=SEMANTIC_R4_3_ENGRAVED_FACE;semanticVisibilityDot=semanticR43OpticalDiagnostics.faceView;semanticActive=true;semanticPending=false;semanticComplete=false;semanticBlocksSlices=false;semanticTimeScale=1;semanticStartWallMs=now;semanticElapsedMs=0;semanticEntryPresentationMs=presentationSimTimeMs;semanticHoldPresentationMs=null;semanticFirstSurfaceWallMs=null;semanticFirstTypographyWallMs=now;semanticCompletedWallMs=null;semanticSchedulerEntry={eventSerial:sliceEventSerial,eventsUntilBreath,seed:sliceSeed>>>0}}
function replaySemanticBrandMoment(){if(!semanticReady||captureMode||prefersReducedMotion)return false;semanticReplayRequested=true;semanticComplete=false;semanticActive=false;semanticPending=false;semanticBlocksSlices=false;semanticTimeScale=1;return true}
function updateSemanticRuntime(now){if(captureMode||!semanticReady)return;semanticTimeScale=1;semanticBlocksSlices=false;if(prefersReducedMotion){setSemanticVisualState();return}if(!semanticActive&&!semanticComplete){if(!semanticReplayRequested&&presentationSimTimeMs<SEMANTIC_R4.triggerSearchStartMs)return;if(!semanticPending){semanticPending=true;semanticOpportunityWallMs=now;semanticOpportunityPresentationMs=presentationSimTimeMs;semanticOpportunityActiveTurns=activeTurns.size;semanticWaitedForActiveSlice=false}beginSemanticRuntime(now);semanticReplayRequested=false}if(!semanticActive){setSemanticVisualState();return}semanticElapsedMs=Math.max(0,now-semanticStartWallMs);const state=semanticTimelineState(semanticElapsedMs);if(semanticHoldPresentationMs===null&&semanticElapsedMs>=SEMANTIC_R4.revealMs)semanticHoldPresentationMs=presentationSimTimeMs;if(semanticElapsedMs>=state.total){semanticTimeScale=1;semanticBlocksSlices=false;semanticActive=false;semanticPending=false;semanticComplete=true;semanticCompletedWallMs=now;semanticSchedulerExit={eventSerial:sliceEventSerial,eventsUntilBreath,seed:sliceSeed>>>0}}}`;
rx(/function beginSemanticRuntime\(now, best = getCurrentBestFaceVisibility\(\)\) \{[\s\S]*?\n\}\n\nfunction replaySemanticBrandMoment\(\) \{[\s\S]*?\n\}\n\nfunction updateSemanticRuntime\(now\) \{[\s\S]*?\n\}\n\nfunction getSemanticDiagnostics/,`${runtime}\n\nfunction getSemanticDiagnostics`,'passive lifecycle');
one('  const deltaMs = wallDeltaMs * semanticTimeScale;',`  const deltaMs=wallDeltaMs;
  recordSemanticMotionSample(wallDeltaMs,deltaMs);`,'hard motion decoupling');
one('    textMeshCount: semanticTextMeshes.length,\n',`    textMeshCount: semanticTextMeshes.length,
    physicalEngravedTileMeshCount:semanticEngravedTiles.length,
    physicalEngravedLogicalTileCount:semanticEngravedLogicalTileCount,
    materialModel:'MeshPhysicalMaterial / R4.3 engraving embedded in outward +Z cubie face materials',
    materialPalette:SEMANTIC_R4_MATERIAL_PALETTE,
    revealCharacter:'persistent physical cubie engraving / BRDF-only discovery / no text overlay reveal',
    opticalDriver:SEMANTIC_R4_3_ENGRAVING.driver,
    opticalField:semanticR43OpticalDiagnostics,
    baseInlayTreatment:'inherited Graphite/Gunmetal/Black-Chrome cubie material with permanent bump micro-normal plus roughness/clearcoat-roughness micro-treatment',
    persistentInscription:true,
    alphaDominantReveal:false,
    microNormalEngraving:true,
    physicalCubieMaterial:true,
    overlayTextRendered:false,
    visualDriverTimeline:false,
    materialPropertiesStatic:true,
    semanticMotionCoupled:false,
    semanticOrientationForcing:false,
    semanticAcceleration:false,
    semanticDeceleration:false,
    effectiveGlobalMotionScale:1.0,
    naturalOpportunityCount:semanticR43OpportunityCount,
    motionTrace:semanticMotionTrace.slice(-960),
    seamAwareOcclusion:true,
    seamMaskSource:semanticMaskTexture?.userData?.semanticSeamMask?.source||null,
    emissive:false,
    glowHalo:false,
    scanWipeShimmer:false,
    letterWordStagger:false,
`,'physical R4.3 diagnostics');

fs.writeFileSync(file,source);
console.log(JSON.stringify({material:'R4.3 physical cubie MeshPhysicalMaterial engraving',surfaceMaxOpacity:0,persistentInscription:true,overlayTextRendered:false,physicalCubieMaterial:true,physicalLogicalTileCoverage:9,alphaDominantReveal:false,microNormalEngraving:true,visualDriverTimeline:false,opticalDriver:'actual outward +Z cubie BRDF + permanent bump micro-normal + static roughness/clearcoat-roughness treatment',seamAwareOcclusion:true,semanticVelocityMultiplier:1,semanticAcceleration:false,semanticDeceleration:false,semanticOrientationForcing:false,semanticMotionCoupled:false,effectiveGlobalMotionScale:1,timing:{triggerSearchStartMs:3200,triggerSearchEndMs:4200,diagnosticOpportunityEnvelopeMs:2370}},null,2));
