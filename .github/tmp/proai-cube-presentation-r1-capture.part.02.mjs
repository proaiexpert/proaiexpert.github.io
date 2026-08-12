await addInspectionWithSlice('full-360-inspection-multiaxis', 2, 8.80, { axis: 'Z', layer: 1, direction: 1, seconds: 1.24, startProgress: 0.72 });
await addHold('inspection-settle', 0.70);
await addManualOrbit('manual-orbit-drag', 1.10);
await addHold('manual-calm-delay', 1.85, { frozen: true });
await addHold('soft-autonomous-resume', 2.40, { resume: true });
await addTurn('rubik-y0-after-resume', 'Y', 0, -1, 1.32);
await addHold('closing-settle', 0.70);
await videoPage.close();
await browser.close();

encodeFrames(frameBuffers, MP4_PATH, ['-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart']);
encodeFrames(frameBuffers, WEBM_PATH, ['-c:v', 'libvpx', '-deadline', 'realtime', '-cpu-used', '8', '-pix_fmt', 'yuv420p', '-auto-alt-ref', '0', '-b:v', '1800k']);
const mp4Probe = ffprobe(MP4_PATH);
const webmProbe = ffprobe(WEBM_PATH);
const mp4Stream = mp4Probe.streams[0];
const mp4Format = mp4Probe.format;
const expectedFrames = frameBuffers.length;
const expectedDurationSec = expectedFrames / FPS;
const mp4Pass = mp4Stream.codec_name === 'h264'
  && mp4Stream.pix_fmt === 'yuv420p'
  && mp4Stream.avg_frame_rate === '24/1'
  && Number(mp4Stream.nb_read_frames) === expectedFrames
  && Math.abs(Number(mp4Format.duration) - expectedDurationSec) < 0.05
  && String(mp4Format.format_name).includes('mp4');

const forbiddenRequests = requests.filter((url) => /splinetool|prod\.spline\.design|\.splinecode/i.test(url));
const axisPass = Object.fromEntries(Object.entries(mechanicalQA.axisSupport).map(([axis, result]) => [axis, result.forwardEndpointErrorRad === 0 && result.inverseEndpointErrorRad === 0 && result.restoredAfterPair]));
const layerPass = Object.values(mechanicalQA.layerSupport).every((layers) => Object.values(layers).every((entry) => entry.pass));
const runtimePass = pageErrors.length === 0 && consoleErrors.length === 0 && forbiddenRequests.length === 0;
const allPass = geometryConfigFrozen && geometryStatsFrozen && geometryCodeFrozen && full360Pass && interactionPass
  && axisPass.X && axisPass.Y && axisPass.Z && layerPass
  && mechanicalQA.repeatability30.pass && mechanicalQA.inverseRestoration.pass && runtimePass && mp4Pass;

const qa = {
  generatedAt: new Date().toISOString(),
  source: {
    baselineBranch: 'agent/proai-cube-geometry-r1',
    baselineCommit: '73082717909b6f4225841401fe4962d6ff4bbcca',
    branch: 'agent/proai-cube-presentation-motion-r1',
    prototypePath: 'docs/site-evolution/spline/proai-cube-presentation-motion-r1/',
    glbBytes: fs.statSync(GLB_PATH).size,
    glbSha256: sha256(GLB_PATH),
  },
  geometryFreeze: {
    config: initialDiagnostics.geometryConfig,
    stats: initialDiagnostics.geometry,
    configFrozen: geometryConfigFrozen,
    statsFrozen: geometryStatsFrozen,
    codeFrozen: geometryCodeFrozen,
    pass: geometryConfigFrozen && geometryStatsFrozen && geometryCodeFrozen,
  },
  presentation: {
    config: initialDiagnostics.presentationConfig,
    full360Move,
    full360Samples,
    full360Pass,
  },
  mechanicalQA,
  interactionQA: {
    dragTurn,
    duringDrag: duringDrag.interaction,
    sliceFinishedWhileDrag: { activeTurn: sliceFinishedWhileDrag.activeTurn, lastTurnResult: sliceFinishedWhileDrag.lastTurnResult },
    blockedAfterSlice: { activeTurn: blockedAfterSlice.activeTurn, interaction: blockedAfterSlice.interaction },
    afterRelease: afterRelease.interaction,
    duringCalmDelay: duringCalmDelay.interaction,
    earlyResume: earlyResume.interaction,
    blendedResume: blendedResume.interaction,
    activeSliceCompleted,
    nextSliceBlocked,
    cameraNoSnap,
    pass: interactionPass,
  },
  video: {
    mp4: { path: 'review/' + path.basename(MP4_PATH), ...mp4Probe, byteLength: fs.statSync(MP4_PATH).size },
    webm: { path: 'review/' + path.basename(WEBM_PATH), ...webmProbe, byteLength: fs.statSync(WEBM_PATH).size },
    fps: FPS,
    frameCount: expectedFrames,
    expectedDurationSec,
    segments,
    mp4Pass,
    coverage: {
      normal3q: true,
      rubikSlices: true,
      largeAngleRotation: true,
      full360: true,
      multiAxisPresentation: true,
      settle: true,
      manualOrbitDrag: true,
      softAutonomousResume: true,
      sliceDuringInspection: true,
    },
  },
  runtime: { totalRequests: requests.length, forbiddenRequests, splineDependency: forbiddenRequests.length ? 'FOUND' : 'NONE', pageErrors, consoleErrors, pass: runtimePass },
  acceptance: {
    geometryR1Preserved: geometryConfigFrozen && geometryStatsFrozen && geometryCodeFrozen ? 'PASS' : 'FAIL',
    wholeCube360: full360Pass ? 'PASS' : 'FAIL',
    interaction: interactionPass ? 'PASS' : 'FAIL',
    X: axisPass.X ? 'PASS' : 'FAIL',
    Y: axisPass.Y ? 'PASS' : 'FAIL',
    Z: axisPass.Z ? 'PASS' : 'FAIL',
    layerSupport: layerPass ? 'PASS' : 'FAIL',
    repeatability30: mechanicalQA.repeatability30.pass ? 'PASS' : 'FAIL',
    inverseRestoration: mechanicalQA.inverseRestoration.pass ? 'PASS' : 'FAIL',
    runtime: runtimePass ? 'PASS' : 'FAIL',
    ownerReviewMP4: mp4Pass ? 'PASS' : 'FAIL',
    splineDependency: forbiddenRequests.length ? 'FOUND' : 'NONE',
    overall: allPass ? 'PASS' : 'FAIL',
  },
};
fs.writeFileSync(QA_PATH, JSON.stringify(qa, null, 2) + '\n');

const p = initialDiagnostics.presentationConfig;
const report = `# ProAI Rubik Cube — Presentation Motion R1.1\n\n## Scope\n\nPresentation-motion-only refinement from Geometry R1 commit \`73082717909b6f4225841401fe4962d6ff4bbcca\`. Geometry R1, bevel/gaps, temporary materials/lights and X/Y/Z slice mechanics are frozen.\n\n## Whole-cube presentation\n\n- Large yaw moves: **${p.moves.map((m) => m.yawDeg + '°').join(', ')}**.\n- Duration range: **${p.inspectionDurationRangeMs[0]}–${p.inspectionDurationRangeMs[1]} ms**.\n- Full 360 move: **${p.moves.find((m) => Math.abs(m.yawDeg) === 360).durationMs} ms**, rare in the autonomous sequence.\n- Secondary modulation: pitch up to **±${Math.max(...p.moves.map((m) => Math.abs(m.pitchAmpDeg)))}°**, roll up to **±${Math.max(...p.moves.map((m) => Math.abs(m.rollAmpDeg)))}°**.\n- Presentation easing profiles: ${p.easingProfiles.map((curve) => `cubic-bezier(${curve.join(', ')})`).join('; ')}.\n- Existing micro drift remains unchanged: yaw ±3.8°, pitch ±2.15°, roll ±0.65°.\n\n## Interaction semantics\n\n- Manual Orbit drag pauses whole-cube presentation and blocks new autonomous slices.\n- An already active Rubik slice continues to its exact ±90° endpoint during drag.\n- Release delay remains **1850 ms**; presentation blend remains **2400 ms**.\n- Camera remains at the manually chosen orbit; no automatic camera reset/snap.\n- Horizontal azimuth is unrestricted; vertical polar range remains Geometry R1 / Motion R1 bounds.\n\n## QA\n\n- Geometry R1 preserved: **${qa.acceptance.geometryR1Preserved}**.\n- Full 360 inspection: **${qa.acceptance.wholeCube360}**.\n- Interaction active-slice completion / no next slice / no snap: **${qa.acceptance.interaction}**.\n- X / Y / Z: **${qa.acceptance.X} / ${qa.acceptance.Y} / ${qa.acceptance.Z}**.\n- 30 mixed turns: **${qa.acceptance.repeatability30}**; max position ${mechanicalQA.repeatability30.maxCanonicalPosition}; quaternion ${mechanicalQA.repeatability30.maxCanonicalQuaternionRad}; scale ${mechanicalQA.repeatability30.maxCanonicalScale}.\n- Inverse restoration: **${qa.acceptance.inverseRestoration}**.\n- Browser/runtime: **${qa.acceptance.runtime}**; Spline dependency **${qa.acceptance.splineDependency}**.\n- Owner MP4: **${qa.acceptance.ownerReviewMP4}**, ${expectedDurationSec.toFixed(3)} s @ ${FPS} fps, H.264/yuv420p.\n\n## Review evidence\n\n- \`review/proai-cube-presentation-motion-r1-natural.png\`\n- \`review/proai-cube-presentation-motion-r1-large-angle.png\`\n- \`review/proai-cube-presentation-motion-r1-slice-plus-presentation.png\`\n- \`review/proai-cube-presentation-motion-r1-review-20s.mp4\` (primary)\n- \`review/proai-cube-presentation-motion-r1-review-20s.webm\` (secondary)\n- \`QA.json\`\n\n## Gate\n\nAutomated acceptance: **${qa.acceptance.overall}**. Materials + Lighting remain blocked pending owner review.\n`;
fs.writeFileSync(REPORT_PATH, report);

console.log(JSON.stringify({ acceptance: qa.acceptance, video: { frames: expectedFrames, duration: expectedDurationSec, mp4: mp4Probe }, interaction: { activeSliceCompleted, nextSliceBlocked, cameraNoSnap }, full360Samples }, null, 2));
if (!allPass) process.exitCode = 1;
