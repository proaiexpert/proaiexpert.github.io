import fs from 'node:fs';

const file=process.argv[2];
if(!file)throw new Error('usage: node proai-cube-r443-semcap-generated-syntax-fix.mjs <product.mjs>');
let source=fs.readFileSync(file,'utf8');
const start=source.indexOf('function gestureMeta(id,moves){');
const end=source.indexOf('const VALIDATION=validateClosedPhraseLibrary();',start);
if(start<0||end<0)throw new Error(`authored generated region not found ${start}/${end}`);
let region=source.slice(start,end);
const escapedTicks=(region.match(/\\`/g)||[]).length;
const escapedQuotes=(region.match(/\\'/g)||[]).length;
if(escapedTicks<2)throw new Error('expected generated escaped template delimiters');
region=region.replace(/\\`/g,'`').replace(/\\'/g,"'");
source=source.slice(0,start)+region+source.slice(end);
fs.writeFileSync(file,source);
console.log(`R4.4.3 generated syntax normalized: ticks=${escapedTicks} quotes=${escapedQuotes}`);
