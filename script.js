(() => {
  /* ------------------------------------------------------------------------
     1. Glassmorphism Hamburger Drawer Navigation
     ------------------------------------------------------------------------ */
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navDrawer = document.getElementById("navDrawer");
  const navBackdrop = document.getElementById("navBackdrop");
  const navLinks = document.querySelectorAll(".nav-link");

  const toggleDrawer = (forceState) => {
    const isOpen =
      typeof forceState === "boolean"
        ? forceState
        : !navDrawer.classList.contains("open");

    navDrawer.classList.toggle("open", isOpen);
    navDrawer.setAttribute("aria-hidden", String(!isOpen));
    hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
    hamburgerBtn.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  hamburgerBtn.addEventListener("click", () => toggleDrawer());
  navBackdrop.addEventListener("click", () => toggleDrawer(false));

  navLinks.forEach((link) => {
    link.addEventListener("click", () => toggleDrawer(false));
  });

  /* ------------------------------------------------------------------------
     2. Graceful Fallback for Missing Local Images
     ------------------------------------------------------------------------ */
  const fallbackImages = document.querySelectorAll(".js-fallback-img");

  const showImageFallback = (img) => {
    img.style.display = "none";
    const fallbackBox = img.nextElementSibling;
    if (fallbackBox) {
      fallbackBox.classList.add("visible");
    }
  };

  fallbackImages.forEach((img) => {
    img.addEventListener("error", () => showImageFallback(img));
    if (img.complete && img.naturalWidth === 0) {
      showImageFallback(img);
    }
  });

  /* ------------------------------------------------------------------------
     3. Intersection Observer for Scroll-Reveal Animations
     ------------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ------------------------------------------------------------------------
     4. Media Gallery Lightbox Modal (Full-Resolution Widescreen PNG Viewer)
     ------------------------------------------------------------------------ */
  const mediaCards = Array.from(document.querySelectorAll(".media-card"));
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const lightboxClose = document.getElementById("lightboxClose");

  let currentIndex = 0;

  const showSlide = (index) => {
    currentIndex = (index + mediaCards.length) % mediaCards.length;
    const card = mediaCards[currentIndex];
    lightboxImg.src = card.dataset.src;
    lightboxImg.alt = card.dataset.title || "Gallery image";
    lightboxTitle.textContent = card.dataset.title || "MEDIA ARCHIVE";
  };

  const openLightbox = (index) => {
    showSlide(index);
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    if (!navDrawer.classList.contains("open")) {
      document.body.style.overflow = "";
    }
  };

  mediaCards.forEach((card, idx) => {
    card.addEventListener("click", () => openLightbox(idx));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  lightboxPrev.addEventListener("click", () => showSlide(currentIndex - 1));
  lightboxNext.addEventListener("click", () => showSlide(currentIndex + 1));
  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  /* Keyboard Accessibility for Drawer & Lightbox */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (lightbox.classList.contains("open")) closeLightbox();
      if (navDrawer.classList.contains("open")) toggleDrawer(false);
    } else if (lightbox.classList.contains("open")) {
      if (e.key === "ArrowLeft") showSlide(currentIndex - 1);
      if (e.key === "ArrowRight") showSlide(currentIndex + 1);
    }
  });
})();