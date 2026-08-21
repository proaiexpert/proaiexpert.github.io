// ProAI Cube FINAL MOTION R2 — dark-face readability micro-polish derivative.
// Authority: exact owner baseline interaction polish + ONE tiny environment-response calibration.
// Motion, slice scheduling, interaction, geometry, camera, tone mapping, exposure, and material albedo remain frozen.

const interactionUrl = new URL('./source-final-motion-r2-interaction-polish.js', import.meta.url);
const baseR2Url = new URL('./source-final-motion-r2.js', import.meta.url);
const materialsUrl = new URL('./source-materials-r1.js', import.meta.url);
const glbUrl = new URL('../../models/proai-cube/rubik_39_s_cube_animation.glb', import.meta.url);

const response = await fetch(interactionUrl, { cache: 'no-store' });
if (!response.ok) throw new Error(`FINAL MOTION R2 dark-face baseline HTTP ${response.status}`);
let source = await response.text();

function replaceOnce(oldValue, newValue, label) {
  const count = source.split(oldValue).length - 1;
  if (count !== 1) throw new Error(`FINAL MOTION R2 dark-face polish refused ${label}: ${count} matches`);
  source = source.replace(oldValue, newValue);
}

// The interaction derivative is evaluated from a Blob. Pin its three top-level
// resources as one unique block so embedded patch-target strings remain untouched.
replaceOnce(
  `const baseR2Url = new URL('./source-final-motion-r2.js', import.meta.url);\nconst materialsUrl = new URL('./source-materials-r1.js', import.meta.url);\nconst glbUrl = new URL('../../models/proai-cube/rubik_39_s_cube_animation.glb', import.meta.url);`,
  `const baseR2Url = new URL('${baseR2Url.href}');\nconst materialsUrl = new URL('${materialsUrl.href}');\nconst glbUrl = new URL('${glbUrl.href}');`,
  'baseline resource URL block',
);

// Inject one coherent B-candidate change into the R2 patcher before it evaluates
// the frozen source-materials-r1 substrate. Black albedo stays #181d23; only the
// black-chrome environment response changes from 1.26 to 1.31 (+3.97%).
const injectionAnchor = '// Keep the proven R2 drag sensitivity. Add a bounded living-auto contribution and';
const visualInjection = `// Dark-face readability R1 — tiny blackChrome environment-response calibration only.
replaceOnce(
  "let source = await response.text();\\n\\nconst REQUIRED_BASE_MARKERS = [",
  [
    "let source = await response.text();",
    "",
    "const DARK_FACE_MATERIAL_A = \\\"blackChromeFace: Object.freeze({ color: '#181d23', metalness: 0.92, roughness: 0.225, clearcoat: 0.16, clearcoatRoughness: 0.16, envMapIntensity: 1.26 })\\\";",
    "const DARK_FACE_MATERIAL_B = \\\"blackChromeFace: Object.freeze({ color: '#181d23', metalness: 0.92, roughness: 0.225, clearcoat: 0.16, clearcoatRoughness: 0.16, envMapIntensity: 1.31 })\\\";",
    "if ((source.split(DARK_FACE_MATERIAL_A).length - 1) !== 1) throw new Error('Dark-face material anchor mismatch');",
    "source = source.replace(DARK_FACE_MATERIAL_A, DARK_FACE_MATERIAL_B);",
    "",
    "const REQUIRED_BASE_MARKERS = [",
  ].join("\\n"),
  'dark-face environment response',
);

`;
replaceOnce(
  injectionAnchor,
  `${visualInjection}${injectionAnchor}`,
  'dark-face visual injection',
);

const requiredBaselineMarkers = [
  'dragRadiansPerPixel: 0.0052',
  'activeAutoInfluence: 0.30',
  "motionAuthority: 'proai-final-motion-r2'",
  "selectedPreset: 'premiumHybrid'",
  'envMapIntensity: 1.31',
];
for (const marker of requiredBaselineMarkers) {
  if (!source.includes(marker)) throw new Error(`FINAL MOTION R2 dark-face authority missing: ${marker}`);
}

const moduleUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
try {
  await import(moduleUrl);
  window.__PROAI_CUBE_DARK_FACE_READABILITY_R1 = window.__PROAI_CUBE_FINAL_MOTION_R2_INTERACTION_POLISH || window.__PROAI_CUBE_FINAL_MOTION_R2;
} finally {
  URL.revokeObjectURL(moduleUrl);
}
