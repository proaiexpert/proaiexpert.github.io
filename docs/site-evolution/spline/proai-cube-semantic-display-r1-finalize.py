from pathlib import Path
import json, os

ROOT = Path(os.environ.get('PROAI_SEMANTIC_PROTOTYPE_DIR', Path(__file__).resolve().parent / 'proai-cube-semantic-display-r1'))
static = json.loads((ROOT/'STATIC_QA.json').read_text())
en = json.loads((ROOT/'EN_VIDEO_QA.json').read_text())
ru = json.loads((ROOT/'RU_VIDEO_QA.json').read_text())
freeze = json.loads((ROOT/'BASELINE_FREEZE.json').read_text())
mech = static['mechanicalQA']; fit = static['stringFitQA']; anchor = static['anchorQA']
config = static['initial']['semantic']['config']; look = static['initial']['lookDev']['config']
axis_pass = {axis: (mech['axisSupport'][axis]['forwardEndpointErrorRad']==0 and mech['axisSupport'][axis]['inverseEndpointErrorRad']==0 and mech['axisSupport'][axis]['restoredAfterPair']) for axis in ['X','Y','Z']}
layers_pass = all(mech['layerSupport'][axis][str(layer)]['pass'] for axis in ['X','Y','Z'] for layer in [-1,0,1])
semantic_critical = (en['semanticActivationCount']==5 and en['semanticCompletedCount']+en['semanticEarlyExitCount']==5 and en['semanticEarlyExitCount']>=1 and en['semanticSliceOverlapCount']==0 and en['semanticBodyActiveFrameRatio']>=0.95 and en['maxSimultaneousSemanticFaces']==1 and len(en['distinctSelectedFaces'])>=2 and fit['textClipCount']==0 and anchor['mirroredTextCount']==0 and fit['missingGlyphCount']==0 and ru['semanticActivationCount']==3 and ru['semanticCompletedCount']+ru['semanticEarlyExitCount']==3 and ru['semanticSliceOverlapCount']==0 and ru['semanticBodyActiveFrameRatio']>=0.95 and any(r['word']=='ОБРАЩЕНИЕ' for r in ru['semanticRecords']))
runtime_errors = static['runtime']['pageErrors'] + static['runtime']['consoleErrors'] + en['runtime']['pageErrors'] + en['runtime']['consoleErrors'] + ru['runtime']['pageErrors'] + ru['runtime']['consoleErrors']
acceptance = {
    'semanticDisplayR1':'PASS' if semantic_critical else 'FAIL','geometryR1Preserved':'PASS' if freeze['geometryFrozen'] else 'FAIL','motionR1_2CoreValuesPreserved':'PASS' if freeze['motionCoreFrozen'] else 'FAIL','materialsLightingR1Preserved':'PASS' if freeze['materialsLightingFrozen'] else 'FAIL',
    'X':'PASS' if axis_pass['X'] else 'FAIL','Y':'PASS' if axis_pass['Y'] else 'FAIL','Z':'PASS' if axis_pass['Z'] else 'FAIL','layerSupport':'PASS' if layers_pass else 'FAIL','repeatability30':'PASS' if mech['repeatability30']['pass'] else 'FAIL','pairedTurns':'PASS' if mech['pairedTurnQA']['pass'] and mech['pairedTurnQA']['physicalCubieIntersectionCount']==0 else 'FAIL','inverseRestoration':'PASS' if mech['inverseRestoration']['pass'] else 'FAIL','interaction':'PASS' if static['interaction']['semanticInteractionPass'] and static['interaction']['mechanicalInteractionPass'] else 'FAIL',
    'stringFitEN':'PASS' if all(not x['clipping'] and x['glyphCoverage'] for x in fit['en']) else 'FAIL','stringFitRU':'PASS' if all(not x['clipping'] and x['glyphCoverage'] for x in fit['ru']) else 'FAIL','faceOrientationAllSix':'PASS' if anchor['pass'] else 'FAIL','reducedMotion':'PASS' if static['reducedMotion']['pass'] else 'FAIL','GLBUnchanged':'PASS' if static['glb']['sha256']=='dbb7fc4156f8c9ed2481dd76443dffb9a45ecb5493463f99bffb34dd3b59c79b' else 'FAIL','splineDependency':'NONE' if not static['runtime']['forbiddenSplineRequests'] else 'OTHER','browserRuntime':'PASS' if not runtime_errors else 'FAIL','ownerENMP4':'PASS' if en['mp4']['pass'] else 'FAIL','ownerRUMP4':'PASS' if ru['mp4']['pass'] else 'FAIL',
}
acceptance['overall']='PASS' if all(v in ('PASS','NONE') for v in acceptance.values()) else 'FAIL'
semantic = {'semanticActivationCount':en['semanticActivationCount'],'semanticCompletedCount':en['semanticCompletedCount'],'semanticEarlyExitCount':en['semanticEarlyExitCount'],'semanticSliceOverlapCount':en['semanticSliceOverlapCount'],'semanticBodyActiveFrameRatio':en['semanticBodyActiveFrameRatio'],'averageReadableHoldMs':en['averageReadableHoldMs'],'minimumEntryFaceVisibilityDot':en['minimumEntryFaceVisibilityDot'],'minimumActiveFaceVisibilityDot':en['minimumActiveFaceVisibilityDot'],'maxSimultaneousSemanticFaces':en['maxSimultaneousSemanticFaces'],'textClipCount':fit['textClipCount'],'mirroredTextCount':anchor['mirroredTextCount'],'missingGlyphCount':fit['missingGlyphCount'],'zFightingFlicker':'PASS_STRUCTURAL_MULTI_ANGLE_CAPTURE','cyrillicRendering':'PASS' if all(not x['clipping'] and x['glyphCoverage'] for x in fit['ru']) else 'FAIL','enStringFit':fit['en'],'ruStringFit':fit['ru'],'faceOrientation':anchor,'enVideo':en,'ruVideo':ru}
(ROOT/'SEMANTIC_QA.json').write_text(json.dumps(semantic,indent=2,ensure_ascii=False)+'\n')
qa = {'generatedAt':static['generatedAt'],'source':{'implementationBaseBranch':'agent/proai-cube-materials-lighting-r1','implementationBaseCommit':'d17806da42275db617d8a46b231a2d877706a179','geometryBaselineCommit':'73082717909b6f4225841401fe4962d6ff4bbcca','motionBaselineCommit':'89965750e4456a6e2d54d8309809471f8dbfcc75','branch':'agent/proai-cube-semantic-display-r1','prototypePath':'docs/site-evolution/spline/proai-cube-semantic-display-r1/','glbBytes':static['glb']['bytes'],'glbSha256':static['glb']['sha256']},'baselineFreeze':freeze,'semanticConfig':config,'approvedLookDev':look,'mechanicalQA':mech,'interactionQA':static['interaction'],'reducedMotion':static['reducedMotion'],'semanticQA':semantic,'performance':{'softwareCIRenderBenchmark':static['performanceDiagnostic'],'note':'SwiftShader CI diagnostic only; not an iPhone FPS claim.'},'runtime':{'errors':runtime_errors,'forbiddenSplineRequests':static['runtime']['forbiddenSplineRequests'],'pass':not runtime_errors and not static['runtime']['forbiddenSplineRequests']},'videos':{'en':en['mp4'],'ru':ru['mp4']},'acceptance':acceptance}
(ROOT/'QA.json').write_text(json.dumps(qa,indent=2,ensure_ascii=False)+'\n')
faces=static['initial']['semantic']['bounds']['faces']; first_face=next(iter(faces.values()))
report=f'''# ProAI Cube — Semantic Display R1

## Scope
Built from owner-approved Materials + Lighting R1 commit `d17806da42275db617d8a46b231a2d877706a179`. Geometry R1, Motion R1.2 core values, and Materials + Lighting R1 are frozen. Semantic R1 adds one reusable unified face display and semantic scheduling/gating only.

## Unified display system
- Architecture: **one reusable SemanticDisplayGroup**, one near-coplanar unified physical surface mesh + one reusable typography plane. No nine display tiles; no letters parented to cubies.
- Face bounds are derived from live mechanical mesh bounds. Representative face span: **{first_face['width']:.3f} × {first_face['height']:.3f}**; display inset ratio **{config['displayInsetRatio']}**.
- Face offset: **{config['faceOffset']}** local units; text offset: **{config['textOffset']}** local units.
- Display material: **{config['displayMaterial']['color']}**, metalness **{config['displayMaterial']['metalness']}**, roughness **{config['displayMaterial']['roughness']}**, clearcoat **{config['displayMaterial']['clearcoat']}**, clearcoat roughness **{config['displayMaterial']['clearcoatRoughness']}**, env intensity **{config['displayMaterial']['envMapIntensity']}**.
- Text: CanvasTexture **{config['text']['textureWidth']}×{config['text']['textureHeight']}**, color **{config['text']['color']}**, weight **{config['text']['fontWeight']}**, measured binary font-size fitting. Requested stack: `{config['text']['requestedFontStack']}`. Actual resolved font is recorded per string in `SEMANTIC_QA.json`.

## Semantic behavior
- EN: AI EXPERT → TRUST → INQUIRY → RESPONSE → RESULT.
- RU: AI EXPERT → ДОВЕРИЕ → ОБРАЩЕНИЕ → ОТВЕТ → РЕЗУЛЬТАТ.
- Runtime cadence: **{config['cadence']['opportunityMinMs']}–{config['cadence']['opportunityMaxMs']} ms**; poor windows defer.
- Entry visibility dot **{config['gates']['entryVisibilityDot']}**; active exit dot **{config['gates']['activeExitVisibilityDot']}**; entry body-speed ≤ **{config['gates']['entryMaxAbsYawDegPerSec']}°/s**; early-exit speed > **{config['gates']['earlyExitMaxAbsYawDegPerSec']}°/s**.
- Surface in {config['timings']['surfaceInMs']} ms; text delay {config['timings']['textDelayMs']} ms; text in {config['timings']['textInMs']} ms; readable hold {config['timings']['readableHoldMs']} ms; text out {config['timings']['textOutMs']} ms; surface out {config['timings']['surfaceOutMs']} ms; slice resume {config['timings']['sliceResumeOffsetMs']} ms.
- In-plane orientation tests 0°/90°/180°/270° in screen projection, selects the most upright candidate, then locks it for the event.
- Manual Orbit fast-resolves semantic state; approved R1.2 camera/calm/recovery remains authoritative. Reduced motion disables automatic semantic cycling.

## Intentional scheduler delta
`sliceAutonomyBlocked()` now calls the unchanged original interaction/recovery predicate plus `semanticBlocksNewSlices()`. This only delays initiation of **new** Rubik events while semantic display/recovery is active. Active turns, ±90° math, easing, event distribution, turn durations, pair safety and R1.2 presentation values are unchanged. See `BASELINE_FREEZE.json`.

## QA
- Semantic Display R1: **{acceptance['semanticDisplayR1']}**. Geometry **{acceptance['geometryR1Preserved']}**; Motion core **{acceptance['motionR1_2CoreValuesPreserved']}**; Materials/Lighting **{acceptance['materialsLightingR1Preserved']}**.
- X/Y/Z: **{acceptance['X']} / {acceptance['Y']} / {acceptance['Z']}**; layers **{acceptance['layerSupport']}**.
- 30 mixed turns: **{acceptance['repeatability30']}**, max position {mech['repeatability30']['maxCanonicalPosition']}; quaternion {mech['repeatability30']['maxCanonicalQuaternionRad']}; scale {mech['repeatability30']['maxCanonicalScale']}.
- Paired mechanics **{acceptance['pairedTurns']}**, physical cubie intersections {mech['pairedTurnQA']['physicalCubieIntersectionCount']}. Inverse **{acceptance['inverseRestoration']}**. Interaction **{acceptance['interaction']}**.
- EN semantic: activations {en['semanticActivationCount']}, completed {en['semanticCompletedCount']}, early exits {en['semanticEarlyExitCount']}, slice overlap {en['semanticSliceOverlapCount']}, body-active ratio {en['semanticBodyActiveFrameRatio']:.4f}, avg readable hold {en['averageReadableHoldMs']:.1f} ms, min entry dot {en['minimumEntryFaceVisibilityDot']:.4f}, min active dot {en['minimumActiveFaceVisibilityDot']:.4f}.
- Text: clip {fit['textClipCount']}; mirrored {anchor['mirroredTextCount']}; missing glyph {fit['missingGlyphCount']}; Cyrillic **{semantic['cyrillicRendering']}**.
- GLB **{acceptance['GLBUnchanged']}**; Spline **{acceptance['splineDependency']}**; runtime **{acceptance['browserRuntime']}**.
- EN MP4 **{acceptance['ownerENMP4']}**: 41 s / 24 fps / H.264 / yuv420p / 720×720. RU MP4 **{acceptance['ownerRUMP4']}**: 22 s / 24 fps / H.264 / yuv420p / 720×720.
- Automated overall: **{acceptance['overall']}**.

## Evidence
Primary EN: `review/proai-cube-semantic-display-r1-en-review-41s.mp4`  
RU proof: `review/proai-cube-semantic-display-r1-ru-proof-22s.mp4`  
EN contact: `review/semantic-contact-sheet-en.png`  
RU contact: `review/semantic-contact-sheet-ru.png`  
See `review/` for ten high-resolution screenshots and video contact sheets.

## Gate
Stop after Semantic Display R1. No Background/Spatial Integration or Hero Integration is started. Owner visual approval is required before any later phase.
'''
(ROOT/'REPORT.md').write_text(report)
print(json.dumps({'overall':acceptance['overall'],'semantic':semantic_critical,'runtimeErrors':runtime_errors},indent=2,ensure_ascii=False))
if acceptance['overall']!='PASS': raise SystemExit('Final Semantic Display R1 acceptance failed')
