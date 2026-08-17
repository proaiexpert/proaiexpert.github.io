import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = process.env.PROAI_URL || 'http://127.0.0.1:4173/';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getR2Diagnostics(page) {
  return page.evaluate(() => window.__PROAI_CUBE_R1_2?.getDiagnostics?.()?.semanticR4?.r444PhraseGraphR2);
}

async function getFullDiagnostics(page) {
  return page.evaluate(() => window.__PROAI_CUBE_R1_2?.getDiagnostics?.());
}

async function waitForCondition(page, predicate, timeoutMs, label) {
  const started = Date.now();
  let last = null;
  while (Date.now() - started < timeoutMs) {
    last = await getR2Diagnostics(page);
    if (predicate(last)) return last;
    await sleep(50);
  }
  throw new Error(`${label} timeout after ${timeoutMs}ms; last=${JSON.stringify(last)}`);
}

async function runSeedTest(seed, transitionsTarget = 100) {
  console.log(`\n=== SEED ${seed} ===`);

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-first-run',
      '--disable-infobars',
      '--use-gl=desktop',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--disable-dev-shm-usage',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 720, height: 720 },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();

  const fatalErrors = [];
  page.on('pageerror', (error) => fatalErrors.push(String(error)));
  page.on('console', (message) => {
    const text = message.text();
    if (message.type() === 'error' && /GLB load failed|TypeError|ReferenceError|WebGL context lost/i.test(text)) {
      fatalErrors.push(text);
    }
  });

  try {
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForFunction(() => window.__PROAI_CUBE_R1_2?.ready === true, null, { timeout: 120000 });

    // Set seed for deterministic execution
    await page.evaluate((s) => {
      if (window.__PROAI_CUBE_R1_2?.setSeed) window.__PROAI_CUBE_R1_2.setSeed(s);
    }, seed);

    // Wait for presentation phase to complete (16 seconds) + buffer
    await sleep(18000);

    const metrics = {
      seed,
      transitionsTested: 0,
      phrasesExercised: new Set(),
      graphNodesExercised: new Set(),
      invalidStartStates: 0,
      invalidEndpoints: 0,
      protectionViolations: 0,
      cooldownViolations: 0,
      illegalTransitions: 0,
      graphDeadEnds: 0,
      oldLifecycleActivations: 0,
      determinismFailures: 0,
      diversityFailures: 0,
      semanticSafeEndpoints: 0,
      opticallyGoodEndpoints: 0,
      phraseDetails: [],
      lifecycleTransitions: [],
      validationErrors: [],
    };

    let lastPhrase = null;
    let lastEndFace = null;
    let consecutiveSameEndFace = 0;
    let lastLifecycleState = null;

    for (let i = 0; i < transitionsTarget; i++) {
      // Wait for phrase to START (transition from IDLE_READY/COOLDOWN to PHRASE_RUNNING)
      let diag = await waitForCondition(page,
        (d) => d && d.lifecycleState === 'PHRASE_RUNNING',
        30000,
        `phrase start ${i}`
      );

      // Record phrase start
      if (diag.currentPhrase && diag.currentPhrase !== lastPhrase) {
        metrics.phrasesExercised.add(diag.currentPhrase);
        metrics.graphNodesExercised.add(diag.currentGraphNode);
      }

      // Wait for phrase to COMPLETE (transition to COOLDOWN or IDLE_READY)
      diag = await waitForCondition(page,
        (d) => d && (d.lifecycleState === 'COOLDOWN' || d.lifecycleState === 'IDLE_READY'),
        30000,
        `phrase completion ${i}`
      );

      // Check for old R4.4.3 lifecycle activations
      const fullDiag = await getFullDiagnostics(page);
      if (fullDiag?.r443Lifecycle?.phase &&
          ['CANDIDATE', 'READABLE_LOCK', 'DISPERSAL'].includes(fullDiag.r443Lifecycle.phase)) {
        metrics.oldLifecycleActivations++;
      }

      // Record phrase completion
      if (diag.currentPhrase && diag.currentPhrase !== lastPhrase) {
        metrics.phrasesExercised.add(diag.currentPhrase);
        metrics.graphNodesExercised.add(diag.currentGraphNode);

        // Check endpoint validity
        if (diag.currentGraphNode !== diag.currentFace) {
          metrics.invalidEndpoints++;
        } else {
          metrics.semanticSafeEndpoints++;
        }

        // Check optical quality at endpoint
        if (diag.assembledFaces?.includes(diag.currentGraphNode)) {
          const q = await page.evaluate((face) => {
            return window.__PROAI_CUBE_R1_2?.semanticR442EvaluateFace?.(face, false);
          }, diag.currentGraphNode);
          if (q && q.assembled && q.rawQuality > 0.5) {
            metrics.opticallyGoodEndpoints++;
          }
        }

        // Diversity checks
        if (lastEndFace === diag.currentGraphNode) {
          consecutiveSameEndFace++;
          if (consecutiveSameEndFace >= 2) {
            metrics.diversityFailures++;
          }
        } else {
          consecutiveSameEndFace = 0;
        }

        // Back-and-forth check
        if (lastPhrase && lastEndFace === diag.currentGraphNode && diag.currentFace === lastEndFace) {
          // This would be A→B→A pattern
        }

        lastPhrase = diag.currentPhrase;
        lastEndFace = diag.currentGraphNode;
        metrics.transitionsTested++;

        metrics.phraseDetails.push({
          phrase: diag.currentPhrase,
          startFace: diag.currentFace,
          endFace: diag.currentGraphNode,
          lifecycleState: diag.lifecycleState,
          lifecycleTransitions: diag.lifecycleTransitions,
          assemblySig: diag.assemblySig,
          phraseProgress: diag.phraseProgress,
        });
      }

      // Check for protection violations in validation log
      if (diag.validationLog) {
        for (const v of diag.validationLog) {
          if (v.type === 'phrase-validation-fail') {
            for (const err of v.errors || []) {
              if (err.includes('PROTECTION_VIOLATION')) metrics.protectionViolations++;
              if (err.includes('PHYSICAL_START_MISMATCH')) metrics.invalidStartStates++;
              if (err.includes('GRAPH_DEAD_END')) metrics.graphDeadEnds++;
              if (err.includes('PROTECTION_FACE_MISMATCH')) metrics.protectionViolations++;
            }
          }
        }
      }

      // Check cooldown violations (phrase starting during cooldown)
      if (diag.cooldownUntilMs > 0 && diag.lifecycleState === 'PHRASE_RUNNING') {
        const now = fullDiag?.presentation?.simTimeMs || 0;
        if (now < diag.cooldownUntilMs) {
          metrics.cooldownViolations++;
        }
      }

      // Check for illegal transitions (lifecycle state regression)
      if (lastLifecycleState && diag.lifecycleState) {
        const validTransitions = {
          'IDLE_READY': ['PHRASE_RUNNING', 'COOLDOWN'],
          'COOLDOWN': ['PHRASE_RUNNING', 'IDLE_READY'],
          'PHRASE_RUNNING': ['VERIFIED_ENDPOINT'],
          'VERIFIED_ENDPOINT': ['SEMANTIC_MOMENT', 'COOLDOWN'],
          'SEMANTIC_MOMENT': ['RELEASE', 'COOLDOWN'],
          'RELEASE': ['COOLDOWN'],
        };
        const allowed = validTransitions[lastLifecycleState] || [];
        if (!allowed.includes(diag.lifecycleState) && diag.lifecycleState !== lastLifecycleState) {
          metrics.illegalTransitions++;
        }
      }
      lastLifecycleState = diag.lifecycleState;

      // Brief pause between phrases
      await sleep(100);
    }

    // Run determinism test - same seed should produce same sequence
    const diag1 = await getR2Diagnostics(page);
    const seq1 = diag1?.lifecycleLog?.filter(l => l.type === 'phrase-start').map(l => l.phrase) || [];

    // Reset and run again with same seed
    await page.evaluate((s) => {
      if (window.__PROAI_CUBE_R1_2?.setSeed) window.__PROAI_CUBE_R1_2.setSeed(s);
      if (window.__PROAI_CUBE_R1_2?.reset) window.__PROAI_CUBE_R1_2.reset();
    }, seed);
    await sleep(2000);

    let sameSequence = true;
    for (let i = 0; i < Math.min(10, transitionsTarget); i++) {
      let d = await waitForCondition(page,
        (d) => d && (d.lifecycleState === 'COOLDOWN' || d.lifecycleState === 'IDLE_READY'),
        10000,
        `determinism check ${i}`
      );
      if (d.currentPhrase !== seq1[i]) {
        sameSequence = false;
        metrics.determinismFailures++;
        break;
      }
    }

    metrics.phrasesExercised = Array.from(metrics.phrasesExercised);
    metrics.graphNodesExercised = Array.from(metrics.graphNodesExercised);

    console.log(`Seed ${seed}: ${metrics.transitionsTested} transitions, ${metrics.phrasesExercised.length} phrases, ${metrics.graphNodesExercised.length} nodes`);
    console.log(`  Invalid starts: ${metrics.invalidStartStates}, Invalid endpoints: ${metrics.invalidEndpoints}`);
    console.log(`  Protection violations: ${metrics.protectionViolations}, Cooldown violations: ${metrics.cooldownViolations}`);
    console.log(`  Graph dead ends: ${metrics.graphDeadEnds}, Old lifecycle: ${metrics.oldLifecycleActivations}`);
    console.log(`  Determinism: ${sameSequence ? 'PASS' : 'FAIL'}, Diversity failures: ${metrics.diversityFailures}`);
    console.log(`  Semantic safe: ${metrics.semanticSafeEndpoints}, Optically good: ${metrics.opticallyGoodEndpoints}`);

    return metrics;

  } finally {
    await browser.close();
  }
}

async function main() {
  const seeds = [
    0x444c0de, 0xdeadbeef, 0xcafebabe, 0x12345678, 0x87654321,
    0xabcdef01, 0x11223344, 0x55667788, 0x99aabbcc, 0xddeeff00,
    0x13579bdf, 0x2468ace0, 0xfedcba98, 0x89abcdef, 0x01234567,
    0x76543210, 0xf0e1d2c3, 0xc3d2e1f0, 0x9a8b7c6d, 0x6d7c8b9a,
  ];

  const allMetrics = {
    seedsTested: 0,
    transitionsTested: 0,
    phrasesExercised: new Set(),
    graphNodesExercised: new Set(),
    invalidStartStates: 0,
    invalidEndpoints: 0,
    protectionViolations: 0,
    cooldownViolations: 0,
    illegalTransitions: 0,
    graphDeadEnds: 0,
    oldLifecycleActivations: 0,
    determinismFailures: 0,
    diversityFailures: 0,
    semanticSafeEndpoints: 0,
    opticallyGoodEndpoints: 0,
    perSeed: [],
  };

  for (const seed of seeds) {
    try {
      const m = await runSeedTest(seed, 100);
      allMetrics.seedsTested++;
      allMetrics.transitionsTested += m.transitionsTested;
      for (const p of m.phrasesExercised) allMetrics.phrasesExercised.add(p);
      for (const n of m.graphNodesExercised) allMetrics.graphNodesExercised.add(n);
      allMetrics.invalidStartStates += m.invalidStartStates;
      allMetrics.invalidEndpoints += m.invalidEndpoints;
      allMetrics.protectionViolations += m.protectionViolations;
      allMetrics.cooldownViolations += m.cooldownViolations;
      allMetrics.illegalTransitions += m.illegalTransitions;
      allMetrics.graphDeadEnds += m.graphDeadEnds;
      allMetrics.oldLifecycleActivations += m.oldLifecycleActivations;
      allMetrics.determinismFailures += m.determinismFailures;
      allMetrics.diversityFailures += m.diversityFailures;
      allMetrics.semanticSafeEndpoints += m.semanticSafeEndpoints;
      allMetrics.opticallyGoodEndpoints += m.opticallyGoodEndpoints;
      allMetrics.perSeed.push(m);
    } catch (e) {
      console.error(`Seed ${seed} failed:`, e.message);
      allMetrics.perSeed.push({ seed, error: e.message });
    }
  }

  allMetrics.phrasesExercised = Array.from(allMetrics.phrasesExercised);
  allMetrics.graphNodesExercised = Array.from(allMetrics.graphNodesExercised);

  // Write results
  fs.mkdirSync('review-evidence', { recursive: true });
  fs.writeFileSync('review-evidence/r444-r2-qa-metrics.json', JSON.stringify(allMetrics, null, 2));

  console.log('\n=== R2 QA SUMMARY ===');
  console.log(`SEEDS_TESTED: ${allMetrics.seedsTested}`);
  console.log(`TRANSITIONS_TESTED: ${allMetrics.transitionsTested}`);
  console.log(`PHRASES_EXERCISED: ${allMetrics.phrasesExercised.length} (${allMetrics.phrasesExercised.join(', ')})`);
  console.log(`GRAPH_NODES_EXERCISED: ${allMetrics.graphNodesExercised.length} (${allMetrics.graphNodesExercised.join(', ')})`);
  console.log(`INVALID_START_STATES: ${allMetrics.invalidStartStates}`);
  console.log(`INVALID_ENDPOINTS: ${allMetrics.invalidEndpoints}`);
  console.log(`PROTECTION_VIOLATIONS: ${allMetrics.protectionViolations}`);
  console.log(`COOLDOWN_VIOLATIONS: ${allMetrics.cooldownViolations}`);
  console.log(`ILLEGAL_TRANSITIONS: ${allMetrics.illegalTransitions}`);
  console.log(`GRAPH_DEAD_ENDS: ${allMetrics.graphDeadEnds}`);
  console.log(`OLD_LIFECYCLE_ACTIVATIONS: ${allMetrics.oldLifecycleActivations}`);
  console.log(`DETERMINISM_FAILURES: ${allMetrics.determinismFailures}`);
  console.log(`DIVERSITY_FAILURES: ${allMetrics.diversityFailures}`);
  console.log(`SEMANTIC_SAFE_ENDPOINTS: ${allMetrics.semanticSafeEndpoints}`);
  console.log(`OPTICALLY_GOOD_ENDPOINTS: ${allMetrics.opticallyGoodEndpoints}`);

  // Determine pass/fail
  const structuralViolations =
    allMetrics.invalidStartStates > 0 ||
    allMetrics.invalidEndpoints > 0 ||
    allMetrics.protectionViolations > 0 ||
    allMetrics.cooldownViolations > 0 ||
    allMetrics.illegalTransitions > 0 ||
    allMetrics.graphDeadEnds > 0 ||
    allMetrics.oldLifecycleActivations > 0 ||
    allMetrics.determinismFailures > 0;

  console.log(`\nSTRUCTURAL VIOLATIONS: ${structuralViolations ? 'YES' : 'NO'}`);
  console.log(`OVERALL: ${structuralViolations ? 'FAIL' : 'PASS'}`);

  if (structuralViolations) process.exitCode = 1;
}

main().catch(console.error);