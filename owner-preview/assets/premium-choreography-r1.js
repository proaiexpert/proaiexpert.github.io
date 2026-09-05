import { Application } from 'https://cdn.spline.design/@splinetool/runtime@2.0.27/build/runtime.js';

(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const lang = params.get('lang') === 'ru' ? 'ru' : 'en';
  const view = params.get('view') || (matchMedia('(max-width: 820px)').matches ? 'focus' : 'hero');
  const html = document.documentElement;
  const body = document.body;
  const canvas = document.querySelector('[data-choreo-canvas]');
  const caption = document.querySelector('[data-caption]');
  const status = document.querySelector('[data-choreo-status]');
  if (!canvas) return;
  html.lang = lang;
  body.dataset.view = view === 'focus' ? 'focus' : 'hero';

  const copy = {
    en: { eyebrow:'AI SYSTEMS · AGENTS · CUSTOM ENGINEERING', title:'AI systems that do the work.<br>You keep the decisions that matter.', support:'We build AI agents, automation, and integrations around real business processes. We connect data, software, and APIs—and write custom code when off-the-shelf tools are not enough. The system handles defined actions and stops where a human decision is required.', primary:'Discuss your challenge', secondary:'How we build →', capability:'AI AGENTS · AUTOMATION · APIs · CUSTOM CODE', header:'Discuss Project', locale:'RU', stages:{agent:['AI AGENT','Understands the task and coordinates the work.'],automation:['AUTOMATION','Executes defined workflow steps.'],api:['API','Connects data, software and services.'],'custom-code':['CUSTOM CODE','Handles logic off-the-shelf tools cannot.'],gate:['DECISION GATE','Automation stops here. A human decides what happens next.']}},
    ru: { eyebrow:'AI-СИСТЕМЫ · АГЕНТЫ · СОБСТВЕННАЯ РАЗРАБОТКА', title:'AI-системы, которые выполняют работу.<br>Важные решения остаются за вами.', support:'Строим AI-агентов, автоматизацию и интеграции под реальные процессы бизнеса. Подключаем данные, сервисы и API, а когда готовых инструментов недостаточно — пишем собственный код. Система берёт на себя заданные действия и останавливается там, где решение должен принять человек.', primary:'Обсудить задачу', secondary:'Как мы строим →', capability:'AI-АГЕНТЫ · АВТОМАТИЗАЦИЯ · API · СОБСТВЕННЫЙ КОД', header:'Обсудить проект', locale:'EN', stages:{agent:['AI-АГЕНТ','Понимает задачу и координирует работу.'],automation:['АВТОМАТИЗАЦИЯ','Выполняет заданные шаги процесса.'],api:['API','Соединяет данные, программы и сервисы.'],'custom-code':['СОБСТВЕННЫЙ КОД','Решает задачи, где готовых инструментов недостаточно.'],gate:['ТОЧКА РЕШЕНИЯ','Здесь автоматизация останавливается. Дальше решает человек.']}}
  }[lang];
  const set = (selector, value, asHtml = false) => { const element = document.querySelector(selector); if (element) asHtml ? element.innerHTML = value : element.textContent = value; };
  set('[data-copy="eyebrow"]', copy.eyebrow); set('[data-copy="title"]', copy.title, true); set('[data-copy="support"]', copy.support); set('[data-copy="primary"]', copy.primary); set('[data-copy="secondary"]', copy.secondary); set('[data-copy="capability"]', copy.capability); set('[data-header-cta]', copy.header);
  const langLink = document.querySelector('[data-lang-link]'); if (langLink) { langLink.href = `?lang=${lang === 'ru' ? 'en' : 'ru'}&view=${body.dataset.view}`; langLink.textContent = copy.locale; }
  document.querySelector('[data-lang-switch]')?.setAttribute('href', `?lang=${lang === 'ru' ? 'en' : 'ru'}&view=${body.dataset.view}`);
  document.querySelectorAll('[data-view-link]').forEach((link) => { link.href = `?lang=${lang}&view=${link.dataset.viewLink}`; if (link.dataset.viewLink === body.dataset.view) link.setAttribute('aria-current', 'page'); });
  const setStatus = (text) => { if (status) status.textContent = `PREMIUM CHOREOGRAPHY R1 · ${text}`; };
  const setCaption = (stage, text) => { const stageNode = caption?.querySelector('.choreo-caption__stage'); const bodyNode = caption?.querySelector('.choreo-caption__body'); if (stageNode) stageNode.textContent = stage; if (bodyNode) bodyNode.textContent = text; };
  const stages = [
    { key:'agent', id:'46154286-13e1-464a-a27c-84bd720a9cce' },
    { key:'automation', id:'889ba072-8c04-4fa0-80f7-5c32e26dd963' },
    { key:'api', id:'9d07611a-c5ce-4020-abf0-dd0f4ca95d89' },
    { key:'custom-code', id:'1687f9e7-cac3-4b61-b5f6-a6dd86082fff' },
    { key:'gate', id:'b3dc4e58-17e8-4fe9-a3f9-d22065e088fa' },
  ];
  const demoUiParentUuid = '3acae095-4a11-475a-8b70-59aac6906793';
  const demoUiWhitelist = [['Ellipse','50605cdf-cc85-46b6-874a-000a1d96b4b3'],['Rectangle 3','bfc84abf-461b-4b5d-9e7d-4c0d2fe108c8'],['Text 7','7e0d047a-c03d-4b52-a29d-b7d9775b1630'],['Rectangle 2','2e4c9677-c23f-498d-a238-99e7346cd64a'],['Text 6','b27bc674-20c0-4e2e-a608-b92976b171bc'],['Rectangle','4c080547-86bf-42e5-a23d-ce33a154bc87'],['Text 5','d0d28aea-11cd-4c6d-b6ff-bf7c8528dd53'],['Text 4','85cc886f-d4fa-438a-a91c-4bf043d4555b'],['Text 3','8ef5eb04-1102-4e8f-b237-4452fe7c6385'],['Text 2','61f54f7d-ce88-46ea-9f45-a01825154460'],['Text','6013b0e6-e898-4640-9d62-e088a816f69c']];
  const payloadSha = '8c810261638d1c9e7d78c2264342209e28344a1c32b5e8751edf9daf2489b3a5';
  const shaHex = (bytes) => [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2,'0')).join('');
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const transition = (object, from, to, duration) => object.transition({ ...(from ? { from } : {}), to, duration, easing: 4 }).play();
  let app; let targetObjects = {}; let running = false; let finished = false; let focusKey = null;
  function updateCaption(key, kind) { const text = copy.stages[key]; if (!text) return; const prefix = kind === 'active' ? 'ACTIVE · ' : kind === 'resolved' ? 'RESOLVED · ' : 'HUMAN GATE · '; setCaption(`${prefix}${text[0]}`, text[1]); }
  async function animateStage(key) {
    const object = targetObjects[key];
    if (!object) throw new Error(`Target object unavailable: ${key}`);
    transition(object, undefined, 'Indigo', 440);
    updateCaption(key, 'active');
    await wait(520);
    object.state = 'Indigo';
    transition(object, undefined, 'Silver', 430);
    await wait(520);
    object.state = 'Silver';
  }
  async function playSequence() {
    if (running) return;
    running = true; finished = false; focusKey = null;
    setStatus('AUTOPLAY · REST'); setCaption(lang === 'ru' ? 'СПОКОЙНАЯ СИСТЕМА' : 'CALM SYSTEM', lang === 'ru' ? 'Indigo движется. Silver остаётся. Pearl останавливает систему.' : 'Indigo moves. Silver remains. Pearl stops it.');
    await wait(350);
    for (const stage of stages.slice(0, 4)) { await animateStage(stage.key); await wait(30); }
    updateCaption('gate', 'gate');
    await wait(700);
    running = false; finished = true; html.dataset.choreoStates = JSON.stringify(Object.fromEntries(stages.map((stage) => [stage.key, targetObjects[stage.key]?.state ?? null]))); setStatus('SETTLED · SILVER TRAIL + PEARL GATE');
  }
  function resetToFinal() {
    for (const stage of stages.slice(0, 4)) { const object = targetObjects[stage.key]; if (object) object.state = 'Silver'; }
    focusKey = null; finished = true; updateCaption('gate', 'gate'); setStatus('SETTLED · SILVER TRAIL + PEARL GATE');
  }
  async function replay() {
    if (running) return;
    for (const stage of stages.slice(0, 4)) { const object = targetObjects[stage.key]; if (object) object.state = null; }
    await wait(80); playSequence();
  }
  function focusStage(key) {
    if (!finished || running) return;
    if (focusKey && focusKey !== key && focusKey !== 'gate') transition(targetObjects[focusKey], undefined, 'Silver', 320);
    if (key === 'gate') { focusKey = 'gate'; updateCaption('gate', 'gate'); setStatus('FOCUS · PEARL GATE'); return; }
    const object = targetObjects[key]; if (!object) return;
    transition(object, undefined, 'Indigo', 320); focusKey = key; updateCaption(key, 'active'); setStatus(`FOCUS · ${copy.stages[key][0]}`);
  }
  async function start() {
    if (window.__premiumChoreographyBootCount) throw new Error('Duplicate Application boot');
    window.__premiumChoreographyBootCount = 1; setStatus('LOADING');
    const response = await fetch('../docs/site-evolution/ai-systems/boxes-hover-premium-choreography-r1/premium-choreography-r1.bin', { cache:'no-store' });
    if (!response.ok) throw new Error(`Payload HTTP ${response.status}`);
    const bytes = new Uint8Array(await response.arrayBuffer()); const actualSha = shaHex(await crypto.subtle.digest('SHA-256', bytes));
    if (actualSha !== payloadSha) throw new Error(`Payload SHA mismatch: ${actualSha}`);
    app = new Application(canvas, { htmlContentMode:'inline' }); await app.start(Array.from(bytes));
    const uiParent = app.findObjectByName('UI'); if (!uiParent || uiParent.type !== 'Empty' || uiParent.uuid !== demoUiParentUuid) throw new Error('Demo UI identity mismatch');
    for (const [name, uuid] of demoUiWhitelist) { const object = app.findObjectByName(name); if (!object || object.type !== 'Mesh' || object.uuid !== uuid || object.parentUuid !== demoUiParentUuid) throw new Error(`Demo UI identity mismatch: ${name}`); object.visible = false; }
    const boxes = app.findObjectByName('Boxes'); if (!boxes || boxes.uuid !== '006474fe-4e5b-4835-b106-89b2ec79dd71') throw new Error('Boxes identity mismatch');
    const objects = app.getAllObjects?.() || []; const cubes = objects.filter((object) => object.name === 'Cube' && object.type === 'Mesh' && object.parentUuid !== boxes.uuid); const instances = objects.filter((object) => object.type === 'Instance');
    if (cubes.length !== 143 || instances.length !== 142) throw new Error(`Topology mismatch: cubes=${cubes.length}, instances=${instances.length}`);
    targetObjects = Object.fromEntries(stages.map((stage) => [stage.key, app.findObjectById(stage.id)]));
    if (Object.values(targetObjects).some((object) => !object || typeof object.transition !== 'function')) throw new Error('Native state transition surface unavailable on route targets');
    html.dataset.choreoStatus = 'ready'; html.dataset.choreoWebgpu = String(Boolean(isSecureContext && navigator.gpu && await navigator.gpu.requestAdapter?.({ powerPreference:'high-performance' }))); html.dataset.choreoPayload = actualSha; html.dataset.choreoCubes = String(cubes.length); html.dataset.choreoInstances = String(instances.length); html.dataset.choreoMaterialMutation = 'false'; html.dataset.choreoRoute = JSON.stringify(stages.map((stage) => ({ key:stage.key, id:stage.id, uuid:targetObjects[stage.key].uuid, name:targetObjects[stage.key].name, type:targetObjects[stage.key].type, parentUuid:targetObjects[stage.key].parentUuid })));
    setStatus('READY · WEBGPU'); await playSequence();
  }
  document.querySelector('[data-replay]')?.addEventListener('click', replay);
  document.querySelectorAll('[data-focus-stage]').forEach((button) => button.addEventListener('click', () => focusStage(button.dataset.focusStage)));
  canvas.addEventListener('pointerdown', () => { if (finished && focusKey) resetToFinal(); }, { passive:true });
  start().catch((error) => { html.dataset.choreoStatus = 'error'; html.dataset.choreoError = String(error?.stack || error); setStatus('BLOCKED · SEE REPORT'); console.error('[Premium Choreography R1]', error); });
})();
