const lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';
const source = lang === 'ru' ? '/ru/ai-systems/index.html' : '/ai-systems/index.html';
const mount = document.querySelector('[data-r4-preview-main]');

async function bootPreview() {
  if (!mount) return;
  try {
    const response = await fetch(source, { cache: 'no-store' });
    if (!response.ok) throw new Error(`candidate source HTTP ${response.status}`);
    let html = await response.text();
    html = html.replace(/^---[\s\S]*?---\s*/, '');
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const candidateMain = doc.querySelector('main');
    if (!candidateMain) throw new Error('candidate <main> not found');
    const imported = document.importNode(candidateMain, true);
    mount.replaceWith(imported);
    await import('/assets/js/ai-systems-golden-r4.js?v=trace-threshold-r1');
  } catch (error) {
    mount.innerHTML = `<section style="min-height:70vh;display:grid;place-items:center;padding:120px 24px;background:#050709;color:#f2f0eb;font:16px/1.5 Inter,sans-serif"><div><strong>OWNER PREVIEW LOAD FAILURE</strong><p>${String(error.message || error)}</p></div></section>`;
    console.error('[AI Systems R4 owner preview]', error);
  }
}
bootPreview();
