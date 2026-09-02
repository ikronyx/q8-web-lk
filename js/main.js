(() => {
  "use strict";

  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const scrollProgress = document.querySelector("[data-scroll-progress]");
  const revealElements = document.querySelectorAll("[data-reveal]");
  const yearNode = document.querySelector("[data-current-year]");

  const COOKIE_STORAGE_KEY = "q8_privacy_preferences_v1";

  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  const updateProgress = () => {
    if (!scrollProgress) return;

    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = documentHeight > 0 ? window.scrollY / documentHeight : 0;
    scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
  };

  const onScroll = () => {
    updateHeader();
    updateProgress();
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  updateHeader();
  updateProgress();

  const closeMobileMenu = () => {
    if (!navToggle || !mobileMenu) return;

    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
    mobileMenu.classList.remove("is-open");
    header?.classList.remove("menu-visible");
    document.body.classList.remove("menu-open");
  };

  const openMobileMenu = () => {
    if (!navToggle || !mobileMenu) return;

    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close navigation menu");
    mobileMenu.classList.add("is-open");
    header?.classList.add("menu-visible");
    document.body.classList.add("menu-open");
  };

  navToggle?.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 980) {
      closeMobileMenu();
    }
  });

  // Reveal-on-scroll motion
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const delay = Number(entry.target.dataset.revealDelay || 0);
          entry.target.style.setProperty("--reveal-delay", `${delay}ms`);
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
      },
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  // Trading tabs
  const tradingTabs = document.querySelectorAll("[data-trading-tab]");
  const tradingPanels = document.querySelectorAll("[data-trading-panel]");

  tradingTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tradingTab;

      tradingTabs.forEach((candidate) => {
        const active = candidate === tab;
        candidate.classList.toggle("is-active", active);
        candidate.setAttribute("aria-selected", String(active));
      });

      tradingPanels.forEach((panel) => {
        const active = panel.dataset.tradingPanel === target;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
    });
  });

  // Privacy preferences
  const cookieBanner = document.querySelector("[data-cookie-banner]");
  const privacyModal = document.querySelector("[data-privacy-modal]");
  const analyticsConsent = document.querySelector("[data-consent-analytics]");
  const marketingConsent = document.querySelector("[data-consent-marketing]");
  const openSettingsButtons = document.querySelectorAll(
    "[data-cookie-manage], [data-open-cookie-settings]",
  );
  const closeSettingsButtons = document.querySelectorAll("[data-close-cookie-settings]");
  const acceptButtons = document.querySelectorAll("[data-cookie-accept]");
  const rejectButtons = document.querySelectorAll("[data-cookie-reject]");
  const saveButton = document.querySelector("[data-cookie-save]");

  let lastFocusedElement = null;

  const readPreferences = () => {
    try {
      return JSON.parse(localStorage.getItem(COOKIE_STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  };

  const applyPreferences = (preferences) => {
    /*
      Hook optional scripts here. For example:

      if (preferences.analytics) {
        loadAnalytics();
      }

      if (preferences.marketing) {
        loadMarketingPixels();
      }

      IMPORTANT:
      Keep optional analytics / marketing scripts disabled until consent is true.
    */
    document.documentElement.dataset.analyticsConsent = preferences.analytics ? "granted" : "denied";
    document.documentElement.dataset.marketingConsent = preferences.marketing ? "granted" : "denied";
  };

  const savePreferences = (preferences) => {
    const storedValue = {
      essential: true,
      analytics: Boolean(preferences.analytics),
      marketing: Boolean(preferences.marketing),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(storedValue));
    applyPreferences(storedValue);

    if (cookieBanner) cookieBanner.hidden = true;
    closePrivacyModal();
  };

  const openPrivacyModal = () => {
    if (!privacyModal) return;

    const currentPreferences = readPreferences();
    if (analyticsConsent) analyticsConsent.checked = Boolean(currentPreferences?.analytics);
    if (marketingConsent) marketingConsent.checked = Boolean(currentPreferences?.marketing);

    lastFocusedElement = document.activeElement;
    privacyModal.hidden = false;
    document.body.classList.add("modal-open");

    const dialog = privacyModal.querySelector(".privacy-modal__dialog");
    window.requestAnimationFrame(() => dialog?.focus());
  };

  function closePrivacyModal() {
    if (!privacyModal || privacyModal.hidden) return;

    privacyModal.hidden = true;
    document.body.classList.remove("modal-open");

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  }

  const storedPreferences = readPreferences();

  if (storedPreferences) {
    applyPreferences(storedPreferences);
  } else if (cookieBanner) {
    cookieBanner.hidden = false;
  }

  openSettingsButtons.forEach((button) => {
    button.addEventListener("click", openPrivacyModal);
  });

  closeSettingsButtons.forEach((button) => {
    button.addEventListener("click", closePrivacyModal);
  });

  acceptButtons.forEach((button) => {
    button.addEventListener("click", () => {
      savePreferences({ analytics: true, marketing: true });
    });
  });

  rejectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      savePreferences({ analytics: false, marketing: false });
    });
  });

  saveButton?.addEventListener("click", () => {
    savePreferences({
      analytics: Boolean(analyticsConsent?.checked),
      marketing: Boolean(marketingConsent?.checked),
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
      closePrivacyModal();
    }

    if (event.key !== "Tab" || !privacyModal || privacyModal.hidden) return;

    const dialog = privacyModal.querySelector(".privacy-modal__dialog");
    const focusable = dialog?.querySelectorAll(
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Pause hero video when it is far outside the viewport.
  const heroVideo = document.querySelector(".hero__media video");

  if (heroVideo && "IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          heroVideo.play().catch(() => {});
        } else {
          heroVideo.pause();
        }
      },
      { threshold: 0.08 },
    );

    videoObserver.observe(heroVideo);
  }
})();
