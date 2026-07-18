# ALINA_HORB_PSYCHOLOGIST_WEBSITE_PORTFOLIO_CASE_PACK_V2_REVIEW

**Назначение:** единый source-of-truth и профессиональное ТЗ для агента/чата, который будет собирать кейс сайта Алины Горб для портфолио ProAI Expert.  
**Проект:** персональный сайт психолога Алины Горб  
**Production:** `https://alinahorb.com/`  
**Языки:** украинский — основной; русский — полноценная локализация  
**Статус:** production-ready, опубликован, форма проверена, технический и SEO-аудит завершён  
**Дата фиксации:** июль 2026  
**Владелец разработки и дальнейших технических изменений:** ProAI Expert / Ihor Horb


---

## 0. V2 REVIEW STATUS И ОБЯЗАТЕЛЬНЫЙ HANDOFF

**Статус:** полный review-документ. Он сохраняет весь актуальный case pack без сокращений и добавляет точный контекст для владельца и следующего исполнителя.

**Критическое ограничение:** этот файл не является разрешением изменять HTML, CSS, JavaScript, изображения, `main`, production, navigation, sitemap, redirects, создавать PR или публиковать кейс. Любое такое действие требует отдельного подтверждения владельца.

### 0.1. Правильный scope текущего этапа

На текущем этапе требовалось собрать, структурировать и сохранить полный документ для последующего review. Реализация страницы кейса, изменение preview-портфолио и добавление изображений не были поручены.

### 0.2. Что было ошибочно сделано за пределами задания

Исполнитель неправильно истолковал формулировку «собрать сильный презентационный кейс» как разрешение сразу реализовать его в HTML. В результате в рабочей ветке был создан коммит:

- commit: `d84a5f2c2c08da917645002310f6911faade6036`;
- message: `feat: build Alina Horb bilingual portfolio case`;
- branch: `portfolio-rebrand-v1`;
- scope: 14 файлов.

В этот коммит вошли:

1. Новая английская preview-страница: `previews/portfolio-v1/alina-horb/index.html`.
2. Новая русская preview-страница: `previews/portfolio-v1/ru/alina-horb/index.html`.
3. Изменение preview-архива: `previews/portfolio-v1/index.html`.
4. Изменение общих preview-стилей: `previews/portfolio-v1/portfolio.css`.
5. Добавление исходного case pack в ветку: `docs/portfolio-case-packs/alina-horb/ALINA_HORB_PSYCHOLOGIST_WEBSITE_PORTFOLIO_CASE_PACK_RU.md`.
6. Девять WebP-файлов в `assets/img/cases/alina-horb/`:
   - `alina-about-desktop.webp`;
   - `alina-article-desktop.webp`;
   - `alina-article-mobile.webp`;
   - `alina-consultations-desktop.webp`;
   - `alina-home-mobile.webp`;
   - `alina-notes-desktop.webp`;
   - `alina-notes-mobile.webp`;
   - `alina-ru-home-desktop.webp`;
   - `alina-ua-home-desktop.webp`.

### 0.3. Почему это произошло

Причина — ошибка исполнителя в определении границы задания. Документальный запрос был ошибочно воспринят как запрос на непосредственную веб-реализацию. Это объяснение фиксирует причину, но не оправдывает расширение scope и не превращает выполненную реализацию в утверждённую.

### 0.4. Текущее состояние репозитория после rollback

- Коммит `d84a5f2c2c08da917645002310f6911faade6036` отменён в активной ветке `portfolio-rebrand-v1` обычным revert-коммитом `9e7a423e051302e26c20459008c4a46f605d970a`.
- Эксперимент остаётся доступным в Git history, но его HTML, CSS и screenshot-assets не являются утверждённой реализацией и не должны автоматически восстанавливаться.
- Preview-архив и общий `portfolio.css` возвращены к состоянию до `d84a5f2`.
- Последующие commits `b20be6c663d4bba0e7d8b95de18a6a3c547cda28` и `96baefd97aec121c95c29718d6b82434056feb30` сохранены без изменений.
- `main` и production rollback-действиями не изменялись; PR и публикация кейса не создавались.
- Настоящий V2-файл остаётся документацией и обязательным handoff для будущего review.

### 0.5. Обязательное действие следующего исполнителя

Следующий исполнитель должен:

1. Полностью прочитать этот V2-документ и считать rollback-состояние активной ветки актуальным source of truth.
2. Рассматривать diff `d84a5f2c2c08da917645002310f6911faade6036` только как исторический эксперимент, а не как утверждённую основу реализации.
3. Сохранить отдельные EN/RU portfolio routes как часть будущей архитектуры, но реализовывать их только после Financial Stream и общего case foundation.
4. Восстанавливать отдельные screenshot-assets из Git history только выборочно и только после визуальной проверки владельца.
5. Исключить market-value estimate из рекомендуемых публичных claims.
6. Не восстанавливать, не переносить и не публиковать HTML, CSS или assets эксперимента без отдельного прямого решения владельца.

### 0.6. Зафиксированные решения и оставшиеся точки подтверждения

1. Rollback `d84a5f2` завершён; повторное автоматическое применение этого прототипа запрещено.
2. Отдельные EN/RU portfolio routes сохраняются как будущая архитектурная задача после Financial Stream и общего case foundation.
3. Preview-архив и общий CSS должны оставаться в состоянии после revert до отдельного утверждённого задания.
4. Screenshot-assets могут быть выборочно восстановлены только после визуальной проверки и прямого подтверждения владельца.
5. Market-value estimate исключён из рекомендуемых публичных claims и не должен использоваться в публикации кейса.
6. Публичное использование фактических формулировок о 18 маршрутах, четырёх статьях, 72 browser-проверках и отсутствии критических findings требует отдельного финального review.
7. Момент создания PR, публикации или production-интеграции определяется отдельным решением владельца.

### 0.7. Неподтверждённые действия запрещены

- Не изменять `main` и production.
- Не создавать PR.
- Не публиковать preview.
- Не восстанавливать автоматически HTML, CSS или assets из отменённого прототипа.
- Не считать наличие кода или файлов в Git history утверждением дизайна или реализации.
- Не придумывать KPI, отзывы, лиды, конверсию, рост трафика или бизнес-результаты.
- Не использовать market-value estimate как рекомендуемый публичный claim.
- Использовать только подтверждённые финальные production-материалы и прошедшие визуальную проверку assets.

Ниже сохранён полный актуальный case pack без сокращения его разделов.

---


## 1. Главная задача этого файла

На основе информации ниже нужно создать сильную презентацию кейса для портфолио ProAI Expert — не как перечень файлов и технических операций, а как убедительную историю о том, как из персональной практики психолога был создан полноценный двуязычный цифровой продукт:

- с индивидуальной визуальной идентичностью;
- с продуманным клиентским маршрутом;
- с глубокой контентной архитектурой;
- с рабочей системой обращения;
- с техническим SEO;
- с этичной коммуникацией для чувствительной сферы;
- с полноценной адаптацией под мобильные устройства;
- с production-контролем и автоматическими проверками.

Кейс должен показывать не просто «красивый сайт», а компетенцию ProAI Expert в стратегии, дизайне, контенте, UX, технической реализации, SEO, защите форм и запуске сайтов для профессиональных услуг.

---

# 2. Executive summary

Для психолога Алины Горб был разработан персональный двуязычный сайт в направлении **Premium Editorial Sanctuary** — спокойный, содержательный и визуально индивидуальный цифровой продукт, который помогает потенциальному клиенту познакомиться со специалистом, понять формат работы, прочитать экспертные материалы и безопасно отправить первое обращение.

Сайт построен не как стандартный шаблон психолога с фотографией, общими фразами и одной формой. Он представляет собой цельную систему из **18 маршрутов**, объединяющую персональный бренд, подробную страницу консультаций, двуязычный журнал из четырёх экспертных материалов, структурированную форму первичного контакта, этические предупреждения, privacy-disclosure, техническое SEO и адаптивную навигацию.

Каждый из девяти типов страниц имеет украинскую и русскую версию. Языковой переключатель ведёт не на главную, а на точный эквивалент текущей страницы. Все материалы связаны внутренними переходами, CTA и логикой дальнейшего действия.

Проект прошёл отдельные проверки навигации, адаптивности, формы, локализации, SEO, структурированных данных, production-ресурсов и поведения интерфейса. Финальный browser regression охватил **18 маршрутов × 4 контрольных viewport = 72 проверки**. Отдельный аудит проверял опубликованные ресурсы, маршруты, изображения, стили, JavaScript, форму и остаточные технические файлы.

---

# 3. Позиционирование кейса

## Основная формулировка

**A bespoke bilingual psychologist website that transforms a personal practice into a credible, calm and conversion-ready digital experience.**

## Русская формулировка

**Индивидуальный двуязычный сайт психолога, который соединяет персональный бренд, профессиональное доверие, экспертный контент и понятный путь к первой консультации.**

## Категория кейса

- Premium service-business website
- Personal expert brand
- Psychologist / mental health
- Bilingual website
- Editorial web design
- Content architecture
- Lead-generation form
- Technical SEO
- Responsive front-end
- Production launch

## Не позиционировать как

- медицинский портал;
- телемедицинскую платформу;
- клиническую систему;
- сервис экстренной психологической помощи;
- HIPAA-certified platform;
- автоматизированную систему бронирования;
- сайт с доказанным ростом продаж или трафика — таких данных пока нет.

---

# 4. Архитектура сайта

## 4.1. Девять типов страниц

1. Главная
2. Об Алине
3. Консультации
4. Раздел «Нотатки / Заметки»
5. Политика конфиденциальности
6. Статья о первой консультации
7. Статья о сложном разговоре
8. Статья о ситуации, когда привычные способы справляться перестают помогать
9. Статья о стрессе, переезде и потере привычной опоры

Каждый тип страницы существует на украинском и русском языках.

**Итого: 9 типов × 2 языка = 18 production-маршрутов.**

## 4.2. Поисковая архитектура

- 16 содержательных страниц предназначены для индексации.
- 2 privacy-страницы являются служебными и используют `noindex, follow`.
- Sitemap содержит индексируемые canonical URL.
- UA/RU-версии связаны взаимными `hreflang`.
- Основной `x-default` ведёт на украинскую версию.

---

# 5. Сорок сильнейших сторон проекта

## Стратегия и позиционирование

1. **Не шаблон, а индивидуальная концепция.** Визуальное направление было разработано специально под личность, сферу и способ работы психолога.
2. **Premium Editorial Sanctuary.** Сайт сочетает редакционную подачу, спокойствие, пространство и ощущение безопасного профессионального контакта.
3. **Персональный бренд без искусственной корпоративности.** Сайт показывает конкретного специалиста, а не придуманную «клинику» или обезличенную компанию.
4. **Чёткая роль сайта.** Он не обещает мгновенного решения проблемы, а помогает человеку понять специалиста, условия и сделать первый шаг.
5. **Этичная коммуникация.** Нет ложных отзывов, выдуманных достижений, неподтверждённых лицензий и агрессивных обещаний результата.

## Визуальная система

6. **Авторский первый экран.** Центральный арочный портрет, крупная serif-типографика, тонкие линии и редакционная композиция формируют узнаваемый образ.
7. **Сдержанная палитра.** Ivory, stone, sage и terracotta создают ощущение тепла без визуального инфантилизма.
8. **Комбинация serif и sans-serif.** Типографика одновременно передаёт глубину, современность и читаемость.
9. **Продуманная работа с воздухом.** Сайт не перегружает человека, который может находиться в стрессе или эмоциональном истощении.
10. **Индивидуальная графическая система.** Вертикальные индексы, тонкие дуги, нумерация разделов и редакционные детали поддерживают единую идентичность.

## Двуязычность и контент

11. **Полноценная UA/RU-архитектура.** Это не автоматический перевод одного экрана, а две связанные версии всего сайта.
12. **18 отдельных маршрутов.** Каждая основная страница имеет собственный адрес и языковой эквивалент.
13. **Контекстный языковой переключатель.** UA/RU переводит пользователя на ту же страницу и тот же материал, а не сбрасывает на главную.
14. **Локализованные интерфейсные состояния.** Меню, форма, ошибки и сообщение об успешной отправке отображаются на языке текущей страницы.
15. **Редакционно выверенные тексты.** Формулировки избегают клише, излишней патетики, самодиагностики и давления на пользователя.

## Экспертный контент

16. **Отдельный раздел публикаций.** «Нотатки / Заметки» работает как содержательный журнал, а не как случайный блог.
17. **Четыре глубоких материала.** Темы охватывают первую консультацию, сложный разговор, потерю привычных способов справляться и стресс после перемен.
18. **Восемь article routes.** Четыре материала опубликованы отдельно на двух языках.
19. **Система внутренней перелинковки.** Статьи связаны с разделом, другими материалами и страницей консультаций.
20. **Контент формирует доверие до обращения.** Потенциальный клиент может увидеть стиль мышления и профессиональную интонацию психолога.

## Клиентский маршрут

21. **Понятная главная страница.** Пользователь быстро понимает, кто такая Алина, с какими состояниями она работает и как обратиться.
22. **Глубокая страница «Об Алине».** Профессиональная история, подход и образование вынесены в самостоятельный доверительный слой.
23. **Полноценная страница консультаций.** Условия не спрятаны в сообщениях и не оставлены на догадки пользователя.
24. **Прозрачные параметры услуги.** Указаны продолжительность, стоимость, языки, online-first формат и возможность очной встречи по согласованию.
25. **Организационные правила.** Оплата, переносы, конфиденциальность, профессиональные границы и контакт между встречами объяснены заранее.
26. **FAQ снижает тревогу первого шага.** Пользователь получает ответы до личного обращения.
27. **Единый CTA-маршрут.** Кнопки записи на разных страницах приводят к общей форме первого контакта.
28. **Мобильный sticky CTA.** На небольших экранах путь к обращению остаётся доступным без необходимости искать форму заново.

## Форма и обработка обращения

29. **Сокращённая форма первого контакта.** Обязательны только имя, контакт, короткое сообщение и согласие.
30. **Необязательные организационные поля.** Способ ответа, формат, часовой пояс и удобное время не создают лишнего барьера.
31. **Чистое письмо для специалиста.** Пустые и технические поля не засоряют Formspree-уведомление.
32. **Локализованное подтверждение отправки.** После успешного ответа форма заменяется крупным UA/RU-сообщением о получении обращения.
33. **Реальная цепочка отправки проверена.** Заявки доходят на целевой email.
34. **Многоуровневая антибот-защита.** Honeypot, проверка времени, контроль взаимодействия и Cloudflare Turnstile.
35. **Безопасный fallback.** При временной проблеме сервиса предусмотрен переход к email-сценарию, чтобы обращение не потерялось.

## Техническое качество и SEO

36. **Техническое SEO на уровне всей системы.** Canonical, hreflang, title, description, Open Graph, Twitter cards, sitemap и robots.
37. **Структурированные данные.** Использованы WebSite, Person, Service, FAQPage, BreadcrumbList, CollectionPage и ItemList там, где это уместно.
38. **Адаптивная навигация.** Отдельная desktop editorial rail и полноценный mobile/tablet drawer с управлением фокусом и прокруткой.
39. **Строгий responsive QA.** 18 маршрутов проверены на четырёх viewport; отдельные проверки контролировали overflow, browser errors и стабильность интерфейса.
40. **Поддерживаемая production-система.** GitHub Pages, HTTPS, домен, автоматические QA-workflows, валидаторы и защита от повторного появления устаревших файлов.

---

# 6. Пользовательские сценарии

## Сценарий 1. Новый посетитель

1. Попадает на главную.
2. Считывает спокойное позиционирование.
3. Видит портрет и имя реального специалиста.
4. Понимает язык и формат работы.
5. Переходит в «Об Алине» или «Консультации».
6. Читает условия.
7. Отправляет короткое обращение.

## Сценарий 2. Посетитель из Google

1. Попадает непосредственно на статью.
2. Получает содержательный ответ без агрессивной продажи.
3. Переходит к связанным материалам.
4. Узнаёт об Алине.
5. Переходит к консультациям.
6. Отправляет обращение.

## Сценарий 3. Русскоязычный пользователь

1. Открывает русскую версию.
2. Все элементы интерфейса и контент остаются русскими.
3. Языковой переключатель сохраняет текущий контекст.
4. Форма и подтверждение отправки работают по-русски.

## Сценарий 4. Пользователь с телефона

1. Открывает компактную responsive-версию.
2. Пользуется drawer-меню.
3. Видит sticky CTA.
4. Заполняет форму с минимальным количеством обязательных полей.
5. Получает отдельное подтверждение отправки.

---

# 7. Детали дизайн-системы

## Визуальный характер

- спокойный;
- профессиональный;
- деликатный;
- editorial;
- bespoke;
- premium without luxury clichés;
- human-centered;
- psychologically safe;
- understated;
- spacious.

## Основные элементы

- центральный арочный портрет;
- крупные editorial headings;
- вертикальная numbered navigation;
- тонкие декоративные дуги;
- нейтральные фоновые поля;
- мягкий sage-акцент;
- terracotta как дозированный эмоциональный акцент;
- минимальные CTA;
- высокая роль whitespace;
- изображения статей без банальных психологических клише.

## Чего в визуале нет

- стоковых людей, изображающих стресс;
- рук у лица и постановочных «терапевтических» сцен;
- абстрактных кавычек на сером фоне;
- калькуляторов, медицинских иконок и визуала клиники;
- агрессивных gradients;
- шаблонных карточек с fake reviews;
- чрезмерных анимаций.

---

# 8. Контентная система

## Главная

Функция:

- первое впечатление;
- позиционирование;
- основные направления поддержки;
- краткое знакомство;
- подход;
- переход к материалам;
- контакт.

## Об Алине

Функция:

- человеческое и профессиональное доверие;
- образование;
- опыт;
- подход;
- понимание границ работы;
- подтверждение реального специалиста.

## Консультации

Функция:

- снять организационную неопределённость;
- объяснить формат;
- показать стоимость и длительность;
- обозначить правила;
- ответить на вопросы;
- привести к обращению.

## Нотатки / Заметки

Функция:

- экспертность;
- SEO-фундамент;
- узнаваемая интонация;
- путь от чтения к обращению;
- возможность дальнейшего контентного развития.

## Privacy

Функция:

- прозрачность обработки данных;
- disclosure внешних процессоров;
- объяснение роли формы;
- предупреждение о неэкстренном характере сайта.

---

# 9. Форма первого контакта

## Обязательные поля

- имя;
- контакт;
- короткое сообщение;
- согласие на обработку данных.

## Необязательные поля

- как удобнее ответить;
- формат консультации;
- страна или часовой пояс;
- удобное время.

## UX-логика

- минимальный барьер;
- явная маркировка required / optional;
- локализованные сообщения;
- кнопка блокируется во время отправки;
- форма скрывается только после успешного ответа;
- success panel получает focus;
- сообщение автоматически прокручивается в видимую область;
- пустые optional-поля не отправляются;
- технические поля не попадают в письмо.

## Антиспам

- honeypot;
- minimum completion time;
- interaction detection;
- Cloudflare Turnstile;
- Formspree endpoint;
- token payload;
- reset после успешной отправки или ошибки.

## Корректная формулировка для портфолио

**Secure, low-friction first-contact flow with localized confirmation and multi-layer spam protection.**

Не писать «HIPAA-compliant» и не называть форму медицинской системой.

---

# 10. Техническое SEO

## Реализовано

- unique title;
- meta description;
- canonical;
- `hreflang="uk"`;
- `hreflang="ru"`;
- `hreflang="x-default"`;
- Open Graph;
- Twitter card;
- локализованные social preview images;
- robots directives;
- XML sitemap;
- structured data;
- breadcrumbs;
- article relationships;
- internal links;
- semantic headings;
- production indexing rules.

## Индексационная модель

- 16 содержательных маршрутов индексируются;
- 2 privacy routes используют `noindex, follow`;
- Search Console Domain Property подтверждён;
- sitemap отправлен;
- как минимум одна production-страница уже подтверждена в Google index;
- остальные URL проходят первичную индексацию.

Статус индексации быстро меняется и не должен использоваться как постоянный рекламный KPI.

---

# 11. Structured data

В зависимости от страницы используются:

- `WebSite`;
- `Person`;
- `Service`;
- `FAQPage`;
- `BreadcrumbList`;
- `CollectionPage`;
- `ItemList`.

Важно: не заявлять rich results как гарантированный результат. Корректная формулировка — **structured data prepared for search understanding and eligible enhancements**.

---

# 12. Responsive UX и accessibility-oriented детали

## Desktop

- editorial rail;
- numbered navigation;
- brand слева;
- language switch справа;
- свободная центральная зона;
- крупная композиция hero.

## Tablet / mobile

- скрытие desktop rail;
- drawer menu;
- корректное открытие и закрытие;
- Escape / keyboard handling;
- focus management;
- scroll locking;
- sticky booking CTA;
- one-column content flow;
- отсутствие горизонтального overflow.

## Accessibility-oriented implementation

- semantic landmarks;
- skip link;
- ARIA labels;
- `aria-live` для статуса формы;
- focus после отправки;
- keyboard navigation;
- reduced-motion handling;
- readable contrast-oriented palette.

Не заявлять официальную WCAG-сертификацию: отдельный сертификационный аудит не проводился.

---

# 13. Производительность и стабильность

Реализованы:

- WebP для основных изображений;
- responsive desktop/mobile portrait assets;
- image preloading для hero;
- фиксированные размеры изображений;
- работа над CLS;
- controlled font loading;
- минимальный JavaScript без тяжёлого framework;
- статический deployment;
- удаление неиспользуемых CSS/JS/image assets;
- cache-busting для критических ресурсов;
- HTTPS;
- production redirects.

Не указывать выдуманные Lighthouse-баллы.

---

# 14. QA и проверка качества

## Подтверждённые масштабы

- 18 production routes;
- 4 control viewports;
- 72 browser route/viewport checks;
- 57 live assets в одном из финальных forensic-прогонов;
- отдельный audit формы;
- отдельный audit SEO;
- отдельный audit navigation;
- отдельный audit global header/footer;
- отдельный post-refactor forensic audit;
- отдельная production verification после deployment.

## Проверялось

- HTTP availability;
- redirects;
- canonical;
- hreflang;
- robots;
- sitemap;
- broken assets;
- CSS;
- JS;
- image availability;
- overflow;
- console errors;
- responsive layout;
- menu behavior;
- form fields;
- localized success message;
- compact Formspree payload;
- Turnstile runtime;
- stale files;
- unused assets;
- accidental bytecode files;
- privacy disclosures.

## Финальный результат

Корректная формулировка:

**The final audited build completed the defined route, responsive, SEO, form and asset checks without recorded critical findings.**

Не превращать количество внутренних GitHub workflow runs в бессмысленный рекламный счётчик. В кейсе достаточно показать строгую QA-модель и 72 browser checks.

---

# 15. Production stack

- semantic HTML;
- custom CSS;
- vanilla JavaScript;
- GitHub repository;
- GitHub Pages;
- custom domain;
- Cloudflare DNS;
- HTTPS/TLS;
- Formspree;
- Cloudflare Turnstile;
- Google Fonts;
- Google Search Console;
- XML sitemap;
- automated GitHub Actions QA.

## Почему stack является преимуществом

- быстрый статический сайт;
- минимальная поверхность отказа;
- отсутствие тяжёлого CMS;
- низкие инфраструктурные расходы;
- полный контроль над разметкой;
- удобная двуязычная архитектура;
- стабильный deployment;
- предсказуемое SEO;
- возможность дальнейшего расширения.

---

# 16. Уровень проекта относительно рынка США

## Корректная оценка

Этот сайт относится не к базовому template-tier, который обычно продаётся терапевтам по подписке, а к **boutique custom / upper professional tier**.

Типовые специализированные платформы для терапевтов предлагают шаблонный сайт, hosting и базовые функции примерно от **$69–$336 в месяц** у TherapySites и от **$99–$299 в месяц** у Brighter Vision. Это полезные сервисные пакеты, но они не являются прямым эквивалентом индивидуального двуязычного проекта с собственной арт-дирекцией, 18 маршрутами, авторской контентной системой, custom front-end и отдельным QA.

По данным Clutch за июль 2026:

- американские web design companies часто работают по ставке около **$100–$149 в час**;
- агентские web-design проекты имеют широкий диапазон **$2,000–$100,000**;
- большинство reviewed-проектов стоят менее $10,000;
- среднее значение в их выборке существенно выше из-за крупных проектов.

WebFX указывает общий профессиональный диапазон web design в 2026 примерно **$1,000–$30,000+**, в зависимости от масштаба и сложности.

## Portfolio replacement value

Для сайта такого объёма и уровня разумно использовать следующую оценку:

### Консервативная стоимость в США

**$8,000–$15,000**

Сюда входят:

- strategy;
- bespoke design direction;
- bilingual architecture;
- custom responsive development;
- 18 routes;
- content structuring;
- four bilingual articles;
- form integration;
- anti-spam;
- technical SEO;
- structured data;
- launch;
- QA.

### Full-service agency equivalent

**$12,000–$20,000+**

Этот диапазон реалистичен, если отдельно учитывать:

- project management;
- bilingual copywriting/editing;
- brand direction;
- article editing;
- custom image direction;
- production QA;
- launch support;
- multiple revision cycles.

## Рекомендуемая публичная формулировка

**Estimated U.S. custom-build value: approximately $8K–$15K, with a higher full-service agency equivalent depending on content, strategy and revision scope.**

Это оценка рыночной стоимости воспроизводства проекта, а не утверждение о сумме, фактически уплаченной клиентом.

---

# 17. Сравнение с типовым сайтом психолога

| Типичный template-сайт | Alina Horb case |
|---|---|
| Одна главная и несколько стандартных страниц | 18 связанных UA/RU-маршрутов |
| Стандартный hero | Авторская editorial-композиция |
| Общие stock photos | Индивидуальная portrait-led система |
| Один язык | Полноценная двуязычность |
| Переключатель сбрасывает на главную | Context-preserving language mapping |
| Общая страница услуг | Детальная консультационная архитектура |
| Простой блог | Курируемый экспертный content hub |
| Обычная форма | Low-friction localized intake |
| Базовая CAPTCHA | Multi-layer Turnstile protection |
| Общие meta tags | Canonical, hreflang, structured data, OG |
| Проверка «на глаз» | Automated QA + 72 browser checks |
| CMS-template styling | Bespoke static front-end |

---

# 18. Главные бизнес-результаты сайта

Пока нет накопленной аналитики заявок и поискового трафика, поэтому кейс должен говорить о созданной способности сайта, а не придумывать KPI.

## Что сайт уже объективно делает

- формирует профессиональное первое впечатление;
- отличает Алину от шаблонных профилей психологов;
- объясняет услуги до личной переписки;
- снижает тревогу перед первой консультацией;
- обслуживает UA/RU-аудиторию;
- принимает обращения из разных стран;
- создаёт основу для organic search;
- позволяет развивать экспертный контент;
- сокращает лишнюю переписку об условиях;
- даёт владельцу готовый production-актив.

## Не заявлять без данных

- рост конверсии на X%;
- рост трафика;
- количество новых клиентов;
- позиции в Google;
- увеличение выручки;
- сокращение стоимости лида.

---

# 19. Рекомендуемая структура портфолио-кейса

## Блок 1. Hero

**Alina Horb — Bilingual Psychologist Website**

Subtitle:

**A bespoke editorial website designed to turn a personal psychology practice into a calm, credible and conversion-ready digital experience.**

Факты рядом:

- 18 routes
- Ukrainian + Russian
- 4 expert articles
- Custom intake flow
- Technical SEO
- 72 responsive browser checks

## Блок 2. Challenge

Показать проблему:

- чувствительная профессиональная сфера;
- необходимость доверия без fake social proof;
- две языковые аудитории;
- международный online-first формат;
- необходимость объяснить условия и границы;
- риск превратить сайт в шаблон психолога.

## Блок 3. Strategy

- personal expert brand;
- calm editorial experience;
- trust before conversion;
- content as proof of thinking;
- low-friction first contact;
- UA/RU parity.

## Блок 4. Visual direction

- Premium Editorial Sanctuary;
- arch portrait;
- serif hierarchy;
- numbered rail;
- ivory / sage / terracotta;
- restrained interaction.

## Блок 5. Information architecture

Показать 9 page types × 2 languages.

## Блок 6. Consultation journey

- условия;
- прозрачность;
- FAQ;
- CTA;
- compact form;
- localized success.

## Блок 7. Content system

Показать Notes hub и четыре статьи.

## Блок 8. Bilingual UX

Показать одну и ту же страницу UA/RU и контекстный switch.

## Блок 9. Technical layer

- SEO;
- schema;
- sitemap;
- Turnstile;
- GitHub Pages;
- responsive;
- QA.

## Блок 10. Outcome

**A complete production website ready for discovery, trust-building and client inquiries — without relying on templates, fake proof or aggressive marketing.**

---

# 20. Рекомендуемый визуальный набор для кейса

## Обязательные кадры

1. UA homepage desktop hero.
2. RU homepage desktop hero.
3. Mobile homepage portrait orientation.
4. Mobile drawer navigation.
5. About page.
6. Consultations overview.
7. Consultation conditions / FAQ.
8. Compact intake form.
9. Success confirmation in UA.
10. Success confirmation in RU.
11. Notes hub.
12. Один article hero.
13. Фрагмент article body.
14. Language switch / bilingual pairing.
15. Footer and final CTA.

## Желательный формат

- 1 сильный hero mockup;
- 2–3 full-page vertical crops;
- 2 mobile device frames;
- 1 bilingual comparison;
- 1 architecture diagram;
- 1 feature/QA metrics panel.

## Не использовать

- внутренние GitHub screenshots как главную визуальную часть;
- длинные списки workflow run numbers;
- плохо читаемые full-page screenshots в маленьком размере;
- изображения до финального редизайна;
- неутверждённые промежуточные mockups;
- технические логи вместо результата.

---

# 21. Ready-made portfolio copy

## 21.1. One-line version — EN

**A bespoke bilingual psychologist website combining editorial design, expert content, a low-friction consultation journey and production-grade SEO.**

## 21.2. One-line version — RU

**Индивидуальный двуязычный сайт психолога, объединивший editorial-дизайн, экспертный контент, понятный путь к консультации и production-level SEO.**

## 21.3. Short paragraph — EN

**We designed and launched a custom bilingual website for psychologist Alina Horb. The project combines a calm editorial identity, 18 Ukrainian and Russian routes, a detailed consultation journey, four expert articles, a localized intake form, multi-layer spam protection and technical SEO. The result is a distinctive, production-ready personal brand website built to establish trust before the first conversation.**

## 21.4. Short paragraph — RU

**Для психолога Алины Горб был разработан и запущен индивидуальный двуязычный сайт. Проект объединяет спокойную editorial-идентичность, 18 украинских и русских маршрутов, подробный путь к консультации, четыре экспертные статьи, локализованную форму обращения, многоуровневую антиспам-защиту и техническое SEO. Результат — узнаваемый production-сайт персонального бренда, который формирует доверие ещё до первого разговора.**

## 21.5. Medium case intro — EN

**Most therapist websites rely on familiar templates, generic imagery and broad promises. For Alina Horb, the goal was different: create a digital environment that felt calm, credible and personal while giving visitors enough practical information to take the first step with confidence.**

**The final system includes nine page types in Ukrainian and Russian, four editorial articles, transparent consultation terms, context-aware language switching, a simplified first-contact form and a complete technical SEO layer. A custom responsive interface, structured data, Cloudflare Turnstile integration and automated QA turned the visual concept into a stable production product.**

## 21.6. Medium case intro — RU

**Большинство сайтов психологов строятся на знакомых шаблонах, общих изображениях и размытых обещаниях. Для Алины Горб задача была другой: создать спокойную, профессиональную и персональную цифровую среду, которая даёт человеку достаточно информации, чтобы уверенно сделать первый шаг.**

**Финальная система включает девять типов страниц на украинском и русском языках, четыре редакционные статьи, прозрачные условия консультаций, контекстный языковой переключатель, упрощённую форму первого контакта и полный слой технического SEO. Индивидуальный responsive-интерфейс, structured data, интеграция Cloudflare Turnstile и автоматизированный QA превратили визуальную концепцию в стабильный production-продукт.**

---

# 22. Recommended metrics panel

Использовать только подтверждённые показатели:

- **18** production routes
- **2** full languages
- **9** page types
- **4** expert topics
- **8** localized article pages
- **16** indexable content routes
- **72** route/viewport browser checks
- **0** recorded critical findings in final defined audit
- **1** custom first-contact system
- **1** production domain with HTTPS

---

# 23. Claims policy

## Можно утверждать

- custom / bespoke;
- bilingual;
- 18 routes;
- four expert articles in two languages;
- responsive;
- production-ready;
- technical SEO;
- structured data;
- custom form;
- Turnstile;
- automated QA;
- Search Console configured;
- sitemap submitted;
- at least one URL confirmed indexed at the time of launch review;
- custom domain and HTTPS.

## Нельзя утверждать без дополнительного подтверждения

- HIPAA compliant;
- GDPR certified;
- WCAG certified;
- clinically validated;
- guaranteed Google ranking;
- top-ranked psychologist;
- conversion growth;
- lead growth;
- revenue growth;
- award-winning;
- number of years not confirmed by client;
- licenses not published by verified source;
- testimonials that do not exist;
- «best psychologist»;
- emergency support;
- 24/7 response.

---

# 24. Portfolio agent execution brief

## Target project

ProAI Expert portfolio.

## Known repository context

- Repository: `proaiexpert/proaiexpert.github.io`
- Working branch: `portfolio-rebrand-v1`
- Do not modify `main`.
- Do not publish production changes without explicit approval.
- Respect current canonical portfolio handoff files:
  - `docs/portfolio-case-packs/PORTFOLIO_REBRAND_CURRENT_HANDOFF.md`
  - `docs/portfolio-case-packs/PORTFOLIO_REBRAND_CONTROL_TRANSFER_2026-07-17.md`

## Required behavior

1. Read current portfolio handoff before implementation.
2. Treat this file as source-of-truth for the Alina Horb case.
3. Preserve the accepted ProAI Expert positioning: premium, restrained, strategic, service-business focused.
4. Do not start a broad redesign of the entire ProAI Expert site.
5. Add the case in a way consistent with the existing portfolio system.
6. Use only final production visuals.
7. Separate factual project results from market-value estimates.
8. Do not present the project as paid work unless explicitly confirmed.
9. Do not disclose private repository details in the public case.
10. Do not expose internal email, Turnstile keys, Formspree endpoint IDs or account information.
11. Do not claim business KPI that has not been measured.
12. Keep the case editorial, visual and outcome-focused.
13. Use technical detail as proof, not as the main story.
14. Create a concise mobile presentation as well as desktop.
15. Keep EN/RU portfolio parity if the portfolio case is localized.

---

# 25. Recommended page title and metadata for portfolio

## EN title

**Alina Horb — Bilingual Psychologist Website Case Study | ProAI Expert**

## EN description

**A bespoke Ukrainian and Russian psychologist website with editorial design, 18 routes, expert content, custom consultation flow, technical SEO and responsive QA.**

## RU title

**Сайт психолога Алины Горб — двуязычный кейс | ProAI Expert**

## RU description

**Индивидуальный сайт психолога на украинском и русском языках: 18 маршрутов, editorial-дизайн, экспертные статьи, форма консультации, техническое SEO и responsive QA.**

---

# 26. Recommended case-study headlines

## EN

- A calm digital space built for trust
- Beyond the therapist website template
- One practice, two languages, one coherent experience
- Turning expertise into an editorial content system
- A first-contact flow designed to reduce friction
- Production quality behind a quiet interface

## RU

- Спокойное цифровое пространство, построенное на доверии
- За пределами стандартного шаблона психолога
- Одна практика, два языка, единый пользовательский опыт
- Экспертность, превращённая в редакционную систему
- Первый контакт без лишнего барьера
- Production-качество за спокойным интерфейсом

---

# 27. Suggested case conclusion

## EN

**The final website gives Alina Horb a complete digital foundation: a recognizable personal brand, a clear consultation journey, a bilingual content system and a technically controlled production platform. It is designed not to pressure visitors, but to help them understand, trust and take the next step.**

## RU

**Финальный сайт даёт Алине Горб полноценную цифровую основу: узнаваемый персональный бренд, понятный путь к консультации, двуязычную контентную систему и технически контролируемую production-платформу. Он не давит на посетителя, а помогает понять специалиста, сформировать доверие и сделать следующий шаг.**

---

# 28. Источники рыночной оценки

Агент должен при необходимости перепроверить актуальные данные перед публичной публикацией.

- Clutch — *Web Design Company Pricing Guide 2026*: U.S. web design rate around $100–$149/hour; broad project range; most reviewed projects under $10K; larger average affected by complex projects.
- WebFX — *Web Design Pricing / Website Costs 2026*: professional web design commonly presented in the $1K–$30K+ range depending on scope.
- TherapySites official pricing: template/service packages from $69/month to $336/month; website design onboarding fee listed separately.
- Brighter Vision official pricing: therapist website plans around $99–$299/month, with annual billing variants and additional services.

---

# 29. Final internal assessment

## Design level

**Upper professional / boutique custom.**

## Technical level

**Strong static production build for a personal professional-services website.**

## Content level

**Substantially above a typical personal psychologist website because of the bilingual article system, consultation detail and ethical editorial approach.**

## Market differentiation

**High within the solo-practitioner segment.**

## Realistic U.S. replacement value

**$8,000–$15,000**, with a **$12,000–$20,000+** full-service agency equivalent depending on copywriting, project management, revisions and content production.

## Best portfolio angle

Не «мы сделали 18 HTML-страниц», а:

> **We transformed a personal psychology practice into a complete bilingual digital experience — from brand and editorial content to consultation intake, SEO and production QA.**

---

# 30. Final checklist for the portfolio agent

- [ ] Read canonical portfolio handoff.
- [ ] Use `portfolio-rebrand-v1`, not `main`.
- [ ] Open the live site and inspect current production.
- [ ] Collect only final screenshots.
- [ ] Build hero with one decisive visual.
- [ ] Show UA/RU pairing.
- [ ] Show architecture: 9 page types × 2 languages.
- [ ] Show Notes hub and articles.
- [ ] Show consultation journey.
- [ ] Show compact form and success state.
- [ ] Include the 72-check QA proof.
- [ ] Include technical SEO without overwhelming the presentation.
- [ ] Use only confirmed claims.
- [ ] Mark U.S. price as estimated replacement value.
- [ ] Avoid fake KPI.
- [ ] Avoid internal secrets and account details.
- [ ] Keep the case premium and restrained.
- [ ] Verify mobile layout.
- [ ] Preserve ProAI Expert’s accepted brand direction.
- [ ] Request approval before publishing.
