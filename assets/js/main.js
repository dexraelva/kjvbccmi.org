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
  const header = document.querySelector(".navbar");

  const homepagePath = siteBase ? `${siteBase}/` : "/";
  const isHomepage =
    window.location.pathname === homepagePath ||
    window.location.pathname === `${homepagePath}index.html`;

  if (header && !isHomepage && !document.querySelector(".page-navigation")) {
    const pageNavigation = document.createElement("div");
    pageNavigation.className = "page-navigation";
    pageNavigation.innerHTML = `
      <div class="container page-navigation-inner">
        <button class="page-nav-link page-nav-back" type="button" aria-label="Go back">
          <span aria-hidden="true">←</span> Back
        </button>
        <a class="page-nav-link" href="/" aria-label="Go to homepage">
          <span aria-hidden="true">⌂</span> Home
        </a>
      </div>
    `;
    header.insertAdjacentElement("afterend", pageNavigation);

    pageNavigation.querySelector(".page-nav-back").addEventListener("click", () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "/";
      }
    });
  }

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

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
