import { Application } from 'https://cdn.spline.design/@splinetool/runtime@2.0.27/build/runtime.js';

(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const lang = params.get('lang') === 'ru' ? 'ru' : 'en';
  const stateKey = ['base', 'agent', 'automation', 'api', 'custom-code', 'gate'].includes(params.get('state')) ? params.get('state') : 'base';
  const html = document.documentElement;
  const canvas = document.querySelector('[data-hero-route-canvas]');
  const status = document.querySelector('[data-hero-route-status]');
  if (!canvas) return;
  html.lang = lang;

  const states = {
    base: { label: 'BASE', active: null, resolved: [], pearl: 'gate', file: 'state-base.bin', sha: '' },
    agent: { label: '1 AGENT', active: 'agent', resolved: [], pearl: 'gate', file: 'state-agent.bin', sha: '' },
    automation: { label: '2 AUTOMATION', active: 'automation', resolved: ['agent'], pearl: 'gate', file: 'state-automation.bin', sha: '' },
    api: { label: '3 API', active: 'api', resolved: ['agent', 'automation'], pearl: 'gate', file: 'state-api.bin', sha: '' },
    'custom-code': { label: '4 CUSTOM CODE', active: 'custom-code', resolved: ['agent', 'automation', 'api'], pearl: 'gate', file: 'state-custom-code.bin', sha: '' },
    gate: { label: '5 GATE', active: null, resolved: ['agent', 'automation', 'api', 'custom-code'], pearl: 'gate', file: 'state-gate.bin', sha: '' },
  };
  const selected = states[stateKey];
  const copy = {
    en: {
      eyebrow: 'AI SYSTEMS · AGENTS · CUSTOM ENGINEERING',
      title: 'AI systems that do the work.<br>You keep the decisions that matter.',
      support: 'We build AI agents, automation, and integrations around real business processes. We connect data, software, and APIs—and write custom code when off-the-shelf tools are not enough. The system handles defined actions and stops where a human decision is required.',
      primary: 'Discuss your challenge', secondary: 'How we build →', capability: 'AI AGENTS · AUTOMATION · APIs · CUSTOM CODE',
      headerCta: 'Discuss Project', home: 'Home', ai: 'AI Systems', web: 'Websites & Branding', cases: 'Case Studies', about: 'About', insights: 'Insights', locale: 'RU', routeTitle: 'AI EXECUTION → DECISION GATE',
      labels: { agent: '01 · AI AGENT', automation: '02 · AUTOMATION', api: '03 · API', 'custom-code': '04 · CUSTOM CODE', gate: '05 · DECISION GATE' },
    },
    ru: {
      eyebrow: 'AI-СИСТЕМЫ · АГЕНТЫ · СОБСТВЕННАЯ РАЗРАБОТКА',
      title: 'AI-системы, которые выполняют работу.<br>Важные решения остаются за вами.',
      support: 'Строим AI-агентов, автоматизацию и интеграции под реальные процессы бизнеса. Подключаем данные, сервисы и API, а когда готовых инструментов недостаточно — пишем собственный код. Система берёт на себя заданные действия и останавливается там, где решение должен принять человек.',
      primary: 'Обсудить задачу', secondary: 'Как мы строим →', capability: 'AI-АГЕНТЫ · АВТОМАТИЗАЦИЯ · API · СОБСТВЕННЫЙ КОД',
      headerCta: 'Обсудить проект', home: 'Главная', ai: 'AI-системы', web: 'Сайты и брендинг', cases: 'Кейсы', about: 'О нас', insights: 'Материалы', locale: 'EN', routeTitle: 'AI-ВЫПОЛНЕНИЕ → ТОЧКА РЕШЕНИЯ',
      labels: { agent: '01 · AI-АГЕНТ', automation: '02 · АВТОМАТИЗАЦИЯ', api: '03 · API', 'custom-code': '04 · СОБСТВЕННЫЙ КОД', gate: '05 · ТОЧКА РЕШЕНИЯ' },
    },
  }[lang];
  const stageKeys = ['agent', 'automation', 'api', 'custom-code', 'gate'];
  const stageStatus = (key) => key === selected.pearl ? (lang === 'ru' ? 'PEARL' : 'PEARL') : key === selected.active ? (lang === 'ru' ? 'INDIGO · ACTIVE' : 'INDIGO · ACTIVE') : selected.resolved.includes(key) ? (lang === 'ru' ? 'SILVER · RESOLVED' : 'SILVER · RESOLVED') : (lang === 'ru' ? 'NEUTRAL' : 'NEUTRAL');
  const setText = (selector, value, htmlValue = false) => { const element = document.querySelector(selector); if (element) htmlValue ? element.innerHTML = value : element.textContent = value; };
  setText('[data-copy="eyebrow"]', copy.eyebrow); setText('[data-copy="title"]', copy.title, true); setText('[data-copy="support"]', copy.support); setText('[data-copy="primary"]', copy.primary); setText('[data-copy="secondary"]', copy.secondary); setText('[data-copy="capability"]', copy.capability);
  setText('[data-header-cta]', copy.headerCta); setText('[data-nav-home]', copy.home); setText('[data-nav-ai]', copy.ai); setText('[data-nav-web]', copy.web); setText('[data-nav-cases]', copy.cases); setText('[data-nav-about]', copy.about); setText('[data-nav-insights]', copy.insights); setText('[data-route-title]', copy.routeTitle);
  const routeTitle = document.querySelector('[data-route-title]'); if (routeTitle) routeTitle.textContent = copy.routeTitle;
  document.querySelector('[data-lang-link]')?.setAttribute('href', `?lang=${lang === 'ru' ? 'en' : 'ru'}&state=${stateKey}`);
  document.querySelector('[data-lang-link]')?.replaceChildren(document.createTextNode(copy.locale));
  document.querySelectorAll('[data-state-link]').forEach((link) => { link.href = `?lang=${lang}&state=${link.dataset.stateLink}`; if (link.dataset.stateLink === stateKey) link.setAttribute('aria-current', 'page'); });
  for (const key of stageKeys) { setText(`[data-route-label="${key}"]`, copy.labels[key]); setText(`[data-route-state="${key}"]`, stageStatus(key)); document.querySelector(`[data-route-row="${key}"]`)?.classList.toggle('is-active', key === selected.active); }
  const stateLabel = selected.label;
  const setStatus = (value) => { html.dataset.routeStatus = value; if (status) status.textContent = `AUTHORITY THRESHOLD ROUTE R1 · ${stateLabel} · ${value.toUpperCase()}`; };
  const payloadUrl = `../docs/site-evolution/ai-systems/boxes-hover-authority-threshold-route-r1/${selected.file}`;
  const demoUiParentUuid = '3acae095-4a11-475a-8b70-59aac6906793';
  const demoUiWhitelist = [
    ['Ellipse', '50605cdf-cc85-46b6-874a-000a1d96b4b3'], ['Rectangle 3', 'bfc84abf-461b-4b5d-9e7d-4c0d2fe108c8'], ['Text 7', '7e0d047a-c03d-4b52-a29d-b7d9775b1630'], ['Rectangle 2', '2e4c9677-c23f-498d-a238-99e7346cd64a'], ['Text 6', 'b27bc674-20c0-4e2e-a608-b92976b171bc'], ['Rectangle', '4c080547-86bf-42e5-a23d-ce33a154bc87'], ['Text 5', 'd0d28aea-11cd-4c6d-b6ff-bf7c8528dd53'], ['Text 4', '85cc886f-d4fa-438a-a91c-4bf043d4555b'], ['Text 3', '8ef5eb04-1102-4e8f-b237-4452fe7c6385'], ['Text 2', '61f54f7d-ce88-46ea-9f45-a01825154460'], ['Text', '6013b0e6-e898-4640-9d62-e088a816f69c'],
  ];
  const shaHex = (bytes) => [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  const start = async () => {
    if ((globalThis.__authorityRouteBootCount || 0) !== 0) throw new Error('Duplicate route scene boot');
    globalThis.__authorityRouteBootCount = 1;
    setStatus('loading');
    const response = await fetch(payloadUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Payload HTTP ${response.status}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    const actualSha = await crypto.subtle.digest('SHA-256', bytes).then(shaHex);
    const app = new Application(canvas, { htmlContentMode: 'inline' });
    await app.start(Array.from(bytes));
    const uiParent = app.findObjectByName('UI');
    if (!uiParent || uiParent.type !== 'Empty' || uiParent.uuid !== demoUiParentUuid) throw new Error('Demo UI parent identity mismatch');
    for (const [name, uuid] of demoUiWhitelist) { const object = app.findObjectByName(name); if (!object || object.type !== 'Mesh' || object.uuid !== uuid || object.parentUuid !== demoUiParentUuid) throw new Error(`Demo UI identity mismatch: ${name}`); object.visible = false; }
    const boxes = app.findObjectByName('Boxes');
    if (!boxes || boxes.uuid !== '006474fe-4e5b-4835-b106-89b2ec79dd71') throw new Error('Boxes identity mismatch');
    const objects = app.getAllObjects?.() || [];
    const cubes = objects.filter((object) => object.name === 'Cube' && object.type === 'Mesh' && object.parentUuid !== boxes.uuid);
    const materials = new Set(cubes.map((object) => object.material?.uuid || object.material?.id || object.material).filter(Boolean));
    const instances = objects.filter((object) => object.type === 'Instance');
    if (cubes.length !== 143 || materials.size !== 143) throw new Error(`Runtime topology mismatch: cubes=${cubes.length}, materials=${materials.size}`);
    const runtimeTargets = Object.fromEntries(stageKeys.map((key) => {
      const id = ({ agent: '46154286-13e1-464a-a27c-84bd720a9cce', automation: '889ba072-8c04-4fa0-80f7-5c32e26dd963', api: '9d07611a-c5ce-4020-abf0-dd0f4ca95d89', 'custom-code': '1687f9e7-cac3-4b61-b5f6-a6dd86082fff', gate: 'b3dc4e58-17e8-4fe9-a3f9-d22065e088fa' })[key];
      const cube = cubes.find((object) => object.parentUuid === id);
      const pattern = cube?.material?.layers?.find((layer) => layer.type === 'pattern');
      return [key, { id, parentFound: Boolean(cube), colorA: pattern?.colorA || null, colorB: pattern?.colorB || null }];
    }));
    html.dataset.routePayload = actualSha; html.dataset.routeState = stateKey; html.dataset.routeLanguage = lang; html.dataset.routeWebgpu = String(Boolean(isSecureContext && navigator.gpu && await navigator.gpu.requestAdapter?.({ powerPreference: 'high-performance' }))); html.dataset.routeCubes = String(cubes.length); html.dataset.routeMaterials = String(materials.size); html.dataset.routeInstances = String(instances.length); html.dataset.routeUiHidden = String(demoUiWhitelist.length); html.dataset.routeTargets = JSON.stringify(runtimeTargets); html.dataset.routeStatus = 'ready'; globalThis.__authorityRouteApp = app; globalThis.__authorityRouteObjects = { objects, cubes, instances, boxes, runtimeTargets }; setStatus('ready');
  };
  start().catch((error) => { html.dataset.routeStatus = 'error'; html.dataset.routeError = String(error?.stack || error); if (status) status.textContent = `AUTHORITY THRESHOLD ROUTE R1 · ${stateLabel} · ERROR`; console.error('[Authority Threshold route R1]', error); });
})();

