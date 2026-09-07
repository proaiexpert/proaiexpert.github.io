(() => {
  'use strict';

  const root = document.querySelector('[data-connected-next]');
  if (!root) return;

  const experience = root.querySelector('[data-experience]');
  const artifact = root.querySelector('[data-context-artifact]');
  const ledger = root.querySelector('.ledger-zone');
  const stageButtons = [...root.querySelectorAll('[data-stage-button]')];
  const languageButtons = [...root.querySelectorAll('[data-lang]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lowLandscape = window.matchMedia('(max-height: 520px) and (min-width: 701px)');
  const portrait = window.matchMedia('(max-width: 700px)');

  const copy = {
    en: {
      eyebrow: 'THE CONNECTED SYSTEM',
      title: 'What the system connects.',
      support: 'Each stage carries context forward — from the first customer impression to the next business action.',
      origin: 'ORIGIN',
      originTrace: 'SOURCE TRACE',
      customerContext: 'CUSTOMER CONTEXT',
      assistiveStructure: 'ASSISTIVE STRUCTURE',
      humanAuthority: 'HUMAN AUTHORITY',
      resolution: 'RESOLUTION',
      artifactCaptionA: 'CONTEXT ACCRETION',
      artifactCaptionB: 'PROVENANCE REMAINS TRACEABLE',
      ledgerLabel: 'CAUSAL RECORD',
      ledgerHint: 'ACCUMULATED STATE',
      ledgerFoot: 'Previous context remains registered inside every later state.',
      trust: 'TRUST',
      inquiry: 'INQUIRY',
      response: 'RESPONSE',
      result: 'RESULT',
      nextAction: 'NEXT ACTION',
      imprint: 'IMPRINT',
      attach: 'ATTACH',
      enrich: 'ENRICH',
      resolve: 'RESOLVE',
      trustShort: 'A credible first impression creates the conditions for action.',
      inquiryShort: 'New customer context attaches to the existing origin.',
      responseShort: 'AI and automation organize and route while human authority remains.',
      resultShort: 'Accumulated context resolves toward a defined next business action.',
      originWebsite: 'WEBSITE',
      originBrand: 'BRAND',
      originOffer: 'OFFER',
      originProof: 'PROOF',
      inquiryForm: 'FORM',
      inquiryCall: 'CALL',
      inquiryMessage: 'MESSAGE',
      responseAutomation: 'AUTOMATION',
      responseRouting: 'ROUTING',
      responseFollowup: 'FOLLOW-UP',
      booking: 'BOOKING',
      proposal: 'PROPOSAL',
      nextStep: 'NEXT STEP',
      measurement: 'MEASUREMENT',
      footerLine: 'One continuous causal record. New context accumulates. Previous context remains traceable.'
    },
    ru: {
      eyebrow: 'ЕДИНАЯ СИСТЕМА',
      title: 'Что объединяет система.',
      support: 'Каждый этап передаёт контекст дальше — от первого впечатления клиента до следующего действия бизнеса.',
      origin: 'ОСНОВА',
      originTrace: 'ИСХОДНЫЙ СЛЕД',
      customerContext: 'КОНТЕКСТ КЛИЕНТА',
      assistiveStructure: 'СТРУКТУРА ПОДДЕРЖКИ',
      humanAuthority: 'КОНТРОЛЬ ЧЕЛОВЕКА',
      resolution: 'РАЗРЕШЕНИЕ',
      artifactCaptionA: 'НАКОПЛЕНИЕ КОНТЕКСТА',
      artifactCaptionB: 'ПРОИСХОЖДЕНИЕ ОСТАЁТСЯ ВИДИМЫМ',
      ledgerLabel: 'ПРИЧИННАЯ ЗАПИСЬ',
      ledgerHint: 'НАКОПЛЕННОЕ СОСТОЯНИЕ',
      ledgerFoot: 'Предыдущий контекст остаётся зарегистрирован внутри каждого следующего состояния.',
      trust: 'ДОВЕРИЕ',
      inquiry: 'ОБРАЩЕНИЕ',
      response: 'ОТВЕТ',
      result: 'РЕЗУЛЬТАТ',
      nextAction: 'СЛЕДУЮЩЕЕ ДЕЙСТВИЕ',
      imprint: 'ОТПЕЧАТОК',
      attach: 'ДОБАВЛЕНИЕ',
      enrich: 'ОБОГАЩЕНИЕ',
      resolve: 'НАПРАВЛЕНИЕ',
      trustShort: 'Убедительное первое впечатление создаёт условия для следующего шага.',
      inquiryShort: 'Новый контекст клиента присоединяется к уже существующей основе.',
      responseShort: 'AI и автоматизация организуют и направляют, сохраняя контроль за человеком.',
      resultShort: 'Накопленный контекст направляется к конкретному следующему действию бизнеса.',
      originWebsite: 'САЙТ',
      originBrand: 'БРЕНД',
      originOffer: 'ПРЕДЛОЖЕНИЕ',
      originProof: 'ДОВЕРИЕ',
      inquiryForm: 'ФОРМА',
      inquiryCall: 'ЗВОНОК',
      inquiryMessage: 'СООБЩЕНИЕ',
      responseAutomation: 'АВТОМАТИЗАЦИЯ',
      responseRouting: 'МАРШРУТИЗАЦИЯ',
      responseFollowup: 'ПРОДОЛЖЕНИЕ',
      booking: 'ЗАПИСЬ',
      proposal: 'ПРЕДЛОЖЕНИЕ',
      nextStep: 'СЛЕДУЮЩИЙ ШАГ',
      measurement: 'ИЗМЕРЕНИЕ',
      footerLine: 'Одна причинная запись. Новый контекст накапливается. Предыдущий контекст остаётся прослеживаемым.'
    }
  };

  let currentState = 4;
  let currentLanguage = new URLSearchParams(window.location.search).get('lang') === 'ru' ? 'ru' : 'en';
  let manualUntil = 0;
  let frameRequested = false;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const setLanguage = (language) => {
    if (!copy[language]) return;
    currentLanguage = language;
    document.documentElement.lang = language;
    root.dataset.language = language;

    root.querySelectorAll('[data-copy]').forEach((node) => {
      const value = copy[language][node.dataset.copy];
      if (value) node.textContent = value;
    });

    languageButtons.forEach((button) => {
      const active = button.dataset.lang === language;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };

  const setState = (state, source = 'system') => {
    const next = clamp(Number(state) || 1, 1, 4);
    if (next === currentState && source === 'system') return;

    currentState = next;
    root.dataset.activeStage = String(next);
    artifact.dataset.state = String(next);

    stageButtons.forEach((button) => {
      const index = Number(button.dataset.stageButton);
      const active = index === next;
      button.classList.toggle('is-past', index < next);
      button.classList.toggle('is-active', active);
      button.classList.toggle('is-future', index > next);
      if (active) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });

    if (source === 'manual') manualUntil = performance.now() + 1400;
  };

  const stateFromProgress = (progress) => {
    if (progress < .24) return 1;
    if (progress < .49) return 2;
    if (progress < .74) return 3;
    return 4;
  };

  const desktopProgress = () => {
    const rect = experience.getBoundingClientRect();
    const viewport = window.innerHeight;
    const startLine = viewport * .36;
    const travel = Math.max(320, rect.height - viewport * .45);
    return clamp((startLine - rect.top) / travel, 0, 1);
  };

  const portraitProgress = () => {
    const rect = ledger.getBoundingClientRect();
    const viewport = window.innerHeight;
    const startLine = viewport * .62;
    const travel = Math.max(240, rect.height + viewport * .18);
    return clamp((startLine - rect.top) / travel, 0, 1);
  };

  const updateFromScroll = () => {
    frameRequested = false;
    if (reducedMotion.matches || lowLandscape.matches || performance.now() < manualUntil) return;
    const progress = portrait.matches ? portraitProgress() : desktopProgress();
    setState(stateFromProgress(progress));
  };

  const onScroll = () => {
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(updateFromScroll);
  };

  const configureMode = () => {
    if (reducedMotion.matches || lowLandscape.matches) {
      setState(4);
      return;
    }
    updateFromScroll();
  };

  stageButtons.forEach((button) => {
    const inspect = () => setState(Number(button.dataset.stageButton), 'manual');
    button.addEventListener('click', inspect);
    button.addEventListener('focus', inspect);
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      button.addEventListener('pointerenter', inspect);
    }
  });

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  reducedMotion.addEventListener?.('change', configureMode);
  lowLandscape.addEventListener?.('change', configureMode);
  portrait.addEventListener?.('change', configureMode);

  setLanguage(currentLanguage);
  if (reducedMotion.matches || lowLandscape.matches) {
    setState(4);
  } else {
    setState(1);
    requestAnimationFrame(updateFromScroll);
  }
})();
