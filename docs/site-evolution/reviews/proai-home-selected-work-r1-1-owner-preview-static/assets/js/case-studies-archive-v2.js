(() => {
  "use strict";

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motionTargets = [
    ...document.querySelectorAll(
      "[data-proof-stage], [data-role-baseline], [data-case-proof], [data-case-copy]"
    )
  ];

  const showAll = () => {
    motionTargets.forEach((target) => target.classList.add("is-archive-visible"));
  };

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    root.classList.add("archive-motion-ready");
    const activeTimers = new Set();
    const queue = [];

    const release = (target) => {
      target.classList.add("is-archive-visible");
      const timer = window.setTimeout(() => {
        activeTimers.delete(timer);
        if (queue.length) release(queue.shift());
      }, 580);
      activeTimers.add(timer);
    };

    const schedule = (target) => {
      if (target.classList.contains("is-archive-visible") || queue.includes(target)) return;
      if (activeTimers.size < 2) release(target);
      else queue.push(target);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          schedule(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );

    motionTargets.forEach((target) => observer.observe(target));

    reducedMotion.addEventListener("change", (event) => {
      if (!event.matches) return;
      observer.disconnect();
      activeTimers.forEach((timer) => window.clearTimeout(timer));
      activeTimers.clear();
      queue.length = 0;
      root.classList.remove("archive-motion-ready");
      showAll();
    });
  }

  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const menu = document.getElementById("site-navigation");

  if (menuToggle && menu) {
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Tab" || !menu.classList.contains("is-open")) return;

      const menuLinks = [...menu.querySelectorAll("a[href]")].filter(
        (element) => !element.hasAttribute("disabled") && element.offsetParent !== null
      );
      if (!menuLinks.length) return;

      const first = menuLinks[0];
      const last = menuLinks[menuLinks.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === menuToggle) {
        event.preventDefault();
        last.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        menuToggle.focus();
      } else if (!event.shiftKey && active === menuToggle) {
        event.preventDefault();
        first.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        menuToggle.focus();
      } else if (![menuToggle, ...menuLinks].includes(active)) {
        event.preventDefault();
        (event.shiftKey ? last : menuToggle).focus();
      }
    });
  }
})();
