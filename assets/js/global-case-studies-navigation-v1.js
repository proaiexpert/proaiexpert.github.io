(() => {
  "use strict";

  const isRu = (document.documentElement.lang || document.body.lang || "").toLowerCase().startsWith("ru") || document.body.classList.contains("lang-ru");
  const project = isRu ? {
    name: "Алина Горб",
    primary: "Сайт психологической практики",
    short: "Психологическая практика",
    secondary: "Алина Горб · HUMAN / EDITORIAL",
    eyebrow: "САЙТ ПСИХОЛОГИЧЕСКОЙ ПРАКТИКИ · АЛИНА ГОРБ",
    lead: "Стратегия, дизайн и контент для двуязычного сайта психологической практики — созданного для Алины Горб и её аудитории.",
    explore: "Смотреть сайт психологической практики",
    title: "Кейс сайта психологической практики — Алина Горб | ProAI Expert"
  } : {
    name: "Alina Horb",
    primary: "Psychology Practice Website",
    short: "Psychology Practice",
    secondary: "Alina Horb · Human / Editorial",
    eyebrow: "PSYCHOLOGY PRACTICE WEBSITE · ALINA HORB",
    lead: "Strategy, design and content for a bilingual psychology-practice website — built for Alina Horb and her audience.",
    explore: "Explore Psychology Practice Website",
    title: "Psychology Practice Website Case — Alina Horb | ProAI Expert"
  };

  const setText = (selector, value, root = document) => {
    const node = root.querySelector(selector);
    if (node) node.textContent = value;
  };

  const applyPsychologyPracticePositioning = () => {
    document.querySelectorAll(".portfolio-entry-project--alina").forEach((item) => {
      const anchor = item.querySelector("a");
      if (!anchor) return;
      let label = anchor.querySelector("span");
      if (!label) {
        label = document.createElement("span");
        anchor.prepend(label);
      }
      label.textContent = project.primary;
      let secondary = anchor.querySelector("small");
      if (!secondary) {
        secondary = document.createElement("small");
        anchor.appendChild(secondary);
      }
      secondary.textContent = project.secondary;
    });

    document.querySelectorAll(".atlas-world--alina").forEach((world) => {
      setText(".atlas-world__label strong", project.short, world);
      setText(".atlas-world__label small", project.secondary, world);
    });

    document.querySelectorAll('[data-role-link="alina"]').forEach((link) => {
      setText("strong", project.short, link);
      setText("small", project.secondary, link);
    });

    document.querySelectorAll(".atlas-territory--alina").forEach((territory) => {
      setText("h2", project.primary, territory);
      setText(".atlas-role", project.secondary, territory);
      const caseLink = territory.querySelector(".atlas-case-link");
      if (caseLink) caseLink.innerHTML = `${project.explore} <span aria-hidden="true">→</span>`;
    });

    document.querySelectorAll('[data-project="alina"] strong').forEach((label) => {
      label.textContent = project.short;
    });

    const caseLinks = document.querySelectorAll('a[href="/case-studies/alina-horb/"], a[href="/ru/case-studies/alina-horb/"]');
    caseLinks.forEach((link) => {
      if (link.closest(".portfolio-entry-project--alina, .atlas-world--alina, [data-role-link=\"alina\"], .atlas-territory--alina")) return;
      const candidates = [link, ...link.querySelectorAll("strong, span, h3")];
      candidates.forEach((node) => {
        if (node.children.length) return;
        const text = node.textContent.trim();
        if (text === project.name || text === "Alina Horb" || text === "Алина Горб") node.textContent = project.short;
      });
    });

    const casePage = document.querySelector(".ahv3-case");
    if (casePage && /\/case-studies\/alina-horb\//.test(window.location.pathname)) {
      setText(".ahv3-hero .ahv3-eyebrow", project.eyebrow, casePage);
      setText(".ahv3-hero .ahv3-lead", project.lead, casePage);
      document.title = project.title;
      document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach((meta) => meta.setAttribute("content", project.title.replace(" | ProAI Expert", "")));
    }
  };

  applyPsychologyPracticePositioning();

  const toggle = document.querySelector(".mobile-menu-toggle");
  const navigation = document.querySelector(".site-nav");
  const actions = document.querySelector(".header-actions");

  if (!toggle || !navigation || !actions) return;

  const isOpen = () =>
    toggle.getAttribute("aria-expanded") === "true" ||
    navigation.classList.contains("is-open");

  const getFocusables = () =>
    [
      ...navigation.querySelectorAll("a[href]"),
      ...actions.querySelectorAll("a[href], button:not([disabled])")
    ].filter((element) => element.offsetParent !== null);

  toggle.addEventListener("click", () => {
    window.setTimeout(() => {
      if (!isOpen()) return;
      const firstLink = navigation.querySelector("a[href]");
      if (firstLink) firstLink.focus();
    }, 0);
  });

  document.addEventListener("keydown", (event) => {
    if (!isOpen()) return;

    if (event.key === "Escape" || event.key === "Esc" || event.keyCode === 27) {
      window.setTimeout(() => toggle.focus(), 0);
      return;
    }

    if (event.key !== "Tab") return;

    const focusables = getFocusables();
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !focusables.includes(active))) {
      event.preventDefault();
      event.stopImmediatePropagation();
      last.focus();
    } else if (!event.shiftKey && (active === last || !focusables.includes(active))) {
      event.preventDefault();
      event.stopImmediatePropagation();
      first.focus();
    }
  }, true);
})();
