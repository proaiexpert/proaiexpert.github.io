import { Application } from 'https://cdn.spline.design/@splinetool/runtime@2.0.27/build/runtime.js';

(() => {
  'use strict';

  const canvas = document.querySelector('[data-clean-donor-canvas]');
  if (!canvas) return;

  const payloadUrl = canvas.dataset.payloadUrl;
  const expectedSha = canvas.dataset.payloadSha;
  const hex = (bytes) => [...new Uint8Array(bytes)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  const start = async () => {
    document.documentElement.dataset.cleanDonorRuntime = 'loading';
    const response = await fetch(payloadUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Golden payload HTTP ${response.status}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    const subtle = globalThis.crypto?.subtle;
    const actualSha = subtle ? hex(await subtle.digest('SHA-256', bytes)) : expectedSha;
    if (actualSha !== expectedSha) throw new Error(`Golden payload SHA mismatch: ${actualSha}`);

    const app = new Application(canvas, { htmlContentMode: 'inline' });
    await app.start(Array.from(bytes));
    document.documentElement.dataset.cleanDonorRuntime = 'ready';
  };

  start().catch((error) => {
    document.documentElement.dataset.cleanDonorRuntime = 'error';
    console.error('[AI Systems clean Golden donor]', error);
  });
})();
