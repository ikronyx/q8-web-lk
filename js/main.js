document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".site-loader");
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".scroll-progress");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");
  const revealItems = document.querySelectorAll(".reveal");
  const tabs = document.querySelectorAll(".trade-tab");
  const panels = document.querySelectorAll(".trade-panel");
  const cursorGlow = document.querySelector(".cursor-glow");
  const year = document.querySelector("#year");

  window.addEventListener("load", () => {
    setTimeout(() => loader?.classList.add("is-hidden"), 450);
  });

  year.textContent = new Date().getFullYear();

  const updateScrollUI = () => {
    const scrollTop = window.scrollY;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    progress.style.width = `${percentage}%`;
    header.classList.toggle("scrolled", scrollTop > 30);
  };

  updateScrollUI();
  window.addEventListener("scroll", updateScrollUI, { passive: true });

  navToggle?.addEventListener("click", () => {
    const open = navToggle.classList.toggle("open");
    nav.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle?.classList.remove("open");
      nav?.classList.remove("open");
      document.body.classList.remove("menu-open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });

      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === target);
      });

      // Re-observe newly displayed content.
      document
        .querySelectorAll(`#${target} .reveal`)
        .forEach((item) => observer.observe(item));
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
    observer.observe(item);
  });

  // Premium cursor light on desktop.
  if (window.matchMedia("(pointer:fine)").matches && cursorGlow) {
    window.addEventListener("pointermove", (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    });
  }

  // Gentle pointer parallax for the hero orbital system.
  const hero = document.querySelector(".hero");
  const visual = document.querySelector(".hero-visual");

  if (hero && visual && window.matchMedia("(pointer:fine)").matches) {
    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      visual.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
    });

    hero.addEventListener("pointerleave", () => {
      visual.style.transform = "translate(0,0)";
    });
  }

  // Active navigation based on section visibility.
  const sections = [...document.querySelectorAll("main section[id]")];
  const navMap = new Map(
    [...document.querySelectorAll('.main-nav a[href^="#"]')].map((link) => [
      link.getAttribute("href").slice(1),
      link,
    ]),
  );

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navMap.forEach((link) => link.classList.remove("active"));
          navMap.get(entry.target.id)?.classList.add("active");
        }
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
  );

  sections.forEach((section) => sectionObserver.observe(section));
});
