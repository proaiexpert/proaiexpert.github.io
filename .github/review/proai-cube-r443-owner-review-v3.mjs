import fs from 'node:fs';
import path from 'node:path';

const oldSha='731f435c3ee895300d053a83153832cabe65f2ca';
const productSha='b5fdd9b53389c734ea85051fbd9fa16cd547e11b';
let failure=null;
try {
  await import('./r443-owner-review-v2.mjs');
} catch (error) {
  failure=error;
}
const root=path.resolve('review-evidence/r443');
for (const name of ['r443-observation-metrics.json','r443-metrics.json','r443-observation-summary.txt','r443-summary.txt']) {
  const file=path.join(root,name);
  if (!fs.existsSync(file)) continue;
  const text=fs.readFileSync(file,'utf8').split(oldSha).join(productSha);
  fs.writeFileSync(file,text);
}
if (failure) throw failure;
