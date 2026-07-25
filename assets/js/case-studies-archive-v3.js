(() => {
  "use strict";

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const worldStage = document.querySelector("[data-world-stage]");
  const worlds = worldStage ? [...worldStage.querySelectorAll("[data-world]")] : [];
  const roleLinks = [...document.querySelectorAll("[data-role-link]")];
  const territories = [...document.querySelectorAll("[data-territory]")];
  const motionTargets = [
    ...document.querySelectorAll(
      "[data-atlas-enter], [data-proof-lock], [data-trust-axis], [data-portfolio-closure]"
    )
  ];

  const setWorldFocus = (worldName = "financial") => {
    if (worldStage) worldStage.dataset.worldFocus = worldName;
  };

  worlds.forEach((world) => {
    const worldName = world.dataset.world;
    world.addEventListener("pointerenter", () => setWorldFocus(worldName));
    world.addEventListener("focus", () => setWorldFocus(worldName));
  });

  if (worldStage) {
    worldStage.addEventListener("pointerleave", () => setWorldFocus("financial"));
    worldStage.addEventListener("focusout", (event) => {
      if (!worldStage.contains(event.relatedTarget)) setWorldFocus("financial");
    });
  }

  const setActiveRole = (worldName) => {
    roleLinks.forEach((link) => {
      if (link.dataset.roleLink === worldName) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  if ("IntersectionObserver" in window && territories.length) {
    const territoryObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveRole(visible[0].target.dataset.territory);
      },
      { rootMargin: "-18% 0px -58% 0px", threshold: [0, 0.08, 0.2] }
    );
    territories.forEach((territory) => territoryObserver.observe(territory));
  }

  const revealAll = () => {
    motionTargets.forEach((target) => {
      target.classList.add(
        target.hasAttribute("data-proof-lock") ? "is-proof-locked" : "is-registered"
      );
    });
  };

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealAll();
  } else {
    root.classList.add("archive-v3-motion-ready");
    const activeTimers = new Set();
    const queue = [];

    const release = (target) => {
      target.classList.add(
        target.hasAttribute("data-proof-lock") ? "is-proof-locked" : "is-registered"
      );
      const timer = window.setTimeout(() => {
        activeTimers.delete(timer);
        if (queue.length) release(queue.shift());
      }, 540);
      activeTimers.add(timer);
    };

    const schedule = (target) => {
      if (
        target.classList.contains("is-proof-locked") ||
        target.classList.contains("is-registered") ||
        queue.includes(target)
      ) return;
      if (activeTimers.size < 2) release(target);
      else queue.push(target);
    };

    const motionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          schedule(entry.target);
          motionObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    motionTargets.forEach((target) => motionObserver.observe(target));

    reducedMotion.addEventListener("change", (event) => {
      if (!event.matches) return;
      motionObserver.disconnect();
      activeTimers.forEach((timer) => window.clearTimeout(timer));
      activeTimers.clear();
      queue.length = 0;
      root.classList.remove("archive-v3-motion-ready");
      revealAll();
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
