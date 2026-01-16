/* script.js — ASTANA JAS Football School */
(function () {
  "use strict";

  // =========================
  // Mobile menu
  // =========================
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const header = document.querySelector(".header");

  function setMenu(open) {
    if (!burgerBtn || !mobileMenu) return;

    burgerBtn.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden", String(!open));

    // lock page scroll when menu is open
    document.body.style.overflow = open ? "hidden" : "";
    burgerBtn.classList.toggle("is-open", open);
  }

  // Toggle on burger click
  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener("click", () => {
      const isOpen = burgerBtn.getAttribute("aria-expanded") === "true";
      setMenu(!isOpen);
    });

    // Close menu when user clicks a link inside it
    mobileMenu.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) setMenu(false);
    });

    // Close menu on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });

    // Close menu on resize to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) setMenu(false);
    });
  }

  // =========================
  // Smooth scroll with header offset
  // =========================
  const navLinks = document.querySelectorAll('a[href^="#"]');

  function getHeaderOffset() {
    const h = header ? header.getBoundingClientRect().height : 0;
    return h + 10;
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#" || href.length < 2) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // Close menu if open (mobile)
      setMenu(false);

      const top = target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  // =========================
  // Phone mask (Kazakhstan) +7 (___) ___-__-__
  // =========================
  function formatKZPhone(value) {
    const digits = String(value || "").replace(/\D/g, "");

    // normalize: if starts with 8 -> 7, if not starts with 7 -> prepend 7
    let d = digits;
    if (d.startsWith("8")) d = "7" + d.slice(1);
    if (!d.startsWith("7")) d = "7" + d;

    // 11 digits max (7 + 10 digits)
    d = d.slice(0, 11);

    const a = d.slice(1, 4);
    const b = d.slice(4, 7);
    const c = d.slice(7, 9);
    const e = d.slice(9, 11);

    let out = "+7";
    if (a) out += ` (${a}`;
    if (a && a.length === 3) out += ")";
    if (b) out += ` ${b}`;
    if (c) out += `-${c}`;
    if (e) out += `-${e}`;
    return out;
  }

  function attachPhoneMask(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const phone = form.querySelector('input[name="phone"]');
    if (!phone) return;

    phone.addEventListener("input", () => {
      phone.value = formatKZPhone(phone.value);
    });

    // optional: format initial value if any
    if (phone.value) phone.value = formatKZPhone(phone.value);
  }

  attachPhoneMask("miniForm");
  attachPhoneMask("leadForm");

  // =========================
  // Demo submit (GitHub Pages static)
  // =========================
  function handleForm(formId, successId) {
    const form = document.getElementById(formId);
    const success = document.getElementById(successId);
    if (!form || !success) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const phone = String(fd.get("phone") || "").trim();
      const phoneDigits = phone.replace(/\D/g, "");

      if (name.length < 2) {
        success.textContent = "Укажите имя (минимум 2 символа).";
        return;
      }

      // +7 + 10 digits = 11 digits total
      if (phoneDigits.length < 11) {
        success.textContent = "Укажите корректный телефон (+7 ...).";
        return;
      }

      // Success UI
      success.textContent = "Заявка принята. Мы свяжемся с вами в ближайшее время.";
      form.reset();

      // Clear after 7 seconds
      setTimeout(() => {
        success.textContent = "";
      }, 7000);
    });
  }

  handleForm("miniForm", "miniSuccess");
  handleForm("leadForm", "leadSuccess");

  // =========================
  // Map (Leaflet) — works without API keys
  // =========================
  const mapEl = document.getElementById("map");
  if (mapEl && typeof window.L !== "undefined") {
    // Astana center (base)
    const astanaCenter = [51.1282, 71.4304];

    const map = L.map("map", {
      scrollWheelZoom: false,
      zoomControl: true
    }).setView(astanaCenter, 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap"
    }).addTo(map);

    // IMPORTANT:
    // These coordinates are placeholders (rough points in Astana).
    // Replace coords with exact locations when you have them.
    const loc11 = {
      name: "Школа-лицей №11 им. Ө. Жәнібеков",
      coords: [51.1600, 71.4700]
    };

    const loc71 = {
      name: "Школа-лицей №71",
      coords: [51.1050, 71.3900]
    };

    const icon = L.divIcon({
      className: "custom-pin",
      html: `
        <div style="
          width:38px;height:38px;border-radius:14px;
          background:#ffd400;border:1px solid rgba(15,17,21,.25);
          display:grid;place-items:center;font-weight:1000;
          box-shadow:0 12px 26px rgba(0,0,0,.18);
        ">⚽</div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38]
    });

    const m1 = L.marker(loc11.coords, { icon })
      .addTo(map)
      .bindPopup(`<strong>${loc11.name}</strong><br/>ASTANA JAS Football School`);

    const m2 = L.marker(loc71.coords, { icon })
      .addTo(map)
      .bindPopup(`<strong>${loc71.name}</strong><br/>ASTANA JAS Football School`);

    const group = L.featureGroup([m1, m2]);
    map.fitBounds(group.getBounds().pad(0.25));

    // enable scroll zoom only after click (UX)
    map.on("click", () => map.scrollWheelZoom.enable());
    map.on("mouseout", () => map.scrollWheelZoom.disable());
  }
})();
