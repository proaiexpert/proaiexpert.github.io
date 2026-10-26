# ProAI Expert — Site Shell Standard R2

Статус: обязательный стандарт для всех текущих и будущих публичных страниц.

## 1. Канонический Header

Единственная архитектура Header:

- разметка: `_includes/header-system/header.html`;
- стили: `assets/css/header-system-v1.css`;
- поведение: `assets/js/header-system-v1.js`;
- логотип: `assets/css/header-footer-logo-r1.css` и `assets/js/header-footer-logo-r1.js`.

Страница передаёт `lang`, `current_page`, `locale_url` и `variant`. Локальная копия Header, второй hamburger, второй mobile nav и локальная замена logo/wordmark запрещены.

## 2. Канонический Golden Footer

Визуальная authority — одобренный Homepage Golden Footer R3 + Signature R4:

- `assets/css/home-footer-golden-r3.css`;
- `assets/css/home-footer-golden-r3-1.css`;
- `assets/css/home-footer-golden-r3-2-polish.css`;
- `assets/css/home-footer-golden-r3-3-micro-polish.css`;
- `assets/css/home-footer-signature-r4.css`;
- `assets/js/home-footer-golden-r3.js`;
- `assets/js/home-footer-signature-r4.js`.

Inner-страницы подключают Footer только через `_includes/footer-system/footer.html`. Он передаёт данные в единый компонент `_includes/footer-system/golden.html`. Старые визуальные семейства `.site-footer` не являются активной authority.

## 3. Page-specific Footer content

Контент Footer остаётся внутри Footer и остаётся специфичным для страницы/семейства:

- eyebrow/label;
- closing title;
- supporting copy;
- CTA label и CTA URL;
- contextual/navigation links;
- EN/RU locale target;
- контактные, социальные и copyright данные.

Базовый источник текущих текстов — `_data/footer.yml`; социальные данные — `_data/social-links.yml`. Для нового варианта сначала добавляется локализованный data-вход, затем страница передаёт соответствующие `family` и `variant`. Допустимы явные параметры `eyebrow`, `title`, `summary`, `action_label`, `action_href`, когда контент действительно уникален.

Запрещено переносить closing copy в отдельную секцию над Footer или заменять page-specific copy текстом Homepage.

## 4. Контракт новой страницы

```liquid
{% include header-system/header.html
  lang="en"
  current_page="about"
  locale_url="/ru/about/"
  variant="standard"
%}

<main id="main-content">
  <!-- Страница владеет только своим основным контентом. -->
</main>

{% include footer-system/footer.html
  lang="en"
  family="commercial"
  variant="about"
  locale_href="/ru/about/"
%}
<script src="/assets/js/header-system-v1.js?v=20260804.1" defer></script>
<script src="/assets/js/header-footer-logo-r1.js?v=20260814.1" defer></script>
```

Для RU используются локализованные `current_page`, `variant` и reciprocal `locale_url`/`locale_href`. EN и RU реализуются одной shell-архитектурой, но не механически копируют тексты друг друга.

## 5. Жёсткая граница владения

Каноническая модель:

- Header-компонент владеет только Header;
- page/body CSS владеет только содержимым внутри `<main>`;
- Golden Footer-компонент владеет только Footer.

Page/body CSS не имеет права воздействовать на Header или Footer через глобальные element selectors. Правила, предназначенные для контента, всегда получают page-root или `main`-scope:

```css
/* запрещено */
section { display: flex; }
nav { gap: 20px; }

/* обязательно */
main section { display: flex; }
main nav { gap: 20px; }
```

Unscoped `header { ... }` и `footer { ... }` в новой публичной странице запрещены полностью. Legacy-вариант допустим только как явно неактивная ветка `body:not(.proai-inner-golden-r1) ...` до отдельного удаления старого кода.

## 6. Запрещённое локальное владение

Page/body CSS и JS не должны владеть:

- `.site-header`, `.site-header__*`;
- `.home-footer-golden-r3`, `.home-footer-golden-r3__*`;
- состояниями canonical mobile menu;
- `header-hidden`, `is-scrolled` или `menu-open` для canonical Header;
- Golden Footer signature/material runtime.

Запрещены также:

- unscoped `section { ... }`, `nav { ... }`, `header { ... }`, `footer { ... }` в page CSS;
- route-specific shell styling;
- копирование Header/Footer markup в страницу;
- параллельное подключение `footer-system-v1.css`;
- каскад из emergency-override и `!important` поверх канонического shell.

Старые shell-правила могут временно оставаться только как доказуемо неактивный source debt и не копируются в новые страницы.

## 7. Responsive и accessibility contract

Обязательны:

- desktop 1440/1280/1024;
- mobile 430/390/375/360/320;
- short landscape около 844×390;
- keyboard navigation, Escape и возврат фокуса в mobile menu;
- body scroll lock при открытом menu;
- корректный active state и reciprocal locale mapping;
- отсутствие horizontal overflow/clipping;
- Footer является фактическим концом страницы.

## 8. Проверка

После Jekyll build выполнить:

```text
python scripts/validate-site-shell-r1.py --site-root <rendered-site-directory>
```

Проверка валидирует 42 текущих inner route, один canonical Header, один canonical Golden Footer, отсутствие активной `.site-footer` и legacy Footer stylesheet, обязательные Golden assets, locale mapping и отсутствие неотрендеренного Liquid. Она анализирует собранный HTML и реально подключённые CSS-файлы и блокирует shell-leaking selectors для `header`, `footer`, `section` и `nav`, если page CSS не изолирован под `<main>` или явно неактивен для `proai-inner-golden-r1`.

При добавлении публичного route его необходимо добавить в `EXPECTED_INNER_ROUTES` валидатора одновременно с EN/RU counterpart.
