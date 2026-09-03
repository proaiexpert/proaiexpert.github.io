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
    const demoUiParentUuid = '3acae095-4a11-475a-8b70-59aac6906793';
    const demoUiWhitelist = [
      ['Ellipse', '50605cdf-cc85-46b6-874a-000a1d96b4b3'],
      ['Rectangle 3', 'bfc84abf-461b-4b5d-9e7d-4c0d2fe108c8'],
      ['Text 7', '7e0d047a-c03d-4b52-a29d-b7d9775b1630'],
      ['Rectangle 2', '2e4c9677-c23f-498d-a238-99e7346cd64a'],
      ['Text 6', 'b27bc674-20c0-4e2e-a608-b92976b171bc'],
      ['Rectangle', '4c080547-86bf-42e5-a23d-ce33a154bc87'],
      ['Text 5', 'd0d28aea-11cd-4c6d-b6ff-bf7c8528dd53'],
      ['Text 4', '85cc886f-d4fa-438a-a91c-4bf043d4555b'],
      ['Text 3', '8ef5eb04-1102-4e8f-b237-4452fe7c6385'],
      ['Text 2', '61f54f7d-ce88-46ea-9f45-a01825154460'],
      ['Text', '6013b0e6-e898-4640-9d62-e088a816f69c']
    ];
    const demoUiParent = app.findObjectByName('UI');
    if (!demoUiParent || demoUiParent.type !== 'Empty' || demoUiParent.uuid !== demoUiParentUuid) {
      throw new Error('Golden donor demo UI parent identity mismatch');
    }
    for (const [name, uuid] of demoUiWhitelist) {
      const object = app.findObjectByName(name);
      if (!object || object.type !== 'Mesh' || object.uuid !== uuid || object.parentUuid !== demoUiParentUuid) {
        throw new Error(`Golden donor demo UI identity mismatch: ${name}`);
      }
      object.visible = false;
    }
    document.documentElement.dataset.cleanDonorUiHidden = String(demoUiWhitelist.length);
    document.documentElement.dataset.cleanDonorRuntime = 'ready';
  };

  start().catch((error) => {
    document.documentElement.dataset.cleanDonorRuntime = 'error';
    console.error('[AI Systems clean Golden donor]', error);
  });
})();
