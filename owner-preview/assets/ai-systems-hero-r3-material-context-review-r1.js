import { Application } from 'https://cdn.spline.design/@splinetool/runtime@2.0.27/build/runtime.js';

(() => {
  'use strict';

  const canvas = document.querySelector('[data-hero-review-canvas]');
  if (!canvas) return;

  const params = new URLSearchParams(location.search);
  const mode = params.get('mode') === 'r3' ? 'r3' : 'golden';
  const modes = {
    golden: {
      label: 'GOLDEN HERO',
      url: './assets/3d/boxes-hover/public-original-inline-scene-payload.bin',
      sha: 'c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798',
    },
    r3: {
      label: 'R3 HERO · NEUTRAL LIGHT MATERIAL',
      url: './assets/3d/boxes-hover/neutral-light-material-r3-final.bin',
      sha: '1269ea60eb7725e59822ba2b9e789a2d9dd8956f557ffbbedfbb39e97a12c4d0',
    },
  };
  const selected = modes[mode];
  const html = document.documentElement;
  const status = document.querySelector('[data-hero-review-status]');
  const setStatus = (value) => {
    html.dataset.heroReviewStatus = value;
    if (status) status.textContent = `${selected.label} · ${value.toUpperCase()}`;
  };
  const hex = (bytes) => [...new Uint8Array(bytes)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  html.dataset.heroReviewMode = mode;
  html.dataset.heroReviewPayload = selected.sha;
  setStatus('loading');

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
    ['Text', '6013b0e6-e898-4640-9d62-e088a816f69c'],
  ];

  const start = async () => {
    if ((globalThis.__heroReviewBootCount || 0) !== 0) throw new Error('Duplicate Hero scene boot');
    globalThis.__heroReviewBootCount = 1;
    const response = await fetch(selected.url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${selected.label} payload HTTP ${response.status}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    const actualSha = globalThis.crypto?.subtle
      ? hex(await globalThis.crypto.subtle.digest('SHA-256', bytes))
      : selected.sha;
    if (actualSha !== selected.sha) throw new Error(`${selected.label} SHA mismatch: ${actualSha}`);

    const app = new Application(canvas, { htmlContentMode: 'inline' });
    await app.start(Array.from(bytes));

    const uiParent = app.findObjectByName('UI');
    if (!uiParent || uiParent.type !== 'Empty' || uiParent.uuid !== demoUiParentUuid) {
      throw new Error('Frozen demo UI parent identity mismatch');
    }
    for (const [name, uuid] of demoUiWhitelist) {
      const object = app.findObjectByName(name);
      if (!object || object.type !== 'Mesh' || object.uuid !== uuid || object.parentUuid !== demoUiParentUuid) {
        throw new Error(`Frozen demo UI identity mismatch: ${name}`);
      }
      object.visible = false;
    }

    const boxes = app.findObjectByName('Boxes');
    if (!boxes || boxes.type !== 'Empty' || boxes.uuid !== '006474fe-4e5b-4835-b106-89b2ec79dd71') {
      throw new Error('Boxes identity mismatch');
    }
    const objects = app.getAllObjects?.() || [];
    const cubes = objects.filter((object) => object.name === 'Cube' && object.type === 'Mesh' && object.parentUuid !== boxes.uuid);
    const materialRefs = cubes.map((object) => object.material).filter(Boolean);
    const materialIdentities = new Set(materialRefs.map((material) => material.uuid || material.id || material));
    const cameras = objects.filter((object) => object.type === 'OrthographicCamera');
    if (cubes.length !== 143 || materialIdentities.size !== 143) {
      throw new Error(`Runtime invariant mismatch: cubes=${cubes.length}, materials=${materialIdentities.size}`);
    }

    html.dataset.heroReviewCubes = String(cubes.length);
    html.dataset.heroReviewMaterialIdentities = String(materialIdentities.size);
    html.dataset.heroReviewCameras = String(cameras.length);
    html.dataset.heroReviewUiHidden = String(demoUiWhitelist.length);
    html.dataset.heroReviewWebgpu = String(Boolean(await navigator.gpu?.requestAdapter?.({ powerPreference: 'high-performance' })));
    setStatus('ready');
  };

  start().catch((error) => {
    html.dataset.heroReviewStatus = 'error';
    if (status) status.textContent = `${selected.label} · ERROR`;
    console.error('[AI Systems Hero R3 context review]', error);
  });
})();
