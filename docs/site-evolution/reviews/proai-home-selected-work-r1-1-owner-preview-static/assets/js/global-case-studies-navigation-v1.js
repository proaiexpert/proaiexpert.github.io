(() => {
  "use strict";

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
