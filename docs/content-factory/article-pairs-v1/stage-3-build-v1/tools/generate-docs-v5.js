const { execFileSync } = require('child_process');
const { fs, path, repoRoot, evidenceDir, gitSha, writeJson } = require('./stage3-utils');
const { MAIN_SHA, STARTING_SHA } = require('./stage3-config');

function json(name) { return JSON.parse(fs.readFileSync(path.join(evidenceDir, name), 'utf8')); }
function git(args) { return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }).trim(); }

const reports = {
  staticHtml: json('static-html-report.json'), metadata: json('metadata-manifest.json'), integrity: json('content-integrity-report.json'),
  modules: json('module-map-report.json'), readingTime: json('reading-time-report.json'), links: json('source-link-manifest.json'),
  responsive: json('responsive-report.json'), accessibility: json('accessibility-report.json'), reducedMotion: json('reduced-motion-report.json'),
  lighthouse: json('lighthouse-summary.json')
};
const testedShas = [...new Set(Object.values(reports).map((report) => report.testedSha).filter(Boolean))];
if (testedShas.length !== 1) throw new Error(`Evidence SHA mismatch: ${testedShas.join(', ')}`);
const testedSha = testedShas[0];
const reviewDir = process.env.STAGE3_REVIEW_DIR || path.join(repoRoot, 'owner-review/article-stage-3-v5');
const reviewManifest = JSON.parse(fs.readFileSync(path.join(reviewDir, 'manifest.json'), 'utf8'));
const moduleAssertions = JSON.parse(fs.readFileSync(path.join(reviewDir, 'module-capture-assertions.json'), 'utf8'));
const commitLines = git(['log', '--format=%H%x09%s', `${STARTING_SHA}..HEAD`]).split(/\r?\n/).filter(Boolean).map((line) => {
  const [sha, ...message] = line.split('\t'); return { sha, message: message.join('\t') };
}).reverse();
const changedFiles = git(['diff', '--name-status', `${MAIN_SHA}...HEAD`]).split(/\r?\n/).filter(Boolean).map((line) => {
  const [status, ...file] = line.split('\t'); return { status, file: file.join('\t') };
});
const contentImplementationSha = git(['log', '-1', '--format=%H', '--',
  'assets/css/premium-insights-v1.css', 'assets/js/premium-insights-v1.js',
  'insights/does-your-service-business-need-a-multilingual-website/index.html',
  'insights/how-to-evaluate-a-website-proposal/index.html',
  'ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/index.html',
  'ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/index.html']);
const evidenceOnlyFinalSha = process.env.STAGE3_EVIDENCE_SHA || 'NOT_APPLICABLE_BEFORE_EVIDENCE_COMMIT';
const reviewSha = process.env.STAGE3_REVIEW_SHA || 'NOT_CREATED_AT_GENERATION_TIME';

const finalSummary = {
  generatedFromCommittedEvidence: true, mainSha: MAIN_SHA, startingSha: STARTING_SHA,
  implementationBranch: 'article-premium-pages-build-v1', contentImplementationSha, exactTestedSha: testedSha,
  evidenceOnlyFinalSha, reviewBranch: 'owner-review-article-stage-3-v5', reviewBranchParentSha: testedSha, reviewSha,
  correctionCommits: commitLines, changedFiles,
  routeResults: reports.metadata.records.map((record) => ({ id: record.id, status: record.status, values: record.values })),
  readingTime: reports.readingTime.routes.map((route) => ({ id: route.id, wordCount: route.wordCount, minutes: route.calculatedMinutes, visibleText: route.visibleText })),
  sourceLinks: { total: reports.links.total, countsByRoute: reports.links.countsByRoute, countsByStatus: reports.links.countsByStatus, status: reports.links.status },
  integrity: { status: reports.integrity.status, routes: reports.integrity.routes.map((route) => ({ id: route.id, sourceRecordCount: route.sourceRecordCount, renderedRecordCount: route.renderedRecordCount })) },
  moduleMapping: { status: reports.modules.status, routes: reports.modules.routes.map((route) => ({ id: route.id, expectedCount: route.expectedCount })) },
  falseRiskRegression: reports.staticHtml.records.map((record) => ({ id: record.id, status: record.falseRiskRegression, labels: record.riskClassTexts })),
  responsive: { status: reports.responsive.status, matrixCount: reports.responsive.matrixCount },
  accessibility: { status: reports.accessibility.status }, reducedMotion: { status: reports.reducedMotion.status },
  lighthouse: { version: reports.lighthouse.lighthouseVersion, status: reports.lighthouse.status,
    routes: reports.lighthouse.routes.map((route) => ({ id: route.id, scores: route.scores, metrics: route.metrics })) },
  screenshots: { count: reviewManifest.screenshotCount, status: reviewManifest.status, duplicateHashResult: reviewManifest.duplicateHashResult,
    files: reviewManifest.screenshots.map((shot) => ({ filename: shot.filename, width: shot.actualPngWidth, height: shot.actualPngHeight,
      byteSize: shot.byteSize, sha256: shot.sha256, captureResult: shot.captureResult, visualInspectionStatus: shot.visualInspectionStatus })) },
  moduleCaptureAssertions: { status: moduleAssertions.status, assertions: moduleAssertions.assertions.map((item) => ({ filename: item.filename, status: item.status, intersectionRatios: item.intersectionRatios })) },
  knownLimitations: ['Visual inspection remains PENDING_OWNER_REVIEW.', 'Lighthouse was run on a local static server with simulated mobile throttling.', 'npm reports transitive development-tool advisories; no production dependency is shipped by these static pages.'],
  status: Object.values(reports).every((report) => report.status === 'PASS') && reviewManifest.status === 'PASS' && moduleAssertions.status === 'PASS' ? 'PASS' : 'FAIL'
};
writeJson('final-summary.json', finalSummary);

const commitList = commitLines.map((commit) => `- ${commit.sha} — ${commit.message}`).join('\n');
const fileList = changedFiles.map((item) => `- ${item.status}: ${item.file}`).join('\n');
const implementation = `# Stage 3 Implementation Manifest\n\n- Production main SHA: ${MAIN_SHA}\n- Starting implementation SHA: ${STARTING_SHA}\n- Content implementation SHA: ${contentImplementationSha}\n- Exact tested SHA: ${testedSha}\n- Evidence-only final commit: ${evidenceOnlyFinalSha}\n- Review branch parent SHA: ${testedSha}\n- Review branch SHA: ${reviewSha}\n\n## Correction commits\n\n${commitList}\n\n## Exact files changed against production main\n\n${fileList}\n`;
fs.writeFileSync(path.join(evidenceDir, 'implementation-manifest.md'), implementation, 'utf8');

const lightRows = finalSummary.lighthouse.routes.map((route) => `| ${route.id} | ${route.scores.performance} | ${route.scores.accessibility} | ${route.scores['best-practices']} | ${route.scores.seo} | ${route.metrics.lcpMs} ms | ${route.metrics.cls} | ${route.metrics.tbtMs} ms |`).join('\n');
const qa = `# Stage 3 QA Report\n\nExact tested SHA: ${testedSha}\n\n| Check | Result |\n|---|---|\n| Static HTML | ${reports.staticHtml.status} |\n| Metadata | ${reports.metadata.status} |\n| Frozen content integrity | ${reports.integrity.status} |\n| Module mapping | ${reports.modules.status} |\n| Reading time | ${reports.readingTime.status} |\n| Source links (${reports.links.total}) | ${reports.links.status} |\n| Responsive matrix (${reports.responsive.matrixCount}) | ${reports.responsive.status} |\n| Accessibility / keyboard / no-JS | ${reports.accessibility.status} |\n| Reduced motion | ${reports.reducedMotion.status} |\n| Review captures (${reviewManifest.screenshotCount}) | ${reviewManifest.status} |\n\n## Lighthouse mobile\n\n| Route | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |\n|---|---:|---:|---:|---:|---:|---:|---:|\n${lightRows}\n\nVisual inspection status: PENDING_OWNER_REVIEW\n`;
fs.writeFileSync(path.join(evidenceDir, 'qa-report.md'), qa, 'utf8');

const diff = `# Stage 3 Diff Summary\n\n- Baseline: ${MAIN_SHA}\n- Exact tested SHA: ${testedSha}\n- Changed files: ${changedFiles.length}\n- Correction commits after starting SHA: ${commitLines.length}\n- Review screenshots: ${reviewManifest.screenshotCount}\n- Source links: ${reports.links.total}\n\nThe detailed file list and exact commit list are in implementation-manifest.md.\n`;
fs.writeFileSync(path.join(evidenceDir, 'diff-summary.md'), diff, 'utf8');
console.log(`Generated final evidence documents for tested SHA ${testedSha}`);
