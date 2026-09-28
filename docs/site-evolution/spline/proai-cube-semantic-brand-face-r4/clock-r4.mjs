import fs from 'node:fs';

const file = new URL('./main.generated.js', import.meta.url);
let source = fs.readFileSync(file, 'utf8');

function one(find, replacement, label) {
  const at = source.indexOf(find);
  if (at < 0) throw new Error(`R4 clock anchor missing: ${label}`);
  if (source.indexOf(find, at + find.length) >= 0) throw new Error(`R4 clock anchor not unique: ${label}`);
  source = source.slice(0, at) + replacement + source.slice(at + find.length);
}

one(
  'let semanticWaitedForActiveSlice = false;\nlet semanticTextMeshes = [];',
  'let semanticWaitedForActiveSlice = false;\nlet semanticRuntimeStartWallMs = null;\nlet semanticOpportunityMotionSimMs = null;\nlet semanticTextMeshes = [];',
  'semantic clock state',
);

one(
  '  semanticReady = true;\n  clearSemanticReviewState();',
  '  semanticReady = true;\n  semanticRuntimeStartWallMs = performance.now();\n  clearSemanticReviewState();',
  'semantic runtime clock start',
);

one(
  '    if (!semanticReplayRequested && presentationSimTimeMs < SEMANTIC_R4.triggerSearchStartMs) return;',
  '    const semanticRuntimeElapsedMs = semanticRuntimeStartWallMs === null ? 0 : Math.max(0, now - semanticRuntimeStartWallMs);\n    if (!semanticReplayRequested && semanticRuntimeElapsedMs < SEMANTIC_R4.triggerSearchStartMs) return;',
  'semantic trigger start clock',
);

one(
  '      semanticOpportunityWallMs = now;\n      semanticOpportunityPresentationMs = presentationSimTimeMs;',
  '      semanticOpportunityWallMs = now;\n      semanticOpportunityPresentationMs = semanticRuntimeElapsedMs;\n      semanticOpportunityMotionSimMs = presentationSimTimeMs;',
  'semantic opportunity diagnostics',
);

one(
  '    const insideWindow = !semanticReplayRequested && presentationSimTimeMs <= SEMANTIC_R4.triggerSearchEndMs;',
  '    const insideWindow = !semanticReplayRequested && semanticRuntimeElapsedMs <= SEMANTIC_R4.triggerSearchEndMs;',
  'semantic trigger end clock',
);

one(
  '    opportunityPresentationMs: semanticOpportunityPresentationMs,\n',
  '    opportunityPresentationMs: semanticOpportunityPresentationMs,\n    opportunityMotionSimMs: semanticOpportunityMotionSimMs,\n    runtimeStartWallMs: semanticRuntimeStartWallMs,\n',
  'semantic clock diagnostics',
);

fs.writeFileSync(file, source);
console.log('R4_WALL_CLOCK_SEMANTIC_TRIGGER_PASS');
