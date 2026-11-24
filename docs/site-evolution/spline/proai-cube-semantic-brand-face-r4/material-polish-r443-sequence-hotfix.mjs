import fs from 'node:fs';

const file = new URL('./main.generated.js', import.meta.url);
let source = fs.readFileSync(file, 'utf8');

const startToken = 'function semanticR443CreateWordMask(text){';
const endToken = 'function semanticR443GlobalMask(index){';
const start = source.indexOf(startToken);
const end = source.indexOf(endToken, start + startToken.length);
if (start < 0 || end < 0 || source.indexOf(startToken, start + startToken.length) >= 0) {
  throw new Error(`R4.4.3 sequence hotfix function range invalid: ${start}/${end}`);
}
if (source.includes('const SEMANTIC_R443_TYPOGRAPHY=')) {
  throw new Error('R4.4.3 sequence typography already installed');
}

let fn = source.slice(start, end);
const replacements = [
  ['SEMANTIC_R2.targetBlockWidthRatio', 'SEMANTIC_R443_TYPOGRAPHY.targetBlockWidthRatio', 1],
  ['SEMANTIC_R2.fontWeight', 'SEMANTIC_R443_TYPOGRAPHY.fontWeight', 2],
  ['SEMANTIC_R2.fontFamily', 'SEMANTIC_R443_TYPOGRAPHY.fontFamily', 2],
];
for (const [from, to, expected] of replacements) {
  const count = fn.split(from).length - 1;
  if (count !== expected) throw new Error(`R4.4.3 sequence hotfix ${from}: expected ${expected}, got ${count}`);
  fn = fn.split(from).join(to);
}
if (fn.includes('SEMANTIC_R2.')) throw new Error('R4.4.3 sequence word mask still depends on legacy SEMANTIC_R2 scope');

const typography = "const SEMANTIC_R443_TYPOGRAPHY=Object.freeze({fontFamily:'Instrument Sans Variable',fontWeight:620,targetBlockWidthRatio:.722,scaleX:.875,scaleY:.900});\n";
source = source.slice(0, start) + typography + fn + source.slice(end);

for (const required of [
  "fontFamily:'Instrument Sans Variable'",
  'fontWeight:620',
  'targetBlockWidthRatio:.722',
  'scaleX:.875',
  'scaleY:.900',
  'SEMANTIC_R443_TYPOGRAPHY.fontWeight',
  'SEMANTIC_R443_TYPOGRAPHY.fontFamily',
  'SEMANTIC_R443_TYPOGRAPHY.targetBlockWidthRatio',
  "SEMANTIC_R443_SEQUENCE=Object.freeze(['ProAI Expert','TRUST','INQUIRY','RESPONSE','RESULT'])",
]) if (!source.includes(required)) throw new Error(`R4.4.3 sequence hotfix missing invariant: ${required}`);

fs.writeFileSync(file, source);
console.log('R4.4.3 sequence texture typography scope restored');
