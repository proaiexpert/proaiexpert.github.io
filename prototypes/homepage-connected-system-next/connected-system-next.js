
(() => {
  'use strict';

  const root = document.querySelector('[data-connected-next]');
  if (!root) return;

  const experience = root.querySelector('[data-experience]');
  const stickyStage = root.querySelector('.connected-next__sticky-stage');
  const artifact = root.querySelector('[data-context-artifact]');
  const ledger = root.querySelector('.ledger-zone');
  const stageButtons = [...root.querySelectorAll('[data-stage-button]')];
  const languageButtons = [...root.querySelectorAll('[data-lang]')];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lowLandscape = window.matchMedia('(max-height: 520px) and (min-width: 701px)');
  const portrait = window.matchMedia('(max-width: 700px)');
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)');

  const copy = {
    en: {
      eyebrow: 'THE CONNECTED SYSTEM',
      title: 'What the system connects.',
      support: 'Each stage carries context forward — from the first customer impression to the next business action.',
      origin: 'ORIGIN',
      coherentImpression: 'COHERENT IMPRESSION',
      firstImpression: 'FIRST IMPRESSION',
      customerContext: 'CUSTOMER CONTEXT',
      assistiveStructure: 'ASSISTIVE STRUCTURE',
      humanAuthority: 'HUMAN AUTHORITY',
      resolution: 'RESOLUTION',
      nextAction: 'NEXT ACTION',
      artifactCaptionA: 'CONTEXT ACCRETION',
      artifactCaptionB: 'EACH STATE RETAINS ITS SOURCE',
      ledgerLabel: 'ONE CAUSAL RECORD',
      ledgerHint: 'CONTEXT ACCUMULATES',
      ledgerFoot: 'Nothing is replaced. Each new state is built from the context that came before it.',
      trust: 'TRUST', inquiry: 'INQUIRY', response: 'RESPONSE', result: 'RESULT',
      imprint: 'IMPRINT', attach: 'ATTACH', enrich: 'ENRICH', resolve: 'RESOLVE',
      trustPrimary: 'A credible first impression gives the customer confidence to act.',
      trustSecondary: 'Website, brand, offer clarity and proof align into one coherent business signal.',
      trustComponents: 'Website · Brand · Offer clarity · Proof',
      inquiryPrimary: 'Interest becomes a structured request.',
      inquirySecondary: 'New customer context attaches to the business context that already created trust.',
      inquiryComponents: 'Forms · Calls · Messaging · CRM intake',
      responsePrimary: 'The request becomes organized and easier to act on.',
      responseSecondary: 'AI, automation and routing structure the accumulated context while human authority remains.',
      responseComponents: 'AI · Automation · Routing · Follow-up',
      resultPrimary: 'Accumulated context points to a clearer next business action.',
      resultSecondary: 'The origin, customer request and assistive structure remain traceable inside the resolved state.',
      resultComponents: 'Booking · Proposal · Next action · Measurement',
      originWebsite: 'WEBSITE', originBrand: 'BRAND', originOffer: 'OFFER', originProof: 'PROOF',
      inquiryForm: 'FORM', inquiryCall: 'CALL', inquiryMessage: 'MESSAGE',
      responseAutomation: 'AUTOMATION', responseRouting: 'ROUTING', responseFollowup: 'FOLLOW-UP',
      booking: 'BOOKING', proposal: 'PROPOSAL', nextStep: 'NEXT STEP', measurement: 'MEASUREMENT',
      footerLine: 'From first impression to next business action — one connected, traceable system.'
    },
    ru: {
      eyebrow: 'ЕДИНАЯ СИСТЕМА',
      title: 'Что объединяет система.',
      support: 'Каждый этап передаёт контекст дальше — от первого впечатления клиента до следующего действия бизнеса.',
      origin: 'ОСНОВА', coherentImpression: 'ЦЕЛЬНОЕ ВПЕЧАТЛЕНИЕ', firstImpression: 'ПЕРВОЕ ВПЕЧАТЛЕНИЕ',
      customerContext: 'КОНТЕКСТ КЛИЕНТА', assistiveStructure: 'СТРУКТУРА ПОДДЕРЖКИ',
      humanAuthority: 'КОНТРОЛЬ ЧЕЛОВЕКА', resolution: 'РАЗРЕШЕНИЕ', nextAction: 'СЛЕДУЮЩЕЕ ДЕЙСТВИЕ',
      artifactCaptionA: 'НАКОПЛЕНИЕ КОНТЕКСТА', artifactCaptionB: 'КАЖДЫЙ ЭТАП СОХРАНЯЕТ ИСТОЧНИК',
      ledgerLabel: 'ОДНА ПРИЧИННАЯ ЗАПИСЬ', ledgerHint: 'КОНТЕКСТ НАКАПЛИВАЕТСЯ',
      ledgerFoot: 'Ничего не заменяется: каждое новое состояние строится на контексте предыдущего.',
      trust: 'ДОВЕРИЕ', inquiry: 'ОБРАЩЕНИЕ', response: 'ОТВЕТ', result: 'РЕЗУЛЬТАТ',
      imprint: 'ОТПЕЧАТОК', attach: 'ДОБАВЛЕНИЕ', enrich: 'ОБОГАЩЕНИЕ', resolve: 'НАПРАВЛЕНИЕ',
      trustPrimary: 'Убедительное первое впечатление помогает клиенту решиться на следующий шаг.',
      trustSecondary: 'Сайт, бренд, ясное предложение и подтверждения складываются в один цельный сигнал бизнеса.',
      trustComponents: 'Сайт · Бренд · Ясность предложения · Подтверждения',
      inquiryPrimary: 'Интерес превращается в структурированное обращение.',
      inquirySecondary: 'Новый контекст клиента присоединяется к тому, что уже сформировало доверие.',
      inquiryComponents: 'Формы · Звонки · Сообщения · CRM',
      responsePrimary: 'Обращение становится организованным и готовым к следующему действию.',
      responseSecondary: 'AI, автоматизация и маршрутизация структурируют накопленный контекст, сохраняя контроль за человеком.',
      responseComponents: 'AI · Автоматизация · Маршрутизация · Повторный контакт',
      resultPrimary: 'Накопленный контекст ведёт к более ясному следующему действию бизнеса.',
      resultSecondary: 'Основа, обращение клиента и структура поддержки остаются прослеживаемыми в итоговом состоянии.',
      resultComponents: 'Запись · Предложение · Следующий шаг · Измерение',
      originWebsite: 'САЙТ', originBrand: 'БРЕНД', originOffer: 'ПРЕДЛОЖЕНИЕ', originProof: 'ПОДТВЕРЖДЕНИЯ',
      inquiryForm: 'ФОРМА', inquiryCall: 'ЗВОНОК', inquiryMessage: 'СООБЩЕНИЕ',
      responseAutomation: 'АВТОМАТИЗАЦИЯ', responseRouting: 'МАРШРУТИЗАЦИЯ', responseFollowup: 'ПРОДОЛЖЕНИЕ',
      booking: 'ЗАПИСЬ', proposal: 'ПРЕДЛОЖЕНИЕ', nextStep: 'СЛЕДУЮЩИЙ ШАГ', measurement: 'ИЗМЕРЕНИЕ',
      footerLine: 'От первого впечатления до следующего действия бизнеса — одна связанная и прослеживаемая система.'
    }
  };

  let currentState = 4;
  let currentLanguage = new URLSearchParams(window.location.search).get('lang') === 'ru' ? 'ru' : 'en';
  let manualUntil = 0;
  let frameRequested = false;
  let modeFrame = 0;
  let knownLowLandscape = lowLandscape.matches;
  let knownPortrait = portrait.matches;
  let modeTransitionUntil = 0;

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

    if (source === 'manual') manualUntil = performance.now() + 1600;
  };

  const stateFromProgress = (progress) => {
    if (progress < .23) return 1;
    if (progress < .48) return 2;
    if (progress < .73) return 3;
    return 4;
  };

  const desktopProgress = () => {
    const rect = experience.getBoundingClientRect();
    const viewport = window.innerHeight;
    const startLine = viewport * .30;
    const travel = Math.max(360, rect.height - viewport * .42);
    return clamp((startLine - rect.top) / travel, 0, 1);
  };

  const portraitProgress = () => {
    const rect = ledger.getBoundingClientRect();
    const viewport = window.innerHeight;
    const startLine = viewport * .7;
    const travel = Math.max(430, rect.height + viewport * .16);
    return clamp((startLine - rect.top) / travel, 0, 1);
  };

  const lowLandscapeProgress = () => {
    const rect = experience.getBoundingClientRect();
    const stageHeight = stickyStage?.getBoundingClientRect().height || window.innerHeight * .72;
    const travel = Math.max(window.innerHeight * .72, rect.height - stageHeight);
    return clamp((-rect.top) / travel, 0, 1);
  };

  const updateFromScroll = () => {
    frameRequested = false;
    if (reducedMotion.matches || performance.now() < manualUntil) return;

    const progress = lowLandscape.matches
      ? lowLandscapeProgress()
      : portrait.matches
        ? portraitProgress()
        : desktopProgress();

    setState(stateFromProgress(progress));
  };

  const onScroll = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateFromScroll);
  };

  const stateProgress = (state) => ({ 1: .08, 2: .35, 3: .60, 4: .86 })[state] || .08;

  const alignModeToState = (state) => {
    const progress = stateProgress(state);

    if (lowLandscape.matches) {
      const rect = experience.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;
      const stageHeight = stickyStage?.getBoundingClientRect().height || window.innerHeight * .72;
      const travel = Math.max(window.innerHeight * .72, rect.height - stageHeight);
      window.scrollTo({ top: Math.max(0, absoluteTop + travel * progress), behavior: 'auto' });
      setState(state);
      return;
    }

    if (portrait.matches) {
      const rect = ledger.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;
      const startLine = window.innerHeight * .7;
      const travel = Math.max(430, rect.height + window.innerHeight * .16);
      window.scrollTo({ top: Math.max(0, absoluteTop - startLine + travel * progress), behavior: 'auto' });
      setState(state);
      return;
    }

    setState(state);
  };

  const configureMode = () => {
    const nextLowLandscape = lowLandscape.matches;
    const nextPortrait = portrait.matches;
    const modeChanged = nextLowLandscape !== knownLowLandscape || nextPortrait !== knownPortrait;
    const preservedState = currentState;

    knownLowLandscape = nextLowLandscape;
    knownPortrait = nextPortrait;

    if (!modeChanged && performance.now() < modeTransitionUntil) return;

    window.cancelAnimationFrame(modeFrame);

    if (modeChanged) {
      modeTransitionUntil = performance.now() + 280;
      // Ignore resize/orientation scroll noise long enough for the new geometry to settle.
      // Preserve a longer manual inspection window if one is already active.
      manualUntil = Math.max(manualUntil, performance.now() + 760);
      modeFrame = window.requestAnimationFrame(() => {
        modeFrame = window.requestAnimationFrame(() => {
          if (reducedMotion.matches) {
            setState(4);
            return;
          }
          alignModeToState(preservedState);
        });
      });
      return;
    }

    modeFrame = window.requestAnimationFrame(() => {
      manualUntil = 0;
      if (reducedMotion.matches) {
        setState(4);
        return;
      }
      updateFromScroll();
    });
  };

  stageButtons.forEach((button) => {
    const inspect = () => setState(Number(button.dataset.stageButton), 'manual');
    button.addEventListener('click', inspect);
    button.addEventListener('focus', inspect);
    if (finePointer.matches) button.addEventListener('pointerenter', inspect);
  });

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('orientationchange', configureMode, { passive: true });
  reducedMotion.addEventListener?.('change', configureMode);
  lowLandscape.addEventListener?.('change', configureMode);
  portrait.addEventListener?.('change', configureMode);

  setLanguage(currentLanguage);
  if (reducedMotion.matches) setState(4);
  else {
    setState(1);
    window.requestAnimationFrame(updateFromScroll);
  }
})();

