const SEMANTIC_R1 = Object.freeze({
  language: semanticLanguage,
  sequences: Object.freeze({
    en: Object.freeze(['AI EXPERT', 'TRUST', 'INQUIRY', 'RESPONSE', 'RESULT']),
    ru: Object.freeze(['AI EXPERT', 'ДОВЕРИЕ', 'ОБРАЩЕНИЕ', 'ОТВЕТ', 'РЕЗУЛЬТАТ']),
  }),
  selectedLook: 'balancedSmokedChrome',
  displayInsetRatio: 0.988,
  faceOffset: 0.72,
  textOffset: 0.18,
  displayMaterial: Object.freeze({
    color: '#151c23',
    metalness: 0.62,
    roughness: 0.245,
    clearcoat: 0.14,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.08,
  }),
  text: Object.freeze({
    color: '#e9edf0',
    textureWidth: 2048,
    textureHeight: 512,
    safeWidthRatio: 0.90,
    safeHeightRatio: 0.72,
    maxFontPx: 286,
    minFontPx: 126,
    fontWeight: 700,
    requestedFontStack: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
  }),
  timings: Object.freeze({
    surfaceInMs: 420,
    textDelayMs: 140,
    textInMs: 320,
    readableHoldMs: 1650,
    textOutMs: 300,
    surfaceOutDelayMs: 100,
    surfaceOutMs: 420,
    interactionExitMs: 320,
    sliceResumeOffsetMs: 260,
  }),
  cadence: Object.freeze({
    opportunityMinMs: 8200,
    opportunityMaxMs: 10400,
    initialDelayMs: 6200,
    seed: 0x5e6a71c1,
  }),
  gates: Object.freeze({
    entryVisibilityDot: 0.74,
    activeExitVisibilityDot: 0.56,
    minProjectedArea: 0.035,
    minActiveProjectedArea: 0.018,
    entryMaxAbsYawDegPerSec: 13.5,
    earlyExitMaxAbsYawDegPerSec: 18.0,
  }),
  reducedMotion: Object.freeze({ automaticSemanticCycling: false }),
});

const SEMANTIC_LOOK_VARIANTS = Object.freeze({
  smokedGraphite: Object.freeze({ color: '#182029', metalness: 0.50, roughness: 0.30, clearcoat: 0.10, clearcoatRoughness: 0.22, envMapIntensity: 0.96 }),
  blackChrome: Object.freeze({ color: '#10161c', metalness: 0.72, roughness: 0.20, clearcoat: 0.18, clearcoatRoughness: 0.15, envMapIntensity: 1.15 }),
  balancedSmokedChrome: SEMANTIC_R1.displayMaterial,
});

const SEMANTIC_FACE_DEFS = Object.freeze({
  '+X': Object.freeze({ normal: [1, 0, 0], up: [0, 1, 0] }),
  '-X': Object.freeze({ normal: [-1, 0, 0], up: [0, 1, 0] }),
  '+Y': Object.freeze({ normal: [0, 1, 0], up: [0, 0, -1] }),
  '-Y': Object.freeze({ normal: [0, -1, 0], up: [0, 0, 1] }),
  '+Z': Object.freeze({ normal: [0, 0, 1], up: [0, 1, 0] }),
  '-Z': Object.freeze({ normal: [0, 0, -1], up: [0, 1, 0] }),
});
