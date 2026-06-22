document.addEventListener("DOMContentLoaded", () => {
  const siteBase = window.location.hostname.endsWith("github.io") ? "/kjvbccmi.org" : "";

  if (siteBase) {
    document.querySelectorAll('a[href^="/"]').forEach((link) => {
      link.href = `${siteBase}${link.getAttribute("href")}`;
    });

    document.querySelectorAll('img[src^="/assets/"]').forEach((image) => {
      image.src = `${siteBase}${image.getAttribute("src")}`;
    });
  }

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".nav-links");
  const backToTop = document.querySelector(".back-to-top");

  const homepagePath = siteBase ? `${siteBase}/` : "/";
  const isHomepage =
    window.location.pathname === homepagePath ||
    window.location.pathname === `${homepagePath}index.html`;

  if (!isHomepage) {
    const routeLabels = {
      about: "About Us",
      blog: "Blog",
      churches: "Churches",
      contact: "Contact",
      donate: "Donate Now",
      events: "Events",
      ministries: "Ministries",
    };
    const currentPath = window.location.pathname
      .replace(siteBase, "")
      .replace(/\/index\.html$/, "/");
    const routeParts = currentPath.split("/").filter(Boolean);
    let breadcrumb = document.querySelector(".breadcrumb");

    if (!breadcrumb) {
      const articleHeader = document.querySelector(".article-header");
      if (articleHeader) {
        breadcrumb = document.createElement("nav");
        breadcrumb.className = "breadcrumb article-breadcrumb";
        articleHeader.insertAdjacentElement("beforebegin", breadcrumb);
      }
    }

    if (breadcrumb) {
      const existingLabels = breadcrumb.textContent
        .split("/")
        .map((label) => label.trim())
        .filter(Boolean);
      const labels = existingLabels.length > 1
        ? existingLabels
        : ["Home", ...routeParts.map((part) =>
            routeLabels[part] ||
            part.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
          )];
      const pageHeading = document.querySelector("h1");

      if (existingLabels.length <= 1 && pageHeading && labels.length > 1) {
        labels[labels.length - 1] = pageHeading.textContent.trim();
      }

      breadcrumb.setAttribute("aria-label", "Breadcrumb");
      breadcrumb.textContent = "";

      labels.forEach((label, index) => {
        if (index > 0) {
          const separator = document.createElement("span");
          separator.className = "breadcrumb-separator";
          separator.setAttribute("aria-hidden", "true");
          separator.textContent = "/";
          breadcrumb.appendChild(separator);
        }

        if (index === labels.length - 1) {
          const current = document.createElement("span");
          current.setAttribute("aria-current", "page");
          current.textContent = label;
          breadcrumb.appendChild(current);
          return;
        }

        const link = document.createElement("a");
        const targetParts = routeParts.slice(0, index);
        link.href = index === 0
          ? homepagePath
          : `${siteBase}/${targetParts.join("/")}/`;
        link.textContent = label;
        breadcrumb.appendChild(link);
      });
    }
  }

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const featuredModal = document.querySelector("[data-featured-modal]");

  if (featuredModal) {
    const modalDialog = featuredModal.querySelector('[role="dialog"]');
    const closeButtons = featuredModal.querySelectorAll("[data-modal-close]");
    let previousFocus = null;

    const closeFeaturedModal = () => {
      featuredModal.hidden = true;
      document.body.classList.remove("modal-open");
      previousFocus?.focus();
    };

    const openFeaturedModal = () => {
      previousFocus = document.activeElement;
      featuredModal.hidden = false;
      document.body.classList.add("modal-open");
      featuredModal.querySelector(".featured-modal-close")?.focus();
    };

    closeButtons.forEach((button) => {
      button.addEventListener("click", closeFeaturedModal);
    });

    featuredModal.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeFeaturedModal();
        return;
      }

      if (event.key !== "Tab" || !modalDialog) return;
      const focusable = modalDialog.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
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

    window.setTimeout(openFeaturedModal, 700);
  }

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    navigation.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
    menuButton.textContent = "☰";
  };

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");
      document.body.classList.toggle("menu-open", isOpen);
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      menuButton.textContent = isOpen ? "×" : "☰";
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) closeMenu();
    });
  }

  if (backToTop) {
    const updateBackToTop = () => {
      backToTop.classList.toggle("visible", window.scrollY > 500);
    };

    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.querySelectorAll("[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const message = form.querySelector(".form-message");
      if (message) {
        message.textContent = "Thank you! Your message has been received.";
        message.style.display = "block";
      }

      form.reset();
    });
  });

  const churchMap = document.querySelector("[data-church-map]");
  const mapExternalLink = document.querySelector("[data-map-external]");

  document.querySelectorAll("[data-map-location]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!churchMap) return;

      const coordinates = button.dataset.mapLocation;
      const title = button.dataset.mapTitle;
      const mapUrl = `https://www.google.com/maps?q=${coordinates}`;

      churchMap.src = `${mapUrl}&z=15&output=embed`;
      churchMap.title = title;

      if (mapExternalLink) {
        mapExternalLink.href = mapUrl;
      }

      document.querySelectorAll("[data-map-location]").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
    });
  });

  document.querySelectorAll("[data-facebook-placeholder]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });

  document.querySelectorAll("[data-slider]").forEach((slider) => {
    const track = slider.querySelector(".ministry-slides");
    const slides = [...slider.querySelectorAll(".ministry-slide")];
    const dots = [...slider.querySelectorAll(".slider-dot")];
    const previous = slider.querySelector(".slider-prev");
    const next = slider.querySelector(".slider-next");
    let currentSlide = 0;

    const showSlide = (index) => {
      currentSlide = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === currentSlide);
        dot.setAttribute("aria-current", dotIndex === currentSlide ? "true" : "false");
      });
    };

    previous?.addEventListener("click", () => showSlide(currentSlide - 1));
    next?.addEventListener("click", () => showSlide(currentSlide + 1));
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => showSlide(index));
    });

    showSlide(0);
  });
});
