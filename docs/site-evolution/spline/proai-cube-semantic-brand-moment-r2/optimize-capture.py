from pathlib import Path
import re

p = Path(__file__).with_name('capture.mjs')
s = p.read_text()

pose_pat = r"const posePage = await openPage\(\);\nconst candidates = \[\];\nconst decelPresentationAdvanceSec = .*?\nawait posePage\.close\(\);"
pose_repl = r'''const posePage = await openPage();
const candidateTimes = [];
const decelPresentationAdvanceSec = (TIMING.decelerationMs / 1000) * 0.5;
for (let t = 3.0; t <= 8.05; t += 1 / 120) {
  const start = t - decelPresentationAdvanceSec;
  if (!stableGapAt(t) || !stableGapAt(start)) continue;
  const nextStart = Math.min(...videoEvents.filter((event) => event.start > t).map((event) => event.start), Infinity);
  if (nextStart - t < 0.08) continue;
  const crossingEvent = videoEvents.some((event) => event.end > start && event.start < t);
  if (crossingEvent) continue;
  candidateTimes.push(t);
}
const candidates = await posePage.evaluate((times) => times.map((timeSec) => window.__PROAI_CUBE_R1_2.getSemanticPoseAt(timeSec)), candidateTimes);
if (!candidates.length) throw new Error('No stable semantic pose candidates');
candidates.sort((a, b) => b.dot - a.dot);
const selectedPose = candidates[0];
if (selectedPose.dot < 0.88) throw new Error(`No semantic pose reached absolute minimum visibility dot; best=${selectedPose.dot}`);
await posePage.close();'''
s, n = re.subn(pose_pat, pose_repl, s, flags=re.S)
if n != 1:
    raise SystemExit(f'pose optimization anchor count={n}')

eq_pat = r"const equivalenceSamples = \[\];\nfor \(const t of \[2\.0, 6\.0, 9\.0, 15\.0, 17\.4, 26\.7\]\) \{.*?\nconst baselineEquivalencePass = equivalenceSamples\.every\(\(sample\) => sample\.pass\);"
eq_repl = r'''const equivalenceSamples = [];
for (const t of [2.0, 6.0, 9.0, 15.0, 17.4, 26.7]) {
  const equivalenceBaselinePage = await openPage(BASELINE_CAPTURE_URL);
  const equivalenceCurrentPage = await openPage(CAPTURE_URL);
  const a = await applyFilmstripState(equivalenceBaselinePage, t);
  const b = await applyFilmstripState(equivalenceCurrentPage, t);
  const diff = compareState(a, b);
  const pass = diff.presentationQuaternionRad < 1e-9
    && diff.presentationPosition < 1e-9 && diff.presentationScale < 1e-9
    && diff.cubeRootPosition < 1e-9 && diff.cubeRootQuaternionRad < 1e-9 && diff.cubeRootScale < 1e-9
    && diff.cameraPosition < 1e-9 && diff.cameraQuaternionRad < 1e-9 && diff.orbitTarget < 1e-9
    && diff.logicalExact && diff.completedTurnsExact && diff.activeTurnIdentityExact && diff.schedulerExact;
  equivalenceSamples.push({ presentationTimeSec: t, pass, diff });
  await equivalenceBaselinePage.close();
  await equivalenceCurrentPage.close();
}
const baselineEquivalencePass = equivalenceSamples.every((sample) => sample.pass);'''
s, n = re.subn(eq_pat, eq_repl, s, flags=re.S)
if n != 1:
    raise SystemExit(f'equivalence optimization anchor count={n}')

loop_start = s.index('for (let frame = 0; frame < wallTimeline.length; frame += 1) {')
loop_end = s.index('if (manualDown && !manualReleased) await page.mouse.up();', loop_start)
loop_repl = r'''await page.evaluate(() => { window.__PROAI_R2_CAPTURE_TURNS = {}; });
for (let frame = 0; frame < wallTimeline.length; frame += 1) {
  const point = wallTimeline[frame];
  const t = point.presentationT;
  const inManual = t >= MANUAL_START && t < MANUAL_END;
  const inCalm = t >= MANUAL_END && t < CALM_END;

  if (!manualDown && t >= MANUAL_START && t < MANUAL_START + FRAME_DT * 1.5) {
    await page.mouse.move(mx, my);
    await page.mouse.down();
    manualDown = true;
  }
  if (manualDown && !manualReleased && inManual) {
    const p = Math.min(1, Math.max(0, (Math.min(t, MANUAL_MOVE_END) - MANUAL_START) / (MANUAL_MOVE_END - MANUAL_START)));
    const eased = p * p * (3 - 2 * p);
    await page.mouse.move(mx + 150 * eased, my - 22 * eased);
  }
  if (manualDown && !manualReleased && t >= MANUAL_END) {
    await page.mouse.up();
    manualReleased = true;
  }

  const setPresentation = !inManual && !inCalm;
  const resumeProgress = t < CALM_END ? 1 : (t < SOFT_RESUME_END ? Math.max(0, Math.min(1, (t - CALM_END) / (SOFT_RESUME_END - CALM_END))) : 1);
  const instructions = [];
  for (const event of videoEvents) {
    if (!activeWindow(event, t)) continue;
    const progress = Math.max(0, Math.min(1, (t + FRAME_DT * Math.max(point.timeScale, 0.0001) - event.start) / (event.end - event.start)));
    instructions.push({ id: event.id, axis: event.axis, layer: event.layer, direction: event.direction, progress });
  }

  const result = await page.evaluate(({ t, resumeProgress, setPresentation, instructions, semantic, face }) => {
    const api = window.__PROAI_CUBE_R1_2;
    const turns = window.__PROAI_R2_CAPTURE_TURNS;
    if (setPresentation) api.setReviewPresentation(t, resumeProgress, false);
    for (const inst of instructions) {
      let state = turns[inst.id];
      if (!state) {
        const began = api.beginReviewTurn(inst.axis, inst.layer, inst.direction);
        if (!began) return { error: `Could not begin owner video event ${inst.id}` };
        state = { turnId: began.id, finalized: false };
        turns[inst.id] = state;
      }
      if (!state.finalized) {
        api.setReviewTurnProgress(state.turnId, inst.progress, false);
        if (inst.progress >= 1) state.finalized = true;
      }
    }
    if (semantic) {
      api.setSemanticReviewState({ face, surface: semantic.surface, formation: semantic.formation, luminance: semantic.luminance, sweep: semantic.sweep, exit: semantic.exit });
    } else {
      api.clearSemanticReviewState();
    }
    const diag = api.getDiagnostics();
    const cameraQuaternion = diag.interaction?.cameraQuaternion || api.getBaselineComparableState().camera.quaternion;
    api.renderReviewFrame();
    const dataUrl = document.getElementById('cube-canvas').toDataURL('image/jpeg', 0.91);
    return { diag, cameraQuaternion, dataUrl };
  }, { t, resumeProgress, setPresentation, instructions, semantic: point.semantic, face: selectedPose.face });
  if (result.error) throw new Error(result.error);

  const diag = result.diag;
  const currentIds = new Set(diag.activeTurns.map((turn) => turn.id));
  if (point.semantic && point.semantic.timeScale <= 0.0001 && diag.activeTurns.length > 0) semanticSliceOverlapFrames += 1;
  if (point.semantic && point.semanticElapsed < accelStart) {
    for (const id of currentIds) if (!previousActiveIds.has(id)) semanticNewSliceStarts += 1;
  }
  previousActiveIds = currentIds;

  const q = diag.presentation.quaternion;
  const bodyDelta = previousPresentationQ ? quatAngle(previousPresentationQ, q) : 0;
  maxBodyDeltaRad = Math.max(maxBodyDeltaRad, bodyDelta);
  const cameraQ = result.cameraQuaternion;
  const cameraDelta = previousCameraQ ? quatAngle(previousCameraQ, cameraQ) : 0;
  if (!inManual) maxCameraDeltaRadOutsideManual = Math.max(maxCameraDeltaRadOutsideManual, cameraDelta);
  if (point.semantic && point.semantic.timeScale <= 0.0001) {
    if (!holdStartBodyQ) holdStartBodyQ = [...q];
    lastHoldBodyQ = [...q];
  }
  if (previousTimeScale <= 0.0001 && point.timeScale > 0.0001 && firstResumeBodyDeltaRad === null) firstResumeBodyDeltaRad = bodyDelta;

  const peakWindow = point.semanticElapsed >= TIMING.specularStartMs + TIMING.specularMs * 0.52
    && point.semanticElapsed < TIMING.specularStartMs + TIMING.specularMs * 0.52 + FRAME_DT * 1000;
  if (!peakCaptured && peakWindow) {
    await page.screenshot({ path: PEAK_PATH, fullPage: true });
    peakCaptured = true;
  }
  if (!postCaptured && semanticEventFinished && t >= 9.05 && t < 9.05 + FRAME_DT * 1.2) {
    await page.screenshot({ path: POST_PATH, fullPage: true });
    postCaptured = true;
  }

  frameBuffers.push(jpegBufferFromDataUrl(result.dataUrl));
  frameStates.push({ wallT: point.wallT, presentationT: t, timeScale: point.timeScale, bodyDelta, cameraDelta, activeTurns: diag.activeTurns.length });
  previousPresentationQ = [...q];
  previousCameraQ = [...cameraQ];
  previousTimeScale = point.timeScale;
  if ((frame + 1) % 120 === 0) console.log(`Semantic R2 frame ${frame + 1}/${wallTimeline.length}`);
}
'''
s = s[:loop_start] + loop_repl + s[loop_end:]
p.write_text(s)
print('capture.mjs IPC optimization applied')