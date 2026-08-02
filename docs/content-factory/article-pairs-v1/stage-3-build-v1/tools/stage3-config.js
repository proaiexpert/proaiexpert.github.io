const BUILD_DATE = '2026-08-01';
const MAIN_SHA = 'f2aa1770b2c2ff5ac3918f18e5cdc1e69e2c3c2c';
const STARTING_SHA = '35532b5a1d09cd316078387bcaf5c6cf8d82d38a';
const PREVIOUS_REVIEWED_SHA = '28c87e0fb5018d5801c1a5a1550a507f216fce2a';

const ROUTES = [
  {
    id: 'A1-RU', lang: 'ru',
    route: '/ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/',
    file: 'ru/insights/sayt-dlya-russkoyazychnogo-biznesa-v-ssha/index.html',
    sourceFile: 'docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-01-ru-final-candidate-v7.md',
    sourceBlobSha: '57cb79bd2d8fd8ba614e7370defad8546fda116e',
    h1: 'Сайт для русскоязычного бизнеса в США: только английский, отдельный русский раздел или две версии?',
    title: 'Сайт для русскоязычного бизнеса в США: какой вариант выбрать',
    description: 'Как выбрать между сайтом на английском, отдельной русской поддержкой и полноценной RU/EN-системой для бизнеса в США — без лишнего объёма.',
    pairId: 'A1-EN', wpm: 180,
    ogImage: 'article-01-ru-language-coverage.png',
    ctaLabel: 'Обсудить языковую модель сайта',
    headerCta: 'Обсудить проект', category: 'Стратегия сайта',
    hubText: '← Назад к инсайтам', visibleDate: '1 августа 2026 г.',
    activeNavLabel: 'Материалы', activeNavHref: '/ru/insights/',
    contactHref: '/ru/contact/#project-intake'
  },
  {
    id: 'A1-EN', lang: 'en',
    route: '/insights/does-your-service-business-need-a-multilingual-website/',
    file: 'insights/does-your-service-business-need-a-multilingual-website/index.html',
    sourceFile: 'docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-01-en-final-candidate-v5.md',
    sourceBlobSha: '2dac3dcb70385808afd76843dc60c529d85a78e5',
    h1: 'Does Your U.S. Service Business Need a Multilingual Website?',
    title: 'Does Your Service Business Need a Multilingual Website?',
    description: 'Choose between English-only, focused language support, and full multilingual coverage based on real demand, service capacity, and maintenance.',
    pairId: 'A1-RU', wpm: 220,
    ogImage: 'article-01-en-language-coverage.png',
    ctaLabel: 'Review Your Language Coverage Plan',
    headerCta: 'Discuss Project', category: 'Website Strategy',
    hubText: '← Back to insights', visibleDate: 'August 1, 2026',
    activeNavLabel: 'Insights', activeNavHref: '/insights/',
    contactHref: '/contact/#project-intake'
  },
  {
    id: 'A2-RU', lang: 'ru',
    route: '/ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/',
    file: 'ru/insights/kak-proverit-predlozhenie-na-sayt-v-ssha/index.html',
    sourceFile: 'docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-02-ru-final-candidate-v6.md',
    sourceBlobSha: '17cbfee69421e6e11101a0ef3770ec8dabf8e5e0',
    h1: 'Как проверить подрядчика и предложение на сайт в США — и снизить риск переделки',
    title: 'Как проверить подрядчика и предложение на разработку сайта',
    description: 'Как сравнить предложения на сайт: объём работ, ответственность, доступы, лицензии, приёмка, запуск и поддержка — до подписания договора.',
    pairId: 'A2-EN', wpm: 180,
    ogImage: 'article-02-ru-proposal-review.png',
    ctaLabel: 'Разобрать предложение на сайт',
    headerCta: 'Обсудить проект', category: 'Стратегия сайта',
    hubText: '← Назад к инсайтам', visibleDate: '1 августа 2026 г.',
    activeNavLabel: 'Материалы', activeNavHref: '/ru/insights/',
    contactHref: '/ru/contact/#project-intake'
  },
  {
    id: 'A2-EN', lang: 'en',
    route: '/insights/how-to-evaluate-a-website-proposal/',
    file: 'insights/how-to-evaluate-a-website-proposal/index.html',
    sourceFile: 'docs/content-factory/article-pairs-v1/gemini-workspace/final-editorial-synthesis-v1/article-02-en-final-candidate-v6.md',
    sourceBlobSha: 'f02b55ff8552e6eb067d09663a35afa29b130b55',
    h1: 'How to Evaluate a Website Proposal Before You Sign',
    title: 'How to Evaluate a Website Proposal Before You Sign',
    description: 'Compare website proposals by scope, responsibilities, ownership, acceptance, and support—not page count or price alone.',
    pairId: 'A2-RU', wpm: 220,
    ogImage: 'article-02-en-proposal-review.png',
    ctaLabel: 'Review My Website Proposal',
    headerCta: 'Discuss Project', category: 'Website Strategy',
    hubText: '← Back to insights', visibleDate: 'August 1, 2026',
    activeNavLabel: 'Insights', activeNavHref: '/insights/',
    contactHref: '/contact/#project-intake'
  }
];

const MODULES = {
  'A1-RU': [
    [['broken-language-journey'], 'Гипотетический сценарий: разорванный языковой путь'],
    [['three-model'], 'Три модели сайта'],
    [['decision-matrix', 'demand-evidence-tool'], 'Матрица выбора языковой модели'],
    [['five-decision-questions'], 'Пять вопросов перед созданием русской версии'],
    [['continuity-flow', 'continuity-check'], 'Сначала локализуйте путь клиента, потом архив'],
    [['translation-vs-localization'], 'Перевод не равен локализации'],
    [['governance-system'], 'После запуска нужна система управления контентом'],
    [['financial-stream-evidence'], 'Пример полноценной RU/EN-системы: Financial Stream'],
    [['performance-boundary'], 'Что такая система может дать — и чего она не гарантирует'],
    [['decision-sequence'], 'Как принять итоговое решение']
  ],
  'A1-EN': [
    [['broken-language-journey'], 'Hypothetical scenario: the broken language journey'],
    [['three-model'], 'The Language Coverage Ladder'],
    [['demand-evidence-tool'], 'How to verify that demand is real'],
    [['five-decision-questions'], 'Five questions before expanding coverage'],
    [['continuity-flow', 'continuity-check'], 'Translate the customer journey before the content archive'],
    [['translation-vs-localization'], 'Translation and localization solve different problems'],
    [['governance-system'], 'Plan for maintenance and English-only boundaries'],
    [['performance-boundary'], 'What language coverage can and cannot do'],
    [['decision-sequence'], 'A practical decision sequence']
  ],
  'A2-RU': [
    [['same-page-count-scenario'], 'Гипотетический сценарий: одинаковое количество страниц — разные проекты'],
    [['document-reconciliation'], 'Proposal, SOW и договор должны описывать один проект'],
    [['seven-area-map'], 'Семь областей предложения, которые нужно проверить'],
    [['proposal-risk-ledger', 'ledger-definitions'], 'Реестр рисков предложения'],
    [['scope-matrix'], '2. Что входит в проект — и чего в нём нет'],
    [['responsibility-matrix'], '3. Кто предоставляет контент и принимает решения'],
    [['business-control-map'], 'Карта прав и практического контроля'],
    [['technology-diagnostic', 'integration-specification'], '5. Почему выбрана именно эта технология'],
    [['definition-of-done'], '6. Когда проект считается завершённым'],
    [['change-taxonomy'], '7. Правки, изменение объёма, ошибки и поддержка — разные вещи'],
    [['evidence-taxonomy'], '8. Как проверять портфолио и доказательства'],
    [['contextual-warning-signals'], '9. Какие формулировки требуют уточнения'],
    [['abc-comparison'], '10. Как сравнить несколько предложений'],
    [['explicit-risk-summary'], 'Итоговая оценка риска'],
    [['red-risk-decision-gate'], 'Контрольная точка для красного пункта'],
    [['repeat-cost-explanation'], 'Где возникает риск повторных расходов'],
    [['ten-step-decision-sequence'], 'Последовательность решения']
  ],
  'A2-EN': [
    [['same-page-count-scenario'], 'Hypothetical scenario: the same page count, two different projects'],
    [['document-reconciliation'], 'Reconcile what was sold with what will be signed'],
    [['seven-area-map'], 'Seven areas every proposal should make visible'],
    [['proposal-risk-ledger', 'ledger-definitions'], 'Build a Proposal Risk Ledger'],
    [['scope-matrix'], 'Define the actual scope'],
    [['responsibility-matrix'], 'Assign responsibility before the project stalls'],
    [['business-control-map'], 'Business Control Map'],
    [['technology-diagnostic', 'integration-specification'], 'Make technology and dependencies visible'],
    [['definition-of-done'], 'Define “done” before launch'],
    [['change-taxonomy'], 'Separate revisions, change requests, defects, and maintenance'],
    [['evidence-taxonomy'], 'Review evidence, not just portfolio aesthetics'],
    [['contextual-warning-signals'], 'Use warning signals without rigid rules'],
    [['abc-comparison'], 'Compare normalized proposals'],
    [['explicit-risk-summary'], 'Assign a risk label only after reviewing the Ledger'],
    [['red-risk-decision-gate'], 'Decision gate for a red item'],
    [['repeat-cost-explanation'], 'Where repeat costs come from'],
    [['ten-step-decision-sequence'], 'A practical decision sequence']
  ]
};

const VIEWPORTS = [
  [1600, 900], [1440, 900], [1366, 768], [1280, 800], [1180, 800],
  [1100, 800], [1024, 800], [820, 1180], [768, 1024], [430, 932],
  [390, 844], [375, 812], [360, 800]
];

function routeById(id) { return ROUTES.find(route => route.id === id); }

module.exports = {
  BUILD_DATE, MAIN_SHA, STARTING_SHA, PREVIOUS_REVIEWED_SHA,
  ROUTES, MODULES, VIEWPORTS, routeById
};
