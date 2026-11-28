const { fs, path, evidenceDir, gitSha, writeJson } = require('./stage3-utils');

const required = ['static-html-report.json','metadata-manifest.json','content-integrity-report.json','module-map-report.json',
  'reading-time-report.json','source-link-manifest.json','responsive-report.json','accessibility-report.json','reduced-motion-report.json','lighthouse-summary.json','final-summary.json'];
const reports = Object.fromEntries(required.map((name) => [name, JSON.parse(fs.readFileSync(path.join(evidenceDir, name), 'utf8'))]));
const final = reports['final-summary.json'];
const reviewDir = process.env.STAGE3_REVIEW_DIR || path.join(require('./stage3-utils').repoRoot, 'owner-review/article-stage-3-v5');
const manifest = JSON.parse(fs.readFileSync(path.join(reviewDir, 'manifest.json'), 'utf8'));
const assertions = JSON.parse(fs.readFileSync(path.join(reviewDir, 'module-capture-assertions.json'), 'utf8'));
const testedShas = [...new Set(required.filter((name) => name !== 'final-summary.json').map((name) => reports[name].testedSha).filter(Boolean))];
const placeholderFiles = ['qa-report.md','implementation-manifest.md','diff-summary.md','final-summary.json'].filter((name) => {
  const text = fs.readFileSync(path.join(evidenceDir, name), 'utf8').replace(/PENDING_OWNER_REVIEW/g, 'OWNER_REVIEW_ALLOWED');
  return /\$\{|\{\{|\bPENDING\b|\bTODO\b|14875f918e9d5010ca47b0a708eb1ca2dfa6cdce/.test(text);
});
const dimensionsMatch = final.screenshots.files.length === manifest.screenshots.length && final.screenshots.files.every((item) => {
  const source = manifest.screenshots.find((shot) => shot.filename === item.filename);
  return source && source.actualPngWidth === item.width && source.actualPngHeight === item.height && source.sha256 === item.sha256;
});
const checks = {
  allEvidencePass: required.every((name) => reports[name].status === 'PASS'),
  oneTestedSha: testedShas.length === 1,
  summaryShaMatches: testedShas.length === 1 && final.exactTestedSha === testedShas[0],
  sourceLinkTotal: reports['source-link-manifest.json'].total === 19 && final.sourceLinks.total === 19,
  metadataFourPass: reports['metadata-manifest.json'].records.length === 4 && reports['metadata-manifest.json'].records.every((record) => record.status === 'PASS'),
  screenshotCount: manifest.screenshotCount === 18 && final.screenshots.count === 18,
  screenshotDimensionsAndHashesMatch: dimensionsMatch,
  screenshotStatus: manifest.status === 'PASS' && manifest.duplicateHashResult === 'PASS',
  moduleCaptureStatus: assertions.status === 'PASS' && assertions.assertions.length === 6,
  noUnresolvedPlaceholders: placeholderFiles.length === 0
};
const report = { verifiedAt: new Date().toISOString(), verifierHeadSha: gitSha(), exactTestedSha: testedShas[0] || null,
  placeholderFiles, checks, status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL' };
writeJson('final-evidence-consistency.json', report);
if (report.status !== 'PASS') {
  console.error('Final evidence FAIL:', Object.entries(checks).filter(([, value]) => !value).map(([key]) => key).join(', ')); process.exit(1);
}
console.log(`Final evidence PASS for tested SHA ${report.exactTestedSha}`);
