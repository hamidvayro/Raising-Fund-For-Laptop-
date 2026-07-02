/* =========================================================
   HAMID FUND — script.js
   Modules are namespaced as they're built.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();

  initPreloader();
  initTheme();
  initScrollProgress();
  initNavbarScrollState();
  initMobileMenu();
  initActiveLinkOnScroll();
  initHeroAnimations();
  initProgressRing();
  initAOS();
  initStoryReadMore();
  initWalletCopy();
  initTestimonialSlider();
  initFaqAccordion();
  initFooterYear();
  initBackToTop();
  initMouseGlow();
  initParticles();
});

/* ---------- Preloader ---------- */
function initPreloader() {
  const pre = document.getElementById("preloader");
  if (!pre) return;
  window.addEventListener("load", () => {
    setTimeout(() => pre.classList.add("hidden"), 400);
  });
  // Fallback in case load event already fired
  setTimeout(() => pre.classList.add("hidden"), 2500);
}

/* ---------- Mouse glow (desktop only) ---------- */
function initMouseGlow() {
  const glow = document.getElementById("mouseGlow");
  if (!glow || window.matchMedia("(hover: none)").matches) return;

  let active = false;
  window.addEventListener("mousemove", (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    if (!active) {
      glow.classList.add("active");
      active = true;
    }
  });
  window.addEventListener("mouseleave", () => glow.classList.remove("active"));
}

/* ---------- Floating particles (hero) ---------- */
function initParticles() {
  const wrap = document.getElementById("particles");
  if (!wrap) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = 8 + Math.random() * 10 + "s";
    p.style.animationDelay = Math.random() * 10 + "s";
    p.style.width = p.style.height = 2 + Math.random() * 3 + "px";
    wrap.appendChild(p);
  }
}

/* ---------- Theme (dark/light) ---------- */
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");

  let saved = null;
  try { saved = localStorage.getItem("hamidfund-theme"); } catch (e) {}

  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  const initial = saved || (prefersLight ? "light" : "dark");
  root.setAttribute("data-theme", initial);

  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("hamidfund-theme", next); } catch (e) {}
  });
}

/* ---------- Scroll progress bar ---------- */
function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + "%";
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ---------- Navbar background state on scroll ---------- */
function initNavbarScrollState() {
  const navbar = document.getElementById("navbar");
  const update = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  menu.querySelectorAll(".mobile-link, .mobile-donate").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      hamburger.classList.remove("open");
    });
  });
}

/* =========================================================
   HERO SECTION MODULE
   ========================================================= */

/* ---------- Entrance animation for hero elements ---------- */
function initHeroAnimations() {
  const items = document.querySelectorAll("[data-hero-anim]");
  if (!items.length) return;

  if (window.gsap) {
    gsap.set(items, { opacity: 0, y: 22 });
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1,
      delay: 0.15,
    });
  } else {
    items.forEach((el) => (el.style.opacity = 1));
  }
}

/* ---------- Fundraising progress ring + counter ---------- */
function initProgressRing() {
  const ring = document.getElementById("ringFill");
  const label = document.getElementById("ringLabel");
  const barFill = document.getElementById("progressBarFill");
  const raisedCount = document.getElementById("raisedCount");
  if (!ring) return;

  const raised = 16800;
  const goal = 80000;
  const percent = Math.round((raised / goal) * 100);
  const circumference = 2 * Math.PI * 54; // r=54

  const animate = () => {
    const offset = circumference - (percent / 100) * circumference;
    ring.style.strokeDashoffset = offset;
    barFill.style.width = percent + "%";

    if (window.gsap) {
      const counter = { val: 0 };
      gsap.to(counter, {
        val: percent,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => (label.textContent = Math.round(counter.val) + "%"),
      });
      const money = { val: 0 };
      gsap.to(money, {
        val: raised,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => (raisedCount.textContent = Math.round(money.val).toLocaleString()),
      });
    } else {
      label.textContent = percent + "%";
      raisedCount.textContent = raised.toLocaleString();
    }
  };

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: "#home",
      start: "top 70%",
      once: true,
      onEnter: animate,
    });
  } else {
    animate();
  }
}

/* =========================================================
   STORY MODULE
   ========================================================= */

/* ---------- AOS init ---------- */
function initAOS() {
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
    });
  }
}

/* ---------- Read More / Read Less toggle ---------- */
function initStoryReadMore() {
  const btn = document.getElementById("readMoreBtn");
  const panel = document.getElementById("storyFull");
  if (!btn || !panel) return;

  btn.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("open");
    btn.classList.toggle("open", isOpen);
    btn.querySelector("span").textContent = isOpen ? "Show Less" : "Read My Full Story";

    if (isOpen && window.AOS) {
      setTimeout(() => AOS.refresh(), 650);
    }
  });
}

/* =========================================================
   SUPPORT / DONATE MODULE
   ========================================================= */

/* ---------- Copy wallet address + confetti ---------- */
function initWalletCopy() {
  const btn = document.getElementById("copyAddressBtn");
  const addressEl = document.getElementById("walletAddress");
  if (!btn || !addressEl) return;

  btn.addEventListener("click", async () => {
    const address = addressEl.textContent.trim();

    try {
      await navigator.clipboard.writeText(address);
    } catch (e) {
      const range = document.createRange();
      range.selectNode(addressEl);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand("copy");
      window.getSelection().removeAllRanges();
    }

    const label = btn.querySelector("span");
    const originalText = label.textContent;
    btn.classList.add("copied");
    label.textContent = "Copied!";

    if (window.confetti) {
      const rect = btn.getBoundingClientRect();
      confetti({
        particleCount: 60,
        spread: 65,
        startVelocity: 32,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: ["#f97316", "#6d28d9", "#0ea5e9", "#fbbf24"],
      });
    }

    setTimeout(() => {
      btn.classList.remove("copied");
      label.textContent = originalText;
    }, 2200);
  });
}

/* =========================================================
   TRUST & TRANSPARENCY MODULE
   ========================================================= */

/* ---------- Testimonial slider ---------- */
function initTestimonialSlider() {
  const track = document.getElementById("testimonialTrack");
  const dotsWrap = document.getElementById("testimonialDots");
  if (!track || !dotsWrap) return;

  const slides = track.children;
  const count = slides.length;
  let index = 0;
  let timer = null;

  for (let i = 0; i < count; i++) {
    const dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  }
  const dots = dotsWrap.querySelectorAll(".dot");

  function goTo(i) {
    index = i;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle("active", di === index));
  }

  function next() {
    goTo((index + 1) % count);
  }

  function startAutoplay() {
    timer = setInterval(next, 4500);
  }
  function stopAutoplay() {
    clearInterval(timer);
  }

  startAutoplay();
  track.closest(".testimonial-slider").addEventListener("mouseenter", stopAutoplay);
  track.closest(".testimonial-slider").addEventListener("mouseleave", startAutoplay);
}

/* =========================================================
   FAQ MODULE
   ========================================================= */

/* ---------- Accordion (one open at a time) ---------- */
function initFaqAccordion() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      items.forEach((i) => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });
}

/* =========================================================
   FOOTER MODULE
   ========================================================= */

/* ---------- Auto-fill current year ---------- */
function initFooterYear() {
  const el = document.getElementById("footerYear");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Back to top button ---------- */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  const update = () => btn.classList.toggle("visible", window.scrollY > 500);
  window.addEventListener("scroll", update, { passive: true });
  update();

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Highlight active nav link based on section in view ---------- */
function initActiveLinkOnScroll() {
  const links = document.querySelectorAll(".nav-link");
  const sections = Array.from(links)
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = "#" + entry.target.id;
          links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === id));
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );

  sections.forEach((s) => observer.observe(s));
}
