const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const http = require('http');
const https = require('https');

const repoRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();

const manifestPath = path.join(repoRoot, 'docs/content-factory/article-pairs-v1/stage-3-build-v1/source-link-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

async function checkUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LinkChecker/1.0)' },
      timeout: 10000
    }, (res) => {
      resolve({ status: res.statusCode });
    });
    
    req.on('error', (err) => {
      resolve({ status: 0, error: err.message });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, error: 'Timeout' });
    });
  });
}

async function run() {
  for (const item of manifest) {
    if (item.httpCheck === 'Pending' || item.httpCheck === 0) {
      console.log(`Checking ${item.url}...`);
      const result = await checkUrl(item.url);
      item.httpCheck = result.status;
      item.timestamp = new Date().toISOString();
      if (result.status === 403 || result.status === 401) {
        item.blocksAutomated = true;
      }
    }
  }
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('Link checking complete.');
}

run();
