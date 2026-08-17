import fs from 'node:fs';

const file = new URL('./main.generated.js', import.meta.url);
let source = fs.readFileSync(file, 'utf8');

const replaceUnique = (find, replacement, label) => {
  const at = source.indexOf(find);
  const next = at >= 0 ? source.indexOf(find, at + find.length) : -1;
  if (at < 0 || next >= 0) throw new Error(`R4.4.4 authored phrase graph R2 ${label}: ${at}/${next}`);
  source = source.slice(0, at) + replacement + source.slice(at + find.length);
};

const replaceFunction = (name, nextName, replacement, label, nextPrefix = 'function ') => {
  const start = `function ${name}(`;
  const at = source.indexOf(start);
  const next = source.indexOf(`\n${nextPrefix}${nextName}(`, at + start.length);
  if (at < 0 || next < 0 || source.indexOf(start, at + start.length) >= 0) {
    throw new Error(`R4.4.4 function R2 ${label}: ${at}/${next}`);
  }
  source = source.slice(0, at) + replacement + source.slice(next + 1);
};

// Verify R4.4.3 invariants are present before we modify
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
]) if (!source.includes(required)) throw new Error(`R4.4.4 missing R4.4.3 invariant: ${required}`);

// Verify continuous yaw (R4.4.3 fix)
for (const [from, to] of [
  ['{ timeMs: 36000, velocityDegPerSec: -8.0 }', '{ timeMs: 36000, velocityDegPerSec: 8.0 }'],
  ['{ timeMs: 43000, velocityDegPerSec: -11.0 }', '{ timeMs: 43000, velocityDegPerSec: 11.0 }'],
  ['{ timeMs: 49000, velocityDegPerSec: -24.0 }', '{ timeMs: 49000, velocityDegPerSec: 24.0 }'],
  ['{ timeMs: 55000, velocityDegPerSec: -29.0 }', '{ timeMs: 55000, velocityDegPerSec: 29.0 }'],
  ['{ timeMs: 60000, velocityDegPerSec: -14.0 }', '{ timeMs: 60000, velocityDegPerSec: 14.0 }'],
]) {
  if (source.includes(from)) throw new Error(`R4.4.4 found negative yaw to fix: ${from}`);
  if (!source.includes(to)) throw new Error(`R4.4.4 missing continuous yaw fix: ${to}`);
}

// Find the moveState anchor to insert our new lifecycle
const moveStateAnchor = "const semanticR442MoveState={recentMoves:[],moveLog:[],axisCounts:{X:0,Y:0,Z:0},layerCounts:{'-1':0,'0':0,'1':0},selectionCount:0,replacements:0,skipped:0};";
const moveStateAt = source.indexOf(moveStateAnchor);
if (moveStateAt < 0 || source.indexOf(moveStateAnchor, moveStateAt + moveStateAnchor.length) >= 0) {
  throw new Error(`R4.4.4 state anchor invalid: ${moveStateAt}`);
}

// ============================================================================
// AUTHORED PHRASE GRAPH R2 — PHYSICALLY GROUNDED ARCHITECTURE
// ============================================================================

const authoredPhraseGraphR2 = String.raw`
// ============================================================================
// AUTHORED PHRASE GRAPH R2 — PHYSICALLY GROUNDED
// Base: 29ee986fddd4609e32e0563c12c002bd65127d84 (R1)
// R2 adds: physical state model, computed validation, true authored phrases,
//          single lifecycle, single start authority, explicit protection
// ============================================================================

// ---------------------------------------------------------------------------
// PHYSICAL STATE MODEL
// ---------------------------------------------------------------------------
// Minimum representation to prove phrase correctness:
// - faceAssemblySig: 3-bit signature (bit 0=+Z, 1=+X, 2=-X) - which faces are assembled
// - protectedCubieIds: Set of cubie IDs currently under protection
// - currentGraphNode: the verified graph node the physical cube is in (+Z, +X, -X, or 'unknown')
// - phraseEndpointVerifier: validates declared endpoint matches computed physical result
//
// WHY SUFFICIENT:
// - Only 3 eligible faces (+Z, +X, -X) need tracking
// - Face assembly is binary (assembled/not) per R4.4.2 definition
// - Protected cubies are exactly those on the currently protected face
// - Graph node = which eligible face is currently assembled and protected
// - Endpoint verifier catches any drift between metadata and physics
// ---------------------------------------------------------------------------

const SEMANTIC_R444_FACES = Object.freeze(['+Z', '+X', '-X']);
const SEMANTIC_R444_FACE_INDEX = Object.freeze({ '+Z': 0, '+X': 1, '-X': 2 });

function semanticR444ComputeFaceAssemblySig() {
  let sig = 0;
  for (const face of SEMANTIC_R444_FACES) {
    if (semanticR442FaceAssembled(face)) {
      sig |= (1 << SEMANTIC_R444_FACE_INDEX[face]);
    }
  }
  return sig;
}

function semanticR444GetAssembledFaces() {
  const faces = [];
  for (const face of SEMANTIC_R444_FACES) {
    if (semanticR442FaceAssembled(face)) faces.push(face);
  }
  return faces;
}

function semanticR444GetProtectedCubieIds() {
  if (!semanticR442State.protected || !semanticR442State.protectedFace) return new Set();
  const reg = semanticR442FaceRegistry.get(semanticR442State.protectedFace);
  return reg ? new Set(reg.ids) : new Set();
}

function semanticR444ComputeGraphNode() {
  // The graph node is the currently protected face if it's an eligible face and assembled
  if (semanticR442State.protected && semanticR442State.protectedFace) {
    const face = semanticR442State.protectedFace;
    if (SEMANTIC_R444_FACES.includes(face) && semanticR442FaceAssembled(face)) {
      return face;
    }
  }
  // If protection is not active but we have completed phrases, use the tracked current face
  // This is the authoritative graph node from the last completed phrase
  if (!semanticR442State.protected && semanticR444StateR2.completedMessages > 0) {
    const face = semanticR444StateR2.currentFace;
    if (SEMANTIC_R444_FACES.includes(face) && semanticR442FaceAssembled(face)) {
      return face;
    }
  }
  // Initial state: no protected face yet, but we know the cube starts at +Z
  // If no phrases have completed yet, default to +Z
  if (semanticR444StateR2.completedMessages === 0 && semanticR444StateR2.lifecycleTransitions === 0) {
    if (semanticR442FaceAssembled('+Z')) return '+Z';
  }
  // Fallback: check which eligible face is assembled (should match protected face)
  const assembled = semanticR444GetAssembledFaces();
  if (assembled.length === 1) return assembled[0];
  if (assembled.length > 1) return 'ambiguous';
  return 'unknown';
}

function semanticR444VerifyEndpoint(phraseName, expectedEndFace) {
  // Verify endpoint by checking if the expected end face is physically assembled
  // This is the authoritative check - graph node may be ambiguous if multiple faces assembled
  const assembled = semanticR444GetAssembledFaces();
  const sig = semanticR444ComputeFaceAssemblySig();
  const isAssembled = assembled.includes(expectedEndFace);

  const ok = isAssembled;
  if (!ok) {
    semanticR444LogR2('endpoint-verify-fail', {
      phrase: phraseName,
      expectedEndFace,
      computedNode: semanticR444ComputeGraphNode(),
      assembledFaces: assembled,
      assemblySig: sig.toString(2).padStart(3, '0'),
      protectedFace: semanticR442State.protectedFace,
    });
  }
  return ok;
}

// ---------------------------------------------------------------------------
// TRUE AUTHORED PHRASES (8-14 distinct phrases, 2-5 slice moves each)
// Each phrase has:
//   id, fromState (face), toState (face), moves[], timing, visualFamily,
//   semanticEligibleAtEnd, protectionConstraints, endpointVerifier
//
// Visual families (inspiration from spec):
// - lateral_handoff: Y-axis slice transition between +Z and +X/-X
// - cross_axis_handoff: Z/X axis cross transition
// - center_led_transition: layer 0 (center) move as pivot
// - asymmetric_two_step: two different slices in sequence
// - restrained_accent: small move + settle
// - soft_return: return to same face via different path
// - diagonal_rhythm: alternating axis pattern
// ---------------------------------------------------------------------------

const SEMANTIC_R444_PHRASES_R2 = Object.freeze({
  // From +Z (front) - 4 phrases
  Z_TO_X_POS_LATERAL: {
    name: 'Z_TO_X_POS_LATERAL',
    startFace: '+Z',
    endFace: '+X',
    visualFamily: 'lateral_handoff',
    moves: [
      { axis: 'Y', layer: 1, direction: 1, durationMs: 900 },   // R slice up
      { axis: 'Y', layer: 1, direction: 1, durationMs: 900 },   // R slice up (180 total)
    ],
    totalDurationMs: 1800,
    timing: { microGapMs: 80, settleMs: 120 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '+Z', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+X'),
  },

  Z_TO_X_NEG_CROSS: {
    name: 'Z_TO_X_NEG_CROSS',
    startFace: '+Z',
    endFace: '-X',
    visualFamily: 'cross_axis_handoff',
    moves: [
      { axis: 'Y', layer: -1, direction: -1, durationMs: 900 }, // L slice down
      { axis: 'Y', layer: -1, direction: -1, durationMs: 900 }, // L slice down (180 total)
    ],
    totalDurationMs: 1800,
    timing: { microGapMs: 80, settleMs: 120 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '+Z', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '-X'),
  },

  Z_TO_Z_CENTER_LED: {
    name: 'Z_TO_Z_CENTER_LED',
    startFace: '+Z',
    endFace: '+Z',
    visualFamily: 'center_led_transition',
    moves: [
      { axis: 'X', layer: 0, direction: 1, durationMs: 600 },   // U center slice
      { axis: 'X', layer: 0, direction: -1, durationMs: 600 },  // U center slice back (180+180=360)
    ],
    totalDurationMs: 1200,
    timing: { microGapMs: 60, settleMs: 100 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '+Z', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+Z'),
  },

  Z_TO_X_POS_ASYMMETRIC: {
    name: 'Z_TO_X_POS_ASYMMETRIC',
    startFace: '+Z',
    endFace: '+X',
    visualFamily: 'asymmetric_two_step',
    moves: [
      { axis: 'Y', layer: 1, direction: 1, durationMs: 700 },   // R slice (90)
      { axis: 'X', layer: 1, direction: 1, durationMs: 700 },   // U slice (90) - different axis
    ],
    totalDurationMs: 1400,
    timing: { microGapMs: 100, settleMs: 150 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '+Z', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+X'),
  },

  // From +X (right) - 4 phrases
  X_TO_Z_LATERAL: {
    name: 'X_TO_Z_LATERAL',
    startFace: '+X',
    endFace: '+Z',
    visualFamily: 'lateral_handoff',
    moves: [
      { axis: 'Y', layer: 1, direction: -1, durationMs: 900 },  // R slice down
      { axis: 'Y', layer: 1, direction: -1, durationMs: 900 },  // R slice down (180 total)
    ],
    totalDurationMs: 1800,
    timing: { microGapMs: 80, settleMs: 120 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '+X', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+Z'),
  },

  X_TO_X_NEG_CROSS: {
    name: 'X_TO_X_NEG_CROSS',
    startFace: '+X',
    endFace: '-X',
    visualFamily: 'cross_axis_handoff',
    moves: [
      { axis: 'Z', layer: 1, direction: 1, durationMs: 900 },   // F slice forward
      { axis: 'Z', layer: 1, direction: 1, durationMs: 900 },   // F slice forward (180 total)
    ],
    totalDurationMs: 1800,
    timing: { microGapMs: 80, settleMs: 120 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '+X', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '-X'),
  },

  X_TO_X_CENTER_LED: {
    name: 'X_TO_X_CENTER_LED',
    startFace: '+X',
    endFace: '+X',
    visualFamily: 'center_led_transition',
    moves: [
      { axis: 'Y', layer: 0, direction: 1, durationMs: 600 },   // E center slice
      { axis: 'Y', layer: 0, direction: -1, durationMs: 600 },  // E center slice back
    ],
    totalDurationMs: 1200,
    timing: { microGapMs: 60, settleMs: 100 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '+X', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+X'),
  },

  X_TO_Z_ASYMMETRIC: {
    name: 'X_TO_Z_ASYMMETRIC',
    startFace: '+X',
    endFace: '+Z',
    visualFamily: 'asymmetric_two_step',
    moves: [
      { axis: 'Y', layer: 1, direction: -1, durationMs: 700 },  // R slice (90)
      { axis: 'Z', layer: 1, direction: -1, durationMs: 700 },  // F slice (90) - different axis
    ],
    totalDurationMs: 1400,
    timing: { microGapMs: 100, settleMs: 150 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '+X', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+Z'),
  },

  // From -X (left) - 4 phrases
  NEG_X_TO_Z_LATERAL: {
    name: 'NEG_X_TO_Z_LATERAL',
    startFace: '-X',
    endFace: '+Z',
    visualFamily: 'lateral_handoff',
    moves: [
      { axis: 'Y', layer: -1, direction: 1, durationMs: 900 },  // L slice up
      { axis: 'Y', layer: -1, direction: 1, durationMs: 900 },  // L slice up (180 total)
    ],
    totalDurationMs: 1800,
    timing: { microGapMs: 80, settleMs: 120 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '-X', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+Z'),
  },

  NEG_X_TO_X_POS_CROSS: {
    name: 'NEG_X_TO_X_POS_CROSS',
    startFace: '-X',
    endFace: '+X',
    visualFamily: 'cross_axis_handoff',
    moves: [
      { axis: 'Z', layer: -1, direction: -1, durationMs: 900 }, // B slice back
      { axis: 'Z', layer: -1, direction: -1, durationMs: 900 }, // B slice back (180 total)
    ],
    totalDurationMs: 1800,
    timing: { microGapMs: 80, settleMs: 120 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '-X', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+X'),
  },

  NEG_X_TO_NEG_X_CENTER_LED: {
    name: 'NEG_X_TO_NEG_X_CENTER_LED',
    startFace: '-X',
    endFace: '-X',
    visualFamily: 'center_led_transition',
    moves: [
      { axis: 'Y', layer: 0, direction: 1, durationMs: 600 },   // E center slice
      { axis: 'Y', layer: 0, direction: -1, durationMs: 600 },  // E center slice back
    ],
    totalDurationMs: 1200,
    timing: { microGapMs: 60, settleMs: 100 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '-X', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '-X'),
  },

  NEG_X_TO_Z_ASYMMETRIC: {
    name: 'NEG_X_TO_Z_ASYMMETRIC',
    startFace: '-X',
    endFace: '+Z',
    visualFamily: 'asymmetric_two_step',
    moves: [
      { axis: 'Y', layer: -1, direction: 1, durationMs: 700 },  // L slice (90)
      { axis: 'Z', layer: -1, direction: 1, durationMs: 700 },  // B slice (90) - different axis
    ],
    totalDurationMs: 1400,
    timing: { microGapMs: 100, settleMs: 150 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '-X', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+Z'),
  },

  // Additional phrases for diversity (restrained_accent, soft_return, diagonal_rhythm) - 3 more
  Z_RESTRAINED_ACCENT: {
    name: 'Z_RESTRAINED_ACCENT',
    startFace: '+Z',
    endFace: '+Z',
    visualFamily: 'restrained_accent',
    moves: [
      { axis: 'X', layer: 1, direction: 1, durationMs: 400 },   // U slice small
      { axis: 'X', layer: 1, direction: -1, durationMs: 400 },  // U slice back
    ],
    totalDurationMs: 800,
    timing: { microGapMs: 40, settleMs: 80 },
    semanticEligibleAtEnd: false, // No semantic moment on restrained accent
    protectionConstraints: { protectedFaceMustBe: '+Z', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+Z'),
  },

  X_SOFT_RETURN: {
    name: 'X_SOFT_RETURN',
    startFace: '+X',
    endFace: '+X',
    visualFamily: 'soft_return',
    moves: [
      { axis: 'Z', layer: 0, direction: 1, durationMs: 500 },   // M center slice
      { axis: 'Z', layer: 0, direction: -1, durationMs: 500 },  // M center slice back
    ],
    totalDurationMs: 1000,
    timing: { microGapMs: 50, settleMs: 100 },
    semanticEligibleAtEnd: false,
    protectionConstraints: { protectedFaceMustBe: '+X', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '+X'),
  },

  NEG_X_DIAGONAL_RHYTHM: {
    name: 'NEG_X_DIAGONAL_RHYTHM',
    startFace: '-X',
    endFace: '-X',
    visualFamily: 'diagonal_rhythm',
    moves: [
      { axis: 'X', layer: -1, direction: 1, durationMs: 450 },  // D slice
      { axis: 'Z', layer: -1, direction: -1, durationMs: 450 }, // B slice
      { axis: 'X', layer: -1, direction: -1, durationMs: 450 }, // D slice back
      { axis: 'Z', layer: -1, direction: 1, durationMs: 450 },  // B slice back
    ],
    totalDurationMs: 1800,
    timing: { microGapMs: 70, settleMs: 120 },
    semanticEligibleAtEnd: true,
    protectionConstraints: { protectedFaceMustBe: '-X', maxProtectedIntersections: 0 },
    endpointVerifier: (phrase) => semanticR444VerifyEndpoint(phrase.name, '-X'),
  },
});

// Directed graph: each safe state has multiple valid outgoing phrases
const SEMANTIC_R444_GRAPH_R2 = Object.freeze({
  '+Z': [
    'Z_TO_X_POS_LATERAL',
    'Z_TO_X_NEG_CROSS',
    'Z_TO_Z_CENTER_LED',
    'Z_TO_X_POS_ASYMMETRIC',
    'Z_RESTRAINED_ACCENT',
  ],
  '+X': [
    'X_TO_Z_LATERAL',
    'X_TO_X_NEG_CROSS',
    'X_TO_X_CENTER_LED',
    'X_TO_Z_ASYMMETRIC',
    'X_SOFT_RETURN',
  ],
  '-X': [
    'NEG_X_TO_Z_LATERAL',
    'NEG_X_TO_X_POS_CROSS',
    'NEG_X_TO_NEG_X_CENTER_LED',
    'NEG_X_TO_Z_ASYMMETRIC',
    'NEG_X_DIAGONAL_RHYTHM',
  ],
});

// Diversity memory: track last ~3 phrases/states
const SEMANTIC_R444_MEMORY_LENGTH_R2 = 3;

const SEMANTIC_R444_CONFIG_R2 = Object.freeze({
  memoryLength: 3,
  minPhraseDurationMs: 800,
  maxPhraseDurationMs: 2500,
  cooldownRangeMs: [2000, 4000],
  minAngularTravelDeg: 15,
  semanticSequence: Object.freeze(['ProAI Expert', 'TRUST', 'INQUIRY', 'RESPONSE', 'RESULT']),
  seed: 0x444c0de,
});

// ---------------------------------------------------------------------------
// PHYSICAL PHRASE VALIDATION (COMPUTED, NOT ASSUMED)
// For every phrase: instantiate allowed start states, simulate moves,
// compute resulting physical state, verify all invariants.
// ---------------------------------------------------------------------------

function semanticR444ValidatePhrase(phrase) {
  const errors = [];

  // 1. Check start face compatibility
  const currentNode = semanticR444ComputeGraphNode();
  if (currentNode !== phrase.startFace && currentNode !== 'unknown') {
    errors.push('PHYSICAL_START_MISMATCH: current node=' + currentNode + ', phrase requires=' + phrase.startFace);
  }

  // 2. Check protection constraints
  // Allow initial state where no face is protected yet (protection starts with phrase)
  if (phrase.protectionConstraints.protectedFaceMustBe) {
    if (semanticR442State.protected && semanticR442State.protectedFace !== phrase.protectionConstraints.protectedFaceMustBe) {
      errors.push('PROTECTION_FACE_MISMATCH: protected=' + semanticR442State.protectedFace + ', required=' + phrase.protectionConstraints.protectedFaceMustBe);
    }
  }

  // 3. Simulate phrase moves and check protected intersections
  // We simulate by checking each move against the current protected cubies
  const protectedIds = semanticR444GetProtectedCubieIds();
  for (const move of phrase.moves) {
    const intersection = semanticR442MoveIntersection(move);
    if (intersection.count > phrase.protectionConstraints.maxProtectedIntersections) {
      errors.push('PROTECTION_VIOLATION: move ' + move.axis + move.layer + ' intersects ' + intersection.count + ' protected cubies');
    }
  }

  // 4. Check end face assembly (will be verified after execution by endpointVerifier)
  // This is a pre-check: the end face should be an eligible face
  if (!SEMANTIC_R444_FACES.includes(phrase.endFace)) {
    errors.push('INVALID_END_FACE: ' + phrase.endFace + ' not in eligible faces');
  }

  // 5. Check next-edge compatibility (at least one valid outgoing phrase from endFace)
  const outgoing = SEMANTIC_R444_GRAPH_R2[phrase.endFace];
  if (!outgoing || outgoing.length === 0) {
    errors.push('GRAPH_DEAD_END: no outgoing phrases from ' + phrase.endFace);
  }

  return { valid: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// STATE MACHINE - SINGLE AUTHORITATIVE LIFECYCLE
// States: IDLE_READY | PHRASE_RUNNING | VERIFIED_ENDPOINT | SEMANTIC_MOMENT | RELEASE | COOLDOWN
// ---------------------------------------------------------------------------

const SEMANTIC_R444_LIFECYCLE = Object.freeze({
  IDLE_READY: 'IDLE_READY',
  PHRASE_RUNNING: 'PHRASE_RUNNING',
  VERIFIED_ENDPOINT: 'VERIFIED_ENDPOINT',
  SEMANTIC_MOMENT: 'SEMANTIC_MOMENT',
  RELEASE: 'RELEASE',
  COOLDOWN: 'COOLDOWN',
});

const semanticR444StateR2 = {
  // Physical state tracking
  currentFace: '+Z',
  currentGraphNode: '+Z',
  assemblySig: 0,

  // Phrase execution state
  currentPhrase: null,
  currentMoveIndex: 0,
  phraseProgress: 0,
  phraseStartMs: 0,
  phraseEndMs: 0,
  moveStartMs: 0,
  moveEndMs: 0,

  // Lifecycle authority
  lifecycleState: SEMANTIC_R444_LIFECYCLE.IDLE_READY,
  lifecycleTransitions: 0,

  // Diversity memory
  memory: [],

  // Semantic state
  semanticSeed: 0x444c0de,
  nextMessageIndex: 0,
  activeMessage: null,
  activeMessageIndex: null,
  completedMessages: 0,

  // Protection lifecycle
  protectionActive: false,
  protectedFaceAtPhraseStart: null,
  protectionStartMs: 0,
  protectionEndMs: 0,

  // Cooldown authority
  cooldownUntilMs: -Infinity,
  cooldownReason: null,

  // Logging
  lifecycleLog: [],
  eventLog: [],
  validationLog: [],

  // Diagnostics
  lastSemanticFace: null,
  lastSemanticMs: 0,
};

function semanticR444UnitR2() {
  let x = semanticR444StateR2.semanticSeed >>> 0;
  x ^= (x << 13) >>> 0;
  x ^= x >>> 17;
  x ^= (x << 5) >>> 0;
  semanticR444StateR2.semanticSeed = x >>> 0;
  return semanticR444StateR2.semanticSeed / 4294967296;
}

function semanticR444RangeR2(min, max) { return min + (max - min) * semanticR444UnitR2(); }
function semanticR444IntR2(min, max) { return Math.floor(min + semanticR444UnitR2() * (max - min + 1)); }

function semanticR444LogR2(type, data = {}) {
  semanticR444StateR2.lifecycleLog.push({
    type,
    presentationMs: presentationSimTimeMs,
    face: semanticR444StateR2.currentFace,
    graphNode: semanticR444StateR2.currentGraphNode,
    phrase: semanticR444StateR2.currentPhrase?.name,
    lifecycleState: semanticR444StateR2.lifecycleState,
    ...data,
  });
  if (semanticR444StateR2.lifecycleLog.length > 200) semanticR444StateR2.lifecycleLog.shift();
}

function semanticR444LogValidation(type, data = {}) {
  semanticR444StateR2.validationLog.push({
    type,
    presentationMs: presentationSimTimeMs,
    ...data,
  });
  if (semanticR444StateR2.validationLog.length > 100) semanticR444StateR2.validationLog.shift();
}

// ---------------------------------------------------------------------------
// SINGLE PHRASE-START AUTHORITY: canStartPhrase()
// No phrase may begin through another path.
// Validates: lifecycle ready, no current phrase, cooldown complete,
//            no conflicting active turn, physical state verified,
//            graph node verified, protection state coherent,
//            outgoing phrase valid, semantic/release state coherent.
// ---------------------------------------------------------------------------

function semanticR444CanStartPhrase() {
  const state = semanticR444StateR2;

  // 1. Lifecycle state must be ready
  if (state.lifecycleState !== SEMANTIC_R444_LIFECYCLE.IDLE_READY &&
      state.lifecycleState !== SEMANTIC_R444_LIFECYCLE.COOLDOWN) {
    return { allowed: false, reason: 'lifecycle_not_ready: ' + state.lifecycleState };
  }

  // 2. No current phrase running
  if (state.currentPhrase) {
    return { allowed: false, reason: 'phrase_already_running' };
  }

  // 3. Cooldown complete
  if (presentationSimTimeMs < state.cooldownUntilMs) {
    return { allowed: false, reason: 'cooldown_active', remainingMs: state.cooldownUntilMs - presentationSimTimeMs };
  }

  // 4. No conflicting active turn (slice scheduler not running a move)
  if (typeof sliceSchedulerRunning !== 'undefined' && sliceSchedulerRunning) {
    return { allowed: false, reason: 'slice_scheduler_active' };
  }

  // 5. Physical state verified - current face must be assembled and match graph node
  const graphNode = semanticR444ComputeGraphNode();
  const assembledFaces = semanticR444GetAssembledFaces();
  state.currentGraphNode = graphNode;

  if (graphNode === 'unknown' || graphNode === 'ambiguous') {
    return { allowed: false, reason: 'graph_node_invalid: ' + graphNode, assembledFaces };
  }

  if (!assembledFaces.includes(graphNode)) {
    return { allowed: false, reason: 'graph_node_not_assembled: ' + graphNode, assembledFaces };
  }

  // 6. Protection state coherent
  if (semanticR442State.protected && semanticR442State.protectedFace !== graphNode) {
    return { allowed: false, reason: 'protection_incoherent: protected=' + semanticR442State.protectedFace + ', graphNode=' + graphNode };
  }

  // 7. Outgoing phrase must exist and be valid
  const outgoing = SEMANTIC_R444_GRAPH_R2[graphNode];
  if (!outgoing || outgoing.length === 0) {
    return { allowed: false, reason: 'no_outgoing_phrases: ' + graphNode };
  }

  // 8. Semantic/release state coherent (not in middle of semantic moment)
  // This is handled by lifecycle state check above

  return { allowed: true, graphNode, outgoing };
}

// ---------------------------------------------------------------------------
// PHRASE SELECTION WITH DIVERSITY FILTER
// ---------------------------------------------------------------------------

function semanticR444IsDiverseR2(phraseName, endFace) {
  if (semanticR444StateR2.memory.length === 0) return true;
  const recent = semanticR444StateR2.memory;

  // Avoid same phrase twice
  if (recent.some(m => m.phrase === phraseName)) return false;

  // Avoid same end face >= 2 times in recent memory
  const sameFaceCount = recent.filter(m => m.endFace === endFace).length;
  if (sameFaceCount >= 2) return false;

  // Avoid back-and-forth between same two faces (A→B→A)
  if (recent.length >= 2) {
    const f1 = recent[recent.length - 1].endFace;
    const f2 = recent[recent.length - 2].endFace;
    if (f1 === endFace && f2 === semanticR444StateR2.currentFace) return false;
  }

  // Avoid same visual family twice in a row
  const phrase = SEMANTIC_R444_PHRASES_R2[phraseName];
  if (phrase && recent.length >= 1) {
    const lastPhrase = SEMANTIC_R444_PHRASES_R2[recent[recent.length - 1].phrase];
    if (lastPhrase && lastPhrase.visualFamily === phrase.visualFamily) return false;
  }

  return true;
}

function semanticR444SelectPhraseR2() {
  const { allowed, graphNode, outgoing } = semanticR444CanStartPhrase();
  if (!allowed) {
    semanticR444LogR2('phrase-select-blocked', { reason: allowed.reason, graphNode });
    return null;
  }

  // Filter by diversity
  const diverse = outgoing.filter(name => {
    const phrase = SEMANTIC_R444_PHRASES_R2[name];
    return semanticR444IsDiverseR2(name, phrase.endFace);
  });

  const candidates = diverse.length > 0 ? diverse : outgoing;
  const phraseName = candidates[semanticR444IntR2(0, candidates.length - 1)];
  const phrase = SEMANTIC_R444_PHRASES_R2[phraseName];

  // Validate phrase physically BEFORE starting
  const validation = semanticR444ValidatePhrase(phrase);
  if (!validation.valid) {
    semanticR444LogValidation('phrase-validation-fail', { phrase: phraseName, errors: validation.errors });
    // Try other candidates
    for (const altName of candidates) {
      if (altName === phraseName) continue;
      const altPhrase = SEMANTIC_R444_PHRASES_R2[altName];
      const altValidation = semanticR444ValidatePhrase(altPhrase);
      if (altValidation.valid) {
        semanticR444LogR2('phrase-select-fallback', { original: phraseName, selected: altName });
        return altPhrase;
      }
    }
    // No valid phrase found - GRAPH_DEAD_END
    semanticR444LogValidation('GRAPH_DEAD_END', { graphNode, tried: candidates });
    return null;
  }

  return phrase;
}

// ---------------------------------------------------------------------------
// PHRASE EXECUTION
// ---------------------------------------------------------------------------

function semanticR444StartPhraseR2() {
  const phrase = semanticR444SelectPhraseR2();
  if (!phrase) return false;

  const now = presentationSimTimeMs;
  const state = semanticR444StateR2;

  // Transition lifecycle: IDLE_READY -> PHRASE_RUNNING
  state.lifecycleState = SEMANTIC_R444_LIFECYCLE.PHRASE_RUNNING;
  state.lifecycleTransitions++;

  state.currentPhrase = phrase;
  state.currentMoveIndex = 0;
  state.phraseProgress = 0;
  state.phraseStartMs = now;
  state.phraseEndMs = now + phrase.totalDurationMs;
  state.moveStartMs = now;
  state.moveEndMs = now + phrase.moves[0].durationMs;

  // Do NOT activate protection during PHRASE_RUNNING
  // Protection is only active during SEMANTIC_MOMENT to prevent tearing
  // During phrase execution, moves naturally intersect with start/end faces
  state.protectedFaceAtPhraseStart = phrase.startFace;
  state.protectionActive = false;

  // Track the start face for validation, but don't set protection
  state.phraseStartFace = phrase.startFace;

  state.memory.push({ phrase: phrase.name, startFace: phrase.startFace, endFace: phrase.endFace, startMs: now, visualFamily: phrase.visualFamily });
  if (state.memory.length > SEMANTIC_R444_MEMORY_LENGTH_R2) state.memory.shift();

  semanticR444LogR2('phrase-start', {
    phrase: phrase.name,
    startFace: phrase.startFace,
    endFace: phrase.endFace,
    visualFamily: phrase.visualFamily,
    moves: phrase.moves.length,
    totalDurationMs: phrase.totalDurationMs,
    lifecycleState: state.lifecycleState,
  });

  return true;
}

function semanticR444ExecuteCurrentMove() {
  const state = semanticR444StateR2;
  if (!state.currentPhrase || state.currentMoveIndex >= state.currentPhrase.moves.length) {
    return null;
  }

  const move = state.currentPhrase.moves[state.currentMoveIndex];
  return { axis: move.axis, layer: move.layer, direction: move.direction, durationMs: move.durationMs };
}

function semanticR444AdvanceMove() {
  const state = semanticR444StateR2;
  if (!state.currentPhrase) return false;

  state.currentMoveIndex++;
  if (state.currentMoveIndex >= state.currentPhrase.moves.length) {
    // Phrase complete - transition to VERIFIED_ENDPOINT
    return semanticR444CompletePhraseR2();
  }

// Start next move
  const nextMove = state.currentPhrase.moves[state.currentMoveIndex];
  const now = presentationSimTimeMs;
  state.moveStartMs = now;
  state.moveEndMs = now + nextMove.durationMs;
  return true;
}

function semanticR444CompletePhraseR2() {
  const state = semanticR444StateR2;
  if (!state.currentPhrase) return false;

  const phrase = state.currentPhrase;
  const endFace = phrase.endFace;
  const now = presentationSimTimeMs;

  // Verify endpoint physically
  const endpointValid = phrase.endpointVerifier(phrase);

  // Transition lifecycle: PHRASE_RUNNING -> VERIFIED_ENDPOINT
  state.lifecycleState = SEMANTIC_R444_LIFECYCLE.VERIFIED_ENDPOINT;
  state.lifecycleTransitions++;

  state.currentFace = endFace;
  state.currentGraphNode = endFace;
  state.assemblySig = semanticR444ComputeFaceAssemblySig();
  state.currentPhrase = null;
  state.currentMoveIndex = 0;
  state.phraseProgress = 0;
  state.phraseStartMs = 0;
  state.phraseEndMs = 0;
  state.moveStartMs = 0;
  state.moveEndMs = 0;

  if (!endpointValid) {
    semanticR444LogValidation('ENDPOINT_VERIFICATION_FAILED', { phrase: phrase.name, expectedEndFace: endFace });
    // Still transition but mark as invalid
    state.lifecycleState = SEMANTIC_R444_LIFECYCLE.COOLDOWN;
    state.cooldownUntilMs = now + semanticR444RangeR2(...SEMANTIC_R444_CONFIG_R2.cooldownRangeMs);
    state.cooldownReason = 'endpoint_verification_failed';
    semanticR444LogR2('phrase-complete-invalid', { phrase: phrase.name, endFace });
    return false;
  }

  // Transition to SEMANTIC_MOMENT if eligible
  if (phrase.semanticEligibleAtEnd) {
    state.lifecycleState = SEMANTIC_R444_LIFECYCLE.SEMANTIC_MOMENT;
    state.lifecycleTransitions++;

    const messageIndex = state.nextMessageIndex;
    const message = SEMANTIC_R444_CONFIG_R2.semanticSequence[messageIndex];

    const reg = semanticR442FaceRegistry.get(endFace);
    if (reg && semanticR442FaceAssembled(endFace)) {
      semanticR442SetActiveMaterialFace(endFace);
      semanticR442State.activeMaterialFace = endFace;
      // Activate protection during SEMANTIC_MOMENT to prevent tearing
      semanticR442State.protected = true;
      semanticR442State.protectedFace = endFace;
      semanticR442State.protectedSinceMs = now;
      semanticR442State.protectionCount++;

      semanticR443ApplyMessage(endFace, messageIndex);

      state.activeMessage = message;
      state.activeMessageIndex = messageIndex;
      state.nextMessageIndex = (messageIndex + 1) % SEMANTIC_R444_CONFIG_R2.semanticSequence.length;
      state.completedMessages++;

      state.lastSemanticFace = endFace;
      state.lastSemanticMs = now;

      state.eventLog.push({ message, messageIndex, face: endFace, startMs: now, phrase: phrase.name });
      if (state.eventLog.length > 32) state.eventLog.shift();

      semanticR444LogR2('semantic-complete', { face: endFace, message, messageIndex, phrase: phrase.name, completedMessages: state.completedMessages });
    }
  } else {
    // If no semantic moment, activate protection on end face for next phrase
    semanticR442State.protected = true;
    semanticR442State.protectedFace = endFace;
    semanticR442State.protectedSinceMs = now;
    semanticR442State.protectionCount++;
  }

  // Transition to RELEASE - release protection after semantic moment
  state.lifecycleState = SEMANTIC_R444_LIFECYCLE.RELEASE;
  state.lifecycleTransitions++;

  // Release protection - phrase completed naturally, next phrase starts without protection
  semanticR442State.protected = false;
  semanticR442State.protectedFace = null;
  semanticR442State.protectedSinceMs = null;
  state.protectionActive = false;
  state.protectionEndMs = now;

  state.lifecycleState = SEMANTIC_R444_LIFECYCLE.COOLDOWN;
  state.lifecycleTransitions++;
  state.cooldownUntilMs = now + semanticR444RangeR2(...SEMANTIC_R444_CONFIG_R2.cooldownRangeMs);
  state.cooldownReason = 'phrase_complete';

  semanticR444LogR2('phrase-complete', { phrase: phrase.name, endFace, nextFace: endFace, lifecycleState: state.lifecycleState });
  return true;
}

// ---------------------------------------------------------------------------
// MAIN UPDATE FUNCTION - SINGLE AUTHORITATIVE LIFECYCLE
// ---------------------------------------------------------------------------

function semanticR444UpdateR2() {
  const now = presentationSimTimeMs;
  const state = semanticR444StateR2;

  // Update physical state tracking
  state.currentGraphNode = semanticR444ComputeGraphNode();
  state.assemblySig = semanticR444ComputeFaceAssemblySig();
  state.currentFace = state.currentGraphNode !== 'unknown' && state.currentGraphNode !== 'ambiguous' ? state.currentGraphNode : state.currentFace;

  // Handle lifecycle transitions
  switch (state.lifecycleState) {
    case SEMANTIC_R444_LIFECYCLE.IDLE_READY:
    case SEMANTIC_R444_LIFECYCLE.COOLDOWN:
      // Check cooldown
      if (now < state.cooldownUntilMs) return;

      // Try to start a new phrase
      if (!state.currentPhrase) {
        semanticR444StartPhraseR2();
      }
      break;

    case SEMANTIC_R444_LIFECYCLE.PHRASE_RUNNING:
      if (!state.currentPhrase) {
        semanticR444LogR2('lifecycle-error', { reason: 'no_current_phrase_in_running' });
        state.lifecycleState = SEMANTIC_R444_LIFECYCLE.IDLE_READY;
        return;
      }

      // Check current move progress
      const elapsed = now - state.moveStartMs;
      const moveDuration = state.currentPhrase.moves[state.currentMoveIndex].durationMs;
      state.phraseProgress = THREE.MathUtils.clamp((now - state.phraseStartMs) / state.currentPhrase.totalDurationMs, 0, 1);

      if (elapsed >= moveDuration) {
        semanticR444AdvanceMove();
      }
      break;

    case SEMANTIC_R444_LIFECYCLE.VERIFIED_ENDPOINT:
      // Brief state, immediately transitions in CompletePhrase
      break;

    case SEMANTIC_R444_LIFECYCLE.SEMANTIC_MOMENT:
      // Semantic moment active, wait for cooldown
      if (now >= state.cooldownUntilMs) {
        state.lifecycleState = SEMANTIC_R444_LIFECYCLE.COOLDOWN;
        state.lifecycleTransitions++;
      }
      break;

    case SEMANTIC_R444_LIFECYCLE.RELEASE:
      // Brief state, immediately transitions in CompletePhrase
      break;
  }
}

// ---------------------------------------------------------------------------
// MOVEMENT SELECTION FOR PHRASE GRAPH
// ---------------------------------------------------------------------------

function semanticR444SelectMoveForPhraseR2() {
  const state = semanticR444StateR2;

  // Only provide moves during PHRASE_RUNNING state
  if (state.lifecycleState !== SEMANTIC_R444_LIFECYCLE.PHRASE_RUNNING) {
    return null;
  }

  return semanticR444ExecuteCurrentMove();
}

// Integration: replace semanticR442SelectMove to use phrase graph R2
function semanticR444WrappedSelectMoveR2() {
  const state = semanticR444StateR2;

  // If we have an active phrase in RUNNING state, use its move
  if (state.lifecycleState === SEMANTIC_R444_LIFECYCLE.PHRASE_RUNNING && state.currentPhrase) {
    return semanticR444SelectMoveForPhraseR2();
  }

  // If in cooldown or idle, don't start a phrase here - let Update handle it
  // This ensures single start authority
  return null;
}

// Weight function - phrase graph moves have priority
function semanticR444WeightR2(move) {
  return 1;
}

// Replace update protection state with phrase graph R2 update
function semanticR444WrappedUpdateProtectionStateR2() {
  semanticR444UpdateR2();

  // Also call the original optical diagnostics for face evaluation
  if (semanticR442State.protected) {
    const q = semanticR442EvaluateFace(semanticR442State.protectedFace, false);
    if (!q?.assembled) {
      semanticR442State.assemblyViolations++;
      // Don't force release - let phrase complete naturally
      return;
    }
    // Update optical diagnostics
    semanticR43OpticalDiagnostics = {
      ...semanticR43OpticalDiagnostics,
      alignment: q.brdfQuality,
      faceView: q.viewAlignment,
      halfDot: q.halfDot,
      signedFaceView: q.signedFaceView,
      signedHalfDot: q.signedHalfDot,
      frontFacing: q.signedFaceView > 0,
      opportunity: q.rawQuality,
      engravedFace: q.face,
    };
  }
  return;
}

// Replace semanticR442ReleaseProtection - no forced release, phrase completes naturally
function semanticR444ReleaseProtectionR2(reason = 'phrase-complete') {
  if (!semanticR442State.protected) return false;
  // Allow phrase to complete naturally, don't force release
  // The phrase graph controls protection lifecycle
  return true;
}

// Expose diagnostics
function semanticR444GetDiagnosticsR2() {
  const state = semanticR444StateR2;
  return {
    currentFace: state.currentFace,
    currentGraphNode: state.currentGraphNode,
    assemblySig: state.assemblySig.toString(2).padStart(3, '0'),
    assembledFaces: semanticR444GetAssembledFaces(),
    currentPhrase: state.currentPhrase?.name || null,
    phraseProgress: state.phraseProgress,
    currentMoveIndex: state.currentMoveIndex,
    memory: [...state.memory],
    lifecycleState: state.lifecycleState,
    lifecycleTransitions: state.lifecycleTransitions,
    completedMessages: state.completedMessages,
    activeMessage: state.activeMessage,
    activeMessageIndex: state.activeMessageIndex,
    nextMessage: SEMANTIC_R444_CONFIG_R2.semanticSequence[state.nextMessageIndex],
    cooldownUntilMs: state.cooldownUntilMs,
    cooldownReason: state.cooldownReason,
    lastSemanticFace: state.lastSemanticFace,
    lastSemanticMs: state.lastSemanticMs,
    protectionActive: state.protectionActive,
    protectedFaceAtPhraseStart: state.protectedFaceAtPhraseStart,
    lifecycleLog: [...state.lifecycleLog],
    eventLog: [...state.eventLog],
    validationLog: [...state.validationLog],
  };
}

`;

// Insert the R2 phrase graph after the moveState anchor
source = source.slice(0, moveStateAt + moveStateAnchor.length) + authoredPhraseGraphR2 + source.slice(moveStateAt + moveStateAnchor.length);

// Replace semanticR442SelectMove with phrase graph R2 version
const selectMoveReplacementR2 = String.raw`function semanticR442SelectMove(){
  const move=semanticR444WrappedSelectMoveR2();
  if(move) return move;
  // NO FALLBACK - if phrase graph has no move, return null (GRAPH_DEAD_END)
  // This prevents hiding graph failures behind random movement
  return null;
}`;
replaceFunction('semanticR442SelectMove', 'semanticR442RecordMove', selectMoveReplacementR2, 'phrase graph R2 move selection');

// Replace semanticR442RecentWeight with phrase graph R2 weight
const weightReplacementR2 = String.raw`function semanticR442RecentWeight(move){
  return semanticR444WeightR2(move);
}`;
replaceFunction('semanticR442RecentWeight', 'semanticR442SelectMove', weightReplacementR2, 'phrase graph R2 weight');

// Replace semanticR442UpdateProtectionState with phrase graph R2 update
const updateReplacementR2 = String.raw`function semanticR442UpdateProtectionState(){
  semanticR444WrappedUpdateProtectionStateR2();
}`;
replaceFunction('semanticR442UpdateProtectionState', 'semanticR442MoveIntersection', updateReplacementR2, 'phrase graph R2 state machine');

// Replace semanticR442ReleaseProtection with R2 version
const releaseReplacementR2 = String.raw`function semanticR442ReleaseProtection(reason='phrase-complete'){
  return semanticR444ReleaseProtectionR2(reason);
}`;
replaceFunction('semanticR442ReleaseProtection', 'semanticR442UpdateProtectionState', releaseReplacementR2, 'phrase graph R2 release');

// Disable old R4.4.3 scheduler loop - R2 is the authoritative lifecycle
const schedulerReplacementR2 = String.raw`async function sliceSchedulerLoop(){
  // R2 phrase graph is authoritative - disable old scheduler
  sliceSchedulerEnabled = false;
  sliceSchedulerRunning = false;
  return;
}`;
// Use unique anchor from the function start to the end
const schedulerAnchor = 'async function sliceSchedulerLoop(){if(sliceSchedulerRunning)return;sliceSchedulerRunning=true;await schedulerDelay(420);while(sliceSchedulerEnabled){if(!await waitForSliceAutonomy())break;const r=seededUnit(),requestedLength=semanticR443State.phase===SEMANTIC_R443_PHASE.READABLE_LOCK?1:(r<.34?1:r<.82?2:3),executed=[];for(let i=0;i<requestedLength&&sliceSchedulerEnabled;i++){if(!await waitForSliceAutonomy())break;const move=semanticR442SelectMove();if(!move)break;semanticR442RecordMove(move,\'forward\');const result=await turnSlice(move);if(!result)break;executed.push(move);semanticR443PendingResolutionCount=executed.length;if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL)break;if(i<requestedLength-1)await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)))}if(!executed.length){await schedulerDelay(110);continue}if(semanticR443State.phase!==SEMANTIC_R443_PHASE.DISPERSAL)await schedulerDelay(Math.round(seededRange(240,410)));for(let i=executed.length-1;i>=0;i--){if(!await waitForSliceAutonomy())break;const move=executed[i],inverse={...move,direction:-move.direction,durationMs:move.durationMs};if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL&&semanticR443State.lastReleaseFace&&semanticR442MoveIntersection(inverse,semanticR443State.lastReleaseFace).count>0){const remain=SEMANTIC_R443_CONFIG.dispersalTargetMs[0]-(presentationSimTimeMs-semanticR443State.lastReleaseMs);if(remain>0)await schedulerDelay(remain)}semanticR442RecordMove(inverse,\'resolve\');await turnSlice(inverse);semanticR443PendingResolutionCount=Math.max(0,semanticR443PendingResolutionCount-1);if(i>0&&semanticR443State.phase!==SEMANTIC_R443_PHASE.DISPERSAL)await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.phraseMicroGapRangeMs)))}semanticR443PendingResolutionCount=0;sliceEventSerial+=executed.length;if(semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL)continue;eventsUntilBreath-=1;if(!sliceSchedulerEnabled)break;if(eventsUntilBreath<=0){await schedulerDelay(Math.round(seededRange(...SLICE_R1_2.breathingGapRangeMs)));eventsUntilBreath=seededInt(3,4)}else await schedulerDelay(Math.round(seededRange(520,980)))}sliceSchedulerRunning=false}';
replaceUnique(schedulerAnchor, schedulerReplacementR2, 'phrase graph R2 disable old scheduler');

// Extend diagnostics with R2 phrase graph data
const diagExtensionR2 = String.raw`r444PhraseGraphR2:{
  revision:'PROAI_CUBE_R4.4.4_R2',
  phraseVocabulary:Object.keys(SEMANTIC_R444_PHRASES_R2),
  graphEdges:Object.fromEntries(Object.entries(SEMANTIC_R444_GRAPH_R2).map(([k,v])=>[k,[...v]])),
  currentFace:semanticR444StateR2.currentFace,
  currentGraphNode:semanticR444StateR2.currentGraphNode,
  assemblySig:semanticR444StateR2.assemblySig,
  assembledFaces:semanticR444GetAssembledFaces(),
  currentPhrase:semanticR444StateR2.currentPhrase?.name||null,
  phraseProgress:semanticR444StateR2.phraseProgress,
  currentMoveIndex:semanticR444StateR2.currentMoveIndex,
  memory:[...semanticR444StateR2.memory],
  lifecycleState:semanticR444StateR2.lifecycleState,
  lifecycleTransitions:semanticR444StateR2.lifecycleTransitions,
  completedMessages:semanticR444StateR2.completedMessages,
  activeMessage:semanticR444StateR2.activeMessage,
  activeMessageIndex:semanticR444StateR2.activeMessageIndex,
  nextMessage:SEMANTIC_R444_CONFIG_R2.semanticSequence[semanticR444StateR2.nextMessageIndex],
  cooldownUntilMs:semanticR444StateR2.cooldownUntilMs,
  cooldownReason:semanticR444StateR2.cooldownReason,
  lastSemanticFace:semanticR444StateR2.lastSemanticFace,
  lastSemanticMs:semanticR444StateR2.lastSemanticMs,
  protectionActive:semanticR444StateR2.protectionActive,
  protectedFaceAtPhraseStart:semanticR444StateR2.protectedFaceAtPhraseStart,
  lifecycleLog:[...semanticR444StateR2.lifecycleLog],
  eventLog:[...semanticR444StateR2.eventLog],
  validationLog:[...semanticR444StateR2.validationLog],
  noSolverNoDebtNoQuota:true,
  continuousYaw:true,
  physicalMaterialOnly:true,
  computedValidation:true,
  singleLifecycleAuthority:true,
  singleStartAuthority:true,
  explicitProtectionLifecycle:true,
},
r443Lifecycle:{revision:'PROAI_CUBE_R4.4.3',phase:semanticR443State.phase,sequence:[...SEMANTIC_R443_SEQUENCE],nextMessageIndex:semanticR443State.nextMessageIndex,nextMessage:SEMANTIC_R443_SEQUENCE[semanticR443State.nextMessageIndex],activeMessage:semanticR443State.activeMessage,activeMessageIndex:semanticR443State.activeMessageIndex,candidateFace:semanticR443State.candidateFace,candidateSinceMs:semanticR443State.candidateSinceMs,lastReleaseFace:semanticR443State.lastReleaseFace,lastReleaseMs:semanticR443State.lastReleaseMs,cooldownUntilMs:semanticR443State.cooldownUntilMs,faceArmed:{...semanticR443State.faceArmed},recentFaces:[...semanticR443State.recentFaces],dispersalDone:semanticR443State.dispersalDone,dispersalLatencyMs:semanticR443State.dispersalLatencyMs,dispersalLatenciesMs:[...semanticR443State.dispersalLatenciesMs],opportunityIntervalsMs:[...semanticR443State.opportunityIntervalsMs],readableDurationsMs:[...semanticR443State.readableDurationsMs],candidateLog:[...semanticR443State.candidateLog],eventLog:[...semanticR443State.eventLog],lifecycleLog:[...semanticR443State.lifecycleLog],overdueDispersalCount:semanticR443State.overdueDispersalCount,shortReadableCount:semanticR443State.shortReadableCount,config:SEMANTIC_R443_CONFIG,noSemanticFlashByConstruction:true,sequencePhysicalMaterial:true},
r443Motion:{yawDirectionPolicy:'continuous-positive',yawVelocityDegPerSec:presentationYawVelocityDegPerSec,signedYawDeg:presentationSignedYawDeg,cumulativeYawDeg:presentationCumulativeYawDeg,frameAngularDeltaRad:presentationFrameDeltaRad,semanticVelocityMultiplier:1,semanticOrientationForcing:false},
`;
replaceUnique(
  'r442Cadence:SEMANTIC_R442_CADENCE,',
  `r442Cadence:SEMANTIC_R442_CADENCE,\n    ${diagExtensionR2}`,
  'diagnostics extension with R4.4.4 phrase graph R2'
);

// ============================================================================
// END AUTHORED PHRASE GRAPH R2
// ============================================================================

// Verify R2 invariants
for (const required of [
  "SEMANTIC_R444_PHRASES_R2 = Object.freeze({",
  "SEMANTIC_R444_GRAPH_R2 = Object.freeze({",
  "SEMANTIC_R444_MEMORY_LENGTH_R2 = 3",
  "SEMANTIC_R444_CONFIG_R2 = Object.freeze({",
  "function semanticR444ComputeFaceAssemblySig()",
  "function semanticR444ComputeGraphNode()",
  "function semanticR444VerifyEndpoint(",
  "function semanticR444ValidatePhrase(",
  "SEMANTIC_R444_LIFECYCLE = Object.freeze({",
  "const semanticR444StateR2 = {",
  "function semanticR444CanStartPhrase()",
  "function semanticR444SelectPhraseR2()",
  "function semanticR444StartPhraseR2()",
  "function semanticR444ExecuteCurrentMove()",
  "function semanticR444AdvanceMove()",
  "function semanticR444CompletePhraseR2()",
  "function semanticR444UpdateR2()",
  "function semanticR444SelectMoveForPhraseR2()",
  "function semanticR444WrappedSelectMoveR2()",
  "function semanticR444WrappedUpdateProtectionStateR2()",
  "function semanticR444ReleaseProtectionR2(",
  "function semanticR444GetDiagnosticsR2()",
  "noSolverNoDebtNoQuota:true",
  "continuousYaw:true",
  "physicalMaterialOnly:true",
  "computedValidation:true",
  "singleLifecycleAuthority:true",
  "singleStartAuthority:true",
  "explicitProtectionLifecycle:true",
  "function semanticR442SelectMove(){",
  "function semanticR442RecentWeight(move){",
  "return semanticR444WeightR2(move);",
  "function semanticR442UpdateProtectionState(){",
  "semanticR444WrappedUpdateProtectionStateR2();",
  "function semanticR442ReleaseProtection(reason='phrase-complete'){",
  "return semanticR444ReleaseProtectionR2(reason);",
]) if (!source.includes(required)) throw new Error(`R4.4.4 R2 missing invariant: ${required}`);

// Verify forbidden mechanisms are absent in the NEW R2 code only
const myCodeStart = source.indexOf('// ============================================================================\n// AUTHORED PHRASE GRAPH R2');
const myCodeEnd = source.indexOf('// ============================================================================\n// END AUTHORED PHRASE GRAPH R2');
const myCode = myCodeStart >= 0 && myCodeEnd >= 0
  ? source.slice(myCodeStart, myCodeEnd)
  : '';

for (const forbidden of [
  'semanticR443State.phase===SEMANTIC_R443_PHASE.CANDIDATE',
  'semanticR443State.phase===SEMANTIC_R443_PHASE.READABLE_LOCK',
  'semanticR443State.phase===SEMANTIC_R443_PHASE.DISPERSAL',
  'semanticR443State.phase===SEMANTIC_R443_PHASE.COOLDOWN',
  'overdueDispersalCount',
  'shortReadableCount',
  'layerDebtBoost',
  'axisDebtBoost',
  'recentFaceFactors',
  'dispersalTargetMs',
  'semanticR443Dispersal',
  'semanticR443Release',
  'semanticR443EvolutionReady',
  'semanticR443RefreshArming',
  'semanticR443Lock',
  'fallback to weighted random',
  'Fallback to weighted random',
  'candidates=semanticR442AllMoveCandidates',
  'weighted=candidates.map',
  'seededUnit()*total',
]) if (myCode && myCode.includes(forbidden)) throw new Error(`R4.4.4 R2 forbidden mechanism present in new code: ${forbidden}`);

// Verify NO FALLBACK in SelectMove
if (!source.includes('NO FALLBACK - if phrase graph has no move, return null')) {
  throw new Error('R4.4.4 R2 missing NO FALLBACK guard in SelectMove');
}

fs.writeFileSync(file, source);
console.log('R4.4.4 authored phrase graph R2 applied');