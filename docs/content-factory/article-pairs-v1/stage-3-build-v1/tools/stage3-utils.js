const fs = require('fs');
const path = require('path');
const http = require('http');
const { execFileSync, execSync } = require('child_process');
const cheerio = require('cheerio');
const { marked } = require('marked');

const repoRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
const evidenceDir = path.join(repoRoot, 'docs/content-factory/article-pairs-v1/stage-3-build-v1');

function normalizeText(value) {
  return String(value || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function readSource(route) {
  return execFileSync('git', ['show', `origin/article-pairs-gemini-stage-v1:${route.sourceFile}`], {
    cwd: repoRoot, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024
  });
}

function sourcePublicMarkdown(route) {
  const raw = readSource(route);
  const match = raw.match(/^# (.*?)(?:\r?\n|$)/m);
  if (!match) throw new Error(`${route.id}: source H1 not found`);
  return { raw, h1: match[1].trim(), markdown: raw.slice(raw.indexOf(match[0])) };
}

function loadDocument(html) { return cheerio.load(html); }
function loadFragment(html) { return cheerio.load(html, null, false); }

function writeJson(fileName, value) {
  fs.writeFileSync(path.join(evidenceDir, fileName), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function gitSha(ref = 'HEAD') {
  return execFileSync('git', ['rev-parse', ref], { cwd: repoRoot, encoding: 'utf8' }).trim();
}

function sourceOrganization(url) {
  const host = new URL(url).hostname;
  if (host.includes('developers.google.com')) return 'Google Search Central';
  if (host.includes('w3.org')) return 'W3C';
  if (host.includes('digital.gov')) return 'Digital.gov';
  if (host.includes('icann.org')) return 'ICANN';
  if (host.includes('copyright.gov')) return 'U.S. Copyright Office';
  return host;
}

function mimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ({ '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
    '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp',
    '.woff2': 'font/woff2', '.ico': 'image/x-icon' })[ext] || 'application/octet-stream';
}

function startServer() {
  const server = http.createServer((request, response) => {
    const rawPath = decodeURIComponent(request.url.split('?')[0]);
    const safePath = path.normalize(rawPath).replace(/^([/\\])+/, '');
    let filePath = path.resolve(repoRoot, safePath || 'index.html');
    const relativePath = path.relative(repoRoot, filePath);
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) { response.writeHead(403); response.end('Forbidden'); return; }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, 'index.html');
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) { response.writeHead(404); response.end('Not found'); return; }
    response.writeHead(200, { 'Content-Type': mimeType(filePath), 'Cache-Control': 'no-store' });
    fs.createReadStream(filePath).pipe(response);
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve({ server, baseUrl: `http://127.0.0.1:${server.address().port}` }));
  });
}

function publicSourceDom(route) {
  const { markdown } = sourcePublicMarkdown(route);
  return loadFragment(marked.parse(markdown));
}

function publicRenderedDom(route) {
  return loadDocument(fs.readFileSync(path.join(repoRoot, route.file), 'utf8'));
}

module.exports = {
  fs, path, cheerio, marked, repoRoot, evidenceDir, normalizeText, readSource,
  sourcePublicMarkdown, loadDocument, loadFragment, writeJson, gitSha,
  sourceOrganization, startServer, publicSourceDom, publicRenderedDom
};
