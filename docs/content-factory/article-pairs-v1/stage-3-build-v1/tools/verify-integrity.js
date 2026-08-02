const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { marked } = require('marked');
const cheerio = require('cheerio');

const repoRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();

const routes = [
  {
    id: 'A1-RU',
    srcFile: 'docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-01-ru-final-candidate-v7.md',
    destFile: 'ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/index.html',
  },
  {
    id: 'A1-EN',
    srcFile: 'docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-01-en-final-candidate-v5.md',
    destFile: 'insights/does-your-service-business-need-a-multilingual-website/index.html',
  },
  {
    id: 'A2-RU',
    srcFile: 'docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-02-ru-final-candidate-v6.md',
    destFile: 'ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/index.html',
  },
  {
    id: 'A2-EN',
    srcFile: 'docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-02-en-final-candidate-v6.md',
    destFile: 'insights/how-to-evaluate-a-website-proposal/index.html',
  }
];

function normalize(str) {
  if (!str) return '';
  // decode entities
  let text = str;
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&nbsp;/g, ' ');
  // remove multiple whitespace
  return text.replace(/\\s+/g, ' ').trim();
}

function extractElements($) {
  const elements = [];
  $('h1, h2, h3, h4, h5, h6, p, li, td, th').each((i, el) => {
    // Exclude TOC links
    if ($(el).parents('.premium-toc').length > 0 || $(el).parents('.premium-toc-mobile').length > 0) return;
    if ($(el).parents('nav').length > 0) return; // skip nav elements
    if ($(el).parents('footer').length > 0) return; // skip footer
    
    // For CTA button which is just an 'a' not inside 'p', it might not be caught here if it's not in p. 
    // We only compare main tags.
    const text = normalize($(el).text());
    if (text) {
      elements.push({ type: el.tagName.toLowerCase(), text });
    }
  });
  return elements;
}

const reports = [];

for (const r of routes) {
  const rawMd = execSync(`git show origin/article-pairs-gemini-stage-v1:${r.srcFile}`, { encoding: 'utf8', cwd: repoRoot });
  const h1Match = rawMd.match(/^# (.*?)(?:\\r?\\n|$)/m);
  let publicMd = rawMd.substring(rawMd.indexOf(h1Match[0]));
  
  const sourceHtml = marked.parse(publicMd);
  const source$ = cheerio.load(sourceHtml, null, false);
  const sourceElements = extractElements(source$);

  const destHtml = fs.readFileSync(path.join(repoRoot, r.destFile), 'utf8');
  const dest$ = cheerio.load(destHtml, null, false);
  
  // Extract elements from main content area
  const mainContent$ = cheerio.load(dest$('main').html(), null, false);
  const destElements = extractElements(mainContent$);

  let differences = [];
  let missing = [];
  let added = [];
  
  const len = Math.max(sourceElements.length, destElements.length);
  for (let i=0; i<len; i++) {
    const s = sourceElements[i];
    const d = destElements[i];
    if (s && d) {
      if (s.text !== d.text) {
        differences.push({ index: i, expected: s.text, actual: d.text });
      }
    } else if (s) {
      missing.push(s);
    } else if (d) {
      added.push(d);
    }
  }

  reports.push({
    id: r.id,
    sourceFile: r.srcFile,
    sourceElementCount: sourceElements.length,
    destElementCount: destElements.length,
    differences: differences.length,
    missing: missing.length,
    added: added.length,
    status: (differences.length === 0 && missing.length === 0 && added.length === 0) ? 'PASS' : 'FAIL',
    details: { differences, missing, added }
  });
}

fs.writeFileSync(path.join(repoRoot, 'docs/content-factory/article-pairs-v1/stage-3-build-v1/content-integrity-report.json'), JSON.stringify(reports, null, 2));
console.log('Integrity verification complete.');
